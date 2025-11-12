/**
 * Script pour ajouter les solutions Azure Networking (Partie 1)
 * VNet, Load Balancer, Application Gateway, VPN Gateway
 * Exécuter avec: node scripts/add-networking-solutions-part1.js
 */

const networkingSolutionsPart1 = [
  // 1. Azure Virtual Network (VNet)
  {
    name: "azure-virtual-network",
    officialName: "Azure Virtual Network (VNet)",
    category: "networking",
    subcategory: "core-networking",
    shortDescription: "Réseau privé isolé dans Azure permettant aux ressources (VMs, databases, containers) de communiquer de manière sécurisée entre elles, avec Internet, et avec réseaux on-premises.",
    fullDescription: "Azure Virtual Network (VNet) est le building block fondamental du networking Azure. VNet permet de créer des réseaux privés isolés dans le cloud avec contrôle total sur IP addressing, subnets, routing tables, et network gateways. Les ressources Azure (VMs, App Services, AKS) déployées dans un VNet peuvent communiquer de manière sécurisée via des IP privées. VNet supporte connectivity hybride (VPN Gateway, ExpressRoute) pour connexion on-premises, VNet peering pour inter-VNet communication, et service endpoints pour accès direct aux services Azure PaaS. Aucun frais pour VNet lui-même - gratuit jusqu'à 1000 VNets par subscription.",
    keyFeatures: [
      "Isolation complète - Chaque VNet est privé et isolé des autres VNets par défaut",
      "Subnets - Division VNet en segments pour organisation trafic (web tier, app tier, data tier)",
      "Network Security Groups (NSG) - Firewall stateful avec règles inbound/outbound granulaires",
      "VNet Peering - Connexion VNets même région (regional) ou inter-régions (global) avec latence faible",
      "Service Endpoints - Accès direct optimisé aux services Azure PaaS (Storage, SQL DB) via backbone Microsoft",
      "Private Link / Private Endpoints - Accès privé services Azure PaaS via IP privée VNet",
      "User Defined Routes (UDR) - Contrôle routing personnalisé pour trafic VNet",
      "Azure Firewall integration - Filtering trafic centralisé avec FQDN, threat intelligence",
      "Azure Bastion integration - Accès RDP/SSH sécurisé sans IP publique",
      "Hybrid connectivity - VPN Gateway et ExpressRoute pour connexion on-premises",
      "IPv4 et IPv6 dual-stack support",
      "DDoS Protection - Basic (gratuit) ou Standard (protection avancée)",
      "VNet jusqu'à /8 address space (16 millions IPs)",
      "Application Security Groups (ASG) - Regroupement logique VMs pour NSG rules",
      "Azure DNS integration - Résolution noms privés pour ressources VNet"
    ],
    benefits: [
      "Gratuit - Aucun coût pour VNet base (frais uniquement peering et data transfer)",
      "Isolation & Sécurité - Réseau privé isolé avec NSG multi-layer",
      "Hybrid ready - Connexion seamless on-premises via VPN/ExpressRoute",
      "Scalabilité - Jusqu'à 1000 VNets par subscription, expansion facile",
      "Contrôle total - Full control IP addressing, subnets, routing, security",
      "Performance - Low latency inter-VNet peering via backbone Microsoft"
    ],
    useCases: [
      {
        title: "Hosting Applications Sécurisées",
        description: "Hébergement VMs, databases, applications web dans réseau isolé avec segmentation multi-tier.",
        industries: ["All"],
        businessImpact: "Sécurité renforcée, compliance, isolation workloads"
      },
      {
        title: "Hybrid Cloud Connectivity",
        description: "Extension réseau on-premises vers Azure via VPN ou ExpressRoute pour coexistence workloads.",
        industries: ["Finance", "Healthcare", "Manufacturing", "Government"],
        businessImpact: "Migration graduelle cloud, coexistence on-prem/cloud, DR site Azure"
      },
      {
        title: "Microservices & Container Networking",
        description: "Networking pour AKS clusters, container instances avec isolation et service discovery.",
        industries: ["Technology", "SaaS"],
        businessImpact: "Network isolation microservices, scaling elastic, service mesh ready"
      },
      {
        title: "Disaster Recovery",
        description: "Site DR Azure avec VNet peering vers production pour failover rapide.",
        industries: ["All"],
        businessImpact: "RPO/RTO optimisés, backup site toujours prêt, peering low-latency"
      }
    ],
    targetIndustries: ["All", "Finance", "Healthcare", "Technology", "Manufacturing", "Government", "Retail"],
    idealCustomerSize: "All",
    targetPersonas: ["Network Engineer", "Cloud Architect", "Infrastructure Manager", "Security Architect", "DevOps Engineer"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "VNet Base",
        description: "Virtual Network création et gestion",
        pricing: "GRATUIT - Aucun frais pour créer et utiliser VNets",
        bestFor: "Tous usages - Pas de limite nombre VNets (max 1000/subscription)"
      },
      {
        tier: "Regional VNet Peering",
        description: "Peering entre VNets dans même région Azure",
        pricing: "€0.01/GB inbound et outbound (facturé aux deux extrémités)",
        bestFor: "Multi-VNet architecture, isolation workloads même région"
      },
      {
        tier: "Global VNet Peering",
        description: "Peering entre VNets inter-régions (cross-region)",
        pricing: "€0.035/GB inbound et outbound (varie selon zones géographiques)",
        bestFor: "Multi-region deployments, DR inter-régions, global applications"
      },
      {
        tier: "Data Transfer within VNet",
        description: "Trafic intra-VNet (entre ressources même VNet)",
        pricing: "GRATUIT - Pas de frais data transfer au sein d'un VNet",
        bestFor: "Tous usages - Communication gratuite intra-VNet"
      }
    ],
    estimatedCost: "VNet gratuit + peering €10/TB (regional) ou €35/TB (global) si applicable",
    implementationTime: "30 minutes à 4 heures selon complexité",
    complexity: "medium",
    prerequisites: [
      "Planification IP address space (éviter conflits avec on-prem)",
      "Design subnet strategy (nombre, taille, naming convention)",
      "Compréhension networking basique (CIDR, subnetting, routing)",
      "Pour hybrid: VPN device on-prem ou ExpressRoute circuit"
    ],
    integrations: [
      "Azure Virtual Machines",
      "Azure Kubernetes Service",
      "Azure App Service",
      "Azure SQL Database (Private Link)",
      "Azure Storage (Service Endpoints)",
      "Azure VPN Gateway",
      "Azure ExpressRoute",
      "Azure Firewall",
      "Azure Bastion",
      "Azure Load Balancer",
      "Azure Application Gateway",
      "Azure DDoS Protection",
      "Azure Private Link",
      "Azure DNS"
    ],
    competitorComparison: [
      {
        competitor: "AWS VPC",
        ourAdvantages: [
          "VNet peering global plus simple (AWS nécessite Transit Gateway complexe)",
          "Service Endpoints natifs pour PaaS (AWS PrivateLink configuration lourde)",
          "Global peering inclus (AWS Transit Gateway payant supplémentaire)",
          "NSG application à subnet ET NIC (AWS security groups NIC only)"
        ],
        theirWeaknesses: [
          "AWS Transit Gateway coûts additionnels significatifs",
          "Configuration VPC peering multi-région complexe",
          "PrivateLink setup plus lourd"
        ]
      },
      {
        competitor: "Google Cloud VPC",
        ourAdvantages: [
          "VNet peering bidirectionnel simple (GCP VPC Peering limitations)",
          "NSG + ASG granularité supérieure (GCP firewall rules moins flexible)",
          "Private Link pour tous services PaaS (GCP Private Service Connect limité)",
          "Hybrid connectivity options multiples (VPN + ExpressRoute)"
        ],
        theirWeaknesses: [
          "GCP VPC peering limitations topologie (no transitive peering)",
          "Firewall rules moins granulaires",
          "Private connectivity PaaS limité"
        ]
      }
    ],
    salesPriority: 10,
    isActive: true,
    isFeatured: true,
    keywords: [
      "vnet",
      "virtual network",
      "private network",
      "subnets",
      "nsg",
      "network security groups",
      "peering",
      "hybrid connectivity",
      "isolation"
    ],
    tags: ["Networking", "Core", "Foundation", "Security", "Hybrid", "Free"],
    relatedSolutions: ["azure-vpn-gateway", "azure-expressroute", "azure-firewall", "azure-bastion", "azure-load-balancer"],
    technicalSpecs: {
      maxAddressSpace: "/8 (16,777,216 IPs)",
      maxSubnets: "3000 per VNet",
      maxVNetsPerSubscription: "1000",
      maxPeerings: "500 per VNet",
      maxNSGsPerSubscription: "5000",
      maxNSGRulesPerNSG: "1000",
      ipVersions: ["IPv4", "IPv6 (dual-stack)"]
    },
    securityFeatures: [
      "Network Security Groups (NSG) - Firewall stateful",
      "Application Security Groups (ASG) - Groupement logique",
      "Azure Firewall integration",
      "DDoS Protection Basic (gratuit) ou Standard",
      "Private Link / Private Endpoints pour PaaS",
      "Service Endpoints pour accès optimisé PaaS",
      "Azure Bastion pour RDP/SSH sécurisé",
      "User Defined Routes (UDR) pour traffic control",
      "Network Watcher pour monitoring et diagnostics",
      "NSG Flow Logs pour audit trafic"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "PCI DSS", "GDPR", "FedRAMP"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/virtual-network/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/virtual-network/",
    demoUrl: "https://azure.microsoft.com/en-us/products/virtual-network/"
  },

  // 2. Azure Load Balancer
  {
    name: "azure-load-balancer",
    officialName: "Azure Load Balancer",
    category: "networking",
    subcategory: "load-balancing",
    shortDescription: "Load balancer Layer 4 (TCP/UDP) haute performance pour distribuer trafic réseau entrant sur multiple backends avec health probing et haute disponibilité.",
    fullDescription: "Azure Load Balancer est un load balancer Layer 4 (transport layer) distribu gérant millions de requêtes/seconde avec ultra-low latency. Supporte trafic inbound (Internet vers VMs) et outbound (VMs vers Internet), health probing automatique, distribution session affinity, et Availability Zones pour 99.99% SLA. Standard Load Balancer offre features avancées: backend pools jusqu'à 1000 instances, HA Ports, monitoring metrics détaillées, et intégration avec VNet service endpoints. Idéal pour applications non-HTTP nécessitant simple TCP/UDP load balancing (databases clusters, gaming servers, DNS, etc.).",
    keyFeatures: [
      "Layer 4 Load Balancing - TCP et UDP protocols",
      "Ultra-low latency - Microsecond latency, millions requests/second",
      "Health Probes - HTTP, HTTPS, TCP probes automatiques avec auto-removal unhealthy instances",
      "Inbound et Outbound scenarios - Internet-facing ou Internal load balancer",
      "Session persistence - Client IP, Client IP+Protocol, ou 5-tuple hash distribution",
      "HA Ports - Load balance all ports simultanément (Standard SKU)",
      "Availability Zones support - Zone-redundant et zonal frontends pour 99.99% SLA",
      "Backend pools jusqu'à 1000 instances (Standard)",
      "Multiple frontends - Support multiple public IPs sur même load balancer",
      "Outbound rules - Contrôle explicit outbound connectivity (SNAT)",
      "Floating IP - Direct Server Return pour SQL AlwaysOn scenarios",
      "IPv6 support - Dual-stack IPv4/IPv6 load balancing",
      "Diagnostics - Azure Monitor metrics, logs, Network Watcher integration"
    ],
    benefits: [
      "Gratuit (Basic) - Basic Load Balancer sans frais pour petits workloads",
      "Performance extrême - Sub-millisecond latency, millions ops/sec",
      "Haute disponibilité - 99.99% SLA avec Availability Zones (Standard)",
      "Simple & fiable - Pas de configuration complexe, always-on",
      "Scalabilité massive - Backend pools jusqu'à 1000 VMs",
      "Zero management - Service fully managed, auto-scaling built-in"
    ],
    useCases: [
      {
        title: "Database Clusters Load Balancing",
        description: "Load balancing SQL Server AlwaysOn, MySQL clusters, databases nécessitant TCP load balancing.",
        industries: ["Finance", "E-commerce", "SaaS"],
        businessImpact: "High availability databases, automatic failover, 99.99% uptime"
      },
      {
        title: "Gaming Servers",
        description: "Distribution joueurs sur multiple game servers avec low latency UDP/TCP load balancing.",
        industries: ["Gaming"],
        businessImpact: "Low latency (< 1ms), session persistence, scaling automatique"
      },
      {
        title: "Internal Applications Load Balancing",
        description: "Load balancing applications internes (non-HTTP) entre VMs dans VNet.",
        industries: ["All"],
        businessImpact: "Redondance apps internes, high availability sans Internet exposure"
      },
      {
        title: "Outbound Connectivity",
        description: "Centralisation outbound Internet connectivity pour VMs avec outbound rules et SNAT.",
        industries: ["All"],
        businessImpact: "Contrôle centralisé outbound IPs, security, audit"
      }
    ],
    targetIndustries: ["All", "Finance", "Gaming", "E-commerce", "SaaS", "Technology"],
    idealCustomerSize: "All",
    targetPersonas: ["Network Engineer", "Infrastructure Architect", "Database Administrator", "DevOps Engineer"],
    pricingModel: "pay-as-you-go",
    pricingTiers: [
      {
        tier: "Basic Load Balancer",
        description: "Load balancer basique Layer 4 (deprecated - retrait Sept 2025)",
        pricing: "GRATUIT (mais deprecated - migration vers Standard recommandée)",
        bestFor: "LEGACY ONLY - Ne plus utiliser (retirement Sept 2025)"
      },
      {
        tier: "Standard Load Balancer",
        description: "Load balancer production avec features avancées et SLA 99.99%",
        pricing: "€18.25/mois par rule + €0.004 per GB data processed",
        bestFor: "Production workloads, HA requirements, Availability Zones"
      }
    ],
    estimatedCost: "Standard: €18.25/mois + €4/TB data processed (très économique pour performance)",
    implementationTime: "1-3 heures",
    complexity: "low",
    prerequisites: [
      "VMs ou VMSS dans backend pool",
      "VNet configuré",
      "Health probe endpoints définis sur backends",
      "Pour public LB: Public IP address"
    ],
    integrations: [
      "Azure Virtual Machines",
      "Azure Virtual Machine Scale Sets",
      "Azure Kubernetes Service",
      "Azure Virtual Network",
      "Azure Availability Zones",
      "Azure Monitor",
      "Azure Network Watcher",
      "Azure Firewall (outbound scenarios)"
    ],
    competitorComparison: [
      {
        competitor: "AWS Network Load Balancer (NLB)",
        ourAdvantages: [
          "Standard LB moins cher (€18.25/mois vs $23/mois AWS + LCU costs)",
          "HA Ports feature unique (AWS nécessite listener par port)",
          "Availability Zones integration plus simple",
          "Outbound rules contrôle explicit (AWS NAT Gateway séparé)"
        ],
        theirWeaknesses: [
          "AWS NLB coûts LCU additionnels imprévisibles",
          "Configuration listeners par port (pas HA Ports)",
          "Outbound nécessite NAT Gateway séparé"
        ]
      },
      {
        competitor: "Google Cloud Load Balancing",
        ourAdvantages: [
          "Pricing plus simple et prévisible",
          "Standard LB features gratuites incluses (GCP Premium Network Tier payant)",
          "Session persistence options multiples",
          "Integration VNet seamless"
        ],
        theirWeaknesses: [
          "GCP Premium tier nécessaire pour features avancées (coût supplémentaire)",
          "Pricing complexe multi-tiers"
        ]
      }
    ],
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: [
      "load balancer",
      "layer 4",
      "tcp load balancing",
      "udp load balancing",
      "high availability",
      "health probe",
      "availability zones"
    ],
    tags: ["Networking", "Load-Balancing", "Layer-4", "High-Availability", "Performance"],
    relatedSolutions: ["azure-application-gateway", "azure-virtual-machines", "azure-vmss"],
    technicalSpecs: {
      skus: ["Basic (deprecated)", "Standard"],
      layer: "Layer 4 (Transport - TCP/UDP)",
      maxBackendInstances: "1000 (Standard), 300 (Basic)",
      maxRules: "Unlimited (Standard)",
      maxFrontendIPs: "600 (Standard)",
      sla: "99.99% (Standard with Availability Zones)"
    },
    securityFeatures: [
      "NSG integration pour traffic filtering",
      "Azure DDoS Protection integration",
      "Private Load Balancer (internal) pour isolation",
      "Outbound rules pour SNAT control",
      "Azure Monitor pour audit logs",
      "Network Watcher pour diagnostics"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "PCI DSS", "GDPR"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/load-balancer/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/load-balancer/",
    demoUrl: "https://azure.microsoft.com/en-us/products/load-balancer/"
  }

  // Application Gateway and VPN Gateway will be in part 2...
];

// Fonction principale
async function main() {
  console.log(`🚀 Adding ${networkingSolutionsPart1.length} Azure Networking solutions (Part 1)...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const solution of networkingSolutionsPart1) {
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
  console.log(`   ✅ Success: ${successCount}/${networkingSolutionsPart1.length}`);
  console.log(`   ❌ Failed: ${failCount}/${networkingSolutionsPart1.length}`);
}

main();
