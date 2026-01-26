// src/components/admin/AdminLayout.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  FileText,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    title: "Trips",
    icon: MapPin,
    path: "/admin/trips",
  },
  {
    title: "Bookings",
    icon: Calendar,
    path: "/admin/bookings",
  },
  {
    title: "Blogs",
    icon: FileText,
    path: "/admin/blogs",
  },
  {
    title: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Applications",
    icon: FileText,
    path: "/admin/applications",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-display font-bold">Admin Panel</h1>
              <span className="hidden sm:inline text-sm text-muted-foreground">
                | Padmasambhava Trips
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="hidden sm:flex"
            >
              View Site
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:block fixed left-0 top-16 bottom-0 bg-card border-r border-border transition-all duration-300 z-40",
            sidebarOpen ? "w-64" : "w-0"
          )}
        >
          {sidebarOpen && (
            <nav className="p-4 space-y-2 h-full overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path));
                
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span>{item.title}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                );
              })}
            </nav>
          )}
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <aside className="lg:hidden fixed inset-0 top-16 bg-black/50 z-40">
            <nav className="w-64 h-full bg-card border-r border-border p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path));
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 p-4 md:p-8 transition-all duration-300",
            sidebarOpen ? "lg:ml-64" : "lg:ml-0"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}