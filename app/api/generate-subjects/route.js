export async function POST(request) {
  try {
    const { content, tone = 'professional', count = 5 } = await request.json();
    
    if (!content || !content.trim()) {
      return Response.json({ error: 'Content is required' }, { status: 400 });
    }

    // Extract key information from email content
    const lines = content.split('\n').filter(line => line.trim());
    const hasIntroduction = content.toLowerCase().includes('présente') || content.toLowerCase().includes('nouveau');
    const hasMeeting = content.toLowerCase().includes('réunion') || content.toLowerCase().includes('meeting');
    const hasPartner = content.toLowerCase().includes('partenaire');
    const hasUrgent = content.toLowerCase().includes('urgent') || content.toLowerCase().includes('important');
    const hasFollowUp = content.toLowerCase().includes('suivi') || content.toLowerCase().includes('retour');

    // Subject line templates based on tone and content analysis
    const subjectTemplates = {
      professional: [
        'Échange Stratégique Microsoft : Planification de Réunion',
        'Optimisation de Votre Expérience Microsoft : Invitation à une Réunion',
        'Accompagnement Microsoft FY2025 : Réunion de Lancement',
        'Partenariat Microsoft : Définition de Votre Roadmap',
        'Solutions Microsoft : Atelier de Découverte Personnalisé'
      ],
      friendly: [
        'Rencontrons-nous pour Booster Votre Microsoft Experience!',
        'Nouveau Point de Contact Microsoft : Faisons Connaissance',
        'Découvrons Ensemble Vos Projets Microsoft 2025',
        'Microsoft Solutions : Créons Ensemble Votre Success Story',
        'Votre Succès Microsoft : Planifions Notre Collaboration'
      ],
      urgent: [
        'URGENT: Réunion Microsoft Requise - Disponibilités Demandées',
        'ACTION REQUISE: Planning Microsoft FY2025',
        'PRIORITÉ: Optimisation Immédiate de Vos Solutions Microsoft',
        'IMPORTANT: Nouveau Contact Microsoft - Réunion Nécessaire',
        'URGENT: Définition de Votre Stratégie Microsoft'
      ],
      casual: [
        'Hello! Votre Nouveau Contact Microsoft 😊',
        'Café Virtuel pour Parler Microsoft?',
        'Nouvelle Année, Nouveau Contact Microsoft!',
        'Discutons de Vos Projets Microsoft Autour d\'un Échange',
        'Microsoft 2025: Partageons Nos Idées!'
      ]
    };

    // Context-aware subject generation
    let subjects = [];
    const baseTemplates = subjectTemplates[tone] || subjectTemplates.professional;
    
    // Add context-specific subjects
    if (hasIntroduction) {
      subjects.push(...[
        'Présentation de Votre Nouveau Account Manager Microsoft',
        'Nouveau Contact Microsoft FY2025 : Nicolas BAYONNE',
        'Transfert de Compte Microsoft : Continuité de Service Assurée'
      ]);
    }
    
    if (hasMeeting) {
      subjects.push(...[
        'Proposition de Créneaux : Réunion de Lancement Microsoft',
        'Calendrier Microsoft : Planifions Notre Premier Échange',
        'Disponibilités Demandées : Workshop Microsoft Personnalisé'
      ]);
    }
    
    if (hasPartner) {
      subjects.push(...[
        'Collaboration Tripartite : Microsoft + Vous + Votre Partenaire',
        'Écosystème Microsoft : Renforçons Notre Partenariat',
        'Synergie Partenaire Microsoft : Maximisons Votre ROI'
      ]);
    }

    if (hasFollowUp) {
      subjects.push(...[
        'Suivi Stratégique Microsoft : Vos Retours Attendus',
        'Feedback Microsoft : Optimisons Votre Expérience',
        'Point d\'Étape Microsoft : Actions et Recommandations'
      ]);
    }

    // Combine and randomize
    const allSubjects = [...baseTemplates, ...subjects];
    const uniqueSubjects = [...new Set(allSubjects)];
    
    // Shuffle and select requested count
    const shuffled = uniqueSubjects.sort(() => Math.random() - 0.5);
    const selectedSubjects = shuffled.slice(0, Math.min(count, uniqueSubjects.length));

    // Add dynamic elements based on current date
    const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' });
    const currentYear = new Date().getFullYear();
    
    const enhancedSubjects = selectedSubjects.map(subject => {
      // Add time-sensitive elements occasionally
      if (Math.random() < 0.3) {
        if (subject.includes('FY2025')) {
          return subject;
        } else if (subject.includes('Microsoft') && !subject.includes(currentYear)) {
          return `${subject} - ${currentMonth} ${currentYear}`;
        }
      }
      return subject;
    });

    // Calculate relevance score (simulated)
    const relevanceScore = Math.min(95, 75 + Math.random() * 20);

    return Response.json({
      subjects: enhancedSubjects,
      metadata: {
        tone,
        contentAnalysis: {
          hasIntroduction,
          hasMeeting,
          hasPartner,
          hasUrgent,
          hasFollowUp
        },
        relevanceScore: Math.round(relevanceScore),
        generatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Subject generation error:', error);
    return Response.json(
      { error: 'Subject generation failed', details: error.message },
      { status: 500 }
    );
  }
}