import type { TourStep } from '@organisms/GuidedTour';
import floodA16 from '@/assets/audios/flood_A16.mp3';
import floodA17 from '@/assets/audios/flood_A17.mp3';
import floodA18 from '@/assets/audios/flood_A18.mp3';
import floodA19 from '@/assets/audios/flood_A19.mp3';
import floodA20 from '@/assets/audios/flood_A20.mp3';
import floodA21 from '@/assets/audios/flood_A21.mp3';
import floodA22 from '@/assets/audios/flood_A22.mp3';
import floodA23 from '@/assets/audios/flood_A23.mp3';
import floodA24 from '@/assets/audios/flood_A24.mp3';
import satelliteGif from '@/assets/gifs/Clipper.gif';

/**
 * Flood Globe Tour - Rio Grande do Sul Flood Story
 * A narrative journey    {
      id: 'credits',
      title: '🌍 Thank You',
      description: "I've shared these stories with you for a reason. I can only watch... but you can act. It's your turn now. I'm giving you access to my controls.",
      showOverlay: true,
      showSpotlight: false,
    },h the devastating 2024 floods
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
      id: 'intro',
      title: '🛰️ Terra Satellite',
      description: "In 2024, I saw what this imbalance could create. I saw that river in the sky, aimed at the heart of Southern Brazil... and I watched it become a weapon.",
      audio: floodA16,
      characterImageAnimated: satelliteGif,
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

    // Step 1: Introduction - Andes Mountains (19-APR-2024)
    {
      id: 'andes',
      title: '🛰️ Terra Satellite',
      description: "It began with this giant wall—the Andes mountains, seen here with my ASTER 3D scanner.",
      audio: floodA17,
      characterImageAnimated: satelliteGif,
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
      description: "I then saw the 'river in the sky', born from a wounded Amazon, hit this wall and get funneled straight towards the region.",
      audio: floodA18,
      characterImageAnimated: satelliteGif,
      showOverlay: false,
      showSpotlight: false,
      action: () => {
        setSelectedLayers(['cloud-water-path']);
      },
    },

    // Step 3: 28-APR-2024 - Focus on Rio Grande do Sul
    {
      id: 'rain-evolution',
      title: '🛰️ Terra Satellite',
      description: "For days, the rain fell without stopping.",
      audio: floodA19,
      characterImageAnimated: satelliteGif,
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

    {
      id: 'rain-evolution',
      title: '🛰️ Terra Satellite',
      description: "When the clouds finally cleared, I saw the silent tragedy that remained below.",
      audio: floodA20,
      characterImageAnimated: satelliteGif,
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
      audio: floodA21,
      characterImageAnimated: satelliteGif,
      showOverlay: false,
      showSpotlight: false,
    },

    // Step 8: Credits
    {
      id: 'credits',
      title: '🌍 Thank You',
      description: "I can only record the scars. I cannot stop the tears.",
      audio: floodA22,
      characterImageAnimated: satelliteGif,
      showOverlay: true,
      showSpotlight: false,
    },

    {
      id: 'credits',
      title: '🌍 Thank You',
      description: "I’ve shared these stories with you for a reason. I can only watch... but you can act. It’s your turn now. I’m giving you access to my controls.",
      audio: floodA23,
      characterImageAnimated: satelliteGif,
      showOverlay: true,
      showSpotlight: false,
    },

    {
      id: 'credits',
      title: '🌍 Thank You',
      description: "You are now a Planet Guardian. Explore. Discover. If you find something important, save your story and share it. The more of us who are watching, the better we can protect our beautiful, fragile home.",
      audio: floodA24,
      characterImageAnimated: satelliteGif,
      showOverlay: true,
      showSpotlight: false,
    },
  ];
};
