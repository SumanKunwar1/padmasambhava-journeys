// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  FileText,
  Download,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Eye,
  Trash2,
  BarChart3,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: string;
  name: string;
  destination: string;
  status: "Under Review" | "Approved" | "Rejected" | "Pending Documents";
  submittedDate: string;
  data: any;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<"applications" | "profile" | "documents">("applications");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Load applications from localStorage
    const savedApplications = JSON.parse(localStorage.getItem("visaApplications") || "[]");
    setApplications(savedApplications);
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
    });
    navigate("/");
  };

  const handleDeleteApplication = (id: string) => {
    if (confirm("Are you sure you want to delete this application?")) {
      const updated = applications.filter((app) => app.id !== id);
      setApplications(updated);
      localStorage.setItem("visaApplications", JSON.stringify(updated));
      toast({
        title: "Application deleted",
        description: "Your application has been removed",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "Rejected":
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "Under Review":
        return <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "Pending Documents":
        return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-200 border-green-200 dark:border-green-900";
      case "Rejected":
        return "bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200 border-red-200 dark:border-red-900";
      case "Under Review":
        return "bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-900";
      case "Pending Documents":
        return "bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-900";
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4">
        <div className="container-custom max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, <span className="font-semibold text-foreground">{user?.fullName}</span>
              </p>
            </div>
            <Button variant="outline" size="lg" onClick={handleLogout}>
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 10 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <StatCard
              label="Total Applications"
              value={applications.length}
              icon={<FileText className="w-6 h-6" />}
              color="bg-blue-500"
            />
            <StatCard
              label="Approved"
              value={applications.filter((a) => a.status === "Approved").length}
              icon={<CheckCircle className="w-6 h-6" />}
              color="bg-green-500"
            />
            <StatCard
              label="Under Review"
              value={applications.filter((a) => a.status === "Under Review").length}
              icon={<Clock className="w-6 h-6" />}
              color="bg-amber-500"
            />
            <StatCard
              label="Pending Documents"
              value={applications.filter((a) => a.status === "Pending Documents").length}
              icon={<AlertCircle className="w-6 h-6" />}
              color="bg-red-500"
            />
          </motion.div>

          {/* Tabs */}
          <div className="mb-8 flex gap-3 border-b border-border">
            <button
              onClick={() => setActiveTab("applications")}
              className={cn(
                "px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px",
                activeTab === "applications"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              My Applications
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={cn(
                "px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px",
                activeTab === "documents"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Documentation
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={cn(
                "px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px",
                activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profile
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "applications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Visa Applications</h2>
                <Button onClick={() => navigate("/visa-application")}>
                  <Plus className="w-5 h-5 mr-2" />
                  New Application
                </Button>
              </div>

              {applications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your visa application process now
                  </p>
                  <Button onClick={() => navigate("/visa-application")}>
                    Create New Application
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {applications.map((app) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{app.name}</h3>
                            <span className={cn("px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1", getStatusColor(app.status))}>
                              {getStatusIcon(app.status)}
                              {app.status}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-3">
                            Destination: <span className="font-semibold text-foreground">{app.destination}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Submitted: {new Date(app.submittedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteApplication(app.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "documents" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Documentation</h2>
                <Button onClick={() => navigate("/documentation")}>
                  <Plus className="w-5 h-5 mr-2" />
                  Manage Documents
                </Button>
              </div>

              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Document Management</h3>
                <p className="text-muted-foreground mb-6">
                  Upload and manage all your travel documents in one place
                </p>
                <Button onClick={() => navigate("/documentation")}>
                  Go to Documentation Portal
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card rounded-lg border border-border p-8 md:col-span-2"
                >
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <User className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{user?.fullName}</h3>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <ProfileField label="Full Name" value={user?.fullName || "N/A"} />
                    <ProfileField label="Email Address" value={user?.email || "N/A"} />
                    <ProfileField label="Phone Number" value={user?.phone || "N/A"} />
                    <ProfileField
                      label="Member Since"
                      value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    />
                  </div>

                  <div className="mt-8 pt-6 border-t border-border flex gap-3">
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline">
                      Change Password
                    </Button>
                  </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card rounded-lg border border-border p-6"
                >
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Quick Stats
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Applications:</span>
                      <span className="font-semibold">{applications.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Approved:</span>
                      <span className="font-semibold text-green-600">
                        {applications.filter((a) => a.status === "Approved").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="font-semibold text-amber-600">
                        {applications.filter((a) => a.status === "Under Review" || a.status === "Pending Documents").length}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Account Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 10 }}
                className="mt-8 bg-destructive/5 border border-destructive/20 rounded-lg p-6"
              >
                <h4 className="font-semibold text-destructive mb-4">Account Actions</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                    Delete Account
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 10 }}
      className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        <div className={cn("p-3 rounded-lg text-white", color)}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </motion.div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}