import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/db/queries";
import { Webhook } from 'svix';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('Missing svix headers');
      return NextResponse.json({ success: false, error: 'Missing svix headers' }, { status: 400 });
    }

    // Get the body
    const payload = await req.text();
    const body = JSON.parse(payload);

    console.log('Clerk webhook payload:', JSON.stringify(body, null, 2));

    // Verify the webhook signature
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET is not set');
      return NextResponse.json({ success: false, error: 'Webhook secret not configured' }, { status: 500 });
    }

    const wh = new Webhook(webhookSecret);
    let evt: unknown;

    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    // Get the event type
    const eventType = (evt as { type: string }).type;
    console.log('Webhook event type:', eventType);

    // Handle user.created event
    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = (evt as { data: { id: string, email_addresses: { email_address: string }[], first_name: string, last_name: string, image_url: string } }).data;
      const userData = {
        id,
        email: email_addresses?.[0]?.email_address || "",
        firstName: first_name,
        lastName: last_name,
        avatarUrl: image_url,
      };
      console.log('Attempting to insert user:', userData);
      try {
        const result = await createUser(userData);
        console.log('User created successfully:', result);
        return NextResponse.json({ success: true, user: result });
      } catch (dbError) {
        console.error('Database error creating user:', dbError);
        return NextResponse.json({ success: false, error: 'Database error', details: dbError instanceof Error ? dbError.message : dbError }, { status: 500 });
      }
    }

    // Handle user.updated event (in case user updates their profile)
    if (eventType === 'user.updated') {
      console.log('User updated event received');
      // You might want to update the user in your database here
      return NextResponse.json({ success: true, message: 'User updated' });
    }

    console.log('Unhandled event type:', eventType);
    return NextResponse.json({ success: true, message: 'Event received but not handled' });

  } catch (error) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
} 