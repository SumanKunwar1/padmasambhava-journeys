// src/pages/admin/AdminUsers.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Edit, Trash2, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: "User" | "Admin";
  status: "Active" | "Inactive";
  joinDate: string;
  totalBookings: number;
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const users: User[] = [
    {
      id: "1",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
      location: "Delhi, India",
      role: "User",
      status: "Active",
      joinDate: "2025-12-10",
      totalBookings: 3,
    },
    {
      id: "2",
      name: "Priya Patel",
      email: "priya@example.com",
      phone: "+91 98765 43211",
      location: "Mumbai, India",
      role: "User",
      status: "Active",
      joinDate: "2026-01-05",
      totalBookings: 1,
    },
    {
      id: "3",
      name: "Amit Kumar",
      email: "amit@example.com",
      phone: "+91 98765 43212",
      location: "Bangalore, India",
      role: "User",
      status: "Active",
      joinDate: "2025-11-20",
      totalBookings: 5,
    },
  ];

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully",
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Users Management</h1>
            <p className="text-muted-foreground mt-1">Manage all registered users</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Active Users</p>
            <p className="text-2xl font-bold">
              {users.filter((u) => u.status === "Active").length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <p className="text-2xl font-bold">
              {users.reduce((sum, u) => sum + u.totalBookings, 0)}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">New This Month</p>
            <p className="text-2xl font-bold">2</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <span
                    className={cn(
                      "inline-block px-2 py-1 rounded text-xs font-medium mt-1",
                      user.status === "Active"
                        ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                    )}
                  >
                    {user.status}
                  </span>
                </div>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                  {user.role}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Bookings</p>
                  <p className="text-lg font-bold">{user.totalBookings}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}