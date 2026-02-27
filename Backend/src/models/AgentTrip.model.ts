// models/AgentTrip.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IOccupancyPrice {
  type: string;      // e.g. "Triple Sharing", "Double Sharing", "Single Occupancy", "Extra Bed"
  b2bPrice: number;
  retailPrice: number;
  isSupplementary: boolean;
}

export interface ITripDate {
  date: string;
  price: number;
  available: number;
}

export interface IItineraryDay {
  day: number;
  title: string;
  highlights: string[];
}

export interface IAgentTrip extends Document {
  name: string;
  destination: string;
  duration: string;
  description: string;
  price: number;
  b2bPrice: number;
  originalPrice: number;
  discount: number;
  commission: number;
  image: string;
  inclusions: string[];
  exclusions: string[];
  notes: string[];
  itinerary: IItineraryDay[];
  dates: ITripDate[];
  occupancyPricing: IOccupancyPrice[];
  hasGoodies: boolean;
  tripCategory: string;
  tripType: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const occupancyPriceSchema = new Schema({
  type: {
    type: String,
    required: [true, 'Occupancy type is required'],
    trim: true,
  },
  b2bPrice: {
    type: Number,
    required: [true, 'B2B price is required'],
    min: [0, 'B2B price must be positive'],
  },
  retailPrice: {
    type: Number,
    required: [true, 'Retail price is required'],
    min: [0, 'Retail price must be positive'],
  },
  isSupplementary: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const tripDateSchema = new Schema({
  date: {
    type: String,
    required: [true, 'Date is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive'],
  },
  available: {
    type: Number,
    required: [true, 'Available seats is required'],
    min: [0, 'Available seats must be positive'],
  },
}, { _id: false });

const itineraryDaySchema = new Schema({
  day: {
    type: Number,
    required: [true, 'Day number is required'],
    min: [1, 'Day must be at least 1'],
  },
  title: {
    type: String,
    required: [true, 'Day title is required'],
    trim: true,
  },
  highlights: {
    type: [String],
    default: [],
  },
}, { _id: false });

const agentTripSchema = new Schema<IAgentTrip>(
  {
    name: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true,
      minlength: [3, 'Trip name must be at least 3 characters'],
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Retail price is required'],
      min: [0, 'Price must be positive'],
    },
    b2bPrice: {
      type: Number,
      required: [true, 'B2B price is required'],
      min: [0, 'B2B price must be positive'],
    },
    originalPrice: {
      type: Number,
      default: 0,
      min: [0, 'Original price must be positive'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount must be positive'],
    },
    commission: {
      type: Number,
      default: 0,
      min: [0, 'Commission must be positive'],
      max: [100, 'Commission cannot exceed 100%'],
    },
    image: {
      type: String,
      default: '',
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    notes: {
      type: [String],
      default: [],
    },
    itinerary: {
      type: [itineraryDaySchema],
      default: [],
    },
    dates: {
      type: [tripDateSchema],
      default: [],
    },
    occupancyPricing: {
      type: [occupancyPriceSchema],
      default: [],
    },
    hasGoodies: {
      type: Boolean,
      default: false,
    },
    tripCategory: {
      type: String,
      enum: ['india-trips', 'travel-styles', 'international'],
      default: 'india-trips',
    },
    tripType: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
agentTripSchema.index({ name: 1 });
agentTripSchema.index({ destination: 1 });
agentTripSchema.index({ tripCategory: 1, tripType: 1 });
agentTripSchema.index({ isActive: 1 });
agentTripSchema.index({ b2bPrice: 1 });

// Pre-save middleware to calculate commission if not provided
agentTripSchema.pre('save', function (next) {
  if (this.price > 0 && this.b2bPrice > 0 && this.commission === 0) {
    this.commission = Math.round(((this.price - this.b2bPrice) / this.price) * 100);
  }
  next();
});

const AgentTrip = mongoose.model<IAgentTrip>('AgentTrip', agentTripSchema);

export default AgentTrip;