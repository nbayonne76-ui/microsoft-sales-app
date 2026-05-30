'use client';

import { ExternalLink, Clock } from 'lucide-react';
import { CATEGORY_COLORS } from '@/lib/blog-articles';

const NEWS_CATEGORY_MAP = {
  'Microsoft 365': 'm365',
  'Azure & Cloud': 'azure',
  'Copilot & IA': 'copilot',
  'Dynamics 365': 'dynamics',
  'Sécurité':     'securite',
};

function timeAgo(dateStr, lang) {
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 3600)  return lang === 'fr' ? `il y a ${Math.floor(diff / 60)} min` : `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return lang === 'fr' ? `il y a ${Math.floor(diff / 3600)}h`  : `${Math.floor(diff / 3600)}h ago`;
    return lang === 'fr' ? `il y a ${Math.floor(diff / 86400)}j` : `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return '';
  }
}

const SOURCE_COLORS = {
  exa:    'bg-violet-100 text-violet-700',
  tavily: 'bg-amber-100 text-amber-700',
  jina:   'bg-blue-100 text-blue-700',
};

export default function NewsCard({ item, lang = 'fr' }) {
  const catKey = NEWS_CATEGORY_MAP[item.category] || 'm365';
  const colorClass = CATEGORY_COLORS[catKey] || 'bg-gray-100 text-gray-700';
  const srcColor   = SOURCE_COLORS[item.sourceType] || 'bg-gray-100 text-gray-500';

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg hover:border-blue-200 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border shrink-0 ${colorClass}`}>
          {item.category}
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 shrink-0 mt-0.5 transition-colors" />
      </div>

      <h4 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
        {item.title}
      </h4>

      {item.excerpt && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{item.excerpt}</p>
      )}

      <div className="flex items-center justify-between text-[10px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-gray-600 truncate max-w-[120px]">{item.source}</span>
          <span className={`px-1.5 py-0.5 rounded-full ${srcColor}`}>{item.sourceType}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo(item.date, lang)}
        </div>
      </div>
    </a>
  );
}
