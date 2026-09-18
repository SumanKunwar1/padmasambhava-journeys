// models/ExploreDestination.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IExploreDestination extends Document {
  name: string;
  slug: string;
  image: string;
  type: 'international' | 'domestic' | 'weekend' | 'Retreats & Healing';
  /** Legacy manual link. Kept for old records; new cards link by slug. */
  url?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Turns a display name into a URL-safe slug: "Tibet (China)" -> "tibet-china"
export const slugifyDestinationName = (name: string): string =>
  String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const exploreDestinationSchema = new Schema<IExploreDestination>(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    // URL-safe identifier used by /destination/:slug. Generated once from the
    // name and then left alone, so renaming a destination never breaks links.
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Destination type is required'],
      enum: {
        values: ['international', 'domestic', 'weekend', 'Retreats & Healing'],
        message: 'Type must be either international, domestic, weekend, or Retreats & Healing',
      },
    },
    // Optional: trips are now grouped automatically via slug, so admins no
    // longer supply a link. Existing values are left untouched.
    url: {
      type: String,
      trim: true,
      default: '',
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
exploreDestinationSchema.index({ order: 1, isActive: 1 });
exploreDestinationSchema.index({ type: 1, isActive: 1 });

// Generate a unique slug on first save. Existing slugs are never regenerated,
// so renaming a destination keeps its URL and its linked trips intact.
exploreDestinationSchema.pre('validate', async function (next) {
  if (this.slug || !this.name) return next();

  const base = slugifyDestinationName(this.name) || 'destination';
  let candidate = base;
  let suffix = 2;

  while (
    await mongoose.models.ExploreDestination.exists({
      slug: candidate,
      _id: { $ne: this._id },
    })
  ) {
    candidate = `${base}-${suffix++}`;
  }

  this.slug = candidate;
  next();
});

// Ensure unique order for active destinations of same type
exploreDestinationSchema.pre('save', async function (next) {
  if (this.isModified('order') && this.isActive) {
    const existingDestination = await mongoose.models.ExploreDestination.findOne({
      order: this.order,
      type: this.type,
      isActive: true,
      _id: { $ne: this._id },
    });

    if (existingDestination) {
      // Shift other destinations with same or higher order
      await mongoose.models.ExploreDestination.updateMany(
        {
          order: { $gte: this.order },
          type: this.type,
          _id: { $ne: this._id },
          isActive: true,
        },
        { $inc: { order: 1 } }
      );
    }
  }
  next();
});

const ExploreDestination = mongoose.model<IExploreDestination>(
  'ExploreDestination',
  exploreDestinationSchema
);

export default ExploreDestination;