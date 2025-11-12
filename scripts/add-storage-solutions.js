/**
 * Script pour ajouter toutes les solutions Azure Storage au knowledge base
 * Exécuter avec: node scripts/add-storage-solutions.js
 */

const storageSolutions = [
  // 1. Azure Blob Storage (Object Storage)
  {
    name: "azure-blob-storage",
    officialName: "Azure Blob Storage (Object Storage)",
    category: "storage",
    subcategory: "object-storage",
    shortDescription: "Service de stockage d'objets massivement scalable pour données non structurées (images, vidéos, logs, backups, documents).",
    fullDescription: "Azure Blob Storage est une solution de stockage d'objets pour le cloud, optimisée pour stocker des quantités massives de données non structurées. Les blobs (Binary Large Objects) peuvent être des fichiers texte, images, vidéos, logs, backups, ou tout autre type de données. Blob Storage offre trois tiers d'accès (Hot, Cool, Archive) pour optimiser les coûts selon la fréquence d'accès. Capacité illimitée avec scalabilité automatique, accès HTTP/HTTPS global, intégration CDN pour distribution mondiale, et lifecycle management pour archivage automatique. Idéal pour streaming média, data lakes, backups, archives, distribution de contenu web.",
    keyFeatures: [
      "Stockage massivement scalable - Capacité illimitée, pétaoctets de données",
      "3 Access Tiers: Hot (accès fréquent), Cool (accès rare), Archive (long-terme)",
      "Lifecycle Management - Déplacement automatique entre tiers selon règles",
      "Versioning - Conservation historique des versions de blobs",
      "Soft Delete - Récupération blobs supprimés (période rétention configurable)",
      "Immutable Storage - WORM (Write Once Read Many) pour conformité",
      "Encryption at-rest automatique (AES 256-bit) et in-transit (HTTPS)",
      "Access Control - RBAC, SAS tokens, ACLs, Azure AD integration",
      "CDN Integration - Distribution mondiale via Azure CDN",
      "Static Website Hosting - Hébergement sites statiques (HTML/CSS/JS)",
      "Change Feed - Stream d'événements pour modifications blobs",
      "Blob Index Tags - Métadonnées queryables pour recherche rapide",
      "Geo-Redundancy - LRS, ZRS, GRS, RA-GRS pour haute disponibilité",
      "Object Replication - Réplication asynchrone inter-régions",
      "Large File Support - Blobs jusqu'à 190.7 TiB (block blobs)"
    ],
    benefits: [
      "Coûts ultra-optimisés - Archive tier à €0.0018/GB/mois (99% moins cher que Hot)",
      "Scalabilité illimitée - Pas de limite de capacité, croissance automatique",
      "Haute disponibilité - 99.9% à 99.99% SLA selon redondance choisie",
      "Sécurité enterprise - Encryption automatique, immutability, compliance-ready",
      "Distribution mondiale - Accès global via HTTP/HTTPS, CDN integration",
      "Lifecycle automation - Réduction coûts automatique via tiering intelligent"
    ],
    useCases: [
      {
        title: "Media Storage & Streaming",
        description: "Stockage vidéos, images, audio pour streaming, distribution CDN, plateforme média.",
        industries: ["Media", "Entertainment", "E-learning"],
        businessImpact: "Diffusion mondiale faible latence, coûts storage -80% vs on-prem"
      },
      {
        title: "Backups & Disaster Recovery",
        description: "Backups bases de données, VMs, fichiers avec rétention long-terme et geo-redundancy.",
        industries: ["All"],
        businessImpact: "RPO/RTO optimisés, conformité réglementaire, coûts réduits 70%"
      },
      {
        title: "Data Lakes & Big Data Analytics",
        description: "Stockage massif pour analytics, data science, machine learning avec Data Lake Storage Gen2.",
        industries: ["Finance", "Healthcare", "Retail", "Research"],
        businessImpact: "Pétaoctets de données analysables, intégration Spark/Hadoop native"
      },
      {
        title: "Static Website Hosting",
        description: "Hébergement sites statiques (SPAs, docs, landing pages) avec CDN global.",
        industries: ["Technology", "Marketing", "E-commerce"],
        businessImpact: "Coûts hébergement 95% moins cher que VMs, performance mondiale"
      },
      {
        title: "Log & Telemetry Storage",
        description: "Archivage logs applications, IoT telemetry, audit trails avec lifecycle management.",
        industries: ["All"],
        businessImpact: "Conformité audit, rétention long-terme faible coût"
      },
      {
        title: "Archive & Compliance",
        description: "Archivage long-terme données réglementées (finance, santé) avec immutability.",
        industries: ["Finance", "Healthcare", "Government"],
        businessImpact: "Conformité SEC/HIPAA/GDPR, coûts archive 99% moins cher"
      }
    ],
    targetIndustries: [
      "Media & Entertainment",
      "Healthcare",
      "Finance",
      "E-commerce",
      "Technology",
      "Education",
      "Government",
      "Manufacturing",
      "Research"
    ],
    idealCustomerSize: "All",
    targetPersonas: [
      "Cloud Architect",
      "Storage Administrator",
      "Data Engineer",
      "DevOps Engineer",
      "IT Manager",
      "Compliance Officer"
    ],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Hot Access Tier",
        description: "Pour données fréquemment accédées (< 30 jours entre accès)",
        pricing: "€0.0184/GB/mois storage + €0.0044 per 10,000 read ops",
        bestFor: "Sites web actifs, streaming média, données actives"
      },
      {
        tier: "Cool Access Tier",
        description: "Pour données accédées rarement (30-90 jours rétention minimum)",
        pricing: "€0.0100/GB/mois storage + €0.01 per 10,000 read ops",
        bestFor: "Backups court-terme, données temporaires, staging"
      },
      {
        tier: "Archive Access Tier",
        description: "Pour archivage long-terme (180 jours rétention minimum)",
        pricing: "€0.0018/GB/mois storage + €5.28 per 10,000 read ops + rehydration costs",
        bestFor: "Archives conformité, backups long-terme, données historiques"
      },
      {
        tier: "Premium Block Blobs",
        description: "SSD storage pour faible latence et IOPS élevés",
        pricing: "€0.1353/GB/mois storage + transactions incluses",
        bestFor: "Applications nécessitant faible latence, IoT haute fréquence"
      }
    ],
    estimatedCost: "Hot: €18.40/TB/mois, Cool: €10/TB/mois, Archive: €1.80/TB/mois",
    implementationTime: "30 minutes à 2 heures",
    complexity: "low",
    prerequisites: [
      "Compte Azure avec Storage Account",
      "Connaissance HTTP/REST APIs recommandée",
      "Pour Data Lake: Azure Data Lake Storage Gen2 enabled"
    ],
    integrations: [
      "Azure CDN",
      "Azure Data Lake Analytics",
      "Azure Databricks",
      "Azure Synapse Analytics",
      "Azure Functions",
      "Azure Logic Apps",
      "Azure Event Grid",
      "Azure Search",
      "Azure Media Services",
      "AzCopy (migration tool)",
      "Azure Storage Explorer"
    ],
    competitorComparison: [
      {
        competitor: "AWS S3",
        ourAdvantages: [
          "Archive tier 40% moins cher que S3 Glacier Deep Archive",
          "Data Lake Storage Gen2 natif (S3 nécessite configuration complexe)",
          "Change Feed inclus (S3 Event Notifications configuration requise)",
          "Blob Index Tags pour queryable metadata (S3 Object Tags limité)"
        ],
        theirWeaknesses: [
          "S3 Glacier retrieval coûts élevés et temps long",
          "Data Lake setup complexe",
          "Metadata search limité"
        ]
      },
      {
        competitor: "Google Cloud Storage",
        ourAdvantages: [
          "Plus de tiers d'accès (3 vs 4 avec Premium Azure)",
          "Immutable Storage intégré (GCS Object Lock plus limité)",
          "Meilleure intégration entreprise (Azure AD, RBAC)",
          "Data Lake Storage Gen2 pour big data natif"
        ],
        theirWeaknesses: [
          "Moins d'options pricing granulaires",
          "Immutability options limitées",
          "Big data integration moins mature"
        ]
      }
    ],
    salesPriority: 9,
    isActive: true,
    isFeatured: true,
    keywords: [
      "blob storage",
      "object storage",
      "cloud storage",
      "data lake",
      "backup",
      "archive",
      "cdn",
      "static website",
      "unstructured data"
    ],
    tags: ["Storage", "Object-Storage", "Scalable", "Cost-Optimized", "Data-Lake"],
    relatedSolutions: ["azure-cdn", "azure-backup", "azure-data-lake-analytics"],
    technicalSpecs: {
      maxBlobSize: "190.7 TiB (block blobs)",
      maxStorageAccount: "5 PiB capacity",
      redundancyOptions: ["LRS", "ZRS", "GRS", "RA-GRS", "GZRS", "RA-GZRS"],
      performance: "Standard (HDD) ou Premium (SSD)",
      protocols: ["HTTP/HTTPS", "REST API", "Azure SDKs"]
    },
    securityFeatures: [
      "Encryption at-rest automatique (AES 256-bit)",
      "Encryption in-transit (TLS 1.2+)",
      "Customer-managed keys (Azure Key Vault)",
      "Shared Access Signatures (SAS) pour accès temporaire",
      "Azure AD integration pour RBAC",
      "Network isolation (Private endpoints, Service endpoints)",
      "Immutable Storage (WORM compliance)",
      "Soft Delete protection",
      "Versioning pour recovery",
      "Azure Defender for Storage (threat detection)"
    ],
    complianceCerts: [
      "ISO 27001, 27017, 27018",
      "SOC 1, SOC 2, SOC 3",
      "HIPAA / HITECH",
      "PCI DSS",
      "GDPR compliant",
      "SEC 17a-4(f) (immutable storage)",
      "FedRAMP"
    ],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/storage/blobs/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/storage/blobs/",
    demoUrl: "https://azure.microsoft.com/en-us/products/storage/blobs/"
  },

  // 2. Azure File Storage (SMB/NFS)
  {
    name: "azure-file-storage",
    officialName: "Azure File Storage (SMB/NFS)",
    category: "storage",
    subcategory: "file-shares",
    shortDescription: "Partages de fichiers cloud fully managed accessibles via SMB et NFS, montables sur Windows, Linux, et macOS comme disques réseau.",
    fullDescription: "Azure Files propose des partages de fichiers dans le cloud accessibles via les protocoles SMB (Server Message Block) et NFS (Network File System). Les partages peuvent être montés simultanément par VMs cloud et machines on-premises, fonctionnant comme un disque réseau traditionnel. Idéal pour lift & shift d'applications nécessitant partages fichiers, centralisation fichiers d'applications, stockage configurations, logs, et outils DevOps. Support Active Directory integration pour authentification Windows, snapshots pour backup, et Azure File Sync pour caching on-premises. Disponible en Standard (HDD) et Premium (SSD) tiers.",
    keyFeatures: [
      "Protocoles SMB 3.0/3.1.1 (Windows/Linux/macOS) et NFS 4.1 (Linux)",
      "Montage simultané multi-OS (Windows, Linux, macOS)",
      "Active Directory Domain Services integration pour authentification",
      "Azure File Sync - Cache on-premises pour accès local rapide",
      "Snapshots - Backups incrémentaux avec rétention configurable",
      "Soft Delete - Protection contre suppression accidentelle",
      "Encryption at-rest (AES 256) et in-transit (SMB 3.0+ encryption)",
      "Capacité jusqu'à 100 TiB par share (Premium) ou 5 TiB (Standard)",
      "IOPS jusqu'à 100,000 (Premium SSD)",
      "Geo-redundancy - LRS, ZRS, GRS pour haute disponibilité",
      "Private endpoints pour accès sécurisé via VNet",
      "Backup intégré avec Azure Backup",
      "RESTful API pour accès programmatique"
    ],
    benefits: [
      "Lift & shift facile - Remplacement NAS/file servers sans modification apps",
      "Accès multi-plateforme - Windows, Linux, macOS simultanément",
      "Haute disponibilité - Geo-redundancy, snapshots, backup automatique",
      "Sécurité enterprise - AD integration, encryption, private endpoints",
      "Hybrid ready - Azure File Sync pour cache on-premises",
      "Zero management - Pas de serveurs à gérer, scaling automatique"
    ],
    useCases: [
      {
        title: "Lift & Shift Applications",
        description: "Migration applications on-premises nécessitant partages fichiers vers Azure sans modification.",
        industries: ["All"],
        businessImpact: "Migration rapide, réduction coûts infrastructure 40%"
      },
      {
        title: "Shared Application Storage",
        description: "Stockage partagé pour applications multi-instances (configuration, logs, data).",
        industries: ["Technology", "SaaS"],
        businessImpact: "Simplification architecture, scaling horizontal applications"
      },
      {
        title: "DevOps & CI/CD",
        description: "Partage scripts, binaries, artifacts entre build agents et environnements.",
        industries: ["Software Development"],
        businessImpact: "Accélération pipelines CI/CD, centralisation assets"
      },
      {
        title: "User Home Directories & Profiles",
        description: "Stockage profils utilisateurs, home directories pour VDI (Azure Virtual Desktop).",
        industries: ["All"],
        businessImpact: "Expérience utilisateur cohérente, mobilité profils"
      },
      {
        title: "Hybrid File Server Replacement",
        description: "Remplacement file servers on-premises avec Azure File Sync pour cache local.",
        industries: ["All"],
        businessImpact: "Réduction CAPEX serveurs, DR cloud automatique"
      }
    ],
    targetIndustries: [
      "All",
      "Technology",
      "Healthcare",
      "Finance",
      "Manufacturing",
      "Education",
      "Government"
    ],
    idealCustomerSize: "All",
    targetPersonas: [
      "IT Manager",
      "Storage Administrator",
      "Cloud Architect",
      "DevOps Engineer",
      "System Administrator"
    ],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Standard (Transaction-Optimized)",
        description: "HDD storage pour workloads usage général (SMB)",
        pricing: "€0.0600/GB/mois + transactions (€0.002-€0.070 per 10,000 ops)",
        bestFor: "Partages fichiers usage général, home directories, dev/test"
      },
      {
        tier: "Standard (Hot)",
        description: "HDD storage optimisé pour données accédées fréquemment",
        pricing: "€0.0300/GB/mois + transactions plus élevées",
        bestFor: "Team shares, collaboration active"
      },
      {
        tier: "Standard (Cool)",
        description: "HDD storage pour données archivées ou rarement accédées",
        pricing: "€0.0152/GB/mois + transactions élevées",
        bestFor: "Archives, backups, données historiques"
      },
      {
        tier: "Premium (SSD)",
        description: "SSD storage pour workloads haute performance (SMB/NFS)",
        pricing: "€0.1536/GB/mois provisionné + IOPS inclus",
        bestFor: "Databases, applications critiques, VDI"
      }
    ],
    estimatedCost: "Standard: €60/TB/mois, Premium: €153.60/TB/mois provisionné",
    implementationTime: "30 minutes à 2 heures",
    complexity: "low",
    prerequisites: [
      "Compte Azure Storage",
      "Pour SMB on-premises: Port 445 ouvert",
      "Pour AD integration: Azure AD ou AD DS setup",
      "Pour Premium: Capacité minimum 100 GiB provisionnée"
    ],
    integrations: [
      "Azure Virtual Machines",
      "Azure Virtual Desktop (AVD)",
      "Azure Kubernetes Service",
      "Azure File Sync",
      "Azure Backup",
      "Active Directory",
      "Azure AD",
      "Azure Monitor",
      "Windows File Server"
    ],
    competitorComparison: [
      {
        competitor: "AWS EFS (Elastic File System)",
        ourAdvantages: [
          "Support SMB natif Windows (EFS Linux NFS only)",
          "Active Directory integration native (EFS pas de AD)",
          "Azure File Sync pour hybrid (EFS pas équivalent)",
          "Premium SSD tier pour haute performance (EFS General Purpose limité)"
        ],
        theirWeaknesses: [
          "EFS Linux seulement (pas SMB Windows)",
          "Pas d'integration Active Directory",
          "Options performance limitées"
        ]
      },
      {
        competitor: "Google Filestore",
        ourAdvantages: [
          "Support multi-protocoles SMB + NFS (Filestore NFS only)",
          "Tiers Standard/Premium pour flexibilité coûts (Filestore pricing unique)",
          "Azure File Sync pour hybrid",
          "Active Directory integration"
        ],
        theirWeaknesses: [
          "NFS uniquement (pas SMB)",
          "Pas de hybrid sync solution",
          "Pas AD integration"
        ]
      }
    ],
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: [
      "file storage",
      "smb",
      "nfs",
      "file shares",
      "network drive",
      "nas replacement",
      "file server",
      "azure files"
    ],
    tags: ["Storage", "File-Shares", "SMB", "NFS", "Hybrid", "Enterprise"],
    relatedSolutions: ["azure-virtual-desktop", "azure-file-sync", "azure-backup"],
    technicalSpecs: {
      maxFileShareSize: "100 TiB (Premium), 5 TiB (Standard expandable to 100 TiB)",
      maxFileSize: "4 TiB (SMB), 4 TiB (NFS)",
      maxIOPS: "100,000 IOPS (Premium)",
      maxThroughput: "10 GiBps (Premium)",
      protocols: ["SMB 3.0, 3.1.1", "NFS 4.1"],
      redundancy: ["LRS", "ZRS", "GRS", "GZRS"]
    },
    securityFeatures: [
      "Encryption at-rest (AES 256-bit)",
      "Encryption in-transit (SMB 3.0+ encryption channel)",
      "Active Directory authentication",
      "Azure RBAC",
      "Private endpoints (VNet integration)",
      "Firewall rules",
      "Soft Delete protection",
      "Snapshots for backup/recovery"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "PCI DSS", "GDPR"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/storage/files/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/storage/files/",
    demoUrl: "https://azure.microsoft.com/en-us/products/storage/files/"
  },

  // 3. Azure Queue Storage
  {
    name: "azure-queue-storage",
    officialName: "Azure Queue Storage",
    category: "storage",
    subcategory: "messaging",
    shortDescription: "Service de messaging simple pour communication asynchrone entre composants d'applications distribuées avec files d'attente de messages.",
    fullDescription: "Azure Queue Storage fournit un service de messaging cloud pour communication asynchrone entre composants d'applications. Les messages sont stockés dans des queues (files d'attente) et peuvent être récupérés par les workers/processors de manière FIFO ou prioritaire. Chaque message peut contenir jusqu'à 64 KB de données. Idéal pour découplage d'applications, task scheduling, distributed applications, et event-driven architectures. Support de millions de messages, accès via REST API ou Azure SDKs, et intégration native avec Azure Functions pour processing serverless.",
    keyFeatures: [
      "Messages jusqu'à 64 KB par message",
      "Queues pouvant contenir millions de messages (limite: capacité Storage Account)",
      "TTL (Time-To-Live) configurable par message (max 7 jours)",
      "Visibility timeout pour processing garantie (message invisible pendant traitement)",
      "Dequeue count - Tracking nombre de fois message récupéré",
      "FIFO ordering au sein de la queue",
      "REST API et Azure SDKs pour accès programmatique",
      "Integration Azure Functions pour serverless processing",
      "Integration Azure Logic Apps pour workflows",
      "Encryption at-rest et in-transit automatique",
      "Geo-redundancy pour haute disponibilité",
      "Monitoring avec Azure Monitor metrics"
    ],
    benefits: [
      "Découplage applications - Composants indépendants communiquent via queues",
      "Scalabilité élastique - Millions de messages, workers auto-scale",
      "Coût ultra-faible - €0.04 per million operations",
      "Simple & fiable - Pas de setup complexe, ordering FIFO",
      "Serverless ready - Integration native Azure Functions",
      "Haute disponibilité - Geo-redundancy, pas de single point of failure"
    ],
    useCases: [
      {
        title: "Task Scheduling & Background Jobs",
        description: "Distribution tâches asynchrones (emails, reports, data processing) à workers.",
        industries: ["All"],
        businessImpact: "Découplage frontend/backend, scalabilité workers automatique"
      },
      {
        title: "Order Processing E-commerce",
        description: "Gestion commandes asynchrone (validation, payment, fulfillment, notification).",
        industries: ["E-commerce", "Retail"],
        businessImpact: "Résilience pics de trafic (Black Friday), zero perte commandes"
      },
      {
        title: "Distributed Applications",
        description: "Communication entre microservices, event-driven architectures.",
        industries: ["Technology", "SaaS"],
        businessImpact: "Loose coupling, fault tolerance, scaling indépendant"
      },
      {
        title: "Workflow Automation",
        description: "Orchestration workflows multi-étapes avec Logic Apps ou Functions.",
        industries: ["All"],
        businessImpact: "Automatisation processus métier, réduction erreurs manuelles"
      }
    ],
    targetIndustries: ["All", "E-commerce", "Technology", "SaaS", "Finance"],
    idealCustomerSize: "All",
    targetPersonas: ["Developer", "Cloud Architect", "DevOps Engineer", "Integration Specialist"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Storage",
        description: "Stockage messages dans queues",
        pricing: "€0.0600/GB/mois (identique Blob Storage Standard)",
        bestFor: "Messages larges ou haute rétention"
      },
      {
        tier: "Operations",
        description: "Opérations queue (enqueue, dequeue, peek, delete)",
        pricing: "€0.04 per million operations (10,000 ops = €0.0004)",
        bestFor: "Tous usages - coût négligeable"
      }
    ],
    estimatedCost: "~€40 pour 1 milliard d'opérations (extrêmement économique)",
    implementationTime: "30 minutes à 2 heures",
    complexity: "low",
    prerequisites: [
      "Compte Azure Storage",
      "Connaissance messaging asynchrone basique",
      "Azure SDK ou REST API pour accès programmatique"
    ],
    integrations: [
      "Azure Functions",
      "Azure Logic Apps",
      "Azure App Service",
      "Azure SDKs (.NET, Java, Python, Node.js)",
      "Azure Monitor",
      "Azure Event Grid (via Functions)"
    ],
    competitorComparison: [
      {
        competitor: "AWS SQS",
        ourAdvantages: [
          "Coûts opérations 60% moins cher (€0.04 vs $0.40 per million)",
          "Integration Storage Account existant (SQS service séparé)",
          "Simplicité - Pas de pricing FIFO vs Standard queues",
          "Geo-redundancy incluse (SQS single-region default)"
        ],
        theirWeaknesses: [
          "SQS FIFO queues plus cher que standard",
          "Coûts opérations plus élevés",
          "Pas de geo-redundancy sans setup additionnel"
        ]
      }
    ],
    salesPriority: 6,
    isActive: true,
    isFeatured: false,
    keywords: [
      "queue storage",
      "messaging",
      "asynchronous",
      "task queue",
      "background jobs",
      "event-driven",
      "distributed apps"
    ],
    tags: ["Storage", "Messaging", "Asynchronous", "Event-Driven", "Cost-Optimized"],
    relatedSolutions: ["azure-functions", "azure-logic-apps", "azure-service-bus"],
    technicalSpecs: {
      maxMessageSize: "64 KB",
      maxQueueSize: "Limited by Storage Account capacity (500 TiB)",
      maxTTL: "7 days",
      maxVisibilityTimeout: "7 days",
      ordering: "FIFO within queue",
      accessProtocol: "HTTP/HTTPS REST API"
    },
    securityFeatures: [
      "Encryption at-rest (AES 256-bit)",
      "Encryption in-transit (HTTPS)",
      "Shared Access Signatures (SAS) for temporary access",
      "Azure AD integration",
      "RBAC",
      "Network isolation (Private endpoints, Firewall)"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "GDPR"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/storage/queues/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/storage/queues/",
    demoUrl: "https://azure.microsoft.com/en-us/products/storage/queues/"
  }

  // CONTINUING WITH TABLE STORAGE AND DISK STORAGE IN SEPARATE CALLS DUE TO LENGTH...
];

// Fonction principale
async function main() {
  console.log(`🚀 Adding ${storageSolutions.length} Azure Storage solutions (Part 1)...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const solution of storageSolutions) {
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

  console.log(`\n\n📊 SUMMARY (Part 1):`);
  console.log(`   ✅ Success: ${successCount}/${storageSolutions.length}`);
  console.log(`   ❌ Failed: ${failCount}/${storageSolutions.length}`);
}

main();
