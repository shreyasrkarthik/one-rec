import { Location } from '@/types';

export interface LocationResult {
  location?: Location;
  error?: string;
}

export function getCurrentLocation(): Promise<LocationResult> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ error: 'Geolocation is not supported by this browser' });
      return;
    }

    const timeoutId = setTimeout(() => {
      resolve({ error: 'Location request timed out' });
    }, 5000); // 5 second timeout

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        resolve({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      },
      (error) => {
        clearTimeout(timeoutId);
        let errorMessage = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        resolve({ error: errorMessage });
      },
      {
        enableHighAccuracy: false, // Changed to false for better compatibility
        timeout: 5000, // 5 seconds
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

export async function getLocationFromZip(zipCode: string): Promise<LocationResult> {
  try {
    // For demo purposes, use hardcoded locations for common ZIP codes
    const demoLocations: Record<string, Location> = {
      '10001': { lat: 40.7505, lng: -73.9934 }, // NYC
      '90210': { lat: 34.0901, lng: -118.4065 }, // Beverly Hills
      '02101': { lat: 42.3584, lng: -71.0598 }, // Boston
      '60601': { lat: 41.8781, lng: -87.6298 }, // Chicago
      '94102': { lat: 37.7749, lng: -122.4194 }, // San Francisco
      '78701': { lat: 30.2672, lng: -97.7431 }, // Austin
      '33101': { lat: 25.7617, lng: -80.1918 }, // Miami
      '98101': { lat: 47.6062, lng: -122.3321 }, // Seattle
    };

    if (demoLocations[zipCode]) {
      return { location: demoLocations[zipCode] };
    }

    // Try external API as fallback
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      
      if (!response.ok) {
        throw new Error('Invalid ZIP code');
      }
      
      const data = await response.json();
      
      return {
        location: {
          lat: parseFloat(data.places[0].latitude),
          lng: parseFloat(data.places[0].longitude)
        }
      };
    } catch (apiError) {
      // If external API fails, provide a default location (NYC)
      if (zipCode.match(/^\d{5}$/)) {
        return { location: { lat: 40.7505, lng: -73.9934 } }; // Default to NYC
      }
      throw new Error('Invalid ZIP code format');
    }
  } catch (err) {
    return {
      error: 'Failed to get location from ZIP code. Please check the ZIP code and try again.'
    };
  }
}