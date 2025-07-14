import { notFound } from 'next/navigation';
import { getLocationById } from '@/lib/db/queries';
import MapSection from './MapSection';

interface LocationDetailPageProps {
  params: { id: string };
}

export default async function LocationDetailPage({ params }: LocationDetailPageProps) {
  const location = await getLocationById(params.id);
  if (!location) return notFound();

  // Parse coordinates as numbers
  const lat = parseFloat(location.latitude || '44.4268');
  const lng = parseFloat(location.longitude || '26.1025');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{location.name}</h1>
      <p className="mb-4 text-gray-600">{location.description}</p>
      
      <div className="mb-6">
        <strong>Address:</strong> {location.address || 'Unknown'}
      </div>
      
      <div className="mb-6">
        <strong>Coordinates:</strong> {lat}, {lng}
      </div>
      
      <div className="mb-6 h-96">
        <MapSection lat={lat} lng={lng} />
      </div>
      
      <div>
        <strong>Category:</strong> {location.category?.name || 'Unknown'}
      </div>
    </div>
  );
} 