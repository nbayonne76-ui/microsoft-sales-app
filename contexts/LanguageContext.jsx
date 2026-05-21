'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext({ lang: 'en', setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved === 'fr' || saved === 'en') setLangState(saved);
  }, []);

  function setLang(l) {
    setLangState(l);
    localStorage.setItem('lang', l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

export const t = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      accountIntel: 'Account Intel',
      emailGenerator: 'Email Generator',
      knowledgeBase: 'Knowledge Base',
      clients: 'Clients',
      hotLeads: 'Hot Leads',
      aiAgent: 'AI Agent',
      analytics: 'Analytics',
      sequences: 'Sequences',
      leadBuilder: 'Lead Builder',
      groups: {
        overview: 'Overview',
        aiTools: 'AI Tools',
        pipeline: 'Pipeline',
        knowledge: 'Knowledge',
      },
    },
    app: {
      title: 'Microsoft Campaign Manager',
      subtitle: 'by Nicolas BAYONNE',
    },
    dashboard: {
      welcome: 'Welcome Back, Nicolas',
      subtitle: 'Your Microsoft Campaign Management Hub',
      quickActions: 'Quick Actions',
      recentActivity: 'Recent Activity',
      viewAll: 'View All Activity',
      getStarted: 'Get Started',
      stats: {
        clients: 'Total Clients',
        hotLeads: 'Hot Leads',
        emails: 'Emails Sent',
        campaigns: 'Active Campaigns',
      },
    },
    email: {
      title: 'AI Email Generator',
      subtitle: 'Craft hyper-personalised B2B emails grounded in Microsoft KB',
      company: 'Company name',
      companyPlaceholder: 'e.g. Airbus, TotalEnergies…',
      contact: 'Contact name',
      contactPlaceholder: 'e.g. Jean Dupont',
      role: 'Role / Title',
      rolePlaceholder: 'e.g. CTO, IT Manager…',
      industry: 'Industry',
      industryPlaceholder: 'e.g. Manufacturing, Banking…',
      size: 'Company size',
      challenge: 'Main challenge',
      challengePlaceholder: 'e.g. remote collaboration, security…',
      solution: 'Solution to pitch',
      type: 'Email type',
      tone: 'Tone',
      generate: 'Generate Email',
      generating: 'Generating…',
      copy: 'Copy',
      copied: 'Copied!',
      subject: 'Subject',
      sources: 'KB Sources',
      plan: 'Recommended plan',
      price: 'Price',
      types: {
        prospection: 'Cold Outreach',
        relance: 'Follow-up',
        demo: 'Demo Invite',
        proposal: 'Proposal',
      },
      tones: {
        professional: 'Executive',
        friendly: 'Friendly',
        direct: 'Direct',
      },
      sizes: {
        startup: 'Startup (<50)',
        sme: 'SME (50–300)',
        enterprise: 'Enterprise (300+)',
      },
    },
    account: {
      title: 'Account Intelligence',
      subtitle: 'AI-powered account briefing grounded in Microsoft KB',
      placeholder: 'Enter a company name…',
      analyse: 'Analyse',
      analysing: 'Analysing…',
      score: 'Microsoft Fit Score',
      topSolutions: 'Top Solutions',
      emailAngles: 'Email Angles',
      keyQuestions: 'Discovery Questions',
      competitor: 'Competitor Risk',
      quickWin: 'Quick Win',
      plan: 'Plan',
      price: 'Price',
      roi: 'ROI',
    },
    kb: {
      title: 'Knowledge Base',
      subtitle: 'Microsoft pricing guides, licensing docs & assessment frameworks',
      searchPlaceholder: 'Search documents…',
      featured: 'Featured',
      documents: 'Pricing Guides & Docs',
      assessments: 'Assessment Frameworks',
      solutions: 'Microsoft Solutions',
      allCategories: 'All',
      timeline: 'Timeline',
      eligibility: 'Eligibility',
      outputs: 'Key Outputs',
      tool: 'Tool',
    },
  },
  fr: {
    nav: {
      dashboard: 'Tableau de bord',
      accountIntel: 'Intelligence Compte',
      emailGenerator: 'Générateur Email',
      knowledgeBase: 'Base de Connaissances',
      clients: 'Clients',
      hotLeads: 'Leads Chauds',
      aiAgent: 'Agent IA',
      analytics: 'Analytique',
      sequences: 'Séquences',
      leadBuilder: 'Importer Leads',
      groups: {
        overview: 'Vue d\'ensemble',
        aiTools: 'Outils IA',
        pipeline: 'Pipeline',
        knowledge: 'Connaissance',
      },
    },
    app: {
      title: 'Microsoft Campaign Manager',
      subtitle: 'par Nicolas BAYONNE',
    },
    dashboard: {
      welcome: 'Bienvenue, Nicolas',
      subtitle: 'Votre hub de gestion campagnes Microsoft',
      quickActions: 'Actions rapides',
      recentActivity: 'Activité récente',
      viewAll: 'Voir toute l\'activité',
      getStarted: 'Commencer',
      stats: {
        clients: 'Clients totaux',
        hotLeads: 'Leads chauds',
        emails: 'Emails envoyés',
        campaigns: 'Campagnes actives',
      },
    },
    email: {
      title: 'Générateur d\'emails IA',
      subtitle: 'Rédigez des emails B2B ultra-personnalisés basés sur la KB Microsoft',
      company: 'Nom de l\'entreprise',
      companyPlaceholder: 'ex. Airbus, TotalEnergies…',
      contact: 'Nom du contact',
      contactPlaceholder: 'ex. Jean Dupont',
      role: 'Poste / Titre',
      rolePlaceholder: 'ex. DSI, Responsable IT…',
      industry: 'Secteur d\'activité',
      industryPlaceholder: 'ex. Industrie, Banque…',
      size: 'Taille entreprise',
      challenge: 'Défi principal',
      challengePlaceholder: 'ex. collaboration à distance, sécurité…',
      solution: 'Solution à pitcher',
      type: 'Type d\'email',
      tone: 'Ton',
      generate: 'Générer l\'email',
      generating: 'Génération…',
      copy: 'Copier',
      copied: 'Copié !',
      subject: 'Objet',
      sources: 'Sources KB',
      plan: 'Plan recommandé',
      price: 'Prix',
      types: {
        prospection: 'Prospection',
        relance: 'Relance',
        demo: 'Invitation démo',
        proposal: 'Proposition',
      },
      tones: {
        professional: 'Exécutif',
        friendly: 'Amical',
        direct: 'Direct',
      },
      sizes: {
        startup: 'Startup (<50)',
        sme: 'PME (50–300)',
        enterprise: 'Grand compte (300+)',
      },
    },
    account: {
      title: 'Intelligence Compte',
      subtitle: 'Brief account IA basé sur la base de connaissances Microsoft',
      placeholder: 'Entrez le nom d\'une entreprise…',
      analyse: 'Analyser',
      analysing: 'Analyse en cours…',
      score: 'Score d\'adéquation Microsoft',
      topSolutions: 'Meilleures solutions',
      emailAngles: 'Angles d\'approche email',
      keyQuestions: 'Questions de découverte',
      competitor: 'Risque concurrentiel',
      quickWin: 'Victoire rapide',
      plan: 'Plan',
      price: 'Prix',
      roi: 'ROI',
    },
    kb: {
      title: 'Base de Connaissances',
      subtitle: 'Guides tarifaires Microsoft, documents de licensing & frameworks d\'assessment',
      searchPlaceholder: 'Rechercher des documents…',
      featured: 'À la une',
      documents: 'Guides tarifaires & docs',
      assessments: 'Frameworks d\'assessment',
      solutions: 'Solutions Microsoft',
      allCategories: 'Tous',
      timeline: 'Durée',
      eligibility: 'Éligibilité',
      outputs: 'Livrables clés',
      tool: 'Outil',
    },
  },
};
