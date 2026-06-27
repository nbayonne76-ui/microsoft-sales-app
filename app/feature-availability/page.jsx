'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid, Search, X, ChevronRight, ExternalLink,
  Shield, Mail, Archive, Share2, HardDrive, Monitor,
  Globe, BarChart2, Users, Lock, AlertTriangle,
  MessageSquare, Bot, Home,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { useLang } from '@/contexts/LanguageContext';

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const SERVICES = [
  { id: 'platform',   num: 1,  label: 'Platform M365/O365',          shortLabel: 'Platform',      icon: Globe,         color: 'from-blue-500 to-indigo-600',    bg: 'bg-blue-50',    text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700 border-blue-200'   },
  { id: 'copilot',    num: 2,  label: 'Microsoft 365 Copilot',        shortLabel: 'Copilot',       icon: Bot,           color: 'from-violet-500 to-purple-600',  bg: 'bg-violet-50',  text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700 border-violet-200'},
  { id: 'teams',      num: 3,  label: 'Microsoft Teams',              shortLabel: 'Teams',         icon: MessageSquare, color: 'from-purple-500 to-indigo-500',  bg: 'bg-purple-50',  text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700 border-purple-200'},
  { id: 'exchange',   num: 4,  label: 'Exchange Online',              shortLabel: 'Exchange',      icon: Mail,          color: 'from-sky-500 to-blue-600',       bg: 'bg-sky-50',     text: 'text-sky-700',    badge: 'bg-sky-100 text-sky-700 border-sky-200'      },
  { id: 'archiving',  num: 5,  label: 'Exchange Online Archiving',    shortLabel: 'Archiving',     icon: Archive,       color: 'from-teal-500 to-cyan-600',      bg: 'bg-teal-50',    text: 'text-teal-700',   badge: 'bg-teal-100 text-teal-700 border-teal-200'   },
  { id: 'sharepoint', num: 6,  label: 'SharePoint Online',           shortLabel: 'SharePoint',    icon: Share2,        color: 'from-orange-500 to-amber-600',   bg: 'bg-orange-50',  text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700 border-orange-200'},
  { id: 'onedrive',   num: 7,  label: 'OneDrive for Business',       shortLabel: 'OneDrive',      icon: HardDrive,     color: 'from-cyan-500 to-blue-500',      bg: 'bg-cyan-50',    text: 'text-cyan-700',   badge: 'bg-cyan-100 text-cyan-700 border-cyan-200'   },
  { id: 'office-apps',num: 8,  label: 'Office Applications Desktop', shortLabel: 'Office Apps',   icon: Monitor,       color: 'from-red-500 to-rose-600',       bg: 'bg-red-50',     text: 'text-red-700',    badge: 'bg-red-100 text-red-700 border-red-200'      },
  { id: 'office-web', num: 9,  label: 'Office for the Web',          shortLabel: 'Office Web',    icon: Globe,         color: 'from-emerald-500 to-green-600',  bg: 'bg-emerald-50', text: 'text-emerald-700',badge: 'bg-emerald-100 text-emerald-700 border-emerald-200'},
  { id: 'powerbi',    num: 10, label: 'Power BI',                    shortLabel: 'Power BI',      icon: BarChart2,     color: 'from-yellow-500 to-orange-500',  bg: 'bg-yellow-50',  text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200'},
  { id: 'viva',       num: 11, label: 'Microsoft Viva',              shortLabel: 'Viva',          icon: Users,         color: 'from-pink-500 to-rose-500',      bg: 'bg-pink-50',    text: 'text-pink-700',   badge: 'bg-pink-100 text-pink-700 border-pink-200'   },
  { id: 'entra',      num: 12, label: 'Microsoft Entra',             shortLabel: 'Entra',         icon: Lock,          color: 'from-indigo-500 to-blue-700',    bg: 'bg-indigo-50',  text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200'},
  { id: 'defender',   num: 13, label: 'Defender for Office 365',     shortLabel: 'Defender',      icon: Shield,        color: 'from-red-600 to-rose-700',       bg: 'bg-red-50',     text: 'text-red-700',    badge: 'bg-red-100 text-red-700 border-red-200'      },
];

function parseSection(fullContent, serviceNum) {
  if (!fullContent) return '';
  // Split by ## N. headers
  const lines = fullContent.split('\n');
  const startMarker = `## ${serviceNum}.`;
  const nextMarker = `## ${serviceNum + 1}.`;
  let inSection = false;
  const sectionLines = [];

  for (const line of lines) {
    if (line.startsWith(startMarker)) { inSection = true; }
    if (inSection && line.startsWith(nextMarker)) break;
    if (inSection) sectionLines.push(line);
  }
  return sectionLines.join('\n').trim();
}

const MD_COMPONENTS = {
  h1: p => <h1 className="text-2xl font-bold mt-6 mb-3 text-gray-900" {...p} />,
  h2: p => <h2 className="text-xl font-bold mt-5 mb-2 text-gray-800 border-b border-gray-200 pb-2" {...p} />,
  h3: p => <h3 className="text-base font-bold mt-4 mb-2 text-gray-800" {...p} />,
  p:  p => <p className="my-2 text-gray-700 leading-relaxed text-sm" {...p} />,
  ul: p => <ul className="my-2 ml-5 list-disc space-y-1" {...p} />,
  ol: p => <ol className="my-2 ml-5 list-decimal space-y-1" {...p} />,
  li: p => <li className="text-gray-700 text-sm" {...p} />,
  table: p => (
    <div className="overflow-x-auto my-4 rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200" {...p} />
    </div>
  ),
  thead: p => <thead className="bg-gradient-to-r from-gray-50 to-gray-100" {...p} />,
  th: p => <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" {...p} />,
  td: ({ children, ...p }) => {
    const text = typeof children === 'string' ? children : '';
    const isOui = text === 'Oui' || text === 'Yes';
    const isNon = text === 'Non' || text === 'No' || text === 'Non disponible' || text === '❌';
    return (
      <td className={`px-4 py-2.5 text-sm border-b border-gray-100 ${isOui ? 'text-emerald-700 font-semibold' : isNon ? 'text-red-500' : 'text-gray-700'}`} {...p}>
        {children}
      </td>
    );
  },
  strong: p => <strong className="font-bold text-gray-900" {...p} />,
  blockquote: p => <blockquote className="border-l-4 border-blue-300 pl-4 my-3 text-gray-600 italic text-sm" {...p} />,
  hr: () => <hr className="my-4 border-gray-200" />,
};

export default function FeatureAvailabilityPage() {
  const { lang } = useLang();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(SERVICES[0]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/knowledge-base?file=m365-feature-availability-official.md')
      .then(r => r.json())
      .then(d => { setContent(d.content || ''); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const sectionContent = useMemo(
    () => parseSection(content, selected.num),
    [content, selected.num]
  );

  const filteredContent = useMemo(() => {
    if (!search.trim()) return sectionContent;
    const lower = search.toLowerCase();
    const lines = sectionContent.split('\n');
    // Keep heading lines + lines that match search
    return lines.filter(l =>
      l.startsWith('#') || l.toLowerCase().includes(lower)
    ).join('\n');
  }, [sectionContent, search]);

  const Icon = selected.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* ── Hero ──────────────────────────────────────────── */}
      <div className={`bg-gradient-to-r ${selected.color} text-white px-6 py-8`}>
        <motion.div {...fadeUp} className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" /> Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-medium">Feature Availability</span>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <LayoutGrid className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Feature Availability M365</h1>
              <p className="text-white/80 text-sm">
                {lang === 'fr'
                  ? '13 services • Disponibilité officielle par plan • Source Microsoft Learn'
                  : '13 services • Official feature availability by plan • Source Microsoft Learn'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {[
              ['13', lang === 'fr' ? 'Services' : 'Services'],
              ['Juin 2026', lang === 'fr' ? 'Mis à jour' : 'Updated'],
              ['Microsoft Learn', lang === 'fr' ? 'Source officielle' : 'Official source'],
            ].map(([n, l]) => (
              <div key={l} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
                <span className="font-bold">{n}</span>
                <span className="text-white/70 ml-2">{l}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ── Service tabs ───────────────────────────────────── */}
        <motion.div {...fadeUp} transition={{ delay: 0.05 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {lang === 'fr' ? 'Sélectionner un service' : 'Select a service'}
          </p>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map(svc => {
              const SvcIcon = svc.icon;
              const isActive = selected.id === svc.id;
              return (
                <button
                  key={svc.id}
                  onClick={() => { setSelected(svc); setSearch(''); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${svc.color} text-white border-transparent shadow-md`
                      : `bg-white ${svc.text} ${svc.badge} hover:shadow-sm`
                  }`}
                >
                  <SvcIcon className="w-3.5 h-3.5 shrink-0" />
                  {svc.shortLabel}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Content area ───────────────────────────────────── */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Header */}
          <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-2xl bg-gradient-to-r ${selected.color}`}>
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-xl">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base">{selected.label}</h2>
                <p className="text-white/70 text-xs">
                  {lang === 'fr' ? 'Disponibilité par plan Microsoft 365' : 'Microsoft 365 plan availability'}
                </p>
              </div>
            </div>
            <a
              href="https://learn.microsoft.com/en-us/office365/servicedescriptions/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white/70 hover:text-white text-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {lang === 'fr' ? 'Source' : 'Source'}
            </a>
          </div>

          {/* Search */}
          <div className="px-6 py-3 border-b border-gray-100">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'fr' ? `Rechercher dans ${selected.shortLabel}…` : `Search in ${selected.shortLabel}…`}
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Markdown content */}
          <div className="p-6 overflow-x-auto">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loader" {...fadeUp} className="space-y-3 py-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-4 rounded-lg bg-gray-100 animate-pulse ${i % 3 === 0 ? 'w-3/4' : i % 3 === 1 ? 'w-full' : 'w-5/6'}`} />
                  ))}
                </motion.div>
              ) : !sectionContent ? (
                <motion.div key="empty" {...fadeUp} className="text-center py-12 text-gray-400">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">{lang === 'fr' ? 'Section introuvable' : 'Section not found'}</p>
                </motion.div>
              ) : (
                <motion.div key={selected.id + search} {...fadeUp} className="prose prose-slate max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
                    {filteredContent}
                  </ReactMarkdown>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Quick navigation ────────────────────────────────── */}
        <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SERVICES.filter(s => s.id !== selected.id).slice(0, 4).map(svc => {
            const SvcIcon = svc.icon;
            return (
              <button
                key={svc.id}
                onClick={() => { setSelected(svc); setSearch(''); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all hover:shadow-sm ${svc.badge}`}
              >
                <SvcIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{svc.shortLabel}</span>
                <ChevronRight className="w-3 h-3 ml-auto shrink-0 opacity-50" />
              </button>
            );
          })}
        </motion.div>

        {/* Source note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          {lang === 'fr'
            ? 'Données extraites depuis Microsoft Learn Service Descriptions — Juin 2026'
            : 'Data extracted from Microsoft Learn Service Descriptions — June 2026'}
        </p>
      </div>
    </div>
  );
}
