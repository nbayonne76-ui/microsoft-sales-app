# 🏗️ Dynamics 365 Finance & Operations — Architecture des Modules

> **Dynamics 365 F&O** désigne les deux applications ERP enterprise de Microsoft : **Dynamics 365 Finance** (gestion financière) et **Dynamics 365 Supply Chain Management** (opérations). Utilisées ensemble ou séparément, elles partagent une base de données unifiée et des données maîtres communes.

---

## 📐 Vue d'ensemble — Les deux applications

| | 💰 Dynamics 365 Finance | ⚙️ Supply Chain Management |
|---|---|---|
| **Focus** | Gestion financière & comptabilité | Opérations & logistique |
| **Cœur métier** | Grand livre, trésorerie, budgets | Stocks, fabrication, achats |
| **Utilisateurs types** | DAF, contrôleur, comptable, trésorier | DSI opérations, responsable logistique, acheteur |
| **Déploiement** | Seul ou combiné avec SCM | Seul ou combiné avec Finance |
| **Implémentation** | 4–12 mois | 6–18 mois |
| **Valeur clé** | Contrôle financier + conformité mondiale | Visibilité supply chain + productivité terrain |

---

## 💰 Modules Dynamics 365 Finance

### 🗂️ Carte des modules Finance

```
┌─────────────────────────────────────────────────────────────────┐
│                    DYNAMICS 365 FINANCE                         │
├──────────────────┬──────────────────┬───────────────────────────┤
│  📊 COMPTABILITÉ │   💵 TRÉSORERIE  │     📋 BUDGETS & ACTIFS   │
│                  │                  │                           │
│  Grand Livre     │  Cash & Bank     │  Budgétisation            │
│  Comptes four.   │  Management      │  Immobilisations          │
│  Comptes clients │                  │  Comptabilité analytique  │
│  Clôture période │  Flux tréso.     │                           │
├──────────────────┴──────────────────┴───────────────────────────┤
│               📁 PROJETS & PERFORMANCE                          │
│          Project Management & Accounting                        │
│    Budgets projets · Coûts · Facturation · Rentabilité          │
└─────────────────────────────────────────────────────────────────┘
```

### 📋 Détail des 8 modules Finance

| # | Module | 🎯 Fonction principale | Exemples de transactions |
|---|---|---|---|
| **1** | 📊 **Grand Livre** | Comptabilité générale, dimensions financières, reporting | Plan de comptes, journaux, clôture de période |
| **2** | 🏦 **Cash & Bank Management** | Comptes bancaires, réconciliations, flux de trésorerie | Rapprochements, dépôts, paiements, positions cash |
| **3** | 📤 **Comptes Fournisseurs** | Factures fournisseurs, propositions de paiement, soldes | Approbations, rapprochement factures, règlements sortants |
| **4** | 📥 **Comptes Clients** | Factures clients, encaissements, crédits, relances | Recouvrement, soldes clients, paiements entrants |
| **5** | 📈 **Budgétisation** | Création budgets, suivi réalisé vs budget, planification | Budget annuel, révisions, alertes d'écart |
| **6** | 🏭 **Immobilisations** | Acquisition, amortissement, cessions, reclassification | Fiches actifs, plans d'amortissement, transferts |
| **7** | 🔬 **Comptabilité Analytique** | Analyse des coûts par centre, département, produit, projet | Allocations, répartitions, tableaux de bord analytiques |
| **8** | 📁 **Gestion de Projet & Comptabilité** | Budgets projets, coûts, facturation, rentabilité | WBS, temps passé, facturation jalons, P&L projet |

---

## ⚙️ Modules Dynamics 365 Supply Chain Management

### 🗂️ Carte des modules SCM

```
┌──────────────────────────────────────────────────────────────────────┐
│               DYNAMICS 365 SUPPLY CHAIN MANAGEMENT                  │
├─────────────────┬──────────────────┬────────────────────────────────┤
│  🏭 PRODUCTION  │   📦 STOCKS      │      🚚 LOGISTIQUE             │
│                 │                  │                                │
│ Production Ctrl │ Inventory Mgmt   │  Transportation Mgmt           │
│ Master Planning │ Product Info Mgmt│  Warehouse Management          │
│                 │ Cost Management  │                                │
├─────────────────┴──────────────────┴────────────────────────────────┤
│    💼 ACHATS & VENTES              │    🔧 ACTIFS & SERVICES         │
│                                   │                                │
│    Procurement & Sourcing         │    Asset Management             │
│    Sales & Marketing (ERP)        │    Service Management           │
│    Cost Accounting                │                                │
└───────────────────────────────────┴────────────────────────────────┘
```

### 📋 Détail des 12 modules SCM

| # | Module | 🎯 Fonction principale | Exemples de transactions |
|---|---|---|---|
| **1** | 📦 **Gestion des Stocks** | Niveaux de stock, mouvements, disponibilités, transactions | Inventaires, transferts, ajustements, localisation |
| **2** | 📊 **Master Planning** | Prévisions, MRP, planification production et approvisionnement | Plans directeurs, calcul besoins, proposition de commandes |
| **3** | 🛒 **Achats & Sourcing** | Fournisseurs, appels d'offres, commandes achat, collaboration | Demandes d'achat, contrats, réception, facture matching |
| **4** | 📁 **Product Information Mgmt** | Référentiels articles, nomenclatures, variantes, attributs | Fiches articles, gammes, BOM, produits lancés |
| **5** | 🏭 **Production Control** | Ordres de fabrication, planification, atelier, WIP | OF, jalonnement, pointage, rapports production |
| **6** | 🏢 **Warehouse Management** | Réception, rangement, prélèvement, expédition, inventaire | Vagues, travail entrepôt, cycle count, slotting |
| **7** | 💰 **Cost Accounting** | Analyse coûts par centre, département, produit, process | Centres coûts, clés de répartition, rapports analytiques |
| **8** | 🔢 **Cost Management** | Coût des stocks, calcul coûts, COGS, coûts production | Évaluation stocks, calcul prix de revient, variances |
| **9** | 🚚 **Transportation Management** | Planification expéditions, sélection transporteur, coûts fret | Itinéraires, appels d'offres fret, exécution transport |
| **10** | 🔧 **Asset Management** | Plans de maintenance, ordres de travail, historique, cycle vie | Actifs techniques, maintenance préventive/corrective, OEE |
| **11** | 🛠️ **Service Management** | Accords de service, ordres de service, réparations | Contrats SLA, interventions, gestion des réparations |
| **12** | 📈 **Sales & Marketing (ERP)** | Commandes ventes, devis, clients, prix, opérations ERP | Commandes, prix, remises, livraisons depuis l'ERP |

---

## 🔄 Flux de données — Comment les modules se connectent

### Flux Procure-to-Pay (Achats → Paiements)

```
Demande d'achat   →   Commande achat   →   Réception marchandises
      ↓                                              ↓
 Approbation                              Mise à jour stocks
                                                     ↓
                                        Rapprochement facture
                                                     ↓
                                        Proposition de paiement
                                                     ↓
                                         Règlement fournisseur
```

### Flux Order-to-Cash (Ventes → Encaissement)

```
Commande client   →   Besoin en stock   →   Opérations entrepôt
      ↓                                              ↓
 Confirmation                              Prélèvement / Expédition
                                                     ↓
                                           Facturation client
                                                     ↓
                                           Encaissement
                                                     ↓
                                        Reporting financier
```

### Flux Production-to-Cost (Fabrication → Coûts)

```
Plan directeur   →   Ordre de fabrication   →   Consommation matières
      ↓                                                   ↓
 Prévisions                                    Main d'œuvre + charges
                                                          ↓
                                              Mise à jour stocks PF
                                                          ↓
                                            Calcul coût de revient
                                                          ↓
                                            COGS + Résultat brut
```

---

## 🏭 Patterns d'implémentation par industrie

| 🏢 Type d'organisation | ✅ Modules essentiels | ➕ Modules optionnels |
|---|---|---|
| **Finance centrale** | Grand Livre · Comptes Fournisseurs · Comptes Clients · Cash & Bank · Budgets · Immobilisations | Comptabilité analytique · Gestion de projet |
| **Industrie manufacturière** | Production Control · Master Planning · Gestion stocks · Entrepôt · Achats · Cost Management | Finance complète · Transport · Asset Management |
| **Distribution / Négoce** | Gestion stocks · Entrepôt · Transport · Sales & Marketing · Achats · Sourcing | Finance · Service Management · Master Planning |
| **Services professionnels** | Gestion de projet & Comptabilité · Grand Livre · Comptes Clients · Budgets | Achats · Comptes Fournisseurs · CRM Sales |
| **Maintenance d'actifs** | Asset Management · Gestion stocks · Achats · Cost Management | Production · Finance · Entrepôt |
| **Multinationales** | Grand Livre · Cash & Bank · Comptes Fournisseurs · Clients · Immobilisations · Reporting électronique | Tous modules selon secteur |

---

## 📊 Données maîtres partagées entre Finance et SCM

Ces données sont communes aux deux applications et créent la **source unique de vérité** :

| 🗂️ Donnée maître | 💰 Utilisée par Finance | ⚙️ Utilisée par SCM |
|---|---|---|
| **Plan de comptes** | ✅ Grand Livre | ✅ Cost Management |
| **Fournisseurs** | ✅ Comptes Fournisseurs | ✅ Achats & Sourcing |
| **Clients** | ✅ Comptes Clients | ✅ Sales & Marketing |
| **Articles / Produits** | ✅ Immobilisations | ✅ Product Info Mgmt, Stocks |
| **Dimensions financières** | ✅ Tous modules Finance | ✅ Cost Accounting |
| **Devises & taux de change** | ✅ Multi-currency | ✅ Achats, Ventes |
| **Entités légales** | ✅ Consolidation | ✅ Stocks interco |
| **Centres de coûts** | ✅ Analytique | ✅ Cost Accounting |

> 💡 **Avantage clé** : Contrairement à des systèmes séparés, D365 F&O permet à toutes les équipes (finance, achats, logistique, production) de travailler sur les mêmes données en temps réel — sans réconciliation manuelle.

---

## 🏆 Résultats clients documentés

### 🖼️ Museum of Fine Arts, Houston
> *"Passage d'un système financier papier à D365 Finance"*

| Indicateur | Résultat |
|---|---|
| Cycle de clôture mensuelle | **−50%** de temps |
| Approbations commandes d'achat | **Automatisées** |
| Reporting financier | **Temps réel** vs Excel manuel |

---

### 🛢️ Conquest Completion Services
> *"Migration depuis QuickBooks + Excel vers D365 F&O"*

| Indicateur | Résultat |
|---|---|
| Délai d'approbation des bons de commande | **÷3** (3x plus rapide) |
| Days Sales Outstanding (DSO) | **−85%** |
| Visibilité financière | **Temps réel** |

---

## 🎯 Arguments de vente F&O pour Account Managers

### Vs SAP S/4HANA
| Critère | Dynamics 365 F&O | SAP S/4HANA |
|---|---|---|
| Durée implémentation | 6–12 mois | 12–24 mois |
| TCO 5 ans (500 users) | $7,7M–$8,7M | $7,5M–$10M |
| Intégration native | M365 + Teams + Copilot | SAP Fiori (séparé) |
| IA intégrée | Copilot + agents autonomes | SAP Joule (séparé) |

### Vs Oracle ERP Cloud
| Critère | Dynamics 365 F&O | Oracle Cloud ERP |
|---|---|---|
| Licensing | $210–$240/user/mois | $150–$300/user/mois |
| Intégration M365 | ✅ Native | ❌ Tierce partie |
| Attach licensing | ✅ $30 pour 2ème app | ❌ Non disponible |
| Agent IA autonomes | ✅ 5+ agents GA | 🔄 En cours |

### Questions clés à poser au prospect
1. **"Combien de temps prend votre clôture mensuelle ?"** → D365 Finance peut le réduire de 50%
2. **"Vos équipes travaillent-elles encore sur Excel pour consolider les données ?"** → Source unique de vérité
3. **"Avez-vous de la visibilité temps réel sur vos stocks dans toutes vos entités ?"** → Gestion stocks en temps réel
4. **"Combien de systèmes différents votre DAF utilise-t-il pour rapporter ?"** → Consolidation dans D365 Finance

---

## 📐 Périmètre d'implémentation : Ce que ça engage

> ⚠️ **Important pour la gestion des attentes client** : Le choix des modules impacte directement le projet.

| Facteur | Impact des modules sélectionnés |
|---|---|
| **Périmètre implémentation** | Chaque module = configuration, tests, data migration |
| **Données maîtres partagées** | Fournisseurs, articles, clients : définir UNE FOIS |
| **Intégrations** | Connexions tierces (paie, e-commerce, WMS) à identifier |
| **Rôles de sécurité** | 1 rôle par profil utilisateur par module |
| **Tests utilisateurs** | Scénarios de test par module et par flux |
| **Formation** | Plan de formation adapté à chaque groupe |

**Recommandation** : Commencer par les modules Finance + un module SCM, puis étendre par phases.
