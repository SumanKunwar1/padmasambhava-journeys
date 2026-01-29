// src/pages/VisaApplication.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Check, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { visaApplicationService, VisaApplicationData } from "@/services/visaApplications";

interface FormData extends VisaApplicationData {
  passportBioFile?: File;
  passportPhotoFile?: File;
  supportingDocumentsFile?: File;
}

const SECTION_TITLES = [
  "Personal Information",
  "Passport Information",
  "Contact Details",
  "Travel Information",
  "Accommodation & Travel Plan",
  "Financial Information",
  "Sponsor Information",
  "Travel History",
  "Health & Insurance",
  "Document Upload",
  "Declaration",
];

export default function VisaApplication() {
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    placeOfBirth: "",
    nationality: "",
    maritalStatus: "",
    occupation: "",
    religion: "",
    passportType: "",
    passportNumber: "",
    placeOfIssue: "",
    dateOfIssue: "",
    dateOfExpiry: "",
    issuingCountry: "",
    residentialAddress: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
    email: "",
    destinationCountry: "",
    purposeOfVisit: "",
    arrivalDate: "",
    departureDate: "",
    durationOfStay: "",
    numberOfEntries: "",
    accommodationType: "",
    accommodationAddress: "",
    travelPackageName: "",
    placesToVisit: "",
    expensesBearer: "",
    estimatedBudget: "",
    sufficientFunds: "",
    sponsorName: "",
    sponsorRelationship: "",
    sponsorAddress: "",
    sponsorPhone: "",
    travelledBefore: "",
    countriesVisited: "",
    overstayedVisa: "",
    refusedVisa: "",
    refusalDetails: "",
    hasInsurance: "",
    medicalCondition: "",
    agreeToTerms: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only PDF, JPG, and PNG files are allowed",
          variant: "destructive",
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  const validateCurrentSection = (): boolean => {
    const requiredFieldsBySection: Record<number, string[]> = {
      0: ["fullName", "gender", "dateOfBirth", "placeOfBirth", "nationality", "maritalStatus", "occupation"],
      1: ["passportType", "passportNumber", "placeOfIssue", "dateOfIssue", "dateOfExpiry", "issuingCountry"],
      2: ["residentialAddress", "city", "country", "postalCode", "phone", "email"],
      3: ["destinationCountry", "purposeOfVisit", "arrivalDate", "departureDate", "durationOfStay", "numberOfEntries"],
      4: ["accommodationType", "accommodationAddress"],
      5: ["expensesBearer", "estimatedBudget", "sufficientFunds"],
      7: ["travelledBefore", "overstayedVisa", "refusedVisa"],
      8: ["hasInsurance"],
      9: ["passportBioFile", "passportPhotoFile"],
      10: ["agreeToTerms"],
    };

    const fieldsToValidate = requiredFieldsBySection[currentSection];
    
    if (!fieldsToValidate) return true;

    for (const field of fieldsToValidate) {
      const value = formData[field as keyof FormData];
      if (value === "" || value === undefined || value === false) {
        toast({
          title: "Missing Required Field",
          description: `Please fill in all required fields in this section`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      setCurrentSection(Math.min(SECTION_TITLES.length - 1, currentSection + 1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    if (!formData.agreeToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    // Validate required files
    if (!formData.passportBioFile || !formData.passportPhotoFile) {
      toast({
        title: "Missing Documents",
        description: "Please upload passport bio page and passport photo",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Extract files from formData
      const { passportBioFile, passportPhotoFile, supportingDocumentsFile, ...applicationData } = formData;

      console.log("Submitting application with data:", applicationData);
      console.log("Files:", { passportBioFile, passportPhotoFile, supportingDocumentsFile });

      // Submit application
      const response = await visaApplicationService.submitApplication(applicationData, {
        passportBioFile,
        passportPhotoFile,
        supportingDocumentsFile,
      });

      console.log("Application submitted successfully:", response);

      toast({
        title: "Application Submitted!",
        description: "Your visa application has been submitted successfully. We'll review it and contact you soon.",
        duration: 5000,
      });

      // Reset form
      setFormData({
        fullName: "",
        gender: "",
        dateOfBirth: "",
        placeOfBirth: "",
        nationality: "",
        maritalStatus: "",
        occupation: "",
        religion: "",
        passportType: "",
        passportNumber: "",
        placeOfIssue: "",
        dateOfIssue: "",
        dateOfExpiry: "",
        issuingCountry: "",
        residentialAddress: "",
        city: "",
        country: "",
        postalCode: "",
        phone: "",
        email: "",
        destinationCountry: "",
        purposeOfVisit: "",
        arrivalDate: "",
        departureDate: "",
        durationOfStay: "",
        numberOfEntries: "",
        accommodationType: "",
        accommodationAddress: "",
        travelPackageName: "",
        placesToVisit: "",
        expensesBearer: "",
        estimatedBudget: "",
        sufficientFunds: "",
        sponsorName: "",
        sponsorRelationship: "",
        sponsorAddress: "",
        sponsorPhone: "",
        travelledBefore: "",
        countriesVisited: "",
        overstayedVisa: "",
        refusedVisa: "",
        refusalDetails: "",
        hasInsurance: "",
        medicalCondition: "",
        agreeToTerms: false,
      });
      setCurrentSection(0);
    } catch (error: any) {
      console.error("Application submission error:", error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || "Failed to submit application. Please try again.";

      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-display font-bold mb-3">Visa Application Form</h1>
            <p className="text-muted-foreground">
              Complete all sections to submit your visa application
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {SECTION_TITLES.map((title, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex-1 h-2 rounded-full mx-1 transition-colors",
                    index <= currentSection ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Step {currentSection + 1} of {SECTION_TITLES.length}</span>
              <span>{SECTION_TITLES[currentSection]}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-card border border-border rounded-lg shadow-lg">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <h2 className="text-2xl font-semibold mb-6">{SECTION_TITLES[currentSection]}</h2>

                <div className="space-y-6">
                  {/* Section 1: Personal Information */}
                  {currentSection === 0 && (
                    <>
                      <FormField
                        label="Full Name (as per passport)"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Gender"
                        name="gender"
                        type="select"
                        value={formData.gender}
                        onChange={handleInputChange}
                        options={["Male", "Female", "Other"]}
                        required
                      />
                      <FormField
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Place of Birth"
                        name="placeOfBirth"
                        placeholder="Enter place of birth"
                        value={formData.placeOfBirth}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Nationality"
                        name="nationality"
                        placeholder="Enter your nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Marital Status"
                        name="maritalStatus"
                        type="select"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        options={["Single", "Married", "Divorced", "Widowed"]}
                        required
                      />
                      <FormField
                        label="Occupation"
                        name="occupation"
                        placeholder="Enter your occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Religion (Optional)"
                        name="religion"
                        placeholder="Enter your religion"
                        value={formData.religion}
                        onChange={handleInputChange}
                      />
                    </>
                  )}

                  {/* Section 2: Passport Information */}
                  {currentSection === 1 && (
                    <>
                      <FormField
                        label="Passport Type"
                        name="passportType"
                        type="select"
                        value={formData.passportType}
                        onChange={handleInputChange}
                        options={["Ordinary", "Official", "Diplomatic"]}
                        required
                      />
                      <FormField
                        label="Passport Number"
                        name="passportNumber"
                        placeholder="Enter passport number"
                        value={formData.passportNumber}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Place of Issue"
                        name="placeOfIssue"
                        placeholder="Enter place of issue"
                        value={formData.placeOfIssue}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Date of Issue"
                        name="dateOfIssue"
                        type="date"
                        value={formData.dateOfIssue}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Date of Expiry"
                        name="dateOfExpiry"
                        type="date"
                        value={formData.dateOfExpiry}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Issuing Country"
                        name="issuingCountry"
                        placeholder="Enter issuing country"
                        value={formData.issuingCountry}
                        onChange={handleInputChange}
                        required
                      />
                    </>
                  )}

                  {/* Section 3: Contact Details */}
                  {currentSection === 2 && (
                    <>
                      <FormField
                        label="Residential Address"
                        name="residentialAddress"
                        type="textarea"
                        placeholder="Enter your full address"
                        value={formData.residentialAddress}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="City"
                        name="city"
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Country"
                        name="country"
                        placeholder="Enter country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Postal Code"
                        name="postalCode"
                        placeholder="Enter postal code"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="+977 9xxxxxxxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </>
                  )}

                  {/* Section 4: Travel Information */}
                  {currentSection === 3 && (
                    <>
                      <FormField
                        label="Destination Country"
                        name="destinationCountry"
                        placeholder="Enter destination country"
                        value={formData.destinationCountry}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Purpose of Visit"
                        name="purposeOfVisit"
                        type="select"
                        value={formData.purposeOfVisit}
                        onChange={handleInputChange}
                        options={["Tourism", "Business", "Education", "Medical", "Family Visit", "Other"]}
                        required
                      />
                      <FormField
                        label="Expected Arrival Date"
                        name="arrivalDate"
                        type="date"
                        value={formData.arrivalDate}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Expected Departure Date"
                        name="departureDate"
                        type="date"
                        value={formData.departureDate}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Duration of Stay"
                        name="durationOfStay"
                        placeholder="e.g., 14 days"
                        value={formData.durationOfStay}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Number of Entries"
                        name="numberOfEntries"
                        type="select"
                        value={formData.numberOfEntries}
                        onChange={handleInputChange}
                        options={["Single Entry", "Multiple Entry"]}
                        required
                      />
                    </>
                  )}

                  {/* Section 5: Accommodation */}
                  {currentSection === 4 && (
                    <>
                      <FormField
                        label="Accommodation Type"
                        name="accommodationType"
                        type="select"
                        value={formData.accommodationType}
                        onChange={handleInputChange}
                        options={["Hotel", "Friend/Relative", "Hostel", "Rental", "Other"]}
                        required
                      />
                      <FormField
                        label="Accommodation Address"
                        name="accommodationAddress"
                        type="textarea"
                        placeholder="Enter accommodation address"
                        value={formData.accommodationAddress}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Travel Package Name (Optional)"
                        name="travelPackageName"
                        placeholder="Enter package name if applicable"
                        value={formData.travelPackageName}
                        onChange={handleInputChange}
                      />
                      <FormField
                        label="Places to Visit (Optional)"
                        name="placesToVisit"
                        type="textarea"
                        placeholder="List places you plan to visit"
                        value={formData.placesToVisit}
                        onChange={handleInputChange}
                      />
                    </>
                  )}

                  {/* Section 6: Financial */}
                  {currentSection === 5 && (
                    <>
                      <FormField
                        label="Who will bear travel expenses?"
                        name="expensesBearer"
                        type="select"
                        value={formData.expensesBearer}
                        onChange={handleInputChange}
                        options={["Self", "Sponsor", "Company", "Other"]}
                        required
                      />
                      <FormField
                        label="Estimated Budget"
                        name="estimatedBudget"
                        placeholder="e.g., USD 5000"
                        value={formData.estimatedBudget}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Do you have sufficient funds?"
                        name="sufficientFunds"
                        type="select"
                        value={formData.sufficientFunds}
                        onChange={handleInputChange}
                        options={["Yes", "No"]}
                        required
                      />
                    </>
                  )}

                  {/* Section 7: Sponsor */}
                  {currentSection === 6 && (
                    <>
                      <div className="bg-muted p-4 rounded-lg mb-4">
                        <p className="text-sm text-muted-foreground">
                          If you have a sponsor, please provide their information. Otherwise, you can skip this section.
                        </p>
                      </div>
                      <FormField
                        label="Sponsor Name (Optional)"
                        name="sponsorName"
                        placeholder="Enter sponsor name"
                        value={formData.sponsorName}
                        onChange={handleInputChange}
                      />
                      <FormField
                        label="Relationship with Sponsor (Optional)"
                        name="sponsorRelationship"
                        placeholder="e.g., Parent, Friend, Employer"
                        value={formData.sponsorRelationship}
                        onChange={handleInputChange}
                      />
                      <FormField
                        label="Sponsor Address (Optional)"
                        name="sponsorAddress"
                        type="textarea"
                        placeholder="Enter sponsor address"
                        value={formData.sponsorAddress}
                        onChange={handleInputChange}
                      />
                      <FormField
                        label="Sponsor Phone (Optional)"
                        name="sponsorPhone"
                        type="tel"
                        placeholder="Enter sponsor phone"
                        value={formData.sponsorPhone}
                        onChange={handleInputChange}
                      />
                    </>
                  )}

                  {/* Section 8: Travel History */}
                  {currentSection === 7 && (
                    <>
                      <FormField
                        label="Have you travelled abroad before?"
                        name="travelledBefore"
                        type="select"
                        value={formData.travelledBefore}
                        onChange={handleInputChange}
                        options={["Yes", "No"]}
                        required
                      />
                      {formData.travelledBefore === "Yes" && (
                        <FormField
                          label="List of countries visited"
                          name="countriesVisited"
                          type="textarea"
                          placeholder="Enter countries you've visited"
                          value={formData.countriesVisited}
                          onChange={handleInputChange}
                        />
                      )}
                      <FormField
                        label="Have you ever overstayed a visa?"
                        name="overstayedVisa"
                        type="select"
                        value={formData.overstayedVisa}
                        onChange={handleInputChange}
                        options={["Yes", "No"]}
                        required
                      />
                      <FormField
                        label="Have you ever been refused a visa?"
                        name="refusedVisa"
                        type="select"
                        value={formData.refusedVisa}
                        onChange={handleInputChange}
                        options={["Yes", "No"]}
                        required
                      />
                      {formData.refusedVisa === "Yes" && (
                        <FormField
                          label="If yes, please provide details"
                          name="refusalDetails"
                          type="textarea"
                          placeholder="Provide details"
                          value={formData.refusalDetails}
                          onChange={handleInputChange}
                        />
                      )}
                    </>
                  )}

                  {/* Section 9: Health */}
                  {currentSection === 8 && (
                    <>
                      <FormField
                        label="Do you have travel insurance?"
                        name="hasInsurance"
                        type="select"
                        value={formData.hasInsurance}
                        onChange={handleInputChange}
                        options={["Yes", "No"]}
                        required
                      />
                      <FormField
                        label="Any serious medical condition? (Optional)"
                        name="medicalCondition"
                        type="textarea"
                        placeholder="Enter medical condition if any"
                        value={formData.medicalCondition}
                        onChange={handleInputChange}
                      />
                    </>
                  )}

                  {/* Section 10: Document Upload */}
                  {currentSection === 9 && (
                    <>
                      <FileUploadField
                        label="Upload Passport Bio Page"
                        name="passportBioFile"
                        onChange={(e) => handleFileChange(e, "passportBioFile")}
                        file={formData.passportBioFile}
                        required
                      />
                      <FileUploadField
                        label="Upload Passport Size Photo"
                        name="passportPhotoFile"
                        onChange={(e) => handleFileChange(e, "passportPhotoFile")}
                        file={formData.passportPhotoFile}
                        required
                      />
                      <FileUploadField
                        label="Upload Supporting Documents (Optional)"
                        name="supportingDocumentsFile"
                        onChange={(e) => handleFileChange(e, "supportingDocumentsFile")}
                        file={formData.supportingDocumentsFile}
                      />
                    </>
                  )}

                  {/* Section 11: Declaration */}
                  {currentSection === 10 && (
                    <>
                      <div className="bg-muted rounded-lg p-6 space-y-4">
                        <p className="text-sm leading-relaxed">
                          I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that:
                        </p>
                        <ul className="text-sm space-y-2 list-disc list-inside">
                          <li>Padma Sambhava Trip Pvt. Ltd. provides visa support documents only</li>
                          <li>Visa approval is solely determined by embassies or immigration authorities</li>
                          <li>I am responsible for providing accurate information</li>
                          <li>My personal data will be handled according to privacy policy</li>
                        </ul>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          className="w-5 h-5 cursor-pointer"
                          id="agreeToTerms"
                        />
                        <label htmlFor="agreeToTerms" className="text-sm cursor-pointer">
                          I agree to the terms & conditions and confirm that all information is accurate
                        </label>
                      </div>
                    </>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                    disabled={currentSection === 0 || isSubmitting}
                  >
                    Previous
                  </Button>

                  {currentSection === SECTION_TITLES.length - 1 ? (
                    <Button
                      type="submit"
                      className="ml-auto"
                      disabled={isSubmitting || !formData.agreeToTerms}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="ml-auto"
                      disabled={isSubmitting}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Helper Components
function FormField({ label, name, type = "text", placeholder = "", value, onChange, options = [], required = false }: any) {
  if (type === "select") {
    return (
      <div>
        <label className="block text-sm font-medium mb-2">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div>
        <label className="block text-sm font-medium mb-2">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
        <Textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          rows={4}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

function FileUploadField({ label, name, onChange, file, required = false }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
        <input
          type="file"
          name={name}
          onChange={onChange}
          required={required}
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          id={name}
        />
        <label htmlFor={name} className="cursor-pointer">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</p>
          {file && (
            <div className="mt-3 p-2 bg-primary/10 rounded text-sm text-primary flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>{file.name}</span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}