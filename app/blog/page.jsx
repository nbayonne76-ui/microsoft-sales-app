'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Rss, RefreshCw, Zap, BookOpen, Search, X } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { ARTICLES, BLOG_CATEGORIES } from '@/lib/blog-articles';
import ArticleCard from '@/components/blog/ArticleCard';
import NewsCard from '@/components/blog/NewsCard';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function BlogPage() {
  const { lang } = useLang();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newsFilter, setNewsFilter] = useState('all');
  const newsFetchedAt = useRef(null);

  const isFr = lang === 'fr';

  // Fetch live news quand l'onglet news est ouvert,
  // ou si les données ont plus de 10 minutes
  useEffect(() => {
    if (activeCategory !== 'news') return;
    const stale = !newsFetchedAt.current || Date.now() - newsFetchedAt.current > 10 * 60 * 1000;
    if (news.length === 0 || stale) fetchNews(true);
  }, [activeCategory]);

  async function fetchNews(force = false) {
    setNewsLoading(true);
    setNewsError(false);
    if (force) setNews([]); // reset pour forcer le rechargement visible
    try {
      const url = `/api/blog/news?t=${force ? Date.now() : 'cache'}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setNews(data.news || []);
        setLastUpdated(data.lastUpdated);
        newsFetchedAt.current = Date.now();
      } else {
        setNewsError(true);
      }
    } catch {
      setNewsError(true);
    } finally {
      setNewsLoading(false);
    }
  }

  // Filter static articles
  const filteredArticles = ARTICLES.filter(a => {
    const content = lang === 'en' && a.en ? { ...a.fr, ...a.en } : a.fr;
    const matchCat = activeCategory === 'all' || a.category === activeCategory;
    const matchSearch = !search ||
      content.title.toLowerCase().includes(search.toLowerCase()) ||
      content.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredArticle = ARTICLES.find(a => a.featured);
  const regularArticles  = filteredArticles.filter(a => !a.featured || activeCategory !== 'all');

  // Filter news by category
  const filteredNews = newsFilter === 'all'
    ? news
    : news.filter(n => {
        const catMap = { m365: 'Microsoft 365', azure: 'Azure & Cloud', copilot: 'Copilot & IA', dynamics: 'Dynamics 365', securite: 'Sécurité' };
        return n.category === catMap[newsFilter];
      });

  return (
    <div className="min-h-screen ms-surface">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden ms-hero-bg text-white py-14 px-8">
        <div className="orb orb-blue   w-72 h-72 -top-16 -left-16" />
        <div className="orb orb-purple w-56 h-56 top-0 right-8" style={{ animationDelay: '2s' }} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Newspaper className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {isFr ? 'Blog Microsoft' : 'Microsoft Blog'}
              </h1>
              <p className="text-blue-200 text-sm">
                {isFr
                  ? 'Articles expert + actualités live : mis à jour toutes les heures'
                  : 'Expert articles + live news : updated every hour'}
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp} transition={{ delay: 0.08 }} className="flex gap-4 flex-wrap text-sm mb-6">
            {[
              ['📝', ARTICLES.length, isFr ? 'articles experts' : 'expert articles'],
              ['⚡', '5', isFr ? 'catégories Microsoft' : 'Microsoft categories'],
              ['🔄', isFr ? 'Mise à jour 1h' : 'Updated hourly', ''],
              ['🌐', isFr ? 'Multi-sources (Exa + Jina + Tavily)' : 'Multi-source (Exa + Jina + Tavily)', ''],
            ].map(([emoji, val, label], i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <span className="mr-1">{emoji}</span>
                <span className="font-bold">{val}</span>
                {label && <span className="text-blue-200 ml-2 text-xs">{label}</span>}
              </div>
            ))}
          </motion.div>

          {/* Search */}
          <motion.div {...fadeUp} transition={{ delay: 0.12 }} className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveCategory('all'); }}
              placeholder={isFr ? 'Rechercher un article…' : 'Search articles…'}
              className="w-full pl-11 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-300 transition-colors text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Category tabs ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          {BLOG_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearch(''); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{lang === 'en' ? cat.labelEn : cat.label}</span>
              {cat.id === 'news' && (
                <span className="ml-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">

          {/* ── LIVE NEWS TAB ─────────────────────────────────────────────── */}
          {activeCategory === 'news' && (
            <motion.div key="news" {...fadeUp} initial="initial" animate="animate">
              {/* News header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Rss className="w-5 h-5 text-red-500" />
                  <h2 className="font-bold text-gray-900">
                    {isFr ? 'Actualités Microsoft live' : 'Live Microsoft News'}
                  </h2>
                  {lastUpdated && (
                    <span className="text-xs text-gray-400">
                      · {isFr ? 'mis à jour' : 'updated'} {new Date(lastUpdated).toLocaleTimeString(isFr ? 'fr-FR' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => fetchNews(true)}
                  disabled={newsLoading}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${newsLoading ? 'animate-spin' : ''}`} />
                  {isFr ? 'Actualiser' : 'Refresh'}
                </button>
              </div>

              {/* News category filter */}
              <div className="flex gap-2 flex-wrap mb-6">
                {['all', 'm365', 'azure', 'copilot', 'dynamics', 'securite'].map(f => (
                  <button
                    key={f}
                    onClick={() => setNewsFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      newsFilter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f === 'all' ? (isFr ? 'Tout' : 'All') :
                     f === 'm365' ? 'M365' : f === 'azure' ? 'Azure' :
                     f === 'copilot' ? 'Copilot' : f === 'dynamics' ? 'Dynamics' : isFr ? 'Sécu' : 'Security'}
                  </button>
                ))}
              </div>

              {newsLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" style={{ animationDelay: `${i * 0.05}s` }} />
                  ))}
                </div>
              )}

              {newsError && (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">📡</div>
                  <p className="text-gray-500 mb-4">
                    {isFr ? 'Impossible de charger les actualités.' : 'Could not load news.'}
                  </p>
                  <button onClick={fetchNews} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                    {isFr ? 'Réessayer' : 'Retry'}
                  </button>
                </div>
              )}

              {!newsLoading && !newsError && filteredNews.length === 0 && news.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">{isFr ? 'Aucun résultat pour ce filtre.' : 'No results for this filter.'}</p>
                </div>
              )}

              {!newsLoading && !newsError && filteredNews.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredNews.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <NewsCard item={item} lang={lang} />
                    </motion.div>
                  ))}
                </div>
              )}

              {!newsLoading && news.length === 0 && !newsError && (
                <div className="text-center py-16">
                  <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {isFr ? 'Chargement des actualités en cours…' : 'Loading news…'}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── ARTICLES TAB ──────────────────────────────────────────────── */}
          {activeCategory !== 'news' && (
            <motion.div key="articles" {...fadeUp} initial="initial" animate="animate">
              {/* Search results info */}
              {search && (
                <p className="text-sm text-gray-500 mb-6">
                  {filteredArticles.length} {isFr ? 'résultat(s) pour' : 'result(s) for'} «{search}»
                </p>
              )}

              {/* Featured article (only on "all" tab without search) */}
              {activeCategory === 'all' && !search && featuredArticle && (
                <div className="grid gap-5 mb-5">
                  <ArticleCard article={featuredArticle} lang={lang} featured index={0} />
                </div>
              )}

              {/* Articles grid */}
              {regularArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {regularArticles.map((article, i) => (
                    <ArticleCard key={article.slug} article={article} lang={lang} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">
                    {isFr ? 'Aucun article dans cette catégorie.' : 'No articles in this category.'}
                  </p>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
