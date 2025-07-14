import { db } from './index';
import { categories, locations, events } from './schema';

export async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Check if data already exists
    const existingCategories = await db.query.categories.findMany();
    const existingLocations = await db.query.locations.findMany();
    const existingEvents = await db.query.events.findMany();

    if (existingCategories.length > 0 || existingLocations.length > 0 || existingEvents.length > 0) {
      console.log('⚠️  Database already contains data. Skipping seed to prevent duplicates.');
      console.log(`   Found: ${existingCategories.length} categories, ${existingLocations.length} locations, ${existingEvents.length} events`);
      console.log('   Run "npx tsx src/lib/db/reset.ts" first if you want to start fresh.');
      return;
    }

    // Insert categories
    const categoryData = [
      { name: 'Museums', description: 'Art, history, and science museums', icon: 'museum', color: '#3B82F6' },
      { name: 'Historical Buildings', description: 'Palaces, churches, and monuments', icon: 'landmark', color: '#8B5CF6' },
      { name: 'Galleries', description: 'Art galleries and exhibitions', icon: 'palette', color: '#EC4899' },
      { name: 'Restaurants', description: 'Traditional and international cuisine', icon: 'utensils', color: '#F59E0B' },
      { name: 'Nightlife', description: 'Bars, clubs, and entertainment venues', icon: 'moon', color: '#10B981' },
      { name: 'Parks & Gardens', description: 'Public parks and botanical gardens', icon: 'tree', color: '#059669' },
      { name: 'Shopping', description: 'Malls, markets, and boutiques', icon: 'shopping-bag', color: '#EF4444' },
      { name: 'Theaters', description: 'Theaters and performance venues', icon: 'theater-masks', color: '#7C3AED' },
    ];
    console.log('Inserting categories:', categoryData);
    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`✅ Inserted ${insertedCategories.length} categories`, insertedCategories);

    // Insert sample locations with proper string coordinates
    const locationData = [
      {
        name: 'National Museum of Art of Romania',
        description: 'The largest art museum in Romania, housed in the former Royal Palace',
        address: 'Calea Victoriei 49-53, București 010063',
        latitude: '44.4368',
        longitude: '26.0975',
        categoryId: insertedCategories[0].id,
        phone: '+40 21 313 3030',
        website: 'https://www.mnar.arts.ro/',
        priceRange: '€€',
        openingHours: {
          monday: { open: '10:00', close: '18:00' },
          tuesday: { open: '10:00', close: '18:00' },
          wednesday: { open: '10:00', close: '18:00' },
          thursday: { open: '10:00', close: '18:00' },
          friday: { open: '10:00', close: '18:00' },
          saturday: { open: '10:00', close: '18:00' },
          sunday: { open: '10:00', close: '18:00' },
        },
        images: ['https://example.com/mnar1.jpg'],
        tags: ['art', 'history', 'palace'],
      },
      {
        name: 'Palace of the Parliament',
        description: 'The world\'s heaviest building and the largest parliament building',
        address: 'Strada Izvor 2-4, București 050711',
        latitude: '44.4274',
        longitude: '26.0872',
        categoryId: insertedCategories[1].id,
        phone: '+40 21 316 0300',
        website: 'https://cic.cdep.ro/',
        priceRange: '€€€',
        openingHours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: { open: '09:00', close: '17:00' },
          sunday: { open: '09:00', close: '17:00' },
        },
        images: ['https://example.com/parliament1.jpg'],
        tags: ['parliament', 'architecture'],
      },
      {
        name: 'Caru\' cu Bere',
        description: 'Historic restaurant serving traditional Romanian cuisine since 1879',
        address: 'Strada Stavropoleos 5, București 030081',
        latitude: '44.4322',
        longitude: '26.1018',
        categoryId: insertedCategories[3].id,
        phone: '+40 21 313 7560',
        website: 'https://carucubere.ro/',
        priceRange: '€€€',
        openingHours: {
          monday: { open: '08:00', close: '23:00' },
          tuesday: { open: '08:00', close: '23:00' },
          wednesday: { open: '08:00', close: '23:00' },
          thursday: { open: '08:00', close: '23:00' },
          friday: { open: '08:00', close: '23:00' },
          saturday: { open: '08:00', close: '23:00' },
          sunday: { open: '08:00', close: '23:00' },
        },
        images: ['https://example.com/caru-cu-bere1.jpg'],
        tags: ['traditional', 'romanian-cuisine'],
      },
    ];
    console.log('Inserting locations:', locationData);
    const insertedLocations = await db.insert(locations).values(locationData).returning();
    console.log(`✅ Inserted ${insertedLocations.length} locations`, insertedLocations);

    // Insert sample events with future dates (August 2025 and later)
    const eventData = [
      {
        name: 'Bucharest Summer Festival',
        description: 'A city-wide celebration with music, food, and art in the heart of Bucharest.',
        locationId: insertedLocations[0].id,
        categoryId: insertedCategories[0].id,
        startDate: new Date('2025-08-10T16:00:00Z'),
        endDate: new Date('2025-08-15T23:00:00Z'),
        price: '50.00',
        currency: 'EUR',
        maxCapacity: 500,
        currentCapacity: 120,
        organizer: 'Bucharest City Hall',
        contactInfo: {
          email: 'info@bucharestfest.ro',
          phone: '+40 21 123 4567',
        },
        images: ['https://example.com/bucharest-festival.jpg'],
        tags: ['festival', 'summer', 'music', 'art'],
      },
      {
        name: 'Night of Museums 2025',
        description: 'Experience Bucharest museums after dark with special exhibitions and performances.',
        locationId: insertedLocations[0].id,
        categoryId: insertedCategories[0].id,
        startDate: new Date('2025-08-23T18:00:00Z'),
        endDate: new Date('2025-08-24T02:00:00Z'),
        price: '0.00',
        currency: 'EUR',
        maxCapacity: 2000,
        currentCapacity: 500,
        organizer: 'National Museum of Art of Romania',
        contactInfo: {
          email: 'contact@mnar.arts.ro',
          phone: '+40 21 313 3030',
        },
        images: ['https://example.com/night-museums.jpg'],
        tags: ['museums', 'night', 'exhibition'],
      },
      {
        name: 'Autumn Jazz Evenings',
        description: 'Enjoy live jazz performances in the open air at the Palace of the Parliament.',
        locationId: insertedLocations[1].id,
        categoryId: insertedCategories[1].id,
        startDate: new Date('2025-09-05T19:00:00Z'),
        endDate: new Date('2025-09-05T23:00:00Z'),
        price: '30.00',
        currency: 'EUR',
        maxCapacity: 300,
        currentCapacity: 80,
        organizer: 'Jazz Bucharest',
        contactInfo: {
          email: 'info@jazzbucharest.ro',
          phone: '+40 21 987 6543',
        },
        images: ['https://example.com/jazz-evenings.jpg'],
        tags: ['jazz', 'music', 'autumn'],
      },
    ];
    console.log('Inserting events:', eventData);
    const insertedEvents = await db.insert(events).values(eventData).returning();
    console.log(`✅ Inserted ${insertedEvents.length} events`, insertedEvents);

    console.log('✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seed();
} 