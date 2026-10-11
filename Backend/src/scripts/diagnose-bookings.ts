/**
 * Diagnose / repair the bookings collection.
 *
 *   npx ts-node src/scripts/diagnose-bookings.ts        # report only
 *   npx ts-node src/scripts/diagnose-bookings.ts --fix  # also repair
 *
 * Reports every index on the collection (stale unique indexes from older
 * schema versions are never dropped by mongoose), any documents sharing a
 * bookingId, and any document missing one. With --fix it drops unique indexes
 * that the current schema no longer declares, backfills missing bookingIds and
 * re-numbers duplicates.
 */
import mongoose from 'mongoose';
import { config } from '../config/env';
import Booking from '../models/Booking.model';
import { nextSequentialId } from '../utils/sequence';

const FIX = process.argv.includes('--fix');

// Fields the current schema expects to be unique. Anything else that is unique
// in the database is a leftover from an older schema.
const EXPECTED_UNIQUE = ['bookingId'];

const run = async () => {
  await mongoose.connect(config.mongoUri);
  const collection = mongoose.connection.collection('bookings');

  console.log('\n--- indexes ---');
  const indexes = await collection.indexes();
  for (const index of indexes) {
    console.log(
      `${index.name}  keys=${JSON.stringify(index.key)}  unique=${!!index.unique}  sparse=${!!index.sparse}`
    );
  }

  const stale = indexes.filter(
    (index) =>
      index.unique &&
      index.name !== '_id_' &&
      !EXPECTED_UNIQUE.includes(Object.keys(index.key)[0])
  );
  if (stale.length) {
    console.log(
      `\n!! unique indexes not declared by the current schema: ${stale
        .map((i) => i.name)
        .join(', ')}`
    );
    if (FIX) {
      for (const index of stale) {
        await collection.dropIndex(index.name as string);
        console.log(`   dropped ${index.name}`);
      }
    }
  }

  console.log('\n--- bookingId health ---');
  const total = await Booking.countDocuments();
  const missing = await Booking.find({
    $or: [{ bookingId: { $exists: false } }, { bookingId: null }, { bookingId: '' }],
  }).select('_id customerName createdAt');
  const duplicates = await Booking.aggregate([
    { $match: { bookingId: { $nin: [null, ''] } } },
    { $group: { _id: '$bookingId', count: { $sum: 1 }, ids: { $push: '$_id' } } },
    { $match: { count: { $gt: 1 } } },
  ]);

  console.log(`documents: ${total}`);
  console.log(`missing bookingId: ${missing.length}`);
  console.log(`duplicated bookingId: ${duplicates.length}`);
  for (const duplicate of duplicates) {
    console.log(`   ${duplicate._id} x${duplicate.count}`);
  }

  if (FIX) {
    for (const booking of missing) {
      const id = await nextSequentialId(Booking, 'bookingId', 'BK');
      await Booking.updateOne({ _id: booking._id }, { $set: { bookingId: id } });
      console.log(`   backfilled ${booking._id} -> ${id}`);
    }
    for (const duplicate of duplicates) {
      // Keep the first, re-number the rest.
      for (const id of duplicate.ids.slice(1)) {
        const fresh = await nextSequentialId(Booking, 'bookingId', 'BK');
        await Booking.updateOne({ _id: id }, { $set: { bookingId: fresh } });
        console.log(`   renumbered ${id} -> ${fresh}`);
      }
    }
  }

  console.log(FIX ? '\nrepair complete' : '\nrun again with --fix to repair');
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
