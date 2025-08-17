import { NextResponse } from 'next/server';
import { MOODS, SURPRISE_MOOD } from '@/lib/moods';

export async function GET() {
  try {
    const allMoods = [...MOODS, SURPRISE_MOOD];
    
    return NextResponse.json({
      success: true,
      moods: allMoods
    });
  } catch (error) {
    console.error('Error fetching moods:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch moods' },
      { status: 500 }
    );
  }
}