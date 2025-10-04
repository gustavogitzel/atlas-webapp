import { FireGlobe } from '@organisms/FireGlobe';

/**
 * FireGlobePage
 * Page component for fire globe visualization
 */

export const FireGlobePage = () => {
  return <FireGlobe maxPoints={10000} minConfidence={0} />;
};
