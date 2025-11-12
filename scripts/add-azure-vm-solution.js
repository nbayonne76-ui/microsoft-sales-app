/**
 * Script pour ajouter la solution Azure Virtual Machines au knowledge base
 * Exécuter avec: node scripts/add-azure-vm-solution.js
 */

const azureVMSolution = {
  // Identification
  name: "azure-virtual-machines",
  officialName: "Azure Virtual Machines",
  category: "compute",
  subcategory: "iaas-vms",

  // Description
  shortDescription: "Service de machines virtuelles évolutif et à la demande sur Azure, offrant des options Windows et Linux pour tous types de workloads.",
  fullDescription: "Azure Virtual Machines (VMs) fournit une infrastructure as a service (IaaS) permettant de déployer des machines virtuelles Windows ou Linux à la demande. Avec plus de 700 instances disponibles, Azure VMs offre une flexibilité totale sur le choix du système d'exploitation, de la configuration matérielle, et des ressources de calcul. Les clients peuvent migrer leurs applications existantes, développer de nouvelles solutions cloud-native, ou créer des environnements de développement/test à moindre coût. Azure VMs s'intègre nativement avec l'ensemble de l'écosystème Azure (networking, storage, security, monitoring) et propose des SLA de disponibilité jusqu'à 99.99% avec les Availability Zones.",

  // Features clés
  keyFeatures: [
    "VM Sizes & Series - Choix parmi 700+ tailles de VM: B (burstable), D (usage général), E (mémoire optimisée), F (compute optimisé), M (grandes charges mémoire), L (storage optimisé), N (GPU pour IA/ML)",
    "OS Options - Support complet de Windows Server 2008-2022, Red Hat, Ubuntu, CentOS, Debian, SUSE, Oracle Linux et autres distributions",
    "Azure Managed Disks - Disques SSD Premium (ultra-performance), SSD Standard (équilibré), HDD Standard (économique) avec encryption automatique",
    "Ephemeral Disks - Disques temporaires haute performance pour workloads stateless",
    "VNet Integration - Intégration réseau complète avec Azure Virtual Network, NSG, UDR pour contrôle total du trafic",
    "Public & Private IPs - Attribution d'IPs publiques et privées avec DNS personnalisé",
    "Load Balancer Integration - Distribution automatique du trafic avec Azure Load Balancer (Layer 4) ou Application Gateway (Layer 7)",
    "Network Security Groups (NSG) - Firewalls stateful pour contrôle granulaire des flux réseau",
    "Availability Sets - Protection contre les défaillances matérielles avec 99.95% SLA",
    "Availability Zones - Déploiement multi-datacenter dans la même région pour 99.99% SLA",
    "Auto-scaling (VMSS) - Scale sets pour augmentation/diminution automatique selon la charge",
    "Azure Bastion - Accès RDP/SSH sécurisé sans exposer les IPs publiques",
    "Azure AD Integration - Authentification centralisée avec Azure Active Directory",
    "Azure Security Center - Détection des menaces et recommandations de sécurité en temps réel",
    "Azure Backup - Sauvegardes automatiques avec rétention configurable (7, 30, 365 jours)",
    "Azure Site Recovery - Disaster recovery avec RPO < 5 minutes",
    "Hybrid Benefit - Réutilisation des licences Windows Server/SQL Server existantes pour réduire les coûts jusqu'à 40%",
    "Spot Instances - Utilisation de capacité Azure inutilisée à -90% de réduction",
    "Reserved Instances - Engagement 1 ou 3 ans pour économies jusqu'à 72%",
    "Azure Monitor - Métriques CPU, RAM, disk, network en temps réel avec alerting",
    "Boot Diagnostics - Console série et screenshots pour troubleshooting",
    "Custom Script Extensions - Automatisation post-déploiement via PowerShell/Bash",
    "Azure DevOps Integration - CI/CD natif pour déploiements automatisés"
  ],

  // Bénéfices business
  benefits: [
    "Flexibilité totale - Contrôle complet sur OS, middleware, runtime sans contraintes cloud",
    "Migration facile - Lift & shift d'applications existantes sans modification majeure",
    "Économies optimisées - Modèles Pay-as-you-go, Reserved Instances (-72%), Spot Instances (-90%)",
    "Haute disponibilité - SLA jusqu'à 99.99% avec Availability Zones",
    "Sécurité enterprise - Encryption at-rest/in-transit, NSGs, Azure Firewall, DDoS Protection Standard",
    "Conformité certifiée - ISO 27001, SOC 2, HIPAA, FedRAMP, PCI DSS",
    "Performance garantie - SLA de performance sur CPU, mémoire, IOPS disques",
    "Global deployment - 60+ régions Azure pour déploiement proche des utilisateurs",
    "Intégration hybride - Connexion transparente avec on-premises via ExpressRoute/VPN",
    "Disaster Recovery intégré - Azure Site Recovery avec RPO/RTO configurables"
  ],

  // Cas d'usage
  useCases: [
    {
      title: "Migration Lift & Shift",
      description: "Migration d'applications on-premises vers Azure sans refactoring majeur. Idéal pour décommissionnement de datacenters.",
      industries: ["All"],
      businessImpact: "Réduction des coûts d'infrastructure de 30-50%, élimination des CAPEX"
    },
    {
      title: "Développement & Test",
      description: "Création rapide d'environnements de dev/test, clonage d'environnements de production, destruction après usage.",
      industries: ["Software", "Technology", "Finance"],
      businessImpact: "Accélération des cycles de release de 40%, réduction coûts dev/test de 60%"
    },
    {
      title: "Applications métier (ERP, CRM)",
      description: "Hébergement SAP, Oracle, Dynamics 365, applications legacy critiques avec haute disponibilité.",
      industries: ["Manufacturing", "Retail", "Healthcare"],
      businessImpact: "Disponibilité 99.99%, réduction TCO de 35% vs on-premises"
    },
    {
      title: "Workloads Big Data & Analytics",
      description: "Clusters Hadoop, Spark, bases de données analytiques nécessitant haute RAM/CPU.",
      industries: ["Finance", "Healthcare", "Retail"],
      businessImpact: "Élasticité pour traiter pics de données, coûts optimisés avec auto-scaling"
    },
    {
      title: "VDI (Virtual Desktop Infrastructure)",
      description: "Postes de travail virtualisés avec Azure Virtual Desktop, accès sécurisé remote.",
      industries: ["All"],
      businessImpact: "Productivité remote +25%, sécurité renforcée, réduction coûts hardware"
    },
    {
      title: "Disaster Recovery & Backup",
      description: "Site de secours Azure avec Azure Site Recovery, RPO < 5 minutes.",
      industries: ["Finance", "Healthcare", "Government"],
      businessImpact: "Conformité réglementaire, continuité d'activité garantie"
    },
    {
      title: "Batch Processing & HPC",
      description: "Calculs scientifiques, rendering 3D, simulations financières nécessitant forte puissance.",
      industries: ["Research", "Finance", "Media"],
      businessImpact: "Réduction temps de calcul de 70%, coûts à l'usage"
    },
    {
      title: "Web Applications & API Backends",
      description: "Hébergement applications web multi-tiers avec load balancing et auto-scaling.",
      industries: ["E-commerce", "Media", "SaaS"],
      businessImpact: "Scalabilité illimitée, disponibilité 99.99%, performance optimale"
    }
  ],

  // Industries cibles
  targetIndustries: [
    "Finance & Banking",
    "Healthcare",
    "Retail & E-commerce",
    "Manufacturing",
    "Government & Public Sector",
    "Education",
    "Media & Entertainment",
    "Technology & Software",
    "Telecommunications",
    "Energy & Utilities"
  ],

  // Taille client idéale
  idealCustomerSize: "All", // SME, Enterprise, All

  // Personas cibles
  targetPersonas: [
    "CTO - Chief Technology Officer",
    "Infrastructure Manager",
    "Cloud Architect",
    "IT Manager",
    "DevOps Engineer",
    "CFO - Chief Financial Officer (pour coûts CAPEX → OPEX)",
    "CISO - Chief Information Security Officer"
  ],

  // Pricing
  pricingModel: "pay-as-you-go", // pay-as-you-go, subscription, reserved, spot
  pricingTiers: [
    {
      tier: "Pay-as-you-go",
      description: "Facturation à la seconde, arrêt/démarrage flexible",
      pricing: "€0.004/heure (B1s) à €4.50/heure (E96-64s v5)",
      bestFor: "Workloads variables, dev/test, POCs"
    },
    {
      tier: "Reserved Instances (1 an)",
      description: "Engagement 1 an avec paiement upfront/mensuel",
      pricing: "Économies jusqu'à 40% vs Pay-as-you-go",
      bestFor: "Production stable, workloads prévisibles"
    },
    {
      tier: "Reserved Instances (3 ans)",
      description: "Engagement 3 ans avec paiement upfront/mensuel",
      pricing: "Économies jusqu'à 72% vs Pay-as-you-go",
      bestFor: "Workloads long-terme, stratégie cloud-first"
    },
    {
      tier: "Spot Instances",
      description: "Utilisation de capacité inutilisée, peut être interrompu",
      pricing: "Économies jusqu'à 90% vs Pay-as-you-go",
      bestFor: "Batch processing, workloads fault-tolerant, HPC"
    }
  ],
  estimatedCost: "À partir de €30/mois (B1s Windows, ~744h/mois) à €3,350/mois (E96-64s v5 production)",

  // Implémentation
  implementationTime: "1 heure à 1 semaine selon complexité (simple VM vs migration complète)",
  complexity: "low", // low, medium, high

  // Prerequisites
  prerequisites: [
    "Compte Azure avec souscription active",
    "Connaissance des réseaux (VNet, subnets, NSG) recommandée",
    "Pour migration: Inventaire des serveurs on-premises, dépendances applicatives",
    "Azure Migrate recommandé pour migrations complexes"
  ],

  // Intégrations Azure natives
  integrations: [
    "Azure Virtual Network (VNet)",
    "Azure Load Balancer",
    "Azure Application Gateway",
    "Azure Storage (Managed Disks, Blobs)",
    "Azure Backup",
    "Azure Site Recovery",
    "Azure Monitor",
    "Azure Security Center",
    "Azure Active Directory",
    "Azure Bastion",
    "Azure Firewall",
    "Azure VPN Gateway",
    "ExpressRoute",
    "Azure DevOps",
    "Azure Automation",
    "Azure Policy",
    "Azure Key Vault"
  ],

  // Comparaison concurrence
  competitorComparison: [
    {
      competitor: "AWS EC2",
      ourAdvantages: [
        "Hybrid Benefit: Réutilisation licences Windows/SQL (-40% coûts) vs AWS BYOL complexe",
        "Intégration Active Directory native vs AWS Directory Service payant",
        "Azure Bastion inclus vs AWS Systems Manager Session Manager configuration complexe",
        "Prix Reserved Instances plus agressifs (jusqu'à 72% vs 66% AWS)",
        "Support Windows Server natif (Microsoft first-party)"
      ],
      theirWeaknesses: [
        "Pas de réutilisation facile des licences Microsoft existantes",
        "Coûts cachés pour data transfer inter-AZ",
        "Moins d'options pour workloads Windows legacy"
      ]
    },
    {
      competitor: "Google Compute Engine (GCE)",
      ourAdvantages: [
        "700+ VM sizes vs ~40 machine types GCP",
        "Support Windows Server complet vs support GCP limité",
        "Availability Zones dans toutes les régions vs limited GCP",
        "Intégration enterprise (AD, SCCM, WSUS) native",
        "Plus de régions globales (60+ vs 35 GCP)"
      ],
      theirWeaknesses: [
        "Offre IaaS Windows très limitée",
        "Moins de séries VM pour workloads spécialisés",
        "Pas d'équivalent Azure Hybrid Benefit"
      ]
    }
  ],

  // Sales priority (0-10, plus élevé = plus prioritaire)
  salesPriority: 8,
  isActive: true,
  isFeatured: true,

  // SEO & Recherche
  keywords: [
    "azure virtual machines",
    "azure vm",
    "iaas azure",
    "cloud servers",
    "windows server azure",
    "linux azure",
    "virtual machines",
    "azure compute",
    "azure infrastructure",
    "cloud migration",
    "lift and shift",
    "vm azure",
    "azure availability zones",
    "azure hybrid benefit",
    "reserved instances",
    "spot instances"
  ],

  tags: [
    "IaaS",
    "Compute",
    "Windows",
    "Linux",
    "Migration",
    "Infrastructure",
    "High-Availability",
    "Scalable",
    "Enterprise-Ready"
  ],

  // Solutions connexes
  relatedSolutions: [
    "azure-app-service",
    "azure-kubernetes-service",
    "azure-container-instances",
    "azure-virtual-desktop",
    "azure-vmware-solution"
  ],

  // Spécifications techniques
  technicalSpecs: {
    vmSeries: [
      {
        series: "B-Series (Burstable)",
        description: "VM économiques avec capacité de burst CPU pour workloads à faible utilisation",
        use: "Dev/test, applications web léger trafic, bases de données développement",
        sizes: "B1s (1 vCPU, 1GB RAM) à B20ms (20 vCPUs, 80GB RAM)",
        pricing: "À partir de €0.004/heure"
      },
      {
        series: "D-Series (General Purpose)",
        description: "Équilibre CPU/RAM pour la plupart des workloads production",
        use: "Applications web, serveurs applicatifs, bases de données small/medium",
        sizes: "D2s v5 (2 vCPUs, 8GB RAM) à D96s v5 (96 vCPUs, 384GB RAM)",
        pricing: "€0.096/heure (D2s v5) à €4.608/heure (D96s v5)"
      },
      {
        series: "E-Series (Memory Optimized)",
        description: "Ratio RAM/CPU élevé pour workloads gourmands en mémoire",
        use: "SAP HANA, SQL Server, bases de données in-memory, analytics",
        sizes: "E2s v5 (2 vCPUs, 16GB RAM) à E96s v5 (96 vCPUs, 672GB RAM)",
        pricing: "€0.126/heure (E2s v5) à €6.048/heure (E96s v5)"
      },
      {
        series: "F-Series (Compute Optimized)",
        description: "Ratio CPU/RAM élevé pour workloads compute-intensive",
        use: "Batch processing, web servers haute performance, analytics",
        sizes: "F2s v2 (2 vCPUs, 4GB RAM) à F72s v2 (72 vCPUs, 144GB RAM)",
        pricing: "€0.085/heure (F2s v2) à €3.06/heure (F72s v2)"
      },
      {
        series: "M-Series (Memory Ultra-Optimized)",
        description: "Jusqu'à 4TB RAM pour plus grandes bases de données",
        use: "SAP HANA (certifié), SQL Server massive, bases de données critiques",
        sizes: "M8ms (8 vCPUs, 218.75GB RAM) à M416ms (416 vCPUs, 11.4TB RAM)",
        pricing: "€2.20/heure (M8ms) à €111/heure (M416ms)"
      },
      {
        series: "L-Series (Storage Optimized)",
        description: "IOPS disques très élevés pour workloads I/O intensifs",
        use: "NoSQL (Cassandra, MongoDB), Data warehousing, Log processing",
        sizes: "L8s v3 (8 vCPUs, 64GB RAM) à L80s v3 (80 vCPUs, 640GB RAM)",
        pricing: "€0.624/heure (L8s v3) à €6.24/heure (L80s v3)"
      },
      {
        series: "N-Series (GPU)",
        description: "VM avec GPU NVIDIA pour IA/ML, rendering, visualisation",
        use: "Deep learning, AI training, rendering 3D, simulations",
        sizes: "NC6s v3 (6 vCPUs, 1 GPU V100) à ND96asr v4 (96 vCPUs, 8 GPU A100)",
        pricing: "€3.06/heure (NC6s v3) à €27.20/heure (ND96asr v4)"
      }
    ],
    networking: {
      bandwidth: "500 Mbps (B1s) à 30,000 Mbps (D96s v5) selon taille VM",
      acceleratedNetworking: "Disponible sur séries D, E, F, M, L, N pour latence < 1ms",
      ipv6Support: "Full dual-stack IPv4/IPv6"
    },
    storage: {
      osDisk: "SSD Premium (P10-P80), SSD Standard (E10-E80), HDD Standard (S4-S70)",
      dataDisk: "Jusqu'à 64 disques par VM selon série",
      maxIOPS: "80,000 IOPS (Ultra SSD), 20,000 IOPS (Premium SSD v2)",
      maxThroughput: "4,000 MB/s (Ultra SSD)"
    }
  },

  // Fonctionnalités de sécurité
  securityFeatures: [
    "Azure Disk Encryption (BitLocker/dm-crypt) pour encryption at-rest",
    "Encryption in-transit automatique (TLS 1.2)",
    "Network Security Groups (NSG) stateful firewall",
    "Azure Firewall intégration pour inspection deep-packet",
    "Azure Bastion pour accès RDP/SSH sans IP publique",
    "Azure Security Center pour threat detection",
    "Just-In-Time VM Access pour réduction surface d'attaque",
    "Azure Active Directory integration pour SSO",
    "Role-Based Access Control (RBAC) granulaire",
    "Azure Key Vault pour gestion secrets/certificats",
    "DDoS Protection Standard pour mitigation attaques",
    "Azure Sentinel integration pour SIEM",
    "Confidential Computing (VMs série DC) avec Intel SGX",
    "Trusted Launch pour protection boot-level contre rootkits"
  ],

  // Certifications de conformité
  complianceCerts: [
    "ISO 27001, 27017, 27018",
    "SOC 1, SOC 2, SOC 3",
    "PCI DSS Level 1",
    "HIPAA / HITECH",
    "FedRAMP High",
    "GDPR compliant",
    "CSA STAR Certification",
    "IRAP (Australia)",
    "MTCS (Singapore)",
    "ENS High (Spain)",
    "C5 (Germany)",
    "OSPAR (Japan)"
  ],

  // URLs de ressources
  documentationUrl: "https://learn.microsoft.com/en-us/azure/virtual-machines/",
  pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/virtual-machines/windows/",
  demoUrl: "https://azure.microsoft.com/en-us/products/virtual-machines/",
  caseStudyUrls: [
    "https://customers.microsoft.com/en-us/search?sq=%22Azure%20Virtual%20Machines%22",
    "https://azure.microsoft.com/en-us/case-studies/"
  ]
};

// Fonction principale
async function main() {
  try {
    console.log('🚀 Adding Azure Virtual Machines solution to knowledge base...\n');

    const response = await fetch('http://localhost:3001/api/azure-solutions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(azureVMSolution)
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ SUCCESS! Azure Virtual Machines solution added!\n');
      console.log('Solution ID:', result.solution.id);
      console.log('Name:', result.solution.name);
      console.log('Official Name:', result.solution.officialName);
      console.log('Category:', result.solution.category);
      console.log('Sales Priority:', result.solution.salesPriority);
      console.log('\n📊 Stats:');
      console.log('- Key Features:', result.solution.keyFeatures.length);
      console.log('- Benefits:', result.solution.benefits.length);
      console.log('- Use Cases:', result.solution.useCases.length);
      console.log('- Target Industries:', result.solution.targetIndustries.length);
      console.log('- Keywords:', result.solution.keywords.length);
      console.log('\n✨ Knowledge base is now stronger!');
    } else {
      console.error('❌ ERROR:', result.error);
      console.error('Details:', result.details);
    }
  } catch (error) {
    console.error('❌ FAILED to add solution:', error.message);
    console.error('\n💡 Make sure:');
    console.error('1. Dev server is running (npm run dev)');
    console.error('2. Database migration was applied (npx prisma migrate dev)');
    console.error('3. API endpoint exists at /api/azure-solutions');
  }
}

main();
