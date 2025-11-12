"use client";

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, X, Search } from 'lucide-react';

const EmailChatbotFAQ = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  const faqData = [
    {
      id: 'getting-started',
      category: '🚀 Premiers pas',
      questions: [
        {
          q: "Comment créer mon premier email ?",
          a: `C'est très simple ! Suivez ces étapes :
          
1. Dites-moi le type d'email : "Je veux contacter un nouveau prospect"
2. Donnez-moi les informations : "Martin, TIXTO, martin@tixto.com"
3. L'email sera généré automatiquement !

**Exemple complet :** 
"Je veux envoyer un email à Martin de TIXTO (martin@tixto.com) pour présenter nos solutions Azure"`
        },
        {
          q: "Quels types d'emails puis-je créer ?",
          a: `Je peux vous aider avec :

📧 **Prospection** - Contacter de nouveaux clients
📋 **Suivi de réunion** - Synthèse et prochaines étapes  
💰 **Offres commerciales** - Devis et propositions
🔄 **Relances** - Réactiver des prospects silencieux
👋 **Introduction FY25/26** - Présentation équipe Microsoft

Dites simplement "Je veux faire du suivi" ou "Nouveau prospect à contacter"`
        },
        {
          q: "Comment donner les informations du destinataire ?",
          a: `Format recommandé : **"Prénom Nom, Entreprise, email@domaine.com"**

**Exemples corrects :**
✅ "Martin Dubois, Microsoft, martin@microsoft.com"
✅ "Sophie, TechCorp, sophie@techcorp.fr" 
✅ "M. Dupont chez Azure Solutions"

**À éviter :**
❌ Juste un prénom : "Martin"
❌ Sans entreprise : "martin@email.com"`
        }
      ]
    },
    {
      id: 'templates',
      category: '📝 Templates et personnalisation',
      questions: [
        {
          q: "Quels templates sont disponibles ?",
          a: `Voici tous les templates disponibles :

🎯 **Contact froid Azure** - Migration et accompagnement
💼 **Présentation solutions Microsoft** - Gamme complète
🚀 **Proposition accompagnement digital** - Transformation
👋 **Introduction FY25/26** - Nouveau point de contact Microsoft

Chaque template s'adapte automatiquement au nom et à l'entreprise que vous donnez.`
        },
        {
          q: "Comment personnaliser le ton de l'email ?",
          a: `Je propose 4 tons différents :

👔 **Formel** - Pour les executives et grandes entreprises
😊 **Professionnel amical** - Pour les PME (recommandé)
🤙 **Décontracté** - Pour les startups et tech
🚨 **Urgent** - Pour les actions immédiates

Dites "Modifier le ton" après génération ou précisez dès le début : "Email formel pour le CEO de Microsoft"`
        },
        {
          q: "Peut-on modifier un email généré ?",
          a: `Absolument ! Après génération, vous pouvez :

✏️ **Modifier le ton** - "Rendre plus formel"
🔄 **Changer l'approche** - "Plus commercial"
📝 **Ajuster le contenu** - "Ajouter une urgence"
📋 **Copier et éditer** - Bouton "Copier" puis édition manuelle`
        }
      ]
    },
    {
      id: 'troubleshooting',
      category: '🔧 Résolution de problèmes',
      questions: [
        {
          q: "L'assistant ne comprend pas ma demande",
          a: `Quelques astuces pour être mieux compris :

**Soyez spécifique :**
✅ "Je veux envoyer un email de prospection"
❌ "Aide-moi"

**Utilisez les mots-clés :**
- "prospect", "client", "nouveau contact" 
- "suivi", "réunion", "meeting"
- "offre", "devis", "commercial"
- "relance", "pas de réponse"

**Donnez le contexte :**
"Je veux relancer Martin de TIXTO qui n'a pas répondu à ma proposition Azure"`
        },
        {
          q: "Comment recommencer une conversation ?",
          a: `Plusieurs options :

🔄 **Nouveau chat** - Bouton en haut à droite
🎯 **Recommencer** - Dites "créer un autre email"
🏠 **Menu principal** - Cliquez sur les suggestions
🔄 **Reset** - "Je veux recommencer"

La conversation sera réinitialisée et vous pourrez repartir de zéro.`
        },
        {
          q: "L'email généré ne correspond pas à mes attentes",
          a: `Pas de problème ! Voici comment l'améliorer :

**Précisez vos attentes :**
"Rendre plus commercial", "Ton plus professionnel", "Ajouter de l'urgence"

**Demandez des modifications :**
"Modifier l'objet", "Changer l'approche", "Plus court"

**Essayez un autre template :**
Les suggestions vous proposent d'autres options

**Recommencez :**
"Créer un autre email" pour repartir de zéro`
        }
      ]
    },
    {
      id: 'advanced',
      category: '⚡ Fonctionnalités avancées',
      questions: [
        {
          q: "Comment programmer l'envoi d'un email ?",
          a: `Après génération, utilisez le bouton 📅 **Programmer** :

✨ **Intelligence horaire** - Envoi au meilleur moment
📊 **Analyse de performance** - Optimisation automatique
⏰ **Planification flexible** - Date et heure de votre choix

L'assistant analyse les habitudes du destinataire pour maximiser les chances d'ouverture.`
        },
        {
          q: "Peut-on sauvegarder des brouillons ?",
          a: `Oui ! Le système sauvegarde automatiquement :

💾 **Auto-save** - Toutes les 5 secondes
🗃️ **Brouillons** - Bouton en haut à droite
🔄 **Récupération** - Reprendre une conversation
📁 **Historique** - Accès aux conversations précédentes`
        },
        {
          q: "Comment suivre les performances des emails ?",
          a: `Utilisez les analytics intégrés :

📈 **Taux d'ouverture** - Performance par template
📊 **Taux de réponse** - Efficacité des approches  
🎯 **Optimisations** - Suggestions d'amélioration
📅 **Suivi dans le temps** - Évolution des performances

Accessible via le bouton analytics en haut à droite.`
        }
      ]
    }
  ];

  const toggleExpand = (categoryId, questionIndex) => {
    const key = `${categoryId}-${questionIndex}`;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      item => 
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">FAQ - Assistant Email</h2>
              <p className="text-sm text-blue-100">Guide d'utilisation et conseils</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher dans la FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* FAQ Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {filteredFAQ.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun résultat trouvé pour "{searchTerm}"</p>
              <p className="text-sm">Essayez des mots-clés comme "email", "template", ou "prospect"</p>
            </div>
          ) : (
            filteredFAQ.map((category) => (
              <div key={category.id} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.questions.map((item, index) => {
                    const key = `${category.id}-${index}`;
                    const isExpanded = expandedItems[key];
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => toggleExpand(category.id, index)}
                          className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-800">{item.q}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="p-3 pt-0 text-gray-600 text-sm whitespace-pre-line border-t border-gray-100">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-xl">
          <div className="text-center text-sm text-gray-600">
            <p>💡 <strong>Astuce :</strong> Commencez toujours par "Je veux..." suivi de votre objectif</p>
            <p className="mt-1">📧 Pour plus d'aide, dites "aide" dans le chat principal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailChatbotFAQ;