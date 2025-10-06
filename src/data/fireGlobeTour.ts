import { TourStep } from '@organisms/GuidedTour';
import elli_a09 from '@/assets/audios/elli_a09.mp3';
import elli_a10 from '@/assets/audios/elli_a10.mp3';
import elli_a11 from '@/assets/audios/elli_a11.mp3';
import elli_a12 from '@/assets/audios/elli_a12.mp3';
import elli_a13 from '@/assets/audios/elli_a13.mp3';
import elli_a14 from '@/assets/audios/elli_a14.mp3';
import elli_a15 from '@/assets/audios/elli_a15.mp3';
import satelliteGif from '@/assets/gifs/Clipper.gif';

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
  // Store interval references to clean up
  let activeIntervals: NodeJS.Timeout[] = [];
  let hasExecuted: { [key: string]: boolean } = {};
  
  const clearAllIntervals = () => {
    activeIntervals.forEach(interval => clearInterval(interval));
    activeIntervals = [];
  };

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

  // Step 4: Introduction - Amazon Rainforest (22-JUL-2004)
  {
    id: 'amazon-intro',
    title: '🛰️ Terra Satellite',
    description: "Come. Let's put my senses to work. I want to show you a place vital to us all: the Amazon rainforest, the very lungs of our planet.",
    audio: elli_a09,
    characterImageAnimated: satelliteGif,
    showOverlay: false,
    showSpotlight: false,
    action: () => {
      clearAllIntervals();
      
      // Setup: 22-JUL-2004, True Color, Points ON, No overlays
      setSelectedLayerId('terra-truecolor');
      setVisualizationMode('points');
      setShowCOLayer(false);
      setTimeGrouping('5-days');
      setCurrentDateIndex(findDateIndex('2004-07-22'));

      // Open timeline control
      setIsTimelineCollapsed(false);

      // Position camera on Amazon - zoom to view entire rainforest
      if (globeRef.current) {
        globeRef.current.pointOfView({
          lat: -5.4326,
          lng: -59.8870,
          altitude: 1.5, // Zoom level to view entire Amazon rainforest
        }, 2000);
      }
    },
  },

  // Step 5: The Smoke - Evolve from 22-JUL to 16-AUG-2004
  {
    id: 'smoke-appears',
    title: '🛰️ Terra Satellite',
    description: "In 2004, I watched it struggle to breathe. My MODIS eye reveals these hazy clouds are not rain, but smoke, scarring the green landscape.",
    audio: elli_a10,
    characterImageAnimated: satelliteGif,
    showOverlay: false,
    showSpotlight: false,
    action: (setIsAnimating) => {
      if (hasExecuted['smoke-appears']) return;
      hasExecuted['smoke-appears'] = true;
      
      clearAllIntervals();
      setShowCOLayer(false);
      
      // Block navigation during animation
      if (setIsAnimating) setIsAnimating(true);
      
      // Start evolving through dates every 5 days
      const dates = ['2004-07-27', '2004-08-01', '2004-08-06', '2004-08-11', '2004-08-16'];
      let index = 0;
      
      const interval = setInterval(() => {
        if (index < dates.length) {
          setCurrentDateIndex(findDateIndex(dates[index]));
          index++;
        } else {
          clearInterval(interval);
          // Unblock navigation when animation completes
          if (setIsAnimating) setIsAnimating(false);
        }
      }, 1000);
      
      activeIntervals.push(interval);
    },
  },

  // Step 6: Understanding My View (The Gaps) - Zoom closer
  {
    id: 'gaps-explanation',
    title: '🛰️ Terra Satellite',
    description: "My gaze is not all-seeing. I watch the world in sweeping glances as I pass overhead. Notice the dark gaps between these snapshots in time.",
    audio: elli_a11,
    characterImageAnimated: satelliteGif,
    showOverlay: false,
    showSpotlight: false,
    action: () => {
        setShowCOLayer(false);

      // Zoom closer to see fire points
      if (globeRef.current) {
        globeRef.current.pointOfView({
          lat: -5.4326,
          lng: -59.8870,
          altitude: 0.8, // Closer zoom to see individual fire points
        }, 2000);
      }
    },
  },

  // Step 7 Part 1: The Fever - Fire points focus (with auto-evolution to DEC)
  {
    id: 'fire-fever',
    title: '🛰️ Terra Satellite',
    description: "But look closer. These points of light are the fires themselves—each one a fever on the surface.",
    audio: elli_a12,
    characterImageAnimated: satelliteGif,
    showOverlay: false,
    showSpotlight: false,
    action: (setIsAnimating) => {
      if (hasExecuted['fire-fever']) return;
      hasExecuted['fire-fever'] = true;

      clearAllIntervals();

      setShowCOLayer(false);

      if (setIsAnimating) setIsAnimating(true);

      // Auto-evolve through dates every 5 days from AUG to DEC
      const timeout = setTimeout(() => {
        const dates = [
          '2004-08-21', '2004-08-26', '2004-08-31',
          '2004-09-05', '2004-09-10', '2004-09-15', '2004-09-20', '2004-09-25', '2004-09-30',
          '2004-10-05', '2004-10-10', '2004-10-15', '2004-10-20', '2004-10-25', '2004-10-30',
          '2004-11-04', '2004-11-09', '2004-11-14', '2004-11-19', '2004-11-24', '2004-11-29',
          '2004-12-04'
        ];
        let index = 0;
        const interval = setInterval(() => {
          if (index < dates.length) {
            setCurrentDateIndex(findDateIndex(dates[index]));
            index++;
          } else {
            clearInterval(interval);
            if (setIsAnimating) setIsAnimating(false);
          }
        }, 800);
        activeIntervals.push(interval);
      }, 1500);
      activeIntervals.push(timeout as any);
    },
  },

  // Step 7 Part 2: MOPITT introduction and rewind
  {
    id: 'mopitt-intro',
    title: '🛰️ Terra Satellite',
    description: "And with my MOPITT 'sniffer', we can see the invisible wound—the pollution left in the smoke. Let me switch my view to this sense and rewind the memory. Watch.",
    audio: elli_a13,
    characterImageAnimated: satelliteGif,
    showOverlay: false,
    showSpotlight: false,
    action: () => {
      clearAllIntervals();

      // Back to 22-JUL-2004, Blue Marble, Points OFF, CO ON
      setSelectedLayerId('blue-marble');
      setVisualizationMode('heatmap'); // Turn off points
      setShowCOLayer(true);
      setCurrentDateIndex(findDateIndex('2004-07-22'));
    },
  },

  // Step 7 Part 3: CO evolution through specific months
  {
    id: 'co-evolution',
    title: '🛰️ Terra Satellite',
    description: "It's a heavy thing to witness. But this was more than a single scar…",
    audio: elli_a14,
    characterImageAnimated: satelliteGif,
    showOverlay: false,
    showSpotlight: false,
    action: (setIsAnimating) => {
      if (hasExecuted['co-evolution']) return;
      hasExecuted['co-evolution'] = true;

      clearAllIntervals();

      if (setIsAnimating) setIsAnimating(true);

      // Auto-evolve through monthly CO data
      const timeout = setTimeout(() => {
        const dates = ['2004-08-22', '2004-09-22', '2004-10-22', '2004-11-22', '2004-12-04'];
        let index = 0;
        const interval = setInterval(() => {
          if (index < dates.length) {
            setCurrentDateIndex(findDateIndex(dates[index]));
            index++;
          } else {
            clearInterval(interval);
            if (setIsAnimating) setIsAnimating(false);
          }
        }, 1500);
        activeIntervals.push(interval);
      }, 2500);
      activeIntervals.push(timeout as any);
    },
  },

  // Step 7 Part 4: Final reflection
  {
    id: 'next-story',
    title: '🛰️ Terra Satellite',
    description: "It was a wound I watched reopen for two decades, unbalancing the sky. Now... let me jump forward and show you the consequences.",
    audio: elli_a15,
    characterImageAnimated: satelliteGif,
    showOverlay: false,
    showSpotlight: false,
  },
];
};
