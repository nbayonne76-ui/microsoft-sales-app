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

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalClients: 0,
    hotLeads: 0,
    emailsSent: 0,
    campaigns: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from APIs
    const fetchStats = async () => {
      try {
        // You can add actual API calls here
        setStats({
          totalClients: 15,
          hotLeads: 8,
          emailsSent: 142,
          campaigns: 3
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
      title: 'Generate Email',
      description: 'Create AI-powered professional emails',
      icon: Mail,
      href: '/',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'Hot Leads',
      description: 'View and manage your hottest prospects',
      icon: Flame,
      href: '/hot-leads',
      color: 'from-orange-500 to-red-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700'
    },
    {
      title: 'Build Leads',
      description: 'Import and organize campaign leads',
      icon: FileSpreadsheet,
      href: '/lead-builder',
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700'
    },
    {
      title: 'AI Agent',
      description: 'Chat with your intelligent email assistant',
      icon: MessageSquare,
      href: '/ai-agent',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    }
  ];

  const statsCards = [
    {
      label: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Hot Leads',
      value: stats.hotLeads,
      icon: Flame,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Emails Sent',
      value: stats.emailsSent,
      icon: Mail,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Active Campaigns',
      value: stats.campaigns,
      icon: Briefcase,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
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
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome Back, Nicolas
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Your Microsoft Campaign Management Hub
              </p>
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
            Quick Actions
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
                        Get Started
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
            Recent Activity
          </h2>
          <Card className="p-6 shadow-md border-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email Generated</p>
                    <p className="text-sm text-gray-500">Copilot follow-up campaign</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Flame className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">New Hot Lead Added</p>
                    <p className="text-sm text-gray-500">ACPPAV - Enterprise segment</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">5 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Campaign Imported</p>
                    <p className="text-sm text-gray-500">41 leads processed</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/analytics">
                <Button variant="outline" className="w-full">
                  View All Activity
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
