// src/pages/admin/AdminHeroSection.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Eye, EyeOff, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5020";

interface HeroImage {
  _id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

// Helper function to get cookie
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Helper function to get auth token
const getAuthToken = (): string | null => {
  // First try localStorage
  const localToken = localStorage.getItem("token");
  if (localToken) {
    console.log("✅ Token found in localStorage");
    return localToken;
  }
  
  // Then try cookie
  const cookieToken = getCookie("jwt");
  if (cookieToken) {
    console.log("✅ Token found in cookie");
    return cookieToken;
  }
  
  console.error("❌ No token found in localStorage or cookie");
  return null;
};

export default function AdminHeroSection() {
  const { toast } = useToast();
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: "",
    title: "",
    subtitle: "",
    order: 1,
    isActive: true,
  });

  useEffect(() => {
    loadHeroImages();
  }, []);

  const loadHeroImages = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();

      if (!token) {
        console.error("❌ No token available for loadHeroImages");
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

      console.log("🔄 Fetching hero images with token...");

      const response = await fetch(`${API_URL}/api/v1/hero-images`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.error("❌ Authentication failed:", response.status);
          // Clear invalid token
          localStorage.removeItem("token");
          
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please login again.",
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
      console.log("✅ Hero images loaded:", data.results);
      
      if (data.status === "success") {
        setHeroImages(data.data.heroImages);
      }
    } catch (error: any) {
      console.error("❌ Error loading hero images:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load hero images",
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
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
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
        setFormData({ ...formData, imageUrl: result });
      };
      reader.readAsDataURL(file);

      toast({
        title: "Image Loaded",
        description: "Image preview created. For production, implement cloud upload (Cloudinary/AWS S3).",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      toast({
        title: "Error",
        description: "Please provide an image URL or upload an image",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const token = getAuthToken();

      if (!token) {
        console.error("❌ No token available for submit");
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

      const url = editingImage 
        ? `${API_URL}/api/v1/hero-images/${editingImage._id}`
        : `${API_URL}/api/v1/hero-images`;

      const method = editingImage ? 'PATCH' : 'POST';

      console.log(`🔄 ${method} request to:`, url);
      console.log("📤 Request data:", { ...formData, imageUrl: formData.imageUrl.substring(0, 50) + '...' });

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.error("❌ Authentication failed during submit:", response.status);
          // Clear invalid token
          localStorage.removeItem("token");
          
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please login again.",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 1500);
          return;
        }
        
        const errorData = await response.json();
        console.error("❌ Server error:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Operation successful:", data);

      if (data.status === "success") {
        if (editingImage) {
          setHeroImages(
            heroImages.map((img) =>
              img._id === editingImage._id ? data.data.heroImage : img
            ).sort((a, b) => a.order - b.order)
          );
          toast({
            title: "Success",
            description: "Hero image updated successfully",
          });
        } else {
          setHeroImages([...heroImages, data.data.heroImage].sort((a, b) => a.order - b.order));
          toast({
            title: "Success",
            description: "Hero image created successfully",
          });
        }
        setShowModal(false);
      }
    } catch (error: any) {
      console.error("❌ Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save hero image",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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

      const response = await fetch(`${API_URL}/api/v1/hero-images/${id}/toggle-active`, {
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
        setHeroImages(
          heroImages.map((img) =>
            img._id === id ? data.data.heroImage : img
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero image?")) {
      return;
    }

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

      const response = await fetch(`${API_URL}/api/v1/hero-images/${id}`, {
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
        setHeroImages(heroImages.filter((img) => img._id !== id));
        toast({
          title: "Success",
          description: "Hero image deleted successfully",
        });
      }
    } catch (error: any) {
      console.error("Error deleting hero image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete hero image",
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
            <h1 className="text-3xl font-bold">Hero Banner Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage homepage hero slider images
            </p>
          </div>
          <Button onClick={handleCreate} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add Hero Image
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading hero images...</p>
            </div>
          </div>
        ) : heroImages.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border-2 border-dashed">
            <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Hero Images Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first hero banner image to get started
            </p>
            <Button onClick={handleCreate}>
              <Plus className="w-5 h-5 mr-2" />
              Add First Hero Image
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroImages.map((image) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg overflow-hidden shadow-lg border"
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
                      title={image.isActive ? "Hide from homepage" : "Show on homepage"}
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
                      <p className="text-sm font-semibold">
                        Order: {image.order} | {image.isActive ? "Active" : "Inactive"}
                      </p>
                      {image.title && (
                        <p className="text-sm mt-1 font-medium">{image.title}</p>
                      )}
                      {image.subtitle && (
                        <p className="text-xs mt-0.5 text-white/80">{image.subtitle}</p>
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
              <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold">
                  {editingImage ? "Edit Hero Image" : "Add Hero Image"}
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
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hero Image *
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
                      disabled={isSaving}
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
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    maxLength={100}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Main heading displayed on the hero banner
                  </p>
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subtitle (Optional)
                  </label>
                  <Input
                    placeholder="e.g., Journey to Divine Destinations"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    maxLength={200}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Subheading displayed below the title
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
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 1 })
                    }
                    required
                    disabled={isSaving}
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
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4"
                    disabled={isSaving}
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium cursor-pointer"
                  >
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
                    ) : editingImage ? (
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