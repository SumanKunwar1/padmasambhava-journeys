// src/pages/AgentSignup.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios";
import {
  Briefcase, User, Building2, Mail, Phone, MapPin, Globe,
  CheckCircle2, ArrowRight, Shield, Users, TrendingUp, Loader2, Lock, Eye, EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function AgentSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "", companyName: "", email: "", phone: "",
    city: "", state: "", website: "", experience: "",
    password: "", confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.companyName || !formData.email ||
        !formData.phone || !formData.city || !formData.state || !formData.experience) {
      toast.error("Please fill all required fields", { position: "top-right" });
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters", { position: "top-right" });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", { position: "top-right" });
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post("/agents/apply", {
        fullName: formData.fullName,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        website: formData.website || undefined,
        experience: formData.experience,
        password: formData.password,
      });
      setSubmittedEmail(formData.email);
      setSubmitted(true);
      toast.success("Application submitted! We'll review and contact you within 2-3 business days.", {
        position: "top-right", autoClose: 5000,
      });
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to submit. Please try again.";
      toast.error(msg, { position: "top-right", autoClose: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { icon: <TrendingUp className="w-6 h-6" />, title: "High Commission Rates", description: "Earn up to 15% on every booking" },
    { icon: <Users className="w-6 h-6" />, title: "Dedicated Support", description: "24/7 partner assistance team" },
    { icon: <Shield className="w-6 h-6" />, title: "Trusted Platform", description: "100+ verified travel packages" },
  ];

  // ── Success Screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Application Submitted!</h2>
          <p className="text-muted-foreground mb-2">
            Thank you for applying. Our team will review your application and reach out to{" "}
            <strong>{submittedEmail}</strong> within <strong>2–3 business days</strong>.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Once approved, you can sign in using your email and the password you just set.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate("/agent/login")} className="w-full">Go to Agent Login</Button>
            <Button variant="outline" onClick={() => navigate("/")} className="w-full">Back to Home</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4" /><span>Partner Program</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Become Our Travel Partner
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join India's most trusted DMC and unlock exclusive benefits, premium packages, and dedicated support.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">

            {/* Left: Benefits */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />Why Partner With Us?
                </h2>
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-4">How It Works</h3>
                <ol className="space-y-3">
                  {[
                    "Submit your application below",
                    "Our team reviews within 2–3 days",
                    "Get approved & login instantly",
                    "Start booking & earning commissions!",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200">
                <h2 className="text-2xl font-bold text-foreground mb-2">Partner Application</h2>
                <p className="text-muted-foreground mb-6 text-sm">
                  Fill in your details and create a password. Your account will be activated once approved by our team.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Full Name + Company */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />Full Name *
                      </Label>
                      <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange}
                        onFocus={() => setFocusedField("fullName")} onBlur={() => setFocusedField(null)}
                        placeholder="John Doe"
                        className={cn("h-12", focusedField === "fullName" && "ring-2 ring-primary/20 border-primary")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-sm font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />Company / Agency Name *
                      </Label>
                      <Input id="companyName" name="companyName" required value={formData.companyName} onChange={handleChange}
                        onFocus={() => setFocusedField("companyName")} onBlur={() => setFocusedField(null)}
                        placeholder="Travel Co. Pvt. Ltd."
                        className={cn("h-12", focusedField === "companyName" && "ring-2 ring-primary/20 border-primary")} />
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />Business Email *
                      </Label>
                      <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                        onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                        placeholder="you@company.com"
                        className={cn("h-12", focusedField === "email" && "ring-2 ring-primary/20 border-primary")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />Phone Number *
                      </Label>
                      <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange}
                        onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)}
                        placeholder="+91 98765 43210"
                        className={cn("h-12", focusedField === "phone" && "ring-2 ring-primary/20 border-primary")} />
                    </div>
                  </div>

                  {/* City + State */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />City *
                      </Label>
                      <Input id="city" name="city" required value={formData.city} onChange={handleChange}
                        onFocus={() => setFocusedField("city")} onBlur={() => setFocusedField(null)}
                        placeholder="Your city"
                        className={cn("h-12", focusedField === "city" && "ring-2 ring-primary/20 border-primary")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">State / Province *</Label>
                      <Input id="state" name="state" required value={formData.state} onChange={handleChange}
                        onFocus={() => setFocusedField("state")} onBlur={() => setFocusedField(null)}
                        placeholder="Your state"
                        className={cn("h-12", focusedField === "state" && "ring-2 ring-primary/20 border-primary")} />
                    </div>
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />Website <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <Input id="website" name="website" type="url" value={formData.website} onChange={handleChange}
                      onFocus={() => setFocusedField("website")} onBlur={() => setFocusedField(null)}
                      placeholder="https://yourwebsite.com"
                      className={cn("h-12", focusedField === "website" && "ring-2 ring-primary/20 border-primary")} />
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />Years of Experience *
                    </Label>
                    <select id="experience" name="experience" required value={formData.experience} onChange={handleChange}
                      onFocus={() => setFocusedField("experience")} onBlur={() => setFocusedField(null)}
                      className={cn(
                        "flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        focusedField === "experience" && "ring-2 ring-primary/20 border-primary"
                      )}>
                      <option value="">Select experience</option>
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-3">1–3 years</option>
                      <option value="3-5">3–5 years</option>
                      <option value="5-10">5–10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-muted-foreground font-medium">Create Your Password</span>
                    </div>
                  </div>

                  {/* Password + Confirm Password */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />Password *
                      </Label>
                      <div className="relative">
                        <Input id="password" name="password" type={showPassword ? "text" : "password"} required
                          value={formData.password} onChange={handleChange}
                          onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)}
                          placeholder="Min. 6 characters"
                          className={cn("h-12 pr-10", focusedField === "password" && "ring-2 ring-primary/20 border-primary")} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />Confirm Password *
                      </Label>
                      <div className="relative">
                        <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required
                          value={formData.confirmPassword} onChange={handleChange}
                          onFocus={() => setFocusedField("confirmPassword")} onBlur={() => setFocusedField(null)}
                          placeholder="Repeat your password"
                          className={cn("h-12 pr-10", focusedField === "confirmPassword" && "ring-2 ring-primary/20 border-primary")} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mismatch warning */}
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-sm text-red-600 -mt-2">Passwords do not match</p>
                  )}

                  {/* Terms */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-xs text-muted-foreground">
                      By submitting, you agree to our{" "}
                      <Link to="/terms" className="text-primary hover:underline">Partner Terms & Conditions</Link>{" "}
                      and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                    </p>
                  </div>

                  {/* Submit */}
                  <Button type="submit" disabled={isSubmitting}
                    className="w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all group">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Submitting Application...</span>
                    ) : (
                      <span className="flex items-center gap-2">Submit Application<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Already a partner?{" "}
                    <Link to="/agent/login" className="text-primary font-medium hover:underline">Sign in here</Link>
                  </p>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our partner team at{" "}
              <a href="mailto:info@purelandtravels.com.np" className="text-primary hover:underline">info@purelandtravels.com.np</a>{" "}
              or call <a href="tel:+9779704502011" className="text-primary hover:underline">(+977) 97045 02011</a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}