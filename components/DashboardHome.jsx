'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles, Brain, Mail, Building2, Zap,
  BookOpen, ArrowRight, Copy, CheckCheck, RefreshCw,
  Newspaper, Calendar
} from 'lucide-react';
import { useLang, t } from '@/contexts/LanguageContext';
import { ARTICLES } from '@/lib/blog-articles';

const fadeUp  = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.07 } } };

const KB_DOMAINS = [
  { id: 'm365',     label: 'Microsoft 365',        emoji: '💼', color: 'bg-blue-100 text-blue-700 border-blue-200'   },
  { id: 'azure',    label: 'Azure',                emoji: '☁️', color: 'bg-sky-100 text-sky-700 border-sky-200'      },
  { id: 'dynamics', label: 'Dynamics 365',         emoji: '🎯', color: 'bg-orange-100 text-orange-700 border-orange-200'},
  { id: 'power',    label: 'Power Platform',       emoji: '⚡', color: 'bg-yellow-100 text-yellow-700 border-yellow-200'},
  { id: 'security', label: 'Security',             emoji: '🛡️', color: 'bg-red-100 text-red-700 border-red-200'     },
  { id: 'bundles',  label: 'Bundles',              emoji: '🎁', color: 'bg-purple-100 text-purple-700 border-purple-200'},
];

const QUICK_ACTIONS = [
  { href: '/account',         icon: Building2,  label: 'Account Intelligence', desc: 'SWOT · PESTEL · Signaux digitaux · Solutions Microsoft', color: 'from-indigo-600 to-purple-700', star: true },
  { href: '/email-generator', icon: Mail,       label: 'Email Generator',      desc: 'Emails B2B ultra-personnalisés depuis la KB',            color: 'from-blue-600 to-indigo-600'  },
  { href: '/ai-agent',        icon: Brain,      label: 'Microsoft AI Agent',   desc: '/brief · /email · /swot · /prix · /pitch',              color: 'from-violet-600 to-purple-700' },
  { href: '/sequences',       icon: Zap,        label: 'Séquences',           desc: '3 phases · 7 touches · Plan de prospection IA',         color: 'from-emerald-600 to-teal-600'  },
  { href: '/knowledge-base',  icon: BookOpen,   label: 'Knowledge Base',      desc: 'Noyau de l\'app : 62 solutions · prix · 25 guides KB',        color: 'from-gray-600 to-slate-700'    },
];

function StreamingDots() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

export default function DashboardHome() {
  const { lang } = useLang();
  const today = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const [briefText,  setBriefText]  = useState('');
  const [briefDone,  setBriefDone]  = useState(false);
  const [briefLoading, setBriefLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const readerRef = useRef(null);

  const generateBrief = async () => {
    readerRef.current?.cancel();
    setBriefText('');
    setBriefDone(false);
    setBriefLoading(true);

    try {
      const res = await fetch('/api/dashboard/brief', { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.delta) setBriefText(prev => prev + payload.delta);
            if (payload.done)  setBriefDone(true);
          } catch { /* skip malformed */ }
        }
      }
    } catch (e) {
      setBriefText(`Erreur : ${e.message}`);
      setBriefDone(true);
    } finally {
      setBriefLoading(false);
    }
  };

  const copyBrief = async () => {
    await navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ──────────────────────────────────────────── */}
        <motion.div {...fadeUp} className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-3 rounded-xl shadow-lg shrink-0">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {lang === 'fr' ? 'Bonjour Nicolas 👋' : 'Hello Nicolas 👋'}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5 capitalize">{today}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Brief IA du jour ────────────────────────────────── */}
        <motion.div {...fadeUp} transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-2xl p-6 text-white shadow-xl mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold">
                  {lang === 'fr' ? 'Brief IA du jour' : "Today's AI Brief"}
                </p>
                <p className="text-indigo-200 text-xs">
                  {lang === 'fr' ? 'Alimenté par la Knowledge Base Microsoft' : 'Powered by Microsoft Knowledge Base'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {briefText && briefDone && (
                <button onClick={copyBrief}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
              )}
              <button
                onClick={generateBrief}
                disabled={briefLoading}
                className="flex items-center gap-1.5 text-xs px-4 py-1.5 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50"
              >
                {briefLoading
                  ? <><RefreshCw className="h-3 w-3 animate-spin" /> {lang === 'fr' ? 'Génération…' : 'Generating…'}</>
                  : <><Sparkles className="h-3 w-3" /> {briefText ? (lang === 'fr' ? 'Régénérer' : 'Regenerate') : (lang === 'fr' ? 'Générer le brief' : 'Generate brief')}</>
                }
              </button>
            </div>
          </div>

          {briefText ? (
            <div className="bg-white/10 rounded-xl p-4 text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
              {briefText}
              {briefLoading && !briefDone && <StreamingDots />}
            </div>
          ) : (
            <div className="bg-white/10 rounded-xl p-6 text-center text-white/60">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {lang === 'fr'
                  ? 'Cliquez sur "Générer le brief" pour obtenir vos 3 priorités du jour + stat KB + quick win'
                  : 'Click "Generate brief" to get your 3 daily priorities + KB stat + quick win'}
              </p>
            </div>
          )}
        </motion.div>

        {/* ── Quick actions ────────────────────────────────────── */}
        <motion.div variants={stagger} initial="initial" animate="animate" className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            {lang === 'fr' ? 'Accès rapide' : 'Quick access'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {QUICK_ACTIONS.map(action => {
              const Icon = action.icon;
              return (
                <motion.div key={action.href} variants={fadeUp}>
                  <Link href={action.href}
                    className={`group flex flex-col h-full p-4 rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-200`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-white/15 rounded-xl p-2.5">
                        <Icon className="h-5 w-5" />
                      </div>
                      {action.star && (
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-medium">⭐ Core</span>
                      )}
                    </div>
                    <p className="font-bold text-sm mb-1">{action.label}</p>
                    <p className="text-white/70 text-[11px] leading-relaxed flex-1">{action.desc}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                      {lang === 'fr' ? 'Ouvrir' : 'Open'}
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Dernier article généré ──────────────────────────── */}
        {(() => {
          const latest = [...ARTICLES].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
          if (!latest) return null;
          const catColors = {
            m365: 'bg-blue-100 text-blue-700 border-blue-200',
            azure: 'bg-sky-100 text-sky-700 border-sky-200',
            copilot: 'bg-purple-100 text-purple-700 border-purple-200',
            dynamics: 'bg-orange-100 text-orange-700 border-orange-200',
            securite: 'bg-red-100 text-red-700 border-red-200',
          };
          const catLabel = { m365: 'Microsoft 365', azure: 'Azure & Cloud', copilot: 'Copilot & IA', dynamics: 'Dynamics 365', securite: 'Sécurité' };
          return (
            <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Newspaper className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  {lang === 'fr' ? 'Dernier article généré' : 'Latest generated article'}
                </h2>
              </div>
              <Link href={`/blog/${latest.slug}`}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-blue-200 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${catColors[latest.category] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {catLabel[latest.category] || latest.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 mt-2 mb-1 group-hover:text-blue-700 transition-colors line-clamp-1">
                        {lang === 'fr' ? latest.fr?.title : (latest.en?.title || latest.fr?.title)}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {lang === 'fr' ? latest.fr?.excerpt : (latest.en?.excerpt || latest.fr?.excerpt)}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(latest.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long' })}
                    </span>
                    <span>·</span>
                    <span>{latest.readTime}</span>
                    <span className="ml-auto text-green-600 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                      {lang === 'fr' ? 'Auto-généré' : 'Auto-generated'}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })()}

        {/* ── KB status ────────────────────────────────────────── */}
        <motion.div {...fadeUp} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            <h2 className="font-semibold text-gray-800 text-sm">
              {lang === 'fr' ? 'Knowledge Base : Noyau de l\'application' : 'Knowledge Base : App nucleus'}
            </h2>
            <span className="ml-auto text-xs text-gray-400">
              {lang === 'fr' ? 'Alimente tous les onglets' : 'Powers all tabs'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {KB_DOMAINS.map(d => (
              <Link key={d.id} href="/knowledge-base"
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border ${d.color} hover:scale-105 transition-transform text-center`}>
                <span className="text-2xl">{d.emoji}</span>
                <span className="text-[11px] font-semibold leading-tight">{d.label}</span>
              </Link>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400 text-center">
            {lang === 'fr'
              ? '← Account Intel · Email Generator · AI Agent · Séquences utilisent tous cette base de données →'
              : '← Account Intel · Email Generator · AI Agent · Sequences all draw from this database →'}
          </p>
        </motion.div>

      </div>
    </div>
  );
}
