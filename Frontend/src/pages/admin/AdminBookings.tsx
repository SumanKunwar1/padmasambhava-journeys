// src/pages/admin/AdminBookings.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  bookingId: string;
  customerName: string;
  email: string;
  tripName: string;
  travelers: number;
  bookingDate: string;
  tripDate: string;
  amount: number;
  status: "Confirmed" | "Pending" | "Cancelled";
}

export default function AdminBookings() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const bookings: Booking[] = [
    {
      id: "1",
      bookingId: "BK001234",
      customerName: "Rahul Sharma",
      email: "rahul@example.com",
      tripName: "Spiti Valley Winter Expedition",
      travelers: 2,
      bookingDate: "2026-01-15",
      tripDate: "2026-02-15",
      amount: 50000,
      status: "Confirmed",
    },
    {
      id: "2",
      bookingId: "BK001235",
      customerName: "Priya Patel",
      email: "priya@example.com",
      tripName: "Bhutan Cultural Tour",
      travelers: 4,
      bookingDate: "2026-01-18",
      tripDate: "2026-03-10",
      amount: 260000,
      status: "Pending",
    },
    {
      id: "3",
      bookingId: "BK001236",
      customerName: "Amit Kumar",
      email: "amit@example.com",
      tripName: "Ladakh Expedition",
      travelers: 1,
      bookingDate: "2026-01-20",
      tripDate: "2026-02-28",
      amount: 35000,
      status: "Confirmed",
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tripName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
            <p className="text-2xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <p className="text-2xl font-bold">
              {bookings.filter((b) => b.status === "Confirmed").length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">
              ₹{(bookings.reduce((sum, b) => sum + b.amount, 0) / 100000).toFixed(1)}L
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Avg. Booking Value</p>
            <p className="text-2xl font-bold">
              ₹{Math.round(bookings.reduce((sum, b) => sum + b.amount, 0) / bookings.length).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
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
                    key={booking.id}
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
                      {new Date(booking.tripDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold">
                        ₹{booking.amount.toLocaleString()}
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
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
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