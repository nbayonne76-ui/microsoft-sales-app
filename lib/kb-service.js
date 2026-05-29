/**
 * KB Service — Noyau de l'application
 *
 * Source unique de vérité : les fichiers MD dans templates/knowledge-base/
 * Utilisé par : account-intel, generate-kb-email, ai-agent, sequences
 *
 * NE PAS dupliquer la logique KB ailleurs. Toujours importer depuis ici.
 */

import fs from 'fs';
import path from 'path';

const KB_DIR = path.join(process.cwd(), 'templates', 'knowledge-base');

// ── Catalogue des fichiers par domaine ────────────────────────────────────────
export const KB_CATALOG = {
  m365: {
    label: 'Microsoft 365',
    emoji: '💼',
    color: 'blue',
    files: [
      'm365-pricing-2025.md',
      'm365-e3-vs-e5-decision-guide.md',
      'm365-e7-frontier-worker-suite.md',
      'microsoft-365-collaboration.md',
      'microsoft-licensing-contracts-guide.md',
      'csp-vs-mca-decision-guide.md',
    ],
  },
  azure: {
    label: 'Microsoft Azure',
    emoji: '☁️',
    color: 'sky',
    files: [
      'azure-pricing-2025.md',
      'azure-migration.md',
    ],
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
    files: [
      'solution-bundles-pricing.md',
      'microsoft-pricing-guide-2025.md',
    ],
  },
};

// ── Cache mémoire (vidé au redémarrage du serveur) ────────────────────────────
const _cache = new Map();

// ── Lecture d'un fichier avec cache ──────────────────────────────────────────
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

// ── API publique ──────────────────────────────────────────────────────────────

/**
 * Retourne TOUTE la KB (tous domaines) — pour Account Intelligence, AI Agent
 * @param {number} maxChars Limite totale de caractères (défaut : 14000)
 */
export function getFullKb(maxChars = 14000) {
  const allFiles = [...new Set(Object.values(KB_CATALOG).flatMap(d => d.files))];
  return allFiles
    .map(f => `=== ${f} ===\n${readFile(f).slice(0, 2000)}`)
    .join('\n\n')
    .slice(0, maxChars);
}

/**
 * Retourne la KB pour un domaine précis — pour Email Generator
 * @param {'m365'|'azure'|'dynamics'|'power'|'security'|'bundles'} topic
 * @param {number} maxChars
 */
export function getKbByTopic(topic, maxChars = 16000) {
  const domain = KB_CATALOG[topic] || KB_CATALOG.m365;
  return domain.files
    .map(f => `### ${f}\n${readFile(f)}`)
    .join('\n\n')
    .slice(0, maxChars);
}

/**
 * Retourne la KB pour plusieurs domaines à la fois — pour AI Agent contextuel
 * @param {string[]} topics ex: ['m365', 'azure']
 * @param {number} maxChars
 */
export function getKbByTopics(topics, maxChars = 16000) {
  const files = [...new Set(
    topics.flatMap(t => KB_CATALOG[t]?.files || [])
  )];
  return files
    .map(f => `### ${f}\n${readFile(f).slice(0, 2500)}`)
    .join('\n\n')
    .slice(0, maxChars);
}

/**
 * Retourne les métadonnées de la KB — pour affichage dans l'UI
 */
export function getKbMeta() {
  const allFiles = [...new Set(Object.values(KB_CATALOG).flatMap(d => d.files))];
  return {
    totalDomains: Object.keys(KB_CATALOG).length,
    totalFiles: allFiles.length,
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
 * Retourne les noms de fichiers d'un domaine — pour affichage dans l'UI
 * @param {string} topic
 */
export function getKbFiles(topic) {
  return KB_CATALOG[topic]?.files || KB_CATALOG.m365.files;
}

/**
 * Détecte le(s) domaine(s) pertinent(s) à partir d'un texte libre
 * (pour l'AI Agent : comprendre de quoi parle l'utilisateur)
 * @param {string} text
 * @returns {string[]} liste de domaines détectés
 */
export function detectTopics(text) {
  const lower = text.toLowerCase();
  const matches = [];

  const signals = {
    m365:     ['m365', 'microsoft 365', 'teams', 'sharepoint', 'exchange', 'outlook', 'office', 'onedrive', 'e3', 'e5', 'copilot'],
    azure:    ['azure', 'cloud', 'vm', 'kubernetes', 'aks', 'storage', 'migration', 'infrastructure', 'serverless', 'openai service'],
    dynamics: ['dynamics', 'crm', 'erp', 'business central', 'sales', 'field service', 'finance', 'supply chain'],
    power:    ['power bi', 'power apps', 'power automate', 'power platform', 'low-code', 'no-code'],
    security: ['security', 'defender', 'sentinel', 'compliance', 'rgpd', 'gdpr', 'zéro trust', 'zero trust', 'mfa', 'identité'],
    bundles:  ['bundle', 'pack', 'solution complète', 'all-in-one', 'roi', 'tco'],
  };

  for (const [topic, keywords] of Object.entries(signals)) {
    if (keywords.some(kw => lower.includes(kw))) matches.push(topic);
  }

  return matches.length > 0 ? matches : ['m365']; // fallback M365
}
