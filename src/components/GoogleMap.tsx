import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface Props {
  lat: number;
  lng: number;
  zoom?: number;
  height?: string;
  width?: string;
}

const containerStyle = (height: string, width: string) => ({
  width,
  height,
});

export default function MapComponent({ lat, lng, zoom = 16, height = '400px', width = '100%' }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle(height, width)}
      center={{ lat, lng }}
      zoom={zoom}
      options={{
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        gestureHandling: 'cooperative',
      }}
    >
      <Marker 
        position={{ lat, lng }}
        animation={google.maps.Animation.DROP}
      />
    </GoogleMap>
  );
} 