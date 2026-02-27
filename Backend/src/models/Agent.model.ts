// models/Agent.model.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAgent extends Document {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  website?: string;
  experience: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  password?: string;
  agentId?: string;
  isActive: boolean;
  notes?: string;
  commissionRate: number;
  totalBookings: number;
  totalRevenue: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const agentSchema = new Schema<IAgent>(
  {
    fullName: { type: String, required: [true, 'Full name is required'], trim: true },
    companyName: { type: String, required: [true, 'Company name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
    city: { type: String, required: [true, 'City is required'], trim: true },
    state: { type: String, required: [true, 'State is required'], trim: true },
    website: { type: String, trim: true, default: '' },
    experience: { type: String, required: [true, 'Experience is required'] },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    // password is NOT selected by default — must use .select('+password')
    password: { type: String, select: false },
    agentId: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
    notes: { type: String, default: '' },
    commissionRate: { type: Number, default: 10, min: 0, max: 100 },
    totalBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

agentSchema.index({ status: 1 });
agentSchema.index({ email: 1 });

// Hash password before save
agentSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

agentSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

const Agent = mongoose.model<IAgent>('Agent', agentSchema);
export default Agent;