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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { visaApplicationService } from "@/services/visaApplications";
import { cn } from "@/lib/utils";

interface VisaApplication {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  destinationCountry: string;
  status: string;
  createdAt: string;
  passportNumber: string;
  dateOfBirth: string;
  nationality: string;
  purposeOfVisit: string;
  arrivalDate: string;
  departureDate: string;
  passportBioUrl?: string;
  passportPhotoUrl?: string;
  supportingDocumentsUrl?: string;
  adminNotes?: string;
  [key: string]: any;
}

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
      setStats(response.data);
    } catch (error: any) {
      // Stats endpoint might not exist yet, silently fail
      console.log("Stats endpoint not available:", error.message);
      // Set default stats
      setStats({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      });
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.destinationCountry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((app) => app.status === filterStatus);
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      await visaApplicationService.updateApplicationStatus(id, { status: newStatus });

      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus}`,
      });

      await loadApplications();
      if (selectedApplication?._id === id) {
        const updatedApp = applications.find(a => a._id === id);
        if (updatedApp) {
          setSelectedApplication({ ...updatedApp, status: newStatus });
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

  const downloadApplicationData = (application: VisaApplication) => {
    const textContent = `
VISA APPLICATION DETAILS
========================

Application ID: ${application._id}
Submission Date: ${new Date(application.createdAt).toLocaleString()}
Status: ${application.status}

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
-------------------
Passport Type: ${application.passportType || 'N/A'}
Passport Number: ${application.passportNumber || 'N/A'}
Place of Issue: ${application.placeOfIssue || 'N/A'}
Date of Issue: ${application.dateOfIssue || 'N/A'}
Date of Expiry: ${application.dateOfExpiry || 'N/A'}
Issuing Country: ${application.issuingCountry || 'N/A'}

CONTACT DETAILS
--------------
Email: ${application.email || 'N/A'}
Phone: ${application.phone || 'N/A'}
Residential Address: ${application.residentialAddress || 'N/A'}
City: ${application.city || 'N/A'}
Country: ${application.country || 'N/A'}
Postal Code: ${application.postalCode || 'N/A'}

TRAVEL INFORMATION
-----------------
Destination Country: ${application.destinationCountry || 'N/A'}
Purpose of Visit: ${application.purposeOfVisit || 'N/A'}
Arrival Date: ${application.arrivalDate || 'N/A'}
Departure Date: ${application.departureDate || 'N/A'}
Duration of Stay: ${application.durationOfStay || 'N/A'}
Number of Entries: ${application.numberOfEntries || 'N/A'}

ACCOMMODATION & TRAVEL PLAN
--------------------------
Accommodation Type: ${application.accommodationType || 'N/A'}
Accommodation Address: ${application.accommodationAddress || 'N/A'}
Travel Package Name: ${application.travelPackageName || 'N/A'}
Places to Visit: ${application.placesToVisit || 'N/A'}

FINANCIAL INFORMATION
--------------------
Expenses Bearer: ${application.expensesBearer || 'N/A'}
Estimated Budget: ${application.estimatedBudget || 'N/A'}
Sufficient Funds: ${application.sufficientFunds || 'N/A'}

SPONSOR INFORMATION
------------------
Sponsor Name: ${application.sponsorName || 'N/A'}
Sponsor Relationship: ${application.sponsorRelationship || 'N/A'}
Sponsor Address: ${application.sponsorAddress || 'N/A'}
Sponsor Phone: ${application.sponsorPhone || 'N/A'}

TRAVEL HISTORY
-------------
Travelled Before: ${application.travelledBefore || 'N/A'}
Countries Visited: ${application.countriesVisited || 'N/A'}
Overstayed Visa: ${application.overstayedVisa || 'N/A'}
Refused Visa: ${application.refusedVisa || 'N/A'}
Refusal Details: ${application.refusalDetails || 'N/A'}

HEALTH & INSURANCE
-----------------
Has Insurance: ${application.hasInsurance || 'N/A'}
Medical Condition: ${application.medicalCondition || 'N/A'}

DECLARATION
----------
Agreed to Terms: ${application.agreeToTerms ? 'Yes' : 'No'}

========================
Generated on: ${new Date().toLocaleString()}
`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visa_application_${application._id}_data.txt`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Application data downloaded as text file",
    });
  };

  const openDetailsModal = (application: VisaApplication) => {
    setSelectedApplication(application);
    setAdminNotes(application.adminNotes || "");
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300";
      case "under-review":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300";
      case "approved":
        return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300";
      case "rejected":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300";
      case "pending-documents":
        return "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300";
      default:
        return "bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "under-review":
        return <FileText className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending-documents":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Visa Applications</h1>
          <p className="text-muted-foreground">
            Manage and process visa applications
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Applications"
              value={stats.total || 0}
              icon={<FileText className="w-5 h-5" />}
              color="bg-blue-500"
            />
            <StatCard
              title="Pending"
              value={stats.pending || 0}
              icon={<Clock className="w-5 h-5" />}
              color="bg-amber-500"
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under-review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending-documents">Pending Documents</option>
          </select>
        </div>

        {/* Applications Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Travel Dates
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
                  {filteredApplications.map((application) => (
                    <motion.tr
                      key={application._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{application.fullName}</div>
                          <div className="text-sm text-muted-foreground">{application.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{application.destinationCountry}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {application.arrivalDate && application.departureDate
                          ? `${new Date(application.arrivalDate).toLocaleDateString()} - ${new Date(application.departureDate).toLocaleDateString()}`
                          : "Not specified"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                            getStatusColor(application.status)
                          )}
                        >
                          {getStatusIcon(application.status)}
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetailsModal(application)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadApplicationData(application)}
                        >
                          <FileDown className="w-4 h-4" />
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

      {/* Details Modal - Continued in part 2 */}
      {showDetailsModal && selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          adminNotes={adminNotes}
          setAdminNotes={setAdminNotes}
          isSaving={isSaving}
          onClose={() => setShowDetailsModal(false)}
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

// Helper Components
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Application Details</h2>
            <p className="text-sm text-muted-foreground">
              Submitted on {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
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

          {/* Uploaded Documents */}
          {(application.passportBioUrl || application.passportPhotoUrl || application.supportingDocumentsUrl) && (
            <Section title="Uploaded Documents">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {application.passportBioUrl && (
                  <a
                    href={application.passportBioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Passport Bio Page</span>
                  </a>
                )}
                {application.passportPhotoUrl && (
                  <a
                    href={application.passportPhotoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Passport Photo</span>
                  </a>
                )}
                {application.supportingDocumentsUrl && (
                  <a
                    href={application.supportingDocumentsUrl}
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
            
            {/* Status Update */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Update Status</label>
              <div className="flex gap-2 flex-wrap">
                {["pending", "under-review", "approved", "rejected", "pending-documents"].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={application.status.toLowerCase() === status ? "default" : "outline"}
                    onClick={() => onUpdateStatus(application._id, status)}
                    className="capitalize"
                  >
                    {status.replace("-", " ")}
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