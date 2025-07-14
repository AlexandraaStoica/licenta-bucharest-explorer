import { NextRequest, NextResponse } from 'next/server';
import { purchaseTicket, getUserTickets } from '@/lib/db/queries';
import { currentUser } from '@clerk/nextjs/server';
import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  const tickets = await getUserTickets(user.id);
  return NextResponse.json({ success: true, tickets });
}

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  const { eventId } = await req.json();
  try {
    const result = await purchaseTicket(user.id, eventId);
    const ticket = Array.isArray(result) ? result[0] : result;
    // Generate QR code (encode ticket id)
    const qrDataUrl = await QRCode.toDataURL(ticket.id);
    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.drawText('Ticket Confirmation', { x: 40, y: 560, size: 20, font, color: rgb(0,0,0) });
    page.drawText(`Ticket ID: ${ticket.id}`, { x: 40, y: 520, size: 12, font });
    page.drawText(`Event ID: ${eventId}`, { x: 40, y: 500, size: 12, font });
    page.drawText(`User: ${user.firstName || ''} ${user.lastName || ''}`.trim(), { x: 40, y: 480, size: 12, font });
    // Embed QR code image
    const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], 'base64');
    const qrImage = await pdfDoc.embedPng(qrImageBytes);
    page.drawImage(qrImage, { x: 40, y: 350, width: 200, height: 200 });
    // Finalize PDF
    const pdfBytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket-${ticket.id}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
} 