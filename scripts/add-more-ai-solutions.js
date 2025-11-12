/**
 * Script pour ajouter Azure Bot Service et Azure Databricks
 * Exécuter avec: node scripts/add-more-ai-solutions.js
 */

const moreAISolutions = [
  // 1. Azure Bot Service
  {
    name: "azure-bot-service",
    officialName: "Azure Bot Service",
    category: "ai-ml",
    subcategory: "conversational-ai",
    shortDescription: "Service fully managed pour créer, déployer et gérer des chatbots intelligents conversationnels avec LUIS, QnA Maker, et integration multi-canaux (Teams, Slack, Web).",
    fullDescription: "Azure Bot Service est une plateforme pour créer, tester, déployer et gérer des bots intelligents conversationnels. Basé sur Bot Framework SDK (C#, Python, JavaScript), support templates pré-built (FAQ bot, enterprise bot) et integration native avec Azure Cognitive Services (LUIS pour NLU, QnA Maker pour Q&A, Speech Services). Deployment multi-canal automatique: Microsoft Teams, Slack, Facebook Messenger, Web Chat, Skype, Email, Twilio SMS. Scalability automatique, monitoring Azure Monitor, et analytics conversations intégrés. Idéal pour: customer service bots, IT helpdesk automation, FAQ bots, booking/ordering bots, et virtual assistants enterprise. Free tier disponible (10K messages/mois) puis pay-per-message ultra-économique.",
    keyFeatures: [
      "Bot Framework SDK - Development C#, Python, JavaScript, Java",
      "Pre-built Templates - FAQ bot, Enterprise bot, Basic bot templates",
      "LUIS Integration - Natural Language Understanding pour intent extraction",
      "QnA Maker Integration - FAQ knowledge bases pour Q&A automatique",
      "Adaptive Dialogs - Conversation flows flexibles context-aware",
      "Multi-Channel Deployment - Teams, Slack, Facebook, Web, SMS, Email (18+ channels)",
      "Bot Composer - Visual authoring tool low-code pour conversation design",
      "Speech Integration - Speech-to-Text et Text-to-Speech native",
      "Authentication - OAuth support pour user authentication",
      "Proactive Messaging - Bots peuvent initier conversations",
      "Analytics - Conversation insights, user engagement metrics",
      "Testing Tools - Bot Framework Emulator pour local testing",
      "Continuous Deployment - CI/CD avec Azure DevOps, GitHub Actions",
      "Compliance - GDPR compliant, data encryption, security"
    ],
    benefits: [
      "Free tier généreux - 10,000 messages/mois gratuit (Standard tier)",
      "Multi-canal instant - Deploy 18+ channels avec code unique",
      "Low-code options - Bot Composer pour visual authoring",
      "Enterprise-ready - Scalability, security, compliance built-in",
      "AI-powered - LUIS + QnA Maker + Speech integration native",
      "Rapid development - Templates et SDK accélèrent time-to-market 80%"
    ],
    useCases: [
      {
        title: "Customer Service Automation",
        description: "FAQ bots pour répondre questions courantes customers 24/7 avec escalation human agent si nécessaire.",
        industries: ["E-commerce", "Banking", "Telecommunications", "Insurance"],
        businessImpact: "Réduction coûts support 60%, déflection rate 70%, satisfaction client +30%"
      },
      {
        title: "IT Helpdesk Automation",
        description: "Bots Microsoft Teams pour password resets, ticket creation, status checks, common IT issues.",
        industries: ["All"],
        businessImpact: "Résolution L1 tickets automatique 80%, IT team focus high-value tasks"
      },
      {
        title: "Booking & Ordering Bots",
        description: "Réservations restaurants, appointments médicaux, commandes produits via conversation naturelle.",
        industries: ["Hospitality", "Healthcare", "Retail"],
        businessImpact: "Conversions +25%, disponibilité 24/7, expérience utilisateur améliorée"
      },
      {
        title: "Employee Onboarding Assistant",
        description: "Virtual assistant Teams pour nouveaux employés: HR policies, benefits, training scheduling.",
        industries: ["All"],
        businessImpact: "Onboarding time réduit 40%, self-service employees, HR efficiency"
      }
    ],
    targetIndustries: ["All", "E-commerce", "Banking", "Healthcare", "Telecommunications", "IT Services"],
    idealCustomerSize: "All",
    targetPersonas: ["Developer", "Product Manager", "Customer Service Manager", "IT Manager", "CTO"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Free (F0)",
        description: "Development et testing",
        pricing: "GRATUIT - Unlimited messages (non-production uniquement)",
        bestFor: "Development, testing, POC"
      },
      {
        tier: "Standard (S1)",
        description: "Production deployment",
        pricing: "10,000 messages/mois GRATUIT, puis $0.50 per 1,000 messages supplémentaires",
        bestFor: "Production bots - très économique pour most workloads"
      },
      {
        tier: "Premium Channels",
        description: "Canaux premium (Teams, Facebook, Slack, etc.)",
        pricing: "Inclus dans Standard tier - pas de frais supplémentaires channels",
        bestFor: "Multi-channel deployment"
      }
    ],
    estimatedCost: "Free tier dev, Production <10K msgs: €0/mois, 50K msgs: €18/mois (ultra-économique)",
    implementationTime: "2 jours à 2 semaines",
    complexity: "medium",
    prerequisites: [
      "Bot Framework SDK installed (ou Bot Composer pour visual authoring)",
      "LUIS app créé si natural language understanding nécessaire",
      "QnA Maker knowledge base si FAQ bot",
      "Azure subscription"
    ],
    integrations: [
      "Microsoft Teams",
      "Slack",
      "Facebook Messenger",
      "Web Chat (embed sites)",
      "Skype",
      "Email",
      "Twilio (SMS)",
      "Azure LUIS",
      "Azure QnA Maker (retiring Oct 2025 - migrate to Language Service)",
      "Azure Cognitive Services Speech",
      "Azure Functions (custom logic)",
      "Power Virtual Agents (low-code alternative)",
      "Azure Active Directory (authentication)"
    ],
    competitorComparison: [
      {
        competitor: "AWS Lex",
        ourAdvantages: [
          "Free tier plus généreux (10K msgs vs AWS Lex $4/1K requests)",
          "Multi-channel deployment 18+ channels (Lex limited channels)",
          "Bot Composer visual authoring (Lex code-first primarily)",
          "Teams integration native (AWS Lex Teams complex setup)"
        ],
        theirWeaknesses: [
          "AWS Lex pas de free tier production",
          "Channels limités vs Azure 18+",
          "Visual authoring moins mature"
        ]
      },
      {
        competitor: "Google Dialogflow",
        ourAdvantages: [
          "Standard tier 10K msgs gratuit (Dialogflow ES free edition limited features)",
          "LUIS NLU integration seamless",
          "Microsoft ecosystem (Teams, Office, Power Platform)",
          "Bot Framework SDK plus mature"
        ],
        theirWeaknesses: [
          "Dialogflow free tier features limitées",
          "Moins d'integration Microsoft tools",
          "Teams deployment complexe"
        ]
      }
    ],
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: [
      "bot service",
      "chatbot",
      "conversational ai",
      "luis",
      "qna maker",
      "bot framework",
      "teams bot",
      "virtual assistant"
    ],
    tags: ["AI-ML", "Chatbot", "Conversational-AI", "Multi-Channel", "Enterprise"],
    relatedSolutions: ["azure-cognitive-services", "azure-openai-service", "power-virtual-agents"],
    technicalSpecs: {
      supportedLanguages: ["C#", "Python", "JavaScript", "Java"],
      supportedChannels: [
        "Microsoft Teams",
        "Slack",
        "Facebook Messenger",
        "Web Chat",
        "Skype",
        "Email",
        "Twilio SMS",
        "Telegram",
        "Kik",
        "LINE",
        "GroupMe",
        "Direct Line (custom)",
        "18+ total channels"
      ],
      botFrameworkVersion: "v4 SDK",
      visualAuthoring: "Bot Composer (low-code)"
    },
    securityFeatures: [
      "Azure AD authentication",
      "OAuth 2.0 support",
      "Encryption at-rest et in-transit",
      "GDPR compliant",
      "PII data handling",
      "Secure channel connections",
      "API key management",
      "Audit logging Azure Monitor"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "GDPR"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/bot-service/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/bot-services/",
    demoUrl: "https://azure.microsoft.com/en-us/products/ai-services/ai-bot-service/"
  },

  // 2. Azure Databricks
  {
    name: "azure-databricks",
    officialName: "Azure Databricks",
    category: "ai-ml",
    subcategory: "big-data-analytics",
    shortDescription: "Plateforme data analytics unifiée Apache Spark optimisée pour big data processing, machine learning (MLflow), et collaboration data science avec notebooks interactifs.",
    fullDescription: "Azure Databricks est une plateforme data analytics collaborative basée sur Apache Spark, développée par creators d'Apache Spark en partenariat avec Microsoft. Combine data engineering (ETL pipelines), data science (ML notebooks), et business intelligence dans workspace unifié. Features clés: Spark optimized (3-5x faster vs open-source), Delta Lake pour data lakehouse architecture, MLflow pour ML lifecycle management, AutoML pour rapid model development, Unity Catalog pour data governance. Support notebooks interactifs (Python, Scala, SQL, R) avec collaboration temps réel. Scalability automatique clusters Spark, integration native Azure (Data Lake, Synapse, Azure ML). Idéal pour: big data ETL, streaming analytics, machine learning at scale, data lake analytics.",
    keyFeatures: [
      "Apache Spark Optimized - 3-5x performance vs open-source Spark, auto-optimization",
      "Delta Lake - ACID transactions sur data lakes, time travel, schema enforcement",
      "Interactive Notebooks - Python, Scala, SQL, R avec collaboration temps réel",
      "MLflow Integration - ML experiment tracking, model registry, deployment",
      "AutoML - Automated model selection et hyperparameter tuning",
      "Unity Catalog - Data governance unified: access control, lineage, discovery",
      "Photon Engine - C++ vectorized query engine 12x faster SQL queries",
      "Auto-Scaling Clusters - Clusters Spark scaling automatique selon workload",
      "Job Scheduling - Orchestration workflows data pipelines",
      "Streaming Analytics - Real-time data processing avec Structured Streaming",
      "SQL Analytics - Serverless SQL queries pour BI analysts (Databricks SQL)",
      "Git Integration - Version control notebooks avec GitHub, Azure DevOps",
      "RBAC & Security - Role-based access control, encryption, VNet integration",
      "Azure Integration - Native Data Lake, Synapse, Event Hubs, IoT Hub, Power BI"
    ],
    benefits: [
      "Unified platform - Data engineering + data science + BI sur même plateforme",
      "Spark performance - 3-5x faster vs vanilla Spark, coûts compute réduits",
      "Collaboration - Teams travaillent ensemble notebooks partagés temps réel",
      "MLflow built-in - ML lifecycle management sans setup séparé",
      "Delta Lake - ACID transactions, time travel data lakes (vs raw Parquet)",
      "Pay-per-second - DBUs facturés par seconde, shutdown auto idle clusters"
    ],
    useCases: [
      {
        title: "Big Data ETL Pipelines",
        description: "Transformation massive datasets (TB/PB) pour data lakes avec Delta Lake ACID transactions.",
        industries: ["Finance", "Telecommunications", "Retail", "Healthcare"],
        businessImpact: "ETL processing time réduit 70%, data quality améliorée, costs optimisés"
      },
      {
        title: "Machine Learning at Scale",
        description: "Training ML models sur large datasets avec distributed Spark, MLflow tracking, AutoML.",
        industries: ["Finance", "E-commerce", "Healthcare", "Technology"],
        businessImpact: "Model accuracy +20%, experimentation velocity 5x, production deployment simplifié"
      },
      {
        title: "Real-Time Streaming Analytics",
        description: "Processing IoT telemetry, clickstream data, transactions temps réel avec Structured Streaming.",
        industries: ["IoT", "Finance", "E-commerce", "Telecommunications"],
        businessImpact: "Real-time insights (< 1 minute latency), fraud detection, personalization"
      },
      {
        title: "Data Lake Analytics",
        description: "SQL queries sur data lakes (Parquet, Delta Lake) pour BI reporting et ad-hoc analysis.",
        industries: ["All"],
        businessImpact: "Self-service analytics, costs 10x moins cher vs data warehouse, petabyte-scale"
      }
    ],
    targetIndustries: ["Finance", "Healthcare", "Retail", "Telecommunications", "Manufacturing", "Technology", "Media"],
    idealCustomerSize: "SME, Enterprise",
    targetPersonas: ["Data Engineer", "Data Scientist", "ML Engineer", "BI Analyst", "Chief Data Officer", "CTO"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Standard (retiring Oct 2026)",
        description: "Basic Spark workloads (will be retired)",
        pricing: "0.40 DBU/hour (Jobs) + Azure VM costs",
        bestFor: "LEGACY - migrate to Premium avant Oct 2026"
      },
      {
        tier: "Premium",
        description: "Production workloads avec RBAC, audit logs, security features",
        pricing: "0.55 DBU/hour (All-Purpose), 0.22 DBU/hour (Jobs) + Azure VM costs",
        bestFor: "Production data engineering, ML workloads, enterprise security"
      },
      {
        tier: "Premium + Photon",
        description: "Premium + Photon engine (12x faster SQL)",
        pricing: "+0.55 DBU/hour surcharge pour Photon",
        bestFor: "SQL analytics, BI queries high-performance"
      },
      {
        tier: "SQL Analytics (Serverless)",
        description: "Serverless SQL warehouses pour BI analysts",
        pricing: "SQL Pro: 0.22 DBU/hour, SQL Serverless: 0.65 DBU/hour",
        bestFor: "BI reporting, ad-hoc SQL queries, Power BI integration"
      }
    ],
    estimatedCost: "€500-5000/mois selon workload (DBUs + VMs) - 25% moins cher vs 2024",
    implementationTime: "1-4 semaines",
    complexity: "high",
    prerequisites: [
      "Connaissance Apache Spark (PySpark, Spark SQL)",
      "Data engineering experience recommandée",
      "Data sources préparés (Data Lake, Blob Storage, etc.)",
      "Pour ML: Python/R/Scala et ML frameworks (scikit-learn, TensorFlow, PyTorch)"
    ],
    integrations: [
      "Azure Data Lake Storage Gen2",
      "Azure Synapse Analytics",
      "Azure Event Hubs",
      "Azure IoT Hub",
      "Azure SQL Database",
      "Azure Cosmos DB",
      "Azure Machine Learning",
      "Power BI",
      "Azure DevOps",
      "GitHub",
      "Apache Kafka",
      "MLflow",
      "Delta Lake",
      "Tableau",
      "Looker"
    ],
    competitorComparison: [
      {
        competitor: "AWS EMR (Elastic MapReduce)",
        ourAdvantages: [
          "Databricks Spark 3-5x faster vs EMR vanilla Spark",
          "Delta Lake built-in (EMR nécessite setup séparé)",
          "MLflow integration native (EMR pas de MLflow built-in)",
          "Collaborative notebooks meilleurs vs EMR Studio",
          "Photon engine unique (AWS pas équivalent)"
        ],
        theirWeaknesses: [
          "EMR vanilla Spark moins performant",
          "Delta Lake setup manuel complexe",
          "Pas de MLflow native",
          "Notebooks EMR Studio moins mature"
        ]
      },
      {
        competitor: "Google Dataproc",
        ourAdvantages: [
          "Databricks performance 3-5x vs Dataproc",
          "Unity Catalog data governance (GCP Dataplex moins mature)",
          "MLflow + AutoML built-in (GCP Vertex AI séparé)",
          "Delta Lake ACID transactions (GCP pas équivalent natif)"
        ],
        theirWeaknesses: [
          "Dataproc performance standard Spark",
          "Data governance moins mature",
          "ML platform séparé (Vertex AI)",
          "Pas ACID transactions data lakes"
        ]
      }
    ],
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: [
      "databricks",
      "apache spark",
      "big data",
      "data lake",
      "delta lake",
      "mlflow",
      "data engineering",
      "machine learning",
      "streaming"
    ],
    tags: ["AI-ML", "Big-Data", "Apache-Spark", "Data-Engineering", "ML-Ops", "Analytics"],
    relatedSolutions: ["azure-machine-learning", "azure-synapse-analytics", "azure-data-lake"],
    technicalSpecs: {
      sparkVersion: "Apache Spark 3.x optimized",
      supportedLanguages: ["Python (PySpark)", "Scala", "SQL", "R"],
      clusterTypes: ["All-Purpose", "Job Clusters", "SQL Warehouses"],
      maxClusterSize: "Thousands of nodes",
      storageFormats: ["Delta Lake", "Parquet", "ORC", "CSV", "JSON", "Avro"],
      mlFrameworks: ["MLflow", "scikit-learn", "TensorFlow", "PyTorch", "XGBoost", "LightGBM"]
    },
    securityFeatures: [
      "Azure AD integration",
      "RBAC granulaire (table, column, row-level)",
      "VNet integration pour network isolation",
      "Customer-managed encryption keys",
      "Unity Catalog pour data governance",
      "Audit logging complet",
      "Secrets management (Azure Key Vault)",
      "Compliance: HIPAA, SOC 2, ISO 27001"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "GDPR", "PCI DSS"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/databricks/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/databricks/",
    demoUrl: "https://azure.microsoft.com/en-us/products/databricks/"
  }
];

// Fonction principale
async function main() {
  console.log(`🚀 Adding ${moreAISolutions.length} more Azure AI/ML solutions...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const solution of moreAISolutions) {
    try {
      console.log(`\n📝 Adding: ${solution.officialName}...`);

      const response = await fetch('http://localhost:3001/api/azure-solutions', {
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
        console.log(`      Priority: ${result.solution.salesPriority}/10`);
      } else {
        failCount++;
        console.log(`   ❌ FAILED - ${solution.officialName}`);
        console.log(`      Error: ${result.error}`);
      }
    } catch (error) {
      failCount++;
      console.log(`   ❌ FAILED - ${solution.officialName}`);
      console.log(`      Error: ${error.message}`);
    }
  }

  console.log(`\n\n📊 SUMMARY:`);
  console.log(`   ✅ Success: ${successCount}/${moreAISolutions.length}`);
  console.log(`   ❌ Failed: ${failCount}/${moreAISolutions.length}`);
  console.log(`\n✨ Azure AI & ML category expanded with Bot Service and Databricks!`);
}

main();
