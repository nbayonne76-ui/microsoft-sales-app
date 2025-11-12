"use client";

import React, { useState, useEffect } from 'react';
import { 
  GitBranch, Calendar, Clock, Mail, Play, Pause, 
  Settings, Target, TrendingUp, CheckCircle, AlertCircle,
  Plus, Edit, Trash2, Users, Zap
} from 'lucide-react';
import { toast } from "sonner";

const AutoFollowUpManager = ({ isOpen, onClose, initialRecipient }) => {
  const [sequences, setSequences] = useState([]);
  const [activeSequences, setActiveSequences] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newSequence, setNewSequence] = useState({
    name: '',
    recipient: initialRecipient || '',
    triggerType: 'no_response', // no_response, time_based, engagement_based
    steps: []
  });

  const sequenceTemplates = {
    'cold_outreach': {
      name: 'Prospection à froid',
      description: 'Séquence pour nouveaux prospects',
      steps: [
        {
          delay: 0,
          type: 'initial',
          subject: 'Opportunité Azure pour {{company}}',
          content: 'Bonjour {{name}},\n\nJ\'ai identifié des opportunités d\'optimisation Azure pour {{company}}...',
          trigger: 'immediate'
        },
        {
          delay: 3,
          type: 'follow_up',
          subject: 'Re: Azure - Avez-vous eu l\'occasion de voir mon message?',
          content: 'Bonjour {{name}},\n\nJe reviens vers vous concernant les opportunités Azure...',
          trigger: 'no_response'
        },
        {
          delay: 7,
          type: 'value_add',
          subject: 'ROI Calculator Azure - {{company}}',
          content: 'Bonjour {{name}},\n\nJ\'ai préparé une analyse ROI personnalisée pour {{company}}...',
          trigger: 'no_response'
        },
        {
          delay: 14,
          type: 'final',
          subject: 'Dernière opportunité - Migration Azure',
          content: 'Bonjour {{name}},\n\nAvant de fermer ce dossier, je voulais vous proposer...',
          trigger: 'no_response'
        }
      ]
    },
    'meeting_followup': {
      name: 'Suivi après réunion',
      description: 'Séquence de suivi post-meeting',
      steps: [
        {
          delay: 0,
          type: 'thank_you',
          subject: 'Merci pour notre échange - Prochaines étapes',
          content: 'Bonjour {{name}},\n\nMerci pour le temps accordé aujourd\'hui...',
          trigger: 'immediate'
        },
        {
          delay: 2,
          type: 'follow_up',
          subject: 'Documents promis - {{company}}',
          content: 'Bonjour {{name}},\n\nComme convenu, voici les documents...',
          trigger: 'time_based'
        },
        {
          delay: 7,
          type: 'check_in',
          subject: 'Feedback sur la proposition Azure',
          content: 'Bonjour {{name}},\n\nAvez-vous eu l\'occasion d\'examiner...',
          trigger: 'no_response'
        }
      ]
    },
    'proposal_followup': {
      name: 'Suivi proposition commerciale',
      description: 'Séquence après envoi de devis',
      steps: [
        {
          delay: 1,
          type: 'confirmation',
          subject: 'Confirmation réception - Proposition Azure',
          content: 'Bonjour {{name}},\n\nJ\'espère que vous avez bien reçu notre proposition...',
          trigger: 'time_based'
        },
        {
          delay: 5,
          type: 'follow_up',
          subject: 'Questions sur la proposition Azure?',
          content: 'Bonjour {{name}},\n\nAvez-vous des questions sur notre proposition...',
          trigger: 'no_response'
        },
        {
          delay: 10,
          type: 'urgency',
          subject: 'Offre limitée - Décision attendue',
          content: 'Bonjour {{name}},\n\nNotre offre promotionnelle expire bientôt...',
          trigger: 'no_response'
        }
      ]
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadActiveSequences();
    }
  }, [isOpen]);

  const loadActiveSequences = async () => {
    try {
      // Simulate loading active sequences
      const mockActiveSequences = [
        {
          id: 'seq_1',
          name: 'Prospection TechCorp',
          recipient: 'marie.martin@techcorp.fr',
          recipientName: 'Marie Martin',
          company: 'TechCorp',
          template: 'cold_outreach',
          currentStep: 2,
          totalSteps: 4,
          status: 'active',
          nextAction: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          stats: { sent: 2, opened: 1, replied: 0 }
        },
        {
          id: 'seq_2',
          name: 'Suivi Manufacturing Corp',
          recipient: 'marc.durand@manufacturing-corp.fr',
          recipientName: 'Marc Durand',
          company: 'Manufacturing Corp',
          template: 'proposal_followup',
          currentStep: 3,
          totalSteps: 3,
          status: 'waiting_response',
          nextAction: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          stats: { sent: 3, opened: 2, replied: 0 }
        }
      ];
      
      setActiveSequences(mockActiveSequences);
    } catch (error) {
      toast.error('Erreur lors du chargement des séquences');
    }
  };

  const createSequence = async () => {
    try {
      if (!newSequence.name || !newSequence.recipient || !selectedTemplate) {
        toast.error('Veuillez remplir tous les champs');
        return;
      }

      const template = sequenceTemplates[selectedTemplate];
      const sequence = {
        id: `seq_${Date.now()}`,
        name: newSequence.name,
        recipient: newSequence.recipient,
        template: selectedTemplate,
        steps: template.steps,
        status: 'active',
        currentStep: 0,
        totalSteps: template.steps.length,
        createdAt: new Date(),
        nextAction: new Date(),
        stats: { sent: 0, opened: 0, replied: 0 }
      };

      // In production, save to API
      setActiveSequences(prev => [...prev, sequence]);
      
      // Reset form
      setNewSequence({ name: '', recipient: initialRecipient || '', triggerType: 'no_response', steps: [] });
      setSelectedTemplate('');
      setIsCreating(false);
      
      toast.success('Séquence créée et activée !');
    } catch (error) {
      toast.error('Erreur lors de la création de la séquence');
    }
  };

  const pauseSequence = async (sequenceId) => {
    try {
      setActiveSequences(prev => 
        prev.map(seq => 
          seq.id === sequenceId 
            ? { ...seq, status: seq.status === 'paused' ? 'active' : 'paused' }
            : seq
        )
      );
      toast.success('Séquence mise en pause');
    } catch (error) {
      toast.error('Erreur lors de la mise en pause');
    }
  };

  const deleteSequence = async (sequenceId) => {
    try {
      setActiveSequences(prev => prev.filter(seq => seq.id !== sequenceId));
      toast.success('Séquence supprimée');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'waiting_response': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'waiting_response': return <Clock className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const formatNextAction = (date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `dans ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `dans ${hours}h`;
    return 'bientôt';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <GitBranch className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Séquences Automatisées</h2>
              <p className="text-sm text-purple-100">
                Automatisez vos suivis et relances intelligemment
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreating(true)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Nouvelle séquence
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isCreating ? (
            /* Create New Sequence Form */
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Créer une nouvelle séquence</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de la séquence
                    </label>
                    <input
                      type="text"
                      value={newSequence.name}
                      onChange={(e) => setNewSequence(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Prospection Azure - Q4 2024"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destinataire (email)
                    </label>
                    <input
                      type="email"
                      value={newSequence.recipient}
                      onChange={(e) => setNewSequence(prev => ({ ...prev, recipient: e.target.value }))}
                      placeholder="contact@entreprise.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template de séquence
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(sequenceTemplates).map(([key, template]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedTemplate(key)}
                          className={`text-left p-4 rounded-lg border-2 transition-all ${
                            selectedTemplate === key
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium text-gray-800 mb-1">{template.name}</div>
                          <div className="text-sm text-gray-600 mb-2">{template.description}</div>
                          <div className="text-xs text-gray-500">
                            {template.steps.length} étapes • Durée: {Math.max(...template.steps.map(s => s.delay))} jours
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={createSequence}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Créer et activer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Active Sequences List */
            <>
              {activeSequences.length === 0 ? (
                <div className="text-center py-12">
                  <GitBranch className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Aucune séquence active</h3>
                  <p className="text-gray-600 mb-6">
                    Créez votre première séquence automatisée pour optimiser vos suivis
                  </p>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Créer ma première séquence
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeSequences.map((sequence) => (
                    <div key={sequence.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-800">{sequence.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(sequence.status)}`}>
                              {getStatusIcon(sequence.status)}
                              {sequence.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            👤 {sequence.recipientName || sequence.recipient}
                          </div>
                          <div className="text-xs text-gray-500">
                            🏢 {sequence.company || 'Entreprise non spécifiée'}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => pauseSequence(sequence.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                            title={sequence.status === 'paused' ? 'Reprendre' : 'Mettre en pause'}
                          >
                            {sequence.status === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => deleteSequence(sequence.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progression</span>
                          <span className="font-medium">{sequence.currentStep}/{sequence.totalSteps}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(sequence.currentStep / sequence.totalSteps) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-gray-800">{sequence.stats.sent}</div>
                          <div className="text-xs text-gray-500">Envoyés</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-800">{sequence.stats.opened}</div>
                          <div className="text-xs text-gray-500">Ouverts</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-800">{sequence.stats.replied}</div>
                          <div className="text-xs text-gray-500">Réponses</div>
                        </div>
                      </div>

                      {/* Next Action */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Prochaine action:</span>
                          <span className="font-medium text-gray-800">
                            {formatNextAction(sequence.nextAction)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 rounded-b-xl border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <GitBranch className="w-4 h-4" />
                {activeSequences.length} séquence{activeSequences.length !== 1 ? 's' : ''} active{activeSequences.length !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {activeSequences.reduce((sum, seq) => sum + seq.stats.opened, 0)} ouvertures totales
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoFollowUpManager;