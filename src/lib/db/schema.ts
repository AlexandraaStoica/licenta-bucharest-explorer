import { pgTable, text, timestamp, uuid, integer, boolean, jsonb, decimal, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table - linked to Clerk auth
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Categories for locations and events
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
  color: text('color'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Locations table (museums, galleries, monuments, restaurants, etc.)
export const locations = pgTable('locations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  address: text('address').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  phone: text('phone'),
  website: text('website'),
  email: text('email'),
  openingHours: jsonb('opening_hours'), // JSON object for opening hours
  priceRange: text('price_range'), // e.g., "€€", "€€€"
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0.00'),
  totalReviews: integer('total_reviews').default(0),
  images: jsonb('images'), // Array of image URLs
  tags: jsonb('tags'), // Array of tags
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index('category_idx').on(table.categoryId),
  locationIdx: index('location_coords_idx').on(table.latitude, table.longitude),
}));

// Events table (temporary events, exhibitions, shows, etc.)
export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  locationId: uuid('location_id').references(() => locations.id),
  categoryId: uuid('category_id').references(() => categories.id),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }),
  currency: text('currency').default('EUR'),
  maxCapacity: integer('max_capacity'),
  currentCapacity: integer('current_capacity').default(0),
  ticketUrl: text('ticket_url'),
  organizer: text('organizer'),
  contactInfo: jsonb('contact_info'),
  images: jsonb('images'),
  tags: jsonb('tags'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  locationIdx: index('event_location_idx').on(table.locationId),
  categoryIdx: index('event_category_idx').on(table.categoryId),
  dateIdx: index('event_date_idx').on(table.startDate, table.endDate),
}));

// Itineraries table
export const itineraries = pgTable('itineraries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  userId: text('user_id').references(() => users.id).notNull(),
  isPublic: boolean('is_public').default(false),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  totalDays: integer('total_days').default(1),
  estimatedCost: decimal('estimated_cost', { precision: 10, scale: 2 }),
  currency: text('currency').default('EUR'),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0.00'),
  totalReviews: integer('total_reviews').default(0),
  tags: jsonb('tags'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('itinerary_user_idx').on(table.userId),
  publicIdx: index('itinerary_public_idx').on(table.isPublic),
}));

// Itinerary days table
export const itineraryDays = pgTable('itinerary_days', {
  id: uuid('id').defaultRandom().primaryKey(),
  itineraryId: uuid('itinerary_id').references(() => itineraries.id, { onDelete: 'cascade' }).notNull(),
  dayNumber: integer('day_number').notNull(),
  date: timestamp('date'),
  title: text('title'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  itineraryIdx: index('itinerary_day_idx').on(table.itineraryId),
}));

// Itinerary items table (locations/events in each day)
export const itineraryItems = pgTable('itinerary_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  itineraryDayId: uuid('itinerary_day_id').references(() => itineraryDays.id, { onDelete: 'cascade' }).notNull(),
  locationId: uuid('location_id').references(() => locations.id),
  eventId: uuid('event_id').references(() => events.id),
  orderIndex: integer('order_index').notNull(),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  notes: text('notes'),
  estimatedDuration: integer('estimated_duration'), // in minutes
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  dayIdx: index('itinerary_item_day_idx').on(table.itineraryDayId),
  orderIdx: index('itinerary_item_order_idx').on(table.orderIndex),
}));

// Reviews table for locations
export const locationReviews = pgTable('location_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  locationId: uuid('location_id').references(() => locations.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  title: text('title'),
  content: text('content'),
  images: jsonb('images'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  locationIdx: index('location_review_idx').on(table.locationId),
  userIdx: index('location_review_user_idx').on(table.userId),
}));

// Reviews table for events
export const eventReviews = pgTable('event_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  title: text('title'),
  content: text('content'),
  images: jsonb('images'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  eventIdx: index('event_review_idx').on(table.eventId),
  userIdx: index('event_review_user_idx').on(table.userId),
}));

// Reviews table for itineraries
export const itineraryReviews = pgTable('itinerary_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  itineraryId: uuid('itinerary_id').references(() => itineraries.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  title: text('title'),
  content: text('content'),
  images: jsonb('images'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  itineraryIdx: index('itinerary_review_idx').on(table.itineraryId),
  userIdx: index('itinerary_review_user_idx').on(table.userId),
}));

// User favorites table
export const userFavorites = pgTable('user_favorites', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  locationId: uuid('location_id').references(() => locations.id, { onDelete: 'cascade' }),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }),
  itineraryId: uuid('itinerary_id').references(() => itineraries.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('favorite_user_idx').on(table.userId),
  locationIdx: index('favorite_location_idx').on(table.locationId),
  eventIdx: index('favorite_event_idx').on(table.eventId),
  itineraryIdx: index('favorite_itinerary_idx').on(table.itineraryId),
}));

// Group itineraries (for friends)
export const groupItineraries = pgTable('group_itineraries', {
  id: uuid('id').defaultRandom().primaryKey(),
  itineraryId: uuid('itinerary_id').references(() => itineraries.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  maxParticipants: integer('max_participants'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Group participants
export const groupParticipants = pgTable('group_participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  groupItineraryId: uuid('group_itinerary_id').references(() => groupItineraries.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').default('participant'), // 'creator', 'participant', 'admin'
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (table) => ({
  groupIdx: index('group_participant_group_idx').on(table.groupItineraryId),
  userIdx: index('group_participant_user_idx').on(table.userId),
}));

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  itineraries: many(itineraries),
  locationReviews: many(locationReviews),
  eventReviews: many(eventReviews),
  itineraryReviews: many(itineraryReviews),
  favorites: many(userFavorites),
  groupParticipants: many(groupParticipants),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  locations: many(locations),
  events: many(events),
}));

export const locationsRelations = relations(locations, ({ one, many }) => ({
  category: one(categories, {
    fields: [locations.categoryId],
    references: [categories.id],
  }),
  events: many(events),
  reviews: many(locationReviews),
  itineraryItems: many(itineraryItems),
  favorites: many(userFavorites),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  location: one(locations, {
    fields: [events.locationId],
    references: [locations.id],
  }),
  category: one(categories, {
    fields: [events.categoryId],
    references: [categories.id],
  }),
  reviews: many(eventReviews),
  itineraryItems: many(itineraryItems),
  favorites: many(userFavorites),
}));

export const itinerariesRelations = relations(itineraries, ({ one, many }) => ({
  user: one(users, {
    fields: [itineraries.userId],
    references: [users.id],
  }),
  days: many(itineraryDays),
  reviews: many(itineraryReviews),
  favorites: many(userFavorites),
  groupItinerary: one(groupItineraries),
}));

export const itineraryDaysRelations = relations(itineraryDays, ({ one, many }) => ({
  itinerary: one(itineraries, {
    fields: [itineraryDays.itineraryId],
    references: [itineraries.id],
  }),
  items: many(itineraryItems),
}));

export const itineraryItemsRelations = relations(itineraryItems, ({ one }) => ({
  day: one(itineraryDays, {
    fields: [itineraryItems.itineraryDayId],
    references: [itineraryDays.id],
  }),
  location: one(locations, {
    fields: [itineraryItems.locationId],
    references: [locations.id],
  }),
  event: one(events, {
    fields: [itineraryItems.eventId],
    references: [events.id],
  }),
}));

export const locationReviewsRelations = relations(locationReviews, ({ one }) => ({
  location: one(locations, {
    fields: [locationReviews.locationId],
    references: [locations.id],
  }),
  user: one(users, {
    fields: [locationReviews.userId],
    references: [users.id],
  }),
}));

export const eventReviewsRelations = relations(eventReviews, ({ one }) => ({
  event: one(events, {
    fields: [eventReviews.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventReviews.userId],
    references: [users.id],
  }),
}));

export const itineraryReviewsRelations = relations(itineraryReviews, ({ one }) => ({
  itinerary: one(itineraries, {
    fields: [itineraryReviews.itineraryId],
    references: [itineraries.id],
  }),
  user: one(users, {
    fields: [itineraryReviews.userId],
    references: [users.id],
  }),
}));

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
  location: one(locations, {
    fields: [userFavorites.locationId],
    references: [locations.id],
  }),
  event: one(events, {
    fields: [userFavorites.eventId],
    references: [events.id],
  }),
  itinerary: one(itineraries, {
    fields: [userFavorites.itineraryId],
    references: [itineraries.id],
  }),
}));

export const groupItinerariesRelations = relations(groupItineraries, ({ one, many }) => ({
  itinerary: one(itineraries, {
    fields: [groupItineraries.itineraryId],
    references: [itineraries.id],
  }),
  participants: many(groupParticipants),
}));

export const groupParticipantsRelations = relations(groupParticipants, ({ one }) => ({
  groupItinerary: one(groupItineraries, {
    fields: [groupParticipants.groupItineraryId],
    references: [groupItineraries.id],
  }),
  user: one(users, {
    fields: [groupParticipants.userId],
    references: [users.id],
  }),
})); 