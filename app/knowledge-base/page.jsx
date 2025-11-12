'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen, DollarSign, FileText, Search, Download, ExternalLink,
  TrendingUp, Award, Shield, Cloud, Zap, CheckCircle,
  Star, Filter, X, ChevronRight, Home, Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function KnowledgeBasePage() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const knowledgeBaseDocs = [
    // M365 Documents
    {
      id: 'm365-pricing',
      title: 'Microsoft 365 Pricing Guide 2025',
      category: 'M365',
      description: 'Complete M365 pricing: Business, Enterprise, add-ons, and 2025 updates',
      icon: DollarSign,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      file: 'm365-pricing-2025.md',
      tags: ['M365', 'Pricing', 'Enterprise', '2025'],
      featured: true,
      size: '8 KB',
      emoji: '💼'
    },
    {
      id: 'e3-vs-e5',
      title: 'M365 E3 vs E5 Optimizer',
      category: 'M365',
      description: 'Save $21/user/month with smart license optimization',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      file: 'm365-e3-vs-e5-decision-guide.md',
      tags: ['M365', 'E3', 'E5', 'Optimization', 'Cost Savings'],
      featured: true,
      size: '13 KB',
      emoji: '📊'
    },
    {
      id: 'licensing',
      title: 'Licensing & Contracts Guide',
      category: 'M365',
      description: 'CSP, MCA, EA, NCE - Complete licensing guide with 2025 compliance',
      icon: FileText,
      color: 'from-teal-500 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-teal-50 to-cyan-50',
      file: 'microsoft-licensing-contracts-guide.md',
      tags: ['CSP', 'MCA', 'EA', 'NCE', 'Licensing'],
      featured: true,
      size: '23 KB',
      emoji: '📄'
    },
    {
      id: 'csp-vs-mca',
      title: 'CSP vs MCA Decision Guide',
      category: 'M365',
      description: 'Choose the right contract model for your customer',
      icon: CheckCircle,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
      file: 'csp-vs-mca-decision-guide.md',
      tags: ['CSP', 'MCA', 'Licensing', 'Contracts'],
      featured: false,
      size: '16 KB',
      emoji: '🤝'
    },
    {
      id: 'm365-collab',
      title: 'M365 Collaboration Email',
      category: 'M365',
      description: 'Productivity and collaboration email template',
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      file: 'microsoft-365-collaboration.md',
      tags: ['M365', 'Collaboration', 'Email', 'Template'],
      featured: false,
      size: '1.9 KB',
      emoji: '✨'
    },

    // Dynamics 365 Documents
    {
      id: 'dynamics-pricing',
      title: 'Dynamics 365 Pricing Guide 2025',
      category: 'Dynamics',
      description: 'Complete Dynamics 365 CRM & ERP pricing with implementation costs',
      icon: DollarSign,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      file: 'dynamics-365-pricing-2025.md',
      tags: ['Dynamics', 'CRM', 'ERP', 'Pricing', '2025'],
      featured: true,
      size: '10 KB',
      emoji: '🎯'
    },

    // Azure Documents
    {
      id: 'azure-pricing',
      title: 'Azure Pricing Guide 2025',
      category: 'Azure',
      description: 'Complete Azure pricing: Compute, Storage, Databases, AI, and optimization tips',
      icon: Cloud,
      color: 'from-sky-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-sky-50 to-blue-50',
      file: 'azure-pricing-2025.md',
      tags: ['Azure', 'Cloud', 'Pricing', '2025'],
      featured: true,
      size: '14 KB',
      emoji: '☁️'
    },
    {
      id: 'azure-migration',
      title: 'Azure Migration Email Template',
      category: 'Azure',
      description: 'Cloud migration and infrastructure modernization email template',
      icon: Cloud,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-cyan-50 to-blue-50',
      file: 'azure-migration.md',
      tags: ['Azure', 'Migration', 'Email', 'Template'],
      featured: false,
      size: '1.7 KB',
      emoji: '🚀'
    },

    // Templates
    {
      id: 'solution-bundles',
      title: 'Solution Bundles & ROI',
      category: 'Templates',
      description: 'Ready-to-use packages with ROI calculators by company size',
      icon: Award,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      file: 'solution-bundles-pricing.md',
      tags: ['Bundles', 'ROI', 'Solutions', 'Templates'],
      featured: false,
      size: '9.4 KB',
      emoji: '🎁'
    },
    {
      id: 'power-platform',
      title: 'Power Platform Email Template',
      category: 'Templates',
      description: 'Low-code and automation email template',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      file: 'power-platform-digital.md',
      tags: ['Power Platform', 'Low-code', 'Email', 'Template'],
      featured: false,
      size: '2.2 KB',
      emoji: '⚡'
    },
    {
      id: 'security',
      title: 'Security & Compliance Email',
      category: 'Templates',
      description: 'Cybersecurity and compliance email template',
      icon: Shield,
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
      file: 'security-compliance.md',
      tags: ['Security', 'Compliance', 'Email', 'Template'],
      featured: false,
      size: '2.0 KB',
      emoji: '🛡️'
    }
  ];

  const loadDocument = async (file) => {
    try {
      const response = await fetch(`/api/knowledge-base?file=${encodeURIComponent(file)}`);
      const data = await response.json();

      if (data.content) {
        setContent(data.content);
      } else {
        setContent('# Error loading document\n\nCould not load the requested document.');
      }
    } catch (error) {
      console.error('Error loading document:', error);
      setContent('# Error loading document\n\nCould not load the requested document.');
    }
  };

  useEffect(() => {
    if (selectedDoc) {
      loadDocument(selectedDoc.file);
    }
  }, [selectedDoc]);

  // Filter logic
  const filteredDocs = knowledgeBaseDocs.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTab = activeTab === 'all' || doc.category === activeTab;

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => doc.tags.includes(tag));

    return matchesSearch && matchesTab && matchesTags;
  });

  const featuredDocs = filteredDocs.filter(doc => doc.featured);
  const regularDocs = filteredDocs.filter(doc => !doc.featured);

  // Get all unique tags
  const allTags = [...new Set(knowledgeBaseDocs.flatMap(doc => doc.tags))];

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const stats = {
    total: knowledgeBaseDocs.length,
    m365: knowledgeBaseDocs.filter(d => d.category === 'M365').length,
    dynamics: knowledgeBaseDocs.filter(d => d.category === 'Dynamics').length,
    azure: knowledgeBaseDocs.filter(d => d.category === 'Azure').length,
    templates: knowledgeBaseDocs.filter(d => d.category === 'Templates').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Knowledge Base</h1>
              <p className="text-blue-100 mt-1">
                Your complete Microsoft solutions reference library
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search pricing, licensing, templates, or any topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-xl shadow-lg focus:ring-4 focus:ring-white/30 focus:outline-none text-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-5 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-sm text-blue-100">Total Documents</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{stats.m365}</div>
              <div className="text-sm text-blue-100">M365 Docs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{stats.dynamics}</div>
              <div className="text-sm text-blue-100">Dynamics Docs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{stats.azure}</div>
              <div className="text-sm text-blue-100">Azure Docs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{stats.templates}</div>
              <div className="text-sm text-blue-100">Email Templates</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {['all', 'M365', 'Dynamics', 'Azure', 'Templates'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedDoc(null); // Close any open document when switching tabs
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab === 'all' ? 'All Documents' : tab}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>

        {/* Tag Filters */}
        {selectedTags.length > 0 && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filtered by:</span>
            {selectedTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
              >
                {tag}
                <X className="w-3 h-3" />
              </button>
            ))}
            <button
              onClick={() => setSelectedTags([])}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}

        {selectedDoc ? (
          /* Document Viewer */
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <button
                onClick={() => setSelectedDoc(null)}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <Home className="w-4 h-4" />
                Knowledge Base
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-semibold">{selectedDoc.title}</span>
            </div>

            <Card className="p-8 bg-white shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${selectedDoc.color} text-white text-4xl`}>
                    {selectedDoc.emoji}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedDoc.title}</h2>
                    <p className="text-gray-600 text-lg mb-3">{selectedDoc.description}</p>
                    <div className="flex gap-2">
                      {selectedDoc.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDoc(null)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `/api/knowledge-base?file=${selectedDoc.file}`;
                      link.download = selectedDoc.file;
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Markdown Content */}
              <div className="prose prose-slate max-w-none">
                <div className="markdown-content max-h-[calc(100vh-500px)] overflow-y-auto p-6 bg-gray-50 rounded-xl">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-5 mb-3 text-gray-800 border-b-2 border-gray-200 pb-2" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2 text-gray-800" {...props} />,
                      h4: ({ node, ...props }) => <h4 className="text-lg font-semibold mt-3 mb-2 text-gray-700" {...props} />,
                      p: ({ node, ...props }) => <p className="my-3 text-gray-700 leading-relaxed" {...props} />,
                      ul: ({ node, ...props }) => <ul className="my-3 ml-6 list-disc space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="my-3 ml-6 list-decimal space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li className="text-gray-700" {...props} />,
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 shadow-sm">
                          <table className="min-w-full divide-y divide-gray-200" {...props} />
                        </div>
                      ),
                      thead: ({ node, ...props }) => <thead className="bg-gradient-to-r from-gray-50 to-gray-100" {...props} />,
                      th: ({ node, ...props }) => <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 border-b-2 border-gray-300" {...props} />,
                      td: ({ node, ...props }) => <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-200" {...props} />,
                      code: ({ node, inline, ...props }) =>
                        inline ? (
                          <code className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono" {...props} />
                        ) : (
                          <code className="block p-4 bg-gray-900 text-green-400 rounded-lg text-sm font-mono overflow-x-auto my-4 shadow-inner" {...props} />
                        ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 my-4 italic text-gray-700 rounded-r-lg" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a className="text-blue-600 hover:text-blue-800 underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />
                      ),
                      strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                      em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* Document Grid/List */
          <>
            {/* Featured Documents */}
            {featuredDocs.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <h2 className="text-2xl font-bold">Featured Documents</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {featuredDocs.map(doc => {
                    const Icon = doc.icon;
                    return (
                      <Card
                        key={doc.id}
                        className={`group cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden ${doc.bgColor}`}
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`p-4 rounded-xl bg-gradient-to-br ${doc.color} text-white transform group-hover:scale-110 transition-transform`}>
                              <Icon className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {doc.title}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {doc.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-2 flex-wrap">
                              {doc.tags.slice(0, 3).map(tag => (
                                <button
                                  key={tag}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTag(tag);
                                  }}
                                  className="px-2 py-1 bg-white/80 text-gray-700 text-xs rounded-full hover:bg-white transition-colors"
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{doc.size}</span>
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}

            {/* Regular Documents */}
            {regularDocs.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mb-4">All Documents</h2>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-4'}>
                  {regularDocs.map(doc => {
                    const Icon = doc.icon;
                    return (
                      <Card
                        key={doc.id}
                        className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-white"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <div className="p-5">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${doc.color} text-white transform group-hover:scale-110 transition-transform`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                {doc.title}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                {doc.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex gap-1 flex-wrap">
                              {doc.tags.slice(0, 2).map(tag => (
                                <button
                                  key={tag}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTag(tag);
                                  }}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}

            {filteredDocs.length === 0 && (
              <div className="text-center py-20">
                <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No documents found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filters
                </p>
                <Button onClick={() => { setSearchTerm(''); setSelectedTags([]); setActiveTab('all'); }}>
                  Clear filters
                </Button>
              </div>
            )}
          </>
        )}

        {/* Quick Links */}
        {!selectedDoc && (
          <div className="mt-12">
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-600" />
                Microsoft Official Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="https://azure.microsoft.com/pricing/calculator/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-all group"
                >
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <ExternalLink className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Azure Calculator</div>
                    <div className="text-sm text-gray-600">Pricing estimates</div>
                  </div>
                </a>
                <a
                  href="https://www.microsoft.com/microsoft-365/business/compare-all-microsoft-365-business-products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-all group"
                >
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <ExternalLink className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">M365 Comparison</div>
                    <div className="text-sm text-gray-600">Product features</div>
                  </div>
                </a>
                <a
                  href="https://www.microsoft.com/dynamics-365/pricing-overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-all group"
                >
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <ExternalLink className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Dynamics 365</div>
                    <div className="text-sm text-gray-600">Pricing overview</div>
                  </div>
                </a>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
