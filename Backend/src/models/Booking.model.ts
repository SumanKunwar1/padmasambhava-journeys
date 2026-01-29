// models/Booking.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  tripId: mongoose.Types.ObjectId;
  tripName: string;
  customerName: string;
  email: string;
  phone: string;
  message?: string;
  travelers: number;
  selectedDate?: string;
  selectedPrice?: number;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  bookingId: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip ID is required'],
    },
    tripName: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
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
    message: {
      type: String,
      trim: true,
    },
    travelers: {
      type: Number,
      required: [true, 'Number of travelers is required'],
      min: [1, 'At least 1 traveler is required'],
    },
    selectedDate: {
      type: String,
      trim: true,
    },
    selectedPrice: {
      type: Number,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
    bookingId: {
      type: String,
      unique: true,
      // FIXED: Changed from required: true to required: false
      // The pre-save hook will generate this automatically
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ tripId: 1 });

// Generate booking ID before saving
bookingSchema.pre('save', async function (next) {
  if (!this.bookingId) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingId = `BK${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;