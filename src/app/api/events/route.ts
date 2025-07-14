import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const locationId = searchParams.get('locationId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const events = await getAllEvents({
      categoryId: categoryId || undefined,
      locationId: locationId || undefined,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        limit,
        offset,
        total: events.length,
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 