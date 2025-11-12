import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// API pour récupérer les templates depuis Prisma
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const segment = url.searchParams.get('segment');
    const tone = url.searchParams.get('tone');

    console.log('🎯 API Templates - Filtres:', { category, segment, tone });

    let whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (segment) {
      whereClause.segment = segment;
    }
    
    if (tone) {
      whereClause.tone = tone;
    }

    const templates = await prisma.emailTemplate.findMany({
      where: whereClause,
      orderBy: [
        { successRate: 'desc' },
        { useCount: 'desc' }
      ]
    });

    console.log(`✅ ${templates.length} templates trouvés`);

    return Response.json({
      templates,
      count: templates.length,
      filters: { category, segment, tone }
    });

  } catch (error) {
    console.error('❌ Erreur API Templates:', error);
    return Response.json({ 
      error: 'Failed to fetch templates',
      details: error.message 
    }, { status: 500 });
  }
}

// API pour récupérer un template spécifique et l'optimiser selon le contexte
export async function POST(request) {
  try {
    const { templateId, clientProfile, context } = await request.json();
    
    console.log('🎯 Personnalisation template:', { templateId, segment: clientProfile?.segment });

    const template = await prisma.emailTemplate.findUnique({
      where: { id: parseInt(templateId) }
    });

    if (!template) {
      return Response.json({ error: 'Template not found' }, { status: 404 });
    }

    // Personnaliser le template selon le profil client
    let personalizedContent = template.content;
    let personalizedSubject = template.subject;

    if (clientProfile?.company) {
      personalizedContent = personalizedContent.replace(/\[COMPANY\]/g, clientProfile.company);
      personalizedSubject = personalizedSubject.replace(/\[COMPANY\]/g, clientProfile.company);
    }

    if (context) {
      personalizedContent = personalizedContent.replace(/\[CONTEXT\]/g, context);
    }

    // Mettre à jour le compteur d'utilisation
    await prisma.emailTemplate.update({
      where: { id: parseInt(templateId) },
      data: { useCount: { increment: 1 } }
    });

    console.log('✅ Template personnalisé:', template.name);

    return Response.json({
      template: {
        ...template,
        content: personalizedContent,
        subject: personalizedSubject
      },
      reasoning: template.reasoning,
      successRate: template.successRate
    });

  } catch (error) {
    console.error('❌ Erreur personnalisation template:', error);
    return Response.json({ 
      error: 'Failed to personalize template',
      details: error.message 
    }, { status: 500 });
  }
}