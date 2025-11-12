import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * Get session from server-side
 * Use in Server Components and API Routes
 */
export async function getSession() {
  return await getServerSession(authOptions)
}

/**
 * Require authentication for API routes
 * Returns session if authenticated, throws error if not
 */
export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    return Response.json(
      { error: "Unauthorized - Please sign in" },
      { status: 401 }
    )
  }

  return session
}

/**
 * Require specific role for API routes
 * @param {string[]} allowedRoles - Array of allowed roles
 */
export async function requireRole(allowedRoles = ['admin']) {
  const session = await getSession()

  if (!session) {
    return Response.json(
      { error: "Unauthorized - Please sign in" },
      { status: 401 }
    )
  }

  if (!allowedRoles.includes(session.user.role)) {
    return Response.json(
      { error: "Forbidden - Insufficient permissions" },
      { status: 403 }
    )
  }

  return session
}

/**
 * Check if user has permission
 * @param {Object} session - NextAuth session
 * @param {string[]} allowedRoles - Array of allowed roles
 */
export function hasPermission(session, allowedRoles = ['admin']) {
  if (!session) return false
  return allowedRoles.includes(session.user.role)
}
