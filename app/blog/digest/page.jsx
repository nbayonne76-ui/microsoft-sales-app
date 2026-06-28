'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mail, Copy, CheckCheck, Calendar, Clock, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ARTICLES, CATEGORY_COLORS } from '@/lib/blog-articles';
import { useLang } from '@/contexts/LanguageContext';

const BASE_URL = 'https://microsoft-sales-app.vercel.app';

const CAT_EMOJI  = { m365: '💼', azure: '☁️', copilot: '🤖', dynamics: '🎯', securite: '🛡️' };
const CAT_LABEL  = { m365: 'Microsoft 365', azure: 'Azure & Cloud', copilot: 'Copilot & IA', dynamics: 'Dynamics 365', securite: 'Sécurité' };
const CAT_COLOR  = { m365: '#2563EB', azure: '#0284C7', copilot: '#7C3AED', dynamics: '#EA580C', securite: '#DC2626' };

function buildHtml(articles, lang) {
  const isFr   = lang === 'fr';
  const today  = new Date().toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const items  = articles.map(a => {
    const c     = lang === 'en' && a.en ? { ...a.fr, ...a.en } : a.fr;
    const color = CAT_COLOR[a.category] || '#2563EB';
    const label = CAT_LABEL[a.category] || a.category;
    const emoji = CAT_EMOJI[a.category] || '📄';
    const url   = `${BASE_URL}/blog/${a.slug}`;
    return `
    <tr>
      <td style="padding:0 0 24px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;">
              <p style="margin:0 0 8px 0;">
                <span style="background:${color}15;color:${color};font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;border:1px solid ${color}30;">
                  ${emoji} ${label}
                </span>
              </p>
              <h2 style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111827;line-height:1.4;">
                <a href="${url}" style="color:#111827;text-decoration:none;">${c.title}</a>
              </h2>
              <p style="margin:0 0 12px 0;font-size:14px;color:#6b7280;line-height:1.6;">${c.excerpt}</p>
              <a href="${url}" style="display:inline-block;background:${color};color:#ffffff;font-size:13px;font-weight:600;padding:8px 18px;border-radius:8px;text-decoration:none;">
                ${isFr ? 'Lire l\'article →' : 'Read article →'}
              </a>
              <span style="font-size:12px;color:#9ca3af;margin-left:12px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:3px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${a.readTime}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Microsoft Sales Intelligence — Digest</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:13px;color:#c4b5fd;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                ${isFr ? 'Digest Hebdomadaire' : 'Weekly Digest'}
              </p>
              <h1 style="margin:0 0 6px 0;font-size:24px;font-weight:800;color:#ffffff;">
                Microsoft Sales Intelligence
              </h1>
              <p style="margin:0;font-size:13px;color:#c4b5fd;">${today}</p>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="background:#ffffff;padding:24px 32px 8px 32px;">
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
                ${isFr
                  ? `Bonjour,<br><br>Voici la sélection des <strong>${articles.length} articles</strong> Microsoft les plus récents, pour vous préparer à vos prochains rendez-vous.`
                  : `Hello,<br><br>Here is your curated selection of <strong>${articles.length} recent Microsoft articles</strong> to help you prepare for your upcoming meetings.`}
              </p>
            </td>
          </tr>

          <!-- Articles -->
          <tr>
            <td style="background:#ffffff;padding:16px 32px 8px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${items}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background:#ffffff;padding:0 32px 24px 32px;text-align:center;">
              <a href="${BASE_URL}/blog" style="display:inline-block;background:#4f46e5;color:#ffffff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;">
                ${isFr ? 'Voir tous les articles →' : 'View all articles →'}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Nicolas BAYONNE — Microsoft Partner Account Manager<br>
                <a href="${BASE_URL}" style="color:#6366f1;text-decoration:none;">microsoft-sales-app.vercel.app</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default function DigestPage() {
  const { lang }         = useLang();
  const isFr             = lang === 'fr';
  const [days, setDays]  = useState(7);
  const [copied, setCopied] = useState(false);

  const articles = useMemo(() => {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return ARTICLES
      .filter(a => new Date(a.date) >= since)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);
  }, [days]);

  const allArticles = useMemo(() => ARTICLES.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), []);
  const displayArticles = articles.length >= 2 ? articles : allArticles;

  const html = useMemo(() => buildHtml(displayArticles, lang), [displayArticles, lang]);

  const copyHtml = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> {isFr ? 'Retour au blog' : 'Back to blog'}
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/15 rounded-xl p-2.5">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">{isFr ? 'Digest hebdomadaire' : 'Weekly Digest'}</h1>
          </div>
          <p className="text-white/70 text-sm">
            {isFr ? 'Génère un email HTML prêt à envoyer à tes prospects' : 'Generate an HTML email ready to send to your prospects'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{isFr ? 'Période :' : 'Period:'}</span>
            {[7, 14, 30].map(d => (
              <button key={d} onClick={() => setDays(d)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${days === d ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {d}j
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-gray-500">
              <strong className="text-gray-900">{displayArticles.length}</strong> {isFr ? 'articles' : 'articles'}
            </span>
            <button onClick={copyHtml}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              {copied
                ? <><CheckCheck className="w-4 h-4" /> {isFr ? 'Copié !' : 'Copied!'}</>
                : <><Copy className="w-4 h-4" /> {isFr ? 'Copier le HTML' : 'Copy HTML'}</>}
            </button>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold text-gray-700">{isFr ? 'Prévisualisation' : 'Preview'}</span>
            <span className="text-xs text-gray-400 ml-auto">{isFr ? 'Colle ce HTML dans Outlook ou Gmail' : 'Paste this HTML in Outlook or Gmail'}</span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <iframe
              srcDoc={html}
              className="w-full"
              style={{ height: '800px', border: 'none' }}
              title="Email digest preview"
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
