'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, X, ChevronRight, Home, Download,
  Brain, Shield, Database, Server, LineChart, Cog, Network,
  Building2, DollarSign, Zap, Star, CheckCircle, TrendingUp, Award,
  Briefcase, Bot, Wrench, Users, Globe, Layers,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLang, t } from '@/contexts/LanguageContext';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

// ── Azure infrastructure category config ────────────────────────────────
const AZURE_CAT = {
  ai:          { label: 'AI & ML',      icon: Brain,     color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50',  text: 'text-purple-700' },
  compute:     { label: 'Compute',      icon: Server,    color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50',  text: 'text-orange-700' },
  storage:     { label: 'Storage',      icon: Database,  color: 'from-green-500 to-green-600',   bg: 'bg-green-50',   text: 'text-green-700'  },
  analytics:   { label: 'Analytics',    icon: LineChart, color: 'from-blue-500 to-blue-600',     bg: 'bg-blue-50',    text: 'text-blue-700'   },
  security:    { label: 'Security',     icon: Shield,    color: 'from-red-500 to-red-600',       bg: 'bg-red-50',     text: 'text-red-700'    },
  networking:  { label: 'Networking',   icon: Network,   color: 'from-cyan-500 to-cyan-600',     bg: 'bg-cyan-50',    text: 'text-cyan-700'   },
  management:  { label: 'Management',   icon: Cog,       color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50',  text: 'text-yellow-700' },
  development: { label: 'Development',  icon: Cog,       color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50',  text: 'text-violet-700' },
  integration: { label: 'Integration',  icon: Cog,       color: 'from-teal-500 to-teal-600',    bg: 'bg-teal-50',    text: 'text-teal-700'   },
  iot:         { label: 'IoT',          icon: Network,   color: 'from-lime-500 to-lime-600',    bg: 'bg-lime-50',    text: 'text-lime-700'   },
  'modern-work':{ label: 'Modern Work', icon: Layers,    color: 'from-sky-500 to-sky-600',      bg: 'bg-sky-50',     text: 'text-sky-700'    },
  // fallback for detail view
  business:    { label: 'Business Apps',icon: Building2, color: 'from-indigo-500 to-indigo-600',bg: 'bg-indigo-50',  text: 'text-indigo-700' },
};

// ── Dynamics 365 subcategory groups ─────────────────────────────────────
const D365_GROUP = {
  all:       { label: 'Tout Dynamics',    icon: Building2, color: 'from-indigo-500 to-purple-600', bg: 'bg-indigo-50',  text: 'text-indigo-700'  },
  erp:       { label: 'ERP & Finance',    icon: Database,  color: 'from-blue-600 to-blue-700',     bg: 'bg-blue-50',    text: 'text-blue-700'    },
  crm:       { label: 'CRM & Ventes',     icon: TrendingUp,color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50',  text: 'text-orange-700'  },
  marketing: { label: 'Marketing & Data', icon: LineChart, color: 'from-pink-500 to-rose-600',     bg: 'bg-pink-50',    text: 'text-pink-700'    },
  copilot:   { label: 'Copilot & IA',     icon: Bot,       color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50',  text: 'text-violet-700'  },
  field:     { label: 'Terrain & Ops',    icon: Wrench,    color: 'from-emerald-500 to-teal-600',  bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

const SUB_TO_GROUP = {
  'erp-enterprise': 'erp', 'erp-smb': 'erp', 'erp-scm': 'erp',
  'erp-retail': 'erp', 'erp-projects': 'erp', 'hr': 'erp',
  'crm-sales': 'crm', 'crm-service': 'crm', 'customer-experience': 'crm', 'ccaas': 'crm',
  'marketing-automation': 'marketing', 'cdp-marketing': 'marketing',
  'productivity-ai': 'copilot', 'ai-sales-assistant': 'copilot',
  'crm-field': 'field', 'mixed-reality': 'field', 'vdi': 'field',
};

// ── Pricing docs & KB documents ─────────────────────────────────────────
const KB_DOCS = [
  { id: 'm365-pricing',    title: 'M365 Pricing 2025',               file: 'm365-pricing-2025.md',                  category: 'M365',     emoji: '💼', featured: true,  desc: 'Tarifs complets Business & Enterprise — Copilot add-on, remises CSP, comparatif plans' },
  { id: 'm365-e7',         title: 'M365 E7 — Frontier Worker Suite', file: 'm365-e7-frontier-worker-suite.md',      category: 'M365',     emoji: '🚀', featured: true,  desc: 'Nouveau plan Frontline Workers — couverture terrain, appareils partagés, tarif dédié' },
  { id: 'e3-vs-e5',        title: 'M365 E3 vs E5 Guide',             file: 'm365-e3-vs-e5-decision-guide.md',       category: 'M365',     emoji: '📊', featured: true,  desc: 'Aide à la décision E3/E5 — tableau comparatif, critères de choix, ROI sécurité avancée' },
  { id: 'o365-e3-e5',      title: 'Office 365 E3 & E5 Plans',        file: 'm365-pricing-2025.md',                  category: 'M365',     emoji: '📧', featured: false, desc: 'Plans Office 365 purs — messagerie & apps sans gouvernance avancée' },
  { id: 'licensing',       title: 'Licensing & Contracts',            file: 'microsoft-licensing-contracts-guide.md',category: 'M365',     emoji: '📄', featured: true,  desc: 'Guide complet contrats EA, CSP, MCA — clauses clés, renouvellements, audit de licences' },
  { id: 'csp-vs-mca',      title: 'CSP vs MCA Decision',             file: 'csp-vs-mca-decision-guide.md',          category: 'M365',     emoji: '🤝', featured: false, desc: 'Choisir entre Cloud Solution Provider et Microsoft Customer Agreement — critères et impacts' },
  { id: 'm365-collab',     title: 'M365 Collaboration',              file: 'microsoft-365-collaboration.md',        category: 'M365',     emoji: '✨', featured: false, desc: 'Teams, SharePoint, Loop — cas d\'usage collaboration moderne et productivité équipe' },
  { id: 'teams-guide',     title: 'Microsoft Teams — Guide 2026',    file: 'microsoft-teams-guide-2026.md',         category: 'M365',     emoji: '💬', featured: true,  isNew: true, desc: 'Guide complet Teams 2026 — plans, features par cloud (Commercial/GCC/DoD), appels et réunions' },
  { id: 'viva-suite',      title: 'Microsoft Viva Suite 2026',       file: 'microsoft-viva-suite-2026.md',          category: 'M365',     emoji: '🌟', featured: false, isNew: true, desc: 'Suite Employee Experience — Viva Engage, Insights, Learning, Goals, Amplify — disponibilité par plan' },
  { id: 'm365-apps-ent',   title: 'M365 Apps Enterprise 2026',       file: 'microsoft-365-apps-enterprise.md',      category: 'M365',     emoji: '🖥️', featured: false, isNew: true, desc: 'Apps desktop & web enterprise — déploiement, mise à jour, activation, Cloud Desktop' },
  { id: 'm365-frontline',  title: 'Frontline Workers M365',          file: 'microsoft-365-frontline-workers.md',    category: 'M365',     emoji: '👷', featured: false, isNew: true, desc: 'Plans F1/F3/F6 — appareils partagés, walkie-talkie Teams, tâches terrain, Shifts' },
  { id: 'modern-work-lic', title: 'Modern Work Licensing (SCIM+P)',  file: 'modern-work-licensing-guide.md',        category: 'M365',     emoji: '📋', featured: true,  isNew: true, desc: 'Guide licences SCIM+P officiel Microsoft — M365 Business/Enterprise, Security add-ons, attach rules' },
  { id: 'feat-avail',      title: 'Feature Availability Officielle', file: 'm365-feature-availability-official.md', category: 'M365',     emoji: '📑', featured: true,  isNew: true, desc: '13 services documentés Microsoft Learn — tableaux de disponibilité par plan (Teams, Exchange, SharePoint, OneDrive, Copilot…)' },
  { id: 'azure-pricing',   title: 'Azure Pricing 2025',              file: 'azure-pricing-2025.md',                 category: 'Azure',    emoji: '☁️', featured: true,  desc: 'Tarifs Azure IaaS/PaaS — compute, storage, réseau, réductions Reserved Instances' },
  { id: 'azure-migration', title: 'Azure Migration',                 file: 'azure-migration.md',                    category: 'Azure',    emoji: '🚀', featured: false, desc: 'Playbook de migration cloud — assessment, lift & shift, modernisation, TCO calculator' },
  { id: 'dynamics',        title: 'Dynamics 365 Pricing',            file: 'dynamics-365-pricing-2025.md',          category: 'Dynamics', emoji: '🎯', featured: true,  desc: 'Tarifs D365 Sales, Customer Service, BC, Finance & SCM — licences attach rules' },
  { id: 'power',           title: 'Power Platform',                  file: 'power-platform-digital.md',             category: 'Power',    emoji: '⚡', featured: false, desc: 'Power BI, Power Apps, Power Automate — licences, capacités Premium et connecteurs' },
  { id: 'copilot-studio',  title: 'Copilot Studio — Licensing 2026', file: 'copilot-studio-licensing.md',           category: 'Power',    emoji: '🤖', featured: true,  isNew: true, desc: 'Plans Teams vs Standalone, Copilot Credits, canaux de déploiement, intégration M365 Copilot' },
  { id: 'security',        title: 'Security & Compliance',           file: 'security-compliance.md',                category: 'Security', emoji: '🛡️', featured: false, desc: 'Defender, Sentinel, Purview — couverture Zero Trust, conformité RGPD & NIS2' },
  { id: 'intune',          title: 'Microsoft Intune — Plans 2026',   file: 'microsoft-intune-licensing.md',         category: 'Security', emoji: '📱', featured: true,  isNew: true, desc: 'Intune Plan 1 vs Plan 2 vs Suite — MDM/MAM, Remote Help, EPM, Cloud PKI, disponibilité par plan M365' },
  { id: 'modern-wp-sec',  title: 'Modern Workplace Security FW',    file: 'modern-workplace-security-framework.md', category: 'Security', emoji: '🔒', featured: true,  isNew: true, desc: 'Framework sécurité M365 — Zero Trust, Conditional Access, MFA, Defender for Business, conformité RGPD' },
  { id: 'bundles',         title: 'Solutions Bundles & Promotions',  file: 'microsoft-promotions-2026.md',          category: 'Bundles',  emoji: '🏷️', featured: true,  desc: 'Offres bundles 2026 — remises combos M365+D365, promotions partenaires actives' },
  { id: 'pricing-guide',   title: 'Full Pricing Guide 2025',         file: 'microsoft-pricing-guide-2025.md',       category: 'Bundles',  emoji: '📋', featured: false, desc: 'Guide tarifaire unifié — tous produits Microsoft, grille partenaire CSP complète' },
  { id: 'solution-bundles',title: 'Solution Bundles & Pricing',      file: 'solution-bundles-pricing.md',           category: 'Bundles',  emoji: '🎯', featured: false, desc: 'Templates propositions commerciales — bundles courants, pricing rapide par secteur' },
  { id: 'github-copilot',  title: 'GitHub Copilot — Plans 2026',     file: 'github-copilot-plans.md',               category: 'Developer',emoji: '💻', featured: true,  isNew: true, desc: 'Copilot Free/Pro/Business/Enterprise — features IDE, coding agent, knowledge bases, pricing $10-$39/mois' },
];

const DOC_CATEGORIES = ['All','M365','Azure','Dynamics','Power','Security','Bundles','Developer'];

const CAT_DOC_STYLE = {
  M365:     { gradient: 'from-blue-500 to-indigo-600',    light: 'bg-blue-50',    badge: 'bg-blue-100 text-blue-700 border-blue-200',     bar: 'bg-blue-500',   ring: 'hover:ring-blue-200'  },
  Azure:    { gradient: 'from-sky-500 to-cyan-600',       light: 'bg-sky-50',     badge: 'bg-sky-100 text-sky-700 border-sky-200',         bar: 'bg-sky-500',    ring: 'hover:ring-sky-200'   },
  Dynamics: { gradient: 'from-orange-500 to-amber-600',   light: 'bg-orange-50',  badge: 'bg-orange-100 text-orange-700 border-orange-200', bar: 'bg-orange-500', ring: 'hover:ring-orange-200'},
  Power:    { gradient: 'from-yellow-500 to-orange-500',  light: 'bg-yellow-50',  badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', bar: 'bg-yellow-400', ring: 'hover:ring-yellow-200'},
  Security: { gradient: 'from-red-500 to-rose-600',       light: 'bg-red-50',     badge: 'bg-red-100 text-red-700 border-red-200',         bar: 'bg-red-500',    ring: 'hover:ring-red-200'   },
  Bundles:  { gradient: 'from-emerald-500 to-teal-600',   light: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500', ring: 'hover:ring-emerald-200'},
  Developer:{ gradient: 'from-violet-500 to-purple-600',  light: 'bg-violet-50',  badge: 'bg-violet-100 text-violet-700 border-violet-200',     bar: 'bg-violet-500',  ring: 'hover:ring-violet-200' },
};

// ── Modern Work — M365 Plans (no pricing — see Pricing Guides tab) ───────
const M365_SEGMENTS = [
  { id: 'all',        label: 'Tous les plans',     emoji: '📋' },
  { id: 'business',   label: 'Business ≤ 300',     emoji: '🏢' },
  { id: 'enterprise', label: 'Enterprise',         emoji: '🏛️' },
  { id: 'frontline',  label: 'Frontline Workers',  emoji: '👷' },
];

const M365_PLANS = [
  // ── BUSINESS ─────────────────────────────────────────────────────
  {
    id: 'apps-business', segment: 'business',
    name: 'Microsoft 365 Apps for Business', shortName: 'Apps for Business',
    emoji: '📱',
    description: 'Applications Office desktop + web + mobile uniquement (sans Teams, Exchange, SharePoint hébergés). Idéal pour les TPE disposant déjà d\'une messagerie externe.',
    apps: ['Word', 'Excel', 'PowerPoint', 'Outlook', 'OneNote', 'Access (PC)', 'Publisher (PC)'],
    services: ['OneDrive 1 TB / utilisateur', 'Web et applications mobiles inclus', '5 appareils / utilisateur'],
    notIncluded: ['Microsoft Teams', 'Exchange (messagerie hébergée)', 'SharePoint'],
    bestFor: 'TPE avec messagerie externe déjà en place, besoin uniquement des applications bureautiques',
    highlight: null, badge: null,
    color: 'border-slate-200',
  },
  {
    id: 'business-basic', segment: 'business',
    name: 'Microsoft 365 Business Basic', shortName: 'Business Basic',
    emoji: '☁️',
    description: 'Services cloud complets (Teams, Exchange, SharePoint, OneDrive) avec applications web et mobiles. Aucune installation desktop requise.',
    apps: ['Applications web & mobiles — Word, Excel, PowerPoint, Outlook'],
    services: ['Teams (meetings, chat, channels)', 'Exchange 50 GB / mailbox', 'SharePoint', 'OneDrive 1 TB', 'Microsoft Defender (basique)', 'Entra ID (basique)'],
    notIncluded: ['Applications desktop installées'],
    bestFor: 'Start-ups & équipes remote-first, usage navigateur prédominant, budget optimisé',
    highlight: null, badge: null,
    color: 'border-sky-200',
  },
  {
    id: 'business-standard', segment: 'business',
    name: 'Microsoft 365 Business Standard', shortName: 'Business Standard',
    emoji: '⭐',
    description: 'Suite PME complète : applications desktop + tous les services de collaboration. Le plan le plus populaire pour les entreprises jusqu\'à 300 utilisateurs.',
    apps: ['Word', 'Excel', 'PowerPoint', 'Outlook', 'OneNote', 'Access (PC)', 'Publisher (PC)'],
    services: ['Teams (meetings, calls, channels)', 'Exchange 50 GB', 'SharePoint', 'OneDrive 1 TB', 'Bookings', 'Forms', 'Lists', 'Planner', 'Stream', 'Clipchamp'],
    notIncluded: ['Sécurité avancée (Defender for Business)', 'Gestion des appareils (Intune)', 'Protection des données (AIP P1)'],
    bestFor: 'PME souhaitant la productivité complète avec collaboration — meilleur rapport fonctionnel Business',
    highlight: 'Le plan le plus populaire PME — apps desktop + Teams + collaboration complète',
    badge: '⭐ Le plus populaire',
    badgeColor: 'bg-blue-100 text-blue-700',
    color: 'border-blue-300',
  },
  {
    id: 'business-premium', segment: 'business',
    name: 'Microsoft 365 Business Premium', shortName: 'Business Premium',
    emoji: '🛡️',
    description: 'Suite complète + sécurité de niveau entreprise pour PME : Defender for Business (EDR/XDR), Intune, Conditional Access, AIP P1. La posture Zero Trust maximale pour une PME.',
    apps: ['Word', 'Excel', 'PowerPoint', 'Outlook', 'OneNote', 'Access (PC)', 'Publisher (PC)'],
    services: ['Tout Business Standard +', 'Microsoft Defender for Business (EDR/XDR)', 'Microsoft Entra ID P1 (Conditional Access, MFA avancé)', 'Microsoft Intune (MDM/MAM)', 'Azure Information Protection P1 (labels de sensibilité)', 'Microsoft Purview (DLP basique, audit)'],
    notIncluded: [],
    bestFor: 'PME en santé, finance, legal ou souhaitant une posture Zero Trust sans licences Enterprise',
    highlight: 'Sécurité entreprise complète (EDR + MDM + Identity Protection) à l\'échelle PME',
    badge: '🛡️ Sécurité Max PME',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    color: 'border-indigo-300',
  },
  // ── ENTERPRISE ──────────────────────────────────────────────────
  {
    id: 'o365-e1', segment: 'enterprise',
    name: 'Office 365 E1', shortName: 'O365 E1',
    emoji: '🏢',
    description: 'Base cloud Enterprise économique : Teams, Exchange, SharePoint + applications web/mobiles uniquement. Point d\'entrée avant upgrade E3/E5.',
    apps: ['Applications web et mobiles uniquement'],
    services: ['Teams', 'Exchange 50 GB', 'SharePoint', 'OneDrive 1 TB', 'Compliance basique (audit, eDiscovery basique)'],
    notIncluded: ['Applications desktop', 'Sécurité avancée', 'Gestion des appareils', 'Windows Enterprise'],
    bestFor: 'Grandes organisations cherchant un point d\'entrée cloud minimal — upgrade E3 conseillé',
    highlight: null,
    badge: '💡 Point d\'entrée',
    badgeColor: 'bg-slate-100 text-slate-600',
    color: 'border-slate-200',
  },
  {
    id: 'o365-e3', segment: 'enterprise',
    name: 'Office 365 E3', shortName: 'O365 E3',
    emoji: '📧',
    description: 'Suite Office 365 Enterprise complète : applications desktop + conformité avancée (DLP, eDiscovery, audit, legal hold). Sans Windows Enterprise ni Intune — idéal si la gestion des appareils est déjà couverte.',
    apps: ['Word', 'Excel', 'PowerPoint', 'Outlook', 'OneNote', 'Access (PC)', 'Publisher (PC)'],
    services: ['Teams', 'Exchange 100 GB', 'SharePoint', 'OneDrive illimité', 'Microsoft Purview (DLP, eDiscovery, audit, legal hold)', 'Microsoft Forms, Lists, Planner, Stream', 'Microsoft Bookings'],
    notIncluded: ['Windows Enterprise', 'Microsoft Intune (MDM/MAM)', 'Microsoft Entra ID P1 (Conditional Access avancé)', 'Azure Information Protection P1'],
    bestFor: 'Organisations ayant déjà Windows + device management via un autre contrat, cherchant productivité complète + conformité sans payer Windows',
    highlight: 'Productivité + conformité pure Office 365 — sans les composants Windows/EMS (différence clé vs M365 E3)',
    badge: '📧 Office 365 Only',
    badgeColor: 'bg-sky-100 text-sky-700',
    color: 'border-sky-200',
    pricing: '~$23/user/mois',
  },
  {
    id: 'o365-e5', segment: 'enterprise',
    name: 'Office 365 E5', shortName: 'O365 E5',
    emoji: '🔒',
    description: 'Suite Office 365 maximale : tout O365 E3 + sécurité email avancée (Defender for Office 365 P2), conformité maximale (Purview E5), Power BI Pro, Audio Conferencing et Phone System. Sans Windows Enterprise ni Intune.',
    apps: ['Word', 'Excel', 'PowerPoint', 'Outlook', 'OneNote', 'Access (PC)', 'Publisher (PC)'],
    services: ['Tout Office 365 E3 inclus', 'Microsoft Defender for Office 365 Plan 2 (anti-phishing avancé, investigation automatique, Attack Simulator)', 'Microsoft Purview E5 Compliance (eDiscovery avancé, Insider Risk Management, Communication Compliance)', 'Microsoft Purview E5 Information Protection (classification automatique, DLP avancé)', 'Power BI Pro', 'Audio Conferencing (numéros dial-in réunions)', 'Microsoft Teams Phone System'],
    notIncluded: ['Windows Enterprise', 'Microsoft Intune', 'Microsoft Entra ID P2', 'Microsoft Defender for Identity', 'Microsoft Defender for Endpoint'],
    bestFor: 'Organisations ayant Windows/Intune via un autre contrat, nécessitant sécurité email maximale, conformité avancée et téléphonie cloud intégrée',
    highlight: 'Sécurité email maximale (Defender P2) + Purview E5 + Power BI Pro + Audio Conferencing — pure Office 365',
    badge: '🔒 Sécurité & Conformité Max O365',
    badgeColor: 'bg-teal-100 text-teal-700',
    color: 'border-teal-300',
    pricing: '~$38/user/mois',
  },
  {
    id: 'm365-e3', segment: 'enterprise',
    name: 'Microsoft 365 E3', shortName: 'M365 E3',
    emoji: '🏛️',
    description: 'Suite Enterprise recommandée : applications desktop + conformité + gestion des identités et des appareils. La base pour toute organisation qui se respecte.',
    apps: ['Word', 'Excel', 'PowerPoint', 'Outlook', 'OneNote', 'Access', 'Publisher'],
    services: ['Teams', 'Exchange 100 GB', 'SharePoint', 'OneDrive illimité', 'Microsoft Entra ID P1 (Conditional Access)', 'Microsoft Intune (MDM/MAM)', 'Azure Information Protection P1', 'Microsoft Purview (eDiscovery, DLP avancé)', 'Windows Enterprise E3'],
    notIncluded: ['Defender for Office 365 P2 (XDR)', 'Entra ID P2 (PIM)', 'Power BI Pro', 'Audio Conferencing'],
    bestFor: 'Grandes entreprises : productivité complète + conformité RGPD + identity & device management',
    highlight: 'La référence Enterprise : productivité + identity + device management + compliance',
    badge: '🏛️ Recommandé Enterprise',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    color: 'border-indigo-300',
  },
  {
    id: 'm365-e5', segment: 'enterprise',
    name: 'Microsoft 365 E5', shortName: 'M365 E5',
    emoji: '🔐',
    description: 'Suite Enterprise maximale : tout M365 E3 + sécurité XDR complète (Defender suite), conformité avancée (Purview E5), Entra ID P2, Power BI Pro, Audio Conferencing.',
    apps: ['Tout M365 E3 inclus'],
    services: ['Defender for Office 365 P2 (XDR email & collaboratif)', 'Microsoft Defender for Identity (menaces Active Directory)', 'Microsoft Defender for Cloud Apps (CASB)', 'Microsoft Entra ID P2 (PIM, Identity Protection, Access Reviews)', 'Azure Information Protection P2 (classification automatique)', 'Microsoft Purview E5 Compliance (IRM, Insider Risk, Communication Compliance)', 'Power BI Pro', 'Audio Conferencing + Phone System'],
    notIncluded: [],
    bestFor: 'Grandes entreprises avec exigences maximales : NIS2, RGPD, DORA, HIPAA, FCA — sécurité + conformité + analytics',
    highlight: 'XDR complet + Compliance maximale + Power BI Pro + Téléphonie cloud intégrée',
    badge: '🔐 Sécurité & Compliance Max',
    badgeColor: 'bg-purple-100 text-purple-700',
    color: 'border-purple-300',
  },
  {
    id: 'm365-e7', segment: 'enterprise',
    name: 'Microsoft 365 E7 — Frontier Worker Suite', shortName: 'M365 E7',
    emoji: '🚀',
    description: 'Le plan Enterprise premium tout-en-un : M365 E5 + Entra Suite (Zero Trust complet) + Microsoft 365 Copilot (IA intégrée) + Microsoft Agent 365 (plan de contrôle des agents IA). Disponibilité générale : 1er mai 2026.',
    apps: ['Tout M365 E5 inclus', 'Microsoft 365 Copilot (Word, Excel, PowerPoint, Outlook, Teams)', 'Work IQ (intelligence personnalisée)', 'Agent Builder & Copilot Studio'],
    services: [
      'Microsoft Entra Suite (Zero Trust complet — Private Access, Internet Access, ID Governance, Verified ID)',
      'Microsoft Agent 365 — Observe : visibilité temps réel sur tous les agents',
      'Microsoft Agent 365 — Govern : guardrails + lifecycle + audit agents',
      'Microsoft Agent 365 — Secure : identités agents + DLP + menaces IA',
      'Pre-built agents : Word, Excel, PowerPoint, Researcher, Analyst, Facilitator, SharePoint, Workflows',
      'Agent Marketplace (3P) : 1 400+ connecteurs',
      'Power BI Pro',
      'Teams Phone System + Audio Conferencing',
    ],
    notIncluded: [],
    bestFor: 'Organisations souhaitant adopter l\'IA agentique à grande échelle avec sécurité et gouvernance maximales — le seul plan incluant Agent 365',
    highlight: 'M365 E5 + Entra Suite + Copilot + Agent 365 — le seul plan avec plan de contrôle des agents IA',
    badge: '🚀 Frontier Worker Suite — GA Mai 2026',
    badgeColor: 'bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700',
    color: 'border-purple-400',
    pricing: '$99/user/mois (avec Teams) · $90.45 sans Teams (à partir du 1/7/26)',
    pricingBreakdown: 'M365 E5 $60 + Entra Suite $12 + Copilot $30 + Agent 365 $15 = $117 séparément → $99 en bundle (−$18/user/mois)',
    newBadge: true,
  },
  {
    id: 'm365-e5-security', segment: 'enterprise',
    name: 'M365 E5 Security (add-on)', shortName: 'E5 Security add-on',
    emoji: '🛡️',
    description: 'Add-on sécurité XDR sur base M365 E3 : Defender for Office 365 P2 + Defender for Identity + MCAS + Entra ID P2. Sécurité maximale sans l\'intégralité de la suite E5.',
    apps: [],
    services: ['Defender for Office 365 Plan 2 (anti-phishing avancé, investigations)', 'Microsoft Defender for Identity (menaces AD & identité)', 'Microsoft Defender for Cloud Apps (CASB & Shadow IT)', 'Microsoft Entra ID P2 (PIM, Identity Protection, Access Reviews)'],
    notIncluded: ['Purview E5 Compliance', 'Power BI Pro', 'Audio Conferencing'],
    bestFor: 'Organisations M365 E3 voulant la sécurité XDR complète sans passer à E5 intégral',
    highlight: 'Sécurité XDR maximale en add-on sur M365 E3 — l\'accélérateur sécurité idéal',
    badge: '⚡ Add-on sur M365 E3',
    badgeColor: 'bg-red-100 text-red-700',
    color: 'border-red-200',
  },
  // ── FRONTLINE ────────────────────────────────────────────────────
  {
    id: 'm365-f1', segment: 'frontline',
    name: 'Microsoft 365 F1', shortName: 'M365 F1',
    emoji: '👷',
    description: 'Plan économique deskless : Teams chat, SharePoint, Yammer pour les travailleurs sans poste fixe. Applications web & mobiles uniquement.',
    apps: ['Applications web & mobiles uniquement'],
    services: ['Teams (chat + contenu — sans meetings/calls planifiés)', 'SharePoint (lecture + commentaires)', 'Yammer / Viva Engage', 'Microsoft Stream', 'Planner dans Teams', 'Viva Connections'],
    notIncluded: ['Exchange / boîte mail dédiée', 'Teams meetings & calls complets', 'OneDrive (2 GB max)', 'Applications desktop'],
    bestFor: 'Travailleurs terrain retail / manufacture pour communication interne — sans besoin messagerie propre',
    highlight: null,
    badge: '💡 Deskless Basic',
    badgeColor: 'bg-orange-100 text-orange-700',
    color: 'border-orange-200',
  },
  {
    id: 'm365-f3', segment: 'frontline',
    name: 'Microsoft 365 F3', shortName: 'M365 F3',
    emoji: '🏗️',
    description: 'Suite terrain complète : Teams complet (meetings, calls, shifts), Exchange, Intune pour gestion des appareils. Pour les équipes terrain avec des besoins professionnels réels.',
    apps: ['Applications web & mobiles (Word, Excel, PowerPoint, Outlook)'],
    services: ['Teams complet (meetings, calls, shifts scheduling)', 'Exchange 2 GB / mailbox', 'SharePoint', 'OneDrive 2 GB', 'Microsoft Intune (MDM/MAM)', 'Viva Connections + Viva Engage', 'Power Apps (usage limité)'],
    notIncluded: ['Applications desktop', 'Microsoft Entra ID P1', 'Azure Information Protection P1'],
    bestFor: 'Équipes terrain avec coordination avancée (shifts, dossiers, maintenance) et gestion des appareils',
    highlight: 'Teams complet + Exchange + Intune — la suite terrain professionnalisée',
    badge: '✅ Terrain Complet',
    badgeColor: 'bg-orange-100 text-orange-700',
    color: 'border-orange-300',
  },
];

// ── Assessments data — FY26 SMB Assessment Desk (source PDF officiel) ────
const ASSESSMENTS_DATA = [
  {
    pillar: 'Security',
    icon: Shield,
    color: 'from-red-500 to-rose-600',
    bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200',
    description: 'Maturité sécurité, risk mitigation & valeur business',
    solutionPlay: 'Modernize SecOps with Unified Platform',
    toolPillar: 'CSAT',
    assessments: [
      {
        name: 'Rapid Security Assessment', short: 'RSA', emoji: '🔍',
        description: "Revue de posture de sécurité : vulnérabilités immédiates, appareils non gérés, déploiement logiciel, politiques de contrôle des risques et recommandations de remédiation pour réduire le cyber-risque dans le cloud.",
        tool: 'CSAT (Questionnaire + Endpoint Scan)',
        timeline: '1–2 semaines',
        eligibility: '> 30 sièges • Standard offering',
        outputs: [
          'Score CIS v8.1 + Microsoft 365 Secure Score (cible : 80%+)',
          'Entra ID Admin Accounts — MFA gaps, comptes expirés, Domain Admins',
          'Browser-Based LLM Usage — ChatGPT, DeepSeek, Gemini, Claude détectés',
          'Endpoint Secure Configuration — BitLocker, PowerShell 2.0, antivirus',
          'M365 Copilot Readiness + Plan d\'action court/long terme',
        ],
        badge: 'Standard', badgeColor: 'bg-orange-100 text-orange-700',
        phases: ['Planning', 'Discovery', 'Analysis', 'Delivery'],
      },
      {
        name: 'Threat Protection Assessment', short: 'TPA', emoji: '🛡️',
        description: "Vue exhaustive on-premise et cloud de la posture sécurité. CIS Controls, Zero Trust Architecture, Azure Secure Score, AWS/GitHub security insights et score de conformité NIS 2.0. Plan d'action pour infrastructures hybrides.",
        tool: 'CSAT — Defender for Office 365 / Defender for Endpoint',
        timeline: '1–2 semaines',
        eligibility: '> 30 sièges • Comptes Corporate / Mid-Market',
        outputs: [
          'Company Maturity Score (CIS Controls — 4 niveaux : Basic → Dynamic)',
          'Quick Wins, Zero Trust Architecture, Azure & Microsoft Secure Scores',
          'AWS security settings + GitHub security settings',
          'Recommended Action Plan pour infrastructures hybrides',
          'Business Case Analysis + NIS 2.0 Directive Readiness Score',
        ],
        badge: 'Corporate+', badgeColor: 'bg-red-100 text-red-700',
        phases: ['Planning', 'Discovery', 'Analysis', 'Delivery'],
      },
      {
        name: 'Data Security Assessment', short: 'DSA', emoji: '🗂️',
        description: "Vue complète sur la conformité et gouvernance des données : insider risk management, data loss prevention, information protection. Fondation sécurité pour protéger l'IA générative et les applications tierces.",
        tool: 'CSAT',
        timeline: '1–2 semaines',
        eligibility: '> 30 sièges',
        outputs: [
          'Company Maturity Score (CIS Controls) + NIS 2.0 Directive Readiness',
          'Data Protection — SharePoint PII, Cloud Storage, DMARC/DKIM/SPF',
          'Data governance insights + M365 Copilot security & governance',
          'Browser-Based LLM Usage + 3rd party Gen AI detection',
          'Plan d\'action : data management & protection contre les menaces',
        ],
        badge: 'Data & Compliance', badgeColor: 'bg-purple-100 text-purple-700',
        phases: ['Planning', 'Discovery', 'Analysis', 'Delivery'],
      },
      {
        name: 'Protect Cloud, AI Platforms & Apps', short: 'PCAP', emoji: '☁️',
        description: "Analyse des risques Azure : cloud infrastructures, identity, data et application protection. Essentiel pour les clients avec Azure OpenAI et Azure AI Foundry. Hero offerings : Defender for Cloud + Purview.",
        tool: 'CSAT — Hero : Defender for Cloud + Purview',
        timeline: 'TBC',
        eligibility: 'Clients Azure actif • Azure OpenAI / Foundry',
        outputs: [
          'Maturity Score (CIS Controls, Zero Trust, Azure Secure Score)',
          'Azure Policy compliance (ex : 13%) + Azure Network Security Groups',
          'Cloud Storage Accounts — TLS, chiffrement, public access',
          'Multi-Cloud scan — AWS MFA (76 identités), 15 certificats expirés',
          'Recommended Action Plan pour cloud infrastructure & AI apps',
        ],
        badge: 'Azure AI', badgeColor: 'bg-cyan-100 text-cyan-700',
        phases: ['Planning', 'Discovery', 'Analysis', 'Delivery'],
      },
      {
        name: 'Security Business Value Assessment', short: 'Security BVA', emoji: '💰',
        description: "Analyse financière personnalisée des économies et bénéfices de la consolidation sur Microsoft 365 : coûts licences, implémentation, formation, consolidation fournisseurs, mitigation des risques. Inclus dans tous les assessments Security.",
        tool: 'Questionnaire (outil BVA Microsoft)',
        timeline: '1–2 semaines',
        eligibility: 'Inclus dans tous les assessments Security',
        outputs: [
          '3-year Breakdown of Estimated Costs (licences, migration, formation)',
          '3-year Breakdown of Estimated Benefits (consolidation fournisseurs, ROI)',
          'Eliminate Redundant Solutions — ex : 15+ vendors à $63/user/mois',
          'Economic Impact — ex : $9.4M, ROI 176%, Payback 8 mois',
          'Business case exécutif prêt à présenter au CISO/CIO',
        ],
        badge: 'Inclus partout', badgeColor: 'bg-green-100 text-green-700',
        phases: ['Planning', 'Data Gathering', 'Analysis', 'Report'],
      },
    ],
  },
  {
    pillar: 'Cloud & AI Platforms',
    icon: Database,
    color: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200',
    description: 'Migration Azure data-driven & sécurité cloud',
    solutionPlay: 'Migrate & Modernize your Estate • Protect Cloud AI Platform',
    toolPillar: 'Dr Migrate + CSAT',
    assessments: [
      {
        name: 'Azure Benchmark TCO', short: 'TCO', emoji: '📊',
        description: "Vue data-driven de l'environnement actuel et du plan de migration Azure. Utilise Dr Migrate : outil Microsoft agentless (sans agent, sans install) déployé dans 75+ pays auprès de +2000 clients. Coûts, priorités, wave planning et prochaines étapes concrètes.",
        tool: 'Dr Migrate + DMC (agentless — ~5MB/VM, ~2% CPU, ~1000 VMs/heure)',
        timeline: '1–2 semaines • 5 réunions (Kick-Off + 2 Workshops + Delivery)',
        eligibility: '> 5 VMs on-premise ou VMware',
        outputs: [
          '100+ dashboards interactifs — infrastructure, coûts, sizing, readiness',
          'TCO Modelling — ex : $2.1M on-prem → $775K Azure = $1.3M/an économisés',
          'Estate Analyses — apps mappées, serveurs, OS, dépendances réseau',
          '6R Migration Treatments (Rehost, Refactor, Re-architect, Replace, Retain, Retire)',
          'Wave Planning AI-assisted + Executive Report PDF prêt pour approbation budget',
        ],
        badge: '> 5 VMs', badgeColor: 'bg-blue-100 text-blue-700',
        phases: ['Kick-Off & Scan', 'Post-Scan Planning', 'Workload Planning', 'Delivery'],
      },
      {
        name: 'Azure Security Assessment', short: 'ASA', emoji: '🔐',
        description: "Analyse approfondie des risques Azure : cloud infrastructures, identités, données et application protection. Critique pour les clients utilisant Azure OpenAI et Azure AI Foundry. Unifie la sécurité et gouvernance sur le cycle de vie cloud et IA.",
        tool: 'CSAT — Hero : Defender for Cloud + Purview',
        timeline: '1–2 semaines',
        eligibility: 'TBC • Clients avec Azure actif',
        outputs: [
          'Secure Score Defender for Cloud (benchmark 80%) + CIS Controls',
          'Azure Storage — 20 comptes TLS ≤1.1, 27 avec public blob access',
          'Azure SQL Databases — 16 BDD sans audit activé',
          'Azure Policy compliance + Network Security Groups findings',
          'Multi-Cloud : MFA gaps AWS, certificats expirés, accès non sécurisés',
        ],
        badge: 'Azure + AI', badgeColor: 'bg-purple-100 text-purple-700',
        phases: ['Planning', 'Discovery', 'Analysis', 'Delivery'],
      },
    ],
  },
  {
    pillar: 'AI Business Solutions',
    icon: Brain,
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200',
    description: 'IA sécurisée, adoption Copilot & migration dark-to-cloud',
    solutionPlay: 'Secure AI Productivity • Copilot and Agents at Work',
    toolPillar: 'CSAT (Secure AI, D2C) • Aucun outil (CMC)',
    assessments: [
      {
        name: 'Secure AI Productivity', short: 'SAP', emoji: '🤖',
        description: "Analyse de la posture de sécurité pour adopter l'IA générative en toute sécurité : identity & data compliance, protection contre l'oversharing, détection de ChatGPT/DeepSeek/Gemini en interne et consolidation vers Microsoft Copilot.",
        tool: 'CSAT — Hero : M365 E3/E5, Entra Suite, Purview',
        timeline: '2–3 semaines',
        eligibility: '> 30 sièges whitespace + > 10 sièges Copilot achetés',
        outputs: [
          'CIS Controls + Zero Trust Architecture + NIS 2.0 Readiness',
          'M365 Copilot Readiness — Identity & Access Management, Endpoint Management',
          'M365 Copilot Readiness — Data Security & Compliance, Threat Protection (400+ AI apps)',
          'Browser LLM — ex : ChatGPT 6% endpoints (2446 visits), Gemini 1%, Claude 1%',
          'Entra ID MFA gaps, 3rd party Gen AI governance, Copilot oversharing controls',
        ],
        badge: '10+ Copilot seats', badgeColor: 'bg-violet-100 text-violet-700',
        phases: ['Planning', 'Discovery', 'Analysis', 'Delivery'],
      },
      {
        name: 'Dark to Cloud', short: 'D2C', emoji: '🌐',
        description: "Découverte de l'installation Microsoft on-premise et de l'environnement M365 existant. Recommandations licences selon l'usage observé. Cible les clients \"dark\" (non touchés par Microsoft) ou exposés à la concurrence Google Workspace. Exclusif SMB.",
        tool: 'CSAT — Hero : M365 Business Premium / E3 / E5',
        timeline: '1–2 semaines',
        eligibility: '> 30 sièges (tous types) • Exclusif SMB',
        outputs: [
          'Windows Versions — EOS détectés (Win10, WinServer 2012) vulnérables aux exploits',
          'Updates critiques — ex : 79 endpoints avec mises à jour critiques en attente',
          'Shadow AI détecté + Browser LLM Usage dans les navigateurs',
          'Business Case Analysis + Copilot options + vendor consolidation 3rd party',
          'Recommandations : upgrade E3/E5, migration EA→CSP, Azure consumption',
        ],
        badge: 'SMB Exclusif', badgeColor: 'bg-indigo-100 text-indigo-700',
        phases: ['Identify goals', 'Data collection', 'Infrastructure analysis', 'Action plan'],
      },
      {
        name: 'Copilot Master Class', short: 'CMC', emoji: '✨',
        description: "Workshop 4 phases pour maximiser l'adoption de M365 Copilot, Copilot Chat et les agents IA. Démo live use cases par département. 68% des travailleurs délèguent les tâches répétitives à l'IA — 61% des executives confirment une meilleure prise de décision.",
        tool: 'Aucun outil de scan • Workshop immersif Copilot Chat + Teams',
        timeline: '1–2 jours (workshop)',
        eligibility: '> 30 sièges + > 10 sièges Copilot • Sponsor exécutif requis',
        outputs: [
          '1. Discover — Copilot Chat UI, skills et capacités',
          '2. Enable — Prompting best practices + Copilot Prompt Gallery',
          '3. Accelerate — Use cases Copilot par département/persona',
          '4. Extend — Agents Copilot Studio pour automatiser les processus métier',
          'Business case ROI + Plan d\'adoption + Success metrics dashboard',
        ],
        badge: 'Workshop', badgeColor: 'bg-pink-100 text-pink-700',
        stats: ['68% délèguent les tâches répétitives à l\'IA', '52% utilisent l\'IA pour les 1ers drafts créatifs', '61% exécutifs : meilleure prise de décision'],
        phases: ['Discover', 'Enable', 'Accelerate', 'Extend'],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
export default function KnowledgeBasePage() {
  const { lang } = useLang();
  const tr = t[lang].kb;

  // Main tabs
  const [tab, setTab] = useState('solutions');
  // Solutions sub-tabs
  const [solTab, setSolTab] = useState('azure');

  // Azure sub-tab
  const [catFilter, setCatFilter] = useState('all');
  // Dynamics sub-tab
  const [d365Filter, setD365Filter] = useState('all');
  // M365 sub-tab
  const [m365Seg, setM365Seg] = useState('all');

  const [solutions, setSolutions]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [fetchError, setFetchError]   = useState(false);
  const [search, setSearch]           = useState('');
  const [selectedSol, setSelectedSol] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docContent, setDocContent]   = useState('');
  const [docFilter, setDocFilter]     = useState('All');
  const [pillarFilter, setPillarFilter] = useState('All');

  useEffect(() => {
    setLoading(true);
    setFetchError(false);
    fetch(`/api/azure-solutions?lang=${lang}`)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(d => { setSolutions(d.solutions || []); setLoading(false); })
      .catch(() => { setFetchError(true); setLoading(false); });
  }, [lang]);

  // Sync selectedSol with re-fetched language-aware version
  useEffect(() => {
    if (!selectedSol || solutions.length === 0) return;
    const updated = solutions.find(s => s.id === selectedSol.id);
    if (updated) setSelectedSol(updated);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solutions]);

  useEffect(() => {
    if (!selectedDoc) return;
    setDocContent('');
    fetch('/api/knowledge-base?file=' + encodeURIComponent(selectedDoc.file))
      .then(r => r.json())
      .then(d => setDocContent(d.content || ''))
      .catch(() => setDocContent('# Error loading document'));
  }, [selectedDoc]);

  const azureSolutions = solutions.filter(s => s.category !== 'business');
  const dynamicsSolutions = solutions.filter(s => s.category === 'business');

  const filteredAzure = azureSolutions.filter(s => {
    const matchCat = catFilter === 'all' || s.category === catFilter;
    const matchSearch = !search || [s.name, s.shortDescription, s.officialName].some(f => (f||'').toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const filteredDynamics = dynamicsSolutions.filter(s => {
    const grp = SUB_TO_GROUP[s.subcategory] || 'all';
    const matchGroup = d365Filter === 'all' || grp === d365Filter;
    const matchSearch = !search || [s.name, s.shortDescription, s.officialName].some(f => (f||'').toLowerCase().includes(search.toLowerCase()));
    return matchGroup && matchSearch;
  });

  const filteredM365 = M365_PLANS.filter(p =>
    (m365Seg === 'all' || p.segment === m365Seg) &&
    (!search || [p.name, p.description, p.bestFor].some(f => (f||'').toLowerCase().includes(search.toLowerCase())))
  );

  const filteredDocs = KB_DOCS.filter(d =>
    (docFilter === 'All' || d.category === docFilter) &&
    (!search || d.title.toLowerCase().includes(search.toLowerCase()))
  );

  // Switch sub-tab and clear selected solution
  const switchSolTab = (t) => { setSolTab(t); setSelectedSol(null); };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div className="relative overflow-hidden text-white py-12 px-8"
        style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 45%,#0f172a 100%)' }}>
        <div className="orb orb-blue   w-64 h-64 -top-12 -left-12" />
        <div className="orb orb-purple w-48 h-48 top-0 right-12" style={{ animationDelay: '2s' }} />
        <div className="relative z-10 max-w-6xl mx-auto">

          <motion.div {...fadeUp} className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl"><BookOpen className="w-7 h-7" /></div>
            <div>
              <h1 className="text-3xl font-bold">{tr.title}</h1>
              <p className="text-blue-200 text-sm">{tr.subtitle}</p>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.08 }} className="flex gap-4 mb-6 text-sm flex-wrap">
            {[
              ['☁️', azureSolutions.length || 39, 'Azure Solutions'],
              ['🎯', dynamicsSolutions.length || 18, 'Dynamics 365'],
              ['💼', M365_PLANS.length, 'M365 Plans'],
              ['📄', KB_DOCS.length, 'Pricing Guides'],
              ['🎯', 9, 'Assessments'],
              ['📅', 'FY26', 'Up to date'],
            ].map(([icon, n, label]) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <span className="mr-1">{icon}</span>
                <span className="font-bold text-lg">{n}</span>
                <span className="text-blue-200 ml-2 text-xs">{label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.12 }} className="relative max-w-xl mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={tr.searchPlaceholder}
              className="w-full pl-12 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-300 transition-colors" />
            {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"><X className="w-4 h-4" /></button>}
          </motion.div>

          {/* Main tabs */}
          <motion.div {...fadeUp} transition={{ delay: 0.16 }} className="flex gap-2 flex-wrap">
            {[
              ['solutions',    `🔷 ${tr.solutions}`],
              ['docs',         `📄 ${tr.documents}`],
              ['assessments',  `🎯 ${tr.assessments}`],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={'px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ' +
                  (tab === key ? 'bg-white text-blue-700 shadow-lg' : 'bg-white/10 text-blue-100 hover:bg-white/20')}>
                {label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">

          {/* ══ SOLUTIONS TAB ════════════════════════════════════ */}
          {tab === 'solutions' && (
            <motion.div key="solutions" {...fadeUp} initial="initial" animate="animate">

              {/* Sub-tab bar */}
              <div className="flex gap-2 flex-wrap mb-6 border-b border-gray-200 pb-4">
                {[
                  ['azure',    '☁️', 'Azure',              `${azureSolutions.length} ${tr.cloudSolutions}`],
                  ['dynamics', '🎯', 'Dynamics 365',       `${dynamicsSolutions.length} ${tr.businessApps}`],
                  ['m365',     '💼', 'Modern Work / M365', `${M365_PLANS.length} plans`],
                ].map(([key, emoji, label, sub]) => (
                  <button key={key} onClick={() => switchSolTab(key)}
                    className={'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border ' +
                      (solTab === key
                        ? 'bg-ms-blue text-white border-ms-blue shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300')}>
                    <span>{emoji}</span>
                    <span>{label}</span>
                    <span className={'text-xs px-1.5 py-0.5 rounded-full font-normal ' +
                      (solTab === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500')}>
                      {sub}
                    </span>
                  </button>
                ))}
              </div>

              {/* ── Azure sub-tab ──────────────────────────────── */}
              {solTab === 'azure' && !selectedSol && (
                <motion.div key="azure-list" {...fadeUp}>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {['all', ...Object.keys(AZURE_CAT).filter(k => k !== 'business')].map(cat => {
                      const cfg = AZURE_CAT[cat];
                      const Icon = cfg?.icon;
                      return (
                        <button key={cat} onClick={() => setCatFilter(cat)}
                          className={'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ' +
                            (catFilter === cat
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300')}>
                          {Icon && <Icon className="w-3.5 h-3.5" />}
                          {cfg?.label || 'All Solutions'}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{loading ? 'Loading…' : `${filteredAzure.length} solutions`}</p>
                  {fetchError ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
                        <span className="text-red-500 text-xl">!</span>
                      </div>
                      <p className="text-gray-700 font-medium mb-1">{lang === 'fr' ? 'Impossible de charger les solutions' : 'Failed to load solutions'}</p>
                      <p className="text-sm text-gray-400 mb-4">{lang === 'fr' ? 'Vérifiez votre connexion et réessayez.' : 'Check your connection and try again.'}</p>
                      <button onClick={() => { setFetchError(false); setLoading(true); fetch(`/api/azure-solutions?lang=${lang}`).then(r=>r.json()).then(d=>{setSolutions(d.solutions||[]);setLoading(false);}).catch(()=>{setFetchError(true);setLoading(false);}); }}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                        {lang === 'fr' ? 'Réessayer' : 'Retry'}
                      </button>
                    </div>
                  ) : loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[...Array(9)].map((_,i) => <div key={i} className="shimmer h-40 rounded-2xl" />)}</div>
                  ) : (
                    <SolutionGrid solutions={filteredAzure} catConfig={AZURE_CAT} onSelect={setSelectedSol} />
                  )}
                </motion.div>
              )}

              {/* ── Dynamics sub-tab ───────────────────────────── */}
              {solTab === 'dynamics' && !selectedSol && (
                <motion.div key="dynamics-list" {...fadeUp}>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {Object.entries(D365_GROUP).map(([key, cfg]) => {
                      const Icon = cfg.icon;
                      const d365Labels = { all: tr.allDynamics, erp: 'ERP & Finance', crm: tr.crmSales, marketing: 'Marketing & Data', copilot: tr.copilotAi, field: tr.fieldOps };
                      return (
                        <button key={key} onClick={() => setD365Filter(key)}
                          className={'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ' +
                            (d365Filter === key
                              ? 'bg-gradient-to-r from-ms-blue to-ms-blueDark text-white border-transparent shadow-md'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300')}>
                          <Icon className="w-3.5 h-3.5" />
                          {d365Labels[key] || cfg.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{loading ? 'Loading…' : `${filteredDynamics.length} solutions`}</p>
                  {fetchError ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
                        <span className="text-red-500 text-xl">!</span>
                      </div>
                      <p className="text-gray-700 font-medium mb-1">{lang === 'fr' ? 'Impossible de charger les solutions' : 'Failed to load solutions'}</p>
                      <p className="text-sm text-gray-400 mb-4">{lang === 'fr' ? 'Vérifiez votre connexion et réessayez.' : 'Check your connection and try again.'}</p>
                      <button onClick={() => { setFetchError(false); setLoading(true); fetch(`/api/azure-solutions?lang=${lang}`).then(r=>r.json()).then(d=>{setSolutions(d.solutions||[]);setLoading(false);}).catch(()=>{setFetchError(true);setLoading(false);}); }}
                        className="px-4 py-2 rounded-xl bg-ms-blue text-white text-sm font-medium hover:bg-ms-blueDark transition-colors">
                        {lang === 'fr' ? 'Réessayer' : 'Retry'}
                      </button>
                    </div>
                  ) : loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[...Array(6)].map((_,i) => <div key={i} className="shimmer h-40 rounded-2xl" />)}</div>
                  ) : (
                    <SolutionGrid solutions={filteredDynamics} catConfig={AZURE_CAT} onSelect={setSelectedSol} />
                  )}
                </motion.div>
              )}

              {/* ── M365 Modern Work sub-tab ───────────────────── */}
              {solTab === 'm365' && (
                <motion.div key="m365-list" {...fadeUp}>
                  {/* Copilot banner */}
                  <div className="mb-5 bg-gradient-to-r from-ms-blue to-ms-blueDark rounded-2xl p-4 text-white flex items-center gap-4">
                    <div className="p-2 bg-white/15 rounded-xl shrink-0"><Bot className="w-6 h-6" /></div>
                    <div>
                      <p className="font-bold text-sm">{tr.copilotBannerTitle}</p>
                      <p className="text-violet-200 text-xs">{tr.copilotBannerDesc}</p>
                    </div>
                  </div>

                  {/* Segment filters */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {M365_SEGMENTS.map(seg => {
                      const m365Labels = { all: tr.allPlans, business: 'Business ≤300', enterprise: 'Enterprise', frontline: tr.frontlinePlans };
                      return (
                      <button key={seg.id} onClick={() => setM365Seg(seg.id)}
                        className={'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ' +
                          (m365Seg === seg.id
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300')}>
                        <span>{seg.emoji}</span>
                        {m365Labels[seg.id] || seg.label}
                      </button>
                      );
                    })}
                  </div>

                  <p className="text-sm text-gray-500 mb-4">{filteredM365.length} {tr.pricingNoteCount}{filteredM365.length > 1 ? 's' : ''} — {tr.pricingNoteIn} <strong>{tr.documents}</strong></p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredM365.map((plan, i) => (
                      <motion.div key={plan.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className={`bg-white rounded-2xl border-2 p-6 hover:shadow-xl transition-all ${plan.color}`}>

                        {/* Plan header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{plan.emoji}</span>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium uppercase tracking-wide">
                                  {plan.segment === 'business' ? tr.segBusiness : plan.segment === 'enterprise' ? tr.segEnterprise : tr.segFrontline}
                                </span>
                                {plan.newBadge && (
                                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white animate-pulse">NEW</span>
                                )}
                                {plan.badge && (
                                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${plan.badgeColor}`}>{plan.badge}</span>
                                )}
                              </div>
                              <h3 className="font-bold text-gray-900 mt-1 leading-tight">{plan.name}</h3>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{plan.description}</p>

                        {/* Highlight */}
                        {plan.highlight && (
                          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 mb-4 text-xs text-indigo-700 font-medium">
                            ✦ {plan.highlight}
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-3">
                          {/* Apps incluses */}
                          {plan.apps.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                                <Briefcase className="w-3 h-3" /> {tr.includedApps}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {plan.apps.map((a, ai) => (
                                  <span key={ai} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">{a}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Services inclus */}
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-500" /> {tr.includedServices}
                            </p>
                            <ul className="space-y-1">
                              {plan.services.slice(0, 6).map((s, si) => (
                                <li key={si} className="flex items-start gap-1.5 text-xs text-gray-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />{s}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Non inclus */}
                          {plan.notIncluded.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                                <X className="w-3 h-3 text-gray-400" /> {tr.notIncluded}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {plan.notIncluded.map((n, ni) => (
                                  <span key={ni} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">{n}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Pricing (E7 only) */}
                        {plan.pricing && (
                          <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200 rounded-xl">
                            <p className="text-xs font-bold text-purple-700 mb-0.5">💰 {plan.pricing}</p>
                            {plan.pricingBreakdown && (
                              <p className="text-[10px] text-purple-500 leading-tight">{plan.pricingBreakdown}</p>
                            )}
                          </div>
                        )}

                        {/* Best for */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500"><strong className="text-gray-700">{tr.bestForColon}</strong> {plan.bestFor}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Solution detail (Azure & Dynamics) ──────────── */}
              {selectedSol && (
                <motion.div key="sol-detail" {...fadeUp} initial="initial" animate="animate">
                  <button onClick={() => setSelectedSol(null)}
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm mb-6">
                    <Home className="w-4 h-4" />
                    ← {solTab === 'dynamics' ? tr.backToDynamics : tr.backToAzure}
                  </button>
                  {(selectedSol.category === 'business' || selectedSol.category === 'modern-work')
                    ? <DynamicsSolutionDetail key={lang + selectedSol.id} sol={selectedSol} lang={lang} />
                    : <SolutionDetail key={lang + selectedSol.id} sol={selectedSol} catConfig={AZURE_CAT} lang={lang} />
                  }
                </motion.div>
              )}

            </motion.div>
          )}

          {/* ══ DOCS TAB ════════════════════════════════════════ */}
          {tab === 'docs' && !selectedDoc && (
            <motion.div key="docs-list" {...fadeUp} initial="initial" animate="animate">

              {/* ── Filtres avec compteurs ─────────────────────── */}
              <div className="flex flex-wrap gap-2 mb-8">
                {DOC_CATEGORIES.map(cat => {
                  const count = cat === 'All' ? KB_DOCS.length : KB_DOCS.filter(d => d.category === cat).length;
                  const style = CAT_DOC_STYLE[cat];
                  return (
                    <button key={cat} onClick={() => setDocFilter(cat)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        docFilter === cat
                          ? `bg-gradient-to-r ${style?.gradient || 'from-blue-600 to-indigo-600'} text-white border-transparent shadow-md`
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                      {cat}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center ${
                        docFilter === cat ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* ── Featured docs — cards larges ───────────────── */}
              {filteredDocs.filter(d => d.featured).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  {filteredDocs.filter(d => d.featured).map((doc, i) => {
                    const style = CAT_DOC_STYLE[doc.category] || CAT_DOC_STYLE.M365;
                    return (
                      <motion.button key={doc.id} onClick={() => setSelectedDoc(doc)}
                        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        whileHover={{ y: -2 }}
                        className={`text-left bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all ring-2 ring-transparent ${style.ring} group`}>
                        {/* Barre couleur catégorie */}
                        <div className={`h-1.5 w-full bg-gradient-to-r ${style.gradient}`} />
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-start gap-3">
                              <div className={`p-2.5 rounded-xl ${style.light} text-2xl shrink-0`}>{doc.emoji}</div>
                              <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>{doc.category}</span>
                                  <span className="flex items-center gap-1 text-[10px] text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200 font-semibold">
                                    <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" /> Featured
                                  </span>
                                  {doc.isNew && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">New</span>
                                  )}
                                </div>
                                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm leading-snug">{doc.title}</h3>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                          </div>
                          {doc.desc && (
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3 pl-[52px]">{doc.desc}</p>
                          )}
                          <div className="pl-[52px] flex items-center justify-between">
                            <span className="text-[10px] text-gray-300 font-mono truncate max-w-[180px]">{doc.file}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${style.gradient} text-white opacity-0 group-hover:opacity-100 transition-opacity`}>
                              Lire →
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* ── Docs reguliers — grid 3 colonnes ───────────── */}
              {filteredDocs.filter(d => !d.featured).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocs.filter(d => !d.featured).map((doc, i) => {
                    const style = CAT_DOC_STYLE[doc.category] || CAT_DOC_STYLE.M365;
                    return (
                      <motion.button key={doc.id} onClick={() => setSelectedDoc(doc)}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -2 }}
                        className={`text-left bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all ring-2 ring-transparent ${style.ring} group`}>
                        <div className={`h-1 w-full bg-gradient-to-r ${style.gradient}`} />
                        <div className="p-4">
                          <div className="flex items-start gap-2.5 mb-2.5">
                            <div className={`p-2 rounded-lg ${style.light} text-xl shrink-0`}>{doc.emoji}</div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 mb-1 flex-wrap">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${style.badge}`}>{doc.category}</span>
                                {doc.isNew && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">New</span>}
                              </div>
                              <h3 className="font-bold text-gray-900 text-xs group-hover:text-blue-600 transition-colors leading-snug">{doc.title}</h3>
                            </div>
                          </div>
                          {doc.desc && (
                            <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mb-3">{doc.desc}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-300 font-mono truncate max-w-[140px]">{doc.file}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* ── Empty state ─────────────────────────────────── */}
              {filteredDocs.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">📂</div>
                  <p className="text-gray-400 text-sm">{lang === 'fr' ? 'Aucun document dans cette catégorie.' : 'No documents in this category.'}</p>
                </div>
              )}

            </motion.div>
          )}

          {/* Doc viewer */}
          {tab === 'docs' && selectedDoc && (
            <motion.div key="doc-viewer" {...fadeUp} initial="initial" animate="animate">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                <button onClick={() => { setSelectedDoc(null); setDocContent(''); }} className="flex items-center gap-1 hover:text-blue-600"><Home className="w-4 h-4" /> Knowledge Base</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-900 font-semibold">{selectedDoc.title}</span>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedDoc.emoji}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedDoc.title}</h2>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">{selectedDoc.category}</span>
                    </div>
                  </div>
                  <button onClick={() => { const a = document.createElement('a'); a.href = '/api/knowledge-base?file=' + selectedDoc.file; a.download = selectedDoc.file; a.click(); }}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300">
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
                {!docContent ? (
                  <div className="space-y-3"><div className="shimmer h-6 rounded-lg w-3/4" /><div className="shimmer h-4 rounded-lg" /><div className="shimmer h-4 rounded-lg w-5/6" /></div>
                ) : (
                  <div className="prose prose-slate max-w-none max-h-screen overflow-y-auto pr-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}
                      components={{
                        h1: p => <h1 className="text-2xl font-bold mt-6 mb-3 text-gray-900" {...p} />,
                        h2: p => <h2 className="text-xl font-bold mt-5 mb-2 text-gray-800 border-b border-gray-200 pb-2" {...p} />,
                        h3: p => <h3 className="text-lg font-bold mt-4 mb-2 text-gray-800" {...p} />,
                        p:  p => <p className="my-2 text-gray-700 leading-relaxed text-sm" {...p} />,
                        ul: p => <ul className="my-2 ml-5 list-disc space-y-1" {...p} />,
                        li: p => <li className="text-gray-700 text-sm" {...p} />,
                        table: p => <div className="overflow-x-auto my-4 rounded-xl border border-gray-200"><table className="min-w-full divide-y divide-gray-200" {...p} /></div>,
                        thead: p => <thead className="bg-gray-50" {...p} />,
                        th: p => <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" {...p} />,
                        td: p => <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100" {...p} />,
                        code: ({ inline, ...p }) => inline
                          ? <code className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-mono" {...p} />
                          : <code className="block p-4 bg-gray-900 text-green-400 rounded-xl text-xs font-mono overflow-x-auto my-3" {...p} />,
                        strong: p => <strong className="font-bold text-gray-900" {...p} />,
                      }}>
                      {docContent}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ══ ASSESSMENTS TAB ══════════════════════════════════ */}
          {tab === 'assessments' && (
            <motion.div key="assessments" {...fadeUp} initial="initial" animate="animate">
              <div className="flex flex-wrap gap-2 mb-8">
                {['All', ...ASSESSMENTS_DATA.map(p => p.pillar)].map(p => (
                  <button key={p} onClick={() => setPillarFilter(p)}
                    className={'px-4 py-2 rounded-xl text-sm font-medium border transition-all ' +
                      (pillarFilter === p
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300')}>
                    {p}
                  </button>
                ))}
              </div>
              <div className="space-y-10">
                {ASSESSMENTS_DATA.filter(p => pillarFilter === 'All' || p.pillar === pillarFilter).map((pillar, pi) => {
                  const PillarIcon = pillar.icon;
                  return (
                    <motion.div key={pillar.pillar} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pi * 0.08 }}>
                      <div className={`flex items-center gap-4 mb-5 p-5 rounded-2xl border bg-gradient-to-r text-white ${pillar.color}`}>
                        <div className="p-3 bg-white/20 rounded-xl shrink-0"><PillarIcon className="w-6 h-6" /></div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-bold">{pillar.pillar}</h2>
                          <p className="text-sm text-white/80">{pillar.description}</p>
                          {pillar.solutionPlay && (
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full text-white/70">Solution Play : {pillar.solutionPlay}</span>
                              {pillar.toolPillar && <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full text-white/70">Outil : {pillar.toolPillar}</span>}
                            </div>
                          )}
                        </div>
                        <div className="ml-auto shrink-0">
                          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">{pillar.assessments.length} assessment{pillar.assessments.length > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {pillar.assessments.map((a, ai) => (
                          <motion.div key={a.short} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pi * 0.08 + ai * 0.05 }}
                            className={`bg-white rounded-2xl border p-6 hover:shadow-xl transition-all ${pillar.border}`}>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{a.emoji}</span>
                                <div>
                                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${a.badgeColor}`}>{a.badge}</span>
                                  <h3 className="font-bold text-gray-900 mt-1 text-base leading-tight">{a.name}</h3>
                                  <span className={`text-xs font-semibold ${pillar.text}`}>{a.short}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">{a.description}</p>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className={`rounded-xl p-3 ${pillar.bg}`}>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{tr.timeline}</p>
                                <p className={`text-sm font-bold ${pillar.text}`}>{a.timeline}</p>
                              </div>
                              <div className="rounded-xl bg-gray-50 p-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{tr.eligibility}</p>
                                <p className="text-xs text-gray-700 leading-snug">{a.eligibility}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                              <Cog className="w-3.5 h-3.5 shrink-0" />
                              <span><strong className="text-gray-700">{tr.tool}:</strong> {a.tool}</span>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {tr.outputs}
                              </p>
                              <ul className="space-y-1.5">
                                {a.outputs.map((o, oi) => (
                                  <li key={oi} className="flex items-start gap-2 text-xs text-gray-600">
                                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-gradient-to-br ${pillar.color}`} />
                                    {o}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {a.stats && (
                              <div className="mt-4 grid grid-cols-3 gap-1.5">
                                {a.stats.map((stat, si) => (
                                  <div key={si} className={`text-center rounded-xl p-2 ${pillar.bg}`}>
                                    <p className={`text-[10px] leading-tight font-medium ${pillar.text}`}>{stat}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                            {a.phases && (
                              <div className="mt-4 pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-1 flex-wrap">
                                  {a.phases.map((phase, pi) => (
                                    <span key={phase} className="flex items-center gap-1">
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pillar.bg} ${pillar.text}`}>{phase}</span>
                                      {pi < a.phases.length - 1 && <ChevronRight className="w-3 h-3 text-gray-300" />}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {/* ── Comment nominer ──────────────────────────────────────── */}
              <div className="mt-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Comment nominer un Solution Assessment</h3>
                    <p className="text-sm text-gray-500">3 voies selon le type de nominateur — FY26 Q4 (depuis le 16 avril 2026)</p>
                  </div>
                </div>

                {/* 3 voies */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {/* Microsoft Internal */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🏢</span>
                      <div>
                        <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Microsoft Internal</p>
                        <p className="font-bold text-sm leading-tight">MSX Deal Assistance</p>
                      </div>
                    </div>
                    <p className="text-xs text-blue-100 mb-3 leading-relaxed">Nouveau depuis le 16 avril 2026. Remplace OneAsk pour toutes les nouvelles nominations via MSX.</p>
                    <div className="bg-white/10 rounded-xl p-3 text-xs space-y-1.5">
                      <p className="flex items-center gap-1.5"><span className="text-green-300">✓</span> Email de confirmation (REQ-XXX)</p>
                      <p className="flex items-center gap-1.5"><span className="text-green-300">✓</span> Aucune permission spéciale requise</p>
                      <p className="flex items-center gap-1.5"><span className="text-green-300">✓</span> Nomination pour le compte d'un seller</p>
                    </div>
                  </div>

                  {/* Partner */}
                  <div className="bg-white border-2 border-orange-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🤝</span>
                      <div>
                        <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Partenaire</p>
                        <p className="font-bold text-sm text-gray-900 leading-tight">Partner Nomination Page</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">Accès direct via le portail partenaire Microsoft. Disponible pour tous les partenaires certifiés.</p>
                    <div className="bg-orange-50 rounded-xl p-3 text-xs space-y-1.5 text-orange-800">
                      <p className="flex items-center gap-1.5"><span>✓</span> Portail partenaire Microsoft</p>
                      <p className="flex items-center gap-1.5"><span>✓</span> Validation par SA Ops desk</p>
                      <p className="flex items-center gap-1.5"><span>✓</span> Co-delivery avec consultant Microsoft</p>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🌐</span>
                      <div>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Client direct</p>
                        <p className="font-bold text-sm text-gray-900 leading-tight">Customer Nomination Page</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">Auto-nomination client. Cybersecurity Assessment en self-service gratuit disponible pour tous.</p>
                    <div className="bg-emerald-50 rounded-xl p-3 text-xs space-y-1.5 text-emerald-800">
                      <p className="flex items-center gap-1.5"><span>✓</span> Self-service Cybersecurity (gratuit)</p>
                      <p className="flex items-center gap-1.5"><span>✓</span> Ouvert à tous les clients</p>
                      <p className="flex items-center gap-1.5"><span>✓</span> Contact : smbassessmenttriage@microsoft.com</p>
                    </div>
                  </div>
                </div>

                {/* Microsoft Internal — Étapes détaillées MDA */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-5 flex-wrap">
                    <span className="text-xl">🏢</span>
                    <h4 className="font-bold text-blue-900 text-base flex-1">Étapes détaillées — Microsoft Internal via MSX Deal Assistance</h4>
                    <span className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wide">Live depuis 16 avr. 2026</span>
                  </div>

                  {/* Stepper horizontal */}
                  <div className="flex items-stretch gap-0 overflow-x-auto pb-2 mb-6">
                    {[
                      { n: 1, emoji: '💼', title: 'Ouvrir MSX', sub: 'Aller sur une Opportunity' },
                      { n: 2, emoji: '🖱️', title: 'Deal Assistance', sub: 'Cliquer New Request' },
                      { n: 3, emoji: '📋', title: 'FY26 Investments', sub: 'Sélectionner Solution Assessment' },
                      { n: 4, emoji: '🎯', title: 'SA Core', sub: 'Solution Play · Contact · Objectifs client' },
                      { n: 5, emoji: '⚙️', title: 'Assessment Type', sub: 'CAIP / Security / AIBS + Initiative' },
                      { n: 6, emoji: '❓', title: 'Questions', sub: 'Headcount ou taille env. (CAIP)' },
                      { n: 7, emoji: '✅', title: 'Soumettre', sub: 'Email REQ-XXX automatique' },
                    ].map((step, i, arr) => (
                      <div key={step.n} className="flex items-center">
                        <div className="flex flex-col items-center min-w-[96px] max-w-[96px]">
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-2 shrink-0">
                            {step.n}
                          </div>
                          <span className="text-lg mb-1">{step.emoji}</span>
                          <p className="text-[10px] font-bold text-blue-900 text-center leading-tight">{step.title}</p>
                          <p className="text-[9px] text-blue-600 text-center leading-tight mt-0.5">{step.sub}</p>
                        </div>
                        {i < arr.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-blue-300 shrink-0 mx-1" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Détails par étape */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div className="bg-white rounded-xl p-4 border border-blue-100">
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                        <span>📋</span> Étape 4 — SA Core (champs obligatoires *)
                      </p>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" /><span><strong>Solution Play</strong> — prérempli depuis l'opportunity</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" /><span><strong>Est. Assessment Start Date</strong> — date estimée</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" /><span><strong>Customer Contact Name & Email</strong></span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" /><span><strong>Customer Objectives</strong> — env. size, licences, timeline, plans post-assessment</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" /><span className="text-gray-400">Migration Partner (optionnel)</span></li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-blue-100">
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                        <span>⚙️</span> Étape 5 — Assessment Types
                      </p>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" /><span><strong>Program</strong> — FY26 Solution Assessment Security / CAIP / AIBS</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" /><span><strong>Initiative Name</strong> — lié au Program sélectionné</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" /><span>Exemples Security : RSA, TPA, DSA, BVA, Protect Cloud AI Platform</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" /><span className="text-gray-400">Azure Accelerate → aller sur Azure Offer Navigator (AON)</span></li>
                      </ul>
                    </div>
                  </div>

                  {/* Key facts */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'ID unique', value: 'REQ-XXX', desc: 'Remplace NOM-XXX + CAS-XXX', color: 'bg-blue-100 text-blue-800' },
                      { label: 'Confirmation', value: 'Email auto', desc: 'DealAssistance ServiceAcct', color: 'bg-green-100 text-green-800' },
                      { label: 'Approbation', value: 'SA Ops', desc: 'Email manuel (pas automatique)', color: 'bg-amber-100 text-amber-800' },
                      { label: '1 oppty = 1 SA', value: 'Règle clé', desc: 'Un ID oppty par nomination', color: 'bg-red-100 text-red-800' },
                    ].map((fact) => (
                      <div key={fact.label} className="bg-white rounded-xl p-3 border border-blue-100 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${fact.color}`}>{fact.label}</span>
                        <p className="text-sm font-bold text-gray-900 mt-2">{fact.value}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{fact.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MDA Case Management — 5 stages */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Cog className="w-3.5 h-3.5" /> Après approbation — Case Management MDA (5 étapes)
                  </p>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {[
                      { n: 1, label: 'Planning', detail: 'Kickoff, outil, date estimée', color: 'bg-blue-600' },
                      { n: 2, label: 'Solution Prep', detail: 'Partner + SA consultant', color: 'bg-indigo-600' },
                      { n: 3, label: 'Execution', detail: 'Env. prep, déploiement outil, collecte données', color: 'bg-violet-600' },
                      { n: 4, label: 'Internal Review', detail: 'Revue interne du rapport', color: 'bg-purple-600' },
                      { n: 5, label: 'Final Review', detail: 'Présentation + clôture (date réelle)', color: 'bg-emerald-600' },
                    ].map((stage, i, arr) => (
                      <div key={stage.n} className="flex items-center gap-2 shrink-0">
                        <div className="text-center">
                          <div className={`${stage.color} text-white rounded-xl px-3 py-2 min-w-[90px]`}>
                            <p className="text-[10px] font-bold">{stage.n}. {stage.label}</p>
                          </div>
                          <p className="text-[9px] text-gray-400 mt-1 max-w-[90px] leading-tight">{stage.detail}</p>
                        </div>
                        {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <span><strong>Règle Case Owner :</strong> doit d'abord être ajouté au Case Team avant de pouvoir être assigné comme Case Manager. L'Actual Close Date doit être le jour même — pas de backdating ni de date future (audit).</span>
                  </div>
                </div>
              </div>

              {/* ── Summary & eligibility ────────────────────────────────── */}
              <div className="mt-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-7 text-white">
                <div className="flex items-start gap-4 mb-5">
                  <div className="p-3 bg-white/10 rounded-xl shrink-0"><Award className="w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Microsoft SMB Solution Assessments — FY26</h3>
                    <p className="text-sm text-slate-300">Programme Microsoft global financé — livrés par des consultants techniques Microsoft certifiés avec le partenaire tout au long du processus. Durée : 1–2 semaines, 3–8h de temps client, 4 réunions structurées.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-3">Critères de nomination (tous assessments)</p>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />MCEM Stage 2 — Inspire &amp; Design</li>
                      <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />Accord préalable du client sur l'assessment</li>
                      <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />Aucun assessment précédent pour le même TPID</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-3">Éligibilité par assessment</p>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" /><span><strong className="text-slate-300">Benchmark TCO</strong> : &gt; 5 VMs</span></li>
                      <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" /><span><strong className="text-slate-300">Rapid Security, TPA, DSA, PCAP, BVA</strong> : &gt; 30 sièges</span></li>
                      <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" /><span><strong className="text-slate-300">Secure AI, Dark to Cloud</strong> : &gt; 30 sièges whitespace</span></li>
                      <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" /><span><strong className="text-slate-300">Copilot Master Class</strong> : &gt; 10 Copilot seats + &gt; 30 sièges</span></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>📧 smbassessmenttriage@microsoft.com</span>
                  <span>•</span>
                  <span>🏢 Microsoft interne → MSX Deal Assistance (depuis 16 avr. 2026)</span>
                  <span>•</span>
                  <span>🤝 Partenaire → Partner Nomination Page</span>
                  <span>•</span>
                  <span>🌐 Client → Customer Nomination Page</span>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Shared solution grid ────────────────────────────────────────────────
function SolutionGrid({ solutions, catConfig, onSelect }) {
  const { lang } = useLang();
  const tr = t[lang].kb;
  if (solutions.length === 0) return (
    <div className="text-center py-16 text-gray-400">
      <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">{tr.noSolutions}</p>
    </div>
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {solutions.map((sol, i) => {
        const cfg = catConfig[sol.category] || catConfig.business || catConfig.compute;
        const Icon = cfg.icon;
        return (
          <motion.button key={sol.id} onClick={() => onSelect(sol)}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.4) }}
            className="text-left bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br text-white group-hover:scale-110 transition-transform ${cfg.color}`}><Icon className="w-5 h-5" /></div>
              <div className="flex gap-1">
                {sol.isFeatured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                {sol.salesPriority >= 8 && <TrendingUp className="w-4 h-4 text-green-500" />}
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{sol.officialName || sol.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{sol.shortDescription}</p>
            {sol.estimatedCost && (
              <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                <DollarSign className="w-3 h-3" />
                <span className="truncate max-w-32">{sol.estimatedCost.split(' à ')[0].replace('À partir de ', '').replace('From ', '')}</span>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Tab bar helper ──────────────────────────────────────────────────────
function TabBar({ tabs, active, onChange, accent = 'indigo' }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-gray-100 mb-5 pb-0 -mx-1 px-1">
      {tabs.map(tab => (
        <button key={tab.key} onClick={() => onChange(tab.key)}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px rounded-t-lg ` +
            (active === tab.key
              ? `border-${accent}-600 text-${accent}-700 bg-${accent}-50/60`
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50')}>
          <span>{tab.emoji}</span> {tab.label}
          {tab.count != null && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ` +
              (active === tab.key ? `bg-${accent}-200 text-${accent}-800` : 'bg-gray-100 text-gray-500')}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── Category gradient map for Azure hero headers ─────────────────────────
const CAT_HERO = {
  ai:          'from-violet-600 via-violet-700 to-purple-800',
  analytics:   'from-teal-600 via-teal-700 to-cyan-800',
  compute:     'from-orange-500 via-orange-600 to-amber-700',
  security:    'from-red-600 via-red-700 to-rose-800',
  storage:     'from-slate-600 via-slate-700 to-gray-800',
  management:  'from-blue-600 via-blue-700 to-indigo-800',
  networking:  'from-sky-600 via-sky-700 to-cyan-800',
  integration: 'from-emerald-600 via-emerald-700 to-green-800',
  iot:         'from-amber-600 via-amber-700 to-orange-800',
  development: 'from-pink-600 via-pink-700 to-rose-800',
  'modern-work':'from-sky-500 via-sky-600 to-blue-700',
};

// ── Azure solution detail — rich 6-tab view ───────────────────────────────
function SolutionDetail({ sol, catConfig, lang: langProp }) {
  const { lang: langCtx } = useLang();
  const lang = langProp || langCtx;
  const tr = t[lang].kb;
  const [tab, setTab] = useState('overview');
  const cfg  = catConfig[sol.category] || catConfig.compute;
  const Icon = cfg.icon;
  const heroGrad = CAT_HERO[sol.category] || 'from-blue-600 via-blue-700 to-indigo-800';

  const salesCtx   = pf(sol.salesContext)   || {};
  const cases      = pf(sol.customerCases)  || [];
  const competitors= pf(sol.competitors)    || [];
  const market     = pf(sol.marketPosition) || {};
  const compliance = pf(sol.complianceCerts)|| [];
  const integrations= pf(sol.integrations)  || [];
  const secFeats   = pf(sol.securityFeatures)|| [];

  const TABS = [
    { key: 'overview',     emoji: '🏠', label: tr.tabOverview },
    { key: 'features',     emoji: '⚡', label: tr.tabFeatures,     count: sol.keyFeatures?.length },
    { key: 'scenarios',    emoji: '📋', label: tr.tabScenarios,    count: sol.useCases?.length },
    ...(cases.length > 0       ? [{ key: 'cases',       emoji: '🏆', label: tr.tabCases,        count: cases.length }] : []),
    ...(integrations.length > 0|| compliance.length > 0 || secFeats.length > 0
      ? [{ key: 'security',    emoji: '🛡️', label: lang === 'fr' ? 'Sécurité' : 'Security' }] : []),
    ...(competitors.length > 0 ? [{ key: 'competition', emoji: '🎯', label: tr.tabCompetition }] : []),
    { key: 'pricing',      emoji: '💰', label: tr.tabPricing },
  ];

  return (
    <div>
      {/* ── Hero header ── */}
      <div className={`bg-gradient-to-br ${heroGrad} rounded-2xl p-7 text-white shadow-xl mb-5`}>
        <div className="flex items-start gap-5">
          <div className="p-4 bg-white/15 rounded-2xl shrink-0"><Icon className="w-9 h-9" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">{cfg.label}</span>
              {sol.isFeatured && <span className="px-3 py-1 bg-yellow-300/30 text-yellow-200 rounded-full text-xs font-semibold">⭐ Featured</span>}
              {sol.salesPriority >= 8 && <span className="px-3 py-1 bg-green-400/30 text-green-200 rounded-full text-xs font-semibold">🔥 {tr.priorityLabel} {sol.salesPriority}/10</span>}
              {market.leader && <span className="px-3 py-1 bg-white/15 rounded-full text-xs">👑 Leader</span>}
            </div>
            <h2 className="text-2xl font-bold mb-2">{sol.officialName || sol.name}</h2>
            <p className="text-white/85 text-sm leading-relaxed max-w-3xl">{(sol.fullDescription || sol.shortDescription || '').replace(/ [—–] /g, ': ')}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              {[
                sol.estimatedCost      && { l: tr.pricingInfo,    v: sol.estimatedCost.split('—')[0].split(' — ')[0].trim() },
                sol.implementationTime && { l: tr.implementation, v: sol.implementationTime.split('—')[0].trim() },
                sol.idealCustomerSize  && { l: tr.target,         v: sol.idealCustomerSize.split('(')[0].trim() },
                sol.complexity         && { l: tr.complexity,     v: sol.complexity.charAt(0).toUpperCase() + sol.complexity.slice(1) },
              ].filter(Boolean).map((item, i) => (
                <div key={i} className="bg-white/15 rounded-xl px-3 py-2">
                  <p className="text-white/50 text-[10px] mb-0.5">{item.l}</p>
                  <p className="font-bold text-xs">{item.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <TabBar tabs={TABS} active={tab} onChange={setTab} accent="blue" />

      <AnimatePresence mode="wait">

        {/* ── 1. Overview ── */}
        {tab === 'overview' && (
          <motion.div key="az-overview" {...fadeUp} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Pricing */}
              <div className="gradient-border-green">
                <div className="bg-white rounded-2xl p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-500" /> Pricing</p>
                  <p className="text-sm font-semibold text-emerald-700 mb-1">{sol.pricingModel}</p>
                  <p className="text-xs text-gray-600">{sol.estimatedCost}</p>
                  {sol.implementationTime && <p className="text-xs text-gray-400 mt-2">{tr.setupLabel} {sol.implementationTime.split('—')[0].trim()}</p>}
                </div>
              </div>
              {/* Key Stats */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:col-span-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-blue-500" /> {lang === 'fr' ? 'Chiffres clés' : 'Key Stats'}</p>
                {salesCtx.keyStats?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {salesCtx.keyStats.slice(0, 6).map((stat, i) => (
                      <div key={i} className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-2.5">
                        <span className="text-sm shrink-0">📊</span>
                        <p className="text-xs text-gray-700 leading-relaxed">{stat}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-1.5">
                    {(sol.useCases || []).slice(0, 5).map((u, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                        {typeof u === 'object' ? u.title : u}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {/* Target personas + industries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sol.targetPersonas?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500" /> {tr.targetPersonas}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sol.targetPersonas.map((p, i) => <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">{p}</span>)}
                  </div>
                </div>
              )}
              {(sol.targetIndustries?.length > 0) && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Globe className="w-4 h-4 text-teal-500" /> {tr.targetIndustries}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sol.targetIndustries.map((ind, i) => <span key={i} className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-100">{ind}</span>)}
                  </div>
                </div>
              )}
            </div>
            {/* Why Now */}
            {salesCtx.whyNow?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-orange-500" /> {tr.whyNow}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {salesCtx.whyNow.map((stat, i) => (
                    <div key={i} className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-xl p-2.5">
                      <span className="text-sm shrink-0">📊</span>
                      <p className="text-xs text-gray-700 leading-relaxed">{stat}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── 2. Features ── */}
        {tab === 'features' && (
          <motion.div key="az-features" {...fadeUp} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sol.keyFeatures?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-yellow-500" /> {tr.keyFeaturesLabel} <span className="text-gray-300 font-normal ml-1">({sol.keyFeatures.length})</span>
                  </p>
                  <ul className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                    {sol.keyFeatures.map((f, i) => {
                      const raw = (typeof f === 'string' ? f : String(f)).replace(/ [—–] /g, ': ');
                      const [title, ...rest] = raw.split(': ');
                      return (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>{title}</strong>{rest.length ? ': ' + rest.join(': ') : ''}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {sol.benefits?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-500" /> {tr.businessBenefits} <span className="text-gray-300 font-normal ml-1">({sol.benefits.length})</span>
                  </p>
                  <ul className="space-y-2">
                    {sol.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        {(typeof b === 'string' ? b : String(b)).replace(/ [—–] /g, ': ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── 3. Use Cases ── */}
        {tab === 'scenarios' && (
          <motion.div key="az-scenarios" {...fadeUp} className="space-y-5">
            {sol.useCases?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-purple-500" /> {tr.detailedUseCases}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sol.useCases.map((u, i) => {
                    const uc = typeof u === 'object' ? u : { title: u };
                    return (
                      <div key={i} className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                        <p className="font-semibold text-gray-900 text-sm mb-1">{uc.title}</p>
                        {uc.description && <p className="text-xs text-gray-600 mb-2 leading-relaxed">{uc.description}</p>}
                        {uc.industries?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {uc.industries.map((ind, ii) => <span key={ii} className="px-1.5 py-0.5 bg-white text-purple-700 text-[10px] rounded-full border border-purple-200">{ind}</span>)}
                          </div>
                        )}
                        {uc.businessImpact && (
                          <div className="flex items-start gap-1.5 bg-white rounded-lg px-2.5 py-1.5">
                            <TrendingUp className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-green-700 font-medium">{uc.businessImpact}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── 4. Customer Cases ── */}
        {tab === 'cases' && (
          <motion.div key="az-cases" {...fadeUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cases.map((c, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-2.5 mb-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${heroGrad} rounded-lg flex items-center justify-center shrink-0`}>
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm leading-tight">{c.company}</p>
                      <p className="text-[10px] text-gray-400">{[c.industry, c.country].filter(Boolean).join(' · ')}</p>
                    </div>
                  </div>
                  {c.challenge && (
                    <div className="bg-gray-50 rounded-lg px-3 py-2 mb-2">
                      <p className="text-[10px] font-semibold text-gray-400 mb-0.5">Challenge</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{c.challenge}</p>
                    </div>
                  )}
                  {c.results?.length > 0 && (
                    <ul className="space-y-1 mt-2">
                      {c.results.map((r, ri) => (
                        <li key={ri} className="flex items-start gap-1.5 text-xs text-gray-700">
                          <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />{r}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── 5. Security & Compliance ── */}
        {tab === 'security' && (
          <motion.div key="az-security" {...fadeUp} className="space-y-5">
            {secFeats.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-red-500" /> {lang === 'fr' ? 'Fonctionnalités sécurité' : 'Security Features'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {secFeats.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700 bg-red-50 border border-red-100 rounded-lg p-2.5">
                      <Shield className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>{(typeof f === 'string' ? f : String(f)).split(' :')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {compliance.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-600" /> {tr.complianceCertsLabel} <span className="text-gray-300 font-normal ml-1">({compliance.length})</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {compliance.map((cert, i) => (
                    <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-100 font-medium">✓ {cert.split(' (')[0]}</span>
                  ))}
                </div>
              </div>
            )}
            {integrations.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-cyan-500" /> {tr.integrationsLabel} <span className="text-gray-300 font-normal ml-1">({integrations.length})</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {integrations.map((int, i) => (
                    <span key={i} className="px-3 py-1.5 bg-cyan-50 text-cyan-700 text-xs rounded-full border border-cyan-100">
                      {(typeof int === 'string' ? int : String(int)).split(' —')[0].split(' (')[0]}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── 6. Competition ── */}
        {tab === 'competition' && (
          <motion.div key="az-competition" {...fadeUp} className="space-y-5">
            {competitors.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-red-500" /> {tr.competitiveComparison}
                </p>
                <div className="space-y-3">
                  {competitors.map((comp, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4">
                      <p className="font-bold text-gray-900 text-sm mb-3">vs {comp.name || comp.competitor}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {(comp.ourAdvantage) && (
                          <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                            <p className="text-xs font-semibold text-green-700 mb-1.5">✅ {tr.ourAdvantages}</p>
                            <p className="text-xs text-gray-700 leading-relaxed">{comp.ourAdvantage}</p>
                          </div>
                        )}
                        {(comp.weakness || comp.weaknesses) && (
                          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                            <p className="text-xs font-semibold text-orange-700 mb-1.5">⚠️ {lang === 'fr' ? 'Points de vigilance' : 'Watch Points'}</p>
                            <p className="text-xs text-gray-700 leading-relaxed">{comp.weakness || comp.weaknesses}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Object.keys(market).length > 0 && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> {tr.marketPositionLabel}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    market.gartnerMagicQuadrant && { l: 'Gartner',       i: '⭐', v: market.gartnerMagicQuadrant },
                    market.forresterTEI         && { l: 'Forrester TEI', i: '📈', v: market.forresterTEI },
                    market.customerROI          && { l: tr.clientROI,    i: '💰', v: market.customerROI },
                    market.globalCustomers      && { l: tr.globalCustomers, i: '🌍', v: market.globalCustomers },
                    market.analystRecognition   && { l: 'Analyst',       i: '🏆', v: Array.isArray(market.analystRecognition) ? market.analystRecognition.join(' · ') : market.analystRecognition },
                    ...(market.keyStats ? Object.entries(market.keyStats).map(([k, v]) => ({ l: k, i: '📊', v })) : []),
                  ].filter(Boolean).map((item, idx) => (
                    <div key={idx} className="bg-white/10 rounded-xl p-3">
                      <p className="text-xs text-slate-400 mb-1">{item.i} {item.l}</p>
                      <p className="text-xs text-white leading-relaxed">{item.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── 7. Pricing ── */}
        {tab === 'pricing' && (
          <motion.div key="az-pricing" {...fadeUp} className="space-y-5">
            {sol.pricingTiers?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-500" /> {tr.pricingPlans}
                </p>
                <div className={`grid gap-4 ${sol.pricingTiers.length <= 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
                  {sol.pricingTiers.map((tier, i) => (
                    <div key={i} className="border-2 border-emerald-100 rounded-xl p-5 bg-emerald-50/40">
                      <p className="font-bold text-gray-900 mb-1">{tier.tier}</p>
                      {tier.price && <p className="text-2xl font-black text-emerald-700 mb-2">{tier.price}</p>}
                      {tier.pricing && <p className="text-sm font-semibold text-emerald-700 mb-2">{tier.pricing}</p>}
                      {tier.description && <p className="text-xs text-gray-600 leading-relaxed">{tier.description}</p>}
                    </div>
                  ))}
                </div>
                {sol.estimatedCost && <p className="text-xs text-gray-500 mt-3 bg-gray-50 rounded-lg px-3 py-2">ℹ️ {sol.estimatedCost}</p>}
              </div>
            )}
            {!sol.pricingTiers?.length && sol.estimatedCost && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-500" /> {tr.pricingInfo}
                </p>
                <p className="text-sm text-gray-700">{sol.estimatedCost}</p>
                {sol.pricingModel && <p className="text-xs text-gray-400 mt-1">{sol.pricingModel}</p>}
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

// ── Helper ─────────────────────────────────────────────────────────────
const pf = (val) => {
  if (!val) return null;
  if (typeof val === 'object') return val;
  try { return JSON.parse(val); } catch { return null; }
};

// ── Dynamics 365 rich detail (tabbed) ──────────────────────────────────
function DynamicsSolutionDetail({ sol, lang: langProp }) {
  const { lang: langCtx } = useLang();
  const lang = langProp || langCtx;
  const tr = t[lang].kb;
  const [tab, setTab] = useState('overview');
  const cfg = AZURE_CAT['business'];
  const Icon = cfg.icon;

  const salesCtx    = pf(sol.salesContext)          || {};
  const agile       = pf(sol.frameworkAGILE)         || {};
  const cases       = pf(sol.customerCases)          || [];
  const market      = pf(sol.marketPosition)         || {};
  const competitors = pf(sol.competitorComparison)   || [];
  const compliance  = pf(sol.complianceCerts)        || [];
  const integrations= pf(sol.integrations)           || [];
  const e2e         = pf(sol.e2eProcesses)           || [];
  const scenarios   = pf(sol.modernizationScenarios);

  const AGILE_COLORS = {
    A: { bg:'bg-blue-50',   border:'border-blue-200',   text:'text-blue-700',   grad:'from-blue-500 to-blue-600'    },
    G: { bg:'bg-green-50',  border:'border-green-200',  text:'text-green-700',  grad:'from-green-500 to-green-600'  },
    I: { bg:'bg-indigo-50', border:'border-indigo-200', text:'text-indigo-700', grad:'from-indigo-500 to-indigo-600'},
    L: { bg:'bg-orange-50', border:'border-orange-200', text:'text-orange-700', grad:'from-orange-500 to-orange-600'},
    E: { bg:'bg-purple-50', border:'border-purple-200', text:'text-purple-700', grad:'from-purple-500 to-purple-600'},
  };
  const SC_COLORS = [
    { header:'bg-blue-600',   light:'bg-blue-50',   border:'border-blue-200',   text:'text-blue-700',   dot:'bg-blue-600'   },
    { header:'bg-orange-600', light:'bg-orange-50', border:'border-orange-200', text:'text-orange-700', dot:'bg-orange-600' },
    { header:'bg-purple-600', light:'bg-purple-50', border:'border-purple-200', text:'text-purple-700', dot:'bg-purple-600' },
  ];

  const TABS = [
    { key:'overview',     emoji:'🏠', label: tr.tabOverview },
    { key:'features',     emoji:'⚡', label: tr.tabFeatures,     count: sol.keyFeatures?.length },
    { key:'cases',        emoji:'🏆', label: tr.tabCases,        count: cases.length },
    { key:'scenarios',    emoji:'📋', label: tr.tabScenarios,    count: sol.useCases?.length },
    { key:'pricing',      emoji:'💰', label: tr.tabPricing },
    { key:'integrations', emoji:'🔗', label: tr.tabIntegrations, count: integrations.length },
    { key:'competition',  emoji:'🎯', label: tr.tabCompetition },
  ];

  return (
    <div>
      {/* ── Hero header (always visible) ── */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-2xl p-7 text-white shadow-xl mb-5">
        <div className="flex items-start gap-5">
          <div className="p-4 bg-white/15 rounded-2xl shrink-0"><Icon className="w-9 h-9" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">Business Apps</span>
              {sol.isFeatured && <span className="px-3 py-1 bg-yellow-300/30 text-yellow-200 rounded-full text-xs font-semibold">⭐ Featured</span>}
              {sol.salesPriority >= 9 && <span className="px-3 py-1 bg-green-400/30 text-green-200 rounded-full text-xs font-semibold">🔥 {tr.priorityLabel} {sol.salesPriority}/10</span>}
              {salesCtx.salesMotion && <span className="px-3 py-1 bg-white/15 rounded-full text-xs">{salesCtx.salesMotion}</span>}
            </div>
            <h2 className="text-2xl font-bold mb-2">{sol.officialName || sol.name}</h2>
            <p className="text-white/85 text-sm leading-relaxed max-w-3xl">{(sol.fullDescription || sol.shortDescription || '').replace(/ [—–] /g, ': ')}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              {[
                sol.estimatedCost    && { l: tr.pricingInfo,     v: sol.estimatedCost.split('—')[0].split(' — ')[0].trim() },
                sol.implementationTime&&{ l: tr.implementation,  v: sol.implementationTime.split('—')[0].split(' — ')[0].trim() },
                sol.idealCustomerSize&&{ l: tr.target,           v: sol.idealCustomerSize.split('(')[0].trim() },
                sol.complexity       &&{ l: tr.complexity,       v: sol.complexity.charAt(0).toUpperCase()+sol.complexity.slice(1) },
              ].filter(Boolean).map((item, i) => (
                <div key={i} className="bg-white/15 rounded-xl px-3 py-2">
                  <p className="text-white/50 text-[10px] mb-0.5">{item.l}</p>
                  <p className="font-bold text-xs">{item.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <TabBar tabs={TABS} active={tab} onChange={setTab} accent="indigo" />

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">

        {/* ── 1. Vue d'ensemble ── */}
        {tab === 'overview' && (
          <motion.div key="d-overview" {...fadeUp} className="space-y-5">
            {/* 3-col: Pricing + Use Cases + Target */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="gradient-border-green">
                <div className="bg-white rounded-2xl p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-500" /> Pricing</p>
                  <p className="text-sm font-semibold text-emerald-700 mb-1">{sol.pricingModel}</p>
                  <p className="text-xs text-gray-600">{sol.estimatedCost}</p>
                  {sol.implementationTime && <p className="text-xs text-gray-400 mt-2">Setup : {sol.implementationTime.split('—')[0].trim()}</p>}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-blue-500" /> Use Cases</p>
                <ul className="space-y-1.5">
                  {(sol.useCases || []).slice(0, 6).map((u, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      {typeof u === 'object' ? u.title : u}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Building2 className="w-4 h-4 text-purple-500" /> Target</p>
                {sol.idealCustomerSize && <p className="text-xs text-gray-600 mb-2"><strong>{tr.targetSize}</strong> {sol.idealCustomerSize}</p>}
                <div className="flex flex-wrap gap-1">
                  {(sol.targetIndustries || []).slice(0, 6).map((ind, i) => (
                    <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full">{ind}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Why Now */}
            {salesCtx.whyNow?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-orange-500" /> {tr.whyNow}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {salesCtx.whyNow.map((stat, i) => (
                    <div key={i} className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-xl p-2.5">
                      <span className="text-sm shrink-0">📊</span>
                      <p className="text-xs text-gray-700 leading-relaxed">{stat}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* AGILE Framework */}
            {Object.keys(agile).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-500" /> {tr.agileFramework}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {Object.entries(agile).map(([letter, data]) => {
                    const c = AGILE_COLORS[letter] || AGILE_COLORS.A;
                    return (
                      <div key={letter} className={`rounded-xl border-2 p-3 text-center ${c.bg} ${c.border}`}>
                        <div className={`text-2xl font-black mb-1 bg-gradient-to-br ${c.grad} bg-clip-text text-transparent`}>{letter}</div>
                        <p className={`text-xs font-bold mb-1 ${c.text}`}>{data.label}</p>
                        <p className="text-[10px] text-gray-600 leading-tight">{data.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── 2. Fonctionnalités ── */}
        {tab === 'features' && (
          <motion.div key="d-features" {...fadeUp} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sol.keyFeatures?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-yellow-500" /> {tr.keyFeaturesLabel} <span className="text-gray-300 font-normal ml-1">({sol.keyFeatures.length})</span>
                  </p>
                  <ul className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                    {sol.keyFeatures.map((f, i) => {
                      const raw = (typeof f === 'string' ? f : String(f)).replace(/ [—–] /g, ': ');
                      const [title, ...rest] = raw.split(' : ');
                      return (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>{title}</strong>{rest.length ? ' : ' + rest.join(' : ') : ''}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {sol.benefits?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-500" /> {tr.businessBenefits} <span className="text-gray-300 font-normal ml-1">({sol.benefits.length})</span>
                  </p>
                  <ul className="space-y-2">
                    {sol.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        {(typeof b === 'string' ? b : String(b)).replace(/ [—–] /g, ': ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── 3. Cas clients ── */}
        {tab === 'cases' && (
          <motion.div key="d-cases" {...fadeUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cases.map((c, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-2.5 mb-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm leading-tight">{c.company}</p>
                      {c.module && <span className="text-[10px] text-indigo-600 font-medium">{c.module}</span>}
                      {c.contact && <p className="text-[10px] text-gray-400 mt-0.5">{c.contact}</p>}
                    </div>
                  </div>
                  {c.quote && (
                    <blockquote className="text-xs text-gray-600 italic bg-gray-50 rounded-lg px-3 py-2 mb-2 leading-relaxed border-l-2 border-indigo-200">
                      "{c.quote}"
                    </blockquote>
                  )}
                  {c.results?.length > 0 && (
                    <ul className="space-y-1">
                      {c.results.map((r, ri) => (
                        <li key={ri} className="flex items-start gap-1.5 text-xs text-gray-700">
                          <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />{r}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── 4. Scénarios & Use Cases ── */}
        {tab === 'scenarios' && (
          <motion.div key="d-scenarios" {...fadeUp} className="space-y-6">
            {/* Use Cases */}
            {sol.useCases?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-purple-500" /> {tr.detailedUseCases}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sol.useCases.map((u, i) => {
                    const uc = typeof u === 'object' ? u : { title: u };
                    return (
                      <div key={i} className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                        <p className="font-semibold text-gray-900 text-sm mb-1">{uc.title}</p>
                        {uc.description && <p className="text-xs text-gray-600 mb-2 leading-relaxed">{uc.description}</p>}
                        {uc.industries?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {uc.industries.map((ind, ii) => <span key={ii} className="px-1.5 py-0.5 bg-white text-purple-700 text-[10px] rounded-full border border-purple-200">{ind}</span>)}
                          </div>
                        )}
                        {uc.businessImpact && (
                          <div className="flex items-start gap-1.5 bg-white rounded-lg px-2.5 py-1.5">
                            <TrendingUp className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-green-700 font-medium">{uc.businessImpact}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* SCM 3 Scenarios */}
            {scenarios && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-500" /> {tr.scmScenarios}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.values(scenarios).map((sc, i) => {
                    const c = SC_COLORS[i];
                    const example = Array.isArray(sc.customerExamples) ? sc.customerExamples[0] : sc.customerExample;
                    return (
                      <div key={i} className={`rounded-xl border-2 overflow-hidden ${c.border}`}>
                        <div className={`${c.header} text-white p-4`}>
                          <div className="text-2xl font-black opacity-25 mb-1">{i + 1}</div>
                          <p className="font-bold text-sm">{sc.name}</p>
                          {sc.keyMetric && <p className="text-white/70 text-xs mt-1">📊 {sc.keyMetric}</p>}
                        </div>
                        <div className={`${c.light} p-4 space-y-3`}>
                          <div>
                            <p className={`text-xs font-bold mb-1 ${c.text}`}>Challenge</p>
                            <p className="text-xs text-gray-600 leading-relaxed">{sc.businessChallenge}</p>
                          </div>
                          <div>
                            <p className={`text-xs font-bold mb-1 ${c.text}`}>Solutions</p>
                            <ul className="space-y-0.5">
                              {sc.solutions?.slice(0, 4).map((s, si) => (
                                <li key={si} className="flex items-start gap-1.5 text-xs text-gray-700">
                                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${c.dot}`} />
                                  {s.split(' (')[0].split(' :')[0]}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {example && (
                            <div className={`rounded-lg p-2.5 bg-white border ${c.border}`}>
                              <p className={`text-xs font-semibold ${c.text}`}>📌 {example}</p>
                            </div>
                          )}
                          {sc.audience && (
                            <div className="flex flex-wrap gap-1">
                              {sc.audience.slice(0, 3).map((a, ai) => (
                                <span key={ai} className={`text-[10px] px-1.5 py-0.5 rounded-full bg-white border ${c.border} ${c.text}`}>{a}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── 5. Tarifs & Cibles ── */}
        {tab === 'pricing' && (
          <motion.div key="d-pricing" {...fadeUp} className="space-y-5">
            {sol.pricingTiers?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-500" /> {tr.pricingPlans}
                </p>
                <div className={`grid gap-4 ${sol.pricingTiers.length <= 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
                  {sol.pricingTiers.map((tier, i) => (
                    <div key={i} className="border-2 border-emerald-100 rounded-xl p-5 bg-emerald-50/40">
                      <p className="font-bold text-gray-900 mb-1">{tier.tier}</p>
                      {tier.price && <p className="text-2xl font-black text-emerald-700 mb-2">{tier.price}{tier.perUser && <span className="text-xs font-normal text-gray-500"> {tr.perUserMonth}</span>}</p>}
                      {tier.description && <p className="text-xs text-gray-600 leading-relaxed">{tier.description}</p>}
                      {tier.includedApps && Array.isArray(tier.includedApps) && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {tier.includedApps.map((app, ai) => <span key={ai} className="px-2 py-0.5 bg-white text-indigo-600 text-xs rounded-lg border border-indigo-100">{app}</span>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {sol.estimatedCost && <p className="text-xs text-gray-500 mt-3 bg-gray-50 rounded-lg px-3 py-2">ℹ️ {sol.estimatedCost}</p>}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sol.targetPersonas?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-500" /> {tr.targetPersonas} <span className="text-gray-300 font-normal ml-1">({sol.targetPersonas.length})</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sol.targetPersonas.map((p, i) => <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">{p}</span>)}
                  </div>
                </div>
              )}
              {sol.targetIndustries?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-teal-500" /> {tr.targetIndustries} <span className="text-gray-300 font-normal ml-1">({sol.targetIndustries.length})</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sol.targetIndustries.map((ind, i) => <span key={i} className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-100">{ind}</span>)}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── 6. Intégrations & Compliance ── */}
        {tab === 'integrations' && (
          <motion.div key="d-integrations" {...fadeUp} className="space-y-5">
            {integrations.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-cyan-500" /> {tr.integrationsLabel} <span className="text-gray-300 font-normal ml-1">({integrations.length})</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {integrations.map((int, i) => (
                    <span key={i} className="px-3 py-1.5 bg-cyan-50 text-cyan-700 text-xs rounded-full border border-cyan-100">
                      {int.split(' :')[0].split(' (')[0]}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {e2e.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-teal-500" /> {tr.e2eProcesses}
                </p>
                <div className="flex flex-wrap gap-2">
                  {e2e.map((proc, i) => (
                    <span key={i} className="px-3 py-1.5 bg-teal-50 text-teal-700 text-xs rounded-lg border border-teal-100 font-medium">
                      {proc.split(' —')[0].split(' :')[0]}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {compliance.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-green-600" /> {tr.complianceCertsLabel} <span className="text-gray-300 font-normal ml-1">({compliance.length})</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {compliance.map((cert, i) => (
                    <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">✓ {cert.split(' (')[0]}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── 7. Concurrence & Marché ── */}
        {tab === 'competition' && (
          <motion.div key="d-competition" {...fadeUp} className="space-y-5">
            {competitors.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-red-500" /> {tr.competitiveComparison}
                </p>
                <div className="space-y-3">
                  {competitors.map((comp, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4">
                      <p className="font-bold text-gray-900 text-sm mb-3">vs {comp.competitor}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                          <p className="text-xs font-semibold text-green-700 mb-1.5">✅ {tr.ourAdvantages}</p>
                          <p className="text-xs text-gray-700 leading-relaxed">{comp.ourAdvantage}</p>
                        </div>
                        {comp.weaknesses && (
                          <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                            <p className="text-xs font-semibold text-red-700 mb-1.5">⚠️ {tr.watchPoints}</p>
                            <p className="text-xs text-gray-700 leading-relaxed">{comp.weaknesses}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Object.keys(market).length > 0 && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> {tr.marketPositionLabel}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    market.forresterTEI      && { l:'Forrester TEI',       i:'📈', v: market.forresterTEI },
                    market.customerROI       && { l: tr.clientROI,          i:'💰', v: market.customerROI },
                    market.globalCustomers   && { l: tr.globalCustomers,   i:'🌍', v: market.globalCustomers },
                    market.fortuneShare      && { l:'Fortune 500',         i:'🏆', v: market.fortuneShare },
                    market.analystRecognition&& { l:'Analyste',            i:'⭐', v: Array.isArray(market.analystRecognition) ? market.analystRecognition.join(' · ') : market.analystRecognition },
                    market.heritage          && { l: tr.heritageLabel,     i:'📅', v: market.heritage },
                    market.rapidDeployment   && { l:'Rapid Deployment',    i:'🚀', v: market.rapidDeployment },
                  ].filter(Boolean).map((item, idx) => (
                    <div key={idx} className="bg-white/10 rounded-xl p-3">
                      <p className="text-xs text-slate-400 mb-1">{item.i} {item.l}</p>
                      <p className="text-xs text-white leading-relaxed">{item.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {salesCtx.aimProgram && (
              <div className="bg-gradient-to-r from-ms-blue to-ms-blueDark rounded-2xl p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/15 rounded-xl shrink-0"><Zap className="w-6 h-6" /></div>
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-1">{salesCtx.aimProgram.name}</p>
                    <p className="text-indigo-200 text-sm mb-3">{salesCtx.aimProgram.description}</p>
                    {salesCtx.aimProgram.steps && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                        {salesCtx.aimProgram.steps.map((step, i) => (
                          <div key={i} className="bg-white/15 rounded-xl p-3"><p className="text-xs text-white/90 leading-relaxed">{step}</p></div>
                        ))}
                      </div>
                    )}
                    {salesCtx.aimProgram.link && <p className="text-indigo-200 text-xs">🔗 {salesCtx.aimProgram.link}</p>}
                  </div>
                </div>
                {salesCtx.nextSteps && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">{tr.nextSalesSteps}</p>
                    <div className="flex flex-wrap gap-2">
                      {salesCtx.nextSteps.map((step, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white/15 rounded-xl text-xs text-white">{step}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
