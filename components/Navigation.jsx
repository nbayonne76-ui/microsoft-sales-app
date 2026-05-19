'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Mail, Users, BookOpen, Sparkles, Globe,
  Flame, MessageSquare, BarChart3, Zap, FileSpreadsheet,
  ChevronLeft, ChevronRight, Bot
} from 'lucide-react';
import { useLang, t } from '@/contexts/LanguageContext';

export default function Navigation({ collapsed = false, setCollapsed = () => {} }) {
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const tr = t[lang].nav;

  const groups = [
    {
      key: 'overview',
      label: tr.groups.overview,
      items: [
        { href: '/',          label: tr.dashboard,  icon: Home        },
        { href: '/analytics', label: tr.analytics,  icon: BarChart3   },
      ],
    },
    {
      key: 'aiTools',
      label: tr.groups.aiTools,
      items: [
        { href: '/account',         label: tr.accountIntel,   icon: Sparkles,       highlight: true },
        { href: '/email-generator', label: tr.emailGenerator, icon: Mail            },
        { href: '/ai-agent',        label: tr.aiAgent,        icon: MessageSquare   },
      ],
    },
    {
      key: 'pipeline',
      label: tr.groups.pipeline,
      items: [
        { href: '/clients',       label: tr.clients,      icon: Users           },
        { href: '/hot-leads',     label: tr.hotLeads,     icon: Flame           },
        { href: '/lead-builder',  label: tr.leadBuilder,  icon: FileSpreadsheet },
        { href: '/sequences',     label: tr.sequences,    icon: Zap             },
      ],
    },
    {
      key: 'knowledge',
      label: tr.groups.knowledge,
      items: [
        { href: '/knowledge-base', label: tr.knowledgeBase, icon: BookOpen },
      ],
    },
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-40 flex flex-col
        bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a]
        border-r border-white/10 shadow-2xl
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[68px]' : 'w-[220px]'}
      `}
    >
      {/* ── Logo ──────────────────────────────────────────────── */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
          <Bot className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight truncate">
              {t[lang].app.title.replace('Microsoft ', '')}
            </p>
            <p className="text-blue-300 text-[10px] truncate">{t[lang].app.subtitle}</p>
          </div>
        )}
      </div>

      {/* ── Nav groups ─────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1 scrollbar-hide">
        {groups.map((group) => (
          <div key={group.key} className="px-2">
            {!collapsed && (
              <p className="text-[10px] font-semibold text-blue-300/60 uppercase tracking-widest px-2 pt-3 pb-1">
                {group.label}
              </p>
            )}
            {collapsed && <div className="my-2 border-t border-white/10" />}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5
                    transition-all duration-150 group relative
                    ${isActive
                      ? 'bg-white text-blue-700 shadow-md font-semibold'
                      : item.highlight
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-200 border border-indigo-400/20 hover:border-indigo-400/50 hover:from-indigo-500/30 hover:to-purple-500/30'
                      : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-600' : ''}`} />
                  {!collapsed && (
                    <span className="text-sm truncate">{item.label}</span>
                  )}
                  {/* Active indicator bar */}
                  {isActive && !collapsed && (
                    <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                  {/* Tooltip for collapsed */}
                  {collapsed && (
                    <span className="
                      absolute left-full ml-2 px-2 py-1 rounded-md bg-gray-900 text-white text-xs
                      whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none
                      transition-opacity duration-150 z-50
                    ">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Footer : lang toggle + collapse ───────────────────── */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
          title={lang === 'en' ? 'Passer en français' : 'Switch to English'}
          className={`
            w-full flex items-center gap-2.5 px-3 py-2 rounded-xl
            border border-white/20 bg-white/5 hover:bg-white/15
            text-blue-100 text-sm font-medium transition-all
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <Globe className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{lang === 'en' ? '🇫🇷 Français' : '🇬🇧 English'}</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`
            w-full flex items-center gap-2.5 px-3 py-2 rounded-xl
            text-blue-300/60 hover:text-white hover:bg-white/10
            text-sm transition-all
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          {collapsed
            ? <ChevronRight className="h-4 w-4 shrink-0" />
            : <><ChevronLeft className="h-4 w-4 shrink-0" /><span className="text-xs">Réduire</span></>
          }
        </button>
      </div>
    </aside>
  );
}
