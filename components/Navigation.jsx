'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Mail, Users, BookOpen, Sparkles, Globe } from 'lucide-react';
import { useLang, t } from '@/contexts/LanguageContext';

export default function Navigation() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const tr = t[lang].nav;

  const navItems = [
    { href: '/', label: tr.dashboard, icon: Home },
    { href: '/account', label: tr.accountIntel, icon: Sparkles, highlight: true },
    { href: '/email-generator', label: tr.emailGenerator, icon: Mail },
    { href: '/knowledge-base', label: tr.knowledgeBase, icon: BookOpen },
    { href: '/clients', label: tr.clients, icon: Users },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t[lang].app.title}</h1>
              <p className="text-xs text-blue-100">{t[lang].app.subtitle}</p>
            </div>
          </div>

          {/* Navigation Links + Lang toggle */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-white text-blue-700 shadow-md font-semibold'
                      : item.highlight
                      ? 'bg-gradient-to-r from-indigo-500/40 to-purple-500/40 text-white border border-white/20 hover:from-indigo-500/60 hover:to-purple-500/60'
                      : 'text-blue-50 hover:bg-blue-500/30 hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
              className="flex items-center space-x-1.5 ml-2 px-3 py-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 transition-all duration-200 text-white text-sm font-medium"
              title={lang === 'en' ? 'Passer en français' : 'Switch to English'}
            >
              <Globe className="h-4 w-4" />
              <span>{lang === 'en' ? 'FR' : 'EN'}</span>
            </button>
          </div>

          {/* Mobile: lang toggle + hamburger */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 transition-all text-white text-sm font-medium"
            >
              <Globe className="h-4 w-4" />
              <span>{lang === 'en' ? 'FR' : 'EN'}</span>
            </button>
            <button className="p-2 rounded-lg hover:bg-blue-500/30">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg transition-all
                    ${isActive
                      ? 'bg-white text-blue-700 font-semibold'
                      : 'text-blue-50 hover:bg-blue-500/30'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
