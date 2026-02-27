// src/pages/AgentLogin.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function AgentLogin() {
  const navigate = useNavigate();
  const auth = useAuth() as any;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create mock user with role: "agent"
      const mockUser = {
        id: "agent-" + Date.now(),
        name: "Agent User",
        email: formData.email,
        phone: "+9779704502011",
        role: "agent", // ⭐ CRITICAL
        agencyName: "Agent Agency",
        city: "Delhi",
        state: "Delhi",
      };

      const mockToken = "mock-agent-token-" + Date.now();

      console.log("✅ Mock user created:", mockUser);
      console.log("✅ Role:", mockUser.role);

      // Save to localStorage directly
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", mockToken);
      localStorage.setItem("agentLoggedIn", "true");

      console.log("✅ Saved to localStorage");

      toast.success("🎉 Welcome! Redirecting to your dashboard...", {
        position: "top-right",
        autoClose: 2000,
      });

      // Navigate directly without waiting for context
      setTimeout(() => {
        navigate("/agent/dashboard", { replace: true });
      }, 1500);
    } catch (error: any) {
      console.error("❌ Error:", error);
      toast.error("Failed to login. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10 py-12 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              ← Back to Home
            </Link>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Agent Login</h1>
              <p className="text-muted-foreground">Sign in to your partner account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
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

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    className={cn(
                      "h-12 pr-10 transition-all duration-200",
                      focusedField === "password" && "ring-2 ring-primary/20 border-primary"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-muted-foreground">Or</span>
                </div>
              </div>

              {/* Don't have account */}
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/agent-signup" className="text-primary font-medium hover:underline">
                  Sign up here
                </Link>
              </p>
            </form>

            {/* Info Box */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs text-muted-foreground text-center">
                Login with your agent account credentials to access your dashboard, 
                manage bookings, and track your commissions.
              </p>
            </div>
          </motion.div>

          {/* Demo Credentials Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200"
          >
            <p className="text-xs text-blue-700">
              <strong>Demo Mode:</strong> Use any email and password to test. Example: test@agent.com / password123
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}