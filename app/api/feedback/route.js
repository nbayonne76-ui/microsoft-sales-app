import { NextResponse } from 'next/server';
import { FeedbackService } from '../../../lib/analytics.js';

// GET /api/feedback - Récupérer le résumé des feedbacks
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    console.log('📝 Récupération résumé feedback:', { days });
    
    const feedbackSummary = await FeedbackService.getFeedbackSummary(days);
    
    return NextResponse.json({
      success: true,
      data: feedbackSummary,
      period: `${days} derniers jours`
    });
    
  } catch (error) {
    console.error('❌ Erreur GET /api/feedback:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la récupération des feedbacks',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/feedback - Enregistrer un nouveau feedback
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      interactionId,
      qualityRating,
      relevanceRating,
      toneRating,
      feedbackText,
      suggestedImprovement,
      feedbackType = 'manual',
      feedbackSource = 'manual'
    } = body;

    console.log('📝 Enregistrement feedback:', { 
      interactionId, 
      qualityRating,
      feedbackType 
    });

    if (!interactionId) {
      return NextResponse.json(
        { success: false, error: 'interactionId requis' },
        { status: 400 }
      );
    }

    const feedback = await FeedbackService.recordFeedback({
      interactionId,
      qualityRating,
      relevanceRating,
      toneRating,
      feedbackText,
      suggestedImprovement,
      feedbackType,
      feedbackSource
    });

    return NextResponse.json({
      success: true,
      data: feedback,
      message: 'Feedback enregistré avec succès'
    });
    
  } catch (error) {
    console.error('❌ Erreur POST /api/feedback:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de l\'enregistrement du feedback',
        details: error.message 
      },
      { status: 500 }
    );
  }
}