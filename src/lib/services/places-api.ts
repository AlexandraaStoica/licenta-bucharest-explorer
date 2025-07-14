export interface PlaceData {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
    weekday_text?: string[];
  };
  website?: string;
  formatted_phone_number?: string;
  price_level?: number;
  types: string[];
  vicinity: string;
}

export interface PlacesSearchResult {
  results: PlaceData[];
  status: string;
  next_page_token?: string;
}

export interface PlaceDetailsResult {
  result: PlaceData & {
    reviews?: Array<{
      author_name: string;
      rating: number;
      text: string;
      time: number;
    }>;
    editorial_summary?: {
      overview: string;
    };
  };
  status: string;
}

class PlacesAPIService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Google Maps API key not found. Places API will not work.');
    }
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('key', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Places API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async searchPlaces(query: string, location: { lat: number; lng: number }, radius: number = 5000): Promise<PlacesSearchResult> {
    return this.makeRequest<PlacesSearchResult>('/textsearch/json', {
      query,
      location: `${location.lat},${location.lng}`,
      radius: radius.toString(),
      type: 'establishment',
      language: 'en',
    });
  }

  async searchNearbyPlaces(location: { lat: number; lng: number }, radius: number = 5000, type?: string): Promise<PlacesSearchResult> {
    const params: Record<string, string> = {
      location: `${location.lat},${location.lng}`,
      radius: radius.toString(),
      language: 'en',
    };

    if (type) {
      params.type = type;
    }

    return this.makeRequest<PlacesSearchResult>('/nearbysearch/json', params);
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetailsResult> {
    return this.makeRequest<PlaceDetailsResult>('/details/json', {
      place_id: placeId,
      fields: 'place_id,name,formatted_address,geometry,photos,rating,user_ratings_total,opening_hours,website,formatted_phone_number,price_level,types,vicinity,reviews,editorial_summary',
      language: 'en',
    });
  }

  async getPlacePhoto(photoReference: string, maxWidth: number = 400): Promise<string> {
    const url = new URL(`${this.baseUrl}/photo`);
    url.searchParams.append('key', this.apiKey);
    url.searchParams.append('photoreference', photoReference);
    url.searchParams.append('maxwidth', maxWidth.toString());
    
    return url.toString();
  }

  // Helper method to get popular Bucharest locations by category
  async getBucharestLocationsByCategory(category: string, limit: number = 10): Promise<PlaceData[]> {
    const bucharestCenter = { lat: 44.4268, lng: 26.1025 }; // Bucharest city center
    
    const categoryQueries: Record<string, string> = {
      'museums': 'museum in Bucharest',
      'restaurants': 'restaurant in Bucharest',
      'historical': 'historical landmark in Bucharest',
      'parks': 'park in Bucharest',
      'shopping': 'shopping mall in Bucharest',
      'nightlife': 'nightclub in Bucharest',
      'theaters': 'theater in Bucharest',
      'galleries': 'art gallery in Bucharest',
    };

    const query = categoryQueries[category] || `${category} in Bucharest`;
    
    try {
      const result = await this.searchPlaces(query, bucharestCenter, 10000);
      return result.results.slice(0, limit);
    } catch (error) {
      console.error(`Error fetching ${category} locations:`, error);
      return [];
    }
  }

  // Helper method to get popular Bucharest landmarks
  async getPopularBucharestLandmarks(): Promise<PlaceData[]> {
    const landmarks = [
      'Palace of the Parliament Bucharest',
      'National Museum of Art of Romania',
      'Romanian Athenaeum',
      'Stavropoleos Monastery',
      'Herăstrău Park',
      'Old Town Bucharest',
      'Revolution Square',
      'University Square',
      'Victory Avenue',
      'Cismigiu Gardens',
    ];

    const results: PlaceData[] = [];
    const bucharestCenter = { lat: 44.4268, lng: 26.1025 };

    for (const landmark of landmarks) {
      try {
        const result = await this.searchPlaces(landmark, bucharestCenter, 5000);
        if (result.results.length > 0) {
          results.push(result.results[0]);
        }
      } catch (error) {
        console.error(`Error fetching ${landmark}:`, error);
      }
    }

    return results;
  }
}

export const placesAPI = new PlacesAPIService(); 