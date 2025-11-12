import { generateIntelligentEmail } from '../../../lib/openai.js';
import { ClientService, InteractionService } from '../../../lib/database.js';
import { aiAgentKBEnrichment } from '../../../lib/ai-agent-kb-enrichment.js';

// Vrai AI Agent avec intégration OpenAI + Base de données + Knowledge Base
export async function POST(request) {
  try {
    const { context, intent, clientProfile, previousInteractions } = await request.json();
    
    console.log('🧠 AI Agent Request avec DB:', { 
      context: context?.substring(0, 100) + '...', 
      intent,
      clientProfile: clientProfile?.company 
    });

    let client = null;
    let persistentHistory = [];

    // 1. Gérer le client en base de données
    if (clientProfile?.company) {
      try {
        client = await ClientService.findOrCreateClient({
          company: clientProfile.company,
          segment: clientProfile.segment || 'sme',
          industry: clientProfile.industry,
          currentChallenges: clientProfile.currentChallenges,
          contactEmail: clientProfile.contactEmail,
          contactName: clientProfile.contactName
        });

        // 2. Récupérer l'historique persistant du client
        const history = await InteractionService.getClientHistory(client.id, 10);
        persistentHistory = history.map(interaction => ({
          type: interaction.type,
          direction: interaction.direction,
          status: interaction.status,
          sentiment: interaction.responseSentiment || 'neutral',
          response: interaction.responseReceived ? 'responded' : 'no_response',
          createdAt: interaction.createdAt,
          subject: interaction.subject,
          daysSince: Math.floor((new Date() - interaction.createdAt) / (1000 * 60 * 60 * 24))
        }));

        console.log(`📊 Client ${client.company}: ${persistentHistory.length} interactions en base`);
      } catch (dbError) {
        console.warn('⚠️ Erreur DB, continue sans historique:', dbError.message);
      }
    }

    // 3. Fusion de l'historique local + persistant
    const combinedHistory = [...(previousInteractions || []), ...persistentHistory];

    // 4. ENRICHISSEMENT AVEC KNOWLEDGE BASE MICROSOFT
    console.log('📚 Enriching context with Microsoft Knowledge Base...');
    const enrichedContext = aiAgentKBEnrichment.enrichContext({
      context,
      intent,
      clientProfile,
      previousInteractions: combinedHistory
    });

    // Générer le prompt enrichi avec les données KB
    const enrichedPrompt = aiAgentKBEnrichment.generateEnrichedPrompt(enrichedContext);
    const structuredContext = aiAgentKBEnrichment.generateStructuredContext(enrichedContext);

    console.log(`✅ KB Enrichment: ${enrichedContext.relevantSolutions.length} solutions, quality: ${Math.round(enrichedContext.enrichmentQuality * 100)}%`);

    // 5. Appel à l'IA avec contexte enrichi
    const aiResponse = await generateIntelligentEmail({
      context: enrichedPrompt, // Contexte enrichi avec KB
      intent,
      clientProfile: {
        ...clientProfile,
        ...(client && {
          id: client.id,
          priority: client.priority,
          status: client.status
        }),
        kbEnrichment: structuredContext // Ajout du contexte structuré
      },
      previousInteractions: combinedHistory
    });
    
    // 5. Sauvegarder l'interaction générée en base
    let savedInteraction = null;
    if (client) {
      try {
        savedInteraction = await InteractionService.createInteraction({
          clientId: client.id,
          type: 'email',
          direction: 'outbound',
          subject: extractSubject(aiResponse.content),
          content: aiResponse.content,
          context: context,
          intent: intent,
          status: 'generated'
        });
        
        console.log('💾 Interaction sauvegardée en base');
      } catch (dbError) {
        console.warn('⚠️ Erreur sauvegarde interaction:', dbError.message);
      }
    }
    
    console.log('✅ AI Generated avec historique persistant:', { 
      length: aiResponse.content.length,
      confidence: aiResponse.confidence,
      historyItems: combinedHistory.length 
    });
    
    return Response.json({
      generatedContent: aiResponse.content,
      reasoning: aiResponse.reasoning,
      suggestions: aiResponse.suggestions,
      confidence: aiResponse.confidence,
      clientId: client?.id,
      interactionId: savedInteraction?.id,
      historyUsed: combinedHistory.length,

      // Enrichissement Knowledge Base
      kbEnrichment: {
        quality: Math.round(enrichedContext.enrichmentQuality * 100),
        solutionsFound: enrichedContext.relevantSolutions.length,
        solutionNames: enrichedContext.solutionDetails.map(s => s.name),
        industryInsights: enrichedContext.industryInsights?.name || null,
        businessValuePoints: enrichedContext.businessValuePoints.length,
        dataSourcesUsed: enrichedContext.dataSourcesUsed
      }
    });
    
  } catch (error) {
    console.error('❌ AI Agent error:', error);
    return Response.json({ 
      error: 'AI generation failed', 
      details: error.message 
    }, { status: 500 });
  }
}

// Utilitaire pour extraire le sujet de l'email généré
function extractSubject(emailContent) {
  try {
    const lines = emailContent.split('\n');
    const subjectLine = lines.find(line => line.toLowerCase().startsWith('objet:'));
    if (subjectLine) {
      return subjectLine.replace(/^objet:\s*/i, '').trim();
    }
    return 'Email généré par AI Agent';
  } catch (error) {
    return 'Email généré par AI Agent';
  }
}


