#!/usr/bin/env node
/**
 * Dynamics 365 Agent
 * Fetches latest Dynamics 365 news and generates an expert blog article.
 * Run: node scripts/agents/dynamics-agent.js
 */

const { runAgent } = require('./_shared');

runAgent({
  domainLabel: 'Dynamics 365',
  category: 'dynamics',
  rssUrls: [
    'https://cloudblogs.microsoft.com/dynamics365/feed/',
    'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=DynamicsSmallAndMediumBusiness',
    'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=DynamicsCRMCustomerEngagement',
  ],
  tavilyQuery: 'Microsoft Dynamics 365 CRM ERP Copilot agent release update 2026',
}).catch(err => {
  console.error('❌ Agent failed:', err.message);
  process.exit(1);
});
