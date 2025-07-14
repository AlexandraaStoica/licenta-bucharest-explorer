import Link from 'next/link';
import { getAllCategories } from '@/lib/db/queries';
import { Search } from 'lucide-react';

export default async function HomePage() {
  const categories = await getAllCategories();
  // Color palette for categories (fallback to blue if not mapped)
  const colorMap: Record<string, string> = {
    'Museums': 'bg-blue-500',
    'Historical Buildings': 'bg-purple-500',
    'Restaurants': 'bg-orange-500',
    'Nightlife': 'bg-pink-500',
    'Galleries': 'bg-red-500',
    'Parks & Gardens': 'bg-green-500',
    'Shopping': 'bg-indigo-500',
    'Theaters': 'bg-yellow-500',
  };

  const colorClassMap: Record<string, string> = {
    'Museums': 'bg-blue-100 text-blue-900',
    'Historical Buildings': 'bg-purple-100 text-purple-900',
    'Restaurants': 'bg-orange-100 text-orange-900',
    'Nightlife': 'bg-pink-100 text-pink-900',
    'Galleries': 'bg-red-100 text-red-900',
    'Parks & Gardens': 'bg-green-100 text-green-900',
    'Shopping': 'bg-indigo-100 text-indigo-900',
    'Theaters': 'bg-yellow-100 text-yellow-900',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Search Bar & Filters */}
      <section className="py-10 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <form action="/locations" method="get" className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
            <div className="relative w-full md:w-2/3">
              <input
                type="text"
                name="search"
                placeholder="Search for anything in Bucharest..."
                className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800">
                <Search className="w-6 h-6" />
              </button>
            </div>
          </form>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/locations" className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-blue-100 transition">All</Link>
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/locations?categoryId=${category.id}`}
                className="px-4 py-2 rounded-full font-semibold text-white hover:opacity-90 transition"
                style={{ background: colorMap[category.name] || 'bg-blue-500' }}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center font-serif">Discover Bucharest</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/locations?categoryId=${category.id}`}
                className={`block p-8 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-200 ${colorClassMap[category.name] || 'bg-gray-100 text-gray-900'}`}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl opacity-80 bg-white/60"></div>
                <h3 className="text-xl font-bold mb-2 font-serif">{category.name}</h3>
                <p className="opacity-80">Explore {category.name.toLowerCase()} in Bucharest.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
