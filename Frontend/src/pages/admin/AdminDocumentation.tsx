// src/pages/admin/AdminDocumentation.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Mail,
  User,
  Calendar,
  X,
  FileDown,
  Trash2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { documentationService } from "@/services/documentation";
import { cn } from "@/lib/utils";

interface Document {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  documentId: string;
  name: string;
  category: string;
  description: string;
  status: "required" | "optional" | "recommended";
  destination?: string;
  fileUrl: string;
  createdAt: string;
}

interface GroupedDocument {
  userId: string;
  userName: string;
  userEmail: string;
  destination: string;
  documents: Document[];
  totalDocs: number;
  uploadedDate: string;
}

export default function AdminDocumentation() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [groupedDocs, setGroupedDocs] = useState<GroupedDocument[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<GroupedDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDestination, setFilterDestination] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<GroupedDocument | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    groupAndFilterDocuments();
  }, [documents, searchTerm, filterDestination]);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await documentationService.getAllDocuments();
      // FIX: Handle nested data structure properly
      const documentsData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setDocuments(documentsData);
    } catch (error: any) {
      console.error("Error loading documents:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load documents",
        variant: "destructive",
      });
      // Set empty array on error to prevent .map errors
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const groupAndFilterDocuments = () => {
    // Ensure documents is always an array
    if (!Array.isArray(documents)) {
      setGroupedDocs([]);
      setFilteredDocs([]);
      return;
    }

    // Group documents by user
    const grouped: { [key: string]: GroupedDocument } = {};

    documents.forEach((doc) => {
      const userId = doc.userId._id;
      
      if (!grouped[userId]) {
        grouped[userId] = {
          userId,
          userName: doc.userId.fullName,
          userEmail: doc.userId.email,
          destination: doc.destination || "Not specified",
          documents: [],
          totalDocs: 0,
          uploadedDate: doc.createdAt,
        };
      }

      grouped[userId].documents.push(doc);
      grouped[userId].totalDocs++;
    });

    let result = Object.values(grouped);

    // Apply filters
    if (searchTerm) {
      result = result.filter(
        (group) =>
          group.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDestination !== "all") {
      result = result.filter((group) => group.destination === filterDestination);
    }

    setGroupedDocs(result);
    setFilteredDocs(result);
  };

  const deleteDocument = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await documentationService.deleteDocument(id);

      toast({
        title: "Deleted",
        description: "Document deleted successfully",
      });

      await loadDocuments();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const downloadDocument = (fileUrl: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    a.target = "_blank";
    a.click();
  };

  const openDetailsModal = (group: GroupedDocument) => {
    setSelectedGroup(group);
    setShowDetailsModal(true);
  };

  const getDestinations = () => {
    const destinations = new Set(documents.map(d => d.destination).filter(Boolean));
    return Array.from(destinations);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Document Management</h1>
          <p className="text-muted-foreground">
            Review and manage user document submissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={groupedDocs.length}
            icon={<User className="w-5 h-5" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Documents"
            value={documents.length}
            icon={<FileText className="w-5 h-5" />}
            color="bg-green-500"
          />
          <StatCard
            title="Destinations"
            value={getDestinations().length}
            icon={<MapPin className="w-5 h-5" />}
            color="bg-purple-500"
          />
          <StatCard
            title="Completed"
            value={groupedDocs.filter(g => g.totalDocs >= 6).length}
            icon={<CheckCircle className="w-5 h-5" />}
            color="bg-amber-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterDestination}
            onChange={(e) => setFilterDestination(e.target.value)}
            className="px-4 py-2 border border-input rounded-md bg-background"
          >
            <option value="all">All Destinations</option>
            {getDestinations().map((dest) => (
              <option key={dest} value={dest}>
                {dest}
              </option>
            ))}
          </select>
        </div>

        {/* Documents Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No documents found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Completion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredDocs.map((group) => (
                    <motion.tr
                      key={group.userId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{group.userName}</div>
                          <div className="text-sm text-muted-foreground">{group.userEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{group.destination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">{group.totalDocs} uploaded</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[100px]">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${Math.min(100, (group.totalDocs / 10) * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((group.totalDocs / 10) * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(group.uploadedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetailsModal(group)}
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
      {showDetailsModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedGroup.userName}'s Documents</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedGroup.userEmail} • {selectedGroup.destination}
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
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <InfoItem icon={<User className="w-4 h-4" />} label="Name" value={selectedGroup.userName} />
                <InfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={selectedGroup.userEmail} />
                <InfoItem icon={<MapPin className="w-4 h-4" />} label="Destination" value={selectedGroup.destination} />
                <InfoItem icon={<Calendar className="w-4 h-4" />} label="Uploaded" value={new Date(selectedGroup.uploadedDate).toLocaleDateString()} />
              </div>

              {/* Documents List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Uploaded Documents ({selectedGroup.totalDocs})</h3>
                <div className="space-y-3">
                  {selectedGroup.documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.category} • {doc.status}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploaded: {new Date(doc.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadDocument(doc.fileUrl, doc.name)}
                        >
                          <FileDown className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteDocument(doc._id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Summary */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Documentation Progress</span>
                  <span className="text-sm font-medium">
                    {Math.round((selectedGroup.totalDocs / 10) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${Math.min(100, (selectedGroup.totalDocs / 10) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedGroup.totalDocs} of 10 documents uploaded
                </p>
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
        <p className="text-sm font-medium">{value || "N/A"}</p>
      </div>
    </div>
  );
}