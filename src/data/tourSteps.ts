import { TourStep } from '@organisms/GuidedTour';

/**
 * Guided tour steps configuration
 */

export const FIRE_GLOBE_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: '🌍 Welcome to NASA Fire Monitor!',
    description: 'I\'m your guide! Let me show you how to explore real-time fire data from NASA satellites. This interactive globe displays fire detections across the Amazon region.',
    target: 'body',
    position: 'bottom',
  },
  {
    id: 'fire-stats',
    title: '📊 Fire Cluster Analysis',
    description: 'Here you can see detailed statistics about the current fire detections, including average Fire Radiative Power (FRP), confidence levels, and risk assessment.',
    target: '.fire-stats-container', // Add this class to FireStats
    position: 'right',
  },
  {
    id: 'region-selector',
    title: '🗺️ Region Highlight',
    description: 'Select different regions to highlight specific areas on the globe. This helps you focus on particular geographic zones.',
    target: '.region-selector-container', // Add this class to RegionSelector
    position: 'left',
  },
  {
    id: 'visualization-mode',
    title: '🎨 Visualization Modes',
    description: 'Toggle between 3D points and heatmap view. The heatmap uses Gaussian distribution to show fire density and intensity.',
    target: '.visualization-toggle', // Add this class to Map button
    position: 'left',
  },
  {
    id: 'filters',
    title: '🔍 Filter Options',
    description: 'Open the filter panel to customize what data you see. Filter by satellite, confidence level, and more!',
    target: '.filter-button', // Add this class to Filter button
    position: 'left',
  },
  {
    id: 'timeline',
    title: '⏱️ Timeline Controls',
    description: 'Control the time period you\'re viewing. Play through historical data, adjust speed, and group by day, week, or month.',
    target: '.timeline-controls', // Add this class to TimelineControls
    position: 'top',
  },
  {
    id: 'grouping',
    title: '📅 Time Grouping',
    description: 'Change how data is aggregated over time. View daily snapshots or aggregate data over 5 days, weekly, or monthly periods.',
    target: '.time-grouping', // Add this class to grouping section
    position: 'top',
  },
  {
    id: 'globe-interaction',
    title: '🖱️ Interactive Globe',
    description: 'Click on any fire point to see detailed information. Drag to rotate the globe, scroll to zoom, and explore the data in 3D!',
    target: '.globe-container', // Add this class to Globe container
    position: 'top',
  },
  {
    id: 'complete',
    title: '🎉 You\'re All Set!',
    description: 'You\'re now ready to explore NASA fire data! Remember, you can restart this tour anytime from the help menu. Happy exploring!',
    target: 'body',
    position: 'bottom',
  },
];
