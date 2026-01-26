// src/pages/admin/AdminBlogForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    category: "Travel Guide",
    excerpt: "",
    content: "",
    author: "Admin",
    readTime: "",
    status: "Draft",
    image: "",
  });

  useEffect(() => {
    if (isEdit) {
      setFormData({
        title: "Complete Guide to Spiti Valley Trip",
        category: "Travel Guide",
        excerpt: "Everything you need to know before embarking on a Spiti Valley adventure...",
        content: "Spiti Valley is one of the most beautiful destinations...",
        author: "Admin",
        readTime: "8 min read",
        status: "Published",
        image: "",
      });
    }
  }, [id, isEdit]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: isEdit ? "Blog updated" : "Blog created",
      description: `Blog has been ${isEdit ? "updated" : "created"} successfully`,
    });

    navigate("/admin/blogs");
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/blogs")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold">
              {isEdit ? "Edit Blog" : "Create New Blog"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEdit ? "Update blog post" : "Write a new blog post"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  required
                >
                  <option value="Travel Guide">Travel Guide</option>
                  <option value="Travel Tips">Travel Tips</option>
                  <option value="Pilgrimage">Pilgrimage</option>
                  <option value="International">International</option>
                  <option value="Food & Travel">Food & Travel</option>
                  <option value="Photography">Photography</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <Input
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Read Time</label>
                <Input
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 min read"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Excerpt *</label>
              <Textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief description of the blog post..."
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content *</label>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your blog content here..."
                rows={12}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Featured Image</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {isEdit ? "Update Blog" : "Create Blog"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/blogs")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}