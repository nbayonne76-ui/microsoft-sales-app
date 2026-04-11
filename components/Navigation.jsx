'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Mail,
  Users,
  TrendingUp,
  Briefcase,
  MessageSquare,
  FileSpreadsheet,
  Flame,
  BookOpen,
  Rocket,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/account', label: 'Account Intel', icon: Sparkles, highlight: true },
  { href: '/email-generator', label: 'Email Generator', icon: Mail },
  { href: '/ai-agent', label: 'AI Agent', icon: MessageSquare },
  { href: '/hot-leads', label: 'Hot Leads', icon: Flame },
  { href: '/lead-builder', label: 'Lead Builder', icon: FileSpreadsheet },
  { href: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
  { href: '/collaboration-tools', label: 'Collaboration Tools', icon: Briefcase },
  { href: '/deal-room', label: 'Deal Room', icon: Rocket },
  { href: '/email-analytics', label: 'Email Analytics', icon: TrendingUp },
  { href: '/clients', label: 'Clients', icon: Users },
];

export default function Navigation() {
  const pathname = usePathname();

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
              <h1 className="text-xl font-bold">Microsoft Campaign Manager</h1>
              <p className="text-xs text-blue-100">by Nicolas BAYONNE</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
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
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
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
