'use client';

import { useState, useEffect } from 'react';
import { Mood, Recommendation, Location } from '@/types';
import { getCurrentLocation } from '@/lib/location';
import MoodBoard from '@/components/MoodBoard';
import RecommendationCard from '@/components/RecommendationCard';
import ZipCodeInput from '@/components/ZipCodeInput';

type AppState = 'loading' | 'location-needed' | 'mood-selection' | 'recommendation' | 'error';

export default function Home() {
  const [state, setState] = useState<AppState>('loading');
  const [moods, setMoods] = useState<Mood[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [rerollToken, setRerollToken] = useState<string | null>(null);
  const [hasRerolled, setHasRerolled] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Load moods
      const moodsResponse = await fetch('/api/moods');
      const moodsData = await moodsResponse.json();
      
      if (moodsData.success) {
        setMoods(moodsData.moods);
      }

      // Try to get location
      const locationResult = await getCurrentLocation();
      
      if (locationResult.location) {
        setLocation(locationResult.location);
        setState('mood-selection');
      } else {
        setState('location-needed');
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setState('error');
      setError('Failed to initialize the app. Please refresh and try again.');
    }
  };

  const handleLocationSet = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setState('mood-selection');
  };

  const handleLocationError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleMoodSelect = async (moodId: string) => {
    if (!location) return;

    setSelectedMood(moodId);
    setIsLoading(true);
    
    try {
      const params = new URLSearchParams({
        lat: location.lat.toString(),
        lng: location.lng.toString(),
        mood: moodId
      });

      if (hasRerolled && rerollToken) {
        params.append('rerollToken', rerollToken);
      }

      const response = await fetch(`/api/recommendation?${params}`);
      const data = await response.json();

      if (data.success) {
        if (data.recommendation) {
          setRecommendation(data.recommendation);
          if (data.recommendation.rerollToken) {
            setRerollToken(data.recommendation.rerollToken);
          }
          setState('recommendation');
        } else {
          // No places found
          setState('error');
          setError(data.message || 'No recommendations found');
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to get recommendation:', error);
      setState('error');
      setError('Failed to get recommendation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!recommendation || !location) return;

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placeId: recommendation.placeId,
          mood: selectedMood,
          action: 'accept',
          location,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
  };

  const handleReject = async () => {
    if (!recommendation || !location || hasRerolled) return;

    try {
      // Send feedback
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placeId: recommendation.placeId,
          mood: selectedMood,
          action: 'reject',
          location,
          timestamp: Date.now()
        })
      });

      // Mark as rerolled and get new recommendation
      setHasRerolled(true);
      handleMoodSelect(selectedMood);
    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
  };

  const handleTryAgain = () => {
    setState('mood-selection');
    setRecommendation(null);
    setSelectedMood('');
    setError('');
  };

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Setting up OneRec...</p>
          </div>
        );

      case 'location-needed':
        return (
          <ZipCodeInput
            onLocationSet={handleLocationSet}
            onError={handleLocationError}
          />
        );

      case 'mood-selection':
        return (
          <MoodBoard
            moods={moods}
            onMoodSelect={handleMoodSelect}
            isLoading={isLoading}
          />
        );

      case 'recommendation':
        return recommendation ? (
          <RecommendationCard
            recommendation={recommendation}
            onAccept={handleAccept}
            onReject={handleReject}
            canReroll={!hasRerolled}
            isLoading={isLoading}
          />
        ) : null;

      case 'error':
        return (
          <div className="w-full max-w-md mx-auto p-6 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Oops!
            </h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={handleTryAgain}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="w-full max-w-lg">
        {renderContent()}
      </div>
    </main>
  );
}
