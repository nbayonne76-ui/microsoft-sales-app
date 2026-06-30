'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Sparkles, Upload, Play, X, ExternalLink,
  Mail, Zap, Building2, MapPin, Phone, Linkedin,
  CheckCircle, AlertCircle, Clock, Download,
  ChevronDown, ChevronUp, Copy, CheckCheck, Target,
  Globe, TrendingUp, Shield
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useLang } from '@/contexts/LanguageContext';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

// ── Constantes ────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  P0: { label: 'P0', color: 'bg-red-100 text-red-700 border-red-200',   dot: 'bg-red-500',    emoji: '🔥', desc: 'Opportunité immédiate' },
  P1: { label: 'P1', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500', emoji: '⚡', desc: 'Potentiel élevé'     },
  P2: { label: 'P2', color: 'bg-blue-100 text-blue-700 border-blue-200',   dot: 'bg-blue-400',   emoji: '📋', desc: 'À surveiller'        },
};

const SOLUTION_COLORS = {
  m365:           'from-blue-500 to-indigo-600',
  azure:          'from-sky-500 to-blue-600',
  dynamics:       'from-orange-500 to-red-600',
  copilot_studio: 'from-violet-500 to-purple-600',
  security:       'from-red-500 to-rose-600',
  bundles:        'from-emerald-500 to-teal-600',
};

const CONFIDENCE_CONFIG = {
  high:   { label: 'Apollo vérifié', color: 'text-green-700 bg-green-50 border-green-200',  icon: CheckCircle },
  medium: { label: 'Estimé',         color: 'text-yellow-700 bg-yellow-50 border-yellow-200', icon: AlertCircle },
  low:    { label: 'Incertain',      color: 'text-gray-500 bg-gray-50 border-gray-200',      icon: Clock       },
};

// ── Lead Card ─────────────────────────────────────────────────────────────────

function LeadCard({ lead, index, lang }) {
  const [expanded, setExpanded] = useState(false);
  const [copied,   setCopied]   = useState(false);
  const isFr = lang === 'fr';

  const priority  = PRIORITY_CONFIG[lead.microsoft?.priority] || PRIORITY_CONFIG.P2;
  const gradClass = SOLUTION_COLORS[lead.microsoft?.solution] || 'from-blue-500 to-indigo-600';
  const contact   = lead.contact || {};
  const ms        = lead.microsoft || {};
  const confCfg   = CONFIDENCE_CONFIG[contact.confidence || 'low'];
  const ConfIcon  = confCfg.icon;

  const seqUrl   = `/sequences?company=${encodeURIComponent(lead.companyName || lead.company)}&solution=${ms.solution || 'm365'}&industry=${encodeURIComponent(lead.sector || '')}`;
  const emailUrl = `/email-generator?company=${encodeURIComponent(lead.companyName || lead.company)}&solution=${ms.solution || 'm365'}&industry=${encodeURIComponent(lead.sector || '')}&challenge=${encodeURIComponent(ms.hook || '')}`;
  const intelUrl = `/account?company=${encodeURIComponent(lead.companyName || lead.company)}`;

  const copyEmail = async () => {
    const email = contact.email || contact.emailPattern;
    if (!email) return;
    await navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success(isFr ? 'Email copié' : 'Email copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreColor = ms.fitScore >= 8 ? 'text-green-600' : ms.fitScore >= 6 ? 'text-yellow-600' : 'text-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header gradient */}
      <div className={`h-1.5 bg-gradient-to-r ${gradClass}`} />

      <div className="p-5">
        {/* Row 1 : Company + priority + score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradClass} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm`}>
              {(lead.companyName || lead.company || '?')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
                {lead.companyName || lead.company}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {lead.sector && <span className="text-xs text-gray-500">{lead.sector}</span>}
                {lead.size    && <span className="text-xs text-gray-400">· {lead.size}</span>}
                {lead.city    && (
                  <span className="text-xs text-gray-400 flex items-center gap-0.5">
                    · <MapPin className="w-2.5 h-2.5" /> {lead.city}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${priority.color}`}>
              {priority.emoji} {priority.label}
            </span>
            <span className={`text-lg font-black ${scoreColor}`}>{ms.fitScore}/10</span>
          </div>
        </div>

        {/* Row 2 : Solution recommandée */}
        {ms.solutionLabel && (
          <div className="flex items-center gap-2 mb-3">
            <div className={`h-2 w-2 rounded-full bg-gradient-to-br ${gradClass}`} />
            <span className="text-xs font-semibold text-gray-700">{ms.solutionLabel}</span>
          </div>
        )}

        {/* Row 3 : Signals */}
        {ms.signals?.length > 0 && (
          <div className="space-y-1 mb-4">
            {ms.signals.map((sig, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <TrendingUp className="w-3 h-3 text-indigo-400 mt-0.5 shrink-0" />
                <span>{sig}</span>
              </div>
            ))}
          </div>
        )}

        {/* Row 4 : Contact */}
        {(contact.name || contact.email || contact.emailPattern) && (
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact DSI</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${confCfg.color}`}>
                <ConfIcon className="w-2.5 h-2.5" />
                {confCfg.label}
                {lead.hasApollo && contact.confidence === 'high' && ' ✓'}
              </span>
            </div>

            {contact.name && (
              <p className="font-semibold text-gray-800 text-sm">{contact.name}</p>
            )}
            {contact.title && (
              <p className="text-xs text-gray-500 mb-2">{contact.title}</p>
            )}

            <div className="space-y-1">
              {(contact.email || contact.emailPattern) && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className={`text-xs font-mono ${contact.email ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                    {contact.email || contact.emailPattern}
                  </span>
                  {!contact.email && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">pattern</span>}
                  <button onClick={copyEmail} className="ml-auto text-gray-400 hover:text-indigo-600">
                    {copied ? <CheckCheck className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span className="font-medium">{contact.phone}</span>
                  {lead.hasApollo && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded">Apollo direct</span>}
                </div>
              )}
              {contact.linkedinUrl && (
                <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800">
                  <Linkedin className="w-3 h-3" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Row 5 : Hook */}
        {ms.hook && (
          <div className="mb-4 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">Accroche Touch #1</p>
            <p className="text-xs text-gray-700 italic">"{ms.hook}"</p>
          </div>
        )}

        {/* Row 6 : Action buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Link href={intelUrl}>
            <button className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors text-gray-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              {isFr ? 'Intel' : 'Intel'}
            </button>
          </Link>
          <Link href={emailUrl}>
            <button className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors text-blue-700">
              <Mail className="w-3.5 h-3.5" />
              {isFr ? 'Email' : 'Email'}
            </button>
          </Link>
          <Link href={seqUrl}>
            <button className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-colors text-indigo-700">
              <Zap className="w-3.5 h-3.5" />
              {isFr ? 'Séquence' : 'Sequence'}
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── CSV parser (simple) ───────────────────────────────────────────────────────
function parseInput(text) {
  return text
    .split(/[\n,;]+/)
    .map(l => l.trim())
    .filter(l => l.length > 1)
    .slice(0, 50); // max 50 leads
}

// ── Export CSV ────────────────────────────────────────────────────────────────
function exportCSV(leads) {
  const headers = ['Entreprise','Ville','Secteur','Taille','Contact','Titre','Email','Téléphone','LinkedIn','Score','Priorité','Solution','Accroche'];
  const rows = leads.map(l => {
    const c = l.contact || {};
    const ms = l.microsoft || {};
    return [
      l.companyName || l.company, l.city || '', l.sector || '', l.size || '',
      c.name || '', c.title || '', c.email || c.emailPattern || '',
      c.phone || '', c.linkedinUrl || '',
      ms.fitScore || '', ms.priority || '', ms.solutionLabel || '', ms.hook || '',
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
  });
  const csv  = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `leads-prospector-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProspectorPage() {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [input,       setInput]       = useState('');
  const [leads,       setLeads]       = useState([]);
  const [processing,  setProcessing]  = useState(false);
  const [current,     setCurrent]     = useState(null);
  const [progress,    setProgress]    = useState({ done: 0, total: 0 });
  const [hasApollo,   setHasApollo]   = useState(false);
  const fileRef = useRef(null);
  const abortRef = useRef(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      // Extract company names from first column
      const lines = text.split('\n').slice(1); // skip header
      const companies = lines
        .map(l => l.split(/[,;]/)[0].replace(/"/g, '').trim())
        .filter(Boolean);
      setInput(companies.join('\n'));
      toast.success(isFr ? `${companies.length} entreprises importées` : `${companies.length} companies imported`);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const start = useCallback(async () => {
    const companies = parseInput(input);
    if (!companies.length) {
      toast.error(isFr ? 'Entrez au moins une entreprise' : 'Enter at least one company');
      return;
    }

    setLeads([]);
    setProcessing(true);
    abortRef.current = false;
    setProgress({ done: 0, total: companies.length });

    for (let i = 0; i < companies.length; i++) {
      if (abortRef.current) break;
      const company = companies[i];
      setCurrent(company);

      try {
        const res = await fetch('/api/prospector/enrich', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ company }),
        });
        const data = await res.json();
        if (data.success) {
          if (i === 0) setHasApollo(data.hasApollo);
          setLeads(prev => [...prev, data]);
        } else {
          setLeads(prev => [...prev, { company, error: data.error, microsoft: { fitScore: 0, priority: 'P2', signals: [] } }]);
        }
      } catch {
        setLeads(prev => [...prev, { company, error: 'Network error', microsoft: { fitScore: 0, priority: 'P2', signals: [] } }]);
      }

      setProgress(p => ({ ...p, done: i + 1 }));
    }

    setCurrent(null);
    setProcessing(false);
    toast.success(isFr ? `${companies.length} leads enrichis !` : `${companies.length} leads enriched!`);
  }, [input, isFr]);

  const stop = () => { abortRef.current = true; };

  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
  const sortedLeads = [...leads].sort((a, b) => (b.microsoft?.fitScore || 0) - (a.microsoft?.fitScore || 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-indigo-50">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ───────────────────────────────────────────── */}
        <motion.div {...fadeUp} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-3 rounded-xl shadow-lg shrink-0">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {isFr ? 'Lead Prospector IA' : 'AI Lead Prospector'}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {isFr
                  ? 'Enrichissement IA · Contact DSI · Score Microsoft · Email + Séquence en 1 clic'
                  : 'AI enrichment · CIO contact · Microsoft score · Email + Sequence in 1 click'}
              </p>
            </div>
            {hasApollo && leads.length > 0 && (
              <span className="ml-auto text-xs font-bold bg-green-100 text-green-700 border border-green-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3" /> Apollo connecté
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left : Input panel ───────────────────────────── */}
          <motion.div {...fadeUp} transition={{ delay: 0.05 }} className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-6">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-500" />
                {isFr ? 'Entreprises à analyser' : 'Companies to analyse'}
              </h2>

              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={isFr
                  ? 'TotalEnergies\nAirbus\nSNCF\nBNP Paribas\n...'
                  : 'TotalEnergies\nAirbus\nSNCF\nBNP Paribas\n...'}
                rows={10}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-mono resize-none"
              />

              <div className="flex items-center gap-2 mt-3 mb-4">
                <span className="text-xs text-gray-400">
                  {parseInput(input).length} {isFr ? 'entreprise(s) · max 50' : 'company(ies) · max 50'}
                </span>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="ml-auto flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {isFr ? 'Importer CSV' : 'Import CSV'}
                </button>
                <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
              </div>

              {!processing ? (
                <button
                  onClick={start}
                  disabled={!input.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 rounded-xl transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4" />
                  {isFr
                    ? `Analyser ${parseInput(input).length || ''} lead${parseInput(input).length > 1 ? 's' : ''}`
                    : `Analyse ${parseInput(input).length || ''} lead${parseInput(input).length > 1 ? 's' : ''}`}
                </button>
              ) : (
                <button onClick={stop}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all">
                  <X className="w-4 h-4" />
                  {isFr ? 'Arrêter' : 'Stop'}
                </button>
              )}

              {/* Progress */}
              {processing && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse inline-block" />
                      {current ? `Analyse : ${current}` : 'Traitement...'}
                    </span>
                    <span>{progress.done}/{progress.total}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Export button */}
              {leads.length > 0 && !processing && (
                <button
                  onClick={() => exportCSV(sortedLeads)}
                  className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {isFr ? `Exporter ${leads.length} leads (CSV)` : `Export ${leads.length} leads (CSV)`}
                </button>
              )}

              {/* Stats */}
              {leads.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {['P0','P1','P2'].map(p => {
                    const count = leads.filter(l => l.microsoft?.priority === p).length;
                    const cfg = PRIORITY_CONFIG[p];
                    return (
                      <div key={p} className={`rounded-xl p-2 border ${cfg.color}`}>
                        <p className="text-lg font-black">{count}</p>
                        <p className="text-[10px] font-bold">{p} {cfg.emoji}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Apollo status */}
              <div className={`mt-4 p-3 rounded-xl border text-xs ${hasApollo ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <p className="font-semibold mb-1 flex items-center gap-1.5">
                  {hasApollo
                    ? <><CheckCircle className="w-3.5 h-3.5 text-green-600" /> Apollo connecté</>
                    : <><AlertCircle className="w-3.5 h-3.5 text-gray-400" /> Apollo non connecté</>}
                </p>
                <p className="text-gray-500 leading-relaxed">
                  {hasApollo
                    ? 'Emails vérifiés + téléphones mobiles directs actifs'
                    : 'Ajoutez APOLLO_API_KEY dans .env pour emails vérifiés et téléphones directs'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Right : Lead cards ───────────────────────────── */}
          <div className="lg:col-span-2">
            {leads.length === 0 && !processing && (
              <motion.div {...fadeUp} transition={{ delay: 0.1 }}
                className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-indigo-400" />
                </div>
                <p className="text-gray-500 text-sm max-w-xs">
                  {isFr
                    ? 'Collez vos entreprises à gauche et cliquez Analyser — les fiches enrichies apparaissent ici au fur et à mesure'
                    : 'Paste your companies on the left and click Analyse — enriched lead cards appear here as they are processed'}
                </p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <AnimatePresence>
                {sortedLeads.map((lead, i) => (
                  <LeadCard key={lead.company + i} lead={lead} index={i} lang={lang} />
                ))}
              </AnimatePresence>

              {/* Processing skeleton */}
              {processing && current && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-100 rounded animate-pulse mb-1.5" />
                      <div className="h-3 bg-gray-50 rounded animate-pulse w-2/3" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-50 rounded animate-pulse" />
                    <div className="h-3 bg-gray-50 rounded animate-pulse w-4/5" />
                  </div>
                  <p className="text-xs text-indigo-500 font-medium mt-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse inline-block" />
                    {isFr ? `Enrichissement de ${current}...` : `Enriching ${current}...`}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
