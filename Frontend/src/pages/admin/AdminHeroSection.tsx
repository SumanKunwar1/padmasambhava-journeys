// src/pages/admin/AdminHeroSection.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Smartphone,
  MousePointerClick,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { HeroCtaButton } from "@/components/home/HeroCtaButton";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios"; // ✅ Import the configured axios instance
import { compressImage, formatBytes, type CompressOptions } from "@/lib/image-compress";
import {
  createEmptyCta,
  DEFAULT_CTA_BG,
  DEFAULT_CTA_TEXT,
  HERO_CTA_URL_REGEX,
  HEX_COLOR_REGEX,
  type HeroCta,
  type HeroCtaStyle,
  type HeroImage,
} from "@/lib/hero-banner";

type ImageField = "imageUrl" | "mobileImageUrl";

interface HeroFormData {
  imageUrl: string;
  mobileImageUrl: string;
  title: string;
  subtitle: string;
  ctas: HeroCta[];
  order: number;
  isActive: boolean;
}

// Uploads are shrunk to these limits in the browser. Together the two images
// stay well under 1 MB once encoded, the default request limit of most
// production web servers.
const IMAGE_LIMITS: Record<ImageField, CompressOptions> = {
  imageUrl: { maxWidth: 1920, maxHeight: 1920, maxBytes: 400 * 1024 },
  mobileImageUrl: { maxWidth: 1080, maxHeight: 1350, maxBytes: 240 * 1024 },
};

// Quick picks next to the color pickers: brand green, amber, deep red, charcoal, white.
const COLOR_PRESETS = ["#188558", "#F59E0B", "#B91C1C", "#1F2937", "#FFFFFF"];

// <input type="color"> only understands 6-digit hex.
const toPickerHex = (value: string, fallback: string) => {
  if (!HEX_COLOR_REGEX.test(value)) return fallback;
  if (value.length === 4) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  return value;
};

export default function AdminHeroSection() {
  const { toast } = useToast();
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [formData, setFormData] = useState<HeroFormData>({
    imageUrl: "",
    mobileImageUrl: "",
    title: "",
    subtitle: "",
    ctas: [],
    order: 1,
    isActive: true,
  });

  useEffect(() => {
    loadHeroImages();
  }, []);

  const loadHeroImages = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 Fetching hero images...");

      // ✅ Use axios instance - it handles auth automatically
      const response = await axiosInstance.get('/hero-images');

      console.log("✅ Hero images loaded:", response.data.results);

      if (response.data.status === "success") {
        setHeroImages(response.data.data.heroImages);
      }
    } catch (error: any) {
      console.error("❌ Error loading hero images:", error);

      // Check if it's an auth error (axios interceptor handles 401)
      if (error.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message || "Failed to load hero images",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingImage(null);
    setFormData({
      imageUrl: "",
      mobileImageUrl: "",
      title: "",
      subtitle: "",
      ctas: [],
      order: heroImages.length + 1,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (image: HeroImage) => {
    setEditingImage(image);
    setFormData({
      imageUrl: image.imageUrl,
      mobileImageUrl: image.mobileImageUrl || "",
      title: image.title || "",
      subtitle: image.subtitle || "",
      ctas: (image.ctas || []).map((cta) => ({ ...createEmptyCta(), ...cta })),
      order: image.order,
      isActive: image.isActive,
    });
    setShowModal(true);
  };

  const handleImageUpload = (field: ImageField) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 20MB; the image is shrunk below before upload)
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 20MB",
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

      try {
        setIsProcessingImage(true);
        // Resize and re-encode in the browser. Sent as-is, a full-size photo
        // makes the save request too large and the server rejects it (413).
        const compressed = await compressImage(file, IMAGE_LIMITS[field]);
        setFormData((prev) => ({ ...prev, [field]: compressed.dataUrl }));

        toast({
          title: "Image ready",
          description: `Optimised from ${formatBytes(file.size)} to ${formatBytes(compressed.bytes)} (${compressed.width} × ${compressed.height} px).`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "The image could not be processed",
          variant: "destructive",
        });
      } finally {
        setIsProcessingImage(false);
        // Lets the same file be picked again after a failure.
        e.target.value = "";
      }
    }
  };

  const addCta = () => {
    setFormData((prev) => ({ ...prev, ctas: [...prev.ctas, createEmptyCta()] }));
  };

  const updateCta = (index: number, changes: Partial<HeroCta>) => {
    setFormData((prev) => ({
      ...prev,
      ctas: prev.ctas.map((cta, i) => (i === index ? { ...cta, ...changes } : cta)),
    }));
  };

  const removeCta = (index: number) => {
    setFormData((prev) => ({ ...prev, ctas: prev.ctas.filter((_, i) => i !== index) }));
  };

  const moveCta = (index: number, direction: -1 | 1) => {
    setFormData((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.ctas.length) return prev;
      const ctas = [...prev.ctas];
      [ctas[index], ctas[target]] = [ctas[target], ctas[index]];
      return { ...prev, ctas };
    });
  };

  // Buttons are optional: untouched rows are dropped, half-filled ones are reported.
  const validateCtas = (): { ctas: HeroCta[]; error?: string } => {
    const ctas: HeroCta[] = [];

    for (let i = 0; i < formData.ctas.length; i++) {
      const cta = formData.ctas[i];
      const label = cta.label.trim();
      const url = cta.url.trim();

      if (!label && !url) continue;
      if (!label || !url) {
        return { ctas, error: `Button ${i + 1} needs both a label and a link` };
      }
      if (!HERO_CTA_URL_REGEX.test(url)) {
        return {
          ctas,
          error: `Button ${i + 1} link must be a page path like /contact or a full URL like https://example.com`,
        };
      }
      if (!HEX_COLOR_REGEX.test(cta.bgColor) || !HEX_COLOR_REGEX.test(cta.textColor)) {
        return { ctas, error: `Button ${i + 1} colors must be hex values like #188558` };
      }

      ctas.push({ ...cta, label, url });
    }

    return { ctas };
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

    const { ctas, error } = validateCtas();
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const payload = { ...formData, ctas };

      // ✅ Use axios instance
      if (editingImage) {
        // Send an image only when it was actually replaced. Re-sending the
        // stored pictures on every small edit makes the request needlessly
        // large, and is what the server was rejecting.
        const { imageUrl, mobileImageUrl, ...changes } = payload;
        const update: Partial<HeroFormData> = { ...changes };
        if (imageUrl !== editingImage.imageUrl) update.imageUrl = imageUrl;
        if (mobileImageUrl !== (editingImage.mobileImageUrl || "")) update.mobileImageUrl = mobileImageUrl;

        await axiosInstance.patch(`/hero-images/${editingImage._id}`, update);
        toast({
          title: "Success",
          description: "Hero image updated successfully",
        });
      } else {
        await axiosInstance.post('/hero-images', payload);
        toast({
          title: "Success",
          description: "Hero image created successfully",
        });
      }

      setShowModal(false);
      loadHeroImages();
    } catch (error: any) {
      console.error("❌ Error saving hero image:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to save hero image",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      // ✅ Use axios instance
      await axiosInstance.patch(`/hero-images/${id}/toggle-active`);

      toast({
        title: "Success",
        description: "Hero image status updated",
      });

      loadHeroImages();
    } catch (error: any) {
      console.error("❌ Error toggling hero image:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero image?")) {
      return;
    }

    try {
      // ✅ Use axios instance
      await axiosInstance.delete(`/hero-images/${id}`);

      toast({
        title: "Success",
        description: "Hero image deleted successfully",
      });

      loadHeroImages();
    } catch (error: any) {
      console.error("❌ Error deleting hero image:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to delete hero image",
        variant: "destructive",
      });
    }
  };

  const previewCtas = formData.ctas.filter((cta) => cta.label.trim());

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hero Section Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage homepage hero banner images and slideshow
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Hero Image
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && heroImages.length === 0 && (
          <div className="bg-card rounded-lg border border-dashed border-border p-12 text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hero images yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first hero image to display on the homepage
            </p>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hero Image
            </Button>
          </div>
        )}

        {/* Hero Images Grid */}
        {!isLoading && heroImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroImages.map((image) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "bg-card rounded-lg border overflow-hidden transition-all hover:shadow-lg",
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

                <div className="p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-1",
                        image.mobileImageUrl
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Smartphone className="w-3 h-3" />
                      {image.mobileImageUrl ? "Mobile banner" : "No mobile banner"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-muted-foreground">
                      <MousePointerClick className="w-3 h-3" />
                      {image.ctas?.length || 0} {image.ctas?.length === 1 ? "button" : "buttons"}
                    </span>
                  </div>
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
              className="bg-card rounded-lg max-w-2xl w-full max-h-[90svh] overflow-y-auto"
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
                    Hero Image (Desktop) *
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload("imageUrl")}
                        className="cursor-pointer"
                        disabled={isSaving}
                        aria-label="Desktop banner image"
                      />
                      <Upload className="w-5 h-5 text-muted-foreground" />
                    </div>

                    {formData.imageUrl && (
                      <div className="relative aspect-video rounded-lg overflow-hidden border">
                        <img
                          src={formData.imageUrl}
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
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      disabled={isSaving}
                      aria-label="Desktop banner image URL"
                    />
                  </div>
                </div>

                {/* Mobile Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mobile Banner (Optional)
                  </label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Portrait image shown on phones instead of the desktop banner. Use a
                    4:5 image (e.g. 1080 × 1350 px). Leave empty to show the desktop banner on phones too.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-32 shrink-0">
                      <div className="relative aspect-[4/5] rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                        {formData.mobileImageUrl ? (
                          <img
                            src={formData.mobileImageUrl}
                            alt="Mobile preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center text-muted-foreground px-2">
                            <Smartphone className="w-6 h-6 mx-auto mb-1" />
                            <span className="text-[11px]">4:5</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload("mobileImageUrl")}
                        className="cursor-pointer"
                        disabled={isSaving}
                        aria-label="Mobile banner image"
                      />
                      <Input
                        placeholder="Or enter image URL: https://example.com/mobile.jpg"
                        value={formData.mobileImageUrl}
                        onChange={(e) => setFormData({ ...formData, mobileImageUrl: e.target.value })}
                        disabled={isSaving}
                        aria-label="Mobile banner image URL"
                      />
                      {formData.mobileImageUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData({ ...formData, mobileImageUrl: "" })}
                          disabled={isSaving}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove mobile banner
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="hero-title" className="block text-sm font-medium mb-2">
                    Main Tagline (Optional)
                  </label>
                  <Input
                    id="hero-title"
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
                  <label htmlFor="hero-subtitle" className="block text-sm font-medium mb-2">
                    Sub Line (Optional)
                  </label>
                  <Input
                    id="hero-subtitle"
                    placeholder="e.g., Journey to Divine Destinations"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    maxLength={200}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Subheading displayed below the main tagline
                  </p>
                </div>

                {/* CTA Buttons */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div>
                      <span className="block text-sm font-medium">Buttons (Optional)</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add as many call-to-action buttons as you need. Each one gets its own link and colors.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCta}
                      disabled={isSaving}
                      className="shrink-0"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Button
                    </Button>
                  </div>

                  {formData.ctas.length > 0 && (
                    <div className="space-y-3">
                      {formData.ctas.map((cta, index) => {
                        const n = index + 1;
                        return (
                          <div
                            key={index}
                            className="rounded-lg border border-border bg-muted/40 p-4 space-y-3"
                            data-testid={`hero-cta-row-${n}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold">Button {n}</span>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => moveCta(index, -1)}
                                  disabled={isSaving || index === 0}
                                  aria-label={`Move button ${n} up`}
                                >
                                  <ArrowUp />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => moveCta(index, 1)}
                                  disabled={isSaving || index === formData.ctas.length - 1}
                                  aria-label={`Move button ${n} down`}
                                >
                                  <ArrowDown />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => removeCta(index)}
                                  disabled={isSaving}
                                  aria-label={`Remove button ${n}`}
                                >
                                  <Trash2 />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium mb-1" htmlFor={`cta-label-${index}`}>
                                  Label
                                </label>
                                <Input
                                  id={`cta-label-${index}`}
                                  placeholder="e.g., Explore Trips"
                                  value={cta.label}
                                  onChange={(e) => updateCta(index, { label: e.target.value })}
                                  maxLength={40}
                                  disabled={isSaving}
                                  aria-label={`Button ${n} label`}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1" htmlFor={`cta-url-${index}`}>
                                  Link
                                </label>
                                <Input
                                  id={`cta-url-${index}`}
                                  placeholder="/group-trips or https://example.com"
                                  value={cta.url}
                                  onChange={(e) => updateCta(index, { url: e.target.value })}
                                  maxLength={500}
                                  disabled={isSaving}
                                  aria-label={`Button ${n} link`}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-medium mb-1" htmlFor={`cta-style-${index}`}>
                                  Style
                                </label>
                                <select
                                  id={`cta-style-${index}`}
                                  value={cta.style}
                                  onChange={(e) => updateCta(index, { style: e.target.value as HeroCtaStyle })}
                                  disabled={isSaving}
                                  aria-label={`Button ${n} style`}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <option value="solid">Filled</option>
                                  <option value="outline">Outline</option>
                                </select>
                              </div>

                              {(
                                [
                                  {
                                    key: "bgColor",
                                    title: cta.style === "outline" ? "Border color" : "Button color",
                                    name: "color",
                                    fallback: DEFAULT_CTA_BG,
                                  },
                                  { key: "textColor", title: "Text color", name: "text color", fallback: DEFAULT_CTA_TEXT },
                                ] as const
                              ).map((field) => (
                                <div key={field.key}>
                                  <span className="block text-xs font-medium mb-1">{field.title}</span>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={toPickerHex(cta[field.key], field.fallback)}
                                      onChange={(e) => updateCta(index, { [field.key]: e.target.value.toUpperCase() })}
                                      disabled={isSaving}
                                      aria-label={`Button ${n} ${field.name} picker`}
                                      className="h-10 w-10 shrink-0 cursor-pointer rounded-md border border-input bg-background p-1"
                                    />
                                    <Input
                                      value={cta[field.key]}
                                      onChange={(e) => updateCta(index, { [field.key]: e.target.value.trim() })}
                                      maxLength={7}
                                      disabled={isSaving}
                                      aria-label={`Button ${n} ${field.name}`}
                                      className={cn(
                                        "font-mono uppercase",
                                        !HEX_COLOR_REGEX.test(cta[field.key]) && "border-destructive"
                                      )}
                                    />
                                  </div>
                                  <div className="flex gap-1.5 mt-2">
                                    {COLOR_PRESETS.map((preset) => (
                                      <button
                                        key={preset}
                                        type="button"
                                        onClick={() => updateCta(index, { [field.key]: preset })}
                                        disabled={isSaving}
                                        title={preset}
                                        aria-label={`Set button ${n} ${field.name} to ${preset}`}
                                        className={cn(
                                          "h-5 w-5 rounded-full border border-border transition-transform hover:scale-110",
                                          cta[field.key].toUpperCase() === preset && "ring-2 ring-ring ring-offset-1"
                                        )}
                                        style={{ backgroundColor: preset }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`cta-newtab-${index}`}
                                checked={cta.openInNewTab}
                                onChange={(e) => updateCta(index, { openInNewTab: e.target.checked })}
                                className="w-4 h-4"
                                disabled={isSaving}
                              />
                              <label htmlFor={`cta-newtab-${index}`} className="text-xs font-medium cursor-pointer">
                                Open button {n} in a new tab (recommended for other websites)
                              </label>
                            </div>
                          </div>
                        );
                      })}

                      {/* Button preview, on a backdrop close to the real banner */}
                      {previewCtas.length > 0 && (
                        <div
                          className="rounded-lg p-5 bg-gradient-to-r from-charcoal via-slate-700 to-slate-500"
                          data-testid="hero-cta-preview"
                        >
                          <p className="text-[11px] uppercase tracking-widest text-white/60 mb-3">Preview</p>
                          <div className="flex flex-wrap gap-3">
                            {previewCtas.map((cta, index) => (
                              <HeroCtaButton key={index} cta={cta} preview />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
                <div className="flex gap-3 pt-4 pb-6 -mb-6 -mx-6 px-6 border-t sticky bottom-0 z-10 bg-card">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSaving || isProcessingImage}>
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
