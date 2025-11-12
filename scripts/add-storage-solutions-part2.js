/**
 * Script pour ajouter Azure Table Storage et Disk Storage
 * Exécuter avec: node scripts/add-storage-solutions-part2.js
 */

const storageSolutionsPart2 = [
  // 4. Azure Table Storage (NoSQL)
  {
    name: "azure-table-storage",
    officialName: "Azure Table Storage (NoSQL)",
    category: "storage",
    subcategory: "nosql-database",
    shortDescription: "Base de données NoSQL key-value massivement scalable, schema-less, et économique pour données structurées non-relationnelles.",
    fullDescription: "Azure Table Storage est un datastore NoSQL cloud pour stocker de grandes quantités de données structurées mais non-relationnelles. Les tables utilisent un modèle key-value avec PartitionKey et RowKey pour indexation rapide. Schema-less, chaque entité peut avoir des propriétés différentes. Capacité de pétaoctets de données, réponse temps millisecondes, et coût extrêmement compétitif. Idéal pour IoT telemetry, logs applicatifs, user profiles, configuration data, et données nécessitant flexible schema et accès rapide par clé. Alternative économique aux bases NoSQL managées pour workloads simples.",
    keyFeatures: [
      "NoSQL key-value store massivement scalable (pétaoctets)",
      "Schema-less - Entités peuvent avoir propriétés différentes",
      "Dual-key indexing - PartitionKey (distribution) + RowKey (sorting)",
      "Propriétés typées - String, Binary, Boolean, DateTime, Double, Guid, Int, Long",
      "Entités jusqu'à 1 MB, propriétés jusqu'à 252 (+ 3 system properties)",
      "OData queries pour recherche filtrée",
      "Batch transactions - Jusqu'à 100 opérations atomic (même partition)",
      "Geo-redundancy - LRS, ZRS, GRS, RA-GRS pour haute disponibilité",
      "Encryption at-rest et in-transit automatique",
      "REST API et Azure SDKs multi-langages",
      "Pas de limite nombre de tables par Storage Account",
      "Throughput élevé - Millions d'opérations/seconde"
    ],
    benefits: [
      "Coût ultra-économique - 10x moins cher que Cosmos DB pour workloads simples",
      "Scalabilité massive - Pétaoctets données, partitioning automatique",
      "Performance prévisible - Latence millisecondes pour accès par clé",
      "Flexibilité schema - Adaptation rapide évolutions données",
      "Simple & fiable - Pas de configuration complexe, haute disponibilité native",
      "Idéal IoT - Ingestion rapide telemetry, coûts minimaux"
    ],
    useCases: [
      {
        title: "IoT Telemetry Storage",
        description: "Stockage massif données capteurs IoT, metrics devices, time-series simple.",
        industries: ["IoT", "Manufacturing", "Energy", "Telecommunications"],
        businessImpact: "Ingestion millions événements/seconde, coûts 90% moindres vs NoSQL managé"
      },
      {
        title: "Application Logs & Audit Trails",
        description: "Logs applicatifs, audit trails, event tracking avec queryable metadata.",
        industries: ["All"],
        businessImpact: "Rétention long-terme économique, recherche rapide par critères"
      },
      {
        title: "User Profiles & Preferences",
        description: "Stockage profils utilisateurs, préférences, settings avec schema flexible.",
        industries: ["SaaS", "E-commerce", "Gaming"],
        businessImpact: "Évolution schema sans migration, accès ultra-rapide"
      },
      {
        title: "Configuration & Metadata Storage",
        description: "Configuration applicative, feature flags, metadata produits.",
        industries: ["All"],
        businessImpact: "Déploiement rapide, pas de schema rigide"
      }
    ],
    targetIndustries: ["IoT", "Technology", "SaaS", "Manufacturing", "Telecommunications", "Gaming"],
    idealCustomerSize: "All",
    targetPersonas: ["Developer", "IoT Architect", "Data Engineer", "Backend Developer"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Storage",
        description: "Stockage données tables",
        pricing: "€0.045/GB/mois (LRS)",
        bestFor: "Tous workloads - très économique"
      },
      {
        tier: "Transactions",
        description: "Opérations CRUD (Create, Read, Update, Delete)",
        pricing: "€0.004 per 10,000 transactions",
        bestFor: "Tous usages - coût négligeable"
      }
    ],
    estimatedCost: "€45/TB/mois storage + €0.40 per million operations (extrêmement économique)",
    implementationTime: "1-3 heures",
    complexity: "low",
    prerequisites: [
      "Compte Azure Storage",
      "Compréhension modèle NoSQL key-value",
      "Design PartitionKey approprié pour distribution charge",
      "Azure SDK ou REST API"
    ],
    integrations: [
      "Azure Functions",
      "Azure Logic Apps",
      "Azure Search",
      "Azure Data Factory",
      "Azure Stream Analytics",
      "Azure SDKs (.NET, Java, Python, Node.js)",
      "Power BI"
    ],
    competitorComparison: [
      {
        competitor: "AWS DynamoDB",
        ourAdvantages: [
          "Coûts 70% inférieurs pour storage (€0.045 vs $0.25/GB/mois)",
          "Simplicité pricing - Pas de provisioned vs on-demand complexity",
          "Geo-redundancy incluse (DynamoDB single-region default)",
          "Batch operations jusqu'à 100 entités (DynamoDB 25 max)"
        ],
        theirWeaknesses: [
          "DynamoDB coûts storage 5x plus élevés",
          "Pricing complexe (RCU/WCU provisioning)",
          "Geo-replication coûts additionnels"
        ]
      },
      {
        competitor: "Google Cloud Datastore",
        ourAdvantages: [
          "Coûts storage 50% inférieurs",
          "Batch transactions 100 ops (Datastore 25 max)",
          "Integration Azure ecosystem simplifiée",
          "OData queries standard"
        ],
        theirWeaknesses: [
          "Storage plus coûteux",
          "Batch size limité",
          "Query language propriétaire GQL"
        ]
      }
    ],
    salesPriority: 7,
    isActive: true,
    isFeatured: false,
    keywords: [
      "table storage",
      "nosql",
      "key-value",
      "schema-less",
      "iot",
      "telemetry",
      "logs",
      "cheap nosql"
    ],
    tags: ["Storage", "NoSQL", "Key-Value", "Schema-Less", "Cost-Optimized", "IoT"],
    relatedSolutions: ["azure-cosmos-db", "azure-blob-storage", "azure-iot-hub"],
    technicalSpecs: {
      maxEntitySize: "1 MB",
      maxProperties: "252 custom + 3 system (PartitionKey, RowKey, Timestamp)",
      maxPropertySize: "64 KB (String), 1 MB total entity",
      maxBatchSize: "100 operations (same PartitionKey)",
      indexing: "PartitionKey + RowKey (primary index only)",
      querySyntax: "OData protocol"
    },
    securityFeatures: [
      "Encryption at-rest (AES 256-bit)",
      "Encryption in-transit (HTTPS)",
      "Shared Access Signatures (SAS)",
      "Azure AD integration",
      "RBAC",
      "Network isolation (Private endpoints, Firewall)",
      "Audit logging"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "GDPR"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/storage/tables/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/storage/tables/",
    demoUrl: "https://azure.microsoft.com/en-us/products/storage/tables/"
  },

  // 5. Azure Disk Storage (Persistent VM Storage)
  {
    name: "azure-disk-storage",
    officialName: "Azure Disk Storage (Managed Disks)",
    category: "storage",
    subcategory: "block-storage",
    shortDescription: "Disques persistants haute performance (HDD/SSD) pour machines virtuelles Azure avec encryption, snapshots, et backup intégré.",
    fullDescription: "Azure Disk Storage (Managed Disks) fournit des disques block-level persistants pour Azure Virtual Machines. Disponible en 4 types: Ultra Disk (performance extrême), Premium SSD v2 (flexible), Premium SSD (production), Standard SSD (équilibré), Standard HDD (économique). Les disques managés éliminent la gestion Storage Accounts - Azure gère automatiquement la disponibilité, redondance, et scaling. Support encryption at-rest (SSE + optional customer-managed keys), snapshots incrémentaux, Azure Backup integration, et geo-replication pour disaster recovery. Idéal pour databases, applications critiques, VMs production nécessitant performance prévisible et haute disponibilité.",
    keyFeatures: [
      "4 Types de disques: Ultra Disk, Premium SSD v2, Premium SSD, Standard SSD, Standard HDD",
      "Ultra Disk - Jusqu'à 160,000 IOPS et 4,000 MB/s throughput",
      "Premium SSD v2 - Performance ajustable sans redémarrage VM",
      "Premium SSD - Jusqu'à 20,000 IOPS et 900 MB/s par disque",
      "Standard SSD - Performance équilibrée pour workloads normaux",
      "Standard HDD - Économique pour dev/test et données peu accédées",
      "Disques jusqu'à 64 TiB (Ultra Disk, Premium SSD v2)",
      "Snapshots incrémentaux pour backup rapide et économique",
      "Encryption at-rest automatique (SSE-AES 256)",
      "Customer-managed keys via Azure Key Vault (optional)",
      "Azure Disk Encryption pour OS disks (BitLocker/dm-crypt)",
      "Availability Zones support pour 99.99% SLA",
      "Shared Disks - Montage sur plusieurs VMs simultanément",
      "Disk bursting - Performance temporaire accrue (Premium/Standard SSD)",
      "Ephemeral OS Disks - Disques temporaires haute performance"
    ],
    benefits: [
      "Performance garantie - IOPS et throughput SLA-backed",
      "Haute disponibilité - 99.9% à 99.999% SLA selon configuration",
      "Sécurité renforcée - Encryption multiple layers, key management",
      "Backup simplifié - Snapshots incrémentaux, Azure Backup integration",
      "Zero management - Managed Disks élimine complexité Storage Accounts",
      "Disaster Recovery - Geo-replication, cross-region restore"
    ],
    useCases: [
      {
        title: "Production Databases",
        description: "SQL Server, Oracle, MySQL, PostgreSQL nécessitant IOPS élevés et latence faible.",
        industries: ["Finance", "Healthcare", "E-commerce", "SaaS"],
        businessImpact: "Latence < 2ms (Ultra Disk), 99.999% uptime, performance prévisible"
      },
      {
        title: "Enterprise Applications",
        description: "SAP, SharePoint, applications métier critiques.",
        industries: ["Manufacturing", "Retail", "Finance"],
        businessImpact: "Conformité SLA, backup automatisé, DR multi-région"
      },
      {
        title: "Virtual Desktops (VDI)",
        description: "Azure Virtual Desktop avec disques utilisateurs persistants.",
        industries: ["All"],
        businessImpact: "Expérience utilisateur fluide, profils rapides, scaling élastique"
      },
      {
        title: "Development & Testing",
        description: "Environnements dev/test avec Standard HDD économique.",
        industries: ["All"],
        businessImpact: "Coûts réduits 80%, snapshots pour clonage rapide"
      }
    ],
    targetIndustries: ["All", "Finance", "Healthcare", "E-commerce", "Manufacturing", "SaaS"],
    idealCustomerSize: "All",
    targetPersonas: ["Infrastructure Manager", "Database Administrator", "Cloud Architect", "IT Manager"],
    pricingModel: "subscription",
    pricingTiers: [
      {
        tier: "Ultra Disk (SSD)",
        description: "Performance extrême pour workloads critiques (IOPS/throughput ajustables)",
        pricing: "€0.1198/GB/mois + €0.0060 per provisioned IOPS + €0.0480 per provisioned MB/s",
        bestFor: "SAP HANA, databases critiques, workloads I/O intensive"
      },
      {
        tier: "Premium SSD v2",
        description: "SSD flexible avec performance ajustable à la volée",
        pricing: "€0.0736/GB/mois + €0.0015 per provisioned IOPS + €0.12 per provisioned MB/s",
        bestFor: "Production flexible, databases medium, workloads variables"
      },
      {
        tier: "Premium SSD",
        description: "SSD production avec tailles fixes (P4 à P80)",
        pricing: "P30 (1024 GB): €122.88/mois - 5,000 IOPS, 200 MB/s",
        bestFor: "Production VMs, applications critiques, databases"
      },
      {
        tier: "Standard SSD",
        description: "SSD équilibré pour workloads normaux",
        pricing: "E30 (1024 GB): €76.80/mois - 500 IOPS, 60 MB/s",
        bestFor: "Web servers, applications light, dev/test"
      },
      {
        tier: "Standard HDD",
        description: "HDD économique pour données peu accédées",
        pricing: "S30 (1024 GB): €38.40/mois - 500 IOPS, 60 MB/s",
        bestFor: "Backups, archives, dev/test, données inactives"
      }
    ],
    estimatedCost: "HDD: €38.40/TB/mois, Standard SSD: €76.80/TB/mois, Premium SSD: €122.88/TB/mois",
    implementationTime: "15 minutes à 2 heures",
    complexity: "low",
    prerequisites: [
      "Azure Virtual Machine pour attacher disques",
      "Pour Ultra Disk: VM série supportée (Esv3, Dsv3, etc.)",
      "Pour Availability Zones: Région Azure supportant AZ",
      "Sizing approprié selon workload (IOPS, throughput)"
    ],
    integrations: [
      "Azure Virtual Machines",
      "Azure Virtual Machine Scale Sets",
      "Azure Kubernetes Service (Persistent Volumes)",
      "Azure Backup",
      "Azure Site Recovery",
      "Azure Monitor",
      "Azure Key Vault (encryption keys)",
      "Azure Disk Encryption"
    ],
    competitorComparison: [
      {
        competitor: "AWS EBS (Elastic Block Store)",
        ourAdvantages: [
          "Ultra Disk performance supérieure (160k IOPS vs 64k EBS io2)",
          "Premium SSD v2 ajustable sans downtime (EBS modification nécessite modification volume)",
          "Managed Disks simplifie gestion (EBS nécessite Storage Account management)",
          "Shared Disks support natif (EBS Multi-Attach limité)"
        ],
        theirWeaknesses: [
          "EBS io2 Block Express IOPS limité à 256k (complexe)",
          "Modification EBS types nécessite downtime ou migration",
          "Multi-Attach EBS limitations nombreuses"
        ]
      },
      {
        competitor: "Google Persistent Disk",
        ourAdvantages: [
          "Ultra Disk latence inférieure (sub-millisecond)",
          "Plus de types disques (5 vs 3 GCP)",
          "Premium SSD v2 flexibilité unique",
          "Shared Disks pour clustering"
        ],
        theirWeaknesses: [
          "GCP Extreme Persistent Disk moins performant",
          "Moins de flexibilité types",
          "Multi-writer disks limité"
        ]
      }
    ],
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: [
      "disk storage",
      "managed disks",
      "ssd",
      "hdd",
      "vm storage",
      "persistent storage",
      "block storage",
      "ultra disk"
    ],
    tags: ["Storage", "Block-Storage", "Persistent", "High-Performance", "VMs"],
    relatedSolutions: ["azure-virtual-machines", "azure-backup", "azure-site-recovery"],
    technicalSpecs: {
      diskTypes: ["Ultra Disk", "Premium SSD v2", "Premium SSD", "Standard SSD", "Standard HDD"],
      maxDiskSize: "64 TiB (Ultra, Premium SSD v2), 32 TiB (Premium SSD), 32 TiB (Standard)",
      maxIOPS: "160,000 (Ultra Disk), 80,000 (Premium SSD v2), 20,000 (Premium SSD)",
      maxThroughput: "4,000 MB/s (Ultra Disk), 1,200 MB/s (Premium SSD v2), 900 MB/s (Premium SSD)",
      redundancy: ["LRS", "ZRS (Premium SSD, Standard SSD)"],
      sla: "99.9% (LRS), 99.99% (ZRS), 99.999% (Premium SSD ZRS with Availability Zones)"
    },
    securityFeatures: [
      "Server-Side Encryption (SSE) at-rest automatique",
      "Customer-managed keys (CMK) via Azure Key Vault",
      "Azure Disk Encryption (ADE) pour OS disks - BitLocker/dm-crypt",
      "Encryption in-transit pour Shared Disks",
      "Private endpoints pour snapshot transfer",
      "RBAC granulaire",
      "Immutable snapshots"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "PCI DSS", "GDPR", "FedRAMP"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/managed-disks/",
    demoUrl: "https://azure.microsoft.com/en-us/products/storage/disks/"
  }
];

// Fonction principale
async function main() {
  console.log(`🚀 Adding ${storageSolutionsPart2.length} more Azure Storage solutions (Part 2)...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const solution of storageSolutionsPart2) {
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
  console.log(`   ✅ Success: ${successCount}/${storageSolutionsPart2.length}`);
  console.log(`   ❌ Failed: ${failCount}/${storageSolutionsPart2.length}`);
  console.log(`\n✨ Azure Storage category is now COMPLETE with all 5 solutions!`);
}

main();
