// models/HomeSection.model.ts
import mongoose, { Document, Schema } from 'mongoose';

/**
 * The tour sections on the homepage. A trip belongs to a section when its
 * tripRoute contains the section's route — the same rule the listing pages and
 * the trip form use — so this list must stay in step with the frontend's
 * trip-taxonomy.ts / home-sections.ts.
 */
export const HOME_SECTIONS = [
  { key: 'upcoming-group', route: '/trips/group', type: 'group', category: 'travel-styles' },
  { key: 'kailash-tibet', route: '/trips/kailash-tibet', type: 'kailash-tibet', category: 'homepage-sections' },
  { key: 'wellness-tours', route: '/trips/wellness', type: 'wellness-tours', category: 'homepage-sections' },
  { key: 'world-peace-prayer', route: '/trips/world-peace-prayer', type: 'world-peace-prayer', category: 'homepage-sections' },
  { key: 'pilgrimage-tours', route: '/trips/pilgrimage', type: 'pilgrimage', category: 'travel-styles' },
  { key: 'dharma-events', route: '/trips/dharma-events', type: 'dharma-events', category: 'homepage-sections' },
  { key: 'activities', route: '/trips/activities', type: 'activities', category: 'homepage-sections' },
] as const;

export type HomeSectionDefinition = (typeof HOME_SECTIONS)[number];

export interface IHomeSection extends Document {
  key: string;
  // Display order chosen by the admin. Membership itself lives on the trips.
  tripIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const homeSectionSchema = new Schema<IHomeSection>(
  {
    key: {
      type: String,
      required: [true, 'Section key is required'],
      unique: true,
      enum: HOME_SECTIONS.map((section) => section.key),
    },
    tripIds: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
      default: [],
    },
  },
  { timestamps: true }
);

const HomeSection = mongoose.model<IHomeSection>('HomeSection', homeSectionSchema);

export default HomeSection;
