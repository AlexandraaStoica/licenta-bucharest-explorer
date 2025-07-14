import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { id, email, firstName, lastName, avatarUrl } = await req.json();
    if (!id || !email) {
      return NextResponse.json({ success: false, error: 'Missing id or email' }, { status: 400 });
    }
    const exists = await db.query.users.findFirst({ where: eq(users.id, id) });
    if (!exists) {
      await db.insert(users).values({ id, email, firstName, lastName, avatarUrl });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 