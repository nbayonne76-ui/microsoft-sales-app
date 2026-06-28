// Source unique de vérité pour les articles : data/blog-articles.json
// Mis à jour automatiquement par les agents (blog-store.js)

import articlesData from '../data/blog-articles.json';

export const ARTICLES = articlesData;

export const BLOG_CATEGORIES = [
  { id: 'all',      label: 'Tous',          labelEn: 'All',           emoji: '📋' },
  { id: 'news',     label: 'Actualités',     labelEn: 'News',          emoji: '⚡' },
  { id: 'm365',     label: 'Microsoft 365',  labelEn: 'Microsoft 365', emoji: '💼' },
  { id: 'azure',    label: 'Azure & Cloud',  labelEn: 'Azure & Cloud', emoji: '☁️' },
  { id: 'copilot',  label: 'Copilot & IA',   labelEn: 'Copilot & AI',  emoji: '🤖' },
  { id: 'dynamics', label: 'Dynamics 365',   labelEn: 'Dynamics 365',  emoji: '🎯' },
  { id: 'securite', label: 'Sécurité',       labelEn: 'Security',      emoji: '🛡️' },
];

export const CATEGORY_COLORS = {
  m365:     'bg-blue-100 text-blue-700 border-blue-200',
  azure:    'bg-sky-100 text-sky-700 border-sky-200',
  copilot:  'bg-purple-100 text-purple-700 border-purple-200',
  dynamics: 'bg-orange-100 text-orange-700 border-orange-200',
  securite: 'bg-red-100 text-red-700 border-red-200',
};

export const CATEGORY_GRADIENTS = {
  m365:     'from-blue-600 to-indigo-600',
  azure:    'from-sky-500 to-blue-600',
  copilot:  'from-purple-600 to-indigo-600',
  dynamics: 'from-orange-500 to-red-600',
  securite: 'from-red-500 to-rose-600',
};

// Labels lisibles — source unique de vérité (utilisée par blog, account, digest)
export const CATEGORY_LABELS = {
  m365:     'Microsoft 365',
  azure:    'Azure & Cloud',
  copilot:  'Copilot & IA',
  dynamics: 'Dynamics 365',
  securite: 'Sécurité',
};

// Mapping catégorie intel (account-intel API) → catégorie blog
export const INTEL_TO_BLOG = {
  m365:     'm365',
  azure:    'azure',
  dynamics: 'dynamics',
  power:    'copilot',
  security: 'securite',
  devtools: 'azure',
};

// Helper bilingue — remplace le pattern { ...a.fr, ...a.en } répété partout
export function getArticleContent(article, lang) {
  if (!article) return null;
  return lang === 'en' && article.en ? { ...article.fr, ...article.en } : article.fr;
}

export function getArticle(slug) {
  return ARTICLES.find(a => a.slug === slug) || null;
}

export function getArticlesByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return ARTICLES;
  return ARTICLES.filter(a => a.category === categoryId);
}
