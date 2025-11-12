/**
 * API RATE LIMITER
 * Prevents API abuse and DDoS attacks
 *
 * Based on 2025 best practices:
 * - Token bucket algorithm
 * - Per-IP and per-route limits
 * - Automatic cleanup
 */

const rateLimitStore = new Map();
const CLEANUP_INTERVAL = 60000; // 1 minute

/**
 * Rate limit configurations per route type
 */
const RATE_LIMITS = {
  // AI/OpenAI endpoints - expensive, limit heavily
  ai: {
    maxRequests: 10,
    windowMs: 60000, // 10 requests per minute
    message: 'Too many AI requests. Please wait before trying again.'
  },

  // Email sending - prevent spam
  email: {
    maxRequests: 20,
    windowMs: 60000, // 20 emails per minute
    message: 'Too many email requests. Please slow down.'
  },

  // Data fetch endpoints - moderate limits
  api: {
    maxRequests: 100,
    windowMs: 60000, // 100 requests per minute
    message: 'Too many requests. Please wait before trying again.'
  },

  // Analytics/reporting - can be heavy
  analytics: {
    maxRequests: 30,
    windowMs: 60000, // 30 requests per minute
    message: 'Too many analytics requests. Please wait.'
  },

  // Default for all other routes
  default: {
    maxRequests: 200,
    windowMs: 60000, // 200 requests per minute
    message: 'Rate limit exceeded. Please wait before trying again.'
  }
};

/**
 * Get client identifier (IP address or session ID)
 * @param {Request} request - Next.js request object
 * @returns {string} Client identifier
 */
function getClientId(request) {
  // Try to get real IP (handles proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';

  return ip;
}

/**
 * Check if request should be rate limited
 * @param {Request} request - Next.js request object
 * @param {string} limitType - Type of limit to apply (ai, email, api, etc.)
 * @returns {{limited: boolean, remaining: number, resetTime: number}} Rate limit status
 */
export function checkRateLimit(request, limitType = 'default') {
  const config = RATE_LIMITS[limitType] || RATE_LIMITS.default;
  const clientId = getClientId(request);
  const key = `${limitType}:${clientId}`;

  const now = Date.now();
  let record = rateLimitStore.get(key);

  // Create new record if doesn't exist or expired
  if (!record || now - record.resetTime > config.windowMs) {
    record = {
      count: 0,
      resetTime: now
    };
    rateLimitStore.set(key, record);
  }

  // Increment count
  record.count++;

  // Check if limit exceeded
  const limited = record.count > config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - record.count);
  const resetTime = record.resetTime + config.windowMs;

  return {
    limited,
    remaining,
    resetTime,
    message: config.message
  };
}

/**
 * Create rate limit middleware for API routes
 * Usage: export async function POST(request) {
 *   const rateCheck = rateLimitMiddleware(request, 'ai');
 *   if (rateCheck) return rateCheck;
 *   // ... rest of handler
 * }
 *
 * @param {Request} request - Next.js request object
 * @param {string} limitType - Type of limit
 * @returns {Response|null} Rate limit response or null if OK
 */
export function rateLimitMiddleware(request, limitType = 'default') {
  const { limited, remaining, resetTime, message } = checkRateLimit(request, limitType);

  if (limited) {
    return new Response(
      JSON.stringify({
        error: message,
        retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        limit: RATE_LIMITS[limitType]?.maxRequests || RATE_LIMITS.default.maxRequests
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(RATE_LIMITS[limitType]?.maxRequests || RATE_LIMITS.default.maxRequests),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(Math.ceil(resetTime / 1000)),
          'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000))
        }
      }
    );
  }

  return null; // Request OK
}

/**
 * Reset rate limit for a specific client (admin use)
 * @param {string} clientId - Client identifier
 * @param {string} limitType - Limit type to reset
 */
export function resetRateLimit(clientId, limitType = null) {
  if (limitType) {
    const key = `${limitType}:${clientId}`;
    rateLimitStore.delete(key);
  } else {
    // Reset all limits for this client
    for (const key of rateLimitStore.keys()) {
      if (key.endsWith(`:${clientId}`)) {
        rateLimitStore.delete(key);
      }
    }
  }
}

/**
 * Get rate limit stats (admin/monitoring)
 */
export function getRateLimitStats() {
  const stats = {
    totalEntries: rateLimitStore.size,
    byType: {},
    topClients: []
  };

  // Group by limit type
  for (const [key, record] of rateLimitStore.entries()) {
    const [type] = key.split(':');
    if (!stats.byType[type]) {
      stats.byType[type] = { count: 0, requests: 0 };
    }
    stats.byType[type].count++;
    stats.byType[type].requests += record.count;
  }

  // Find top requesters
  const clientCounts = new Map();
  for (const [key, record] of rateLimitStore.entries()) {
    const clientId = key.split(':')[1];
    clientCounts.set(clientId, (clientCounts.get(clientId) || 0) + record.count);
  }

  stats.topClients = Array.from(clientCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([clientId, count]) => ({ clientId, requests: count }));

  return stats;
}

/**
 * Cleanup expired entries
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, record] of rateLimitStore.entries()) {
    const type = key.split(':')[0];
    const config = RATE_LIMITS[type] || RATE_LIMITS.default;

    if (now - record.resetTime > config.windowMs) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`🧹 Rate limiter: Cleaned ${cleaned} expired entries. Size: ${rateLimitStore.size}`);
  }
}

// Auto-cleanup every minute
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL);
}
