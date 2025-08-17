import { NextRequest, NextResponse } from 'next/server';
import { getMoodById, getSurpriseCategories, getWittyReason } from '@/lib/moods';
import { 
  searchPlaces, 
  calculateDistance, 
  getPhotoUrl, 
  getMapsUrl, 
  generateRerollToken,
  PlaceSearchResult 
} from '@/lib/places';
import { Recommendation, Location } from '@/types';

// Demo data for when Google Places API is not available
const DEMO_PLACES = [
  {
    place_id: 'demo_1',
    name: 'The Cozy Corner Cafe',
    vicinity: '123 Main St, New York, NY',
    geometry: { location: { lat: 40.7505, lng: -73.9934 } },
    rating: 4.5,
    photos: [{ photo_reference: 'demo_photo_1' }]
  },
  {
    place_id: 'demo_2',
    name: 'Central Park',
    vicinity: 'Central Park, New York, NY',
    geometry: { location: { lat: 40.7829, lng: -73.9654 } },
    rating: 4.8,
    photos: [{ photo_reference: 'demo_photo_2' }]
  },
  {
    place_id: 'demo_3',
    name: 'The Rustic Book Nook',
    vicinity: '456 Oak Ave, New York, NY',
    geometry: { location: { lat: 40.7580, lng: -73.9855 } },
    rating: 4.3,
    photos: [{ photo_reference: 'demo_photo_3' }]
  },
  {
    place_id: 'demo_4',
    name: 'Moonlight Rooftop Bar',
    vicinity: '789 High St, New York, NY',
    geometry: { location: { lat: 40.7614, lng: -73.9776 } },
    rating: 4.6,
    photos: [{ photo_reference: 'demo_photo_4' }]
  },
  {
    place_id: 'demo_5',
    name: 'Adventure Escape Rooms',
    vicinity: '321 Fun Blvd, New York, NY',
    geometry: { location: { lat: 40.7505, lng: -73.9934 } },
    rating: 4.4,
    photos: [{ photo_reference: 'demo_photo_5' }]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const mood = searchParams.get('mood') || '';
    const rerollToken = searchParams.get('rerollToken');

    // Validate required parameters
    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { success: false, error: 'Valid latitude and longitude are required' },
        { status: 400 }
      );
    }

    if (!mood) {
      return NextResponse.json(
        { success: false, error: 'Mood is required' },
        { status: 400 }
      );
    }

    const location: Location = { lat, lng };
    
    // Get categories for the mood
    let categories: string[];
    if (mood === 'surprise') {
      categories = getSurpriseCategories();
    } else {
      const moodData = getMoodById(mood);
      if (!moodData) {
        return NextResponse.json(
          { success: false, error: 'Invalid mood' },
          { status: 400 }
        );
      }
      categories = moodData.categories;
    }

    let places: PlaceSearchResult[] = [];
    const hasApiKey = !!process.env.GOOGLE_PLACES_API_KEY;

    if (hasApiKey) {
      try {
        // Try to use Google Places API
        places = await searchPlaces(location, categories, true);
      } catch (error) {
        console.error('Google Places API error:', error);
        // Fall back to demo mode
        places = DEMO_PLACES;
      }
    } else {
      // Use demo data when API key is not available
      places = DEMO_PLACES;
    }
    
    if (places.length === 0) {
      // Return a cozy fallback message
      return NextResponse.json({
        success: true,
        recommendation: null,
        message: "Nothing's open right now, but maybe that's the universe telling you to have a cozy night in? 🏠✨"
      });
    }

    // Filter and score places
    const scoredPlaces = places
      .map((place: PlaceSearchResult) => ({
        ...place,
        distance: calculateDistance(location, place.geometry.location),
        score: calculatePlaceScore(place, location)
      }))
      .filter(place => place.distance <= 20) // Within 20 miles
      .sort((a, b) => {
        // If rerolling, add some randomness
        if (rerollToken) {
          return Math.random() - 0.5;
        }
        return b.score - a.score;
      });

    if (scoredPlaces.length === 0) {
      return NextResponse.json({
        success: true,
        recommendation: null,
        message: "Hmm, seems like you're in the middle of nowhere! Maybe it's time for a spontaneous road trip? 🚗"
      });
    }

    const selectedPlace = scoredPlaces[0];
    
    const recommendation: Recommendation = {
      placeId: selectedPlace.place_id,
      name: selectedPlace.name,
      address: selectedPlace.vicinity,
      reason: getWittyReason(mood, selectedPlace.name),
      distance: Math.round(selectedPlace.distance * 10) / 10, // Round to 1 decimal
      photoUrl: hasApiKey && selectedPlace.photos?.[0]?.photo_reference 
        ? getPhotoUrl(selectedPlace.photos[0].photo_reference)
        : undefined,
      mapsUrl: hasApiKey ? getMapsUrl(selectedPlace.place_id) : `https://www.google.com/maps/search/${encodeURIComponent(selectedPlace.name + ' ' + selectedPlace.vicinity)}`,
      rerollToken: rerollToken ? undefined : generateRerollToken() // Only provide reroll token if not already used
    };

    return NextResponse.json({
      success: true,
      recommendation
    });
    
  } catch (error) {
    console.error('Error getting recommendation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get recommendation' },
      { status: 500 }
    );
  }
}

function calculatePlaceScore(place: PlaceSearchResult, userLocation: Location): number {
  let score = 0;
  
  // Distance score (closer is better, but not too close)
  const distance = calculateDistance(userLocation, place.geometry.location);
  if (distance < 1) {
    score += 5; // Very close
  } else if (distance < 5) {
    score += 8; // Sweet spot
  } else if (distance < 10) {
    score += 6; // Good distance
  } else {
    score += 3; // Far but acceptable
  }
  
  // Rating score
  if (place.rating) {
    score += place.rating * 2;
  }
  
  // Open now bonus
  if (place.opening_hours?.open_now) {
    score += 3;
  }
  
  // Photo bonus (places with photos are usually more established)
  if (place.photos && place.photos.length > 0) {
    score += 2;
  }
  
  return score;
}