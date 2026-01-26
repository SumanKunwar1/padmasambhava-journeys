// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  MapPin,
  FileText,
  Calendar,
  TrendingUp,
  DollarSign,
  AlertCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  icon: any;
  color: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const stats: StatCard[] = [
    {
      title: "Total Bookings",
      value: "1,234",
      change: "+12.5%",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Active Trips",
      value: "48",
      change: "+5.2%",
      icon: MapPin,
      color: "bg-green-500",
    },
    {
      title: "Total Users",
      value: "3,456",
      change: "+8.3%",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Revenue",
      value: "₹12.5L",
      change: "+18.7%",
      icon: DollarSign,
      color: "bg-amber-500",
    },
  ];

  const recentBookings = [
    {
      id: "1",
      user: "Rahul Sharma",
      trip: "Spiti Valley Adventure",
      date: "2026-02-15",
      amount: "₹45,000",
      status: "Confirmed",
    },
    {
      id: "2",
      user: "Priya Patel",
      trip: "Bhutan Cultural Tour",
      date: "2026-03-10",
      amount: "₹78,000",
      status: "Pending",
    },
    {
      id: "3",
      user: "Amit Kumar",
      trip: "Ladakh Expedition",
      date: "2026-02-28",
      amount: "₹52,000",
      status: "Confirmed",
    },
    {
      id: "4",
      user: "Sneha Verma",
      trip: "Georgia Explorer",
      date: "2026-03-05",
      amount: "₹95,000",
      status: "Confirmed",
    },
  ];

  const pendingApplications = [
    {
      id: "1",
      user: "Rajesh Gupta",
      country: "Thailand",
      date: "2026-01-20",
      status: "Under Review",
    },
    {
      id: "2",
      user: "Kavita Singh",
      country: "Georgia",
      date: "2026-01-22",
      status: "Pending Documents",
    },
    {
      id: "3",
      user: "Vikram Reddy",
      country: "Bhutan",
      date: "2026-01-23",
      status: "Under Review",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm text-muted-foreground mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Bookings & Pending Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Bookings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/bookings")}
              >
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{booking.user}</p>
                    <p className="text-xs text-muted-foreground">{booking.trip}</p>
                    <p className="text-xs text-muted-foreground mt-1">{booking.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{booking.amount}</p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pending Visa Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Pending Visa Applications</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/applications")}
              >
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {pendingApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{app.user}</p>
                    <p className="text-xs text-muted-foreground">
                      Destination: {app.country}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied: {app.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        app.status === "Under Review"
                          ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => navigate("/admin/trips/create")}
            >
              <MapPin className="w-6 h-6" />
              <span>Add Trip</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => navigate("/admin/blogs/create")}
            >
              <FileText className="w-6 h-6" />
              <span>Create Blog</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => navigate("/admin/users")}
            >
              <Users className="w-6 h-6" />
              <span>Manage Users</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => navigate("/admin/applications")}
            >
              <FileText className="w-6 h-6" />
              <span>View Applications</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}