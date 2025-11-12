"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bot, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Mail,
  Building2,
  Target,
  Sparkles,
  ArrowRight,
  Copy,
  Edit3
} from 'lucide-react';

const EnhancedChatInterface = ({ 
  messages, 
  onSendMessage, 
  conversationState,
  emailData,
  isLoading = false 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const getStateProgress = (state) => {
    const states = {
      'initial': { step: 0, label: 'Démarrage', progress: 0 },
      'gathering_info': { step: 1, label: 'Collecte d\'infos', progress: 33 },
      'generating': { step: 2, label: 'Génération', progress: 66 },
      'review': { step: 3, label: 'Révision', progress: 100 }
    };
    return states[state] || states['initial'];
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (message) => {
    return message.content || message;
  };

  const getMessageIcon = (sender) => {
    return sender === 'user' 
      ? <User className="w-6 h-6 text-blue-600" />
      : <Bot className="w-6 h-6 text-green-600" />;
  };

  const progress = getStateProgress(conversationState);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header avec progress */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold text-gray-800">Assistant Email Intelligent</h2>
          </div>
          {conversationState !== 'initial' && (
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Étape {progress.step + 1}/4
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        {conversationState !== 'initial' && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress.progress}%` }}
            ></div>
          </div>
        )}
        
        {conversationState !== 'initial' && (
          <div className="text-xs text-gray-500 mt-1">{progress.label}</div>
        )}
      </div>

      {/* Email Info Card */}
      {(emailData.recipientName || emailData.company) && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 m-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-2">Email en cours</h3>
              <div className="space-y-1 text-sm">
                {emailData.recipientName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">{emailData.recipientName}</span>
                  </div>
                )}
                {emailData.company && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">{emailData.company}</span>
                  </div>
                )}
                {emailData.purpose && (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">{emailData.purpose}</span>
                  </div>
                )}
              </div>
            </div>
            {conversationState === 'review' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  Prévisualiser
                </button>
                <button
                  onClick={() => onSendMessage('✅ Valider l\'email')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Valider
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                {getMessageIcon(message.sender)}
              </div>
            )}
            
            <div
              className={`max-w-lg rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {formatMessage(message)}
              </div>
              
              {/* Message suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(suggestion)}
                      className="block w-full text-left text-xs p-2 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {message.sender === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                {getMessageIcon(message.sender)}
              </div>
            )}
          </div>
        ))}

        {/* Loading Animation */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-green-600" />
            </div>
            <div className="bg-white text-gray-800 border border-gray-200 shadow-sm rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">Nicolas réfléchit...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Email Preview Modal */}
      {showPreview && (emailData.generatedEmail || messages.find(msg => msg.emailContent)) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Aperçu de l'email</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const emailContent = emailData.generatedEmail || messages.find(msg => msg.emailContent)?.emailContent?.content;
                    if (emailContent) navigator.clipboard.writeText(emailContent);
                  }}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  <Copy className="w-4 h-4" />
                  Copier
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl px-2"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              {(() => {
                const emailWithContent = messages.find(msg => msg.emailContent);
                const emailContent = emailData.generatedEmail || emailWithContent?.emailContent;
                
                if (emailContent && typeof emailContent === 'object') {
                  return (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Sujet:</h4>
                        <div className="bg-blue-50 rounded-lg p-3 text-sm">
                          {emailContent.subject}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Contenu:</h4>
                        <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap">
                          {emailContent.content}
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                    {emailContent || 'Aucun contenu d\'email disponible'}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={conversationState === 'initial' 
                ? "Dites-moi quel type d'email vous souhaitez créer..." 
                : "Tapez votre message..."}
              className="w-full p-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="flex-shrink-0 w-11 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quick Actions */}
        {conversationState === 'initial' && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {[
              { text: '🎯 Nouveau prospect', action: 'Je veux contacter un nouveau prospect' },
              { text: '📧 Suivi réunion', action: 'Je veux faire un suivi de réunion' },
              { text: '🔄 Relance', action: 'Je veux relancer un client' }
            ].map((quick, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(quick.action)}
                className="flex-shrink-0 px-3 py-2 text-sm bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full transition-colors"
              >
                {quick.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedChatInterface;