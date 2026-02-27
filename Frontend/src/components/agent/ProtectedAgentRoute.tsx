// src/components/agent/ProtectedAgentRoute.tsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface ProtectedAgentRouteProps {
  children: React.ReactNode;
}

export default function ProtectedAgentRoute({ children }: ProtectedAgentRouteProps) {
  const [isAgent, setIsAgent] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAgentStatus = () => {
      const storedUser = localStorage.getItem("user");
      const agentLoggedIn = localStorage.getItem("agentLoggedIn");
      
      if (storedUser && agentLoggedIn === "true") {
        try {
          const user = JSON.parse(storedUser);
          // Check if user has agent role
          if (user.role === "agent") {
            setIsAgent(true);
            return;
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      
      setIsAgent(false);
    };

    checkAgentStatus();
  }, []);

  // Loading state
  if (isAgent === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not an agent, redirect to login
  if (!isAgent) {
    return <Navigate to="/agent/login" replace />;
  }

  // Is an agent, render children
  return <>{children}</>;
}