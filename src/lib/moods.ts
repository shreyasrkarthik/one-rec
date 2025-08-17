import { Mood } from '@/types';

export const MOODS: Mood[] = [
  {
    id: 'restless',
    emoji: '😵',
    label: 'Restless',
    categories: ['hiking_trail', 'park', 'climbing_gym']
  },
  {
    id: 'sad',
    emoji: '😔',
    label: 'Sad',
    categories: ['dessert_shop', 'bakery', 'cafe', 'bookstore']
  },
  {
    id: 'romantic',
    emoji: '😍',
    label: 'Romantic',
    categories: ['rooftop_bar', 'wine_bar', 'garden']
  },
  {
    id: 'anxious',
    emoji: '🤯',
    label: 'Anxious',
    categories: ['botanical_garden', 'tea_house', 'yoga']
  },
  {
    id: 'celebratory',
    emoji: '🎉',
    label: 'Celebratory',
    categories: ['cocktail_bar', 'brewery', 'karaoke']
  },
  {
    id: 'bored',
    emoji: '😴',
    label: 'Bored',
    categories: ['museum', 'arcade', 'thrift_store']
  },
  {
    id: 'energetic',
    emoji: '⚡',
    label: 'Energetic',
    categories: ['live_music', 'dance_club', 'spin_class']
  },
  {
    id: 'adventurous',
    emoji: '🗺️',
    label: 'Adventurous',
    categories: ['kayak_rental', 'escape_room', 'food_truck']
  },
  {
    id: 'nostalgic',
    emoji: '🕰️',
    label: 'Nostalgic',
    categories: ['retro_arcade', 'indie_theater', 'diner']
  }
];

export const SURPRISE_MOOD: Mood = {
  id: 'surprise',
  emoji: '🎲',
  label: 'Surprise Me',
  categories: []
};

export function getMoodById(id: string): Mood | undefined {
  if (id === 'surprise') return SURPRISE_MOOD;
  return MOODS.find(mood => mood.id === id);
}

export function getSurpriseCategories(): string[] {
  const currentHour = new Date().getHours();
  
  // Time-based filtering
  if (currentHour >= 23 || currentHour < 5) {
    // Late night/early morning - avoid outdoor activities
    const indoorMoods = MOODS.filter(mood => 
      !['restless', 'adventurous'].includes(mood.id)
    );
    const randomMood = indoorMoods[Math.floor(Math.random() * indoorMoods.length)];
    return randomMood.categories;
  }
  
  if (currentHour >= 5 && currentHour < 12) {
    // Morning - lighter activities
    const morningMoods = MOODS.filter(mood => 
      ['restless', 'sad', 'anxious', 'bored'].includes(mood.id)
    );
    const randomMood = morningMoods[Math.floor(Math.random() * morningMoods.length)];
    return randomMood.categories;
  }
  
  if (currentHour >= 18) {
    // Evening - social activities
    const eveningMoods = MOODS.filter(mood => 
      ['romantic', 'celebratory', 'energetic', 'nostalgic'].includes(mood.id)
    );
    const randomMood = eveningMoods[Math.floor(Math.random() * eveningMoods.length)];
    return randomMood.categories;
  }
  
  // Daytime - any mood
  const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
  return randomMood.categories;
}

export function getWittyReason(mood: string, placeName: string): string {
  const reasons: Record<string, string[]> = {
    restless: [
      `Time to get those legs moving at ${placeName}!`,
      `${placeName} is calling your restless soul.`,
      `Perfect for burning off that nervous energy.`
    ],
    sad: [
      `${placeName} serves comfort that actually comforts.`,
      `Sweet treats and cozy vibes await at ${placeName}.`,
      `Sometimes the best therapy comes in pastry form.`
    ],
    romantic: [
      `${placeName} sets the mood just right.`,
      `Candlelit vibes and intimate spaces at ${placeName}.`,
      `Perfect for stealing glances over wine glasses.`
    ],
    anxious: [
      `${placeName} offers the zen you desperately need.`,
      `Deep breaths and peaceful vibes at ${placeName}.`,
      `Your nervous system will thank you for this choice.`
    ],
    celebratory: [
      `${placeName} knows how to party (responsibly).`,
      `Cheers to good times at ${placeName}!`,
      `Because life's wins deserve proper celebration.`
    ],
    bored: [
      `${placeName} will definitely cure your boredom.`,
      `Time to discover something new at ${placeName}.`,
      `Your brain craves stimulation - ${placeName} delivers.`
    ],
    energetic: [
      `${placeName} matches your electric energy perfectly.`,
      `Channel that buzz into something awesome at ${placeName}.`,
      `Your energy levels and ${placeName} are a perfect match.`
    ],
    adventurous: [
      `${placeName} is exactly the adventure you're craving.`,
      `Time to step outside your comfort zone at ${placeName}.`,
      `Your adventurous spirit led you straight to ${placeName}.`
    ],
    nostalgic: [
      `${placeName} will transport you to simpler times.`,
      `Prepare for a delightful trip down memory lane.`,
      `${placeName} captures that old-school magic perfectly.`
    ],
    surprise: [
      `The universe has spoken: ${placeName} it is!`,
      `Plot twist: ${placeName} is exactly what you needed.`,
      `Trust the process - ${placeName} won't disappoint.`
    ]
  };
  
  const moodReasons = reasons[mood] || reasons.surprise;
  return moodReasons[Math.floor(Math.random() * moodReasons.length)];
}