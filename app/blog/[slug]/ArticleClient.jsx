'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Calendar, ArrowRight, Linkedin, Link2, CheckCheck } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { getArticle, ARTICLES, CATEGORY_COLORS, CATEGORY_GRADIENTS } from '@/lib/blog-articles';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

// ── Section renderers ────────────────────────────────────────────────────────
function renderSection(section, i, isFr) {
  switch (section.type) {
    case 'intro':
      return (
        <p key={i} className="text-lg text-gray-700 leading-relaxed font-medium border-l-4 border-blue-500 pl-5 py-1 bg-blue-50 rounded-r-xl">
          {section.text}
        </p>
      );
    case 'h2':
      return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">{section.text}</h2>;
    case 'p':
      return <p key={i} className="text-gray-700 leading-relaxed">{section.text}</p>;
    case 'list':
      return (
        <ul key={i} className="space-y-3">
          {section.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'pricing':
      return (
        <div key={i} className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">{isFr ? 'Composant' : 'Component'}</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">{isFr ? 'Prix' : 'Price'}</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">{isFr ? 'Note' : 'Note'}</th>
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, j) => (
                <tr key={j} className={`border-b border-gray-100 ${row.bold ? 'bg-blue-50 font-bold' : ''}`}>
                  <td className="px-4 py-3 text-gray-900">{row.component}</td>
                  <td className="px-4 py-3 text-blue-700 font-semibold">{row.price}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'cta':
      return (
        <div key={i} className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mt-4">
          <p className="font-semibold mb-3">{section.text}</p>
          <Link
            href={section.href}
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
          >
            {section.action} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      );
    default:
      return null;
  }
}

export default function ArticlePage({ params }) {
  const { lang } = useLang();
  const router = useRouter();
  const article = getArticle(params.slug);
  const isFr = lang === 'fr';

  const [progress, setProgress]     = useState(0);
  const [copied,   setCopied]       = useState(false);
  const [pageUrl,  setPageUrl]      = useState('');

  useEffect(() => {
    if (!article) router.push('/blog');
  }, [article]);

  useEffect(() => {
    setPageUrl(window.location.href);
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total    = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const copyLink = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
      '_blank', 'noopener'
    );
  };

  if (!article) return null;

  const content = lang === 'en' && article.en ? { ...article.fr, ...article.en } : article.fr;
  const colorClass  = CATEGORY_COLORS[article.category]    || 'bg-gray-100 text-gray-700';
  const gradClass   = CATEGORY_GRADIENTS[article.category]  || 'from-blue-600 to-indigo-600';
  const catLabel    = article.category === 'm365' ? 'Microsoft 365' :
                      article.category === 'azure' ? 'Azure & Cloud' :
                      article.category === 'copilot' ? (isFr ? 'Copilot & IA' : 'Copilot & AI') :
                      article.category === 'dynamics' ? 'Dynamics 365' :
                      (isFr ? 'Sécurité' : 'Security');

  const related = ARTICLES.filter(a => a.slug !== article.slug && a.category === article.category).slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Reading progress bar ──────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-black/10">
        <div
          className={`h-full bg-gradient-to-r ${gradClass} transition-all duration-75`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradClass} text-white py-14 px-8`}>
        <div className="relative z-10 max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {isFr ? 'Retour au blog' : 'Back to blog'}
          </Link>

          <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold border ${colorClass} mb-4`}>
            {catLabel}
          </span>

          <motion.h1 {...fadeUp} className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {content.title}
          </motion.h1>

          <motion.p {...fadeUp} transition={{ delay: 0.07 }} className="text-white/80 text-lg leading-relaxed mb-6">
            {content.excerpt}
          </motion.p>

          <motion.div {...fadeUp} transition={{ delay: 0.12 }} className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 text-white/70 text-sm flex-wrap">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {article.author}
              </span>
              <span className="text-white/40">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {article.readTime}
              </span>
              <span className="text-white/40">·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(article.date).toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            {/* Share buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={shareLinkedIn}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg transition-colors text-white/90"
              >
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </button>
              <button
                onClick={copyLink}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg transition-colors text-white/90"
              >
                {copied
                  ? <><CheckCheck className="w-3.5 h-3.5" /> {isFr ? 'Copié !' : 'Copied!'}</>
                  : <><Link2 className="w-3.5 h-3.5" /> {isFr ? 'Copier le lien' : 'Copy link'}</>
                }
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Article body ─────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <article className="prose-custom space-y-6">
          {(content.sections || article.fr.sections || []).map((section, i) => renderSection(section, i, isFr))}
        </article>

        {/* Author card */}
        <div className="mt-12 p-5 bg-white rounded-2xl border border-gray-100 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradClass} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
            N
          </div>
          <div>
            <p className="font-semibold text-gray-900">{article.author}</p>
            <p className="text-sm text-gray-500">{article.authorRole}</p>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="font-bold text-gray-900 mb-5">
              {isFr ? 'Articles similaires' : 'Related articles'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((a) => {
                const c = lang === 'en' && a.en ? { ...a.fr, ...a.en } : a.fr;
                const cc = CATEGORY_COLORS[a.category] || 'bg-gray-100 text-gray-700';
                return (
                  <Link key={a.slug} href={`/blog/${a.slug}`}>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-blue-200 transition-all group">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${cc} mb-2 inline-block`}>
                        {catLabel}
                      </span>
                      <h4 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors line-clamp-2">
                        {c.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {a.readTime}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
