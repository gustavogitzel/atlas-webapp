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
  // Base Layer - Earth Grey (default)
  {
    id: 'earth-grey',
    name: 'Earth Grey',
    description: 'Simple grey Earth base layer',
    baseUrl: '/src/assets/images/earth-grey.jpg', // Local asset
    resolution: 'static',
    category: 'visual',
    icon: '🌑',
  },

  // Visual Spectrum Layers - Terra only
  {
    id: 'terra-truecolor',
    name: 'True Color (Terra/MODIS)',
    description: 'Natural color satellite imagery from MODIS Terra',
    baseUrl: 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=MODIS_Terra_CorrectedReflectance_TrueColor&version=1.3.0&crs=EPSG:4326&transparent=false&width=2048&height=1024&bbox=-90,-180,90,180&format=image/jpeg',
    resolution: '250m',
    category: 'visual',
    icon: '🌍',
  },

  // Infrared Layers - Terra only (Better for fire detection)
  {
    id: 'terra-bands721',
    name: 'False Color (Bands 7-2-1)',
    description: 'Infrared false color - fires appear bright red/orange',
    baseUrl: 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=MODIS_Terra_CorrectedReflectance_Bands721&version=1.3.0&crs=EPSG:4326&transparent=false&width=2048&height=1024&bbox=-90,-180,90,180&format=image/jpeg',
    resolution: '250m',
    category: 'infrared',
    icon: '🔥',
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
 * Get default layer (Earth Grey)
 */
export const getDefaultLayer = (): GlobeLayer => {
  return GLOBE_LAYERS.find(layer => layer.id === 'earth-grey') || GLOBE_LAYERS[0];
};

/**
 * Recommended layers for fire detection visualization
 * Only Terra satellite layers
 */
export const FIRE_DETECTION_LAYERS = [
  'terra-bands721',
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
} as const;
