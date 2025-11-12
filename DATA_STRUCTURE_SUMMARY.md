# Input Data & Labels - Quick Reference

## 📥 **Input Data Schema**

### **Primary API Input:**
```json
{
  "message": "Je veux créer un email pour Microsoft",
  "conversationState": "initial",
  "emailData": {
    "purpose": "prospection",
    "recipientName": "Martin Dupont",
    "company": "TechCorp"
  },
  "conversationHistory": [...]
}
```

## 🏷️ **Label Categories**

### **1. Intent Labels (8 Total)**
```
✅ Positive Intents (70 examples):
├── CreateEmail (10 examples)
├── ManageContact (10 examples)
├── ManageTemplate (10 examples)
├── ScheduleFollowUp (10 examples)
├── GetHelp (10 examples)
├── ProvideFeedback (5 examples)
└── Greeting (5 examples)

❌ None Intent (130 examples):
└── Out-of-domain requests
```

### **2. Knowledge Categories (7 Total, 12 Q&A Pairs)**
```
☁️ Azure (3 Q&A) - Migration, pricing, security
📧 Microsoft 365 (2 Q&A) - Features, migration
🤝 Teams (2 Q&A) - Features, comparisons
⚡ Power Platform (1 Q&A) - Overview
💼 Dynamics 365 (1 Q&A) - CRM/ERP
🔐 Security (1 Q&A) - Data protection
❓ General (2 Q&A) - Support, licensing
```

### **3. Entity Types (5 Categories)**
```
👤 PERSON - Martin Dupont, Jean, M. Martin
🏢 ORGANIZATION - Microsoft, TechCorp, Azure Solutions
💻 TECHNOLOGY - Azure, Teams, Office 365, Power BI
📧 EMAIL - martin@company.com, contact@domain.fr
📅 DATETIME - demain, cette semaine, 15h, lundi
```

### **4. Sentiment Labels (4 Types)**
```
😊 positive (0.6-1.0) - excellent, fantastique, parfait
😞 negative (0.6-1.0) - problème, difficile, frustrant
🚨 urgent (0.7-1.0) - urgent, immédiat, critique
😐 neutral (0.4-0.8) - default, no strong indicators
```

### **5. Conversation States (7 States)**
```
🚀 initial - Starting conversation
📋 gathering_info - Collecting email details
👤 gathering_prospect_info - Prospect contact details
✍️ email_generation - Creating email content
👀 review - User reviewing email
❓ help - Providing assistance
📚 knowledge_query - Answering Microsoft questions
```

## 📊 **Training Data Statistics**

### **Current Data Volume:**
- **Total Examples**: 200+ training instances
- **Intent Balance**: 65% None, 35% Positive
- **Language Mix**: French primary, English technical terms
- **Domain Focus**: 100% Microsoft solutions + email creation

### **Data Quality Metrics:**
- **Intent Coverage**: 8 intents across business scenarios
- **Knowledge Coverage**: 7 categories, all major Microsoft products
- **Entity Recognition**: 5 types covering business communication
- **Sentiment Analysis**: 4 levels from negative to urgent
- **Conversation Flow**: 7 states managing full email creation cycle

## 🔄 **Data Flow Examples**

### **Example 1: Email Creation**
```
Input: "Je veux créer un email pour Microsoft"
↓
Intent: CreateEmail (confidence: 0.92)
Entity: ORGANIZATION:Microsoft (start:32, end:41)
↓
State: initial → gathering_info
Response: "🎯 Parfait ! Créons votre email."
```

### **Example 2: Knowledge Query**
```
Input: "Comment migrer vers Azure ?"
↓
Knowledge: azure_migration_001 (confidence: 1.0)
Category: azure
↓
Response: [Detailed Azure migration guide]
```

### **Example 3: Out-of-Domain**
```
Input: "Météo à Paris"
↓
Intent: None (confidence: 0.90)
Detection: OUT_OF_DOMAIN
↓
Response: "🤖 Je suis spécialisé dans l'assistance Microsoft..."
```

## 🎯 **Key Data Insights**

### **✅ Strengths:**
- **Comprehensive None intent** (130 examples) prevents false positives
- **Domain-specific knowledge** covers all major Microsoft products
- **Multi-tier processing** with intent + knowledge + sentiment
- **Active learning** captures uncertain cases for improvement
- **French language support** with technical English integration

### **📈 Improvement Opportunities:**
- **More training examples** per positive intent (currently 10, target: 50+)
- **Expanded knowledge base** (currently 12 Q&A, target: 50+)
- **Better entity coverage** for business communications
- **Conversation context** memory and personalization
- **Multi-language expansion** beyond French/English

### **🚀 Production Readiness:**
- **Current State**: Solid foundation with core functionality
- **Training Data**: Sufficient for MVP, needs expansion for scale
- **Label Quality**: Well-structured and consistent
- **Pipeline Integration**: Fully functional with all components
- **Active Learning**: Captures data for continuous improvement

The input data and labeling system provides a robust foundation for the AI chatbot with clear schemas, comprehensive coverage of the Microsoft solutions domain, and active learning capabilities for continuous improvement! 🎯