import Link from 'next/link';
import { MapPin, Calendar, Star, Users, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}Bucharest
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Explore the hidden gems of Romania's capital. From historic landmarks to vibrant nightlife, 
              create unforgettable experiences in the heart of Eastern Europe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/locations"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Explore Locations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to explore Bucharest
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From planning your perfect itinerary to discovering local favorites, 
              we've got everything covered for your Bucharest adventure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Discover Places
              </h3>
              <p className="text-gray-600">
                Explore museums, restaurants, historical sites, and more with detailed information and reviews.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Book Events
              </h3>
              <p className="text-gray-600">
                Find and book tickets for cultural events, concerts, exhibitions, and special activities.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Plan Itineraries
              </h3>
              <p className="text-gray-600">
                Create personalized day-by-day travel plans tailored to your interests and schedule.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Travel Together
              </h3>
              <p className="text-gray-600">
                Plan group trips with friends and share your experiences with the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find exactly what you're looking for in Bucharest
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Museums', color: 'from-blue-500 to-blue-600', icon: '🏛️' },
              { name: 'Historical Buildings', color: 'from-purple-500 to-purple-600', icon: '🏰' },
              { name: 'Restaurants', color: 'from-orange-500 to-orange-600', icon: '🍽️' },
              { name: 'Nightlife', color: 'from-pink-500 to-pink-600', icon: '🌙' },
              { name: 'Galleries', color: 'from-red-500 to-red-600', icon: '🎨' },
              { name: 'Parks & Gardens', color: 'from-green-500 to-green-600', icon: '🌳' },
              { name: 'Shopping', color: 'from-indigo-500 to-indigo-600', icon: '🛍️' },
              { name: 'Theaters', color: 'from-yellow-500 to-yellow-600', icon: '🎭' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/locations?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-4 text-2xl`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to explore Bucharest?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start planning your perfect trip today and discover the magic of Romania's capital.
          </p>
          <Link
            href="/locations"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Bucharest Explorer</h3>
            <p className="text-gray-400 mb-6">
              Your ultimate guide to exploring the beautiful city of Bucharest
            </p>
            <div className="flex justify-center space-x-6 text-gray-400">
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
