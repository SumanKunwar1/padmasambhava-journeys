// src/scripts/verifyRouteFilter.ts — read-only sanity check for route listings.
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const ROUTES = [
  '/trips/group', '/trips/combo', '/trips/weekend', '/international-trips',
  '/domestic-trips', '/trips/pilgrimage', '/style/adventure', '/style/solo',
  '/deals/seasonal', '/deals/limited', '/retreats/meditation',
  '/retreats/wellness', '/trips/cruise', '/trips/emi',
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI || '');
  const db = mongoose.connection.db;
  if (!db) { console.error('no db'); process.exit(1); }
  const trips = db.collection('trips');

  console.log('=== trips listed per route (status Active) ===');
  for (const route of ROUTES) {
    const n = await trips.countDocuments({ tripRoute: route, status: 'Active' });
    console.log(`  ${route.padEnd(24)} ${n}`);
  }

  const multi = await trips
    .find({ $expr: { $gt: [{ $size: { $ifNull: ['$tripRoute', []] } }, 1] } })
    .project({ name: 1, tripRoute: 1 })
    .toArray();

  console.log('');
  console.log('=== trips with more than one route ===');
  if (!multi.length) console.log('  none yet');
  for (const t of multi) console.log(`  ${String(t.name).slice(0, 48)} -> ${JSON.stringify(t.tripRoute)}`);

  await mongoose.connection.close();
  process.exit(0);
}
run().catch((e) => { console.error(e.message); process.exit(1); });
