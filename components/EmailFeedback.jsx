"use client";

import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Send, TrendingUp } from 'lucide-react';
import { toast } from "sonner";

const EmailFeedback = ({ emailId, tone, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [effectiveness, setEffectiveness] = useState(0);
  const [comments, setComments] = useState('');
  const [wouldUseAgain, setWouldUseAgain] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const submitFeedback = async () => {
    if (rating === 0) {
      toast.error('Veuillez donner une note avant de soumettre');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_feedback',
          data: {
            emailId,
            tone,
            rating,
            effectiveness: effectiveness || rating,
            comments,
            would_use_again: wouldUseAgain
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Merci pour votre retour ! 🙏');
        setShowForm(false);
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted(result.feedback);
        }
      } else {
        toast.error('Erreur lors de l\'envoi du feedback');
      }

    } catch (error) {
      console.error('Feedback error:', error);
      toast.error('Erreur lors de l\'envoi du feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, label }) => (
    <div className="flex flex-col items-center space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
      <div className="text-xs text-gray-500">
        {value === 0 && 'Pas de note'}
        {value === 1 && 'Très mauvais'}
        {value === 2 && 'Mauvais'}
        {value === 3 && 'Moyen'}
        {value === 4 && 'Bon'}
        {value === 5 && 'Excellent'}
      </div>
    </div>
  );

  if (!showForm) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900">Comment trouvez-vous cet email ?</h3>
              <p className="text-sm text-gray-600">Votre feedback nous aide à améliorer l'IA</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Star className="w-4 h-4" />
            <span>Evaluer</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Feedback sur l'Email</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <StarRating
          value={rating}
          onChange={setRating}
          label="Note globale"
        />
        <StarRating
          value={effectiveness}
          onChange={setEffectiveness}
          label="Efficacité commerciale"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Utiliseriez-vous à nouveau ce type d'email ?
        </label>
        <div className="flex space-x-4">
          <button
            onClick={() => setWouldUseAgain(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              wouldUseAgain === true
                ? 'bg-green-100 text-green-800 border-green-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } border`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Oui</span>
          </button>
          <button
            onClick={() => setWouldUseAgain(false)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              wouldUseAgain === false
                ? 'bg-red-100 text-red-800 border-red-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } border`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>Non</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Commentaires (optionnel)
        </label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Qu'avez-vous pensé de cet email ? Suggestions d'amélioration ?"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20"
        />
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          Annuler
        </button>
        
        <button
          onClick={submitFeedback}
          disabled={isSubmitting || rating === 0}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Envoi...' : 'Envoyer feedback'}</span>
        </button>
      </div>
    </div>
  );
};

export default EmailFeedback;