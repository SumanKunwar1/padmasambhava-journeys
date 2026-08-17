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
  // Countries this trip belongs to, referencing the Explore Destinations list.
  // Independent of tripCategory: this drives /destination/:slug grouping only
  // and has no effect on navbar placement.
  destinations: mongoose.Types.ObjectId[];
  tripCategory: string[]; // CHANGED: Now an array of strings
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
    destinations: {
      type: [{ type: Schema.Types.ObjectId, ref: 'ExploreDestination' }],
      default: [],
    },
    tripCategory: {
      type: [String], // CHANGED: Now accepts array of strings
      required: [true, 'At least one trip category is required'],
      validate: {
        validator: function(categories: string[]) {
          // Ensure at least one category is selected
          if (!categories || categories.length === 0) {
            return false;
          }
          // Validate each category is in the allowed list
          const allowedCategories = [
            'emi-trips',
            'international-trips',
            'india-trips',
            'deals',
            'travel-styles',
            'combo-trips',
            'retreats',
          ];
          return categories.every(cat => allowedCategories.includes(cat));
        },
        message: 'Invalid trip category provided'
      }
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
tripSchema.index({ destinations: 1, status: 1 });

const Trip = mongoose.model<ITrip>('Trip', tripSchema);

export default Trip;