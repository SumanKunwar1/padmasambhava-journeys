// src/pages/admin/AdminAgentBookings.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Eye, X, Check, Clock, Building2, User, Phone, Mail, Calendar, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";

interface AgentBooking {
  _id: string;
  bookingId: string;
  tripName: string;
  customerName: string;
  email: string;
  phone: string;
  travelers: number;
  totalAmount: number;
  selectedDate?: string;
  occupancyType?: string;
  selectedPrice?: number;
  status: "Confirmed" | "Pending" | "Cancelled";
  createdAt: string;
  // Agent info
  agentName?: string;
  agentEmail?: string;
  agentCompany?: string;
  agentId?: {
    fullName: string;
    companyName: string;
    email: string;
    agentId: string;
    commissionRate: number;
  };
  // Trip info (populated)
  agentTripId?: {
    name: string;
    destination: string;
    duration: string;
    b2bPrice: number;
    price: number;
  };
  message?: string;
}

interface Stats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  avgBookingValue: number;
}

export default function AdminAgentBookings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<AgentBooking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<AgentBooking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [statusFilter, currentPage, searchQuery]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params: any = { page: currentPage, limit: 10, search: searchQuery };
      if (statusFilter !== "all") {
        params.status = statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
      }
      const response = await axiosInstance.get("/agent-bookings", { params });
      if (response.data?.data?.bookings) {
        setBookings(response.data.data.bookings);
        setTotalPages(response.data.data.pagination?.pages || 1);
      }
    } catch (error: any) {
      if (error.response?.status !== 401) {
        toast({ title: "Error", description: "Failed to fetch agent bookings", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/agent-bookings/stats");
      if (response.data?.data) setStats(response.data.data);
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      setUpdatingStatus(id);
      await axiosInstance.patch(`/agent-bookings/${id}`, { status });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: status as any } : b))
      );
      if (selectedBooking?._id === id) {
        setSelectedBooking((prev) => prev ? { ...prev, status: status as any } : null);
      }
      toast({ title: "Status Updated", description: `Booking marked as ${status}` });
      fetchStats();
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axiosInstance.delete(`/agent-bookings/${id}`);
      toast({ title: "Deleted", description: "Booking deleted successfully" });
      setBookings((prev) => prev.filter((b) => b._id !== id));
      if (isDetailOpen && selectedBooking?._id === id) setIsDetailOpen(false);
      fetchStats();
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to delete booking", variant: "destructive" });
    }
  };

  const openDetail = (booking: AgentBooking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "confirmed") return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    if (s === "pending") return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    if (s === "cancelled") return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold">Agent Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage all B2B bookings submitted by travel agents</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Total", value: stats.totalBookings, color: "" },
              { label: "Confirmed", value: stats.confirmedBookings, color: "text-green-600" },
              { label: "Pending", value: stats.pendingBookings, color: "text-amber-600" },
              { label: "Cancelled", value: stats.cancelledBookings, color: "text-red-600" },
              { label: "Revenue (B2B)", value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, color: "text-primary" },
              { label: "Avg Value", value: `₹${(stats.avgBookingValue || 0).toLocaleString()}`, color: "" },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={cn("text-2xl font-bold mt-1", s.color)}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer, agent, trip, booking ID..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "confirmed", "cancelled"].map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                size="sm"
                onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Booking ID</th>
                  <th className="text-left p-4 font-semibold text-sm">Customer</th>
                  <th className="text-left p-4 font-semibold text-sm">Trip</th>
                  <th className="text-left p-4 font-semibold text-sm">Agent</th>
                  <th className="text-left p-4 font-semibold text-sm">Amount</th>
                  <th className="text-left p-4 font-semibold text-sm">Date</th>
                  <th className="text-left p-4 font-semibold text-sm">Status</th>
                  <th className="text-right p-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-muted-foreground">
                      No agent bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking, index) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="p-4">
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {booking.bookingId}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-sm">{booking.customerName}</p>
                        <p className="text-xs text-muted-foreground">{booking.email}</p>
                        <p className="text-xs text-muted-foreground">{booking.phone}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium line-clamp-1">{booking.tripName}</p>
                        {booking.occupancyType && (
                          <p className="text-xs text-muted-foreground">{booking.occupancyType}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{booking.travelers} traveler{booking.travelers > 1 ? "s" : ""}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium">
                          {booking.agentId?.fullName || booking.agentName || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.agentId?.companyName || booking.agentCompany || ""}
                        </p>
                        {booking.agentId?.agentId && (
                          <span className="text-xs font-mono text-primary">{booking.agentId.agentId}</span>
                        )}
                      </td>
                      <td className="p-4 font-semibold">₹{booking.totalAmount.toLocaleString()}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={cn("px-2 py-1 rounded text-xs font-medium", getStatusColor(booking.status))}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openDetail(booking)} title="View details">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {booking.status === "Pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusUpdate(booking._id, "Confirmed")}
                              disabled={updatingStatus === booking._id}
                              title="Confirm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          {booking.status !== "Cancelled" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusUpdate(booking._id, "Cancelled")}
                              disabled={updatingStatus === booking._id}
                              title="Cancel"
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            >
                              <Clock className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(booking._id)}
                            title="Delete"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <Button variant="outline" size="sm" disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Previous</Button>
              <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Slide-over */}
      {isDetailOpen && selectedBooking && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsDetailOpen(false)} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-background border-l border-border z-50 flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <div>
                <h2 className="text-lg font-bold">Booking Details</h2>
                <span className="text-sm font-mono text-primary">{selectedBooking.bookingId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getStatusColor(selectedBooking.status))}>
                  {selectedBooking.status}
                </span>
                <button onClick={() => setIsDetailOpen(false)} className="p-2 hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Customer</h3>
                <div className="space-y-1.5 text-sm">
                  <p className="font-medium">{selectedBooking.customerName}</p>
                  <p className="text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{selectedBooking.email}</p>
                  <p className="text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{selectedBooking.phone}</p>
                </div>
              </div>

              {/* Agent */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Building2 className="w-4 h-4" /> Agent</h3>
                <div className="space-y-1.5 text-sm">
                  <p className="font-medium">{selectedBooking.agentId?.fullName || selectedBooking.agentName || "Unknown Agent"}</p>
                  <p className="text-muted-foreground">{selectedBooking.agentId?.companyName || selectedBooking.agentCompany || ""}</p>
                  <p className="text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{selectedBooking.agentId?.email || selectedBooking.agentEmail || ""}</p>
                  {selectedBooking.agentId?.agentId && (
                    <p className="font-mono text-xs text-primary">{selectedBooking.agentId.agentId}</p>
                  )}
                  {selectedBooking.agentId?.commissionRate && (
                    <p className="text-xs text-green-600 font-medium">Commission: {selectedBooking.agentId.commissionRate}%</p>
                  )}
                </div>
              </div>

              {/* Trip + Booking Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" /> Trip & Booking</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Trip</span><span className="font-medium text-right max-w-[60%]">{selectedBooking.tripName}</span></div>
                  {selectedBooking.selectedDate && (
                    <div className="flex justify-between"><span className="text-muted-foreground">Departure</span><span className="font-medium">{selectedBooking.selectedDate}</span></div>
                  )}
                  {selectedBooking.occupancyType && (
                    <div className="flex justify-between"><span className="text-muted-foreground">Room Type</span><span className="font-medium">{selectedBooking.occupancyType}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-muted-foreground">Travelers</span><span className="font-medium">{selectedBooking.travelers}</span></div>
                  {selectedBooking.selectedPrice && (
                    <div className="flex justify-between"><span className="text-muted-foreground">B2B Price/Person</span><span className="font-medium">₹{selectedBooking.selectedPrice.toLocaleString()}</span></div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-border font-semibold">
                    <span>Total (B2B)</span>
                    <span className="text-primary">₹{selectedBooking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedBooking.message && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold mb-2">Message / Notes</h3>
                  <p className="text-sm text-muted-foreground">{selectedBooking.message}</p>
                </div>
              )}

              {/* Submitted */}
              <p className="text-xs text-muted-foreground text-center">
                Submitted on {new Date(selectedBooking.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Drawer Footer - Status Actions */}
            <div className="border-t border-border p-4 shrink-0 space-y-2">
              <p className="text-xs text-muted-foreground text-center mb-3">Update Status</p>
              <div className="grid grid-cols-3 gap-2">
                {["Pending", "Confirmed", "Cancelled"].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={selectedBooking.status === s ? "default" : "outline"}
                    className={cn(
                      "w-full text-xs",
                      selectedBooking.status === s && s === "Confirmed" && "bg-green-600 hover:bg-green-700",
                      selectedBooking.status === s && s === "Cancelled" && "bg-red-600 hover:bg-red-700",
                    )}
                    disabled={updatingStatus === selectedBooking._id || selectedBooking.status === s}
                    onClick={() => handleStatusUpdate(selectedBooking._id, s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full mt-2"
                onClick={() => handleDelete(selectedBooking._id)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Booking
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AdminLayout>
  );
}