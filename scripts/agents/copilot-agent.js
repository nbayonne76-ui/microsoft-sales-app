#!/usr/bin/env node
/**
 * Copilot & IA Agent
 * Sources : Microsoft Copilot blogs + Tech Community Copilot + GitHub Copilot
 * Run: node scripts/agents/copilot-agent.js
 */

const { runAgent } = require('./_shared');

runAgent({
  domainLabel: 'Microsoft Copilot & IA',
  category: 'copilot',
  rssUrls: [
    'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=Microsoft365CopilotBlog',
    'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=AzureAIServicesBlog',
    'https://blogs.microsoft.com/feed/',
    'https://dynamics360.net/feed/',
  ],
  searchQuery: 'Microsoft Copilot Studio AI agent Power Platform automation enterprise 2026',
}).catch(err => {
  console.error('❌ Agent failed:', err.message);
  process.exit(1);
});
