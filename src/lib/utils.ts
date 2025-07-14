import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getDayName(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4.0) return 'text-blue-600';
  if (rating >= 3.5) return 'text-yellow-600';
  if (rating >= 3.0) return 'text-orange-600';
  return 'text-red-600';
}

export function getPriceRangeColor(priceRange: string): string {
  switch (priceRange) {
    case '€':
      return 'text-green-600';
    case '€€':
      return 'text-yellow-600';
    case '€€€':
      return 'text-orange-600';
    case '€€€€':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function getOpeningHoursStatus(openingHours: unknown): {
  isOpen: boolean;
  status: string;
} {
  if (!openingHours) {
    return { isOpen: false, status: 'Hours not available' };
  }

  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const todayHours = (openingHours as Record<string, { open: string; close: string }>)[dayName];
  if (!todayHours) {
    return { isOpen: false, status: 'Closed today' };
  }

  const { open, close } = todayHours;
  if (!open || !close) {
    return { isOpen: false, status: 'Hours not available' };
  }

  const isOpen = currentTime >= open && currentTime <= close;
  return {
    isOpen,
    status: isOpen ? 'Open' : 'Closed',
  };
}

export function getCategoryIcon(categoryName: string): string {
  const iconMap: Record<string, string> = {
    'Museums': 'museum',
    'Historical Buildings': 'landmark',
    'Galleries': 'palette',
    'Restaurants': 'utensils',
    'Nightlife': 'moon',
    'Parks & Gardens': 'tree',
    'Shopping': 'shopping-bag',
    'Theaters': 'theater-masks',
  };

  return iconMap[categoryName] || 'map-pin';
}

export function getCategoryColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    'Museums': '#3B82F6',
    'Historical Buildings': '#8B5CF6',
    'Galleries': '#EC4899',
    'Restaurants': '#F59E0B',
    'Nightlife': '#10B981',
    'Parks & Gardens': '#059669',
    'Shopping': '#EF4444',
    'Theaters': '#7C3AED',
  };

  return colorMap[categoryName] || '#6B7280';
} 