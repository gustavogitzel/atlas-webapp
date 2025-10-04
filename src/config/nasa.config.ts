import type { NASAConfig, InstrumentInfo, RegionInfo, GIBSLayer } from '@/types/nasa.types';

/**
 * NASA Terra Satellite Configuration
 * Dados reais dos instrumentos e regiões brasileiras
 */

// ============================================================================
// INSTRUMENTOS DO SATÉLITE TERRA
// ============================================================================

const INSTRUMENTS: Record<string, InstrumentInfo> = {
  MODIS: {
    id: 'MODIS',
    name: 'MODIS',
    fullName: 'Moderate Resolution Imaging Spectroradiometer',
    description: 'Monitora vegetação, cobertura terrestre, temperatura e incêndios',
    capabilities: [
      'Detecção de queimadas e incêndios',
      'Monitoramento de vegetação (NDVI)',
      'Temperatura da superfície',
      'Cobertura de nuvens',
    ],
    icon: '🌿',
    color: '#10b981',
  },
  ASTER: {
    id: 'ASTER',
    name: 'ASTER',
    fullName: 'Advanced Spaceborne Thermal Emission and Reflection Radiometer',
    description: 'Analisa mudanças climáticas e aquecimento global',
    capabilities: [
      'Mapeamento térmico de alta resolução',
      'Detecção de mudanças na superfície',
      'Análise de minerais e rochas',
      'Monitoramento de vulcões',
    ],
    icon: '🌡️',
    color: '#ef4444',
  },
  CERES: {
    id: 'CERES',
    name: 'CERES',
    fullName: 'Clouds and the Earth\'s Radiant Energy System',
    description: 'Mede radiação solar e balanço energético',
    capabilities: [
      'Medição de radiação solar',
      'Balanço energético da Terra',
      'Interação nuvens-clima',
      'Aquecimento global',
    ],
    icon: '☀️',
    color: '#f59e0b',
  },
  MISR: {
    id: 'MISR',
    name: 'MISR',
    fullName: 'Multi-angle Imaging SpectroRadiometer',
    description: 'Monitora aerossóis e qualidade do ar',
    capabilities: [
      'Detecção de poluição atmosférica',
      'Monitoramento de aerossóis',
      'Análise de nuvens em 3D',
      'Qualidade do ar',
    ],
    icon: '💨',
    color: '#6366f1',
  },
  MOPITT: {
    id: 'MOPITT',
    name: 'MOPITT',
    fullName: 'Measurements of Pollution in the Troposphere',
    description: 'Detecta monóxido de carbono e poluentes',
    capabilities: [
      'Medição de CO (monóxido de carbono)',
      'Rastreamento de poluição',
      'Análise de queimadas',
      'Qualidade do ar troposférico',
    ],
    icon: '🏭',
    color: '#8b5cf6',
  },
};

// ============================================================================
// REGIÕES DO BRASIL
// ============================================================================

const REGIONS: Record<string, RegionInfo> = {
  amazonia: {
    id: 'amazonia',
    name: 'Amazônia',
    description: 'Maior floresta tropical do mundo, enfrenta desmatamento crítico',
    coordinates: { lat: -3.4653, lng: -62.2159 },
    zoom: 6,
    bounds: [[-10, -70], [5, -50]],
    healthStatus: 'critical',
    issues: [
      'Desmatamento acelerado',
      'Queimadas ilegais',
      'Perda de biodiversidade',
      'Mudanças climáticas',
    ],
  },
  cerrado: {
    id: 'cerrado',
    name: 'Cerrado',
    description: 'Savana brasileira, berço das águas, ameaçada pela agricultura',
    coordinates: { lat: -15.7801, lng: -47.9292 },
    zoom: 6,
    bounds: [[-20, -55], [-10, -40]],
    healthStatus: 'warning',
    issues: [
      'Expansão agrícola',
      'Perda de vegetação nativa',
      'Escassez hídrica',
      'Queimadas sazonais',
    ],
  },
  'rio-grande-sul': {
    id: 'rio-grande-sul',
    name: 'Rio Grande do Sul',
    description: 'Estado do sul afetado por enchentes históricas em 2024',
    coordinates: { lat: -30.0346, lng: -51.2177 },
    zoom: 7,
    bounds: [[-33, -57], [-27, -49]],
    healthStatus: 'critical',
    issues: [
      'Enchentes catastróficas (2024)',
      'Mudanças climáticas extremas',
      'Perda de infraestrutura',
      'Deslocamento populacional',
    ],
  },
  'sao-paulo': {
    id: 'sao-paulo',
    name: 'São Paulo',
    description: 'Maior metrópole do Brasil, enfrenta poluição e ilhas de calor',
    coordinates: { lat: -23.5505, lng: -46.6333 },
    zoom: 10,
    bounds: [[-24, -47], [-23, -46]],
    healthStatus: 'warning',
    issues: [
      'Poluição atmosférica',
      'Ilhas de calor urbanas',
      'Qualidade do ar crítica',
      'Escassez hídrica periódica',
    ],
  },
};

// ============================================================================
// CAMADAS NASA GIBS
// ============================================================================

const GIBS_LAYERS: GIBSLayer[] = [
  {
    identifier: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    title: 'MODIS Terra True Color',
    subtitle: 'Imagem em cores reais',
    format: 'image/jpeg',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    startDate: '2000-02-24',
    instrument: 'MODIS',
  },
  {
    identifier: 'MODIS_Terra_Land_Surface_Temp_Day',
    title: 'MODIS Terra Land Surface Temperature (Day)',
    subtitle: 'Temperatura da superfície terrestre',
    format: 'image/png',
    tileMatrixSet: 'GoogleMapsCompatible_Level7',
    startDate: '2000-03-05',
    instrument: 'MODIS',
  },
  {
    identifier: 'MODIS_Terra_Aerosol',
    title: 'MODIS Terra Aerosol Optical Depth',
    subtitle: 'Profundidade óptica de aerossóis',
    format: 'image/png',
    tileMatrixSet: 'GoogleMapsCompatible_Level6',
    startDate: '2000-02-24',
    instrument: 'MODIS',
  },
  {
    identifier: 'MODIS_Terra_NDVI_8Day',
    title: 'MODIS Terra NDVI (8-Day)',
    subtitle: 'Índice de vegetação',
    format: 'image/png',
    tileMatrixSet: 'GoogleMapsCompatible_Level7',
    startDate: '2000-02-18',
    instrument: 'MODIS',
  },
  {
    identifier: 'ASTER_GDEM_Color_Shaded_Relief',
    title: 'ASTER Global Digital Elevation Model',
    subtitle: 'Modelo de elevação digital',
    format: 'image/jpeg',
    tileMatrixSet: 'GoogleMapsCompatible_Level7',
    startDate: '2009-06-29',
    instrument: 'ASTER',
  },
];

// ============================================================================
// CONFIGURAÇÃO COMPLETA
// ============================================================================

export const NASA_CONFIG: NASAConfig = {
  gibs: {
    baseUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    format: 'image/jpeg',
  },
  instruments: INSTRUMENTS,
  regions: REGIONS,
  layers: GIBS_LAYERS,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getInstrumentById = (id: string) => INSTRUMENTS[id];
export const getRegionById = (id: string) => REGIONS[id];
export const getLayersByInstrument = (instrument: string) =>
  GIBS_LAYERS.filter((layer) => layer.instrument === instrument);
