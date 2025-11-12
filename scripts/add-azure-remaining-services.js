/**
 * Script pour ajouter remaining Azure services from screenshots
 * Security (AIP, Firewall, Sphere), Analytics (Fabric, Data Lake), Management (Blueprints)
 * Exécuter avec: node scripts/add-azure-remaining-services.js
 */

const remainingSolutions = [

  // 1. AZURE INFORMATION PROTECTION (AIP)
  {
    name: "azure-information-protection",
    officialName: "Azure Information Protection (AIP)",
    category: "security",
    subcategory: "data-protection",
    shortDescription: "Cloud-based solution classify, label, et protect sensitive information (documents, emails) via encryption, access restrictions, et visual markings based on sensitivity policies.",
    fullDescription: "Azure Information Protection (AIP) est un cloud-based solution qui helps organizations classify, label, protect sensitive information both within and outside organization. Apply persistent protection to files et emails so data remains secure regardless of location (inside/outside organization, networks, file servers, applications). Works by: administrators/users apply labels (Public, Internal, Confidential, Highly Confidential), labels trigger protection settings (encryption, access restrictions, watermarks), protection travels with document wherever shared. Integrates seamlessly Microsoft 365 (Word, Excel, Outlook, Teams, SharePoint, OneDrive), uses Azure Rights Management (Azure RMS) encryption technology. Monitors usage via dashboards, reports help maintain compliance. Use cases: regulatory compliance (GDPR, HIPAA), data loss prevention, secure collaboration external partners, intellectual property protection.",
    keyFeatures: [
      "Data Classification & Labeling - Automatically or manually classify documents, emails based on sensitivity (Public, Internal, Confidential, Highly Confidential)",
      "Protection & Encryption - Apply persistent protection via encryption, access restrictions, watermarks that stays with document wherever shared",
      "Access Controls & Rights Management - Define who can view, edit, share sensitive information, leverages Azure RMS policies",
      "Integration Microsoft 365 - Seamlessly works with Word, Excel, Outlook, Teams, SharePoint, OneDrive for consistent protection",
      "Visual Markings - Apply headers, footers, watermarks to documents indicating sensitivity",
      "Monitoring & Reporting - Track sensitive information usage, detect potential leaks, maintain compliance audit trails",
      "Automatic Classification - Rules classify content based on keywords, patterns (credit cards, SSN, etc.)",
      "Manual User Classification - End users apply labels based on document content judgment",
      "Persistent Protection - Encryption, restrictions travel with document independently of location",
      "External Collaboration Protection - Secure documents shared with partners, ensure proper protection settings",
      "File-Level Protection - Integrates Office apps, enforces protection at file level",
      "End-to-End Protection - Protection across email, documents, collaboration platforms"
    ],
    benefits: [
      "Regulatory Compliance - Meet requirements GDPR, HIPAA, ISO by enforcing consistent protection policies",
      "Data Loss Prevention - Prevent accidental or malicious sharing confidential information",
      "Secure External Collaboration - Share documents safely with partners, protection settings enforced",
      "Simplified User Experience - Clear labels, easy-to-understand policies for users",
      "Centralized Management - Administrators manage policies centrally, enforce across organization",
      "Audit Trails & Reporting - Complete visibility sensitive data usage for compliance"
    ],
    useCases: [
      {
        title: "Regulatory Compliance (GDPR, HIPAA, etc.)",
        description: "Enforce consistent protection policies on sensitive data (PII, PHI) to meet regulatory requirements.",
        industries: ["Healthcare", "Finance", "Legal", "All"],
        businessImpact: "Compliance achieved, regulatory fines avoided, customer trust improved, audit preparation simplified"
      },
      {
        title: "Data Loss Prevention",
        description: "Prevent accidental or malicious sharing confidential documents both within and outside organization.",
        industries: ["All"],
        businessImpact: "Data breaches prevented, intellectual property protected, accidental leaks eliminated"
      },
      {
        title: "Secure Collaboration avec External Partners",
        description: "Share contracts, proposals, financial docs with external partners ensuring appropriate protection enforced.",
        industries: ["Legal", "Finance", "Consulting"],
        businessImpact: "Collaboration secure, partner trust maintained, document control retained, risk reduced"
      },
      {
        title: "Intellectual Property Protection",
        description: "Protect trade secrets, financial data, product designs from unauthorized access, distribution.",
        industries: ["Manufacturing", "Technology", "Research"],
        businessImpact: "IP theft prevented, competitive advantage maintained, R&D investments protected"
      }
    ],
    targetIndustries: ["Healthcare", "Finance", "Legal", "Government", "Manufacturing", "All"],
    idealCustomerSize: "SME, Enterprise",
    targetPersonas: ["Security Officer", "Compliance Officer", "IT Manager", "Data Protection Officer", "Legal Counsel"],
    pricingModel: "subscription",
    pricingTiers: [
      {
        tier: "Azure Information Protection P1 (Included in M365 E3)",
        description: "Manual classification, labeling, protection",
        pricing: "Included Microsoft 365 E3/E5, ou standalone €1.70/user/month",
        bestFor: "Organizations requiring manual classification, basic protection"
      },
      {
        tier: "Azure Information Protection P2 (Included in M365 E5)",
        description: "Automatic classification, advanced analytics, protection recommendations",
        pricing: "Included Microsoft 365 E5, ou standalone €8.50/user/month",
        bestFor: "Advanced protection, automatic classification, analytics"
      }
    ],
    estimatedCost: "P1: €1.70/user/mois (or included M365 E3), P2: €8.50/user/mois (or included M365 E5)",
    implementationTime: "2-4 semaines",
    complexity: "medium",
    prerequisites: [
      "Microsoft 365 subscription or Azure AD",
      "Azure Information Protection policies defined",
      "Client software deployed on devices",
      "User training on classification, labeling"
    ],
    integrations: [
      "Microsoft Word, Excel, PowerPoint",
      "Outlook (email protection)",
      "Microsoft Teams",
      "SharePoint Online",
      "OneDrive for Business",
      "Azure Rights Management (Azure RMS)",
      "Microsoft Defender for Cloud Apps",
      "Microsoft 365 Compliance Center"
    ],
    competitorComparison: [
      {
        competitor: "Symantec Data Loss Prevention",
        ourAdvantages: [
          "Native Microsoft 365 integration (Office, Outlook, Teams seamless)",
          "Easier user experience (labels intuitive)",
          "Lower cost (included M365 E3/E5 vs Symantec expensive)",
          "Cloud-native architecture vs on-premises complexity"
        ],
        theirWeaknesses: [
          "Symantec DLP complex deployment",
          "Higher cost infrastructure",
          "Less native Microsoft integration"
        ]
      }
    ],
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: [
      "information protection",
      "data classification",
      "document encryption",
      "azure rms",
      "data loss prevention",
      "compliance",
      "gdpr",
      "hipaa"
    ],
    tags: ["Security", "Data-Protection", "Compliance", "Encryption", "DLP"],
    relatedSolutions: ["microsoft-365", "azure-ad", "microsoft-defender-cloud-apps"],
    technicalSpecs: {
      supportedFileTypes: ["Office documents", "PDFs", "Text files", "Images"],
      encryptionTechnology: "Azure Rights Management (RMS)",
      labelTypes: ["Manual labels", "Automatic labels", "Recommended labels"],
      protectionMethods: ["Encryption", "Access restrictions", "Visual markings", "Watermarks"]
    },
    securityFeatures: [
      "Persistent encryption",
      "Azure Rights Management (RMS)",
      "Access restrictions granulaires",
      "Visual markings (headers, footers, watermarks)",
      "Audit logging comprehensive",
      "Usage tracking",
      "Document expiration",
      "Revocation capabilities",
      "Compliance: GDPR, HIPAA, ISO, SOC 2"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "GDPR"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/information-protection/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/information-protection/",
    demoUrl: "https://www.microsoft.com/en-us/security/business/information-protection/azure-information-protection"
  },

  // 2. AZURE FIREWALL
  {
    name: "azure-firewall",
    officialName: "Azure Firewall",
    category: "networking",
    subcategory: "network-security",
    shortDescription: "Managed, cloud-based stateful network security service protect Azure Virtual Network resources avec threat intelligence, application/network filtering, high availability, unrestricted cloud scalability.",
    fullDescription: "Azure Firewall est un managed, cloud-based, stateful network security service qui protects Azure Virtual Network resources. Provides robust, scalable, highly available filtering both inbound and outbound traffic. Key capabilities: application FQDN filtering, network traffic filtering (IP, port, protocol), threat intelligence feeds detect/block malicious IPs/domains, outbound SNAT et inbound DNAT support, high availability built-in (no load balancers required), unrestricted cloud scalability, integration Azure Monitor logging/analytics. Supports centralized management multiple virtual networks, hybrid environments via Azure Virtual WAN. Use cases: perimeter security, secure hub-spoke networks, hybrid connectivity protection, secure application deployments, compliance requirements (PCI, HIPAA). Idéal remplacer network virtual appliances (NVAs) avec solution fully managed.",
    keyFeatures: [
      "Stateful Firewall - Inspects traffic bidirectionally, maintains connection state for security",
      "Application FQDN Filtering - Filter outbound traffic by fully qualified domain names (allow *.microsoft.com)",
      "Network Traffic Filtering - Filter inbound/outbound traffic by IP, port, protocol (layer 3-4)",
      "Threat Intelligence - Built-in Microsoft threat intelligence feeds alert/block known malicious IPs, domains",
      "Outbound SNAT - Network Address Translation for outbound traffic from VNet to internet",
      "Inbound DNAT - Destination NAT for inbound traffic from internet to VNet resources",
      "High Availability - Built-in 99.99% SLA, no external load balancers required",
      "Unrestricted Cloud Scalability - Auto-scales traffic loads without manual intervention",
      "Centralized Management - Manage multiple firewalls, virtual networks from single Azure Firewall Policy",
      "Integration Azure Monitor - Comprehensive logging, analytics, alerts for traffic, threats",
      "Forced Tunneling - Route internet-bound traffic through on-premises firewall",
      "Hybrid Connectivity - Protect hybrid environments via Azure Virtual WAN integration",
      "Application Rules - Allow/deny traffic based on FQDN, HTTP/HTTPS, SQL",
      "Network Rules - Allow/deny traffic based on source/dest IP, port, protocol"
    ],
    benefits: [
      "Fully Managed - Zero infrastructure management, patching, updates vs NVAs manual maintenance",
      "High Availability - Built-in 99.99% SLA vs NVA HA complex setup",
      "Cost-Efficient - Predictable pricing, no over-provisioning vs NVA licensing expensive",
      "Scalability - Auto-scales traffic vs NVA capacity limits",
      "Security Intelligence - Threat feeds integrated vs manual updates",
      "Simplified Operations - Centralized policies vs per-device configuration"
    ],
    useCases: [
      {
        title: "Perimeter Security for Azure Virtual Networks",
        description: "Protect Virtual Networks from internet threats, filter inbound/outbound traffic centrally.",
        industries: ["All"],
        businessImpact: "Attack surface reduced, unauthorized access blocked, compliance requirements met, security posture improved"
      },
      {
        title: "Secure Hub-Spoke Network Architecture",
        description: "Centralize security policies in hub VNet, protect spoke VNets (workloads) via Azure Firewall hub.",
        industries: ["Enterprises"],
        businessImpact: "Network segmentation enforced, security management centralized, lateral movement prevented"
      },
      {
        title: "Hybrid Connectivity Protection",
        description: "Protect traffic between on-premises networks and Azure via VPN/ExpressRoute.",
        industries: ["Enterprises avec hybrid infrastructure"],
        businessImpact: "Hybrid traffic secured, consistent policies on-prem + cloud, visibility unified"
      },
      {
        title: "Compliance Requirements (PCI, HIPAA)",
        description: "Meet regulatory requirements filtering, logging network traffic for audit compliance.",
        industries: ["Finance", "Healthcare", "E-commerce"],
        businessImpact: "Compliance achieved, audit trails complete, regulatory fines avoided"
      }
    ],
    targetIndustries: ["All", "Finance", "Healthcare", "Government", "E-commerce"],
    idealCustomerSize: "SME, Enterprise",
    targetPersonas: ["Network Engineer", "Security Engineer", "IT Manager", "Cloud Architect"],
    pricingModel: "usage-based",
    pricingTiers: [
      {
        tier: "Standard",
        description: "Stateful firewall, threat intelligence, application/network filtering",
        pricing: "€1.02/hour deployment + €0.013 per GB processed",
        bestFor: "Most production environments, standard security requirements"
      },
      {
        tier: "Premium",
        description: "Advanced threat protection, TLS inspection, IDPS, web categories",
        pricing: "€0.64/hour deployment + €0.013 per GB processed + €0.033 per GB IDPS",
        bestFor: "High-security environments, advanced threat protection needs"
      }
    ],
    estimatedCost: "Standard: €750/mois (deployment) + data processing €100-500/mois, Premium: €470/mois + data + IDPS",
    implementationTime: "1-2 semaines",
    complexity: "medium",
    prerequisites: [
      "Azure Virtual Network created",
      "Subnet dedicated pour Azure Firewall (minimum /26 CIDR)",
      "Route tables configured direct traffic to firewall",
      "Firewall policies defined (application rules, network rules)"
    ],
    integrations: [
      "Azure Virtual Network",
      "Azure Virtual WAN",
      "Azure Monitor (logging, analytics)",
      "Azure Sentinel (SIEM integration)",
      "Azure DDoS Protection",
      "VPN Gateway",
      "ExpressRoute",
      "Azure Firewall Policy (centralized management)",
      "Azure Security Center"
    ],
    competitorComparison: [
      {
        competitor: "Palo Alto Networks VM-Series NVA",
        ourAdvantages: [
          "Fully managed - Zero infrastructure vs NVA VM management overhead",
          "Built-in HA - No load balancer setup vs NVA complex HA",
          "Auto-scaling - Handles spikes vs NVA capacity limits",
          "Lower cost - Predictable pricing vs NVA expensive licensing"
        ],
        theirWeaknesses: [
          "NVA requires VM management, patching",
          "HA setup complex (load balancers, failover)",
          "Licensing expensive, capacity-limited",
          "Manual scaling required"
        ]
      },
      {
        competitor: "Fortinet FortiGate NVA",
        ourAdvantages: [
          "Native Azure service - Seamless integration vs NVA third-party",
          "Automatic updates - Microsoft manages vs manual NVA updates",
          "Scalability unlimited - Auto-scales vs FortiGate VM capacity",
          "Support integrated - Microsoft support vs third-party"
        ],
        theirWeaknesses: [
          "FortiGate NVA third-party support required",
          "Manual updates, patching",
          "Capacity limits per VM size"
        ]
      }
    ],
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: [
      "firewall",
      "network security",
      "stateful firewall",
      "threat intelligence",
      "network filtering",
      "perimeter security",
      "vnet protection"
    ],
    tags: ["Networking", "Security", "Firewall", "Threat-Protection", "Network-Filtering"],
    relatedSolutions: ["azure-virtual-network", "azure-vpn-gateway", "azure-ddos-protection", "azure-monitor"],
    technicalSpecs: {
      throughput: "30 Gbps (Standard), 100 Gbps (Premium)",
      availability: "99.99% SLA",
      supportedProtocols: ["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "MSSQL"],
      ruleTypes: ["Application rules (FQDN)", "Network rules (IP, port, protocol)", "NAT rules (DNAT)"],
      threatIntelligence: "Microsoft threat intelligence feeds"
    },
    securityFeatures: [
      "Stateful packet inspection",
      "Threat intelligence integration",
      "Application FQDN filtering",
      "Network traffic filtering",
      "IDPS (Premium tier)",
      "TLS inspection (Premium tier)",
      "Web categories filtering (Premium tier)",
      "Logging comprehensive (Azure Monitor)",
      "Audit trails complete",
      "Compliance: PCI DSS, HIPAA, ISO 27001"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "PCI DSS"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/firewall/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/azure-firewall/",
    demoUrl: "https://azure.microsoft.com/en-us/products/azure-firewall"
  }

];

// Fonction principale
async function main() {
  console.log(`🚀 Adding ${remainingSolutions.length} remaining Azure solutions...\n`);
  console.log(`📋 Solutions à ajouter:`);
  remainingSolutions.forEach((sol, idx) => {
    console.log(`   ${idx + 1}. ${sol.officialName} (${sol.category} - ${sol.subcategory})`);
  });
  console.log('');

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (const solution of remainingSolutions) {
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

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n\n${'='.repeat(80)}`);
  console.log(`📊 SUMMARY:`);
  console.log(`   ✅ Success: ${successCount}/${remainingSolutions.length}`);
  console.log(`   ❌ Failed: ${failCount}/${remainingSolutions.length}`);

  if (errors.length > 0) {
    console.log(`\n❌ Errors:`);
    errors.forEach(err => {
      console.log(`   - ${err.solution}: ${err.error}`);
    });
  }

  console.log(`\n✨ Remaining Azure solutions added successfully!`);
  console.log(`\n🌐 Visit http://localhost:3000/azure-knowledge`);
}

main();
