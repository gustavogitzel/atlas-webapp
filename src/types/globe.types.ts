/**
 * Globe 3D - Type Definitions
 * Tipos para visualização 3D da Terra com react-globe.gl
 */

import type { BrazilRegion } from './nasa.types';

// ============================================================================
// PONTOS NO GLOBO
// ============================================================================

export interface GlobePoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  region?: BrazilRegion;
}

// ============================================================================
// ARCOS/CONEXÕES
// ============================================================================

export interface GlobeArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  label?: string;
}

// ============================================================================
// POLÍGONOS (REGIÕES)
// ============================================================================

export interface GlobePolygon {
  coordinates: number[][][];
  properties: {
    name: string;
    region: BrazilRegion;
    healthStatus: 'critical' | 'warning' | 'moderate' | 'good';
  };
}

// ============================================================================
// LABELS CUSTOMIZADOS
// ============================================================================

export interface GlobeLabel {
  lat: number;
  lng: number;
  text: string;
  size: number;
  color: string;
  altitude?: number;
}

// ============================================================================
// ANIMAÇÕES E TRANSIÇÕES
// ============================================================================

export interface GlobeAnimation {
  type: 'rotate' | 'zoom' | 'focus';
  target?: {
    lat: number;
    lng: number;
    altitude?: number;
  };
  duration: number;
}

// ============================================================================
// CONFIGURAÇÃO DO GLOBO
// ============================================================================

export interface GlobeConfig {
  backgroundColor: string;
  globeImageUrl?: string;
  bumpImageUrl?: string;
  showAtmosphere: boolean;
  atmosphereColor: string;
  atmosphereAltitude: number;
  enablePointerInteraction: boolean;
  animateIn: boolean;
}

// ============================================================================
// DADOS DE SAÚDE POR REGIÃO
// ============================================================================

export interface RegionHealthData {
  region: BrazilRegion;
  coordinates: {
    lat: number;
    lng: number;
  };
  healthScore: number; // 0-100
  issues: {
    type: 'deforestation' | 'fire' | 'flood' | 'pollution';
    severity: number; // 0-100
    description: string;
  }[];
  color: string;
  pulseAnimation: boolean;
}
