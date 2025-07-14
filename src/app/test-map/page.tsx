"use client";
import dynamic from 'next/dynamic';

const GoogleMap = dynamic(() => import('@/components/GoogleMap'), { ssr: false });

export default function TestMapPage() {
  // Test coordinates for Bucharest landmarks
  const testLocations = [
    { name: 'National Museum of Art', lat: 44.4368, lng: 26.0975 },
    { name: 'Palace of Parliament', lat: 44.4274, lng: 26.0872 },
    { name: 'Herăstrău Park', lat: 44.4733, lng: 26.0725 },
    { name: 'Romanian Athenaeum', lat: 44.4414, lng: 26.0973 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Google Maps Test</h1>
      <p className="mb-6 text-gray-600">
        Testing Google Maps with accurate Bucharest coordinates
      </p>
      
      <div className="grid gap-6">
        {testLocations.map((location, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{location.name}</h2>
            <p className="text-sm text-gray-600 mb-2">
              Coordinates: {location.lat}, {location.lng}
            </p>
            <div className="h-64">
              <GoogleMap 
                lat={location.lat} 
                lng={location.lng} 
                zoom={16}
                height="100%"
                width="100%"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 