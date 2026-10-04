// src/scripts/dropParallelArrayIndex.ts
//
// Fixes: "cannot index parallel arrays [tripType] [tripCategory]"
//
// tripType became an array (a trip can sit under several types). tripCategory
// already was one. The old compound index { tripCategory: 1, tripType: 1 }
// spans both, and MongoDB will not maintain a compound index over two array
// fields — so every trip save started failing.
//
// Removing the index from the schema is not enough: Mongoose creates indexes
// but never drops ones you stopped declaring, so the old index keeps living in
// the database and keeps rejecting writes. This drops it, and also normalises
// any trip whose tripType/tripRoute is still a bare string.
//
// Runs as a DRY RUN by default and prints exactly what it would change.
// Pass --apply to actually write.
//
//   npx ts-node src/scripts/dropParallelArrayIndex.ts
//   npx ts-node src/scripts/dropParallelArrayIndex.ts --apply

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const APPLY = process.argv.includes('--apply');

// Any index covering both array fields has to go, whatever it ended up named.
const PARALLEL_FIELDS = ['tripCategory', 'tripType'];

async function run() {
  const mongoUri = process.env.MONGO_URI || '';
  if (!mongoUri) {
    console.error('❌ MONGO_URI is not set in Backend/.env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log(`✅ Connected to MongoDB (${mongoose.connection.name})`);
  console.log(
    APPLY ? '🔧 MODE: APPLY (writing changes)' : '👀 MODE: DRY RUN (no changes written)'
  );
  console.log('');

  const db = mongoose.connection.db;
  if (!db) {
    console.error('❌ Connected but no database handle — check MONGO_URI.');
    process.exit(1);
  }
  const collection = db.collection('trips');

  // ---- 1. Drop any index that spans both array fields -----------------------
  const indexes = await collection.indexes();
  const offenders = indexes.filter((index) => {
    const keys = Object.keys(index.key || {});
    return PARALLEL_FIELDS.every((field) => keys.includes(field));
  });

  console.log('=== INDEXES ===');
  if (offenders.length === 0) {
    console.log('  No parallel-array index found — nothing to drop.');
  } else {
    for (const index of offenders) {
      console.log(`  ${APPLY ? 'dropping' : 'would drop'}: ${index.name} -> ${JSON.stringify(index.key)}`);
      if (APPLY) {
        await collection.dropIndex(index.name as string);
      }
    }
  }
  console.log('');

  // ---- 2. Normalise legacy string values to arrays --------------------------
  // Mongoose casts a stored string to a single-element array when it reads a
  // document, but the raw value in the database stays a string, so queries
  // like { tripRoute: '/trips/group' } behave inconsistently across rows.
  //
  // Note the $expr: a plain { tripType: { $type: 'string' } } ALSO matches an
  // array whose elements are strings, so it would flag every already-migrated
  // row forever. The aggregation $type reports the field's own type, which is
  // 'array' once converted, so only genuine leftovers match.
  const legacy = await collection
    .find({
      $or: [
        { $expr: { $eq: [{ $type: '$tripType' }, 'string'] } },
        { $expr: { $eq: [{ $type: '$tripRoute' }, 'string'] } },
      ],
    })
    .project({ name: 1, tripType: 1, tripRoute: 1 })
    .toArray();

  console.log('=== LEGACY STRING VALUES ===');
  if (legacy.length === 0) {
    console.log('  None — every trip already stores arrays.');
  } else {
    for (const trip of legacy) {
      console.log(
        `  ${APPLY ? 'fixing' : 'would fix'}: ${trip.name} ` +
          `(tripType: ${JSON.stringify(trip.tripType)}, tripRoute: ${JSON.stringify(trip.tripRoute)})`
      );

      if (APPLY) {
        const update: Record<string, string[]> = {};
        if (typeof trip.tripType === 'string') {
          update.tripType = trip.tripType ? [trip.tripType] : [];
        }
        if (typeof trip.tripRoute === 'string') {
          update.tripRoute = trip.tripRoute ? [trip.tripRoute] : [];
        }
        await collection.updateOne({ _id: trip._id }, { $set: update });
      }
    }
  }
  console.log('');

  // ---- 3. Rebuild the replacement indexes -----------------------------------
  if (APPLY) {
    await collection.createIndex({ tripCategory: 1 });
    await collection.createIndex({ tripType: 1 });
    await collection.createIndex({ tripRoute: 1 });
    console.log('✅ Created single-field indexes on tripCategory, tripType, tripRoute');
    console.log('');
  }

  console.log('=== SUMMARY ===');
  console.log(`  indexes dropped   : ${APPLY ? offenders.length : 0} (${offenders.length} found)`);
  console.log(`  trips normalised  : ${APPLY ? legacy.length : 0} (${legacy.length} found)`);
  console.log('');
  if (!APPLY) console.log('👀 Dry run only. Re-run with --apply to write these changes.');

  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
