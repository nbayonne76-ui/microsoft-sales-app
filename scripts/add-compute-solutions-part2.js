/**
 * Script pour ajouter les solutions Azure Compute restantes (partie 2)
 * AKS, ACI, Batch, Service Fabric, Dedicated Host
 * Exécuter avec: node scripts/add-compute-solutions-part2.js
 */

const computeSolutionsPart2 = [
  // 4. Azure Kubernetes Service (AKS)
  {
    name: "azure-kubernetes-service",
    officialName: "Azure Kubernetes Service (AKS)",
    category: "compute",
    subcategory: "container-orchestration",
    shortDescription: "Service Kubernetes managé pour déployer, gérer et scaler des applications containerisées avec orchestration automatique, load balancing, et CI/CD intégré.",
    fullDescription: "Azure Kubernetes Service (AKS) est un service Kubernetes fully managed qui simplifie le déploiement et la gestion de clusters Kubernetes. Microsoft gère le control plane (gratuit), vous gérez uniquement les worker nodes. AKS automatise les mises à jour Kubernetes, le scaling des nodes, le monitoring, et l'intégration avec l'écosystème Azure (Azure AD, ACR, Monitor, Policy). Support des microservices, applications cloud-native, CI/CD avec Azure DevOps/GitHub Actions, service mesh (Istio, Linkerd), et multi-region deployments. Idéal pour modernisation applicative, migration vers containers, et architecture microservices complexes.",
    keyFeatures: [
      "Control plane Kubernetes fully managed (gratuit - Microsoft gère)",
      "Auto-scaling: Horizontal Pod Autoscaler (HPA) et Cluster Autoscaler",
      "Load balancing intégré avec Azure Load Balancer ou Application Gateway",
      "Azure Container Registry (ACR) integration pour images privées",
      "Azure AD integration pour RBAC Kubernetes",
      "Azure Monitor pour containers avec Log Analytics",
      "Azure Policy pour governance et compliance",
      "Virtual nodes (ACI integration) pour burst scaling",
      "Multi-region clusters avec Azure Traffic Manager",
      "Support GPU nodes pour workloads AI/ML",
      "Windows et Linux node pools sur même cluster",
      "CI/CD natif avec Azure DevOps et GitHub Actions",
      "Service mesh support (Istio, Linkerd, Consul)",
      "Private clusters avec Private Link",
      "Azure Firewall integration pour egress traffic control"
    ],
    benefits: [
      "Control plane gratuit - Paiement uniquement des worker nodes",
      "Kubernetes managé - Microsoft gère upgrades, patches, disponibilité",
      "Scaling avancé - HPA, Cluster Autoscaler, Virtual Nodes (burst to serverless)",
      "Sécurité enterprise - Azure AD RBAC, Policy, Private clusters, Network policies",
      "DevOps ready - CI/CD intégré, GitOps (Flux), Helm charts",
      "Monitoring complet - Azure Monitor, Container Insights, Log Analytics inclus"
    ],
    useCases: [
      {
        title: "Microservices architecture",
        description: "Applications décomposées en microservices containerisés avec orchestration Kubernetes.",
        industries: ["Technology", "Finance", "E-commerce"],
        businessImpact: "Agilité développement +60%, time-to-market réduit de 50%"
      },
      {
        title: "Cloud-native applications",
        description: "Applications modernes scalables, resilientes, avec CI/CD automatisé.",
        industries: ["SaaS", "Technology", "Media"],
        businessImpact: "Déploiements 10x/jour, rollback instantané, zero downtime"
      },
      {
        title: "AI/ML workloads",
        description: "Training et inference avec GPU nodes, scaling automatique selon charge.",
        industries: ["Research", "Healthcare", "Finance"],
        businessImpact: "Coûts GPU optimisés, scaling élastique, performance garantie"
      },
      {
        title: "Modernisation applications legacy",
        description: "Containerisation et migration d'applications monolithiques vers microservices.",
        industries: ["Finance", "Healthcare", "Manufacturing"],
        businessImpact: "Réduction coûts infrastructure 40%, agilité améliorée"
      }
    ],
    targetIndustries: ["Technology", "Finance", "E-commerce", "SaaS", "Healthcare", "Media", "Telecommunications"],
    idealCustomerSize: "SME, Enterprise",
    targetPersonas: ["Cloud Architect", "DevOps Engineer", "Platform Engineer", "CTO", "Kubernetes Administrator"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Control Plane",
        description: "Kubernetes control plane fully managed",
        pricing: "GRATUIT - Microsoft gère sans frais",
        bestFor: "Tous clusters AKS"
      },
      {
        tier: "Worker Nodes",
        description: "VMs pour les pods (facturation identique aux VMs standards)",
        pricing: "€0.096/heure (D2s v3) à €4.608/heure (D96s v5) selon taille",
        bestFor: "Production workloads"
      },
      {
        tier: "Virtual Nodes (ACI)",
        description: "Burst scaling serverless via Azure Container Instances",
        pricing: "€0.0000125/seconde (1 vCPU, 1GB RAM)",
        bestFor: "Pics de charge temporaires, dev/test"
      },
      {
        tier: "Uptime SLA",
        description: "99.95% SLA pour control plane (optionnel)",
        pricing: "€65/mois par cluster",
        bestFor: "Production critiques nécessitant SLA contractuel"
      }
    ],
    estimatedCost: "Control plane gratuit + coût nodes (ex: 3 nodes D4s v3 = €415/mois)",
    implementationTime: "4 heures à 2 semaines selon complexité application",
    complexity: "high",
    prerequisites: [
      "Connaissance Kubernetes (pods, deployments, services, ingress)",
      "Applications containerisées (Docker images)",
      "Stratégie networking (CNI plugin, network policies)",
      "Compte Azure avec quota suffisant pour VMs"
    ],
    integrations: [
      "Azure Container Registry (ACR)",
      "Azure Active Directory",
      "Azure Monitor",
      "Azure Policy",
      "Azure DevOps",
      "GitHub Actions",
      "Azure Application Gateway (Ingress)",
      "Azure Load Balancer",
      "Azure Virtual Network",
      "Azure Key Vault",
      "Azure Disk Storage",
      "Azure Files",
      "Helm",
      "Prometheus & Grafana"
    ],
    competitorComparison: [
      {
        competitor: "AWS EKS",
        ourAdvantages: [
          "Control plane GRATUIT (vs $0.10/heure EKS = $73/mois)",
          "Virtual Nodes pour burst scaling serverless (EKS nécessite Fargate séparé)",
          "Intégration Azure AD plus simple que AWS IAM for Kubernetes",
          "Azure Monitor inclus vs CloudWatch payant",
          "Windows containers support meilleur (first-party Microsoft)"
        ],
        theirWeaknesses: [
          "Control plane payant ($73/mois/cluster)",
          "Fargate configuration complexe pour serverless",
          "Coûts monitoring additionnels (CloudWatch)"
        ]
      },
      {
        competitor: "Google GKE",
        ourAdvantages: [
          "Meilleure intégration enterprise (AD, RBAC, governance)",
          "Support Windows containers (GKE Windows nodes limité)",
          "Azure Policy pour compliance intégrée",
          "Uptime SLA optionnel (GKE Autopilot mandatory)"
        ],
        theirWeaknesses: [
          "GKE Autopilot impose contraintes (moins flexibilité)",
          "Support Windows containers immature",
          "Options enterprise governance limitées"
        ]
      }
    ],
    salesPriority: 9,
    isActive: true,
    isFeatured: true,
    keywords: ["kubernetes", "aks", "containers", "microservices", "k8s", "orchestration", "docker", "cloud-native"],
    tags: ["Kubernetes", "Containers", "Microservices", "Cloud-Native", "DevOps", "PaaS"],
    relatedSolutions: ["azure-container-instances", "azure-container-registry", "azure-app-service"],
    technicalSpecs: {
      kubernetesVersions: "Dernières 3 versions minor Kubernetes",
      maxNodes: "5000 nodes par cluster",
      maxPods: "250 pods per node (default 30)",
      cniPlugins: ["Azure CNI", "Kubenet", "Azure CNI Overlay"],
      supportedOS: ["Linux", "Windows Server 2019/2022"]
    },
    securityFeatures: [
      "Azure AD RBAC integration",
      "Pod security policies",
      "Network policies (Calico, Azure)",
      "Private clusters avec Private Link",
      "Azure Key Vault CSI driver",
      "Azure Policy pour compliance",
      "Secrets encryption at-rest",
      "Azure Firewall integration",
      "Azure Security Center for containers"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "PCI DSS", "HIPAA", "GDPR", "FedRAMP"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/aks/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/",
    demoUrl: "https://azure.microsoft.com/en-us/products/kubernetes-service/"
  },

  // 5. Azure Container Instances (ACI)
  {
    name: "azure-container-instances",
    officialName: "Azure Container Instances (ACI)",
    category: "compute",
    subcategory: "serverless-containers",
    shortDescription: "Service serverless pour exécuter des containers Docker sans gérer VMs ou orchestrateurs. Démarrage en secondes, facturation à la seconde.",
    fullDescription: "Azure Container Instances (ACI) permet d'exécuter des containers Docker isolés sans gérer de VMs ou clusters Kubernetes. Déploiement ultra-rapide (< 10 secondes), facturation à la seconde pour usage exact. Idéal pour workloads court-terme, batch jobs, dev/test, CI/CD agents, event-driven tasks. ACI peut être utilisé standalone ou comme burst capacity pour AKS via Virtual Nodes. Support Linux et Windows containers, custom CPU/RAM, volumes persistents (Azure Files), networking (VNet integration, public IPs), et secrets management.",
    keyFeatures: [
      "Démarrage containers en secondes (< 10s)",
      "Facturation à la seconde (granularité ultra-fine)",
      "Pas de VMs à gérer - Serverless containers",
      "Support Linux et Windows containers",
      "Custom CPU et RAM (jusqu'à 4 vCPU, 16GB RAM par container)",
      "Container groups pour multi-container pods",
      "VNet integration pour networking privé",
      "Azure Files mounting pour volumes persistents",
      "Public IP ou private IP assignment",
      "GPU support pour AI/ML workloads",
      "Restart policies (Always, Never, OnFailure)",
      "Environment variables et secrets management",
      "Integration avec Azure Monitor pour logging"
    ],
    benefits: [
      "Ultra-rapide - Déploiement en secondes vs minutes (VMs)",
      "Coût optimal - Facturation à la seconde, pas de minimum",
      "Zero management - Aucune infrastructure à gérer",
      "Flexibilité - Custom CPU/RAM par container",
      "Isolation - Containers exécutés dans environnement isolé",
      "Simple - Pas de complexité Kubernetes pour workloads simples"
    ],
    useCases: [
      {
        title: "Batch processing et jobs ponctuels",
        description: "Tâches de traitement court-terme, data processing, ETL, report generation.",
        industries: ["All"],
        businessImpact: "Coûts optimisés (paiement exact), exécution rapide"
      },
      {
        title: "CI/CD build agents",
        description: "Agents de build éphémères pour pipelines CI/CD, scaling automatique selon besoins.",
        industries: ["Technology", "Software Development"],
        businessImpact: "Réduction coûts CI/CD 70%, scaling illimité"
      },
      {
        title: "Dev/Test environments",
        description: "Environnements de développement rapides, destruction après usage.",
        industries: ["All"],
        businessImpact: "Time-to-environment < 1 minute, coûts minimaux"
      },
      {
        title: "Event-driven tasks",
        description: "Containers déclenchés par événements (file upload, queue message).",
        industries: ["All"],
        businessImpact: "Automatisation complète, pas de resources idle"
      }
    ],
    targetIndustries: ["All", "Technology", "Software Development", "Finance", "Healthcare"],
    idealCustomerSize: "All",
    targetPersonas: ["Developer", "DevOps Engineer", "Cloud Architect", "Data Engineer"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Linux containers",
        description: "Facturation par seconde: vCPU + RAM",
        pricing: "€0.0000125/seconde (1 vCPU) + €0.0000014/seconde (1GB RAM)",
        bestFor: "Workloads Linux, batch jobs, dev/test"
      },
      {
        tier: "Windows containers",
        description: "Facturation par seconde avec premium Windows",
        pricing: "€0.0000223/seconde (1 vCPU) + €0.0000025/seconde (1GB RAM)",
        bestFor: "Applications .NET Windows, legacy Windows apps"
      },
      {
        tier: "GPU containers",
        description: "Containers avec GPU pour AI/ML",
        pricing: "€0.000988/seconde (1 GPU K80) + vCPU/RAM",
        bestFor: "AI/ML inference, rendering, simulations"
      }
    ],
    estimatedCost: "~€31/mois pour 1 vCPU + 1GB RAM running 24/7 (mais usage typique << 24/7)",
    implementationTime: "10 minutes",
    complexity: "low",
    prerequisites: [
      "Container image Docker (sur Docker Hub, ACR, ou autre registry)",
      "Compte Azure actif",
      "Connaissance basique Docker"
    ],
    integrations: [
      "Azure Container Registry (ACR)",
      "Azure Virtual Network",
      "Azure Files (volumes persistents)",
      "Azure Monitor",
      "Azure Key Vault (secrets)",
      "Azure Logic Apps (orchestration)",
      "Azure Event Grid (event-driven)",
      "Azure DevOps",
      "Docker Hub"
    ],
    competitorComparison: [
      {
        competitor: "AWS Fargate",
        ourAdvantages: [
          "Pricing plus simple et transparent",
          "Démarrage plus rapide (< 10s vs ~1 min Fargate)",
          "Support Windows containers natif (Fargate Windows limité)",
          "GPU support pour AI/ML (Fargate pas de GPU)"
        ],
        theirWeaknesses: [
          "Fargate nécessite ECS/EKS (plus complexe pour usage simple)",
          "Pas de GPU support",
          "Démarrage plus lent"
        ]
      },
      {
        competitor: "Google Cloud Run",
        ourAdvantages: [
          "Support Windows containers (Cloud Run Linux only)",
          "GPU support (Cloud Run pas de GPU)",
          "Container groups pour multi-container (Cloud Run 1 container only)",
          "Custom CPU/RAM plus flexible"
        ],
        theirWeaknesses: [
          "Linux containers uniquement",
          "1 container par instance seulement",
          "Pas de GPU"
        ]
      }
    ],
    salesPriority: 7,
    isActive: true,
    isFeatured: false,
    keywords: ["containers", "docker", "serverless containers", "aci", "batch", "ephemeral"],
    tags: ["Serverless", "Containers", "Docker", "Fast-Deploy", "Cost-Optimized"],
    relatedSolutions: ["azure-kubernetes-service", "azure-functions", "azure-batch"],
    technicalSpecs: {
      maxCPU: "4 vCPUs per container",
      maxRAM: "16 GB per container",
      maxContainersPerGroup: "60 containers",
      supportedOS: ["Linux", "Windows Server 2019"],
      gpuSupport: "NVIDIA Tesla K80, P100, V100"
    },
    securityFeatures: [
      "VNet integration pour networking privé",
      "Managed Identity support",
      "Secrets management intégré",
      "Azure Key Vault integration",
      "Container isolation (Hyper-V on Windows)",
      "Private container registries support"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "GDPR"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/container-instances/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/container-instances/",
    demoUrl: "https://azure.microsoft.com/en-us/products/container-instances/"
  },

  // 6. Azure Batch
  {
    name: "azure-batch",
    officialName: "Azure Batch",
    category: "compute",
    subcategory: "hpc-batch",
    shortDescription: "Service pour exécuter des workloads parallèles et HPC (High Performance Computing) à grande échelle avec scheduling automatique et scaling de VMs.",
    fullDescription: "Azure Batch permet d'exécuter efficacement des applications parallèles et HPC à grande échelle dans Azure. Le service gère automatiquement le provisioning, scaling, et scheduling de VMs pour exécuter vos jobs. Batch est optimisé pour workloads compute-intensive: rendering 3D, simulations scientifiques, analyse financière, transcoding média, etc. Support des pools de VMs (jusqu'à 3000 nodes), auto-scaling basé sur charge, integration avec Azure Storage pour input/output data, et pricing optimisé avec Spot VMs (-90%). Pas de frais Batch - paiement uniquement des resources compute utilisées.",
    keyFeatures: [
      "Scheduling automatique de milliers de jobs parallèles",
      "Auto-scaling pools de VMs (jusqu'à 3000 nodes par pool)",
      "Support Spot VMs pour économies jusqu'à 90%",
      "Integration Azure Storage pour data input/output",
      "Task dependencies pour workflows complexes",
      "Multi-instance tasks pour MPI workloads",
      "Application packages pour déploiement logiciels",
      "Auto-retry tasks en cas d'échec",
      "VNet integration pour sécurité",
      "Support Linux et Windows nodes",
      "GPU nodes pour rendering et AI/ML",
      "Container support (Docker) sur nodes",
      "Pas de frais Batch - Paiement uniquement VMs utilisées"
    ],
    benefits: [
      "Scaling massif - Jusqu'à 3000 nodes pour HPC workloads",
      "Coût optimisé - Spot VMs pour -90%, auto-shutdown après jobs",
      "Zero infrastructure management - Batch gère tout",
      "Performance HPC - InfiniBand networking pour MPI",
      "Flexibilité - Support custom applications, containers, MPI",
      "Pas de frais service - Paiement uniquement compute utilisé"
    ],
    useCases: [
      {
        title: "Rendering 3D et VFX",
        description: "Rendering films, animations, visualisations architecturales nécessitant milliers de cores.",
        industries: ["Media", "Entertainment", "Architecture"],
        businessImpact: "Réduction temps rendering de 95% (1 mois → 1 jour), coûts à l'usage"
      },
      {
        title: "Simulations scientifiques",
        description: "Modélisations climatiques, simulations physiques, recherche pharmaceutique.",
        industries: ["Research", "Healthcare", "Energy"],
        businessImpact: "Accélération recherche, accès HPC sans CAPEX massif"
      },
      {
        title: "Analyse financière et risk modeling",
        description: "Monte Carlo simulations, portfolio optimization, stress testing.",
        industries: ["Finance", "Banking"],
        businessImpact: "Analyse risque temps réel, conformité réglementaire"
      },
      {
        title: "Media transcoding",
        description: "Conversion vidéos multi-formats, encoding 4K/8K, post-production.",
        industries: ["Media", "Broadcasting"],
        businessImpact: "Traitement parallèle massif, time-to-delivery réduit 80%"
      }
    ],
    targetIndustries: ["Media & Entertainment", "Research", "Finance", "Healthcare", "Energy", "Manufacturing"],
    idealCustomerSize: "SME, Enterprise",
    targetPersonas: ["HPC Engineer", "Data Scientist", "Research Scientist", "VFX Artist", "IT Manager"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Batch Service",
        description: "Service Batch lui-même",
        pricing: "GRATUIT - Pas de frais pour service Batch",
        bestFor: "Tous usages"
      },
      {
        tier: "Compute VMs",
        description: "VMs dans pools Batch (pricing identique aux VMs standards)",
        pricing: "€0.096/heure (D2s v3) à €4.608/heure (D96s v5)",
        bestFor: "Workloads standards"
      },
      {
        tier: "Spot VMs",
        description: "VMs Spot pour workloads interruptibles",
        pricing: "Économies jusqu'à 90% vs pricing standard",
        bestFor: "Rendering, simulations fault-tolerant"
      },
      {
        tier: "GPU VMs",
        description: "VMs avec GPU pour rendering/AI",
        pricing: "€3.06/heure (NC6s v3) à €27.20/heure (ND96asr)",
        bestFor: "Rendering 3D, deep learning training"
      }
    ],
    estimatedCost: "Gratuit (service) + coût VMs (ex: 100 nodes D4s v3 Spot 8h = €150 vs €1,500 standard)",
    implementationTime: "4 heures à 3 jours",
    complexity: "medium",
    prerequisites: [
      "Application parallelisable ou batch job",
      "Compte Azure avec quota VMs suffisant",
      "Azure Storage pour input/output data",
      "Connaissance HPC/parallel computing recommandée"
    ],
    integrations: [
      "Azure Storage (Blob, Files)",
      "Azure Container Registry",
      "Azure Virtual Network",
      "Azure Monitor",
      "Azure Active Directory",
      "Azure Data Factory (orchestration)",
      "MPI (Message Passing Interface)",
      "Docker containers"
    ],
    competitorComparison: [
      {
        competitor: "AWS Batch",
        ourAdvantages: [
          "Spot VMs économies jusqu'à 90% (vs 70% AWS Spot)",
          "InfiniBand networking pour MPI (AWS limited HPC networking)",
          "Integration Azure Storage plus simple",
          "Support Windows workloads meilleur"
        ],
        theirWeaknesses: [
          "Économies Spot instances moindres",
          "HPC networking moins performant"
        ]
      }
    ],
    salesPriority: 6,
    isActive: true,
    isFeatured: false,
    keywords: ["batch", "hpc", "parallel computing", "rendering", "simulations", "high performance computing"],
    tags: ["HPC", "Batch", "Parallel-Computing", "Rendering", "Scientific"],
    relatedSolutions: ["azure-virtual-machines", "azure-storage", "azure-container-instances"],
    technicalSpecs: {
      maxNodesPerPool: "3000 nodes",
      maxPools: "100 pools per account",
      maxJobs: "Unlimited",
      networking: "InfiniBand (RDMA) pour MPI workloads",
      supportedOS: ["Linux", "Windows"]
    },
    securityFeatures: [
      "VNet integration",
      "Azure AD authentication",
      "Managed Identity",
      "Encryption at-rest (Azure Storage)",
      "Private pools (no public IP)",
      "Azure Key Vault integration"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "GDPR"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/batch/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/batch/",
    demoUrl: "https://azure.microsoft.com/en-us/products/batch/"
  },

  // 7. Azure Service Fabric
  {
    name: "azure-service-fabric",
    officialName: "Azure Service Fabric",
    category: "compute",
    subcategory: "microservices-platform",
    shortDescription: "Plateforme distribuée pour déployer et gérer des applications microservices avec haute disponibilité, scalabilité, et orchestration.",
    fullDescription: "Azure Service Fabric est une plateforme de systèmes distribués pour packaging, déploiement, et gestion de microservices et containers scalables et fiables. Service Fabric gère automatiquement l'orchestration, health monitoring, scaling, et upgrades des services. Support des microservices stateful (avec state persistence) et stateless, ainsi que containers Windows/Linux. Utilisé par de nombreux services Microsoft (Azure SQL Database, Cosmos DB, Cortana). Idéal pour applications microservices complexes nécessitant high availability, low latency, et state management distribué.",
    keyFeatures: [
      "Orchestration microservices stateful et stateless",
      "State management distribué avec Reliable Collections",
      "Auto-scaling et load balancing",
      "Self-healing avec automatic failover",
      "Rolling upgrades avec health monitoring",
      "Support containers (Windows, Linux) et executables",
      "Service discovery automatique",
      "Actor model programming (Reliable Actors)",
      "Multi-datacenter deployment pour disaster recovery",
      "Integration Azure Monitor et Application Insights",
      "Support Windows et Linux clusters",
      "Hybrid deployment (Azure + on-premises)"
    ],
    benefits: [
      "High availability - 99.99% SLA avec multi-AZ deployment",
      "Stateful microservices - State persistence sans DB externe",
      "Low latency - Colocation services, in-memory state",
      "Battle-tested - Utilisé par Azure services critiques",
      "Flexibilité - Support microservices, containers, executables",
      "Hybrid ready - Deployment Azure et on-premises identique"
    ],
    useCases: [
      {
        title: "Applications microservices stateful",
        description: "Applications nécessitant state persistence, low latency, high throughput (e-commerce, gaming).",
        industries: ["E-commerce", "Gaming", "Finance"],
        businessImpact: "Latence < 10ms, 99.99% availability, state management simplifié"
      },
      {
        title: "Event processing systems",
        description: "Systèmes de traitement événements temps réel, IoT data processing.",
        industries: ["IoT", "Telecommunications", "Finance"],
        businessImpact: "Traitement millions événements/seconde, scalabilité horizontale"
      },
      {
        title: "Modernisation applications legacy",
        description: "Migration graduelle monolithes vers microservices avec coexistence.",
        industries: ["Finance", "Healthcare", "Manufacturing"],
        businessImpact: "Migration incrémentale, risque réduit, downtime zero"
      }
    ],
    targetIndustries: ["Finance", "E-commerce", "Gaming", "IoT", "Telecommunications", "Healthcare"],
    idealCustomerSize: "Enterprise",
    targetPersonas: ["Cloud Architect", "Microservices Architect", "Platform Engineer", "CTO"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Cluster VMs",
        description: "VMs pour nodes Service Fabric (pricing identique VMs standards)",
        pricing: "€0.096/heure (D2s v3) à €4.608/heure (D96s v5)",
        bestFor: "Production clusters (minimum 5 nodes recommandé)"
      }
    ],
    estimatedCost: "5 nodes D4s v3 = €692/mois (production HA cluster)",
    implementationTime: "1-4 semaines selon complexité application",
    complexity: "high",
    prerequisites: [
      "Connaissance architecture microservices",
      "Compréhension systèmes distribués",
      "Application décomposable en services",
      "Expertise .NET ou Java recommandée"
    ],
    integrations: [
      "Azure Monitor",
      "Application Insights",
      "Azure Active Directory",
      "Azure Key Vault",
      "Azure Storage",
      "Azure SQL Database",
      "Azure DevOps",
      "Docker containers"
    ],
    competitorComparison: [
      {
        competitor: "Kubernetes",
        ourAdvantages: [
          "Stateful services natifs avec Reliable Collections (K8s nécessite StatefulSets + external storage)",
          "Actor model programming avec Reliable Actors (K8s pas de support natif)",
          "Battle-tested par Azure services critiques",
          "State management intégré sans dépendances externes"
        ],
        theirWeaknesses: [
          "StatefulSets complexes, nécessite external storage",
          "Pas de actor model natif",
          "State management manuel"
        ]
      }
    ],
    salesPriority: 5,
    isActive: true,
    isFeatured: false,
    keywords: ["service fabric", "microservices", "stateful", "distributed systems", "orchestration"],
    tags: ["Microservices", "Stateful", "Distributed", "High-Availability", "PaaS"],
    relatedSolutions: ["azure-kubernetes-service", "azure-app-service"],
    technicalSpecs: {
      minNodes: "5 nodes (production), 1 node (dev/test)",
      maxNodes: "1000 nodes per cluster",
      programmingModels: ["Reliable Services", "Reliable Actors", "Containers", "Guest Executables"],
      supportedLanguages: [".NET", "Java", "C++", "Any (containers)"]
    },
    securityFeatures: [
      "X.509 certificate-based security",
      "Azure AD integration",
      "RBAC granular",
      "Encryption in-transit",
      "Secrets management",
      "Network isolation"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "GDPR"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/service-fabric/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/service-fabric/",
    demoUrl: "https://azure.microsoft.com/en-us/products/service-fabric/"
  },

  // 8. Azure Dedicated Host
  {
    name: "azure-dedicated-host",
    officialName: "Azure Dedicated Host",
    category: "compute",
    subcategory: "dedicated-infrastructure",
    shortDescription: "Serveurs physiques dédiés pour héberger vos VMs Azure, garantissant isolation physique, contrôle hardware, et conformité réglementaire.",
    fullDescription: "Azure Dedicated Host fournit des serveurs physiques dédiés capables d'héberger vos VMs Azure. Contrairement aux VMs standards multi-tenant, Dedicated Host garantit que vos VMs s'exécutent sur un serveur physique dédié exclusivement à votre organisation. Cela assure isolation physique complète, contrôle sur maintenance windows, réutilisation licences (BYOL), et conformité avec réglementations nécessitant single-tenant infrastructure (finance, santé, gouvernement). Vous contrôlez le placement des VMs sur l'host, les update schedules, et bénéficiez de pricing prévisible par host (vs par VM).",
    keyFeatures: [
      "Serveur physique dédié exclusivement à votre organisation",
      "Isolation physique complète - Pas de co-location avec autres clients",
      "Contrôle total sur maintenance windows et updates",
      "Support BYOL (Bring Your Own License) pour SQL Server, Windows Server",
      "Placement VMs contrôlé sur hosts spécifiques",
      "Support Availability Zones pour HA",
      "Host groups pour gestion logique de hosts",
      "Pricing par host (pas par VM) pour prédictibilité coûts",
      "Compliance-ready pour réglementations single-tenant",
      "Support des séries VMs: Dsv3, Esv3, Fsv2, Lsv2, Msv2",
      "Integration Azure Hybrid Benefit pour économies licences",
      "Automatic VM placement sur host avec capacity disponible"
    ],
    benefits: [
      "Conformité réglementaire - Single-tenant pour finance, santé, gouvernement",
      "Isolation physique complète - Sécurité et performance garanties",
      "Contrôle maintenance - Planification updates selon vos besoins",
      "Économies licences - BYOL + Azure Hybrid Benefit",
      "Pricing prévisible - Coût par host fixe, pas surprises",
      "Flexibilité placement - Contrôle total sur localisation VMs"
    ],
    useCases: [
      {
        title: "Conformité réglementaire",
        description: "Workloads finance, santé, gouvernement nécessitant isolation physique single-tenant.",
        industries: ["Finance", "Healthcare", "Government"],
        businessImpact: "Conformité HIPAA/PCI DSS/FedRAMP, audit trails complets"
      },
      {
        title: "Licensing optimization",
        description: "Organisations avec licences SQL Server/Windows Server existantes (BYOL).",
        industries: ["All"],
        businessImpact: "Économies licences 40-60%, maximisation investissements existants"
      },
      {
        title: "Performance-critical workloads",
        description: "Applications nécessitant performance prévisible sans noisy neighbors.",
        industries: ["Finance", "Trading", "Gaming"],
        businessImpact: "Latence prévisible, performance garantie, pas variabilité"
      }
    ],
    targetIndustries: ["Finance", "Healthcare", "Government", "Banking", "Insurance"],
    idealCustomerSize: "Enterprise",
    targetPersonas: ["CISO", "Compliance Officer", "IT Manager", "Cloud Architect", "CFO"],
    pricingModel: "subscription",
    pricingTiers: [
      {
        tier: "Dsv3 Host",
        description: "Host pour VMs série D (usage général), 32 cores",
        pricing: "€3.10/heure (~€2,250/mois)",
        bestFor: "Workloads usage général, multi-VMs small/medium"
      },
      {
        tier: "Esv3 Host",
        description: "Host pour VMs série E (memory-optimized), 32 cores",
        pricing: "€3.92/heure (~€2,850/mois)",
        bestFor: "Databases, SAP, applications mémoire-intensive"
      },
      {
        tier: "Fsv2 Host",
        description: "Host pour VMs série F (compute-optimized), 48 cores",
        pricing: "€2.98/heure (~€2,165/mois)",
        bestFor: "Batch processing, compute-intensive"
      }
    ],
    estimatedCost: "€2,165 à €2,850/mois par host selon série",
    implementationTime: "2-4 heures",
    complexity: "low",
    prerequisites: [
      "Compte Azure avec quota Dedicated Host",
      "Planification capacity (nombre VMs par host)",
      "Pour BYOL: Licences Windows Server/SQL Server existantes",
      "Stratégie compliance et isolation définie"
    ],
    integrations: [
      "Azure Virtual Machines (séries supportées)",
      "Azure Hybrid Benefit",
      "Azure Availability Zones",
      "Azure Monitor",
      "Azure Policy",
      "Azure Security Center"
    ],
    competitorComparison: [
      {
        competitor: "AWS Dedicated Hosts",
        ourAdvantages: [
          "Pricing plus simple et transparent",
          "Azure Hybrid Benefit intégration native (BYOL simplifié)",
          "Host groups pour gestion logique",
          "Support Windows workloads meilleur (Microsoft first-party)"
        ],
        theirWeaknesses: [
          "BYOL configuration plus complexe",
          "Pricing moins transparent",
          "Gestion hosts plus granulaire (complexe)"
        ]
      }
    ],
    salesPriority: 6,
    isActive: true,
    isFeatured: false,
    keywords: ["dedicated host", "physical server", "compliance", "single-tenant", "byol", "isolation"],
    tags: ["Dedicated", "Compliance", "Single-Tenant", "BYOL", "Security"],
    relatedSolutions: ["azure-virtual-machines", "azure-vmss"],
    technicalSpecs: {
      supportedVMSeries: ["Dsv3", "Esv3", "Fsv2", "Lsv2", "Msv2"],
      coresPerHost: "32-64 cores selon série",
      maxVMsPerHost: "Varie selon taille VMs (ex: 16x D2sv3 ou 2x D32sv3)",
      availabilityZones: "Supported"
    },
    securityFeatures: [
      "Isolation physique complète",
      "Contrôle maintenance et updates",
      "Support Azure Security Center",
      "Encryption at-rest et in-transit",
      "Azure Policy compliance",
      "Audit logging complet"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "PCI DSS", "HIPAA", "FedRAMP", "GDPR"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/virtual-machines/dedicated-hosts",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/virtual-machines/dedicated-host/",
    demoUrl: "https://azure.microsoft.com/en-us/products/virtual-machines/dedicated-host/"
  }
];

// Fonction principale
async function main() {
  console.log(`🚀 Adding ${computeSolutionsPart2.length} more Azure Compute solutions (Part 2)...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const solution of computeSolutionsPart2) {
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

  console.log(`\n\n📊 SUMMARY (Part 2):`);
  console.log(`   ✅ Success: ${successCount}/${computeSolutionsPart2.length}`);
  console.log(`   ❌ Failed: ${failCount}/${computeSolutionsPart2.length}`);
  console.log(`\n✨ Azure Compute category is now COMPLETE with all 8 solutions!`);
}

main();
