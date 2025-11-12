/**
 * Workflow Builder - Simplified workflow creation with smart defaults
 *
 * Makes workflow creation intuitive by providing:
 * - Preset configurations for common scenarios
 * - Smart defaults based on context
 * - Template-based quick creation
 * - Validation and error prevention
 */

import { prisma } from './database.js';
import { workflowTemplates } from './workflow-templates.js';

/**
 * Smart defaults for workflow creation
 */
const WORKFLOW_DEFAULTS = {
  status: 'active',
  targetSegment: 'all',
  targetPriority: 'all',
  triggerConfig: {
    autoStart: true
  }
};

/**
 * Step type presets with smart defaults
 */
const STEP_PRESETS = {
  email: {
    stepType: 'email',
    config: {
      subject: '',
      content: '',
      sendAt: null
    }
  },
  wait: {
    stepType: 'wait',
    config: {
      delay: 3,
      unit: 'days'
    }
  },
  condition: {
    stepType: 'condition',
    config: {
      field: 'lead.priority',
      operator: 'equals',
      value: 'HAUTE'
    }
  },
  action_enrich: {
    stepType: 'action',
    config: {
      actionType: 'enrich_lead'
    }
  },
  action_priority: {
    stepType: 'action',
    config: {
      actionType: 'update_priority',
      priority: 'HAUTE'
    }
  },
  action_task: {
    stepType: 'action',
    config: {
      actionType: 'create_task',
      task: {
        action: 'Follow up with lead',
        priority: 'MOYENNE',
        assignedTo: 'Nicolas BAYONNE'
      }
    }
  }
};

/**
 * Quick workflow templates - simpler than full templates
 */
const QUICK_WORKFLOWS = {
  simple_followup: {
    name: 'Simple Follow-up',
    description: '1 email + 1 relance après 3 jours',
    steps: [
      { type: 'email', name: 'Premier contact' },
      { type: 'wait', name: 'Attendre 3 jours', config: { delay: 3, unit: 'days' } },
      { type: 'email', name: 'Relance' }
    ]
  },
  quick_nurture: {
    name: 'Quick Nurture',
    description: '2 emails éducatifs sur 1 semaine',
    steps: [
      { type: 'email', name: 'Email éducatif #1' },
      { type: 'wait', name: 'Attendre 3 jours', config: { delay: 3, unit: 'days' } },
      { type: 'email', name: 'Email éducatif #2' },
      { type: 'action_task', name: 'Créer tâche de suivi' }
    ]
  },
  hot_lead_conversion: {
    name: 'Hot Lead Conversion',
    description: 'Conversion rapide lead chaud',
    steps: [
      { type: 'action_priority', name: 'Augmenter priorité', config: { priority: 'HAUTE' } },
      { type: 'email', name: 'Appel à l\'action direct' },
      { type: 'wait', name: 'Attendre 24h', config: { delay: 24, unit: 'hours' } },
      { type: 'action_task', name: 'Appel urgent', config: { priority: 'HAUTE' } }
    ]
  }
};

/**
 * Create a workflow from template
 * @param {string} templateName - Template identifier
 * @param {Object} customizations - Custom overrides
 * @returns {Promise<Object>} Created workflow
 */
export async function createWorkflowFromTemplate(templateName, customizations = {}) {
  // Find template
  const template = workflowTemplates.find(t => t.name === templateName);

  if (!template) {
    throw new Error(`Template not found: ${templateName}`);
  }

  // Merge template data with customizations
  const workflowData = {
    ...template.templateData,
    ...customizations,
    steps: undefined // Remove steps from top level
  };

  // Create workflow
  const workflow = await prisma.workflow.create({
    data: workflowData
  });

  // Create steps
  const stepsToCreate = customizations.steps || template.templateData.steps;
  for (let i = 0; i < stepsToCreate.length; i++) {
    const step = stepsToCreate[i];
    await prisma.workflowStep.create({
      data: {
        workflowId: workflow.id,
        stepOrder: i,
        name: step.name,
        description: step.description,
        stepType: step.stepType,
        config: step.config,
        executeIf: step.executeIf
      }
    });
  }

  console.log(`✅ Created workflow from template: ${template.displayName}`);

  return await prisma.workflow.findUnique({
    where: { id: workflow.id },
    include: { steps: { orderBy: { stepOrder: 'asc' } } }
  });
}

/**
 * Create a quick workflow with smart defaults
 * @param {Object} config - Workflow configuration
 * @returns {Promise<Object>} Created workflow
 */
export async function createQuickWorkflow(config) {
  const {
    name,
    description,
    category = 'follow_up',
    triggerType = 'manual',
    targetSegment,
    targetPriority,
    quickTemplate, // One of QUICK_WORKFLOWS keys
    steps = []
  } = config;

  // Validate required fields
  if (!name) {
    throw new Error('Workflow name is required');
  }

  // Use quick template if provided
  let stepsToCreate = steps;
  if (quickTemplate && QUICK_WORKFLOWS[quickTemplate]) {
    const template = QUICK_WORKFLOWS[quickTemplate];
    stepsToCreate = template.steps.map(s => expandStepPreset(s));
  }

  if (stepsToCreate.length === 0) {
    throw new Error('Workflow must have at least one step');
  }

  // Apply smart defaults
  const workflowData = {
    ...WORKFLOW_DEFAULTS,
    name,
    description: description || `Workflow créé rapidement: ${name}`,
    category,
    triggerType,
    targetSegment: targetSegment || WORKFLOW_DEFAULTS.targetSegment,
    targetPriority: targetPriority || WORKFLOW_DEFAULTS.targetPriority,
    triggerConfig: config.triggerConfig || WORKFLOW_DEFAULTS.triggerConfig
  };

  // Create workflow
  const workflow = await prisma.workflow.create({
    data: workflowData
  });

  // Create steps
  for (let i = 0; i < stepsToCreate.length; i++) {
    const step = stepsToCreate[i];
    await prisma.workflowStep.create({
      data: {
        workflowId: workflow.id,
        stepOrder: i,
        name: step.name || `Step ${i + 1}`,
        description: step.description,
        stepType: step.stepType,
        config: step.config,
        executeIf: step.executeIf
      }
    });
  }

  console.log(`✅ Created quick workflow: ${name}`);

  return await prisma.workflow.findUnique({
    where: { id: workflow.id },
    include: { steps: { orderBy: { stepOrder: 'asc' } } }
  });
}

/**
 * Expand step preset into full step configuration
 * @param {Object} stepConfig - Step configuration
 * @returns {Object} Full step configuration
 */
function expandStepPreset(stepConfig) {
  const { type, name, description, config = {} } = stepConfig;

  // Get preset
  const preset = STEP_PRESETS[type];
  if (!preset) {
    throw new Error(`Unknown step type: ${type}`);
  }

  // Merge preset with custom config
  return {
    name: name || preset.name || 'Unnamed step',
    description: description || preset.description,
    stepType: preset.stepType,
    config: {
      ...preset.config,
      ...config
    }
  };
}

/**
 * Add step to existing workflow
 * @param {string} workflowId - Workflow ID
 * @param {Object} stepConfig - Step configuration
 * @param {number} position - Position to insert (optional, adds at end by default)
 * @returns {Promise<Object>} Created step
 */
export async function addStepToWorkflow(workflowId, stepConfig, position = null) {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
    include: { steps: true }
  });

  if (!workflow) {
    throw new Error(`Workflow not found: ${workflowId}`);
  }

  // Determine step order
  let stepOrder;
  if (position === null) {
    // Add at end
    stepOrder = workflow.steps.length;
  } else {
    // Insert at position
    stepOrder = position;
    // Update order of existing steps after this position
    await prisma.$transaction(
      workflow.steps
        .filter(s => s.stepOrder >= position)
        .map(s =>
          prisma.workflowStep.update({
            where: { id: s.id },
            data: { stepOrder: s.stepOrder + 1 }
          })
        )
    );
  }

  // Expand preset if needed
  const fullStep = stepConfig.type
    ? expandStepPreset(stepConfig)
    : stepConfig;

  // Create step
  const step = await prisma.workflowStep.create({
    data: {
      workflowId,
      stepOrder,
      name: fullStep.name,
      description: fullStep.description,
      stepType: fullStep.stepType,
      config: fullStep.config,
      executeIf: fullStep.executeIf
    }
  });

  console.log(`✅ Added step to workflow: ${fullStep.name}`);

  return step;
}

/**
 * Clone an existing workflow
 * @param {string} workflowId - Workflow ID to clone
 * @param {string} newName - Name for cloned workflow
 * @returns {Promise<Object>} Cloned workflow
 */
export async function cloneWorkflow(workflowId, newName) {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
    include: { steps: { orderBy: { stepOrder: 'asc' } } }
  });

  if (!workflow) {
    throw new Error(`Workflow not found: ${workflowId}`);
  }

  // Create new workflow
  const clonedWorkflow = await prisma.workflow.create({
    data: {
      name: newName || `${workflow.name} (Copy)`,
      description: workflow.description,
      category: workflow.category,
      status: 'paused', // Start paused by default
      triggerType: workflow.triggerType,
      triggerConfig: workflow.triggerConfig,
      targetSegment: workflow.targetSegment,
      targetPriority: workflow.targetPriority
    }
  });

  // Clone steps
  for (const step of workflow.steps) {
    await prisma.workflowStep.create({
      data: {
        workflowId: clonedWorkflow.id,
        stepOrder: step.stepOrder,
        name: step.name,
        description: step.description,
        stepType: step.stepType,
        config: step.config,
        executeIf: step.executeIf
      }
    });
  }

  console.log(`✅ Cloned workflow: ${newName}`);

  return await prisma.workflow.findUnique({
    where: { id: clonedWorkflow.id },
    include: { steps: { orderBy: { stepOrder: 'asc' } } }
  });
}

/**
 * Get workflow suggestions based on lead context
 * @param {Object} leadContext - Lead information
 * @returns {Array} Suggested workflows/templates
 */
export function suggestWorkflows(leadContext) {
  const suggestions = [];

  const {
    priority,
    engagementLevel,
    daysSinceLastContact,
    hasResponded,
    isEnriched
  } = leadContext;

  // Hot lead - suggest fast track
  if (engagementLevel === 'hot' || (priority === 'HAUTE' && hasResponded)) {
    suggestions.push({
      template: 'hot_lead_fast_track',
      reason: 'Lead très engagé - conversion rapide recommandée',
      priority: 1
    });
  }

  // Cold lead - suggest re-engagement
  if (daysSinceLastContact >= 30) {
    suggestions.push({
      template: 'cold_lead_reengagement',
      reason: 'Lead inactif - réactivation nécessaire',
      priority: 2
    });
  }

  // New lead - suggest welcome
  if (!isEnriched || daysSinceLastContact === 0) {
    suggestions.push({
      template: 'welcome_sequence',
      reason: 'Nouveau lead - séquence de bienvenue recommandée',
      priority: 3
    });
  }

  // No response - suggest follow-up
  if (daysSinceLastContact >= 7 && !hasResponded) {
    suggestions.push({
      template: 'no_response_followup',
      reason: 'Pas de réponse - relance recommandée',
      priority: 2
    });
  }

  // Medium engagement - suggest nurture
  if (engagementLevel === 'warm' && priority === 'MOYENNE') {
    suggestions.push({
      template: 'long_term_nurture',
      reason: 'Engagement moyen - nurturing recommandé',
      priority: 3
    });
  }

  // Sort by priority
  return suggestions.sort((a, b) => a.priority - b.priority);
}

/**
 * Validate workflow configuration
 * @param {Object} workflowData - Workflow data to validate
 * @returns {Object} Validation result
 */
export function validateWorkflow(workflowData) {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!workflowData.name) {
    errors.push('Workflow name is required');
  }

  if (!workflowData.triggerType) {
    errors.push('Trigger type is required');
  }

  if (!workflowData.category) {
    warnings.push('Category not specified, will default to "follow_up"');
  }

  // Steps validation
  if (!workflowData.steps || workflowData.steps.length === 0) {
    errors.push('Workflow must have at least one step');
  } else {
    // Validate each step
    workflowData.steps.forEach((step, index) => {
      if (!step.stepType) {
        errors.push(`Step ${index + 1}: stepType is required`);
      }

      if (!step.name) {
        warnings.push(`Step ${index + 1}: name not specified`);
      }

      // Validate step-specific config
      if (step.stepType === 'email') {
        if (!step.config?.subject) {
          errors.push(`Step ${index + 1}: email subject is required`);
        }
        if (!step.config?.content) {
          errors.push(`Step ${index + 1}: email content is required`);
        }
      }

      if (step.stepType === 'wait') {
        if (!step.config?.delay) {
          errors.push(`Step ${index + 1}: wait delay is required`);
        }
        if (!step.config?.unit) {
          errors.push(`Step ${index + 1}: wait unit is required`);
        }
      }

      if (step.stepType === 'condition') {
        if (!step.config?.field || !step.config?.operator) {
          errors.push(`Step ${index + 1}: condition requires field and operator`);
        }
      }

      if (step.stepType === 'action') {
        if (!step.config?.actionType) {
          errors.push(`Step ${index + 1}: action type is required`);
        }
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get available templates
 * @returns {Array} Available templates with metadata
 */
export function getAvailableTemplates() {
  return workflowTemplates.map(t => ({
    name: t.name,
    displayName: t.displayName,
    description: t.description,
    category: t.category,
    icon: t.icon,
    recommendedFor: t.recommendedFor,
    stepCount: t.templateData.steps.length,
    triggerType: t.templateData.triggerType
  }));
}

/**
 * Get available quick workflows
 * @returns {Object} Quick workflow templates
 */
export function getQuickWorkflows() {
  return Object.entries(QUICK_WORKFLOWS).map(([key, template]) => ({
    key,
    name: template.name,
    description: template.description,
    stepCount: template.steps.length
  }));
}

/**
 * Get available step presets
 * @returns {Object} Step presets
 */
export function getStepPresets() {
  return Object.entries(STEP_PRESETS).map(([key, preset]) => ({
    key,
    stepType: preset.stepType,
    description: preset.description || `${preset.stepType} step`,
    defaultConfig: preset.config
  }));
}
