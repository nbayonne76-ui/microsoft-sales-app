import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'blog-articles.json');

let _cache = null;

function load() {
  if (_cache) return _cache;
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  _cache = JSON.parse(raw);
  return _cache;
}

export function invalidateCache() {
  _cache = null;
}

export function getArticles() {
  return load();
}

export function getArticle(slug) {
  return load().find(a => a.slug === slug) || null;
}

export function getArticlesByCategory(categoryId) {
  const articles = load();
  if (!categoryId || categoryId === 'all') return articles;
  return articles.filter(a => a.category === categoryId);
}

export function addOrUpdateArticle(article) {
  const articles = load();
  const idx = articles.findIndex(a => a.slug === article.slug);
  if (idx >= 0) {
    articles[idx] = article;
  } else {
    articles.unshift(article);
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2), 'utf-8');
  _cache = articles;
  return article;
}
