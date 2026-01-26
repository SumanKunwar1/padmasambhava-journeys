// src/pages/admin/AdminTrips.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";

interface Trip {
  id: string;
  name: string;
  destination: string;
  category: string;
  duration: string;
  price: number;
  status: "Active" | "Inactive" | "Draft";
  bookings: number;
  image: string;
}

export default function AdminTrips() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading trips from API
    setTimeout(() => {
      const mockTrips: Trip[] = [
        {
          id: "1",
          name: "Spiti Valley Winter Expedition",
          destination: "Spiti Valley",
          category: "Domestic",
          duration: "7 Days / 6 Nights",
          price: 25000,
          status: "Active",
          bookings: 45,
          image: "/placeholder.jpg",
        },
        {
          id: "2",
          name: "Bhutan Cultural Tour",
          destination: "Bhutan",
          category: "International",
          duration: "5 Days / 4 Nights",
          price: 65000,
          status: "Active",
          bookings: 32,
          image: "/placeholder.jpg",
        },
        {
          id: "3",
          name: "Ladakh Adventure",
          destination: "Ladakh",
          category: "Domestic",
          duration: "6 Days / 5 Nights",
          price: 35000,
          status: "Active",
          bookings: 58,
          image: "/placeholder.jpg",
        },
        {
          id: "4",
          name: "Thailand Beach Escape",
          destination: "Thailand",
          category: "International",
          duration: "5 Days / 4 Nights",
          price: 45000,
          status: "Inactive",
          bookings: 12,
          image: "/placeholder.jpg",
        },
      ];
      setTrips(mockTrips);
      setLoading(false);
    }, 500);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      setTrips(trips.filter((trip) => trip.id !== id));
      toast({
        title: "Trip deleted",
        description: "The trip has been deleted successfully",
      });
    }
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || trip.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Domestic", "International", "Pilgrimage", "Weekend"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Trips Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage all your trip packages
            </p>
          </div>
          <Button onClick={() => navigate("/admin/trips/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Trip
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filterCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Trips</p>
            <p className="text-2xl font-bold">{trips.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Active Trips</p>
            <p className="text-2xl font-bold">
              {trips.filter((t) => t.status === "Active").length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <p className="text-2xl font-bold">
              {trips.reduce((sum, t) => sum + t.bookings, 0)}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Avg. Price</p>
            <p className="text-2xl font-bold">
              ₹{Math.round(trips.reduce((sum, t) => sum + t.price, 0) / trips.length).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Trips Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Trip Name</th>
                  <th className="text-left p-4 font-semibold text-sm">Category</th>
                  <th className="text-left p-4 font-semibold text-sm">Duration</th>
                  <th className="text-left p-4 font-semibold text-sm">Price</th>
                  <th className="text-left p-4 font-semibold text-sm">Bookings</th>
                  <th className="text-left p-4 font-semibold text-sm">Status</th>
                  <th className="text-right p-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredTrips.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No trips found
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map((trip, index) => (
                    <motion.tr
                      key={trip.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-semibold">{trip.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {trip.destination}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                          {trip.category}
                        </span>
                      </td>
                      <td className="p-4 text-sm">{trip.duration}</td>
                      <td className="p-4">
                        <span className="font-semibold">
                          ₹{trip.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4 text-sm">{trip.bookings}</td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            trip.status === "Active"
                              ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                              : trip.status === "Inactive"
                              ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                              : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                          )}
                        >
                          {trip.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/trip/${trip.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/trips/edit/${trip.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(trip.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}