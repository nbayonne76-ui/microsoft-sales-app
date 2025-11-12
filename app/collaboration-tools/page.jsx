'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users, MessageSquare, FileText, Calendar, Video, BarChart,
  Cloud, Shield, Zap, Search, Filter, Check, X, ChevronDown,
  Building2, Briefcase, GraduationCap, HardHat, Sparkles
} from 'lucide-react';

// M365 Collaboration Tools Database (from M365 Maps analysis)
const collaborationTools = [
  {
    id: 'teams',
    name: 'Microsoft Teams',
    category: 'Communication',
    icon: MessageSquare,
    color: 'from-purple-500 to-indigo-600',
    description: 'Hub for teamwork with chat, meetings, calling, and collaboration',
    features: ['Group chat', 'Video meetings', 'Audio conferencing', 'File sharing', 'App integrations'],
    useCases: ['Team Communication', 'Remote Work', 'Project Collaboration'],
    licenses: {
      'E1': true, 'E3': true, 'E5': true,
      'Business Basic': true, 'Business Standard': true, 'Business Premium': true,
      'F1': true, 'F3': true,
      'A1': true, 'A3': true, 'A5': true
    },
    copilot: true,
    integrations: ['SharePoint', 'OneDrive', 'Planner', 'Power Apps']
  },
  {
    id: 'sharepoint',
    name: 'SharePoint Online',
    category: 'Content',
    icon: FileText,
    color: 'from-teal-500 to-cyan-600',
    description: 'Team sites, document management, and intranet platform',
    features: ['Team sites', 'Document libraries', 'Version control', 'Workflows', 'Search'],
    useCases: ['Document Management', 'Intranet', 'Team Collaboration'],
    licenses: {
      'E1': 'Plan 1', 'E3': 'Plan 2', 'E5': 'Plan 2',
      'Business Basic': true, 'Business Standard': true, 'Business Premium': true,
      'F1': 'Kiosk', 'F3': 'Plan 1',
      'A1': 'Plan 1', 'A3': 'Plan 2', 'A5': 'Plan 2'
    },
    copilot: true,
    integrations: ['Teams', 'OneDrive', 'Power Automate', 'Viva']
  },
  {
    id: 'onedrive',
    name: 'OneDrive for Business',
    category: 'Content',
    icon: Cloud,
    color: 'from-blue-500 to-blue-600',
    description: 'Personal and team file storage with sync and sharing',
    features: ['File sync', 'Sharing', 'Version history', 'Mobile access', 'Offline files'],
    useCases: ['File Storage', 'File Sync', 'Mobile Access'],
    licenses: {
      'E1': '1TB', 'E3': '1TB+', 'E5': '1TB+',
      'Business Basic': '1TB', 'Business Standard': '1TB', 'Business Premium': '1TB',
      'F1': '2GB', 'F3': '1TB',
      'A1': '100GB', 'A3': '1TB+', 'A5': '1TB+'
    },
    copilot: true,
    integrations: ['Teams', 'SharePoint', 'Office Apps']
  },
  {
    id: 'planner',
    name: 'Microsoft Planner',
    category: 'Planning',
    icon: BarChart,
    color: 'from-green-500 to-emerald-600',
    description: 'Visual task management and team planning',
    features: ['Task boards', 'Assignments', 'Due dates', 'Charts', 'Team collaboration'],
    useCases: ['Task Management', 'Project Planning', 'Team Coordination'],
    licenses: {
      'E1': true, 'E3': true, 'E5': true,
      'Business Basic': true, 'Business Standard': true, 'Business Premium': true,
      'F1': true, 'F3': true,
      'A1': true, 'A3': true, 'A5': true
    },
    copilot: false,
    integrations: ['Teams', 'Outlook', 'To Do']
  },
  {
    id: 'outlook',
    name: 'Outlook',
    category: 'Communication',
    icon: Calendar,
    color: 'from-blue-600 to-indigo-600',
    description: 'Email, calendar, and contact management',
    features: ['Email', 'Calendar', 'Contacts', 'Tasks', 'Focused Inbox'],
    useCases: ['Email', 'Scheduling', 'Communication'],
    licenses: {
      'E1': '50GB', 'E3': '100GB', 'E5': '100GB',
      'Business Basic': '50GB', 'Business Standard': '50GB', 'Business Premium': '50GB',
      'F1': 'Calendar only', 'F3': '2GB',
      'A1': '50GB', 'A3': '100GB', 'A5': '100GB'
    },
    copilot: true,
    integrations: ['Teams', 'OneDrive', 'To Do', 'Planner']
  },
  {
    id: 'copilot',
    name: 'Microsoft 365 Copilot Chat',
    category: 'AI',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-600',
    description: 'AI-powered chat assistant across M365 apps',
    features: ['AI chat', 'Document insights', 'Meeting summaries', 'Content creation', 'Data analysis'],
    useCases: ['AI Assistance', 'Productivity', 'Content Creation'],
    licenses: {
      'E1': 'Included', 'E3': 'Included', 'E5': 'Included',
      'Business Basic': 'Included', 'Business Standard': 'Included', 'Business Premium': 'Included',
      'F1': 'Add-on', 'F3': 'Add-on',
      'A1': 'Included', 'A3': 'Included', 'A5': 'Included'
    },
    copilot: true,
    integrations: ['All M365 Apps']
  },
  {
    id: 'viva-engage',
    name: 'Viva Engage',
    category: 'Communication',
    icon: Users,
    color: 'from-orange-500 to-red-600',
    description: 'Enterprise social network for company-wide communication',
    features: ['Communities', 'Announcements', 'Employee engagement', 'Social feed', 'Q&A'],
    useCases: ['Company Communication', 'Employee Engagement', 'Knowledge Sharing'],
    licenses: {
      'E1': true, 'E3': true, 'E5': true,
      'Business Basic': false, 'Business Standard': false, 'Business Premium': true,
      'F1': true, 'F3': true,
      'A1': true, 'A3': true, 'A5': true
    },
    copilot: false,
    integrations: ['Teams', 'SharePoint', 'Viva Connections']
  },
  {
    id: 'forms',
    name: 'Microsoft Forms',
    category: 'Productivity',
    icon: FileText,
    color: 'from-pink-500 to-rose-600',
    description: 'Create surveys, quizzes, and polls',
    features: ['Surveys', 'Quizzes', 'Polls', 'Response tracking', 'Data export'],
    useCases: ['Surveys', 'Feedback Collection', 'Quizzes'],
    licenses: {
      'E1': true, 'E3': true, 'E5': true,
      'Business Basic': true, 'Business Standard': true, 'Business Premium': true,
      'F1': 'Consume only', 'F3': true,
      'A1': true, 'A3': true, 'A5': true
    },
    copilot: false,
    integrations: ['Teams', 'Excel', 'Power Automate']
  },
  {
    id: 'stream',
    name: 'Stream',
    category: 'Content',
    icon: Video,
    color: 'from-red-500 to-pink-600',
    description: 'Video platform for recording, uploading, and sharing',
    features: ['Video upload', 'Live events', 'Recording', 'Transcription', 'Search'],
    useCases: ['Video Sharing', 'Training', 'Presentations'],
    licenses: {
      'E1': true, 'E3': true, 'E5': true,
      'Business Basic': true, 'Business Standard': true, 'Business Premium': true,
      'F1': true, 'F3': true,
      'A1': true, 'A3': true, 'A5': true
    },
    copilot: false,
    integrations: ['Teams', 'SharePoint', 'Viva']
  },
  {
    id: 'whiteboard',
    name: 'Microsoft Whiteboard',
    category: 'Productivity',
    icon: BarChart,
    color: 'from-cyan-500 to-blue-600',
    description: 'Digital canvas for visual collaboration',
    features: ['Digital whiteboard', 'Real-time collaboration', 'Templates', 'Sticky notes', 'Export'],
    useCases: ['Brainstorming', 'Visual Collaboration', 'Workshops'],
    licenses: {
      'E1': true, 'E3': true, 'E5': true,
      'Business Basic': true, 'Business Standard': true, 'Business Premium': true,
      'F1': true, 'F3': true,
      'A1': true, 'A3': true, 'A5': true
    },
    copilot: false,
    integrations: ['Teams', 'OneNote']
  },
  {
    id: 'bookings',
    name: 'Microsoft Bookings',
    category: 'Planning',
    icon: Calendar,
    color: 'from-indigo-500 to-purple-600',
    description: 'Appointment scheduling and calendar management',
    features: ['Appointment scheduling', 'Customer booking', 'Email reminders', 'Calendar sync', 'Staff management'],
    useCases: ['Appointment Scheduling', 'Service Booking', 'Client Management'],
    licenses: {
      'E1': true, 'E3': true, 'E5': true,
      'Business Basic': false, 'Business Standard': true, 'Business Premium': true,
      'F1': false, 'F3': true,
      'A1': false, 'A3': true, 'A5': true
    },
    copilot: false,
    integrations: ['Outlook', 'Teams', 'Calendar']
  },
  {
    id: 'loop',
    name: 'Microsoft Loop',
    category: 'Productivity',
    icon: Zap,
    color: 'from-yellow-500 to-orange-600',
    description: 'Flexible collaborative workspace with portable components',
    features: ['Collaborative workspaces', 'Portable components', 'Real-time sync', 'Templates', 'Integration'],
    useCases: ['Project Collaboration', 'Content Creation', 'Team Planning'],
    licenses: {
      'E1': true, 'E3': true, 'E5': true,
      'Business Basic': true, 'Business Standard': true, 'Business Premium': true,
      'F1': false, 'F3': true,
      'A1': true, 'A3': true, 'A5': true
    },
    copilot: true,
    integrations: ['Teams', 'Outlook', 'OneNote', 'Whiteboard']
  }
];

const licenses = [
  { id: 'E1', name: 'Office 365 E1', icon: Briefcase, target: 'Enterprise Basic' },
  { id: 'E3', name: 'Office 365 E3', icon: Briefcase, target: 'Enterprise Standard' },
  { id: 'E5', name: 'Office 365 E5', icon: Briefcase, target: 'Enterprise Premium' },
  { id: 'Business Basic', name: 'M365 Business Basic', icon: Building2, target: 'Small Business' },
  { id: 'Business Standard', name: 'M365 Business Standard', icon: Building2, target: 'Small Business' },
  { id: 'Business Premium', name: 'M365 Business Premium', icon: Building2, target: 'Small Business' },
  { id: 'F1', name: 'M365 F1', icon: HardHat, target: 'Frontline Workers' },
  { id: 'F3', name: 'M365 F3', icon: HardHat, target: 'Frontline Workers' },
  { id: 'A1', name: 'M365 A1', icon: GraduationCap, target: 'Education' },
  { id: 'A3', name: 'M365 A3', icon: GraduationCap, target: 'Education' },
  { id: 'A5', name: 'M365 A5', icon: GraduationCap, target: 'Education' }
];

const categories = ['All', 'Communication', 'Content', 'Planning', 'Productivity', 'AI'];

export default function CollaborationToolsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparedLicenses, setComparedLicenses] = useState([]);

  const filteredTools = collaborationTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesLicense = !selectedLicense || tool.licenses[selectedLicense];

    return matchesSearch && matchesCategory && matchesLicense;
  });

  const categoryCount = (cat) => {
    return collaborationTools.filter(t => cat === 'All' || t.category === cat).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-12 h-12 text-blue-600" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                M365 Collaboration Tools
              </h1>
              <p className="text-gray-600 text-lg">Interactive selector based on license and use case</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="text-sm opacity-90">Total Tools</div>
            <div className="text-3xl font-bold">{collaborationTools.length}</div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="text-sm opacity-90">Copilot-Enabled</div>
            <div className="text-3xl font-bold">
              {collaborationTools.filter(t => t.copilot).length}
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <div className="text-sm opacity-90">Categories</div>
            <div className="text-3xl font-bold">{categories.length - 1}</div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
            <div className="text-sm opacity-90">License Plans</div>
            <div className="text-3xl font-bold">{licenses.length}</div>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card className="p-6 mb-8">
          <div className="flex gap-4 items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search collaboration tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={compareMode ? 'default' : 'outline'}
              onClick={() => setCompareMode(!compareMode)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Compare Licenses
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'bg-blue-600' : ''}
              >
                {cat} ({categoryCount(cat)})
              </Button>
            ))}
          </div>
        </Card>

        {/* License Filter */}
        {!compareMode && (
          <Card className="p-6 mb-8">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Filter by License
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <Button
                variant={!selectedLicense ? 'default' : 'outline'}
                onClick={() => setSelectedLicense(null)}
                className={!selectedLicense ? 'bg-blue-600' : ''}
              >
                All Licenses
              </Button>
              {licenses.map(lic => {
                const Icon = lic.icon;
                return (
                  <Button
                    key={lic.id}
                    variant={selectedLicense === lic.id ? 'default' : 'outline'}
                    onClick={() => setSelectedLicense(lic.id)}
                    className={selectedLicense === lic.id ? 'bg-blue-600' : ''}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {lic.id}
                  </Button>
                );
              })}
            </div>
          </Card>
        )}

        {/* Tools Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {filteredTools.map(tool => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.id}
                className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-500"
                onClick={() => setSelectedTool(tool)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {tool.copilot && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Copilot
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {tool.category}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {tool.integrations.length} integrations
                  </span>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  View Details
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Tool Detail Modal */}
        {selectedTool && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTool(null)}
          >
            <Card
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${selectedTool.color} text-white`}>
                    {(() => {
                      const Icon = selectedTool.icon;
                      return <Icon className="w-8 h-8" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedTool.name}</h2>
                    <p className="text-gray-600 text-lg">{selectedTool.description}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedTool(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Key Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTool.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Use Cases</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedTool.useCases.map((useCase, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              {/* License Availability */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">License Availability</h3>
                <div className="grid grid-cols-3 gap-2">
                  {licenses.map(lic => {
                    const available = selectedTool.licenses[lic.id];
                    const Icon = lic.icon;
                    return (
                      <div
                        key={lic.id}
                        className={`p-3 rounded-lg border-2 ${
                          available
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-gray-50 opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{lic.id}</span>
                        </div>
                        {available && typeof available === 'string' && (
                          <div className="text-xs text-gray-600 mt-1">{available}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Integrations */}
              <div>
                <h3 className="font-bold text-lg mb-3">Integrations</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedTool.integrations.map((integration, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {integration}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
