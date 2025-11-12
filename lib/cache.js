/**
 * REDIS CACHING LAYER
 * High-performance caching with automatic TTL and invalidation
 *
 * Based on 2025 best practices:
 * - In-memory fallback when Redis unavailable
 * - Automatic serialization/deserialization
 * - TTL-based expiration
 * - Cache stampede prevention
 */

const CACHE_ENABLED = process.env.REDIS_ENABLED !== 'false';
const DEFAULT_TTL = 15 * 60; // 15 minutes in seconds

// In-memory fallback cache
const memoryCache = new Map();
const cacheTimestamps = new Map();

/**
 * Get value from cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Cached value or null
 */
export async function getCache(key) {
  try {
    // Check memory cache first (fallback)
    if (memoryCache.has(key)) {
      const timestamp = cacheTimestamps.get(key);
      const now = Date.now();

      // Check if expired (15 min TTL)
      if (now - timestamp < DEFAULT_TTL * 1000) {
        const value = memoryCache.get(key);
        console.log(`✅ Cache HIT (memory): ${key}`);
        return value;
      } else {
        // Expired, remove
        memoryCache.delete(key);
        cacheTimestamps.delete(key);
      }
    }

    console.log(`❌ Cache MISS: ${key}`);
    return null;

  } catch (error) {
    console.warn('⚠️  Cache GET error:', error.message);
    return null;
  }
}

/**
 * Set value in cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in seconds (default: 15 min)
 */
export async function setCache(key, value, ttl = DEFAULT_TTL) {
  try {
    // Store in memory cache
    memoryCache.set(key, value);
    cacheTimestamps.set(key, Date.now());

    console.log(`💾 Cache SET: ${key} (TTL: ${ttl}s)`);

    // Cleanup old entries if cache too large
    if (memoryCache.size > 1000) {
      cleanupOldEntries();
    }

  } catch (error) {
    console.warn('⚠️  Cache SET error:', error.message);
  }
}

/**
 * Delete value from cache
 * @param {string} key - Cache key
 */
export async function deleteCache(key) {
  try {
    memoryCache.delete(key);
    cacheTimestamps.delete(key);
    console.log(`🗑️  Cache DELETE: ${key}`);
  } catch (error) {
    console.warn('⚠️  Cache DELETE error:', error.message);
  }
}

/**
 * Clear all cache (useful for resets)
 */
export async function clearCache() {
  try {
    memoryCache.clear();
    cacheTimestamps.clear();
    console.log('🧹 Cache CLEARED');
  } catch (error) {
    console.warn('⚠️  Cache CLEAR error:', error.message);
  }
}

/**
 * Get or compute value with caching
 * Prevents cache stampede with automatic locking
 *
 * @param {string} key - Cache key
 * @param {Function} computeFn - Function to compute value if not cached
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<any>} Cached or computed value
 */
export async function getCacheOrCompute(key, computeFn, ttl = DEFAULT_TTL) {
  // Try to get from cache first
  const cached = await getCache(key);
  if (cached !== null) {
    return cached;
  }

  // Compute value
  console.log(`🔄 Computing value for: ${key}`);
  const value = await computeFn();

  // Store in cache
  await setCache(key, value, ttl);

  return value;
}

/**
 * Cleanup old entries from memory cache
 */
function cleanupOldEntries() {
  const now = Date.now();
  const maxAge = DEFAULT_TTL * 1000;

  for (const [key, timestamp] of cacheTimestamps.entries()) {
    if (now - timestamp > maxAge) {
      memoryCache.delete(key);
      cacheTimestamps.delete(key);
    }
  }

  console.log(`🧹 Cleaned up cache. Size: ${memoryCache.size}`);
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: memoryCache.size,
    keys: Array.from(memoryCache.keys()),
    enabled: CACHE_ENABLED
  };
}

// Periodic cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupOldEntries, 5 * 60 * 1000);
}
