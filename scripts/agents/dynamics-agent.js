#!/usr/bin/env node
/**
 * Dynamics 365 Agent
 * Sources : Microsoft blogs officiels + dynamics360.net + calsoft.com
 * Run: node scripts/agents/dynamics-agent.js
 */

const { runAgent } = require('./_shared');

runAgent({
  domainLabel: 'Dynamics 365',
  category: 'dynamics',
  rssUrls: [
    // Microsoft officiel
    'https://cloudblogs.microsoft.com/dynamics365/feed/',
    'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=DynamicsSmallAndMediumBusiness',
    'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=DynamicsCRMCustomerEngagement',
    // Sources partenaires expertes
    'https://dynamics360.net/feed/',
    'https://www.calsoft.com/category/dynamics-365/feed/',
  ],
  searchQuery: 'Microsoft Dynamics 365 Business Central Copilot AI agent ERP CRM release update 2026',
}).catch(err => {
  console.error('❌ Agent failed:', err.message);
  process.exit(1);
});
