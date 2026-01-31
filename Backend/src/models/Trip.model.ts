// models/Trip.model.ts
import mongoose, { Document, Schema } from 'mongoose';

// Interface for Itinerary Day
export interface IItineraryDay {
  day: number;
  title: string;
  highlights: string[];
}

// Interface for Trip Date
export interface ITripDate {
  date: string;
  price: number;
  available: number;
}

// Main Trip Interface
export interface ITrip extends Document {
  name: string;
  destination: string;
  tripCategory: string;
  tripType: string;
  tripRoute: string;
  duration: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  status: 'Active' | 'Inactive' | 'Draft';
  image: string;
  gallery: string[];
  inclusions: string[];
  exclusions: string[];
  notes: string[];
  itinerary: IItineraryDay[];
  dates: ITripDate[];
  tags: string;
  hasGoodies: boolean;
  bookings: number;
  createdAt: Date;
  updatedAt: Date;
}

const itineraryDaySchema = new Schema<IItineraryDay>({
  day: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  highlights: {
    type: [String],
    default: [],
  },
});

const tripDateSchema = new Schema<ITripDate>({
  date: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Number,
    default: 20,
  },
});

const tripSchema = new Schema<ITrip>(
  {
    name: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    tripCategory: {
      type: String,
      required: [true, 'Trip category is required'],
      // FIXED: Added 'group-trips' to the enum
      enum: [
        'india-trips',
        'international-trips', 
        'emi-trips', 
        'group-trips',  // ← ADDED THIS
        'travel-styles', 
        'destinations', 
        'combo-trips', 
        'retreats', 
        'customised', 
        'deals'
      ],
    },
    tripType: {
      type: String,
      required: [true, 'Trip type is required'],
    },
    tripRoute: {
      type: String,
      required: [true, 'Trip route is required'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
    },
    discount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Draft'],
      default: 'Active',
    },
    image: {
      type: String,
      required: [true, 'Main image is required'],
    },
    gallery: {
      type: [String],
      default: [],
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
    tags: {
      type: String,
      default: '',
    },
    hasGoodies: {
      type: Boolean,
      default: false,
    },
    bookings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better search performance
tripSchema.index({ name: 'text', destination: 'text', tags: 'text' });
tripSchema.index({ tripCategory: 1, tripType: 1 });
tripSchema.index({ status: 1 });

const Trip = mongoose.model<ITrip>('Trip', tripSchema);

export default Trip;