"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, FileText, Clock, Trash2, RefreshCw, 
  User, Building, Mail, CheckCircle, AlertCircle
} from 'lucide-react';
import { toast } from "sonner";

const DraftManager = ({ isOpen, onClose, onRecoverDraft }) => {
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingDraft, setDeletingDraft] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadDrafts();
    }
  }, [isOpen]);

  const loadDrafts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/drafts');
      const result = await response.json();
      
      if (result.success) {
        setDrafts(result.drafts);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des brouillons');
    } finally {
      setIsLoading(false);
    }
  };

  const recoverDraft = async (draftId) => {
    try {
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'recover',
          draftData: { draftId }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Brouillon récupéré !');
        onRecoverDraft(result.draft);
        onClose();
      } else {
        toast.error(result.error || 'Erreur lors de la récupération');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    }
  };

  const deleteDraft = async (draftId) => {
    try {
      setDeletingDraft(draftId);
      
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          draftData: { draftId }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setDrafts(prev => prev.filter(draft => draft.id !== draftId));
        toast.success('Brouillon supprimé');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setDeletingDraft(null);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    
    return date.toLocaleDateString('fr-FR');
  };

  const getStateLabel = (state) => {
    const labels = {
      initial: 'Découverte',
      gathering_info: 'Collecte d\'infos',
      analyzing: 'Analyse',
      generating: 'Génération',
      review: 'Révision',
      ready: 'Prêt'
    };
    return labels[state] || state;
  };

  const getStateColor = (state) => {
    const colors = {
      initial: 'bg-blue-100 text-blue-800',
      gathering_info: 'bg-yellow-100 text-yellow-800',
      analyzing: 'bg-purple-100 text-purple-800',
      generating: 'bg-orange-100 text-orange-800',
      review: 'bg-green-100 text-green-800',
      ready: 'bg-emerald-100 text-emerald-800'
    };
    return colors[state] || 'bg-gray-100 text-gray-800';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Gestionnaire de Brouillons</h2>
              <p className="text-sm text-indigo-100">
                Récupérez vos conversations et emails sauvegardés
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadDrafts}
              disabled={isLoading}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Actualiser"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-indigo-600 animate-spin" />
                <div className="text-sm text-gray-600">Chargement des brouillons...</div>
              </div>
            </div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun brouillon</h3>
              <p className="text-gray-600">
                Vos conversations seront automatiquement sauvegardées ici
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
                        {draft.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(draft.timestamp)}</span>
                        {draft.autoSaved && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                            Auto
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStateColor(draft.conversationState)}`}>
                      {getStateLabel(draft.conversationState)}
                    </span>
                  </div>

                  {/* Draft Info */}
                  <div className="space-y-2 mb-4">
                    {draft.recipientName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-3 h-3" />
                        <span>{draft.recipientName}</span>
                      </div>
                    )}
                    {draft.company && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="w-3 h-3" />
                        <span>{draft.company}</span>
                      </div>
                    )}
                    {draft.hasGeneratedEmail && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        <span>Email généré</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => recoverDraft(draft.id)}
                      className="text-sm px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Récupérer
                    </button>
                    
                    <button
                      onClick={() => deleteDraft(draft.id)}
                      disabled={deletingDraft === draft.id}
                      className="text-sm px-2 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      {deletingDraft === draft.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 rounded-b-xl border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <Save className="w-4 h-4 inline mr-1" />
              {drafts.length} brouillon{drafts.length !== 1 ? 's' : ''} sauvegardé{drafts.length !== 1 ? 's' : ''}
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

export default DraftManager;