// src/pages/VisaApplication.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Check, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

interface FormData {
  // Section 1: Personal Information
  fullName: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  maritalStatus: string;
  occupation: string;
  religion: string;

  // Section 2: Passport Information
  passportType: string;
  passportNumber: string;
  placeOfIssue: string;
  dateOfIssue: string;
  dateOfExpiry: string;
  issuingCountry: string;

  // Section 3: Contact Details
  residentialAddress: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;

  // Section 4: Travel Information
  destinationCountry: string;
  purposeOfVisit: string;
  arrivalDate: string;
  departureDate: string;
  durationOfStay: string;
  numberOfEntries: string;

  // Section 5: Accommodation
  accommodationType: string;
  accommodationAddress: string;
  travelPackageName: string;
  placesToVisit: string;

  // Section 6: Financial
  expensesBearer: string;
  estimatedBudget: string;
  sufficientFunds: string;

  // Section 7: Sponsor
  sponsorName: string;
  sponsorRelationship: string;
  sponsorAddress: string;
  sponsorPhone: string;

  // Section 8: Travel History
  travelledBefore: string;
  countriesVisited: string;
  overstayedVisa: string;
  refusedVisa: string;
  refusalDetails: string;

  // Section 9: Health
  hasInsurance: string;
  medicalCondition: string;

  // Section 10: Documents
  passportBioFile?: File;
  passportPhotoFile?: File;
  supportingDocumentsFile?: File;

  // Section 11: Declaration
  agreeToTerms: boolean;
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
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.passportNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          submitData.append(key, value);
        } else if (typeof value === "boolean") {
          submitData.append(key, value ? "true" : "false");
        } else {
          submitData.append(key, value as string);
        }
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Application Submitted!",
        description: "Your visa application has been submitted successfully. We'll review it and contact you soon.",
      });

      // Store in localStorage for dashboard
      const applications = JSON.parse(localStorage.getItem("visaApplications") || "[]");
      applications.push({
        id: Date.now().toString(),
        name: formData.fullName,
        destination: formData.destinationCountry,
        status: "Under Review",
        submittedDate: new Date().toISOString(),
        data: formData,
      });
      localStorage.setItem("visaApplications", JSON.stringify(applications));

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
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-display font-bold mb-3">Tourist Visa Application</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete this form to apply for visa assistance. All information provided will be kept confidential.
            </p>
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <span className="font-semibold">Important:</span> Padma Sambhava Trip provides visa support documents only. We do not guarantee visa approval.
              </p>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">
                Section {currentSection + 1} of {SECTION_TITLES.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(((currentSection + 1) / SECTION_TITLES.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${((currentSection + 1) / SECTION_TITLES.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Section List */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-4 sticky top-24">
                <h3 className="font-semibold mb-4">Sections</h3>
                <div className="space-y-2">
                  {SECTION_TITLES.map((title, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentSection(index)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        currentSection === index
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {index + 1}. {title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Form Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card rounded-xl border border-border p-8"
              >
                <h2 className="text-2xl font-bold mb-6">
                  {SECTION_TITLES[currentSection]}
                </h2>

                <div className="space-y-6">
                  {/* Section 1: Personal Information */}
                  {currentSection === 0 && (
                    <>
                      <FormField
                        label="Full Name (as per Passport)"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Gender"
                          name="gender"
                          type="select"
                          value={formData.gender}
                          onChange={handleInputChange}
                          options={["Male", "Female", "Other"]}
                        />
                        <FormField
                          label="Date of Birth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                        />
                      </div>
                      <FormField
                        label="Place of Birth (City, Country)"
                        name="placeOfBirth"
                        type="text"
                        placeholder="Enter place of birth"
                        value={formData.placeOfBirth}
                        onChange={handleInputChange}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Nationality"
                          name="nationality"
                          type="text"
                          placeholder="Enter nationality"
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
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Occupation"
                          name="occupation"
                          type="text"
                          placeholder="Enter occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                        />
                        <FormField
                          label="Religion (Optional)"
                          name="religion"
                          type="text"
                          placeholder="Enter religion"
                          value={formData.religion}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}

                  {/* Section 2: Passport Information */}
                  {currentSection === 1 && (
                    <>
                      <FormField
                        label="Passport Number"
                        name="passportNumber"
                        type="text"
                        placeholder="Enter passport number"
                        value={formData.passportNumber}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Passport Type"
                        name="passportType"
                        type="select"
                        value={formData.passportType}
                        onChange={handleInputChange}
                        options={["Ordinary", "Official", "Diplomatic"]}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Place of Issue"
                          name="placeOfIssue"
                          type="text"
                          placeholder="Enter place of issue"
                          value={formData.placeOfIssue}
                          onChange={handleInputChange}
                        />
                        <FormField
                          label="Issuing Country"
                          name="issuingCountry"
                          type="text"
                          placeholder="Enter issuing country"
                          value={formData.issuingCountry}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Date of Issue"
                          name="dateOfIssue"
                          type="date"
                          value={formData.dateOfIssue}
                          onChange={handleInputChange}
                        />
                        <FormField
                          label="Date of Expiry"
                          name="dateOfExpiry"
                          type="date"
                          value={formData.dateOfExpiry}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}

                  {/* Section 3: Contact Details */}
                  {currentSection === 2 && (
                    <>
                      <FormField
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="+91 00000 00000"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Current Residential Address"
                        name="residentialAddress"
                        type="textarea"
                        placeholder="Enter your residential address"
                        value={formData.residentialAddress}
                        onChange={handleInputChange}
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          label="City"
                          name="city"
                          type="text"
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                        <FormField
                          label="Country"
                          name="country"
                          type="text"
                          placeholder="Enter country"
                          value={formData.country}
                          onChange={handleInputChange}
                        />
                        <FormField
                          label="Postal Code"
                          name="postalCode"
                          type="text"
                          placeholder="Enter postal code"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}

                  {/* Section 4: Travel Information */}
                  {currentSection === 3 && (
                    <>
                      <FormField
                        label="Destination Country"
                        name="destinationCountry"
                        type="text"
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
                        options={["Tourism", "Sightseeing", "Cultural Visit", "Pilgrimage", "Wellness/Meditation Retreat"]}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Intended Date of Arrival"
                          name="arrivalDate"
                          type="date"
                          value={formData.arrivalDate}
                          onChange={handleInputChange}
                        />
                        <FormField
                          label="Intended Date of Departure"
                          name="departureDate"
                          type="date"
                          value={formData.departureDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Expected Duration of Stay (Days)"
                          name="durationOfStay"
                          type="number"
                          placeholder="Enter number of days"
                          value={formData.durationOfStay}
                          onChange={handleInputChange}
                        />
                        <FormField
                          label="Number of Entries Required"
                          name="numberOfEntries"
                          type="select"
                          value={formData.numberOfEntries}
                          onChange={handleInputChange}
                          options={["Single", "Double", "Multiple"]}
                        />
                      </div>
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
                        options={["Hotel", "Guest House", "Resort", "Monastery Guest House"]}
                      />
                      <FormField
                        label="Accommodation Address (if known)"
                        name="accommodationAddress"
                        type="textarea"
                        placeholder="Enter accommodation address"
                        value={formData.accommodationAddress}
                        onChange={handleInputChange}
                      />
                      <FormField
                        label="Travel Package Name (if booked)"
                        name="travelPackageName"
                        type="text"
                        placeholder="Enter travel package name"
                        value={formData.travelPackageName}
                        onChange={handleInputChange}
                      />
                      <FormField
                        label="Cities / Places to be Visited"
                        name="placesToVisit"
                        type="textarea"
                        placeholder="Enter cities and places"
                        value={formData.placesToVisit}
                        onChange={handleInputChange}
                      />
                    </>
                  )}

                  {/* Section 6: Financial */}
                  {currentSection === 5 && (
                    <>
                      <FormField
                        label="Who will bear the travel expenses?"
                        name="expensesBearer"
                        type="select"
                        value={formData.expensesBearer}
                        onChange={handleInputChange}
                        options={["Self", "Sponsor"]}
                      />
                      <FormField
                        label="Estimated Travel Budget (USD or local currency)"
                        name="estimatedBudget"
                        type="text"
                        placeholder="Enter estimated budget"
                        value={formData.estimatedBudget}
                        onChange={handleInputChange}
                      />
                      <FormField
                        label="Do you have sufficient funds for the trip?"
                        name="sufficientFunds"
                        type="select"
                        value={formData.sufficientFunds}
                        onChange={handleInputChange}
                        options={["Yes", "No"]}
                      />
                    </>
                  )}

                  {/* Section 7: Sponsor */}
                  {currentSection === 6 && (
                    <>
                      <FormField
                        label="Sponsor Name"
                        name="sponsorName"
                        type="text"
                        placeholder="Enter sponsor name"
                        value={formData.sponsorName}
                        onChange={handleInputChange}
                      />
                      <FormField
                        label="Relationship with Applicant"
                        name="sponsorRelationship"
                        type="text"
                        placeholder="Enter relationship"
                        value={formData.sponsorRelationship}
                        onChange={handleInputChange}
                      />
                      <FormField
                        label="Sponsor Address"
                        name="sponsorAddress"
                        type="textarea"
                        placeholder="Enter sponsor address"
                        value={formData.sponsorAddress}
                        onChange={handleInputChange}
                      />
                      <FormField
                        label="Sponsor Contact Number"
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
                        label="Have you traveled abroad before?"
                        name="travelledBefore"
                        type="select"
                        value={formData.travelledBefore}
                        onChange={handleInputChange}
                        options={["Yes", "No"]}
                      />
                      <FormField
                        label="Countries visited in the last 5 years"
                        name="countriesVisited"
                        type="textarea"
                        placeholder="List countries"
                        value={formData.countriesVisited}
                        onChange={handleInputChange}
                      />
                      <FormField
                        label="Have you ever overstayed a visa?"
                        name="overstayedVisa"
                        type="select"
                        value={formData.overstayedVisa}
                        onChange={handleInputChange}
                        options={["Yes", "No"]}
                      />
                      <FormField
                        label="Have you ever been refused a visa?"
                        name="refusedVisa"
                        type="select"
                        value={formData.refusedVisa}
                        onChange={handleInputChange}
                        options={["Yes", "No"]}
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
                          className="w-5 h-5"
                        />
                        <label className="text-sm">
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
                    disabled={currentSection === 0}
                  >
                    Previous
                  </Button>

                  {currentSection === SECTION_TITLES.length - 1 ? (
                    <Button
                      type="submit"
                      className="ml-auto"
                    >
                      Submit Application
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() =>
                        setCurrentSection(Math.min(SECTION_TITLES.length - 1, currentSection + 1))
                      }
                      className="ml-auto"
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
            <div className="mt-3 p-2 bg-primary/10 rounded text-sm text-primary">
              ✓ {file.name}
            </div>
          )}
        </label>
      </div>
    </div>
  );
}