/**
 * Fire Detection Types
 * Types for NASA fire detection data from MODIS/VIIRS satellites
 */

export interface FireProperties {
  latitude: number;
  longitude: number;
  brightness: number;
  scan: number;
  track: number;
  acq_date: string;
  acq_time: string;
  satellite: 'Terra' | 'Aqua' | string;
  confidence: number;
  version: string;
  bright_t31: number;
  frp: number;
  daynight: 'D' | 'N';
}

export interface FireFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lon, lat]
  };
  properties: FireProperties;
  // Optional cluster data for detail modal
  count?: number;
  radius?: number;
  fires?: FireDetail[];
}

export interface FirePointsResponse {
  type: 'FeatureCollection';
  features: FireFeature[];
  metadata: {
    total_points: number;
    filtered_points: number;
    date_range: {
      start: string;
      end: string;
    };
  };
}

export interface FireStatistics {
  total_detections: number;
  date_range: {
    start: string;
    end: string;
  };
  satellites: {
    [key: string]: number;
  };
  confidence: {
    high: number;
    nominal: number;
    low: number;
  };
  frp: {
    total: number;
    average: number;
    max: number;
    min: number;
  };
  daynight: {
    day: number;
    night: number;
  };
}

export interface FireDetail {
  latitude: number;
  longitude: number;
  brightness: number;
  frp: number;
  confidence: number;
  satellite: string;
  date: string;
  time: string;
  lat: number;
  lon: number;
}

export interface FireDetailsResponse {
  count: number;
  radius: number;
  center: {
    lat: number;
    lon: number;
  };
  fires: FireDetail[];
}

export interface Hotspot {
  lat: number;
  lon: number;
  fire_count: number;
  avg_frp: number;
  avg_confidence: number;
}

export interface HotspotsResponse {
  grid_size: number;
  total_hotspots: number;
  hotspots: Hotspot[];
}

export interface TemporalData {
  date: string;
  count: number;
  avg_frp: number;
  avg_confidence: number;
}

export interface TemporalAnalysisResponse {
  daily: TemporalData[];
  monthly: TemporalData[];
}

export interface FireAPIOptions {
  maxPoints?: number;
  minConfidence?: number;
  startDate?: string;
  endDate?: string;
}
