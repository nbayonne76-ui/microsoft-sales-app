'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Sparkles, Mail, Copy, CheckCheck, ChevronDown, ChevronUp,
  Building2, Target, Users, ArrowRight, RotateCcw, Plus, Trash2,
  CheckCircle, Clock, MessageSquare, Phone, Video
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useLang } from '@/contexts/LanguageContext';

const fadeUp  = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

const SOLUTIONS = [
  { id: 'm365',     label: 'Microsoft 365',        emoji: '💼', color: 'from-blue-500 to-indigo-600'   },
  { id: 'azure',    label: 'Microsoft Azure',       emoji: '☁️', color: 'from-sky-500 to-blue-600'     },
  { id: 'dynamics', label: 'Dynamics 365',          emoji: '🎯', color: 'from-orange-500 to-red-600'   },
  { id: 'power',    label: 'Power Platform',        emoji: '⚡', color: 'from-yellow-500 to-orange-500'},
  { id: 'security', label: 'Security & Compliance', emoji: '🛡️', color: 'from-red-500 to-rose-600'    },
  { id: 'bundles',  label: 'Solution Bundles',      emoji: '🎁', color: 'from-emerald-500 to-teal-600' },
];

const PERSONAS = ['DSI / CTO', 'DG / CEO', 'CFO / DAF', 'Responsable IT', 'Directeur Commercial'];

const PHASE_STYLES = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   header: 'bg-blue-600',   dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700'   },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', header: 'bg-orange-500', dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700' },
  green:  { bg: 'bg-emerald-50',border: 'border-emerald-200',header: 'bg-emerald-600',dot: 'bg-emerald-500',badge: 'bg-emerald-100 text-emerald-700'},
};

const TOUCH_STATUS = ['pending', 'sent', 'replied', 'ignored'];
const STATUS_STYLES = {
  pending:  'bg-gray-100 text-gray-500',
  sent:     'bg-blue-100 text-blue-700',
  replied:  'bg-emerald-100 text-emerald-700',
  ignored:  'bg-red-100 text-red-600',
};
const STATUS_LABELS_FR = { pending: 'À envoyer', sent: 'Envoyé', replied: 'Répondu', ignored: 'Ignoré' };
const STATUS_LABELS_EN = { pending: 'To send', sent: 'Sent', replied: 'Replied', ignored: 'Ignored' };

const CHANNEL_ICON = { Email: Mail, LinkedIn: MessageSquare, Appel: Phone };

// ── Touch card ────────────────────────────────────────────────────────────────
function TouchCard({ touch, phaseColor, status, onStatusChange, onCopy, copied, lang }) {
  const [open, setOpen] = useState(false);
  const style = PHASE_STYLES[phaseColor] || PHASE_STYLES.blue;
  const ChanIcon = CHANNEL_ICON[touch.channel] || Mail;
  const STATUS_LABELS = lang === 'fr' ? STATUS_LABELS_FR : STATUS_LABELS_EN;

  return (
    <motion.div variants={fadeUp} className={`rounded-xl border ${style.border} bg-white shadow-sm overflow-hidden`}>
      {/* Touch header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className={`w-7 h-7 rounded-full ${style.dot} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
          {touch.touch}
        </div>
        <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${style.badge}`}>
          <Clock className="w-3 h-3" />
          J+{touch.day}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <ChanIcon className="w-3 h-3" />
          {touch.channel}
        </div>
        <p className="flex-1 font-medium text-gray-800 text-sm truncate">{touch.subject}</p>

        {/* Status selector */}
        <select
          value={status}
          onChange={e => onStatusChange(e.target.value)}
          className={`text-xs px-2 py-1 rounded-full border-0 font-semibold cursor-pointer ${STATUS_STYLES[status]}`}
        >
          {TOUCH_STATUS.map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>

        <button onClick={() => setOpen(o => !o)} className="text-gray-400 hover:text-gray-600 transition-colors ml-1">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Body expandable */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed bg-gray-50 rounded-lg p-4">
                {touch.body}
              </pre>
              {touch.tip && (
                <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                  <span className="text-base">💡</span>
                  <span>{touch.tip}</span>
                </div>
              )}
              {touch.kbSources?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {touch.kbSources.map((src, i) => (
                    <span key={i} className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
                      📄 {src}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => onCopy(`Objet: ${touch.subject}\n\n${touch.body}`)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-ms-blue text-white rounded-lg hover:bg-ms-blueDark transition-colors"
                >
                  {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied
                    ? (lang === 'fr' ? 'Copié !' : 'Copied!')
                    : (lang === 'fr' ? 'Copier' : 'Copy')}
                </button>
                {/* Ouvrir dans Outlook (deep link) */}
                <a
                  href={`https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(touch.subject)}&body=${encodeURIComponent(touch.body)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[#0078D4]/10 text-[#0078D4] border border-[#0078D4]/20 rounded-lg hover:bg-[#0078D4]/20 transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  Outlook
                </a>
                {/* Partager via Teams */}
                <a
                  href={`https://teams.microsoft.com/l/chat/0/0?message=${encodeURIComponent(`${touch.subject}\n\n${touch.body}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[#6264A7]/10 text-[#6264A7] border border-[#6264A7]/20 rounded-lg hover:bg-[#6264A7]/20 transition-colors"
                >
                  <Video className="w-3 h-3" />
                  Teams
                </a>
                <Link
                  href={`/email-generator?challenge=${encodeURIComponent(touch.subject)}`}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  {lang === 'fr' ? 'Affiner' : 'Refine'}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SequencesPage() {
  const { lang } = useLang();

  // Form state
  const [company,     setCompany]     = useState('');
  const [solution,    setSolution]    = useState('m365');
  const [persona,     setPersona]     = useState('DSI / CTO');
  const [industry,    setIndustry]    = useState('');
  const [companySize, setCompanySize] = useState('sme');

  // Result state
  const [sequence,  setSequence]  = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [statuses,  setStatuses]  = useState({}); // { "phaseIdx-touchIdx": status }
  const [copiedId,  setCopiedId]  = useState(null);

  // Persistent saved sequences (localStorage) — useEffect évite l'incompatibilité SSR
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('savedSequences') || '[]');
      setSaved(s);
    } catch {}
  }, []);
  const persistSaved = (list) => {
    setSaved(list);
    try { localStorage.setItem('savedSequences', JSON.stringify(list)); } catch {}
  };

  const selectedSol = SOLUTIONS.find(s => s.id === solution);

  const generate = useCallback(async () => {
    if (!company.trim()) {
      toast.error(lang === 'fr' ? 'Entrez un nom d\'entreprise' : 'Enter a company name');
      return;
    }
    setLoading(true);
    setSequence(null);
    try {
      const res = await fetch('/api/sequences/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, solution, persona, industry, companySize }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSequence(data);
      setStatuses({});
      toast.success(lang === 'fr' ? `Séquence générée — ${data.tokensUsed} tokens` : `Sequence generated — ${data.tokensUsed} tokens`);
    } catch (e) {
      toast.error(e.message || (lang === 'fr' ? 'Erreur de génération' : 'Generation error'));
    } finally {
      setLoading(false);
    }
  }, [company, solution, persona, industry, companySize]);

  const copyText = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(lang === 'fr' ? 'Copié dans le presse-papier' : 'Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const setTouchStatus = (phaseIdx, touchIdx, status) => {
    setStatuses(prev => ({ ...prev, [`${phaseIdx}-${touchIdx}`]: status }));
  };

  const saveSequence = () => {
    if (!sequence) return;
    const entry = { ...sequence, id: Date.now(), savedAt: new Date().toISOString() };
    persistSaved([entry, ...saved]);
    toast.success(lang === 'fr' ? 'Séquence sauvegardée' : 'Sequence saved');
  };

  const totalTouches = sequence?.phases?.reduce((sum, p) => sum + (p.touches?.length || 0), 0) || 0;
  const sentCount    = Object.values(statuses).filter(s => s === 'sent' || s === 'replied').length;
  const repliedCount = Object.values(statuses).filter(s => s === 'replied').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-indigo-50">
      <Toaster />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ──────────────────────────────────────────── */}
        <motion.div {...fadeUp} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-ms-blue to-ms-blueDark p-3 rounded-xl shadow-lg">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {lang === 'fr' ? 'Séquences de prospection' : 'Prospecting Sequences'}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {lang === 'fr'
                  ? 'Plan 3 phases · 7 touches · Alimenté par la Knowledge Base Microsoft'
                  : '3-phase plan · 7 touches · Powered by Microsoft Knowledge Base'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Builder form ────────────────────────────────────── */}
        <motion.div {...fadeUp} transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            {lang === 'fr' ? 'Configurer la séquence' : 'Configure sequence'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {/* Company */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {lang === 'fr' ? 'Entreprise cible *' : 'Target company *'}
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && generate()}
                  placeholder="ex: TotalEnergies, Airbus, SNCF…"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {lang === 'fr' ? 'Secteur' : 'Industry'}
              </label>
              <input
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                placeholder={lang === 'fr' ? 'ex: Aéronautique, Finance, Industrie…' : 'e.g. Aerospace, Finance, Manufacturing…'}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              />
            </div>
          </div>

          {/* Solution selector */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {lang === 'fr' ? 'Solution à pitcher' : 'Solution to pitch'}
            </label>
            <div className="flex flex-wrap gap-2">
              {SOLUTIONS.map(sol => (
                <button key={sol.id} onClick={() => setSolution(sol.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    solution === sol.id
                      ? `bg-gradient-to-r ${sol.color} text-white border-transparent shadow-md`
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}>
                  <span>{sol.emoji}</span>{sol.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Persona */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {lang === 'fr' ? 'Interlocuteur cible' : 'Target persona'}
              </label>
              <div className="flex flex-wrap gap-2">
                {PERSONAS.map(p => (
                  <button key={p} onClick={() => setPersona(p)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      persona === p
                        ? 'bg-violet-600 text-white border-transparent'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-violet-300 hover:bg-violet-50'
                    }`}>
                    <Users className="h-3 w-3" />{p}
                  </button>
                ))}
              </div>
            </div>

            {/* Company size */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {lang === 'fr' ? 'Taille entreprise' : 'Company size'}
              </label>
              <div className="flex gap-2">
                {[['startup','Startup'],['sme', lang === 'fr' ? 'PME' : 'SME'],['enterprise', lang === 'fr' ? 'Grand compte' : 'Enterprise']].map(([v,l]) => (
                  <button key={v} onClick={() => setCompanySize(v)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      companySize === v
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            onClick={generate}
            disabled={loading || !company.trim()}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="w-full py-4 rounded-xl font-bold text-white shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
          >
            {loading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}>
                  <Zap className="w-5 h-5" />
                </motion.div>
                {lang === 'fr' ? 'Génération en cours…' : 'Generating…'}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {lang === 'fr' ? 'Générer la séquence 3 phases (7 touches)' : 'Generate 3-phase sequence (7 touches)'}
                <span className="text-indigo-200 text-sm font-normal ml-1">KB {selectedSol?.emoji}</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* ── Result ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {sequence && (
            <motion.div key="result" variants={stagger} initial="initial" animate="animate" className="space-y-6">

              {/* Summary header */}
              <motion.div variants={fadeUp}
                className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{sequence.sequenceName}</h2>
                    <p className="text-slate-300 text-sm">{sequence.objective}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{sequence.company}</span>
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{sequence.solution}</span>
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{sequence.persona}</span>
                    </div>
                  </div>

                  {/* Progress stats */}
                  <div className="flex gap-4">
                    {[
                      { label: lang === 'fr' ? 'Touches' : 'Touches', value: totalTouches, color: 'text-white' },
                      { label: lang === 'fr' ? 'Envoyées' : 'Sent', value: sentCount, color: 'text-blue-300' },
                      { label: lang === 'fr' ? 'Réponses' : 'Replies', value: repliedCount, color: 'text-emerald-300' },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  <button onClick={saveSequence}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                    <Plus className="h-3 w-3" /> {lang === 'fr' ? 'Sauvegarder' : 'Save'}
                  </button>
                  <button onClick={() => { setSequence(null); setCompany(''); }}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                    <RotateCcw className="h-3 w-3" /> {lang === 'fr' ? 'Nouvelle séquence' : 'New sequence'}
                  </button>
                  <Link href={`/email-generator?company=${encodeURIComponent(sequence.company)}&solution=${sequence.solutionId}`}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-ms-blue hover:bg-ms-blue text-white rounded-lg transition-colors">
                    <Mail className="h-3 w-3" /> Email Generator
                  </Link>
                </div>
              </motion.div>

              {/* Phases */}
              {(sequence.phases || []).map((phase, phaseIdx) => {
                const style = PHASE_STYLES[phase.color] || PHASE_STYLES.blue;
                return (
                  <motion.div key={phaseIdx} variants={fadeUp}
                    className={`rounded-2xl border ${style.border} ${style.bg} overflow-hidden`}>

                    {/* Phase header */}
                    <div className={`${style.header} px-5 py-3 flex items-center gap-3`}>
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm">
                        {phase.phase}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{lang === 'fr' ? 'Phase' : 'Phase'} {phase.phase} — {phase.name}</p>
                        <p className="text-white/80 text-xs">{phase.description}</p>
                      </div>
                      <span className="ml-auto text-white/70 text-xs">{phase.touches?.length} {lang === 'fr' ? 'touches' : 'touches'}</span>
                    </div>

                    {/* Touches */}
                    <div className="p-4 space-y-3">
                      {(phase.touches || []).map((touch, touchIdx) => (
                        <TouchCard
                          key={touchIdx}
                          touch={touch}
                          phaseColor={phase.color}
                          status={statuses[`${phaseIdx}-${touchIdx}`] || 'pending'}
                          onStatusChange={s => setTouchStatus(phaseIdx, touchIdx, s)}
                          onCopy={(text) => copyText(text, `${phaseIdx}-${touchIdx}`)}
                          copied={copiedId === `${phaseIdx}-${touchIdx}`}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Saved sequences ─────────────────────────────────── */}
        {saved.length > 0 && !sequence && (
          <motion.div {...fadeUp} className="mt-8">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              {lang === 'fr' ? 'Séquences sauvegardées' : 'Saved sequences'} ({saved.length})
            </h3>
            <div className="space-y-3">
              {saved.map(s => (
                <div key={s.id}
                  className="flex items-center justify-between gap-4 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{s.sequenceName}</p>
                    <p className="text-xs text-gray-500">{s.company} · {s.solution} · {s.phases?.reduce((sum, p) => sum + (p.touches?.length || 0), 0)} touches</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSequence(s); setStatuses({}); }}
                      className="text-xs px-3 py-1.5 bg-ms-blue text-white rounded-lg hover:bg-ms-blueDark transition-colors flex items-center gap-1">
                      <ArrowRight className="h-3 w-3" /> {lang === 'fr' ? 'Voir' : 'View'}
                    </button>
                    <button onClick={() => persistSaved(saved.filter(x => x.id !== s.id))}
                      className="text-xs px-2 py-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Empty state ──────────────────────────────────────── */}
        {!sequence && !loading && saved.length === 0 && (
          <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
              <Zap className="h-8 w-8 text-indigo-500" />
            </div>
            <p className="text-gray-600 font-medium mb-1">
              {lang === 'fr' ? 'Configurez et générez votre première séquence' : 'Configure and generate your first sequence'}
            </p>
            <p className="text-gray-400 text-sm">
              {lang === 'fr'
                ? 'GPT-4o + Knowledge Base Microsoft → plan 7 touches en 30 secondes'
                : 'GPT-4o + Microsoft Knowledge Base → 7-touch plan in 30 seconds'}
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
