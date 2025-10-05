import type { TourStep } from '@organisms/GuidedTour';

/**
 * Flood Globe Tour - Rio Grande do Sul Flood Story
 * A narrative journey through the devastating 2024 floods
 */
export const createFloodGlobeTour = (
  setCurrentDateIndex: (value: number) => void,
  setSelectedBaseLayer: (value: string) => void,
  setSelectedLayers: (value: string[]) => void,
  globeRef: React.RefObject<any>,
  uniqueDates: string[]
): TourStep[] => {
  // Helper function to find date index
  const findDateIndex = (targetDate: string): number => {
    if (!Array.isArray(uniqueDates) || uniqueDates.length === 0) {
      console.warn('uniqueDates is not available yet');
      return 0;
    }
    const index = uniqueDates.indexOf(targetDate);
    return index !== -1 ? index : 0;
  };

  return [
    // Step 1: Introduction - Andes Mountains (19-APR-2024)
    {
      id: 'andes-intro',
      title: '🛰️ Terra Satellite',
      description: "It began with this giant wall in the sky—the Andes mountains, seen here with my ASTER 3D scanner.",
      showOverlay: false,
      showSpotlight: false,
      action: () => {
        // Setup: 19-APR-2024, Terrain Relief, No overlays
        setSelectedBaseLayer('terrain-relief');
        setSelectedLayers([]);
        setCurrentDateIndex(findDateIndex('2024-04-19'));
        
        // Position camera on South America (Andes view)
        if (globeRef.current) {
          globeRef.current.pointOfView({
            lat: -20.4234,
            lng: -59.3575,
            altitude: 2.0, // Zoom to see all of South America
          }, 2000);
        }
      },
    },

    // Step 2: Atmospheric River - Cloud Water Path ON
    {
      id: 'atmospheric-river',
      title: '🛰️ Terra Satellite',
      description: "I then saw a 'river in the sky', some of it born from the Amazon itself, hit this wall and get funneled straight towards the region.",
      showOverlay: false,
      showSpotlight: false,
      action: () => {
        // Turn on Cloud Water Path overlay
        setSelectedLayers(['cloud-water-path']);
      },
    },

    // Step 3: Evolution to 28-APR-2024
    {
      id: 'rain-evolution',
      title: '🛰️ Terra Satellite',
      description: "For days, the rain fell without stopping.",
      showOverlay: false,
      showSpotlight: false,
      action: () => {
        // Jump to 28-APR-2024 and focus on Rio Grande do Sul
        setCurrentDateIndex(findDateIndex('2024-04-28'));
        
        // Zoom to Rio Grande do Sul
        if (globeRef.current) {
          globeRef.current.pointOfView({
            lat: -29.6898,
            lng: -53.1485,
            altitude: 1.2, // Closer zoom on Rio Grande do Sul
          }, 2000);
        }
      },
    },

    // Step 4: Evolution to 15-MAY-2024
    {
      id: 'flood-peak',
      title: '🛰️ Terra Satellite',
      description: "The water kept rising...",
      showOverlay: false,
      showSpotlight: false,
      action: () => {
        // Jump to 15-MAY-2024
        setCurrentDateIndex(findDateIndex('2024-05-15'));
        // Turn off Cloud Water Path
        setSelectedLayers([]);
      },
    },

    // Step 5: Flood Detection - Turn on Flood 2-Day
    {
      id: 'flood-detection',
      title: '🛰️ Terra Satellite',
      description: "My MODIS eye then saw the rivers swell and spill over. The red you see here is the floodwaters, covering homes, fields, and lives.",
      showOverlay: false,
      showSpotlight: false,
      action: () => {
        // Turn on Flood 2-Day overlay (only available on 15-MAY-2024)
        setSelectedLayers(['flood-2day']);
      },
    },

    // Step 6: Final message
    {
      id: 'final-message',
      title: '🛰️ Terra Satellite',
      description: "This is what climate change looks like from space. But seeing is the first step to understanding, and understanding is the first step to action.",
      showOverlay: false,
      showSpotlight: false,
      action: () => {
        // Turn off all overlays
        setSelectedLayers([]);
      },
    },
  ];
};
