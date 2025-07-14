"use client";
import dynamic from 'next/dynamic';

const GoogleMap = dynamic(() => import('@/components/GoogleMap'), { ssr: false });

interface MapSectionProps {
  lat: number;
  lng: number;
}

export default function MapSection({ lat, lng }: MapSectionProps) {
  return <GoogleMap lat={lat} lng={lng} />;
} 