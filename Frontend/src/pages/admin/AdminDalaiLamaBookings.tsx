// src/pages/admin/AdminDalaiLamaBookings.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";

interface DalaiLamaBooking {
  id: string;
  bookingId: string;
  customerName: string;
  email: string;
  phone: string;
  travelers: number;
  selectedDate: string;
  totalAmount?: number;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
  message?: string;
}

interface Stats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  avgBookingValue?: number;
}

interface FetchParams {
  page: number;
  limit: number;
  search: string;
  status?: string;
}

export default function AdminDalaiLamaBookings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<DalaiLamaBooking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [statusFilter, currentPage, searchQuery]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const params: FetchParams = {
        page: currentPage,
        limit: 10,
        search: searchQuery,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
      }

      const response = await axiosInstance.get('/dalai-lama-bookings', { params });
      
      if (response.data?.data?.bookings) {
        setBookings(response.data.data.bookings);
        setTotalPages(response.data.data.pagination?.pages || 1);
      }
    } catch (error: any) {
      if (error.response?.status !== 401) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch bookings",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/dalai-lama-bookings/admin/stats');
      if (response.data?.data) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await axiosInstance.patch(
        `/dalai-lama-bookings/${id}`,
        { status: newStatus }
      );

      if (response.status === 200) {
        toast({
          title: "Booking updated",
          description: `Status changed to ${newStatus}`,
        });
        fetchBookings();
        fetchStats();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update booking",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        await axiosInstance.delete(`/dalai-lama-bookings/${id}`);

        toast({
          title: "Booking deleted",
          description: "The booking has been removed",
        });
        fetchBookings();
        fetchStats();
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete booking",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === "confirmed") return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300";
    if (normalized === "pending") return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300";
    if (normalized === "cancelled") return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300";
    return "bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">🙏 Dalai Lama Darshan Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage pilgrimage bookings</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "confirmed", "cancelled"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.confirmedBookings}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.pendingBookings}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.cancelledBookings}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">₹{((stats.totalRevenue || 0) / 100000).toFixed(1)}L</p>
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Booking ID</th>
                  <th className="text-left p-4 font-semibold text-sm">Customer</th>
                  <th className="text-left p-4 font-semibold text-sm">Contact</th>
                  <th className="text-left p-4 font-semibold text-sm">Travelers</th>
                  <th className="text-left p-4 font-semibold text-sm">Travel Date</th>
                  <th className="text-left p-4 font-semibold text-sm">Amount</th>
                  <th className="text-left p-4 font-semibold text-sm">Status</th>
                  <th className="text-right p-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-sm text-primary">{booking.bookingId}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-sm">{booking.customerName}</p>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-xs text-muted-foreground">{booking.email}</p>
                          <p className="text-xs text-muted-foreground">{booking.phone}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-semibold">{booking.travelers}</span>
                      </td>
                      <td className="p-4 text-sm">{booking.selectedDate}</td>
                      <td className="p-4 font-semibold">
                        {booking.totalAmount != null
                          ? `₹${booking.totalAmount.toLocaleString()}`
                          : <span className="text-muted-foreground text-xs">—</span>
                        }
                      </td>
                      <td className="p-4">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className={cn(
                            "text-xs border rounded px-2 py-1 font-medium",
                            getStatusColor(booking.status)
                          )}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {booking.message && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title={booking.message}
                              onClick={() => {
                                toast({
                                  title: "Customer Message",
                                  description: booking.message,
                                });
                              }}
                            >
                              💬
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(booking.id)}
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}