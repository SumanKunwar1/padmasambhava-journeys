// models/Testimonial.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  testimonialId: string;
  name: string;
  trip: string;
  rating: number;
  review: string;
  image: string;
  isActive: boolean;
  featured: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    testimonialId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    trip: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: 5,
    },
    review: {
      type: String,
      required: [true, 'Review is required'],
      trim: true,
      minlength: [10, 'Review must be at least 10 characters'],
      maxlength: [500, 'Review cannot exceed 500 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate testimonialId before saving
testimonialSchema.pre('save', async function (next) {
  if (!this.testimonialId) {
    try {
      const TestimonialModel = mongoose.model<ITestimonial>('Testimonial');
      const count = await TestimonialModel.countDocuments();
      this.testimonialId = `TST${String(count + 1).padStart(6, '0')}`;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Indexes for better query performance
testimonialSchema.index({ isActive: 1 });
testimonialSchema.index({ featured: 1 });
testimonialSchema.index({ createdAt: -1 });
testimonialSchema.index({ testimonialId: 1 });

const Testimonial = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);

export default Testimonial;