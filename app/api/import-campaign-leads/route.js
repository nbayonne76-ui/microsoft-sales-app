import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { enqueueEnrichment } from '@/lib/queue';

/**
 * API pour importer des leads de campagne vers Hot Leads
 * Avec enrichissement automatique
 */

// POST /api/import-campaign-leads - Importer et enrichir des leads de campagne
export async function POST(request) {
  try {
    const { leads, campaignName, autoEnrich = true } = await request.json();

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json(
        { error: 'Liste de leads requise' },
        { status: 400 }
      );
    }

    console.log(`📥 Import de ${leads.length} leads depuis campagne: ${campaignName}`);

    const results = {
      total: leads.length,
      created: 0,
      enriched: 0,
      linked: 0,
      errors: []
    };

    for (const leadData of leads) {
      try {
        const {
          entreprise,
          email,
          telephone,
          distributeur,
          statut,
          priorite,
          action
        } = leadData;

        // Validation basique
        if (!entreprise || entreprise.trim() === '') {
          console.log(`⚠️ Lead sans nom d'entreprise, ignoré`);
          continue;
        }

        // Vérifier si le lead existe déjà
        const existingLead = await prisma.hotLead.findFirst({
          where: {
            companyName: entreprise
          }
        });

        if (existingLead) {
          console.log(`⚠️ Lead déjà existant: ${entreprise}`);
          continue;
        }

        // 1. Chercher ou créer le Client (pour historique emails)
        let client = null;
        if (email && email.trim() !== '') {
          try {
            client = await prisma.client.upsert({
              where: { contactEmail: email },
              update: {
                company: entreprise,
                priority: mapPriority(priorite),
                status: mapStatus(statut)
              },
              create: {
                company: entreprise,
                contactEmail: email,
                segment: 'sme', // Par défaut
                priority: mapPriority(priorite),
                status: mapStatus(statut)
              }
            });
          } catch (clientError) {
            console.error(`⚠️ Erreur création client pour ${entreprise}:`, clientError.message);
            // Continuer sans client
          }
        }

        // 2. Créer le Hot Lead
        const hotLead = await prisma.hotLead.create({
          data: {
            companyName: entreprise,
            email: email,
            phone: telephone,
            priority: priorite || 'MOYENNE',
            status: 'active',
            source: 'campaign',
            campaignName: campaignName || 'Import',
            enrichmentStatus: autoEnrich ? 'pending' : 'manual',

            // Lier au client
            clientId: client?.id,

            // Créer action initiale si fournie
            actions: action ? {
              create: {
                action: action,
                priority: priorite || 'MOYENNE',
                status: 'pending',
                assignedTo: 'Nicolas BAYONNE'
              }
            } : undefined
          },
          include: {
            actions: true,
            client: true
          }
        });

        results.created++;
        if (client) results.linked++;

        console.log(`✅ Lead créé: ${entreprise}`);

        // 3. Enrichir automatiquement en arrière-plan si demandé
        if (autoEnrich) {
          try {
            await enqueueEnrichment({
              id: hotLead.id,
              companyName: entreprise
            });
            results.enriched++;
            console.log(`🌐 Lead enrichment queued: ${entreprise}`);
          } catch (enrichError) {
            console.error(`⚠️ Erreur queue enrichissement ${entreprise}:`, enrichError.message);
            // Ne pas bloquer l'import si enrichissement échoue
          }
        }

      } catch (leadError) {
        console.error(`❌ Erreur import lead:`, leadError);
        results.errors.push({
          lead: leadData.entreprise,
          error: leadError.message
        });
      }
    }

    console.log(`✅ Import terminé:`, results);

    return NextResponse.json({
      success: true,
      results,
      message: `${results.created} leads importés, ${results.enriched} enrichis, ${results.linked} liés`
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Erreur import campagne:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'import', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Note: Old enrichLead function removed
 * Now using enqueueEnrichment() from queue system for async background processing
 */

/**
 * Mapper priorité campagne vers priorité système
 */
function mapPriority(priorite) {
  const mapping = {
    'HAUTE': 'high',
    'MOYENNE': 'medium',
    'BASSE': 'low',
    'À DÉFINIR': 'medium'
  };
  return mapping[priorite] || 'medium';
}

/**
 * Mapper statut campagne vers statut système
 */
function mapStatus(statut) {
  if (!statut) return 'active';

  const lower = statut.toLowerCase();
  if (lower.includes('qualifié') || lower.includes('intéressé')) return 'active';
  if (lower.includes('converti') || lower.includes('client')) return 'converted';
  if (lower.includes('inactif') || lower.includes('perdu')) return 'inactive';

  return 'active';
}

// GET /api/import-campaign-leads - Obtenir statistiques d'import
export async function GET(request) {
  try {
    const stats = await prisma.hotLead.groupBy({
      by: ['source', 'campaignName'],
      where: {
        source: 'campaign'
      },
      _count: true
    });

    const enrichmentStats = await prisma.hotLead.groupBy({
      by: ['enrichmentStatus'],
      _count: true
    });

    return NextResponse.json({
      success: true,
      imports: stats,
      enrichment: enrichmentStats
    });

  } catch (error) {
    console.error('❌ Erreur stats:', error);
    return NextResponse.json(
      { error: 'Erreur récupération stats', details: error.message },
      { status: 500 }
    );
  }
}
