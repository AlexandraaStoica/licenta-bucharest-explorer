import { NextRequest, NextResponse } from 'next/server';
import { placesAPI, type PlaceData } from '@/lib/services/places-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!query && !category) {
      return NextResponse.json(
        { success: false, error: 'Query or category parameter is required' },
        { status: 400 }
      );
    }

    const bucharestCenter = { lat: 44.4268, lng: 26.1025 };
    const location = lat && lng 
      ? { lat: parseFloat(lat), lng: parseFloat(lng) }
      : bucharestCenter;

    let results: PlaceData[] = [];

    if (category) {
      results = await placesAPI.getBucharestLocationsByCategory(category, 10);
    } else if (query) {
      const searchResult = await placesAPI.searchPlaces(query, location, 10000);
      results = searchResult.results;
    }

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    console.error('Error searching places:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search places' },
      { status: 500 }
    );
  }
} 