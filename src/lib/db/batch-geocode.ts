import { db } from './index';
import { locations } from './schema';
import { eq } from 'drizzle-orm';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.status === 'OK' && data.results.length > 0) {
    const loc = data.results[0].geometry.location;
    return { lat: loc.lat, lng: loc.lng };
  }
  return null;
}

export async function batchGeocodeLocations() {
  try {
    console.log('🌍 Starting batch geocoding for all locations...');
    const allLocations = await db.query.locations.findMany();
    let updated = 0;
    for (const loc of allLocations) {
      if (!loc.address) continue;
      const geo = await geocodeAddress(loc.address);
      if (geo) {
        await db.update(locations)
          .set({ latitude: geo.lat.toString(), longitude: geo.lng.toString() })
          .where(eq(locations.id, loc.id));
        console.log(`✅ Updated: ${loc.name} (${geo.lat}, ${geo.lng})`);
        updated++;
      } else {
        console.warn(`⚠️  Could not geocode: ${loc.name} (${loc.address})`);
      }
      // To avoid hitting rate limits, add a short delay
      await new Promise(res => setTimeout(res, 200));
    }
    console.log(`🎉 Batch geocoding complete. Updated ${updated} locations.`);
  } catch (error) {
    console.error('❌ Error during batch geocoding:', error);
  }
}

if (require.main === module) {
  batchGeocodeLocations();
} 