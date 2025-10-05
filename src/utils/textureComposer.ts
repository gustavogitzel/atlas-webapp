/**
 * Texture Composer Utilities
 * Combines base globe texture with overlay layers
 */

/**
 * Compose globe texture with aerosol overlay
 * @param baseUrl - Base globe image URL
 * @param overlayUrl - Overlay image URL (transparent PNG)
 * @param overlayOpacity - Opacity of overlay (0-1)
 * @returns Data URL of composed image
 */
export const composeGlobeTexture = async (
  baseUrl: string,
  overlayUrl?: string,
  overlayOpacity: number = 0.6
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve(baseUrl);
      return;
    }

    // Load base image
    const baseImg = new Image();
    baseImg.crossOrigin = 'anonymous';

    baseImg.onload = () => {
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;

      // Draw base image
      ctx.drawImage(baseImg, 0, 0);

      // If no overlay, return base
      if (!overlayUrl) {
        resolve(canvas.toDataURL('image/jpeg', 0.9));
        return;
      }

      // Load and draw overlay
      const overlayImg = new Image();
      overlayImg.crossOrigin = 'anonymous';

      overlayImg.onload = () => {
        // Set overlay opacity
        ctx.globalAlpha = overlayOpacity;
        ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;

        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };

      overlayImg.onerror = () => {
        // If overlay fails, return base
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };

      overlayImg.src = overlayUrl;
    };

    baseImg.onerror = () => {
      resolve(baseUrl);
    };

    baseImg.src = baseUrl;
  });
};
