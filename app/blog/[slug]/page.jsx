import articlesData from '../../../data/blog-articles.json';
import ArticleClient from './ArticleClient';

const BASE = 'https://microsoft-sales-app.vercel.app';

function findArticle(slug) {
  return articlesData.find(a => a.slug === slug) || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) return { title: 'Article introuvable' };

  const title   = article.fr?.title  || article.en?.title  || article.slug;
  const excerpt = article.fr?.excerpt || article.en?.excerpt || '';
  const url     = `${BASE}/blog/${article.slug}`;

  return {
    title:       `${title} — Microsoft Sales Intelligence`,
    description: excerpt,
    alternates:  { canonical: url },
    openGraph: {
      title,
      description: excerpt,
      url,
      type:          'article',
      publishedTime: article.date,
      authors:       [article.author],
      siteName:      'Microsoft Sales Intelligence',
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description: excerpt,
    },
  };
}

export function generateStaticParams() {
  return articlesData.map(a => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  return <ArticleClient slug={slug} />;
}
