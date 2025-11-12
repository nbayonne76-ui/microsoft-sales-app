# Microsoft Solutions Comprehensive Pricing Guide 2025

## Overview
This guide covers pricing for Microsoft's three major workloads: **Modern Work (Microsoft 365)**, **Dynamics 365**, and **Azure**. All prices are in USD per user/month unless otherwise noted.

---

## 1. MODERN WORK (Microsoft 365)

### Consumer Plans
- **Microsoft 365 Personal**: $6.99/month or $69.99/year (1 user)
- **Microsoft 365 Family**: $9.99/month or $99.99/year (up to 6 users)

### Business Plans (Up to 300 users)
- **Microsoft 365 Business Basic**: $6.00/user/month
  - Web and mobile Office apps only
  - 50 GB mailbox
  - 1 TB OneDrive storage
  - Microsoft Teams

- **Microsoft 365 Apps for Business**: $8.25/user/month
  - Desktop Office apps (Word, Excel, PowerPoint, Outlook)
  - 1 TB OneDrive storage
  - No email or Teams

- **Microsoft 365 Business Standard**: $12.50/user/month
  - Desktop Office apps
  - Email with 50 GB mailbox
  - Microsoft Teams
  - SharePoint, OneDrive

- **Microsoft 365 Business Premium**: $22.00/user/month
  - Everything in Business Standard
  - Advanced security (Microsoft Defender)
  - Device management (Intune)
  - Azure Information Protection

### Enterprise Plans (Unlimited users)

#### Office 365 Enterprise
- **Office 365 E1**: $10.00/user/month
  - Web apps only
  - 50 GB mailbox
  - 1 TB OneDrive
  - Teams, SharePoint

- **Office 365 E3**: $23.00/user/month
  - Desktop Office apps
  - 100 GB mailbox
  - Advanced compliance (DLP, legal hold)

- **Office 365 E5**: $38.00/user/month
  - Everything in E3
  - Power BI Pro
  - Advanced threat protection
  - Teams Phone System

#### Microsoft 365 Enterprise (includes Windows Enterprise + EMS)
- **Microsoft 365 F3** (Frontline Workers): $8-10/user/month
  - Web and mobile Office apps only
  - 2 GB mailbox
  - Limited features for frontline workers

- **Microsoft 365 E3**: $36.00/user/month
  - Office 365 E3 features
  - Windows 10/11 Enterprise
  - Enterprise Mobility + Security (EMS) E3
  - Azure AD Premium P1
  - Microsoft Intune

- **Microsoft 365 E5**: $57.00/user/month
  - Office 365 E5 features
  - Windows 10/11 Enterprise
  - EMS E5
  - Azure AD Premium P2
  - Microsoft Defender for Endpoint
  - Advanced compliance and analytics

### Add-ons
- **Microsoft Copilot**: $30/user/month (requires base M365 license)
- **Microsoft Teams Enterprise**: $5.25/user/month (standalone or add-on)
- **Teams Phone Standard**: $10/user/month
- **Teams Phone Standard for Frontline**: $5/user/month

### Windows 365 (Cloud PC)
**Business Plans** (per user/month):
- 2 vCPU / 4 GB RAM / 128 GB Storage: Starting at ~$31
- 2 vCPU / 8 GB RAM / 128 GB Storage: Starting at ~$41
- 4 vCPU / 16 GB RAM / 128 GB Storage: Starting at ~$66
- 8 vCPU / 32 GB RAM / 256 GB Storage: Starting at ~$158

**Enterprise Plans**: Similar configurations with Intune integration

---

## 2. DYNAMICS 365

### CRM Applications

#### Sales
- **Dynamics 365 Sales Professional**: $65/user/month
- **Dynamics 365 Sales Enterprise**: $105/user/month
- **Microsoft Relationship Sales** (Sales Enterprise + LinkedIn): $162/user/month

#### Customer Service
- **Customer Service Professional**: $50/user/month
- **Customer Service Enterprise**: $95/user/month
  - Each additional user: $20

#### Marketing
- **Dynamics 365 Marketing**: Starts at $1,500/month (tenant-based)
  - Additional contacts priced separately

#### Field Service
- **Dynamics 365 Field Service**: $95/user/month

### ERP Applications

#### Business Central
- **Business Central Essentials**: $70/user/month
  - 80 GB database storage included
- **Business Central Premium**: $100/user/month
  - 80 GB database storage included
- **Team Members**: $8/user/month
  - Limited access license

**Note**: Price increase effective November 1, 2025 (first increase in 5+ years)

#### Finance & Operations
- **Dynamics 365 Finance**: $210/user/month (full user)
  - Attach license: $30/user/month
- **Dynamics 365 Supply Chain Management**: $210/user/month (full user)
  - Attach license: $30/user/month
- **Dynamics 365 Commerce**: $210/user/month (full user)
  - Attach license: $30/user/month
- **Dynamics 365 Human Resources**: $135/user/month (full user)
- **Dynamics 365 Project Operations**: $135/user/month (full user)

### Additional Licensing Notes
- **Attach Licenses**: Available at $20-30/user/month when you already have one Dynamics 365 app
- **Device Licenses**: Available for shared devices in some scenarios
- **Implementation Costs**: Finance & Operations implementations typically start at $200,000+

---

## 3. AZURE

Azure uses **pay-as-you-go pricing** with various pricing models. Prices vary by region (examples shown for US East).

### Compute Services

#### Virtual Machines (VMs)
**General Purpose (D-series)**:
- B1s (1 vCPU, 1 GB RAM): ~$0.012/hour (~$8.76/month)
- D2s v3 (2 vCPU, 8 GB RAM): ~$0.096/hour (~$70/month)
- D4s v3 (4 vCPU, 16 GB RAM): ~$0.192/hour (~$140/month)

**Compute Optimized (F-series)**:
- Starting from $0.0846/hour

**Memory Optimized (E-series)**:
- Starting from $0.126/hour

**Storage Optimized (L-series)**:
- Starting from $0.624/hour

**GPU-Enabled**:
- Starting from $0.90/hour

**High Performance Computing (HPC)**:
- Premium pricing for specialized workloads

**Pricing Models**:
- Pay-as-you-go (default)
- Reserved Instances (1 or 3 years): Up to 72% savings
- Azure Spot: Up to 90% savings (can be interrupted)
- Azure Hybrid Benefit: Up to 85% savings with existing licenses

#### Azure Kubernetes Service (AKS)
- Control plane: Free
- Worker nodes: Pay for underlying VMs
- Production cluster (3 nodes): ~$400/month

#### Azure Functions (Serverless)
- **Consumption Plan**: Pay per execution
  - First 1 million executions: Free
  - Additional executions: $0.20 per million
  - Execution time: $0.000016/GB-second

#### Azure App Service
- **Free Tier**: 60 CPU minutes/day
- **Basic**: $13-49/month (Linux, US East)
- **Standard**: $75-300/month
- **Premium**: $57-2,200/month
- **Isolated**: $280-9,000+/month

### Storage Services

#### Azure Blob Storage
**Hot Tier** (frequently accessed):
- $0.018 per GB/month (LRS)
- $0.025 per GB/month (GRS)

**Cool Tier** (infrequent access, 30-day minimum):
- $0.01 per GB/month (LRS)
- Early deletion penalty if moved within 30 days

**Cold Tier** (90-day minimum):
- ~$0.0045 per GB/month
- Early deletion penalty if moved within 90 days

**Archive Tier** (180-day minimum):
- $0.00099 per GB/month (LRS)
- Retrieval takes up to 15 hours
- Early deletion penalty if moved within 180 days

**Additional Charges**:
- Write operations: $0.05 per 10,000 transactions
- Read operations: $0.004 per 10,000 transactions
- Data retrieval (Cool): $0.01 per GB
- Data retrieval (Archive): $0.02 per GB

#### Azure Files
- **Premium**: Provisioned model, 100-256,000 GB
- **Transaction Optimized**: $0.0255 per GB/month
- **Hot**: $0.0255 per GB/month
- **Cool**: $0.015 per GB/month

#### Managed Disks
- **Standard HDD**: $0.040 per GB/month (S4: 32 GB)
- **Standard SSD**: $0.075 per GB/month (E4: 32 GB)
- **Premium SSD**: $0.135 per GB/month (P4: 32 GB)
- **Ultra Disk**: Performance-based pricing

### Database Services

#### Azure SQL Database
**DTU Model (Database Transaction Units)**:
- Basic (5 DTUs): $5/month
- Standard S0 (10 DTUs): $15/month
- Standard S1 (20 DTUs): $30/month
- Standard S2 (50 DTUs): $75/month
- Premium P1 (125 DTUs): $465/month

**vCore Model**:
- **General Purpose**:
  - 2 vCores: ~$0.556/hour (~$406/month)
  - 4 vCores: ~$1.112/hour (~$812/month)
  - Storage: $0.115 per GB/month

- **Business Critical**:
  - 2 vCores: ~$1.392/hour (~$1,016/month)
  - 4 vCores: ~$2.784/hour (~$2,032/month)

- **Hyperscale**:
  - Starting from $0.366/hour
  - Storage: $0.25 per GB/month

**Serverless Compute**:
- $0.5218 per vCore-hour
- Auto-scales between 0.5-80 vCores
- Billed per second

**Additional Costs**:
- Backup storage: $0.10-0.20 per GB/month
- Long-term retention: $0.05 per GB/month

#### Azure Cosmos DB
- Pricing based on provisioned throughput (RU/s) and storage
- Serverless option available

#### Azure Database for MySQL/PostgreSQL
- Similar vCore-based pricing to SQL Database

### Networking Services

#### Virtual Network
- First 50 VNets: Free
- Public IPs: $0.0036-0.008/hour

#### VPN Gateway
- Basic: $0.04/hour (~$29/month)
- VpnGw1: $0.19/hour (~$140/month)

#### Load Balancer
- Basic: Free (limited features)
- Standard: $0.025/hour + rules and data processed

#### Application Gateway
- Small: $0.125/hour + data processed
- Medium: $0.252/hour + data processed
- Large: $0.504/hour + data processed

#### Azure CDN
- Pricing based on data transfer out

### AI & Machine Learning

#### Azure OpenAI Service
**GPT-4 Models**:
- Input: $0.03 per 1K tokens
- Output: $0.06 per 1K tokens

**GPT-3.5 Turbo**:
- Input: $0.0015 per 1K tokens
- Output: $0.002 per 1K tokens

**Embeddings**:
- Ada: $0.0001 per 1K tokens

#### Azure Cognitive Services
- Various pricing per service
- Free tiers available for many services

#### Azure Machine Learning
- Compute-based pricing
- Training VMs billed per hour

### Identity & Security

#### Microsoft Entra ID (formerly Azure AD)
- **Free**: Basic features
- **Premium P1**: $6/user/month
- **Premium P2**: $9/user/month
- **Workload ID**: $3/workload/month
- **Microsoft Entra Suite**: $12/user/month

### Cost Management Tools

#### Azure Cost Management + Billing
- Free for Azure customers
- Copilot integration available

#### Azure Advisor
- Free recommendations for cost optimization

---

## Key Pricing Notes

### 2025 Price Increases
- **Microsoft 365**: 5% premium for monthly billing (vs. annual) effective April 1, 2025
- **Dynamics 365 Business Central**: First increase in 5+ years, effective November 1, 2025
- **On-premises products** (Exchange, SharePoint, Skype): 10% increase July 2025
- **CAL Suites**: 15-20% increase August 2025

### Discount Opportunities
- Annual/3-year commitments: Significant savings
- Azure Reserved Instances: Up to 72% savings
- Azure Hybrid Benefit: Up to 85% savings
- Azure Savings Plans: Commitment-based discounts
- Volume licensing: Contact Microsoft for enterprise agreements

### Hidden Costs to Consider
- **Data transfer/egress** charges (especially cross-region)
- **Storage transactions** beyond included amounts
- **Backup storage** retention
- **Support plans** (Basic is free, paid plans start at ~$29/month)
- **Third-party marketplace** applications

---

## Useful Resources

- **Azure Pricing Calculator**: https://azure.microsoft.com/pricing/calculator/
- **Microsoft 365 Pricing**: https://www.microsoft.com/microsoft-365/business/compare-all-microsoft-365-business-products
- **Dynamics 365 Pricing**: https://www.microsoft.com/dynamics-365/pricing-overview
- **Azure Documentation**: https://docs.microsoft.com
- **Microsoft Support**: https://support.microsoft.com

---

*Note: All prices are approximate and subject to change. Prices may vary by region, currency, and specific agreements. Always verify current pricing with Microsoft or authorized partners. Price increases and promotional offers may apply.*
