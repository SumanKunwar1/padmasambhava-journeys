// src/pages/admin/AdminVisaApplications.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Plane,
  X,
  FileDown,
  Trash2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { visaApplicationService } from "@/services/visaApplications";
import { cn } from "@/lib/utils";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface VisaApplication {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  destinationCountry: string;
  status: string;
  submittedDate: string;
  createdAt: string;
  passportNumber: string;
  dateOfBirth: string;
  nationality: string;
  purposeOfVisit: string;
  arrivalDate: string;
  departureDate: string;
  // Fixed field names to match backend
  passportBioFile?: string;
  passportPhotoFile?: string;
  supportingDocumentsFile?: string;
  adminNotes?: string;
  [key: string]: any;
}

// Valid status values from backend model
const VALID_STATUSES = ["New", "Under Review", "Approved", "Rejected", "More Info Required"];

export default function AdminVisaApplications() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<VisaApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<VisaApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<VisaApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  
  // Form states
  const [adminNotes, setAdminNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    loadApplications();
    loadStats();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [searchTerm, filterStatus, applications]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const response = await visaApplicationService.getAllApplications();
      const data = Array.isArray(response.data) ? response.data : [];
      setApplications(data);
      setFilteredApplications(data);
    } catch (error: any) {
      console.error("Failed to load applications:", error);
      setApplications([]);
      setFilteredApplications([]);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await visaApplicationService.getStats();
      
      // Calculate stats from applications
      const statsData = response.data?.stats || {};
      const statusCounts = statsData.byStatus || {};
      
      setStats({
        total: statsData.total || applications.length,
        new: statusCounts['New'] || 0,
        underReview: statusCounts['Under Review'] || 0,
        approved: statusCounts['Approved'] || 0,
        rejected: statusCounts['Rejected'] || 0,
        moreInfo: statusCounts['More Info Required'] || 0,
      });
    } catch (error: any) {
      // Calculate stats from loaded applications
      const newCount = applications.filter(a => a.status === 'New').length;
      const underReviewCount = applications.filter(a => a.status === 'Under Review').length;
      const approvedCount = applications.filter(a => a.status === 'Approved').length;
      const rejectedCount = applications.filter(a => a.status === 'Rejected').length;
      const moreInfoCount = applications.filter(a => a.status === 'More Info Required').length;
      
      setStats({
        total: applications.length,
        new: newCount,
        underReview: underReviewCount,
        approved: approvedCount,
        rejected: rejectedCount,
        moreInfo: moreInfoCount,
      });
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.destinationCountry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.passportNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((app) => app.status === filterStatus);
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      console.log('Updating status to:', newStatus);
      
      await visaApplicationService.updateApplicationStatus(id, { 
        status: newStatus,
        adminNotes: adminNotes || selectedApplication?.adminNotes
      });

      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus}`,
      });

      await loadApplications();
      await loadStats();
      
      if (selectedApplication?._id === id) {
        const updatedApp = applications.find(a => a._id === id);
        if (updatedApp) {
          setSelectedApplication({ ...updatedApp, status: newStatus });
        }
      }
    } catch (error: any) {
      console.error('Update error:', error);
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const saveApplicationDetails = async () => {
    if (!selectedApplication) return;

    try {
      setIsSaving(true);
      await visaApplicationService.updateApplicationStatus(selectedApplication._id, {
        status: selectedApplication.status,
        adminNotes,
      });

      toast({
        title: "Saved",
        description: "Application details updated successfully",
      });

      await loadApplications();
      await loadStats();
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

  const deleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      await visaApplicationService.deleteApplication(id);

      toast({
        title: "Deleted",
        description: "Application deleted successfully",
      });

      await loadApplications();
      await loadStats();
      
      if (selectedApplication?._id === id) {
        setShowDetailsModal(false);
        setSelectedApplication(null);
      }
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "Failed to delete application",
        variant: "destructive",
      });
    }
  };

  const downloadApplicationAsZip = async (application: VisaApplication) => {
    try {
      setIsDownloading(true);
      const zip = new JSZip();

      // Create text file with all application details
      const textContent = `
VISA APPLICATION DETAILS
========================

PERSONAL INFORMATION
--------------------
Full Name: ${application.fullName || 'N/A'}
Gender: ${application.gender || 'N/A'}
Date of Birth: ${application.dateOfBirth || 'N/A'}
Place of Birth: ${application.placeOfBirth || 'N/A'}
Nationality: ${application.nationality || 'N/A'}
Marital Status: ${application.maritalStatus || 'N/A'}
Occupation: ${application.occupation || 'N/A'}
Religion: ${application.religion || 'N/A'}

PASSPORT INFORMATION
--------------------
Passport Type: ${application.passportType || 'N/A'}
Passport Number: ${application.passportNumber || 'N/A'}
Place of Issue: ${application.placeOfIssue || 'N/A'}
Date of Issue: ${application.dateOfIssue || 'N/A'}
Date of Expiry: ${application.dateOfExpiry || 'N/A'}
Issuing Country: ${application.issuingCountry || 'N/A'}

CONTACT DETAILS
---------------
Email: ${application.email || 'N/A'}
Phone: ${application.phone || 'N/A'}
Address: ${application.residentialAddress || 'N/A'}
City: ${application.city || 'N/A'}
Country: ${application.country || 'N/A'}
Postal Code: ${application.postalCode || 'N/A'}

TRAVEL INFORMATION
------------------
Destination Country: ${application.destinationCountry || 'N/A'}
Purpose of Visit: ${application.purposeOfVisit || 'N/A'}
Arrival Date: ${application.arrivalDate || 'N/A'}
Departure Date: ${application.departureDate || 'N/A'}
Duration of Stay: ${application.durationOfStay || 'N/A'}
Number of Entries: ${application.numberOfEntries || 'N/A'}

ACCOMMODATION
-------------
Type: ${application.accommodationType || 'N/A'}
Address: ${application.accommodationAddress || 'N/A'}
Travel Package: ${application.travelPackageName || 'N/A'}
Places to Visit: ${application.placesToVisit || 'N/A'}

FINANCIAL INFORMATION
---------------------
Expenses Bearer: ${application.expensesBearer || 'N/A'}
Estimated Budget: ${application.estimatedBudget || 'N/A'}
Sufficient Funds: ${application.sufficientFunds || 'N/A'}

SPONSOR INFORMATION
-------------------
Name: ${application.sponsorName || 'N/A'}
Relationship: ${application.sponsorRelationship || 'N/A'}
Address: ${application.sponsorAddress || 'N/A'}
Phone: ${application.sponsorPhone || 'N/A'}

TRAVEL HISTORY
--------------
Travelled Before: ${application.travelledBefore || 'N/A'}
Countries Visited: ${application.countriesVisited || 'N/A'}
Overstayed Visa: ${application.overstayedVisa || 'N/A'}
Refused Visa: ${application.refusedVisa || 'N/A'}
Refusal Details: ${application.refusalDetails || 'N/A'}

HEALTH & INSURANCE
------------------
Has Insurance: ${application.hasInsurance || 'N/A'}
Medical Condition: ${application.medicalCondition || 'N/A'}

APPLICATION STATUS
------------------
Status: ${application.status || 'N/A'}
Submitted Date: ${application.submittedDate || application.createdAt || 'N/A'}
Admin Notes: ${application.adminNotes || 'None'}
`;

      zip.file("application-details.txt", textContent);

      // Download and add files to ZIP
      const downloadFile = async (url: string, filename: string) => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          zip.file(filename, blob);
        } catch (error) {
          console.error(`Failed to download ${filename}:`, error);
        }
      };

      // Add all document files
      const downloads = [];
      
      if (application.passportBioFile) {
        const ext = application.passportBioFile.split('.').pop() || 'jpg';
        downloads.push(downloadFile(application.passportBioFile, `passport-bio.${ext}`));
      }
      
      if (application.passportPhotoFile) {
        const ext = application.passportPhotoFile.split('.').pop() || 'jpg';
        downloads.push(downloadFile(application.passportPhotoFile, `passport-photo.${ext}`));
      }
      
      if (application.supportingDocumentsFile) {
        const ext = application.supportingDocumentsFile.split('.').pop() || 'pdf';
        downloads.push(downloadFile(application.supportingDocumentsFile, `supporting-documents.${ext}`));
      }

      // Wait for all downloads to complete
      await Promise.all(downloads);

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `visa-application-${application.fullName.replace(/\s+/g, '-')}-${application._id}.zip`);

      toast({
        title: "Download Complete",
        description: "Application files downloaded successfully",
      });
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download application files",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Under Review":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Approved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "More Info Required":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "New":
        return <FileText className="w-4 h-4" />;
      case "Under Review":
        return <Clock className="w-4 h-4" />;
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      case "More Info Required":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Visa Applications</h1>
          <p className="text-muted-foreground">Manage and review visa applications</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <StatCard
              title="Total Applications"
              value={stats.total || 0}
              icon={<FileText className="w-5 h-5" />}
              color="bg-primary"
            />
            <StatCard
              title="New"
              value={stats.new || 0}
              icon={<FileText className="w-5 h-5" />}
              color="bg-blue-500"
            />
            <StatCard
              title="Under Review"
              value={stats.underReview || 0}
              icon={<Clock className="w-5 h-5" />}
              color="bg-yellow-500"
            />
            <StatCard
              title="Approved"
              value={stats.approved || 0}
              icon={<CheckCircle className="w-5 h-5" />}
              color="bg-green-500"
            />
            <StatCard
              title="Rejected"
              value={stats.rejected || 0}
              icon={<XCircle className="w-5 h-5" />}
              color="bg-red-500"
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name, email, passport number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-background"
            >
              <option value="all">All Status</option>
              {VALID_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-semibold">Applicant</th>
                    <th className="text-left p-4 font-semibold">Destination</th>
                    <th className="text-left p-4 font-semibold">Passport</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application) => (
                    <motion.tr
                      key={application._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{application.fullName}</p>
                          <p className="text-sm text-muted-foreground">{application.email}</p>
                        </div>
                      </td>
                      <td className="p-4">{application.destinationCountry}</td>
                      <td className="p-4">
                        <span className="font-mono text-sm">{application.passportNumber}</span>
                      </td>
                      <td className="p-4">
                        <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border", getStatusColor(application.status))}>
                          {getStatusIcon(application.status)}
                          {application.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(application.submittedDate || application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedApplication(application);
                              setAdminNotes(application.adminNotes || "");
                              setShowDetailsModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadApplicationAsZip(application)}
                            disabled={isDownloading}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            {isDownloading ? "..." : "ZIP"}
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
      {showDetailsModal && selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          adminNotes={adminNotes}
          setAdminNotes={setAdminNotes}
          isSaving={isSaving}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedApplication(null);
          }}
          onUpdateStatus={updateApplicationStatus}
          onSave={saveApplicationDetails}
          onDelete={deleteApplication}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
        />
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

function ApplicationDetailsModal({
  application,
  adminNotes,
  setAdminNotes,
  isSaving,
  onClose,
  onUpdateStatus,
  onSave,
  onDelete,
  getStatusColor,
  getStatusIcon,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-lg max-w-4xl w-full max-h-[90svh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-2xl font-bold">Application Details</h2>
            <p className="text-sm text-muted-foreground">
              Submitted on {new Date(application.submittedDate || application.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Personal Information */}
          <Section title="Personal Information">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={<User className="w-4 h-4" />} label="Full Name" value={application.fullName} />
              <InfoItem icon={<User className="w-4 h-4" />} label="Gender" value={application.gender} />
              <InfoItem icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={application.dateOfBirth} />
              <InfoItem icon={<MapPin className="w-4 h-4" />} label="Place of Birth" value={application.placeOfBirth} />
              <InfoItem icon={<MapPin className="w-4 h-4" />} label="Nationality" value={application.nationality} />
              <InfoItem icon={<User className="w-4 h-4" />} label="Marital Status" value={application.maritalStatus} />
              <InfoItem icon={<User className="w-4 h-4" />} label="Occupation" value={application.occupation} />
              <InfoItem icon={<User className="w-4 h-4" />} label="Religion" value={application.religion || "N/A"} />
            </div>
          </Section>

          {/* Passport Information */}
          <Section title="Passport Information">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={<FileText className="w-4 h-4" />} label="Passport Type" value={application.passportType} />
              <InfoItem icon={<FileText className="w-4 h-4" />} label="Passport Number" value={application.passportNumber} />
              <InfoItem icon={<MapPin className="w-4 h-4" />} label="Place of Issue" value={application.placeOfIssue} />
              <InfoItem icon={<Calendar className="w-4 h-4" />} label="Date of Issue" value={application.dateOfIssue} />
              <InfoItem icon={<Calendar className="w-4 h-4" />} label="Date of Expiry" value={application.dateOfExpiry} />
              <InfoItem icon={<MapPin className="w-4 h-4" />} label="Issuing Country" value={application.issuingCountry} />
            </div>
          </Section>

          {/* Contact Details */}
          <Section title="Contact Details">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={application.email} />
              <InfoItem icon={<Phone className="w-4 h-4" />} label="Phone" value={application.phone} />
              <InfoItem icon={<MapPin className="w-4 h-4" />} label="Address" value={application.residentialAddress} />
              <InfoItem icon={<MapPin className="w-4 h-4" />} label="City" value={application.city} />
              <InfoItem icon={<MapPin className="w-4 h-4" />} label="Country" value={application.country} />
              <InfoItem icon={<MapPin className="w-4 h-4" />} label="Postal Code" value={application.postalCode} />
            </div>
          </Section>

          {/* Travel Information */}
          <Section title="Travel Information">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={<Plane className="w-4 h-4" />} label="Destination" value={application.destinationCountry} />
              <InfoItem icon={<FileText className="w-4 h-4" />} label="Purpose" value={application.purposeOfVisit} />
              <InfoItem icon={<Calendar className="w-4 h-4" />} label="Arrival Date" value={application.arrivalDate} />
              <InfoItem icon={<Calendar className="w-4 h-4" />} label="Departure Date" value={application.departureDate} />
              <InfoItem icon={<Clock className="w-4 h-4" />} label="Duration" value={application.durationOfStay} />
              <InfoItem icon={<FileText className="w-4 h-4" />} label="Entries" value={application.numberOfEntries} />
            </div>
          </Section>

          {/* Uploaded Documents - FIXED field names */}
          {(application.passportBioFile || application.passportPhotoFile || application.supportingDocumentsFile) && (
            <Section title="Uploaded Documents">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {application.passportBioFile && (
                  <a
                    href={application.passportBioFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Passport Bio Page</span>
                  </a>
                )}
                {application.passportPhotoFile && (
                  <a
                    href={application.passportPhotoFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Passport Photo</span>
                  </a>
                )}
                {application.supportingDocumentsFile && (
                  <a
                    href={application.supportingDocumentsFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Supporting Documents</span>
                  </a>
                )}
              </div>
            </Section>
          )}

          {/* Admin Section */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
            
            {/* Status Update - FIXED status values */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Update Status</label>
              <div className="flex gap-2 flex-wrap">
                {VALID_STATUSES.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={application.status === status ? "default" : "outline"}
                    onClick={() => onUpdateStatus(application._id, status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Admin Notes</label>
              <Textarea
                placeholder="Add internal notes about this application..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={onSave} disabled={isSaving} className="flex-1">
                {isSaving ? "Saving..." : "Save Details"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDelete(application._id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function InfoItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium">{value || "N/A"}</p>
      </div>
    </div>
  );
}