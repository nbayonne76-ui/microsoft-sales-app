#!/usr/bin/env node
/**
 * Sécurité & Conformité Agent
 * Sources : Microsoft Security blog + Purview + Defender + NIS2/RGPD
 * Run: node scripts/agents/securite-agent.js
 */

const { runAgent } = require('./_shared');

runAgent({
  domainLabel: 'Sécurité & Conformité Microsoft',
  category: 'securite',
  rssUrls: [
    'https://www.microsoft.com/en-us/security/blog/feed/',
    'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftSecurityandCompliance',
    'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftDefenderATPBlog',
    'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftPurviewBlog',
  ],
  searchQuery: 'Microsoft Security Defender Purview Entra NIS2 RGPD conformité entreprise 2026',
}).catch(err => {
  console.error('❌ Agent failed:', err.message);
  process.exit(1);
});
