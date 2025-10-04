/**
 * useFireData Hook
 * React Query hook for fire detection data with caching
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  fetchFirePoints,
  fetchStatistics,
  fetchFireDetails,
  fetchHotspots,
  fetchTemporalAnalysis,
} from '@/services/fireAPI';
import type {
  FirePointsResponse,
  FireStatistics,
  FireDetailsResponse,
  HotspotsResponse,
  TemporalAnalysisResponse,
  FireAPIOptions,
} from '@/types/fire';

/**
 * Hook to fetch fire points with caching
 */
export function useFirePoints(
  options: FireAPIOptions = {}
): UseQueryResult<FirePointsResponse, Error> {
  return useQuery({
    queryKey: ['firePoints', options],
    queryFn: () => fetchFirePoints(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
  });
}

/**
 * Hook to fetch fire statistics with caching
 */
export function useFireStatistics(): UseQueryResult<FireStatistics, Error> {
  return useQuery({
    queryKey: ['fireStatistics'],
    queryFn: fetchStatistics,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to fetch fire details (lazy - only when called)
 */
export function useFireDetails(
  lat: number | null,
  lon: number | null,
  radius: number = 0.05
): UseQueryResult<FireDetailsResponse, Error> {
  return useQuery({
    queryKey: ['fireDetails', lat, lon, radius],
    queryFn: () => fetchFireDetails(lat!, lon!, radius),
    enabled: lat !== null && lon !== null,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch hotspots with caching
 */
export function useHotspots(gridSize: number = 0.5): UseQueryResult<HotspotsResponse, Error> {
  return useQuery({
    queryKey: ['hotspots', gridSize],
    queryFn: () => fetchHotspots(gridSize),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to fetch temporal analysis with caching
 */
export function useTemporalAnalysis(): UseQueryResult<TemporalAnalysisResponse, Error> {
  return useQuery({
    queryKey: ['temporalAnalysis'],
    queryFn: fetchTemporalAnalysis,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}
