// src/pages/Documentation.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, CheckCircle, AlertCircle, Clock, User, Mail, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { documentationService } from "@/services/documentation";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  documentId: string;
  name: string;
  category: string;
  description: string;
  status: "required" | "optional" | "recommended";
  uploadDate?: string;
  file?: File;
  fileUrl?: string;
}

interface UserInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
}

const REQUIRED_DOCUMENTS = [
  {
    documentId: "passport",
    name: "Passport Bio Page",
    category: "Identity",
    description: "Clear scanned copy of your passport first page (bio page)",
    status: "required" as const,
  },
  {
    documentId: "photo",
    name: "Passport Size Photo",
    category: "Identity",
    description: "Recent passport size color photo (4x6 cm) on white background",
    status: "required" as const,
  },
  {
    documentId: "visa",
    name: "Visa/Visa Support Letter",
    category: "Travel",
    description: "Original visa or visa support letter from destination country",
    status: "required" as const,
  },
  {
    documentId: "itinerary",
    name: "Travel Itinerary",
    category: "Travel",
    description: "Detailed itinerary of your trip with dates and places",
    status: "required" as const,
  },
  {
    documentId: "hotel",
    name: "Hotel Booking / Invitation Letter",
    category: "Accommodation",
    description: "Confirmed hotel booking or invitation letter from host",
    status: "required" as const,
  },
  {
    documentId: "bank",
    name: "Bank Statement (Last 3-6 months)",
    category: "Financial",
    description: "Bank statement showing sufficient funds for the trip",
    status: "required" as const,
  },
  {
    documentId: "insurance",
    name: "Travel Insurance",
    category: "Insurance",
    description: "Travel insurance policy document",
    status: "optional" as const,
  },
  {
    documentId: "employment",
    name: "Employment Letter",
    category: "Employment",
    description: "Letter from employer stating your leave approval",
    status: "optional" as const,
  },
  {
    documentId: "pan",
    name: "PAN Card Copy",
    category: "Tax",
    description: "Copy of PAN card (if Indian citizen)",
    status: "recommended" as const,
  },
  {
    documentId: "aadhar",
    name: "Aadhaar Card Copy",
    category: "Identity",
    description: "Copy of Aadhaar card (if Indian citizen)",
    status: "recommended" as const,
  },
];

export default function Documentation() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, Document>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [isUserInfoSaved, setIsUserInfoSaved] = useState(false);

  useEffect(() => {
    if (user) {
      // Pre-fill user info from auth context
      setUserInfo({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phone || "",
      });
      loadMyDocuments();
    }
  }, [user]);

  const loadMyDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await documentationService.getMyDocuments();
      
      // Convert API response to uploadedDocs format
      const docsMap: Record<string, Document> = {};
      if (response.data?.documents && Array.isArray(response.data.documents)) {
        response.data.documents.forEach((doc: any) => {
          docsMap[doc.documentId] = {
            id: doc._id,
            documentId: doc.documentId,
            name: doc.name,
            category: doc.category,
            description: doc.description,
            status: doc.status,
            uploadDate: doc.createdAt,
            fileUrl: doc.fileUrl,
          };
        });
      }
      
      setUploadedDocs(docsMap);
    } catch (error: any) {
      console.error("Failed to load documents:", error);
      // Set empty object on error
      setUploadedDocs({});
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserInfoChange = (field: keyof UserInfo, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
    setIsUserInfoSaved(false);
  };

  const saveUserInfo = () => {
    if (!userInfo.fullName || !userInfo.email || !userInfo.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsUserInfoSaved(true);
    toast({
      title: "Information Saved",
      description: "Your contact information has been saved successfully",
    });
  };

  const handleFileUpload = async (docId: string, file: File) => {
    const doc = REQUIRED_DOCUMENTS.find((d) => d.documentId === docId);
    if (!doc) return;

    // Validate user info is filled
    if (!userInfo.fullName || !userInfo.email || !userInfo.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in your contact information and click 'Save Information' before uploading documents",
        variant: "destructive",
      });
      return;
    }

    if (!isUserInfoSaved) {
      toast({
        title: "Save Information First",
        description: "Please click 'Save Information' before uploading documents",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadProgress((prev) => ({ ...prev, [docId]: true }));

      await documentationService.uploadDocument(
        {
          documentId: doc.documentId,
          name: doc.name,
          category: doc.category,
          description: doc.description,
          status: doc.status,
        },
        file
      );

      toast({
        title: "Document uploaded",
        description: `${file.name} has been uploaded successfully`,
      });

      // Reload documents
      await loadMyDocuments();
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.response?.data?.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadProgress((prev) => ({ ...prev, [docId]: false }));
    }
  };

  const handleCompleteSubmission = () => {
    // Check if user info is saved
    if (!isUserInfoSaved) {
      toast({
        title: "Save Information First",
        description: "Please fill in and save your contact information",
        variant: "destructive",
      });
      return;
    }

    // Check required documents
    const requiredDocs = REQUIRED_DOCUMENTS.filter(d => d.status === "required");
    const uploadedRequiredDocs = requiredDocs.filter(d => uploadedDocs[d.documentId]);
    
    if (uploadedRequiredDocs.length < requiredDocs.length) {
      const missingDocs = requiredDocs
        .filter(d => !uploadedDocs[d.documentId])
        .map(d => d.name)
        .join(", ");
      
      toast({
        title: "Missing Required Documents",
        description: `Please upload the following required documents: ${missingDocs}`,
        variant: "destructive",
      });
      return;
    }

    // All validations passed
    setIsSubmitting(true);
    
    // Simulate submission (replace with actual API call if needed)
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Submission Successful!",
        description: `All ${Object.keys(uploadedDocs).length} documents have been submitted successfully. We will review your application shortly.`,
      });
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "required":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900";
      case "optional":
        return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900";
      case "recommended":
        return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900";
      default:
        return "bg-muted border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "required":
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />;
      case "optional":
        return <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />;
      case "recommended":
        return <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />;
      default:
        return null;
    }
  };

  const calculateProgress = () => {
    const uploaded = Object.keys(uploadedDocs).length;
    const total = REQUIRED_DOCUMENTS.length;
    return Math.round((uploaded / total) * 100);
  };

  const getRequiredDocsProgress = () => {
    const requiredDocs = REQUIRED_DOCUMENTS.filter(d => d.status === "required");
    const uploadedRequired = requiredDocs.filter(d => uploadedDocs[d.documentId]).length;
    return { uploaded: uploadedRequired, total: requiredDocs.length };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Travel Documentation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload all required documents for your visa application and travel preparation
            </p>
          </motion.div>

          {/* User Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Contact Information</h2>
                <p className="text-sm text-muted-foreground">
                  Please provide your details before uploading documents
                </p>
              </div>
              {isUserInfoSaved && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Saved</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={userInfo.fullName}
                  onChange={(e) => handleUserInfoChange("fullName", e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={userInfo.email}
                  onChange={(e) => handleUserInfoChange("email", e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={userInfo.phoneNumber}
                  onChange={(e) => handleUserInfoChange("phoneNumber", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              onClick={saveUserInfo}
              disabled={!userInfo.fullName || !userInfo.email || !userInfo.phoneNumber || isUserInfoSaved}
              className="w-full md:w-auto"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isUserInfoSaved ? "Information Saved" : "Save Information"}
            </Button>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold">Upload Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {Object.keys(uploadedDocs).length} of {REQUIRED_DOCUMENTS.length} documents uploaded
                  {" • "}
                  Required: {getRequiredDocsProgress().uploaded}/{getRequiredDocsProgress().total}
                </p>
              </div>
              <span className="text-2xl font-bold text-primary">{calculateProgress()}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </motion.div>

          {/* General Documents */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Required Documents */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-red-600 dark:bg-red-400 rounded-full"></div>
                  <h3 className="text-xl font-bold">Required Documents</h3>
                  <span className="text-sm text-muted-foreground">
                    ({getRequiredDocsProgress().uploaded}/{getRequiredDocsProgress().total} uploaded)
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {REQUIRED_DOCUMENTS.filter((d) => d.status === "required").map((doc) => (
                    <DocumentCard
                      key={doc.documentId}
                      doc={doc}
                      uploaded={uploadedDocs[doc.documentId]}
                      onUpload={(file) => handleFileUpload(doc.documentId, file)}
                      statusColor={getStatusColor(doc.status)}
                      statusIcon={getStatusIcon(doc.status)}
                      isUploading={uploadProgress[doc.documentId]}
                      disabled={!isUserInfoSaved}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Optional Documents */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  <h3 className="text-xl font-bold">Optional Documents</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {REQUIRED_DOCUMENTS.filter((d) => d.status === "optional").map((doc) => (
                    <DocumentCard
                      key={doc.documentId}
                      doc={doc}
                      uploaded={uploadedDocs[doc.documentId]}
                      onUpload={(file) => handleFileUpload(doc.documentId, file)}
                      statusColor={getStatusColor(doc.status)}
                      statusIcon={getStatusIcon(doc.status)}
                      isUploading={uploadProgress[doc.documentId]}
                      disabled={!isUserInfoSaved}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Recommended Documents */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-amber-600 dark:bg-amber-400 rounded-full"></div>
                  <h3 className="text-xl font-bold">Recommended Documents</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {REQUIRED_DOCUMENTS.filter((d) => d.status === "recommended").map((doc) => (
                    <DocumentCard
                      key={doc.documentId}
                      doc={doc}
                      uploaded={uploadedDocs[doc.documentId]}
                      onUpload={(file) => handleFileUpload(doc.documentId, file)}
                      statusColor={getStatusColor(doc.status)}
                      statusIcon={getStatusIcon(doc.status)}
                      isUploading={uploadProgress[doc.documentId]}
                      disabled={!isUserInfoSaved}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-12 flex justify-center">
            <Button 
              size="lg" 
              className="px-8"
              onClick={handleCompleteSubmission}
              disabled={isSubmitting || !isUserInfoSaved || getRequiredDocsProgress().uploaded < getRequiredDocsProgress().total}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Complete Submission
                </>
              )}
            </Button>
          </div>

          {/* Button Status Message */}
          {!isUserInfoSaved && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Please save your contact information to enable document uploads
            </p>
          )}
          {isUserInfoSaved && getRequiredDocsProgress().uploaded < getRequiredDocsProgress().total && (
            <p className="text-center text-sm text-amber-600 dark:text-amber-400 mt-4">
              Please upload all {getRequiredDocsProgress().total} required documents to complete submission
            </p>
          )}
          {isUserInfoSaved && getRequiredDocsProgress().uploaded === getRequiredDocsProgress().total && (
            <p className="text-center text-sm text-green-600 dark:text-green-400 mt-4">
              All required documents uploaded! Click "Complete Submission" to proceed.
            </p>
          )}

          {/* Important Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg"
          >
            <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-3">Important Information</h3>
            <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
              <li>• All documents must be clear, readable, and in English (or with certified translation)</li>
              <li>• Accepted formats: PDF, JPG, PNG (Maximum 5MB per file)</li>
              <li>• Original documents must be presented during visa interview</li>
              <li>• Keep copies of all submitted documents for your records</li>
              <li>• Document requirements may vary based on your nationality and destination</li>
              <li>• Ensure all information is accurate and up-to-date</li>
            </ul>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function DocumentCard({
  doc,
  uploaded,
  onUpload,
  statusColor,
  statusIcon,
  isUploading,
  disabled,
}: {
  doc: any;
  uploaded?: Document;
  onUpload: (file: File) => void;
  statusColor: string;
  statusIcon: React.ReactNode;
  isUploading?: boolean;
  disabled?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "p-5 rounded-lg border-2", 
        statusColor, 
        uploaded && "ring-2 ring-primary ring-offset-2 dark:ring-offset-background",
        disabled && !uploaded && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          {statusIcon}
          <div>
            <h4 className="font-semibold text-sm">{doc.name}</h4>
            <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
          </div>
        </div>
      </div>

      {uploaded ? (
        <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded text-sm text-green-800 dark:text-green-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>✓ Document uploaded</span>
          </div>
          {uploaded.uploadDate && (
            <p className="text-xs mt-1 text-green-600 dark:text-green-400">
              Uploaded: {new Date(uploaded.uploadDate).toLocaleDateString()}
            </p>
          )}
        </div>
      ) : (
        <label className="block">
          <input
            type="file"
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            disabled={isUploading || disabled}
          />
          <div className={cn(
            "p-3 text-center cursor-pointer bg-primary/5 hover:bg-primary/10 border-2 border-dashed border-primary rounded transition-colors",
            (isUploading || disabled) && "opacity-50 cursor-not-allowed"
          )}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mx-auto mb-1 text-primary animate-spin" />
                <p className="text-xs font-medium text-primary">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mx-auto mb-1 text-primary" />
                <p className="text-xs font-medium text-primary">
                  {disabled ? "Save info first" : "Click to upload"}
                </p>
              </>
            )}
          </div>
        </label>
      )}

      <p className="text-xs text-muted-foreground mt-3">
        Status: <span className="font-semibold capitalize">{doc.status}</span>
      </p>
    </motion.div>
  );
}