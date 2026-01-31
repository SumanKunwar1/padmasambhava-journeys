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
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

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
      const newTravelers = formData.travelers.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        numberOfTravelers: prev.numberOfTravelers - 1,
        travelers: newTravelers,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files) {
      if (type === "passportCopy") {
        setFiles((prev) => ({ ...prev, passportCopy: e.target.files![0] }));
      } else if (type === "medicalDocuments") {
        const newFiles = Array.from(e.target.files);
        setFiles((prev) => ({
          ...prev,
          medicalDocuments: [...prev.medicalDocuments, ...newFiles],
        }));
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => ({
      ...prev,
      medicalDocuments: prev.medicalDocuments.filter((_, i) => i !== index),
    }));
  };

  const calculateEstimate = () => {
    let basePrice = 0;
    const planPrices: { [key: string]: number } = {
      Basic: 500,
      Standard: 1000,
      Premium: 2000,
      Family: 3500,
    };

    basePrice = planPrices[formData.planType] || 1000;

    if (formData.tripType === "International") {
      basePrice *= 2;
    }

    if (formData.departureDate && formData.returnDate) {
      const departure = new Date(formData.departureDate);
      const returnDate = new Date(formData.returnDate);
      const duration = Math.ceil((returnDate.getTime() - departure.getTime()) / (1000 * 60 * 60 * 24));
      
      if (duration > 7) {
        basePrice += (duration - 7) * 100;
      }
    }

    if (formData.planType !== "Family") {
      basePrice *= formData.numberOfTravelers;
    }

    let additionalCost = 0;
    if (formData.additionalCoverages.adventureSports) additionalCost += 500;
    if (formData.additionalCoverages.preExistingConditions) additionalCost += 1000;
    if (formData.additionalCoverages.seniorCitizen) additionalCost += 800;
    if (formData.additionalCoverages.pregnancy) additionalCost += 1200;
    if (formData.additionalCoverages.valuables) additionalCost += 300;

    const total = basePrice + additionalCost;
    setCalculatedPremium(total);
    return total;
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
      const submitFormData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "travelers" || key === "additionalCoverages") {
          submitFormData.append(key, JSON.stringify(formData[key as keyof typeof formData]));
        } else {
          submitFormData.append(key, String(formData[key as keyof typeof formData]));
        }
      });

      if (files.passportCopy) {
        submitFormData.append("passportCopy", files.passportCopy);
      }

      files.medicalDocuments.forEach((file) => {
        submitFormData.append("medicalDocuments", file);
      });

      const response = await axios.post(`${API_URL}/insurance`, submitFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        toast({
          title: "Application Submitted!",
          description: "Your travel insurance application has been submitted successfully. We'll contact you soon.",
        });

        setCurrentSection(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "Failed to submit application. Please try again.",
        variant: "destructive",
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-3">Travel Insurance Application</h1>
            <p className="text-muted-foreground">
              Protect your journey with comprehensive travel insurance coverage
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
                          label="Email"
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
                          placeholder="Pincode"
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Section 1: Travel Details */}
                  {currentSection === 1 && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          label="Destination"
                          name="destination"
                          value={formData.destination}
                          onChange={handleInputChange}
                          placeholder="Where are you traveling?"
                          required
                        />
                        <FormField
                          label="Trip Type"
                          type="select"
                          name="tripType"
                          value={formData.tripType}
                          onChange={handleInputChange}
                          options={[
                            { value: "Domestic", label: "Domestic" },
                            { value: "International", label: "International" },
                          ]}
                          required
                        />
                      </div>

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
                        options={[
                          { value: "Leisure", label: "Leisure" },
                          { value: "Business", label: "Business" },
                          { value: "Study", label: "Study" },
                          { value: "Medical", label: "Medical" },
                          { value: "Other", label: "Other" },
                        ]}
                      />
                    </>
                  )}

                  {/* Section 2: Insurance Plan */}
                  {currentSection === 2 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-4">
                          Select Your Plan <span className="text-red-500">*</span>
                        </label>
                        <div className="grid md:grid-cols-2 gap-4">
                          {planOptions.map((plan) => (
                            <div
                              key={plan.type}
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, planType: plan.type }))
                              }
                              className={cn(
                                "relative border-2 rounded-lg p-6 cursor-pointer transition-all",
                                formData.planType === plan.type
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-bold text-lg">{plan.type}</h4>
                                  <p className="text-2xl font-bold text-primary">{plan.price}</p>
                                </div>
                                {formData.planType === plan.type && (
                                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Coverage: {plan.coverage}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Premium Calculator */}
                      <div className="bg-muted/50 rounded-lg p-6 border border-border">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Premium Estimate</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={calculateEstimate}
                          >
                            <Calculator className="w-4 h-4 mr-2" />
                            Calculate
                          </Button>
                        </div>
                        {calculatedPremium !== null && (
                          <div className="text-center">
                            <p className="text-3xl font-bold text-primary">
                              ₹{calculatedPremium.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Estimated premium for your coverage
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Section 3: Traveler Information */}
                  {currentSection === 3 && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-muted-foreground">
                          {formData.numberOfTravelers} {formData.numberOfTravelers === 1 ? 'Traveler' : 'Travelers'}
                        </p>
                      </div>

                      {formData.travelers.map((traveler, index) => (
                        <div
                          key={index}
                          className="border border-border rounded-lg p-6 space-y-4"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Traveler {index + 1}</h3>
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
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Full Name <span className="text-red-500">*</span>
                              </label>
                              <Input
                                value={traveler.fullName}
                                onChange={(e) =>
                                  handleTravelerChange(index, "fullName", e.target.value)
                                }
                                placeholder="Full name"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Date of Birth <span className="text-red-500">*</span>
                              </label>
                              <Input
                                type="date"
                                value={traveler.dateOfBirth}
                                onChange={(e) =>
                                  handleTravelerChange(index, "dateOfBirth", e.target.value)
                                }
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Gender <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={traveler.gender}
                                onChange={(e) =>
                                  handleTravelerChange(index, "gender", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                required
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Passport Number <span className="text-red-500">*</span>
                              </label>
                              <Input
                                value={traveler.passportNumber}
                                onChange={(e) =>
                                  handleTravelerChange(index, "passportNumber", e.target.value)
                                }
                                placeholder="Passport number"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Nationality <span className="text-red-500">*</span>
                              </label>
                              <Input
                                value={traveler.nationality}
                                onChange={(e) =>
                                  handleTravelerChange(index, "nationality", e.target.value)
                                }
                                placeholder="Nationality"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">Email</label>
                              <Input
                                type="email"
                                value={traveler.email}
                                onChange={(e) =>
                                  handleTravelerChange(index, "email", e.target.value)
                                }
                                placeholder="Email"
                              />
                            </div>
                          </div>
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
                      <div className="space-y-4">
                        {[
                          {
                            name: "adventureSports",
                            label: "Adventure Sports Coverage",
                            description: "Covers skiing, scuba diving, paragliding (+₹500)",
                          },
                          {
                            name: "preExistingConditions",
                            label: "Pre-existing Conditions",
                            description: "Coverage for pre-existing medical conditions (+₹1,000)",
                          },
                          {
                            name: "seniorCitizen",
                            label: "Senior Citizen Coverage",
                            description: "Enhanced coverage for travelers above 60 years (+₹800)",
                          },
                          {
                            name: "pregnancy",
                            label: "Pregnancy Coverage",
                            description: "Coverage for pregnancy-related complications (+₹1,200)",
                          },
                          {
                            name: "valuables",
                            label: "Valuable Items Protection",
                            description: "Enhanced coverage for jewelry, electronics (+₹300)",
                          },
                        ].map((coverage) => (
                          <label
                            key={coverage.name}
                            className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              name={`additionalCoverages.${coverage.name}`}
                              checked={
                                formData.additionalCoverages[
                                  coverage.name as keyof typeof formData.additionalCoverages
                                ]
                              }
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                            <div>
                              <p className="font-medium">{coverage.label}</p>
                              <p className="text-sm text-muted-foreground">
                                {coverage.description}
                              </p>
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
              <div className="flex gap-4 justify-between px-8 pb-8">
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