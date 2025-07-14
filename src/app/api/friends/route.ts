import { NextRequest, NextResponse } from 'next/server';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendRequests, getFriends } from '@/lib/db/queries';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  const requests = await getFriendRequests(user.id);
  const friends = await getFriends(user.id);
  return NextResponse.json({ success: true, requests, friends });
}

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  const { toUserId } = await req.json();
  try {
    const result = await sendFriendRequest(user.id, toUserId);
    return NextResponse.json({ success: true, request: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  const { requestId, action } = await req.json();
  try {
    if (action === 'accept') {
      await acceptFriendRequest(requestId);
      return NextResponse.json({ success: true });
    } else if (action === 'reject') {
      await rejectFriendRequest(requestId);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
} 