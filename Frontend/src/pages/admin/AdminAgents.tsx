// src/pages/admin/AdminAgents.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";
import { API_URL } from "@/lib/api-config";

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  commissionRate?: number;
  experience?: string;
}

interface Stats {
  totalAgents: number;
  approvedAgents: number;
  pendingAgents: number;
  rejectedAgents: number;
}

export default function AdminAgents() {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  useEffect(() => {
    fetchAgents();
    fetchStats();
  }, [statusFilter]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();

      if (statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }
      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }

      const response = await fetch(
        `${API_URL}/agents?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAgents(data.data.agents || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch agents",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/agents/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleApprove = async () => {
    if (!selectedAgent) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/agents/${selectedAgent._id}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Agent approved",
          description: `${selectedAgent.name} has been approved`,
        });
        fetchAgents();
        fetchStats();
        setSelectedAgent(null);
      }
    } catch (error) {
      console.error("Error approving agent:", error);
      toast({
        title: "Error",
        description: "Failed to approve agent",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedAgent) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/agents/${selectedAgent._id}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Agent rejected",
          description: `${selectedAgent.name} has been rejected`,
        });
        fetchAgents();
        fetchStats();
        setSelectedAgent(null);
      }
    } catch (error) {
      console.error("Error rejecting agent:", error);
      toast({
        title: "Error",
        description: "Failed to reject agent",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/agents/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Agent deleted",
          description: "The agent has been deleted successfully",
        });
        fetchAgents();
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    }
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300";
      case "rejected":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300";
      default:
        return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Agents Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and approve travel agents
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              fetchAgents();
            }}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Agents</p>
              <p className="text-2xl font-bold">{stats.totalAgents}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.approvedAgents}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.pendingAgents}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.rejectedAgents}
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg">{agent.name}</h3>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                      getStatusColor(agent.status)
                    )}
                  >
                    {getStatusIcon(agent.status)}
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{agent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{agent.location}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  {agent.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedAgent(agent);
                          handleApprove();
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          setSelectedAgent(agent);
                          handleReject();
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(agent._id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}