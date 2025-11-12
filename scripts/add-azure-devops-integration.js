const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addAzureDevOpsAndIntegration() {
  try {
    console.log('Adding Azure DevOps & Integration Services to knowledge base...');

    const solutions = [
      // ===== AZURE SERVICE BUS =====
      {
        name: 'azure-service-bus',
        officialName: 'Azure Service Bus',
        category: 'integration',
        subcategory: 'Enterprise Messaging',
        shortDescription: 'Fully managed enterprise messaging service enabling reliable communication between decoupled applications. Message queues, topics/subscriptions, advanced messaging capabilities.',
        fullDescription: `Azure Service Bus est un fully managed enterprise messaging service that enables reliable communication between decoupled applications and services. Supports both message queues for point-to-point communication and topics/subscriptions for publish/subscribe messaging patterns.

Key capabilities:
- **Message Queues** - Decoupling: senders and receivers operate independently. Reliability: messages delivered once and in order, even in failures.
- **Topics & Subscriptions** - Publish/Subscribe Model: multiple subscribers receive messages from single topic. Filter & Rule-Based Routing: subscribers specify filters to receive messages of interest.
- **Advanced Messaging Capabilities** - Scheduled Delivery: messages scheduled for future delivery. Dead-Lettering: handles messages that cannot be processed. Duplicate Detection: processing same message more than once. Auto-Forwarding: chaining queues or topics for complex workflows.`,

        keyFeatures: [
          "Message Queues - Decoupling senders and receivers pour independent operation",
          "Reliability - Messages delivered once and in order, even with failures",
          "Topics & Subscriptions - Publish/Subscribe messaging patterns",
          "Publish/Subscribe Model - Multiple subscribers receive from single topic",
          "Filter & Rule-Based Routing - Subscribers specify filters to receive specific messages",
          "Scheduled Delivery - Messages scheduled for future delivery",
          "Dead-Lettering - Handles messages that cannot be processed",
          "Duplicate Detection - Prevents processing same message twice",
          "Auto-Forwarding - Supports chaining queues/topics for complex workflows",
          "Sessions - Maintains message ordering for related messages",
          "Transactions - ACID transaction support for reliable processing",
          "Security - SAS tokens, Azure AD authentication, encryption in transit/rest"
        ],

        benefits: [
          "Reliable asynchronous communication - Decoupled systems communicate reliably",
          "Scalable messaging - Handles high-throughput scenarios",
          "Advanced routing - Filter-based routing to appropriate subscribers",
          "Enterprise-grade - High availability, disaster recovery, compliance"
        ],

        useCases: [
          {
            title: "Enterprise Application Integration - Legacy Systems + Cloud Apps",
            description: "Connect legacy on-premises systems avec cloud applications. Service Bus provides reliable messaging for asynchronous integration.",
            industries: ["Enterprise", "Finance", "Manufacturing"],
            businessImpact: "Legacy systems modernized, integration costs reduced 50%, reliability improved"
          },
          {
            title: "Microservices Communication",
            description: "Facilitate loose coupling et scalability in distributed systems. Microservices communicate via Service Bus queues/topics.",
            industries: ["Technology", "SaaS", "E-commerce"],
            businessImpact: "System resilience +80%, scalability improved, coupling reduced"
          },
          {
            title: "Event-Driven Architectures - Real-Time Processing",
            description: "Support real-time data processing et event notifications across services. Event Grid + Service Bus for robust messaging.",
            industries: ["IoT", "Financial Services", "Retail"],
            businessImpact: "Real-time processing enabled, event latency reduced 90%, system responsiveness improved"
          }
        ],

        targetIndustries: ['Enterprise', 'Financial Services', 'Technology', 'Manufacturing', 'Retail', 'Healthcare', 'All'],

        pricingModel: 'Tiered pricing (Basic, Standard, Premium)',
        estimatedCost: 'Basic: $0.05 per million operations. Standard: $10/month + $0.01 per million operations. Premium: $676/month per messaging unit.',

        pricingTiers: [
          {
            tier: 'Basic',
            description: 'Queues only, no topics, 256KB message size',
            pricing: '$0.05 per million operations',
            bestFor: 'Simple queue-based messaging, dev/test'
          },
          {
            tier: 'Standard',
            description: 'Queues + Topics, 256KB message size, auto-forwarding, transactions',
            pricing: '$10/month base + $0.01 per million operations',
            bestFor: 'Production workloads, pub/sub patterns'
          },
          {
            tier: 'Premium',
            description: 'Dedicated resources, 1MB messages, VNet integration, geo-disaster recovery',
            pricing: '$676/month per messaging unit',
            bestFor: 'Enterprise workloads, high-throughput, predictable performance'
          }
        ],

        complexity: 'medium',
        implementationTime: '1-2 weeks (integration, testing)',
        salesPriority: 8,
        isFeatured: false,

        integrations: ['Azure Logic Apps', 'Azure Functions', 'Azure Event Grid', 'Azure API Management', 'Azure Stream Analytics', 'On-premises systems via Hybrid Connections'],

        prerequisites: ['Azure subscription', 'Understanding of messaging patterns', 'Application code to send/receive messages'],

        idealCustomerSize: 'SME to Enterprise',

        documentationUrl: 'https://docs.microsoft.com/en-us/azure/service-bus-messaging/',
        pricingUrl: 'https://azure.microsoft.com/en-us/pricing/details/service-bus/',

        keywords: ['azure service bus', 'messaging', 'message queue', 'pub/sub', 'topics', 'subscriptions', 'enterprise messaging', 'reliable messaging'],
        tags: ['messaging', 'integration', 'queues', 'pub-sub', 'enterprise'],

        targetPersonas: ['Solutions Architect', 'Integration Architect', 'DevOps Engineer', 'Backend Developer', 'Enterprise Architect']
      },

      // ===== AZURE DEVTEST LABS =====
      {
        name: 'azure-devtest-labs',
        officialName: 'Azure DevTest Labs',
        category: 'compute',
        subcategory: 'Development & Testing',
        shortDescription: 'Cloud-based service pour quickly create, manage, optimize dev/test environments. Simplifies VM provisioning, reduces costs, enhances productivity avec automated resource management.',
        fullDescription: `Azure DevTest Labs est un cloud-based service designed to help development et test teams quickly create, manage, et optimize environments for development, testing, et training. Simplifies the process of provisioning VMs et environments, reduces costs, enhances productivity by automating repetitive tasks.

Key capabilities:
- **Self-Service VM Creation** - Developers rapidly spin up Windows or Linux VMs using pre-configured images and templates. ARM templates, integration avec Azure Marketplace.
- **Automated Resource Management** - Auto-shutdown: automatically powers down idle VMs to save costs. Cost Control & Monitoring: spending caps, cost tracking, budget controls. Quotas: set quotas to limit VM count/sizes to control spending.
- **Artifacts & Pre-Configured Environments** - Install required software and tools automatically on provisioned VMs. Streamline environment setup for development, testing, or training.
- **Integration with DevOps** - CI/CD pipelines, Azure DevOps, GitHub automated deployments. Supports both Windows and Linux environments.`,

        keyFeatures: [
          "Self-Service VM Creation - Developers spin up Windows/Linux VMs avec pre-configured images",
          "ARM templates - Infrastructure as Code pour consistent environments",
          "Azure Marketplace integration - Quick access to pre-configured images",
          "Auto-shutdown - Automatically power down idle VMs to save costs",
          "Cost Control & Monitoring - Spending caps, quotas, budget controls",
          "VM quotas - Limit VM count/sizes per user/lab",
          "Artifacts & Tools - Install software automatically on VMs",
          "Formulas - Save VM configurations pour reuse",
          "Custom images - Create custom VM images for team",
          "Integration with DevOps - CI/CD pipelines, Azure DevOps, GitHub",
          "Environment isolation - Separate dev/test from production",
          "Claimable VMs - Pool of VMs users can claim when needed"
        ],

        benefits: [
          "Rapid environment provisioning - Test features without affecting production",
          "Cost optimization - Auto-shutdown, quotas reduce spending",
          "Simplified management - Centralized control over dev/test resources",
          "DevOps integration - Automated deployments, testing workflows"
        ],

        useCases: [
          {
            title: "Development & Testing - Quick Environment Provisioning",
            description: "Developers need environments to test features or run experiments. DevTest Labs provides quick Windows/Linux environments sans affecting production.",
            industries: ["Technology", "Software Development", "SaaS"],
            businessImpact: "Development velocity +40%, environment provisioning time reduced 80%, costs reduced 50%"
          },
          {
            title: "Training & Workshops - Isolated Environments",
            description: "Set up pre-configured labs for training sessions, hackathons, workshops. Provide isolated environments for developers to experiment without risking production.",
            industries: ["Education", "Technology", "Consulting"],
            businessImpact: "Training efficiency +60%, setup time reduced 90%, consistent learning environments"
          },
          {
            title: "Cost Optimization - Auto-Shutdown & Quotas",
            description: "Reduce cloud spending by using auto-shutdown quotas. Ensure resources only active when needed. DevTest Labs creates labs consisting of pre-configured bases or ARM templates.",
            industries: ["All"],
            businessImpact: "Cloud costs reduced 40-60%, waste eliminated, resource utilization optimized"
          }
        ],

        targetIndustries: ['Technology', 'Software Development', 'SaaS', 'Education', 'Consulting', 'Enterprise', 'All'],

        pricingModel: 'Pay only for underlying Azure resources (VMs, storage, networking)',
        estimatedCost: 'No additional DevTest Labs cost. Pay for VMs, storage used. Dev/Test pricing available (lower VM costs).',

        pricingTiers: [
          {
            tier: 'Free (DevTest Labs service)',
            description: 'DevTest Labs service itself is free',
            pricing: '$0 for DevTest Labs service',
            bestFor: 'All users'
          },
          {
            tier: 'Pay for Resources',
            description: 'Pay only for underlying Azure resources (VMs, storage, networking)',
            pricing: 'Standard Azure pricing for VMs, storage, network',
            bestFor: 'Dev/test workloads avec auto-shutdown to minimize costs'
          },
          {
            tier: 'Dev/Test Pricing',
            description: 'Special dev/test pricing for eligible subscriptions (lower VM costs)',
            pricing: 'Up to 55% discount on VMs for dev/test',
            bestFor: 'Development and testing workloads (not production)'
          }
        ],

        complexity: 'low',
        implementationTime: 'Hours to 1 week (lab setup, policies configuration)',
        salesPriority: 7,
        isFeatured: false,

        integrations: ['Azure DevOps', 'Azure Pipelines', 'GitHub', 'Azure Resource Manager', 'Azure Marketplace', 'CI/CD tools'],

        prerequisites: ['Azure subscription', 'Dev/Test subscription for discounted pricing (optional)', 'VM images or ARM templates'],

        idealCustomerSize: 'SME to Enterprise',

        documentationUrl: 'https://docs.microsoft.com/en-us/azure/devtest-labs/',
        pricingUrl: 'https://azure.microsoft.com/en-us/pricing/details/devtest-lab/',

        keywords: ['azure devtest labs', 'development', 'testing', 'dev environments', 'test environments', 'vm provisioning', 'cost optimization'],
        tags: ['dev-test', 'development', 'testing', 'environments', 'cost-optimization'],

        targetPersonas: ['Developer', 'DevOps Engineer', 'IT Manager', 'Test Engineer', 'Engineering Manager']
      },

      // ===== AZURE DEVOPS =====
      {
        name: 'azure-devops',
        officialName: 'Azure DevOps',
        category: 'management',
        subcategory: 'CI/CD & DevOps Platform',
        shortDescription: 'Cloud-based DevOps toolchain from Microsoft helping teams plan, develop, test, and deploy applications automatically. CI/CD, version control, agile project management, artifact management.',
        fullDescription: `Azure DevOps est une cloud-based DevOps toolchain from Microsoft that helps teams plan, develop, test, et deploy applications automatically. Provides Continuous Integration & Continuous Deployment (CI/CD) pipelines, version control, agile project management, et artifact management — all in one unified platform.

Core components:
- **Azure Repos (Version Control)** - Git repositories ou Team Foundation Version Control (TFVC). Branching, pull requests, code reviews. GitHub, Bitbucket, external Git support.
- **Azure Pipelines (CI/CD Automation)** - Build, test, deploy automatically. Containers, microservices, VM-based deployments. YAML ou Classic UI. Multi-platform (Windows, Linux, macOS, containers).
- **Azure Boards (Agile Project Management)** - Kanban, Scrum, Agile tools. Work items, backlogs, sprint planning. Dashboards.
- **Azure Test Plans (Testing & Quality Assurance)** - Manual, exploratory, automated testing. Selenium, JUnit, other test automation tools. Test tracking, quality metrics.
- **Azure Artifacts (Package Management)** - NuGet, npm, Maven, Python packages. Share dependencies across teams.`,

        keyFeatures: [
          "Azure Repos - Git/TFVC version control, branching, pull requests, code reviews",
          "Azure Pipelines - CI/CD automation, build/test/deploy, multi-platform support",
          "YAML pipelines - Infrastructure as Code pour pipeline definitions",
          "Multi-cloud support - Deploy to Azure, AWS, Google Cloud, on-premises",
          "Containers support - Docker, Kubernetes (AKS) deployments",
          "Azure Boards - Kanban, Scrum, work items, backlogs, sprint planning",
          "Azure Test Plans - Manual, exploratory, automated testing",
          "Test automation - Selenium, JUnit, other frameworks integration",
          "Azure Artifacts - NuGet, npm, Maven, Python package management",
          "Security & Compliance - RBAC, audit logs, Azure AD integration",
          "Integration with GitHub - GitHub Actions, GitHub repos",
          "Extensibility - 1000+ extensions in marketplace"
        ],

        benefits: [
          "Complete DevOps platform - Everything in one place (repos, CI/CD, boards, tests, artifacts)",
          "Free tier - 5 users free for small teams",
          "Multi-cloud & platform - Deploy anywhere (Azure, AWS, Google, on-prem, Windows, Linux, macOS)",
          "Scalable - Small teams to large enterprises",
          "Integrated with Azure - Native Azure deployment, Azure services integration"
        ],

        useCases: [
          {
            title: "CI/CD for Cloud Applications",
            description: "Automated builds, tests, deployments pour applications. Azure Pipelines connects with DevOps or CI/CD tools to automate environment provisioning.",
            industries: ["Technology", "SaaS", "All"],
            businessImpact: "Deployment frequency +10x, lead time reduced 80%, MTTR reduced 60%"
          },
          {
            title: "Agile Project Management - Scrum Teams",
            description: "Track work items, sprints, backlogs. Azure Boards integrates avec repos & pipelines pour end-to-end visibility.",
            industries: ["All"],
            businessImpact: "Team velocity +30%, visibility improved, collaboration enhanced"
          },
          {
            title: "Multi-Cloud Deployments",
            description: "Deploy to Azure, AWS, Google Cloud, on-premises. Single pipeline for multi-cloud strategy.",
            industries: ["Enterprise", "Technology"],
            businessImpact: "Multi-cloud strategy enabled, deployment consistency improved, vendor lock-in reduced"
          },
          {
            title: "Container & Kubernetes Deployments",
            description: "Build Docker containers, deploy to AKS (Azure Kubernetes Service). CI/CD for microservices architectures.",
            industries: ["Technology", "SaaS"],
            businessImpact: "Container adoption accelerated, microservices deployments automated, scaling improved"
          }
        ],

        targetIndustries: ['Technology', 'SaaS', 'Enterprise', 'Financial Services', 'Healthcare', 'Retail', 'All'],

        pricingModel: 'Free tier (5 users) + Pay-per-user',
        estimatedCost: 'Free: 5 users, Azure Boards/Repos/Pipelines free. Paid: ~$6/user/month for Basic, ~$52/user/month for Test Plans.',

        pricingTiers: [
          {
            tier: 'Free Tier',
            description: '5 users free for Azure Boards, Repos, Pipelines',
            pricing: '$0 for first 5 users',
            bestFor: 'Small teams, startups, open source projects'
          },
          {
            tier: 'Basic Plan',
            description: 'Azure Boards, Repos, Pipelines, Artifacts',
            pricing: '~$6/user/month',
            bestFor: 'Growing teams needing full DevOps capabilities'
          },
          {
            tier: 'Basic + Test Plans',
            description: 'All Basic features + Azure Test Plans',
            pricing: '~$52/user/month',
            bestFor: 'Teams requiring comprehensive testing capabilities'
          },
          {
            tier: 'Parallel Jobs (CI/CD)',
            description: 'Additional parallel pipeline jobs',
            pricing: '~$40/month per parallel job (Microsoft-hosted), ~$15/month (self-hosted)',
            bestFor: 'Teams needing concurrent pipeline executions'
          }
        ],

        complexity: 'medium',
        implementationTime: '1-2 weeks (initial setup, 1-2 months pour full adoption)',
        salesPriority: 9,
        isFeatured: true,

        integrations: ['Azure', 'AWS', 'Google Cloud', 'GitHub', 'Bitbucket', 'Kubernetes', 'Docker', 'Jenkins', 'Terraform', 'Ansible', 'Slack', 'Microsoft Teams'],

        prerequisites: ['Azure DevOps organization (free to create)', 'Source code repository', 'Basic DevOps knowledge'],

        idealCustomerSize: 'All (Startup to Enterprise)',

        documentationUrl: 'https://docs.microsoft.com/en-us/azure/devops/',
        pricingUrl: 'https://azure.microsoft.com/en-us/pricing/details/devops/azure-devops-services/',

        keywords: ['azure devops', 'ci/cd', 'devops', 'pipelines', 'repos', 'boards', 'agile', 'git', 'continuous integration', 'continuous deployment'],
        tags: ['devops', 'ci-cd', 'agile', 'version-control', 'automation'],

        targetPersonas: ['DevOps Engineer', 'Developer', 'Engineering Manager', 'SRE', 'Release Manager', 'Scrum Master', 'CTO']
      },

      // ===== AZURE REPOS =====
      {
        name: 'azure-repos',
        officialName: 'Azure Repos',
        category: 'management',
        subcategory: 'Version Control',
        shortDescription: 'Set of version control tools part of Azure DevOps. Git repositories ou Team Foundation Version Control (TFVC) enabling teams to manage code in secure, scalable, collaborative environment.',
        fullDescription: `Azure Repos est un set of version control tools that are part of Azure DevOps. Provides Git repositories ou Team Foundation Version Control (TFVC), enabling teams to manage their code in a secure, scalable, et collaborative environment.

Key features:
- **Distributed Version Control (Git)** - Git repositories support pour efficient branching, merging, collaboration. Code reviews and pull requests for robust team workflows.
- **Centralized Version Control (TFVC)** - Centralized version control system for teams preferring single source of truth. Suitable for legacy projects or environments where TFVC is already in use.
- **Collaboration & Code Reviews** - Integrates avec Azure Boards, Pipelines, other DevOps services for end-to-end CI/CD. Pull request workflows to ensure code quality.
- **Security & Compliance** - Granular access control avec branch policies, role-based access, Azure AD integration. Secure code management avec built-in auditing et compliance features.
- **Scalability** - Easily manage large codebases and support teams of all sizes. Seamlessly integrates avec various IDEs and development tools.`,

        keyFeatures: [
          "Distributed Version Control (Git) - Git repos pour branching, merging, collaboration",
          "Code reviews and pull requests - Robust team workflows, quality gates",
          "Centralized Version Control (TFVC) - Single source of truth, legacy support",
          "Branch policies - Enforce code quality, require reviews, build validation",
          "Pull request workflows - Inline commenting, discussion threads",
          "Integration with Azure DevOps - Boards, Pipelines end-to-end integration",
          "Security & Compliance - Granular access control, role-based access, Azure AD",
          "Auditing - Track all repository activities",
          "Scalability - Support large codebases, teams of all sizes",
          "IDE integration - Visual Studio, VS Code, IntelliJ, Eclipse",
          "Git LFS support - Large file storage",
          "Forks - Fork repositories for open source workflows"
        ],

        benefits: [
          "Robust version control - Git and TFVC options",
          "Seamless integration - Works with Azure Boards, Pipelines, DevOps services",
          "Enterprise-grade security - Branch policies, role-based access, compliance",
          "Free for small teams - 5 users free, unlimited private repos"
        ],

        useCases: [
          {
            title: "Collaborative Software Development",
            description: "Centralize code management pour teams working on distributed projects. Git repos avec pull requests, code reviews.",
            industries: ["Technology", "SaaS", "All"],
            businessImpact: "Code quality improved, collaboration enhanced, merge conflicts reduced"
          },
          {
            title: "CI/CD Integration",
            description: "Connect avec Azure Pipelines for automated builds, tests, deployments. Git push triggers pipeline runs.",
            industries: ["All"],
            businessImpact: "Deployment automation, CI/CD velocity +10x, quality gates enforced"
          },
          {
            title: "Code Reviews & Quality Assurance",
            description: "Facilitate peer reviews et continuous code improvements through pull requests. Enforce quality standards avec branch policies.",
            industries: ["All"],
            businessImpact: "Code defects reduced 40%, knowledge sharing improved, code quality +50%"
          },
          {
            title: "Enterprise-Grade Security",
            description: "Manage access controls et enforce branch policies to protect source code. Azure AD integration, audit logs.",
            industries: ["Finance", "Healthcare", "Government"],
            businessImpact: "Security compliance met, unauthorized access prevented, audit trails complete"
          }
        ],

        targetIndustries: ['All'],

        pricingModel: 'Free tier (5 users, unlimited repos) + Pay-per-user',
        estimatedCost: 'Free: 5 users. Paid: ~$6/user/month (Basic plan).',

        pricingTiers: [
          {
            tier: 'Free Tier',
            description: '5 users, unlimited private Git repos',
            pricing: '$0',
            bestFor: 'Small teams, startups, open source'
          },
          {
            tier: 'Basic Plan',
            description: 'Additional users beyond 5',
            pricing: '~$6/user/month',
            bestFor: 'Growing teams needing more users'
          }
        ],

        complexity: 'low',
        implementationTime: 'Hours (create repo, clone to local)',
        salesPriority: 7,
        isFeatured: false,

        integrations: ['Azure DevOps', 'Azure Pipelines', 'Azure Boards', 'Visual Studio', 'VS Code', 'Git clients', 'GitHub (migration)'],

        prerequisites: ['Azure DevOps organization', 'Git client ou IDE with Git support'],

        idealCustomerSize: 'All (Startup to Enterprise)',

        documentationUrl: 'https://docs.microsoft.com/en-us/azure/devops/repos/',

        keywords: ['azure repos', 'git', 'version control', 'tfvc', 'source control', 'repositories', 'code management'],
        tags: ['version-control', 'git', 'repos', 'source-control', 'collaboration'],

        targetPersonas: ['Developer', 'DevOps Engineer', 'Engineering Manager', 'Tech Lead']
      }
    ];

    // Insert each solution
    for (const solutionData of solutions) {
      try {
        const existing = await prisma.azureSolution.findUnique({
          where: { name: solutionData.name }
        });

        if (existing) {
          await prisma.azureSolution.update({
            where: { name: solutionData.name },
            data: solutionData
          });
          console.log(`✅ Updated: ${solutionData.officialName}`);
        } else {
          await prisma.azureSolution.create({
            data: solutionData
          });
          console.log(`✅ Created: ${solutionData.officialName}`);
        }
      } catch (error) {
        console.error(`❌ Error with ${solutionData.officialName}:`, error.message);
      }
    }

    console.log('\n✅ Azure DevOps & Integration Services added successfully!');

  } catch (error) {
    console.error('Error adding Azure DevOps & Integration services:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAzureDevOpsAndIntegration();
