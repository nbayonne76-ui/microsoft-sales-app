/**
 * Smart Step Suggester
 *
 * Provides intelligent suggestions for workflow next steps based on:
 * - Current workflow performance
 * - Lead behavior and responses
 * - Engagement patterns
 * - Historical success rates
 */

import { prisma } from './database.js';
import { getLeadEngagementLevel } from './engagement-tracker.js';

/**
 * Get smart suggestions for next workflow step
 * @param {string} executionId - Workflow execution ID
 * @returns {Promise<Object>} Step suggestions
 */
export async function getSmartStepSuggestions(executionId) {
  console.log(`💡 Getting smart step suggestions for execution ${executionId}`);

  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: {
      workflow: {
        include: { steps: { orderBy: { stepOrder: 'asc' } } }
      },
      stepExecutions: {
        include: { step: true },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!execution) {
    throw new Error(`Execution not found: ${executionId}`);
  }

  // Get lead engagement
  const engagement = await getLeadEngagementLevel(execution.leadId);

  // Analyze current performance
  const performance = analyzeExecutionPerformance(execution);

  // Get suggestions based on context
  const suggestions = [];

  // Suggestion 1: Based on engagement changes
  const engagementSuggestion = suggestBasedOnEngagement(execution, engagement, performance);
  if (engagementSuggestion) suggestions.push(engagementSuggestion);

  // Suggestion 2: Based on response rate
  const responseSuggestion = suggestBasedOnResponse(execution, performance);
  if (responseSuggestion) suggestions.push(responseSuggestion);

  // Suggestion 3: Based on open/click behavior
  const behaviorSuggestion = suggestBasedOnBehavior(execution, performance);
  if (behaviorSuggestion) suggestions.push(behaviorSuggestion);

  // Suggestion 4: Based on workflow progress
  const progressSuggestion = suggestBasedOnProgress(execution, performance);
  if (progressSuggestion) suggestions.push(progressSuggestion);

  // Suggestion 5: Based on timing
  const timingSuggestion = suggestBasedOnTiming(execution, performance);
  if (timingSuggestion) suggestions.push(timingSuggestion);

  // Rank suggestions by priority
  suggestions.sort((a, b) => a.priority - b.priority);

  return {
    executionId,
    workflowName: execution.workflow.name,
    currentStatus: execution.status,
    performance,
    engagement: {
      level: engagement.level,
      score: engagement.score
    },
    suggestions: suggestions.slice(0, 5), // Top 5 suggestions
    generatedAt: new Date().toISOString()
  };
}

/**
 * Analyze workflow execution performance
 */
function analyzeExecutionPerformance(execution) {
  const openRate = execution.emailsSent > 0
    ? (execution.emailsOpened / execution.emailsSent * 100)
    : 0;

  const clickRate = execution.emailsOpened > 0
    ? (execution.emailsClicked / execution.emailsOpened * 100)
    : 0;

  const responseRate = execution.emailsSent > 0
    ? (execution.emailsReplied / execution.emailsSent * 100)
    : 0;

  const completionRate = execution.totalSteps > 0
    ? (execution.completedSteps / execution.totalSteps * 100)
    : 0;

  const daysSinceStart = Math.floor(
    (Date.now() - new Date(execution.startedAt).getTime()) / (24 * 60 * 60 * 1000)
  );

  return {
    emailsSent: execution.emailsSent,
    openRate: openRate.toFixed(1),
    clickRate: clickRate.toFixed(1),
    responseRate: responseRate.toFixed(1),
    completionRate: completionRate.toFixed(1),
    completedSteps: execution.completedSteps,
    totalSteps: execution.totalSteps,
    daysSinceStart,
    hasResponse: execution.emailsReplied > 0,
    hasEngagement: execution.emailsOpened > 0 || execution.emailsClicked > 0
  };
}

/**
 * Suggest based on engagement level
 */
function suggestBasedOnEngagement(execution, engagement, performance) {
  if (engagement.level === 'hot' && engagement.score >= 70) {
    return {
      priority: 1,
      type: 'accelerate',
      action: 'add_hot_lead_step',
      title: 'Lead est très engagé - Accélérer la conversion',
      description: `Lead avec score d'engagement de ${engagement.score}/100. Ajouter un appel à l'action direct ou planifier un appel.`,
      recommendedSteps: [
        {
          type: 'email',
          name: 'Appel Direct',
          config: {
            subject: 'Parlons-en maintenant ?',
            content: 'Message direct avec calendrier de réservation'
          }
        },
        {
          type: 'action_task',
          name: 'Appel Urgent',
          config: {
            priority: 'HAUTE',
            action: 'Appeler ce lead chaud immédiatement'
          }
        }
      ],
      reasoning: 'Fort engagement détecté - priorité haute conversion'
    };
  }

  if (engagement.level === 'cold' && performance.emailsSent >= 2) {
    return {
      priority: 2,
      type: 'pivot',
      action: 'change_approach',
      title: 'Engagement faible - Changer d\'approche',
      description: `Lead reste froid après ${performance.emailsSent} emails. Considérer une pause ou nouvelle approche.`,
      recommendedSteps: [
        {
          type: 'wait',
          name: 'Pause stratégique',
          config: {
            delay: 7,
            unit: 'days'
          }
        },
        {
          type: 'email',
          name: 'Nouvelle approche',
          config: {
            subject: 'Changeons de sujet...',
            content: 'Approche différente avec contenu éducatif'
          }
        }
      ],
      reasoning: 'Faible engagement nécessite changement de stratégie'
    };
  }

  return null;
}

/**
 * Suggest based on response behavior
 */
function suggestBasedOnResponse(execution, performance) {
  if (performance.hasResponse) {
    return {
      priority: 1,
      type: 'capitalize',
      action: 'follow_up_response',
      title: 'Lead a répondu - Donner suite immédiatement',
      description: 'Le lead a montré de l\'intérêt en répondant. Capitaliser sur cet engagement.',
      recommendedSteps: [
        {
          type: 'email',
          name: 'Réponse personnalisée',
          config: {
            subject: 'Re: [Leur réponse]',
            content: 'Répondre personnellement à leur message'
          }
        },
        {
          type: 'action_priority',
          name: 'Augmenter priorité',
          config: {
            priority: 'HAUTE'
          }
        }
      ],
      reasoning: 'Réponse active = opportunité à saisir rapidement'
    };
  }

  if (performance.emailsSent >= 3 && !performance.hasResponse) {
    return {
      priority: 3,
      type: 'adjust',
      action: 'final_attempt',
      title: 'Pas de réponse après 3 emails - Tentative finale',
      description: 'Aucune réponse après plusieurs tentatives. Email de clôture avec valeur.',
      recommendedSteps: [
        {
          type: 'wait',
          name: 'Dernière pause',
          config: {
            delay: 5,
            unit: 'days'
          }
        },
        {
          type: 'email',
          name: 'Email de clôture',
          config: {
            subject: 'Dernier message - Ressources utiles',
            content: 'Clôture gracieuse avec ressources gratuites'
          }
        },
        {
          type: 'action_priority',
          name: 'Réduire priorité',
          config: {
            priority: 'BASSE'
          }
        }
      ],
      reasoning: 'Pas de réponse = préparer clôture du workflow'
    };
  }

  return null;
}

/**
 * Suggest based on open/click behavior
 */
function suggestBasedOnBehavior(execution, performance) {
  const openRate = parseFloat(performance.openRate);
  const clickRate = parseFloat(performance.clickRate);

  if (openRate >= 50 && clickRate < 10 && execution.emailsOpened >= 2) {
    return {
      priority: 2,
      type: 'optimize',
      action: 'improve_cta',
      title: 'Taux d\'ouverture bon mais peu de clics',
      description: `${performance.openRate}% d'ouverture mais seulement ${performance.clickRate}% de clics. Améliorer les CTA.`,
      recommendedSteps: [
        {
          type: 'email',
          name: 'Email avec CTA fort',
          config: {
            subject: 'Appel à l\'action clair',
            content: 'Email avec CTA principal mis en avant'
          }
        }
      ],
      reasoning: 'Bon engagement initial mais manque de conversion en action'
    };
  }

  if (openRate >= 70) {
    return {
      priority: 2,
      type: 'capitalize',
      action: 'strong_engagement',
      title: 'Excellent taux d\'ouverture',
      description: `${performance.openRate}% d'ouverture - le lead est très intéressé.`,
      recommendedSteps: [
        {
          type: 'email',
          name: 'Proposition de valeur',
          config: {
            subject: 'Suite à votre intérêt...',
            content: 'Proposition concrète ou démonstration'
          }
        }
      ],
      reasoning: 'Fort intérêt démontré par multiples ouvertures'
    };
  }

  return null;
}

/**
 * Suggest based on workflow progress
 */
function suggestBasedOnProgress(execution, performance) {
  const completionRate = parseFloat(performance.completionRate);

  if (completionRate >= 80 && !performance.hasResponse) {
    return {
      priority: 3,
      type: 'complete',
      action: 'finish_workflow',
      title: 'Workflow presque terminé sans conversion',
      description: `${performance.completionRate}% du workflow complété. Décider de la suite.`,
      recommendedSteps: [
        {
          type: 'action_task',
          name: 'Décision manuelle',
          config: {
            action: 'Évaluer si continuer ou clôturer ce lead',
            priority: 'MOYENNE'
          }
        }
      ],
      reasoning: 'Fin de workflow sans résultat = décision nécessaire'
    };
  }

  if (execution.failedSteps > 0) {
    return {
      priority: 1,
      type: 'fix',
      action: 'address_failures',
      title: 'Étapes échouées détectées',
      description: `${execution.failedSteps} étape(s) ont échoué. Vérifier et corriger.`,
      recommendedSteps: [
        {
          type: 'action_task',
          name: 'Corriger erreurs',
          config: {
            action: 'Vérifier et corriger les étapes échouées',
            priority: 'HAUTE'
          }
        }
      ],
      reasoning: 'Échecs dans le workflow nécessitent attention immédiate'
    };
  }

  return null;
}

/**
 * Suggest based on timing
 */
function suggestBasedOnTiming(execution, performance) {
  if (performance.daysSinceStart >= 14 && performance.completionRate < 50) {
    return {
      priority: 4,
      type: 'review',
      action: 'workflow_taking_too_long',
      title: 'Workflow prend trop de temps',
      description: `${performance.daysSinceStart} jours depuis le début, seulement ${performance.completionRate}% complété.`,
      recommendedSteps: [
        {
          type: 'action_task',
          name: 'Réviser le workflow',
          config: {
            action: 'Accélérer ou simplifier le workflow',
            priority: 'MOYENNE'
          }
        }
      ],
      reasoning: 'Durée excessive peut indiquer désengagement'
    };
  }

  if (performance.daysSinceStart <= 2 && performance.hasResponse) {
    return {
      priority: 1,
      type: 'accelerate',
      action: 'quick_response',
      title: 'Réponse rapide du lead',
      description: 'Lead très réactif - accélérer le processus.',
      recommendedSteps: [
        {
          type: 'email',
          name: 'Suivi immédiat',
          config: {
            subject: 'Suite rapide',
            content: 'Réponse rapide avec prochaines étapes'
          }
        }
      ],
      reasoning: 'Réactivité rapide = forte motivation'
    };
  }

  return null;
}

/**
 * Get step recommendations based on workflow template
 * @param {string} category - Workflow category
 * @param {string} currentStepType - Current step type
 * @returns {Array} Recommended next steps
 */
export function getRecommendedNextSteps(category, currentStepType) {
  const recommendations = {
    welcome: {
      email: [
        { type: 'wait', name: 'Attendre 3 jours', config: { delay: 3, unit: 'days' } },
        { type: 'email', name: 'Email de suivi' }
      ],
      wait: [
        { type: 'email', name: 'Email de relance' },
        { type: 'condition', name: 'Vérifier si réponse' }
      ],
      action: [
        { type: 'email', name: 'Email de confirmation' },
        { type: 'wait', name: 'Attendre avant suite' }
      ]
    },
    follow_up: {
      email: [
        { type: 'wait', name: 'Attendre 5 jours', config: { delay: 5, unit: 'days' } },
        { type: 'condition', name: 'Vérifier engagement' }
      ],
      wait: [
        { type: 'email', name: 'Email final' },
        { type: 'action_priority', name: 'Ajuster priorité' }
      ]
    },
    conversion: {
      email: [
        { type: 'wait', name: 'Attendre 24-48h', config: { delay: 24, unit: 'hours' } },
        { type: 'action_task', name: 'Créer tâche appel' }
      ],
      action: [
        { type: 'email', name: 'Email personnalisé' }
      ]
    },
    nurture: {
      email: [
        { type: 'wait', name: 'Attendre 7 jours', config: { delay: 7, unit: 'days' } },
        { type: 'email', name: 'Email éducatif suivant' }
      ],
      wait: [
        { type: 'email', name: 'Contenu de valeur' }
      ]
    }
  };

  const categoryRecs = recommendations[category] || recommendations.follow_up;
  return categoryRecs[currentStepType] || [];
}

/**
 * Get performance benchmarks
 * @param {string} workflowCategory - Workflow category
 * @returns {Promise<Object>} Benchmark data
 */
export async function getPerformanceBenchmarks(workflowCategory) {
  try {
    const executions = await prisma.workflowExecution.findMany({
      where: {
        workflow: {
          category: workflowCategory
        },
        status: 'completed',
        completedAt: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
        }
      }
    });

    if (executions.length === 0) {
      return {
        available: false,
        message: 'Pas assez de données pour cette catégorie'
      };
    }

    const avgOpenRate = executions.reduce((sum, e) =>
      sum + (e.emailsSent > 0 ? e.emailsOpened / e.emailsSent * 100 : 0), 0
    ) / executions.length;

    const avgResponseRate = executions.reduce((sum, e) =>
      sum + (e.emailsSent > 0 ? e.emailsReplied / e.emailsSent * 100 : 0), 0
    ) / executions.length;

    const avgDuration = executions.reduce((sum, e) =>
      sum + (new Date(e.completedAt) - new Date(e.startedAt)) / (24 * 60 * 60 * 1000), 0
    ) / executions.length;

    return {
      available: true,
      category: workflowCategory,
      sampleSize: executions.length,
      benchmarks: {
        avgOpenRate: avgOpenRate.toFixed(1) + '%',
        avgResponseRate: avgResponseRate.toFixed(1) + '%',
        avgDurationDays: avgDuration.toFixed(1),
        successRate: (executions.filter(e => e.emailsReplied > 0).length / executions.length * 100).toFixed(1) + '%'
      },
      period: 'Last 90 days'
    };

  } catch (error) {
    console.error('Error getting benchmarks:', error);
    return {
      available: false,
      error: error.message
    };
  }
}
