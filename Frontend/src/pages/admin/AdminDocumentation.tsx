// src/pages/admin/AdminDocumentation.tsx
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
  User,
  Calendar,
  Upload,
  AlertCircle,
  X,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface DocumentSubmission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  destination: string;
  uploadedDocs: {
    [key: string]: {
      name: string;
      category: string;
      uploadDate: string;
      fileName: string;
      file?: File;
    };
  };
  completionPercentage: number;
  status: "Incomplete" | "Under Review" | "Approved" | "Requires Revision";
  submittedDate: string;
}

const DOCUMENT_CATEGORIES = {
  Identity: ["Passport Bio Page", "Passport Size Photo", "Aadhaar Card Copy"],
  Travel: ["Visa/Visa Support Letter", "Travel Itinerary"],
  Accommodation: ["Hotel Booking / Invitation Letter"],
  Financial: ["Bank Statement (Last 3-6 months)"],
  Insurance: ["Travel Insurance"],
  Employment: ["Employment Letter"],
  Tax: ["PAN Card Copy"],
};

export default function AdminDocumentation() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<DocumentSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<DocumentSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<DocumentSubmission | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    // Load submissions from localStorage
    const stored = localStorage.getItem("documentSubmissions");
    if (stored) {
      const subs = JSON.parse(stored);
      setSubmissions(subs);
      setFilteredSubmissions(subs);
    } else {
      // Add sample data for demonstration
      const sampleData: DocumentSubmission[] = [
        {
          id: "1",
          userId: "user1",
          userName: "Rajesh Kumar",
          userEmail: "rajesh.kumar@example.com",
          destination: "Georgia",
          uploadedDocs: {
            passport: {
              name: "Passport Bio Page",
              category: "Identity",
              uploadDate: new Date().toISOString(),
              fileName: "passport_rajesh.pdf",
            },
            photo: {
              name: "Passport Size Photo",
              category: "Identity",
              uploadDate: new Date().toISOString(),
              fileName: "photo_rajesh.jpg",
            },
            bank: {
              name: "Bank Statement",
              category: "Financial",
              uploadDate: new Date().toISOString(),
              fileName: "bank_statement.pdf",
            },
          },
          completionPercentage: 60,
          status: "Under Review",
          submittedDate: new Date().toISOString(),
        },
        {
          id: "2",
          userId: "user2",
          userName: "Sneha Patel",
          userEmail: "sneha.patel@example.com",
          destination: "Thailand",
          uploadedDocs: {
            passport: {
              name: "Passport Bio Page",
              category: "Identity",
              uploadDate: new Date(Date.now() - 86400000).toISOString(),
              fileName: "passport_sneha.pdf",
            },
            photo: {
              name: "Passport Size Photo",
              category: "Identity",
              uploadDate: new Date(Date.now() - 86400000).toISOString(),
              fileName: "photo_sneha.jpg",
            },
          },
          completionPercentage: 40,
          status: "Incomplete",
          submittedDate: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      setSubmissions(sampleData);
      setFilteredSubmissions(sampleData);
      localStorage.setItem("documentSubmissions", JSON.stringify(sampleData));
    }
  }, []);

  useEffect(() => {
    // Filter submissions
    let filtered = submissions;

    if (searchTerm) {
      filtered = filtered.filter(
        (sub) =>
          sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((sub) => sub.status === filterStatus);
    }

    setFilteredSubmissions(filtered);
  }, [searchTerm, filterStatus, submissions]);

  const updateSubmissionStatus = (
    id: string,
    newStatus: DocumentSubmission["status"]
  ) => {
    const updated = submissions.map((sub) =>
      sub.id === id ? { ...sub, status: newStatus } : sub
    );
    setSubmissions(updated);
    localStorage.setItem("documentSubmissions", JSON.stringify(updated));

    toast({
      title: "Status Updated",
      description: `Submission status changed to ${newStatus}`,
    });

    if (selectedSubmission?.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status: newStatus });
    }
  };

  const downloadSubmissionInfo = (submission: DocumentSubmission) => {
    const textContent = `
DOCUMENTATION SUBMISSION DETAILS
================================

Submission ID: ${submission.id}
User: ${submission.userName}
Email: ${submission.userEmail}
Destination: ${submission.destination}
Status: ${submission.status}
Completion: ${submission.completionPercentage}%
Submitted: ${new Date(submission.submittedDate).toLocaleString()}

UPLOADED DOCUMENTS
-----------------
${Object.entries(submission.uploadedDocs)
  .map(([key, doc]) => `
Document: ${doc.name}
Category: ${doc.category}
File Name: ${doc.fileName}
Upload Date: ${new Date(doc.uploadDate).toLocaleDateString()}
`)
  .join('\n')}

MISSING DOCUMENTS
----------------
${Object.entries(DOCUMENT_CATEGORIES)
  .flatMap(([category, docs]) =>
    docs
      .filter(
        (docName) =>
          !Object.values(submission.uploadedDocs).some((d) => d.name === docName)
      )
      .map((docName) => `- ${docName} (${category})`)
  )
  .join('\n')}

================================
Generated on: ${new Date().toLocaleString()}
`;

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `documentation_${submission.id}_info.txt`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Documentation info downloaded as text file",
    });
  };

  const downloadSubmissionZip = async (submission: DocumentSubmission) => {
    try {
      const zip = new JSZip();

      // Add submission info
      const infoContent = `
DOCUMENTATION SUBMISSION DETAILS
================================

Submission ID: ${submission.id}
User: ${submission.userName}
Email: ${submission.userEmail}
Destination: ${submission.destination}
Status: ${submission.status}
Completion: ${submission.completionPercentage}%
Submitted: ${new Date(submission.submittedDate).toLocaleString()}

UPLOADED DOCUMENTS
-----------------
${Object.entries(submission.uploadedDocs)
  .map(([key, doc]) => `
Document: ${doc.name}
Category: ${doc.category}
File Name: ${doc.fileName}
Upload Date: ${new Date(doc.uploadDate).toLocaleDateString()}
`)
  .join('\n')}

MISSING DOCUMENTS
----------------
${Object.entries(DOCUMENT_CATEGORIES)
  .flatMap(([category, docs]) =>
    docs
      .filter(
        (docName) =>
          !Object.values(submission.uploadedDocs).some((d) => d.name === docName)
      )
      .map((docName) => `- ${docName} (${category})`)
  )
  .join('\n')}

================================
Generated on: ${new Date().toLocaleString()}
`;

      zip.file("submission_info.txt", infoContent);

      // Add documents folder
      const docsFolder = zip.folder("documents");
      
      Object.entries(submission.uploadedDocs).forEach(([key, doc]) => {
        // In production, you would read the actual file data
        // For now, we'll add placeholder text
        if (docsFolder) {
          docsFolder.file(
            doc.fileName,
            `File content for ${doc.name}\n\nIn production, this would be the actual file data.`
          );
        }
      });

      // Add README
      zip.file(
        "README.txt",
        `
Documentation Submission Package
===============================

User: ${submission.userName}
Email: ${submission.userEmail}
Destination: ${submission.destination}

This ZIP file contains:
- submission_info.txt: Complete submission details
- documents/: Uploaded documents folder

Submission ID: ${submission.id}
Status: ${submission.status}
Completion: ${submission.completionPercentage}%
Submitted: ${new Date(submission.submittedDate).toLocaleString()}

Total Documents Uploaded: ${Object.keys(submission.uploadedDocs).length}
`
      );

      // Generate and download
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `documentation_${submission.id}.zip`);

      toast({
        title: "Download Started",
        description: "Documentation package downloaded as ZIP",
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
      case "Incomplete":
        return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300";
      case "Under Review":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300";
      case "Approved":
        return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300";
      case "Requires Revision":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Incomplete":
        return <AlertCircle className="w-4 h-4" />;
      case "Under Review":
        return <Clock className="w-4 h-4" />;
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Requires Revision":
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const exportToCSV = () => {
    const headers = ["User Name", "Email", "Destination", "Completion", "Status", "Submitted"];
    const rows = filteredSubmissions.map((sub) => [
      sub.userName,
      sub.userEmail,
      sub.destination,
      `${sub.completionPercentage}%`,
      sub.status,
      new Date(sub.submittedDate).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "documentation-submissions.csv";
    a.click();

    toast({
      title: "Export Successful",
      description: "Submissions exported to CSV",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Documentation Submissions</h1>
            <p className="text-muted-foreground mt-1">
              Review and manage travel document uploads
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
            <div className="text-sm text-muted-foreground">Total Submissions</div>
            <div className="text-2xl font-bold mt-1">{submissions.length}</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-sm text-muted-foreground">Under Review</div>
            <div className="text-2xl font-bold mt-1 text-blue-600">
              {submissions.filter((s) => s.status === "Under Review").length}
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-sm text-muted-foreground">Approved</div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {submissions.filter((s) => s.status === "Approved").length}
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-sm text-muted-foreground">Incomplete</div>
            <div className="text-2xl font-bold mt-1 text-amber-600">
              {submissions.filter((s) => s.status === "Incomplete").length}
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
                <option value="Incomplete">Incomplete</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Requires Revision">Requires Revision</option>
              </select>
            </div>
            <div className="text-sm text-muted-foreground flex items-center">
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">User</th>
                  <th className="text-left p-4 font-semibold text-sm">Contact</th>
                  <th className="text-left p-4 font-semibold text-sm">Destination</th>
                  <th className="text-left p-4 font-semibold text-sm">Documents</th>
                  <th className="text-left p-4 font-semibold text-sm">Progress</th>
                  <th className="text-left p-4 font-semibold text-sm">Status</th>
                  <th className="text-left p-4 font-semibold text-sm">Submitted</th>
                  <th className="text-left p-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub, index) => (
                    <motion.tr
                      key={sub.id}
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
                            <div className="font-semibold text-sm">{sub.userName}</div>
                            <div className="text-xs text-muted-foreground">ID: {sub.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{sub.userEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium">{sub.destination}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          {Object.keys(sub.uploadedDocs).length} uploaded
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {sub.completionPercentage}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all",
                                sub.completionPercentage >= 80
                                  ? "bg-green-600"
                                  : sub.completionPercentage >= 50
                                  ? "bg-blue-600"
                                  : "bg-amber-600"
                              )}
                              style={{ width: `${sub.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                            getStatusColor(sub.status)
                          )}
                        >
                          {getStatusIcon(sub.status)}
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(sub.submittedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedSubmission(sub);
                              setShowDetailsModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => downloadSubmissionZip(sub)}
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
      {showDetailsModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg border border-border max-w-3xl w-full my-8"
          >
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between rounded-t-lg">
              <div>
                <h2 className="text-2xl font-bold">Documentation Details</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Submission ID: {selectedSubmission.id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadSubmissionInfo(selectedSubmission)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download TXT
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadSubmissionZip(selectedSubmission)}
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
                  {["Incomplete", "Under Review", "Approved", "Requires Revision"].map(
                    (status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={
                          selectedSubmission.status === status ? "default" : "outline"
                        }
                        onClick={() =>
                          updateSubmissionStatus(
                            selectedSubmission.id,
                            status as DocumentSubmission["status"]
                          )
                        }
                      >
                        {status}
                      </Button>
                    )
                  )}
                </div>
              </div>

              {/* User Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">User Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Name</div>
                    <div className="text-sm font-medium">{selectedSubmission.userName}</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Email</div>
                    <div className="text-sm font-medium">{selectedSubmission.userEmail}</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Destination</div>
                    <div className="text-sm font-medium">{selectedSubmission.destination}</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Completion</div>
                    <div className="text-sm font-medium">
                      {selectedSubmission.completionPercentage}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Uploaded Documents</h3>
                <div className="space-y-3">
                  {Object.entries(selectedSubmission.uploadedDocs).map(([key, doc]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border-2 border-dashed border-border"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{doc.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {doc.category} • {doc.fileName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}

                  {Object.keys(selectedSubmission.uploadedDocs).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No documents uploaded yet
                    </div>
                  )}
                </div>
              </div>

              {/* Missing Documents */}
              {Object.entries(DOCUMENT_CATEGORIES)
                .flatMap(([category, docs]) =>
                  docs.filter(
                    (docName) =>
                      !Object.values(selectedSubmission.uploadedDocs).some(
                        (d) => d.name === docName
                      )
                  )
                )
                .length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-amber-600 dark:text-amber-400">
                    Missing Documents
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(DOCUMENT_CATEGORIES).map(([category, docs]) =>
                      docs
                        .filter(
                          (docName) =>
                            !Object.values(selectedSubmission.uploadedDocs).some(
                              (d) => d.name === docName
                            )
                        )
                        .map((docName) => (
                          <div
                            key={docName}
                            className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg"
                          >
                            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
                              {docName}
                            </span>
                            <span className="text-xs text-amber-700 dark:text-amber-300 ml-auto">
                              {category}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}

              {/* Contact Actions */}
              <div className="flex gap-3">
                <Button className="flex-1" asChild>
                  <a href={`mailto:${selectedSubmission.userEmail}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </a>
                </Button>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-6 rounded-b-lg">
              <Button
                onClick={() => setShowDetailsModal(false)}
                variant="outline"
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