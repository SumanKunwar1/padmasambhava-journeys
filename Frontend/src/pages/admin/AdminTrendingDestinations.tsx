// src/pages/admin/AdminTrendingDestinations.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { API_BASE_URL } from "@/lib/api-config";
import { trendingDestinationService } from "@/services/trendingDestination.service";

interface TrendingDestination {
  _id: string;
  name: string;
  price: number;
  image: string;
  url: string;
  order: number;
  isActive: boolean;
}

export default function AdminTrendingDestinations() {
  const { toast } = useToast();
  const [destinations, setDestinations] = useState<TrendingDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDest, setEditingDest] = useState<TrendingDestination | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    image: "",
    url: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchDestinations();
    fetchStats();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/trending-destinations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDestinations(data.data.trendingDestinations || []);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch destinations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await trendingDestinationService.getStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (editingDest) {
        const response = await fetch(`${API_BASE_URL}/trending-destinations/${editingDest._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast({
            title: "Destination updated",
            description: "The destination has been updated successfully",
          });
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/trending-destinations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast({
            title: "Destination created",
            description: "The destination has been created successfully",
          });
        }
      }

      setShowModal(false);
      setEditingDest(null);
      resetForm();
      fetchDestinations();
      fetchStats();
    } catch (error) {
      console.error("Error saving destination:", error);
      toast({
        title: "Error",
        description: "Failed to save destination",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/trending-destinations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Destination deleted",
          description: "The destination has been deleted successfully",
        });
        fetchDestinations();
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting destination:", error);
      toast({
        title: "Error",
        description: "Failed to delete destination",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/trending-destinations/${id}/toggle-active`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchDestinations();
        fetchStats();
      }
    } catch (error) {
      console.error("Error toggling active status:", error);
      toast({
        title: "Error",
        description: "Failed to toggle active status",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      image: "",
      url: "",
      order: 0,
      isActive: true,
    });
  };

  const filteredDestinations = destinations.filter((dest) =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Trending Destinations</h1>
            <p className="text-muted-foreground mt-1">
              Manage trending destination cards
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setEditingDest(null);
              setShowModal(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Destination
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.totalDestinations}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.activeDestinations}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.inactiveDestinations}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Avg Price</p>
              <p className="text-2xl font-bold">
                ₹{Math.round(stats.priceStats.average).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No destinations found
            </div>
          ) : (
            filteredDestinations.map((dest, index) => (
              <motion.div
                key={dest._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{dest.name}</h3>
                  <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium">Price:</span> ₹
                      {dest.price.toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Order:</span> {dest.order}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {dest.isActive ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-red-600">Inactive</span>
                      )}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleToggleActive(dest._id)}
                    >
                      {dest.isActive ? (
                        <Eye className="w-4 h-4 mr-1" />
                      ) : (
                        <EyeOff className="w-4 h-4 mr-1" />
                      )}
                      {dest.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingDest(dest);
                        setFormData({
                          name: dest.name,
                          price: dest.price,
                          image: dest.image,
                          url: dest.url,
                          order: dest.order,
                          isActive: dest.isActive,
                        });
                        setShowModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(dest._id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
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
            <h2 className="text-2xl font-bold mb-4">
              {editingDest ? "Edit Destination" : "Add New Destination"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Destination name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price *</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  placeholder="Price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL *</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 w-full h-32 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/300x200?text=Invalid";
                    }}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link URL *</label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="/trip/bhutan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Order</label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: Number(e.target.value) })
                  }
                  placeholder="Order"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">Active</span>
              </label>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDest(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  {editingDest ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}