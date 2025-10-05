import { TourStep } from '@organisms/GuidedTour';

/**
 * Fire Globe Tour - Specific guided tour for fire detection visualization
 * Note: action callbacks will be set in FireGlobe component to access state setters
 */

export const createFireGlobeTour = (
  setIsStatsCollapsed: (value: boolean) => void,
  setIsRegionCollapsed: (value: boolean) => void,
  setIsTimelineCollapsed: (value: boolean) => void,
  setHighlightedPointIndex?: (value: number | null) => void
): TourStep[] => [
  // Step 1: Introduction
  {
    id: 'intro',
    title: '🛰️ Hello! I\'m your NASA Guide',
    description: 'Welcome to the NASA Fire Detection Monitor! I\'m here to help you explore real-time fire data from our Terra and Aqua satellites. Let me show you how this works!',
    showOverlay: true,
    showSpotlight: false,
  },

  // Step 2: About Fire Detection
  {
    id: 'about-fires',
    title: '🔥 Understanding Fire Detection',
    description: 'Our satellites detect fires using thermal sensors that measure Fire Radiative Power (FRP). Each point you see represents an active fire detected in the last 24 hours across the Amazon region.',
    showOverlay: true,
    showSpotlight: false,
  },

  // Step 3: Timeline Controls
  {
    id: 'timeline-controls',
    title: '⏱️ Timeline Controls',
    description: 'Use these controls to navigate through time. You can play through historical data, adjust playback speed, and group fires by day, week, or month. Try it out!',
    target: 'div.timeline-controls',
    position: 'top',
    showOverlay: true,
    showSpotlight: true,
    action: () => setIsTimelineCollapsed(false), // Open timeline when focused
  },

  // Step 4: Time Grouping
  {
    id: 'time-grouping',
    title: '📅 Time Grouping',
    description: 'Change how data is aggregated over time. Daily shows individual days, while weekly and monthly group fires together for broader trends.',
    target: 'div.time-grouping',
    position: 'top',
    showOverlay: true,
    showSpotlight: true,
  },

  // Step 5: Region Selector (top right)
  {
    id: 'region-selector',
    title: '🗺️ Region Highlight',
    description: 'Select different regions to highlight specific areas on the globe. This helps you focus on particular geographic zones like the Amazon rainforest.',
    target: '.region-selector-container',
    position: 'left',
    showOverlay: true,
    showSpotlight: true,
    action: () => setIsRegionCollapsed(false), // Open region selector when focused
  },

  // Step 6: Visualization Mode
  {
    id: 'visualization-mode',
    title: '🎨 Visualization Modes',
    description: 'Toggle between 3D points and heatmap view. The heatmap uses advanced algorithms to show fire density and intensity patterns.',
    target: 'button.visualization-toggle',
    position: 'left',
    showOverlay: true,
    showSpotlight: true,
  },

  // Step 7: Fire Points (interactive - requires click)
  {
    id: 'fire-points',
    title: '🖱️ Interactive Fire Points',
    description: 'Each point represents an active fire detection. The height shows Fire Radiative Power (FRP) - taller points mean more intense fires. Click on any point to see detailed information!',
    target: 'div.globe-container',
    position: 'top',
    showOverlay: false, // No overlay so user can see and click points
    showSpotlight: false,
    requiresInteraction: true,
    interactionType: 'click',
    interactionTarget: '.globe-container canvas', // Globe canvas
    action: () => {
      // Highlight a random point (index 5 for consistency)
      if (setHighlightedPointIndex) setHighlightedPointIndex(5);
    },
    onNext: () => {
      // Remove highlight when moving to next step
      if (setHighlightedPointIndex) setHighlightedPointIndex(null);
    },
  },

  // Step 8: Fire Stats
  {
    id: 'fire-stats',
    title: '📊 Fire Statistics',
    description: 'Here you can see real-time statistics including average FRP, confidence levels, and risk assessment. Hover over the help icons for more details!',
    target: '.fire-stats-container',
    position: 'right',
    showOverlay: true,
    showSpotlight: true,
    action: () => setIsStatsCollapsed(false), // Open stats when focused
  },

  // Step 9: Filters
  {
    id: 'filters',
    title: '🔍 Advanced Filters',
    description: 'Open the filter panel to customize what data you see. Filter by satellite, confidence level, and more to focus on specific fire characteristics.',
    target: '.filter-button',
    position: 'left',
    showOverlay: true,
    showSpotlight: true,
  },

  // Step 10: Completion
  {
    id: 'complete',
    title: '🎉 You\'re Ready to Explore!',
    description: 'You now know how to use all the features! Explore the data, discover patterns, and help monitor our planet\'s health. You can restart this tour anytime from the help button.',
    showOverlay: true,
    showSpotlight: false,
  },
];
