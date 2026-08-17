// src/scripts/backfillTripDestinations.ts
//
// One-time migration for the "group trips by country" feature.
//
//   1. Gives every ExploreDestination a URL slug ("Sri Lanka" -> "sri-lanka").
//   2. Links each existing Trip to the Explore Destination cards it belongs to,
//      based on its free-text `destination` string.
//
// Runs as a DRY RUN by default and prints exactly what it would change.
// Pass --apply to actually write.
//
//   npx ts-node src/scripts/backfillTripDestinations.ts
//   npx ts-node src/scripts/backfillTripDestinations.ts --apply
//
// Safe to run more than once: trips that already have destinations are skipped
// unless --force is passed.

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import ExploreDestination, {
  slugifyDestinationName,
} from '../models/ExploreDestination.model';
import Trip from '../models/Trip.model';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');

// Maps an existing trip.destination string to Explore Destination card names.
// Kailash Mansarovar sits in Tibet, so it is filed under the Tibet card only.
const DESTINATION_MAP: Record<string, string[]> = {
  'Nepal': ['Nepal'],
  'Annapurna, Nepal': ['Nepal'],
  'Everest Region, Nepal': ['Nepal'],
  'Gosaikunda, Nepal': ['Nepal'],
  'Lumbini - Pokhara, Nepal': ['Nepal'],
  'Bhutan': ['Bhutan'],
  'Thailand': ['Thailand'],
  'China': ['China'],
  'Sri Lanka': ['Sri Lanka'],
  'Kailash Mansarovar': ['Tibet'],
  'Sikkim & Darjeeling, India': ['Sikkim', 'Darjeeling'],
  'Singapore, Malaysia & Thailand': ['Singapore', 'Malaysia', 'Thailand'],
};

async function run() {
  const mongoUri = process.env.MONGO_URI || '';
  if (!mongoUri) {
    console.error('❌ MONGO_URI is not set in Backend/.env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log(`✅ Connected to MongoDB (${mongoose.connection.name})`);
  console.log(APPLY ? '🔧 MODE: APPLY (writing changes)' : '👀 MODE: DRY RUN (no changes written)');
  console.log('');

  // ---------------------------------------------------------------- step 1
  console.log('=== STEP 1: destination slugs ===');
  const destinations = await ExploreDestination.find().sort({ order: 1 });
  const usedSlugs = new Set(
    destinations.map((d) => d.slug).filter(Boolean) as string[]
  );

  for (const dest of destinations) {
    if (dest.slug) {
      console.log(`  = ${dest.name.padEnd(18)} already has slug "${dest.slug}"`);
      continue;
    }

    const base = slugifyDestinationName(dest.name) || 'destination';
    let slug = base;
    let suffix = 2;
    while (usedSlugs.has(slug)) slug = `${base}-${suffix++}`;
    usedSlugs.add(slug);

    console.log(`  + ${dest.name.padEnd(18)} -> "${slug}"`);
    if (APPLY) {
      await ExploreDestination.updateOne({ _id: dest._id }, { $set: { slug } });
    }
  }

  // ---------------------------------------------------------------- step 2
  console.log('');
  console.log('=== STEP 2: linking trips to destinations ===');

  const freshDestinations = APPLY ? await ExploreDestination.find() : destinations;
  const byName = new Map<string, any>();
  for (const d of freshDestinations) byName.set(d.name.toLowerCase().trim(), d);

  const trips = await Trip.find();
  let linked = 0;
  let skipped = 0;
  const unmapped: string[] = [];

  for (const trip of trips) {
    if (!FORCE && trip.destinations && trip.destinations.length > 0) {
      console.log(`  = ${trip.name.slice(0, 40).padEnd(42)} already linked, skipping`);
      skipped++;
      continue;
    }

    const key = String(trip.destination || '').trim();
    const targetNames = DESTINATION_MAP[key];

    if (!targetNames) {
      console.log(`  ! ${trip.name.slice(0, 40).padEnd(42)} NO MAPPING for "${key}"`);
      unmapped.push(key);
      continue;
    }

    const ids: any[] = [];
    const resolved: string[] = [];
    for (const name of targetNames) {
      const dest = byName.get(name.toLowerCase().trim());
      if (!dest) {
        console.log(`      ⚠ card "${name}" not found in Explore Destinations`);
        continue;
      }
      ids.push(dest._id);
      resolved.push(dest.name);
    }

    if (ids.length === 0) {
      console.log(`  ! ${trip.name.slice(0, 40).padEnd(42)} resolved to nothing`);
      continue;
    }

    console.log(
      `  + ${trip.name.slice(0, 40).padEnd(42)} "${key}" -> ${resolved.join(' + ')}`
    );
    if (APPLY) {
      await Trip.updateOne({ _id: trip._id }, { $set: { destinations: ids } });
    }
    linked++;
  }

  console.log('');
  console.log('=== SUMMARY ===');
  console.log(`  trips linked    : ${linked}`);
  console.log(`  trips skipped   : ${skipped}`);
  console.log(`  unmapped values : ${unmapped.length ? [...new Set(unmapped)].join(' | ') : 'none'}`);
  console.log('');
  if (!APPLY) console.log('👀 Dry run only. Re-run with --apply to write these changes.');

  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
