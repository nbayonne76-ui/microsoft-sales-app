import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { checkRateLimit, createRateLimitResponse, getRateLimitHeaders } from "./rate-limit"

/**
 * Higher-order function to add rate limiting to API routes
 * @param {Function} handler - The API route handler
 * @param {Ratelimit} limiter - The rate limiter to use
 * @param {Object} options - Configuration options
 * @returns {Function} - Wrapped handler with rate limiting
 */
export function withRateLimit(handler, limiter, options = {}) {
  return async function rateLimitedHandler(request, context) {
    try {
      // Get identifier (user ID or IP address)
      let identifier

      if (options.useAuth !== false) {
        // Try to get authenticated user
        const session = await getServerSession(authOptions)
        identifier = session?.user?.id || session?.user?.email
      }

      // Fallback to IP address if no user session
      if (!identifier) {
        const forwarded = request.headers.get("x-forwarded-for")
        const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"
        identifier = `ip:${ip}`
      }

      // Check rate limit
      const result = await checkRateLimit(limiter, identifier)

      // If rate limit exceeded, return 429
      if (!result.success) {
        return createRateLimitResponse(result)
      }

      // Call the original handler
      const response = await handler(request, context)

      // Add rate limit headers to successful responses
      if (response instanceof Response) {
        const headers = getRateLimitHeaders(result)
        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
      }

      return response

    } catch (error) {
      console.error("[Rate Limit Error]", error)
      // If rate limiting fails, allow the request through (fail open)
      return handler(request, context)
    }
  }
}
