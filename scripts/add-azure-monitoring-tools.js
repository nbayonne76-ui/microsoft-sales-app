const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addAzureMonitoringTools() {
  try {
    console.log('Adding Azure Monitoring tools to knowledge base...');

    const solutions = [
      // ===== AZURE MONITOR =====
      {
        name: 'azure-monitor',
        officialName: 'Azure Monitor',
        category: 'management',
        subcategory: 'Monitoring & Observability',
        shortDescription: 'Service complet pour collecting, analyzing, et acting on telemetry data from Azure resources, applications, et on-premises environments. Full visibility, real-time insights, alerts.',
        fullDescription: `Azure Monitor est un comprehensive monitoring et observability platform pour Azure resources, applications, et on-premises environments. Helps improve performance, security, et availability by providing real-time insights et alerts.

Collects telemetry data from:
- **Azure resources** - VMs, Kubernetes, App Services, databases
- **Applications** - Application Insights integration
- **Custom sources** - On-premises, hybrid cloud environments

Uses advanced querying avec Log Analytics (KQL), proactive alerting & automation, integration avec ITSM tools pour ServiceNow ticketing.`,

        keyFeatures: [
          "Data Collection & Centralized Monitoring - Collect logs from Azure resources, VMs, applications, custom sources",
          "Alerting Analytics - Analyze data avec Log Analytics KQL queries",
          "Powerful Querying (KQL) - Advanced data filtering, custom queries, real-time troubleshooting",
          "Proactive Alerting & Automation - Configurable alerts based on metrics, log conditions. ITSM integration",
          "Application & Infrastructure Monitoring - Application Insights, VM monitoring, Azure services monitoring",
          "Security & Compliance - Security anomalies detection, Microsoft Defender integration, audit trails tracking",
          "Multi-platform support - Monitor Windows, Linux, on-premises, hybrid cloud",
          "Dashboard & visualization - Customizable dashboards, integration avec Power BI, Grafana",
          "Distributed tracing - Track requests across microservices",
          "Auto-scaling triggers - Use metrics to trigger Azure Automation, scale resources dynamically"
        ],

        benefits: [
          "Full Visibility - Centralizes everything from infrastructure to applications",
          "Proactive Issue Detection - Alerts prevent critical failures",
          "Scalability - Works across small setups & large enterprise environments",
          "Deep insights with KQL - Fast troubleshooting et root cause analysis",
          "Integrated with Azure Ecosystem - Works seamlessly avec Azure Security Center, Application Insights, etc."
        ],

        useCases: [
          {
            title: "Infrastructure Monitoring - VM & Resource Health",
            description: "Monitor CPU usage, disk space, network activity of all Azure VMs. Track resource health, performance metrics. Set alerts pour high CPU usage.",
            industries: ["All"],
            businessImpact: "Downtime reduced 80%, performance issues detected proactively, SLA targets met"
          },
          {
            title: "Application Performance Management (APM)",
            description: "Monitor application page load times, failed HTTP requests. Application Insights integration pour distributed tracing, dependency mapping.",
            industries: ["Technology", "E-commerce", "SaaS"],
            businessImpact: "User experience +40%, performance bottlenecks identified, revenue impact reduced"
          },
          {
            title: "Security & Compliance Monitoring",
            description: "Detect suspicious activities, security threats, compliance violations. Microsoft Defender integration, audit trails tracking.",
            industries: ["Finance", "Healthcare", "Government"],
            businessImpact: "Security incidents reduced 70%, compliance maintained, audit readiness improved"
          },
          {
            title: "Log Analytics & Troubleshooting",
            description: "Centralize logs from all Azure resources. Use KQL queries pour troubleshoot issues, analyze trends, create custom reports.",
            industries: ["All"],
            businessImpact: "MTTR (Mean Time To Repair) reduced 60%, root cause analysis faster, operational efficiency improved"
          },
          {
            title: "Auto-Scaling & Cost Optimization",
            description: "Use Azure Monitor alerts to trigger Azure Automation scripts. Scale resources dynamically based on load, shutdown idle resources.",
            industries: ["All"],
            businessImpact: "Costs reduced 30%, resource utilization optimized, performance maintained during peak loads"
          }
        ],

        targetIndustries: ['All Industries'],

        pricingModel: 'Pay-as-you-go (per GB data ingested)',
        estimatedCost: 'Starts at $2.30/GB for Log Analytics data ingestion. First 5GB/month free per workspace.',

        pricingTiers: [
          {
            tier: 'Free Tier',
            description: 'First 5GB/month per workspace free',
            pricing: '$0 for first 5GB',
            bestFor: 'Small deployments, testing, dev environments'
          },
          {
            tier: 'Pay-As-You-Go',
            description: 'Pay per GB data ingested',
            pricing: '$2.30/GB (may vary by region)',
            bestFor: 'Variable workloads, unpredictable data ingestion'
          },
          {
            tier: 'Commitment Tiers',
            description: '100GB, 200GB, 300GB, 400GB, 500GB+ daily commitments with discounts',
            pricing: 'Discounted rates for committed daily ingestion',
            bestFor: 'Enterprise workloads with predictable data volumes'
          }
        ],

        complexity: 'medium',
        implementationTime: '1-2 weeks (setup monitoring, dashboards, alerts)',
        salesPriority: 10,
        isFeatured: true,

        integrations: ['Azure Log Analytics', 'Application Insights', 'Azure Security Center', 'Microsoft Defender', 'Azure Automation', 'Power BI', 'Grafana', 'ServiceNow', 'Azure Sentinel'],

        prerequisites: ['Azure subscription', 'Log Analytics workspace', 'Resources deployed in Azure to monitor'],

        idealCustomerSize: 'All (SME to Enterprise)',

        documentationUrl: 'https://docs.microsoft.com/en-us/azure/azure-monitor/',
        pricingUrl: 'https://azure.microsoft.com/en-us/pricing/details/monitor/',

        keywords: ['azure monitor', 'monitoring', 'observability', 'log analytics', 'kql', 'alerts', 'metrics', 'telemetry', 'apm'],
        tags: ['monitoring', 'observability', 'logs', 'alerts', 'analytics'],

        targetPersonas: ['DevOps Engineer', 'SRE', 'IT Operations', 'Cloud Architect', 'Security Engineer', 'Platform Engineer']
      },

      // ===== AZURE LOG ANALYTICS =====
      {
        name: 'azure-log-analytics',
        officialName: 'Azure Log Analytics',
        category: 'management',
        subcategory: 'Log Management & Analysis',
        shortDescription: 'Monitoring and analytics service within Azure Monitor collecting and analyzing log data from Azure resources, on-premises, hybrid clouds. KQL queries, performance monitoring, security insights.',
        fullDescription: `Azure Log Analytics est un monitoring and analytics service within Azure Monitor that collects and analyzes log data from various sources (Azure resources, on-premises, hybrid clouds). Helps with performance monitoring, security insights, et troubleshooting.

**Centralized Log Collection & Analysis** - Collect logs from Azure resources, VMs, applications, custom sources. Structured & unstructured data support.

**Powerful Query Language (KQL)** - Kusto Query Language for advanced data filtering, analysis. Real-time insights with custom queries.

**Integration with Azure Services** - Works with Azure Monitor, Azure Security Center, Microsoft Sentinel, Application Insights.

**Security & Compliance Monitoring** - Detect suspicious activities, security threats, compliance violations. Audit trails tracking.`,

        keyFeatures: [
          "Centralized Log Collection - Azure resources, VMs, applications, custom sources",
          "Structured & unstructured data support - Multiple data sources",
          "Kusto Query Language (KQL) - Advanced filtering, custom queries, real-time insights",
          "Real-time troubleshooting - Root cause analysis avec KQL queries",
          "Dashboards and reports - Better visualization, custom analytics",
          "Integration with Azure Services - Azure Monitor, Security Center, Sentinel, Application Insights",
          "Security & Compliance - Detect threats, compliance violations, audit trails",
          "Microsoft Defender integration - Security insights",
          "Audit trails logging - Track changes in environment",
          "Scalability & Custom Alerts - Large-scale log ingestion, automated responses",
          "Retention up to 730 days - Historical analysis, compliance reporting"
        ],

        benefits: [
          "Comprehensive Monitoring - Centralizes logs from all Azure and on-prem resources",
          "Fast Troubleshooting - KQL queries pour quick issue identification",
          "Security & Compliance - Tracks security incidents, ensures compliance",
          "Scalable & Automated - Grows with infrastructure, enables automation",
          "Integrated with Azure Ecosystem - Works seamlessly avec Azure Monitor, Security Center"
        ],

        useCases: [
          {
            title: "Centralized Logging - All Azure Resources",
            description: "Collect CPU usage, disk space, network activity logs from all Azure VMs in one workspace. Monitor resource health, performance trends.",
            industries: ["All"],
            businessImpact: "Centralized visibility achieved, troubleshooting time reduced 60%, operational efficiency improved"
          },
          {
            title: "Security Threat Detection - KQL Queries",
            description: "Use KQL to detect failed login attempts across multiple servers. Track unauthorized access, security anomalies, compliance violations.",
            industries: ["Finance", "Healthcare", "Government"],
            businessImpact: "Security incidents detected 5x faster, compliance maintained, audit trails complete"
          },
          {
            title: "Performance Troubleshooting - Root Cause Analysis",
            description: "Azure SQL Database experiences high query times. Use Log Analytics to send alerts to DevOps teams, identify slow queries, optimize performance.",
            industries: ["Technology", "SaaS", "E-commerce"],
            businessImpact: "MTTR reduced 70%, database performance optimized, user experience improved"
          },
          {
            title: "Compliance Reporting - Historical Analysis",
            description: "Track unauthorized access attempts, audit trails pour regulatory compliance (GDPR, HIPAA, SOC 2). Retain logs 730 days.",
            industries: ["Finance", "Healthcare", "Government"],
            businessImpact: "Compliance achieved, audit readiness 100%, regulatory fines avoided"
          }
        ],

        targetIndustries: ['All Industries'],

        pricingModel: 'Pay-per-GB data ingested',
        estimatedCost: 'Starts at $2.30/GB. First 5GB/month free per workspace.',

        pricingTiers: [
          {
            tier: 'Free Tier (first 5GB)',
            description: 'First 5GB/month per workspace included free',
            pricing: '$0',
            bestFor: 'Small deployments, dev/test environments'
          },
          {
            tier: 'Pay-As-You-Go',
            description: 'Pay per GB data ingested to Log Analytics workspace',
            pricing: '$2.30/GB (varies by region)',
            bestFor: 'Variable log volumes, unpredictable workloads'
          },
          {
            tier: 'Commitment Tiers',
            description: '100GB+ daily commitments with volume discounts',
            pricing: 'Discounted per-GB rates for committed volumes',
            bestFor: 'Enterprise with high, predictable log volumes'
          }
        ],

        complexity: 'medium',
        implementationTime: '1-2 weeks (workspace setup, data sources configuration)',
        salesPriority: 9,
        isFeatured: true,

        integrations: ['Azure Monitor', 'Azure Security Center', 'Microsoft Sentinel', 'Application Insights', 'Azure Functions', 'Logic Apps', 'Azure Automation'],

        prerequisites: ['Azure subscription', 'Log Analytics workspace', 'Data sources (VMs, Storage, Applications, Event Hubs)'],

        idealCustomerSize: 'All (SME to Enterprise)',

        documentationUrl: 'https://docs.microsoft.com/en-us/azure/azure-monitor/logs/',
        pricingUrl: 'https://azure.microsoft.com/en-us/pricing/details/monitor/',

        keywords: ['azure log analytics', 'kql', 'kusto', 'log management', 'log analysis', 'monitoring', 'workspace', 'queries'],
        tags: ['log-analytics', 'kql', 'monitoring', 'logs', 'queries'],

        targetPersonas: ['DevOps Engineer', 'SRE', 'Security Engineer', 'Platform Engineer', 'IT Operations']
      },

      // ===== AZURE APPLICATION INSIGHTS =====
      {
        name: 'azure-application-insights',
        officialName: 'Azure Application Insights',
        category: 'management',
        subcategory: 'Application Performance Monitoring (APM)',
        shortDescription: 'Application performance monitoring (APM) service helping developers monitor live applications, detect anomalies, diagnose issues. Real-time monitoring, user behavior insights, powerful analytics.',
        fullDescription: `Azure Application Insights est un Application Performance Monitoring (APM) service qui helps developers monitor live applications, detect anomalies, diagnose issues, et improve performance.

Part of Azure Monitor platform, providing deep insights into:
- **Performance** - Page load times, response times, failed requests
- **Availability** - Uptime monitoring, synthetic tests
- **Usage** - User behavior, session tracking, custom events
- **Exceptions** - Automatic exception tracking, stack traces

Supports .NET, Java, Node.js, Python, and more. Automatic instrumentation for Azure services (App Service, Functions, VMs, AKS).`,

        keyFeatures: [
          "Real-time Monitoring - Track application performance, dependencies, failures in real-time",
          "Automatic Instrumentation - Works with App Service, Functions, VMs, AKS out-of-the-box",
          "Powerful Analytics - Query data avec Kusto Query Language (KQL), log analytics",
          "Alerts & Notifications - Smart alerts for high response times, CPU, memory spikes",
          "User Behavior Insights - Analyze user patterns, session tracking, user engagement",
          "Distributed Tracing - Track requests across microservices",
          "Availability Monitoring - Synthetic tests, ping tests from multiple locations worldwide",
          "Exception Tracking - Automatic exception capture avec stack traces",
          "Dependency Mapping - Visualize dependencies (SQL, Redis, APIs, etc.)",
          "Performance Profiling - Live profiler pour .NET applications",
          "Integration with Azure DevOps - Track deployments, correlate performance avec releases",
          "Custom Events & Metrics - Track business KPIs, custom telemetry"
        ],

        benefits: [
          "Proactive Issue Detection - Detect performance degradation before users complain",
          "Fast Root Cause Analysis - Distributed tracing, dependency maps, exception tracking",
          "Improved User Experience - Monitor page load times, optimize performance",
          "Business Insights - Track custom events, user behavior, business metrics",
          "DevOps Integration - Correlate deployments avec performance changes"
        ],

        useCases: [
          {
            title: "Web Application Monitoring - ASP.NET, Node.js",
            description: "Monitor page load times, failed HTTP requests, server response times pour web applications hosted in Azure App Service. Detect anomalies, optimize performance.",
            industries: ["Technology", "E-commerce", "SaaS"],
            businessImpact: "Page load times reduced 40%, user satisfaction +30%, revenue impact minimized"
          },
          {
            title: "Microservices Distributed Tracing",
            description: "Track requests across microservices architecture (AKS, Service Fabric). Visualize dependencies, identify bottlenecks, optimize inter-service communication.",
            industries: ["Technology", "SaaS", "Financial Services"],
            businessImpact: "Bottlenecks identified 10x faster, microservices performance optimized, MTTR reduced 60%"
          },
          {
            title: "Anomaly Detection - AI-Powered Alerts",
            description: "Detect web application performance anomalies automatically. AI-powered smart detection alerts pour abnormal response times, failure rates.",
            industries: ["E-commerce", "SaaS", "Media"],
            businessImpact: "Anomalies detected in real-time, incidents prevented, customer churn reduced"
          },
          {
            title: "User Behavior Analytics - Session Tracking",
            description: "Track user sessions, page views, custom events. Analyze user flows, identify drop-off points, optimize conversion funnels.",
            industries: ["E-commerce", "SaaS", "Media"],
            businessImpact: "Conversion rates +15-25%, user engagement improved, product insights enhanced"
          }
        ],

        targetIndustries: ['Technology', 'SaaS', 'E-commerce', 'Financial Services', 'Media', 'Healthcare', 'All'],

        pricingModel: 'Pay-per-GB data ingested',
        estimatedCost: 'First 5GB/month free. Then ~$2.30/GB. Data retention: First 90 days free, then ~$0.12/GB/month.',

        pricingTiers: [
          {
            tier: 'Free (5GB/month)',
            description: 'First 5GB/month per application free',
            pricing: '$0',
            bestFor: 'Small applications, dev/test, POCs'
          },
          {
            tier: 'Pay-As-You-Go',
            description: 'Pay per GB telemetry data ingested',
            pricing: '~$2.30/GB (varies by region)',
            bestFor: 'Production applications avec variable traffic'
          },
          {
            tier: 'Data retention (90+ days)',
            description: 'First 90 days free, then paid retention',
            pricing: '~$0.12/GB/month for data older than 90 days',
            bestFor: 'Long-term analysis, compliance, historical data'
          }
        ],

        complexity: 'low',
        implementationTime: 'Hours (automatic for App Service, manual SDK integration for custom apps)',
        salesPriority: 9,
        isFeatured: true,

        integrations: ['Azure Monitor', 'Azure DevOps', 'Power BI', 'Grafana', 'Visual Studio', 'VS Code', 'Azure Pipelines', 'Logic Apps'],

        prerequisites: ['Azure subscription', 'Application Insights resource', 'Application running on Azure or on-premises'],

        idealCustomerSize: 'All (Startup to Enterprise)',

        documentationUrl: 'https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview',
        pricingUrl: 'https://azure.microsoft.com/en-us/pricing/details/monitor/',

        keywords: ['application insights', 'apm', 'application performance monitoring', 'distributed tracing', 'telemetry', 'monitoring', 'analytics', 'user behavior'],
        tags: ['apm', 'monitoring', 'performance', 'distributed-tracing', 'telemetry'],

        targetPersonas: ['Developer', 'DevOps Engineer', 'SRE', 'Product Manager', 'Engineering Manager', 'CTO']
      }
    ];

    // Insert each solution
    for (const solutionData of solutions) {
      try {
        const existing = await prisma.azureSolution.findUnique({
          where: { name: solutionData.name }
        });

        if (existing) {
          await prisma.azureSolution.update({
            where: { name: solutionData.name },
            data: solutionData
          });
          console.log(`✅ Updated: ${solutionData.officialName}`);
        } else {
          await prisma.azureSolution.create({
            data: solutionData
          });
          console.log(`✅ Created: ${solutionData.officialName}`);
        }
      } catch (error) {
        console.error(`❌ Error with ${solutionData.officialName}:`, error.message);
      }
    }

    console.log('\n✅ Azure Monitoring tools added successfully!');

  } catch (error) {
    console.error('Error adding Azure monitoring tools:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAzureMonitoringTools();
