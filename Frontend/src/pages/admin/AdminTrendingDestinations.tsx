// src/pages/admin/AdminTrendingDestinations.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Eye, EyeOff, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";

interface TrendingDestination {
  _id: string;
  name: string;
  price: number;
  image: string;
  url: string; // Link where it should redirect
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminTrendingDestinations() {
  const { toast } = useToast();
  const [destinations, setDestinations] = useState<TrendingDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<TrendingDestination | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    image: "",
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
      // const response = await fetch('/api/v1/trending-destinations');
      // const data = await response.json();
      
      // Mock data
      const mockData: TrendingDestination[] = [
        {
          _id: "1",
          name: "Bali Tour Packages",
          price: 49999,
          image: "/assets/dest-bali.jpg",
          url: "/trip/bali-tour",
          order: 1,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          name: "Georgia Tour Packages",
          price: 52999,
          image: "/assets/dest-georgia.jpg",
          url: "/trip/georgia-tour",
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

  const handleCreate = () => {
    setEditingDestination(null);
    setFormData({
      name: "",
      price: 0,
      image: "",
      url: "",
      order: destinations.length + 1,
      isActive: true,
    });
    setPreviewImage("");
    setShowModal(true);
  };

  const handleEdit = (destination: TrendingDestination) => {
    setEditingDestination(destination);
    setFormData({
      name: destination.name,
      price: destination.price,
      image: destination.image,
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
        const newDestination: TrendingDestination = {
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
            <h1 className="text-3xl font-display font-bold">Trending Destinations</h1>
            <p className="text-muted-foreground mt-1">
              Manage trending destinations section on homepage
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Destination
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground">No trending destinations yet</p>
            <Button onClick={handleCreate} className="mt-4">
              Add First Destination
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "bg-card rounded-xl border overflow-hidden",
                  !destination.isActive && "opacity-60"
                )}
              >
                <div className="relative aspect-[3/4]">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => toggleActive(destination._id)}
                      className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                    >
                      {destination.isActive ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <h3 className="text-white text-sm font-medium mb-1 line-clamp-2">
                      {destination.name}
                    </h3>
                    <p className="text-white/90 text-sm font-semibold">
                      ₹{destination.price.toLocaleString()}
                    </p>
                    <p className="text-white/70 text-xs mt-1 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />
                      Order: {destination.order}
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(destination)}
                      className="flex-1"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(destination._id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
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
                    placeholder="e.g., Bali Tour Packages"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price (₹) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="49999"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    required
                  />
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
                      <div className="relative aspect-[3/4] max-w-xs rounded-lg overflow-hidden border">
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