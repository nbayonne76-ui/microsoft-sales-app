/**
 * Custom hook for automatic data refresh
 * Provides polling, multi-tab sync, and cache management
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Automatically refresh data at specified intervals
 * @param {Function} fetchFn - Function to fetch data
 * @param {Object} options - Configuration options
 * @returns {Object} { data, loading, error, refresh, setData }
 */
export function useAutoRefresh(fetchFn, options = {}) {
  const {
    interval = 30000, // 30 seconds default
    enabled = true,
    dependencies = [],
    onSuccess,
    onError,
    cacheKey = null,
    multiTabSync = true
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const intervalRef = useRef(null);
  const channelRef = useRef(null);

  // Fetch data function
  const fetchData = useCallback(async (skipLoading = false) => {
    if (!skipLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await fetchFn();

      if (!mountedRef.current) return;

      setData(result);

      // Cache if key provided
      if (cacheKey) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            data: result,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.warn('Failed to cache data:', e);
        }
      }

      // Broadcast update to other tabs
      if (multiTabSync && channelRef.current) {
        channelRef.current.postMessage({
          type: 'DATA_UPDATE',
          cacheKey,
          timestamp: Date.now()
        });
      }

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      if (!mountedRef.current) return;

      setError(err);
      console.error('Error fetching data:', err);

      if (onError) {
        onError(err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFn, cacheKey, multiTabSync, onSuccess, onError]);

  // Manual refresh function
  const refresh = useCallback(() => {
    return fetchData(false);
  }, [fetchData]);

  // Initialize - load from cache first, then fetch
  useEffect(() => {
    mountedRef.current = true;

    // Try to load from cache first
    if (cacheKey) {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;

          // Use cache if less than interval age
          if (age < interval) {
            setData(cachedData);
            setLoading(false);
          }
        }
      } catch (e) {
        console.warn('Failed to load cache:', e);
      }
    }

    // Initial fetch
    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  // Setup polling
  useEffect(() => {
    if (!enabled || !interval) return;

    intervalRef.current = setInterval(() => {
      fetchData(true); // Skip loading state for background refresh
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, fetchData]);

  // Setup multi-tab sync
  useEffect(() => {
    if (!multiTabSync) return;

    try {
      const channel = new BroadcastChannel('data-sync-channel');
      channelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data.type === 'DATA_UPDATE' && event.data.cacheKey === cacheKey) {
          // Another tab updated data, refresh from cache
          try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
              const { data: cachedData } = JSON.parse(cached);
              setData(cachedData);
            }
          } catch (e) {
            console.warn('Failed to sync from other tab:', e);
          }
        }
      };

      return () => {
        channel.close();
      };
    } catch (e) {
      // BroadcastChannel not supported
      console.warn('BroadcastChannel not supported:', e);
    }
  }, [cacheKey, multiTabSync]);

  return {
    data,
    loading,
    error,
    refresh,
    setData // Allow manual data updates
  };
}

/**
 * Hook for fetching data with automatic retry
 */
export function useDataWithRetry(fetchFn, options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    ...autoRefreshOptions
  } = options;

  const [retryCount, setRetryCount] = useState(0);

  const fetchWithRetry = useCallback(async () => {
    let lastError;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fetchFn();
      } catch (error) {
        lastError = error;

        if (i < maxRetries) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)));
          setRetryCount(i + 1);
        }
      }
    }

    throw lastError;
  }, [fetchFn, maxRetries, retryDelay]);

  const result = useAutoRefresh(fetchWithRetry, autoRefreshOptions);

  return {
    ...result,
    retryCount
  };
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticUpdate(fetchFn, updateFn, options = {}) {
  const { data, loading, error, refresh, setData } = useAutoRefresh(fetchFn, options);
  const [updating, setUpdating] = useState(false);

  const optimisticUpdate = useCallback(async (newData, updatePayload) => {
    // Immediately update UI
    const previousData = data;
    setData(newData);
    setUpdating(true);

    try {
      // Send update to server
      await updateFn(updatePayload);

      // Refresh to get authoritative data
      await refresh();
    } catch (error) {
      // Rollback on error
      setData(previousData);
      throw error;
    } finally {
      setUpdating(false);
    }
  }, [data, updateFn, refresh, setData]);

  return {
    data,
    loading,
    error,
    updating,
    refresh,
    optimisticUpdate
  };
}

/**
 * Hook for real-time sync with visibility API
 * Pauses polling when tab is hidden, resumes when visible
 */
export function useVisibilityAwareRefresh(fetchFn, options = {}) {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);

      // Refresh immediately when tab becomes visible
      if (!document.hidden) {
        refresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const result = useAutoRefresh(fetchFn, {
    ...options,
    enabled: options.enabled !== false && isVisible
  });

  const { refresh } = result;

  return result;
}

/**
 * Hook for debounced refresh
 */
export function useDebouncedRefresh(fetchFn, options = {}) {
  const { debounceMs = 500, ...autoRefreshOptions } = options;
  const timeoutRef = useRef(null);

  const result = useAutoRefresh(fetchFn, {
    ...autoRefreshOptions,
    enabled: false // We'll control refresh manually
  });

  const debouncedRefresh = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      result.refresh();
    }, debounceMs);
  }, [result, debounceMs]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...result,
    debouncedRefresh
  };
}
