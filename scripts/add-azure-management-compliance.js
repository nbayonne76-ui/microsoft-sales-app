/**
 * Script pour ajouter Management, Compliance, Analytics, Security services
 * Azure Tags, HDInsight, Synapse, Trust Center, Defender Identity, RBAC
 * Exécuter avec: node scripts/add-azure-management-compliance.js
 */

const managementComplianceSolutions = [

  // 1. AZURE TAGS
  {
    name: "azure-tags",
    officialName: "Azure Tags",
    category: "management",
    subcategory: "resource-organization",
    shortDescription: "Add metadata to Azure resources in form of key-value pairs to organize, manage, track resources for billing, reporting, automation, et governance purposes.",
    fullDescription: "Azure Tags allow you to add metadata to your Azure resources in the form of key-value pairs. These tags help you organize, manage, and track resources for billing, reporting, automation, and governance purposes. Key benefits: (1) Resource Organization - categorize resources by environment (Development, Testing, Production), department, or project, simplify management and searching resources across subscriptions; (2) Cost Management & Reporting - track resource usage and costs based on tags, generate reports allocate expenses across business units or projects; (3) Governance & Automation - enforce tagging policies using Azure Policy, require specific tags on resource creation, automate resource management tasks (shutdown, scaling) based on tags. How to use: (1) Tagging in Azure Portal - when creating/updating resource, navigate Tags section, enter key-value pairs (e.g., Key: Environment, Value: Production) and save; (2) Tagging via Azure CLI - use commands like 'az resource tag --tags Environment=Production Department=Finance --resource-id <resource-id>'; (3) Tagging with PowerShell - 'Set-AzResource -ResourceId \"<resource-id>\" -Tag @{ Environment=\"Production\"; Department=\"Finance\" } -Force'; (4) Enforcing Tag Policies - use Azure Policy to require specific tags on resource creation, ensure consistent tagging across organization. Best practices: standardize tag names (define consistent naming convention avoid duplication/confusion), keep tags relevant (use tags provide actionable insights: cost center, application owner, project), regularly review tags (audit tag usage ensure accuracy, compliance with governance policies).",
    keyFeatures: [
      "Resource Organization - Categorize resources by environment (Dev, Test, Prod), department, project",
      "Cost Management & Reporting - Track usage, costs based tags, generate reports allocate expenses business units",
      "Governance & Automation - Enforce tagging policies Azure Policy, automate management tasks (shutdown, scaling) based tags",
      "Tagging Methods - Azure Portal, Azure CLI, PowerShell, ARM templates, Infrastructure as Code",
      "Policy Enforcement - Require specific tags resource creation via Azure Policy",
      "Billing Integration - Tag-based cost allocation, chargeback reports",
      "Search & Filter - Find resources quickly by tags across subscriptions",
      "Resource Grouping - Logical grouping resources beyond resource groups",
      "Automation Triggers - Automate actions based tag values (e.g., auto-shutdown Dev resources evenings)",
      "Compliance Tracking - Track resources compliance organizational standards via tags"
    ],
    benefits: [
      "Improved Organization - Logical resource categorization vs scattered resources difficult manage",
      "Cost Transparency - Clear visibility costs per department, project, environment",
      "Simplified Billing - Chargeback reports based tags vs manual cost allocation",
      "Governance Enforcement - Policies ensure consistent tagging vs voluntary tagging ignored",
      "Automation Simplified - Tag-based automation (shutdown non-prod resources) saves costs",
      "Faster Resource Discovery - Search resources by tags vs manual browsing"
    ],
    useCases: [
      {
        title: "Cost Management (Department-wise Billing)",
        description: "Tag resources with 'Department' to track costs per business unit, generate chargeback reports allocate expenses accurately.",
        industries: ["All - Enterprise"],
        businessImpact: "Cost transparency improved, accurate chargeback, budget accountability enforced, cost optimization identified"
      },
      {
        title: "Environment Management (Dev/Test/Prod)",
        description: "Tag resources 'Environment' (Dev, Test, Prod) to manage lifecycles, automate shutdown non-production resources save costs.",
        industries: ["All"],
        businessImpact: "Infrastructure costs reduced 30-40%, resource management simplified, environment isolation maintained"
      },
      {
        title: "Project Tracking",
        description: "Tag resources 'Project' to track resources associated specific initiatives, calculate project costs accurately.",
        industries: ["Consulting", "Technology", "Professional Services"],
        businessImpact: "Project profitability visibility, accurate client billing, resource allocation optimized"
      },
      {
        title: "Compliance & Governance",
        description: "Enforce tagging policies ensure all resources tagged 'CostCenter', 'Owner', 'DataClassification' for compliance.",
        industries: ["Finance", "Healthcare", "Government"],
        businessImpact: "Compliance requirements met, audit trails complete, governance standards enforced"
      }
    ],
    targetIndustries: ["All"],
    idealCustomerSize: "All",
    targetPersonas: ["Cloud Architect", "FinOps Manager", "IT Manager", "DevOps Engineer", "Governance Lead"],
    pricingModel: "free",
    pricingTiers: [
      {
        tier: "Azure Tags",
        description: "Tagging service",
        pricing: "FREE - No charge for using tags",
        bestFor: "All Azure users - essential resource organization tool"
      }
    ],
    estimatedCost: "FREE",
    implementationTime: "1-2 days",
    complexity: "low",
    prerequisites: [
      "Azure subscription",
      "Tagging strategy defined (tag names, values, standards)",
      "Azure Policy configured (if enforcing tags)",
      "User permissions (Contributor or Owner roles)"
    ],
    integrations: [
      "Azure Policy (tag enforcement)",
      "Azure Cost Management (cost reporting by tags)",
      "Azure Resource Manager (tagging via ARM templates)",
      "Azure Automation (tag-based automation runbooks)",
      "Azure DevOps (tagging in pipelines)",
      "Terraform (tagging in IaC)",
      "PowerShell, Azure CLI (scripting)"
    ],
    competitorComparison: [
      {
        competitor: "AWS Resource Tags",
        ourAdvantages: [
          "Azure Policy enforcement stricter (required tags enforced creation)",
          "Cost Management integration native (AWS requires Cost Allocation Tags setup)",
          "Simpler governance (Azure Policy built-in vs AWS Config rules)"
        ],
        theirWeaknesses: [
          "AWS Cost Allocation Tags require manual activation",
          "Tag enforcement via AWS Config more complex"
        ]
      }
    ],
    salesPriority: 6,
    isActive: true,
    isFeatured: false,
    keywords: [
      "azure tags",
      "resource tagging",
      "cost management",
      "resource organization",
      "billing",
      "governance",
      "metadata"
    ],
    tags: ["Management", "Resource-Organization", "Cost-Management", "Governance"],
    relatedSolutions: ["azure-policy", "azure-cost-management", "azure-resource-manager"],
    technicalSpecs: {
      maxTagsPerResource: "50 tags per resource",
      tagNameMaxLength: "512 characters",
      tagValueMaxLength: "256 characters",
      supportedResources: "Most Azure resources support tags",
      tagApplication: ["Azure Portal", "Azure CLI", "PowerShell", "ARM templates", "Terraform"]
    },
    securityFeatures: [
      "RBAC integration (permissions required to tag)",
      "Azure Policy enforcement",
      "Audit logging (Azure Activity Log)",
      "Tag-based access control (conditional access based tags)"
    ],
    complianceCerts: ["N/A - Management feature"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/azure-resource-manager/",
    demoUrl: "https://azure.microsoft.com/en-us/get-started/azure-portal"
  },

  // 2. AZURE HDINSIGHT
  {
    name: "azure-hdinsight",
    officialName: "Azure HDInsight",
    category: "analytics",
    subcategory: "big-data-hadoop",
    shortDescription: "Fully managed, cloud-based service makes it easy process large volumes data using popular open-source frameworks (Apache Hadoop, Spark, Hive, Kafka, HBase) quick set up, scale clusters for big data analytics, machine learning, real-time processing.",
    fullDescription: "Azure HDInsight est un fully managed, cloud-based service qui makes it easy to process large volumes of data using popular open-source frameworks. Enables you to quickly set up and scale clusters for big data analytics, machine learning, and real-time processing. Key features: (1) Managed Open-Source Analytics - supports frameworks Apache Hadoop, Spark, Hive, Kafka, HBase, and more, simplifies setup, management, monitoring big data clusters without overhead managing underlying infrastructure; (2) Scalability & Flexibility - scale clusters up/down on-demand meet changing data processing needs, supports both batch and real-time analytics; (3) Integration Azure Services - seamlessly integrates Azure Data Lake Storage, Azure SQL Data Warehouse (Synapse Analytics), Power BI, other Azure data services, leverage Azure's security, monitoring, management tools gain end-to-end visibility; (4) Enterprise-Grade Security - built-in security features integration Azure Active Directory (Azure AD), role-based access control (RBAC), data encryption at rest/in transit, supports compliance industry standards, regulatory requirements; (5) Cost Optimization - pay-as-you-go pricing, ability resize clusters help optimize costs, cluster autoscaling, automated shutdown reduce expenses clusters not in use. Common use cases: (1) Big Data Processing & Analytics - analyze massive data sets Hadoop, Spark tasks data transformation, mining, advanced analytics; (2) Real-Time Stream Processing - Kafka, Spark Streaming process, analyze real-time data IoT devices, social media, operational systems; (3) Machine Learning & Advanced Analytics - Spark MLlib, other libraries build, deploy machine learning models large datasets; (4) Data Warehousing & Reporting - integrate data warehousing solutions Azure Synapse Analytics build comprehensive BI, reporting systems. Cost optimization: pay-as-you-go pricing, ability resize clusters help optimize costs, offers cluster autoscaling, automated shutdown reduce expenses when clusters not in use.",
    keyFeatures: [
      "Managed Open-Source Analytics - Apache Hadoop, Spark, Hive, Kafka, HBase frameworks managed",
      "Scalability & Flexibility - Scale clusters up/down on-demand, supports batch, real-time analytics",
      "Integration Azure Services - Seamless Azure Data Lake Storage, Synapse Analytics, Power BI integration",
      "Enterprise-Grade Security - Azure AD integration, RBAC, encryption at-rest/in-transit",
      "Cost Optimization - Pay-as-you-go, cluster autoscaling, automated shutdown reduce costs",
      "Multiple Cluster Types - Hadoop, Spark, Interactive Query (Hive LLAP), Kafka, HBase, Storm",
      "Jupyter/Zeppelin Notebooks - Interactive data exploration, analysis",
      "Apache Hive - SQL-based querying for data warehousing",
      "Spark for Advanced Analytics - Machine learning, graph processing, streaming",
      "Kafka Streaming - Real-time data ingestion, processing",
      "Integration Azure Monitor - Track cluster performance, resource usage",
      "Custom Scripts - Run custom initialization scripts cluster setup"
    ],
    benefits: [
      "Simplified Management - Fully managed clusters vs self-hosted Hadoop complex infrastructure",
      "Cost-Effective - Pay-per-use, auto-scaling vs always-on clusters expensive",
      "Rapid Deployment - Clusters minutes vs days/weeks on-premises setup",
      "Enterprise Security - Built-in Azure AD, RBAC, encryption vs manual security configuration",
      "Seamless Integration - Native Azure services connection vs complex ETL pipelines",
      "Scalability On-Demand - Scale workloads without capacity planning"
    ],
    useCases: [
      {
        title: "Big Data Processing & Analytics",
        description: "Analyze massive datasets Hadoop, Spark pour data transformation, data mining, advanced analytics tasks.",
        industries: ["All"],
        businessImpact: "Insights from petabytes data, processing time reduced 10x, data-driven decisions enabled"
      },
      {
        title: "Real-Time Stream Processing",
        description: "Use Kafka, Spark Streaming process, analyze real-time data from IoT devices, social media, operational systems.",
        industries: ["IoT", "Telecommunications", "E-commerce"],
        businessImpact: "Real-time visibility operations, instant anomaly detection, immediate responses events"
      },
      {
        title: "Machine Learning & Advanced Analytics",
        description: "Leverage Spark MLlib build, deploy ML models on large datasets for predictive analytics.",
        industries: ["Finance", "Healthcare", "Retail"],
        businessImpact: "Predictive models accurate, fraud detection improved, personalization at scale"
      },
      {
        title: "Data Warehousing & Reporting",
        description: "Integrate avec Azure Synapse Analytics build comprehensive BI, reporting systems using Hive.",
        industries: ["All - Enterprise"],
        businessImpact: "Unified data warehouse, reporting comprehensive, business intelligence actionable"
      }
    ],
    targetIndustries: ["All", "Technology", "Finance", "Healthcare", "Retail", "IoT"],
    idealCustomerSize: "SME, Enterprise",
    targetPersonas: ["Data Engineer", "Data Scientist", "Big Data Architect", "Analytics Manager"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Cluster Compute (VMs)",
        description: "Pay for VM instances running in cluster",
        pricing: "Variable: D3 v2 VMs: €0.20/hour, D12 v2: €0.80/hour, varies by VM type, region",
        bestFor: "All workloads - pay only cluster running time"
      },
      {
        tier: "Storage (Azure Storage/Data Lake)",
        description: "Data storage costs separate",
        pricing: "Azure Blob: €0.018/GB/month, Data Lake: €0.024/GB/month",
        bestFor: "Data persistence beyond cluster lifecycle"
      },
      {
        tier: "Cluster Types",
        description: "Different cluster types (Hadoop, Spark, Kafka, HBase) same pricing model",
        pricing: "Based on node count, VM types selected",
        bestFor: "Choose cluster type based workload (batch: Hadoop, real-time: Kafka)"
      }
    ],
    estimatedCost: "Small cluster (4 nodes, 8h/day): €200-400/mois, Medium (10 nodes, 16h/day): €800-1500/mois, Large (20+ nodes): €2000+/mois",
    implementationTime: "1-2 semaines",
    complexity: "medium-high",
    prerequisites: [
      "Azure Storage or Data Lake Storage account",
      "HDInsight cluster type defined (Hadoop, Spark, Kafka, etc.)",
      "Data ingestion plan (batch or streaming)",
      "Knowledge frameworks (Hadoop, Spark, Hive, Kafka depending workload)"
    ],
    integrations: [
      "Azure Data Lake Storage",
      "Azure Blob Storage",
      "Azure SQL Data Warehouse (Synapse Analytics)",
      "Power BI (visualizations)",
      "Azure Data Factory (orchestration)",
      "Azure Machine Learning",
      "Azure Event Hubs (streaming)",
      "Apache Kafka (streaming)",
      "Azure Monitor (monitoring)",
      "Azure Active Directory (authentication)"
    ],
    competitorComparison: [
      {
        competitor: "AWS EMR (Elastic MapReduce)",
        ourAdvantages: [
          "Better Azure ecosystem integration (Data Lake, Synapse, Power BI)",
          "Simpler cluster management (Azure Portal intuitive vs EMR console)",
          "Native Azure AD integration (vs AWS IAM complex setup)"
        ],
        theirWeaknesses: [
          "EMR cluster management more complex",
          "Less native integration AWS analytics services"
        ]
      },
      {
        competitor: "Databricks",
        ourAdvantages: [
          "More framework options (Hadoop, Kafka, HBase) vs Databricks Spark-only",
          "Lower cost (pay VM costs vs Databricks markup)",
          "Native Azure service (vs third-party Databricks)"
        ],
        theirWeaknesses: [
          "Databricks Spark-focused only (no Hadoop, Kafka, HBase)",
          "Higher pricing (Databricks adds markup on VMs)"
        ]
      }
    ],
    salesPriority: 6,
    isActive: true,
    isFeatured: false,
    keywords: [
      "hdinsight",
      "hadoop",
      "spark",
      "kafka",
      "hbase",
      "hive",
      "big data",
      "analytics",
      "streaming"
    ],
    tags: ["Analytics", "Big-Data", "Hadoop", "Spark", "Kafka", "Streaming"],
    relatedSolutions: ["azure-data-lake-storage", "azure-synapse-analytics", "azure-databricks", "power-bi"],
    technicalSpecs: {
      supportedFrameworks: ["Apache Hadoop", "Apache Spark", "Apache Hive", "Apache Kafka", "Apache HBase", "Apache Storm", "Interactive Query (Hive LLAP)"],
      clusterTypes: ["Hadoop", "Spark", "Interactive Query", "Kafka", "HBase", "Storm", "ML Services"],
      programmingLanguages: ["Java", "Scala", "Python", "R", "SQL", "Hive QL"],
      notebookSupport: ["Jupyter", "Zeppelin"]
    },
    securityFeatures: [
      "Azure AD authentication",
      "RBAC granulaire",
      "Encryption at-rest (Azure Storage, Data Lake)",
      "Encryption in-transit (TLS)",
      "VNet integration",
      "Enterprise Security Package (ESP) - domain-joined clusters",
      "Audit logging (Azure Monitor)",
      "Compliance: ISO 27001, SOC 2, HIPAA"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/hdinsight/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/hdinsight/",
    demoUrl: "https://azure.microsoft.com/en-us/products/hdinsight"
  }

];

// Fonction principale
async function main() {
  console.log(`🚀 Adding ${managementComplianceSolutions.length} management, compliance, analytics solutions...\n`);
  console.log(`📋 Solutions à ajouter:`);
  managementComplianceSolutions.forEach((sol, idx) => {
    console.log(`   ${idx + 1}. ${sol.officialName} (${sol.category} - ${sol.subcategory})`);
  });
  console.log('');

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (const solution of managementComplianceSolutions) {
    try {
      console.log(`\n📝 Adding: ${solution.officialName}...`);

      const response = await fetch('http://localhost:3000/api/azure-solutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(solution)
      });

      const result = await response.json();

      if (result.success) {
        successCount++;
        console.log(`   ✅ SUCCESS - ${solution.officialName}`);
        console.log(`      ID: ${result.solution.id}`);
        console.log(`      Category: ${result.solution.category}`);
        console.log(`      Subcategory: ${result.solution.subcategory}`);
        console.log(`      Priority: ${result.solution.salesPriority}/10`);
      } else {
        failCount++;
        console.log(`   ❌ FAILED - ${solution.officialName}`);
        console.log(`      Error: ${result.error}`);
        errors.push({ solution: solution.officialName, error: result.error });
      }
    } catch (error) {
      failCount++;
      console.log(`   ❌ FAILED - ${solution.officialName}`);
      console.log(`      Error: ${error.message}`);
      errors.push({ solution: solution.officialName, error: error.message });
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n\n${'='.repeat(80)}`);
  console.log(`📊 SUMMARY:`);
  console.log(`   ✅ Success: ${successCount}/${managementComplianceSolutions.length}`);
  console.log(`   ❌ Failed: ${failCount}/${managementComplianceSolutions.length}`);

  if (errors.length > 0) {
    console.log(`\n❌ Errors:`);
    errors.forEach(err => {
      console.log(`   - ${err.solution}: ${err.error}`);
    });
  }

  console.log(`\n✨ Management & compliance solutions added!`);
  console.log(`\n🌐 Visit http://localhost:3000/azure-knowledge`);
}

main();
