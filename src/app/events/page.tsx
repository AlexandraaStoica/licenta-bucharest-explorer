import { Suspense } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function fetchEvents() {
  // Use absolute URL for server-side fetch
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/events`, {
    headers: {
      Cookie: cookies().toString(),
    },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : [];
}

async function EventsList() {
  const events = await fetchEvents();
  if (!events.length) {
    return <div className="text-center text-gray-500">No events found.</div>;
  }
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Events in Bucharest</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {events.map((event: unknown) => {
          const e = event as {
            id: string;
            name: string;
            description: string;
            startDate?: string;
            location?: { name?: string };
            locationId?: string;
          };
          return (
            <Link key={e.id} href={`/events/${e.id}`} className="bg-white rounded-lg shadow p-6 flex flex-col gap-2 hover:bg-gray-100 transition">
              <h2 className="text-xl font-semibold">{e.name}</h2>
              <p className="text-gray-600 mb-2 line-clamp-2">{e.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                {e.startDate ? new Date(e.startDate).toLocaleString() : 'No date'}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {e.location?.name || e.locationId || 'Unknown location'}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="text-center py-20">Loading events...</div>}>
        <EventsList />
      </Suspense>
    </div>
  );
} 