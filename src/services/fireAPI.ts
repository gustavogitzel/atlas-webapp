/**
 * Fire API Service
 * Service for fetching fire detection data from NASA MODIS/VIIRS API
 */

import type {
  FirePointsResponse,
  FireStatistics,
  FireDetailsResponse,
  HotspotsResponse,
  TemporalAnalysisResponse,
  FireAPIOptions,
} from '@/types/fire';

const API_URL = import.meta.env.VITE_API_URL || 'https://atlas-api-apy0.onrender.com';

/**
 * Fetch fire points for globe visualization
 */
export async function fetchFirePoints(options: FireAPIOptions = {}): Promise<FirePointsResponse> {
  const {
    maxPoints = 10000,
    minConfidence = 0,
    startDate,
    endDate,
  } = options;

  const params = new URLSearchParams({
    max_points: maxPoints.toString(),
    min_confidence: minConfidence.toString(),
  });

  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  const response = await fetch(`${API_URL}/csv/fire-points?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch fire points: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch fire statistics
 */
export async function fetchStatistics(): Promise<FireStatistics> {
  const response = await fetch(`${API_URL}/csv/statistics`);

  if (!response.ok) {
    throw new Error(`Failed to fetch statistics: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch fire details near a specific point
 */
export async function fetchFireDetails(
  lat: number,
  lon: number,
  radius: number = 0.05
): Promise<FireDetailsResponse> {
  const response = await fetch(
    `${API_URL}/csv/fire-details?lat=${lat}&lon=${lon}&radius=${radius}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch fire details: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch hotspots (clustered fire areas)
 */
export async function fetchHotspots(gridSize: number = 0.5): Promise<HotspotsResponse> {
  const response = await fetch(`${API_URL}/csv/hotspots?grid_size=${gridSize}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch hotspots: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch temporal analysis data
 */
export async function fetchTemporalAnalysis(): Promise<TemporalAnalysisResponse> {
  const response = await fetch(`${API_URL}/csv/temporal-analysis`);

  if (!response.ok) {
    throw new Error(`Failed to fetch temporal analysis: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
