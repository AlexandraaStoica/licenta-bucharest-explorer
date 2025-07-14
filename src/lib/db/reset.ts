import { db } from './index';
import { 
  users, 
  categories, 
  locations, 
  events, 
  itineraries, 
  itineraryDays, 
  itineraryItems, 
  locationReviews, 
  eventReviews, 
  itineraryReviews, 
  userFavorites, 
  groupItineraries, 
  groupParticipants 
} from './schema';

export async function resetDatabase() {
  try {
    console.log('🗑️  Clearing database...');

    // Delete in reverse order of dependencies to avoid foreign key constraints
    await db.delete(groupParticipants);
    console.log('✅ Cleared group participants');

    await db.delete(groupItineraries);
    console.log('✅ Cleared group itineraries');

    await db.delete(userFavorites);
    console.log('✅ Cleared user favorites');

    await db.delete(locationReviews);
    console.log('✅ Cleared location reviews');

    await db.delete(eventReviews);
    console.log('✅ Cleared event reviews');

    await db.delete(itineraryReviews);
    console.log('✅ Cleared itinerary reviews');

    await db.delete(itineraryItems);
    console.log('✅ Cleared itinerary items');

    await db.delete(itineraryDays);
    console.log('✅ Cleared itinerary days');

    await db.delete(itineraries);
    console.log('✅ Cleared itineraries');

    await db.delete(events);
    console.log('✅ Cleared events');

    await db.delete(locations);
    console.log('✅ Cleared locations');

    await db.delete(categories);
    console.log('✅ Cleared categories');

    await db.delete(users);
    console.log('✅ Cleared users');

    console.log('✅ Database reset completed!');
  } catch (error) {
    console.error('❌ Error during database reset:', error);
    throw error;
  }
}

// Run the reset function if this file is executed directly
if (require.main === module) {
  resetDatabase();
} 