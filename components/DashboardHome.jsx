'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mail,
  Users,
  Flame,
  TrendingUp,
  FileSpreadsheet,
  MessageSquare,
  Briefcase,
  ArrowRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLang, t } from '@/contexts/LanguageContext';

export default function DashboardHome() {
  const { lang } = useLang();
  const tr = t[lang].dashboard;
  const [stats, setStats] = useState({
    totalClients: 0,
    hotLeads: 0,
    emailsSent: 0,
    campaigns: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  function timeAgo(dateStr, lang) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60)   return lang === 'fr' ? "à l'instant" : 'just now';
    if (diff < 3600) return lang === 'fr' ? `il y a ${Math.floor(diff/60)} min` : `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return lang === 'fr' ? `il y a ${Math.floor(diff/3600)}h` : `${Math.floor(diff/3600)}h ago`;
    return lang === 'fr' ? `il y a ${Math.floor(diff/86400)}j` : `${Math.floor(diff/86400)}d ago`;
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clientsRes, leadsRes, interactionsRes, sequencesRes] = await Promise.allSettled([
          fetch('/api/clients?limit=1'),
          fetch('/api/hot-leads?limit=1'),
          fetch('/api/interactions?limit=1'),
          fetch('/api/sequences'),
        ]);

        const clients = clientsRes.status === 'fulfilled' && clientsRes.value.ok
          ? await clientsRes.value.json() : null;
        const leads = leadsRes.status === 'fulfilled' && leadsRes.value.ok
          ? await leadsRes.value.json() : null;
        const interactions = interactionsRes.status === 'fulfilled' && interactionsRes.value.ok
          ? await interactionsRes.value.json() : null;
        const sequences = sequencesRes.status === 'fulfilled' && sequencesRes.value.ok
          ? await sequencesRes.value.json() : null;

        // Build recent activity from real data
        const activityItems = [];
        if (clients?.clients?.length) {
          clients.clients.slice(0, 2).forEach(c => activityItems.push({
            type: 'client', icon: 'users', label: c.company,
            sub: c.segment, date: c.createdAt,
          }));
        }
        if (leads?.leads?.length) {
          leads.leads.slice(0, 2).forEach(l => activityItems.push({
            type: 'lead', icon: 'flame', label: l.companyName || l.company,
            sub: l.segment || l.priority, date: l.createdAt,
          }));
        }
        activityItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentActivity(activityItems.slice(0, 5));

        setStats({
          totalClients: clients?.total ?? clients?.clients?.length ?? 0,
          hotLeads: leads?.total ?? leads?.leads?.length ?? 0,
          emailsSent: interactions?.total ?? interactions?.interactions?.length ?? 0,
          campaigns: sequences?.sequences?.length ?? sequences?.length ?? 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: t[lang].nav.emailGenerator,
      description: lang === 'fr' ? 'Créez des emails B2B IA ultra-personnalisés' : 'Create AI-powered professional emails',
      icon: Mail,
      href: '/email-generator',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: lang === 'fr' ? 'Leads chauds' : 'Hot Leads',
      description: lang === 'fr' ? 'Gérez vos prospects les plus chauds' : 'View and manage your hottest prospects',
      icon: Flame,
      href: '/hot-leads',
      color: 'from-orange-500 to-red-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700'
    },
    {
      title: lang === 'fr' ? 'Importer des leads' : 'Build Leads',
      description: lang === 'fr' ? 'Importez et organisez vos leads campagne' : 'Import and organize campaign leads',
      icon: FileSpreadsheet,
      href: '/lead-builder',
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700'
    },
    {
      title: lang === 'fr' ? 'Agent IA' : 'AI Agent',
      description: lang === 'fr' ? 'Discutez avec votre assistant email intelligent' : 'Chat with your intelligent email assistant',
      icon: MessageSquare,
      href: '/ai-agent',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    }
  ];

  const statsCards = [
    { label: tr.stats.clients,   value: stats.totalClients, icon: Users,    color: 'bg-blue-500',   textColor: 'text-blue-600',   bgColor: 'bg-blue-50' },
    { label: tr.stats.hotLeads,  value: stats.hotLeads,     icon: Flame,    color: 'bg-orange-500', textColor: 'text-orange-600', bgColor: 'bg-orange-50' },
    { label: tr.stats.emails,    value: stats.emailsSent,   icon: Mail,     color: 'bg-green-500',  textColor: 'text-green-600',  bgColor: 'bg-green-50' },
    { label: tr.stats.campaigns, value: stats.campaigns,    icon: Briefcase,color: 'bg-purple-500', textColor: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{tr.welcome}</h1>
              <p className="text-lg text-gray-600 mt-1">{tr.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-200 border-0 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p className={`text-3xl font-bold ${stat.textColor}`}>
                      {loading ? '...' : stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-4 rounded-xl`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <ArrowRight className="h-6 w-6 mr-2 text-blue-600" />
            {tr.quickActions}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <Card
                    className={`
                      p-6 h-full cursor-pointer transition-all duration-300
                      bg-gradient-to-br ${action.color} ${action.hoverColor}
                      text-white border-0 shadow-lg hover:shadow-xl
                      hover:scale-105 transform
                    `}
                  >
                    <div className="flex flex-col h-full">
                      <div className="bg-white/20 p-3 rounded-lg w-fit mb-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                      <p className="text-sm text-white/90 flex-grow">
                        {action.description}
                      </p>
                      <div className="mt-4 flex items-center text-sm font-semibold">
                        {tr.getStarted}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
            {tr.recentActivity}
          </h2>
          <Card className="p-6 shadow-md border-0">
            <div className="space-y-1">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">
                  {lang === 'fr' ? 'Aucune activité récente' : 'No recent activity yet'}
                </p>
              ) : (
                recentActivity.map((item, i) => {
                  const isLead   = item.type === 'lead';
                  const iconCls  = isLead ? 'bg-orange-100' : 'bg-blue-100';
                  const Icon     = isLead ? Flame : Users;
                  const iconColor = isLead ? 'text-orange-600' : 'text-blue-600';
                  const actionLabel = isLead
                    ? (lang === 'fr' ? 'Lead ajouté' : 'Lead added')
                    : (lang === 'fr' ? 'Client créé' : 'Client created');
                  return (
                    <div key={i} className={`flex items-center justify-between py-3 ${i < recentActivity.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`${iconCls} p-2 rounded-lg`}>
                          <Icon className={`h-5 w-5 ${iconColor}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{actionLabel}</p>
                          <p className="text-sm text-gray-500">{item.label}{item.sub ? ` · ${item.sub}` : ''}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400 whitespace-nowrap ml-4">{timeAgo(item.date, lang)}</span>
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-6">
              <Link href="/analytics">
                <Button variant="outline" className="w-full">
                  {tr.viewAll}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
