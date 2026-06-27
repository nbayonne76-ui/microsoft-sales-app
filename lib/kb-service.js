/**
 * KB Service — Source unique de vérité pour toutes les features IA
 *
 * Deux couches de données (par ordre de priorité) :
 *   1. Blog articles (lib/blog-articles.js) — toujours les plus récentes
 *   2. Fichiers MD (templates/knowledge-base/) — référence détaillée
 *
 * Utilisé par : account-intel, generate-kb-email, ai-agent, sequences
 */

import fs from 'fs';
import path from 'path';
import { ARTICLES } from './blog-articles.js';

const KB_DIR = path.join(process.cwd(), 'templates', 'knowledge-base');

// ── Catalogue fichiers MD par domaine ────────────────────────────────────────
export const KB_CATALOG = {
  m365: {
    label: 'Microsoft 365',
    emoji: '💼',
    color: 'blue',
    files: [
      'm365-pricing-2025.md',
      'm365-e3-vs-e5-decision-guide.md',
      'm365-e7-frontier-worker-suite.md',
      'microsoft-teams-guide-2026.md',
      'microsoft-viva-suite-2026.md',
      'microsoft-365-apps-enterprise.md',
      'microsoft-365-frontline-workers.md',
      'modern-workplace-security-framework.md',
      'modern-work-licensing-guide.md',
      'microsoft-365-collaboration.md',
      'microsoft-licensing-contracts-guide.md',
      'csp-vs-mca-decision-guide.md',
    ],
  },
  azure: {
    label: 'Microsoft Azure',
    emoji: '☁️',
    color: 'sky',
    files: ['azure-pricing-2025.md', 'azure-migration.md'],
  },
  dynamics: {
    label: 'Dynamics 365',
    emoji: '🎯',
    color: 'orange',
    files: ['dynamics-365-pricing-2025.md'],
  },
  power: {
    label: 'Power Platform',
    emoji: '⚡',
    color: 'yellow',
    files: ['power-platform-digital.md'],
  },
  security: {
    label: 'Security & Compliance',
    emoji: '🛡️',
    color: 'red',
    files: ['security-compliance.md'],
  },
  bundles: {
    label: 'Solution Bundles',
    emoji: '🎁',
    color: 'purple',
    files: ['solution-bundles-pricing.md', 'microsoft-pricing-guide-2025.md', 'microsoft-promotions-2026.md'],
  },
};

// Mapping blog category → KB topic(s)
const BLOG_TO_KB = {
  m365:     ['m365'],
  copilot:  ['m365'],
  azure:    ['azure'],
  dynamics: ['dynamics'],
  securite: ['security'],
};

// ── Fichiers MD avec cache mémoire ───────────────────────────────────────────
const _cache = new Map();

function readFile(filename) {
  if (_cache.has(filename)) return _cache.get(filename);
  try {
    const content = fs.readFileSync(path.join(KB_DIR, filename), 'utf-8');
    _cache.set(filename, content);
    return content;
  } catch {
    return '';
  }
}

// ── Extraction du contenu des articles de blog ───────────────────────────────
function sectionToText(section) {
  if (!section) return '';
  switch (section.type) {
    case 'intro':
    case 'p':      return section.text || '';
    case 'h2':     return `\n## ${section.text}\n`;
    case 'list':   return (section.items || []).map(i => `- ${i}`).join('\n');
    case 'pricing':
      return (section.rows || [])
        .map(r => `- ${r.component}: ${r.price}${r.note ? ` (${r.note})` : ''}`)
        .join('\n');
    case 'cta':    return '';
    default:       return '';
  }
}

function articleToText(article) {
  // Always use French content (AI prompts are bilingual, FR is richer)
  const data = article.fr;
  if (!data) return '';
  const lines = [
    `# ${data.title}`,
    `> ${data.excerpt}`,
    '',
    ...(data.sections || []).map(sectionToText),
  ];
  return lines.filter(Boolean).join('\n').trim();
}

/**
 * Retourne le contenu des articles de blog pour un ou plusieurs topics KB.
 * Ces données sont PLUS RÉCENTES que les fichiers MD.
 */
function getBlogContent(topics = []) {
  const topicSet = new Set(topics);
  const matched = ARTICLES.filter(article => {
    const kbTopics = BLOG_TO_KB[article.category] || [];
    return kbTopics.some(t => topicSet.has(t));
  });
  if (!matched.length) return '';

  const header = `\n=== BLOG ARTICLES (informations les plus récentes — priorité sur les fichiers ci-dessus) ===\n`;
  const content = matched
    .map(a => `--- ${a.date} : ${a.fr?.title} ---\n${articleToText(a)}`)
    .join('\n\n');
  return header + content;
}

// ── API publique ──────────────────────────────────────────────────────────────

/**
 * Toute la KB : fichiers MD + tous les articles de blog
 * Utilisé par : account-intel, ai-agent, dashboard/brief
 */
export function getFullKb(maxChars = 14000) {
  const allFiles = [...new Set(Object.values(KB_CATALOG).flatMap(d => d.files))];
  const mdContent = allFiles
    .map(f => `=== ${f} ===\n${readFile(f).slice(0, 2000)}`)
    .join('\n\n');

  const allTopics = Object.keys(KB_CATALOG);
  const blogContent = getBlogContent(allTopics);

  return (mdContent + blogContent).slice(0, maxChars);
}

/**
 * KB pour un domaine précis + articles de blog du même domaine
 * Utilisé par : email generator, sequences
 */
export function getKbByTopic(topic, maxChars = 16000) {
  const domain = KB_CATALOG[topic] || KB_CATALOG.m365;
  const mdContent = domain.files
    .map(f => `### ${f}\n${readFile(f)}`)
    .join('\n\n');

  const blogContent = getBlogContent([topic]);

  return (mdContent + blogContent).slice(0, maxChars);
}

/**
 * KB pour plusieurs domaines + articles de blog correspondants
 * Utilisé par : ai-agent contextuel
 */
export function getKbByTopics(topics, maxChars = 16000) {
  const files = [...new Set(topics.flatMap(t => KB_CATALOG[t]?.files || []))];
  const mdContent = files
    .map(f => `### ${f}\n${readFile(f).slice(0, 2500)}`)
    .join('\n\n');

  const blogContent = getBlogContent(topics);

  return (mdContent + blogContent).slice(0, maxChars);
}

/**
 * Métadonnées KB — pour l'UI
 */
export function getKbMeta() {
  const allFiles = [...new Set(Object.values(KB_CATALOG).flatMap(d => d.files))];
  return {
    totalDomains: Object.keys(KB_CATALOG).length,
    totalFiles: allFiles.length,
    blogArticles: ARTICLES.length,
    domains: Object.entries(KB_CATALOG).map(([key, d]) => ({
      key,
      label: d.label,
      emoji: d.emoji,
      color: d.color,
      fileCount: d.files.length,
      files: d.files,
    })),
  };
}

/**
 * Noms de fichiers d'un domaine — pour l'UI
 */
export function getKbFiles(topic) {
  return KB_CATALOG[topic]?.files || KB_CATALOG.m365.files;
}

/**
 * Détecte le(s) domaine(s) à partir d'un texte libre — pour l'AI Agent
 */
export function detectTopics(text) {
  const lower = text.toLowerCase();
  const matches = [];

  const signals = {
    m365:     ['m365', 'microsoft 365', 'teams', 'sharepoint', 'exchange', 'outlook', 'office', 'onedrive', 'e3', 'e5', 'e7', 'copilot', 'frontier'],
    azure:    ['azure', 'cloud', 'vm', 'kubernetes', 'aks', 'storage', 'migration', 'infrastructure', 'serverless', 'openai service', 'aws'],
    dynamics: ['dynamics', 'crm', 'erp', 'business central', 'sales', 'field service', 'finance', 'supply chain'],
    power:    ['power bi', 'power apps', 'power automate', 'power platform', 'low-code', 'no-code'],
    security: ['security', 'defender', 'sentinel', 'compliance', 'rgpd', 'gdpr', 'zero trust', 'mfa', 'identité', 'nis2', 'purview', 'entra'],
    bundles:  ['bundle', 'pack', 'promotion', 'remise', 'roi', 'tco', 'prix', 'tarif'],
  };

  for (const [topic, keywords] of Object.entries(signals)) {
    if (keywords.some(kw => lower.includes(kw))) matches.push(topic);
  }

  return matches.length > 0 ? matches : ['m365'];
}
