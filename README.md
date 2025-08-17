# OneRec

OneRec delivers opinionated, single recommendations for activities and places based on your mood and location. No endless scrolling, no decision paralysis - just one perfect suggestion.

## Features

- **Mood-Based Recommendations**: 9 mood options + "Surprise Me" to find the perfect place
- **Single Recommendation**: No overwhelming choices, just one curated suggestion
- **Location-Aware**: Uses your location to find nearby places
- **Smart Filtering**: Only shows places that are currently open
- **One Reroll**: Don't like the suggestion? Try once more
- **Direct Navigation**: "I'll Go" opens directions in your preferred maps app

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Add your Google Places API key
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Environment Variables

- `GOOGLE_PLACES_API_KEY`: Your Google Places API key for location data

## Tech Stack

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Google Places API
