'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Sparkles, Copy, CheckCircle, ChevronRight,
  Building2, User, Briefcase, Lightbulb, BookOpen,
  Zap, RotateCcw, Send, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { useLang, t } from '@/contexts/LanguageContext';

// ── Happi Brain: solution cards ──────────────────────────────────────────────
const SOLUTIONS = [
  {
    id: 'm365',
    label: 'Microsoft 365',
    emoji: '💼',
    color: 'from-blue-500 to-indigo-600',
    border: 'gradient-border',
    desc: 'Productivity, Teams, Exchange, SharePoint',
  },
  {
    id: 'azure',
    label: 'Microsoft Azure',
    emoji: '☁️',
    color: 'from-sky-500 to-blue-600',
    border: 'gradient-border',
    desc: 'Cloud infrastructure, migration, AI services',
  },
  {
    id: 'dynamics',
    label: 'Dynamics 365',
    emoji: '🎯',
    color: 'from-orange-500 to-red-600',
    border: 'gradient-border-orange',
    desc: 'CRM, ERP, Sales, Customer Service',
  },
  {
    id: 'power',
    label: 'Power Platform',
    emoji: '⚡',
    color: 'from-yellow-500 to-orange-500',
    border: 'gradient-border-orange',
    desc: 'Low-code apps, automation, analytics',
  },
  {
    id: 'security',
    label: 'Security & Compliance',
    emoji: '🛡️',
    color: 'from-red-500 to-rose-600',
    border: 'gradient-border-orange',
    desc: 'Zero Trust, Defender, Purview',
  },
  {
    id: 'bundles',
    label: 'Solution Bundles',
    emoji: '🎁',
    color: 'from-emerald-500 to-teal-600',
    border: 'gradient-border-green',
    desc: 'ROI-optimised Microsoft packages',
  },
];

const TONES = [
  { id: 'professional', label: 'Executive', icon: '🤝' },
  { id: 'friendly',     label: 'Friendly',  icon: '😊' },
  { id: 'direct',       label: 'Direct',    icon: '⚡' },
];

const EMAIL_TYPES = [
  { id: 'prospection', label: 'Cold Outreach' },
  { id: 'relance',     label: 'Follow-up'    },
  { id: 'demo',        label: 'Demo Invite'  },
  { id: 'proposal',    label: 'Proposal'     },
];

// ── Framer Motion helpers ────────────────────────────────────────────────────
const fadeUp   = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
const stagger  = { animate: { transition: { staggerChildren: 0.07 } } };

function TiltCard({ children, className = '' }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    setTilt({ x: (e.clientY - cy) / 14, y: -(e.clientX - cx) / 14 });
  };

  return (
    <motion.div
      className={`tilt-card ${className}`}
      style={{ rotateX: tilt.x, rotateY: tilt.y }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    >
      {children}
    </motion.div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function KBEmailGenerator() {
  const { lang } = useLang();
  const tr = t[lang].email;

  const EMAIL_TYPES_I18N = [
    { id: 'prospection', label: tr.types.prospection },
    { id: 'relance',     label: tr.types.relance },
    { id: 'demo',        label: tr.types.demo },
    { id: 'proposal',    label: tr.types.proposal },
  ];
  const TONES_I18N = [
    { id: 'professional', label: tr.tones.professional, icon: '🤝' },
    { id: 'friendly',     label: tr.tones.friendly,     icon: '😊' },
    { id: 'direct',       label: tr.tones.direct,       icon: '⚡' },
  ];
  const SIZE_OPTIONS_I18N = [
    ['startup', tr.sizes.startup],
    ['sme',     tr.sizes.sme],
    ['enterprise', tr.sizes.enterprise],
  ];

  const [step, setStep]             = useState(1); // 1=solution, 2=details, 3=result
  const [solution, setSolution]     = useState(null);
  const [tone, setTone]             = useState('professional');
  const [emailType, setEmailType]   = useState('prospection');
  const [form, setForm]             = useState({
    companyName: '', contactName: '', contactRole: '',
    industry: '', companySize: 'sme', challenge: '',
  });
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [copied, setCopied]         = useState(false);

  const handleField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const generate = async () => {
    if (!form.companyName.trim()) { toast.error('Please enter the company name'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/generate-kb-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, solution, tone, emailType }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResult(data);
      setStep(3);
    } catch (err) {
      toast.error(err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = async () => {
    const text = `Subject: ${result.subject}\n\n${result.body}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => { setStep(1); setSolution(null); setResult(null); setForm({ companyName: '', contactName: '', contactRole: '', industry: '', companySize: 'sme', challenge: '' }); };

  const selectedSolution = SOLUTIONS.find(s => s.id === solution);

  return (
    <div className="min-h-screen happi-surface">

      {/* ── Hero header ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden happi-hero-bg text-white py-14 px-8">
        <div className="orb orb-blue  w-64 h-64 -top-12 -left-12" />
        <div className="orb orb-purple w-56 h-56 top-0 right-0 animation-delay-2000" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp} className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Mail className="w-7 h-7" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-300">
              Knowledge Base · Powered
            </span>
          </motion.div>
          <motion.h1 {...fadeUp} transition={{ delay: 0.07 }}
            className="text-4xl md:text-5xl font-bold mb-3">
            {tr.title}
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.14 }}
            className="text-blue-200 text-lg">
            {tr.subtitle}
          </motion.p>

          {/* Steps pill */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mt-8">
            {['Solution', 'Details', 'Email'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  step === i + 1 ? 'bg-white text-blue-700 shadow-lg' :
                  step > i + 1  ? 'bg-white/20 text-white' : 'bg-white/08 text-blue-300'
                }`}>
                  {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : <span>{i + 1}</span>}
                  {s}
                </div>
                {i < 2 && <ChevronRight className="w-4 h-4 text-blue-400" />}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">

          {/* STEP 1 — Choose solution */}
          {step === 1 && (
            <motion.div key="step1" {...fadeUp} variants={stagger} initial="initial" animate="animate" exit="exit">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{lang === 'fr' ? 'Quelle solution pitchez-vous ?' : 'Which solution are you pitching?'}</h2>
              <p className="text-gray-500 mb-8">{lang === 'fr' ? 'L\'email sera généré exclusivement depuis les docs KB de cette solution.' : "The email will be generated exclusively from that solution's knowledge base docs."}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {SOLUTIONS.map((sol) => (
                  <motion.div key={sol.id} variants={fadeUp}>
                    <TiltCard>
                      <div className={sol.border}>
                        <button
                          onClick={() => { setSolution(sol.id); setStep(2); }}
                          className={`w-full bg-white rounded-[calc(1rem-1px)] p-5 text-left group transition-all hover:shadow-xl ${
                            solution === sol.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                        >
                          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${sol.color} text-white text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                            {sol.emoji}
                          </div>
                          <h3 className="font-bold text-gray-900 mb-1">{sol.label}</h3>
                          <p className="text-xs text-gray-500">{sol.desc}</p>
                        </button>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Details form */}
          {step === 2 && (
            <motion.div key="step2" {...fadeUp} initial="initial" animate="animate" exit="exit">
              {/* Selected solution badge */}
              <div className="flex items-center gap-3 mb-8">
                <button onClick={() => setStep(1)} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                  ← Back
                </button>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${selectedSolution?.color} text-white text-sm font-semibold`}>
                  <span>{selectedSolution?.emoji}</span>
                  {selectedSolution?.label}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left — account info */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-500" /> Account
                  </h3>

                  <Field icon={<Building2 className="w-4 h-4" />} label={`${tr.company} *`} value={form.companyName}
                    onChange={v => handleField('companyName', v)} placeholder={tr.companyPlaceholder} />
                  <Field icon={<User className="w-4 h-4" />} label={tr.contact} value={form.contactName}
                    onChange={v => handleField('contactName', v)} placeholder={tr.contactPlaceholder} />
                  <Field icon={<Briefcase className="w-4 h-4" />} label={tr.role} value={form.contactRole}
                    onChange={v => handleField('contactRole', v)} placeholder={tr.rolePlaceholder} />
                  <Field icon={<Building2 className="w-4 h-4" />} label={tr.industry} value={form.industry}
                    onChange={v => handleField('industry', v)} placeholder={tr.industryPlaceholder} />

                  {/* Company size */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{tr.size}</label>
                    <div className="flex gap-2">
                      {SIZE_OPTIONS_I18N.map(([val, lbl]) => (
                        <button key={val} onClick={() => handleField('companySize', val)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                            form.companySize === val
                              ? 'bg-blue-600 text-white border-blue-600 shadow'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                          }`}>{lbl}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right — email settings */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" /> Email settings
                  </h3>

                  {/* Challenge */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{tr.challenge}</label>
                    <textarea
                      rows={3}
                      value={form.challenge}
                      onChange={e => handleField('challenge', e.target.value)}
                      placeholder={tr.challengePlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                  </div>

                  {/* Email type */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{tr.type}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {EMAIL_TYPES_I18N.map(t => (
                        <button key={t.id} onClick={() => setEmailType(t.id)}
                          className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                            emailType === t.id
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                          }`}>{t.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Tone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{tr.tone}</label>
                    <div className="flex gap-2">
                      {TONES_I18N.map(t => (
                        <button key={t.id} onClick={() => setTone(t.id)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                            tone === t.id
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-200'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                          }`}>
                          <span>{t.icon}</span>{t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* KB notice */}
              <div className="gradient-border-green mt-6">
                <div className="bg-white rounded-[calc(1rem-1px)] p-4 flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">
                    <strong className="text-emerald-700">KB-only mode:</strong> The AI will read your{' '}
                    <strong>{selectedSolution?.label}</strong> knowledge base docs and generate an email
                    using <em>only</em> the pricing, features, and data found in those files.
                  </p>
                </div>
              </div>

              <motion.button
                onClick={generate}
                disabled={loading || !form.companyName.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Zap className="w-5 h-5" />
                    </motion.div>
                    {tr.generating}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {tr.generate}
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* STEP 3 — Result */}
          {step === 3 && result && (
            <motion.div key="step3" {...fadeUp} initial="initial" animate="animate" exit="exit">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Email generated</p>
                    <p className="text-xs text-gray-500">{result.solution} · {result.tokensUsed} tokens</p>
                  </div>
                </div>
                <button onClick={reset} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <RotateCcw className="w-4 h-4" /> New email
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Email preview — 2/3 */}
                <div className="md:col-span-2 space-y-4">
                  {/* Subject */}
                  <div className="gradient-border">
                    <div className="bg-white rounded-[calc(1rem-1px)] p-5">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{tr.subject}</p>
                      <p className="text-gray-900 font-semibold text-base">{result.subject}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="glass-card-white rounded-2xl p-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Body</p>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                      {result.body}
                    </pre>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={copyEmail}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                        copied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200'
                      }`}
                    >
                      {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {copied ? tr.copied : tr.copy}
                    </motion.button>
                    <button
                      onClick={() => setStep(2)}
                      className="px-5 py-3.5 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 font-semibold text-sm"
                    >
                      Edit inputs
                    </button>
                  </div>
                </div>

                {/* Sidebar — 1/3 */}
                <div className="space-y-4">
                  {/* Recommended plan */}
                  {result.recommendedPlan && (
                    <TiltCard>
                      <div className="gradient-border-green">
                        <div className="bg-white rounded-[calc(1rem-1px)] p-5">
                          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5" /> {tr.plan}
                          </p>
                          <p className="font-bold text-gray-900">{result.recommendedPlan}</p>
                          {result.price && <p className="text-emerald-600 font-semibold text-sm mt-1">{result.price}</p>}
                        </div>
                      </div>
                    </TiltCard>
                  )}

                  {/* KB sources */}
                  {result.kbSources?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> {tr.sources}
                      </p>
                      <ul className="space-y-2">
                        {result.kbSources.map((src, i) => (
                          <motion.li key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="flex items-start gap-2 text-xs text-gray-600"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                            {src}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Account info summary */}
                  <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-500 space-y-1">
                    <p><strong>Company:</strong> {form.companyName}</p>
                    {form.contactName && <p><strong>Contact:</strong> {form.contactName}</p>}
                    {form.contactRole && <p><strong>Role:</strong> {form.contactRole}</p>}
                    <p><strong>Size:</strong> {form.companySize}</p>
                    <p><strong>Tone:</strong> {tone}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Shared field component ───────────────────────────────────────────────────
function Field({ icon, label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />
      </div>
    </div>
  );
}
