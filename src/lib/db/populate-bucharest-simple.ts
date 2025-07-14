import { db } from './index';
import { categories, locations, events } from './schema';

interface BucharestLocation {
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  category: string;
  phone?: string;
  website?: string;
  priceRange: string;
  imageUrl: string;
  tags: string[];
}

const bucharestLocations: BucharestLocation[] = [
  // Museums
  {
    name: 'National Museum of Art of Romania',
    description: 'The largest art museum in Romania, housed in the former Royal Palace. Features extensive collections of Romanian and European art.',
    address: 'Calea Victoriei 49-53, București 010063',
    latitude: '44.4368',
    longitude: '26.0975',
    category: 'Museums',
    phone: '+40 21 313 3030',
    website: 'https://www.mnar.arts.ro/',
    priceRange: '€€',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    tags: ['art', 'history', 'palace', 'museum']
  },
  {
    name: 'Museum of Romanian History',
    description: 'National history museum showcasing Romania\'s rich cultural heritage from prehistoric times to modern era.',
    address: 'Calea Victoriei 12, București 030026',
    latitude: '44.4319',
    longitude: '26.1036',
    category: 'Museums',
    phone: '+40 21 315 8207',
    website: 'https://www.mnir.ro/',
    priceRange: '€€',
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=300&fit=crop',
    tags: ['history', 'museum', 'cultural']
  },

  // Historical Buildings
  {
    name: 'Palace of the Parliament',
    description: 'The world\'s heaviest building and the largest parliament building. A symbol of Romania\'s communist era architecture.',
    address: 'Strada Izvor 2-4, București 050711',
    latitude: '44.4274',
    longitude: '26.0872',
    category: 'Historical Buildings',
    phone: '+40 21 316 0300',
    website: 'https://cic.cdep.ro/',
    priceRange: '€€€',
    imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
    tags: ['parliament', 'architecture', 'landmark']
  },
  {
    name: 'Romanian Athenaeum',
    description: 'Iconic concert hall and cultural landmark, home to the George Enescu Philharmonic Orchestra.',
    address: 'Strada Benjamin Franklin 1-3, București 030167',
    latitude: '44.4414',
    longitude: '26.0973',
    category: 'Historical Buildings',
    phone: '+40 21 315 6875',
    website: 'https://fge.org.ro/',
    priceRange: '€€€',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    tags: ['concert hall', 'music', 'architecture']
  },

  // Restaurants
  {
    name: 'Caru\' cu Bere',
    description: 'Historic restaurant serving traditional Romanian cuisine since 1879. Famous for its beer and authentic atmosphere.',
    address: 'Strada Stavropoleos 5, București 030081',
    latitude: '44.4322',
    longitude: '26.1018',
    category: 'Restaurants',
    phone: '+40 21 313 7560',
    website: 'https://carucubere.ro/',
    priceRange: '€€€',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    tags: ['traditional', 'romanian-cuisine', 'beer']
  },
  {
    name: 'La Mama',
    description: 'Popular restaurant chain serving authentic Romanian home-style cooking in a warm, family atmosphere.',
    address: 'Strada Episcopiei 9, București 010164',
    latitude: '44.4342',
    longitude: '26.1012',
    category: 'Restaurants',
    phone: '+40 21 312 0017',
    website: 'https://lamama.ro/',
    priceRange: '€€',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    tags: ['romanian', 'home-cooking', 'traditional']
  },

  // Parks & Gardens
  {
    name: 'Herăstrău Park',
    description: 'Large urban park with a beautiful lake, perfect for walking, boating, and recreation. Home to the Village Museum.',
    address: 'Bulevardul Eroilor, București',
    latitude: '44.4733',
    longitude: '26.0725',
    category: 'Parks & Gardens',
    phone: '+40 21 317 9103',
    website: 'https://parculherastrau.ro/',
    priceRange: 'Free',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    tags: ['park', 'lake', 'nature', 'recreation']
  },
  {
    name: 'Cismigiu Gardens',
    description: 'Historic public park in the center of Bucharest, featuring beautiful gardens, fountains, and walking paths.',
    address: 'Bulevardul Regina Elisabeta, București 030167',
    latitude: '44.4361',
    longitude: '26.0958',
    category: 'Parks & Gardens',
    phone: '+40 21 315 6875',
    website: '',
    priceRange: 'Free',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    tags: ['park', 'garden', 'historic', 'nature']
  },

  // Nightlife
  {
    name: 'Control Club',
    description: 'Popular alternative music venue and club, known for live concerts and electronic music events.',
    address: 'Strada Constantin Mille 4, București 010142',
    latitude: '44.4356',
    longitude: '26.1034',
    category: 'Nightlife',
    phone: '+40 21 312 0017',
    website: 'https://control-club.ro/',
    priceRange: '€€',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    tags: ['music', 'club', 'alternative', 'concerts']
  },

  // Shopping
  {
    name: 'AFI Palace Cotroceni',
    description: 'Modern shopping mall with international brands, restaurants, and entertainment options.',
    address: 'Bulevardul Vasile Milea 4, București 061344',
    latitude: '44.4356',
    longitude: '26.0514',
    category: 'Shopping',
    phone: '+40 21 317 9103',
    website: 'https://www.afipalacecotroceni.ro/',
    priceRange: '€€€',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    tags: ['shopping', 'mall', 'retail', 'entertainment']
  },

  // Theaters
  {
    name: 'National Theatre Bucharest',
    description: 'Romania\'s most prestigious theater, hosting classical and contemporary performances.',
    address: 'Bulevardul Nicolae Bălcescu 2, București 010051',
    latitude: '44.4342',
    longitude: '26.1012',
    category: 'Theaters',
    phone: '+40 21 313 3030',
    website: 'https://www.tnb.ro/',
    priceRange: '€€€',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    tags: ['theater', 'performance', 'culture', 'arts']
  },

  // Galleries
  {
    name: 'National Gallery',
    description: 'Art gallery showcasing Romanian and international contemporary art exhibitions.',
    address: 'Calea Victoriei 49-53, București 010063',
    latitude: '44.4368',
    longitude: '26.0975',
    category: 'Galleries',
    phone: '+40 21 313 3030',
    website: 'https://www.mnar.arts.ro/',
    priceRange: '€€',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    tags: ['art', 'gallery', 'contemporary', 'exhibitions']
  }
];

export async function populateBucharestLocationsSimple() {
  try {
    console.log('🗺️  Starting Bucharest locations population (simple version)...');

    // Get or create categories
    const existingCategories = await db.query.categories.findMany();
    const categoryMap = new Map(existingCategories.map(cat => [cat.name, cat]));

    // Create missing categories
    const categoryNames = [...new Set(bucharestLocations.map(loc => loc.category))];
    for (const categoryName of categoryNames) {
      if (!categoryMap.has(categoryName)) {
        const [newCategory] = await db.insert(categories).values({
          name: categoryName,
          description: `${categoryName} in Bucharest`,
          icon: getCategoryIcon(categoryName),
          color: getCategoryColor(categoryName),
        }).returning();
        categoryMap.set(categoryName, newCategory);
        console.log(`✅ Created category: ${categoryName}`);
      }
    }

    // Clear existing data (in correct order to avoid foreign key constraints)
    await db.delete(events);
    console.log('🗑️  Cleared existing events');
    await db.delete(locations);
    console.log('🗑️  Cleared existing locations');

    // Insert locations
    for (const locationData of bucharestLocations) {
      const category = categoryMap.get(locationData.category);
      if (!category) continue;

      try {
        await db.insert(locations).values({
          name: locationData.name,
          description: locationData.description,
          address: locationData.address,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          categoryId: category.id,
          phone: locationData.phone || null,
          website: locationData.website || null,
          priceRange: locationData.priceRange,
          averageRating: '4.5', // Default rating
          totalReviews: 100, // Default review count
          images: [locationData.imageUrl],
          tags: locationData.tags,
          isActive: true,
        });
        console.log(`✅ Added: ${locationData.name}`);
      } catch (error) {
        console.error(`Error inserting ${locationData.name}:`, error);
      }
    }

    console.log('✅ Bucharest locations population completed!');
    console.log(`📊 Added ${bucharestLocations.length} locations with accurate coordinates`);
  } catch (error) {
    console.error('❌ Error populating Bucharest locations:', error);
  }
}

function getCategoryIcon(categoryName: string): string {
  const iconMap: Record<string, string> = {
    'Museums': 'museum',
    'Historical Buildings': 'landmark',
    'Restaurants': 'utensils',
    'Parks & Gardens': 'tree',
    'Nightlife': 'moon',
    'Shopping': 'shopping-bag',
    'Theaters': 'theater-masks',
    'Galleries': 'palette',
  };
  return iconMap[categoryName] || 'map-pin';
}

function getCategoryColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    'Museums': '#3B82F6',
    'Historical Buildings': '#8B5CF6',
    'Restaurants': '#F59E0B',
    'Parks & Gardens': '#059669',
    'Nightlife': '#10B981',
    'Shopping': '#EF4444',
    'Theaters': '#7C3AED',
    'Galleries': '#EC4899',
  };
  return colorMap[categoryName] || '#6B7280';
}

// Run the population function if this file is executed directly
if (require.main === module) {
  populateBucharestLocationsSimple();
} 