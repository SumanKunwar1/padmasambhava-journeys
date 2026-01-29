// models/Documentation.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  userId?: mongoose.Types.ObjectId;
  documentId: string;
  name: string;
  category: string;
  description: string;
  status: 'required' | 'optional' | 'recommended';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  uploadDate?: Date;
  isUploaded: boolean;
}

const documentSchema = new Schema<IDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    documentId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Identity', 'Travel', 'Accommodation', 'Financial', 'Insurance', 'Employment', 'Tax'],
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['required', 'optional', 'recommended'],
      default: 'optional',
    },
    fileUrl: {
      type: String,
    },
    fileName: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    uploadDate: {
      type: Date,
    },
    isUploaded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
documentSchema.index({ userId: 1, documentId: 1 });

export const Documentation = mongoose.model<IDocument>('Documentation', documentSchema);