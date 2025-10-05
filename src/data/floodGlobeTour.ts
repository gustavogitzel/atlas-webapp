import type { TourStep } from '@organisms/GuidedTour';

/**
 * Guided tour steps for Flood Globe visualization
 */
export const createFloodGlobeTour = (): TourStep[] => {
  return [
    {
      id: 'welcome',
      title: 'Welcome to Flood Visualization',
      description: '👋 Welcome! This visualization shows the severe flooding that affected Rio Grande do Sul, Brazil, during April-May 2024. Let me guide you through the features.',
      showOverlay: true,
      showSpotlight: false,
    },
    {
      id: 'base-layer',
      title: 'Terrain Base Layer',
      description: '🗺️ The base layer shows the terrain relief of the region. This static layer helps you understand the topography and elevation, which are crucial factors in flooding.',
      showOverlay: true,
      showSpotlight: false,
    },
    {
      id: 'cloud-layers',
      title: 'Cloud Data Layers',
      description: '☁️ On the right, you can toggle two cloud layers: Cloud Phase (shows cloud types) and Cloud Optical Thickness (shows cloud density). These help visualize the atmospheric conditions during the flood period.',
      target: '.bg-black\\/80.backdrop-blur-md.border.border-white\\/20.rounded-lg.p-4',
      position: 'left',
      showOverlay: true,
      showSpotlight: true,
    },
    {
      id: 'info-button',
      title: 'Flood Information',
      description: 'ℹ️ Click the info button to see detailed information about the flood event, including impacts, affected areas, and statistics.',
      showOverlay: true,
      showSpotlight: false,
    },
    {
      id: 'explore',
      title: 'Explore the Data',
      description: '🌍 You can rotate the globe, zoom in/out, and toggle the cloud layers to explore the atmospheric conditions during this devastating flood event. The visualization covers the period from April 17 to May 15, 2024.',
      showOverlay: true,
      showSpotlight: false,
    },
  ];
};
