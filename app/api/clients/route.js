import { NextResponse } from 'next/server';
import { ClientService, prisma } from '../../../lib/database.js';

// GET /api/clients - Récupérer tous les clients avec pagination
export async function GET(request) {
  try {
    console.log('📊 Récupération des clients...');

    // ✅ Pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // ✅ Optional filters
    const segment = searchParams.get('segment'); // enterprise, sme, startup
    const status = searchParams.get('status'); // active, inactive, converted
    const priority = searchParams.get('priority'); // high, medium, low
    const search = searchParams.get('search'); // Company name search

    // ✅ Build where clause
    const where = {
      ...(segment && { segment }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && {
        company: {
          contains: search,
          mode: 'insensitive'
        }
      })
    };

    // ✅ Use Prisma directly for better control over pagination
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          company: true,
          segment: true,
          industry: true,
          employeeCount: true,
          currentChallenges: true,
          contactName: true,
          contactEmail: true,
          contactRole: true,
          priority: true,
          status: true,
          assignedManager: true,
          // Limit interactions
          interactions: {
            select: {
              id: true,
              type: true,
              status: true,
              subject: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 5
          },
          // Count instead of loading all
          _count: {
            select: { interactions: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.client.count({ where })
    ]);

    console.log(`✅ ${clients.length} clients récupérés (page ${page}/${Math.ceil(total / limit)})`);

    return NextResponse.json({
      success: true,
      data: clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
        showing: clients.length
      }
    });

  } catch (error) {
    console.error('❌ Erreur GET /api/clients:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des clients',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// POST /api/clients - Créer ou mettre à jour un client
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      company, 
      segment, 
      industry, 
      currentChallenges, 
      contactEmail, 
      contactName,
      employeeCount 
    } = body;

    console.log('👤 Création/mise à jour client:', { company, segment });

    if (!company) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Le nom de l\'entreprise est requis' 
        },
        { status: 400 }
      );
    }

    const client = await ClientService.findOrCreateClient({
      company,
      segment: segment || 'sme',
      industry,
      currentChallenges,
      contactEmail,
      contactName,
      employeeCount
    });

    return NextResponse.json({
      success: true,
      data: client,
      message: client.createdAt === client.updatedAt ? 'Client créé' : 'Client mis à jour'
    });
    
  } catch (error) {
    console.error('❌ Erreur POST /api/clients:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la création/mise à jour du client',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT /api/clients - Mettre à jour le statut d'un client
export async function PUT(request) {
  try {
    const body = await request.json();
    const { clientId, status, priority } = body;

    console.log('📊 Mise à jour statut client:', { clientId, status, priority });

    if (!clientId || !status) {
      return NextResponse.json(
        { 
          success: false,
          error: 'clientId et status sont requis' 
        },
        { status: 400 }
      );
    }

    const client = await ClientService.updateClientStatus(clientId, status, priority);

    return NextResponse.json({
      success: true,
      data: client,
      message: 'Statut client mis à jour'
    });
    
  } catch (error) {
    console.error('❌ Erreur PUT /api/clients:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la mise à jour du statut',
        details: error.message 
      },
      { status: 500 }
    );
  }
}