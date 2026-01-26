// src/pages/admin/AdminBlogs.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";

interface Blog {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  status: "Published" | "Draft";
  views: number;
}

export default function AdminBlogs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const blogs: Blog[] = [
    {
      id: "1",
      title: "Top 10 Sacred Buddhist Monasteries You Must Visit",
      category: "Pilgrimage",
      author: "Admin",
      date: "2026-01-20",
      status: "Published",
      views: 1250,
    },
    {
      id: "2",
      title: "Complete Guide to Spiti Valley Trip",
      category: "Travel Guide",
      author: "Admin",
      date: "2026-01-18",
      status: "Published",
      views: 980,
    },
    {
      id: "3",
      title: "Solo Travel Safety Tips for Women",
      category: "Travel Tips",
      author: "Admin",
      date: "2026-01-15",
      status: "Draft",
      views: 0,
    },
  ];

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      toast({
        title: "Blog deleted",
        description: "The blog has been deleted successfully",
      });
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Blogs Management</h1>
            <p className="text-muted-foreground mt-1">Manage all blog posts</p>
          </div>
          <Button onClick={() => navigate("/admin/blogs/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Blog
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Blogs</p>
            <p className="text-2xl font-bold">{blogs.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Published</p>
            <p className="text-2xl font-bold">
              {blogs.filter((b) => b.status === "Published").length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Drafts</p>
            <p className="text-2xl font-bold">
              {blogs.filter((b) => b.status === "Draft").length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Views</p>
            <p className="text-2xl font-bold">
              {blogs.reduce((sum, b) => sum + b.views, 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Title</th>
                  <th className="text-left p-4 font-semibold text-sm">Category</th>
                  <th className="text-left p-4 font-semibold text-sm">Author</th>
                  <th className="text-left p-4 font-semibold text-sm">Date</th>
                  <th className="text-left p-4 font-semibold text-sm">Views</th>
                  <th className="text-left p-4 font-semibold text-sm">Status</th>
                  <th className="text-right p-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog, index) => (
                  <motion.tr
                    key={blog.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-4 font-medium">{blog.title}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {blog.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{blog.author}</td>
                    <td className="p-4 text-sm">{blog.date}</td>
                    <td className="p-4 text-sm">{blog.views.toLocaleString()}</td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          blog.status === "Published"
                            ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                            : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                        )}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(blog.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}