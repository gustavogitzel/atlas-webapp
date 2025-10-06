import { FireGlobe } from '@organisms/FireGlobe';
import { useFireTourPreload } from '@/hooks/useFireTourPreload';
import { useFirePoints, useFireStatistics } from '@/hooks/useFireData';
import { FullPageLoading } from '@molecules/FullPageLoading';

/**
 * FireGlobePage
 * Page component for fire globe visualization with tour image preloading
 */

export const FireGlobePage = () => {
  const { isLoading: loadingImages, progress } = useFireTourPreload();
  const { isLoading: loadingData } = useFirePoints({ maxPoints: 10000, minConfidence: 0 });
  const { isLoading: loadingStats } = useFireStatistics();

  // Show loading for images
  if (loadingImages) {
    return (
      <FullPageLoading
        title="Loading Fire Tour"
        message="Preparing imagery..."
        progress={progress}
        icon="🔥"
      />
    );
  }

  // Show loading for API data
  if (loadingData || loadingStats) {
    return (
      <FullPageLoading
        title="Loading Fire Data"
        message="Fetching fire detection data from NASA..."
        icon="🛰️"
      />
    );
  }

  return <FireGlobe />;
};
