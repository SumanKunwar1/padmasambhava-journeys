// src/pages/admin/AdminCustomTrips.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Edit, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";
import { API_URL } from "@/lib/api-config";

interface CustomTrip {
  _id: string;
  customerName: string;
  email: string;
  destination: string;
  budget?: string;
  status: "pending" | "quoted" | "accepted" | "rejected";
  submittedDate: string;
  quotedPrice?: number;
  adminNotes?: string;
}

interface Stats {
  totalRequests: number;
  pendingRequests: number;
  quotedRequests: number;
  acceptedRequests: number;
  rejectedRequests: number;
}

export default function AdminCustomTrips() {
  const { toast } = useToast();
  const [trips, setTrips] = useState<CustomTrip[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editingTrip, setEditingTrip] = useState<CustomTrip | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    quotedPrice: 0,
    adminNotes: "",
  });

  useEffect(() => {
    fetchTrips();
    fetchStats();
  }, [statusFilter]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        search: searchQuery,
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(
        `${API_URL}/custom-trips?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTrips(data.data.customTrips || []);
      }
    } catch (error) {
      console.error("Error fetching custom trips:", error);
      toast({
        title: "Error",
        description: "Failed to fetch custom trips",
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
        `${API_URL}/custom-trips/admin/stats`,
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

  const handleUpdate = async () => {
    if (!editingTrip) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/custom-trips/${editingTrip._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast({
          title: "Custom trip updated",
          description: "The custom trip has been updated successfully",
        });
        setShowModal(false);
        setEditingTrip(null);
        fetchTrips();
        fetchStats();
      }
    } catch (error) {
      console.error("Error updating custom trip:", error);
      toast({
        title: "Error",
        description: "Failed to update custom trip",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this custom trip request?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/custom-trips/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Custom trip deleted",
          description: "The custom trip request has been deleted successfully",
        });
        fetchTrips();
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting custom trip:", error);
      toast({
        title: "Error",
        description: "Failed to delete custom trip",
        variant: "destructive",
      });
    }
  };

  const filteredTrips = trips.filter(
    (trip) =>
      trip.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300";
      case "rejected":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300";
      case "quoted":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300";
      default:
        return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Custom Trip Requests</h1>
          <p className="text-muted-foreground mt-1">
            Manage custom trip requests from customers
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search custom trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "quoted", "accepted", "rejected"].map((status) => (
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
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-bold">{stats.totalRequests}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pendingRequests}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Quoted</p>
              <p className="text-2xl font-bold text-blue-600">{stats.quotedRequests}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{stats.acceptedRequests}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejectedRequests}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No custom trip requests found
            </div>
          ) : (
            filteredTrips.map((trip, index) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{trip.customerName}</h3>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          getStatusColor(trip.status)
                        )}
                      >
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground mb-2">
                      <div>
                        <span className="font-medium">Email:</span> {trip.email}
                      </div>
                      <div>
                        <span className="font-medium">Destination:</span> {trip.destination}
                      </div>
                      <div>
                        <span className="font-medium">Budget:</span> {trip.budget || "N/A"}
                      </div>
                    </div>
                    {trip.quotedPrice && (
                      <div className="text-sm">
                        <span className="font-medium">Quoted Price:</span> ₹
                        {trip.quotedPrice.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingTrip(trip);
                        setFormData({
                          quotedPrice: trip.quotedPrice || 0,
                          adminNotes: trip.adminNotes || "",
                        });
                        setShowModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(trip._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Update Custom Trip</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Quoted Price</label>
                <input
                  type="number"
                  value={formData.quotedPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, quotedPrice: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Enter quoted price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Admin Notes</label>
                <textarea
                  value={formData.adminNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, adminNotes: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Add any notes for the customer"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTrip(null);
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleUpdate}>
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}