'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Building2, Search, X, ArrowLeft, Mail, MessageCircle,
  TrendingUp, Flame, Zap, ChevronRight, RotateCcw, Sparkles,
  Star, Clock, Activity, Filter
} from 'lucide-react';
import Link from 'next/link';
import { useLang, t } from '@/contexts/LanguageContext';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

const SEGMENT_CFG = {
  enterprise: { label: 'Enterprise', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  sme:        { label: 'SME',        color: 'bg-blue-100 text-blue-700 border-blue-200' },
  startup:    { label: 'Startup',    color: 'bg-green-100 text-green-700 border-green-200' },
};
const STATUS_CFG = {
  active:    { color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  inactive:  { color: 'bg-gray-100 text-gray-600',       dot: 'bg-gray-400' },
  converted: { color: 'bg-yellow-100 text-yellow-700',   dot: 'bg-yellow-500' },
};
const PRIORITY_CFG = {
  high:   { color: 'text-red-600',    icon: '🔴' },
  medium: { color: 'text-yellow-600', icon: '🟡' },
  low:    { color: 'text-green-600',  icon: '🟢' },
};

function timeAgo(dateStr, lang) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 3600)  return lang === 'fr' ? `${Math.floor(diff/60)} min` : `${Math.floor(diff/60)}m`;
  if (diff < 86400) return lang === 'fr' ? `${Math.floor(diff/3600)}h` : `${Math.floor(diff/3600)}h`;
  return lang === 'fr' ? `${Math.floor(diff/86400)}j` : `${Math.floor(diff/86400)}d`;
}

export default function ClientsPage() {
  const { lang } = useLang();
  const [clients, setClients]               = useState([]);
  const [selected, setSelected]             = useState(null);
  const [history, setHistory]               = useState(null);
  const [loading, setLoading]               = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [search, setSearch]                 = useState('');
  const [segFilter, setSegFilter]           = useState('all');

  useEffect(() => { loadClients(); }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/clients?limit=100');
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || data.data || []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openClient = async (client) => {
    setSelected(client);
    setHistory(null);
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/interactions?clientId=${client.id}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingHistory(false); }
  };

  const filtered = clients.filter(c => {
    const matchSeg  = segFilter === 'all' || c.segment === segFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || c.company?.toLowerCase().includes(q) || c.industry?.toLowerCase().includes(q) || c.contactName?.toLowerCase().includes(q);
    return matchSeg && matchSearch;
  });

  const totalInteractions = clients.reduce((s, c) => s + (c._count?.interactions || 0), 0);
  const highPriority = clients.filter(c => c.priority === 'high').length;
  const activeCount  = clients.filter(c => c.status === 'active').length;

  // ── Detail view ─────────────────────────────────────────────────────────────
  if (selected) {
    const seg  = SEGMENT_CFG[selected.segment] || SEGMENT_CFG.sme;
    const stat = STATUS_CFG[selected.status]   || STATUS_CFG.inactive;
    const prio = PRIORITY_CFG[selected.priority] || PRIORITY_CFG.medium;
    const patterns = history?.patterns || history?.data?.patterns;
    const interactions = history?.interactions || history?.data?.interactions || [];

    return (
      <div className="min-h-screen ms-surface">
        {/* Hero */}
        <div className="relative overflow-hidden ms-hero-bg text-white py-12 px-8">
          <div className="orb orb-blue w-60 h-60 -top-10 -left-10" />
          <div className="orb orb-purple w-48 h-48 top-0 right-8" style={{animationDelay:'2s'}} />
          <div className="relative z-10 max-w-5xl mx-auto">
            <button onClick={() => { setSelected(null); setHistory(null); }}
              className="flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              {lang === 'fr' ? 'Retour aux clients' : 'Back to clients'}
            </button>
            <div className="flex items-start gap-5">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{selected.company}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${seg.color}`}>{seg.label}</span>
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${stat.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} />
                    {selected.status}
                  </span>
                </div>
                <p className="text-blue-200 text-sm">{selected.industry}{selected.employeeCount ? ` · ${selected.employeeCount} emp.` : ''}</p>
                {selected.contactName && (
                  <p className="text-blue-300 text-sm mt-1">👤 {selected.contactName}{selected.contactRole ? ` — ${selected.contactRole}` : ''}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/email-generator`}>
                  <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold border border-white/20 transition-all">
                    <Mail className="w-4 h-4" />
                    {lang === 'fr' ? 'Email' : 'Email'}
                  </motion.button>
                </Link>
                <Link href={`/account?q=${encodeURIComponent(selected.company)}`}>
                  <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-sm font-semibold shadow-lg transition-all">
                    <Sparkles className="w-4 h-4" />
                    {lang === 'fr' ? 'Intel' : 'Intel'}
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          {/* KPI row */}
          {patterns && (
            <motion.div {...fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: lang === 'fr' ? 'Interactions' : 'Interactions', value: patterns.totalInteractions, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: lang === 'fr' ? 'Taux réponse' : 'Response rate', value: `${patterns.responseRate || 0}%`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: lang === 'fr' ? 'Positifs' : 'Positive', value: patterns.sentimentDistribution?.positive || 0, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: lang === 'fr' ? 'Dernière int.' : 'Last contact', value: patterns.lastInteraction?.daysSince != null ? `${patterns.lastInteraction.daysSince}j` : '—', color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`${bg} rounded-2xl p-5`}>
                  <p className={`text-2xl font-black ${color}`}>{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Challenges */}
          {selected.currentChallenges && (
            <motion.div {...fadeUp} transition={{delay:0.05}}
              className="bg-white rounded-2xl border border-blue-100 p-5 flex gap-3">
              <Zap className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  {lang === 'fr' ? 'Défis identifiés' : 'Identified challenges'}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">{selected.currentChallenges}</p>
              </div>
            </motion.div>
          )}

          {/* Interactions */}
          <motion.div {...fadeUp} transition={{delay:0.1}} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-5 h-5 text-blue-500" />
              <h2 className="font-bold text-gray-900">
                {lang === 'fr' ? 'Historique des interactions' : 'Interaction history'}
              </h2>
              {loadingHistory && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin ml-2" />}
            </div>

            {interactions.length === 0 && !loadingHistory ? (
              <p className="text-center text-gray-400 py-8 text-sm">
                {lang === 'fr' ? 'Aucune interaction' : 'No interactions yet'}
              </p>
            ) : (
              <div className="space-y-3">
                {interactions.map((inter) => (
                  <div key={inter.id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      inter.type === 'email'   ? 'bg-blue-100 text-blue-700' :
                      inter.type === 'call'    ? 'bg-green-100 text-green-700' :
                      inter.type === 'meeting' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-200 text-gray-700'
                    }`}>{inter.type}</div>
                    <div className="flex-1 min-w-0">
                      {inter.subject && <p className="font-medium text-gray-900 text-sm truncate">{inter.subject}</p>}
                      {inter.intent && <p className="text-xs text-gray-500 mt-0.5">{inter.intent}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {inter.responseSentiment && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          inter.responseSentiment === 'positive' ? 'bg-green-100 text-green-700' :
                          inter.responseSentiment === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'}`}>
                          {inter.responseSentiment}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(inter.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen ms-surface">
      {/* Hero */}
      <div className="relative overflow-hidden ms-hero-bg text-white py-12 px-8">
        <div className="orb orb-blue   w-64 h-64 -top-12 -left-12" />
        <div className="orb orb-purple w-48 h-48 top-0 right-12" style={{animationDelay:'2s'}} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl"><Users className="w-7 h-7" /></div>
            <div>
              <h1 className="text-3xl font-bold">{lang === 'fr' ? 'Clients' : 'Clients'}</h1>
              <p className="text-blue-200 text-sm">{lang === 'fr' ? 'Base de données & historique des interactions' : 'Database & interaction history'}</p>
            </div>
          </motion.div>

          {/* KPI chips */}
          <motion.div {...fadeUp} transition={{delay:0.08}} className="flex gap-3 mb-6 flex-wrap text-sm">
            {[
              ['👥', clients.length, lang === 'fr' ? 'Clients' : 'Clients'],
              ['✅', activeCount, lang === 'fr' ? 'Actifs' : 'Active'],
              ['🔴', highPriority, lang === 'fr' ? 'Haute priorité' : 'High priority'],
              ['💬', totalInteractions, lang === 'fr' ? 'Interactions' : 'Interactions'],
            ].map(([icon, n, label]) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <span className="mr-1">{icon}</span>
                <span className="font-bold text-lg">{n}</span>
                <span className="text-blue-200 ml-2 text-xs">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* Search */}
          <motion.div {...fadeUp} transition={{delay:0.12}} className="relative max-w-lg mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'fr' ? 'Rechercher un client…' : 'Search clients…'}
              className="w-full pl-12 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-300 transition-colors" />
            {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"><X className="w-4 h-4" /></button>}
          </motion.div>

          {/* Segment filters */}
          <motion.div {...fadeUp} transition={{delay:0.16}} className="flex gap-2 flex-wrap">
            {[['all', lang === 'fr' ? 'Tous' : 'All'], ['enterprise','Enterprise'], ['sme','SME'], ['startup','Startup']].map(([val, label]) => (
              <button key={val} onClick={() => setSegFilter(val)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${segFilter === val ? 'bg-white text-blue-700 shadow-lg' : 'bg-white/10 text-blue-100 hover:bg-white/20'}`}>
                {label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="shimmer h-44 rounded-2xl" style={{animationDelay:`${i*0.1}s`}} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div {...fadeUp} className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500">{lang === 'fr' ? 'Aucun client trouvé' : 'No clients found'}</p>
          </motion.div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5">{filtered.length} {lang === 'fr' ? 'clients' : 'clients'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((client, i) => {
                const seg  = SEGMENT_CFG[client.segment] || SEGMENT_CFG.sme;
                const stat = STATUS_CFG[client.status]   || STATUS_CFG.inactive;
                const prio = PRIORITY_CFG[client.priority] || PRIORITY_CFG.medium;
                return (
                  <motion.button key={client.id}
                    initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{delay: Math.min(i*0.04, 0.4)}}
                    onClick={() => openClient(client)}
                    className="text-left bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all group">

                    {/* Top row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{client.company}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{client.industry || '—'}</p>
                      </div>
                      <span className={`ml-2 shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border ${seg.color}`}>
                        {seg.label}
                      </span>
                    </div>

                    {/* Contact */}
                    {client.contactName && (
                      <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px]">👤</span>
                        {client.contactName}{client.contactRole ? ` · ${client.contactRole}` : ''}
                      </p>
                    )}

                    {/* Status + priority */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${stat.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} />
                        {client.status}
                      </span>
                      <span className={`text-xs font-medium ${prio.color}`}>{prio.icon} {client.priority}</span>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {client._count?.interactions || 0} {lang === 'fr' ? 'interact.' : 'interact.'}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {timeAgo(client.updatedAt || client.createdAt, lang)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
