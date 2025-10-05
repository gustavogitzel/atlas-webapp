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
          altitude: 1.2, // Closer zoom to focus on Amazon
        }, 2000);
      }
    },
  },

  // Evolution steps: 22-JUL to 16-AUG-2004 (auto-progress)
  { id: 'evo-jul27', title: '🛰️ Terra Satellite', description: "Watching the fires spread...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 2000, action: () => setCurrentDateIndex(findDateIndex('2004-07-27')) },
  { id: 'evo-aug01', title: '🛰️ Terra Satellite', description: "Day by day, the smoke grows...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 2000, action: () => setCurrentDateIndex(findDateIndex('2004-08-01')) },
  { id: 'evo-aug06', title: '🛰️ Terra Satellite', description: "The fires intensify...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 2000, action: () => setCurrentDateIndex(findDateIndex('2004-08-06')) },
  { id: 'evo-aug11', title: '🛰️ Terra Satellite', description: "More hotspots appear...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 2000, action: () => setCurrentDateIndex(findDateIndex('2004-08-11')) },

  // Step 2: 16-AUG-2004 - Smoke appears
  {
    id: 'smoke-appears',
    title: '🛰️ Terra Satellite',
    description: "Lately, I've seen it struggle to breathe. My MODIS eye reveals these hazy clouds are not rain, but smoke, scarring the green landscape.",
    showOverlay: false,
    showSpotlight: false,
    action: () => setCurrentDateIndex(findDateIndex('2004-08-16')),
  },

  // Evolution: 16-AUG to 31-AUG-2004
  { id: 'evo-aug21', title: '🛰️ Terra Satellite', description: "The haze thickens...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 2000, action: () => setCurrentDateIndex(findDateIndex('2004-08-21')) },
  { id: 'evo-aug26', title: '🛰️ Terra Satellite', description: "Smoke blankets the region...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 2000, action: () => setCurrentDateIndex(findDateIndex('2004-08-26')) },

  // Step 3: 31-AUG-2004 - Gaps explanation
  {
    id: 'gaps-explanation',
    title: '🛰️ Terra Satellite',
    description: "You might notice gaps in my daily view. As I fly my orbit, I see the world in long strips, like snapshots in time.",
    showOverlay: false,
    showSpotlight: false,
    action: () => setCurrentDateIndex(findDateIndex('2004-08-31')),
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

  // Evolution: SEP to DEC-2004 (faster progression)
  { id: 'evo-sep05', title: '🛰️ Terra Satellite', description: "September...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-09-05')) },
  { id: 'evo-sep10', title: '🛰️ Terra Satellite', description: "Fires persist...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-09-10')) },
  { id: 'evo-sep15', title: '🛰️ Terra Satellite', description: "Mid-September...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-09-15')) },
  { id: 'evo-sep20', title: '🛰️ Terra Satellite', description: "Continuing...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-09-20')) },
  { id: 'evo-sep25', title: '🛰️ Terra Satellite', description: "Late September...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-09-25')) },
  { id: 'evo-sep30', title: '🛰️ Terra Satellite', description: "Month's end...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-09-30')) },
  { id: 'evo-oct05', title: '🛰️ Terra Satellite', description: "October...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-10-05')) },
  { id: 'evo-oct10', title: '🛰️ Terra Satellite', description: "Still burning...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-10-10')) },
  { id: 'evo-oct15', title: '🛰️ Terra Satellite', description: "Mid-October...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-10-15')) },
  { id: 'evo-oct20', title: '🛰️ Terra Satellite', description: "Continuing...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-10-20')) },
  { id: 'evo-oct25', title: '🛰️ Terra Satellite', description: "Late October...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-10-25')) },
  { id: 'evo-oct30', title: '🛰️ Terra Satellite', description: "Month's end...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-10-30')) },
  { id: 'evo-nov04', title: '🛰️ Terra Satellite', description: "November...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-11-04')) },
  { id: 'evo-nov09', title: '🛰️ Terra Satellite', description: "Watching...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-11-09')) },
  { id: 'evo-nov14', title: '🛰️ Terra Satellite', description: "Mid-November...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-11-14')) },
  { id: 'evo-nov19', title: '🛰️ Terra Satellite', description: "Fires slow...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-11-19')) },
  { id: 'evo-nov24', title: '🛰️ Terra Satellite', description: "Late November...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-11-24')) },
  { id: 'evo-nov29', title: '🛰️ Terra Satellite', description: "Month's end...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2004-11-29')) },

  // Step 5: 04-DEC-2004 - MOPITT introduction
  {
    id: 'mopitt-intro',
    title: '🛰️ Terra Satellite',
    description: "And with my MOPITT 'sniffer', we can see the invisible wound: the pollution left behind in the smoke. Let's turn it on and go back in time.",
    showOverlay: false,
    showSpotlight: false,
    action: () => setCurrentDateIndex(findDateIndex('2004-12-04')),
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

  // Monthly CO evolution (auto-progress)
  { id: 'co-aug', title: '🛰️ Terra Satellite', description: "August pollution...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 2500, action: () => setCurrentDateIndex(findDateIndex('2004-08-22')) },
  { id: 'co-sep', title: '🛰️ Terra Satellite', description: "September pollution...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 2500, action: () => setCurrentDateIndex(findDateIndex('2004-09-22')) },
  { id: 'co-oct', title: '🛰️ Terra Satellite', description: "October pollution...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 2500, action: () => setCurrentDateIndex(findDateIndex('2004-10-22')) },
  { id: 'co-nov', title: '🛰️ Terra Satellite', description: "November pollution...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 2500, action: () => setCurrentDateIndex(findDateIndex('2004-11-22')) },

  // Step 7: Final - 04-DEC-2004
  {
    id: 'final-message',
    title: '🛰️ Terra Satellite',
    description: "It's a heavy thing to witness... but seeing is the first step to healing.",
    showOverlay: false,
    showSpotlight: false,
    action: () => setCurrentDateIndex(findDateIndex('2004-12-04')),
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
