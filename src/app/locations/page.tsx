import { Suspense } from 'react';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import { getAllCategories, getAllLocations } from '@/lib/db/queries';
import { getRatingColor, getPriceRangeColor } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';

// Accept searchParams for filtering
async function LocationsList({ searchParams }: { searchParams: { categoryId?: string } }) {
  const [categories, locations] = await Promise.all([
    getAllCategories(),
    getAllLocations({ categoryId: searchParams.categoryId })
  ]);
  const selectedCategoryId = searchParams.categoryId || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Explore Bucharest
        </h1>
        <p className="text-xl text-gray-600">
          Discover amazing places to visit in Romania&apos;s capital
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
            <Link
              key={category.id}
              href={`/locations?categoryId=${category.id}`}
              scroll={false}
              className={`p-4 bg-white rounded-lg border ${selectedCategoryId === category.id ? 'border-blue-500' : 'border-gray-200'} hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center`}
            >
              <div className="w-8 h-8 mx-auto mb-2 text-2xl"></div>
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Locations Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {locations.length > 0 ? 'Popular Locations' : 'No Locations Found'}
        </h2>
        {locations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => {
              const averageRating = location.reviews.length > 0 
                ? location.reviews.reduce((sum, review) => sum + review.rating, 0) / location.reviews.length
                : 0;
              const isOpen = true;
              return (
                <Link key={location.id} href={`/locations/${location.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 block">
                  <div className="h-48 bg-gray-200 relative">
                    <Image
                      src={(location.images as string[] | undefined)?.[0] || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'}
                      alt={location.name}
                      className="w-full h-full object-cover"
                      fill
                      style={{objectFit: 'cover'}}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {location.name}
                    </h3>
                    <div className="flex items-center">
                      <Star className={`h-4 w-4 ${getRatingColor(averageRating)}`} />
                      <span className="ml-1 text-sm font-medium text-gray-700">
                        {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
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
                      {location.category?.name || 'Uncategorized'}
                    </span>
                    <span className={`text-sm font-medium ${getPriceRangeColor(location.priceRange || '€€')}`}> 
                      {location.priceRange || '€€'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4"></div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No locations found</h3>
            <p className="text-gray-600">Check back later for new locations to explore!</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { cookies } from 'next/headers';
import { parse } from 'querystring';

export default function LocationsPage({ searchParams }: { searchParams: { categoryId?: string } }) {
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
        <LocationsList searchParams={searchParams} />
      </Suspense>
    </div>
  );
} 