// src/pages/admin/AdminBookings.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Download, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { bookingService } from "@/services/bookings";
import { cn } from "@/lib/utils";

interface Booking {
  _id: string;
  bookingId: string;
  customerName: string;
  email: string;
  phone: string;
  tripName: string;
  tripId?: {
    _id: string;
    name: string;
    destination: string;
  };
  travelers: number;
  selectedDate?: string;
  totalAmount: number;
  status: "Confirmed" | "Pending" | "Cancelled";
  message?: string;
  createdAt: string;
}

export default function AdminBookings() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadBookings();
    loadStats();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchQuery, filterStatus, bookings]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const response = await bookingService.getAllBookings();
      
      let bookingsData: Booking[] = [];
      if (response.data?.bookings) {
        bookingsData = response.data.bookings;
      } else if (Array.isArray(response.data)) {
        bookingsData = response.data;
      }
      
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
    } catch (error: any) {
      console.error("Error loading bookings:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load bookings",
        variant: "destructive",
      });
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await bookingService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const filterBookings = () => {
    if (!Array.isArray(bookings)) {
      setFilteredBookings([]);
      return;
    }

    let filtered = bookings;

    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.bookingId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.tripName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== "All") {
      filtered = filtered.filter((booking) => booking.status === filterStatus);
    }

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (id: string, newStatus: "Confirmed" | "Pending" | "Cancelled") => {
    try {
      await bookingService.updateBooking(id, { status: newStatus });

      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}`,
      });

      await loadBookings();
      await loadStats();
      
      if (selectedBooking?._id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      await bookingService.deleteBooking(id);

      toast({
        title: "Deleted",
        description: "Booking deleted successfully",
      });

      await loadBookings();
      await loadStats();
      
      if (selectedBooking?._id === id) {
        setShowDetailsModal(false);
        setSelectedBooking(null);
      }
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  const openDetailsModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const statusOptions = ["All", "Confirmed", "Pending", "Cancelled"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300";
      case "Pending":
        return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300";
      case "Cancelled":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Bookings Management</h1>
          <p className="text-muted-foreground mt-1">View and manage all bookings</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {statusOptions.map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <p className="text-2xl font-bold">{stats?.totalBookings || bookings.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <p className="text-2xl font-bold">
              {stats?.confirmedBookings || bookings.filter((b) => b.status === "Confirmed").length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">
              ₹{((stats?.totalRevenue || 0) / 100000).toFixed(1)}L
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Avg. Booking Value</p>
            <p className="text-2xl font-bold">
              ₹{(stats?.avgBookingValue || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              Loading bookings...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No bookings found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm">Booking ID</th>
                    <th className="text-left p-4 font-semibold text-sm">Customer</th>
                    <th className="text-left p-4 font-semibold text-sm">Trip</th>
                    <th className="text-left p-4 font-semibold text-sm">Travelers</th>
                    <th className="text-left p-4 font-semibold text-sm">Trip Date</th>
                    <th className="text-left p-4 font-semibold text-sm">Amount</th>
                    <th className="text-left p-4 font-semibold text-sm">Status</th>
                    <th className="text-right p-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, index) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4">
                        <span className="font-mono text-sm font-semibold">
                          {booking.bookingId}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-xs text-muted-foreground">{booking.email}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{booking.tripName}</td>
                      <td className="p-4 text-sm">{booking.travelers}</td>
                      <td className="p-4 text-sm">
                        {booking.selectedDate || new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold">
                          ₹{booking.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            getStatusColor(booking.status)
                          )}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openDetailsModal(booking)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteBooking(booking._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Booking Details</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedBooking.bookingId}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailsModal(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{selectedBooking.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{selectedBooking.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{selectedBooking.phone}</span>
                  </div>
                </div>
              </div>

              {/* Trip Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Trip Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trip:</span>
                    <span className="font-medium">{selectedBooking.tripName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Travelers:</span>
                    <span className="font-medium">{selectedBooking.travelers}</span>
                  </div>
                  {selectedBooking.selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Travel Date:</span>
                      <span className="font-medium">{selectedBooking.selectedDate}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-bold text-lg">₹{selectedBooking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedBooking.message && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Special Requests</h3>
                  <p className="text-sm bg-muted p-4 rounded-lg">{selectedBooking.message}</p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Update Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {["Pending", "Confirmed", "Cancelled"].map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedBooking.status === status ? "default" : "outline"}
                      onClick={() => updateBookingStatus(selectedBooking._id, status as any)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Delete Button */}
              <div className="pt-4 border-t border-border">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => deleteBooking(selectedBooking._id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Booking
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}