#!/usr/bin/env node
/**
 * Modern Work Agent (Microsoft 365)
 * Fetches latest M365 / Modern Work news and generates an expert blog article.
 * Run: node scripts/agents/modern-work-agent.js
 */

const { runAgent } = require('./_shared');

runAgent({
  domainLabel: 'Microsoft 365 / Modern Work',
  category: 'm365',
  rssUrls: [
    'https://www.microsoft.com/en-us/microsoft-365/blog/feed/',
    'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=microsoft365blog',
    'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftTeamsBlog',
    'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=Microsoft365CopilotBlog',
  ],
  searchQuery: 'Microsoft 365 Teams Copilot modern work productivity announcement 2026',
}).catch(err => {
  console.error('❌ Agent failed:', err.message);
  process.exit(1);
});
