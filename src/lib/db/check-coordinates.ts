import { db } from './index';
import { locations } from './schema';

export async function checkCoordinates() {
  try {
    console.log('🔍 Checking coordinates in database...');
    
    const allLocations = await db.query.locations.findMany({
      columns: {
        name: true,
        latitude: true,
        longitude: true,
        address: true,
      }
    });

    console.log('\n📍 Current coordinates in database:');
    console.log('=====================================');
    
    allLocations.forEach((location, index) => {
      console.log(`${index + 1}. ${location.name}`);
      console.log(`   Address: ${location.address}`);
      console.log(`   Latitude: ${location.latitude} (type: ${typeof location.latitude})`);
      console.log(`   Longitude: ${location.longitude} (type: ${typeof location.longitude})`);
      console.log(`   Parsed Lat: ${parseFloat(location.latitude)}`);
      console.log(`   Parsed Lng: ${parseFloat(location.longitude)}`);
      console.log('');
    });

    // Test with a specific location
    if (allLocations.length > 0) {
      const testLocation = allLocations[0];
      console.log('🧪 Testing coordinate parsing:');
      console.log(`Original: ${testLocation.latitude}, ${testLocation.longitude}`);
      console.log(`Parsed: ${parseFloat(testLocation.latitude)}, ${parseFloat(testLocation.longitude)}`);
      console.log(`Google Maps URL: https://www.google.com/maps?q=${testLocation.latitude},${testLocation.longitude}`);
    }

  } catch (error) {
    console.error('❌ Error checking coordinates:', error);
  }
}

// Run the check function if this file is executed directly
if (require.main === module) {
  checkCoordinates();
} 