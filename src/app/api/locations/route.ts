import { NextRequest, NextResponse } from 'next/server';
import { getAllLocations, searchLocations } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let locations;

    if (search) {
      locations = await searchLocations(search);
    } else {
      locations = await getAllLocations({
        categoryId: categoryId || undefined,
        limit,
        offset,
      });
    }

    return NextResponse.json({
      success: true,
      data: locations,
      pagination: {
        limit,
        offset,
        total: locations.length,
      },
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
} 