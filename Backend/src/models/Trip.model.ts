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
  tripType: string[]; // CHANGED: a trip can sit under several types
  tripRoute: string[]; // CHANGED: one route per selected type
  duration: string;
  description: string;
  /** Base price, always in INR. Required. */
  price: number;
  /** Manual USD price. Left unset, the storefront converts from `price`. */
  priceUSD?: number;
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
      type: [String], // CHANGED: now accepts an array of types
      required: [true, 'At least one trip type is required'],
      validate: {
        validator: function (types: string[]) {
          return Array.isArray(types) && types.length > 0;
        },
        message: 'At least one trip type is required',
      },
    },
    tripRoute: {
      // One route per selected type. Derived from tripType in the admin form,
      // and what the homepage filters on (e.g. only '/trips/group').
      type: [String],
      default: [],
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
    // Optional manual price. Blank means the storefront converts from `price`
    // at the day's rate; a value here wins over any conversion.
    priceUSD: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: undefined,
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
// tripCategory and tripType are BOTH arrays now, and MongoDB refuses to build a
// compound index spanning two array fields ("cannot index parallel arrays").
// Two single-field multikey indexes are allowed and serve the same queries,
// since nothing filters on the pair together.
tripSchema.index({ tripCategory: 1 });
tripSchema.index({ tripType: 1 });
tripSchema.index({ tripRoute: 1 });
tripSchema.index({ status: 1 });
tripSchema.index({ destinations: 1, status: 1 });

const Trip = mongoose.model<ITrip>('Trip', tripSchema);

export default Trip;