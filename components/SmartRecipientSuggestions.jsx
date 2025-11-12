"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Mail, Building, Clock, 
  TrendingUp, Star, Filter, Plus
} from 'lucide-react';

const SmartRecipientSuggestions = ({ onSelectRecipient, currentEmailData }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, prospects, clients, follow-ups
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSmartSuggestions();
  }, [currentEmailData?.purpose]);

  const loadSmartSuggestions = async () => {
    try {
      setIsLoading(true);
      
      // Generate smart suggestions based on email purpose and history
      const smartSuggestions = await generateSmartSuggestions(currentEmailData);
      setSuggestions(smartSuggestions);
      
      // Load recent contacts
      const recentContactsData = getRecentContacts();
      setRecentContacts(recentContactsData);
      
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSmartSuggestions = async (emailData) => {
    // Simulate intelligent recipient suggestions
    const baseSuggestions = [
      // Microsoft France contacts
      {
        id: 'microsoft_1',
        name: 'Jean Dubois',
        email: 'jean.dubois@microsoft.com',
        company: 'Microsoft France',
        title: 'Cloud Solutions Architect',
        lastInteraction: '2024-08-20',
        score: 95,
        reason: 'Expert Azure - haute probabilité d\'engagement',
        avatar: '👨‍💼',
        tags: ['azure', 'migration', 'enterprise'],
        interactionCount: 8,
        responseRate: 0.87
      },
      {
        id: 'prospect_1',
        name: 'Marie Martin',
        email: 'marie.martin@techcorp.fr',
        company: 'TechCorp',
        title: 'CTO',
        lastInteraction: '2024-08-15',
        score: 92,
        reason: 'Budget confirmé pour migration cloud Q4',
        avatar: '👩‍💼',
        tags: ['prospect', 'budget-confirmed', 'migration'],
        interactionCount: 3,
        responseRate: 0.93
      },
      {
        id: 'client_1',
        name: 'Pierre Leroy',
        email: 'p.leroy@startup-tech.com',
        company: 'StartupTech',
        title: 'CEO',
        lastInteraction: '2024-08-18',
        score: 89,
        reason: 'Client actuel - opportunité d\'expansion',
        avatar: '🚀',
        tags: ['client', 'startup', 'scaling'],
        interactionCount: 12,
        responseRate: 0.75
      },
      {
        id: 'prospect_2',
        name: 'Sophie Moreau',
        email: 'sophie.moreau@fintech-solutions.fr',
        company: 'FinTech Solutions',
        title: 'IT Director',
        lastInteraction: '2024-08-10',
        score: 88,
        reason: 'Secteur fintech - besoins sécurité Azure',
        avatar: '🏦',
        tags: ['fintech', 'security', 'compliance'],
        interactionCount: 2,
        responseRate: 0.85
      },
      {
        id: 'followup_1',
        name: 'Marc Durand',
        email: 'marc.durand@manufacturing-corp.fr',
        company: 'Manufacturing Corp',
        title: 'Infrastructure Manager',
        lastInteraction: '2024-07-28',
        score: 85,
        reason: 'Relance nécessaire - 2 semaines sans réponse',
        avatar: '🏭',
        tags: ['manufacturing', 'infrastructure', 'follow-up-needed'],
        interactionCount: 5,
        responseRate: 0.60
      }
    ];

    // Filter and sort based on email purpose
    let filteredSuggestions = [...baseSuggestions];
    
    if (emailData?.purpose === 'prospection') {
      filteredSuggestions = filteredSuggestions
        .filter(s => s.tags.includes('prospect') || s.score >= 90)
        .sort((a, b) => b.score - a.score);
    } else if (emailData?.purpose === 'suivi') {
      filteredSuggestions = filteredSuggestions
        .filter(s => s.interactionCount > 0)
        .sort((a, b) => new Date(b.lastInteraction) - new Date(a.lastInteraction));
    } else if (emailData?.purpose === 'relance') {
      filteredSuggestions = filteredSuggestions
        .filter(s => s.tags.includes('follow-up-needed') || s.responseRate < 0.7)
        .sort((a, b) => new Date(a.lastInteraction) - new Date(b.lastInteraction));
    } else if (emailData?.purpose === 'offre_commerciale') {
      filteredSuggestions = filteredSuggestions
        .filter(s => s.tags.includes('budget-confirmed') || s.tags.includes('client'))
        .sort((a, b) => b.score - a.score);
    }

    return filteredSuggestions;
  };

  const getRecentContacts = () => {
    // Simulate recent contacts from analytics/history
    return [
      {
        id: 'recent_1',
        name: 'Alain Bertrand',
        email: 'alain.bertrand@enterprise-solutions.fr',
        company: 'Enterprise Solutions',
        lastEmail: '2024-08-22',
        subject: 'Migration Azure - Suivi technique',
        avatar: '📧'
      },
      {
        id: 'recent_2',
        name: 'Claire Dubois',
        email: 'claire.dubois@innovation-hub.fr',
        company: 'Innovation Hub',
        lastEmail: '2024-08-21',
        subject: 'Présentation Microsoft 365',
        avatar: '💡'
      }
    ];
  };

  const handleSelectRecipient = (recipient) => {
    onSelectRecipient({
      recipientName: recipient.name,
      recipient: recipient.email,
      company: recipient.company,
      recipientTitle: recipient.title,
      recipientAvatar: recipient.avatar,
      interactionHistory: {
        lastInteraction: recipient.lastInteraction,
        interactionCount: recipient.interactionCount,
        responseRate: recipient.responseRate,
        tags: recipient.tags
      }
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getFilteredSuggestions = () => {
    let filtered = suggestions;
    
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(s => {
        switch (filterType) {
          case 'prospects': return s.tags.includes('prospect');
          case 'clients': return s.tags.includes('client');
          case 'follow-ups': return s.tags.includes('follow-up-needed');
          default: return true;
        }
      });
    }
    
    return filtered;
  };

  const formatLastInteraction = (date) => {
    const now = new Date();
    const interactionDate = new Date(date);
    const diffTime = Math.abs(now - interactionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'hier';
    if (diffDays < 7) return `il y a ${diffDays} jours`;
    if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
    return `il y a ${Math.floor(diffDays / 30)} mois`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Suggestions Intelligentes</h3>
        </div>
        <div className="text-xs text-gray-500">
          {currentEmailData?.purpose && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {currentEmailData.purpose}
            </span>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="all">Tous</option>
          <option value="prospects">Prospects</option>
          <option value="clients">Clients</option>
          <option value="follow-ups">À relancer</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="text-sm text-gray-600">Analyse des meilleurs contacts...</div>
        </div>
      ) : (
        <div className="space-y-3">
          {getFilteredSuggestions().map((recipient) => (
            <button
              key={recipient.id}
              onClick={() => handleSelectRecipient(recipient)}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl">{recipient.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">{recipient.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getScoreColor(recipient.score)}`}>
                        {recipient.score}% match
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">{recipient.title}</span> chez {recipient.company}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">{recipient.email}</div>
                    <div className="text-xs text-blue-600 mb-2">💡 {recipient.reason}</div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatLastInteraction(recipient.lastInteraction)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {recipient.interactionCount} emails
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {Math.round(recipient.responseRate * 100)}% réponses
                      </span>
                    </div>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-blue-600 flex-shrink-0" />
              </div>
            </button>
          ))}
          
          {getFilteredSuggestions().length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">Aucun contact trouvé</div>
            </div>
          )}
        </div>
      )}

      {/* Recent Contacts */}
      {recentContacts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Contacts récents</h4>
          <div className="space-y-2">
            {recentContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectRecipient(contact)}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="text-lg">{contact.avatar}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-800">{contact.name}</div>
                    <div className="text-xs text-gray-500">{contact.subject}</div>
                  </div>
                  <div className="text-xs text-gray-400">{formatLastInteraction(contact.lastEmail)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartRecipientSuggestions;