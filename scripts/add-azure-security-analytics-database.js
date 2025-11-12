/**
 * Script pour ajouter Azure solutions: Security, Analytics, Database, Management
 * Basé sur les informations fournies par l'utilisateur
 * Exécuter avec: node scripts/add-azure-security-analytics-database.js
 */

const allSolutions = [

  // ============================================================
  // SECURITY CATEGORY
  // ============================================================

  // 1. AZURE KEY VAULT
  {
    name: "azure-key-vault",
    officialName: "Azure Key Vault",
    category: "security",
    subcategory: "secrets-management",
    shortDescription: "Service cloud pour securely store et manage secrets, encryption keys, et certificates avec centralized access control, audit logging, et HSM-backed protection.",
    fullDescription: "Azure Key Vault est un service cloud managed pour secure storage et management de secrets (passwords, connection strings, API keys), encryption keys (cryptographic keys pour encrypt/decrypt data), et certificates (SSL/TLS certificates avec automated renewal). Provides centralized secret management, eliminating hardcoded secrets in application code. Supports role-based access control (RBAC), Azure AD authentication, audit logging complet via Azure Monitor, et integration seamless avec Azure services (App Service, Functions, VMs, AKS). Offers two tiers: Standard (software-protected keys) et Premium (HSM-backed hardware security module protection FIPS 140-2 Level 2). Use cases: secure application configuration, database password storage, certificate lifecycle management, encryption key management, DevOps secrets automation. Pricing pay-per-operation ultra-low-cost.",
    keyFeatures: [
      "Secure Secret Management - Store passwords, API keys, connection strings securely vs hardcoding in code",
      "Key Management - Create, manage encryption keys used to encrypt data (customer-managed keys)",
      "Certificate Management - Provision, manage, deploy SSL/TLS certificates avec automated renewal",
      "HSM Protection (Premium) - Hardware Security Module FIPS 140-2 Level 2 certified pour keys ultra-secure",
      "Access Control & RBAC - Fine-grained permissions via Azure AD authentication et RBAC policies",
      "Audit Logging - Complet logging toutes access, operations via Azure Monitor pour compliance",
      "Soft Delete & Purge Protection - Recover accidentally deleted secrets/keys/certs, prevent permanent deletion",
      "Integration Azure Services - Native integration App Service, Functions, VMs, AKS, Logic Apps, etc.",
      "Versioning - Automatic versioning secrets/keys/certificates pour rollback capability",
      "Firewall & VNet Integration - Restrict access via IP firewall rules ou private endpoints (VNet)",
      "Backup & Restore - Backup keys/secrets/certificates pour disaster recovery",
      "Key Rotation - Automated ou manual rotation encryption keys, certificates",
      "Bring Your Own Key (BYOK) - Import your own keys from on-premises HSM"
    ],
    benefits: [
      "Enhanced Security - Remove secrets from application code, reduce exposure risk",
      "Centralized Management - One place manage all secrets, keys, certificates vs scattered",
      "Simplified Management - Automated certificate renewal vs manual processes",
      "Regulatory Compliance - Meet compliance requirements (HIPAA, SOC, ISO) avec audit logging",
      "Integration Ease - Native Azure services integration, no complex configuration",
      "Cost-Effective - Pay-per-operation model, no upfront infrastructure costs"
    ],
    useCases: [
      {
        title: "Secure Application Configuration",
        description: "Store database passwords, API keys, connection strings in Key Vault vs hardcoding in application code ou config files.",
        industries: ["All"],
        businessImpact: "Security improved, secrets rotation simplified, accidental exposure eliminated, compliance adherence"
      },
      {
        title: "Database Password Storage",
        description: "Store database connection passwords securely, rotate regularly, track access via audit logs.",
        industries: ["All"],
        businessImpact: "Database breaches prevented, password management centralized, compliance requirements met"
      },
      {
        title: "SSL/TLS Certificate Lifecycle Management",
        description: "Automated certificate provisioning, renewal, deployment pour web apps, APIs, load balancers.",
        industries: ["E-commerce", "Banking", "Healthcare", "All"],
        businessImpact: "Certificate expiration incidents eliminated, manual renewals reduced 100%, uptime improved"
      },
      {
        title: "Encryption Key Management (Customer-Managed Keys)",
        description: "Manage encryption keys pour Azure Storage, SQL Database, Cosmos DB avec full control rotation, access.",
        industries: ["Finance", "Healthcare", "Government"],
        businessImpact: "Data sovereignty maintained, compliance requirements met (GDPR, HIPAA), encryption control granular"
      },
      {
        title: "DevOps Secrets Automation",
        description: "CI/CD pipelines retrieve secrets from Key Vault dynamically vs storing in repos, pipeline variables.",
        industries: ["Technology", "All"],
        businessImpact: "Secrets leak prevented, deployment security improved, rotation automated, audit trails complete"
      }
    ],
    targetIndustries: ["All", "Finance", "Healthcare", "Technology", "E-commerce", "Government"],
    idealCustomerSize: "All",
    targetPersonas: ["Security Engineer", "DevOps Engineer", "Developer", "IT Manager", "CTO"],
    pricingModel: "pay-per-operation",
    pricingTiers: [
      {
        tier: "Standard",
        description: "Software-protected keys and secrets",
        pricing: "€0.025 per 10,000 operations (secrets/keys retrieval), Certificate operations: €2.60 per renewal",
        bestFor: "Most applications, cost-sensitive workloads"
      },
      {
        tier: "Premium (HSM-Protected)",
        description: "Hardware Security Module FIPS 140-2 Level 2 certified",
        pricing: "€0.95 per HSM-protected key per month + €0.025 per 10,000 operations",
        bestFor: "High-security requirements, compliance (finance, healthcare, government)"
      },
      {
        tier: "Managed HSM",
        description: "Dedicated single-tenant HSM pool",
        pricing: "€4 per HSM pool per hour (dedicated hardware)",
        bestFor: "Enterprises with very high-security compliance needs, dedicated HSM control"
      }
    ],
    estimatedCost: "Standard: €5-50/mois (most apps), Premium: €50-500/mois (high-security), Managed HSM: €2,880/mois per pool",
    implementationTime: "1-3 days",
    complexity: "low",
    prerequisites: [
      "Azure subscription",
      "Azure Key Vault resource created",
      "Azure AD permissions configured (access policies ou RBAC)",
      "Application code modified retrieve secrets via SDK ou REST API"
    ],
    integrations: [
      "Azure App Service (built-in Key Vault references)",
      "Azure Functions",
      "Azure VMs (via Managed Identity)",
      "Azure Kubernetes Service (AKS)",
      "Azure DevOps Pipelines",
      "GitHub Actions",
      "Azure Storage (customer-managed keys)",
      "Azure SQL Database (TDE encryption)",
      "Azure Cosmos DB (encryption)",
      "Azure Logic Apps",
      "Power Automate",
      "On-premises applications (via REST API)"
    ],
    competitorComparison: [
      {
        competitor: "AWS Secrets Manager",
        ourAdvantages: [
          "Lower cost - €0.025 per 10K operations vs $0.40 per 10K AWS",
          "HSM-backed keys cheaper (Premium tier vs AWS CloudHSM expensive)",
          "Better Azure ecosystem integration (App Service, Functions built-in)",
          "Certificate management native (AWS requires ACM separately)"
        ],
        theirWeaknesses: [
          "AWS Secrets Manager more expensive ($0.40/secret/month)",
          "AWS CloudHSM requires separate service, higher cost",
          "Certificate management needs separate ACM service"
        ]
      },
      {
        competitor: "HashiCorp Vault",
        ourAdvantages: [
          "Fully managed - Zero infrastructure vs Vault self-hosted complexity",
          "Native Azure integration (no configuration needed)",
          "Lower operational overhead (no servers, upgrades, patching)",
          "Simpler for Azure workloads"
        ],
        theirWeaknesses: [
          "HashiCorp Vault requires self-hosting infrastructure",
          "Complex setup, configuration, maintenance",
          "Operational overhead (servers, high availability, backups)"
        ]
      }
    ],
    salesPriority: 9,
    isActive: true,
    isFeatured: true,
    keywords: [
      "key vault",
      "secrets management",
      "encryption keys",
      "certificate management",
      "hsm",
      "password vault",
      "api keys",
      "ssl certificates"
    ],
    tags: ["Security", "Secrets-Management", "Encryption", "Certificates", "Compliance"],
    relatedSolutions: ["azure-app-service", "azure-functions", "azure-devops", "azure-ad"],
    technicalSpecs: {
      supportedObjectTypes: ["Secrets", "Keys (RSA, EC)", "Certificates"],
      keyTypes: ["RSA 2048-bit, 3072-bit, 4096-bit", "EC P-256, P-384, P-521"],
      hsmCompliance: "FIPS 140-2 Level 2 (Premium tier)",
      maxSecrets: "Unlimited secrets per vault",
      maxKeysPerVault: "Unlimited keys",
      apiProtocol: "REST APIs + SDKs (.NET, Python, Java, JavaScript, PowerShell)"
    },
    securityFeatures: [
      "Azure AD authentication",
      "RBAC granulaire access control",
      "Access policies fine-grained",
      "Soft delete (retention period configurable)",
      "Purge protection (prevent permanent deletion)",
      "Firewall IP restrictions",
      "VNet service endpoints",
      "Private endpoints support",
      "Audit logging (Azure Monitor)",
      "HSM-backed keys (Premium tier)",
      "Compliance: HIPAA, ISO 27001, SOC 2, GDPR, FedRAMP, PCI DSS"
    ],
    complianceCerts: ["ISO 27001", "SOC 2 Type 2", "HIPAA", "GDPR", "FedRAMP", "PCI DSS"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/key-vault/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/key-vault/",
    demoUrl: "https://azure.microsoft.com/en-us/products/key-vault"
  },

  // 2. MICROSOFT DEFENDER FOR CLOUD (Azure Security Center)
  {
    name: "microsoft-defender-for-cloud",
    officialName: "Microsoft Defender for Cloud (Azure Security Center)",
    category: "security",
    subcategory: "cloud-security-posture",
    shortDescription: "Unified security management system pour strengthen security posture, protect against threats avec advanced threat protection, security monitoring, et policy management across Azure, hybrid, multi-cloud.",
    fullDescription: "Microsoft Defender for Cloud (anciennement Azure Security Center) est une plateforme unified cloud-native application protection (CNAPP) qui provides: security posture management (CSPM - continuously assess environment against best practices, compliance), workload protection (CWPP - advanced threat protection pour VMs, containers, databases, storage), policy & compliance management (enforce organizational security standards), threat detection (machine learning analytics detect anomalies, malicious activity), automated remediation (playbooks, Azure Logic Apps integration), hybrid & multi-cloud support (Azure, AWS, GCP, on-premises). Includes: Secure Score (prioritize security actions), regulatory compliance dashboard (HIPAA, ISO, PCI, GDPR), integration Microsoft Defender suite (Endpoint, Identity, Cloud Apps), recommendations actionnables. Idéal pour: enterprise security posture management, threat protection, compliance adherence, security operations automation.",
    keyFeatures: [
      "Security Posture Management (CSPM) - Continuously assess environment security vs best practices, compliance standards",
      "Secure Score - Prioritize security recommendations avec score metrics, track improvements over time",
      "Threat Detection & Protection - Machine learning analytics detect threats, anomalies, malicious activity",
      "Workload Protection (CWPP) - Advanced protection VMs, containers, databases, storage, App Service",
      "Policy & Compliance Management - Enforce security policies, meet regulatory standards (HIPAA, ISO, PCI, GDPR)",
      "Regulatory Compliance Dashboard - Visualize compliance posture across standards (HIPAA, ISO 27001, PCI DSS, GDPR)",
      "Automated Remediation - Playbooks, Azure Logic Apps integration automatiser incident response",
      "Hybrid & Multi-Cloud Support - Protect Azure, AWS, GCP, on-premises workloads unified dashboard",
      "Integration Microsoft Defender Suite - Defender for Endpoint, Identity, Cloud Apps comprehensive security",
      "Vulnerability Assessment - Built-in vulnerability scanning VMs, containers sans agent additionnel",
      "Just-in-Time VM Access - Reduce attack surface avec temporary, controlled VM access",
      "Adaptive Application Controls - Whitelist applications allowed to run on VMs",
      "File Integrity Monitoring - Track changes critical files, registry keys",
      "Network Security Recommendations - NSG hardening, DDoS protection, firewall recommendations"
    ],
    benefits: [
      "Enhanced Visibility - Centralized dashboard security posture across all environments",
      "Proactive Threat Management - Detect threats before breaches via machine learning",
      "Simplified Compliance - Continuous compliance assessments, detailed reports regulatory adherence",
      "Cost-Efficient Security - Improve security posture without significant overhead, prioritize investments via Secure Score",
      "Unified Protection - Single platform Azure, hybrid, multi-cloud vs multiple tools",
      "Automated Response - Reduce incident response time avec automated playbooks"
    ],
    useCases: [
      {
        title: "Enterprise Security Posture Management",
        description: "Standardize cloud security across multiple subscriptions, departments ensure compliance internal policies, regulatory standards.",
        industries: ["All - Enterprise"],
        businessImpact: "Security standardized, compliance adherence improved, audit preparation simplified, security gaps identified proactively"
      },
      {
        title: "Regulatory Compliance Management",
        description: "Meet compliance requirements (HIPAA, ISO 27001, PCI DSS, GDPR) avec continuous assessments, detailed reports.",
        industries: ["Healthcare", "Finance", "E-commerce", "Government"],
        businessImpact: "Compliance gaps closed, audit trails complete, regulatory fines avoided, customer trust improved"
      },
      {
        title: "Threat Detection & Response",
        description: "Detect threats (malware, brute-force attacks, anomalous behavior) early, automate response via playbooks.",
        industries: ["All"],
        businessImpact: "Breaches prevented, incident response time reduced 70%, security operations automated"
      },
      {
        title: "Hybrid & Multi-Cloud Security",
        description: "Unified security management across Azure, AWS, GCP, on-premises workloads single dashboard.",
        industries: ["Enterprises avec multi-cloud"],
        businessImpact: "Security visibility unified, policy enforcement consistent, tool sprawl eliminated"
      }
    ],
    targetIndustries: ["All", "Healthcare", "Finance", "Government", "E-commerce", "Technology"],
    idealCustomerSize: "SME, Enterprise",
    targetPersonas: ["Security Engineer", "CISO", "IT Manager", "Compliance Officer", "DevSecOps Engineer"],
    pricingModel: "tiered",
    pricingTiers: [
      {
        tier: "Foundational CSPM (Free)",
        description: "Security posture management, secure score, recommendations",
        pricing: "FREE",
        bestFor: "Basic security assessments, small Azure environments"
      },
      {
        tier: "Defender for Servers",
        description: "Advanced threat protection pour VMs",
        pricing: "€13/server/mois",
        bestFor: "Production servers requiring advanced protection"
      },
      {
        tier: "Defender for App Service",
        description: "Threat protection web apps",
        pricing: "€13/App Service plan/mois",
        bestFor: "Web applications, APIs production"
      },
      {
        tier: "Defender for SQL",
        description: "Advanced threat protection SQL databases",
        pricing: "€13/server/mois",
        bestFor: "Production databases avec sensitive data"
      },
      {
        tier: "Defender for Storage",
        description: "Threat detection storage accounts",
        pricing: "€0.02 per 10K transactions",
        bestFor: "Storage accounts avec sensitive data"
      },
      {
        tier: "Defender for Containers",
        description: "Container security (AKS, registries)",
        pricing: "€5/vCore/mois (AKS), €0.24/image scan (registry)",
        bestFor: "Container workloads, Kubernetes clusters"
      }
    ],
    estimatedCost: "Foundational: FREE, Standard protection (5 servers): €65/mois, Enterprise (50 servers + SQL + containers): €800-1500/mois",
    implementationTime: "1-2 semaines",
    complexity: "medium",
    prerequisites: [
      "Azure subscription avec resources deployed",
      "Appropriate permissions (Security Admin, Contributor)",
      "Pour hybrid/multi-cloud: Azure Arc agents installed",
      "For automated remediation: Azure Logic Apps configured"
    ],
    integrations: [
      "Microsoft Defender for Endpoint",
      "Microsoft Defender for Identity",
      "Microsoft Defender for Cloud Apps",
      "Microsoft Sentinel (SIEM)",
      "Azure Monitor (alerts, logs)",
      "Azure Policy (governance)",
      "Azure Logic Apps (automation)",
      "Azure Arc (hybrid/multi-cloud)",
      "AWS Security Hub",
      "GCP Security Command Center"
    ],
    competitorComparison: [
      {
        competitor: "AWS Security Hub",
        ourAdvantages: [
          "Better multi-cloud support (Azure, AWS, GCP unified)",
          "Secure Score actionable prioritization (AWS Security Score basic)",
          "Integration Microsoft ecosystem (Endpoint, Identity, Sentinel)",
          "Automated remediation easier (Logic Apps vs Lambda manual)"
        ],
        theirWeaknesses: [
          "AWS Security Hub AWS-only (no Azure, GCP native)",
          "Less actionable recommendations",
          "Manual remediation complex"
        ]
      },
      {
        competitor: "Google Security Command Center",
        ourAdvantages: [
          "More mature threat detection (machine learning advanced)",
          "Better compliance dashboards (HIPAA, PCI, ISO)",
          "Hybrid support stronger (Azure Arc)",
          "Integration Microsoft tools comprehensive"
        ],
        theirWeaknesses: [
          "GCP Security Command Center GCP-focused",
          "Compliance reporting less comprehensive",
          "Hybrid support limited"
        ]
      }
    ],
    salesPriority: 10,
    isActive: true,
    isFeatured: true,
    keywords: [
      "security center",
      "defender for cloud",
      "cspm",
      "cwpp",
      "security posture",
      "threat protection",
      "compliance",
      "vulnerability assessment"
    ],
    tags: ["Security", "Compliance", "Threat-Protection", "CSPM", "CWPP", "Cloud-Security"],
    relatedSolutions: ["azure-sentinel", "azure-policy", "microsoft-defender-endpoint", "azure-monitor"],
    technicalSpecs: {
      supportedWorkloads: ["VMs", "App Service", "SQL Database", "Storage", "Containers (AKS)", "Key Vault", "Cosmos DB"],
      supportedClouds: ["Azure", "AWS", "GCP", "On-premises (via Azure Arc)"],
      complianceStandards: ["HIPAA", "ISO 27001", "PCI DSS", "GDPR", "SOC 2", "NIST", "CIS"],
      threatDetectionMethods: ["Machine learning", "Behavioral analytics", "Threat intelligence", "Anomaly detection"]
    },
    securityFeatures: [
      "Secure Score prioritization",
      "Vulnerability assessment built-in",
      "Just-in-Time VM access",
      "Adaptive application controls",
      "File integrity monitoring",
      "Network security recommendations",
      "Threat intelligence integration",
      "Automated remediation playbooks",
      "Compliance dashboards",
      "Azure AD RBAC integration",
      "Audit logging comprehensive"
    ],
    complianceCerts: ["ISO 27001", "SOC 2", "HIPAA", "GDPR", "FedRAMP", "PCI DSS"],
    documentationUrl: "https://learn.microsoft.com/en-us/azure/defender-for-cloud/",
    pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/defender-for-cloud/",
    demoUrl: "https://azure.microsoft.com/en-us/products/defender-for-cloud"
  }

];

// Fonction principale
async function main() {
  console.log(`🚀 Adding ${allSolutions.length} Azure solutions (Security, Analytics, Database, Management)...\n`);
  console.log(`📋 Solutions à ajouter:`);
  allSolutions.forEach((sol, idx) => {
    console.log(`   ${idx + 1}. ${sol.officialName} (${sol.category} - ${sol.subcategory})`);
  });
  console.log('');

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (const solution of allSolutions) {
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
  console.log(`   ✅ Success: ${successCount}/${allSolutions.length}`);
  console.log(`   ❌ Failed: ${failCount}/${allSolutions.length}`);

  if (errors.length > 0) {
    console.log(`\n❌ Errors:`);
    errors.forEach(err => {
      console.log(`   - ${err.solution}: ${err.error}`);
    });
  }

  console.log(`\n✨ Azure solutions added successfully!`);
  console.log(`\n🌐 Visit http://localhost:3000/azure-knowledge to view all solutions`);
}

main();
