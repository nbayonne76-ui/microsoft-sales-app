'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Users,
  MessageSquare,
  BarChart3
} from 'lucide-react';

export default function AIInsightsPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  async function fetchAnalyses() {
    try {
      const response = await fetch('/api/ai-analysis');
      const data = await response.json();
      setAnalyses(data.analyses || []);
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      setLoading(false);
    }
  }

  // Calculate aggregate stats
  const stats = {
    total: analyses.length,
    positive: analyses.filter(a => a.sentiment === 'positive').length,
    neutral: analyses.filter(a => a.sentiment === 'neutral').length,
    negative: analyses.filter(a => a.sentiment === 'negative').length,
    interested: analyses.filter(a => a.primaryIntent === 'book_meeting' || a.primaryIntent === 'request_info').length,
    avgSentiment: analyses.reduce((sum, a) => sum + a.sentimentScore, 0) / analyses.length || 0
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-5 h-5 text-green-600" />;
      case 'negative':
        return <ThumbsDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'from-green-500 to-green-600';
      case 'negative':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getIntentBadgeColor = (intent) => {
    switch (intent) {
      case 'book_meeting':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'request_info':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'pricing_inquiry':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'not_interested':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'competitor_mention':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading AI insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Response Intelligence
              </h1>
              <p className="text-gray-600">Learning from every email to make you smarter</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Sparkles className="w-4 h-4 mr-2" />
            View Patterns
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Total Analyzed</div>
                <div className="text-3xl font-bold">{stats.total}</div>
              </div>
              <Brain className="w-10 h-10 opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Positive Sentiment</div>
                <div className="text-3xl font-bold">{stats.positive}</div>
                <div className="text-xs opacity-80">{((stats.positive / stats.total) * 100 || 0).toFixed(0)}%</div>
              </div>
              <ThumbsUp className="w-10 h-10 opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Interested</div>
                <div className="text-3xl font-bold">{stats.interested}</div>
                <div className="text-xs opacity-80">Want meeting/info</div>
              </div>
              <Target className="w-10 h-10 opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Avg Sentiment</div>
                <div className="text-3xl font-bold">{(stats.avgSentiment * 100).toFixed(0)}</div>
                <div className="text-xs opacity-80">Out of 100</div>
              </div>
              <BarChart3 className="w-10 h-10 opacity-80" />
            </div>
          </Card>
        </div>

        {/* Recent Analyses */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Recent Response Analyses</h2>

          {analyses.map(analysis => (
            <Card
              key={analysis.id}
              className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-500"
              onClick={() => setSelectedAnalysis(analysis)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header with company and sentiment */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(analysis.sentiment)}
                      <span className="font-bold text-lg">
                        {analysis.emailTracking?.lead?.companyName || 'Unknown Company'}
                      </span>
                    </div>
                    <Badge variant="outline" className={getSentimentColor(analysis.sentiment) + ' text-white border-0'}>
                      {analysis.sentiment}
                    </Badge>
                    <Badge variant="outline" className={getIntentBadgeColor(analysis.primaryIntent)}>
                      {analysis.primaryIntent}
                    </Badge>
                    {analysis.urgencyLevel === 'high' && (
                      <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 animate-pulse">
                        <Zap className="w-3 h-3 mr-1" />
                        High Urgency
                      </Badge>
                    )}
                  </div>

                  {/* AI Summary */}
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-3 rounded">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm text-purple-900 mb-1">AI Summary</div>
                        <p className="text-sm text-gray-700">{analysis.aiSummary || 'No summary available'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Key Phrases & Signals */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    {analysis.keyPhrases && analysis.keyPhrases.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-2">Key Phrases</div>
                        <div className="flex flex-wrap gap-1">
                          {analysis.keyPhrases.slice(0, 3).map((phrase, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {phrase}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.mentionedCompetitors && analysis.mentionedCompetitors.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-2">Competitors Mentioned</div>
                        <div className="flex flex-wrap gap-1">
                          {analysis.mentionedCompetitors.map((comp, idx) => (
                            <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-700">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggested Action */}
                  {analysis.suggestedNextStep && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm text-green-900 mb-1">Suggested Next Step</div>
                          <p className="text-sm text-gray-700">{analysis.suggestedNextStep.replace(/_/g, ' ')}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right side - metadata */}
                <div className="ml-6 text-right flex-shrink-0">
                  <div className="text-xs text-gray-500 mb-2">
                    {new Date(analysis.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    {new Date(analysis.createdAt).toLocaleTimeString('fr-FR')}
                  </div>
                  <Button size="sm" variant="outline">
                    View Full Analysis
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedAnalysis && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAnalysis(null)}
          >
            <Card
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Full AI Analysis</h2>
                  <p className="text-gray-600">
                    {selectedAnalysis.emailTracking?.lead?.companyName} - {selectedAnalysis.emailTracking?.lead?.managers?.[0]?.name}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setSelectedAnalysis(null)}>Close</Button>
              </div>

              <div className="space-y-6">
                {/* Original Response */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Original Response</h3>
                  <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm">
                    {selectedAnalysis.responseText}
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="font-semibold mb-2">Sentiment Analysis</div>
                    <div className="flex items-center gap-2 mb-2">
                      {getSentimentIcon(selectedAnalysis.sentiment)}
                      <span className="text-lg font-bold">{selectedAnalysis.sentiment}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Score: {(selectedAnalysis.sentimentScore * 100).toFixed(0)}/100
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="font-semibold mb-2">Primary Intent</div>
                    <Badge className={getIntentBadgeColor(selectedAnalysis.primaryIntent)}>
                      {selectedAnalysis.primaryIntent}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-2">
                      Urgency: <span className={getUrgencyColor(selectedAnalysis.urgencyLevel)}>
                        {selectedAnalysis.urgencyLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Suggested Response */}
                {selectedAnalysis.suggestedResponse && (
                  <div>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      AI Suggested Response
                    </h3>
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border-2 border-purple-200">
                      <div className="whitespace-pre-wrap text-sm">{selectedAnalysis.suggestedResponse}</div>
                    </div>
                    <Button className="mt-3 bg-purple-600 hover:bg-purple-700">
                      Copy to Clipboard
                    </Button>
                  </div>
                )}

                {/* Pattern Matching */}
                <div className="grid grid-cols-3 gap-4">
                  {selectedAnalysis.industryPattern && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Industry Pattern</div>
                      <div className="font-semibold">{selectedAnalysis.industryPattern}</div>
                    </div>
                  )}
                  {selectedAnalysis.rolePattern && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Role Pattern</div>
                      <div className="font-semibold">{selectedAnalysis.rolePattern}</div>
                    </div>
                  )}
                  {selectedAnalysis.companySizePattern && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Company Size</div>
                      <div className="font-semibold">{selectedAnalysis.companySizePattern}</div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {analyses.length === 0 && (
          <Card className="p-12 text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold mb-2">No analyses yet</h3>
            <p className="text-gray-600 mb-6">
              As leads respond to your emails, AI will analyze them automatically
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Learn More
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
