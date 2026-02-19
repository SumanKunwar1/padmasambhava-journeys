// src/pages/admin/AdminTrendingDestinations.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Eye, EyeOff, Upload, Search, TrendingUp, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5020";

interface TrendingDestination {
  _id: string;
  name: string;
  price: number;
  image: string;
  url: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

interface Stats {
  totalDestinations: number;
  activeDestinations: number;
  inactiveDestinations: number;
  priceStats: {
    average: number;
    minimum: number;
    maximum: number;
  };
}

// ✅ FIX: reads 'adminToken' (set by AdminLogin.tsx), falls back to 'token'
const getAdminToken = (): string | null => {
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    null
  );
};

const authHeaders = () => {
  const token = getAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleAuthError = (status: number, toast: any) => {
  if (status === 401 || status === 403) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    toast({
      title: "Session Expired",
      description: "Please login again.",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/admin/login";
    }, 1500);
    return true;
  }
  return false;
};

export default function AdminTrendingDestinations() {
  const { toast } = useToast();

  // ── State ──────────────────────────────────────────────
  const [destinations, setDestinations] = useState<TrendingDestination[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ always starts empty
  const [showModal, setShowModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<TrendingDestination | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    image: "",
    url: "",
    order: 1,
    isActive: true,
  });

  // ── Load data on mount ────────────────────────────────
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    const token = getAdminToken();

    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to access this page",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 1500);
      return;
    }

    try {
      // Load destinations and stats in parallel
      const [destRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/trending-destinations`, {
          headers: authHeaders(),
          credentials: "include",
        }),
        fetch(`${API_URL}/api/v1/trending-destinations/admin/stats`, {
          headers: authHeaders(),
          credentials: "include",
        }),
      ]);

      // Handle destinations response
      if (!destRes.ok) {
        if (handleAuthError(destRes.status, toast)) return;
        throw new Error(`Failed to fetch destinations (${destRes.status})`);
      }

      const destData = await destRes.json();
      console.log("✅ Destinations API response:", destData);

      if (destData.status === "success") {
        const list: TrendingDestination[] = destData.data?.trendingDestinations ?? [];
        console.log(`✅ Loaded ${list.length} trending destinations`);
        setDestinations(list);
      } else {
        console.warn("⚠️ Unexpected response shape:", destData);
        setDestinations([]);
      }

      // Handle stats response (non-fatal if it fails)
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.status === "success") {
          setStats(statsData.data);
        }
      }
    } catch (err: any) {
      console.error("❌ Error loading trending destinations:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to load destinations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Derived: filtered list ────────────────────────────
  // ✅ FIX: simple, reliable filter — only on name, always starts with empty string
  const filteredDestinations = destinations.filter((d) =>
    searchQuery.trim() === ""
      ? true
      : d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Handlers ──────────────────────────────────────────
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

  const handleEdit = (dest: TrendingDestination) => {
    setEditingDestination(dest);
    setFormData({
      name: dest.name,
      price: dest.price,
      image: dest.image,
      url: dest.url,
      order: dest.order,
      isActive: dest.isActive,
    });
    setPreviewImage(dest.image);
    setShowModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Image must be under 5MB", variant: "destructive" });
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      setFormData((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.image || !formData.url) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    if (formData.price < 0) {
      toast({ title: "Error", description: "Price cannot be negative", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      const url = editingDestination
        ? `${API_URL}/api/v1/trending-destinations/${editingDestination._id}`
        : `${API_URL}/api/v1/trending-destinations`;

      const response = await fetch(url, {
        method: editingDestination ? "PATCH" : "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (handleAuthError(response.status, toast)) return;
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Error ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        if (editingDestination) {
          setDestinations((prev) =>
            prev
              .map((d) => (d._id === editingDestination._id ? data.data.trendingDestination : d))
              .sort((a, b) => a.order - b.order)
          );
          toast({ title: "Success", description: "Destination updated successfully" });
        } else {
          setDestinations((prev) =>
            [...prev, data.data.trendingDestination].sort((a, b) => a.order - b.order)
          );
          toast({ title: "Success", description: "Destination created successfully" });
        }
        setShowModal(false);
        // Refresh stats after create/update
        loadStats();
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to save destination", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    try {
      const response = await fetch(`${API_URL}/api/v1/trending-destinations/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        if (handleAuthError(response.status, toast)) return;
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        setDestinations((prev) => prev.filter((d) => d._id !== id));
        toast({ title: "Success", description: "Destination deleted successfully" });
        loadStats();
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to delete destination", variant: "destructive" });
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/trending-destinations/${id}/toggle-active`, {
        method: "PATCH",
        headers: authHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        if (handleAuthError(response.status, toast)) return;
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        setDestinations((prev) =>
          prev.map((d) => (d._id === id ? data.data.trendingDestination : d))
        );
        toast({ title: "Success", description: data.message });
        loadStats();
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update status", variant: "destructive" });
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/trending-destinations/admin/stats`, {
        headers: authHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === "success") setStats(data.data);
      }
    } catch (_) {}
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Trending Destinations</h1>
            <p className="text-muted-foreground mt-1">
              Manage trending destination cards
            </p>
          </div>
          <Button onClick={handleCreate} size="lg" className="bg-primary text-primary-foreground">
            <Plus className="w-5 h-5 mr-2" />
            Add Destination
          </Button>
        </div>

        {/* ── Search ── */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold mt-1">{stats?.totalDestinations ?? destinations.length}</p>
          </div>
          <div className="bg-card border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats?.activeDestinations ?? destinations.filter((d) => d.isActive).length}
            </p>
          </div>
          <div className="bg-card border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Inactive</p>
            <p className="text-2xl font-bold text-red-500 mt-1">
              {stats?.inactiveDestinations ?? destinations.filter((d) => !d.isActive).length}
            </p>
          </div>
          <div className="bg-card border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Avg Price</p>
            <p className="text-2xl font-bold mt-1">
              {stats?.priceStats?.average
                ? `₹${stats.priceStats.average.toLocaleString("en-IN")}`
                : "—"}
            </p>
          </div>
        </div>

        {/* ── Content ── */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="mt-4 text-muted-foreground">Loading destinations...</p>
            </div>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border-2 border-dashed">
            <TrendingUp className="w-14 h-14 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-semibold text-muted-foreground">
              {destinations.length === 0
                ? "No destinations yet. Click \"Add Destination\" to create one."
                : `No destinations match "${searchQuery}"`}
            </p>
            {destinations.length === 0 && (
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add First Destination
              </Button>
            )}
            {destinations.length > 0 && searchQuery && (
              <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDestinations.map((dest, index) => (
              <motion.div
                key={dest._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow",
                  !dest.isActive && "opacity-60"
                )}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  {dest.image ? (
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      No Image
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-semibold",
                        dest.isActive
                          ? "bg-green-500/90 text-white"
                          : "bg-gray-500/90 text-white"
                      )}
                    >
                      {dest.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Order badge */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                      #{dest.order}
                    </span>
                  </div>

                  {/* Action overlay buttons */}
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <button
                      onClick={() => toggleActive(dest._id)}
                      title={dest.isActive ? "Deactivate" : "Activate"}
                      className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-colors"
                    >
                      {dest.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(dest)}
                      title="Edit"
                      className="p-1.5 bg-blue-500/80 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(dest._id)}
                      title="Delete"
                      className="p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="font-semibold text-sm line-clamp-1">{dest.name}</p>
                  <div className="flex items-center gap-1 mt-1 text-primary font-bold text-sm">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {dest.price.toLocaleString("en-IN")}
                  </div>
                  <a
                    href={dest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:underline mt-1 block truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {dest.url}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Debug info (only shown in dev) ── */}
        {import.meta.env.DEV && (
          <div className="text-xs text-muted-foreground bg-muted rounded p-2 font-mono">
            destinations.length: {destinations.length} | filtered: {filteredDestinations.length} | search: "{searchQuery}"
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
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

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Destination Name *</label>
                <Input
                  placeholder="e.g., Bali"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                  disabled={isSaving}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Price (₹) *</label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g., 20000"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))
                  }
                  required
                  disabled={isSaving}
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Destination Image *</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                      disabled={isSaving}
                    />
                    <Upload className="w-5 h-5 text-muted-foreground shrink-0" />
                  </div>
                  {previewImage && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border max-h-40">
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">Or paste an image URL:</p>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, image: e.target.value }));
                      setPreviewImage(e.target.value);
                    }}
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Destination URL *</label>
                <Input
                  placeholder="/trip/bali-tour or https://example.com"
                  value={formData.url}
                  onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))}
                  required
                  disabled={isSaving}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Internal path (e.g., /trip/bali) or full external URL
                </p>
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Display Order *</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, order: parseInt(e.target.value) || 1 }))
                  }
                  required
                  disabled={isSaving}
                />
                <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first</p>
              </div>

              {/* Active */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
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
    </AdminLayout>
  );
}