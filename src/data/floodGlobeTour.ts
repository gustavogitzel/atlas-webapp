import type { TourStep } from '@organisms/GuidedTour';
/**
 * Flood Globe Tour - Rio Grande do Sul Flood Story
 * A narrative journey through the devastating 2024 floods
 */
export const createFloodGlobeTour = (
  setSelectedLayers: (layers: string[]) => void,
  setCurrentDateIndex: (index: number) => void,
  globeRef: React.RefObject<any>,
  uniqueDates: string[],
  setShowComparisonMarker?: (show: boolean) => void
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
        setSelectedLayers([]);
        setCurrentDateIndex(findDateIndex('2024-04-19'));
        
        if (globeRef.current) {
          globeRef.current.pointOfView({
            lat: -20.4234,
            lng: -59.3575,
            altitude: 2.0,
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
        setSelectedLayers(['cloud-water-path']);
      },
    },

    // Evolution: 19-APR to 28-APR-2024 (auto-progress)
    { id: 'evo-apr20', title: '🛰️ Terra Satellite', description: "The atmospheric river flows...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2024-04-20')) },
    { id: 'evo-apr21', title: '🛰️ Terra Satellite', description: "Moisture accumulates...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2024-04-21')) },
    { id: 'evo-apr22', title: '🛰️ Terra Satellite', description: "Day by day...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2024-04-22')) },
    { id: 'evo-apr23', title: '🛰️ Terra Satellite', description: "The pattern continues...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2024-04-23')) },
    { id: 'evo-apr24', title: '🛰️ Terra Satellite', description: "Water vapor flows...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2024-04-24')) },
    { id: 'evo-apr25', title: '🛰️ Terra Satellite', description: "Building up...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2024-04-25')) },
    { id: 'evo-apr26', title: '🛰️ Terra Satellite', description: "Approaching the region...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2024-04-26')) },
    { id: 'evo-apr27', title: '🛰️ Terra Satellite', description: "Almost there...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1500, action: () => setCurrentDateIndex(findDateIndex('2024-04-27')) },

    // Step 3: 28-APR-2024 - Focus on Rio Grande do Sul
    {
      id: 'rain-evolution',
      title: '🛰️ Terra Satellite',
      description: "For days, the rain fell without stopping.",
      showOverlay: false,
      showSpotlight: false,
      action: () => {
        setCurrentDateIndex(findDateIndex('2024-04-28'));
        
        if (globeRef.current) {
          globeRef.current.pointOfView({
            lat: -29.6898,
            lng: -53.1485,
            altitude: 1.2,
          }, 2000);
        }
      },
    },

    // Evolution: 28-APR to 15-MAY-2024 (auto-progress)
    { id: 'evo-apr29', title: '🛰️ Terra Satellite', description: "Rain continues...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-04-29')) },
    { id: 'evo-apr30', title: '🛰️ Terra Satellite', description: "Day after day...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-04-30')) },
    { id: 'evo-may01', title: '🛰️ Terra Satellite', description: "May begins...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-05-01')) },
    { id: 'evo-may02', title: '🛰️ Terra Satellite', description: "Still raining...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-05-02')) },
    { id: 'evo-may03', title: '🛰️ Terra Satellite', description: "Relentless...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-05-03')) },
    { id: 'evo-may04', title: '🛰️ Terra Satellite', description: "No end in sight...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-05-04')) },
    { id: 'evo-may05', title: '🛰️ Terra Satellite', description: "Water accumulates...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-05-05')) },
    { id: 'evo-may06', title: '🛰️ Terra Satellite', description: "Rivers rising...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-05-06')) },
    { id: 'evo-may07', title: '🛰️ Terra Satellite', description: "Week continues...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-05-07')) },
    { id: 'evo-may08', title: '🛰️ Terra Satellite', description: "Still pouring...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-05-08')) },
    { id: 'evo-may09', title: '🛰️ Terra Satellite', description: "Ongoing...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-05-09')) },
    { id: 'evo-may10', title: '🛰️ Terra Satellite', description: "Mid-May...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-05-10')) },
    { id: 'evo-may11', title: '🛰️ Terra Satellite', description: "Continuing...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-05-11')) },
    { id: 'evo-may12', title: '🛰️ Terra Satellite', description: "Water everywhere...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-05-12')) },
    { id: 'evo-may13', title: '🛰️ Terra Satellite', description: "Almost peak...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-05-13')) },
    { id: 'evo-may14', title: '🛰️ Terra Satellite', description: "One more day...", showOverlay: false, showSpotlight: false, autoProgress: true, progressDuration: 1200, action: () => setCurrentDateIndex(findDateIndex('2024-05-14')) },

    // Step 4: 15-MAY-2024 - Turn off overlay
    {
      id: 'flood-peak',
      title: '🛰️ Terra Satellite',
      description: "The water kept rising...",
      showOverlay: false,
      showSpotlight: false,
      action: () => {
        setCurrentDateIndex(findDateIndex('2024-05-15'));
        setSelectedLayers([]);
      },
    },

    // Step 5: Flood Detection - Turn on Flood 2-Day
    {
      id: 'flood-detection',
      title: '🛰️ Terra Satellite',
      description: "My MODIS eye saw the rivers swell and spill over. On my map, these red scars show where the water claimed the land.",
      showOverlay: false,
      showSpotlight: false,
      action: () => {
        setSelectedLayers(['flood-2day']);
      },
    },

    // Step 6: Final message - Zoom to Rio Grande do Sul and show marker
    {
      id: 'final-message',
      title: '🛰️ Terra Satellite',
      description: "This is what climate change looks like from space. But seeing is the first step to understanding, and understanding is the first step to action. Click on the red marker to see the before and after, then click Next when you're ready...",
      showOverlay: false,
      showSpotlight: false,
      action: () => {
        // Keep flood layer active
        setSelectedLayers(['flood-2day']);
        
        // Super zoom on Rio Grande do Sul with flood overlay
        if (globeRef.current) {
          globeRef.current.pointOfView({
            lat: -29.6898,
            lng: -53.1485,
            altitude: 0.3, // Super close zoom to see flood details
          }, 2000);
        }
        
        // Show marker after zoom completes
        setTimeout(() => {
          if (setShowComparisonMarker) {
            setShowComparisonMarker(true);
          }
        }, 2500); // Wait for zoom animation to complete
      },
    },

    // Step 7: Comparison explanation (shown when modal opens)
    {
      id: 'comparison-explanation',
      title: '🛰️ Terra Satellite',
      description: "Move the slider to see the wound the water left behind. This is no longer a river... but a deep, bruised blue sea swallowing the land—a landscape of homes, fields, and lives submerged.",
      showOverlay: true,
      showSpotlight: false,
    },

    // Step 8: Credits
    {
      id: 'credits',
      title: '🌍 Thank You',
      description: "Thank you for joining me on this journey through space and time. These stories are real, and they matter. Want to learn more about the data and technology behind these visualizations?",
      showOverlay: true,
      showSpotlight: false,
    },
  ];
};
