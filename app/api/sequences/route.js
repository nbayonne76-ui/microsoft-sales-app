import { prisma } from '@/lib/database';
import { NextResponse } from 'next/server';
import { enrollLeadInSequence } from '@/lib/queues/email-sequence-queue';

// GET - List all sequences or get specific sequence
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sequenceId = searchParams.get('id');

    if (sequenceId) {
      // Get specific sequence with steps
      const sequence = await prisma.emailSequence.findUnique({
        where: { id: sequenceId },
        include: {
          steps: { orderBy: { stepNumber: 'asc' } },
          enrollments: {
            include: { lead: true },
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });

      if (!sequence) {
        return NextResponse.json({ error: 'Sequence not found' }, { status: 404 });
      }

      return NextResponse.json({ sequence });
    }

    // ✅ Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // ✅ Optional filters
    const isActive = searchParams.get('isActive'); // 'true' or 'false'
    const goal = searchParams.get('goal'); // lead_gen, nurture, re_engage, demo_booking
    const search = searchParams.get('search'); // Name search

    // ✅ Build where clause
    const where = {
      ...(isActive !== null && isActive !== undefined && { isActive: isActive === 'true' }),
      ...(goal && { goal }),
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      })
    };

    // ✅ Parallel queries for performance
    const [sequences, total] = await Promise.all([
      prisma.emailSequence.findMany({
        where,
        skip,
        take: limit,
        select: {
          // Only select needed fields for list view
          id: true,
          name: true,
          description: true,
          goal: true,
          targetIndustry: true,
          targetCompanySize: true,
          targetRole: true,
          isActive: true,
          isTemplate: true,
          enrolledCount: true,
          completedCount: true,
          responseRate: true,
          meetingRate: true,
          createdAt: true,
          updatedAt: true,
          // Limited step info
          steps: {
            select: {
              id: true,
              stepNumber: true,
              delayDays: true,
              subject: true,
              emailType: true
            },
            orderBy: { stepNumber: 'asc' }
          },
          // Count enrollments
          _count: {
            select: { enrollments: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.emailSequence.count({ where })
    ]);

    // Calculate performance metrics
    const sequencesWithMetrics = sequences.map(seq => ({
      ...seq,
      totalEnrolled: seq._count.enrollments,
      avgResponseRate: seq.responseRate,
      avgMeetingRate: seq.meetingRate,
      stepsCount: seq.steps.length
    }));

    return NextResponse.json({
      sequences: sequencesWithMetrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
        showing: sequences.length
      }
    });
  } catch (error) {
    console.error('Error fetching sequences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sequences', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new sequence or enroll lead
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'enroll') {
      // Enroll a lead in a sequence
      const { leadId, sequenceId } = body;

      if (!leadId || !sequenceId) {
        return NextResponse.json(
          { error: 'leadId and sequenceId are required' },
          { status: 400 }
        );
      }

      // Add to queue for processing
      await enrollLeadInSequence(leadId, sequenceId);

      return NextResponse.json({
        success: true,
        message: 'Lead enrolled in sequence'
      });
    }

    // Create new sequence
    const {
      name,
      description,
      goal,
      targetIndustry,
      targetCompanySize,
      targetRole,
      steps
    } = body;

    const sequence = await prisma.emailSequence.create({
      data: {
        name,
        description,
        goal,
        targetIndustry,
        targetCompanySize,
        targetRole,
        isActive: true,
        steps: {
          create: steps
        }
      },
      include: { steps: true }
    });

    return NextResponse.json({ sequence }, { status: 201 });
  } catch (error) {
    console.error('Error creating sequence:', error);
    return NextResponse.json(
      { error: 'Failed to create sequence', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update sequence
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const sequence = await prisma.emailSequence.update({
      where: { id },
      data: updates,
      include: { steps: true }
    });

    return NextResponse.json({ sequence });
  } catch (error) {
    console.error('Error updating sequence:', error);
    return NextResponse.json(
      { error: 'Failed to update sequence', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete sequence
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await prisma.emailSequence.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sequence:', error);
    return NextResponse.json(
      { error: 'Failed to delete sequence', details: error.message },
      { status: 500 }
    );
  }
}
