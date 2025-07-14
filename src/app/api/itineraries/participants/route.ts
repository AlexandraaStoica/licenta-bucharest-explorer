import { NextRequest, NextResponse } from 'next/server';
import { inviteParticipant, getItineraryParticipants, joinItinerary, leaveItinerary } from '@/lib/db/queries';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itineraryId = searchParams.get('itineraryId');
  if (!itineraryId) return NextResponse.json({ success: false, error: 'Missing itineraryId' }, { status: 400 });
  const participants = await getItineraryParticipants(itineraryId);
  return NextResponse.json({ success: true, participants });
}

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  const { itineraryId, userId } = await req.json();
  try {
    // If userId is provided, invite; else, join as self
    const result = userId ? await inviteParticipant(itineraryId, userId) : await joinItinerary(itineraryId, user.id);
    return NextResponse.json({ success: true, participant: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  const { itineraryId } = await req.json();
  try {
    await leaveItinerary(itineraryId, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
} 