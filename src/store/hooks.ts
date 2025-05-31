"use client";

import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { useCallback } from 'react';
import type { RootState, AppDispatch } from './index';
import { baseApi } from './api/baseApi';
import { getInvalidationTags, getBulkInvalidationTags, type CacheTag } from './cacheUtils';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Re-export store types
export type { RootState, AppDispatch } from "./index";

// Cache invalidation hooks
export const useCacheInvalidation = () => {
  const dispatch = useAppDispatch();

  // Invalidate specific tags
  const invalidateTags = useCallback((tags: (CacheTag | { type: CacheTag; id: string })[]) => {
    dispatch(baseApi.util.invalidateTags(tags));
  }, [dispatch]);

  // Invalidate all cache for an entity type
  const invalidateEntity = useCallback((entityType: keyof typeof getInvalidationTags, entityId?: string) => {
    const tags = getInvalidationTags(entityType, entityId);
    dispatch(baseApi.util.invalidateTags(tags));
  }, [dispatch]);

  // Invalidate cache for multiple entity types
  const invalidateMultiple = useCallback((entityTypes: (keyof typeof getInvalidationTags)[]) => {
    const tags = getBulkInvalidationTags(entityTypes);
    dispatch(baseApi.util.invalidateTags(tags));
  }, [dispatch]);

  // Reset entire API cache
  const resetCache = useCallback(() => {
    dispatch(baseApi.util.resetApiState());
  }, [dispatch]);

  return {
    invalidateTags,
    invalidateEntity,
    invalidateMultiple,
    resetCache,
  };
};

// Hook for getting cache status
export const useCacheStatus = () => {
  const cacheEntries = useAppSelector(state => state.api.queries);
  
  const getCacheInfo = useCallback((endpointName: string, args?: any) => {
    const cacheKey = `${endpointName}(${JSON.stringify(args)})`;
    const entry = cacheEntries[cacheKey];
    
    return {
      isLoading: entry?.status === 'pending',
      isSuccess: entry?.status === 'fulfilled',
      isError: entry?.status === 'rejected',
      lastFetched: entry?.fulfilledTimeStamp,
      error: entry?.error,
    };
  }, [cacheEntries]);

  return { getCacheInfo };
}; 