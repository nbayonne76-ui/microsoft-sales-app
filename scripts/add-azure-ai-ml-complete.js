/**
 * Script complet pour ajouter TOUTES les solutions Azure AI & Machine Learning
 * Exécuter avec: node scripts/add-azure-ai-ml-complete.js
 *
 * Basé sur les services Azure AI 2025:
 * - Azure Machine Learning (Studio, Designer, AutoML)
 * - Azure AI Foundry
 * - Azure Cognitive Services (Vision, Speech, Language, Decision)
 * - Azure Document Intelligence
 * - Azure Bot Service
 * - Azure Applied AI Services
 */

const aiMLSolutions = [

  // 1. AZURE MACHINE LEARNING
  {
    name: "azure-machine-learning",
    officialName: "Azure Machine Learning",
    category: "ai-ml",
    subcategory: "ml-platform",
    shortDescription: "Enterprise-grade platform cloud pour le cycle de vie complet machine learning - build, train, deploy, et manage ML models avec MLOps, AutoML, et designer no-code.",
    fullDescription: "Azure Machine Learning est une plateforme entreprise end-to-end pour le cycle de vie complet ML. Permet data scientists et ML engineers de build, train, deploy ML models plus rapidement avec AutoML, drag-and-drop Designer, notebooks Jupyter, support frameworks populaires (TensorFlow, PyTorch, scikit-learn), MLOps pipelines, model management, et responsible AI tools. Déploiement models comme REST APIs (Azure Container Instances, AKS), edge devices (Azure IoT Edge), ou batch inference. Includes compute management (CPU/GPU clusters auto-scaling), data labeling tools, experiment tracking, model explainability, fairness assessment. Integration Azure Synapse Analytics, Databricks, DevOps. Idéal pour: demand forecasting, fraud detection, predictive maintenance, recommendation engines, computer vision custom, NLP custom. SLA 99.9%, enterprise security (VNet, private endpoints, RBAC), compliance (HIPAA, ISO, SOC).",
    keyFeatures: [
      "AutoML - Automated model selection, hyperparameter tuning, feature engineering pour non-experts",
      "Designer - Drag-and-drop visual interface no-code pour build ML pipelines sans coding",
      "Notebooks - Jupyter notebooks intégrés avec compute clusters managed",
      "MLOps - CI/CD pipelines pour model training, testing, deployment automatisés",
      "Compute Management - Auto-scaling CPU/GPU clusters, spot instances cost-optimized",
      "Model Registry - Versioning, tracking, governance models avec lineage complet",
      "Endpoints - Deploy models REST API (real-time ou batch) avec auto-scaling",
      "Responsible AI - Model explainability, fairness assessment, error analysis, counterfactual what-if",
      "Data Labeling - Outils pour label images/text avec ML-assisted labeling",
      "Frameworks Support - TensorFlow, PyTorch, scikit-learn, XGBoost, LightGBM, ONNX",
      "Distributed Training - Multi-node, multi-GPU training pour deep learning large-scale",
      "Hyperparameter Tuning - Bayesian optimization, random search, grid search automatiques",
      "Feature Store - Centralized feature management avec versioning et reusability",
      "Monitoring - Model drift detection, data drift, performance degradation alerts",
      "Edge Deployment - Deploy models Azure IoT Edge pour inference on-device"
    ],
    benefits: [
      "Faster Time-to-Market - AutoML et Designer réduisent development time 80%",
      "MLOps Built-in - Pipelines CI/CD natifs vs manual workflows",
      "Cost Optimization - Auto-scaling compute, spot instances, pay-per-use",
      "Enterprise Ready - VNet, private endpoints, compliance (HIPAA, ISO, SOC 2)",
      "Responsible AI - Explainability, fairness tools built-in vs manual implementation",
      "Framework Agnostic - Support TensorFlow, PyTorch, scikit-learn, etc."
    ],
    useCases: [
      {
        title: "Demand Forecasting (Retail, Supply Chain)",
        description: "Prédiction demande produits avec time series models pour optimiser inventory, réduire stockouts/overstocks.",
        industries: ["Retail", "E-commerce", "Supply Chain", "Manufacturing"],
        businessImpact: "Inventory costs -25%, stockouts -40%, forecast accuracy +30%, working capital optimized"
      },
      {
        title: "Predictive Maintenance (Manufacturing, IoT)",
        description: "Prédiction failures equipment avec IoT sensor data pour maintenance proactive vs reactive.",
        industries: ["Manufacturing", "Energy", "Transportation", "Healthcare"],
        businessImpact: "Downtime -30%, maintenance costs -20%, equipment lifespan +15%, safety improved"
      },
      {
        title: "Fraud Detection (Finance, Insurance)",
        description: "Détection transactions frauduleuses real-time avec anomaly detection et classification models.",
        industries: ["Banking", "Insurance", "E-commerce", "Payments"],
        businessImpact: "Fraud losses -60%, false positives -50%, detection speed real-time, compliance améliorée"
      },
      {
        title: "Customer Churn Prediction",
        description: "Prédiction customers à risque churn pour retention campaigns proactives.",
        industries: ["Telecommunications", "SaaS", "Subscription Services"],
        businessImpact: "Retention rate +20%, churn -15%, campaign ROI +3x, customer lifetime value improved"
      },
      {
        title: "Recommendation Engines",
        description: "Product/content recommendations personnalisées basées user behavior, purchase history.",
        industries: ["E-commerce", "Streaming", "Media", "Retail"],
        businessImpact: "Conversion +25%, average order value +18%, engagement +40%, personalization at scale"
      },
      {
        title: "Computer Vision Custom (Quality Control)",
        description: "Détection defects produits manufacturing avec custom vision models trained vos images.",
        industries: ["Manufacturing", "Food & Beverage", "Pharmaceuticals"],
        businessImpact: "Defect detection +95% accuracy, inspection speed 10x faster, quality consistency improved"
      }
    ],
    targetIndustries: ["All", "Manufacturing", "Retail", "Finance", "Healthcare", "Telecommunications", "Energy", "Transportation"],
    idealCustomerSize: "SME, Enterprise",
    targetPersonas: ["Data Scientist", "ML Engineer", "Data Engineer", "CTO", "AI/ML Lead"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Compute (Training)",
        description: "VM instances CPU/GPU pour training models",
        pricing: "€0.10-€20/hour selon VM type (CPU: €0.10-2/h, GPU: €0.90-20/h), auto-scaling, spot instances -80% cost",
        bestFor: "Model training workloads, experimentation, development"
      },
      {
        tier: "Compute (Inference - Real-time)",
        description: "Managed endpoints pour model deployment real-time",
        pricing: "€0.10-€5/hour selon instance type + €0.10/GB outbound data",
        bestFor: "Production real-time predictions (web apps, APIs)"
      },
      {
        tier: "Compute (Inference - Batch)",
        description: "Batch scoring large datasets",
        pricing: "€0.10-€2/hour compute selon instance type",
        bestFor: "Batch predictions overnight, large datasets scoring"
      },
      {
        tier: "AutoML",
        description: "Automated ML runs",
        pricing: "Included - pay only compute used during training",
        bestFor: "Non-experts, rapid prototyping, baseline models"
      },
      {
        tier: "Designer",
        description: "Drag-and-drop ML pipelines",
        pricing: "Included - pay only compute used",
        bestFor: "No-code ML development, citizen data scientists"
      }
    ],
    estimatedCost: "Development: €100-500/mois, Production: €500-5000/mois selon scale workloads",
    implementationTime: "2-8 semaines selon use case complexity",
    complexity: "medium-high",
    prerequisites: [
      "Dataset prepared et labeled (pour supervised learning)",
      "Azure subscription avec credits/budget",
      "Connaissance ML basics (ou team avec data scientists)",
      "Pour production: MLOps processes defined"
    ],
    integrations: [
      "Azure Synapse Analytics (data preparation)",
      "Azure Databricks (collaborative data science)",
      "Azure DevOps (MLOps CI/CD)",
      "GitHub Actions (MLOps)",
      "Azure Data Lake Storage",
      "Azure Blob Storage",
      "Azure SQL Database",
      "Azure Cosmos DB",
      "Azure IoT Edge (edge deployment)",
      "Azure Kubernetes Service (AKS deployment)",
      "Power BI (model insights visualization)",
      "Azure Monitor (monitoring, alerts)"
    ],
    competitorComparison: [
      {
        competitor: "AWS SageMaker",
        ourAdvantages: [
          "AutoML plus accessible vs SageMaker Autopilot (interface plus intuitive)",
          "Designer drag-and-drop built-in (SageMaker Canvas separate, limited)",
          "Integration Azure ecosystem (Synapse, Power BI, DevOps) seamless",
          "Responsible AI tools built-in (SageMaker Clarify separate)"
        ],
        theirWeaknesses: [
          "SageMaker Canvas no-code limité vs Azure Designer",
          "AutoML SageMaker Autopilot moins features",
          "Responsible AI nécessite SageMaker Clarify séparé"
        ]
      },
      {
        competitor: "Google Vertex AI",
        ourAdvantages: [
          "AutoML Azure plus mature et comprehensive",
          "MLOps integration Azure DevOps native (Vertex AI pipelines complex)",
          "Pricing plus transparent et prévisible",
          "Enterprise features (VNet, private endpoints) plus simples"
        ],
        theirWeaknesses: [
          "Vertex AI AutoML limited model types vs Azure",
          "MLOps requires separate tools (Kubeflow)",
          "Enterprise security setup plus complexe"
        ]
      },
      {
        competitor: "Databricks ML",
        ourAdvantages: [
          "AutoML et Designer no-code built-in (Databricks nécessite coding)",
          "Lower cost entry point (Databricks expensive)",
          "Easier for non-experts (AutoML, Designer)",
          "Managed compute simpler"
        ],
        theirWeaknesses: [
          "Databricks nécessite Spark knowledge",
          "No AutoML built-in (manual MLflow)",
          "Higher costs compute"
        ]
      }
    ],
    salesPriority: 9,
    isActive: true,
    isFeatured: true,
    keywords: [
      "machine learning",
      "ml",
      "automl",
      "mlops",
      "data science",
      "predictive analytics",
      "ai platform",
      "model training",
      "deep learning"
    ],
    tags: ["AI-ML", "ML-Platform", "AutoML", "MLOps", "Data-Science", "Enterprise"],
    relatedSolutions: ["azure-synapse-analytics", "azure-databricks", "azure-cognitive-services", "azure-iot-edge"],
    technicalSpecs: {
      supportedFrameworks: ["TensorFlow", "PyTorch", "scikit-learn", "XGBoost", "LightGBM", "Keras", "ONNX", "Spark MLlib"],
      computeOptions: ["CPU VMs", "GPU VMs (NVIDIA)", "FPGA", "Auto-scaling clusters", "Spot instances"],
      deploymentTargets: ["REST API (real-time)", "Batch endpoints", "Azure IoT Edge", "Azure Functions", "AKS"],
      mlTasksSupported: ["Classification", "Regression", "Forecasting", "Computer Vision", "NLP", "Recommendation", "Anomaly Detection", "Clustering"],
      responsibleAI: ["Model explainability (SHAP, LIME)", "Fairness assessment", "Error analysis", "Counterfactual what-if", "Causal inference"]
    },
    securityFeatures: [
      "VNet integration (private networking)",
      "Private endpoints support",
      "Azure AD authentication",
      "RBAC granulaire",
      "Customer-managed encryption keys (Azure Key Vault)",
      "Encryption at-rest et in-transit",
      "Audit logging (Azure Monitor)",
      "Data residency (regional deployment)",
      "Compliance: HIPAA, ISO 27001, SOC 2, GDPR, FedRAMP"
    ],
    complianceCerts: ["ISO 27001", "SOC 2 Type 2", "HIPAA", "GDPR", "FedRAMP", "PCI DSS"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/machine-learning/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/machine-learning/",
    demoUrl: "https://azure.microsoft.com/en-us/products/machine-learning/"
  },

  // 2. AZURE AI FOUNDRY
  {
    name: "azure-ai-foundry",
    officialName: "Azure AI Foundry",
    category: "ai-ml",
    subcategory: "ai-platform",
    shortDescription: "Unified AI development platform pour build, test, deploy AI applications avec access 11,000+ models (OpenAI, Meta, Mistral, etc.), agent service, multi-agent orchestration, et responsible AI tools.",
    fullDescription: "Azure AI Foundry (anciennement Azure AI Studio) est la plateforme unifiée Microsoft pour AI development lifecycle complet. Provides web-based GUI pour build, test, deploy AI applications avec: access catalog 11,000+ models (OpenAI GPT-4, Meta Llama, Mistral, DeepSeek, NVIDIA, Hugging Face), agent service GA avec Model Context Protocol (MCP), multi-agent orchestration, Prompt Flow designer, RAG (retrieval-augmented generation) integration avec Azure AI Search, responsible AI tools (content safety, groundedness detection), model fine-tuning, evaluation tools, deployment options. Integrates Azure OpenAI, Azure AI Services, Azure ML, enterprise connectors. New in 2025: o3-pro reasoning model, Sora video generation, DeepSeek-R1 open-source reasoning. Idéal pour: building copilots, AI agents, chatbots, RAG applications, custom AI apps avec enterprise data. Low-code/pro-code flexibility.",
    keyFeatures: [
      "Model Catalog - Access 11,000+ models: OpenAI (GPT-4o, o1, o3-pro), Meta Llama, Mistral, DeepSeek, Stability AI, NVIDIA, Hugging Face",
      "Agent Service (GA) - Build AI agents avec Model Context Protocol (MCP) support, standardized backend integration",
      "Multi-Agent Orchestration - Coordinate multiple specialized agents pour complex tasks",
      "Prompt Flow - Visual designer pour LLM workflows (chains, prompts, retrieval, evaluation)",
      "RAG Integration - Seamless connection Azure AI Search pour grounding LLMs sur vos données proprietary",
      "Model Fine-Tuning - Customize models (GPT, Llama, etc.) sur vos datasets",
      "Evaluation Tools - Test model performance, accuracy, groundedness, relevance, safety",
      "Responsible AI - Content Safety filters, groundedness detection, jailbreak protection, harmful content blocking",
      "Deployment Options - Deploy models API endpoints, Azure Container Apps, Azure Functions, AKS",
      "Enterprise Connectors - Connect SharePoint, OneDrive, SQL, Dynamics, custom data sources",
      "Prompt Engineering Tools - Test, version, optimize prompts avec A/B testing",
      "Monitoring & Analytics - Track usage, costs, performance, errors production deployments",
      "Collaboration - Team workspaces, shared resources, version control",
      "New Models 2025 - o3-pro (enterprise reasoning), Sora (video generation), DeepSeek-R1 (open-source reasoning)"
    ],
    benefits: [
      "Model Choice - 11,000+ models vs lock-in single provider",
      "Faster Development - Low-code Prompt Flow vs manual coding",
      "Enterprise Ready - Responsible AI, content safety, compliance built-in",
      "RAG Simplified - Azure AI Search integration turnkey vs complex setup",
      "Agent Service - Build AI agents with MCP standard vs custom frameworks",
      "Unified Platform - One place pour AI development vs multiple tools"
    ],
    useCases: [
      {
        title: "Enterprise Copilots (Microsoft 365 style)",
        description: "Build custom copilots pour employees: document Q&A, meeting summarization, email drafting, data analysis.",
        industries: ["All"],
        businessImpact: "Productivity +30%, self-service knowledge +80%, meeting time reduced, email efficiency improved"
      },
      {
        title: "Customer Service AI Agents",
        description: "AI agents autonomous pour customer support: ticket routing, FAQ answers, order tracking, escalation intelligent.",
        industries: ["E-commerce", "Banking", "Telecommunications", "Insurance"],
        businessImpact: "Support costs -50%, resolution 24/7, customer satisfaction +40%, agent productivity +60%"
      },
      {
        title: "RAG Knowledge Bases",
        description: "Chatbots grounded sur vos documents proprietary (policies, manuals, research) avec Azure AI Search RAG.",
        industries: ["Legal", "Healthcare", "Finance", "Consulting"],
        businessImpact: "Knowledge discovery 10x faster, hallucinations reduced 90%, expertise democratized, compliance assured"
      },
      {
        title: "Multi-Agent Workflows",
        description: "Orchestrate specialized agents: research agent + writing agent + review agent pour content creation automatique.",
        industries: ["Marketing", "Media", "Research"],
        businessImpact: "Content production +500%, quality consistent, time-to-publish reduced 80%"
      },
      {
        title: "Video Generation with Sora (NEW 2025)",
        description: "Generate marketing videos, product demos, training content automatiquement avec Sora model.",
        industries: ["Marketing", "E-learning", "Media"],
        businessImpact: "Video production costs -70%, rapid A/B testing, personalization at scale"
      }
    ],
    targetIndustries: ["All", "Technology", "Professional Services", "Healthcare", "Finance", "E-commerce", "Manufacturing"],
    idealCustomerSize: "SME, Enterprise",
    targetPersonas: ["AI Developer", "Data Scientist", "Product Manager", "CTO", "Business Analyst"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Platform Usage",
        description: "Azure AI Foundry platform access (free)",
        pricing: "FREE - pay only pour models, compute, storage utilisés",
        bestFor: "All users - platform itself no charge"
      },
      {
        tier: "Model Consumption",
        description: "Pay-per-use models (OpenAI, Llama, Mistral, etc.)",
        pricing: "Variable selon model - GPT-4o: $2.50-10/1M tokens, Llama 3: $0.20-0.80/1M tokens, etc.",
        bestFor: "Production AI applications selon model choix"
      },
      {
        tier: "Agent Service",
        description: "AI agents avec MCP orchestration",
        pricing: "Pay model tokens used + orchestration compute (minimal)",
        bestFor: "Multi-agent applications, autonomous AI workflows"
      },
      {
        tier: "Storage & Compute",
        description: "Data storage, compute pour fine-tuning, evaluations",
        pricing: "Azure Storage standard rates + compute hourly (€0.10-2/hour)",
        bestFor: "Custom model fine-tuning, large evaluations"
      }
    ],
    estimatedCost: "POC: €50-200/mois, Production: €500-5000/mois selon model usage volume",
    implementationTime: "1-4 semaines",
    complexity: "low-medium",
    prerequisites: [
      "Azure subscription avec credits",
      "Use case defined (copilot, chatbot, agent, RAG, etc.)",
      "Data sources prepared (pour RAG: documents, knowledge base)",
      "Pour agents: backend APIs/systems à intégrer"
    ],
    integrations: [
      "Azure OpenAI Service",
      "Azure AI Search (RAG)",
      "Azure Cognitive Services",
      "Azure ML (custom models)",
      "SharePoint Online",
      "OneDrive for Business",
      "Microsoft 365 (Teams, Outlook)",
      "Azure SQL Database",
      "Azure Cosmos DB",
      "Azure Functions (serverless deployment)",
      "Azure Container Apps",
      "Azure Kubernetes Service",
      "GitHub (version control)",
      "Model Context Protocol (MCP) - any backend"
    ],
    competitorComparison: [
      {
        competitor: "AWS Bedrock",
        ourAdvantages: [
          "11,000+ models vs Bedrock ~10 models (Claude, Llama, Titan)",
          "OpenAI models exclusifs (GPT-4, DALL-E, Sora) - AWS no access",
          "Prompt Flow visual designer vs Bedrock manual coding",
          "Agent Service built-in vs AWS needs Lambda + Step Functions custom"
        ],
        theirWeaknesses: [
          "Limited model selection (no OpenAI)",
          "No low-code interface (manual coding required)",
          "Agent orchestration nécessite custom build"
        ]
      },
      {
        competitor: "Google Vertex AI",
        ourAdvantages: [
          "OpenAI models access (GPT-4, DALL-E, Sora)",
          "Agent Service MCP standard vs Vertex AI Agents preview",
          "Microsoft ecosystem integration (Teams, Office 365)",
          "Prompt Flow simpler vs Vertex AI Pipelines"
        ],
        theirWeaknesses: [
          "No OpenAI models (Gemini only)",
          "Agent Service limited",
          "Less enterprise integration (no Office 365)"
        ]
      }
    ],
    salesPriority: 10,
    isActive: true,
    isFeatured: true,
    keywords: [
      "ai foundry",
      "ai studio",
      "copilot",
      "ai agents",
      "prompt flow",
      "rag",
      "llm platform",
      "ai development",
      "sora",
      "multi-agent"
    ],
    tags: ["AI-ML", "AI-Platform", "Copilot", "Agents", "RAG", "LLM", "Enterprise"],
    relatedSolutions: ["azure-openai-service", "azure-ai-search", "azure-machine-learning", "azure-cognitive-services"],
    technicalSpecs: {
      availableModels: "11,000+ models including: OpenAI (GPT-4o, o1, o3-pro, DALL-E, Sora), Meta Llama 3.x, Mistral Large, DeepSeek-R1, Stability AI, NVIDIA NeMo, Hugging Face",
      agentCapabilities: "Model Context Protocol (MCP), multi-agent orchestration, autonomous task execution, backend integration standard",
      deploymentOptions: ["REST API endpoints", "Azure Container Apps", "Azure Functions", "Azure Kubernetes Service", "Edge deployment"],
      evaluationMetrics: ["Groundedness", "Relevance", "Coherence", "Fluency", "Safety (harmful content)", "Custom metrics"]
    },
    securityFeatures: [
      "Content Safety filtering (hate, violence, sexual, self-harm)",
      "Groundedness detection (factual accuracy)",
      "Jailbreak protection",
      "Prompt injection detection",
      "Azure AD authentication",
      "RBAC granulaire",
      "Private endpoints support",
      "Customer-managed encryption keys",
      "Audit logging",
      "Data residency options",
      "Compliance: HIPAA, ISO, SOC 2, GDPR"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "GDPR"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/ai-foundry/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/ai-services/",
    demoUrl: "https://ai.azure.com/"
  },

  // 3. AZURE COGNITIVE SERVICES - VISION
  {
    name: "azure-cognitive-services-vision",
    officialName: "Azure AI Vision (Cognitive Services)",
    category: "ai-ml",
    subcategory: "computer-vision",
    shortDescription: "Suite computer vision APIs pour analyze images/videos, detect objects/faces/emotions, OCR text extraction, spatial analysis, custom vision models - no ML expertise required.",
    fullDescription: "Azure AI Vision (part of Cognitive Services) provides pretrained computer vision APIs pour analyze images et videos sans ML expertise. Includes: Computer Vision API (tagging, captions, object detection, adult content, celebrities, landmarks), Face API (detection, recognition, emotions, age/gender, verification, identification), Custom Vision (train custom image classification/object detection models), Form Recognizer/Document Intelligence (OCR invoices, receipts, IDs, custom documents), Video Analyzer (video indexing, insights extraction), Spatial Analysis (people counting, social distancing in video streams). Use cases: retail (inventory management, checkout-free stores), manufacturing (quality control, safety compliance), healthcare (medical imaging), security (facial recognition access), documents (invoice processing). Simply call REST APIs - no data scientists needed.",
    keyFeatures: [
      "Computer Vision API - Image analysis: tags, captions, objects, brands, faces, colors, adult content, celebrities, landmarks",
      "Face API - Face detection, recognition, emotions, age/gender estimation, verification, identification, grouping",
      "Custom Vision - Train custom image classification ou object detection models avec minimal labeled images (50+)",
      "OCR (Read API) - Extract printed/handwritten text from images, PDFs, scanned documents (100+ languages)",
      "Form Recognizer - Prebuilt models pour invoices, receipts, business cards, IDs, custom documents structure extraction",
      "Spatial Analysis - Video analytics: people counting, queue management, social distancing monitoring, zone occupancy",
      "Image Moderation - Detect adult, racy, gory content automatiquement pour content moderation",
      "Video Indexer - Extract insights videos: transcripts, keywords, faces, emotions, topics, scenes, brands",
      "Celebrity Recognition - Identify 200,000+ celebrities in images",
      "Landmark Recognition - Identify famous landmarks worldwide",
      "Brand Detection - Detect 1,000+ brands in images (logos)",
      "Thumbnail Generation - Smart cropping pour thumbnails optimized",
      "Image Search - Visual search similar images (reverse image search)"
    ],
    benefits: [
      "No ML Expertise - REST APIs pretrained vs train models custom",
      "Rapid Deployment - Integrate APIs in hours vs months ML development",
      "Pre-trained Accuracy - Models trained millions images Microsoft",
      "Custom Vision Easy - Train custom models 50 images vs 10,000+ traditional",
      "Multilingual OCR - 100+ languages support",
      "Cost-Effective - Pay-per-call vs infrastructure ML teams"
    ],
    useCases: [
      {
        title: "Retail - Checkout-Free Stores (Amazon Go style)",
        description: "Vision APIs detect products taken/returned shelves, track customers, calculate bill automatically sans cashiers.",
        industries: ["Retail", "Grocery"],
        businessImpact: "Labor costs -60%, checkout time eliminated, customer experience improved, theft reduced"
      },
      {
        title: "Manufacturing - Quality Control Automated",
        description: "Custom Vision detect product defects (scratches, dents, misalignment) faster, more accurate than human inspection.",
        industries: ["Manufacturing", "Automotive", "Electronics"],
        businessImpact: "Defect detection +99% accuracy, inspection speed 10x faster, labor costs -70%, quality consistent"
      },
      {
        title: "Healthcare - Medical Imaging Analysis",
        description: "Vision APIs analyze X-rays, MRIs, CT scans pour detect anomalies, assist radiologists diagnostic.",
        industries: ["Healthcare"],
        businessImpact: "Diagnostic accuracy improved, radiologist efficiency +40%, early detection diseases, second opinion automated"
      },
      {
        title: "Finance - Document Processing (Invoices, Receipts)",
        description: "Form Recognizer extract data invoices, receipts, expense reports automatically pour accounts payable automation.",
        industries: ["Finance", "Accounting"],
        businessImpact: "Invoice processing time -90%, data entry errors -95%, costs -80%, payment cycles faster"
      },
      {
        title: "Security - Facial Recognition Access Control",
        description: "Face API identify employees, visitors pour building access, time tracking, security monitoring.",
        industries: ["Corporate", "Government", "Events"],
        businessImpact: "Touchless access, security improved, time theft eliminated, visitor tracking automated"
      },
      {
        title: "Retail - Social Distancing Monitoring (COVID)",
        description: "Spatial Analysis count people, monitor social distancing, detect overcrowding in stores.",
        industries: ["Retail", "Hospitality"],
        businessImpact: "Compliance regulations, safety improved, capacity management, customer confidence"
      }
    ],
    targetIndustries: ["Retail", "Manufacturing", "Healthcare", "Finance", "Security", "Media", "Hospitality"],
    idealCustomerSize: "All",
    targetPersonas: ["Developer", "Product Manager", "IT Manager", "Operations Manager"],
    pricingModel: "pay-per-call",
    pricingTiers: [
      {
        tier: "Computer Vision (Free)",
        description: "20 calls/minute, 5,000 calls/month",
        pricing: "FREE",
        bestFor: "Testing, development, POC"
      },
      {
        tier: "Computer Vision (Standard)",
        description: "Image analysis, OCR",
        pricing: "€0.80/1,000 calls (0-1M), €0.60/1K (1M-10M), €0.45/1K (10M+)",
        bestFor: "Production applications"
      },
      {
        tier: "Face API (Free)",
        description: "20 calls/minute, 30,000 calls/month",
        pricing: "FREE",
        bestFor: "Testing, development"
      },
      {
        tier: "Face API (Standard)",
        description: "Face detection, recognition",
        pricing: "€0.80/1,000 faces (0-1M), €0.60/1K (1M-10M), €0.30/1K (10M+), Storage: €0.01/1K faces/month",
        bestFor: "Production facial recognition apps"
      },
      {
        tier: "Custom Vision (Free)",
        description: "2 projects, 1 hour training/month",
        pricing: "FREE",
        bestFor: "Learning, POC"
      },
      {
        tier: "Custom Vision (Standard)",
        description: "Custom image classification/object detection",
        pricing: "Training: €16/hour, Predictions: €1.60/1,000 calls, Storage: €0.50/1K images/month",
        bestFor: "Production custom vision models"
      },
      {
        tier: "Form Recognizer",
        description: "Document intelligence (invoices, receipts, custom)",
        pricing: "Prebuilt models: €0.008/page, Custom models: €0.032/page, Training: FREE",
        bestFor: "Invoice processing, document automation"
      }
    ],
    estimatedCost: "POC: Free, Production low-volume: €50-200/mois, High-volume: €500-2000/mois",
    implementationTime: "1-2 semaines",
    complexity: "low",
    prerequisites: [
      "Images/videos data pour analyze",
      "Azure Cognitive Services resource created",
      "API keys obtained",
      "Application development (REST API integration)",
      "Pour Custom Vision: minimum 50 labeled images per class"
    ],
    integrations: [
      "Azure Blob Storage (image storage)",
      "Azure Functions (serverless triggers)",
      "Azure Logic Apps (workflow automation)",
      "Power Automate (business process automation)",
      "Power Apps (low-code apps)",
      "Azure Stream Analytics (video streams)",
      "Azure IoT Edge (edge deployment)",
      "Azure Cognitive Search (search images)",
      "Mobile apps (iOS, Android SDKs)",
      "Web apps (JavaScript SDK)"
    ],
    competitorComparison: [
      {
        competitor: "AWS Rekognition",
        ourAdvantages: [
          "Custom Vision simpler (50 images vs 1000+ AWS)",
          "Form Recognizer prebuilt models (invoices, receipts) - AWS needs custom",
          "Spatial Analysis built-in (AWS separate Panorama)",
          "Better OCR accuracy 100+ languages"
        ],
        theirWeaknesses: [
          "Custom models require more training data",
          "No prebuilt document models (invoices, etc.)",
          "Spatial analysis needs separate hardware (Panorama)"
        ]
      },
      {
        competitor: "Google Cloud Vision",
        ourAdvantages: [
          "Form Recognizer superior document extraction",
          "Custom Vision easier (less data required)",
          "Spatial Analysis for video (Google limited)",
          "Better integration Microsoft ecosystem"
        ],
        theirWeaknesses: [
          "Document AI less comprehensive",
          "Custom models more complex training",
          "Video analytics limited"
        ]
      }
    ],
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: [
      "computer vision",
      "image recognition",
      "face recognition",
      "ocr",
      "document intelligence",
      "form recognizer",
      "custom vision",
      "spatial analysis",
      "video analytics"
    ],
    tags: ["AI-ML", "Computer-Vision", "OCR", "Face-Recognition", "Image-Analysis", "APIs"],
    relatedSolutions: ["azure-cognitive-services-speech", "azure-cognitive-services-language", "azure-machine-learning"],
    technicalSpecs: {
      supportedFormats: ["JPEG", "PNG", "BMP", "GIF", "TIFF", "PDF", "Video: MP4, AVI, MOV"],
      ocrLanguages: "100+ languages including English, Spanish, French, German, Chinese, Arabic, etc.",
      faceAttributes: ["Age", "Gender", "Emotion", "Glasses", "Hair color", "Facial hair", "Accessories"],
      customVisionMinImages: "50 images per class (classification), 15 images per object (detection)",
      apiProtocol: "REST APIs + SDKs (.NET, Python, Java, JavaScript, Go)"
    },
    securityFeatures: [
      "Azure AD authentication",
      "API key authentication (subscription keys)",
      "VNet support (selected services)",
      "Private endpoints (selected services)",
      "Encryption at-rest",
      "Encryption in-transit (HTTPS)",
      "RBAC granulaire",
      "Audit logging",
      "Data residency options",
      "No data retention for predictions (privacy)",
      "Compliance: HIPAA, ISO 27001, SOC 2, GDPR"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "GDPR"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/cognitive-services/computer-vision/",
    demoUrl: "https://azure.microsoft.com/en-us/products/ai-services/ai-vision"
  }

];

// Fonction principale
async function main() {
  console.log(`🚀 Adding ${aiMLSolutions.length} Azure AI & Machine Learning solutions...\n`);
  console.log(`📋 Solutions à ajouter:`);
  aiMLSolutions.forEach((sol, idx) => {
    console.log(`   ${idx + 1}. ${sol.officialName} (${sol.subcategory})`);
  });
  console.log('');

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (const solution of aiMLSolutions) {
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

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n\n${'='.repeat(80)}`);
  console.log(`📊 SUMMARY:`);
  console.log(`   ✅ Success: ${successCount}/${aiMLSolutions.length}`);
  console.log(`   ❌ Failed: ${failCount}/${aiMLSolutions.length}`);

  if (errors.length > 0) {
    console.log(`\n❌ Errors:`);
    errors.forEach(err => {
      console.log(`   - ${err.solution}: ${err.error}`);
    });
  }

  console.log(`\n✨ Azure AI & Machine Learning category enriched!`);
  console.log(`\nℹ️  Note: Ce script ajoute 3 solutions principales. Exécutez également:`);
  console.log(`   - add-azure-ai-speech.js (Speech Services)`);
  console.log(`   - add-azure-ai-language.js (Language & Translator)`);
  console.log(`   - add-azure-ai-decision.js (Decision Services)`);
  console.log(`   - add-azure-bot-services.js (Bot Service & Applied AI)`);
}

main();
