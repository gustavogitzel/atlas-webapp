import { TourStep } from '@organisms/GuidedTour';

/**
 * Fire Globe Tour - Amazon Rainforest Fire Story
 * A narrative journey through the Amazon's struggle with fires
 */

export const createFireGlobeTour = (
  _setIsStatsCollapsed: (value: boolean) => void,
  _setIsRegionCollapsed: (value: boolean) => void,
  setIsTimelineCollapsed: (value: boolean) => void,
  _setHighlightedPointIndex: ((value: number | null) => void) | undefined,
  setCurrentDateIndex: (value: number) => void,
  setVisualizationMode: (value: 'points' | 'heatmap') => void,
  setSelectedLayerId: (value: string) => void,
  setShowCOLayer: (value: boolean) => void,
  setTimeGrouping: (value: 'daily' | '5-days' | 'weekly' | 'monthly') => void,
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

  // Step 1: Introduction - Amazon Rainforest (22-JUL-2004)
  {
    id: 'amazon-intro',
    title: '🛰️ Terra Satellite',
    description: "Let's put these tools to work. Our first stop: the Amazon rainforest — the lungs of our planet.",
    showOverlay: false,
    showSpotlight: false,
    action: () => {
      // Setup: 22-JUL-2004, True Color, Points ON, No overlays, 5-days grouping
      setSelectedLayerId('terra-truecolor');
      setVisualizationMode('points');
      setShowCOLayer(false);
      setTimeGrouping('5-days'); // Set to 5-days as per requirements
      setCurrentDateIndex(findDateIndex('2004-07-22'));
      
      // Open timeline control
      setIsTimelineCollapsed(false);
      
      // Position camera on Amazon with closer zoom
      if (globeRef.current) {
        globeRef.current.pointOfView({
          lat: -5.4326,
          lng: -59.8870,
          altitude: 1.5, // Closer zoom to focus on Amazon
        }, 2000);
      }
    },
  },

  // Step 2: Evolution to 16-AUG-2004 (smoke appears)
  {
    id: 'smoke-appears',
    title: '🛰️ Terra Satellite',
    description: "Lately, I've seen it struggle to breathe. My MODIS eye reveals these hazy clouds are not rain, but smoke, scarring the green landscape.",
    showOverlay: false,
    showSpotlight: false,
    action: () => {
      // Jump to 16-AUG-2004
      setCurrentDateIndex(findDateIndex('2004-08-16'));
    },
  },

  // Step 3: Evolution to 31-AUG-2004 (gaps explanation)
  {
    id: 'gaps-explanation',
    title: '🛰️ Terra Satellite',
    description: "You might notice gaps in my daily view. As I fly my orbit, I see the world in long strips, like snapshots in time.",
      showOverlay: false,
    showSpotlight: false,
    action: () => {
      // Jump to 31-AUG-2004
      setCurrentDateIndex(findDateIndex('2004-08-31'));
    },
  },

  // Step 4: Fire points focus
  {
    id: 'fire-points-focus',
    title: '🛰️ Terra Satellite',
    description: "But look closer. These points of light are the fires themselves—each one a fever on the surface.",
      showOverlay: false,
    showSpotlight: false,
    target: 'div.globe-container',
    position: 'top',
  },

  // Step 5: Evolution to 04-DEC-2004 (MOPITT introduction)
  {
    id: 'mopitt-intro',
    title: '🛰️ Terra Satellite',
    description: "And with my MOPITT 'sniffer', we can see the invisible wound: the pollution left behind in the smoke. Let's turn it on and go back in time.",
      showOverlay: false,
    showSpotlight: false,
    action: () => {
      // Jump to 04-DEC-2004
      setCurrentDateIndex(findDateIndex('2004-12-04'));
    },
  },

  // Step 6: Back to 22-JUL-2004 with CO overlay
  {
    id: 'co-overlay-on',
    title: '🛰️ Terra Satellite',
    description: "Over the months, we can see this red spot come and go. It means the air is dirty.",
      showOverlay: false,
    showSpotlight: false,
    action: () => {
      // Back to 22-JUL-2004, Blue Marble, Points OFF, CO ON
      setSelectedLayerId('blue-marble');
      setVisualizationMode('heatmap'); // Turn off points
      setShowCOLayer(true);
      setCurrentDateIndex(findDateIndex('2004-07-22'));
    },
  },

  // Step 7: Monthly evolution - 22-AUG-2004
  {
    id: 'co-aug',
    title: '🛰️ Terra Satellite',
    description: "Watching the carbon monoxide spread across the months...",
    showOverlay: false,
    showSpotlight: false,
    action: () => {
      setCurrentDateIndex(findDateIndex('2004-08-22'));
    },
  },

  // Step 8: Monthly evolution - 22-SEP-2004
  {
    id: 'co-sep',
    title: '🛰️ Terra Satellite',
    description: "The pollution continues to build...",
    showOverlay: false,
    showSpotlight: false,
    action: () => {
      setCurrentDateIndex(findDateIndex('2004-09-22'));
    },
  },

  // Step 9: Monthly evolution - 22-OCT-2004
  {
    id: 'co-oct',
    title: '🛰️ Terra Satellite',
    description: "Month after month, the pattern persists...",
    showOverlay: false,
    showSpotlight: false,
    action: () => {
      setCurrentDateIndex(findDateIndex('2004-10-22'));
    },
  },

  // Step 10: Monthly evolution - 22-NOV-2004
  {
    id: 'co-nov',
    title: '🛰️ Terra Satellite',
    description: "The invisible wound grows...",
    showOverlay: false,
    showSpotlight: false,
    action: () => {
      setCurrentDateIndex(findDateIndex('2004-11-22'));
    },
  },
  // Step 11: Final - 04-DEC-2004
  {
    id: 'final-message',
    title: '🛰️ Terra Satellite',
    description: "It's a heavy thing to witness... but seeing is the first step to healing.",
    showOverlay: false,
    showSpotlight: false,
    action: () => {
      setCurrentDateIndex(findDateIndex('2004-12-04'));
    },
  },
  
  // Step 12: Next Story - Flood Globe
  {
    id: 'next-story',
    title: '🌊 Continue the Journey',
    description: "But this is not the only story I have to tell. In 2024, I witnessed another tragedy unfold—the devastating floods in Rio Grande do Sul, Brazil. Would you like to see what happened there?",
    showOverlay: true,
    showSpotlight: false,
  },
];
};
