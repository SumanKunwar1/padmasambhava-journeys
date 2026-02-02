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
import { API_BASE_URL } from "@/lib/api-config";

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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/agents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      // Success notification
      toast.success(
        "🎉 Application submitted successfully! We'll contact you within 24-48 hours.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

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
      });

      // Redirect after short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      // Error notification
      toast.error(
        error.message || "Failed to submit application. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      console.error("Error submitting application:", error);
    } finally {
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
                      className="flex gap-4 items-start"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong className="text-foreground">Already working with other DMCs?</strong> That's fine! Join our network and compare the difference in service quality and commission structure.
                  </p>
                  <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xl">💡</span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground font-medium mb-1">Quick Tip</p>
                      <p className="text-xs text-muted-foreground">Applications are reviewed within 24 hours. Have your business documents ready for faster approval.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl p-6 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Need Immediate Assistance?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our partner team is available to answer your questions
                </p>
                <div className="space-y-2">
                  <a 
                    href="tel:+917363933945" 
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    (+91) 73639 33945
                  </a>
                  <a 
                    href="mailto:partners@padmasambhavatrips.com" 
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    partners@padmasambhavatrips.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Application Form - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200">
                <h2 className="text-2xl font-bold text-foreground mb-6">Application Form</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name & Company Name - Grid */}
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

                  {/* Email & Phone - Grid */}
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
                        placeholder="+91 XXXXX XXXXX"
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

                  {/* Terms and Conditions */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-xs text-muted-foreground">
                      By submitting this application, you agree to our{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Partner Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      . We'll review your application and contact you within 24-48 hours.
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
                        Submitting Application...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit Application
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>

                  {/* Already have an account */}
                  <p className="text-center text-sm text-muted-foreground">
                    Already a partner?{" "}
                    <Link to="/login" className="text-primary font-medium hover:underline">
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
              <a href="mailto:partners@padmasambhavatrips.com" className="text-primary hover:underline">
                partners@padmasambhavatrips.com
              </a>{" "}
              or call{" "}
              <a href="tel:+917363933945" className="text-primary hover:underline">
                (+91) 73639 33945
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}