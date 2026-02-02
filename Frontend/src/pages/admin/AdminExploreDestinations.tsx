// src/pages/admin/AdminExploreDestinations.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Eye, EyeOff, Upload, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";
import { getAuthToken } from "@/utils/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5020";

type FilterType = "all" | "international" | "domestic" | "weekend";

interface ExploreDestination {
  _id: string;
  name: string;
  image: string;
  type: "international" | "domestic" | "weekend";
  url: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminExploreDestinations() {
  const { toast } = useToast();
  const [destinations, setDestinations] = useState<ExploreDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<ExploreDestination | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    type: "international" as "international" | "domestic" | "weekend",
    url: "",
    order: 1,
    isActive: true,
  });

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();

      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to access this page",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const response = await fetch(`${API_URL}/api/v1/explore-destinations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          toast({
            title: "Session Expired",
            description: "Please login again.",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 1500);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === "success") {
        setDestinations(data.data.exploreDestinations);
      }
    } catch (error: any) {
      console.error("Error loading destinations:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load destinations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDestinations = destinations.filter(
    dest => filterType === "all" || dest.type === filterType
  );

  const handleCreate = () => {
    setEditingDestination(null);
    setFormData({
      name: "",
      image: "",
      type: "international",
      url: "",
      order: destinations.length + 1,
      isActive: true,
    });
    setPreviewImage("");
    setShowModal(true);
  };

  const handleEdit = (destination: ExploreDestination) => {
    setEditingDestination(destination);
    setFormData({
      name: destination.name,
      image: destination.image,
      type: destination.type,
      url: destination.url,
      order: destination.order,
      isActive: destination.isActive,
    });
    setPreviewImage(destination.image);
    setShowModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.image || !formData.url) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const token = getAuthToken();

      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to continue",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const url = editingDestination 
        ? `${API_URL}/api/v1/explore-destinations/${editingDestination._id}`
        : `${API_URL}/api/v1/explore-destinations`;

      const method = editingDestination ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          toast({
            title: "Session Expired",
            description: "Please login again.",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 1500);
          return;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        if (editingDestination) {
          setDestinations(
            destinations.map((dest) =>
              dest._id === editingDestination._id ? data.data.exploreDestination : dest
            ).sort((a, b) => a.order - b.order)
          );
          toast({
            title: "Success",
            description: "Destination updated successfully",
          });
        } else {
          setDestinations([...destinations, data.data.exploreDestination].sort((a, b) => a.order - b.order));
          toast({
            title: "Success",
            description: "Destination created successfully",
          });
        }
        setShowModal(false);
      }
    } catch (error: any) {
      console.error("Error saving destination:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save destination",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    try {
      const token = getAuthToken();

      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to continue",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/v1/explore-destinations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          toast({
            title: "Session Expired",
            description: "Please login again.",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 1500);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setDestinations(destinations.filter((dest) => dest._id !== id));
        toast({
          title: "Success",
          description: "Destination deleted successfully",
        });
      }
    } catch (error: any) {
      console.error("Error deleting destination:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete destination",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const token = getAuthToken();

      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to continue",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/v1/explore-destinations/${id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          toast({
            title: "Session Expired",
            description: "Please login again.",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 1500);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setDestinations(
          destinations.map((dest) =>
            dest._id === id ? data.data.exploreDestination : dest
          )
        );
        toast({
          title: "Success",
          description: data.message,
        });
      }
    } catch (error: any) {
      console.error("Error toggling active status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Explore Destinations</h1>
            <p className="text-muted-foreground mt-1">
              Manage featured destinations on homepage
            </p>
          </div>
          <Button onClick={handleCreate} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add Destination
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "All", value: "all" as FilterType },
            { label: "International", value: "international" as FilterType },
            { label: "Domestic", value: "domestic" as FilterType },
            { label: "Weekend", value: "weekend" as FilterType },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterType(filter.value)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                filterType === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-accent"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading destinations...</p>
            </div>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border-2 border-dashed">
            <Filter className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Destinations Found</h3>
            <p className="text-muted-foreground mb-6">
              {filterType === "all" 
                ? "Create your first destination to get started"
                : `No ${filterType} destinations yet`
              }
            </p>
            <Button onClick={handleCreate}>
              <Plus className="w-5 h-5 mr-2" />
              Add Destination
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {filteredDestinations.map((destination, index) => (
              <motion.div
                key={destination._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "relative group",
                  !destination.isActive && "opacity-60"
                )}
              >
                <div className="relative aspect-square rounded-full overflow-hidden border-4 border-border shadow-lg">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Action Buttons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(destination)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleActive(destination._id)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      {destination.isActive ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(destination._id)}
                      className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      destination.type === "international" && "bg-blue-500 text-white",
                      destination.type === "domestic" && "bg-green-500 text-white",
                      destination.type === "weekend" && "bg-orange-500 text-white"
                    )}>
                      {destination.type === "international" ? "Int'l" : 
                       destination.type === "domestic" ? "Dom" : "Wknd"}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <p className="text-sm font-medium line-clamp-1">{destination.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Order: {destination.order}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold">
                  {editingDestination ? "Edit Destination" : "Add Destination"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
                >
                  ✕
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Destination Name *
                  </label>
                  <Input
                    placeholder="e.g., Bali"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isSaving}
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Destination Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      type: e.target.value as "international" | "domestic" | "weekend" 
                    })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    required
                    disabled={isSaving}
                  >
                    <option value="international">International</option>
                    <option value="domestic">Domestic</option>
                    <option value="weekend">Weekend</option>
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Destination Image *
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                        disabled={isSaving}
                      />
                      <Upload className="w-5 h-5 text-muted-foreground" />
                    </div>
                    
                    {previewImage && (
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border mx-auto">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground">
                      Or enter image URL:
                    </p>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                        setPreviewImage(e.target.value);
                      }}
                      disabled={isSaving}
                    />
                  </div>
                </div>

                {/* URL/Link */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Destination URL *
                  </label>
                  <Input
                    placeholder="/trip/bali-tour or https://example.com"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                    disabled={isSaving}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Internal link (e.g., /trip/bali-tour) or external URL
                  </p>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Display Order *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    required
                    disabled={isSaving}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Lower numbers appear first
                  </p>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                    disabled={isSaving}
                  />
                  <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                    Active (Show on homepage)
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : editingDestination ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}