import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Create Redis instance
// For development: Uses in-memory storage if no Redis URL provided
// For production: Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
let redis

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  // Production: Use Upstash Redis
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
} else {
  // Development: Use in-memory Map
  console.log('[Rate Limit] Using in-memory storage (development mode)')

  // Simple in-memory implementation for development
  const map = new Map()

  redis = {
    get: async (key) => map.get(key) || null,
    set: async (key, value) => {
      map.set(key, value)
      return 'OK'
    },
    setex: async (key, seconds, value) => {
      map.set(key, value)
      setTimeout(() => map.delete(key), seconds * 1000)
      return 'OK'
    },
    incr: async (key) => {
      const current = map.get(key) || 0
      const newValue = current + 1
      map.set(key, newValue)
      return newValue
    },
    expire: async (key, seconds) => {
      setTimeout(() => map.delete(key), seconds * 1000)
      return 1
    }
  }
}

// Rate limiters for different endpoints
// AI Endpoints - Very restrictive (expensive operations)
export const aiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
  analytics: true,
  prefix: "ratelimit:ai",
})

// Enrichment - Restrictive (API calls)
export const enrichmentRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
  analytics: true,
  prefix: "ratelimit:enrichment",
})

// Email Generation - Restrictive (AI costs)
export const emailRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
  analytics: true,
  prefix: "ratelimit:email",
})

// API General - Moderate
export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
  analytics: true,
  prefix: "ratelimit:api",
})

// Write Operations - Moderate
export const writeRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"), // 30 requests per minute
  analytics: true,
  prefix: "ratelimit:write",
})

/**
 * Apply rate limiting to a route handler
 * @param {Ratelimit} limiter - The rate limiter to use
 * @param {string} identifier - Unique identifier (usually user ID or IP)
 * @returns {Promise<{success: boolean, limit: number, remaining: number, reset: number}>}
 */
export async function checkRateLimit(limiter, identifier) {
  const { success, limit, reset, remaining } = await limiter.limit(identifier)

  return {
    success,
    limit,
    remaining,
    reset,
  }
}

/**
 * Create rate limit headers for the response
 */
export function getRateLimitHeaders(result) {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  }
}

/**
 * Create a rate-limited response
 */
export function createRateLimitResponse(result) {
  const headers = getRateLimitHeaders(result)

  return Response.json(
    {
      error: 'Trop de requêtes',
      message: `Limite atteinte. Réessayez dans ${Math.ceil((result.reset - Date.now()) / 1000)} secondes.`,
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    },
    {
      status: 429,
      headers: {
        ...headers,
        'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
      },
    }
  )
}
