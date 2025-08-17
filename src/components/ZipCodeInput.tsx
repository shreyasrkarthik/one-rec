import { useState } from 'react';
import { getLocationFromZip } from '@/lib/location';

interface ZipCodeInputProps {
  onLocationSet: (lat: number, lng: number) => void;
  onError: (error: string) => void;
}

export default function ZipCodeInput({ onLocationSet, onError }: ZipCodeInputProps) {
  const [zipCode, setZipCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zipCode.trim()) {
      onError('Please enter a ZIP code');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await getLocationFromZip(zipCode.trim());
      
      if (result.location) {
        onLocationSet(result.location.lat, result.location.lng);
      } else {
        onError(result.error || 'Invalid ZIP code. Please try again.');
      }
    } catch (err) {
      onError('Invalid ZIP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Enter Your ZIP Code
        </h2>
        <p className="text-gray-600">
          We need your location to find nearby recommendations
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Enter ZIP code (e.g., 10001)"
            className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            maxLength={5}
            pattern="[0-9]{5}"
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !zipCode.trim()}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Finding location...
            </div>
          ) : (
            'Find Recommendations'
          )}
        </button>
      </form>
    </div>
  );
}