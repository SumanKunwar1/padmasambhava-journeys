// models/customTrip.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomTrip extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelers?: string;
  dates?: string;
  budget?: string;
  message?: string;
  status: string;
  adminNotes?: string;
  quotedPrice?: number;
  submittedDate: Date;
  updatedDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const customTripSchema = new Schema<ICustomTrip>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Not required as public users can submit
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
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
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    travelers: {
      type: String,
      trim: true,
    },
    dates: {
      type: String,
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'quoted', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    quotedPrice: {
      type: Number,
      min: 0,
    },
    submittedDate: {
      type: Date,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for faster queries
customTripSchema.index({ status: 1, submittedDate: -1 });
customTripSchema.index({ email: 1 });
customTripSchema.index({ destination: 1 });

export const CustomTrip = mongoose.model<ICustomTrip>('CustomTrip', customTripSchema);