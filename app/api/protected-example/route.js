import { requireAuth } from "@/lib/auth-helpers"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Example of a protected API route
 * Only authenticated users can access this endpoint
 */
export async function GET(request) {
  // Check authentication
  const session = await requireAuth()

  // If requireAuth returns a Response (error), return it
  if (session instanceof Response) {
    return session
  }

  // User is authenticated, continue with the logic
  try {
    // Example: Get user's leads
    const leads = await prisma.hotLead.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return Response.json({
      success: true,
      user: {
        name: session.user.name,
        email: session.user.email,
        role: session.user.role
      },
      data: leads,
      message: 'Protected data accessed successfully'
    })
  } catch (error) {
    console.error('Error fetching protected data:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

/**
 * Example POST endpoint - requires authentication
 */
export async function POST(request) {
  const session = await requireAuth()

  if (session instanceof Response) {
    return session
  }

  try {
    const body = await request.json()

    // Your logic here - user is authenticated
    return Response.json({
      success: true,
      message: 'Data created successfully',
      user: session.user.email
    })
  } catch (error) {
    return Response.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
