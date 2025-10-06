/**
 * Amazon Region Boundaries
 * Approximate coordinates for the Amazon rainforest region
 */

export interface RegionPolygon {
  name: string;
  coordinates: number[][][]; // GeoJSON Polygon format
  center: [number, number]; // [lat, lon]
  color: string;
  hoverColor: string;
}

/**
 * Amazon Rainforest Region
 * Covers parts of Brazil, Peru, Colombia, Venezuela, Ecuador, Bolivia, Guyana, Suriname, and French Guiana
 */
export const AMAZON_REGION = {
  type: 'Feature',
  properties: {
    name: 'Amazon Rainforest',
    color: 'rgba(34, 139, 34, 0.3)',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        // [longitude, latitude] format
        [-70, 5],      // Northwest
        [-65, 5],      // North
        [-60, 5],      // North Venezuela
        [-55, 3],      // Guyana
        [-50, 0],      // North Brazil
        [-48, -5],     // Northeast Brazil
        [-50, -10],    // East Brazil
        [-57, -15],    // Southeast Brazil
        [-65, -15],    // Bolivia
        [-73, -10],    // Peru/Bolivia
        [-75, -2],     // Peru
        [-70, 5],      // Close polygon
      ],
    ],
  },
};

/**
 * Cerrado Region (Brazilian Savanna)
 */
export const CERRADO_REGION = {
  type: 'Feature',
  properties: {
    name: 'Cerrado (Brazilian Savanna)',
    color: 'rgba(218, 165, 32, 0.3)',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-60, -5], [-50, -5], [-45, -10], [-45, -20],
        [-55, -22], [-60, -18], [-60, -5],
      ],
    ],
  },
};

/**
 * Pantanal Region (Wetlands)
 */
export const PANTANAL_REGION = {
  type: 'Feature',
  properties: {
    name: 'Pantanal (Wetlands)',
    color: 'rgba(64, 164, 223, 0.3)',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-58, -15], [-56, -15], [-55, -18], [-57, -22],
        [-59, -21], [-58, -15],
      ],
    ],
  },
};

/**
 * Atlantic Forest Region
 */
export const ATLANTIC_FOREST_REGION = {
  type: 'Feature',
  properties: {
    name: 'Atlantic Forest',
    color: 'rgba(0, 100, 0, 0.3)',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-48, -23], [-44, -20], [-40, -15], [-35, -8],
        [-38, -12], [-42, -18], [-46, -25], [-48, -23],
      ],
    ],
  },
};

/**
 * Congo Basin Region
 */
export const CONGO_BASIN_REGION = {
  type: 'Feature',
  properties: {
    name: 'Congo Basin',
    color: 'rgba(0, 128, 0, 0.3)',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [10, 5], [30, 5], [30, -5], [25, -10],
        [15, -10], [10, -5], [10, 5],
      ],
    ],
  },
};

/**
 * Southeast Asia Region
 */
export const SOUTHEAST_ASIA_REGION = {
  type: 'Feature',
  properties: {
    name: 'Southeast Asia',
    color: 'rgba(46, 139, 87, 0.3)',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [95, 20], [105, 20], [120, 10], [120, -5],
        [110, -10], [95, -5], [95, 20],
      ],
    ],
  },
};

/**
 * Australia Region
 */
export const AUSTRALIA_REGION = {
  type: 'Feature',
  properties: {
    name: 'Australia',
    color: 'rgba(255, 140, 0, 0.3)',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [113, -10], [153, -10], [153, -43], [113, -43], [113, -10],
      ],
    ],
  },
};

/**
 * All available regions
 */
export const ALL_REGIONS = [
  AMAZON_REGION,
  CERRADO_REGION,
  PANTANAL_REGION,
  ATLANTIC_FOREST_REGION,
  CONGO_BASIN_REGION,
  SOUTHEAST_ASIA_REGION,
  AUSTRALIA_REGION,
];

/**
 * Region options for select dropdown
 */
export const REGION_OPTIONS = [
  { value: 'none', label: 'No Region' },
  { value: 'amazon', label: 'Amazon Rainforest', region: AMAZON_REGION },
];

/**
 * Check if a point is inside the Amazon region
 */
export function isPointInAmazon(lat: number, lon: number): boolean {
  // Simple bounding box check for performance
  const bounds = {
    north: 5,
    south: -15,
    west: -75,
    east: -48,
  };

  return (
    lat >= bounds.south &&
    lat <= bounds.north &&
    lon >= bounds.west &&
    lon <= bounds.east
  );
}

/**
 * Get region name for a point
 */
export function getRegionForPoint(lat: number, lon: number): string | null {
  if (isPointInAmazon(lat, lon)) {
    return 'Amazônia';
  }
  return null;
}
