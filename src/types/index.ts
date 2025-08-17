export interface Mood {
  id: string;
  emoji: string;
  label: string;
  categories: string[];
}

export interface Recommendation {
  placeId: string;
  name: string;
  address: string;
  reason: string;
  distance: number;
  photoUrl?: string;
  mapsUrl: string;
  rerollToken?: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface FeedbackData {
  placeId: string;
  mood: string;
  action: 'accept' | 'reject';
  location: Location;
  timestamp: number;
}