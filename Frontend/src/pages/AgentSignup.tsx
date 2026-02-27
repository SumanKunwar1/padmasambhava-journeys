// src/pages/AgentSignup.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { 
  Briefcase, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  CheckCircle2,
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function AgentSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    website: "",
    experience: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    // Validate all required fields
    if (!formData.fullName || !formData.companyName || !formData.email || 
        !formData.phone || !formData.city || !formData.state || !formData.experience) {
      toast.error("Please fill all required fields", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create agent user with role: "agent"
      const newAgent = {
        id: "agent-" + Date.now(),
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: "agent", // ⭐ CRITICAL: Must be "agent"
        agencyName: formData.companyName,
        city: formData.city,
        state: formData.state,
        website: formData.website,
      };

      const mockToken = "mock-agent-token-" + Date.now();

      console.log("✅ New agent created:", newAgent);
      console.log("✅ Role:", newAgent.role);

      // Save to localStorage directly
      localStorage.setItem("user", JSON.stringify(newAgent));
      localStorage.setItem("token", mockToken);
      localStorage.setItem("agentLoggedIn", "true");

      console.log("✅ Saved to localStorage");

      toast.success("🎉 Account created! Redirecting to your dashboard...", {
        position: "top-right",
        autoClose: 2000,
      });

      // Reset form
      setFormData({
        fullName: "",
        companyName: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        website: "",
        experience: "",
        password: "",
        confirmPassword: "",
      });

      // Navigate directly
      setTimeout(() => {
        navigate("/agent/dashboard", { replace: true });
      }, 1500);
    } catch (error: any) {
      console.error("❌ Error:", error);
      toast.error("Failed to create account. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "High Commission Rates",
      description: "Earn up to 15% on every booking",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Dedicated Support",
      description: "24/7 partner assistance team",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trusted Platform",
      description: "100+ verified travel packages",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4" />
              <span>Partner Program</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Become Our Travel Partner
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join India's most trusted DMC and unlock exclusive benefits, premium packages, and dedicated support for your travel business.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Benefits Section - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  Why Partner With Us?
                </h2>
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                          {benefit.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200">
                <h3 className="text-lg font-bold text-foreground mb-4">What You'll Get:</h3>
                <ul className="space-y-3">
                  {[
                    "Access to 100+ exclusive tour packages",
                    "Real-time booking management system",
                    "Instant commission payouts",
                    "Priority customer support",
                    "Marketing materials & resources",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Registration Form - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200">
                <h2 className="text-2xl font-bold text-foreground mb-6">Create Your Agent Account</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name and Company - Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("fullName")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Your full name"
                        className={cn(
                          "h-12 transition-all duration-200",
                          focusedField === "fullName" && "ring-2 ring-primary/20 border-primary"
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-sm font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        Company Name *
                      </Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("companyName")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Your company name"
                        className={cn(
                          "h-12 transition-all duration-200",
                          focusedField === "companyName" && "ring-2 ring-primary/20 border-primary"
                        )}
                      />
                    </div>
                  </div>

                  {/* Email and Phone - Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="your@email.com"
                        className={cn(
                          "h-12 transition-all duration-200",
                          focusedField === "email" && "ring-2 ring-primary/20 border-primary"
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="+977 XXXXX XXXXX"
                        className={cn(
                          "h-12 transition-all duration-200",
                          focusedField === "phone" && "ring-2 ring-primary/20 border-primary"
                        )}
                      />
                    </div>
                  </div>

                  {/* City and State - Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        City *
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("city")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Your city"
                        className={cn(
                          "h-12 transition-all duration-200",
                          focusedField === "city" && "ring-2 ring-primary/20 border-primary"
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">
                        State / Province *
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        type="text"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("state")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Your state"
                        className={cn(
                          "h-12 transition-all duration-200",
                          focusedField === "state" && "ring-2 ring-primary/20 border-primary"
                        )}
                      />
                    </div>
                  </div>

                  {/* Website (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      Website <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("website")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="https://yourwebsite.com"
                      className={cn(
                        "h-12 transition-all duration-200",
                        focusedField === "website" && "ring-2 ring-primary/20 border-primary"
                      )}
                    />
                  </div>

                  {/* Years of Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Years of Experience *
                    </Label>
                    <select
                      id="experience"
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("experience")}
                      onBlur={() => setFocusedField(null)}
                      className={cn(
                        "flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        focusedField === "experience" && "ring-2 ring-primary/20 border-primary"
                      )}
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>

                  {/* Password and Confirm Password */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Create a strong password"
                        className={cn(
                          "h-12 transition-all duration-200",
                          focusedField === "password" && "ring-2 ring-primary/20 border-primary"
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Confirm your password"
                        className={cn(
                          "h-12 transition-all duration-200",
                          focusedField === "confirmPassword" && "ring-2 ring-primary/20 border-primary"
                        )}
                      />
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-xs text-muted-foreground">
                      By creating an account, you agree to our{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Partner Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Create Agent Account
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>

                  {/* Already have an account */}
                  <p className="text-center text-sm text-muted-foreground">
                    Already a partner?{" "}
                    <Link to="/agent/login" className="text-primary font-medium hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-muted-foreground">
              Need help? Contact our partner team at{" "}
              <a href="mailto:info@purelandtravels.com.np" className="text-primary hover:underline">
                info@purelandtravels.com.np
              </a>{" "}
              or call{" "}
              <a href="tel:+9779704502011" className="text-primary hover:underline">
                (+977) 97045 02011
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}