// src/pages/admin/AdminCustomTrips.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  X,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { customTripService } from "@/services/customTrips";
import { cn } from "@/lib/utils";

interface CustomTripRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelers?: string;
  dates?: string;
  budget?: string;
  message?: string;
  status: string;
  adminNotes?: string;
  quotedPrice?: number;
  createdAt: string;
}

export default function AdminCustomTrips() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<CustomTripRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<CustomTripRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<CustomTripRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  
  // Form states for editing
  const [adminNotes, setAdminNotes] = useState("");
  const [quotedPrice, setQuotedPrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadRequests();
    loadStats();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchTerm, filterStatus, requests]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const response = await customTripService.getAllRequests();
      // FIX: Handle nested data structure properly
      const requestsData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setRequests(requestsData);
      setFilteredRequests(requestsData);
    } catch (error: any) {
      console.error("Error loading requests:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load requests",
        variant: "destructive",
      });
      // Set empty arrays on error to prevent .map errors
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await customTripService.getStats();
      const statsData = response.data?.data || response.data;
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const filterRequests = () => {
    // Ensure requests is always an array
    if (!Array.isArray(requests)) {
      setFilteredRequests([]);
      return;
    }

    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((req) => req.status === filterStatus);
    }

    setFilteredRequests(filtered);
  };

  const updateRequestStatus = async (id: string, newStatus: string) => {
    try {
      await customTripService.updateRequest(id, { status: newStatus });

      toast({
        title: "Status Updated",
        description: `Request status changed to ${newStatus}`,
      });

      await loadRequests();
      if (selectedRequest?._id === id) {
        const updatedRequest = requests.find(r => r._id === id);
        if (updatedRequest) {
          setSelectedRequest({ ...updatedRequest, status: newStatus });
        }
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const saveRequestDetails = async () => {
    if (!selectedRequest) return;

    try {
      setIsSaving(true);
      await customTripService.updateRequest(selectedRequest._id, {
        adminNotes,
        quotedPrice: quotedPrice ? Number(quotedPrice) : undefined,
      });

      toast({
        title: "Saved",
        description: "Request details updated successfully",
      });

      await loadRequests();
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.response?.data?.message || "Failed to save details",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;

    try {
      await customTripService.deleteRequest(id);

      toast({
        title: "Deleted",
        description: "Request deleted successfully",
      });

      await loadRequests();
      if (selectedRequest?._id === id) {
        setShowDetailsModal(false);
        setSelectedRequest(null);
      }
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "Failed to delete request",
        variant: "destructive",
      });
    }
  };

  const openDetailsModal = (request: CustomTripRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.adminNotes || "");
    setQuotedPrice(request.quotedPrice?.toString() || "");
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300";
      case "in-progress":
        return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300";
      case "quoted":
        return "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300";
      case "confirmed":
        return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "in-progress":
        return <MessageSquare className="w-3 h-3" />;
      case "quoted":
        return <DollarSign className="w-3 h-3" />;
      case "confirmed":
        return <CheckCircle className="w-3 h-3" />;
      case "cancelled":
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Custom Trip Requests</h1>
          <p className="text-muted-foreground">
            Manage and respond to custom trip inquiries
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Requests"
              value={stats.total || 0}
              icon={<MessageSquare className="w-5 h-5" />}
              color="bg-blue-500"
            />
            <StatCard
              title="Pending"
              value={stats.pending || 0}
              icon={<Clock className="w-5 h-5" />}
              color="bg-amber-500"
            />
            <StatCard
              title="Confirmed"
              value={stats.confirmed || 0}
              icon={<CheckCircle className="w-5 h-5" />}
              color="bg-green-500"
            />
            <StatCard
              title="This Month"
              value={stats.thisMonth || 0}
              icon={<Calendar className="w-5 h-5" />}
              color="bg-purple-500"
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "in-progress", "quoted", "confirmed", "cancelled"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRequests.map((request) => (
                    <motion.tr
                      key={request._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{request.name}</div>
                          <div className="text-sm text-muted-foreground">{request.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{request.destination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{request.dates || "Not specified"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                            getStatusColor(request.status)
                          )}
                        >
                          {getStatusIcon(request.status)}
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetailsModal(request)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
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
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Request Details</h2>
                <p className="text-sm text-muted-foreground">
                  Submitted on {new Date(selectedRequest.createdAt).toLocaleDateString()}
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

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem icon={<User className="w-4 h-4" />} label="Name" value={selectedRequest.name} />
                  <InfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={selectedRequest.email} />
                  <InfoItem icon={<Phone className="w-4 h-4" />} label="Phone" value={selectedRequest.phone} />
                  <InfoItem icon={<MapPin className="w-4 h-4" />} label="Destination" value={selectedRequest.destination} />
                </div>
              </div>

              {/* Trip Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Trip Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem icon={<Users className="w-4 h-4" />} label="Travelers" value={selectedRequest.travelers || "Not specified"} />
                  <InfoItem icon={<Calendar className="w-4 h-4" />} label="Travel Dates" value={selectedRequest.dates || "Not specified"} />
                  <InfoItem icon={<DollarSign className="w-4 h-4" />} label="Budget" value={selectedRequest.budget || "Not specified"} />
                </div>
              </div>

              {/* Message */}
              {selectedRequest.message && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Customer Message</h3>
                  <p className="text-sm bg-muted p-4 rounded-lg">{selectedRequest.message}</p>
                </div>
              )}

              {/* Admin Section */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
                
                {/* Status Update */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Update Status</label>
                  <div className="flex gap-2 flex-wrap">
                    {["pending", "in-progress", "quoted", "confirmed", "cancelled"].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selectedRequest.status.toLowerCase() === status ? "default" : "outline"}
                        onClick={() => updateRequestStatus(selectedRequest._id, status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quoted Price */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Quoted Price (₹)</label>
                  <Input
                    type="number"
                    placeholder="Enter quoted price"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                  />
                </div>

                {/* Admin Notes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Admin Notes</label>
                  <Textarea
                    placeholder="Add internal notes about this request..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={saveRequestDetails} disabled={isSaving} className="flex-1">
                    {isSaving ? "Saving..." : "Save Details"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteRequest(selectedRequest._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={cn("p-3 rounded-lg text-white", color)}>{icon}</div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}