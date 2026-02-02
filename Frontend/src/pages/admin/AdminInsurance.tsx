// src/pages/admin/AdminInsurance.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Shield,
  Download,
  Filter,
  X,
  FileText,
  User,
  Plane,
  Heart,
  Calendar,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5020/api/v1";

interface InsuranceApplication {
  _id: string;
  applicantName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  destination: string;
  tripType: string;
  departureDate: string;
  returnDate: string;
  tripDuration: number;
  purposeOfTravel: string;
  planType: string;
  coverageAmount: number;
  numberOfTravelers: number;
  travelers: any[];
  additionalCoverages: {
    adventureSports: boolean;
    preExistingConditions: boolean;
    seniorCitizen: boolean;
    pregnancy: boolean;
    valuables: boolean;
  };
  passportCopy?: string;
  medicalDocuments?: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  hasPreExistingConditions: boolean;
  preExistingConditionsDetails?: string;
  currentMedications?: string;
  allergies?: string;
  totalAmount: number;
  status: "Pending" | "Under Review" | "Approved" | "Rejected" | "Active" | "Expired";
  paymentStatus: "Pending" | "Paid" | "Failed";
  policyNumber?: string;
  createdAt: string;
}

export default function AdminInsurance() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<InsuranceApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<InsuranceApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    activeApplications: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_URL}/insurance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        setApplications(response.data.data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch insurance applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_URL}/insurance/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_URL}/insurance/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        setSelectedApp(response.data.data.application);
        setShowModal(true);
      }
    } catch (error: any) {
      console.error("Error fetching application details:", error);
      toast({
        title: "Error",
        description: "Failed to load application details",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this application?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `${API_URL}/insurance/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Application Approved",
        description: "The insurance application has been approved successfully",
      });

      fetchApplications();
      fetchStats();
      if (selectedApp?._id === id) {
        setShowModal(false);
        setSelectedApp(null);
      }
    } catch (error: any) {
      console.error("Error approving application:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to approve application",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this application?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `${API_URL}/insurance/${id}`,
        { status: "Rejected" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Application Rejected",
        description: "The insurance application has been rejected",
      });

      fetchApplications();
      fetchStats();
      if (selectedApp?._id === id) {
        setShowModal(false);
        setSelectedApp(null);
      }
    } catch (error: any) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reject application",
        variant: "destructive",
      });
    }
  };

  const downloadApplicationData = async (app: InsuranceApplication) => {
    try {
      const zip = new JSZip();

      // Create text file with application details
      const textContent = `
TRAVEL INSURANCE APPLICATION
============================

APPLICATION ID: ${app._id}
POLICY NUMBER: ${app.policyNumber || 'Not Generated'}
STATUS: ${app.status}
PAYMENT STATUS: ${app.paymentStatus}
SUBMITTED ON: ${new Date(app.createdAt).toLocaleString()}

PERSONAL INFORMATION
-------------------
Full Name: ${app.applicantName}
Email: ${app.email}
Phone: ${app.phone}
Address: ${app.address}, ${app.city}, ${app.state} - ${app.pincode}
Country: ${app.country}

TRAVEL INFORMATION
-----------------
Destination: ${app.destination}
Trip Type: ${app.tripType}
Departure Date: ${new Date(app.departureDate).toLocaleDateString()}
Return Date: ${new Date(app.returnDate).toLocaleDateString()}
Duration: ${app.tripDuration} days
Purpose of Travel: ${app.purposeOfTravel}

INSURANCE PLAN
-------------
Plan Type: ${app.planType}
Coverage Amount: ₹${app.coverageAmount.toLocaleString()}
Number of Travelers: ${app.numberOfTravelers}
Total Premium: ₹${app.totalAmount.toLocaleString()}

TRAVELERS
--------
${app.travelers.map((t: any, i: number) => `
Traveler ${i + 1}:
  Name: ${t.fullName}
  Date of Birth: ${new Date(t.dateOfBirth).toLocaleDateString()}
  Gender: ${t.gender}
  Passport: ${t.passportNumber}
  Nationality: ${t.nationality}
  ${t.email ? `Email: ${t.email}` : ''}
  ${t.phone ? `Phone: ${t.phone}` : ''}
`).join('\n')}

ADDITIONAL COVERAGE
------------------
Adventure Sports: ${app.additionalCoverages.adventureSports ? 'Yes' : 'No'}
Pre-existing Conditions: ${app.additionalCoverages.preExistingConditions ? 'Yes' : 'No'}
Senior Citizen: ${app.additionalCoverages.seniorCitizen ? 'Yes' : 'No'}
Pregnancy: ${app.additionalCoverages.pregnancy ? 'Yes' : 'No'}
Valuables: ${app.additionalCoverages.valuables ? 'Yes' : 'No'}

EMERGENCY CONTACT
----------------
Name: ${app.emergencyContactName}
Phone: ${app.emergencyContactPhone}
Relation: ${app.emergencyContactRelation}

MEDICAL INFORMATION
------------------
Pre-existing Conditions: ${app.hasPreExistingConditions ? 'Yes' : 'No'}
${app.preExistingConditionsDetails ? `Details: ${app.preExistingConditionsDetails}` : ''}
${app.currentMedications ? `Current Medications: ${app.currentMedications}` : ''}
${app.allergies ? `Allergies: ${app.allergies}` : ''}

DOCUMENTS
--------
Passport Copy: ${app.passportCopy ? 'Uploaded' : 'Not uploaded'}
Medical Documents: ${app.medicalDocuments?.length || 0} file(s) uploaded
      `.trim();

      zip.file(`${app.applicantName}_Insurance_Application.txt`, textContent);

      // Download images/documents
      if (app.passportCopy) {
        try {
          const response = await fetch(app.passportCopy);
          const blob = await response.blob();
          const ext = app.passportCopy.split('.').pop()?.split('?')[0] || 'jpg';
          zip.file(`passport_copy.${ext}`, blob);
        } catch (error) {
          console.error("Error downloading passport copy:", error);
        }
      }

      if (app.medicalDocuments && app.medicalDocuments.length > 0) {
        const medicalFolder = zip.folder("medical_documents");
        for (let i = 0; i < app.medicalDocuments.length; i++) {
          try {
            const response = await fetch(app.medicalDocuments[i]);
            const blob = await response.blob();
            const ext = app.medicalDocuments[i].split('.').pop()?.split('?')[0] || 'jpg';
            medicalFolder?.file(`medical_doc_${i + 1}.${ext}`, blob);
          } catch (error) {
            console.error(`Error downloading medical document ${i + 1}:`, error);
          }
        }
      }

      // Generate and download zip
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `Insurance_${app.applicantName}_${app._id}.zip`);

      toast({
        title: "Download Started",
        description: "Application data is being downloaded as a ZIP file",
      });
    } catch (error) {
      console.error("Error creating ZIP:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download application data",
        variant: "destructive",
      });
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["All", "Pending", "Under Review", "Approved", "Rejected", "Active", "Expired"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
      case "Active":
        return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300";
      case "Pending":
      case "Under Review":
        return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300";
      case "Rejected":
      case "Expired":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              Insurance Applications
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage travel insurance applications
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Applications</p>
            <p className="text-2xl font-bold">{stats.totalApplications}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pendingApplications}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approvedApplications}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Active Policies</p>
            <p className="text-2xl font-bold text-blue-600">{stats.activeApplications}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <Filter className="w-5 h-5 text-muted-foreground my-auto" />
            {statuses.map((status) => (
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

        {/* Applications Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Applicant</th>
                  <th className="text-left p-4 font-semibold text-sm">Destination</th>
                  <th className="text-left p-4 font-semibold text-sm">Plan</th>
                  <th className="text-left p-4 font-semibold text-sm">Amount</th>
                  <th className="text-left p-4 font-semibold text-sm">Status</th>
                  <th className="text-left p-4 font-semibold text-sm">Policy No.</th>
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
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app, index) => (
                    <motion.tr
                      key={app._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-semibold">{app.applicantName}</p>
                          <p className="text-sm text-muted-foreground">{app.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{app.destination}</p>
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                            {app.tripType}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                          {app.planType}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold">
                          ₹{app.totalAmount.toLocaleString()}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className={cn("px-2 py-1 rounded text-xs font-medium", getStatusColor(app.status))}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm">
                        {app.policyNumber || "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(app._id)}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadApplicationData(app)}
                            title="Download Data"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {app.status === "Pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(app._id)}
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(app._id)}
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4 text-red-600" />
                              </Button>
                            </>
                          )}
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

      {/* View Details Modal */}
      <AnimatePresence>
        {showModal && selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold">Application Details</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    ID: {selectedApp._id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadApplicationData(selectedApp)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status and Policy Info */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <span className={cn("px-3 py-1 rounded text-sm font-medium", getStatusColor(selectedApp.status))}>
                      {selectedApp.status}
                    </span>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Policy Number</p>
                    <p className="font-semibold">{selectedApp.policyNumber || 'Not Generated'}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Premium</p>
                    <p className="font-semibold text-lg text-primary">
                      ₹{selectedApp.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{selectedApp.applicantName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {selectedApp.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {selectedApp.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {selectedApp.city}, {selectedApp.state}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Travel Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Plane className="w-5 h-5 text-primary" />
                    Travel Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-medium">{selectedApp.destination}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Trip Type</p>
                      <p className="font-medium">{selectedApp.tripType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Departure Date</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedApp.departureDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Return Date</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedApp.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{selectedApp.tripDuration} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Purpose</p>
                      <p className="font-medium">{selectedApp.purposeOfTravel}</p>
                    </div>
                  </div>
                </div>

                {/* Insurance Plan */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Insurance Plan
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 bg-muted/30 rounded-lg p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Plan Type</p>
                      <p className="font-medium">{selectedApp.planType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Coverage Amount</p>
                      <p className="font-medium">₹{selectedApp.coverageAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Number of Travelers</p>
                      <p className="font-medium">{selectedApp.numberOfTravelers}</p>
                    </div>
                  </div>
                </div>

                {/* Travelers */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Travelers</h3>
                  <div className="space-y-3">
                    {selectedApp.travelers.map((traveler: any, index: number) => (
                      <div key={index} className="bg-muted/30 rounded-lg p-4">
                        <p className="font-semibold mb-2">Traveler {index + 1}</p>
                        <div className="grid md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Name</p>
                            <p className="font-medium">{traveler.fullName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">DOB</p>
                            <p className="font-medium">{new Date(traveler.dateOfBirth).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Gender</p>
                            <p className="font-medium">{traveler.gender}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Passport</p>
                            <p className="font-medium">{traveler.passportNumber}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Nationality</p>
                            <p className="font-medium">{traveler.nationality}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Coverage */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Additional Coverage</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(selectedApp.additionalCoverages).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 bg-muted/30 rounded-lg p-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center",
                          value ? "bg-green-100 dark:bg-green-950" : "bg-gray-100 dark:bg-gray-800"
                        )}>
                          {value ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                        <span className="text-sm">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medical Information */}
                {selectedApp.hasPreExistingConditions && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary" />
                      Medical Information
                    </h3>
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      {selectedApp.preExistingConditionsDetails && (
                        <div>
                          <p className="text-sm text-muted-foreground">Pre-existing Conditions</p>
                          <p className="font-medium">{selectedApp.preExistingConditionsDetails}</p>
                        </div>
                      )}
                      {selectedApp.currentMedications && (
                        <div>
                          <p className="text-sm text-muted-foreground">Current Medications</p>
                          <p className="font-medium">{selectedApp.currentMedications}</p>
                        </div>
                      )}
                      {selectedApp.allergies && (
                        <div>
                          <p className="text-sm text-muted-foreground">Allergies</p>
                          <p className="font-medium">{selectedApp.allergies}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Emergency Contact</h3>
                  <div className="grid md:grid-cols-3 gap-4 bg-muted/30 rounded-lg p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedApp.emergencyContactName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedApp.emergencyContactPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Relation</p>
                      <p className="font-medium">{selectedApp.emergencyContactRelation}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Documents
                  </h3>
                  <div className="space-y-3">
                    {selectedApp.passportCopy && (
                      <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                        <span className="text-sm">Passport Copy</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(selectedApp.passportCopy, '_blank')}
                        >
                          View
                        </Button>
                      </div>
                    )}
                    {selectedApp.medicalDocuments && selectedApp.medicalDocuments.length > 0 && (
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-sm font-medium mb-2">Medical Documents ({selectedApp.medicalDocuments.length})</p>
                        <div className="space-y-2">
                          {selectedApp.medicalDocuments.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className="text-sm">Document {idx + 1}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(doc, '_blank')}
                              >
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {selectedApp.status === "Pending" && (
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button
                      className="flex-1"
                      onClick={() => handleApprove(selectedApp._id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Application
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleReject(selectedApp._id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}