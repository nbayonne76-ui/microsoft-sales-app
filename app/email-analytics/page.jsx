'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Mail,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointerClick,
  MessageSquare,
  Users,
  Target,
  Award,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  Clock,
  Sparkles
} from 'lucide-react';

export default function EmailAnalytics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, all
  const [metrics, setMetrics] = useState(null);
  const [sequences, setSequences] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Fetch analytics data
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/email?range=${timeRange}`);
      const data = await response.json();

      if (data.success) {
        setMetrics(data.metrics);
        setSequences(data.sequences || []);
        setTopPerformers(data.topPerformers || []);
        setRecentActivity(data.recentActivity || []);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration (will be replaced by real API data)
  const mockMetrics = {
    totalSent: 1247,
    totalDelivered: 1198,
    totalOpened: 623,
    totalClicked: 187,
    totalReplied: 94,
    deliveryRate: 96.1,
    openRate: 52.0,
    clickRate: 30.0,
    replyRate: 15.1,
    sentimentPositive: 67,
    sentimentNeutral: 21,
    sentimentNegative: 12,
    avgEngagementScore: 68,
    topPerformingSequence: 'Azure Migration Campaign',
    trendsData: [
      { date: '2024-01-01', sent: 45, opened: 23, clicked: 8, replied: 3 },
      { date: '2024-01-02', sent: 52, opened: 28, clicked: 12, replied: 5 },
      { date: '2024-01-03', sent: 48, opened: 26, clicked: 10, replied: 4 },
      { date: '2024-01-04', sent: 61, opened: 34, clicked: 15, replied: 7 },
      { date: '2024-01-05', sent: 57, opened: 31, clicked: 13, replied: 6 },
      { date: '2024-01-06', sent: 50, opened: 27, clicked: 11, replied: 5 },
      { date: '2024-01-07', sent: 53, opened: 29, clicked: 14, replied: 6 },
    ]
  };

  const mockSequences = [
    {
      id: 1,
      name: 'Azure Migration Campaign',
      enrolledCount: 156,
      completedCount: 89,
      responseRate: 18.6,
      meetingRate: 12.2,
      status: 'active',
      performance: 'excellent'
    },
    {
      id: 2,
      name: 'Dynamics 365 Sales Outreach',
      enrolledCount: 203,
      completedCount: 147,
      responseRate: 14.8,
      meetingRate: 9.4,
      status: 'active',
      performance: 'good'
    },
    {
      id: 3,
      name: 'M365 E5 Upgrade Path',
      enrolledCount: 98,
      completedCount: 62,
      responseRate: 11.2,
      meetingRate: 6.1,
      status: 'active',
      performance: 'average'
    },
    {
      id: 4,
      name: 'Re-engagement Sequence',
      enrolledCount: 178,
      completedCount: 134,
      responseRate: 8.4,
      meetingRate: 3.9,
      status: 'paused',
      performance: 'needs_improvement'
    }
  ];

  const mockTopPerformers = [
    {
      subject: 'Transform your business with Azure Cloud',
      openRate: 68.2,
      clickRate: 42.1,
      replyRate: 21.3,
      sent: 87
    },
    {
      subject: 'Exclusive offer: Dynamics 365 demo',
      openRate: 64.5,
      clickRate: 38.7,
      replyRate: 19.4,
      sent: 92
    },
    {
      subject: 'How [Company] reduced costs by 40%',
      openRate: 61.8,
      clickRate: 36.2,
      replyRate: 17.9,
      sent: 76
    },
    {
      subject: 'Quick question about your IT infrastructure',
      openRate: 59.3,
      clickRate: 34.8,
      replyRate: 16.2,
      sent: 103
    }
  ];

  const displayMetrics = metrics || mockMetrics;
  const displaySequences = sequences.length > 0 ? sequences : mockSequences;
  const displayTopPerformers = topPerformers.length > 0 ? topPerformers : mockTopPerformers;

  // Helper function to get trend indicator
  const getTrendIndicator = (value, threshold = 50) => {
    if (value >= threshold + 10) return { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' };
    if (value <= threshold - 10) return { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' };
    return { icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' };
  };

  // Helper function to get performance badge
  const getPerformanceBadge = (performance) => {
    const badges = {
      excellent: { label: 'Excellent', color: 'bg-green-100 text-green-700', icon: Award },
      good: { label: 'Good', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
      average: { label: 'Average', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
      needs_improvement: { label: 'Needs Work', color: 'bg-red-100 text-red-700', icon: XCircle }
    };
    return badges[performance] || badges.average;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Email Analytics
                </h1>
                <p className="text-gray-600 text-lg">Campaign performance and insights</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex bg-white rounded-lg shadow-md border-2 border-gray-100">
                {[
                  { value: '7d', label: '7 Days' },
                  { value: '30d', label: '30 Days' },
                  { value: '90d', label: '90 Days' },
                  { value: 'all', label: 'All Time' }
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-4 py-2 font-medium transition-all ${
                      timeRange === range.value
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    } ${range.value === '7d' ? 'rounded-l-lg' : ''} ${range.value === 'all' ? 'rounded-r-lg' : ''}`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              <Button
                onClick={fetchAnalytics}
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Emails Sent */}
          <Card className="shadow-xl border-2 border-blue-100 hover:shadow-2xl transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Mail className="w-8 h-8 text-blue-600" />
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                  {timeRange === '7d' ? 'WEEK' : timeRange === '30d' ? 'MONTH' : timeRange === '90d' ? 'QUARTER' : 'TOTAL'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{displayMetrics.totalSent.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Emails Sent</div>
              <div className="mt-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">+12% vs previous</span>
              </div>
            </CardContent>
          </Card>

          {/* Open Rate */}
          <Card className="shadow-xl border-2 border-green-100 hover:shadow-2xl transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Eye className="w-8 h-8 text-green-600" />
                {(() => {
                  const trend = getTrendIndicator(displayMetrics.openRate);
                  const TrendIcon = trend.icon;
                  return (
                    <div className={`p-2 rounded-lg ${trend.bg}`}>
                      <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                    </div>
                  );
                })()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{displayMetrics.openRate}%</div>
              <div className="text-sm text-gray-600 mt-1">Open Rate</div>
              <div className="mt-3 text-xs text-gray-500">
                {displayMetrics.totalOpened.toLocaleString()} of {displayMetrics.totalDelivered.toLocaleString()} opened
              </div>
            </CardContent>
          </Card>

          {/* Click Rate */}
          <Card className="shadow-xl border-2 border-purple-100 hover:shadow-2xl transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <MousePointerClick className="w-8 h-8 text-purple-600" />
                {(() => {
                  const trend = getTrendIndicator(displayMetrics.clickRate, 25);
                  const TrendIcon = trend.icon;
                  return (
                    <div className={`p-2 rounded-lg ${trend.bg}`}>
                      <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                    </div>
                  );
                })()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{displayMetrics.clickRate}%</div>
              <div className="text-sm text-gray-600 mt-1">Click Rate</div>
              <div className="mt-3 text-xs text-gray-500">
                {displayMetrics.totalClicked.toLocaleString()} clicks from opened emails
              </div>
            </CardContent>
          </Card>

          {/* Reply Rate */}
          <Card className="shadow-xl border-2 border-pink-100 hover:shadow-2xl transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <MessageSquare className="w-8 h-8 text-pink-600" />
                {(() => {
                  const trend = getTrendIndicator(displayMetrics.replyRate, 10);
                  const TrendIcon = trend.icon;
                  return (
                    <div className={`p-2 rounded-lg ${trend.bg}`}>
                      <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                    </div>
                  );
                })()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{displayMetrics.replyRate}%</div>
              <div className="text-sm text-gray-600 mt-1">Reply Rate</div>
              <div className="mt-3 text-xs text-gray-500">
                {displayMetrics.totalReplied.toLocaleString()} responses received
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sequence Performance */}
        <Card className="shadow-xl border-2 border-blue-100 mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Target className="w-6 h-6 text-blue-600" />
              Sequence Performance
            </CardTitle>
            <CardDescription>Multi-touch email campaign results</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {displaySequences.map((sequence) => {
                const badge = getPerformanceBadge(sequence.performance);
                const BadgeIcon = badge.icon;

                return (
                  <div
                    key={sequence.id}
                    className="p-5 bg-white border-2 border-gray-100 rounded-lg hover:border-blue-200 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{sequence.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${badge.color}`}>
                            <BadgeIcon className="w-3 h-3" />
                            {badge.label}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            sequence.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {sequence.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Enrolled</div>
                        <div className="text-2xl font-bold text-gray-900">{sequence.enrolledCount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Completed</div>
                        <div className="text-2xl font-bold text-gray-900">{sequence.completedCount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Response Rate</div>
                        <div className="text-2xl font-bold text-green-600">{sequence.responseRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Meeting Rate</div>
                        <div className="text-2xl font-bold text-blue-600">{sequence.meetingRate}%</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${(sequence.completedCount / sequence.enrolledCount) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round((sequence.completedCount / sequence.enrolledCount) * 100)}% completion rate
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Sentiment Analysis */}
          <Card className="shadow-xl border-2 border-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Response Sentiment
              </CardTitle>
              <CardDescription>AI-analyzed response sentiment</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-gray-900">Positive</div>
                      <div className="text-sm text-gray-600">{displayMetrics.sentimentPositive} responses</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{displayMetrics.sentimentPositive}%</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-gray-900">Neutral</div>
                      <div className="text-sm text-gray-600">{displayMetrics.sentimentNeutral} responses</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{displayMetrics.sentimentNeutral}%</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-2 border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-gray-900">Negative</div>
                      <div className="text-sm text-gray-600">{displayMetrics.sentimentNegative} responses</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-red-600">{displayMetrics.sentimentNegative}%</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-gray-900">Avg Engagement Score</span>
                </div>
                <div className="text-4xl font-bold text-purple-600">{displayMetrics.avgEngagementScore}/100</div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Emails */}
          <Card className="shadow-xl border-2 border-green-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                Top Performing Emails
              </CardTitle>
              <CardDescription>Best subject lines by engagement</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {displayTopPerformers.map((email, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white border-2 border-gray-100 rounded-lg hover:border-green-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-600' : 'bg-blue-500'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">{email.subject}</div>
                        <div className="text-xs text-gray-500">Sent to {email.sent} recipients</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-blue-50 rounded">
                        <div className="text-xs text-gray-600">Open</div>
                        <div className="font-bold text-blue-600">{email.openRate}%</div>
                      </div>
                      <div className="p-2 bg-purple-50 rounded">
                        <div className="text-xs text-gray-600">Click</div>
                        <div className="font-bold text-purple-600">{email.clickRate}%</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-xs text-gray-600">Reply</div>
                        <div className="font-bold text-green-600">{email.replyRate}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Health */}
        <Card className="shadow-xl border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Activity className="w-6 h-6 text-blue-600" />
              Delivery Health
            </CardTitle>
            <CardDescription>Email deliverability and health metrics</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <div className="text-4xl font-bold text-green-600 mb-2">{displayMetrics.deliveryRate}%</div>
                <div className="text-sm font-medium text-gray-700">Delivery Rate</div>
                <div className="text-xs text-gray-500 mt-2">
                  {displayMetrics.totalDelivered.toLocaleString()} delivered successfully
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
                <Mail className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <div className="text-4xl font-bold text-blue-600 mb-2">0.8%</div>
                <div className="text-sm font-medium text-gray-700">Bounce Rate</div>
                <div className="text-xs text-gray-500 mt-2">
                  {displayMetrics.totalSent - displayMetrics.totalDelivered} bounced emails
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                <Award className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <div className="text-4xl font-bold text-purple-600 mb-2">Excellent</div>
                <div className="text-sm font-medium text-gray-700">Sender Reputation</div>
                <div className="text-xs text-gray-500 mt-2">
                  All metrics within healthy ranges
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
