/**
 * Script pour ajouter Azure OpenAI Service et Azure AI Search
 * Exécuter avec: node scripts/add-azure-openai.js
 */

const openAISolutions = [
  // Azure OpenAI Service
  {
    name: "azure-openai-service",
    officialName: "Azure OpenAI Service",
    category: "ai-ml",
    subcategory: "generative-ai",
    shortDescription: "Service OpenAI models (GPT-4, GPT-4o, ChatGPT, DALL-E, Whisper) avec sécurité enterprise Azure, compliance, et private networking pour applications generative AI.",
    fullDescription: "Azure OpenAI Service fournit accès REST API aux models OpenAI puissants (GPT-4, GPT-4o avec vision, GPT-4o mini, o1 reasoning models, DALL-E image generation, Whisper speech-to-text, text-to-speech) avec enterprise-grade security, compliance, et responsible AI features. Contrairement à OpenAI public, Azure OpenAI inclut: private networking (VNet integration), customer-managed encryption keys, compliance certifications (HIPAA, ISO, SOC), data residency Europe, et content filtering customizable. Models déployés dans votre Azure tenant - vos données ne sont JAMAIS utilisées pour re-training OpenAI models. Support fine-tuning models sur vos données proprietary. Pricing pay-per-token (input/output) ou provisioned throughput (reserved capacity). Idéal pour chatbots intelligents, content generation, code assistants, document summarization, customer service automation.",
    keyFeatures: [
      "GPT-4 Turbo & GPT-4o - Models les plus avancés avec 128K context window, vision capabilities",
      "GPT-4o mini - Model compact cost-efficient avec vision, 128K context",
      "o1-preview & o1-mini - Reasoning models pour complex problem-solving (math, coding)",
      "GPT-3.5 Turbo - Model rapide et économique pour chatbots, classification",
      "DALL-E 3 & GPT-image-1 - Image generation haute qualité avec text rendering, editing",
      "Whisper - Speech-to-text multilingual (100+ langues) avec speaker diarization",
      "Text-to-Speech - Voix naturelles HD, alloy/echo/fable/onyx/nova/shimmer voices",
      "Embeddings (text-embedding-3-large/small) - Vector representations pour semantic search",
      "Fine-tuning - Customization models GPT-3.5/4 sur vos données proprietary",
      "Content Filtering - Filtrage harmful content customizable (hate, violence, sexual, self-harm)",
      "Private Networking - VNet integration, private endpoints pour isolation complète",
      "Customer-Managed Keys - Encryption avec vos clés Azure Key Vault",
      "Audit Logging - Logs complets Azure Monitor pour compliance",
      "Rate Limiting & Quotas - Control utilization et coûts avec quotas configurables",
      "Provisioned Throughput - Capacité reserved pour predictable performance et coûts"
    ],
    benefits: [
      "Enterprise Security - VNet, private endpoints, customer-managed encryption vs OpenAI public",
      "Compliance Ready - HIPAA, ISO 27001, SOC 2, GDPR, data residency EU disponible",
      "Data Privacy - Vos données NE sont PAS utilisées pour training OpenAI models",
      "Responsible AI - Content filtering, abuse monitoring, responsible use guidelines",
      "Azure Integration - Seamless avec Cognitive Search, Functions, Logic Apps, Power Platform",
      "Flexible Pricing - Pay-per-token OU provisioned throughput selon workload"
    ],
    useCases: [
      {
        title: "Intelligent Chatbots & Virtual Assistants",
        description: "Customer service chatbots avec GPT-4 pour conversations naturelles, context awareness, multilingual.",
        industries: ["E-commerce", "Banking", "Healthcare", "Telecommunications"],
        businessImpact: "Réduction coûts support 60%, résolution 24/7, satisfaction client +40%, deflection rate 70%"
      },
      {
        title: "Content Generation & Copywriting",
        description: "Génération automatique product descriptions, blog posts, marketing copy, social media content.",
        industries: ["Marketing", "E-commerce", "Media", "Advertising"],
        businessImpact: "Productivité content creation +300%, time-to-market réduit 80%, A/B testing scalable"
      },
      {
        title: "Document Analysis & Summarization",
        description: "Résumé automatique contrats, rapports, emails, documents légaux avec key insights extraction.",
        industries: ["Legal", "Finance", "Consulting", "Research"],
        businessImpact: "Temps analyse documents -90%, compliance améliorée, insights actionnables rapides"
      },
      {
        title: "Code Generation & Developer Assistance",
        description: "Copilot-like code generation, debugging, code review, documentation automatique.",
        industries: ["Software Development", "Technology"],
        businessImpact: "Productivité developers +30%, réduction bugs, onboarding accéléré"
      },
      {
        title: "Semantic Search & Knowledge Bases",
        description: "Search intelligent dans knowledge bases avec embeddings + Cognitive Search pour Q&A précis.",
        industries: ["All"],
        businessImpact: "Précision search +60%, self-service employees amélioré, réduction tickets support"
      },
      {
        title: "Image Generation for Marketing",
        description: "Création automatique visuals marketing, product mockups, social media graphics avec DALL-E.",
        industries: ["Marketing", "E-commerce", "Design"],
        businessImpact: "Coûts design -70%, rapidité campagnes, A/B testing visuals scalable"
      }
    ],
    targetIndustries: ["All", "Technology", "Finance", "Healthcare", "E-commerce", "Marketing", "Legal", "Customer Service"],
    idealCustomerSize: "SME, Enterprise",
    targetPersonas: ["CTO", "AI/ML Engineer", "Product Manager", "Developer", "Data Scientist", "Marketing Manager"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "GPT-4o (Pay-as-you-go)",
        description: "Model le plus avancé avec vision, 128K context",
        pricing: "$2.50 per 1M input tokens, $10 per 1M output tokens",
        bestFor: "Applications production nécessitant meilleure qualité et vision"
      },
      {
        tier: "GPT-4o mini (Pay-as-you-go)",
        description: "Model compact cost-efficient, 128K context",
        pricing: "$0.15 per 1M input tokens, $0.60 per 1M output tokens",
        bestFor: "Chatbots high-volume, classification, simple Q&A"
      },
      {
        tier: "GPT-4 Turbo (Pay-as-you-go)",
        description: "GPT-4 avec 128K context window",
        pricing: "$10 per 1M input tokens, $30 per 1M output tokens",
        bestFor: "Complex reasoning, long documents, high-quality generation"
      },
      {
        tier: "GPT-3.5 Turbo (Pay-as-you-go)",
        description: "Model rapide et économique",
        pricing: "$0.50 per 1M input tokens, $1.50 per 1M output tokens",
        bestFor: "Chatbots simples, high-volume workloads cost-sensitive"
      },
      {
        tier: "DALL-E 3 (Image Generation)",
        description: "Image generation haute qualité",
        pricing: "$0.04 per image (1024x1024), $0.08 (1024x1792 ou 1792x1024)",
        bestFor: "Marketing visuals, product mockups, creative content"
      },
      {
        tier: "Provisioned Throughput",
        description: "Reserved capacity pour predictable costs et performance",
        pricing: "$240-$36,000/mois selon model et capacity (PTUs - Provisioned Throughput Units)",
        bestFor: "High-volume production workloads, predictable budgets"
      }
    ],
    estimatedCost: "POC: $50-200/mois, Production chatbot: $500-5000/mois selon volume",
    implementationTime: "1-2 semaines",
    complexity: "medium",
    prerequisites: [
      "Application approval Azure OpenAI (formulaire Microsoft - approval ~2-5 jours business)",
      "Use case description et responsible AI commitment",
      "Compte Azure avec credits/budget",
      "Connaissance REST APIs ou Azure SDKs (Python, .NET, JavaScript)"
    ],
    integrations: [
      "Azure Cognitive Search (semantic search + RAG)",
      "Azure Functions (serverless triggers)",
      "Azure Logic Apps (workflow automation)",
      "Power Virtual Agents (low-code chatbots)",
      "Power Automate (business process automation)",
      "LangChain / Semantic Kernel (orchestration frameworks)",
      "Azure Bot Service",
      "Azure App Service",
      "Azure Kubernetes Service",
      "Microsoft Teams (bots)"
    ],
    competitorComparison: [
      {
        competitor: "OpenAI API (public)",
        ourAdvantages: [
          "Enterprise security - VNet, private endpoints, customer-managed keys (OpenAI public pas de VNet)",
          "Compliance certifications - HIPAA, ISO, SOC 2 (OpenAI public limited compliance)",
          "Data privacy - Vos données JAMAIS utilisées training (OpenAI peut use data)",
          "Regional deployment - Data residency EU/US (OpenAI US uniquement)",
          "SLA 99.9% - Production SLA (OpenAI best-effort)"
        ],
        theirWeaknesses: [
          "Pas de VNet/private networking",
          "Data privacy concerns (opt-out required)",
          "Limited compliance certifications",
          "Pas de data residency garanties"
        ]
      },
      {
        competitor: "AWS Bedrock (Claude, Llama)",
        ourAdvantages: [
          "Accès exclusif GPT-4o, o1, DALL-E (AWS pas accès OpenAI models)",
          "Fine-tuning GPT models (Bedrock fine-tuning limité)",
          "Integration Microsoft ecosystem (Teams, Power Platform)",
          "Provisioned throughput pricing plus flexible"
        ],
        theirWeaknesses: [
          "Pas d'accès models OpenAI (GPT-4, DALL-E)",
          "Claude/Llama moins performants que GPT-4 pour certains tasks",
          "Ecosystem integration moins riche"
        ]
      },
      {
        competitor: "Google Vertex AI (PaLM, Gemini)",
        ourAdvantages: [
          "GPT-4 performance supérieure vs PaLM 2 pour most tasks",
          "DALL-E image quality meilleure vs Imagen",
          "Ecosystem Microsoft (Office 365, Dynamics, Power Platform)",
          "Fine-tuning plus accessible"
        ],
        theirWeaknesses: [
          "Gemini Pro capabilities limitées vs GPT-4",
          "Vertex AI complex setup vs Azure OpenAI simple",
          "Moins d'integration enterprise tools"
        ]
      }
    ],
    salesPriority: 10,
    isActive: true,
    isFeatured: true,
    keywords: [
      "openai",
      "gpt-4",
      "chatgpt",
      "dall-e",
      "generative ai",
      "llm",
      "chatbot",
      "content generation",
      "copilot"
    ],
    tags: ["AI-ML", "Generative-AI", "LLM", "GPT", "OpenAI", "Chatbot", "Enterprise"],
    relatedSolutions: ["azure-cognitive-search", "azure-cognitive-services", "azure-bot-service"],
    technicalSpecs: {
      availableModels: [
        "GPT-4o (128K context)",
        "GPT-4o mini (128K context)",
        "GPT-4 Turbo (128K context)",
        "GPT-3.5 Turbo (16K context)",
        "o1-preview & o1-mini (reasoning)",
        "DALL-E 3 (image generation)",
        "Whisper (speech-to-text)",
        "TTS (text-to-speech)",
        "text-embedding-3-small/large"
      ],
      maxTokens: "128,000 tokens (GPT-4o, GPT-4 Turbo)",
      supportedLanguages: "100+ languages",
      apiProtocol: "REST API + SDKs (Python, .NET, Java, JavaScript)",
      deployment: "Azure regions (East US, West Europe, etc.)"
    },
    securityFeatures: [
      "Private endpoints (VNet integration)",
      "Customer-managed encryption keys (Azure Key Vault)",
      "Azure AD authentication",
      "RBAC granulaire",
      "Content filtering (hate, violence, sexual, self-harm)",
      "Abuse monitoring",
      "Audit logging (Azure Monitor)",
      "Data residency (EU, US options)",
      "NO data used for model training",
      "Compliance: HIPAA, ISO 27001, SOC 2, GDPR"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "GDPR", "FedRAMP (in progress)"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/ai-services/openai/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/",
    demoUrl: "https://azure.microsoft.com/en-us/products/ai-services/openai-service/"
  },

  // Azure AI Search (Cognitive Search)
  {
    name: "azure-ai-search",
    officialName: "Azure AI Search (Cognitive Search)",
    category: "ai-ml",
    subcategory: "ai-search",
    shortDescription: "Service de recherche cloud AI-powered avec full-text search, semantic search, vector search, et AI enrichment (OCR, entity extraction, sentiment) pour applications search intelligentes.",
    fullDescription: "Azure AI Search (anciennement Cognitive Search) est un service de recherche cloud combinant full-text search traditionnel avec AI capabilities (semantic search, vector search pour embeddings, AI enrichment pipelines). Indexe données de multiples sources (Blob Storage, SQL, Cosmos DB, SharePoint) avec extraction automatique de contenu via OCR, entity recognition, key phrase extraction, sentiment analysis. Semantic search comprend l'intent utilisateur (pas juste keyword matching). Vector search permet similarity search avec embeddings (Azure OpenAI, custom models). Idéal pour: knowledge bases search, e-commerce product search, document search avec Q&A, chatbots avec RAG (Retrieval-Augmented Generation). Scaling automatique, low latency (ms), et SLA 99.9%.",
    keyFeatures: [
      "Full-Text Search - Recherche textuelle classique avec fuzzy matching, synonymes, autocomplete",
      "Semantic Search - Compréhension intent utilisateur au-delà des keywords exacts",
      "Vector Search - Similarity search avec embeddings pour semantic matching (Azure OpenAI integration)",
      "Hybrid Search - Combinaison full-text + semantic + vector pour précision optimale",
      "AI Enrichment - OCR, entity extraction, key phrase, language detection, sentiment via Cognitive Services",
      "Custom Skills - Azure Functions custom pour enrichment proprietary",
      "Multi-Index - Support multiple indexes pour segmentation données",
      "Faceted Navigation - Filtres dynamiques (price ranges, categories, brands)",
      "Geo-Search - Recherche basée localisation géographique",
      "Autocomplete & Suggestions - Typeahead search box",
      "Scoring Profiles - Ranking customizable pour pertinence business",
      "Security - Row-level security, Azure AD integration, encryption at-rest/in-transit",
      "Analytics - Search analytics pour query performance, click-through rates"
    ],
    benefits: [
      "AI-powered - Semantic understanding vs simple keyword matching",
      "RAG ready - Perfect pour chatbots with retrieval-augmented generation (Azure OpenAI)",
      "Auto-scaling - Scaling automatique selon charge queries",
      "Low latency - Queries millisecondes même sur millions documents",
      "Multi-source - Indexation Azure Blob, SQL, Cosmos DB, SharePoint, custom data",
      "Enrichment pipelines - Extraction automatique insights from unstructured data"
    ],
    useCases: [
      {
        title: "Enterprise Knowledge Base Search",
        description: "Search intelligent dans documents internes (SharePoint, OneDrive) avec Q&A semantic search.",
        industries: ["All"],
        businessImpact: "Self-service employees +80%, réduction tickets support, knowledge discovery rapide"
      },
      {
        title: "E-commerce Product Search",
        description: "Search produits intelligent avec facets, autocomplete, recommendations, semantic understanding.",
        industries: ["E-commerce", "Retail"],
        businessImpact: "Conversion rate +25%, cart value +15%, customer satisfaction improved"
      },
      {
        title: "Document Search avec OCR",
        description: "Indexation PDFs, images, scanned documents avec OCR automatique et entity extraction.",
        industries: ["Legal", "Healthcare", "Government", "Finance"],
        businessImpact: "Document discovery 95% plus rapide, compliance améliorée, audit trails"
      },
      {
        title: "Chatbot RAG (Retrieval-Augmented Generation)",
        description: "Chatbots Azure OpenAI avec vector search pour grounding responses sur vos données proprietary.",
        industries: ["Customer Service", "IT Support", "HR"],
        businessImpact: "Précision réponses +70%, hallucinations réduites 90%, knowledge actuelle"
      }
    ],
    targetIndustries: ["All", "E-commerce", "Legal", "Healthcare", "Finance", "Technology", "Government"],
    idealCustomerSize: "All",
    targetPersonas: ["Developer", "Search Engineer", "Data Engineer", "Product Manager", "CTO"],
    pricingModel: "subscription",
    pricingTiers: [
      {
        tier: "Free",
        description: "50 MB storage, 10,000 documents, 3 indexes",
        pricing: "GRATUIT",
        bestFor: "POC, testing, development"
      },
      {
        tier: "Basic",
        description: "2 GB storage, 15 indexes, 3 replicas",
        pricing: "€68/mois",
        bestFor: "Small production apps, low query volume"
      },
      {
        tier: "Standard S1",
        description: "25 GB storage, 50 indexes, 12 replicas, 12 partitions",
        pricing: "€228/mois",
        bestFor: "Production apps medium volume"
      },
      {
        tier: "Standard S2",
        description: "100 GB storage, 200 indexes, high throughput",
        pricing: "€912/mois",
        bestFor: "High-volume e-commerce, enterprise search"
      },
      {
        tier: "Standard S3",
        description: "200 GB storage per partition, ultra-high scale",
        pricing: "€1,824/mois",
        bestFor: "Very large catalogs, millions of documents"
      }
    ],
    estimatedCost: "POC: Free, Production: €228-912/mois selon scale",
    implementationTime: "1-4 semaines",
    complexity: "medium",
    prerequisites: [
      "Data sources prêts (Blob Storage, SQL, etc.)",
      "Azure Search service créé",
      "Pour AI enrichment: Cognitive Services resource",
      "Pour vector search: Embeddings model (Azure OpenAI ou custom)"
    ],
    integrations: [
      "Azure Blob Storage",
      "Azure SQL Database",
      "Azure Cosmos DB",
      "SharePoint Online",
      "Azure Data Lake",
      "Azure OpenAI (embeddings, semantic ranker)",
      "Azure Cognitive Services (OCR, entities, sentiment)",
      "Azure Functions (custom skills)",
      "Power Apps (search integration)",
      "Microsoft 365 (SharePoint connector)"
    ],
    competitorComparison: [
      {
        competitor: "Elasticsearch",
        ourAdvantages: [
          "Fully managed - Zero infrastructure management (Elasticsearch self-managed complex)",
          "AI enrichment native - OCR, entities built-in (Elasticsearch nécessite plugins)",
          "Semantic + vector search native (Elasticsearch vector experimental)",
          "Azure OpenAI integration seamless"
        ],
        theirWeaknesses: [
          "Elasticsearch infrastructure management overhead",
          "AI capabilities nécessitent plugins séparés",
          "Vector search moins mature"
        ]
      },
      {
        competitor: "AWS Kendra",
        ourAdvantages: [
          "Vector search native (Kendra limited vector support)",
          "Pricing plus transparent et prévisible",
          "Integration Azure OpenAI pour RAG",
          "Custom skills plus flexibles"
        ],
        theirWeaknesses: [
          "Kendra vector search limité",
          "Pricing complexe per-query",
          "Moins flexible custom enrichment"
        ]
      }
    ],
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: [
      "cognitive search",
      "ai search",
      "semantic search",
      "vector search",
      "full-text search",
      "rag",
      "knowledge base",
      "document search"
    ],
    tags: ["AI-ML", "Search", "Semantic-Search", "Vector-Search", "RAG", "Enterprise"],
    relatedSolutions: ["azure-openai-service", "azure-cognitive-services", "azure-blob-storage"],
    technicalSpecs: {
      searchCapabilities: ["Full-text", "Semantic", "Vector", "Hybrid"],
      maxDocuments: "Millions (depends on tier)",
      maxIndexSize: "Depends on tier (GB to TB)",
      queryLatency: "Milliseconds",
      supportedDataSources: ["Azure Blob", "Azure SQL", "Cosmos DB", "SharePoint", "Data Lake", "Custom"],
      enrichmentSkills: ["OCR", "Entity Recognition", "Key Phrase Extraction", "Language Detection", "Sentiment", "Image Analysis", "Custom Skills"]
    },
    securityFeatures: [
      "Encryption at-rest (AES 256)",
      "Encryption in-transit (TLS)",
      "Azure AD authentication",
      "API key authentication",
      "Row-level security (document-level filtering)",
      "Private endpoints support",
      "Customer-managed encryption keys",
      "Audit logging"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "GDPR"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/search/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/search/",
    demoUrl: "https://azure.microsoft.com/en-us/products/ai-services/ai-search/"
  }
];

// Fonction principale
async function main() {
  console.log(`🚀 Adding ${openAISolutions.length} more Azure AI solutions...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const solution of openAISolutions) {
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
  console.log(`   ✅ Success: ${successCount}/${openAISolutions.length}`);
  console.log(`   ❌ Failed: ${failCount}/${openAISolutions.length}`);
  console.log(`\n✨ Azure AI category complete with OpenAI and AI Search!`);
}

main();
