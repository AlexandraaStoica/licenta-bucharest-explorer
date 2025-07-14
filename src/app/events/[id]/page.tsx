import { notFound } from 'next/navigation';
import { getEventById } from '@/lib/db/queries';
import MapSection from './MapSection';

interface EventDetailPageProps {
  params: { id: string };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const event = await getEventById(params.id);
  if (!event) return notFound();

  // Assume event.location has lat/lng as strings or numbers
  const lat = parseFloat(event.location?.latitude || '44.4268');
  const lng = parseFloat(event.location?.longitude || '26.1025');

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
      <p className="mb-4 text-gray-600">{event.description}</p>
      <div className="mb-6">
        <strong>Location:</strong> {event.location?.name || 'Unknown'}
      </div>
      <div className="mb-6">
        <MapSection lat={lat} lng={lng} />
      </div>
      <div>
        <strong>Date:</strong> {event.startDate ? new Date(event.startDate).toLocaleString() : 'No date'}
      </div>
    </div>
  );
} 