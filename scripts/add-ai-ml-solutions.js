/**
 * Script pour ajouter les solutions Azure AI & Machine Learning
 * Exécuter avec: node scripts/add-ai-ml-solutions.js
 */

const aiMLSolutions = [
  // 1. Azure Machine Learning Designer (formerly Azure ML Studio)
  {
    name: "azure-machine-learning",
    officialName: "Azure Machine Learning (ML Studio & Designer)",
    category: "ai-ml",
    subcategory: "machine-learning-platform",
    shortDescription: "Plateforme cloud end-to-end pour créer, entraîner et déployer des modèles ML via interface no-code/low-code (Designer) ou code-first (Python/R) avec AutoML intégré.",
    fullDescription: "Azure Machine Learning est une plateforme complète pour le cycle de vie ML: data preparation, experimentation, training (CPU/GPU), hyperparameter tuning, model deployment, et monitoring. L'interface Designer (drag-and-drop no-code) permet aux data scientists, développeurs ET business analysts de créer des pipelines ML visuellement sans code. AutoML teste automatiquement dizaines d'algorithmes pour trouver le meilleur modèle. Support notebooks Jupyter, environnements ML personnalisés, training distribué GPU, et déploiement models comme web services (AKS, ACI) ou edge devices (IoT). Integration native Azure Data Lake, Synapse, Databricks, Cognitive Services pour end-to-end AI workflows.",
    keyFeatures: [
      "Visual Workflow Designer - Interface drag-and-drop no-code pour créer pipelines ML",
      "Pre-built Modules & Algorithms - Bibliothèque modules: data transformation, feature engineering, classification, regression, clustering",
      "Automated Machine Learning (AutoML) - Sélection automatique meilleur modèle et hyperparamètres",
      "Notebooks Jupyter/RStudio - Environnements code-first pour Python/R avec GPU support",
      "Distributed Training - Training multi-GPU et multi-node pour deep learning",
      "MLOps & CI/CD - Pipelines ML automated avec Azure DevOps integration",
      "Model Deployment - Déploiement comme REST APIs (AKS, Azure Container Instances, Azure Functions)",
      "Real-Time Scoring - Endpoints scoring temps réel avec auto-scaling",
      "Integration Azure Services - Data Lake, Synapse Analytics, Databricks, Cognitive Services",
      "Collaboration & Experimentation - Partage projects, tracking experiments, versioning models",
      "Model Monitoring - Drift detection, performance monitoring production",
      "Security & Governance - RBAC, encryption, audit trails, compliance certifications"
    ],
    benefits: [
      "No-code ET code-first - Accessible data scientists ET business users",
      "AutoML time-saving - Réduction temps développement modèles de 90%",
      "Production-ready - MLOps intégré pour deployment automatisé",
      "Scalabilité - Training distribué GPU pour large datasets et deep learning",
      "Collaboration - Teams partagent experiments, models, datasets",
      "Enterprise-grade - Sécurité, compliance, governance intégrés"
    ],
    useCases: [
      {
        title: "Rapid Prototyping ML Models",
        description: "Business analysts créent modèles predictive analytics sans code via Designer drag-and-drop.",
        industries: ["All"],
        businessImpact: "Time-to-insight réduit 80%, democratization ML pour non-developers"
      },
      {
        title: "Data-Driven Decision Making",
        description: "Modèles prédiction demande (supply chain, finance), détection fraudes, churn prediction.",
        industries: ["Retail", "Finance", "Manufacturing"],
        businessImpact: "Précision prédictions +30%, réduction risques, optimisation inventory"
      },
      {
        title: "Model Deployment & Scoring",
        description: "Déploiement models production comme REST APIs pour applications réelles (web, mobile).",
        industries: ["Technology", "SaaS", "E-commerce"],
        businessImpact: "Intégration AI dans apps, scoring temps réel, auto-scaling"
      },
      {
        title: "Educational & Training Environments",
        description: "Formation ML hands-on pour étudiants et employés via interface visuelle intuitive.",
        industries: ["Education", "Corporate Training"],
        businessImpact: "Apprentissage accéléré concepts ML, expérimentation pratique"
      }
    ],
    targetIndustries: ["All", "Finance", "Healthcare", "Retail", "Manufacturing", "Technology", "Education"],
    idealCustomerSize: "All",
    targetPersonas: ["Data Scientist", "ML Engineer", "Business Analyst", "Developer", "Data Engineer", "CTO"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Compute (Training)",
        description: "VMs pour training models (CPU/GPU)",
        pricing: "€0.10-€3.00/heure selon VM type (CPU Standard_DS2_v2 à GPU NC6)",
        bestFor: "Training models - coûts selon durée et puissance compute"
      },
      {
        tier: "AutoML",
        description: "Automated ML experiments",
        pricing: "Inclus dans coût compute - pas de frais supplémentaires AutoML",
        bestFor: "Tous usages AutoML - même pricing que compute standard"
      },
      {
        tier: "Deployment (Inference)",
        description: "AKS ou ACI pour model hosting",
        pricing: "AKS: €60-€150/mois par cluster, ACI: €0.0000125/seconde vCPU",
        bestFor: "Production deployments - AKS si scaling élevé, ACI si léger"
      },
      {
        tier: "Storage & Data",
        description: "Blob storage datasets, experiments",
        pricing: "€0.0184/GB/mois (Standard Blob Storage)",
        bestFor: "Storage datasets et experiment outputs"
      }
    ],
    estimatedCost: "POC: €50-200/mois, Production: €500-2000/mois selon workload",
    implementationTime: "2 heures à 2 semaines selon complexité ML",
    complexity: "medium",
    prerequisites: [
      "Compte Azure avec ML workspace créé",
      "Datasets préparés (structured or unstructured)",
      "Pour Designer: Aucune expertise ML requise",
      "Pour code-first: Connaissance Python/R et ML frameworks (sklearn, TensorFlow, PyTorch)"
    ],
    integrations: [
      "Azure Data Lake Storage",
      "Azure Synapse Analytics",
      "Azure Databricks",
      "Azure Cognitive Services",
      "Azure Kubernetes Service (AKS)",
      "Azure Container Instances",
      "Azure Functions",
      "Azure DevOps",
      "GitHub Actions",
      "Power BI",
      "Jupyter Notebooks",
      "Python SDKs (scikit-learn, TensorFlow, PyTorch)"
    ],
    competitorComparison: [
      {
        competitor: "AWS SageMaker",
        ourAdvantages: [
          "Designer no-code plus intuitif que SageMaker Canvas (plus limité)",
          "AutoML inclus gratuit (SageMaker Autopilot payant séparé)",
          "Integration Azure ecosystem seamless (Data Lake, Synapse)",
          "Pricing compute plus transparent (SageMaker instance types complexe)"
        ],
        theirWeaknesses: [
          "SageMaker Canvas features limitées vs Azure Designer",
          "Autopilot coûts additionnels",
          "Pricing instance types moins transparent"
        ]
      },
      {
        competitor: "Google Vertex AI",
        ourAdvantages: [
          "Designer drag-and-drop (Vertex AI Workbench code-first principalement)",
          "AutoML integration plus seamless",
          "Windows/.NET ML support natif (Google Linux-centric)",
          "Hybrid deployment options (Azure Arc ML)"
        ],
        theirWeaknesses: [
          "Vertex AI moins no-code friendly",
          "Focus Linux/Python (moins .NET/Windows)",
          "Moins d'options hybrid deployment"
        ]
      }
    ],
    salesPriority: 9,
    isActive: true,
    isFeatured: true,
    keywords: [
      "machine learning",
      "ml studio",
      "designer",
      "automl",
      "no-code ml",
      "predictive analytics",
      "data science",
      "mlops"
    ],
    tags: ["AI-ML", "Machine-Learning", "No-Code", "AutoML", "Data-Science", "MLOps"],
    relatedSolutions: ["azure-cognitive-services", "azure-databricks", "azure-synapse-analytics"],
    technicalSpecs: {
      supportedLanguages: ["Python", "R", "No-code (Designer)"],
      supportedFrameworks: ["scikit-learn", "TensorFlow", "PyTorch", "Keras", "ONNX"],
      computeOptions: ["CPU VMs", "GPU VMs (NC, ND series)", "Distributed training"],
      deploymentTargets: ["AKS", "ACI", "Azure Functions", "IoT Edge"],
      autoMLSupport: "Classification, Regression, Time-series forecasting, NLP, Computer Vision"
    },
    securityFeatures: [
      "Azure AD integration pour authentication",
      "RBAC granulaire pour workspaces et resources",
      "Encryption at-rest (Azure Storage SSE)",
      "Encryption in-transit (HTTPS/TLS)",
      "VNet integration pour private compute",
      "Private endpoints pour secure access",
      "Compliance certifications (ISO, SOC, HIPAA)",
      "Audit logging (Azure Monitor)",
      "Model versioning et lineage tracking"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "GDPR", "FedRAMP"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/machine-learning/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/machine-learning/",
    demoUrl: "https://azure.microsoft.com/en-us/products/machine-learning/"
  },

  // 2. Azure Cognitive Services (Now Azure AI Services)
  {
    name: "azure-cognitive-services",
    officialName: "Azure Cognitive Services (Azure AI Services)",
    category: "ai-ml",
    subcategory: "ai-apis",
    shortDescription: "Suite d'APIs AI pre-built pour intégrer capacités vision, speech, language, decision, et search dans applications sans expertise ML approfondie.",
    fullDescription: "Azure Cognitive Services (rebrandé Azure AI Services) est une collection d'APIs et SDKs AI permettant d'ajouter intelligence artificielle aux applications via simples appels REST API. Couvre 5 domaines: Vision (Computer Vision, Face API, Custom Vision, Form Recognizer OCR), Speech (Speech-to-Text, Text-to-Speech, Speech Translation, Speaker Recognition), Language (Text Analytics, Translator, LUIS natural language understanding), Decision (Personalizer, Anomaly Detector, Content Moderator), Search (Cognitive Search full-text). Pas besoin d'expertise data science - APIs pre-trained sur datasets Microsoft massifs. Free tiers disponibles pour testing, pricing pay-per-transaction ultra-flexible. Idéal pour ajouter rapidement features AI (chatbots, image recognition, sentiment analysis) sans développer models from scratch.",
    keyFeatures: [
      "Computer Vision API - Image analysis, object detection, OCR, image classification",
      "Face API - Face detection, verification, identification, emotion recognition",
      "Custom Vision - Training custom image classification models via drag-and-drop",
      "Form Recognizer - OCR avancé pour extraction données formulaires, factures, receipts",
      "Speech-to-Text - Transcription audio temps réel, batch processing, 100+ langues",
      "Text-to-Speech - Synthèse vocale naturelle, 400+ voix, 140+ langues",
      "Speech Translation - Traduction speech temps réel multi-langues",
      "Speaker Recognition - Identification speakers par voix biométrique",
      "Text Analytics - Sentiment analysis, key phrase extraction, entity recognition, language detection",
      "Translator - Traduction texte 100+ langues, document translation",
      "Language Understanding (LUIS) - NLU pour chatbots, extraction intents et entities",
      "Personalizer - Recommandations personnalisées via reinforcement learning",
      "Anomaly Detector - Détection anomalies time-series data (IoT, monitoring)",
      "Content Moderator - Modération contenu texte/image automatique (profanity, adult content)"
    ],
    benefits: [
      "No ML expertise required - APIs pre-trained, intégration via REST/SDK simple",
      "Free tiers disponibles - Testing gratuit (5,000 transactions/mois Vision, 5h/mois Speech)",
      "Pay-per-use flexible - Coûts uniquement pour transactions utilisées",
      "Multi-language support - 100+ langues pour speech et translation",
      "Production-ready - SLA 99.9%, scaling automatique, low latency",
      "Rapid integration - Ajout AI features en heures vs mois de ML development"
    ],
    useCases: [
      {
        title: "Chatbots & Virtual Assistants",
        description: "Chatbots intelligent avec LUIS (natural language understanding), Speech-to-Text, Text-to-Speech.",
        industries: ["E-commerce", "Customer Service", "Healthcare"],
        businessImpact: "Réduction coûts support 40%, disponibilité 24/7, satisfaction client +25%"
      },
      {
        title: "Document Processing & OCR",
        description: "Extraction automatique données factures, contrats, formulaires avec Form Recognizer.",
        industries: ["Finance", "Insurance", "Healthcare", "Government"],
        businessImpact: "Automatisation data entry 90%, réduction erreurs 85%, compliance améliorée"
      },
      {
        title: "Sentiment Analysis & Social Listening",
        description: "Analyse sentiment customer reviews, social media, survey responses temps réel.",
        industries: ["Retail", "Hospitality", "Technology"],
        businessImpact: "Insights client actionables, réaction rapide feedback négatif, NPS amélioré"
      },
      {
        title: "Call Center Transcription & Analysis",
        description: "Transcription appels client automatique, sentiment analysis, quality monitoring.",
        industries: ["Telecommunications", "Finance", "Retail"],
        businessImpact: "Compliance audit trails, quality scoring automatique, formation agents optimisée"
      },
      {
        title: "E-commerce Image Search",
        description: "Recherche produits par image (visual search), recommandations visuelles similaires.",
        industries: ["E-commerce", "Retail", "Fashion"],
        businessImpact: "Conversion rate +15%, engagement utilisateur amélioré, discovery products"
      }
    ],
    targetIndustries: ["All", "E-commerce", "Healthcare", "Finance", "Retail", "Customer Service", "Media"],
    idealCustomerSize: "All",
    targetPersonas: ["Developer", "Product Manager", "Data Scientist", "Business Analyst", "CTO"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Vision (Computer Vision) - Free",
        description: "Image analysis, OCR, object detection",
        pricing: "5,000 transactions/mois GRATUIT",
        bestFor: "Testing, POCs, small applications"
      },
      {
        tier: "Vision (Computer Vision) - Standard",
        description: "Beyond free tier transactions",
        pricing: "€0.80 per 1,000 transactions (0-1M), puis €0.60 (1M-5M), €0.50 (5M-10M)",
        bestFor: "Production applications, image processing pipelines"
      },
      {
        tier: "Speech (Speech-to-Text) - Free",
        description: "Audio transcription",
        pricing: "5 heures audio/mois GRATUIT",
        bestFor: "Testing, low-volume transcription"
      },
      {
        tier: "Speech (Speech-to-Text) - Standard",
        description: "Beyond free tier",
        pricing: "€0.84/heure audio (Standard), €2.17/heure (Custom models)",
        bestFor: "Call center transcription, subtitle generation, meeting notes"
      },
      {
        tier: "Language (Text Analytics) - Free",
        description: "Sentiment, key phrases, entities",
        pricing: "5,000 text records/mois GRATUIT",
        bestFor: "Testing sentiment analysis, small datasets"
      },
      {
        tier: "Language (Text Analytics) - Standard",
        description: "Beyond free tier",
        pricing: "€0.80 per 1,000 text records",
        bestFor: "Social media monitoring, customer feedback analysis"
      }
    ],
    estimatedCost: "Free tier: €0/mois (limits apply), Production: €50-500/mois selon usage",
    implementationTime: "1 heure à 1 semaine",
    complexity: "low",
    prerequisites: [
      "Compte Azure",
      "Cognitive Services resource créé",
      "API keys",
      "Connaissance REST APIs ou Azure SDKs (.NET, Python, Java, Node.js)"
    ],
    integrations: [
      "Azure Functions (serverless triggers)",
      "Azure Logic Apps (workflow automation)",
      "Azure Bot Service (chatbots)",
      "Power Automate (business process automation)",
      "Azure Machine Learning",
      "Azure Cognitive Search",
      "Power BI (analytics)",
      "Microsoft Teams (bots)",
      "Web apps (.NET, Python, Node.js SDKs)"
    ],
    competitorComparison: [
      {
        competitor: "AWS AI Services (Rekognition, Transcribe, Comprehend)",
        ourAdvantages: [
          "Free tiers plus généreux (5,000 txn Vision vs 1,000 AWS Rekognition)",
          "LUIS natural language understanding plus puissant que AWS Lex",
          "Speech synthesis 400+ voix (AWS Polly ~60 voix)",
          "Form Recognizer OCR intelligence supérieure (vs AWS Textract)"
        ],
        theirWeaknesses: [
          "Free tiers AWS plus limités",
          "AWS Lex NLU moins capable que LUIS",
          "Moins de voix TTS disponibles"
        ]
      },
      {
        competitor: "Google Cloud AI APIs (Vision AI, Speech-to-Text, Natural Language)",
        ourAdvantages: [
          "Integration entreprise Microsoft seamless (Teams, Office, Power Platform)",
          "LUIS + Bot Framework combinaison puissante (Google Dialogflow séparé)",
          "Form Recognizer layout understanding supérieur",
          "Pricing plus prévisible et transparent"
        ],
        theirWeaknesses: [
          "Google Dialogflow configuration plus complexe",
          "Document AI Google moins mature",
          "Pricing GCP moins transparent"
        ]
      }
    ],
    salesPriority: 9,
    isActive: true,
    isFeatured: true,
    keywords: [
      "cognitive services",
      "ai apis",
      "computer vision",
      "speech to text",
      "text analytics",
      "ocr",
      "chatbots",
      "sentiment analysis",
      "translation"
    ],
    tags: ["AI-ML", "APIs", "Vision", "Speech", "Language", "Pre-Built", "No-Code"],
    relatedSolutions: ["azure-bot-service", "azure-machine-learning", "azure-openai"],
    technicalSpecs: {
      visionServices: ["Computer Vision", "Face API", "Custom Vision", "Form Recognizer"],
      speechServices: ["Speech-to-Text", "Text-to-Speech", "Speech Translation", "Speaker Recognition"],
      languageServices: ["Text Analytics", "Translator", "LUIS", "QnA Maker"],
      decisionServices: ["Personalizer", "Anomaly Detector", "Content Moderator"],
      supportedLanguages: "100+ languages for Translation and Speech",
      apiProtocol: "REST APIs + SDKs (.NET, Python, Java, Node.js, Go)"
    },
    securityFeatures: [
      "API key authentication",
      "Azure AD authentication",
      "VNet service endpoints",
      "Private endpoints support",
      "Customer-managed encryption keys",
      "Compliance certifications (ISO, SOC, HIPAA)",
      "Data residency options",
      "Audit logging Azure Monitor"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "GDPR", "FedRAMP"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/cognitive-services/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/cognitive-services/",
    demoUrl: "https://azure.microsoft.com/en-us/products/ai-services/"
  }

  // Azure OpenAI Service will be added in next iteration due to length...
];

// Fonction principale
async function main() {
  console.log(`🚀 Adding ${aiMLSolutions.length} Azure AI & Machine Learning solutions...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const solution of aiMLSolutions) {
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
  console.log(`   ✅ Success: ${successCount}/${aiMLSolutions.length}`);
  console.log(`   ❌ Failed: ${failCount}/${aiMLSolutions.length}`);
  console.log(`\n✨ Azure AI & Machine Learning solutions added to knowledge base!`);
}

main();
