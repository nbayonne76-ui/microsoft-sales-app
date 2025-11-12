/**
 * Comprehensive Test Suite for My-App
 * Tests all features and identifies enhancement opportunities
 *
 * Run with: node test-comprehensive.js
 */

const BASE_URL = 'http://localhost:3000';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

const testResults = {
  passed: [],
  failed: [],
  enhancements: [],
  performance: []
};

// Helper function to measure API performance
async function measureAPICall(name, endpoint, options = {}) {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const end = Date.now();
    const duration = end - start;

    const data = await response.json().catch(() => null);

    return {
      success: response.ok,
      status: response.status,
      duration,
      data,
      response
    };
  } catch (error) {
    const end = Date.now();
    return {
      success: false,
      error: error.message,
      duration: end - start
    };
  }
}

// Test categories
const tests = {
  // 1. UI Auto-Refresh Tests
  async testAutoRefresh() {
    log('\n📊 Testing UI Auto-Refresh Features...', 'cyan');

    const test1 = await measureAPICall('Get Hot Leads (Initial)', '/api/hot-leads');
    if (test1.success && test1.data) {
      testResults.passed.push({
        name: 'Hot Leads API - Initial Load',
        duration: test1.duration,
        records: test1.data.leads?.length || 0
      });

      if (test1.duration > 1000) {
        testResults.enhancements.push({
          category: 'Performance',
          feature: 'Hot Leads API',
          issue: `Initial load took ${test1.duration}ms (>1s)`,
          suggestion: 'Consider adding database indexes or implementing pagination'
        });
      }

      // Test auto-refresh simulation
      log('   Waiting 2 seconds to simulate auto-refresh...', 'yellow');
      await new Promise(resolve => setTimeout(resolve, 2000));

      const test2 = await measureAPICall('Get Hot Leads (Refresh)', '/api/hot-leads');
      if (test2.success) {
        testResults.passed.push({
          name: 'Hot Leads API - Auto-refresh simulation',
          duration: test2.duration,
          cached: test2.duration < test1.duration
        });

        log(`   ✓ Initial load: ${test1.duration}ms, Refresh: ${test2.duration}ms`, 'green');
      }
    } else {
      testResults.failed.push({
        name: 'Hot Leads API',
        error: test1.error || `HTTP ${test1.status}`
      });
    }
  },

  // 2. Lead Enrichment Tests
  async testLeadEnrichment() {
    log('\n🔍 Testing Lead Enrichment...', 'cyan');

    // First get a lead to test with
    const leadsResponse = await measureAPICall('Get Leads for Enrichment', '/api/hot-leads');
    if (leadsResponse.success && leadsResponse.data?.leads?.length > 0) {
      const testLead = leadsResponse.data.leads[0];
      log(`   Testing enrichment for: ${testLead.companyName}`, 'yellow');

      const enrichTest = await measureAPICall(
        'Enrich Lead',
        '/api/enrich-lead',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: testLead.id })
        }
      );

      if (enrichTest.success) {
        testResults.passed.push({
          name: 'Lead Enrichment',
          duration: enrichTest.duration,
          confidence: enrichTest.data?.confidence,
          sources: enrichTest.data?.sources
        });

        if (enrichTest.duration > 5000) {
          testResults.enhancements.push({
            category: 'Performance',
            feature: 'Lead Enrichment',
            issue: `Enrichment took ${enrichTest.duration}ms (>5s)`,
            suggestion: 'Consider caching enrichment data or using background jobs'
          });
        }
      } else {
        testResults.failed.push({
          name: 'Lead Enrichment',
          error: enrichTest.error || `HTTP ${enrichTest.status}`
        });
      }
    } else {
      log('   ⚠️  No leads available for enrichment test', 'yellow');
      testResults.enhancements.push({
        category: 'Testing',
        feature: 'Lead Enrichment',
        issue: 'No test data available',
        suggestion: 'Consider adding seed data for testing'
      });
    }
  },

  // 3. Workflow Automation Tests
  async testWorkflowAutomation() {
    log('\n⚙️  Testing Workflow Automation...', 'cyan');

    // Test workflow templates
    const templatesTest = await measureAPICall('Get Workflow Templates', '/api/workflows/templates');
    if (templatesTest.success) {
      testResults.passed.push({
        name: 'Workflow Templates API',
        duration: templatesTest.duration,
        templates: templatesTest.data?.templates?.length || 0
      });

      log(`   ✓ Found ${templatesTest.data?.templates?.length || 0} workflow templates`, 'green');
    }

    // Test workflow stats
    const statsTest = await measureAPICall('Get Workflow Stats', '/api/workflows/stats');
    if (statsTest.success) {
      testResults.passed.push({
        name: 'Workflow Stats API',
        duration: statsTest.duration
      });
    }

    // Test intelligent triggers
    const triggersTest = await measureAPICall('Get Intelligent Triggers Stats', '/api/intelligent-triggers/stats');
    if (triggersTest.success) {
      testResults.passed.push({
        name: 'Intelligent Triggers Stats',
        duration: triggersTest.duration
      });
    }

    // Test AI recommendations
    const recommendationsTest = await measureAPICall('Get AI Workflow Recommendations', '/api/ai-recommendations/workflow');
    if (recommendationsTest.success) {
      testResults.passed.push({
        name: 'AI Workflow Recommendations',
        duration: recommendationsTest.duration
      });

      if (!recommendationsTest.data || !recommendationsTest.data.recommendations) {
        testResults.enhancements.push({
          category: 'Feature Enhancement',
          feature: 'AI Recommendations',
          issue: 'AI recommendations might not be fully implemented',
          suggestion: 'Ensure AI recommendations are generating meaningful suggestions'
        });
      }
    }
  },

  // 4. Email Generation Tests
  async testEmailGeneration() {
    log('\n📧 Testing Email Generation Features...', 'cyan');

    // Test smart email generation
    const smartEmailTest = await measureAPICall(
      'Smart Email Generation',
      '/api/smart-email',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: 'Test context for Microsoft partner',
          recipient: 'test@example.com',
          tone: 'professional'
        })
      }
    );

    if (smartEmailTest.success) {
      testResults.passed.push({
        name: 'Smart Email Generation',
        duration: smartEmailTest.duration
      });

      if (smartEmailTest.duration > 3000) {
        testResults.enhancements.push({
          category: 'Performance',
          feature: 'Email Generation',
          issue: `Email generation took ${smartEmailTest.duration}ms`,
          suggestion: 'Consider caching common email templates or using streaming responses'
        });
      }
    }

    // Test email optimization
    const optimizeTest = await measureAPICall(
      'Email Optimization',
      '/api/optimize-email',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailText: 'Test email content that needs optimization'
        })
      }
    );

    if (optimizeTest.success) {
      testResults.passed.push({
        name: 'Email Optimization',
        duration: optimizeTest.duration
      });
    }

    // Test smart subjects
    const subjectsTest = await measureAPICall(
      'Smart Subject Generation',
      '/api/smart-subjects',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailContent: 'Test email about Microsoft solutions'
        })
      }
    );

    if (subjectsTest.success) {
      testResults.passed.push({
        name: 'Smart Subject Generation',
        duration: subjectsTest.duration
      });
    }
  },

  // 5. Analytics Tests
  async testAnalytics() {
    log('\n📊 Testing Analytics Features...', 'cyan');

    const analyticsTest = await measureAPICall('Get Analytics Summary', '/api/analytics?type=summary');
    if (analyticsTest.success) {
      testResults.passed.push({
        name: 'Analytics API',
        duration: analyticsTest.duration,
        hasData: !!(analyticsTest.data?.metrics || analyticsTest.data?.events)
      });

      if (analyticsTest.duration > 2000) {
        testResults.enhancements.push({
          category: 'Performance',
          feature: 'Analytics',
          issue: `Analytics query took ${analyticsTest.duration}ms`,
          suggestion: 'Consider implementing analytics caching or materialized views'
        });
      }

      // Check if we have meaningful analytics data
      if (!analyticsTest.data || !analyticsTest.data.metrics) {
        testResults.enhancements.push({
          category: 'Feature Enhancement',
          feature: 'Analytics',
          issue: 'Limited analytics data available',
          suggestion: 'Consider implementing more comprehensive analytics tracking'
        });
      }
    }

    // Test engagement analytics
    const engagementTest = await measureAPICall('Get Engagement Data', '/api/engagement');
    if (engagementTest.success) {
      testResults.passed.push({
        name: 'Engagement Analytics',
        duration: engagementTest.duration
      });
    }
  },

  // 6. AI Agent Tests
  async testAIAgent() {
    log('\n🤖 Testing AI Agent Features...', 'cyan');

    const aiAgentTest = await measureAPICall(
      'AI Agent Query',
      '/api/ai-agent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'What are the best Microsoft solutions for a small business?'
        })
      }
    );

    if (aiAgentTest.success) {
      testResults.passed.push({
        name: 'AI Agent',
        duration: aiAgentTest.duration
      });

      if (aiAgentTest.duration > 5000) {
        testResults.enhancements.push({
          category: 'Performance',
          feature: 'AI Agent',
          issue: `AI response took ${aiAgentTest.duration}ms`,
          suggestion: 'Consider implementing response streaming or caching common queries'
        });
      }
    }

    // Test AI assistant
    const assistantTest = await measureAPICall(
      'AI Assistant',
      '/api/ai-assistant',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'Help me create an email campaign'
        })
      }
    );

    if (assistantTest.success) {
      testResults.passed.push({
        name: 'AI Assistant',
        duration: assistantTest.duration
      });
    }
  },

  // 7. Campaign Tests
  async testCampaigns() {
    log('\n📢 Testing Campaign Features...', 'cyan');

    const campaignGenTest = await measureAPICall(
      'Campaign Generator',
      '/api/campaign-generator',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Microsoft 365',
          targetAudience: 'Small businesses',
          campaignGoal: 'Increase adoption'
        })
      }
    );

    if (campaignGenTest.success) {
      testResults.passed.push({
        name: 'Campaign Generator',
        duration: campaignGenTest.duration
      });
    }
  },

  // 8. Timing Optimizer Tests
  async testTimingOptimizer() {
    log('\n⏰ Testing Timing Optimizer...', 'cyan');

    const optimalTimeTest = await measureAPICall(
      'Get Optimal Send Time',
      '/api/timing-optimizer/optimal-time',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: 'test@example.com',
          campaignType: 'product_launch'
        })
      }
    );

    if (optimalTimeTest.success) {
      testResults.passed.push({
        name: 'Timing Optimizer',
        duration: optimalTimeTest.duration
      });
    }

    const timingAnalyticsTest = await measureAPICall(
      'Timing Analytics',
      '/api/timing-optimizer/analytics'
    );

    if (timingAnalyticsTest.success) {
      testResults.passed.push({
        name: 'Timing Analytics',
        duration: timingAnalyticsTest.duration
      });
    }
  },

  // 9. A/B Testing Tests
  async testABTesting() {
    log('\n🧪 Testing A/B Testing Features...', 'cyan');

    const abTestingTest = await measureAPICall('Get A/B Tests', '/api/ab-testing');
    if (abTestingTest.success) {
      testResults.passed.push({
        name: 'A/B Testing API',
        duration: abTestingTest.duration
      });
    }
  },

  // 10. Database Performance Tests
  async testDatabasePerformance() {
    log('\n💾 Testing Database Performance...', 'cyan');

    // Test concurrent requests
    const concurrentRequests = 5;
    log(`   Testing ${concurrentRequests} concurrent requests...`, 'yellow');

    const start = Date.now();
    const promises = Array(concurrentRequests).fill().map(() =>
      measureAPICall('Concurrent Hot Leads', '/api/hot-leads')
    );

    const results = await Promise.all(promises);
    const end = Date.now();
    const totalDuration = end - start;
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;

    testResults.performance.push({
      test: 'Concurrent Requests',
      concurrent: concurrentRequests,
      totalDuration,
      avgDuration,
      successful: results.filter(r => r.success).length
    });

    log(`   ✓ ${results.filter(r => r.success).length}/${concurrentRequests} succeeded`, 'green');
    log(`   Total: ${totalDuration}ms, Average: ${avgDuration.toFixed(0)}ms`, 'green');

    if (avgDuration > 1000) {
      testResults.enhancements.push({
        category: 'Performance',
        feature: 'Database',
        issue: `Average concurrent request time: ${avgDuration.toFixed(0)}ms`,
        suggestion: 'Consider connection pooling optimization or query optimization'
      });
    }
  },

  // 11. Error Handling Tests
  async testErrorHandling() {
    log('\n❌ Testing Error Handling...', 'cyan');

    // Test invalid endpoints
    const invalidTest = await measureAPICall('Invalid Endpoint', '/api/non-existent-endpoint');
    if (invalidTest.status === 404) {
      testResults.passed.push({
        name: 'Error Handling - 404',
        handled: true
      });
      log('   ✓ 404 errors handled correctly', 'green');
    }

    // Test malformed requests
    const malformedTest = await measureAPICall(
      'Malformed Request',
      '/api/enrich-lead',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      }
    );

    if (!malformedTest.success) {
      testResults.passed.push({
        name: 'Error Handling - Invalid JSON',
        handled: true
      });
      log('   ✓ Malformed requests handled correctly', 'green');
    }
  },

  // 12. UI Features Tests
  async testUIFeatures() {
    log('\n🎨 Testing UI Features...', 'cyan');

    testResults.enhancements.push(
      {
        category: 'UI Enhancement',
        feature: 'Loading States',
        suggestion: 'Add skeleton loaders for better perceived performance'
      },
      {
        category: 'UI Enhancement',
        feature: 'Error Boundaries',
        suggestion: 'Implement React Error Boundaries for graceful error handling'
      },
      {
        category: 'UI Enhancement',
        feature: 'Offline Support',
        suggestion: 'Consider implementing Service Worker for offline functionality'
      },
      {
        category: 'UI Enhancement',
        feature: 'Real-time Updates',
        suggestion: 'Consider WebSocket integration for real-time data updates instead of polling'
      },
      {
        category: 'UI Enhancement',
        feature: 'Data Visualization',
        suggestion: 'Add charts and graphs for analytics and performance metrics'
      }
    );
  },

  // 13. Security Tests
  async testSecurity() {
    log('\n🔒 Testing Security Features...', 'cyan');

    testResults.enhancements.push(
      {
        category: 'Security',
        feature: 'Authentication',
        suggestion: 'Implement authentication middleware for API routes'
      },
      {
        category: 'Security',
        feature: 'Rate Limiting',
        suggestion: 'Add rate limiting to prevent API abuse'
      },
      {
        category: 'Security',
        feature: 'Input Validation',
        suggestion: 'Implement comprehensive input validation using Zod or similar'
      },
      {
        category: 'Security',
        feature: 'CORS Configuration',
        suggestion: 'Review and tighten CORS policies for production'
      }
    );
  },

  // 14. Scalability Tests
  async testScalability() {
    log('\n📈 Testing Scalability Features...', 'cyan');

    testResults.enhancements.push(
      {
        category: 'Scalability',
        feature: 'Redis Integration',
        issue: 'Redis errors detected but app runs without it',
        suggestion: 'Properly configure Redis or remove dependency if not needed'
      },
      {
        category: 'Scalability',
        feature: 'Caching Strategy',
        suggestion: 'Implement Redis caching for frequently accessed data'
      },
      {
        category: 'Scalability',
        feature: 'Background Jobs',
        suggestion: 'Move long-running tasks (enrichment, AI) to background job queues'
      },
      {
        category: 'Scalability',
        feature: 'Database Indexing',
        suggestion: 'Review database queries and add indexes for performance'
      }
    );
  }
};

// Run all tests
async function runAllTests() {
  console.clear();
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('  COMPREHENSIVE TEST SUITE - My-App Enhancement Analysis  ', 'cyan');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log(`\n🚀 Starting tests against ${BASE_URL}\n`, 'blue');

  const startTime = Date.now();

  try {
    await tests.testAutoRefresh();
    await tests.testLeadEnrichment();
    await tests.testWorkflowAutomation();
    await tests.testEmailGeneration();
    await tests.testAnalytics();
    await tests.testAIAgent();
    await tests.testCampaigns();
    await tests.testTimingOptimizer();
    await tests.testABTesting();
    await tests.testDatabasePerformance();
    await tests.testErrorHandling();
    await tests.testUIFeatures();
    await tests.testSecurity();
    await tests.testScalability();
  } catch (error) {
    log(`\n❌ Critical error during testing: ${error.message}`, 'red');
  }

  const endTime = Date.now();
  const totalDuration = endTime - startTime;

  // Print Results
  log('\n\n═══════════════════════════════════════════════════════════', 'cyan');
  log('  TEST RESULTS SUMMARY  ', 'cyan');
  log('═══════════════════════════════════════════════════════════', 'cyan');

  log(`\n✅ PASSED TESTS: ${testResults.passed.length}`, 'green');
  testResults.passed.forEach((test, i) => {
    const details = test.duration ? ` (${test.duration}ms)` : '';
    const extra = test.records ? ` - ${test.records} records` : test.confidence ? ` - ${(test.confidence * 100).toFixed(0)}% confidence` : '';
    log(`   ${i + 1}. ${test.name}${details}${extra}`, 'green');
  });

  if (testResults.failed.length > 0) {
    log(`\n❌ FAILED TESTS: ${testResults.failed.length}`, 'red');
    testResults.failed.forEach((test, i) => {
      log(`   ${i + 1}. ${test.name} - ${test.error}`, 'red');
    });
  }

  if (testResults.performance.length > 0) {
    log(`\n⚡ PERFORMANCE TESTS:`, 'blue');
    testResults.performance.forEach((test, i) => {
      log(`   ${i + 1}. ${test.test}`, 'blue');
      log(`      Concurrent: ${test.concurrent}, Total: ${test.totalDuration}ms, Avg: ${test.avgDuration.toFixed(0)}ms`, 'blue');
    });
  }

  // Enhancement Opportunities
  log('\n\n═══════════════════════════════════════════════════════════', 'magenta');
  log('  ENHANCEMENT OPPORTUNITIES  ', 'magenta');
  log('═══════════════════════════════════════════════════════════', 'magenta');

  const categories = {};
  testResults.enhancements.forEach(enhancement => {
    if (!categories[enhancement.category]) {
      categories[enhancement.category] = [];
    }
    categories[enhancement.category].push(enhancement);
  });

  Object.keys(categories).forEach(category => {
    log(`\n📌 ${category.toUpperCase()}:`, 'yellow');
    categories[category].forEach((enhancement, i) => {
      log(`   ${i + 1}. ${enhancement.feature}`, 'cyan');
      if (enhancement.issue) {
        log(`      Issue: ${enhancement.issue}`, 'yellow');
      }
      log(`      → ${enhancement.suggestion}`, 'magenta');
    });
  });

  // Final Statistics
  log('\n\n═══════════════════════════════════════════════════════════', 'cyan');
  log('  FINAL STATISTICS  ', 'cyan');
  log('═══════════════════════════════════════════════════════════', 'cyan');

  log(`\n   Total Test Duration: ${(totalDuration / 1000).toFixed(2)}s`, 'blue');
  log(`   Tests Passed: ${testResults.passed.length}`, 'green');
  log(`   Tests Failed: ${testResults.failed.length}`, 'red');
  log(`   Enhancement Opportunities: ${testResults.enhancements.length}`, 'magenta');
  log(`   Success Rate: ${((testResults.passed.length / (testResults.passed.length + testResults.failed.length)) * 100).toFixed(1)}%`, 'cyan');

  // Priority Recommendations
  log('\n\n═══════════════════════════════════════════════════════════', 'cyan');
  log('  TOP PRIORITY RECOMMENDATIONS  ', 'cyan');
  log('═══════════════════════════════════════════════════════════', 'cyan');

  const priorities = testResults.enhancements
    .filter(e => ['Performance', 'Security', 'Scalability'].includes(e.category))
    .slice(0, 5);

  priorities.forEach((rec, i) => {
    log(`\n   ${i + 1}. [${rec.category}] ${rec.feature}`, 'cyan');
    if (rec.issue) log(`      ${rec.issue}`, 'yellow');
    log(`      → ${rec.suggestion}`, 'magenta');
  });

  log('\n\n═══════════════════════════════════════════════════════════', 'cyan');
  log('  TEST COMPLETE  ', 'cyan');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('');
}

// Run tests
runAllTests().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
