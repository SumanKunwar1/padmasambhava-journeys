// models/Insurance.model.ts
import mongoose, { Document, Schema } from 'mongoose';

// Traveler Information Interface
export interface ITraveler {
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  passportNumber: string;
  nationality: string;
  email: string;
  phone: string;
}

// Main Insurance Interface
export interface IInsurance extends Document {
  // Personal Information
  applicantName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;

  // Travel Information
  destination: string;
  tripType: 'Domestic' | 'International';
  departureDate: string;
  returnDate: string;
  tripDuration: number; // in days
  purposeOfTravel: 'Leisure' | 'Business' | 'Study' | 'Medical' | 'Other';

  // Insurance Plan
  planType: 'Basic' | 'Standard' | 'Premium' | 'Family';
  coverageAmount: number;
  numberOfTravelers: number;
  travelers: ITraveler[];

  // Additional Coverage (Optional)
  additionalCoverages: {
    adventureSports: boolean;
    preExistingConditions: boolean;
    seniorCitizen: boolean;
    pregnancy: boolean;
    valuables: boolean;
  };

  // Documents
  passportCopy?: string;
  medicalDocuments?: string[];
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;

  // Medical Information
  hasPreExistingConditions: boolean;
  preExistingConditionsDetails?: string;
  currentMedications?: string;
  allergies?: string;

  // Payment & Status
  totalAmount: number;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Active' | 'Expired';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  policyNumber?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const travelerSchema = new Schema<ITraveler>({
  fullName: {
    type: String,
    required: [true, 'Traveler name is required'],
    trim: true,
  },
  dateOfBirth: {
    type: String,
    required: [true, 'Date of birth is required'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required'],
  },
  passportNumber: {
    type: String,
    required: [true, 'Passport number is required'],
    trim: true,
  },
  nationality: {
    type: String,
    required: [true, 'Nationality is required'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
  },
});

const insuranceSchema = new Schema<IInsurance>(
  {
    // Personal Information
    applicantName: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      default: 'India',
    },

    // Travel Information
    destination: {
      type: String,
      required: [true, 'Destination is required'],
    },
    tripType: {
      type: String,
      enum: ['Domestic', 'International'],
      required: [true, 'Trip type is required'],
    },
    departureDate: {
      type: String,
      required: [true, 'Departure date is required'],
    },
    returnDate: {
      type: String,
      required: [true, 'Return date is required'],
    },
    tripDuration: {
      type: Number,
      required: true,
    },
    purposeOfTravel: {
      type: String,
      enum: ['Leisure', 'Business', 'Study', 'Medical', 'Other'],
      default: 'Leisure',
    },

    // Insurance Plan
    planType: {
      type: String,
      enum: ['Basic', 'Standard', 'Premium', 'Family'],
      required: [true, 'Plan type is required'],
    },
    coverageAmount: {
      type: Number,
      required: [true, 'Coverage amount is required'],
    },
    numberOfTravelers: {
      type: Number,
      required: [true, 'Number of travelers is required'],
      min: 1,
      max: 10,
    },
    travelers: {
      type: [travelerSchema],
      required: true,
      validate: {
        validator: function(this: IInsurance, travelers: ITraveler[]) {
          return travelers.length === this.numberOfTravelers;
        },
        message: 'Number of travelers must match the declared count',
      },
    },

    // Additional Coverage
    additionalCoverages: {
      adventureSports: {
        type: Boolean,
        default: false,
      },
      preExistingConditions: {
        type: Boolean,
        default: false,
      },
      seniorCitizen: {
        type: Boolean,
        default: false,
      },
      pregnancy: {
        type: Boolean,
        default: false,
      },
      valuables: {
        type: Boolean,
        default: false,
      },
    },

    // Documents
    passportCopy: {
      type: String,
    },
    medicalDocuments: {
      type: [String],
      default: [],
    },

    // Emergency Contact
    emergencyContactName: {
      type: String,
      required: [true, 'Emergency contact name is required'],
    },
    emergencyContactPhone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
    },
    emergencyContactRelation: {
      type: String,
      required: [true, 'Emergency contact relation is required'],
    },

    // Medical Information
    hasPreExistingConditions: {
      type: Boolean,
      default: false,
    },
    preExistingConditionsDetails: {
      type: String,
    },
    currentMedications: {
      type: String,
    },
    allergies: {
      type: String,
    },

    // Payment & Status
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Active', 'Expired'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    policyNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
insuranceSchema.index({ email: 1 });
insuranceSchema.index({ policyNumber: 1 });
insuranceSchema.index({ status: 1 });
insuranceSchema.index({ createdAt: -1 });

const Insurance = mongoose.model<IInsurance>('Insurance', insuranceSchema);

export default Insurance;