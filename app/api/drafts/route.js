export async function POST(request) {
  try {
    const { action, draftData } = await request.json();
    
    switch (action) {
      case 'save':
        return await saveDraft(draftData);
      case 'list':
        return await listDrafts();
      case 'recover':
        return await recoverDraft(draftData.draftId);
      case 'delete':
        return await deleteDraft(draftData.draftId);
      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Drafts API error:', error);
    return Response.json({ 
      error: 'Erreur lors de la gestion des brouillons'
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    return await listDrafts();
  } catch (error) {
    console.error('❌ Get drafts error:', error);
    return Response.json({ error: 'Erreur lors de la récupération des brouillons' }, { status: 500 });
  }
}

async function saveDraft(draftData) {
  const draft = {
    id: draftData.id || `draft_${Date.now()}`,
    timestamp: new Date().toISOString(),
    conversationState: draftData.conversationState,
    emailData: draftData.emailData,
    generatedEmail: draftData.generatedEmail,
    messages: draftData.messages,
    autoSaved: draftData.autoSaved || false,
    title: generateDraftTitle(draftData),
    lastActivity: new Date().toISOString()
  };

  // Store in memory (in production, use database)
  global.emailDrafts = global.emailDrafts || new Map();
  global.emailDrafts.set(draft.id, draft);

  // Auto-cleanup old drafts (keep only 20 most recent)
  const drafts = Array.from(global.emailDrafts.values());
  if (drafts.length > 20) {
    const sortedDrafts = drafts.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    const draftsToKeep = sortedDrafts.slice(0, 20);
    
    global.emailDrafts.clear();
    draftsToKeep.forEach(d => global.emailDrafts.set(d.id, d));
  }

  console.log(`💾 Draft saved: ${draft.id} - ${draft.title}`);

  return Response.json({ 
    success: true, 
    draft: {
      id: draft.id,
      title: draft.title,
      timestamp: draft.timestamp,
      autoSaved: draft.autoSaved
    }
  });
}

async function listDrafts() {
  global.emailDrafts = global.emailDrafts || new Map();
  
  const drafts = Array.from(global.emailDrafts.values())
    .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
    .map(draft => ({
      id: draft.id,
      title: draft.title,
      timestamp: draft.timestamp,
      conversationState: draft.conversationState,
      recipientName: draft.emailData?.recipientName || 'Inconnu',
      company: draft.emailData?.company || '',
      autoSaved: draft.autoSaved,
      lastActivity: draft.lastActivity,
      hasGeneratedEmail: !!draft.generatedEmail
    }));

  return Response.json({ success: true, drafts });
}

async function recoverDraft(draftId) {
  global.emailDrafts = global.emailDrafts || new Map();
  
  const draft = global.emailDrafts.get(draftId);
  
  if (!draft) {
    return Response.json({ error: 'Brouillon introuvable' }, { status: 404 });
  }

  // Update last activity
  draft.lastActivity = new Date().toISOString();
  global.emailDrafts.set(draftId, draft);

  console.log(`🔄 Draft recovered: ${draftId} - ${draft.title}`);

  return Response.json({ 
    success: true, 
    draft: {
      conversationState: draft.conversationState,
      emailData: draft.emailData,
      generatedEmail: draft.generatedEmail,
      messages: draft.messages,
      title: draft.title
    }
  });
}

async function deleteDraft(draftId) {
  global.emailDrafts = global.emailDrafts || new Map();
  
  const draft = global.emailDrafts.get(draftId);
  if (draft) {
    global.emailDrafts.delete(draftId);
    console.log(`🗑️ Draft deleted: ${draftId} - ${draft.title}`);
  }

  return Response.json({ success: true });
}

function generateDraftTitle(draftData) {
  const { emailData, generatedEmail, conversationState } = draftData;
  
  if (generatedEmail?.subject) {
    return generatedEmail.subject;
  }
  
  if (emailData?.recipientName && emailData?.company) {
    return `Email pour ${emailData.recipientName} (${emailData.company})`;
  }
  
  if (emailData?.recipientName) {
    return `Email pour ${emailData.recipientName}`;
  }
  
  if (emailData?.company) {
    return `Email pour ${emailData.company}`;
  }
  
  if (emailData?.purpose) {
    const purposeLabels = {
      prospection: 'Nouveau prospect',
      suivi: 'Suivi client',
      offre_commerciale: 'Proposition commerciale',
      relance: 'Relance client'
    };
    return purposeLabels[emailData.purpose] || 'Email en cours';
  }
  
  const stateLabels = {
    initial: 'Email - Découverte',
    gathering_info: 'Email - Collecte d\'infos',
    analyzing: 'Email - Analyse',
    generating: 'Email - Génération',
    review: 'Email - Révision',
    ready: 'Email - Prêt'
  };
  
  return stateLabels[conversationState] || 'Brouillon email';
}