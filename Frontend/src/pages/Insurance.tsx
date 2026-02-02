// src/pages/Insurance.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Upload,
  FileText,
  X,
  Plus,
  Calculator,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api-config";
import axios from "axios";

interface Traveler {
  fullName: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  passportNumber: string;
  nationality: string;
  email: string;
  phone: string;
}

const SECTION_TITLES = [
  "Personal Information",
  "Travel Details",
  "Insurance Plan",
  "Traveler Information",
  "Additional Coverage",
  "Medical Information",
  "Document Upload",
];

// Form Field Component
const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  options,
  rows,
}: any) => (
  <div>
    <label className="block text-sm font-medium mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Select {label}</option>
        {options?.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : type === "textarea" ? (
      <Textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows || 3}
      />
    ) : (
      <Input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    )}
  </div>
);

export default function Insurance() {
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedPremium, setCalculatedPremium] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    // Personal Information
    applicantName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",

    // Travel Information
    destination: "",
    tripType: "International",
    departureDate: "",
    returnDate: "",
    purposeOfTravel: "Leisure",

    // Insurance Plan
    planType: "Standard",
    coverageAmount: 500000,
    numberOfTravelers: 1,
    travelers: [
      {
        fullName: "",
        dateOfBirth: "",
        gender: "Male",
        passportNumber: "",
        nationality: "Indian",
        email: "",
        phone: "",
      },
    ] as Traveler[],

    // Additional Coverage
    additionalCoverages: {
      adventureSports: false,
      preExistingConditions: false,
      seniorCitizen: false,
      pregnancy: false,
      valuables: false,
    },

    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",

    // Medical Information
    hasPreExistingConditions: false,
    preExistingConditionsDetails: "",
    currentMedications: "",
    allergies: "",
  });

  const [files, setFiles] = useState<{
    passportCopy: File | null;
    medicalDocuments: File[];
  }>({
    passportCopy: null,
    medicalDocuments: [],
  });

  const planOptions = [
    { type: "Basic", price: "₹500", coverage: "₹3,00,000" },
    { type: "Standard", price: "₹1,000", coverage: "₹5,00,000" },
    { type: "Premium", price: "₹2,000", coverage: "₹10,00,000" },
    { type: "Family", price: "₹3,500", coverage: "₹15,00,000" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith("additionalCoverages.")) {
      const coverage = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        additionalCoverages: {
          ...prev.additionalCoverages,
          [coverage]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleTravelerChange = (index: number, field: keyof Traveler, value: string) => {
    const newTravelers = [...formData.travelers];
    newTravelers[index] = { ...newTravelers[index], [field]: value };
    setFormData((prev) => ({ ...prev, travelers: newTravelers }));
  };

  const addTraveler = () => {
    if (formData.travelers.length < 10) {
      setFormData((prev) => ({
        ...prev,
        numberOfTravelers: prev.numberOfTravelers + 1,
        travelers: [
          ...prev.travelers,
          {
            fullName: "",
            dateOfBirth: "",
            gender: "Male",
            passportNumber: "",
            nationality: "Indian",
            email: "",
            phone: "",
          },
        ],
      }));
    }
  };

  const removeTraveler = (index: number) => {
    if (formData.travelers.length > 1) {
      setFormData((prev) => ({
        ...prev,
        numberOfTravelers: prev.numberOfTravelers - 1,
        travelers: prev.travelers.filter((_, i) => i !== index),
      }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "passportCopy" | "medicalDocuments"
  ) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    if (field === "passportCopy") {
      setFiles((prev) => ({ ...prev, passportCopy: selectedFiles[0] }));
    } else {
      setFiles((prev) => ({
        ...prev,
        medicalDocuments: [...prev.medicalDocuments, ...Array.from(selectedFiles)],
      }));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => ({
      ...prev,
      medicalDocuments: prev.medicalDocuments.filter((_, i) => i !== index),
    }));
  };

  const calculatePremium = () => {
    let basePremium = 0;
    switch (formData.planType) {
      case "Basic":
        basePremium = 500;
        break;
      case "Standard":
        basePremium = 1000;
        break;
      case "Premium":
        basePremium = 2000;
        break;
      case "Family":
        basePremium = 3500;
        break;
    }

    let total = basePremium * formData.numberOfTravelers;

    if (formData.additionalCoverages.adventureSports) total += 500;
    if (formData.additionalCoverages.preExistingConditions) total += 800;
    if (formData.additionalCoverages.seniorCitizen) total += 1000;
    if (formData.additionalCoverages.pregnancy) total += 1200;
    if (formData.additionalCoverages.valuables) total += 300;

    setCalculatedPremium(total);
  };

  const nextSection = () => {
    if (currentSection < SECTION_TITLES.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "travelers") {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key === "additionalCoverages") {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined && value !== "") {
          formDataToSend.append(key, value.toString());
        }
      });

      if (files.passportCopy) {
        formDataToSend.append("passportCopy", files.passportCopy);
      }

      files.medicalDocuments.forEach((file, index) => {
        formDataToSend.append(`medicalDocument${index}`, file);
      });

      const response = await axios.post(`${API_BASE_URL}/insurance`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        toast({
          title: "Application Submitted Successfully",
          description: "We'll review your application and contact you soon.",
        });

        // Reset form
        setFormData({
          applicantName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
          destination: "",
          tripType: "International",
          departureDate: "",
          returnDate: "",
          purposeOfTravel: "Leisure",
          planType: "Standard",
          coverageAmount: 500000,
          numberOfTravelers: 1,
          travelers: [
            {
              fullName: "",
              dateOfBirth: "",
              gender: "Male",
              passportNumber: "",
              nationality: "Indian",
              email: "",
              phone: "",
            },
          ],
          additionalCoverages: {
            adventureSports: false,
            preExistingConditions: false,
            seniorCitizen: false,
            pregnancy: false,
            valuables: false,
          },
          emergencyContactName: "",
          emergencyContactPhone: "",
          emergencyContactRelation: "",
          hasPreExistingConditions: false,
          preExistingConditionsDetails: "",
          currentMedications: "",
          allergies: "",
        });
        setFiles({ passportCopy: null, medicalDocuments: [] });
        setCurrentSection(0);
        setCalculatedPremium(null);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.response?.data?.message || "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentSection + 1) / SECTION_TITLES.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            <span>Travel Insurance</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Travel Insurance Application</h1>
          <p className="text-muted-foreground">
            Protect your journey with comprehensive travel insurance coverage
          </p>
        </div>

        {/* Insurance Plans */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {planOptions.map((plan) => (
            <div
              key={plan.type}
              className={cn(
                "p-4 border-2 rounded-lg text-center cursor-pointer transition-all",
                formData.planType === plan.type
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => setFormData((prev) => ({ ...prev, planType: plan.type }))}
            >
              <h3 className="font-semibold mb-2">{plan.type}</h3>
              <p className="text-2xl font-bold text-primary mb-1">{plan.price}</p>
              <p className="text-sm text-muted-foreground">Coverage: {plan.coverage}</p>
            </div>
          ))}
        </div>

        {/* Premium Calculator */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Premium Calculator</h3>
            </div>
            <Button onClick={calculatePremium} variant="outline" size="sm">
              Calculate Premium
            </Button>
          </div>
          {calculatedPremium !== null && (
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Estimated Premium</p>
              <p className="text-3xl font-bold text-primary">₹{calculatedPremium.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Progress Bar */}
            <div className="bg-muted px-8 py-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">{SECTION_TITLES[currentSection]}</h2>
                <span className="text-sm text-muted-foreground">
                  Step {currentSection + 1} of {SECTION_TITLES.length}
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Form Sections */}
            <div className="p-8">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  {/* Section 0: Personal Information */}
                  {currentSection === 0 && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          label="Full Name"
                          name="applicantName"
                          value={formData.applicantName}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                        <FormField
                          label="Email Address"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          label="Phone Number"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 XXXXX XXXXX"
                          required
                        />
                        <FormField
                          label="Country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="India"
                          required
                        />
                      </div>

                      <FormField
                        label="Address"
                        type="textarea"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your complete address"
                        required
                      />

                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          label="City"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          required
                        />
                        <FormField
                          label="State"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          required
                        />
                        <FormField
                          label="Pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="PIN Code"
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Section 1: Travel Details */}
                  {currentSection === 1 && (
                    <>
                      <FormField
                        label="Destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder="Enter destination country/countries"
                        required
                      />

                      <FormField
                        label="Trip Type"
                        type="select"
                        name="tripType"
                        value={formData.tripType}
                        onChange={handleInputChange}
                        required
                        options={[
                          { value: "International", label: "International" },
                          { value: "Domestic", label: "Domestic" },
                        ]}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          label="Departure Date"
                          type="date"
                          name="departureDate"
                          value={formData.departureDate}
                          onChange={handleInputChange}
                          required
                        />
                        <FormField
                          label="Return Date"
                          type="date"
                          name="returnDate"
                          value={formData.returnDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <FormField
                        label="Purpose of Travel"
                        type="select"
                        name="purposeOfTravel"
                        value={formData.purposeOfTravel}
                        onChange={handleInputChange}
                        required
                        options={[
                          { value: "Leisure", label: "Leisure/Tourism" },
                          { value: "Business", label: "Business" },
                          { value: "Education", label: "Education" },
                          { value: "Medical", label: "Medical Treatment" },
                          { value: "Adventure", label: "Adventure Sports" },
                        ]}
                      />
                    </>
                  )}

                  {/* Section 2: Insurance Plan */}
                  {currentSection === 2 && (
                    <>
                      <FormField
                        label="Plan Type"
                        type="select"
                        name="planType"
                        value={formData.planType}
                        onChange={handleInputChange}
                        required
                        options={[
                          { value: "Basic", label: "Basic - ₹500" },
                          { value: "Standard", label: "Standard - ₹1,000" },
                          { value: "Premium", label: "Premium - ₹2,000" },
                          { value: "Family", label: "Family - ₹3,500" },
                        ]}
                      />

                      <FormField
                        label="Coverage Amount"
                        type="select"
                        name="coverageAmount"
                        value={formData.coverageAmount}
                        onChange={handleInputChange}
                        required
                        options={[
                          { value: "300000", label: "₹3,00,000" },
                          { value: "500000", label: "₹5,00,000" },
                          { value: "1000000", label: "₹10,00,000" },
                          { value: "1500000", label: "₹15,00,000" },
                        ]}
                      />

                      <FormField
                        label="Number of Travelers"
                        type="number"
                        name="numberOfTravelers"
                        value={formData.numberOfTravelers}
                        onChange={(e) => {
                          const count = parseInt(e.target.value);
                          if (count >= 1 && count <= 10) {
                            handleInputChange(e);
                          }
                        }}
                        required
                      />
                    </>
                  )}

                  {/* Section 3: Traveler Information */}
                  {currentSection === 3 && (
                    <>
                      {formData.travelers.map((traveler, index) => (
                        <div
                          key={index}
                          className="border border-border rounded-lg p-6 space-y-4 relative"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Traveler {index + 1}</h3>
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTraveler(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              label="Full Name"
                              name={`traveler${index}_fullName`}
                              value={traveler.fullName}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleTravelerChange(index, "fullName", e.target.value)
                              }
                              placeholder="Full name as per passport"
                              required
                            />
                            <FormField
                              label="Date of Birth"
                              type="date"
                              name={`traveler${index}_dateOfBirth`}
                              value={traveler.dateOfBirth}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleTravelerChange(index, "dateOfBirth", e.target.value)
                              }
                              required
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              label="Gender"
                              type="select"
                              name={`traveler${index}_gender`}
                              value={traveler.gender}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                handleTravelerChange(index, "gender", e.target.value)
                              }
                              required
                              options={[
                                { value: "Male", label: "Male" },
                                { value: "Female", label: "Female" },
                                { value: "Other", label: "Other" },
                              ]}
                            />
                            <FormField
                              label="Passport Number"
                              name={`traveler${index}_passportNumber`}
                              value={traveler.passportNumber}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleTravelerChange(index, "passportNumber", e.target.value)
                              }
                              placeholder="Passport number"
                              required
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              label="Nationality"
                              name={`traveler${index}_nationality`}
                              value={traveler.nationality}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleTravelerChange(index, "nationality", e.target.value)
                              }
                              placeholder="Nationality"
                              required
                            />
                            <FormField
                              label="Email"
                              type="email"
                              name={`traveler${index}_email`}
                              value={traveler.email}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleTravelerChange(index, "email", e.target.value)
                              }
                              placeholder="Email address"
                              required
                            />
                          </div>

                          <FormField
                            label="Phone"
                            type="tel"
                            name={`traveler${index}_phone`}
                            value={traveler.phone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleTravelerChange(index, "phone", e.target.value)
                            }
                            placeholder="Phone number"
                            required
                          />
                        </div>
                      ))}

                      {formData.travelers.length < 10 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addTraveler}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another Traveler
                        </Button>
                      )}
                    </>
                  )}

                  {/* Section 4: Additional Coverage */}
                  {currentSection === 4 && (
                    <>
                      <div className="space-y-3">
                        {[
                          {
                            key: "adventureSports",
                            label: "Adventure Sports Coverage",
                            desc: "Cover activities like trekking, skiing, scuba diving (+₹500)",
                          },
                          {
                            key: "preExistingConditions",
                            label: "Pre-existing Conditions",
                            desc: "Coverage for known medical conditions (+₹800)",
                          },
                          {
                            key: "seniorCitizen",
                            label: "Senior Citizen (60+)",
                            desc: "Enhanced coverage for travelers above 60 (+₹1,000)",
                          },
                          {
                            key: "pregnancy",
                            label: "Pregnancy Cover",
                            desc: "Medical coverage related to pregnancy (+₹1,200)",
                          },
                          {
                            key: "valuables",
                            label: "Valuables Protection",
                            desc: "Coverage for loss/theft of valuables (+₹300)",
                          },
                        ].map((coverage) => (
                          <label
                            key={coverage.key}
                            className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50"
                          >
                            <input
                              type="checkbox"
                              name={`additionalCoverages.${coverage.key}`}
                              checked={
                                formData.additionalCoverages[
                                  coverage.key as keyof typeof formData.additionalCoverages
                                ]
                              }
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                            <div>
                              <p className="font-medium">{coverage.label}</p>
                              <p className="text-sm text-muted-foreground">{coverage.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>

                      {/* Emergency Contact */}
                      <div className="mt-8 pt-6 border-t border-border">
                        <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            label="Contact Name"
                            name="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={handleInputChange}
                            placeholder="Emergency contact name"
                            required
                          />
                          <FormField
                            label="Contact Phone"
                            type="tel"
                            name="emergencyContactPhone"
                            value={formData.emergencyContactPhone}
                            onChange={handleInputChange}
                            placeholder="Emergency contact phone"
                            required
                          />
                          <FormField
                            label="Relation"
                            name="emergencyContactRelation"
                            value={formData.emergencyContactRelation}
                            onChange={handleInputChange}
                            placeholder="e.g., Spouse, Parent, Sibling"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Section 5: Medical Information */}
                  {currentSection === 5 && (
                    <>
                      <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          name="hasPreExistingConditions"
                          checked={formData.hasPreExistingConditions}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium">I have pre-existing medical conditions</p>
                          <p className="text-sm text-muted-foreground">
                            Please provide details if applicable
                          </p>
                        </div>
                      </label>

                      {formData.hasPreExistingConditions && (
                        <FormField
                          label="Pre-existing Conditions Details"
                          type="textarea"
                          name="preExistingConditionsDetails"
                          value={formData.preExistingConditionsDetails}
                          onChange={handleInputChange}
                          placeholder="Please describe your pre-existing conditions"
                          rows={4}
                        />
                      )}

                      <FormField
                        label="Current Medications (if any)"
                        type="textarea"
                        name="currentMedications"
                        value={formData.currentMedications}
                        onChange={handleInputChange}
                        placeholder="List any medications you're currently taking"
                      />

                      <FormField
                        label="Allergies (if any)"
                        type="textarea"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        placeholder="List any known allergies"
                      />
                    </>
                  )}

                  {/* Section 6: Documents */}
                  {currentSection === 6 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Passport Copy <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange(e, "passportCopy")}
                            className="hidden"
                            id="passportCopy"
                          />
                          <label htmlFor="passportCopy" className="cursor-pointer">
                            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm font-medium">Click to upload passport copy</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG or PDF (max 5MB)
                            </p>
                          </label>
                          {files.passportCopy && (
                            <div className="mt-4 flex items-center justify-between bg-muted rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">{files.passportCopy.name}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setFiles((prev) => ({ ...prev, passportCopy: null }))
                                }
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Medical Documents (if applicable)
                        </label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            multiple
                            onChange={(e) => handleFileChange(e, "medicalDocuments")}
                            className="hidden"
                            id="medicalDocuments"
                          />
                          <label htmlFor="medicalDocuments" className="cursor-pointer">
                            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm font-medium">
                              Click to upload medical documents
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Multiple files allowed (PNG, JPG or PDF)
                            </p>
                          </label>
                          {files.medicalDocuments.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {files.medicalDocuments.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-muted rounded-lg p-3"
                                >
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    <span className="text-sm">{file.name}</span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 justify-between px-8 pb-8 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevSection}
                  disabled={currentSection === 0}
                >
                  Previous
                </Button>

                {currentSection < SECTION_TITLES.length - 1 ? (
                  <Button type="button" onClick={nextSection}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}