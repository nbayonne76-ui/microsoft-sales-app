"use client";

import React from 'react';
import { 
  CheckCircle, AlertTriangle, XCircle, User, Building2, 
  Mail, Phone, Calendar, DollarSign, MapPin, ExternalLink,
  TrendingUp, Info, Lightbulb, Target
} from 'lucide-react';

const DataQualityIndicator = ({ preprocessingData, className = "" }) => {
  if (!preprocessingData) return null;

  const { quality, structuredData, suggestions, chatbotEnhancements } = preprocessingData;

  const getQualityIcon = (score) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getQualityColor = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200 text-green-800';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    return 'bg-red-50 border-red-200 text-red-800';
  };

  const getScoreBar = (score) => {
    const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500';
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Quality Score Header */}
      <div className={`p-4 rounded-t-lg border-b ${getQualityColor(quality.score)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getQualityIcon(quality.score)}
            <h3 className="font-semibold">Qualité des données</h3>
            <span className="font-bold">{quality.score}%</span>
          </div>
          <div className="text-xs font-medium px-2 py-1 bg-white/30 rounded">
            {quality.businessRelevance === 'high' ? '🎯 Business' : 
             quality.businessRelevance === 'medium' ? '💼 Pro' : '📝 Général'}
          </div>
        </div>
        <div className="mt-2">
          {getScoreBar(quality.score)}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Extracted Data */}
        {Object.keys(structuredData).some(key => structuredData[key]?.length > 0) && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Données extraites
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {structuredData.emails?.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <div className="font-medium">{structuredData.emails.join(', ')}</div>
                  </div>
                </div>
              )}
              
              {structuredData.phones?.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-green-600" />
                  <div>
                    <span className="text-gray-600">Téléphone:</span>
                    <div className="font-medium">{structuredData.phones.join(', ')}</div>
                  </div>
                </div>
              )}
              
              {structuredData.companies?.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="text-gray-600">Entreprise:</span>
                    <div className="font-medium">{structuredData.companies[0]}</div>
                  </div>
                </div>
              )}
              
              {structuredData.names?.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-indigo-600" />
                  <div>
                    <span className="text-gray-600">Contact:</span>
                    <div className="font-medium">{structuredData.names.join(', ')}</div>
                  </div>
                </div>
              )}
              
              {structuredData.amounts?.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-gray-600">Montants:</span>
                    <div className="font-medium">{structuredData.amounts.join(', ')}</div>
                  </div>
                </div>
              )}
              
              {structuredData.dates?.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <div>
                    <span className="text-gray-600">Dates:</span>
                    <div className="font-medium">{structuredData.dates.join(', ')}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quality Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          {quality.strengths?.length > 0 && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <h5 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Points forts
              </h5>
              <ul className="text-xs text-green-700 space-y-1">
                {quality.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Issues */}
          {quality.issues?.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <h5 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                À améliorer
              </h5>
              <ul className="text-xs text-yellow-700 space-y-1">
                {quality.issues.map((issue, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Missing Data */}
        {chatbotEnhancements?.missingData?.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <h5 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Données manquantes
            </h5>
            <div className="space-y-2">
              {chatbotEnhancements.missingData.map((missing, idx) => (
                <div key={idx} className="text-xs text-blue-700">
                  <div className="font-medium">{missing.message}</div>
                  <div className="text-blue-600 italic">{missing.suggestion}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {chatbotEnhancements?.suggestedPrompts?.length > 0 && (
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <h5 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Actions suggérées
            </h5>
            <div className="space-y-1">
              {chatbotEnhancements.suggestedPrompts.slice(0, 3).map((prompt, idx) => (
                <div key={idx} className="text-xs text-purple-700 bg-white/50 rounded px-2 py-1">
                  {prompt}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Lisibilité: {quality.readability}</span>
              <span>Complétude: {quality.completeness}</span>
            </div>
            {preprocessingData.emailType && (
              <div className="flex items-center gap-1">
                <span>Type: {preprocessingData.emailType}</span>
                {preprocessingData.tone && <span>• {preprocessingData.tone}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataQualityIndicator;