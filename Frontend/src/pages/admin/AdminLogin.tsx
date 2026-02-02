// src/pages/admin/AdminLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import axios from "axios";

// API Base URL - get from environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log("📝 Attempting login...");
      console.log("🔗 API URL:", `${API_URL}/api/v1/auth/login`);
      
      // Call backend API with full path
      const response = await axios.post(
        `${API_URL}/api/v1/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true, // Important for cookies
        }
      );

      console.log("📡 Login response received:", {
        status: response.data.status,
        hasToken: !!response.data.token
      });

      if (response.data.status === 'success') {
        const adminData = response.data.data.admin;
        const token = response.data.token;

        if (!token) {
          throw new Error("No token received from server");
        }

        // ✅ CRITICAL FIX: Store token with key "token" (not "adminToken")
        // This matches what auth.ts expects
        localStorage.setItem("token", token);
        localStorage.setItem("adminUser", JSON.stringify(adminData));
        
        console.log("✅ Token saved to localStorage");
        console.log("✅ Admin data saved:", adminData.name);
        
        toast({
          title: "Login successful!",
          description: `Welcome back, ${adminData.name}!`,
        });
        
        // Small delay to ensure localStorage is written
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 100);
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Invalid email or password";
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: "admin@padmasambhavatrip.com",
      password: "P@dm@2026",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-2xl p-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Admin Portal</h1>
            <p className="text-muted-foreground">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  name="email"
                  placeholder="admin@padmasambhavatrip.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={cn(
                    "pl-10",
                    errors.email && "border-destructive focus:ring-destructive"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter admin password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={cn(
                    "pl-10 pr-10",
                    errors.password && "border-destructive focus:ring-destructive"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base mt-6"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Button */}
          <Button
            type="button"
            variant="outline"
            onClick={fillDemoCredentials}
            className="w-full mt-3"
          >
            Use Demo Admin Credentials
          </Button>
        </div>

        {/* Demo Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 10 }}
          className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary"
        >
          <p className="font-semibold mb-1">Demo Admin Account</p>
          <p>Email: admin@padmasambhavatrip.com</p>
          <p>Password: P@dm@2026</p>
        </motion.div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}