# Workflow Engine - Guide Complet

## Vue d'Ensemble

Le Workflow Engine est un système puissant d'automatisation marketing qui permet de créer des séquences d'emails multi-étapes avec des délais, des conditions et des actions personnalisées. Ce système permet d'automatiser complètement votre nurturing de leads.

## Table des Matières

1. [Architecture](#architecture)
2. [Types d'Étapes](#types-détapes)
3. [Templates Prédéfinis](#templates-prédéfinis)
4. [API Endpoints](#api-endpoints)
5. [Créer un Workflow](#créer-un-workflow)
6. [Exécuter un Workflow](#exécuter-un-workflow)
7. [Monitoring et Statistiques](#monitoring-et-statistiques)
8. [Workers en Arrière-Plan](#workers-en-arrière-plan)
9. [Exemples d'Utilisation](#exemples-dutilisation)
10. [Dépannage](#dépannage)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Workflow Definition                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Step 1: Email    →  Step 2: Wait  →  Step 3: ...  │     │
│  └────────────────────────────────────────────────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Workflow Execution                          │
│  Lead: Microsoft France                                      │
│  Status: Active | Progress: 2/5 steps                        │
└────────────────────────┬────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │ Email   │    │  Wait   │    │ Condition│
    │ Worker  │    │ Delayed │    │  Logic  │
    └─────────┘    └─────────┘    └─────────┘
          │              │              │
          └──────────────┼──────────────┘
                         ↓
              ┌────────────────────┐
              │  Step Execution    │
              │  Track & Metrics   │
              └────────────────────┘
```

### Composants Principaux

- **Workflow** - Définition d'une séquence automatisée
- **WorkflowStep** - Étape individuelle (email, wait, condition, action)
- **WorkflowExecution** - Instance d'exécution pour un lead spécifique
- **StepExecution** - Suivi de l'exécution de chaque étape
- **WorkflowTemplate** - Templates prédéfinis réutilisables

---

## Types d'Étapes

### 1. Email Step (Envoi d'Email)

Envoie un email à travers le système de queue BullMQ.

**Configuration:**
```json
{
  "stepType": "email",
  "name": "Email de Bienvenue",
  "config": {
    "subject": "Bonjour {{lead.companyName}}",
    "content": "<p>Email HTML avec variables {{lead.field}}</p>",
    "sendAt": "2025-01-20T10:00:00Z" // Optionnel - pour planification
  }
}
```

**Variables disponibles:**
- `{{lead.companyName}}` - Nom de l'entreprise
- `{{lead.email}}` - Email du lead
- `{{lead.phone}}` - Téléphone
- `{{lead.website}}` - Site web
- `{{lead.employeeCount}}` - Nombre d'employés
- `{{lead.siret}}` - Numéro SIRET
- `{{lead.nafCode}}` - Code NAF
- `{{execution.id}}` - ID de l'exécution
- Toutes les propriétés de `lead` et `execution`

### 2. Wait Step (Délai)

Attend un certain temps avant de passer à l'étape suivante.

**Configuration:**
```json
{
  "stepType": "wait",
  "name": "Attendre 3 jours",
  "config": {
    "delay": 3,
    "unit": "days" // "minutes", "hours", "days", "weeks"
  }
}
```

**Unités supportées:**
- `minutes` - Délai en minutes
- `hours` - Délai en heures
- `days` - Délai en jours
- `weeks` - Délai en semaines

### 3. Condition Step (Branchement)

Évalue une condition pour décider de la suite du workflow.

**Configuration:**
```json
{
  "stepType": "condition",
  "name": "Vérifier si priorité haute",
  "config": {
    "field": "lead.priority",
    "operator": "equals",
    "value": "HAUTE"
  }
}
```

**Opérateurs disponibles:**
- `equals` - Égal à
- `not_equals` - Différent de
- `contains` - Contient (chaînes)
- `not_contains` - Ne contient pas
- `greater_than` - Supérieur à (nombres)
- `less_than` - Inférieur à
- `is_empty` - Est vide
- `is_not_empty` - N'est pas vide
- `in` - Dans une liste
- `not_in` - Pas dans une liste

**Champs disponibles:**
- `lead.{property}` - N'importe quelle propriété du lead
- `context.{property}` - Données du contexte d'exécution
- `lead.managers.length` - Nombre de managers
- `lead.services.length` - Nombre de services

### 4. Action Step (Action Système)

Exécute une action système (enrichir, créer tâche, changer priorité, etc.).

**Configuration:**
```json
{
  "stepType": "action",
  "name": "Enrichir le lead",
  "config": {
    "actionType": "enrich_lead"
    // OU
    "actionType": "update_priority",
    "priority": "HAUTE"
    // OU
    "actionType": "create_task",
    "task": {
      "action": "Appeler le lead",
      "priority": "HAUTE",
      "deadline": "+3 days",
      "assignedTo": "Nicolas BAYONNE"
    }
  }
}
```

**Actions disponibles:**
- `enrich_lead` - Enrichir les données du lead
- `update_priority` - Changer la priorité (HAUTE/MOYENNE/BASSE)
- `create_task` - Créer une tâche de suivi
- `add_tag` - Ajouter un tag au lead

---

## Templates Prédéfinis

### Template 1: Séquence de Bienvenue 👋

**Nom:** `welcome_sequence`
**Durée:** 2 semaines
**Emails:** 3

**Structure:**
1. Email de premier contact
2. Attente 3 jours
3. Email de suivi avec cas client
4. Attente 7 jours
5. Email final avec ressource gratuite

**Cas d'usage:** Nouveaux leads enrichis avec email

### Template 2: Relance Sans Réponse 🔔

**Nom:** `no_response_followup`
**Durée:** 12 jours
**Emails:** 2

**Structure:**
1. Enrichir le lead (données fraîches)
2. Email de relance personnalisé
3. Attente 5 jours
4. Vérifier si réponse
5. Email de clôture (si pas de réponse)
6. Réduire priorité (si pas de réponse)

**Cas d'usage:** Leads sans interaction depuis 7+ jours

### Template 3: Nurturing Long Terme 🌱

**Nom:** `long_term_nurture`
**Durée:** 1 mois
**Emails:** 4

**Structure:**
1. Email éducatif - Tendances 2025
2. Attente 1 semaine
3. Cas client similaire
4. Attente 1 semaine
5. Outil gratuit (calculateur ROI)
6. Attente 1 semaine
7. Appel à l'action (audit gratuit)
8. Créer tâche de suivi

**Cas d'usage:** Leads qualifiés mais pas encore prêts

---

## API Endpoints

### Workflows

#### GET /api/workflows
Liste tous les workflows

**Query Params:**
- `status` - Filtrer par statut (active, paused, archived)
- `category` - Filtrer par catégorie (welcome, follow_up, nurture, re_engagement)

**Response:**
```json
{
  "success": true,
  "workflows": [
    {
      "id": "workflow_xxx",
      "name": "Séquence de Bienvenue",
      "category": "welcome",
      "status": "active",
      "totalExecutions": 45,
      "activeExecutions": 12,
      "successRate": 0.85,
      "steps": [...],
      "_count": {
        "executions": 45
      }
    }
  ]
}
```

#### POST /api/workflows
Créer un nouveau workflow

**Body:**
```json
{
  "name": "Mon Workflow",
  "description": "Description du workflow",
  "category": "welcome",
  "triggerType": "manual",
  "targetSegment": "all",
  "targetPriority": "HAUTE,MOYENNE",
  "steps": [
    {
      "name": "Email 1",
      "stepType": "email",
      "config": {
        "subject": "Sujet",
        "content": "<p>Contenu</p>"
      }
    },
    {
      "name": "Attente",
      "stepType": "wait",
      "config": {
        "delay": 2,
        "unit": "days"
      }
    }
  ]
}
```

#### PUT /api/workflows
Mettre à jour un workflow

**Body:**
```json
{
  "id": "workflow_xxx",
  "name": "Nouveau nom",
  "status": "paused"
}
```

#### DELETE /api/workflows?id=xxx
Supprimer un workflow

### Executions

#### POST /api/workflows/execute
Démarrer un workflow pour un lead

**Body:**
```json
{
  "workflowId": "workflow_xxx",
  "leadId": "lead_xxx",
  "context": {
    "campaign": "Q1 2025",
    "source": "website"
  }
}
```

**Response:**
```json
{
  "success": true,
  "execution": {
    "id": "execution_xxx",
    "workflowId": "workflow_xxx",
    "leadId": "lead_xxx",
    "leadName": "Microsoft France",
    "status": "active",
    "startedAt": "2025-01-18T10:00:00Z"
  }
}
```

#### GET /api/workflows/execute?executionId=xxx
Obtenir le statut détaillé d'une exécution

**Response:**
```json
{
  "success": true,
  "execution": {
    "id": "execution_xxx",
    "workflow": "Séquence de Bienvenue",
    "lead": "Microsoft France",
    "status": "active",
    "progress": {
      "total": 5,
      "completed": 2,
      "failed": 0,
      "percentage": 40
    },
    "metrics": {
      "emailsSent": 2,
      "emailsOpened": 1,
      "emailsClicked": 0,
      "emailsReplied": 0
    },
    "timing": {
      "startedAt": "2025-01-18T10:00:00Z",
      "duration": 172800
    },
    "steps": [
      {
        "name": "Email de Bienvenue",
        "type": "email",
        "status": "completed",
        "result": { "jobId": "...", "emailTo": "..." }
      },
      {
        "name": "Attente 3 jours",
        "type": "wait",
        "status": "completed"
      },
      {
        "name": "Email de Suivi",
        "type": "email",
        "status": "pending"
      }
    ]
  }
}
```

#### GET /api/workflows/execute?leadId=xxx
Liste les exécutions pour un lead

#### GET /api/workflows/execute?workflowId=xxx
Liste les exécutions d'un workflow

#### PATCH /api/workflows/execute
Contrôler une exécution (pause/resume/cancel)

**Body:**
```json
{
  "executionId": "execution_xxx",
  "action": "pause" // "pause", "resume", "cancel"
}
```

### Templates

#### GET /api/workflows/templates
Liste tous les templates

**Query Params:**
- `category` - Filtrer par catégorie

**Response:**
```json
{
  "success": true,
  "templates": [
    {
      "id": "template_xxx",
      "name": "welcome_sequence",
      "displayName": "Séquence de Bienvenue",
      "description": "Séquence automatique de 3 emails...",
      "category": "welcome",
      "icon": "👋",
      "recommendedFor": "Nouveaux leads...",
      "timesUsed": 15,
      "averageSuccessRate": 0.78
    }
  ]
}
```

#### POST /api/workflows/templates
Créer un workflow depuis un template

**Body:**
```json
{
  "templateName": "welcome_sequence",
  "customizations": {
    "name": "Bienvenue Clients Premium",
    "targetPriority": "HAUTE"
  }
}
```

### Statistiques

#### GET /api/workflows/stats
Obtenir les statistiques complètes

**Query Params:**
- `days` - Période en jours (défaut: 30)
- `workflowId` - Filtrer par workflow

**Response:**
```json
{
  "success": true,
  "period": {
    "days": 30,
    "since": "2024-12-19T00:00:00Z"
  },
  "overview": {
    "workflows": {
      "total": 10,
      "active": 8,
      "paused": 2
    },
    "executions": {
      "total": 156,
      "active": 23,
      "completed": 120,
      "failed": 13,
      "completionRate": "76.92%"
    },
    "emails": {
      "sent": 450,
      "opened": 320,
      "clicked": 89,
      "replied": 34,
      "openRate": "71.11%",
      "clickRate": "27.81%",
      "replyRate": "7.56%"
    }
  },
  "topWorkflows": [...],
  "recentExecutions": [...],
  "timeline": [...],
  "stepPerformance": [...]
}
```

---

## Créer un Workflow

### Méthode 1: Depuis un Template (Recommandé)

```javascript
// 1. Lister les templates disponibles
const templatesResponse = await fetch('/api/workflows/templates');
const { templates } = await templatesResponse.json();

// 2. Créer un workflow depuis le template
const createResponse = await fetch('/api/workflows/templates', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    templateName: 'welcome_sequence',
    customizations: {
      name: 'Bienvenue Nouveaux Leads',
      targetSegment: 'sme',
      targetPriority: 'HAUTE,MOYENNE'
    }
  })
});

const { workflow } = await createResponse.json();
console.log('Workflow créé:', workflow.id);
```

### Méthode 2: Créer de Zéro

```javascript
const createResponse = await fetch('/api/workflows', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Workflow Personnalisé',
    description: 'Description du workflow',
    category: 'nurture',
    triggerType: 'manual',
    targetSegment: 'enterprise',
    targetPriority: 'HAUTE',
    steps: [
      // Étape 1: Email
      {
        name: 'Email Initial',
        stepType: 'email',
        config: {
          subject: 'Bonjour {{lead.companyName}}',
          content: `
            <p>Bonjour,</p>
            <p>Nous avons remarqué que {{lead.companyName}} pourrait bénéficier de...</p>
            <p>Cordialement,</p>
          `
        }
      },
      // Étape 2: Attente
      {
        name: 'Attente 5 jours',
        stepType: 'wait',
        config: {
          delay: 5,
          unit: 'days'
        }
      },
      // Étape 3: Condition
      {
        name: 'Vérifier Ouverture',
        stepType: 'condition',
        config: {
          field: 'context.emailOpened',
          operator: 'equals',
          value: true
        }
      },
      // Étape 4: Email conditionnel
      {
        name: 'Email de Suivi (si ouvert)',
        stepType: 'email',
        executeIf: {
          condition: 'context.emailOpened',
          value: true
        },
        config: {
          subject: 'Suite de notre conversation',
          content: '<p>Merci d\'avoir ouvert notre email...</p>'
        }
      },
      // Étape 5: Action
      {
        name: 'Créer Tâche',
        stepType: 'action',
        config: {
          actionType: 'create_task',
          task: {
            action: 'Appeler le lead pour qualifier',
            priority: 'HAUTE',
            assignedTo: 'Nicolas BAYONNE'
          }
        }
      }
    ]
  })
});

const { workflow } = await createResponse.json();
```

---

## Exécuter un Workflow

### Démarrage Manuel

```javascript
const executeResponse = await fetch('/api/workflows/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowId: 'workflow_xxx',
    leadId: 'lead_xxx',
    context: {
      campaign: 'Q1 2025',
      source: 'website',
      customField: 'value'
    }
  })
});

const { execution } = await executeResponse.json();
console.log('Execution ID:', execution.id);
```

### Démarrage Automatique (Triggers)

Les workflows peuvent se déclencher automatiquement basé sur des événements:

**Triggers disponibles:**
- `lead_created` - Quand un lead est créé
- `lead_enriched` - Quand un lead est enrichi
- `email_opened` - Quand un email est ouvert
- `email_clicked` - Quand un email est cliqué
- `no_response` - Après X jours sans réponse

**Configuration:**
```javascript
{
  "triggerType": "lead_enriched",
  "triggerConfig": {
    "autoStart": true,
    "conditions": {
      "enrichmentStatus": "enriched",
      "hasEmail": true,
      "priority": ["HAUTE", "MOYENNE"]
    }
  }
}
```

### Contrôler une Exécution

**Mettre en pause:**
```javascript
await fetch('/api/workflows/execute', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    executionId: 'execution_xxx',
    action: 'pause'
  })
});
```

**Reprendre:**
```javascript
await fetch('/api/workflows/execute', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    executionId: 'execution_xxx',
    action: 'resume'
  })
});
```

**Annuler:**
```javascript
await fetch('/api/workflows/execute', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    executionId: 'execution_xxx',
    action: 'cancel'
  })
});
```

---

## Monitoring et Statistiques

### Vue d'Ensemble des Workflows

```javascript
const statsResponse = await fetch('/api/workflows/stats?days=30');
const stats = await statsResponse.json();

console.log('Workflows:', stats.overview.workflows);
console.log('Exécutions:', stats.overview.executions);
console.log('Emails:', stats.overview.emails);
console.log('Top workflows:', stats.topWorkflows);
```

### Suivre une Exécution Spécifique

```javascript
const statusResponse = await fetch(`/api/workflows/execute?executionId=${executionId}`);
const { execution } = await statusResponse.json();

console.log(`Progrès: ${execution.progress.percentage}%`);
console.log(`Emails envoyés: ${execution.metrics.emailsSent}`);
console.log(`Taux d'ouverture: ${(execution.metrics.emailsOpened / execution.metrics.emailsSent * 100).toFixed(2)}%`);

// Afficher les étapes
execution.steps.forEach(step => {
  console.log(`${step.name}: ${step.status}`);
});
```

### Métriques en Temps Réel

```javascript
// Polling toutes les 5 secondes
const monitorExecution = (executionId) => {
  const interval = setInterval(async () => {
    const response = await fetch(`/api/workflows/execute?executionId=${executionId}`);
    const { execution } = await response.json();

    console.log(`Progrès: ${execution.progress.percentage}%`);

    if (execution.status === 'completed' || execution.status === 'failed') {
      clearInterval(interval);
      console.log(`Workflow ${execution.status}!`);
    }
  }, 5000);
};

monitorExecution('execution_xxx');
```

---

## Workers en Arrière-Plan

Les workflows nécessitent des workers en arrière-plan pour traiter les étapes.

### Démarrer les Workers

**Développement:**
```bash
# Terminal 1 - Next.js app
npm run dev

# Terminal 2 - Workers
npm run workers
```

**Production:**
```bash
# Avec PM2
pm2 start npm --name "my-app" -- start
pm2 start lib/workers/start-workers.js --name "workers"
```

### Workers Disponibles

1. **Email Worker** - Traite l'envoi d'emails
2. **Enrichment Worker** - Traite l'enrichissement de leads
3. **Analytics Worker** - Traite les événements analytics
4. **Workflow Step Worker** - Exécute les étapes de workflows
5. **Workflow Trigger Worker** - Déclenche les workflows automatiques

### Configuration des Workers

**`lib/workers/workflow-worker.js`**
```javascript
{
  concurrency: 5,        // 5 étapes en parallèle
  limiter: {
    max: 10,            // Max 10 jobs
    duration: 1000      // par seconde
  }
}
```

---

## Exemples d'Utilisation

### Exemple 1: Workflow de Bienvenue Simple

```javascript
// Créer le workflow
const workflow = await fetch('/api/workflows', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Bienvenue Simple',
    category: 'welcome',
    triggerType: 'manual',
    steps: [
      {
        name: 'Email de Bienvenue',
        stepType: 'email',
        config: {
          subject: 'Bienvenue chez KAELIO, {{lead.companyName}}!',
          content: '<p>Merci pour votre intérêt...</p>'
        }
      },
      {
        name: 'Attente 3 jours',
        stepType: 'wait',
        config: { delay: 3, unit: 'days' }
      },
      {
        name: 'Email de Suivi',
        stepType: 'email',
        config: {
          subject: 'Avez-vous des questions ?',
          content: '<p>Nous sommes là pour vous aider...</p>'
        }
      }
    ]
  })
}).then(r => r.json());

// Démarrer pour un lead
const execution = await fetch('/api/workflows/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowId: workflow.workflow.id,
    leadId: 'lead_microsoft'
  })
}).then(r => r.json());

console.log('Workflow started:', execution.execution.id);
```

### Exemple 2: Workflow avec Branchement Conditionnel

```javascript
const workflow = {
  name: 'Qualification Intelligente',
  category: 'nurture',
  triggerType: 'manual',
  steps: [
    // Email initial
    {
      name: 'Email de Qualification',
      stepType: 'email',
      config: {
        subject: 'Quelle est votre priorité ?',
        content: '<p>Cliquez sur le lien correspondant...</p>'
      }
    },
    // Attente
    {
      name: 'Attente 2 jours',
      stepType: 'wait',
      config: { delay: 2, unit: 'days' }
    },
    // Condition: A-t-il cliqué ?
    {
      name: 'Vérifier Clic',
      stepType: 'condition',
      config: {
        field: 'context.emailClicked',
        operator: 'equals',
        value: true
      }
    },
    // Branche A: Si cliqué → Email personnalisé
    {
      name: 'Email Personnalisé (Hot Lead)',
      stepType: 'email',
      executeIf: {
        condition: 'context.emailClicked',
        value: true
      },
      config: {
        subject: 'Parfait ! Voici ce que nous pouvons faire...',
        content: '<p>Basé sur votre intérêt...</p>'
      }
    },
    // Branche A: Augmenter priorité
    {
      name: 'Augmenter Priorité',
      stepType: 'action',
      executeIf: {
        condition: 'context.emailClicked',
        value: true
      },
      config: {
        actionType: 'update_priority',
        priority: 'HAUTE'
      }
    },
    // Branche B: Si pas cliqué → Email générique
    {
      name: 'Email Générique (Nurture)',
      stepType: 'email',
      executeIf: {
        condition: 'context.emailClicked',
        value: false
      },
      config: {
        subject: 'Ressources qui pourraient vous intéresser',
        content: '<p>Voici quelques ressources...</p>'
      }
    }
  ]
};
```

### Exemple 3: Workflow Avec Enrichissement Automatique

```javascript
const workflow = {
  name: 'Enrichir et Nurture',
  category: 'nurture',
  triggerType: 'lead_created',
  triggerConfig: {
    autoStart: true,
    conditions: {
      hasEmail: true
    }
  },
  steps: [
    // Enrichir d'abord
    {
      name: 'Enrichir le Lead',
      stepType: 'action',
      config: {
        actionType: 'enrich_lead'
      }
    },
    // Attendre l'enrichissement
    {
      name: 'Attente Enrichissement',
      stepType: 'wait',
      config: { delay: 5, unit: 'minutes' }
    },
    // Email personnalisé avec données enrichies
    {
      name: 'Email Personnalisé',
      stepType: 'email',
      config: {
        subject: 'Bonjour {{lead.companyName}} - {{lead.employeeCount}} employés',
        content: `
          <p>Nous avons identifié votre entreprise:</p>
          <ul>
            <li>SIRET: {{lead.siret}}</li>
            <li>Secteur: {{lead.nafCode}}</li>
            <li>Employés: {{lead.employeeCount}}</li>
          </ul>
          <p>Nous pouvons vous aider à...</p>
        `
      }
    }
  ]
};
```

---

## Dépannage

### Problème: Workflow ne démarre pas

**Causes possibles:**
1. Lead n'a pas d'email
2. Workflow déjà en cours pour ce lead
3. Conditions de trigger non remplies

**Solution:**
```javascript
// Vérifier le lead
const lead = await prisma.hotLead.findUnique({
  where: { id: leadId }
});
console.log('Email:', lead.email); // Doit exister

// Vérifier si workflow en cours
const existing = await prisma.workflowExecution.findFirst({
  where: {
    leadId: leadId,
    status: { in: ['active', 'paused'] }
  }
});
console.log('Workflow en cours:', existing); // Doit être null
```

### Problème: Emails ne s'envoient pas

**Cause:** Workers pas démarrés

**Solution:**
```bash
# Vérifier si workers tournent
pm2 list

# Démarrer les workers si nécessaire
npm run workers
```

### Problème: Workflow bloqué à une étape

**Cause:** Erreur dans l'exécution d'une étape

**Solution:**
```javascript
// Vérifier le statut détaillé
const status = await fetch(`/api/workflows/execute?executionId=${executionId}`).then(r => r.json());

// Trouver l'étape en erreur
const failedStep = status.execution.steps.find(s => s.status === 'failed');
console.log('Étape en erreur:', failedStep);
console.log('Erreur:', failedStep.error);
```

### Problème: Variables non interpolées dans les emails

**Cause:** Syntaxe incorrecte ou propriété inexistante

**Solution:**
```javascript
// Vérifier la syntaxe
{{lead.companyName}}  // ✅ Correct
{lead.companyName}    // ❌ Incorrect
{{companyName}}       // ❌ Incorrect (manque 'lead.')

// Vérifier que la propriété existe
const lead = await prisma.hotLead.findUnique({
  where: { id: leadId }
});
console.log(lead); // Vérifier les propriétés disponibles
```

### Problème: Délais (wait) ne fonctionnent pas

**Cause:** Workers utilise `setTimeout` qui ne persiste pas au redémarrage

**Solution:**
En production, utilisez BullMQ delayed jobs (implémentation future) ou assurez-vous que les workers tournent en continu.

---

## Production

### Checklist de Déploiement

- [ ] Redis configuré et accessible
- [ ] Workers démarrés avec PM2
- [ ] Variables d'environnement configurées
- [ ] Templates de workflows seeded
- [ ] Monitoring configuré (logs, métriques)
- [ ] Backup de la base de données
- [ ] Rate limiting configuré
- [ ] Email provider configuré (SendGrid, etc.)

### Configuration Production

**`.env.production`:**
```bash
NODE_ENV=production

# Redis
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_TLS=true

# Database
DATABASE_URL=file:./production.db

# Email Provider
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_key
```

### Monitoring Production

```bash
# PM2 monitoring
pm2 monit

# Logs en temps réel
pm2 logs workers --lines 100

# Métriques
pm2 show workers
```

---

## Support

### Questions Fréquentes

**Q: Combien de workflows peut-on avoir en parallèle ?**
R: Illimité. Chaque lead peut avoir plusieurs workflows actifs simultanément.

**Q: Peut-on modifier un workflow en cours ?**
R: Non, seul le workflow définition peut être modifié. Les exécutions en cours suivent la version initiale.

**Q: Les emails sont-ils trackés automatiquement ?**
R: Oui, tous les emails passent par le système de queue qui track automatiquement les envois, ouvertures, clics.

**Q: Peut-on tester un workflow sans l'envoyer réellement ?**
R: Oui, utilisez un lead de test et consultez les logs pour voir ce qui aurait été envoyé.

**Q: Comment arrêter un workflow définitivement ?**
R: Utilisez l'action "cancel" sur l'exécution, ou changez le statut du workflow à "paused" pour empêcher de nouvelles exécutions.

---

**Version:** 1.0
**Dernière mise à jour:** 2025-01-18
**Auteur:** Claude (AI Assistant)
