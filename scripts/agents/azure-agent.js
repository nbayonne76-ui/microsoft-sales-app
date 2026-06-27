#!/usr/bin/env node
/**
 * Azure & Cloud Agent
 * Fetches latest Azure news and generates an expert blog article.
 * Run: node scripts/agents/azure-agent.js
 */

const { runAgent } = require('./_shared');

runAgent({
  domainLabel: 'Azure & Cloud',
  category: 'azure',
  rssUrls: [
    'https://azure.microsoft.com/en-us/blog/feed/',
    'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=AzureInfrastructureblog',
    'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=AzureDevCommunityBlog',
  ],
  tavilyQuery: 'Microsoft Azure new features cloud services announcement 2026',
}).catch(err => {
  console.error('❌ Agent failed:', err.message);
  process.exit(1);
});
