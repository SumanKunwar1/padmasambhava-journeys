// src/pages/admin/AdminExploreDestinations.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Eye, EyeOff, Link as LinkIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";

type FilterType = "all" | "international" | "domestic" | "weekend";

interface ExploreDestination {
  _id: string;
  name: string;
  image: string;
  type: "international" | "domestic" | "weekend";
  url: string; // Link where it should redirect
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
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/explore-destinations');
      // const data = await response.json();
      
      // Mock data
      const mockData: ExploreDestination[] = [
        {
          _id: "1",
          name: "Bali",
          image: "/assets/dest-bali.jpg",
          type: "international",
          url: "/trip/bali-tour",
          order: 1,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          name: "Ladakh",
          image: "/assets/dest-ladakh.jpg",
          type: "domestic",
          url: "/trip/ladakh-tour",
          order: 2,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ];
      
      setDestinations(mockData.sort((a, b) => a.order - b.order));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load destinations",
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

    try {
      if (editingDestination) {
        // TODO: Update API call
        setDestinations(destinations.map(dest => 
          dest._id === editingDestination._id 
            ? { ...dest, ...formData }
            : dest
        ));

        toast({
          title: "Success",
          description: "Destination updated successfully",
        });
      } else {
        // TODO: Create API call
        const newDestination: ExploreDestination = {
          _id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
        };
        
        setDestinations([...destinations, newDestination].sort((a, b) => a.order - b.order));

        toast({
          title: "Success",
          description: "Destination created successfully",
        });
      }

      setShowModal(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save destination",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    try {
      // TODO: Delete API call
      setDestinations(destinations.filter(dest => dest._id !== id));
      
      toast({
        title: "Success",
        description: "Destination deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete destination",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string) => {
    try {
      // TODO: Update API call
      setDestinations(destinations.map(dest => 
        dest._id === id ? { ...dest, isActive: !dest.isActive } : dest
      ));

      toast({
        title: "Success",
        description: "Destination status updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Explore Destinations</h1>
            <p className="text-muted-foreground mt-1">
              Manage explore destinations section on homepage
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Destination
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(["all", "international", "domestic", "weekend"] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filterType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              {filterType === "all" 
                ? "No destinations yet" 
                : `No ${filterType} destinations yet`}
            </p>
            <Button onClick={handleCreate} className="mt-4">
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
              <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingDestination ? "Edit Destination" : "Add Destination"}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
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
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
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
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    required
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
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingDestination ? "Update" : "Create"}
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