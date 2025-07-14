# Bucharest Explorer - Setup Instructions

## Prerequisites

1. Node.js 18+ installed
2. A Neon PostgreSQL database
3. Clerk account for authentication
4. Google Maps API key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database (Required)
DATABASE_URL="postgresql://username:password@host:port/database"

# Clerk Auth (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_publishable_key"
CLERK_SECRET_KEY="sk_test_your_clerk_secret_key"

# Google Maps API (Required for maps functionality)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"

# Next.js (Optional - for development)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Setup Steps

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up your database:**

   - Create a Neon PostgreSQL database
   - Copy the connection string to `DATABASE_URL` in `.env.local`

3. **Generate and run database migrations:**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Seed the database with initial data:**

   ```bash
   npx tsx src/lib/db/seed.ts
   ```

5. **Set up Clerk authentication:**

   - Create a Clerk account at https://clerk.com
   - Create a new application
   - Copy the publishable and secret keys to your `.env.local`

6. **Set up Google Maps API:**

   - Go to Google Cloud Console
   - Enable Maps JavaScript API
   - Create an API key
   - Add the key to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`

7. **Start the development server:**
   ```bash
   npm run dev
   ```

## Database Schema

The application includes the following main tables:

- **users**: Linked to Clerk auth users
- **categories**: Location and event categories (museums, restaurants, etc.)
- **locations**: Physical locations in Bucharest
- **events**: Temporary events and activities
- **itineraries**: User-created travel plans
- **itineraryDays**: Days within an itinerary
- **itineraryItems**: Specific locations/events in each day
- **reviews**: User reviews for locations, events, and itineraries
- **userFavorites**: User's favorite locations, events, and itineraries
- **groupItineraries**: Group travel plans
- **groupParticipants**: Users participating in group itineraries

## Features

- **Location Discovery**: Browse museums, restaurants, historical sites, etc.
- **Event Booking**: Find and book tickets for cultural events
- **Itinerary Planning**: Create personalized day-by-day travel plans
- **Group Travel**: Plan trips with friends
- **Reviews & Ratings**: Leave and read reviews for locations and events
- **Interactive Maps**: Google Maps integration for all locations
- **User Authentication**: Secure login with Clerk
- **Favorites**: Save favorite locations and itineraries

## Development

- **Database Studio**: Run `npm run db:studio` to view and edit data
- **Generate Migrations**: Run `npm run db:generate` after schema changes
- **Apply Migrations**: Run `npm run db:migrate` to apply changes
