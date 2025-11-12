'use client';

import { useState } from 'react';
import { Sparkles, Palette, Layout, Type, Grid, ChevronDown, ChevronUp, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * UI Designer Agent Component
 * Demonstrates parallel multi-agent design generation
 */
export default function UIDesignerAgent() {
  const [designBrief, setDesignBrief] = useState({
    industry: 'technology',
    pageType: 'landing',
    brandPersonality: 'modern',
    mood: 'professional',
    contentDensity: 'medium',
    targetDevice: 'desktop',
    targetAudience: 'B2B professionals',
    accessibility: 'WCAG 2.1 AA',
    interactionStyle: 'modern'
  });

  const [designs, setDesigns] = useState([]);
  const [agentOutputs, setAgentOutputs] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedDesign, setExpandedDesign] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);

  const generateDesigns = async () => {
    setIsGenerating(true);
    setDesigns([]);
    setAgentOutputs(null);

    try {
      console.log('🎨 Generating designs with brief:', designBrief);

      const response = await fetch('/api/ui-designer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designBrief)
      });

      const result = await response.json();

      if (result.success) {
        setDesigns(result.designs);
        setAgentOutputs(result.agentOutputs);
        setMetadata(result.metadata);

        toast.success(
          `✨ Generated ${result.designs.length} design options in ${result.metadata.totalTime}!`,
          { duration: 4000 }
        );
      } else {
        toast.error(`Failed to generate designs: ${result.error}`);
      }
    } catch (error) {
      console.error('Design generation error:', error);
      toast.error('An error occurred while generating designs');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleDesignExpansion = (designId) => {
    setExpandedDesign(expandedDesign === designId ? null : designId);
  };

  const selectDesign = (designId) => {
    setSelectedDesign(designId);
    toast.success('Design selected! You can now export or customize it.', { duration: 3000 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI UI Designer
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Parallel Multi-Agent Design Generation System
          </p>
          <div className="mt-2 flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Palette className="w-4 h-4" />
              <span>Color Agent</span>
            </div>
            <div className="flex items-center gap-1">
              <Layout className="w-4 h-4" />
              <span>Layout Agent</span>
            </div>
            <div className="flex items-center gap-1">
              <Type className="w-4 h-4" />
              <span>Typography Agent</span>
            </div>
            <div className="flex items-center gap-1">
              <Grid className="w-4 h-4" />
              <span>Component Agent</span>
            </div>
          </div>
        </div>

        {/* Design Brief Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Design Brief
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Industry */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industry
              </label>
              <select
                value={designBrief.industry}
                onChange={(e) => setDesignBrief({ ...designBrief, industry: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="retail">Retail</option>
                <option value="education">Education</option>
              </select>
            </div>

            {/* Page Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Page Type
              </label>
              <select
                value={designBrief.pageType}
                onChange={(e) => setDesignBrief({ ...designBrief, pageType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="landing">Landing Page</option>
                <option value="dashboard">Dashboard</option>
                <option value="product">Product Page</option>
                <option value="blog">Blog</option>
                <option value="app">Application</option>
              </select>
            </div>

            {/* Brand Personality */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brand Personality
              </label>
              <select
                value={designBrief.brandPersonality}
                onChange={(e) => setDesignBrief({ ...designBrief, brandPersonality: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="modern">Modern</option>
                <option value="elegant">Elegant</option>
                <option value="playful">Playful</option>
                <option value="professional">Professional</option>
                <option value="tech">Tech-focused</option>
              </select>
            </div>

            {/* Mood */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mood
              </label>
              <select
                value={designBrief.mood}
                onChange={(e) => setDesignBrief({ ...designBrief, mood: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="luxurious">Luxurious</option>
                <option value="energetic">Energetic</option>
                <option value="calm">Calm</option>
              </select>
            </div>

            {/* Content Density */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content Density
              </label>
              <select
                value={designBrief.contentDensity}
                onChange={(e) => setDesignBrief({ ...designBrief, contentDensity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="low">Low (spacious)</option>
                <option value="medium">Medium (balanced)</option>
                <option value="high">High (compact)</option>
              </select>
            </div>

            {/* Target Device */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Device
              </label>
              <select
                value={designBrief.targetDevice}
                onChange={(e) => setDesignBrief({ ...designBrief, targetDevice: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="desktop">Desktop</option>
                <option value="tablet">Tablet</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={generateDesigns}
              disabled={isGenerating}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Designs...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Design Options
                </>
              )}
            </button>
          </div>
        </div>

        {/* Agent Execution Metadata */}
        {metadata && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8 border border-purple-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ Parallel Agent Execution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Time</p>
                <p className="text-2xl font-bold text-purple-600">{metadata.totalTime}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Agents Used</p>
                <p className="text-2xl font-bold text-blue-600">{metadata.parallelAgents}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Designs Generated</p>
                <p className="text-2xl font-bold text-green-600">{designs.length}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Execution Mode</p>
                <p className="text-sm font-bold text-purple-600">PARALLEL</p>
              </div>
            </div>
          </div>
        )}

        {/* Generated Designs */}
        {designs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🎨 Generated Design Options ({designs.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design, index) => (
                <div
                  key={design.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all ${
                    selectedDesign === design.id ? 'ring-4 ring-purple-500' : ''
                  }`}
                >
                  {/* Design Preview */}
                  <div
                    className="h-48 p-6 relative"
                    style={{
                      background: design.preview?.gradient || design.preview?.css['--color-primary'],
                      color: '#fff'
                    }}
                  >
                    <div className="absolute top-4 right-4">
                      <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-bold">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-black bg-opacity-30 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Score: {design.score}
                      </span>
                    </div>

                    <div className="mt-16">
                      <h3
                        className="text-2xl font-bold mb-2"
                        style={{ fontFamily: design.typography?.fonts.primary }}
                      >
                        {design.name}
                      </h3>
                      <p className="text-sm opacity-90">Design System Preview</p>
                    </div>
                  </div>

                  {/* Design Details */}
                  <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">{design.description}</p>

                    {/* Color Scheme */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">Color Scheme</p>
                      <div className="flex gap-2">
                        {Object.entries(design.colorScheme?.colors || {}).slice(0, 4).map(([name, color]) => (
                          <div
                            key={name}
                            className="w-8 h-8 rounded-full border-2 border-gray-200"
                            style={{ background: color }}
                            title={name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Ranking Scores */}
                    {design.ranking && (
                      <div className="mb-4">
                        <button
                          onClick={() => toggleDesignExpansion(design.id)}
                          className="text-xs font-semibold text-purple-600 flex items-center gap-1 mb-2"
                        >
                          {expandedDesign === design.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          View Scoring Details
                        </button>

                        {expandedDesign === design.id && (
                          <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                            {Object.entries(design.ranking).map(([key, value]) => (
                              <div key={key}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                  <span className="font-bold text-purple-600">{value}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                    style={{ width: `${value}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Select Button */}
                    <button
                      onClick={() => selectDesign(design.id)}
                      className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        selectedDesign === design.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {selectedDesign === design.id && <Check className="w-5 h-5" />}
                      {selectedDesign === design.id ? 'Selected' : 'Select Design'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
