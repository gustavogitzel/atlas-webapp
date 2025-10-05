/**
 * NASA GIBS Globe Layer Configurations
 * Available imagery layers for the Fire Globe visualization
 * 
 * GIBS (Global Imagery Browse Services) provides access to NASA satellite imagery
 * Documentation: https://wiki.earthdata.nasa.gov/display/GIBS
 */

export interface GlobeLayer {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  resolution: string;
  category: 'visual' | 'infrared' | 'terrain' | 'environmental';
  icon: string;
}

/**
 * Available globe base layers from NASA GIBS
 */
export const GLOBE_LAYERS: GlobeLayer[] = [
  // Visual Spectrum Layers
  {
    id: 'terra-truecolor',
    name: 'True Color (Terra/MODIS)',
    description: 'Natural color satellite imagery from MODIS Terra',
    baseUrl: 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=MODIS_Terra_CorrectedReflectance_TrueColor&version=1.3.0&crs=EPSG:4326&transparent=false&width=2048&height=1024&bbox=-90,-180,90,180&format=image/jpeg',
    resolution: '250m',
    category: 'visual',
    icon: '🌍',
  },
  {
    id: 'aqua-truecolor',
    name: 'True Color (Aqua/MODIS)',
    description: 'Natural color satellite imagery from MODIS Aqua',
    baseUrl: 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=MODIS_Aqua_CorrectedReflectance_TrueColor&version=1.3.0&crs=EPSG:4326&transparent=false&width=2048&height=1024&bbox=-90,-180,90,180&format=image/jpeg',
    resolution: '250m',
    category: 'visual',
    icon: '🌊',
  },
  {
    id: 'viirs-truecolor',
    name: 'True Color (VIIRS/SNPP)',
    description: 'High-resolution natural color from VIIRS',
    baseUrl: 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=VIIRS_SNPP_CorrectedReflectance_TrueColor&version=1.3.0&crs=EPSG:4326&transparent=false&width=2048&height=1024&bbox=-90,-180,90,180&format=image/jpeg',
    resolution: '250m',
    category: 'visual',
    icon: '🛰️',
  },

  // Infrared Layers (Better for fire detection)
  {
    id: 'terra-bands721',
    name: 'False Color (Bands 7-2-1)',
    description: 'Infrared false color - fires appear bright red/orange',
    baseUrl: 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=MODIS_Terra_CorrectedReflectance_Bands721&version=1.3.0&crs=EPSG:4326&transparent=false&width=2048&height=1024&bbox=-90,-180,90,180&format=image/jpeg',
    resolution: '250m',
    category: 'infrared',
    icon: '🔥',
  },
  {
    id: 'aqua-bands721',
    name: 'False Color Aqua (Bands 7-2-1)',
    description: 'Infrared false color from Aqua - excellent for fire visualization',
    baseUrl: 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=MODIS_Aqua_CorrectedReflectance_Bands721&version=1.3.0&crs=EPSG:4326&transparent=false&width=2048&height=1024&bbox=-90,-180,90,180&format=image/jpeg',
    resolution: '250m',
    category: 'infrared',
    icon: '🔥',
  },
  {
    id: 'viirs-bands-m11-i2-i1',
    name: 'VIIRS False Color',
    description: 'VIIRS infrared composite - fires and hot spots highlighted',
    baseUrl: 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=VIIRS_SNPP_CorrectedReflectance_BandsM11-I2-I1&version=1.3.0&crs=EPSG:4326&transparent=false&width=2048&height=1024&bbox=-90,-180,90,180&format=image/jpeg',
    resolution: '250m',
    category: 'infrared',
    icon: '🌡️',
  },

  // Terrain and Topography
  {
    id: 'blue-marble',
    name: 'Blue Marble',
    description: 'NASA Blue Marble - high-resolution Earth imagery',
    baseUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default',
    resolution: '500m',
    category: 'terrain',
    icon: '🗺️',
  },
  {
    id: 'shaded-relief',
    name: 'Shaded Relief',
    description: 'Terrain with shaded relief showing elevation',
    baseUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/ASTER_GDEM_Greyscale_Shaded_Relief/default',
    resolution: '1km',
    category: 'terrain',
    icon: '⛰️',
  },

  // Environmental Layers
  {
    id: 'landsat-truecolor',
    name: 'Landsat 8 True Color',
    description: 'High-resolution Landsat 8 imagery',
    baseUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual/default',
    resolution: '30m',
    category: 'environmental',
    icon: '📡',
  },
  {
    id: 'night-lights',
    name: 'Earth at Night',
    description: 'VIIRS Day/Night Band - city lights and fires at night',
    baseUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/VIIRS_Black_Marble/default',
    resolution: '500m',
    category: 'environmental',
    icon: '🌃',
  },
];

/**
 * Get layer URL for a specific date
 * Uses WMS service which provides full coverage without black bars
 */
export const getLayerUrl = (layer: GlobeLayer, date: string, zoomLevel: number = 1): string => {
  // Calculate resolution based on zoom level
  // Base: 2048x1024, increases with zoom
  const baseWidth = 2048;
  const baseHeight = 1024;
  
  // Increase resolution with zoom (max 4x for performance)
  const scale = Math.min(zoomLevel, 4);
  const width = Math.floor(baseWidth * scale);
  const height = Math.floor(baseHeight * scale);
  
  // Replace width and height in the URL
  let url = layer.baseUrl.replace(/width=\d+/, `width=${width}`);
  url = url.replace(/height=\d+/, `height=${height}`);
  
  // Add time parameter
  return `${url}&time=${date}`;
};

/**
 * Get layer URL with custom bounding box for regional zoom
 * Allows fetching higher resolution for specific areas
 */
export const getLayerUrlWithBounds = (
  layer: GlobeLayer, 
  date: string, 
  bounds: { minLat: number; minLon: number; maxLat: number; maxLon: number },
  width: number = 2048,
  height: number = 1024
): string => {
  const { minLat, minLon, maxLat, maxLon } = bounds;
  
  // Replace bbox in the URL
  let url = layer.baseUrl.replace(
    /bbox=-?\d+,-?\d+,-?\d+,-?\d+/, 
    `bbox=${minLat},${minLon},${maxLat},${maxLon}`
  );
  
  // Replace dimensions
  url = url.replace(/width=\d+/, `width=${width}`);
  url = url.replace(/height=\d+/, `height=${height}`);
  
  // Add time parameter
  return `${url}&time=${date}`;
};

/**
 * Get layers by category
 */
export const getLayersByCategory = (category: GlobeLayer['category']): GlobeLayer[] => {
  return GLOBE_LAYERS.filter(layer => layer.category === category);
};

/**
 * Get default layer (best for fire visualization)
 */
export const getDefaultLayer = (): GlobeLayer => {
  return GLOBE_LAYERS.find(layer => layer.id === 'terra-bands721') || GLOBE_LAYERS[0];
};

/**
 * Recommended layers for fire detection visualization
 */
export const FIRE_DETECTION_LAYERS = [
  'terra-bands721',
  'aqua-bands721',
  'viirs-bands-m11-i2-i1',
  'terra-truecolor',
];

/**
 * Layer categories for UI organization
 */
export const LAYER_CATEGORIES = {
  visual: {
    name: 'Visual Spectrum',
    description: 'Natural color satellite imagery',
    icon: '👁️',
  },
  infrared: {
    name: 'Infrared / Fire Detection',
    description: 'False color imagery optimized for fire and heat detection',
    icon: '🔥',
  },
  terrain: {
    name: 'Terrain & Topography',
    description: 'Elevation and terrain features',
    icon: '🗺️',
  },
  environmental: {
    name: 'Environmental',
    description: 'Specialized environmental monitoring layers',
    icon: '🌱',
  },
} as const;
