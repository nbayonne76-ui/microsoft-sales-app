import articlesData from '../data/blog-articles.json';

const BASE = 'https://microsoft-sales-app.vercel.app';

export default function sitemap() {
  const staticPages = [
    { url: BASE,                    priority: 1.0,  changeFrequency: 'daily'  },
    { url: `${BASE}/blog`,          priority: 0.9,  changeFrequency: 'daily'  },
    { url: `${BASE}/account`,       priority: 0.85, changeFrequency: 'weekly' },
    { url: `${BASE}/email-generator`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE}/knowledge-base`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE}/ai-agent`,      priority: 0.75, changeFrequency: 'weekly' },
    { url: `${BASE}/sequences`,     priority: 0.7,  changeFrequency: 'weekly' },
  ];

  const articlePages = articlesData.map(a => ({
    url:             `${BASE}/blog/${a.slug}`,
    lastModified:    new Date(a.date),
    changeFrequency: 'monthly',
    priority:        0.75,
  }));

  return [
    ...staticPages.map(p => ({ ...p, lastModified: new Date() })),
    ...articlePages,
  ];
}
