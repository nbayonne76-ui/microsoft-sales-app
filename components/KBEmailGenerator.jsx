'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Sparkles, Copy, CheckCircle, ChevronRight,
  Building2, User, Briefcase, Lightbulb, BookOpen,
  Zap, RotateCcw, Send, ExternalLink, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useLang, t } from '@/contexts/LanguageContext';

// ── KB topic map: sub-solution ID → parent KB topic ──────────────────────────
const KB_TOPIC_MAP = {
  // Dynamics 365
  dy_sales: 'dynamics', dy_cs: 'dynamics', dy_field: 'dynamics',
  dy_bc: 'dynamics', dy_finance: 'dynamics',
  // Microsoft 365
  m365_business: 'm365', m365_e3: 'm365', m365_e5: 'm365', m365_copilot: 'm365',
  // Azure
  azure_migration: 'azure', azure_ai: 'azure', azure_infra: 'azure', azure_data: 'azure',
  // Power Platform + Copilot Studio
  power_bi: 'power', power_apps: 'power', power_automate: 'power', copilot_studio: 'power',
  // Security + Intune
  security_defender: 'security', security_sentinel: 'security', security_purview: 'security', intune: 'security',
  // Developer Tools
  github_copilot: 'devtools',
  // Bundles + legacy IDs (backward compat)
  bundles: 'bundles', m365: 'm365', azure: 'azure',
  dynamics: 'dynamics', power: 'power', security: 'security', devtools: 'devtools',
};

const KB_FILES_BY_TOPIC = {
  m365:     ['m365-pricing-2025.md','m365-e3-vs-e5-decision-guide.md','m365-e7-frontier-worker-suite.md','microsoft-365-collaboration.md','microsoft-licensing-contracts-guide.md','csp-vs-mca-decision-guide.md','m365-feature-availability-official.md'],
  azure:    ['azure-pricing-2025.md','azure-migration.md'],
  dynamics: ['dynamics-365-pricing-2025.md'],
  power:    ['power-platform-digital.md','copilot-studio-licensing.md'],
  security: ['security-compliance.md','microsoft-intune-licensing.md','modern-workplace-security-framework.md'],
  bundles:  ['solution-bundles-pricing.md','microsoft-pricing-guide-2025.md'],
  devtools: ['github-copilot-plans.md'],
};

function getKbFiles(solId) {
  return KB_FILES_BY_TOPIC[KB_TOPIC_MAP[solId] || solId] || [];
}

// ── Solution groups (granular) ────────────────────────────────────────────────
const SOLUTION_GROUPS = [
  {
    key: 'dynamics', label: 'Dynamics 365', emoji: '🎯',
    color: 'from-orange-500 to-red-600',
    solutions: [
      { id: 'dy_sales',   label: 'D365 Sales',            emoji: '🎯', desc: 'Pipeline, opportunités, prévisions', color: 'from-orange-500 to-red-600' },
      { id: 'dy_cs',      label: 'D365 Customer Service', emoji: '🎧', desc: 'Ticketing, SLA, self-service portal', color: 'from-red-500 to-rose-600' },
      { id: 'dy_field',   label: 'D365 Field Service',    emoji: '🔧', desc: 'Techniciens terrain, IoT, planning', color: 'from-orange-600 to-amber-600' },
      { id: 'dy_bc',      label: 'Business Central',      emoji: '📊', desc: 'ERP PME : finance, compta, stock', color: 'from-amber-500 to-orange-500' },
      { id: 'dy_finance', label: 'D365 Finance & SCM',    emoji: '💹', desc: 'ERP grands comptes, supply chain', color: 'from-orange-700 to-red-700' },
    ],
  },
  {
    key: 'm365', label: 'Microsoft 365', emoji: '💼',
    color: 'from-blue-500 to-indigo-600',
    solutions: [
      { id: 'm365_business', label: 'M365 Business',          emoji: '💼', desc: 'PME ≤300 : Teams, Exchange, Office', color: 'from-blue-500 to-indigo-600' },
      { id: 'm365_e3',       label: 'M365 Enterprise E3',     emoji: '🏢', desc: 'Compliance, eDiscovery, Intune', color: 'from-blue-600 to-indigo-700' },
      { id: 'm365_e5',       label: 'M365 Enterprise E5',     emoji: '⭐', desc: 'Defender, Purview, Phone System', color: 'from-indigo-600 to-purple-700' },
      { id: 'm365_copilot',  label: 'Microsoft 365 Copilot',  emoji: '🤖', desc: 'IA générative dans Teams, Word, Excel', color: 'from-purple-600 to-indigo-700' },
    ],
  },
  {
    key: 'azure', label: 'Microsoft Azure', emoji: '☁️',
    color: 'from-sky-500 to-blue-600',
    solutions: [
      { id: 'azure_migration', label: 'Azure Migration',       emoji: '🚀', desc: 'Lift & shift, modernisation infra on-prem', color: 'from-sky-500 to-blue-600' },
      { id: 'azure_ai',        label: 'Azure AI & OpenAI',     emoji: '🧠', desc: 'GPT-4, Copilot Studio, AI Search', color: 'from-blue-600 to-violet-600' },
      { id: 'azure_infra',     label: 'Azure Infrastructure',  emoji: '🖥️', desc: 'VMs, AKS, réseau, stockage, AVD', color: 'from-sky-600 to-cyan-600' },
      { id: 'azure_data',      label: 'Azure Data & Analytics',emoji: '📈', desc: 'Fabric, Synapse, Data Factory, Purview', color: 'from-blue-700 to-sky-700' },
    ],
  },
  {
    key: 'power', label: 'Power Platform', emoji: '⚡',
    color: 'from-yellow-500 to-orange-500',
    solutions: [
      { id: 'power_bi',       label: 'Power BI',        emoji: '📊', desc: 'Dashboards, rapports, self-service BI', color: 'from-yellow-500 to-orange-500' },
      { id: 'power_apps',     label: 'Power Apps',      emoji: '📱', desc: 'Apps métier no-code / low-code', color: 'from-orange-400 to-yellow-500' },
      { id: 'power_automate', label: 'Power Automate',  emoji: '⚙️', desc: 'RPA, flux intelligents, connecteurs', color: 'from-yellow-600 to-orange-600' },
      { id: 'copilot_studio', label: 'Copilot Studio',  emoji: '🤖', desc: 'Agents IA custom, chatbots multicanal, Teams', color: 'from-violet-500 to-purple-600' },
    ],
  },
  {
    key: 'security', label: 'Security & Compliance', emoji: '🛡️',
    color: 'from-red-500 to-rose-600',
    solutions: [
      { id: 'security_defender', label: 'Microsoft Defender', emoji: '🛡️', desc: 'XDR, endpoint, identité, SIEM', color: 'from-red-500 to-rose-600' },
      { id: 'security_sentinel', label: 'Microsoft Sentinel',  emoji: '🔍', desc: 'SIEM/SOAR, threat intelligence cloud', color: 'from-rose-600 to-red-700' },
      { id: 'security_purview',  label: 'Microsoft Purview',   emoji: '🔒', desc: 'DLP, classification, RGPD, eDiscovery', color: 'from-red-600 to-rose-700' },
      { id: 'intune',            label: 'Microsoft Intune',    emoji: '📱', desc: 'MDM/MAM, Plan 1→Suite, EPM, Remote Help', color: 'from-rose-500 to-red-600' },
    ],
  },
  {
    key: 'devtools', label: 'Developer Tools', emoji: '💻',
    color: 'from-violet-500 to-purple-600',
    solutions: [
      { id: 'github_copilot', label: 'GitHub Copilot', emoji: '💻', desc: 'IA de développement — Business $19 · Enterprise $39/siège', color: 'from-violet-500 to-purple-600' },
    ],
  },
  {
    key: 'bundles', label: 'Solution Bundles', emoji: '🎁',
    color: 'from-emerald-500 to-teal-600',
    solutions: [
      { id: 'bundles', label: 'Solution Bundles', emoji: '🎁', desc: 'Packages ROI-optimisés toutes solutions', color: 'from-emerald-500 to-teal-600' },
    ],
  },
];

// Flat list for lookups (URL params, selectedSolution display)
const SOLUTIONS = SOLUTION_GROUPS.flatMap(g => g.solutions);

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
  const searchParams = useSearchParams();

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
  const [fromIntel, setFromIntel]   = useState(false);

  const handleField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Read URL params from Account Intelligence and pre-fill the form
  useEffect(() => {
    const company   = searchParams.get('company');
    const sol       = searchParams.get('solution');
    const challenge = searchParams.get('challenge');
    const industry  = searchParams.get('industry');
    const size      = searchParams.get('size');
    const angle     = searchParams.get('angle');
    const type      = searchParams.get('type');

    const hasParams = company || sol || challenge || industry || size || angle || type;
    if (!hasParams) return;

    setFromIntel(true);
    setForm(f => ({
      ...f,
      ...(company   && { companyName: company }),
      ...(industry  && { industry }),
      ...(size && ['startup','sme','enterprise'].includes(size) && { companySize: size }),
      ...(challenge && { challenge }),
      ...(!challenge && angle && { challenge: angle }),
    }));
    if (type && ['prospection','relance','demo','proposal'].includes(type)) {
      setEmailType(type);
    }
    if (sol && SOLUTIONS.find(s => s.id === sol)) {
      setSolution(sol);
      setStep(2);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    <div className="min-h-screen ms-surface">

      {/* ── Hero header ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden ms-hero-bg text-white py-14 px-8">
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

        {/* Banner — pré-rempli depuis Account Intelligence */}
        {fromIntel && (
          <motion.div {...fadeUp}
            className="mb-6 flex items-center gap-3 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-indigo-700">
            <span className="text-lg">✨</span>
            <span className="flex-1">
              {lang === 'fr'
                ? <>Formulaire pré-rempli depuis <strong>Account Intelligence</strong>{form.companyName ? ` — ${form.companyName}` : ''}</>
                : <>Form pre-filled from <strong>Account Intelligence</strong>{form.companyName ? ` — ${form.companyName}` : ''}</>}
            </span>
            <Link href="/account" className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 shrink-0">
              <ArrowLeft className="w-3 h-3" />
              {lang === 'fr' ? 'Retour au dossier' : 'Back to dossier'}
            </Link>
          </motion.div>
        )}
        <AnimatePresence mode="wait">

          {/* STEP 1 — Choose solution */}
          {step === 1 && (
            <motion.div key="step1" {...fadeUp} variants={stagger} initial="initial" animate="animate" exit="exit">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{lang === 'fr' ? 'Quelle solution pitchez-vous ?' : 'Which solution are you pitching?'}</h2>
              <p className="text-gray-500 mb-8">{lang === 'fr' ? 'L\'email sera généré exclusivement depuis les docs KB de cette solution.' : "The email will be generated exclusively from that solution's knowledge base docs."}</p>

              <div className="space-y-5">
                {SOLUTION_GROUPS.map((group) => (
                  <motion.div key={group.key} variants={fadeUp}>
                    {/* Group header */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${group.color} text-white text-xs font-bold uppercase tracking-wider mb-3`}>
                      <span>{group.emoji}</span>
                      <span>{group.label}</span>
                    </div>
                    {/* Sub-solutions row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                      {group.solutions.map((sol) => (
                        <button
                          key={sol.id}
                          onClick={() => { setSolution(sol.id); setStep(2); }}
                          className={`text-left bg-white rounded-xl border-2 p-3.5 transition-all hover:shadow-lg group ${
                            solution === sol.id
                              ? 'border-blue-500 shadow-md ring-1 ring-blue-400'
                              : 'border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${sol.color} text-white text-lg mb-2 group-hover:scale-110 transition-transform`}>
                            {sol.emoji}
                          </div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight mb-0.5">{sol.label}</p>
                          <p className="text-[10px] text-gray-400 leading-tight">{sol.desc}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Details form */}
          {step === 2 && (
            <motion.div key="step2" {...fadeUp} initial="initial" animate="animate" exit="exit" className="space-y-6">

              {/* Top nav */}
              <div className="flex items-center gap-3">
                <button onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  ← {lang === 'fr' ? 'Retour' : 'Back'}
                </button>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${selectedSolution?.color} text-white text-sm font-semibold shadow-md`}>
                  <span>{selectedSolution?.emoji}</span>
                  {selectedSolution?.label}
                </div>
              </div>

              {/* ── Main 2-col grid ─────────────────────────────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* LEFT col (3/5) — Account + Challenge */}
                <div className="lg:col-span-3 space-y-5">

                  {/* Account card */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
                    <h3 className="font-semibold text-gray-500 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      {lang === 'fr' ? 'Informations compte' : 'Account info'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field required icon={<Building2 className="w-4 h-4" />} label={tr.company}
                        value={form.companyName} onChange={v => handleField('companyName', v)}
                        placeholder={tr.companyPlaceholder} />
                      <Field icon={<User className="w-4 h-4" />} label={tr.contact}
                        value={form.contactName} onChange={v => handleField('contactName', v)}
                        placeholder={tr.contactPlaceholder} />
                      <Field icon={<Briefcase className="w-4 h-4" />} label={tr.role}
                        value={form.contactRole} onChange={v => handleField('contactRole', v)}
                        placeholder={tr.rolePlaceholder} />
                      <Field icon={<Building2 className="w-4 h-4" />} label={tr.industry}
                        value={form.industry} onChange={v => handleField('industry', v)}
                        placeholder={tr.industryPlaceholder} />
                    </div>

                    {/* Company size */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{tr.size}</label>
                      <div className="flex gap-2">
                        {SIZE_OPTIONS_I18N.map(([val, lbl]) => (
                          <button key={val} onClick={() => handleField('companySize', val)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                              form.companySize === val
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}>{lbl}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Challenge card */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{tr.challenge}</label>
                    <textarea rows={4} value={form.challenge}
                      onChange={e => handleField('challenge', e.target.value)}
                      placeholder={tr.challengePlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none bg-gray-50 focus:bg-white transition-colors" />
                    <p className="text-xs text-gray-400 mt-1.5 text-right">{form.challenge.length}/300</p>
                  </div>
                </div>

                {/* RIGHT col (2/5) — Email settings */}
                <div className="lg:col-span-2 space-y-5">

                  {/* Email type */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{tr.type}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {EMAIL_TYPES_I18N.map(item => (
                        <button key={item.id} onClick={() => setEmailType(item.id)}
                          className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                            emailType === item.id
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                          }`}>{item.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Tone */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{tr.tone}</label>
                    <div className="flex flex-col gap-2">
                      {TONES_I18N.map(item => (
                        <button key={item.id} onClick={() => setTone(item.id)}
                          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                            tone === item.id
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}>
                          <span className="text-base">{item.icon}</span>{item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* KB files preview */}
                  <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        {lang === 'fr' ? 'Fichiers KB chargés' : 'KB files loaded'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(getKbFiles(solution) || []).map(f => (
                        <span key={f} className="px-2 py-1 bg-white border border-emerald-200 rounded-lg text-xs text-emerald-700 font-medium">
                          📄 {f.replace('.md','').replace(/-/g,' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate button */}
              <motion.button
                onClick={generate}
                disabled={loading || !form.companyName.trim()}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="w-full py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200/60 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)' }}
              >
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                      <Zap className="w-5 h-5 text-white" />
                    </motion.div>
                    <span className="text-white">{tr.generating}</span>
                    <span className="text-blue-200 text-sm font-normal">
                      {lang === 'fr' ? '— lecture de la KB…' : '— reading KB…'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="text-white">{tr.generate}</span>
                    <span className="text-blue-200 text-sm font-normal ml-1">
                      ({(getKbFiles(solution) || []).length} {lang === 'fr' ? 'docs KB' : 'KB docs'})
                    </span>
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
                    <p className="font-bold text-gray-900">{lang === 'fr' ? 'Email généré' : 'Email generated'}</p>
                    <p className="text-xs text-gray-500">{result.solution} · {result.tokensUsed} tokens</p>
                  </div>
                </div>
                <button onClick={reset} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <RotateCcw className="w-4 h-4" /> {lang === 'fr' ? 'Nouvel email' : 'New email'}
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
