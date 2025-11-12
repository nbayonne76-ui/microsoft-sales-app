"use client";

import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Building2,
  Mail,
  Target,
  Edit3,
  Send,
  Sparkles
} from 'lucide-react';

const ConversationStatusCard = ({ 
  conversationState, 
  emailData, 
  onAction 
}) => {
  const getStatusInfo = (state) => {
    const statusMap = {
      'initial': {
        title: 'Prêt à démarrer',
        description: 'Choisissez le type d\'email à créer',
        icon: <Sparkles className="w-5 h-5" />,
        color: 'blue',
        progress: 0
      },
      'gathering_info': {
        title: 'Collecte d\'informations',
        description: 'Donnez-moi les détails du contact',
        icon: <Clock className="w-5 h-5 animate-pulse" />,
        color: 'orange',
        progress: 33
      },
      'generating': {
        title: 'Génération en cours',
        description: 'Création de votre email personnalisé',
        icon: <Clock className="w-5 h-5 animate-spin" />,
        color: 'purple',
        progress: 66
      },
      'review': {
        title: 'Email créé !',
        description: 'Vérifiez et validez votre email',
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'green',
        progress: 100
      }
    };
    
    return statusMap[state] || statusMap['initial'];
  };

  const status = getStatusInfo(conversationState);
  
  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-600',
        progress: 'bg-blue-500'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-800',
        icon: 'text-orange-600',
        progress: 'bg-orange-500'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-800',
        icon: 'text-purple-600',
        progress: 'bg-purple-500'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: 'text-green-600',
        progress: 'bg-green-500'
      }
    };
    return colors[color];
  };

  const colorClasses = getColorClasses(status.color);
  
  const getCompletionSteps = () => {
    const steps = [
      { 
        key: 'recipientName', 
        label: 'Nom du contact', 
        icon: User, 
        completed: !!emailData.recipientName,
        value: emailData.recipientName 
      },
      { 
        key: 'company', 
        label: 'Entreprise', 
        icon: Building2, 
        completed: !!emailData.company,
        value: emailData.company 
      },
      { 
        key: 'recipient', 
        label: 'Email', 
        icon: Mail, 
        completed: !!emailData.recipient,
        value: emailData.recipient,
        optional: true 
      },
      { 
        key: 'purpose', 
        label: 'Type d\'email', 
        icon: Target, 
        completed: !!emailData.purpose,
        value: emailData.purpose 
      }
    ];
    
    return steps;
  };

  const steps = getCompletionSteps();
  const completedSteps = steps.filter(step => step.completed).length;
  const totalRequiredSteps = steps.filter(step => !step.optional).length;

  if (conversationState === 'initial') {
    return (
      <div className={`${colorClasses.bg} ${colorClasses.border} border rounded-lg p-4 mb-4`}>
        <div className="flex items-center gap-3">
          <div className={colorClasses.icon}>
            {status.icon}
          </div>
          <div>
            <h3 className={`font-medium ${colorClasses.text}`}>{status.title}</h3>
            <p className={`text-sm ${colorClasses.text} opacity-80`}>{status.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${colorClasses.bg} ${colorClasses.border} border rounded-lg p-4 mb-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={colorClasses.icon}>
            {status.icon}
          </div>
          <div>
            <h3 className={`font-medium ${colorClasses.text}`}>{status.title}</h3>
            <p className={`text-sm ${colorClasses.text} opacity-80`}>{status.description}</p>
          </div>
        </div>
        
        {conversationState === 'gathering_info' && (
          <div className={`text-sm ${colorClasses.text} font-medium`}>
            {completedSteps}/{totalRequiredSteps}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${colorClasses.progress} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${status.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Simple progress for gathering_info - less intrusive */}
      {conversationState === 'gathering_info' && completedSteps > 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-600">
            Informations collectées: {completedSteps}/{totalRequiredSteps}
          </div>
        </div>
      )}

      {/* Email Summary pour review */}
      {conversationState === 'review' && emailData.recipientName && (
        <div className="bg-white/70 rounded-lg p-3 space-y-2">
          <h4 className={`text-sm font-medium ${colorClasses.text} mb-2`}>Résumé de l'email</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Pour: {emailData.recipientName}</span>
            </div>
            {emailData.company && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">Entreprise: {emailData.company}</span>
              </div>
            )}
            {emailData.recipient && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 truncate">{emailData.recipient}</span>
              </div>
            )}
            {emailData.purpose && (
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{emailData.purpose}</span>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-200">
            <button
              onClick={() => onAction('preview')}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Prévisualiser
            </button>
            <button
              onClick={() => onAction('send')}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              <Send className="w-4 h-4" />
              Valider
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationStatusCard;