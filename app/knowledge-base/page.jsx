'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, X, ChevronRight, Home, Download,
  Brain, Shield, Database, Server, LineChart, Cog, Network,
  Building2, DollarSign, Zap, Star, CheckCircle, TrendingUp, Award
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

const CATEGORY_CONFIG = {
  ai:          { label: 'AI & ML',        icon: Brain,     color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50',  text: 'text-purple-700' },
  compute:     { label: 'Compute',        icon: Server,    color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50',  text: 'text-orange-700' },
  storage:     { label: 'Storage',        icon: Database,  color: 'from-green-500 to-green-600',  bg: 'bg-green-50',   text: 'text-green-700'  },
  analytics:   { label: 'Analytics',      icon: LineChart, color: 'from-blue-500 to-blue-600',    bg: 'bg-blue-50',    text: 'text-blue-700'   },
  security:    { label: 'Security',       icon: Shield,    color: 'from-red-500 to-red-600',      bg: 'bg-red-50',     text: 'text-red-700'    },
  networking:  { label: 'Networking',     icon: Network,   color: 'from-cyan-500 to-cyan-600',    bg: 'bg-cyan-50',    text: 'text-cyan-700'   },
  business:    { label: 'Business Apps',  icon: Building2, color: 'from-indigo-500 to-indigo-600',bg: 'bg-indigo-50',  text: 'text-indigo-700' },
  management:  { label: 'Management',     icon: Cog,       color: 'from-yellow-500 to-yellow-600',bg: 'bg-yellow-50',  text: 'text-yellow-700' },
  development: { label: 'Development',    icon: Cog,       color: 'from-violet-500 to-violet-600',bg: 'bg-violet-50',  text: 'text-violet-700' },
  integration: { label: 'Integration',    icon: Cog,       color: 'from-teal-500 to-teal-600',   bg: 'bg-teal-50',    text: 'text-teal-700'   },
  iot:         { label: 'IoT',            icon: Network,   color: 'from-lime-500 to-lime-600',   bg: 'bg-lime-50',    text: 'text-lime-700'   },
};

const KB_DOCS = [
  { id: 'm365-pricing',    title: 'M365 Pricing 2025',        file: 'm365-pricing-2025.md',                  category: 'M365',     emoji: '💼', featured: true  },
  { id: 'e3-vs-e5',        title: 'M365 E3 vs E5 Guide',      file: 'm365-e3-vs-e5-decision-guide.md',       category: 'M365',     emoji: '📊', featured: true  },
  { id: 'licensing',       title: 'Licensing & Contracts',     file: 'microsoft-licensing-contracts-guide.md',category: 'M365',     emoji: '📄', featured: true  },
  { id: 'csp-vs-mca',      title: 'CSP vs MCA Decision',      file: 'csp-vs-mca-decision-guide.md',          category: 'M365',     emoji: '🤝', featured: false },
  { id: 'm365-collab',     title: 'M365 Collaboration',       file: 'microsoft-365-collaboration.md',        category: 'M365',     emoji: '✨', featured: false },
  { id: 'azure-pricing',   title: 'Azure Pricing 2025',       file: 'azure-pricing-2025.md',                 category: 'Azure',    emoji: '☁️', featured: true  },
  { id: 'azure-migration', title: 'Azure Migration',          file: 'azure-migration.md',                    category: 'Azure',    emoji: '🚀', featured: false },
  { id: 'dynamics',        title: 'Dynamics 365 Pricing',     file: 'dynamics-365-pricing-2025.md',          category: 'Dynamics', emoji: '🎯', featured: true  },
  { id: 'power',           title: 'Power Platform',           file: 'power-platform-digital.md',            category: 'Power',    emoji: '⚡', featured: false },
  { id: 'security',        title: 'Security & Compliance',    file: 'security-compliance.md',               category: 'Security', emoji: '🛡️', featured: false },
  { id: 'bundles',         title: 'Solution Bundles & ROI',   file: 'solution-bundles-pricing.md',           category: 'Bundles',  emoji: '🎁', featured: false },
  { id: 'pricing-guide',   title: 'Full Pricing Guide 2025',  file: 'microsoft-pricing-guide-2025.md',       category: 'Bundles',  emoji: '📋', featured: true  },
];

const DOC_CATEGORIES = ['All','M365','Azure','Dynamics','Power','Security','Bundles'];

export default function KnowledgeBasePage() {
  const [tab, setTab]             = useState('azure');
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [catFilter, setCatFilter] = useState('all');
  const [search, setSearch]       = useState('');
  const [selectedSol, setSelectedSol] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docContent, setDocContent]   = useState('');
  const [docFilter, setDocFilter]     = useState('All');

  useEffect(() => {
    fetch('/api/azure-solutions')
      .then(r => r.json())
      .then(d => { setSolutions(d.solutions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedDoc) return;
    setDocContent('');
    fetch('/api/knowledge-base?file=' + encodeURIComponent(selectedDoc.file))
      .then(r => r.json())
      .then(d => setDocContent(d.content || ''))
      .catch(() => setDocContent('# Error loading document'));
  }, [selectedDoc]);

  const filteredSolutions = solutions.filter(s => {
    const matchCat    = catFilter === 'all' || s.category === catFilter;
    const matchSearch = !search ||
      (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.shortDescription || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.officialName || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredDocs = KB_DOCS.filter(d =>
    (docFilter === 'All' || d.category === docFilter) &&
    (!search || d.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative overflow-hidden text-white py-12 px-8" style={{background:'linear-gradient(135deg,#0f172a 0%,#1e1b4b 45%,#0f172a 100%)'}}>
        <div className="orb orb-blue   w-64 h-64 -top-12 -left-12" />
        <div className="orb orb-purple w-48 h-48 top-0 right-12" style={{animationDelay:'2s'}} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl"><BookOpen className="w-7 h-7" /></div>
            <div>
              <h1 className="text-3xl font-bold">Knowledge Base</h1>
              <p className="text-blue-200 text-sm">Microsoft solutions · pricing · strategies</p>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{delay:0.08}} className="flex gap-4 mb-6 text-sm flex-wrap">
            {[['☁️', solutions.length || 62, 'Azure Solutions'],['📄', KB_DOCS.length, 'Pricing Guides'],['📅', '2025', 'Up to date']].map(([icon,n,label]) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <span className="mr-1">{icon}</span><span className="font-bold text-lg">{n}</span>
                <span className="text-blue-200 ml-2 text-xs">{label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div {...fadeUp} transition={{delay:0.12}} className="relative max-w-xl mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search solutions, pricing, features…"
              className="w-full pl-12 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-300 transition-colors" />
            {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"><X className="w-4 h-4" /></button>}
          </motion.div>

          <motion.div {...fadeUp} transition={{delay:0.16}} className="flex gap-2">
            {[['azure','☁️ Azure Solutions'],['docs','📄 Pricing Guides']].map(([t,label]) => (
              <button key={t} onClick={() => setTab(t)}
                className={'px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ' + (tab===t ? 'bg-white text-blue-700 shadow-lg' : 'bg-white/10 text-blue-100 hover:bg-white/20')}>
                {label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">

          {/* Azure solutions list */}
          {tab==='azure' && !selectedSol && (
            <motion.div key="azure-list" {...fadeUp} initial="initial" animate="animate">
              <div className="flex flex-wrap gap-2 mb-5">
                {['all',...Object.keys(CATEGORY_CONFIG)].map(cat => {
                  const cfg = CATEGORY_CONFIG[cat];
                  const Icon = cfg?.icon;
                  return (
                    <button key={cat} onClick={() => setCatFilter(cat)}
                      className={'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ' +
                        (catFilter===cat ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md'
                                         : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300')}>
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      {cfg?.label || 'All Solutions'}
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500 mb-4">{loading ? 'Loading…' : filteredSolutions.length + ' solutions'}</p>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[...Array(9)].map((_,i) => <div key={i} className="shimmer h-40 rounded-2xl" />)}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredSolutions.map((sol, i) => {
                    const cfg = CATEGORY_CONFIG[sol.category] || CATEGORY_CONFIG.compute;
                    const Icon = cfg.icon;
                    return (
                      <motion.button key={sol.id} onClick={() => setSelectedSol(sol)}
                        initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:Math.min(i*0.03,0.4)}}
                        className="text-left bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all group">
                        <div className="flex items-start justify-between mb-3">
                          <div className={'p-2.5 rounded-xl bg-gradient-to-br text-white group-hover:scale-110 transition-transform ' + cfg.color}><Icon className="w-5 h-5" /></div>
                          <div className="flex gap-1">
                            {sol.isFeatured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                            {sol.salesPriority >= 8 && <TrendingUp className="w-4 h-4 text-green-500" />}
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{sol.officialName || sol.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{sol.shortDescription}</p>
                        {sol.estimatedCost && (
                          <div className={'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ' + cfg.bg + ' ' + cfg.text}>
                            <DollarSign className="w-3 h-3" />
                            <span className="truncate max-w-32">{sol.estimatedCost.split(' à ')[0].replace('À partir de ','').replace('From ','')}</span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Solution detail */}
          {tab==='azure' && selectedSol && (
            <motion.div key="sol-detail" {...fadeUp} initial="initial" animate="animate">
              <button onClick={() => setSelectedSol(null)} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm mb-6">
                <Home className="w-4 h-4" /> Back to solutions
              </button>
              {(() => {
                const cfg = CATEGORY_CONFIG[selectedSol.category] || CATEGORY_CONFIG.compute;
                const Icon = cfg.icon;
                return (
                  <div className="space-y-5">
                    <div className="gradient-border">
                      <div className="bg-white rounded-2xl p-7">
                        <div className="flex items-start gap-5">
                          <div className={'p-4 rounded-2xl bg-gradient-to-br text-white shrink-0 ' + cfg.color}><Icon className="w-8 h-8" /></div>
                          <div>
                            <div className="flex gap-2 mb-2">
                              <span className={'px-2.5 py-1 rounded-lg text-xs font-semibold ' + cfg.bg + ' ' + cfg.text}>{cfg.label}</span>
                              {selectedSol.isFeatured && <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-yellow-50 text-yellow-700">⭐ Featured</span>}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSol.officialName || selectedSol.name}</h2>
                            <p className="text-gray-600 leading-relaxed">{selectedSol.fullDescription || selectedSol.shortDescription}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="gradient-border-green">
                        <div className="bg-white rounded-2xl p-5">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-500" /> Pricing</p>
                          <p className="text-sm font-semibold text-emerald-700 mb-2">{selectedSol.pricingModel}</p>
                          <p className="text-sm text-gray-600">{selectedSol.estimatedCost}</p>
                          {selectedSol.implementationTime && <p className="text-xs text-gray-400 mt-2">Setup: {selectedSol.implementationTime}</p>}
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-blue-500" /> Use Cases</p>
                        <ul className="space-y-1.5">
                          {(selectedSol.useCases||[]).slice(0,5).map((u,i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />{u}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Building2 className="w-4 h-4 text-purple-500" /> Target</p>
                        {selectedSol.idealCustomerSize && <p className="text-xs text-gray-600 mb-2"><strong>Size:</strong> {selectedSol.idealCustomerSize}</p>}
                        <div className="flex flex-wrap gap-1">
                          {(selectedSol.targetIndustries||[]).slice(0,6).map((ind,i) => (
                            <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full">{ind}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {selectedSol.keyFeatures?.length > 0 && (
                      <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5"><Zap className="w-4 h-4 text-yellow-500" /> Key Features</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {selectedSol.keyFeatures.slice(0,12).map((f,i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{(typeof f==='string' ? f.split(' - ')[0] : f)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedSol.benefits?.length > 0 && (
                      <div className="gradient-border">
                        <div className="bg-white rounded-2xl p-6">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5"><Award className="w-4 h-4 text-blue-500" /> Business Benefits</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedSol.benefits.map((b,i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-gray-700"><TrendingUp className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />{b}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* Docs list */}
          {tab==='docs' && !selectedDoc && (
            <motion.div key="docs-list" {...fadeUp} initial="initial" animate="animate">
              <div className="flex flex-wrap gap-2 mb-6">
                {DOC_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setDocFilter(cat)}
                    className={'px-4 py-2 rounded-xl text-sm font-medium border transition-all ' +
                      (docFilter===cat ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md'
                                       : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300')}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {filteredDocs.filter(d => d.featured).map((doc, i) => (
                  <motion.button key={doc.id} onClick={() => setSelectedDoc(doc)}
                    initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                    className="text-left gradient-border group">
                    <div className="bg-white rounded-2xl p-5 hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{doc.emoji}</span>
                        <div>
                          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">{doc.category}</span>
                          <div className="flex items-center gap-1 mt-0.5"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><span className="text-xs text-gray-400">Featured</span></div>
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{doc.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{doc.file}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredDocs.filter(d => !d.featured).map((doc, i) => (
                  <motion.button key={doc.id} onClick={() => setSelectedDoc(doc)}
                    initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                    className="text-left bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all group">
                    <div className="text-2xl mb-2">{doc.emoji}</div>
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors mb-1">{doc.title}</h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{doc.category}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Doc viewer */}
          {tab==='docs' && selectedDoc && (
            <motion.div key="doc-viewer" {...fadeUp} initial="initial" animate="animate">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                <button onClick={() => { setSelectedDoc(null); setDocContent(''); }} className="flex items-center gap-1 hover:text-blue-600"><Home className="w-4 h-4" /> Knowledge Base</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-900 font-semibold">{selectedDoc.title}</span>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedDoc.emoji}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedDoc.title}</h2>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">{selectedDoc.category}</span>
                    </div>
                  </div>
                  <button onClick={() => { const a=document.createElement('a'); a.href='/api/knowledge-base?file='+selectedDoc.file; a.download=selectedDoc.file; a.click(); }}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300">
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
                {!docContent ? (
                  <div className="space-y-3"><div className="shimmer h-6 rounded-lg w-3/4" /><div className="shimmer h-4 rounded-lg" /><div className="shimmer h-4 rounded-lg w-5/6" /></div>
                ) : (
                  <div className="prose prose-slate max-w-none max-h-screen overflow-y-auto pr-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}
                      components={{
                        h1: (p) => <h1 className="text-2xl font-bold mt-6 mb-3 text-gray-900" {...p} />,
                        h2: (p) => <h2 className="text-xl font-bold mt-5 mb-2 text-gray-800 border-b border-gray-200 pb-2" {...p} />,
                        h3: (p) => <h3 className="text-lg font-bold mt-4 mb-2 text-gray-800" {...p} />,
                        p:  (p) => <p className="my-2 text-gray-700 leading-relaxed text-sm" {...p} />,
                        ul: (p) => <ul className="my-2 ml-5 list-disc space-y-1" {...p} />,
                        li: (p) => <li className="text-gray-700 text-sm" {...p} />,
                        table: (p) => <div className="overflow-x-auto my-4 rounded-xl border border-gray-200"><table className="min-w-full divide-y divide-gray-200" {...p} /></div>,
                        thead: (p) => <thead className="bg-gray-50" {...p} />,
                        th: (p) => <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" {...p} />,
                        td: (p) => <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100" {...p} />,
                        code: ({inline, ...p}) => inline
                          ? <code className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-mono" {...p} />
                          : <code className="block p-4 bg-gray-900 text-green-400 rounded-xl text-xs font-mono overflow-x-auto my-3" {...p} />,
                        strong: (p) => <strong className="font-bold text-gray-900" {...p} />,
                      }}
                    >{docContent}</ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
