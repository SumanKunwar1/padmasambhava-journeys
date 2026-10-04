// models/TrendingDestination.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITrendingDestination extends Document {
  name: string;
  /** Base price, always in INR. Required. */
  price: number;
  /** Manual USD price. Left unset, the storefront converts from `price`. */
  priceUSD?: number;
  image: string;
  url: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const trendingDestinationSchema = new Schema<ITrendingDestination>(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    // Optional manual price. Blank means convert from `price` at the day's
    // rate; a value here wins over any conversion.
    priceUSD: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: undefined,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Destination URL is required'],
      trim: true,
    },
    order: {
      type: Number,
      required: [true, 'Display order is required'],
      default: 1,
      min: [1, 'Order must be at least 1'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for sorting and filtering
trendingDestinationSchema.index({ order: 1, isActive: 1 });

// Ensure unique order for active destinations
trendingDestinationSchema.pre('save', async function (next) {
  if (this.isModified('order') && this.isActive) {
    const existingDestination = await mongoose.models.TrendingDestination.findOne({
      order: this.order,
      isActive: true,
      _id: { $ne: this._id },
    });

    if (existingDestination) {
      // Shift other destinations with same or higher order
      await mongoose.models.TrendingDestination.updateMany(
        {
          order: { $gte: this.order },
          _id: { $ne: this._id },
          isActive: true,
        },
        { $inc: { order: 1 } }
      );
    }
  }
  next();
});

const TrendingDestination = mongoose.model<ITrendingDestination>(
  'TrendingDestination',
  trendingDestinationSchema
);

export default TrendingDestination;