/**
 * Active Learning Management API
 * Endpoints for managing chatbot learning and improvement
 */

import { NextResponse } from 'next/server';
import { activeLearningSystem } from '../../../lib/active-learning-system.js';

// GET /api/active-learning - Get active learning status and recommendations
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';

    console.log('🧠 Active learning GET request:', { action });

    switch (action) {
      case 'status':
        const status = activeLearningSystem.getActiveLearningStatus();
        return NextResponse.json({
          success: true,
          data: status,
          timestamp: new Date().toISOString()
        });

      case 'recommendations':
        const recommendations = activeLearningSystem.generateTrainingRecommendations();
        return NextResponse.json({
          success: true,
          data: recommendations,
          count: recommendations.length
        });

      case 'uncertain-samples':
        const limit = parseInt(searchParams.get('limit') || '10');
        const uncertainSamples = activeLearningSystem.getPrioritySamplesForReview(limit);
        return NextResponse.json({
          success: true,
          data: uncertainSamples,
          count: uncertainSamples.length
        });

      case 'knowledge-gaps':
        const gapLimit = parseInt(searchParams.get('limit') || '10');
        const knowledgeGaps = activeLearningSystem.getKnowledgeGaps(gapLimit);
        return NextResponse.json({
          success: true,
          data: knowledgeGaps,
          count: knowledgeGaps.length
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
          availableActions: ['status', 'recommendations', 'uncertain-samples', 'knowledge-gaps']
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error in GET /api/active-learning:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve active learning data',
      details: error.message
    }, { status: 500 });
  }
}

// POST /api/active-learning - Process human feedback and learning actions
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    console.log('🧠 Active learning POST request:', { action, dataKeys: Object.keys(data) });

    switch (action) {
      case 'human-feedback':
        const { sampleId, humanLabel, confidence = 1.0 } = data;

        if (!sampleId || !humanLabel) {
          return NextResponse.json({
            success: false,
            error: 'sampleId and humanLabel are required'
          }, { status: 400 });
        }

        const feedbackResult = activeLearningSystem.processHumanFeedback(sampleId, humanLabel, confidence);
        return NextResponse.json({
          success: true,
          data: feedbackResult,
          message: 'Human feedback processed successfully'
        });

      case 'user-correction':
        const { userMessage, predictedIntent, correctedIntent, sessionId } = data;

        if (!userMessage || !predictedIntent || !correctedIntent) {
          return NextResponse.json({
            success: false,
            error: 'userMessage, predictedIntent, and correctedIntent are required'
          }, { status: 400 });
        }

        activeLearningSystem.processUserCorrection(userMessage, predictedIntent, correctedIntent);
        return NextResponse.json({
          success: true,
          message: 'User correction processed successfully'
        });

      case 'feedback-response':
        const { interactionId, feedbackType, feedbackData } = data;

        // Process user response to feedback request
        if (feedbackType === 'intent_clarification') {
          const { selectedIntent } = feedbackData;
          // Process intent clarification
          return NextResponse.json({
            success: true,
            message: 'Intent clarification processed'
          });
        }

        if (feedbackType === 'confidence_verification') {
          const { isCorrect } = feedbackData;
          // Process confidence verification
          return NextResponse.json({
            success: true,
            message: 'Confidence verification processed'
          });
        }

        if (feedbackType === 'knowledge_gap') {
          const { isUseful } = feedbackData;
          // Process knowledge gap feedback
          return NextResponse.json({
            success: true,
            message: 'Knowledge gap feedback processed'
          });
        }

        return NextResponse.json({
          success: false,
          error: `Unknown feedback type: ${feedbackType}`
        }, { status: 400 });

      case 'add-training-example':
        const { intent, utterance, confidence: exampleConfidence = 1.0 } = data;

        if (!intent || !utterance) {
          return NextResponse.json({
            success: false,
            error: 'intent and utterance are required'
          }, { status: 400 });
        }

        // Add new training example (would integrate with training pipeline)
        return NextResponse.json({
          success: true,
          message: 'Training example added to queue'
        });

      case 'add-knowledge':
        const { question, answer, category, tags = [] } = data;

        if (!question || !answer) {
          return NextResponse.json({
            success: false,
            error: 'question and answer are required'
          }, { status: 400 });
        }

        // Add new knowledge base entry (would integrate with knowledge base)
        return NextResponse.json({
          success: true,
          message: 'Knowledge entry added to review queue'
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
          availableActions: [
            'human-feedback',
            'user-correction',
            'feedback-response',
            'add-training-example',
            'add-knowledge'
          ]
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error in POST /api/active-learning:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process active learning action',
      details: error.message
    }, { status: 500 });
  }
}

// PUT /api/active-learning - Update active learning configuration
export async function PUT(request) {
  try {
    const body = await request.json();
    const { confidenceThresholds, performanceMetrics } = body;

    console.log('🧠 Active learning PUT request:', {
      hasThresholds: !!confidenceThresholds,
      hasMetrics: !!performanceMetrics
    });

    // Update confidence thresholds
    if (confidenceThresholds) {
      Object.assign(activeLearningSystem.confidenceThresholds, confidenceThresholds);
    }

    // Update performance metrics
    if (performanceMetrics) {
      Object.assign(activeLearningSystem.performanceMetrics, performanceMetrics);
    }

    return NextResponse.json({
      success: true,
      message: 'Active learning configuration updated',
      currentConfig: {
        confidenceThresholds: activeLearningSystem.confidenceThresholds,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error in PUT /api/active-learning:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update active learning configuration',
      details: error.message
    }, { status: 500 });
  }
}