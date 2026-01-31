// models/Agent.model.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IAgent extends Document {
  agentId: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  website?: string;
  experience: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  commissionRate: number;
  totalBookings: number;
  totalRevenue: number;
  isActive: boolean;
  notes?: string;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const agentSchema = new Schema<IAgent>(
  {
    agentId: {
      type: String,
      unique: true,
      // NOT required - will be auto-generated
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
      enum: ['0-1', '1-3', '3-5', '5-10', '10+'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    commissionRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate agentId before saving - FIXED VERSION
agentSchema.pre('save', async function (next) {
  // Only generate agentId if it doesn't exist
  if (!this.agentId) {
    try {
      // Use the model directly instead of this.constructor
      const AgentModel = mongoose.model<IAgent>('Agent');
      const count = await AgentModel.countDocuments();
      this.agentId = `AGT${String(count + 1).padStart(6, '0')}`;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Indexes for better query performance
agentSchema.index({ email: 1 });
agentSchema.index({ status: 1 });
agentSchema.index({ createdAt: -1 });
agentSchema.index({ agentId: 1 });

const Agent = mongoose.model<IAgent>('Agent', agentSchema);

export default Agent;