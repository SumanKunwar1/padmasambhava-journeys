// models/HeroImage.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export const HERO_CTA_STYLES = ['solid', 'outline'] as const;
export const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
// Site pages (/contact), in-page anchors (#faq), or full web / mail / phone links.
// Anything else (e.g. javascript:) is rejected.
export const HERO_CTA_URL_REGEX = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)\S*$/i;

export interface IHeroCta {
  label: string;
  url: string;
  style: (typeof HERO_CTA_STYLES)[number];
  bgColor: string;
  textColor: string;
  openInNewTab: boolean;
}

export interface IHeroImage extends Document {
  imageUrl: string;
  mobileImageUrl?: string;
  title?: string;
  subtitle?: string;
  ctas: IHeroCta[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const heroCtaSchema = new Schema<IHeroCta>({
  label: {
    type: String,
    required: [true, 'Button label is required'],
    trim: true,
    maxlength: [40, 'Button label cannot exceed 40 characters'],
  },
  url: {
    type: String,
    required: [true, 'Button link is required'],
    trim: true,
    maxlength: [500, 'Button link cannot exceed 500 characters'],
    match: [HERO_CTA_URL_REGEX, 'Button link must be a page path (/contact) or a full URL (https://...)'],
  },
  style: {
    type: String,
    enum: HERO_CTA_STYLES,
    default: 'solid',
  },
  bgColor: {
    type: String,
    trim: true,
    default: '#188558',
    match: [HEX_COLOR_REGEX, 'Button color must be a hex color like #188558'],
  },
  textColor: {
    type: String,
    trim: true,
    default: '#FFFFFF',
    match: [HEX_COLOR_REGEX, 'Button text color must be a hex color like #FFFFFF'],
  },
  openInNewTab: {
    type: Boolean,
    default: false,
  },
});

const heroImageSchema = new Schema<IHeroImage>(
  {
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    // Optional 4:5 portrait banner shown on phones instead of imageUrl
    mobileImageUrl: {
      type: String,
      trim: true,
      default: '',
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
    ctas: {
      type: [heroCtaSchema],
      default: [],
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
