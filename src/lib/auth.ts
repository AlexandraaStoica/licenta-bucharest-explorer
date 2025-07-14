// Auth configuration for Clerk
// This will be properly configured once Clerk is set up

export const authConfig = {
  publicRoutes: [
    "/",
    "/api/webhooks(.*)",
    "/locations",
    "/events",
    "/itineraries",
    "/categories",
    "/api/locations",
    "/api/events",
    "/api/categories",
    "/api/itineraries/public",
  ],
  ignoredRoutes: [
    "/api/webhooks(.*)",
  ],
};

// Placeholder for Clerk middleware - will be properly configured
export const authMiddleware = () => {
  // This will be replaced with actual Clerk middleware
  return (req: unknown, res: unknown, next: () => void) => {
    next();
  };
}; 