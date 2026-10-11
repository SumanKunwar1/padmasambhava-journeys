// config/database.ts
import mongoose from 'mongoose';
import { config } from './env';

/**
 * A booking is never a duplicate: the same person may book the same trip as
 * often as they like, and two people may share a name, an email or a phone
 * number. Only the generated bookingId is unique.
 *
 * Mongoose never removes an index it stopped declaring, so a unique index
 * created by an older version of the schema keeps being enforced by MongoDB
 * forever and rejects legitimate repeat bookings with E11000. Drop any that
 * are left over.
 */
const BOOKING_COLLECTIONS: Record<string, string> = {
  bookings: 'bookingId',
  agentbookings: 'bookingId',
};

const relaxBookingIndexes = async (): Promise<void> => {
  for (const [name, uniqueField] of Object.entries(BOOKING_COLLECTIONS)) {
    try {
      const collection = mongoose.connection.collection(name);
      const indexes = await collection.indexes();

      for (const index of indexes) {
        const fields = Object.keys(index.key);
        const isStaleUnique =
          index.unique &&
          index.name !== '_id_' &&
          !(fields.length === 1 && fields[0] === uniqueField);

        if (isStaleUnique) {
          await collection.dropIndex(index.name as string);
          console.log(
            `🧹 Dropped stale unique index ${index.name} on ${name} - it was blocking repeat bookings`
          );
        }
      }
    } catch (error: any) {
      // A collection that does not exist yet, or a user without index
      // privileges, must not stop the server from booting.
      if (error?.codeName !== 'NamespaceNotFound') {
        console.warn(`⚠️  Could not check indexes on ${name}:`, error?.message || error);
      }
    }
  }
};

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      // Remove deprecated options - they're now defaults in Mongoose 6+
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    await relaxBookingIndexes();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});