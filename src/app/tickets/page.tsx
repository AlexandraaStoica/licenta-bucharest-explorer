import { cookies } from 'next/headers';
import { getUserTickets } from '@/lib/db/queries';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function TicketsPage() {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
        <p>You must be logged in to view your tickets.</p>
      </div>
    );
  }
  const tickets = await getUserTickets(user.id);
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
      {tickets.length === 0 ? (
        <p>You have not purchased any tickets yet.</p>
      ) : (
        <ul className="space-y-4">
          {tickets.map((ticket: any) => (
            <li key={ticket.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div><strong>Event ID:</strong> {ticket.eventId}</div>
                <div><strong>Ticket ID:</strong> {ticket.id}</div>
              </div>
              <form action={`/api/tickets`} method="POST">
                <input type="hidden" name="eventId" value={ticket.eventId} />
                <button
                  type="submit"
                  className="mt-2 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  formMethod="post"
                  formAction={`/api/tickets`}
                >
                  Download PDF
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8">
        <Link href="/events" className="text-blue-600 hover:underline">Back to Events</Link>
      </div>
    </div>
  );
} 