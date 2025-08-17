import { Location } from '@/types';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const RADIUS = 20 * 1609.34; // 20 miles in meters

export interface PlaceSearchResult {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Array<{
    photo_reference: string;
  }>;
  rating?: number;
  price_level?: number;
}

export async function searchPlaces(
  location: Location,
  categories: string[],
  openNow: boolean = true
): Promise<PlaceSearchResult[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key not configured');
  }

  const allResults: PlaceSearchResult[] = [];

  for (const category of categories) {
    try {
      const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
      url.searchParams.append('key', GOOGLE_PLACES_API_KEY);
      url.searchParams.append('location', `${location.lat},${location.lng}`);
      url.searchParams.append('radius', RADIUS.toString());
      url.searchParams.append('type', category);
      if (openNow) {
        url.searchParams.append('opennow', 'true');
      }

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.results) {
        allResults.push(...data.results);
      }
    } catch (error) {
      console.error(`Error searching for ${category}:`, error);
    }
  }

  return allResults;
}

export function calculateDistance(
  point1: Location,
  point2: Location
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  if (!GOOGLE_PLACES_API_KEY) return '';
  
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
}

export function getMapsUrl(placeId: string): string {
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
}

export function generateRerollToken(): string {
  return Math.random().toString(36).substring(2, 15);
}