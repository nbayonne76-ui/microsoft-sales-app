/**
 * Microsoft Dynamics 365 Sales Integration
 *
 * Provides integration with Dynamics 365 Sales CRM for:
 * - Lead synchronization
 * - Contact management
 * - Opportunity tracking
 * - Activity logging
 * - Account management
 */

import axios from 'axios';

export class Dynamics365Connector {
  constructor(config) {
    this.config = {
      organizationUrl: config.organizationUrl, // https://yourorg.crm.dynamics.com
      tenantId: config.tenantId,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      apiVersion: config.apiVersion || '9.2'
    };

    this.accessToken = null;
    this.tokenExpiry = null;
    this.baseUrl = `${this.config.organizationUrl}/api/data/v${this.config.apiVersion}`;
  }

  /**
   * Authenticate with Dynamics 365 using OAuth 2.0
   */
  async authenticate() {
    console.log('🔐 Authenticating with Dynamics 365...');

    try {
      const tokenUrl = `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/token`;

      const params = new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        scope: `${this.config.organizationUrl}/.default`,
        grant_type: 'client_credentials'
      });

      const response = await axios.post(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

      console.log('✅ Dynamics 365 authentication successful');

      return true;
    } catch (error) {
      console.error('❌ Dynamics 365 authentication failed:', error.response?.data || error.message);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Ensure we have a valid access token
   */
  async ensureAuthenticated() {
    if (!this.accessToken || Date.now() >= this.tokenExpiry - 60000) {
      await this.authenticate();
    }
  }

  /**
   * Make an authenticated request to Dynamics 365 API
   */
  async request(method, endpoint, data = null, options = {}) {
    await this.ensureAuthenticated();

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    try {
      const response = await axios({
        method,
        url,
        data,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'OData-MaxVersion': '4.0',
          'OData-Version': '4.0',
          'Prefer': 'return=representation', // Return created/updated entity
          ...options.headers
        },
        ...options
      });

      return response.data;
    } catch (error) {
      console.error(`❌ Dynamics 365 API error (${method} ${endpoint}):`, error.response?.data || error.message);
      throw error;
    }
  }

  // ==========================================
  // LEAD OPERATIONS
  // ==========================================

  /**
   * Create a Lead in Dynamics 365
   * @param {Object} leadData - Lead data
   * @returns {Promise<Object>} Created lead
   */
  async createLead(leadData) {
    console.log(`📝 Creating lead in Dynamics 365: ${leadData.companyname}`);

    const d365Lead = {
      // Required fields
      subject: leadData.subject || `Lead: ${leadData.companyname}`,
      companyname: leadData.companyname,

      // Contact information
      firstname: leadData.firstname || null,
      lastname: leadData.lastname || 'Contact',
      emailaddress1: leadData.emailaddress1,
      telephone1: leadData.telephone1 || null,
      websiteurl: leadData.websiteurl || null,

      // Company information
      address1_line1: leadData.address1_line1 || null,
      address1_city: leadData.address1_city || null,
      address1_postalcode: leadData.address1_postalcode || null,
      address1_country: leadData.address1_country || 'France',

      // Lead classification
      leadsourcecode: leadData.leadsourcecode || 9, // 9 = Other
      leadqualitycode: leadData.leadqualitycode || 1, // 1 = Hot

      // Custom fields (if you have them)
      new_siret: leadData.siret || null,
      new_nafcode: leadData.nafcode || null,
      new_employeecount: leadData.employeecount || null,
      new_turnover: leadData.turnover || null,

      // Description
      description: leadData.description || null,

      // Status
      statecode: 0, // 0 = Open
      statuscode: 1  // 1 = New
    };

    const result = await this.request('POST', '/leads', d365Lead);

    console.log(`✅ Lead created in Dynamics 365: ${result.leadid}`);

    return result;
  }

  /**
   * Update a Lead in Dynamics 365
   */
  async updateLead(leadId, updates) {
    console.log(`📝 Updating lead in Dynamics 365: ${leadId}`);

    const result = await this.request('PATCH', `/leads(${leadId})`, updates);

    console.log(`✅ Lead updated in Dynamics 365`);

    return result;
  }

  /**
   * Get a Lead from Dynamics 365
   */
  async getLead(leadId) {
    return await this.request('GET', `/leads(${leadId})`);
  }

  /**
   * Find leads by email
   */
  async findLeadByEmail(email) {
    const filter = `emailaddress1 eq '${email}'`;
    const result = await this.request('GET', `/leads?$filter=${encodeURIComponent(filter)}`);

    return result.value && result.value.length > 0 ? result.value[0] : null;
  }

  /**
   * Find leads by company name
   */
  async findLeadByCompany(companyName) {
    const filter = `companyname eq '${companyName}'`;
    const result = await this.request('GET', `/leads?$filter=${encodeURIComponent(filter)}`);

    return result.value && result.value.length > 0 ? result.value[0] : null;
  }

  /**
   * Qualify a Lead (convert to Opportunity)
   */
  async qualifyLead(leadId, createAccount = true, createContact = true, createOpportunity = true) {
    console.log(`🎯 Qualifying lead in Dynamics 365: ${leadId}`);

    const qualifyRequest = {
      CreateAccount: createAccount,
      CreateContact: createContact,
      CreateOpportunity: createOpportunity,
      Status: 3 // Qualified
    };

    const result = await this.request(
      'POST',
      `/leads(${leadId})/Microsoft.Dynamics.CRM.QualifyLead`,
      qualifyRequest
    );

    console.log(`✅ Lead qualified successfully`);

    return result;
  }

  // ==========================================
  // CONTACT OPERATIONS
  // ==========================================

  /**
   * Create a Contact in Dynamics 365
   */
  async createContact(contactData) {
    console.log(`📝 Creating contact in Dynamics 365: ${contactData.fullname}`);

    const d365Contact = {
      firstname: contactData.firstname,
      lastname: contactData.lastname,
      emailaddress1: contactData.emailaddress1,
      telephone1: contactData.telephone1 || null,
      jobtitle: contactData.jobtitle || null,
      description: contactData.description || null,

      // Link to account if provided
      ...(contactData.accountId && {
        'parentcustomerid_account@odata.bind': `/accounts(${contactData.accountId})`
      })
    };

    const result = await this.request('POST', '/contacts', d365Contact);

    console.log(`✅ Contact created in Dynamics 365: ${result.contactid}`);

    return result;
  }

  /**
   * Update a Contact
   */
  async updateContact(contactId, updates) {
    return await this.request('PATCH', `/contacts(${contactId})`, updates);
  }

  /**
   * Get a Contact
   */
  async getContact(contactId) {
    return await this.request('GET', `/contacts(${contactId})`);
  }

  // ==========================================
  // ACCOUNT OPERATIONS
  // ==========================================

  /**
   * Create an Account in Dynamics 365
   */
  async createAccount(accountData) {
    console.log(`📝 Creating account in Dynamics 365: ${accountData.name}`);

    const d365Account = {
      name: accountData.name,
      emailaddress1: accountData.emailaddress1 || null,
      telephone1: accountData.telephone1 || null,
      websiteurl: accountData.websiteurl || null,

      // Address
      address1_line1: accountData.address1_line1 || null,
      address1_city: accountData.address1_city || null,
      address1_postalcode: accountData.address1_postalcode || null,
      address1_country: accountData.address1_country || 'France',

      // Company info
      numberofemployees: accountData.numberofemployees || null,
      revenue: accountData.revenue || null,

      // Custom fields
      new_siret: accountData.siret || null,
      new_nafcode: accountData.nafcode || null,

      description: accountData.description || null
    };

    const result = await this.request('POST', '/accounts', d365Account);

    console.log(`✅ Account created in Dynamics 365: ${result.accountid}`);

    return result;
  }

  /**
   * Update an Account
   */
  async updateAccount(accountId, updates) {
    return await this.request('PATCH', `/accounts(${accountId})`, updates);
  }

  /**
   * Find account by name
   */
  async findAccountByName(name) {
    const filter = `name eq '${name}'`;
    const result = await this.request('GET', `/accounts?$filter=${encodeURIComponent(filter)}`);

    return result.value && result.value.length > 0 ? result.value[0] : null;
  }

  // ==========================================
  // OPPORTUNITY OPERATIONS
  // ==========================================

  /**
   * Create an Opportunity in Dynamics 365
   */
  async createOpportunity(opportunityData) {
    console.log(`📝 Creating opportunity in Dynamics 365: ${opportunityData.name}`);

    const d365Opportunity = {
      name: opportunityData.name,
      estimatedvalue: opportunityData.estimatedvalue || null,
      estimatedclosedate: opportunityData.estimatedclosedate || null,
      description: opportunityData.description || null,

      // Link to account
      ...(opportunityData.accountId && {
        'customerid_account@odata.bind': `/accounts(${opportunityData.accountId})`
      }),

      // Link to contact
      ...(opportunityData.contactId && {
        'parentcontactid@odata.bind': `/contacts(${opportunityData.contactId})`
      })
    };

    const result = await this.request('POST', '/opportunities', d365Opportunity);

    console.log(`✅ Opportunity created in Dynamics 365: ${result.opportunityid}`);

    return result;
  }

  // ==========================================
  // ACTIVITY OPERATIONS (Tasks, Emails, Calls)
  // ==========================================

  /**
   * Create a Task activity
   */
  async createTask(taskData) {
    console.log(`📝 Creating task in Dynamics 365: ${taskData.subject}`);

    const d365Task = {
      subject: taskData.subject,
      description: taskData.description || null,
      scheduledend: taskData.scheduledend || null,
      prioritycode: taskData.prioritycode || 1, // 1 = Normal

      // Link to lead/contact/account
      ...(taskData.regardingLeadId && {
        'regardingobjectid_lead@odata.bind': `/leads(${taskData.regardingLeadId})`
      }),
      ...(taskData.regardingContactId && {
        'regardingobjectid_contact@odata.bind': `/contacts(${taskData.regardingContactId})`
      })
    };

    const result = await this.request('POST', '/tasks', d365Task);

    console.log(`✅ Task created in Dynamics 365`);

    return result;
  }

  /**
   * Log an Email activity
   */
  async logEmail(emailData) {
    console.log(`📧 Logging email in Dynamics 365: ${emailData.subject}`);

    const d365Email = {
      subject: emailData.subject,
      description: emailData.description || emailData.body,
      directioncode: emailData.directioncode || false, // false = outgoing

      // Email addresses
      from: emailData.from ? [{
        addressused: emailData.from
      }] : [],
      to: emailData.to ? [{
        addressused: emailData.to
      }] : [],

      // Link to regarding object
      ...(emailData.regardingLeadId && {
        'regardingobjectid_lead@odata.bind': `/leads(${emailData.regardingLeadId})`
      }),

      // Status
      statecode: 1, // 1 = Completed
      statuscode: 2  // 2 = Sent
    };

    const result = await this.request('POST', '/emails', d365Email);

    console.log(`✅ Email logged in Dynamics 365`);

    return result;
  }

  /**
   * Create a Phone Call activity
   */
  async createPhoneCall(callData) {
    const d365Call = {
      subject: callData.subject,
      description: callData.description || null,
      phonenumber: callData.phonenumber || null,
      directioncode: callData.directioncode || false, // false = outgoing

      ...(callData.regardingLeadId && {
        'regardingobjectid_lead@odata.bind': `/leads(${callData.regardingLeadId})`
      })
    };

    return await this.request('POST', '/phonecalls', d365Call);
  }

  // ==========================================
  // NOTES / ANNOTATIONS
  // ==========================================

  /**
   * Add a note to any entity
   */
  async createNote(noteData) {
    const d365Note = {
      subject: noteData.subject || 'Note',
      notetext: noteData.notetext,

      // Link to object
      'objectid_lead@odata.bind': noteData.leadId ? `/leads(${noteData.leadId})` : undefined,
      'objectid_contact@odata.bind': noteData.contactId ? `/contacts(${noteData.contactId})` : undefined,
      'objectid_account@odata.bind': noteData.accountId ? `/accounts(${noteData.accountId})` : undefined
    };

    // Remove undefined values
    Object.keys(d365Note).forEach(key =>
      d365Note[key] === undefined && delete d365Note[key]
    );

    return await this.request('POST', '/annotations', d365Note);
  }

  // ==========================================
  // BATCH OPERATIONS
  // ==========================================

  /**
   * Execute multiple operations in a batch
   */
  async executeBatch(operations) {
    console.log(`📦 Executing batch of ${operations.length} operations`);

    // Dynamics 365 supports $batch requests for multiple operations
    // Implementation would require building multipart/mixed request
    // For now, execute sequentially
    const results = [];

    for (const op of operations) {
      try {
        const result = await this.request(op.method, op.endpoint, op.data);
        results.push({ success: true, result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }

    console.log(`✅ Batch completed: ${results.filter(r => r.success).length}/${operations.length} successful`);

    return results;
  }

  // ==========================================
  // WEBHOOKS & CHANGE TRACKING
  // ==========================================

  /**
   * Get changes since last sync (Change Tracking)
   */
  async getChanges(entityName, changeToken = null) {
    const url = changeToken
      ? `/api/data/v${this.config.apiVersion}/${entityName}?$deltatoken=${changeToken}`
      : `/api/data/v${this.config.apiVersion}/${entityName}`;

    const result = await this.request('GET', url, null, {
      headers: {
        'Prefer': 'odata.track-changes'
      }
    });

    return {
      changes: result.value,
      deltaToken: result['@odata.deltaLink']?.split('deltatoken=')[1]
    };
  }
}

/**
 * Helper function to map HotLead to Dynamics 365 Lead format
 */
export function mapHotLeadToDynamics365(hotLead) {
  return {
    companyname: hotLead.companyName,
    subject: `Lead: ${hotLead.companyName}`,
    emailaddress1: hotLead.email,
    telephone1: hotLead.phone,
    websiteurl: hotLead.website,

    // Address
    address1_line1: hotLead.address,
    address1_country: 'France',

    // Custom fields (assuming you've created them in D365)
    new_siret: hotLead.siret,
    new_nafcode: hotLead.nafCode,
    new_employeecount: hotLead.employeeCount,
    new_turnover: hotLead.turnover,
    new_legalform: hotLead.legalForm,

    // Description with enrichment info
    description: `
Lead enrichi automatiquement:
- Forme juridique: ${hotLead.legalForm || 'N/A'}
- Code NAF: ${hotLead.nafCode || 'N/A'}
- SIRET: ${hotLead.siret || 'N/A'}
- Effectif: ${hotLead.employeeCount || 'N/A'}
- Statut enrichissement: ${hotLead.enrichmentStatus}
    `.trim(),

    // Lead quality based on priority
    leadqualitycode: hotLead.priority === 'HAUTE' ? 1 : hotLead.priority === 'MOYENNE' ? 2 : 3,

    // Lead source
    leadsourcecode: 9, // Other (you can customize this)

    // Status
    statecode: 0, // Open
    statuscode: hotLead.status === 'active' ? 1 : 2
  };
}

/**
 * Helper function to map Dynamics 365 Lead to HotLead format
 */
export function mapDynamics365ToHotLead(d365Lead) {
  return {
    companyName: d365Lead.companyname,
    email: d365Lead.emailaddress1,
    phone: d365Lead.telephone1,
    website: d365Lead.websiteurl,
    address: d365Lead.address1_line1,

    // Custom fields
    siret: d365Lead.new_siret,
    nafCode: d365Lead.new_nafcode,
    employeeCount: d365Lead.new_employeecount,
    turnover: d365Lead.new_turnover,
    legalForm: d365Lead.new_legalform,

    description: d365Lead.description,

    // Priority mapping
    priority: d365Lead.leadqualitycode === 1 ? 'HAUTE' : d365Lead.leadqualitycode === 2 ? 'MOYENNE' : 'BASSE',

    // Status
    status: d365Lead.statecode === 0 ? 'active' : 'inactive',

    // Metadata
    source: 'dynamics365',
    externalId: d365Lead.leadid,
    externalSystem: 'dynamics365'
  };
}

export default Dynamics365Connector;
