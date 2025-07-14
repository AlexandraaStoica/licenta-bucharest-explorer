import { db } from './index';
import { eq, and, desc, asc, sql, gte, or } from 'drizzle-orm';
import {
  users,
  categories,
  locations,
  events,
  itineraries,
  itineraryDays,
  itineraryItems,
  locationReviews,
  eventReviews,
  itineraryReviews,
  userFavorites,
  groupItineraries,
  groupParticipants,
  friendRequests,
  friends,
  tickets,
  itineraryParticipants,
} from './schema';

// User queries
export async function getUserById(userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

export async function createUser(userData: {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}) {
  return await db.insert(users).values(userData).returning();
}

// Category queries
export async function getAllCategories() {
  return await db.query.categories.findMany({
    orderBy: asc(categories.name),
  });
}

export async function getCategoryById(categoryId: string) {
  return await db.query.categories.findFirst({
    where: eq(categories.id, categoryId),
  });
}

// Location queries
export async function getAllLocations(options?: {
  categoryId?: string;
  limit?: number;
  offset?: number;
}) {
  let query = db.query.locations.findMany({
    with: {
      category: true,
      reviews: {
        with: {
          user: true,
        },
        limit: 5,
        orderBy: desc(locationReviews.createdAt),
      },
    },
    orderBy: desc(locations.createdAt),
  });

  if (options?.categoryId) {
    query = db.query.locations.findMany({
      where: eq(locations.categoryId, options.categoryId),
      with: {
        category: true,
        reviews: {
          with: {
            user: true,
          },
          limit: 5,
          orderBy: desc(locationReviews.createdAt),
        },
      },
      orderBy: desc(locations.createdAt),
    });
  }

  const results = await query;
  
  if (options?.limit) {
    const offset = options.offset || 0;
    return results.slice(offset, offset + options.limit);
  }

  return results;
}

export async function getLocationById(locationId: string) {
  return await db.query.locations.findFirst({
    where: eq(locations.id, locationId),
    with: {
      category: true,
      reviews: {
        with: {
          user: true,
        },
        orderBy: desc(locationReviews.createdAt),
      },
      events: {
        where: gte(events.endDate, new Date()),
        orderBy: asc(events.startDate),
      },
    },
  });
}

export async function searchLocations(searchTerm: string) {
  return await db.query.locations.findMany({
    where: sql`${locations.name} ILIKE ${`%${searchTerm}%`} OR ${locations.description} ILIKE ${`%${searchTerm}%`}`,
    with: {
      category: true,
    },
    orderBy: desc(locations.averageRating),
  });
}

// Event queries
export async function getAllEvents(options?: {
  categoryId?: string;
  locationId?: string;
  limit?: number;
  offset?: number;
}) {
  let query = db.query.events.findMany({
    where: and(
      gte(events.endDate, new Date()),
      eq(events.isActive, true)
    ),
    with: {
      location: true,
      category: true,
      reviews: {
        with: {
          user: true,
        },
        limit: 5,
        orderBy: desc(eventReviews.createdAt),
      },
    },
    orderBy: asc(events.startDate),
  });

  if (options?.categoryId) {
    query = db.query.events.findMany({
      where: and(
        eq(events.categoryId, options.categoryId),
        gte(events.endDate, new Date()),
        eq(events.isActive, true)
      ),
      with: {
        location: true,
        category: true,
        reviews: {
          with: {
            user: true,
          },
          limit: 5,
          orderBy: desc(eventReviews.createdAt),
        },
      },
      orderBy: asc(events.startDate),
    });
  }

  if (options?.locationId) {
    query = db.query.events.findMany({
      where: and(
        eq(events.locationId, options.locationId),
        gte(events.endDate, new Date()),
        eq(events.isActive, true)
      ),
      with: {
        location: true,
        category: true,
        reviews: {
          with: {
            user: true,
          },
          limit: 5,
          orderBy: desc(eventReviews.createdAt),
        },
      },
      orderBy: asc(events.startDate),
    });
  }

  const results = await query;
  
  if (options?.limit) {
    const offset = options.offset || 0;
    return results.slice(offset, offset + options.limit);
  }

  return results;
}

export async function getEventById(eventId: string) {
  return await db.query.events.findFirst({
    where: eq(events.id, eventId),
    with: {
      location: true,
      category: true,
      reviews: {
        with: {
          user: true,
        },
        orderBy: desc(eventReviews.createdAt),
      },
    },
  });
}

// Itinerary queries
export async function getUserItineraries(userId: string) {
  return await db.query.itineraries.findMany({
    where: eq(itineraries.userId, userId),
    with: {
      days: {
        with: {
          items: {
            with: {
              location: true,
              event: true,
            },
            orderBy: asc(itineraryItems.orderIndex),
          },
        },
        orderBy: asc(itineraryDays.dayNumber),
      },
    },
    orderBy: desc(itineraries.createdAt),
  });
}

export async function getPublicItineraries(limit = 10) {
  return await db.query.itineraries.findMany({
    where: eq(itineraries.isPublic, true),
    with: {
      user: true,
      days: {
        with: {
          items: {
            with: {
              location: true,
              event: true,
            },
            orderBy: asc(itineraryItems.orderIndex),
          },
        },
        orderBy: asc(itineraryDays.dayNumber),
      },
    },
    orderBy: desc(itineraries.averageRating),
    limit,
  });
}

export async function getItineraryById(itineraryId: string) {
  return await db.query.itineraries.findFirst({
    where: eq(itineraries.id, itineraryId),
    with: {
      user: true,
      days: {
        with: {
          items: {
            with: {
              location: true,
              event: true,
            },
            orderBy: asc(itineraryItems.orderIndex),
          },
        },
        orderBy: asc(itineraryDays.dayNumber),
      },
      reviews: {
        with: {
          user: true,
        },
        orderBy: desc(itineraryReviews.createdAt),
      },
    },
  });
}

// Review queries
export async function createLocationReview(reviewData: {
  locationId: string;
  userId: string;
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
}) {
  const [review] = await db.insert(locationReviews).values(reviewData).returning();
  
  // Update location average rating
  const allLocationReviews = await db.query.locationReviews.findMany({
    where: eq(locationReviews.locationId, reviewData.locationId),
  });
  
  const avgRating = allLocationReviews.reduce((sum, r) => sum + r.rating, 0) / allLocationReviews.length;
  
  await db.update(locations)
    .set({
      averageRating: avgRating.toString(),
      totalReviews: allLocationReviews.length,
    })
    .where(eq(locations.id, reviewData.locationId));
  
  return review;
}

export async function createEventReview(reviewData: {
  eventId: string;
  userId: string;
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
}) {
  return await db.insert(eventReviews).values(reviewData).returning();
}

export async function createItineraryReview(reviewData: {
  itineraryId: string;
  userId: string;
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
}) {
  const [review] = await db.insert(itineraryReviews).values(reviewData).returning();
  
  // Update itinerary average rating
  const allItineraryReviews = await db.query.itineraryReviews.findMany({
    where: eq(itineraryReviews.itineraryId, reviewData.itineraryId),
  });
  
  const avgRating = allItineraryReviews.reduce((sum: number, r) => sum + r.rating, 0) / allItineraryReviews.length;
  
  await db.update(itineraries)
    .set({
      averageRating: avgRating.toString(),
      totalReviews: allItineraryReviews.length,
    })
    .where(eq(itineraries.id, reviewData.itineraryId));
  
  return review;
}

// Favorite queries
export async function getUserFavorites(userId: string) {
  return await db.query.userFavorites.findMany({
    where: eq(userFavorites.userId, userId),
    with: {
      location: true,
      event: true,
      itinerary: true,
    },
    orderBy: desc(userFavorites.createdAt),
  });
}

export async function addToFavorites(favoriteData: {
  userId: string;
  locationId?: string;
  eventId?: string;
  itineraryId?: string;
}) {
  return await db.insert(userFavorites).values(favoriteData).returning();
}

export async function removeFromFavorites(favoriteId: string) {
  return await db.delete(userFavorites).where(eq(userFavorites.id, favoriteId)).returning();
}

// Group itinerary queries
export async function getGroupItineraries(userId: string) {
  return await db.query.groupParticipants.findMany({
    where: eq(groupParticipants.userId, userId),
    with: {
      groupItinerary: {
        with: {
          itinerary: {
            with: {
              user: true,
              days: {
                with: {
                  items: {
                    with: {
                      location: true,
                      event: true,
                    },
                    orderBy: asc(itineraryItems.orderIndex),
                  },
                },
                orderBy: asc(itineraryDays.dayNumber),
              },
            },
          },
          participants: {
            with: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: desc(groupParticipants.joinedAt),
  });
}

export async function createGroupItinerary(groupData: {
  itineraryId: string;
  name: string;
  description?: string;
  maxParticipants?: number;
}) {
  return await db.insert(groupItineraries).values(groupData).returning();
}

export async function joinGroupItinerary(groupItineraryId: string, userId: string) {
  return await db.insert(groupParticipants).values({
    groupItineraryId,
    userId,
    role: 'participant',
  }).returning();
} 

// Collaborative Itineraries API

export async function inviteParticipant(itineraryId: string, userId: string) {
  // Prevent duplicate
  const existing = await db.query.itineraryParticipants.findFirst({ where: and(eq(itineraryParticipants.itineraryId, itineraryId), eq(itineraryParticipants.userId, userId)) });
  if (existing) throw new Error('User already invited or joined');
  return db.insert(itineraryParticipants).values({ itineraryId, userId }).returning();
}

export async function getItineraryParticipants(itineraryId: string) {
  return db.query.itineraryParticipants.findMany({ where: eq(itineraryParticipants.itineraryId, itineraryId) });
}

export async function joinItinerary(itineraryId: string, userId: string) {
  return inviteParticipant(itineraryId, userId);
}

export async function leaveItinerary(itineraryId: string, userId: string) {
  return db.delete(itineraryParticipants).where(and(eq(itineraryParticipants.itineraryId, itineraryId), eq(itineraryParticipants.userId, userId)));
}

// Friend Requests API

export async function sendFriendRequest(fromUserId: string, toUserId: string) {
  // Prevent duplicate requests or self-request
  if (fromUserId === toUserId) throw new Error('Cannot send friend request to yourself');
  const existing = await db.query.friendRequests.findFirst({
    where: and(eq(friendRequests.fromUserId, fromUserId), eq(friendRequests.toUserId, toUserId), eq(friendRequests.status, 'pending')),
  });
  if (existing) throw new Error('Friend request already sent');
  return db.insert(friendRequests).values({ fromUserId, toUserId, status: 'pending' }).returning();
}

export async function acceptFriendRequest(requestId: string) {
  const req = await db.query.friendRequests.findFirst({ where: eq(friendRequests.id, requestId) });
  if (!req || req.status !== 'pending') throw new Error('Invalid or already handled request');
  await db.update(friendRequests).set({ status: 'accepted' }).where(eq(friendRequests.id, requestId));
  // Add both directions to friends table
  await db.insert(friends).values([
    { userId: req.fromUserId, friendId: req.toUserId },
    { userId: req.toUserId, friendId: req.fromUserId },
  ]);
}

export async function rejectFriendRequest(requestId: string) {
  const req = await db.query.friendRequests.findFirst({ where: eq(friendRequests.id, requestId) });
  if (!req || req.status !== 'pending') throw new Error('Invalid or already handled request');
  await db.update(friendRequests).set({ status: 'rejected' }).where(eq(friendRequests.id, requestId));
}

export async function getFriendRequests(userId: string) {
  // Incoming and outgoing
  return db.query.friendRequests.findMany({
    where: or(eq(friendRequests.fromUserId, userId), eq(friendRequests.toUserId, userId)),
    orderBy: (fr) => fr.createdAt,
  });
}

export async function getFriends(userId: string) {
  // List of accepted friends
  return db.query.friends.findMany({ where: eq(friends.userId, userId) });
} 

// Tickets API

export async function purchaseTicket(userId: string, eventId: string) {
  // Prevent duplicate ticket
  const existing = await db.query.tickets.findFirst({ where: and(eq(tickets.userId, userId), eq(tickets.eventId, eventId)) });
  if (existing) throw new Error('Ticket already purchased');
  return db.insert(tickets).values({ userId, eventId }).returning();
}

export async function getUserTickets(userId: string) {
  return db.query.tickets.findMany({ where: eq(tickets.userId, userId) });
} 