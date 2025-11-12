# Input Data & Labeling System Analysis

## 🎯 Overview

This document provides a comprehensive analysis of the input data structures, labeling systems, and training data used throughout the AI chatbot pipeline.

## 📥 Input Data Structures

### **1. Primary API Input** (`/api/email-chatbot`)

```json
{
  "message": "String - User's natural language input",
  "conversationState": "String - Current conversation phase",
  "emailData": "Object - Accumulated email context",
  "conversationHistory": "Array - Previous interactions"
}
```

**Example:**
```json
{
  "message": "Je veux créer un email pour contacter un prospect Azure",
  "conversationState": "initial",
  "emailData": {
    "purpose": "prospection",
    "tone": "professional",
    "recipientName": "Martin Dupont",
    "company": "TechCorp"
  },
  "conversationHistory": [
    {
      "role": "user",
      "content": "Bonjour",
      "timestamp": "2025-01-20T10:30:00Z"
    }
  ]
}
```

### **2. Enhanced Input with Metadata** (Internal Processing)

```json
{
  "userMessage": "String - Original user input",
  "sessionId": "String - Session identifier",
  "timestamp": "Date - Request timestamp",
  "context": {
    "conversationState": "String",
    "turnCount": "Number",
    "previousIntents": "Array"
  },
  "metadata": {
    "source": "String - Input source (web, api, test)",
    "userId": "String - User identifier",
    "clientProfile": "Object - Client information"
  }
}
```

## 🏷️ Labeling Systems

### **1. Intent Labels** (LUIS-Style System)

**Primary Intent Categories:**
```json
{
  "CreateEmail": {
    "description": "User wants to create any type of email",
    "action": "initiate_email_creation",
    "confidence_threshold": 0.7
  },
  "ManageContact": {
    "description": "User wants to add, find, or manage contact information",
    "action": "manage_contact_info",
    "confidence_threshold": 0.6
  },
  "ManageTemplate": {
    "description": "User wants to create, modify, or organize email templates",
    "action": "manage_templates",
    "confidence_threshold": 0.7
  },
  "ScheduleFollowUp": {
    "description": "User wants to schedule meetings or create follow-up communications",
    "action": "schedule_activity",
    "confidence_threshold": 0.6
  },
  "GetHelp": {
    "description": "User needs help, guidance, or wants to understand features",
    "action": "provide_assistance",
    "confidence_threshold": 0.5
  },
  "ProvideFeedback": {
    "description": "User wants to give feedback or report issues",
    "action": "collect_feedback",
    "confidence_threshold": 0.6
  },
  "Greeting": {
    "description": "User is greeting or starting conversation",
    "action": "respond_greeting",
    "confidence_threshold": 0.8
  },
  "None": {
    "description": "Requests outside the email assistant domain",
    "action": "handle_out_of_domain",
    "confidence_threshold": 0.3
  }
}
```

### **2. QnA Knowledge Base Labels**

**Knowledge Categories:**
```json
{
  "azure": {
    "category": "Azure Cloud Solutions",
    "icon": "☁️",
    "total_qa_pairs": 3
  },
  "microsoft365": {
    "category": "Microsoft 365",
    "icon": "📧",
    "total_qa_pairs": 2
  },
  "teams": {
    "category": "Microsoft Teams",
    "icon": "🤝",
    "total_qa_pairs": 2
  },
  "power": {
    "category": "Power Platform",
    "icon": "⚡",
    "total_qa_pairs": 1
  },
  "dynamics": {
    "category": "Dynamics 365",
    "icon": "💼",
    "total_qa_pairs": 1
  },
  "security": {
    "category": "Sécurité & Conformité",
    "icon": "🔐",
    "total_qa_pairs": 1
  },
  "general": {
    "category": "Questions Générales",
    "icon": "❓",
    "total_qa_pairs": 2
  }
}
```

**QnA Entry Structure:**
```json
{
  "id": "azure_migration_001",
  "question": "Comment migrer vers Azure ?",
  "alternateQuestions": [
    "Migration vers Azure",
    "Étapes migration cloud Azure",
    "Comment passer au cloud Azure"
  ],
  "answer": "Detailed answer with formatting...",
  "confidence": 0.95,
  "context": ["migration", "cloud", "infrastructure"],
  "category": "azure",
  "tags": ["migration", "cloud", "infrastructure", "azure migrate"]
}
```

### **3. Entity Labels** (Enhanced NLP)

**Entity Types:**
```json
{
  "PersonName": {
    "type": "PERSON",
    "patterns": ["Martin Dupont", "Jean", "M. Martin"],
    "role": "contact_identification"
  },
  "CompanyName": {
    "type": "ORGANIZATION",
    "patterns": ["Microsoft", "TechCorp", "Azure Solutions"],
    "role": "client_organization"
  },
  "TechnologyProduct": {
    "type": "TECHNOLOGY",
    "patterns": ["Azure", "Teams", "Office 365", "Power BI"],
    "role": "product_reference"
  },
  "EmailAddress": {
    "type": "EMAIL",
    "patterns": ["martin@techcorp.com", "contact@company.fr"],
    "role": "contact_method"
  },
  "MeetingTime": {
    "type": "DATETIME",
    "patterns": ["demain", "cette semaine", "15h", "lundi"],
    "role": "scheduling"
  }
}
```

### **4. Sentiment Labels**

**Sentiment Categories:**
```json
{
  "positive": {
    "label": "positive",
    "confidence_range": [0.6, 1.0],
    "indicators": ["excellent", "fantastique", "parfait"]
  },
  "negative": {
    "label": "negative",
    "confidence_range": [0.6, 1.0],
    "indicators": ["problème", "difficile", "frustrant"]
  },
  "urgent": {
    "label": "urgent",
    "confidence_range": [0.7, 1.0],
    "indicators": ["urgent", "immédiat", "critique"]
  },
  "neutral": {
    "label": "neutral",
    "confidence_range": [0.4, 0.8],
    "indicators": []
  }
}
```

### **5. Conversation State Labels**

**State Machine:**
```json
{
  "initial": {
    "description": "Starting conversation, determining intent",
    "expected_inputs": ["greetings", "email_requests", "questions"],
    "possible_transitions": ["gathering_info", "help", "knowledge_query"]
  },
  "gathering_info": {
    "description": "Collecting email recipient and context information",
    "expected_inputs": ["contact_details", "company_info", "purpose"],
    "possible_transitions": ["email_generation", "clarification", "initial"]
  },
  "gathering_prospect_info": {
    "description": "Specific state for prospect contact information",
    "expected_inputs": ["name_company_format", "contact_details"],
    "possible_transitions": ["email_generation", "gathering_info"]
  },
  "email_generation": {
    "description": "Generating email content",
    "expected_inputs": ["modifications", "approval", "tone_changes"],
    "possible_transitions": ["review", "initial", "finalization"]
  },
  "review": {
    "description": "User reviewing generated email",
    "expected_inputs": ["approval", "modifications", "regeneration"],
    "possible_transitions": ["email_generation", "finalization", "initial"]
  },
  "help": {
    "description": "Providing user assistance",
    "expected_inputs": ["help_requests", "feature_questions"],
    "possible_transitions": ["initial", "knowledge_query"]
  },
  "knowledge_query": {
    "description": "Answering Microsoft solutions questions",
    "expected_inputs": ["follow_up_questions", "clarifications"],
    "possible_transitions": ["initial", "email_generation"]
  }
}
```

## 📊 Training Data Structure

### **1. Intent Classification Training Data**

**Format per Intent:**
```json
{
  "CreateEmail": {
    "examples": [
      "Je veux créer un email",
      "Écrire un message",
      "Envoyer un mail",
      "Rédiger une communication"
      // ... 10 total examples
    ],
    "features": ["email", "créer", "écrire", "envoyer", "message", "mail"],
    "negative_examples": [
      "Météo à Paris",
      "Réserver un restaurant",
      "Prix du bitcoin"
    ]
  }
}
```

**Training Statistics:**
- **Total Examples**: 200+ across all intents
- **None Intent**: 130 examples (65% of training data)
- **Positive Examples**: 70 examples (35% of training data)
- **Language**: Primarily French with some English
- **Domain**: Microsoft solutions + email creation

### **2. Knowledge Base Training Data**

**Structure:**
```json
{
  "training_pairs": [
    {
      "input_variations": [
        "Comment migrer vers Azure ?",
        "Migration vers Azure",
        "Étapes migration cloud Azure"
      ],
      "expected_output": {
        "category": "azure",
        "confidence": 0.95,
        "answer_id": "azure_migration_001"
      }
    }
  ],
  "total_qa_pairs": 12,
  "categories": 7,
  "average_confidence": 0.89
}
```

### **3. Active Learning Training Data**

**Uncertain Samples:**
```json
{
  "uncertain_sample": {
    "message": "Support technique urgent",
    "predicted_intent": "GetHelp",
    "confidence": 0.35,
    "human_label": null,
    "priority": 85,
    "session_id": "session_123",
    "timestamp": "2025-01-20T10:30:00Z"
  }
}
```

**User Corrections:**
```json
{
  "correction": {
    "user_message": "Migrer données Azure",
    "predicted_intent": "CreateEmail",
    "corrected_intent": "GetHelp",
    "confidence_improvement": 0.6,
    "impact_score": 0.9
  }
}
```

## 🔄 Data Flow Through Pipeline

### **Input Processing Chain:**
```
1. Raw User Input → Text Preprocessing
2. Preprocessed Text → Parallel Analysis:
   - LUIS Intent Classification
   - QnA Knowledge Search
   - Enhanced NLP Processing
   - Sentiment Analysis
3. Multiple Predictions → Confidence Scoring
4. Best Prediction → Response Generation
5. Response + Metadata → Active Learning Analysis
6. Final Output → User + Learning System
```

### **Data Transformations:**
```json
// Step 1: Raw Input
"Je veux créer un email pour Microsoft"

// Step 2: Intent Analysis
{
  "intent": "CreateEmail",
  "confidence": 0.92,
  "entities": [
    {"type": "ORGANIZATION", "value": "Microsoft", "start": 32, "end": 41}
  ]
}

// Step 3: Knowledge Analysis
{
  "knowledge_results": [],
  "category_suggestions": ["general"],
  "relevance_score": 0.23
}

// Step 4: Final Output
{
  "response": "🎯 **Parfait ! Créons votre email.**",
  "intent": "CreateEmail",
  "confidence": 0.92,
  "newState": "gathering_info",
  "metadata": {
    "source": "luis_style",
    "entities": [...],
    "active_learning": {
      "needs_feedback": false,
      "uncertainty_level": "low"
    }
  }
}
```

## 📈 Data Quality Metrics

### **Training Data Quality:**
- **Coverage**: 8 intents + 7 knowledge categories
- **Balance**: 65% None intent, 35% positive intents
- **Language Quality**: Native French with technical English terms
- **Domain Specificity**: 100% Microsoft solutions focused

### **Input Data Validation:**
- **Required Fields**: message (string, non-empty)
- **Optional Fields**: conversationState, emailData, conversationHistory
- **Encoding**: UTF-8 for French characters
- **Length Limits**: 2000 characters per message

### **Label Consistency:**
- **Intent Labels**: Standardized naming convention
- **Confidence Scores**: Normalized 0.0-1.0 range
- **Entity Types**: PERSON, ORGANIZATION, TECHNOLOGY, EMAIL, DATETIME
- **Categories**: Fixed set of 7 knowledge categories

## 🚀 Training Data Requirements

### **For Improved Performance:**

**1. Intent Classification:**
- **Minimum**: 20 examples per intent
- **Recommended**: 50+ examples per intent
- **None Intent**: 2-3x more examples than positive intents
- **Validation Set**: 20% of total data

**2. Knowledge Base:**
- **Minimum**: 5 Q&A pairs per category
- **Recommended**: 20+ Q&A pairs per category
- **Alternate Questions**: 3-5 variations per question
- **Answer Quality**: Structured, comprehensive responses

**3. Active Learning:**
- **Uncertain Samples**: Continuous collection
- **Human Labels**: Regular review cycles
- **Correction Data**: All user feedback captured
- **Performance Tracking**: Monthly evaluation

## ✅ Current Data Status

### **Strengths:**
- **Well-structured input/output schemas**
- **Comprehensive None intent training**
- **Domain-specific knowledge base**
- **Active learning data collection**
- **Multi-language support (French/English)**

### **Areas for Improvement:**
- **More training examples** for each intent
- **Expanded knowledge base** coverage
- **Better entity recognition** training data
- **Conversation context** handling
- **Performance validation** datasets

The current input data and labeling system provides a solid foundation for the AI chatbot with room for expansion and improvement as usage grows! 🚀