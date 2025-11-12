import { NextResponse } from 'next/server';
import { InteractionService } from '../../../lib/database.js';

// GET /api/interactions?clientId=xxx - Récupérer l'historique d'un client
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!clientId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'clientId est requis' 
        },
        { status: 400 }
      );
    }

    console.log('📅 Récupération historique client:', { clientId, limit });
    
    const interactions = await InteractionService.getClientHistory(clientId, limit);
    const patterns = await InteractionService.analyzeClientPatterns(clientId);
    
    console.log(`✅ ${interactions.length} interactions récupérées`);
    
    return NextResponse.json({
      success: true,
      data: {
        interactions,
        patterns
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur GET /api/interactions:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la récupération des interactions',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/interactions - Créer une nouvelle interaction
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      clientId,
      type = 'email',
      direction = 'outbound',
      subject,
      content,
      context,
      intent,
      status = 'sent'
    } = body;

    console.log('📧 Création nouvelle interaction:', { 
      clientId, 
      type, 
      subject: subject?.substring(0, 50) + '...' 
    });

    if (!clientId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'clientId est requis' 
        },
        { status: 400 }
      );
    }

    const interaction = await InteractionService.createInteraction({
      clientId,
      type,
      direction,
      subject,
      content,
      context,
      intent,
      status
    });

    return NextResponse.json({
      success: true,
      data: interaction,
      message: 'Interaction créée avec succès'
    });
    
  } catch (error) {
    console.error('❌ Erreur POST /api/interactions:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la création de l\'interaction',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT /api/interactions - Mettre à jour une interaction
export async function PUT(request) {
  try {
    const body = await request.json();
    const { 
      interactionId, 
      status, 
      responseContent, 
      sentiment,
      outcome,
      nextAction,
      nextActionDate
    } = body;

    console.log('📊 Mise à jour interaction:', { interactionId, status });

    if (!interactionId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'interactionId est requis' 
        },
        { status: 400 }
      );
    }

    const interaction = await InteractionService.updateInteractionStatus(
      interactionId, 
      status, 
      responseContent, 
      sentiment
    );

    return NextResponse.json({
      success: true,
      data: interaction,
      message: 'Interaction mise à jour'
    });
    
  } catch (error) {
    console.error('❌ Erreur PUT /api/interactions:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la mise à jour de l\'interaction',
        details: error.message 
      },
      { status: 500 }
    );
  }
}