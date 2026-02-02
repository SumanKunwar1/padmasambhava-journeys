// src/components/admin/ProtectedAdminRoute.tsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // CRITICAL: Check for "adminToken" (matches what AdminLogin saves)
      const token = localStorage.getItem("adminToken");
      
      console.log("🔒 ProtectedAdminRoute: Checking authentication...");
      console.log("   Token in localStorage:", token ? "Present" : "Missing");
      
      if (!token) {
        console.warn("⚠️  No token found - redirecting to login");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      console.log("🔍 Verifying token with backend...");
      const response = await axiosInstance.get('/auth/me');

      if (response.data.status === 'success') {
        console.log("✅ Authentication successful:", response.data.data.admin.email);
        setIsAuthenticated(true);
      } else {
        console.warn("⚠️  Invalid response from /auth/me");
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      console.error("❌ Auth verification failed:", error.response?.status, error.message);
      
      // If 401, token is invalid or expired
      if (error.response?.status === 401) {
        console.log("🗑️  Clearing invalid token");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      }
      
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("🔄 Redirecting to login...");
    return <Navigate to="/admin/login" replace />;
  }

  // Render protected content
  console.log("✅ Rendering protected content");
  return <>{children}</>;
}