'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Mail, TrendingUp, Users, Clock, Target, Play, Pause, ChevronRight, BarChart3, Sparkles } from 'lucide-react';

export default function SequencesPage() {
  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSequence, setSelectedSequence] = useState(null);

  useEffect(() => {
    fetchSequences();
  }, []);

  async function fetchSequences() {
    try {
      const response = await fetch('/api/sequences');
      const data = await response.json();
      setSequences(data.sequences || []);
    } catch (error) {
      console.error('Error fetching sequences:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading sequences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Email Sequences
              </h1>
              <p className="text-gray-600">Multi-touch automation that works while you sleep</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Create Sequence
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Active Sequences</div>
                <div className="text-3xl font-bold">{sequences.filter(s => s.isActive).length}</div>
              </div>
              <Zap className="w-10 h-10 opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Total Enrolled</div>
                <div className="text-3xl font-bold">{sequences.reduce((sum, s) => sum + s.totalEnrolled, 0)}</div>
              </div>
              <Users className="w-10 h-10 opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Avg Response Rate</div>
                <div className="text-3xl font-bold">
                  {(sequences.reduce((sum, s) => sum + s.avgResponseRate, 0) / sequences.length || 0).toFixed(1)}%
                </div>
              </div>
              <TrendingUp className="w-10 h-10 opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Meeting Rate</div>
                <div className="text-3xl font-bold">
                  {(sequences.reduce((sum, s) => sum + s.avgMeetingRate, 0) / sequences.length || 0).toFixed(1)}%
                </div>
              </div>
              <Target className="w-10 h-10 opacity-80" />
            </div>
          </Card>
        </div>

        {/* Sequences List */}
        <div className="grid grid-cols-1 gap-6">
          {sequences.map(sequence => (
            <Card key={sequence.id} className="p-6 hover:shadow-xl transition-all border-2 hover:border-blue-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{sequence.name}</h2>
                    <Badge variant={sequence.isActive ? 'success' : 'secondary'}>
                      {sequence.isActive ? <><Play className="w-3 h-3 mr-1" /> Active</> : <><Pause className="w-3 h-3 mr-1" /> Paused</>}
                    </Badge>
                    {sequence.isTemplate && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Template
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{sequence.description}</p>

                  {/* Targeting Info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      <Target className="w-3 h-3 mr-1" />
                      {sequence.targetCompanySize === 'sme' ? 'PME' : sequence.targetCompanySize === 'enterprise' ? 'Enterprise' : 'Startup'}
                    </Badge>
                    {sequence.targetIndustry && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {sequence.targetIndustry}
                      </Badge>
                    )}
                    {sequence.targetRole && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        {sequence.targetRole}
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">
                      <Mail className="w-3 h-3 mr-1" />
                      {sequence.stepsCount} steps
                    </Badge>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Enrolled</div>
                      <div className="text-xl font-bold text-gray-900">{sequence.totalEnrolled}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Response Rate</div>
                      <div className="text-xl font-bold text-green-600">{sequence.avgResponseRate.toFixed(1)}%</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Meeting Rate</div>
                      <div className="text-xl font-bold text-blue-600">{sequence.avgMeetingRate.toFixed(1)}%</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Completed</div>
                      <div className="text-xl font-bold text-purple-600">{sequence.completedCount}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSequence(sequence)}
                    className="whitespace-nowrap"
                  >
                    <ChevronRight className="w-4 h-4 mr-2" />
                    View Steps
                  </Button>
                  <Button variant="outline" className="whitespace-nowrap">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </div>

              {/* Sequence Steps Timeline (collapsed) */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {sequence.steps.slice(0, 4).map((step, idx) => (
                    <div key={step.id} className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {step.stepNumber}
                        </div>
                        <div className="text-xs text-center mt-1 text-gray-500">
                          Day {step.delayDays}
                        </div>
                      </div>
                      {idx < Math.min(sequence.steps.length - 1, 3) && (
                        <div className="w-12 h-px bg-gray-300 mx-2"></div>
                      )}
                    </div>
                  ))}
                  {sequence.steps.length > 4 && (
                    <div className="text-gray-500 text-sm ml-2">+{sequence.steps.length - 4} more</div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Sequence Detail Modal */}
        {selectedSequence && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSequence(null)}
          >
            <Card
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedSequence.name}</h2>
                  <p className="text-gray-600">{selectedSequence.description}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedSequence(null)}>Close</Button>
              </div>

              <div className="space-y-6">
                {selectedSequence.steps.map((step, idx) => (
                  <div key={step.id} className="border-l-4 border-blue-500 pl-6 pb-6 relative">
                    {/* Step number bubble */}
                    <div className="absolute -left-4 top-0 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {step.stepNumber}
                    </div>

                    {/* Delay badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-gray-100">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.delayDays > 0 ? `Day ${step.delayDays}` : 'Immediate'}
                        {step.delayHours > 0 && ` + ${step.delayHours}h`}
                      </Badge>
                      <Badge variant="outline" className={
                        step.emailType === 'prospection' ? 'bg-green-50 text-green-700' :
                        step.emailType === 'follow_up' ? 'bg-blue-50 text-blue-700' :
                        step.emailType === 'value_add' ? 'bg-purple-50 text-purple-700' :
                        'bg-red-50 text-red-700'
                      }>
                        {step.emailType}
                      </Badge>
                    </div>

                    {/* Email content */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="font-bold text-lg mb-2">📧 {step.subject}</div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">{step.bodyTemplate}</div>
                    </div>

                    {/* Performance */}
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <span className="text-gray-600">Sent: <strong>{step.sentCount}</strong></span>
                      <span className="text-gray-600">Opens: <strong>{(step.openRate * 100).toFixed(1)}%</strong></span>
                      <span className="text-gray-600">Replies: <strong>{(step.replyRate * 100).toFixed(1)}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {sequences.length === 0 && (
          <Card className="p-12 text-center">
            <Zap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold mb-2">No sequences yet</h3>
            <p className="text-gray-600 mb-6">Create your first multi-touch sequence to start automating your outreach</p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Your First Sequence
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
