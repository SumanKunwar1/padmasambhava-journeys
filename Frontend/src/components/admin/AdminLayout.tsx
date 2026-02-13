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
  Plane,
  Route,
  FolderOpen,
  Image,
  TrendingUp,
  Compass,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { title } from "process";

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
    title: "Homepage",
    icon: Image,
    children: [
      {
        title: "Hero Section",
        icon: Image,
        path: "/admin/homepage/hero",
      },
      {
        title: "Trending Destinations",
        icon: TrendingUp,
        path: "/admin/homepage/trending",
      },
      {
        title: "Explore Destinations",
        icon: Compass,
        path: "/admin/homepage/explore",
      },
    ],
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
  {title: "Dalai Lama Bookings", icon: Calendar, path: "/admin/dalai-lama-bookings"},
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
    title: "Visa Applications",
    icon: Plane,
    path: "/admin/visa-applications",
  },
  {
    title: "Insurance",
    icon: Shield,
    path: "/admin/insurance",
  },
  {
    title: "Agents",
    icon: Users,
    path: "/admin/agents",
  },
  {
    title: "Testimonials",
    icon: Users,
    path: "/admin/testimonials",
  },
  {
    title: "Custom Trips",
    icon: Route,
    path: "/admin/custom-trips",
  },
  {
    title: "Documentation",
    icon: FolderOpen,
    path: "/admin/documentation",
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
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Homepage"]);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/admin/login");
  };

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
      (path !== "/admin/dashboard" && location.pathname.startsWith(path));
  };

  const renderMenuItem = (item: typeof menuItems[0], depth: number = 0) => {
    if (item.children) {
      const isExpanded = expandedMenus.includes(item.title);
      const hasActiveChild = item.children.some(child => isActive(child.path));

      return (
        <div key={item.title}>
          <button
            onClick={() => toggleMenu(item.title)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
              hasActiveChild
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="flex-1">{item.title}</span>
            <ChevronRight 
              className={cn(
                "w-4 h-4 transition-transform",
                isExpanded && "rotate-90"
              )} 
            />
          </button>
          
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map(child => (
                <button
                  key={child.path}
                  onClick={() => {
                    navigate(child.path);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left text-sm",
                    isActive(child.path)
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <child.icon className="w-4 h-4 shrink-0" />
                  <span>{child.title}</span>
                  {isActive(child.path) && <ChevronRight className="w-3 h-3 ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.path}
        onClick={() => {
          navigate(item.path!);
          setMobileMenuOpen(false);
        }}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
          isActive(item.path!)
            ? "bg-primary text-primary-foreground font-semibold"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <item.icon className="w-5 h-5 shrink-0" />
        <span>{item.title}</span>
        {isActive(item.path!) && <ChevronRight className="w-4 h-4 ml-auto" />}
      </button>
    );
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
              {menuItems.map(item => renderMenuItem(item))}
            </nav>
          )}
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <aside className="lg:hidden fixed inset-0 top-16 bg-black/50 z-40">
            <nav className="w-64 h-full bg-card border-r border-border p-4 space-y-2 overflow-y-auto">
              {menuItems.map(item => renderMenuItem(item))}
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