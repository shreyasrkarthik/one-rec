import { NextRequest, NextResponse } from 'next/server';
import { FeedbackData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackData = await request.json();
    
    // Validate required fields
    if (!body.placeId || !body.mood || !body.action || !body.location || !body.timestamp) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['accept', 'reject'].includes(body.action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be "accept" or "reject"' },
        { status: 400 }
      );
    }

    // In a real app, you would save this to a database
    // For now, we'll just log it
    console.log('User feedback received:', {
      placeId: body.placeId,
      mood: body.mood,
      action: body.action,
      location: body.location,
      timestamp: new Date(body.timestamp).toISOString()
    });

    // You could also send this to analytics services, etc.
    
    return NextResponse.json({
      success: true,
      message: 'Feedback recorded successfully'
    });
    
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process feedback' },
      { status: 500 }
    );
  }
}