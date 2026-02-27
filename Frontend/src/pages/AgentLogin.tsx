// src/pages/AgentLogin.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function AgentLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password", { position: "top-right" });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/agents/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.status === "success") {
        const agent = response.data.data.agent;
        const token = response.data.token;

        // Store agent session
        localStorage.setItem("agentToken", token);
        localStorage.setItem("agentLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify({
          id: agent._id,
          name: agent.fullName,
          email: agent.email,
          phone: agent.phone,
          role: "agent",
          agencyName: agent.companyName,
          city: agent.city,
          state: agent.state,
          agentId: agent.agentId,
          commissionRate: agent.commissionRate,
        }));

        toast.success(`Welcome back, ${agent.fullName}! Redirecting...`, {
          position: "top-right", autoClose: 2000,
        });

        setTimeout(() => {
          navigate("/agent/dashboard", { replace: true });
        }, 1500);
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Invalid email or password";
      toast.error(msg, { position: "top-right", autoClose: 6000 });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10 py-12 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              ← Back to Home
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Agent Login</h1>
              <p className="text-muted-foreground">Sign in to your partner account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />Email Address
                </Label>
                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                  onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                  placeholder="your@email.com"
                  className={cn("h-12", focusedField === "email" && "ring-2 ring-primary/20 border-primary")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />Password
                </Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} required
                    value={formData.password} onChange={handleChange}
                    onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    className={cn("h-12 pr-10", focusedField === "password" && "ring-2 ring-primary/20 border-primary")} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting}
                className="w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all group">
                {isSubmitting ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Signing in...</span>
                ) : (
                  <span className="flex items-center gap-2">Sign In<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-muted-foreground">Or</span>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/agent-signup" className="text-primary font-medium hover:underline">Apply to become a partner</Link>
              </p>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs text-muted-foreground text-center">
                Login credentials are provided by admin upon approval of your partner application.
                If you haven't applied yet, <Link to="/agent-signup" className="text-primary hover:underline">apply here</Link>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}