'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, User, ArrowRight, Star } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_GRADIENTS } from '@/lib/blog-articles';

function formatDate(dateStr, lang) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function ArticleCard({ article, lang = 'fr', featured = false, index = 0 }) {
  const content = lang === 'en' && article.en ? { ...article.fr, ...article.en } : article.fr;
  const colorClass  = CATEGORY_COLORS[article.category]   || 'bg-gray-100 text-gray-700';
  const gradClass   = CATEGORY_GRADIENTS[article.category] || 'from-blue-600 to-indigo-600';

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06 }}
        className="col-span-full"
      >
        <Link href={`/blog/${article.slug}`}>
          <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${gradClass} p-0.5 hover:shadow-2xl transition-all group`}>
            <div className="bg-white rounded-[calc(1rem-2px)] p-8 flex flex-col md:flex-row gap-8">
              {/* Left */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${colorClass}`}>
                    {article.category === 'm365' ? 'Microsoft 365' :
                     article.category === 'azure' ? 'Azure & Cloud' :
                     article.category === 'copilot' ? 'Copilot & IA' :
                     article.category === 'dynamics' ? 'Dynamics 365' : 'Sécurité'}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400" /> À la une
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors leading-tight">
                  {content.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">{content.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                  <span>{formatDate(article.date, lang)}</span>
                </div>
              </div>
              {/* Right CTA */}
              <div className="flex items-center shrink-0">
                <div className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${gradClass} text-white text-sm font-semibold group-hover:shadow-lg transition-all`}>
                  {lang === 'fr' ? 'Lire l\'article' : 'Read article'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link href={`/blog/${article.slug}`}>
        <div className="h-full bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-blue-200 transition-all group cursor-pointer flex flex-col">
          {/* Category badge */}
          <div className="mb-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${colorClass}`}>
              {article.category === 'm365' ? 'Microsoft 365' :
               article.category === 'azure' ? 'Azure & Cloud' :
               article.category === 'copilot' ? 'Copilot & IA' :
               article.category === 'dynamics' ? 'Dynamics 365' : 'Sécurité'}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
            {content.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1 mb-4">
            {content.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}</span>
              <span>·</span>
              <span>{formatDate(article.date, lang)}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
