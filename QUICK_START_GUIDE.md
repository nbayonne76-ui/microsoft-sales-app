# Quick Start Guide - Automated Workflows

## 🚀 Getting Started in 5 Minutes

### Prerequisites
Your backend is ready to go! All improvements are already integrated.

### Step 1: Enable Automatic Triggers (30 seconds)

The system will now automatically start workflows when:
- Lead is enriched → Welcome Sequence
- Lead opens email → First Interaction
- Lead is very engaged → Hot Lead Fast Track
- Lead is inactive 30+ days → Re-engagement
- Lead clicks pricing → Pricing Interest
- And 10 more behavioral triggers!

**No configuration needed** - it's already active!

### Step 2: Test the System (2 minutes)

#### Quick Test: Trigger Analysis
```bash
# Test the intelligent trigger system
curl -X POST http://localhost:3000/api/intelligent-triggers/analyze \
  -H "Content-Type: application/json" \
  -d '{"leadId": "YOUR_LEAD_ID"}'

# Response shows detected triggers and started workflows
```

#### Quick Test: AI Recommendations
```bash
# Get AI recommendations for a lead
curl -X POST http://localhost:3000/api/ai-recommendations/workflow \
  -H "Content-Type: application/json" \
  -d '{"leadId": "YOUR_LEAD_ID"}'

# Response shows recommended workflows with reasoning
```

### Step 3: Create Your First Automated Workflow (2 minutes)

#### Option A: Use a Template (Recommended)
```bash
# Create from template
curl -X POST http://localhost:3000/api/workflow-builder/from-template \
  -H "Content-Type: application/json" \
  -d '{
    "templateName": "hot_lead_fast_track",
    "customizations": {
      "targetSegment": "enterprise"
    }
  }'
```

#### Option B: Quick Workflow
```bash
# Create quick workflow
curl -X POST http://localhost:3000/api/workflow-builder/quick \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Automated Follow-up",
    "quickTemplate": "simple_followup",
    "triggerType": "lead_enriched"
  }'
```

### Step 4: Watch It Work!

That's it! The system will now:
1. ✅ Automatically detect opportunities
2. ✅ Start appropriate workflows
3. ✅ Optimize send times
4. ✅ Provide real-time suggestions
5. ✅ Learn and improve

---

## 📋 Common Use Cases

### Use Case 1: New Lead Arrives
**What Happens Automatically:**
1. Lead gets enriched → `lead_enriched` trigger fires
2. Welcome Sequence workflow starts automatically
3. First email scheduled at optimal time (based on industry data)
4. If they open → `first_interaction` trigger fires
5. System capitalizes on interest with follow-up

**You do:** Nothing! It's fully automated.

### Use Case 2: Lead is Very Engaged
**What Happens Automatically:**
1. Lead opens email 3+ times → `multiple_opens` trigger fires
2. Engagement score reaches 70+ → `high_engagement` trigger fires
3. Hot Lead Fast Track workflow starts
4. Direct CTA email sent within 24h at optimal time
5. Task created for sales team to call

**You do:** Make the call when notified!

### Use Case 3: Lead Goes Cold
**What Happens Automatically:**
1. No activity for 30+ days → `inactivity_threshold` trigger fires
2. Re-engagement workflow starts
3. New approach email with fresh angle
4. If still no response → Graceful goodbye email
5. Lead priority reduced to BASSE

**You do:** Nothing! System handles it.

---

## 🎯 Key Endpoints Reference

### Intelligent Triggers
```bash
# Analyze lead for triggers
POST /api/intelligent-triggers/analyze
Body: { "leadId": "..." }

# Get trigger statistics
GET /api/intelligent-triggers/stats?days=30
```

### Workflow Builder
```bash
# List available templates
GET /api/workflow-builder/from-template

# Create from template
POST /api/workflow-builder/from-template
Body: { "templateName": "...", "customizations": {} }

# Create quick workflow
POST /api/workflow-builder/quick
Body: { "name": "...", "quickTemplate": "..." }

# Get suggestions for lead
POST /api/workflow-builder/suggestions
Body: { "leadId": "..." }
```

### AI Recommendations
```bash
# Get AI workflow recommendation
POST /api/ai-recommendations/workflow
Body: { "leadId": "..." }

# Optimize running workflow
POST /api/ai-recommendations/next-step
Body: { "executionId": "..." }

# Batch recommendations
POST /api/ai-recommendations/workflow
Body: { "leadIds": ["...", "..."] }
```

### Timing Optimizer
```bash
# Get optimal send time
POST /api/timing-optimizer/optimal-time
Body: { "leadId": "...", "lastStepType": "email" }

# Get timing analytics
GET /api/timing-optimizer/analytics
```

### Smart Suggestions
```bash
# Get suggestions for execution
POST /api/smart-suggestions
Body: { "executionId": "..." }

# Get performance benchmarks
GET /api/smart-suggestions?category=welcome
```

---

## 🔧 Configuration Options

### Disable Auto-Start for a Workflow
```javascript
// When creating workflow, set:
{
  "triggerConfig": {
    "autoStart": false  // Requires manual start
  }
}
```

### Target Specific Segments
```javascript
{
  "targetSegment": "enterprise",  // or "sme", "startup", "all"
  "targetPriority": "HAUTE"       // or "MOYENNE", "BASSE", "all"
}
```

### Custom Trigger Conditions
```javascript
{
  "triggerConfig": {
    "autoStart": true,
    "conditions": {
      "engagementScore": { "min": 70 },
      "daysSinceLastActivity": { "max": 30 }
    }
  }
}
```

---

## 📊 Monitoring & Analytics

### Check System Performance
```bash
# Trigger statistics (last 30 days)
curl http://localhost:3000/api/intelligent-triggers/stats?days=30

# Timing analytics
curl http://localhost:3000/api/timing-optimizer/analytics

# Workflow benchmarks
curl http://localhost:3000/api/smart-suggestions?category=welcome
```

### Monitor Active Workflows
```bash
# Use existing endpoint
GET /api/workflows/{workflowId}/executions

# Get execution status
GET /api/workflows/{workflowId}/executions/{executionId}
```

---

## 🛠️ Troubleshooting

### Q: Workflows not auto-starting?
**Check:**
1. Workflow status is "active"
2. triggerConfig.autoStart is true
3. Lead matches targetSegment/targetPriority
4. No existing active workflow for this lead

### Q: How to test without sending emails?
**Option 1:** Use test mode
```javascript
// Set in workflow config
{
  "testMode": true  // Workflows run but don't send emails
}
```

**Option 2:** Check workflow execution logs
```bash
# View execution without sending
GET /api/workflows/{workflowId}/executions/{executionId}
```

### Q: How to stop auto-triggers temporarily?
**Pause workflow:**
```javascript
// Update workflow
PUT /api/workflows/{workflowId}
{
  "status": "paused"  // Stops new executions
}
```

---

## 💡 Pro Tips

### Tip 1: Start with Templates
Don't create workflows from scratch. Use the 8 pre-built templates:
1. Welcome Sequence
2. No Response Follow-up
3. Long-term Nurture
4. Hot Lead Fast Track ⭐
5. Cold Lead Re-engagement
6. Post-Demo Follow-up
7. Pricing Interest ⭐
8. First Interaction ⭐

⭐ = Automatically triggered

### Tip 2: Trust the AI
The AI recommendations are based on:
- Your actual lead data
- Performance of similar leads
- Industry best practices
- Historical success rates

Use them!

### Tip 3: Monitor Weekly
Check these weekly:
- Trigger statistics (what's working)
- Timing analytics (validate optimization)
- Workflow benchmarks (compare performance)

### Tip 4: Let It Learn
The system improves over time as it collects data:
- Timing optimization gets smarter
- Trigger detection improves
- Recommendations become more accurate

Give it 2-4 weeks to learn your leads' patterns.

---

## 🎉 You're All Set!

Your backend is now **fully automated**. The system will:
- ✅ Detect opportunities automatically
- ✅ Start appropriate workflows
- ✅ Optimize timing for each lead
- ✅ Provide intelligent suggestions
- ✅ Learn and improve continuously

**No manual intervention needed for 90% of cases!**

---

## 📚 Additional Resources

- Full documentation: [WORKFLOW_AUTOMATION_IMPROVEMENTS.md](./WORKFLOW_AUTOMATION_IMPROVEMENTS.md)
- Workflow engine guide: [WORKFLOW_SETUP.md](./WORKFLOW_SETUP.md)
- Quick wins: Check `QUICK_WIN_*.md` files

## 🆘 Need Help?

Issues or questions? Check:
1. Build logs: `npm run build`
2. Runtime logs: Check console output
3. API responses for error messages

---

**Happy Automating! 🚀**
