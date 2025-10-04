/**
 * NASA Terra Satellite - Type Definitions
 * Tipos para integração com NASA GIBS API e dados do satélite Terra
 */

// ============================================================================
// INSTRUMENTOS DO SATÉLITE TERRA
// ============================================================================

export type TerraInstrument = 'MODIS' | 'ASTER' | 'CERES' | 'MISR' | 'MOPITT';

export interface InstrumentInfo {
  id: TerraInstrument;
  name: string;
  fullName: string;
  description: string;
  capabilities: string[];
  icon: string;
  color: string;
}

// ============================================================================
// REGIÕES DO BRASIL
// ============================================================================

export type BrazilRegion = 'amazonia' | 'cerrado' | 'rio-grande-sul' | 'sao-paulo';

export interface RegionInfo {
  id: BrazilRegion;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  zoom: number;
  bounds: [[number, number], [number, number]];
  healthStatus: 'critical' | 'warning' | 'moderate' | 'good';
  issues: string[];
}

// ============================================================================
// NASA GIBS API
// ============================================================================

export interface GIBSLayer {
  identifier: string;
  title: string;
  subtitle?: string;
  format: 'image/png' | 'image/jpeg';
  tileMatrixSet: string;
  startDate: string;
  endDate?: string;
  instrument: TerraInstrument;
}

export interface GIBSTileRequest {
  layer: string;
  date: string;
  tileMatrixSet: string;
  tileMatrix: number;
  tileRow: number;
  tileCol: number;
  format: string;
}

export interface GIBSImageryOptions {
  layer: GIBSLayer;
  date: Date;
  bounds?: [[number, number], [number, number]];
  opacity?: number;
}

// ============================================================================
// DADOS TEMPORAIS
// ============================================================================

export interface TemporalComparison {
  current: {
    date: Date;
    imageUrl: string;
  };
  previous: {
    date: Date;
    imageUrl: string;
  };
  difference?: {
    percentage: number;
    trend: 'improving' | 'worsening' | 'stable';
  };
}

// ============================================================================
// STORYTELLING - "TERRA COMO MÉDICO"
// ============================================================================

export interface HealthCheckData {
  region: RegionInfo;
  diagnosis: {
    status: 'critical' | 'warning' | 'moderate' | 'good';
    symptoms: string[];
    causes: string[];
    recommendations: string[];
  };
  vitals: {
    vegetation: number; // 0-100
    temperature: number; // celsius
    airQuality: number; // 0-100
    waterQuality: number; // 0-100
  };
  timeline: {
    date: Date;
    event: string;
    severity: 'high' | 'medium' | 'low';
  }[];
}

// ============================================================================
// MINI-JOGOS
// ============================================================================

export interface TreePlantingGameState {
  region: BrazilRegion;
  treesPlanted: number;
  targetTrees: number;
  timeRemaining: number;
  score: number;
  carbonOffset: number; // kg CO2
  areaRestored: number; // hectares
}

export interface QuizQuestion {
  id: string;
  instrument: TerraInstrument;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameScore {
  playerId: string;
  game: 'tree-planting' | 'quiz' | 'simulation';
  score: number;
  timestamp: Date;
  achievements: string[];
}

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

export interface NASAConfig {
  gibs: {
    baseUrl: string;
    tileMatrixSet: string;
    format: string;
  };
  instruments: Record<TerraInstrument, InstrumentInfo>;
  regions: Record<BrazilRegion, RegionInfo>;
  layers: GIBSLayer[];
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: Date;
}

export interface ImageryMetadata {
  layer: string;
  date: string;
  resolution: string;
  instrument: TerraInstrument;
  bounds: [[number, number], [number, number]];
  fileSize?: number;
}
