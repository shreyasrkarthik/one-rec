import { Mood } from '@/types';

interface MoodBoardProps {
  moods: Mood[];
  onMoodSelect: (moodId: string) => void;
  isLoading: boolean;
}

export default function MoodBoard({ moods, onMoodSelect, isLoading }: MoodBoardProps) {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          How are you feeling?
        </h1>
        <p className="text-gray-600">
          Pick your vibe and we&apos;ll find the perfect spot
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {moods.slice(0, -1).map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodSelect(mood.id)}
            disabled={isLoading}
            className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <span className="text-4xl mb-2">{mood.emoji}</span>
            <span className="text-sm font-medium text-gray-700">
              {mood.label}
            </span>
          </button>
        ))}
      </div>
      
      {/* Surprise Me button - full width */}
      {moods.length > 0 && (
        <button
          onClick={() => onMoodSelect(moods[moods.length - 1].id)}
          disabled={isLoading}
          className="w-full flex items-center justify-center p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          <span className="text-4xl mr-3">{moods[moods.length - 1].emoji}</span>
          <span className="text-lg font-semibold">
            {moods[moods.length - 1].label}
          </span>
        </button>
      )}
      
      {isLoading && (
        <div className="text-center mt-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-2">Finding your perfect spot...</p>
        </div>
      )}
    </div>
  );
}