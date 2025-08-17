import { Recommendation } from '@/types';
import Image from 'next/image';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAccept: () => void;
  onReject: () => void;
  canReroll: boolean;
  isLoading: boolean;
}

export default function RecommendationCard({ 
  recommendation, 
  onAccept, 
  onReject, 
  canReroll,
  isLoading 
}: RecommendationCardProps) {
  const handleGoThere = () => {
    onAccept();
    window.open(recommendation.mapsUrl, '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Photo */}
        <div className="relative h-48 bg-gray-200">
          {recommendation.photoUrl ? (
            <Image
              src={recommendation.photoUrl}
              alt={recommendation.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-6xl">📍</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {recommendation.name}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {recommendation.address}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="mr-1">📍</span>
            <span>{recommendation.distance} miles away</span>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-blue-800 font-medium">
              {recommendation.reason}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoThere}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              🗺️ I&apos;ll Go
            </button>
            
            <button
              onClick={onReject}
              disabled={isLoading || !canReroll}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {canReroll ? '🎲 Meh, Try Again' : '🚫 No More Rerolls'}
            </button>
          </div>
          
          {!canReroll && (
            <p className="text-xs text-gray-500 text-center mt-3">
              One reroll per session - choose wisely! 😉
            </p>
          )}
        </div>
      </div>
      
      {isLoading && (
        <div className="text-center mt-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-2">Finding another option...</p>
        </div>
      )}
    </div>
  );
}