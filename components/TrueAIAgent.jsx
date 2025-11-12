'use client';

// PERFORMANCE FIX: Added React.memo for component memoization
import { useState, useCallback, useMemo, memo } from 'react';
import { Brain, User, MessageCircle, TrendingUp, Target, Lightbulb, Database, ThumbsUp, ThumbsDown, Star, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// PERFORMANCE FIX: Component definition without memo wrapper (applied at export)
function TrueAIAgent() {
  const [context, setContext] = useState('');
  const [clientProfile, setClientProfile] = useState({
    company: '',
    segment: 'sme',
    industry: '',
    size: '',
    currentChallenges: ''
  });
  const [intent, setIntent] = useState('');
  const [previousInteractions, setPreviousInteractions] = useState([]);
  const [persistentHistory, setPersistentHistory] = useState([]);
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentClientId, setCurrentClientId] = useState(null);
  const [currentInteractionId, setCurrentInteractionId] = useState(null);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    qualityRating: null,
    relevanceRating: null,
    toneRating: null,
    feedbackText: '',
    suggestedImprovement: ''
  });

  // PERFORMANCE FIX: Added loadClientHistory to dependencies to prevent stale closure
  const generateIntelligentEmail = useCallback(async () => {
    if (!context.trim() || !intent.trim()) {
      toast.error("Veuillez remplir le contexte et l'intention");
      return;
    }

    setIsGenerating(true);
    toast.loading("L'AI Agent analyse et génère...");

    try {
      const response = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          intent,
          clientProfile,
          previousInteractions
        })
      });

      if (!response.ok) throw new Error('AI Agent failed');

      const result = await response.json();

      setGeneratedEmail(result);
      setCurrentClientId(result.clientId);
      setCurrentInteractionId(result.interactionId);
      setFeedbackMode(false);

      // Message avec info KB enrichment
      const kbInfo = result.kbEnrichment ? ` | KB: ${result.kbEnrichment.solutionsFound} solutions (${result.kbEnrichment.quality}%)` : '';
      toast.success(`Email généré avec ${Math.round(result.confidence * 100)}% de confiance ! (Historique: ${result.historyUsed || 0} interactions${kbInfo})`);

      // Recharger l'historique après génération
      if (result.clientId && clientProfile.company) {
        loadClientHistory(result.clientId);
      }

    } catch (error) {
      console.error('AI Agent error:', error);
      toast.error('Erreur de génération AI');
    } finally {
      setIsGenerating(false);
    }
  }, [context, intent, clientProfile, previousInteractions, loadClientHistory]);

  const loadClientHistory = useCallback(async (clientId) => {
    if (!clientId) return;
    
    setIsLoadingHistory(true);
    try {
      const response = await fetch(`/api/interactions?clientId=${clientId}&limit=10`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPersistentHistory(result.data.interactions || []);
          toast.success(`Historique chargé: ${result.data.interactions?.length || 0} interactions`);
        }
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const submitFeedback = useCallback(async () => {
    if (!currentInteractionId) {
      toast.error('Aucun email à évaluer');
      return;
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interactionId: currentInteractionId,
          ...feedbackData,
          feedbackType: feedbackData.qualityRating < 3 ? 'negative' : 'positive'
        })
      });

      if (response.ok) {
        toast.success('Feedback enregistré ! L\'IA va apprendre de vos retours.');
        setFeedbackMode(false);
        setFeedbackData({
          qualityRating: null,
          relevanceRating: null,
          toneRating: null,
          feedbackText: '',
          suggestedImprovement: ''
        });
      } else {
        throw new Error('Erreur lors de l\'enregistrement du feedback');
      }
    } catch (error) {
      console.error('Erreur feedback:', error);
      toast.error('Erreur lors de l\'enregistrement du feedback');
    }
  }, [currentInteractionId, feedbackData]);

  const quickFeedback = useCallback(async (type) => {
    if (!currentInteractionId) {
      toast.error('Aucun email à évaluer');
      return;
    }

    const feedbackMap = {
      positive: { qualityRating: 5, relevanceRating: 5, toneRating: 5, feedbackType: 'positive' },
      negative: { qualityRating: 2, relevanceRating: 2, toneRating: 2, feedbackType: 'negative' }
    };

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interactionId: currentInteractionId,
          ...feedbackMap[type],
          feedbackText: `Feedback rapide: ${type}`
        })
      });

      if (response.ok) {
        toast.success(`Feedback ${type} enregistré !`);
      }
    } catch (error) {
      console.error('Erreur quick feedback:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  }, [currentInteractionId]);

  const addPreviousInteraction = () => {
    const newInteraction = {
      date: new Date().toISOString(),
      type: 'email',
      response: 'pending',
      sentiment: 'neutral'
    };
    setPreviousInteractions(prev => [...prev, newInteraction]);
    toast.success("Interaction ajoutée à l'historique");
  };

  // PERFORMANCE FIX: Memoize computed values to avoid recalculation on every render
  const totalInteractionsCount = useMemo(() => {
    return previousInteractions.length + persistentHistory.length;
  }, [previousInteractions.length, persistentHistory.length]);

  const hasAnyHistory = useMemo(() => {
    return previousInteractions.length > 0 || persistentHistory.length > 0;
  }, [previousInteractions.length, persistentHistory.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Vrai AI Agent Email Generator
            </h1>
          </div>
          <p className="text-gray-600 mb-4">
            Intelligence artificielle contextuelle qui s'adapte selon le profil client et l'historique
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              ← Template Generator
            </Link>
            <Link 
              href="/clients"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              <Database className="w-4 h-4" />
              Gestion Clients
            </Link>
            <Link 
              href="/analytics"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Panneau de Configuration AI */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profil Client */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Profil Client</h3>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom de l'entreprise"
                  value={clientProfile.company}
                  onChange={(e) => setClientProfile(prev => ({...prev, company: e.target.value}))}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                
                <select
                  value={clientProfile.segment}
                  onChange={(e) => setClientProfile(prev => ({...prev, segment: e.target.value}))}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="enterprise">Enterprise (1000+ employés)</option>
                  <option value="sme">PME (50-1000 employés)</option>
                  <option value="startup">Startup (moins de 50 employés)</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Secteur d'activité"
                  value={clientProfile.industry}
                  onChange={(e) => setClientProfile(prev => ({...prev, industry: e.target.value}))}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                
                <textarea
                  placeholder="Défis actuels identifiés..."
                  value={clientProfile.currentChallenges}
                  onChange={(e) => setClientProfile(prev => ({...prev, currentChallenges: e.target.value}))}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                />
              </div>
            </div>

            {/* Historique Interactions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">Historique</h3>
                {isLoadingHistory && (
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              
              <div className="space-y-3">
                {/* Historique persistant de la DB */}
                {persistentHistory.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-green-700 mb-2">
                      🗄️ Historique persistant ({persistentHistory.length})
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {persistentHistory.map((interaction, index) => (
                        <div key={index} className="text-xs bg-green-50 border-l-2 border-green-300 p-2 rounded">
                          <div className="font-medium">{interaction.type} - {interaction.status}</div>
                          {interaction.subject && (
                            <div className="text-gray-600 truncate">{interaction.subject}</div>
                          )}
                          <div className="text-gray-500">
                            {new Date(interaction.createdAt).toLocaleDateString()} 
                            {interaction.daysSince !== undefined && ` (${interaction.daysSince}j)`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Historique local/temporaire */}
                {previousInteractions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-blue-700 mb-2">
                      📝 Session actuelle ({previousInteractions.length})
                    </h4>
                    <div className="space-y-1">
                      {previousInteractions.map((interaction, index) => (
                        <div key={index} className="text-xs bg-blue-50 p-2 rounded">
                          {interaction.type} - {interaction.sentiment}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message si aucun historique */}
                {previousInteractions.length === 0 && persistentHistory.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    Aucune interaction précédente
                    {clientProfile.company && (
                      <span className="block text-xs mt-1">
                        L'historique sera créé automatiquement pour {clientProfile.company}
                      </span>
                    )}
                  </p>
                )}
                
                {/* Actions */}
                <div className="border-t pt-3 space-y-2">
                  <button
                    onClick={addPreviousInteraction}
                    className="w-full text-xs bg-gray-100 hover:bg-gray-200 p-2 rounded transition-colors"
                  >
                    + Ajouter interaction de session
                  </button>
                  
                  {currentClientId && (
                    <button
                      onClick={() => loadClientHistory(currentClientId)}
                      disabled={isLoadingHistory}
                      className="w-full text-xs bg-green-100 hover:bg-green-200 p-2 rounded transition-colors disabled:opacity-50"
                    >
                      🔄 Recharger historique DB
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Panneau Principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Input Zone */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Contexte & Intention</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contexte Business (Ce qui se passe actuellement)
                  </label>
                  <textarea
                    placeholder="Ex: Le client a mentionné des problèmes de performance avec son infrastructure actuelle, ils évaluent une migration Azure mais ont des préoccupations sur les coûts..."
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intention de l'Email (Ce que tu veux accomplir)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Rassurer sur les coûts et proposer un POC gratuit pour démontrer la valeur"
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <button
                  onClick={generateIntelligentEmail}
                  disabled={isGenerating || !context.trim() || !intent.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      AI Agent en action...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Générer avec Intelligence Contextuelle
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Résultats AI */}
            {generatedEmail && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Email Généré par AI Agent</h3>
                  <div className="ml-auto bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Confiance: {Math.round(generatedEmail.confidence * 100)}%
                  </div>
                </div>
                
                {/* Email Content */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {generatedEmail.generatedContent}
                  </pre>
                </div>
                
                {/* AI Reasoning */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Raisonnement AI</span>
                  </div>
                  <p className="text-sm text-blue-700">{generatedEmail.reasoning}</p>
                </div>

                {/* Knowledge Base Enrichment */}
                {generatedEmail.kbEnrichment && generatedEmail.kbEnrichment.solutionsFound > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 mb-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-800">
                        Enrichissement Knowledge Base Microsoft
                      </span>
                      <div className="ml-auto bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        Qualité: {generatedEmail.kbEnrichment.quality}%
                      </div>
                    </div>

                    <div className="space-y-2">
                      {/* Solutions Microsoft utilisées */}
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-purple-700 min-w-[120px]">Solutions détectées:</span>
                        <div className="flex flex-wrap gap-1">
                          {generatedEmail.kbEnrichment.solutionNames.map((name, idx) => (
                            <span key={idx} className="bg-white text-purple-700 px-2 py-0.5 rounded text-xs border border-purple-200">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Industry Insights */}
                      {generatedEmail.kbEnrichment.industryInsights && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-purple-700 min-w-[120px]">Industrie:</span>
                          <span className="text-xs text-purple-600 bg-white px-2 py-0.5 rounded border border-purple-200">
                            {generatedEmail.kbEnrichment.industryInsights}
                          </span>
                        </div>
                      )}

                      {/* Business Value Points */}
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-purple-700 min-w-[120px]">Points de valeur:</span>
                        <span className="text-xs text-purple-600">
                          {generatedEmail.kbEnrichment.businessValuePoints} bénéfices métier identifiés
                        </span>
                      </div>

                      {/* Data Sources */}
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-purple-700 min-w-[120px]">Sources:</span>
                        <span className="text-xs text-purple-600">
                          {generatedEmail.kbEnrichment.dataSourcesUsed.join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <p className="text-xs text-purple-600 italic">
                        ✨ Cette réponse a été enrichie avec des informations précises et factuelles de la Knowledge Base Microsoft pour une pertinence maximale.
                      </p>
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Suggestions de suivi</span>
                  </div>
                  <div className="space-y-1">
                    {generatedEmail.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-sm text-yellow-700">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Feedback et Apprentissage */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Feedback & Apprentissage IA</span>
                  </div>
                  
                  {!feedbackMode ? (
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-purple-700 mb-2">
                        Aidez l'IA à apprendre en évaluant cet email :
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => quickFeedback('positive')}
                          className="flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs rounded-full transition-colors"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          Bon
                        </button>
                        <button
                          onClick={() => quickFeedback('negative')}
                          className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded-full transition-colors"
                        >
                          <ThumbsDown className="w-3 h-3" />
                          À améliorer
                        </button>
                        <button
                          onClick={() => setFeedbackMode(true)}
                          className="flex items-center gap-1 px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs rounded-full transition-colors"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Détaillé
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Évaluations par étoiles */}
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-purple-700 mb-1">Qualité</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-4 h-4 cursor-pointer ${
                                  feedbackData.qualityRating >= star 
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-300'
                                }`}
                                onClick={() => setFeedbackData(prev => ({...prev, qualityRating: star}))}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-purple-700 mb-1">Pertinence</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-4 h-4 cursor-pointer ${
                                  feedbackData.relevanceRating >= star 
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-300'
                                }`}
                                onClick={() => setFeedbackData(prev => ({...prev, relevanceRating: star}))}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-purple-700 mb-1">Ton</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-4 h-4 cursor-pointer ${
                                  feedbackData.toneRating >= star 
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-300'
                                }`}
                                onClick={() => setFeedbackData(prev => ({...prev, toneRating: star}))}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Commentaire libre */}
                      <div>
                        <label className="block text-xs text-purple-700 mb-1">Commentaire (optionnel)</label>
                        <textarea
                          value={feedbackData.feedbackText}
                          onChange={(e) => setFeedbackData(prev => ({...prev, feedbackText: e.target.value}))}
                          placeholder="Vos commentaires sur cet email..."
                          className="w-full p-2 border border-purple-200 rounded text-xs resize-none h-16"
                        />
                      </div>
                      
                      {/* Suggestion d'amélioration */}
                      <div>
                        <label className="block text-xs text-purple-700 mb-1">Suggestion d'amélioration</label>
                        <textarea
                          value={feedbackData.suggestedImprovement}
                          onChange={(e) => setFeedbackData(prev => ({...prev, suggestedImprovement: e.target.value}))}
                          placeholder="Comment améliorer cet email ? (aide l'IA à apprendre)"
                          className="w-full p-2 border border-purple-200 rounded text-xs resize-none h-16"
                        />
                      </div>
                      
                      {/* Boutons d'action */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={submitFeedback}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
                        >
                          Enregistrer Feedback
                        </button>
                        <button
                          onClick={() => setFeedbackMode(false)}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// PERFORMANCE FIX: Export with React.memo to prevent unnecessary re-renders
export default memo(TrueAIAgent);