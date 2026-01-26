// src/pages/admin/AdminApplications.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  applicantName: string;
  email: string;
  destination: string;
  purpose: string;
  appliedDate: string;
  status: "Pending" | "Under Review" | "Approved" | "Rejected";
}

export default function AdminApplications() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const applications: Application[] = [
    {
      id: "1",
      applicantName: "Rajesh Gupta",
      email: "rajesh@example.com",
      destination: "Thailand",
      purpose: "Tourism",
      appliedDate: "2026-01-20",
      status: "Under Review",
    },
    {
      id: "2",
      applicantName: "Kavita Singh",
      email: "kavita@example.com",
      destination: "Georgia",
      purpose: "Tourism",
      appliedDate: "2026-01-22",
      status: "Pending",
    },
    {
      id: "3",
      applicantName: "Vikram Reddy",
      email: "vikram@example.com",
      destination: "Bhutan",
      purpose: "Pilgrimage",
      appliedDate: "2026-01-23",
      status: "Approved",
    },
    {
      id: "4",
      applicantName: "Sneha Verma",
      email: "sneha@example.com",
      destination: "Dubai",
      purpose: "Tourism",
      appliedDate: "2026-01-19",
      status: "Rejected",
    },
  ];

  const handleStatusChange = (id: string, newStatus: Application["status"]) => {
    toast({
      title: "Status updated",
      description: `Application status changed to ${newStatus}`,
    });
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ["All", "Pending", "Under Review", "Approved", "Rejected"];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-900";
      case "Rejected":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900";
      case "Under Review":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900";
      default:
        return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Visa Applications</h1>
          <p className="text-muted-foreground mt-1">
            Manage all visa application submissions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {statusOptions.map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Applications</p>
            <p className="text-2xl font-bold">{applications.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-2xl font-bold">
              {
                applications.filter(
                  (a) => a.status === "Pending" || a.status === "Under Review"
                ).length
              }
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold">
              {applications.filter((a) => a.status === "Approved").length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-2xl font-bold">
              {applications.filter((a) => a.status === "Rejected").length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{app.applicantName}</h3>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1",
                        getStatusColor(app.status)
                      )}
                    >
                      {getStatusIcon(app.status)}
                      {app.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Email:</span> {app.email}
                    </div>
                    <div>
                      <span className="font-medium">Destination:</span>{" "}
                      {app.destination}
                    </div>
                    <div>
                      <span className="font-medium">Purpose:</span> {app.purpose}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Applied: {new Date(app.appliedDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  {app.status === "Pending" || app.status === "Under Review" ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(app.id, "Approved")}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleStatusChange(app.id, "Rejected")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}