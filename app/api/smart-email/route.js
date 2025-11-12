import { smartEmailGenerator } from '../../../lib/smart-email-generator.js';
import { microsoftKnowledgeBase } from '../../../lib/microsoft-knowledge-base.js';

export async function POST(request) {
  try {
    const {
      companyName,
      recipientName,
      recipientRole,
      companySize,
      industry,
      emailType,
      specificNeeds,
      currentChallenges,
      useCase
    } = await request.json();

    console.log('🧠 Smart Email Generation request:', {
      companyName,
      recipientRole,
      emailType,
      useCase
    });

    // Validate required fields
    if (!companyName) {
      return Response.json({
        error: 'Company name is required'
      }, { status: 400 });
    }

    let emailContent;

    // Handle different request types
    if (useCase) {
      // Generate email based on specific use case
      const recommendations = smartEmailGenerator.getRecommendationsForUseCase(useCase);
      emailContent = smartEmailGenerator.generatePersonalizedEmail({
        companyName,
        recipientName,
        recipientRole: recipientRole || 'Directeur Général',
        companySize: companySize || 'sme',
        industry: industry || 'retail',
        emailType: emailType || 'prospection',
        specificNeeds: specificNeeds || [],
        currentChallenges: currentChallenges || []
      });
    } else {
      // Generate standard personalized email
      emailContent = smartEmailGenerator.generatePersonalizedEmail({
        companyName,
        recipientName,
        recipientRole: recipientRole || 'Directeur Général',
        companySize: companySize || 'sme',
        industry: industry || 'retail',
        emailType: emailType || 'prospection',
        specificNeeds: specificNeeds || [],
        currentChallenges: currentChallenges || []
      });
    }

    return Response.json({
      email: emailContent,
      knowledgeBaseUsed: true,
      recommendations: emailContent.metadata.recommendedSolutions,
      personalizationLevel: emailContent.metadata.personalizationLevel
    });

  } catch (error) {
    console.error('Smart email generation error:', error);
    return Response.json({
      error: 'Failed to generate smart email',
      details: error.message
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'solutions':
        // Return available solutions
        return Response.json({
          categories: microsoftKnowledgeBase.categories,
          solutions: Object.keys(microsoftKnowledgeBase.solutions).map(key => ({
            key,
            ...microsoftKnowledgeBase.solutions[key]
          }))
        });

      case 'industries':
        // Return available industries
        return Response.json({
          industries: microsoftKnowledgeBase.industries
        });

      case 'profiles':
        // Return company profiles
        return Response.json({
          profiles: microsoftKnowledgeBase.companyProfiles
        });

      case 'use-cases':
        // Return common use cases
        return Response.json({
          useCases: {
            'migration_cloud': 'Migration vers le cloud',
            'collaboration': 'Améliorer la collaboration',
            'securite': 'Renforcer la sécurité',
            'crm': 'Optimiser la relation client',
            'ai': 'Intégrer l\'intelligence artificielle',
            'digital_transformation': 'Transformation digitale globale'
          }
        });

      default:
        return Response.json({
          message: 'Smart Email API',
          endpoints: {
            'POST /api/smart-email': 'Generate smart email',
            'GET /api/smart-email?action=solutions': 'Get available solutions',
            'GET /api/smart-email?action=industries': 'Get industries',
            'GET /api/smart-email?action=profiles': 'Get company profiles',
            'GET /api/smart-email?action=use-cases': 'Get use cases'
          }
        });
    }

  } catch (error) {
    console.error('Smart email API error:', error);
    return Response.json({
      error: 'API error',
      details: error.message
    }, { status: 500 });
  }
}