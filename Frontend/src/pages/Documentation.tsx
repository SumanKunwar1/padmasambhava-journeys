// src/pages/Documentation.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Upload, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "required" | "optional" | "recommended";
  uploadDate?: string;
  file?: File;
}

const REQUIRED_DOCUMENTS: Document[] = [
  {
    id: "passport",
    name: "Passport Bio Page",
    category: "Identity",
    description: "Clear scanned copy of your passport first page (bio page)",
    status: "required",
  },
  {
    id: "photo",
    name: "Passport Size Photo",
    category: "Identity",
    description: "Recent passport size color photo (4x6 cm) on white background",
    status: "required",
  },
  {
    id: "visa",
    name: "Visa/Visa Support Letter",
    category: "Travel",
    description: "Original visa or visa support letter from destination country",
    status: "required",
  },
  {
    id: "itinerary",
    name: "Travel Itinerary",
    category: "Travel",
    description: "Detailed itinerary of your trip with dates and places",
    status: "required",
  },
  {
    id: "hotel",
    name: "Hotel Booking / Invitation Letter",
    category: "Accommodation",
    description: "Confirmed hotel booking or invitation letter from host",
    status: "required",
  },
  {
    id: "bank",
    name: "Bank Statement (Last 3-6 months)",
    category: "Financial",
    description: "Bank statement showing sufficient funds for the trip",
    status: "required",
  },
  {
    id: "insurance",
    name: "Travel Insurance",
    category: "Insurance",
    description: "Travel insurance policy document",
    status: "optional",
  },
  {
    id: "employment",
    name: "Employment Letter",
    category: "Employment",
    description: "Letter from employer stating your leave approval",
    status: "optional",
  },
  {
    id: "pan",
    name: "PAN Card Copy",
    category: "Tax",
    description: "Copy of PAN card (if Indian citizen)",
    status: "recommended",
  },
  {
    id: "aadhar",
    name: "Aadhaar Card Copy",
    category: "Identity",
    description: "Copy of Aadhaar card (if Indian citizen)",
    status: "recommended",
  },
];

const DESTINATION_SPECIFIC = {
  georgia: {
    name: "Georgia",
    documents: [
      "Passport valid for 6 months",
      "Return airline tickets",
      "Proof of accommodation",
      "Travel insurance (optional)",
      "Letter of invitation (if applicable)",
    ],
  },
  thailand: {
    name: "Thailand",
    documents: [
      "Passport valid for 6 months",
      "Return airline tickets",
      "Hotel booking",
      "Travel insurance",
      "Bank statement",
      "Employment letter",
    ],
  },
  bhutan: {
    name: "Bhutan",
    documents: [
      "Passport valid for 6 months",
      "Pre-booked tour with licensed operator",
      "Travel insurance",
      "Hotel booking confirmation",
      "Vaccination certificate (if required)",
    ],
  },
};

export default function Documentation() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, Document>>({});
  const [selectedDestination, setSelectedDestination] = useState<keyof typeof DESTINATION_SPECIFIC>("georgia");

  const handleFileUpload = (docId: string, file: File) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docId]: {
        ...REQUIRED_DOCUMENTS.find((d) => d.id === docId)!,
        file,
        uploadDate: new Date().toISOString(),
      },
    }));

    toast({
      title: "Document uploaded",
      description: `${file.name} has been uploaded successfully`,
    });
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
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "optional":
        return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "recommended":
        return <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const uploadProgress = (Object.keys(uploadedDocs).length / REQUIRED_DOCUMENTS.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4">
        <div className="container-custom max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-display font-bold mb-3">Documentation Portal</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manage and upload all your travel documentation in one place
            </p>
          </motion.div>

          {/* User Status */}
          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-lg"
            >
              <p className="text-sm">
                <span className="font-semibold">Logged in as:</span> {user.fullName} ({user.email})
              </p>
            </motion.div>
          )}

          {/* Upload Progress */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Documentation Progress</h3>
              <span className="text-sm font-medium">{Math.round(uploadProgress)}% Complete</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Object.keys(uploadedDocs).length} of {REQUIRED_DOCUMENTS.length} documents uploaded
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="mb-8 flex gap-3 border-b border-border">
            <button
              onClick={() => setSelectedDestination("georgia")}
              className={cn(
                "px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px",
                selectedDestination === "georgia"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Georgia
            </button>
            <button
              onClick={() => setSelectedDestination("thailand")}
              className={cn(
                "px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px",
                selectedDestination === "thailand"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Thailand
            </button>
            <button
              onClick={() => setSelectedDestination("bhutan")}
              className={cn(
                "px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px",
                selectedDestination === "bhutan"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Bhutan
            </button>
          </div>

          {/* Destination-Specific Documents */}
          <motion.div
            key={selectedDestination}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">
              Documents Required for {DESTINATION_SPECIFIC[selectedDestination].name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DESTINATION_SPECIFIC[selectedDestination].documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{doc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* General Documents */}
          <div className="space-y-8">
            {/* Required Documents */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 10 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-red-600 dark:bg-red-400 rounded-full"></div>
                <h3 className="text-xl font-bold">Required Documents</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {REQUIRED_DOCUMENTS.filter((d) => d.status === "required").map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    uploaded={uploadedDocs[doc.id]}
                    onUpload={(file) => handleFileUpload(doc.id, file)}
                    statusColor={getStatusColor(doc.status)}
                    statusIcon={getStatusIcon(doc.status)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Optional Documents */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 10 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                <h3 className="text-xl font-bold">Optional Documents</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {REQUIRED_DOCUMENTS.filter((d) => d.status === "optional").map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    uploaded={uploadedDocs[doc.id]}
                    onUpload={(file) => handleFileUpload(doc.id, file)}
                    statusColor={getStatusColor(doc.status)}
                    statusIcon={getStatusIcon(doc.status)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Recommended Documents */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 10 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-amber-600 dark:bg-amber-400 rounded-full"></div>
                <h3 className="text-xl font-bold">Recommended Documents</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {REQUIRED_DOCUMENTS.filter((d) => d.status === "recommended").map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    uploaded={uploadedDocs[doc.id]}
                    onUpload={(file) => handleFileUpload(doc.id, file)}
                    statusColor={getStatusColor(doc.status)}
                    statusIcon={getStatusIcon(doc.status)}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Submit Button */}
          <div className="mt-12 flex justify-center">
            <Button size="lg" className="px-8">
              <Upload className="w-5 h-5 mr-2" />
              Proceed with Application
            </Button>
          </div>

          {/* Important Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 10 }}
            className="mt-12 p-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg"
          >
            <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-3">Important Information</h3>
            <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
              <li>• All documents must be clear, readable, and in English</li>
              <li>• Accepted formats: PDF, JPG, PNG (Maximum 5MB per file)</li>
              <li>• Original documents must be presented during visa interview</li>
              <li>• Keep copies of all submitted documents for your records</li>
              <li>• Document requirements may vary based on your nationality and destination</li>
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
}: {
  doc: Document;
  uploaded?: Document;
  onUpload: (file: File) => void;
  statusColor: string;
  statusIcon: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("p-5 rounded-lg border-2", statusColor, uploaded && "ring-2 ring-primary ring-offset-2 dark:ring-offset-background")}
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
            <span>✓ Uploaded: {uploaded.file?.name}</span>
          </div>
        </div>
      ) : (
        <label className="block">
          <input
            type="file"
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />
          <div className="p-3 text-center cursor-pointer bg-primary/5 hover:bg-primary/10 border-2 border-dashed border-primary rounded transition-colors">
            <Upload className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-xs font-medium text-primary">Click to upload</p>
          </div>
        </label>
      )}

      <p className="text-xs text-muted-foreground mt-3">
        Status: <span className="font-semibold capitalize">{doc.status}</span>
      </p>
    </motion.div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}