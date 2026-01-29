// src/pages/admin/AdminHeroSection.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Eye, EyeOff, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";

interface HeroImage {
  _id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminHeroSection() {
  const { toast } = useToast();
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [formData, setFormData] = useState({
    imageUrl: "",
    title: "",
    subtitle: "",
    order: 1,
    isActive: true,
  });

  // Mock data - Replace with actual API call
  useEffect(() => {
    loadHeroImages();
  }, []);

  const loadHeroImages = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/hero-images');
      // const data = await response.json();
      
      // Mock data
      const mockData: HeroImage[] = [
        {
          _id: "1",
          imageUrl: "/assets/hero-pilgrimage.jpg",
          title: "Sacred Pilgrimages",
          subtitle: "Journey to Divine Destinations",
          order: 1,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          imageUrl: "/assets/dest-bhutan.jpg",
          title: "Bhutan Tours",
          subtitle: "Land of Happiness",
          order: 2,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ];
      
      setHeroImages(mockData.sort((a, b) => a.order - b.order));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load hero images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingImage(null);
    setFormData({
      imageUrl: "",
      title: "",
      subtitle: "",
      order: heroImages.length + 1,
      isActive: true,
    });
    setPreviewImage("");
    setShowModal(true);
  };

  const handleEdit = (image: HeroImage) => {
    setEditingImage(image);
    setFormData({
      imageUrl: image.imageUrl,
      title: image.title || "",
      subtitle: image.subtitle || "",
      order: image.order,
      isActive: image.isActive,
    });
    setPreviewImage(image.imageUrl);
    setShowModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload to your server/cloud storage
      // For now, create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData({ ...formData, imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      toast({
        title: "Error",
        description: "Please upload an image",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingImage) {
        // TODO: Update API call
        // await fetch(`/api/v1/hero-images/${editingImage._id}`, {
        //   method: 'PUT',
        //   body: JSON.stringify(formData),
        // });
        
        setHeroImages(heroImages.map(img => 
          img._id === editingImage._id 
            ? { ...img, ...formData }
            : img
        ));

        toast({
          title: "Success",
          description: "Hero image updated successfully",
        });
      } else {
        // TODO: Create API call
        // const response = await fetch('/api/v1/hero-images', {
        //   method: 'POST',
        //   body: JSON.stringify(formData),
        // });
        
        const newImage: HeroImage = {
          _id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
        };
        
        setHeroImages([...heroImages, newImage].sort((a, b) => a.order - b.order));

        toast({
          title: "Success",
          description: "Hero image created successfully",
        });
      }

      setShowModal(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save hero image",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero image?")) return;

    try {
      // TODO: Delete API call
      // await fetch(`/api/v1/hero-images/${id}`, { method: 'DELETE' });
      
      setHeroImages(heroImages.filter(img => img._id !== id));
      
      toast({
        title: "Success",
        description: "Hero image deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete hero image",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string) => {
    try {
      // TODO: Update API call
      // await fetch(`/api/v1/hero-images/${id}/toggle-active`, { method: 'PATCH' });
      
      setHeroImages(heroImages.map(img => 
        img._id === id ? { ...img, isActive: !img.isActive } : img
      ));

      toast({
        title: "Success",
        description: "Hero image status updated",
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
            <h1 className="text-3xl font-display font-bold">Hero Section</h1>
            <p className="text-muted-foreground mt-1">
              Manage homepage hero banner images
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Hero Image
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : heroImages.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No hero images yet</p>
            <Button onClick={handleCreate} className="mt-4">
              Add First Image
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroImages.map((image, index) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "bg-card rounded-xl border overflow-hidden",
                  !image.isActive && "opacity-60"
                )}
              >
                <div className="relative aspect-video">
                  <img
                    src={image.imageUrl}
                    alt={image.title || "Hero image"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => toggleActive(image._id)}
                      className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                    >
                      {image.isActive ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="text-white">
                      <p className="text-sm font-semibold">Order: {image.order}</p>
                      {image.title && (
                        <p className="text-sm mt-1">{image.title}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(image)}
                      className="flex-1"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(image._id)}
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
                  {editingImage ? "Edit Hero Image" : "Add Hero Image"}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                  ✕
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hero Image *
                  </label>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    {previewImage && (
                      <div className="relative aspect-video rounded-lg overflow-hidden border">
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
                      value={formData.imageUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, imageUrl: e.target.value });
                        setPreviewImage(e.target.value);
                      }}
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title (Optional)
                  </label>
                  <Input
                    placeholder="e.g., Sacred Pilgrimages"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subtitle (Optional)
                  </label>
                  <Input
                    placeholder="e.g., Journey to Divine Destinations"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
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
                    Lower numbers appear first in the slideshow
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
                    {editingImage ? "Update" : "Create"}
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