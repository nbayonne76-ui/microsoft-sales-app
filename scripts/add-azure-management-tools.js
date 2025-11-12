const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addAzureManagementTools() {
  try {
    console.log('Adding Azure Management & Governance tools to knowledge base...');

    const solutions = [
      // ===== AZURE RESERVATIONS =====
      {
        name: 'azure-reservations',
        officialName: 'Azure Reservations',
        category: 'management',
        subcategory: 'Cost Optimization',
        shortDescription: 'Cost-saving program pour pre-pay Azure resources avec commitment 1 ou 3 ans. Up to 72% discount vs pay-as-you-go sur compute, database, et autres services.',
        fullDescription: `Azure Reservations est un programme cost-saving qui permet pre-pay pour Azure resources via commitment 1-year ou 3-year term. Significant discounts vs pay-as-you-go pricing pour many Azure services.

Commitment-based pricing avec flexibility to exchange or cancel reservations if needs change. Apply discounts across different resource sizes or regions in some cases.

Integration avec Azure Cost Management pour track reserved instance usage et savings directly from Azure portal. Gain insights on cost optimization et reserved instance utilization.`,

        keyFeatures: [
          "Up to 72% discount - Sur compute, database, et autres resource costs vs on-demand pricing",
          "Commitment-based pricing - Reserve capacity pour specific services (VMs, SQL DB, Cosmos DB, Azure Cache for Redis)",
          "1-year ou 3-year terms - Choose commitment term selon business needs",
          "Flexibility & Exchange - Exchange ou cancel reservations if needs change",
          "Apply discounts across sizes/regions - In some cases, discounts apply to different configurations",
          "Azure Cost Management integration - Track et manage reserved instance usage directly from portal",
          "Cost optimization insights - Gain insights on reserved instance utilization et savings",
          "Scope options - Shared, single subscription, ou resource group scope",
          "Automatic renewal - Option to auto-renew reservations",
          "Regional flexibility - Some reservations can be moved between regions"
        ],

        benefits: [
          "Significant cost savings - Commit to long-term usage, reduce overall spend vs pay-as-you-go",
          "Predictable budgeting - Pre-paid, fixed-cost pricing pour better IT budget planning",
          "Simplified management - View et manage reservations through Azure portal",
          "Scalable & flexible - Exchange ou cancel if requirements change, not locked into configuration"
        ],

        useCases: [
          {
            title: "Enterprise Workloads - Production Capacity",
            description: "Organizations running production workloads requiring consistent, long-term capacity (web apps, databases, analytics platforms). Reserve VMs, SQL DB pour predictable savings.",
            industries: ["Enterprise", "All"],
            businessImpact: "Cost reduction 40-72%, budget predictability improved, long-term capacity guaranteed"
          },
          {
            title: "Cost Optimization - Always-On Resources",
            description: "Businesses looking to optimize cloud spending by reducing cost of always-on resources (24/7 production systems). Reserve capacity pour VMs, databases.",
            industries: ["All"],
            businessImpact: "Cloud spend reduced significantly, CFO visibility improved, ROI on cloud increased"
          },
          {
            title: "Budget Predictability - Financial Planning",
            description: "Companies preferring predictable, fixed-cost pricing over variable on-demand charges. Helps financial planning avec pre-paid commitments.",
            industries: ["Finance", "Healthcare", "Government"],
            businessImpact: "Budget variance reduced, financial planning simplified, cost forecasting accurate"
          }
        ],

        targetIndustries: [
          'All Industries',
          'Enterprise',
          'Finance',
          'Healthcare',
          'Government',
          'Manufacturing',
          'Retail'
        ],

        pricingModel: 'Pre-paid commitment (1-year or 3-year)',
        estimatedCost: 'Varies by service. Example: VM reservation can save 40-72% vs pay-as-you-go',

        pricingTiers: [
          {
            tier: '1-Year Commitment',
            description: 'Reserve capacity for 1 year, lower discount than 3-year',
            pricing: 'Up to 40% discount vs pay-as-you-go',
            bestFor: 'Organizations with moderate commitment confidence, testing reservation benefits'
          },
          {
            tier: '3-Year Commitment',
            description: 'Reserve capacity for 3 years, maximum discount',
            pricing: 'Up to 72% discount vs pay-as-you-go',
            bestFor: 'Enterprises with long-term cloud strategy, maximum cost savings'
          }
        ],

        complexity: 'low',
        implementationTime: 'Immediate (purchase in Azure Portal)',
        salesPriority: 8,
        isFeatured: true,

        integrations: ['Azure Virtual Machines', 'Azure SQL Database', 'Azure Cosmos DB', 'Azure Cache for Redis', 'Azure App Service', 'Azure Cost Management'],

        prerequisites: ['Azure subscription', 'Understanding of long-term resource needs', 'Azure Cost Management access for tracking'],

        idealCustomerSize: 'SME to Enterprise',

        documentationUrl: 'https://docs.microsoft.com/en-us/azure/cost-management-billing/reservations/',
        pricingUrl: 'https://azure.microsoft.com/en-us/pricing/reservations/',

        keywords: ['azure reservations', 'reserved instances', 'cost savings', 'commitment pricing', 'cost optimization', 'reserved capacity', 'azure savings'],
        tags: ['cost-optimization', 'management', 'reservations', 'savings', 'commitment'],

        targetPersonas: ['CFO', 'Finance Director', 'IT Director', 'Cloud Architect', 'FinOps Manager']
      },

      // ===== AZURE ADVISOR =====
      {
        name: 'azure-advisor',
        officialName: 'Azure Advisor',
        category: 'management',
        subcategory: 'Cloud Optimization & Recommendations',
        shortDescription: 'Free, personalized cloud consultant analyzing Azure deployments. Provides tailored recommendations pour optimize cost, performance, high availability, et security.',
        fullDescription: `Azure Advisor est un free, personalized cloud consultant qui analyze votre Azure deployments et provides tailored recommendations to help optimize resources pour cost, performance, high availability, et security.

Advisor continuously analyzes resource configurations et usage patterns, providing actionable insights in 4 categories: Cost, Performance, High Availability, Security.

Integration avec Azure Security Center pour comprehensive threat protection. Review recommendations directly in Azure Portal, implement changes manually ou via automation tools.`,

        keyFeatures: [
          "Cost Optimization - Identify underutilized resources, rightsizing VMs, reserved instance recommendations",
          "Performance - Improve workload performance by optimizing resource configurations, scaling recommendations",
          "High Availability - Enhance system resiliency avec redundancy, disaster recovery, region distribution best practices",
          "Security - Identify vulnerabilities, enhance security posture, Azure Security Center integration",
          "Actionable recommendations - Detailed insights avec potential benefits, estimated savings",
          "Azure Portal integration - Review recommendations directly in portal",
          "Automation support - Implement changes manually ou integrate avec automation tools",
          "Continuous monitoring - Advisor analyzes configurations et usage patterns 24/7",
          "Dashboard integration - Consolidated view in Azure Monitor dashboard"
        ],

        benefits: [
          "Personalized insights - Tailored recommendations based on specific environment et usage patterns",
          "Improved efficiency - Data-driven decisions to optimize resource utilization",
          "Cost savings - Significantly reduce cloud spending by eliminating waste, optimizing reserved instances",
          "Enhanced security & resilience - Safeguard environment against threats, improve availability"
        ],

        useCases: [
          {
            title: "Cost Optimization - Reduce Cloud Spending",
            description: "Identify underutilized VMs, unused resources, rightsizing opportunities. Advisor recommends reserved instances, shutdown idle VMs, optimize storage.",
            industries: ["All"],
            businessImpact: "Cloud costs reduced 20-40%, waste eliminated, budget efficiency improved"
          },
          {
            title: "Performance Tuning - Optimize Workloads",
            description: "Improve application performance by following Advisor recommendations on VM sizing, database configurations, network optimization.",
            industries: ["Technology", "E-commerce", "SaaS"],
            businessImpact: "Application performance +30-50%, user experience improved, response times reduced"
          },
          {
            title: "Security Hardening - Vulnerability Management",
            description: "Identify security vulnerabilities, implement Azure Security Center recommendations, enhance compliance posture.",
            industries: ["Finance", "Healthcare", "Government"],
            businessImpact: "Security incidents reduced, compliance achieved, audit readiness improved"
          },
          {
            title: "High Availability - Disaster Recovery Planning",
            description: "Ensure proper redundancy, region distribution, backup configurations pour mission-critical workloads.",
            industries: ["Enterprise", "Finance", "Healthcare"],
            businessImpact: "Downtime reduced 90%+, business continuity ensured, SLA targets met"
          }
        ],

        targetIndustries: ['All Industries'],

        pricingModel: 'Free (included with Azure subscription)',
        estimatedCost: 'No additional cost',

        pricingTiers: [
          {
            tier: 'Free',
            description: 'Included with all Azure subscriptions at no additional cost',
            pricing: '$0 - Free',
            bestFor: 'All Azure customers'
          }
        ],

        complexity: 'low',
        implementationTime: 'Immediate (no setup required)',
        salesPriority: 9,
        isFeatured: true,

        integrations: ['Azure Monitor', 'Azure Security Center', 'Azure Cost Management', 'Azure Portal', 'Azure Automation'],

        prerequisites: ['Azure subscription', 'Resources deployed in Azure'],

        idealCustomerSize: 'All (Startup to Enterprise)',

        documentationUrl: 'https://docs.microsoft.com/en-us/azure/advisor/',

        keywords: ['azure advisor', 'cloud optimization', 'cost recommendations', 'performance tuning', 'security recommendations', 'best practices', 'azure optimization'],
        tags: ['optimization', 'recommendations', 'free', 'advisor', 'best-practices'],

        targetPersonas: ['Cloud Architect', 'IT Director', 'DevOps Engineer', 'Security Engineer', 'FinOps Manager', 'CTO']
      },

      // ===== AZURE COST MANAGEMENT =====
      {
        name: 'azure-cost-management',
        officialName: 'Azure Cost Management + Billing',
        category: 'management',
        subcategory: 'Cost Analysis & Budgeting',
        shortDescription: 'Free tool pour monitor, analyze, et optimize cloud spending. Insights into Azure usage et billing, reduce unnecessary costs via cost analysis, budgets, alerts.',
        fullDescription: `Azure Cost Management + Billing est un free tool qui helps monitor, analyze, et optimize cloud spending. Provides insights into Azure usage et billing, helps reduce unnecessary costs.

Works for Azure and AWS accounts (via Azure Cost Management + Billing integration).

Track real-time cloud expenses, breakdown costs by subscription/resource group/service/tags. Set budgets & alerts, generate spending reports, identify unused resources, use reserved instances (RI) pour lower prices.`,

        keyFeatures: [
          "Cost Monitoring - Track real-time cloud expenses, view current & past spending",
          "Budgeting & Alerts - Set spending limits, receive notifications when approaching/exceeding limits",
          "Cost Allocation - Break down costs by department, project, ou resource group",
          "Usage Analysis - Monitor usage trends & anomalies",
          "Spending Reports - Generate detailed cost reports",
          "Cost Optimization Recommendations - Identify unused resources, reserved instance opportunities",
          "Multi-cloud Support - Monitor Azure & AWS costs",
          "Integration with Power BI - Create custom cost analytics dashboards",
          "Forecasting & Reporting - Estimate future expenses based on past usage",
          "Export to Excel/Power BI - Export data for detailed analysis"
        ],

        benefits: [
          "Cost transparency - View costs associated to management groups, resource groups, individual resources",
          "Budget control - Set spending limits, receive alerts before overspending",
          "Waste elimination - Identify unused resources, delete them to reduce costs",
          "Reserved instances optimization - Maximize RI utilization, cost savings",
          "Financial planning - Forecast future costs, plan budgets accurately"
        ],

        useCases: [
          {
            title: "Cost Visibility - Chargeback & Showback",
            description: "Track costs by department, project, ou resource group. Implement chargeback models pour internal billing, cost allocation.",
            industries: ["Enterprise", "All"],
            businessImpact: "Cost accountability improved, departmental budgets tracked, internal billing automated"
          },
          {
            title: "Budget Management - Spending Control",
            description: "Set monthly budgets pour subscriptions, resource groups. Receive alerts when 80% budget consumed, prevent overspending.",
            industries: ["All"],
            businessImpact: "Budget overruns prevented, financial control improved, CFO visibility increased"
          },
          {
            title: "Cost Optimization - Waste Elimination",
            description: "Identify idle VMs, unattached disks, over-provisioned resources. Implement rightsizing recommendations, reserved instances.",
            industries: ["All"],
            businessImpact: "Cloud costs reduced 20-50%, waste eliminated, efficiency improved"
          },
          {
            title: "Multi-Cloud Cost Management",
            description: "Monitor Azure + AWS costs in single dashboard. Unified view of multi-cloud spending.",
            industries: ["Enterprise", "Technology"],
            businessImpact: "Multi-cloud visibility achieved, cost optimization across clouds, single pane of glass"
          }
        ],

        targetIndustries: ['All Industries'],

        pricingModel: 'Free (included with Azure subscription)',
        estimatedCost: 'No additional cost for Azure. AWS cost data ingestion free.',

        pricingTiers: [
          {
            tier: 'Free',
            description: 'Included with Azure EA, MCA, MPA subscriptions at no additional cost',
            pricing: '$0 - Free',
            bestFor: 'All Azure customers with Enterprise Agreement ou Customer Agreement'
          }
        ],

        complexity: 'low',
        implementationTime: 'Immediate (available in Azure Portal)',
        salesPriority: 9,
        isFeatured: true,

        integrations: ['Azure Portal', 'Power BI', 'Excel', 'Azure Advisor', 'Azure Monitor', 'AWS (for multi-cloud cost management)'],

        prerequisites: ['Azure Enterprise Agreement (EA), Microsoft Customer Agreement (MCA), ou Microsoft Partner Agreement (MPA) for full features', 'Azure subscription'],

        idealCustomerSize: 'All (Startup to Enterprise)',

        documentationUrl: 'https://docs.microsoft.com/en-us/azure/cost-management-billing/',

        keywords: ['azure cost management', 'cost analysis', 'budgeting', 'billing', 'cost optimization', 'spending reports', 'cloud costs', 'finops'],
        tags: ['cost-management', 'billing', 'budgets', 'optimization', 'finops'],

        targetPersonas: ['CFO', 'Finance Director', 'FinOps Manager', 'IT Director', 'Cloud Architect', 'Controller']
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

    console.log('\n✅ Azure Management & Governance tools added successfully!');

  } catch (error) {
    console.error('Error adding Azure management tools:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAzureManagementTools();
