// src/pages/admin/AdminBookings.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Trash2,
  Check,
  X,
  RotateCcw,
  Phone,
  Mail,
  MessageCircle,
  Users,
  CalendarDays,
  CalendarCheck,
  Clock,
  XCircle,
  Wallet,
  ClipboardList,
  Eye,
  ExternalLink,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminPagination, ADMIN_PAGE_SIZE } from "@/components/admin/AdminPagination";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/currency";
import axiosInstance from "@/lib/axios";

interface Booking {
  _id: string;
  bookingId?: string;
  customerName: string;
  email: string;
  phone: string;
  message?: string;
  whatsapp?: string;
  pickupLocation?: string;
  meditationRequired?: boolean;
  tripName: string;
  // Populated by the API; null when the trip has since been deleted.
  tripId?: { _id: string } | string | null;
  travelers: number;
  selectedPrice?: number;
  totalAmount: number;
  status: "Confirmed" | "Pending" | "Cancelled";
  createdAt: string;
  selectedDate?: string;
}

interface Stats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
}

interface FetchParams {
  page: number;
  limit: number;
  search: string;
  status?: string;
}

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled";

const STATUS_STYLES: Record<Booking["status"], { pill: string; dot: string }> = {
  Confirmed: {
    pill: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300",
    dot: "bg-green-500",
  },
  Pending: {
    pill: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  Cancelled: {
    pill: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
    dot: "bg-red-500",
  },
};

// Bookings are stored in Indian Rupees, like every price in the database.
const formatAmount = (amount: number) => formatPrice(amount || 0, "INR");

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";

const dialable = (phone: string) => phone.replace(/[^\d+]/g, "");

function StatusPill({ status }: { status: Booking["status"] }) {
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.Pending;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", styles.pill)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
      {status}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-card rounded-xl border border-border p-4">
      <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", tone)}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold leading-tight truncate" title={String(value)}>
          {value}
        </p>
      </div>
    </div>
  );
}

function PhoneLink({ phone }: { phone: string }) {
  if (!phone) return <span className="text-muted-foreground">—</span>;
  return (
    <a
      href={`tel:${dialable(phone)}`}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1.5 font-medium whitespace-nowrap hover:text-primary transition-colors"
    >
      <Phone className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
      {phone}
    </a>
  );
}

export default function AdminBookings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  // Which row is mid-update, so its buttons cannot be double-clicked.
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);

  // Wait for a pause in typing before asking the server, and start a new
  // search from its first page of results.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [statusFilter, currentPage, searchQuery]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const params: FetchParams = {
        page: currentPage,
        limit: ADMIN_PAGE_SIZE,
        search: searchQuery,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
      }

      const response = await axiosInstance.get('/bookings', { params });

      if (response.data?.data?.bookings) {
        setBookings(response.data.data.bookings);
        setTotalPages(response.data.data.pagination?.pages || 1);
        setTotalItems(response.data.data.pagination?.total ?? response.data.data.bookings.length);
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
      const response = await axiosInstance.get('/bookings/admin/stats');

      if (response.data?.data) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleStatusChange = async (
    booking: Booking,
    nextStatus: Booking["status"]
  ) => {
    if (booking.status === nextStatus) return;

    // Cancelling is the one that is awkward to walk back for a customer, so it
    // is the only transition that asks first.
    if (
      nextStatus === "Cancelled" &&
      !confirm(
        `Cancel ${booking.customerName}'s booking for ${booking.tripName}?`
      )
    ) {
      return;
    }

    setUpdatingId(booking._id);

    // Update the row immediately; the refetch below is the source of truth, but
    // without this the badge sits on the old status for the whole round trip.
    const previousStatus = booking.status;
    setBookings((prev) =>
      prev.map((item) =>
        item._id === booking._id ? { ...item, status: nextStatus } : item
      )
    );

    try {
      await axiosInstance.patch(`/bookings/${booking._id}`, {
        status: nextStatus,
      });

      toast({
        title: `Booking ${nextStatus.toLowerCase()}`,
        description: `${booking.customerName}'s booking is now ${nextStatus.toLowerCase()}.`,
      });
      fetchBookings();
      fetchStats();
    } catch (error: any) {
      // Put the old status back so the table never shows a change that failed.
      setBookings((prev) =>
        prev.map((item) =>
          item._id === booking._id ? { ...item, status: previousStatus } : item
        )
      );
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update booking status",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      await axiosInstance.delete(`/bookings/${id}`);

      toast({
        title: "Booking deleted",
        description: "The booking has been deleted successfully",
      });
      setViewingId(null);
      fetchBookings();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  const filters: { value: StatusFilter; label: string; count?: number }[] = [
    { value: "all", label: "All", count: stats?.totalBookings },
    { value: "pending", label: "Pending", count: stats?.pendingBookings },
    { value: "confirmed", label: "Confirmed", count: stats?.confirmedBookings },
    { value: "cancelled", label: "Cancelled", count: stats?.cancelledBookings },
  ];

  // Looked up from the list each render, so the dialog follows status changes.
  const viewing = bookings.find((booking) => booking._id === viewingId) ?? null;
  const viewingTripId =
    viewing?.tripId && typeof viewing.tripId === "object" ? viewing.tripId._id : (viewing?.tripId as string | undefined);

  const statusActions = (booking: Booking, withLabels: boolean) => (
    <>
      {booking.status !== "Confirmed" && (
        <Button
          variant="outline"
          size="sm"
          disabled={updatingId === booking._id}
          onClick={() => handleStatusChange(booking, "Confirmed")}
          className="border-green-600/40 text-green-700 hover:bg-green-50 hover:text-green-800 dark:text-green-300"
          title="Confirm booking"
        >
          <Check />
          <span className={cn(!withLabels && "hidden 2xl:inline")}>Confirm</span>
        </Button>
      )}

      {booking.status !== "Cancelled" && (
        <Button
          variant="outline"
          size="sm"
          disabled={updatingId === booking._id}
          onClick={() => handleStatusChange(booking, "Cancelled")}
          className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          title="Cancel booking"
        >
          <X />
          <span className={cn(!withLabels && "hidden 2xl:inline")}>Cancel</span>
        </Button>
      )}

      {booking.status !== "Pending" && (
        <Button
          variant="ghost"
          size="sm"
          disabled={updatingId === booking._id}
          onClick={() => handleStatusChange(booking, "Pending")}
          title="Move back to pending"
        >
          <RotateCcw />
          {withLabels && <span>Mark pending</span>}
        </Button>
      )}
    </>
  );

  const emptyState = (
    <div className="px-6 py-14 text-center">
      <ClipboardList className="w-11 h-11 text-muted-foreground mx-auto mb-3" />
      <p className="font-semibold">No bookings found</p>
      <p className="text-sm text-muted-foreground mt-1">
        {searchQuery || statusFilter !== "all"
          ? "Try a different search or status filter."
          : "New booking requests will appear here."}
      </p>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Bookings</h1>
          <p className="text-muted-foreground mt-1">Review booking requests, contact customers and update their status</p>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <StatCard icon={ClipboardList} label="Total Bookings" value={stats.totalBookings} tone="bg-primary/10 text-primary" />
            <StatCard icon={Clock} label="Pending" value={stats.pendingBookings} tone="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" />
            <StatCard icon={CalendarCheck} label="Confirmed" value={stats.confirmedBookings} tone="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" />
            <StatCard icon={XCircle} label="Cancelled" value={stats.cancelledBookings} tone="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" />
            <div className="col-span-2 lg:col-span-1">
              <StatCard icon={Wallet} label="Total Revenue" value={formatAmount(stats.totalRevenue)} tone="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" />
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 p-4 border-b border-border lg:flex-row lg:items-center lg:justify-between">
            <div className="relative lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, phone, trip or ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
                aria-label="Search bookings"
              />
            </div>
            <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1" role="tablist" aria-label="Filter by status">
              {filters.map((filter) => {
                const isActive = statusFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setStatusFilter(filter.value);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {filter.label}
                    {filter.count !== undefined && (
                      <span className={cn("text-xs", isActive ? "text-primary" : "text-muted-foreground")}>
                        {filter.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table (tablet and up) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/60 border-b border-border">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Phone</th>
                  <th className="px-3 py-3">Trip</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Booked on</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7}>{emptyState}</td>
                  </tr>
                ) : (
                  bookings.map((booking, index) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {initialsOf(booking.customerName)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate max-w-[11rem]">{booking.customerName}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[11rem]">{booking.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm">
                        <PhoneLink phone={booking.phone} />
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-sm font-medium line-clamp-2 min-w-[9rem] max-w-[16rem]">{booking.tripName}</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {booking.travelers} {booking.travelers === 1 ? "traveller" : "travellers"}
                          </span>
                          {booking.selectedDate && (
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {booking.selectedDate}
                            </span>
                          )}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-sm font-semibold whitespace-nowrap tabular-nums">
                        {formatAmount(booking.totalAmount)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <p className="text-sm">{formatDate(booking.createdAt)}</p>
                        {booking.bookingId && <p className="text-xs text-muted-foreground">{booking.bookingId}</p>}
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={booking.status} />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {statusActions(booking, false)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingId(booking._id)}
                            title="View details"
                            aria-label={`View details of ${booking.customerName}'s booking`}
                          >
                            <Eye />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={updatingId === booking._id}
                            onClick={() => handleDelete(booking._id)}
                            title="Delete booking"
                            aria-label={`Delete ${booking.customerName}'s booking`}
                          >
                            <Trash2 className="text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Cards (phones) */}
          <div className="md:hidden">
            {loading ? (
              <div className="p-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : bookings.length === 0 ? (
              emptyState
            ) : (
              <ul className="divide-y divide-border">
                {bookings.map((booking) => (
                  <li key={booking._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{booking.customerName}</p>
                        <p className="text-xs text-muted-foreground truncate">{booking.email}</p>
                      </div>
                      <StatusPill status={booking.status} />
                    </div>
                    <div className="text-sm">
                      <PhoneLink phone={booking.phone} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{booking.tripName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {booking.travelers} {booking.travelers === 1 ? "traveller" : "travellers"}
                        {booking.selectedDate && ` · ${booking.selectedDate}`} · booked {formatDate(booking.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold tabular-nums">{formatAmount(booking.totalAmount)}</p>
                      <div className="flex items-center gap-1.5">
                        {statusActions(booking, false)}
                        <Button variant="ghost" size="sm" onClick={() => setViewingId(booking._id)} title="View details">
                          <Eye />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <AdminPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemLabel="bookings"
            onPageChange={setCurrentPage}
            disabled={loading}
          />
        </div>

        {/* Booking details */}
        <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewingId(null)}>
          {viewing && (
            <DialogContent className="max-w-lg max-h-[90svh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-3">
                  Booking {viewing.bookingId || "details"}
                  <StatusPill status={viewing.status} />
                </DialogTitle>
                <DialogDescription>
                  Received {formatDate(viewing.createdAt)} at {formatTime(viewing.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Customer</h3>
                  <p className="font-semibold">{viewing.customerName}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <a href={`tel:${dialable(viewing.phone)}`}>
                        <Phone />
                        {viewing.phone}
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={`https://wa.me/${dialable(viewing.whatsapp || viewing.phone).replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle />
                        {viewing.whatsapp ? `WhatsApp ${viewing.whatsapp}` : "WhatsApp"}
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href={`mailto:${viewing.email}`} className="max-w-full">
                        <Mail />
                        <span className="truncate">{viewing.email}</span>
                      </a>
                    </Button>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Trip</h3>
                  <p className="font-semibold">{viewing.tripName}</p>
                  {viewingTripId && (
                    <Link
                      to={`/trip/${viewingTripId}`}
                      target="_blank"
                      className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Open trip page
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Travellers</dt>
                      <dd className="font-medium">{viewing.travelers}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Travel date</dt>
                      <dd className="font-medium">{viewing.selectedDate || "Not chosen"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Price per person</dt>
                      <dd className="font-medium tabular-nums">
                        {viewing.selectedPrice ? formatAmount(viewing.selectedPrice) : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Total amount</dt>
                      <dd className="font-semibold tabular-nums">{formatAmount(viewing.totalAmount)}</dd>
                    </div>
                    {viewing.pickupLocation && (
                      <div>
                        <dt className="text-muted-foreground">Pick-up location</dt>
                        <dd className="font-medium break-words">{viewing.pickupLocation}</dd>
                      </div>
                    )}
                    {viewing.meditationRequired !== undefined && (
                      <div>
                        <dt className="text-muted-foreground">Meditation required</dt>
                        <dd className="font-medium">{viewing.meditationRequired ? "Yes" : "No"}</dd>
                      </div>
                    )}
                  </dl>
                </section>

                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Message from customer
                  </h3>
                  {viewing.message ? (
                    <p className="rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap break-words">{viewing.message}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No message was left.</p>
                  )}
                </section>

                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
                  {/* Opens the booking's invoice, or starts one filled in from this booking. */}
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/admin/invoices?booking=${viewing._id}`}>
                      <ReceiptText />
                      Invoice / Receipt
                    </Link>
                  </Button>
                  {statusActions(viewing, true)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-destructive hover:text-destructive"
                    disabled={updatingId === viewing._id}
                    onClick={() => handleDelete(viewing._id)}
                  >
                    <Trash2 />
                    Delete
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </AdminLayout>
  );
}
