'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Search, Building2, Sparkles, Mail, Globe, Wifi,
  TrendingUp, TrendingDown, Shield, Zap, ChevronRight,
  RotateCcw, Lightbulb, Star, AlertTriangle, CheckCircle,
  Target, Users, DollarSign, Cpu, Leaf, Scale, BarChart3,
  Flame, Eye, ArrowRight, RadioTower, Download, Clock, Trash2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useLang, t } from '@/contexts/LanguageContext';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.07 } } };

function AnimatedScore({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, v => Math.round(v));
  if (inView) raw.set(value);
  return <motion.span ref={ref}>{display}</motion.span>;
}

const CAT_COLORS = {
  m365:     'from-blue-500 to-indigo-600',
  azure:    'from-sky-500 to-blue-600',
  dynamics: 'from-orange-500 to-red-500',
  power:    'from-yellow-500 to-orange-500',
  security: 'from-red-500 to-rose-600',
};
const CAT_EMOJI = { m365: '💼', azure: '☁️', dynamics: '🎯', power: '⚡', security: '🛡️' };

const PRIORITY_COLORS = {
  'must-have': 'bg-red-100 text-red-700 border-red-200',
  'high':      'bg-orange-100 text-orange-700 border-orange-200',
  'medium':    'bg-blue-100 text-blue-700 border-blue-200',
};

const PESTEL_CONFIG = [
  { key: 'political',    label: 'Politique',      icon: Scale,      color: 'border-purple-300 bg-purple-50',  text: 'text-purple-700', iconColor: 'text-purple-500' },
  { key: 'economic',     label: 'Économique',     icon: DollarSign, color: 'border-blue-300 bg-blue-50',      text: 'text-blue-700',   iconColor: 'text-blue-500'   },
  { key: 'social',       label: 'Social',         icon: Users,      color: 'border-green-300 bg-green-50',    text: 'text-green-700',  iconColor: 'text-green-500'  },
  { key: 'technological',label: 'Technologique',  icon: Cpu,        color: 'border-indigo-300 bg-indigo-50',  text: 'text-indigo-700', iconColor: 'text-indigo-500' },
  { key: 'environmental',label: 'Environnemental',icon: Leaf,       color: 'border-emerald-300 bg-emerald-50',text: 'text-emerald-700',iconColor: 'text-emerald-500'},
  { key: 'legal',        label: 'Légal',          icon: Shield,     color: 'border-rose-300 bg-rose-50',      text: 'text-rose-700',   iconColor: 'text-rose-500'   },
];

const SWOT_CONFIG = [
  { key: 'strengths',    label: 'Forces',        icon: TrendingUp,   color: 'border-green-300 bg-green-50/60',   header: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500'  },
  { key: 'weaknesses',   label: 'Faiblesses',    icon: TrendingDown, color: 'border-red-300 bg-red-50/60',       header: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-500'    },
  { key: 'opportunities',label: 'Opportunités',  icon: Lightbulb,    color: 'border-blue-300 bg-blue-50/60',     header: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-500'   },
  { key: 'threats',      label: 'Menaces',       icon: AlertTriangle,color: 'border-orange-300 bg-orange-50/60', header: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
];

// Map free-text solution description → KB category id
function guessCategory(text) {
  const t = (text || '').toLowerCase();
  if (t.includes('azure') || t.includes('cloud') || t.includes('vm') || t.includes('migration')) return 'azure';
  if (t.includes('dynamics') || t.includes('crm') || t.includes('erp') || t.includes('business central')) return 'dynamics';
  if (t.includes('power bi') || t.includes('power apps') || t.includes('power automate') || t.includes('power platform')) return 'power';
  if (t.includes('security') || t.includes('defender') || t.includes('sentinel') || t.includes('purview')) return 'security';
  if (t.includes('bundle') || t.includes('roi') || t.includes('tco')) return 'bundles';
  return 'm365';
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ title, icon: Icon, color = 'text-gray-700', children, badge }) {
  return (
    <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${color}`} />
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        </div>
        {badge && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{badge}</span>}
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AccountIntelPage() {
  const { lang } = useLang();
  const [query, setQuery]     = useState('');
  const [intel, setIntel]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [webUsed, setWebUsed]       = useState(false);
  const [sourcesUsed, setSourcesUsed] = useState({});
  const [snippetCount, setSnippetCount] = useState(0);
  const [error, setError] = useState(null); // { type, message, hint }

  // Persistent history (localStorage) — useEffect évite l'incompatibilité SSR
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('accountIntelHistory') || '[]');
      setHistory(saved);
    } catch {}
  }, []);

  const saveToHistory = (q, data) => {
    const entry = { id: Date.now(), query: q, date: new Date().toISOString(), intel: data, company: data.company?.name || q };
    const updated = [entry, ...history].slice(0, 10);
    setHistory(updated);
    try { localStorage.setItem('accountIntelHistory', JSON.stringify(updated)); } catch {}
  };
  const removeFromHistory = (id) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    try { localStorage.setItem('accountIntelHistory', JSON.stringify(updated)); } catch {}
  };
  const exportPDF = () => window.print();

  const LOAD_STEPS_FR = [
    'Consultation du registre officiel…',
    'Recherche des signaux digitaux…',
    'Analyse des actualités & recrutements IT…',
    'Récupération du site web officiel…',
    'Génération du dossier SWOT · PESTEL…',
  ];
  const LOAD_STEPS_EN = [
    'Querying official business registry…',
    'Searching digital signals…',
    'Analysing news & IT job postings…',
    'Fetching official company website…',
    'Generating SWOT · PESTEL dossier…',
  ];

  // capturedQuery passé explicitement pour éviter le stale closure si l'user retape pendant le fetch
  function classifyError(e, status, capturedQuery) {
    if (e.name === 'AbortError') {
      return {
        type: 'timeout',
        message: lang === 'fr' ? 'Délai d\'analyse dépassé' : 'Analysis timed out',
        hint: lang === 'fr'
          ? 'L\'analyse prend plus de 60 secondes. Réessayez — les données sont mises en cache.'
          : 'Analysis took over 60 seconds. Retry — data is cached.',
      };
    }
    if (!navigator.onLine || e.message === 'Failed to fetch') {
      return {
        type: 'network',
        message: lang === 'fr' ? 'Pas de connexion internet' : 'No internet connection',
        hint: lang === 'fr'
          ? 'Vérifiez votre réseau puis réessayez. Vous pouvez charger une analyse récente depuis l\'historique.'
          : 'Check your network then retry. You can load a recent analysis from history.',
      };
    }
    if (status === 429) {
      return {
        type: 'rateLimit',
        message: lang === 'fr' ? 'Limite de requêtes atteinte' : 'Rate limit reached',
        hint: lang === 'fr'
          ? 'Trop d\'analyses simultanées. Attendez 30 secondes puis relancez.'
          : 'Too many simultaneous analyses. Wait 30 seconds and retry.',
      };
    }
    if (status === 404 || (e.message || '').toLowerCase().includes('not found')) {
      return {
        type: 'notFound',
        message: lang === 'fr' ? `Entreprise introuvable : "${capturedQuery}"` : `Company not found: "${capturedQuery}"`,
        hint: lang === 'fr'
          ? 'Essayez le nom légal complet, l\'acronyme, ou ajoutez le pays (ex : "SNCF France").'
          : 'Try the full legal name, acronym, or add the country (e.g. "Airbus France").',
      };
    }
    return {
      type: 'api',
      message: e.message || (lang === 'fr' ? 'Erreur inattendue' : 'Unexpected error'),
      hint: lang === 'fr'
        ? 'Le service d\'analyse a rencontré un problème. Réessayez ou consultez une analyse récente.'
        : 'The analysis service encountered an issue. Retry or load a recent analysis.',
    };
  }

  async function handleAnalyse() {
    if (!query.trim()) return;
    const capturedQuery = query.trim(); // snapshot avant tout await
    setLoading(true);
    setLoadStep(0);
    setIntel(null);
    setError(null);

    // Animate loading steps while the API call runs
    const stepInterval = setInterval(() => {
      setLoadStep(s => s < 4 ? s + 1 : s);
    }, 2200);

    try {
      const res = await fetch('/api/account-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountName: capturedQuery }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        const err = new Error(data.error || (lang === 'fr' ? 'Erreur API' : 'API error'));
        setError(classifyError(err, res.status, capturedQuery));
        toast.error(err.message);
        return;
      }
      setIntel(data.intel);
      setWebUsed(data.webDataUsed || false);
      setSourcesUsed(data.sourcesUsed || {});
      setSnippetCount(data.snippetCount || 0);
      saveToHistory(capturedQuery, data.intel);
      const srcLabel = Object.entries(data.sourcesUsed || {})
        .filter(([, v]) => v).map(([k]) => k).join(' + ') || 'KB';
      toast.success(lang === 'fr'
        ? `Dossier généré — ${data.snippetCount || 0} sources (${srcLabel})`
        : `Dossier generated — ${data.snippetCount || 0} sources (${srcLabel})`);
    } catch (e) {
      setError(classifyError(e, null, capturedQuery));
      toast.error(e.message);
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  }

  const scoreColor = (s) => s >= 75 ? 'text-green-600' : s >= 50 ? 'text-orange-500' : 'text-red-500';
  const scoreRing  = (s) => s >= 75 ? 'from-green-400 to-emerald-500' : s >= 50 ? 'from-orange-400 to-amber-500' : 'from-red-400 to-rose-500';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-indigo-50">
      <Toaster />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div {...fadeUp} className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-ms-blue to-ms-blueDark p-3 rounded-xl shadow-lg">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {lang === 'fr' ? 'Intelligence Compte' : 'Account Intelligence'}
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">
                  {lang === 'fr'
                    ? 'Dossier commercial complet — SWOT · PESTEL · Signaux digitaux · Stratégie Microsoft'
                    : 'Full commercial dossier — SWOT · PESTEL · Digital signals · Microsoft strategy'}
                </p>
              </div>
            </div>
            {intel && (
              <button
                onClick={exportPDF}
                className="no-print shrink-0 flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-ms-blue px-3 py-2 rounded-xl transition-colors shadow-sm"
              >
                <Download className="h-3.5 w-3.5" />
                {lang === 'fr' ? 'Exporter PDF' : 'Export PDF'}
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Search bar ─────────────────────────────────────── */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="mb-10">
          <div className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); if (error) setError(null); }}
                onKeyDown={e => e.key === 'Enter' && handleAnalyse()}
                placeholder={lang === 'fr' ? 'Nom de l\'entreprise… ex: TotalEnergies, Airbus, SNCF' : 'Company name… e.g. TotalEnergies, Airbus, SNCF'}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleAnalyse}
              disabled={loading || !query.trim()}
              className="px-6 py-3.5 rounded-xl font-semibold text-white shadow-md transition-all
                bg-gradient-to-r from-ms-blue to-ms-blueDark hover:from-ms-blueDark hover:to-[#004578]
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{lang === 'fr' ? 'Analyse…' : 'Analysing…'}</>
                : <><Sparkles className="h-4 w-4" />{lang === 'fr' ? 'Analyser' : 'Analyse'}</>
              }
            </button>
          </div>

          {/* ── Historique récent ─────────────────────────────── */}
          {history.length > 0 && !intel && !loading && (
            <div className="mt-4 max-w-2xl">
              <button
                onClick={() => setShowHistory(h => !h)}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Clock className="h-3.5 w-3.5" />
                {lang === 'fr' ? `Analyses récentes (${history.length})` : `Recent analyses (${history.length})`}
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showHistory ? 'rotate-90' : ''}`} />
              </button>
              {showHistory && (
                <div className="mt-2 space-y-1.5">
                  {history.map(h => (
                    <div key={h.id} className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm">
                      <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <button
                        onClick={() => { setIntel(h.intel); setQuery(h.query); setShowHistory(false); }}
                        className="flex-1 text-left text-sm font-medium text-gray-700 hover:text-ms-blue transition-colors truncate"
                      >
                        {h.company}
                      </button>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {new Date(h.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                      <button onClick={() => removeFromHistory(h.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* ── Results ────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {intel && (
            <motion.div key="results" variants={stagger} initial="initial" animate="animate" className="space-y-6">

              {/* ── Company header card ───────────────── */}
              <motion.div variants={fadeUp}
                className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 border border-white/20 rounded-xl p-3 shrink-0">
                      <Building2 className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-2xl font-bold">{intel.company?.name}</h2>
                        {webUsed && (
                          <span className="flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1 text-xs bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-2 py-0.5 rounded-full">
                              <Wifi className="h-3 w-3" /> {lang === 'fr' ? 'Données web' : 'Web data'}
                            </span>
                            {snippetCount > 0 && (
                              <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                                {snippetCount} {lang === 'fr' ? 'sources' : 'sources'}
                              </span>
                            )}
                            {sourcesUsed.exa    && <span className="text-[10px] bg-violet-500/20 text-violet-300 border border-violet-400/30 px-1.5 py-0.5 rounded-full">Exa</span>}
                            {sourcesUsed.jina   && <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.5 rounded-full">Jina</span>}
                            {sourcesUsed.tavily && <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded-full">Tavily</span>}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 text-sm mt-0.5">{intel.company?.industry} · {intel.company?.headquarters}</p>
                      <p className="text-slate-400 text-xs mt-1">{intel.company?.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap items-center">
                    {[
                      { label: lang === 'fr' ? 'Taille' : 'Size',      value: intel.company?.size?.toUpperCase() },
                      { label: lang === 'fr' ? 'Effectif' : 'Employees',value: intel.company?.employees },
                      { label: lang === 'fr' ? 'CA estimé' : 'Est. Revenue', value: intel.company?.estimatedRevenue },
                    ].map(i => (
                      <div key={i.label} className="bg-white/10 rounded-xl px-4 py-2 text-center min-w-[80px]">
                        <p className="text-slate-400 text-[10px] uppercase tracking-wider">{i.label}</p>
                        <p className="text-white font-semibold text-sm mt-0.5">{i.value || '—'}</p>
                      </div>
                    ))}
                    {/* Export PDF */}
                    <button
                      onClick={exportPDF}
                      className="no-print ml-auto flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-xl transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {lang === 'fr' ? 'Exporter PDF' : 'Export PDF'}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* ── Score + Digital Signals ──────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Score card */}
                <motion.div variants={fadeUp}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    {lang === 'fr' ? 'Score adéquation Microsoft' : 'Microsoft Fit Score'}
                  </p>
                  <div className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${scoreRing(intel.microsoftFit?.score)} p-1 shadow-lg mb-3`}>
                    <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                      <span className={`text-4xl font-black ${scoreColor(intel.microsoftFit?.score)}`}>
                        <AnimatedScore value={intel.microsoftFit?.score || 0} />
                      </span>
                      <span className="text-[10px] text-gray-400">/100</span>
                    </div>
                  </div>
                  <div className={`text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
                    intel.microsoftFit?.urgencyLevel === 'high'
                      ? 'bg-red-100 text-red-700'
                      : intel.microsoftFit?.urgencyLevel === 'medium'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {intel.microsoftFit?.urgencyLevel === 'high'
                      ? (lang === 'fr' ? '🔥 Urgence élevée' : '🔥 High urgency')
                      : intel.microsoftFit?.urgencyLevel === 'medium'
                      ? (lang === 'fr' ? '⚡ Urgence moyenne' : '⚡ Medium urgency')
                      : (lang === 'fr' ? '✅ Pipeline long terme' : '✅ Long-term pipeline')}
                  </div>
                  <p className="text-xs text-gray-500 text-center leading-relaxed">{intel.microsoftFit?.rationale}</p>
                  {intel.microsoftFit?.buyingSignals?.length > 0 && (
                    <div className="mt-3 w-full space-y-1">
                      {intel.microsoftFit.buyingSignals.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-2 py-1.5">
                          <CheckCircle className="h-3 w-3 mt-0.5 shrink-0 text-green-500" />
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Digital signals */}
                <motion.div variants={fadeUp}
                  className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <RadioTower className="h-5 w-5 text-indigo-500" />
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {lang === 'fr' ? 'Signaux digitaux détectés' : 'Digital signals detected'}
                    </h3>
                    {webUsed && (
                      <span className="flex items-center gap-1">
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Live</span>
                        {sourcesUsed.exa    && <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full">Exa</span>}
                        {sourcesUsed.jina   && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Jina</span>}
                        {sourcesUsed.tavily && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Tavily</span>}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2.5">
                    {(intel.digitalSignals || []).map((sig, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-ms-blue text-white text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                        <p className="text-sm text-gray-700">{sig}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Link href={`/email-generator?company=${encodeURIComponent(intel.company?.name || query)}&solution=${intel.topSolutions?.[0]?.category || 'm365'}&industry=${encodeURIComponent(intel.company?.industry || '')}&size=${intel.company?.size || 'sme'}&challenge=${encodeURIComponent(intel.quickWin || '')}`}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Mail className="h-3 w-3" /> {lang === 'fr' ? 'Générer un email' : 'Generate email'}
                    </Link>
                    <Link
                      href={`/sequences?company=${encodeURIComponent(intel.company?.name || query)}&solution=${intel.topSolutions?.[0]?.category || 'm365'}&industry=${encodeURIComponent(intel.company?.industry || '')}&size=${intel.company?.size || 'sme'}`}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      <Zap className="h-3 w-3" /> {lang === 'fr' ? 'Créer une séquence' : 'Create sequence'}
                    </Link>
                    <button onClick={handleAnalyse} disabled={loading}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50">
                      <RotateCcw className="h-3 w-3" /> {lang === 'fr' ? 'Réanalyser' : 'Re-analyse'}
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* ── SWOT ─────────────────────────────── */}
              <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-800 text-sm">{lang === 'fr' ? 'Analyse SWOT' : 'SWOT Analysis'}</h3>
                  <span className="text-xs text-gray-400 ml-auto">{lang === 'fr' ? 'Contextualisée pour un pitch Microsoft' : 'Contextualised for a Microsoft pitch'}</span>
                </div>
                <div className="grid grid-cols-2">
                  {SWOT_CONFIG.map((cell, idx) => {
                    const Icon = cell.icon;
                    const items = intel.swot?.[cell.key] || [];
                    return (
                      <div key={cell.key} className={`p-5 border-gray-100 ${idx % 2 === 0 ? 'border-r' : ''} ${idx < 2 ? 'border-b' : ''}`}>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${cell.header} mb-3`}>
                          <Icon className={`h-3.5 w-3.5 ${cell.text}`} />
                          <span className={`text-xs font-bold uppercase tracking-wider ${cell.text}`}>{cell.label}</span>
                        </div>
                        <ul className="space-y-2">
                          {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className={`mt-1.5 w-2 h-2 rounded-full ${cell.dot} shrink-0`} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* ── PESTEL ───────────────────────────── */}
              <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-800 text-sm">{lang === 'fr' ? 'Analyse PESTEL' : 'PESTEL Analysis'}</h3>
                  <span className="text-xs text-gray-400 ml-auto">{lang === 'fr' ? 'Impact sur la stratégie IT' : 'IT strategy impact'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                  {PESTEL_CONFIG.map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className={`rounded-xl border p-4 ${item.color}`}>
                        <div className={`flex items-center gap-2 mb-2`}>
                          <Icon className={`h-4 w-4 ${item.iconColor}`} />
                          <span className={`text-xs font-bold uppercase tracking-wider ${item.text}`}>{item.label}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {intel.pestel?.[item.key] || '—'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* ── Decision makers ──────────────────── */}
              <Section title={lang === 'fr' ? 'Interlocuteurs décisionnels' : 'Decision makers'} icon={Users} color="text-violet-600">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(intel.decisionMakers || []).map((dm, i) => (
                    <div key={i} className="rounded-xl border border-violet-100 bg-violet-50/40 p-4">
                      <p className="font-semibold text-violet-800 text-sm mb-2">{dm.role}</p>
                      <p className="text-xs text-gray-600 mb-1"><span className="font-medium text-red-600">Pain :</span> {dm.painPoints}</p>
                      <p className="text-xs text-gray-600"><span className="font-medium text-blue-600">Angle :</span> {dm.microsoftAngle}</p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* ── Top solutions ────────────────────── */}
              <Section title={lang === 'fr' ? 'Solutions Microsoft recommandées' : 'Recommended Microsoft solutions'} icon={Sparkles} color="text-blue-600">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(intel.topSolutions || []).map((sol, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                      <div className={`bg-gradient-to-r ${CAT_COLORS[sol.category] || 'from-gray-500 to-gray-600'} p-3 text-white`}>
                        <div className="flex items-center justify-between">
                          <span className="text-lg">{CAT_EMOJI[sol.category] || '🔷'}</span>
                          {sol.priority && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${PRIORITY_COLORS[sol.priority] || 'bg-gray-100 text-gray-600'}`}>
                              {sol.priority}
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-sm mt-1">{sol.product}</p>
                        <p className="text-white/80 text-[11px]">{sol.plan}</p>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <p className="text-xs text-gray-500">{sol.whyFit}</p>
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-gray-800">{sol.price}</span>
                          <span className="text-green-600">{sol.roi}</span>
                        </div>
                        <Link
                          href={`/email-generator?company=${encodeURIComponent(intel.company?.name || query)}&solution=${sol.category || 'm365'}&industry=${encodeURIComponent(intel.company?.industry || '')}&size=${intel.company?.size || 'sme'}&challenge=${encodeURIComponent(sol.whyFit || '')}`}
                          className="mt-1 w-full flex items-center justify-center gap-1 text-[10px] py-1.5 rounded-lg bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium"
                        >
                          <Mail className="h-3 w-3" />
                          {lang === 'fr' ? 'Générer email' : 'Generate email'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* ── Email angles ─────────────────────── */}
              <Section title={lang === 'fr' ? 'Angles d\'approche email' : 'Email angles'} icon={Mail} color="text-green-600">
                <div className="space-y-3">
                  {(intel.emailAngles || []).map((angle, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50/40 hover:border-blue-200 transition-colors group">
                      <div className="bg-blue-100 text-blue-700 rounded-lg w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-800 text-sm">{angle.angle}</p>
                          {angle.persona && (
                            <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full">→ {angle.persona}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 italic">"{angle.hook}"</p>
                        <p className="text-xs text-blue-600 mt-1">💡 {angle.solution}</p>
                      </div>
                      <Link href={`/email-generator?company=${encodeURIComponent(intel.company?.name || query)}&solution=${guessCategory(angle.solution)}&industry=${encodeURIComponent(intel.company?.industry || '')}&size=${intel.company?.size || 'sme'}&challenge=${encodeURIComponent(angle.hook || angle.angle)}&type=prospection`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium whitespace-nowrap">
                        {lang === 'fr' ? 'Générer' : 'Generate'} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </Section>

              {/* ── Discovery questions ──────────────── */}
              <Section title={lang === 'fr' ? 'Questions de découverte' : 'Discovery questions'} icon={Lightbulb} color="text-amber-500" badge={`${(intel.keyQuestions || []).length} questions`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(intel.keyQuestions || []).map((q, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <span className="text-amber-500 font-bold text-xs mt-0.5">Q{i + 1}</span>
                      <p className="text-sm text-gray-700">{q}</p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* ── Quick win + competitor ───────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div variants={fadeUp} className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-800 text-sm">{lang === 'fr' ? 'Quick Win' : 'Quick Win'}</h4>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{intel.quickWin}</p>
                </motion.div>
                <motion.div variants={fadeUp} className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-red-800 text-sm">{lang === 'fr' ? 'Risque concurrent' : 'Competitor risk'}</h4>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{intel.competitorRisk}</p>
                </motion.div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state ────────────────────────────────────── */}
        {/* Loading progressif */}
        {loading && (
          <motion.div {...fadeUp} className="py-16 flex flex-col items-center gap-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
              <div className="absolute inset-0 rounded-full border-4 border-t-ms-blue animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="h-7 w-7 text-ms-blue" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800 mb-4">
                {lang === 'fr' ? `Analyse de « ${query} »` : `Analysing "${query}"`}
              </p>
              <div className="space-y-2 text-left">
                {(lang === 'fr' ? LOAD_STEPS_FR : LOAD_STEPS_EN).map((step, i) => (
                  <div key={i} className={`flex items-center gap-2.5 text-sm transition-all duration-500 ${i <= loadStep ? 'opacity-100' : 'opacity-25'}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      i < loadStep ? 'bg-green-500' : i === loadStep ? 'bg-ms-blue animate-pulse' : 'bg-gray-200'
                    }`}>
                      {i < loadStep
                        ? <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        : null}
                    </span>
                    <span className={i < loadStep ? 'text-gray-400 line-through' : i === loadStep ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {!intel && !loading && error && (
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="max-w-lg mx-auto py-12">
            <div className={`rounded-2xl border p-6 shadow-sm ${
              error.type === 'network'   ? 'bg-orange-50 border-orange-200' :
              error.type === 'rateLimit' ? 'bg-amber-50 border-amber-200' :
              error.type === 'notFound'  ? 'bg-blue-50 border-blue-200' :
                                           'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3 mb-4">
                <div className={`p-2 rounded-xl shrink-0 ${
                  error.type === 'network'   ? 'bg-orange-100' :
                  error.type === 'rateLimit' ? 'bg-amber-100' :
                  error.type === 'notFound'  ? 'bg-blue-100' :
                                               'bg-red-100'
                }`}>
                  {error.type === 'network'   && <Wifi className="h-5 w-5 text-orange-500" />}
                  {error.type === 'rateLimit' && <Clock className="h-5 w-5 text-amber-500" />}
                  {error.type === 'notFound'  && <Search className="h-5 w-5 text-blue-500" />}
                  {error.type === 'api'       && <AlertTriangle className="h-5 w-5 text-red-500" />}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${
                    error.type === 'network'   ? 'text-orange-800' :
                    error.type === 'rateLimit' ? 'text-amber-800' :
                    error.type === 'notFound'  ? 'text-blue-800' :
                                                 'text-red-800'
                  }`}>{error.message}</p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{error.hint}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Always offer retry */}
                <button
                  onClick={handleAnalyse}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {lang === 'fr' ? 'Réessayer' : 'Retry'}
                </button>

                {/* If notFound, offer to search with different term */}
                {error.type === 'notFound' && (
                  <button
                    onClick={() => { setError(null); setQuery(''); document.querySelector('input')?.focus(); }}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                  >
                    <Search className="h-3.5 w-3.5" />
                    {lang === 'fr' ? 'Modifier la recherche' : 'Edit search'}
                  </button>
                )}

                {/* If history exists, offer to load cached result */}
                {history.length > 0 && (
                  <button
                    onClick={() => { setError(null); setShowHistory(true); }}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {lang === 'fr' ? `Charger une analyse récente (${history.length})` : `Load recent analysis (${history.length})`}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {!intel && !loading && !error && (
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
              <Building2 className="h-8 w-8 text-ms-blue" />
            </div>
            <p className="text-gray-500 text-sm">
              {lang === 'fr'
                ? 'Entrez un nom d\'entreprise pour générer un dossier commercial complet'
                : 'Enter a company name to generate a full commercial dossier'}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {lang === 'fr' ? 'SWOT · PESTEL · Signaux digitaux · Solutions Microsoft · Angles email' : 'SWOT · PESTEL · Digital signals · Microsoft solutions · Email angles'}
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
