import { currentUser } from '@clerk/nextjs/server';
import { getUserTickets, getFriendRequests, getFriends, getUserItineraries, getGroupItineraries, getEventById } from '@/lib/db/queries';
import Link from 'next/link';

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>You must be logged in to view your profile.</p>
      </div>
    );
  }
  const [tickets, friendRequests, friends, soloItineraries, groupItineraries] = await Promise.all([
    getUserTickets(user.id),
    getFriendRequests(user.id),
    getFriends(user.id),
    getUserItineraries(user.id),
    getGroupItineraries(user.id),
  ]);
  // Fetch event details for tickets
  const eventDetails = await Promise.all(
    tickets.map((ticket: any) => getEventById(ticket.eventId))
  );
  const upcomingEvents = eventDetails
    .filter((e: any) => e && e.startDate && new Date(e.startDate) > new Date())
    .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="flex items-center mb-8">
        {user.imageUrl && (
          <img src={user.imageUrl} alt="Avatar" className="w-16 h-16 rounded-full mr-4" />
        )}
        <div>
          <div className="font-semibold text-lg">{user.firstName} {user.lastName}</div>
          <div className="text-gray-600">{user.emailAddresses?.[0]?.emailAddress}</div>
        </div>
      </div>
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">My Tickets</h2>
        {tickets.length === 0 ? (
          <p>No tickets purchased yet.</p>
        ) : (
          <ul className="space-y-2">
            {tickets.map((ticket: any) => (
              <li key={ticket.id} className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div><strong>Event ID:</strong> {ticket.eventId}</div>
                  <div><strong>Ticket ID:</strong> {ticket.id}</div>
                </div>
                <form action="/api/tickets" method="POST">
                  <input type="hidden" name="eventId" value={ticket.eventId} />
                  <button
                    type="submit"
                    className="mt-2 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    formMethod="post"
                    formAction="/api/tickets"
                  >
                    Download PDF
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Friends</h2>
        {friends.length === 0 ? <p>No friends yet.</p> : (
          <ul className="space-y-1">
            {friends.map((f: any) => (
              <li key={f.friendId}>{f.friendId}</li>
            ))}
          </ul>
        )}
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Friend Requests</h2>
        {friendRequests.length === 0 ? <p>No friend requests.</p> : (
          <ul className="space-y-1">
            {friendRequests.map((r: any) => (
              <li key={r.id}>{r.fromUserId} → {r.toUserId} ({r.status})</li>
            ))}
          </ul>
        )}
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">My Itineraries</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Solo Itineraries</h3>
          {soloItineraries.length === 0 ? <p>No solo itineraries.</p> : (
            <ul className="space-y-1">
              {soloItineraries.map((it: any) => (
                <li key={it.id} className="border rounded p-2">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-gray-600 text-sm">Created: {it.createdAt ? new Date(it.createdAt).toLocaleDateString() : ''}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-1">Collaborative Itineraries</h3>
          {groupItineraries.length === 0 ? <p>No collaborative itineraries.</p> : (
            <ul className="space-y-1">
              {groupItineraries.map((gp: any) => (
                <li key={gp.id} className="border rounded p-2">
                  <div className="font-medium">{gp.groupItinerary?.name || gp.groupItinerary?.itinerary?.name || 'Untitled'}</div>
                  <div className="text-gray-600 text-sm">Participants: {gp.groupItinerary?.participants?.length || 1}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">My Events Calendar</h2>
        {upcomingEvents.length === 0 ? <p>No upcoming events.</p> : (
          <ul className="space-y-2">
            {upcomingEvents.map((event: any) => (
              <li key={event.id} className="border rounded p-3">
                <div className="font-medium">{event.name}</div>
                <div className="text-gray-600 text-sm">{event.startDate ? new Date(event.startDate).toLocaleString() : ''}</div>
                <div className="text-gray-600 text-sm">Location: {event.location?.name || 'Unknown'}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <div className="mt-8">
        <Link href="/events" className="text-blue-600 hover:underline">Back to Events</Link>
      </div>
    </div>
  );
} 