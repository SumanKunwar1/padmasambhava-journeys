// src/pages/admin/AdminVisaApplications.tsx
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
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Plane,
  X,
  FileDown,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface VisaApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  status: "Under Review" | "Approved" | "Rejected" | "Pending Documents";
  submittedDate: string;
  data: any;
}

export default function AdminVisaApplications() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<VisaApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<VisaApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<VisaApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    // Load applications from localStorage
    const stored = localStorage.getItem("visaApplications");
    if (stored) {
      const apps = JSON.parse(stored);
      setApplications(apps);
      setFilteredApplications(apps);
    }
  }, []);

  useEffect(() => {
    // Filter applications
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((app) => app.status === filterStatus);
    }

    setFilteredApplications(filtered);
  }, [searchTerm, filterStatus, applications]);

  const updateApplicationStatus = (id: string, newStatus: VisaApplication["status"]) => {
    const updated = applications.map((app) =>
      app.id === id ? { ...app, status: newStatus } : app
    );
    setApplications(updated);
    localStorage.setItem("visaApplications", JSON.stringify(updated));

    toast({
      title: "Status Updated",
      description: `Application status changed to ${newStatus}`,
    });

    if (selectedApplication?.id === id) {
      setSelectedApplication({ ...selectedApplication, status: newStatus });
    }
  };

  const downloadApplicationData = (application: VisaApplication) => {
    // Create text content with all application data
    const textContent = `
VISA APPLICATION DETAILS
========================

Application ID: ${application.id}
Submission Date: ${new Date(application.submittedDate).toLocaleString()}
Status: ${application.status}

PERSONAL INFORMATION
--------------------
Full Name: ${application.data.fullName || 'N/A'}
Gender: ${application.data.gender || 'N/A'}
Date of Birth: ${application.data.dateOfBirth || 'N/A'}
Place of Birth: ${application.data.placeOfBirth || 'N/A'}
Nationality: ${application.data.nationality || 'N/A'}
Marital Status: ${application.data.maritalStatus || 'N/A'}
Occupation: ${application.data.occupation || 'N/A'}
Religion: ${application.data.religion || 'N/A'}

PASSPORT INFORMATION
-------------------
Passport Type: ${application.data.passportType || 'N/A'}
Passport Number: ${application.data.passportNumber || 'N/A'}
Place of Issue: ${application.data.placeOfIssue || 'N/A'}
Date of Issue: ${application.data.dateOfIssue || 'N/A'}
Date of Expiry: ${application.data.dateOfExpiry || 'N/A'}
Issuing Country: ${application.data.issuingCountry || 'N/A'}

CONTACT DETAILS
--------------
Email: ${application.data.email || 'N/A'}
Phone: ${application.data.phone || 'N/A'}
Residential Address: ${application.data.residentialAddress || 'N/A'}
City: ${application.data.city || 'N/A'}
Country: ${application.data.country || 'N/A'}
Postal Code: ${application.data.postalCode || 'N/A'}

TRAVEL INFORMATION
-----------------
Destination Country: ${application.data.destinationCountry || 'N/A'}
Purpose of Visit: ${application.data.purposeOfVisit || 'N/A'}
Arrival Date: ${application.data.arrivalDate || 'N/A'}
Departure Date: ${application.data.departureDate || 'N/A'}
Duration of Stay: ${application.data.durationOfStay || 'N/A'}
Number of Entries: ${application.data.numberOfEntries || 'N/A'}

ACCOMMODATION & TRAVEL PLAN
--------------------------
Accommodation Type: ${application.data.accommodationType || 'N/A'}
Accommodation Address: ${application.data.accommodationAddress || 'N/A'}
Travel Package Name: ${application.data.travelPackageName || 'N/A'}
Places to Visit: ${application.data.placesToVisit || 'N/A'}

FINANCIAL INFORMATION
--------------------
Expenses Bearer: ${application.data.expensesBearer || 'N/A'}
Estimated Budget: ${application.data.estimatedBudget || 'N/A'}
Sufficient Funds: ${application.data.sufficientFunds || 'N/A'}

SPONSOR INFORMATION
------------------
Sponsor Name: ${application.data.sponsorName || 'N/A'}
Sponsor Relationship: ${application.data.sponsorRelationship || 'N/A'}
Sponsor Address: ${application.data.sponsorAddress || 'N/A'}
Sponsor Phone: ${application.data.sponsorPhone || 'N/A'}

TRAVEL HISTORY
-------------
Travelled Before: ${application.data.travelledBefore || 'N/A'}
Countries Visited: ${application.data.countriesVisited || 'N/A'}
Overstayed Visa: ${application.data.overstayedVisa || 'N/A'}
Refused Visa: ${application.data.refusedVisa || 'N/A'}
Refusal Details: ${application.data.refusalDetails || 'N/A'}

HEALTH & INSURANCE
-----------------
Has Insurance: ${application.data.hasInsurance || 'N/A'}
Medical Condition: ${application.data.medicalCondition || 'N/A'}

DECLARATION
----------
Agreed to Terms: ${application.data.agreeToTerms ? 'Yes' : 'No'}

========================
Generated on: ${new Date().toLocaleString()}
`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visa_application_${application.id}_data.txt`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Application data downloaded as text file",
    });
  };

  const downloadApplicationZip = async (application: VisaApplication) => {
    try {
      const zip = new JSZip();

      // Add text data
      const textContent = `
VISA APPLICATION DETAILS
========================

Application ID: ${application.id}
Submission Date: ${new Date(application.submittedDate).toLocaleString()}
Status: ${application.status}

PERSONAL INFORMATION
--------------------
Full Name: ${application.data.fullName || 'N/A'}
Gender: ${application.data.gender || 'N/A'}
Date of Birth: ${application.data.dateOfBirth || 'N/A'}
Place of Birth: ${application.data.placeOfBirth || 'N/A'}
Nationality: ${application.data.nationality || 'N/A'}
Marital Status: ${application.data.maritalStatus || 'N/A'}
Occupation: ${application.data.occupation || 'N/A'}
Religion: ${application.data.religion || 'N/A'}

PASSPORT INFORMATION
-------------------
Passport Type: ${application.data.passportType || 'N/A'}
Passport Number: ${application.data.passportNumber || 'N/A'}
Place of Issue: ${application.data.placeOfIssue || 'N/A'}
Date of Issue: ${application.data.dateOfIssue || 'N/A'}
Date of Expiry: ${application.data.dateOfExpiry || 'N/A'}
Issuing Country: ${application.data.issuingCountry || 'N/A'}

CONTACT DETAILS
--------------
Email: ${application.data.email || 'N/A'}
Phone: ${application.data.phone || 'N/A'}
Residential Address: ${application.data.residentialAddress || 'N/A'}
City: ${application.data.city || 'N/A'}
Country: ${application.data.country || 'N/A'}
Postal Code: ${application.data.postalCode || 'N/A'}

TRAVEL INFORMATION
-----------------
Destination Country: ${application.data.destinationCountry || 'N/A'}
Purpose of Visit: ${application.data.purposeOfVisit || 'N/A'}
Arrival Date: ${application.data.arrivalDate || 'N/A'}
Departure Date: ${application.data.departureDate || 'N/A'}
Duration of Stay: ${application.data.durationOfStay || 'N/A'}
Number of Entries: ${application.data.numberOfEntries || 'N/A'}

ACCOMMODATION & TRAVEL PLAN
--------------------------
Accommodation Type: ${application.data.accommodationType || 'N/A'}
Accommodation Address: ${application.data.accommodationAddress || 'N/A'}
Travel Package Name: ${application.data.travelPackageName || 'N/A'}
Places to Visit: ${application.data.placesToVisit || 'N/A'}

FINANCIAL INFORMATION
--------------------
Expenses Bearer: ${application.data.expensesBearer || 'N/A'}
Estimated Budget: ${application.data.estimatedBudget || 'N/A'}
Sufficient Funds: ${application.data.sufficientFunds || 'N/A'}

SPONSOR INFORMATION
------------------
Sponsor Name: ${application.data.sponsorName || 'N/A'}
Sponsor Relationship: ${application.data.sponsorRelationship || 'N/A'}
Sponsor Address: ${application.data.sponsorAddress || 'N/A'}
Sponsor Phone: ${application.data.sponsorPhone || 'N/A'}

TRAVEL HISTORY
-------------
Travelled Before: ${application.data.travelledBefore || 'N/A'}
Countries Visited: ${application.data.countriesVisited || 'N/A'}
Overstayed Visa: ${application.data.overstayedVisa || 'N/A'}
Refused Visa: ${application.data.refusedVisa || 'N/A'}
Refusal Details: ${application.data.refusalDetails || 'N/A'}

HEALTH & INSURANCE
-----------------
Has Insurance: ${application.data.hasInsurance || 'N/A'}
Medical Condition: ${application.data.medicalCondition || 'N/A'}

DECLARATION
----------
Agreed to Terms: ${application.data.agreeToTerms ? 'Yes' : 'No'}

========================
Generated on: ${new Date().toLocaleString()}
`;

      zip.file("application_details.txt", textContent);

      // Add uploaded files (Note: Files are stored as File objects in localStorage)
      // In a real scenario, you'd need to convert them properly
      if (application.data.passportBioFile) {
        zip.file("passport_bio_page.pdf", "File data would be here in production");
      }
      if (application.data.passportPhotoFile) {
        zip.file("passport_photo.jpg", "File data would be here in production");
      }
      if (application.data.supportingDocumentsFile) {
        zip.file("supporting_documents.pdf", "File data would be here in production");
      }

      // Add a README
      zip.file("README.txt", `
This ZIP file contains the visa application for ${application.data.fullName}.

Contents:
- application_details.txt: Complete application information
- Document files (if uploaded)

Application ID: ${application.id}
Status: ${application.status}
Submitted: ${new Date(application.submittedDate).toLocaleString()}
      `);

      // Generate and download
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `visa_application_${application.id}.zip`);

      toast({
        title: "Download Started",
        description: "Application package downloaded as ZIP",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to create ZIP file",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300";
      case "Rejected":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300";
      case "Under Review":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300";
      case "Pending Documents":
        return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300";
      default:
        return "bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      case "Under Review":
        return <Clock className="w-4 h-4" />;
      case "Pending Documents":
        return <FileText className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Destination", "Status", "Submitted Date"];
    const rows = filteredApplications.map((app) => [
      app.name,
      app.email,
      app.phone,
      app.destination,
      app.status,
      new Date(app.submittedDate).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "visa-applications.csv";
    a.click();

    toast({
      title: "Export Successful",
      description: "Applications exported to CSV",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Visa Applications</h1>
            <p className="text-muted-foreground mt-1">
              Manage and review visa applications
            </p>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-sm text-muted-foreground">Total Applications</div>
            <div className="text-2xl font-bold mt-1">{applications.length}</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-sm text-muted-foreground">Under Review</div>
            <div className="text-2xl font-bold mt-1 text-blue-600">
              {applications.filter((a) => a.status === "Under Review").length}
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-sm text-muted-foreground">Approved</div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {applications.filter((a) => a.status === "Approved").length}
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-sm text-muted-foreground">Pending Documents</div>
            <div className="text-2xl font-bold mt-1 text-amber-600">
              {applications.filter((a) => a.status === "Pending Documents").length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-md border border-border bg-background"
              >
                <option value="all">All Statuses</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending Documents">Pending Documents</option>
              </select>
            </div>
            <div className="text-sm text-muted-foreground flex items-center">
              Showing {filteredApplications.length} of {applications.length} applications
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Applicant</th>
                  <th className="text-left p-4 font-semibold text-sm">Contact</th>
                  <th className="text-left p-4 font-semibold text-sm">Destination</th>
                  <th className="text-left p-4 font-semibold text-sm">Status</th>
                  <th className="text-left p-4 font-semibold text-sm">Submitted</th>
                  <th className="text-left p-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app, index) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{app.name}</div>
                            <div className="text-xs text-muted-foreground">ID: {app.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{app.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{app.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{app.destination}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                            getStatusColor(app.status)
                          )}
                        >
                          {getStatusIcon(app.status)}
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(app.submittedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedApplication(app);
                              setShowDetailsModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => downloadApplicationZip(app)}
                            title="Download as ZIP"
                          >
                            <FileDown className="w-4 h-4" />
                          </Button>
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

      {/* Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg border border-border max-w-4xl w-full my-8"
          >
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between rounded-t-lg">
              <div>
                <h2 className="text-2xl font-bold">Application Details</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  ID: {selectedApplication.id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadApplicationData(selectedApplication)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download TXT
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadApplicationZip(selectedApplication)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download ZIP
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              {/* Status Update */}
              <div className="bg-muted/50 rounded-lg p-4">
                <label className="block text-sm font-semibold mb-2">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {["Under Review", "Approved", "Rejected", "Pending Documents"].map(
                    (status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={
                          selectedApplication.status === status ? "default" : "outline"
                        }
                        onClick={() =>
                          updateApplicationStatus(
                            selectedApplication.id,
                            status as VisaApplication["status"]
                          )
                        }
                      >
                        {status}
                      </Button>
                    )
                  )}
                </div>
              </div>

              {/* Uploaded Documents Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Uploaded Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedApplication.data.passportBioFile && (
                    <div className="bg-muted/30 rounded-lg p-4 border-2 border-dashed border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-sm">Passport Bio Page</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {selectedApplication.data.passportBioFile.name || "passport_bio.pdf"}
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="w-3 h-3 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                  {selectedApplication.data.passportPhotoFile && (
                    <div className="bg-muted/30 rounded-lg p-4 border-2 border-dashed border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-sm">Passport Photo</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {selectedApplication.data.passportPhotoFile.name || "passport_photo.jpg"}
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="w-3 h-3 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                  {selectedApplication.data.supportingDocumentsFile && (
                    <div className="bg-muted/30 rounded-lg p-4 border-2 border-dashed border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-sm">Supporting Documents</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {selectedApplication.data.supportingDocumentsFile.name || "supporting_docs.pdf"}
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="w-3 h-3 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
                {!selectedApplication.data.passportBioFile && 
                 !selectedApplication.data.passportPhotoFile && 
                 !selectedApplication.data.supportingDocumentsFile && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No documents uploaded
                  </p>
                )}
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailField label="Full Name" value={selectedApplication.data.fullName} />
                  <DetailField label="Gender" value={selectedApplication.data.gender} />
                  <DetailField label="Date of Birth" value={selectedApplication.data.dateOfBirth} />
                  <DetailField label="Place of Birth" value={selectedApplication.data.placeOfBirth} />
                  <DetailField label="Nationality" value={selectedApplication.data.nationality} />
                  <DetailField label="Marital Status" value={selectedApplication.data.maritalStatus} />
                  <DetailField label="Occupation" value={selectedApplication.data.occupation} />
                  <DetailField label="Religion" value={selectedApplication.data.religion} />
                </div>
              </div>

              {/* Passport Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Passport Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailField label="Passport Number" value={selectedApplication.data.passportNumber} />
                  <DetailField label="Passport Type" value={selectedApplication.data.passportType} />
                  <DetailField label="Date of Issue" value={selectedApplication.data.dateOfIssue} />
                  <DetailField label="Date of Expiry" value={selectedApplication.data.dateOfExpiry} />
                  <DetailField label="Place of Issue" value={selectedApplication.data.placeOfIssue} />
                  <DetailField label="Issuing Country" value={selectedApplication.data.issuingCountry} />
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailField label="Email" value={selectedApplication.data.email} />
                  <DetailField label="Phone" value={selectedApplication.data.phone} />
                  <DetailField label="Address" value={selectedApplication.data.residentialAddress} />
                  <DetailField label="City" value={selectedApplication.data.city} />
                  <DetailField label="Country" value={selectedApplication.data.country} />
                  <DetailField label="Postal Code" value={selectedApplication.data.postalCode} />
                </div>
              </div>

              {/* Travel Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Travel Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailField label="Destination" value={selectedApplication.data.destinationCountry} />
                  <DetailField label="Purpose of Visit" value={selectedApplication.data.purposeOfVisit} />
                  <DetailField label="Arrival Date" value={selectedApplication.data.arrivalDate} />
                  <DetailField label="Departure Date" value={selectedApplication.data.departureDate} />
                  <DetailField label="Duration of Stay" value={selectedApplication.data.durationOfStay} />
                  <DetailField label="Number of Entries" value={selectedApplication.data.numberOfEntries} />
                </div>
              </div>

              {/* Accommodation */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Accommodation & Travel Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailField label="Accommodation Type" value={selectedApplication.data.accommodationType} />
                  <DetailField label="Accommodation Address" value={selectedApplication.data.accommodationAddress} />
                  <DetailField label="Travel Package Name" value={selectedApplication.data.travelPackageName} />
                  <DetailField label="Places to Visit" value={selectedApplication.data.placesToVisit} />
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Financial Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailField label="Expenses Bearer" value={selectedApplication.data.expensesBearer} />
                  <DetailField label="Estimated Budget" value={selectedApplication.data.estimatedBudget} />
                  <DetailField label="Sufficient Funds" value={selectedApplication.data.sufficientFunds} />
                </div>
              </div>

              {/* Sponsor Information */}
              {selectedApplication.data.sponsorName && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Sponsor Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailField label="Sponsor Name" value={selectedApplication.data.sponsorName} />
                    <DetailField label="Relationship" value={selectedApplication.data.sponsorRelationship} />
                    <DetailField label="Sponsor Address" value={selectedApplication.data.sponsorAddress} />
                    <DetailField label="Sponsor Phone" value={selectedApplication.data.sponsorPhone} />
                  </div>
                </div>
              )}

              {/* Travel History */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Travel History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailField label="Travelled Before" value={selectedApplication.data.travelledBefore} />
                  <DetailField label="Countries Visited" value={selectedApplication.data.countriesVisited} />
                  <DetailField label="Overstayed Visa" value={selectedApplication.data.overstayedVisa} />
                  <DetailField label="Refused Visa" value={selectedApplication.data.refusedVisa} />
                  {selectedApplication.data.refusalDetails && (
                    <div className="md:col-span-2">
                      <DetailField label="Refusal Details" value={selectedApplication.data.refusalDetails} />
                    </div>
                  )}
                </div>
              </div>

              {/* Health & Insurance */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Health & Insurance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailField label="Has Insurance" value={selectedApplication.data.hasInsurance} />
                  <DetailField label="Medical Condition" value={selectedApplication.data.medicalCondition} />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-6 rounded-b-lg">
              <Button
                onClick={() => setShowDetailsModal(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-sm font-medium">{value || "N/A"}</div>
    </div>
  );
}