// models/HeroImage.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IHeroImage extends Document {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const heroImageSchema = new Schema<IHeroImage>(
  {
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Subtitle cannot exceed 200 characters'],
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

// Index for sorting by order
heroImageSchema.index({ order: 1, isActive: 1 });

// Ensure unique order for active images
heroImageSchema.pre('save', async function (next) {
  if (this.isModified('order') && this.isActive) {
    const existingImage = await mongoose.models.HeroImage.findOne({
      order: this.order,
      isActive: true,
      _id: { $ne: this._id },
    });

    if (existingImage) {
      // Shift other images
      await mongoose.models.HeroImage.updateMany(
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

const HeroImage = mongoose.model<IHeroImage>('HeroImage', heroImageSchema);

export default HeroImage;