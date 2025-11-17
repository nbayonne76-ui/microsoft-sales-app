import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { enrichLeadWithGovernmentData } from '@/lib/enrichment-engine-v2';
import { withRateLimit } from '@/lib/with-rate-limit';
import { enrichmentRateLimiter } from '@/lib/rate-limit';

/**
 * API d'enrichissement automatique de leads avec recherche web
 * Enrichit les informations d'un lead en recherchant sur internet
 *
 * Méthodologie en 6 phases:
 * 1. Analyse de la requête
 * 2. Recherche API gouvernementale
 * 3. Recherche web contextuelle
 * 4. Recherche données légales ciblées
 * 5. Validation croisée
 * 6. Scoring de confiance
 */

// POST /api/enrich-lead - Enrichir un lead automatiquement
async function handlePOST(request) {
  let requestBody;
  try {
    requestBody = await request.json();
    const { leadId, companyName, forceRefresh = false, forceUpdate = false } = requestBody;

    if (!leadId && !companyName) {
      return NextResponse.json(
        { error: 'leadId ou companyName requis' },
        { status: 400 }
      );
    }

    console.log('🔍 Démarrage enrichissement pour:', leadId || companyName);

    // 1. Récupérer le lead si ID fourni
    let lead = null;
    if (leadId) {
      lead = await prisma.hotLead.findUnique({
        where: { id: leadId },
        include: {
          managers: true,
          services: true,
          specialties: true
        }
      });

      if (!lead) {
        return NextResponse.json(
          { error: 'Lead introuvable' },
          { status: 404 }
        );
      }

      // Vérifier si déjà enrichi
      if (lead.enrichmentStatus === 'enriched' && !forceRefresh) {
        return NextResponse.json({
          success: true,
          message: 'Lead déjà enrichi',
          lead,
          alreadyEnriched: true
        });
      }
    }

    const targetCompany = lead?.companyName || companyName;

    // 2. Enrichissement professionnel avec moteur avancé V2
    console.log('🌐 Enrichissement professionnel V2 pour:', targetCompany);
    const enrichmentResult = await enrichLeadWithGovernmentData({
      companyName: targetCompany
    });

    console.log('📊 Résultat enrichissement V2:', {
      success: enrichmentResult.success,
      confidence: enrichmentResult.confidence,
      sources: enrichmentResult.sources?.length || 0
    });

    if (!enrichmentResult.success || !enrichmentResult.enrichedData) {
      throw new Error('Échec de l\'enrichissement - aucune donnée trouvée');
    }

    // Les données sont déjà au bon format depuis enrichLeadWithGovernmentData
    const webData = enrichmentResult.enrichedData;

    console.log('🔄 Données converties:', {
      siret: webData.siret,
      nafCode: webData.nafCode,
      address: webData.address,
      legalForm: webData.legalForm,
      employeeCount: webData.employeeCount
    });

    // 3. Créer ou mettre à jour le lead enrichi
    let enrichedLead;

    if (lead) {
      // Mise à jour du lead existant
      // Si forceUpdate=true, on écrase les données existantes
      // Sinon, on garde les valeurs existantes (comportement par défaut)
      enrichedLead = await prisma.hotLead.update({
        where: { id: leadId },
        data: {
          // Mise à jour infos générales
          description: forceUpdate ? (webData.description || lead.description) : (lead.description || webData.description),
          address: forceUpdate ? (webData.address || lead.address) : (lead.address || webData.address),
          phone: forceUpdate ? (webData.phone || lead.phone) : (lead.phone || webData.phone),
          email: forceUpdate ? (webData.email || lead.email) : (lead.email || webData.email),
          website: forceUpdate ? (webData.website || lead.website) : (lead.website || webData.website),
          employeeCount: forceUpdate ? (webData.employeeCount || lead.employeeCount) : (lead.employeeCount || webData.employeeCount),

          // Mise à jour infos légales
          legalForm: forceUpdate ? (webData.legalForm || lead.legalForm) : (lead.legalForm || webData.legalForm),
          siret: forceUpdate ? (webData.siret || lead.siret) : (lead.siret || webData.siret),
          nafCode: forceUpdate ? (webData.nafCode || lead.nafCode) : (lead.nafCode || webData.nafCode),
          turnover: forceUpdate ? (webData.turnover || lead.turnover) : (lead.turnover || webData.turnover),

          // Statut enrichissement
          enrichmentStatus: 'enriched',
          enrichedAt: new Date(),
          enrichmentSource: 'web_search',

          // Ajouter nouveaux managers trouvés (seulement si données existent)
          ...(webData.managers && webData.managers.length > 0 && {
            managers: {
              create: webData.managers
                .filter(m => !lead.managers.some(existing => existing.name === m.name))
                .map(m => ({
                  name: m.name,
                  role: m.role,
                  email: m.email,
                  phone: m.phone
                }))
            }
          }),

          // Ajouter nouveaux services trouvés (seulement si données existent)
          ...(webData.services && webData.services.length > 0 && {
            services: {
              create: webData.services
                .filter(s => !lead.services.some(existing => existing.name === s.name))
                .map(s => ({
                  name: s.name,
                  description: s.description
                }))
            }
          }),

          // Ajouter spécialités trouvées (seulement si données existent)
          ...(webData.specialties && webData.specialties.length > 0 && {
            specialties: {
              create: webData.specialties
                .filter(s => !lead.specialties.some(existing => existing.name === s.name))
                .map(s => ({
                  name: s.name,
                  domain: s.domain
                }))
            }
          })
        },
        include: {
          managers: true,
          teamMembers: true,
          services: true,
          specialties: true,
          solutions: true
        }
      });

      console.log('✅ Lead enrichi avec succès:', enrichedLead.companyName);
    } else {
      // Création d'un nouveau lead avec données enrichies
      enrichedLead = await prisma.hotLead.create({
        data: {
          companyName: targetCompany,
          description: webData.description,
          address: webData.address,
          phone: webData.phone,
          email: webData.email,
          website: webData.website,
          employeeCount: webData.employeeCount,
          legalForm: webData.legalForm,
          siret: webData.siret,
          nafCode: webData.nafCode,
          turnover: webData.turnover,

          source: 'enrichment',
          enrichmentStatus: 'enriched',
          enrichedAt: new Date(),
          enrichmentSource: 'web_search',

          managers: {
            create: webData.managers
          },
          services: {
            create: webData.services
          },
          specialties: {
            create: webData.specialties
          }
        },
        include: {
          managers: true,
          services: true,
          specialties: true
        }
      });

      console.log('✅ Nouveau lead créé et enrichi:', enrichedLead.companyName);
    }

    return NextResponse.json({
      success: true,
      lead: enrichedLead,
      enrichment: {
        fieldsEnriched: calculateEnrichedFields(webData),
        source: 'web_search',
        confidence: webData.confidence,
        enrichedAt: new Date()
      },
      message: 'Lead enrichi avec succès'
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Erreur enrichissement:', error);

    // Marquer l'enrichissement comme échoué si lead existe
    const leadId = requestBody?.leadId;
    if (leadId) {
      try {
        await prisma.hotLead.update({
          where: { id: leadId },
          data: {
            enrichmentStatus: 'failed'
          }
        });
      } catch (updateError) {
        console.error('❌ Erreur mise à jour statut:', updateError);
      }
    }

    return NextResponse.json(
      {
        error: 'Erreur lors de l\'enrichissement',
        details: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * Note: convertEnrichmentData is no longer needed
 * enrichLeadWithGovernmentData() returns data already formatted for the database
 */

/**
 * [LEGACY] Enrichir les données depuis le web
 * Remplacé par le nouveau moteur enrichCompany()
 */
async function enrichFromWeb_LEGACY(companyName) {
  console.log('🔍 Enrichissement web RÉEL pour:', companyName);

  const enrichedData = {
    description: null,
    address: null,
    phone: null,
    email: null,
    website: null,
    employeeCount: null,
    legalForm: null,
    siret: null,
    nafCode: null,
    turnover: null,
    managers: [],
    services: [],
    specialties: [],
    confidence: 0
  };

  try {
    console.log('📊 Étape 1/3: Recherche API SIRET gouvernementale...');
    // 1. RECHERCHE API SIRET GOUVERNEMENTALE (DONNÉES OFFICIELLES)
    const siretData = await searchSIRETReal(companyName);
    if (siretData) {
      Object.assign(enrichedData, siretData);
      console.log('✅ Données SIRET trouvées:', siretData.siret);
    }

    console.log('🔍 Étape 2/3: Recherche web générale...');
    // 2. RECHERCHE WEB GÉNÉRALE
    const webSearchData = await searchWebReal(companyName);
    if (webSearchData) {
      // Merger les données (ne pas écraser les données SIRET officielles)
      enrichedData.description = enrichedData.description || webSearchData.description;
      enrichedData.website = enrichedData.website || webSearchData.website;
      enrichedData.services = [...enrichedData.services, ...webSearchData.services];
      console.log('✅ Données web trouvées');
    }

    console.log('👔 Étape 3/3: Recherche dirigeants...');
    // 3. RECHERCHE DIRIGEANTS
    const managersData = await searchManagersReal(companyName, enrichedData.website);
    if (managersData && managersData.length > 0) {
      enrichedData.managers = managersData;
      console.log(`✅ ${managersData.length} dirigeant(s) trouvé(s)`);
    }

    // 4. Analyser secteur et ajouter spécialités
    const specialties = inferSpecialties(companyName, enrichedData);
    enrichedData.specialties.push(...specialties);

    enrichedData.confidence = calculateConfidence(enrichedData);
    console.log(`📊 Score de confiance: ${(enrichedData.confidence * 100).toFixed(0)}%`);

  } catch (error) {
    console.error('⚠️ Erreur enrichissement web:', error);
  }

  return enrichedData;
}

/**
 * Recherche SIRET via API gouvernementale RÉELLE
 * Utilise l'API officielle data.gouv.fr (pappers.fr comme alternative)
 */
async function searchSIRETReal(companyName) {
  try {
    console.log(`🏢 Recherche SIRET pour: "${companyName}"`);

    // API data.gouv.fr - Recherche entreprises françaises
    const searchUrl = `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(companyName)}&per_page=1`;

    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.log('⚠️ API SIRET indisponible');
      return null;
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      console.log('❌ Aucune entreprise trouvée dans API SIRET');
      return null;
    }

    const company = data.results[0];
    console.log('✅ Entreprise trouvée:', company.nom_complet || company.nom_raison_sociale);

    return {
      siret: company.siege?.siret || null,
      nafCode: company.activite_principale || null,
      legalForm: company.nature_juridique || null,
      address: company.siege?.adresse || null,
      employeeCount: company.tranche_effectif_salarie ? parseEffectif(company.tranche_effectif_salarie) : null,
      description: company.activite_principale ? `Activité: ${company.activite_principale}` : null,
      turnover: null, // Pas disponible dans API publique
      creationDate: company.date_creation || null
    };

  } catch (error) {
    console.error('⚠️ Erreur recherche SIRET:', error.message);
    return null;
  }
}

/**
 * Parser tranche effectif en nombre
 */
function parseEffectif(tranche) {
  const tranches = {
    '00': 0,
    '01': 1,
    '02': 3,
    '03': 5,
    '11': 10,
    '12': 20,
    '21': 50,
    '22': 100,
    '31': 200,
    '32': 250,
    '41': 500,
    '42': 1000,
    '51': 2000,
    '52': 5000,
    '53': 10000
  };
  return tranches[tranche] || null;
}

/**
 * Recherche web générale (description, site web, services)
 */
async function searchWebReal(companyName) {
  try {
    console.log(`🌐 Recherche web pour: "${companyName}"`);

    // Rechercher sur Google via scraping éthique ou API
    // Pour l'instant, on va essayer de trouver le site web et description

    const searchQuery = `${companyName} France entreprise site officiel`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

    // Note: Google bloque le scraping direct, il faut utiliser l'API Custom Search
    // ou un service tiers. Pour MVP, on retourne structure vide

    return {
      website: null,
      description: null,
      services: []
    };

  } catch (error) {
    console.error('⚠️ Erreur recherche web:', error.message);
    return {
      website: null,
      description: null,
      services: []
    };
  }
}

/**
 * Recherche dirigeants (societe.com, LinkedIn, etc.)
 */
async function searchManagersReal(companyName, website) {
  try {
    console.log(`👔 Recherche dirigeants pour: "${companyName}"`);

    // Option 1: Via API pappers.fr (payant mais complet)
    // Option 2: Via scraping societe.com (limite de rate)
    // Option 3: Via LinkedIn API (nécessite accès payant)

    // Pour MVP, retourner structure vide
    // En production, implémenter l'une des options ci-dessus

    return [];

  } catch (error) {
    console.error('⚠️ Erreur recherche dirigeants:', error.message);
    return [];
  }
}

/**
 * Inférer spécialités basé sur le nom et données
 */
function inferSpecialties(companyName, data) {
  const specialties = [];
  const nameLower = companyName.toLowerCase();

  // Détecter secteurs courants
  const sectorKeywords = {
    'tech': { name: 'Technologies', domain: 'IT' },
    'conseil': { name: 'Conseil', domain: 'Services' },
    'santé': { name: 'Santé', domain: 'Healthcare' },
    'finance': { name: 'Finance', domain: 'Financial Services' },
    'industrie': { name: 'Industrie', domain: 'Manufacturing' },
    'environnement': { name: 'Environnement', domain: 'Environment' },
    'bureau d\'études': { name: 'Bureau d\'études', domain: 'Engineering' }
  };

  Object.entries(sectorKeywords).forEach(([keyword, specialty]) => {
    if (nameLower.includes(keyword)) {
      specialties.push(specialty);
    }
  });

  return specialties;
}

/**
 * Calculer score de confiance de l'enrichissement
 */
function calculateConfidence(data) {
  let score = 0;
  const weights = {
    siret: 0.3,
    website: 0.2,
    address: 0.15,
    phone: 0.1,
    managers: 0.15,
    description: 0.1
  };

  if (data.siret) score += weights.siret;
  if (data.website) score += weights.website;
  if (data.address) score += weights.address;
  if (data.phone) score += weights.phone;
  if (data.managers && data.managers.length > 0) score += weights.managers;
  if (data.description) score += weights.description;

  return Math.min(score, 1.0);
}

/**
 * Calculer quels champs ont été enrichis
 */
function calculateEnrichedFields(webData) {
  const fields = [];

  if (webData.description) fields.push('description');
  if (webData.website) fields.push('website');
  if (webData.address) fields.push('address');
  if (webData.phone) fields.push('phone');
  if (webData.siret) fields.push('siret');
  if (webData.legalForm) fields.push('legalForm');
  if (webData.managers && webData.managers.length > 0) fields.push('managers');
  if (webData.services && webData.services.length > 0) fields.push('services');
  if (webData.specialties && webData.specialties.length > 0) fields.push('specialties');

  return fields;
}

// GET /api/enrich-lead?company=CompanyName - Prévisualiser enrichissement
async function handleGET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyName = searchParams.get('company');

    if (!companyName) {
      return NextResponse.json(
        { error: 'Paramètre company requis' },
        { status: 400 }
      );
    }

    console.log('🔍 Prévisualisation enrichissement V2 pour:', companyName);

    // Rechercher données sans sauvegarder
    const enrichmentResult = await enrichLeadWithGovernmentData({
      companyName
    });

    return NextResponse.json({
      success: enrichmentResult.success,
      preview: true,
      companyName,
      enrichedData: enrichmentResult.enrichedData,
      fieldsFound: calculateEnrichedFields(enrichmentResult.enrichedData || {}),
      confidence: enrichmentResult.confidence,
      sources: enrichmentResult.sources
    });

  } catch (error) {
    console.error('❌ Erreur prévisualisation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la prévisualisation', details: error.message },
      { status: 500 }
    );
  }
}

// Export with rate limiting - 10 requests per minute for enrichment
export const POST = withRateLimit(handlePOST, enrichmentRateLimiter)
export const GET = withRateLimit(handleGET, enrichmentRateLimiter)
