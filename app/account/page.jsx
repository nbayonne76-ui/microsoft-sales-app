'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Search, Building2, Sparkles, Mail, MessageSquare,
  TrendingUp, Shield, Zap, ChevronRight, RotateCcw,
  Lightbulb, Star
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useLang, t } from '@/contexts/LanguageContext';

// ── Helpers ──────────────────────────────────────────────────────────────────
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

function TiltCard({ children, className = '' }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTilt({ x: (e.clientY - rect.top - rect.height / 2) / 16, y: -(e.clientX - rect.left - rect.width / 2) / 16 });
  };
  return (
    <motion.div className={`tilt-card ${className}`} style={{ rotateX: tilt.x, rotateY: tilt.y }}
      onMouseMove={handleMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
      {children}
    </motion.div>
  );
}

function AnimatedScore({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, v => Math.round(v));
  if (inView) raw.set(value);
  return <motion.span ref={ref}>{display}</motion.span>;
}

const CATEGORY_COLORS = {
  m365:     'from-blue-500 to-indigo-600',
  azure:    'from-sky-500 to-blue-600',
  dynamics: 'from-orange-500 to-red-500',
  power:    'from-yellow-500 to-orange-500',
  security: 'from-red-500 to-rose-600',
};
const CATEGORY_EMOJI = { m365: '💼', azure: '☁️', dynamics: '🎯', power: '⚡', security: '🛡️' };

const SIZE_LABELS = { startup: 'Startup', sme: 'SME', enterprise: 'Enterprise' };

// ── Main component ───────────────────────────────────────────────────────────
export default function AccountIntelPage() {
  const { lang } = useLang();
  const tr = t[lang].account;
  const [query, setQuery]   = useState('');
  const [intel, setIntel]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setSearched] = useState('');

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setIntel(null);
    try {
      const res = await fetch('/api/account-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountName: query.trim() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setIntel(data.intel);
      setSearched(query.trim());
    } catch (err) {
      toast.error(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setIntel(null); setQuery(''); setSearched(''); };

  const scoreColor = intel?.microsoftFit?.score >= 80 ? 'text-emerald-600' :
                     intel?.microsoftFit?.score >= 60 ? 'text-yellow-600' : 'text-red-500';

  return (
    <div className="min-h-screen happi-surface">
      <Toaster />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden happi-hero-bg text-white py-16 px-8">
        <div className="orb orb-blue   w-72 h-72 -top-16 -left-16" />
        <div className="orb orb-purple w-56 h-56 top-0 right-8" style={{ animationDelay: '2s' }} />
        <div className="orb orb-green  w-40 h-40 bottom-0 left-1/3" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> KB-powered account intelligence
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ delay: 0.07 }}
            className="text-4xl md:text-5xl font-bold mb-4">
            {tr.title}
          </motion.h1>

          <motion.p {...fadeUp} transition={{ delay: 0.14 }}
            className="text-blue-200 text-lg mb-10">
            {tr.subtitle}
          </motion.p>

          {/* Search bar */}
          <motion.form {...fadeUp} transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="relative max-w-xl mx-auto">
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-2xl focus-within:border-blue-300 transition-colors">
              <Building2 className="w-5 h-5 text-blue-300 ml-5 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={tr.placeholder}
                className="flex-1 bg-transparent px-4 py-4 text-white placeholder-blue-300 focus:outline-none text-lg"
              />
              <motion.button
                type="submit"
                disabled={loading || !query.trim()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="m-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-semibold text-sm shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {loading
                  ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Zap className="w-4 h-4" /></motion.div>
                  : <Search className="w-4 h-4" />}
                {loading ? tr.analysing : tr.analyse}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* ── Loading skeleton ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {loading && (
          <motion.div {...fadeUp} className="max-w-5xl mx-auto px-6 py-10 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="shimmer h-32 rounded-2xl" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {intel && !loading && (
          <motion.div key="results" {...fadeUp} className="max-w-5xl mx-auto px-6 py-10 space-y-8">

            {/* Header row */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{intel.company?.name}</h2>
                <p className="text-gray-500 text-sm">{intel.company?.likelySegment}</p>
              </div>
              <button onClick={reset} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                <RotateCcw className="w-4 h-4" /> New search
              </button>
            </div>

            {/* ── Row 1 — company + fit score ─────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Company card */}
              <TiltCard className="md:col-span-2">
                <div className="gradient-border">
                  <div className="bg-white rounded-[calc(1rem-1px)] p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white text-2xl shrink-0">
                        <Building2 className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Company Profile</p>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{intel.company?.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Pill color="blue">{intel.company?.likelyIndustry}</Pill>
                          <Pill color="purple">{SIZE_LABELS[intel.company?.likelySize] || intel.company?.likelySize}</Pill>
                        </div>
                        <p className="text-gray-600 text-sm mt-3">{intel.company?.likelySegment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>

              {/* Fit score */}
              <TiltCard>
                <div className="gradient-border-green">
                  <div className="bg-white rounded-[calc(1rem-1px)] p-6 text-center h-full flex flex-col justify-center">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{tr.score}</p>
                    <div className={`text-6xl font-black ${scoreColor} mb-1`}>
                      <AnimatedScore value={intel.microsoftFit?.score || 0} />
                      <span className="text-2xl">%</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mt-3">{intel.microsoftFit?.rationale}</p>
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* ── Row 2 — top solutions ────────────────────────────────────── */}
            <div>
              <SectionTitle icon={<Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />} label={tr.topSolutions} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
                {intel.topSolutions?.map((sol, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <TiltCard className="h-full">
                      <div className={`gradient-border${sol.category === 'security' || sol.category === 'power' || sol.category === 'dynamics' ? '-orange' : ''}`}>
                        <div className="bg-white rounded-[calc(1rem-1px)] p-5 h-full flex flex-col">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${CATEGORY_COLORS[sol.category] || 'from-gray-400 to-gray-600'} text-white text-xs font-semibold mb-3 self-start`}>
                            <span>{CATEGORY_EMOJI[sol.category]}</span>
                            {sol.category?.toUpperCase()}
                          </div>
                          <p className="font-bold text-gray-900 mb-1">{sol.product}</p>
                          <p className="text-xs text-gray-500 mb-2">{sol.plan}</p>
                          <p className="text-emerald-600 font-bold text-sm mb-3">{sol.price}</p>
                          <p className="text-gray-600 text-xs leading-relaxed flex-1">{sol.whyFit}</p>
                          {sol.roi && (
                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-blue-600">
                              <TrendingUp className="w-3.5 h-3.5" /> {sol.roi}
                            </div>
                          )}
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Row 3 — email angles + quick win ─────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email angles */}
              <div>
                <SectionTitle icon={<Mail className="w-5 h-5 text-blue-500" />} label={tr.emailAngles} />
                <div className="space-y-3 mt-4">
                  {intel.emailAngles?.map((angle, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.09 }}>
                      <div className="glass-card-white rounded-2xl p-4 flex gap-4 group hover:shadow-md transition-all">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm mb-1">{angle.angle}</p>
                          <p className="text-gray-500 text-xs leading-relaxed">{angle.hook}</p>
                          <p className="text-blue-500 text-xs font-medium mt-1">{angle.solution}</p>
                        </div>
                        <Link
                          href={`/email-generator`}
                          className="opacity-0 group-hover:opacity-100 transition-opacity self-center p-2 rounded-lg hover:bg-blue-50"
                          title="Open email generator"
                        >
                          <ChevronRight className="w-4 h-4 text-blue-500" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Discovery questions + quick win */}
              <div className="space-y-5">
                <div>
                  <SectionTitle icon={<MessageSquare className="w-5 h-5 text-purple-500" />} label={tr.keyQuestions} />
                  <div className="mt-4 glass-card-white rounded-2xl p-5 space-y-3">
                    {intel.keyQuestions?.map((q, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.08 }}
                        className="flex items-start gap-2.5 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        {q}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {intel.quickWin && (
                  <div>
                    <SectionTitle icon={<Zap className="w-5 h-5 text-yellow-500" />} label={tr.quickWin} />
                    <div className="mt-4 gradient-border-green">
                      <div className="bg-white rounded-[calc(1rem-1px)] p-5 flex gap-3">
                        <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">{intel.quickWin}</p>
                      </div>
                    </div>
                  </div>
                )}

                {intel.competitorRisk && (
                  <div className="gradient-border-orange">
                    <div className="bg-white rounded-[calc(1rem-1px)] p-4 flex items-center gap-3">
                      <Shield className="w-5 h-5 text-orange-500 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{tr.competitor}</p>
                        <p className="text-sm font-bold text-gray-900">{intel.competitorRisk}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── CTA row ──────────────────────────────────────────────────── */}
            <div className="gradient-border">
              <div className="bg-white rounded-[calc(1rem-1px)] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{lang === 'fr' ? 'Prêt à rédiger l\'email ?' : 'Ready to write the email?'}</p>
                    <p className="text-sm text-gray-500">{lang === 'fr' ? 'Utilisez le générateur email avec ces insights' : 'Use the KB Email Generator with these insights pre-filled'}</p>
                  </div>
                </div>
                <Link href="/email-generator">
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 flex items-center gap-2 whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4" /> {lang === 'fr' ? 'Générer l\'email' : 'Generate email'}
                  </motion.button>
                </Link>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {!intel && !loading && (
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <motion.div {...fadeUp} className="text-6xl mb-4">🔍</motion.div>
          <motion.h3 {...fadeUp} transition={{ delay: 0.07 }} className="text-xl font-bold text-gray-700 mb-2">
            {lang === 'fr' ? 'Recherchez un compte pour démarrer' : 'Search any account to get started'}
          </motion.h3>
          <motion.p {...fadeUp} transition={{ delay: 0.14 }} className="text-gray-500">
            {lang === 'fr'
              ? 'Obtenez un brief structuré avec les solutions Microsoft recommandées, les prix de la KB, les angles d\'email et les questions de découverte — en quelques secondes.'
              : 'You\'ll get a structured brief with recommended Microsoft solutions, pricing from the KB, email angles, and discovery questions — all in seconds.'}
          </motion.p>

          {/* Example chips */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-2 mt-8">
            {['Bouygues Construction', 'Carrefour', 'Air France', 'BNP Paribas', 'TotalEnergies'].map(ex => (
              <button key={ex} onClick={() => { setQuery(ex); }}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm">
                {ex}
              </button>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ── Small reusable pieces ────────────────────────────────────────────────────
function SectionTitle({ icon, label }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="font-bold text-gray-800 text-base">{label}</h3>
    </div>
  );
}

function Pill({ children, color = 'blue' }) {
  const colors = {
    blue:   'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    green:  'bg-emerald-100 text-emerald-700',
    orange: 'bg-orange-100 text-orange-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>{children}</span>
  );
}
