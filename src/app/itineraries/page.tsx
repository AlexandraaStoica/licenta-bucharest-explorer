import { currentUser } from '@clerk/nextjs/server';
import { getUserItineraries } from '@/lib/db/queries';
import Link from 'next/link';

export default async function ItinerariesPage() {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">My Itineraries</h1>
        <p>You must be logged in to view your itineraries.</p>
      </div>
    );
  }
  const itineraries = await getUserItineraries(user.id);
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">My Itineraries</h1>
      <Link href="/itineraries/new" className="mb-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create New Itinerary</Link>
      {itineraries.length === 0 ? (
        <p>You have not created any itineraries yet.</p>
      ) : (
        <ul className="space-y-4 mt-4">
          {itineraries.map((it: any) => (
            <li key={it.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-gray-600 text-sm">Created: {it.createdAt ? new Date(it.createdAt).toLocaleDateString() : ''}</div>
              </div>
              <Link href={`/itineraries/${it.id}`} className="mt-2 md:mt-0 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">View</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 