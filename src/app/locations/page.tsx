import { Suspense } from 'react';
import { Search, Filter, MapPin, Star, Clock } from 'lucide-react';
import { getAllCategories } from '@/lib/db/queries';
import { formatPrice, getRatingColor, getOpeningHoursStatus, getPriceRangeColor } from '@/lib/utils';

async function LocationsList() {
  const categories = await getAllCategories();
  
  // For now, we'll show a placeholder since we need to set up the database
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Explore Bucharest
        </h1>
        <p className="text-xl text-gray-600">
          Discover amazing places to visit in Romania's capital
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search locations..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center"
            >
              <div className="w-8 h-8 mx-auto mb-2 text-2xl">
                {category.icon || '📍'}
              </div>
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sample Locations Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Popular Locations</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: '1',
              name: 'National Museum of Art of Romania',
              description: 'The largest art museum in Romania, housed in the former Royal Palace',
              category: 'Museums',
              address: 'Calea Victoriei 49-53, București',
              rating: 4.5,
              priceRange: '€€',
              isOpen: true,
              image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
            },
            {
              id: '2',
              name: 'Palace of the Parliament',
              description: 'The world\'s heaviest building and the largest parliament building',
              category: 'Historical Buildings',
              address: 'Strada Izvor 2-4, București',
              rating: 4.3,
              priceRange: '€€€',
              isOpen: true,
              image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop'
            },
            {
              id: '3',
              name: 'Caru\' cu Bere',
              description: 'Historic restaurant serving traditional Romanian cuisine since 1879',
              category: 'Restaurants',
              address: 'Strada Stavropoleos 5, București',
              rating: 4.7,
              priceRange: '€€€',
              isOpen: true,
              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop'
            },
            {
              id: '4',
              name: 'Herăstrău Park',
              description: 'Large urban park with a lake, perfect for walking and recreation',
              category: 'Parks & Gardens',
              address: 'Bulevardul Eroilor, București',
              rating: 4.6,
              priceRange: 'Free',
              isOpen: true,
              image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
            },
            {
              id: '5',
              name: 'Control Club',
              description: 'Popular alternative music venue and club',
              category: 'Nightlife',
              address: 'Strada Constantin Mille 4, București',
              rating: 4.2,
              priceRange: '€€',
              isOpen: false,
              image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
            },
            {
              id: '6',
              name: 'Stavropoleos Monastery',
              description: 'Beautiful Orthodox monastery with stunning architecture',
              category: 'Historical Buildings',
              address: 'Strada Stavropoleos 4, București',
              rating: 4.4,
              priceRange: 'Free',
              isOpen: true,
              image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
            }
          ].map((location) => (
            <div key={location.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    location.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {location.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {location.name}
                  </h3>
                  <div className="flex items-center">
                    <Star className={`h-4 w-4 ${getRatingColor(location.rating)}`} />
                    <span className="ml-1 text-sm font-medium text-gray-700">
                      {location.rating}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {location.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="line-clamp-1">{location.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {location.category}
                  </span>
                  <span className={`text-sm font-medium ${getPriceRangeColor(location.priceRange)}`}>
                    {location.priceRange}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading locations...</p>
          </div>
        </div>
      }>
        <LocationsList />
      </Suspense>
    </div>
  );
} 