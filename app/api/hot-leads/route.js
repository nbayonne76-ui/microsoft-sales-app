import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { withRateLimit } from '@/lib/with-rate-limit';
import { apiRateLimiter, writeRateLimiter } from '@/lib/rate-limit';

// GET - Récupérer tous les hot leads ou un lead spécifique
async function handleGET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');

    if (leadId) {
      // Récupérer un lead spécifique avec toutes ses relations
      const lead = await prisma.hotLead.findUnique({
        where: { id: leadId },
        include: {
          managers: true,
          teamMembers: true,
          services: true,
          specialties: true,
          solutions: true,
          interactions: {
            orderBy: { createdAt: 'desc' }
          },
          actions: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!lead) {
        return NextResponse.json(
          { error: 'Lead introuvable' },
          { status: 404 }
        );
      }

      return NextResponse.json({ lead });
    } else {
      // ✅ Pagination parameters
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const skip = (page - 1) * limit;

      // ✅ Optional filters
      const status = searchParams.get('status'); // active, inactive
      const priority = searchParams.get('priority'); // HAUTE, MOYENNE, BASSE
      const search = searchParams.get('search'); // Company name search
      const enrichmentStatus = searchParams.get('enrichmentStatus'); // enriched, pending, failed

      // ✅ Build where clause
      const where = {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(enrichmentStatus && { enrichmentStatus }),
        ...(search && {
          companyName: {
            contains: search,
            mode: 'insensitive'
          }
        })
      };

      // ✅ Parallel queries for performance - count and fetch simultaneously
      const [leads, total] = await Promise.all([
        prisma.hotLead.findMany({
          where,
          skip,
          take: limit,
          select: {
            // Only select fields needed for list view
            id: true,
            companyName: true,
            description: true,
            priority: true,
            status: true,
            employeeCount: true,
            enrichmentStatus: true,
            isOpportunity: true,
            address: true,
            phone: true,
            email: true,
            website: true,
            createdAt: true,
            updatedAt: true,
            // Only get first 2 managers with limited fields
            managers: {
              select: {
                id: true,
                name: true,
                role: true,
                email: true
              },
              take: 2
            },
            // Count relations instead of loading all
            _count: {
              select: {
                interactions: true,
                actions: true,
                solutions: true,
                managers: true,
                services: true
              }
            }
          },
          orderBy: { updatedAt: 'desc' }
        }),
        prisma.hotLead.count({ where })
      ]);

      return NextResponse.json({
        leads,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + limit < total,
          showing: leads.length
        }
      });
    }
  } catch (error) {
    console.error('❌ Erreur GET /api/hot-leads:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des leads', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau hot lead
async function handlePOST(request) {
  try {
    const data = await request.json();

    const {
      // Informations générales
      companyName,
      description,
      address,
      phone,
      email,
      website,
      employeeCount,

      // Informations légales et financières
      legalForm,
      capitalSocial,
      siret,
      tvaNumber,
      nafCode,
      creationDate,
      closingDate,
      turnover,

      // Statut
      isOpportunity,
      priority,
      status,

      // Relations
      managers = [],
      teamMembers = [],
      services = [],
      specialties = [],
      solutions = [],
      interactions = [],
      actions = []
    } = data;

    // Validation
    if (!companyName) {
      return NextResponse.json(
        { error: 'Le nom de l\'entreprise est requis' },
        { status: 400 }
      );
    }

    // Créer le lead avec toutes ses relations
    const lead = await prisma.hotLead.create({
      data: {
        companyName,
        description,
        address,
        phone,
        email,
        website,
        employeeCount: employeeCount ? parseInt(employeeCount) : null,
        legalForm,
        capitalSocial,
        siret,
        tvaNumber,
        nafCode,
        creationDate,
        closingDate,
        turnover,
        isOpportunity: isOpportunity || false,
        priority: priority || 'MOYENNE',
        status: status || 'active',

        // Créer les relations
        managers: {
          create: managers.map(m => ({
            name: m.name,
            role: m.role,
            email: m.email,
            phone: m.phone
          }))
        },
        teamMembers: {
          create: teamMembers.map(t => ({
            name: t.name,
            role: t.role,
            expertise: t.expertise
          }))
        },
        services: {
          create: services.map(s => ({
            name: s.name,
            description: s.description
          }))
        },
        specialties: {
          create: specialties.map(s => ({
            name: s.name,
            domain: s.domain
          }))
        },
        solutions: {
          create: solutions.map(s => ({
            name: s.name,
            priority: s.priority,
            price: s.price,
            benefits: s.benefits || [],
            useCases: s.useCases || [],
            implementation: s.implementation
          }))
        },
        interactions: {
          create: interactions.map(i => ({
            date: i.date,
            type: i.type,
            title: i.title,
            notes: i.notes,
            participants: i.participants
          }))
        },
        actions: {
          create: actions.map(a => ({
            action: a.action,
            priority: a.priority,
            deadline: a.deadline,
            status: a.status || 'pending',
            assignedTo: a.assignedTo
          }))
        }
      },
      include: {
        managers: true,
        teamMembers: true,
        services: true,
        specialties: true,
        solutions: true,
        interactions: true,
        actions: true
      }
    });

    console.log('✅ Hot lead créé:', companyName);

    return NextResponse.json({
      success: true,
      lead,
      message: 'Lead créé avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Erreur POST /api/hot-leads:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du lead', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un hot lead
async function handlePUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'ID du lead requis' },
        { status: 400 }
      );
    }

    // Vérifier que le lead existe
    const existingLead = await prisma.hotLead.findUnique({
      where: { id }
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead introuvable' },
        { status: 404 }
      );
    }

    // Mettre à jour uniquement les champs fournis
    const lead = await prisma.hotLead.update({
      where: { id },
      data: {
        ...(updateData.companyName && { companyName: updateData.companyName }),
        ...(updateData.description && { description: updateData.description }),
        ...(updateData.address && { address: updateData.address }),
        ...(updateData.phone && { phone: updateData.phone }),
        ...(updateData.email && { email: updateData.email }),
        ...(updateData.website && { website: updateData.website }),
        ...(updateData.employeeCount && { employeeCount: parseInt(updateData.employeeCount) }),
        ...(updateData.legalForm && { legalForm: updateData.legalForm }),
        ...(updateData.capitalSocial && { capitalSocial: updateData.capitalSocial }),
        ...(updateData.siret && { siret: updateData.siret }),
        ...(updateData.tvaNumber && { tvaNumber: updateData.tvaNumber }),
        ...(updateData.nafCode && { nafCode: updateData.nafCode }),
        ...(updateData.creationDate && { creationDate: updateData.creationDate }),
        ...(updateData.closingDate && { closingDate: updateData.closingDate }),
        ...(updateData.turnover && { turnover: updateData.turnover }),
        ...(updateData.isOpportunity !== undefined && { isOpportunity: updateData.isOpportunity }),
        ...(updateData.priority && { priority: updateData.priority }),
        ...(updateData.status && { status: updateData.status })
      },
      include: {
        managers: true,
        teamMembers: true,
        services: true,
        specialties: true,
        solutions: true,
        interactions: true,
        actions: true
      }
    });

    console.log('✅ Hot lead mis à jour:', lead.companyName);

    return NextResponse.json({
      success: true,
      lead,
      message: 'Lead mis à jour avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur PUT /api/hot-leads:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du lead', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un hot lead
async function handleDELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');

    if (!leadId) {
      return NextResponse.json(
        { error: 'ID du lead requis' },
        { status: 400 }
      );
    }

    await prisma.hotLead.delete({
      where: { id: leadId }
    });

    console.log('✅ Hot lead supprimé:', leadId);

    return NextResponse.json({
      success: true,
      message: 'Lead supprimé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur DELETE /api/hot-leads:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du lead', details: error.message },
      { status: 500 }
    );
  }
}

// Export with rate limiting
// GET: 100 req/min (read operations)
// POST/PUT/DELETE: 30 req/min (write operations)
export const GET = withRateLimit(handleGET, apiRateLimiter)
export const POST = withRateLimit(handlePOST, writeRateLimiter)
export const PUT = withRateLimit(handlePUT, writeRateLimiter)
export const DELETE = withRateLimit(handleDELETE, writeRateLimiter)
