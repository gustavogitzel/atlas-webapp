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
  console.log('🎨 [TextureComposer] Starting composition...');
  console.log('📍 Base URL:', baseUrl.substring(0, 100) + '...');
  console.log('📍 Overlay URL:', overlayUrl?.substring(0, 100) + '...');
  console.log('📍 Opacity:', overlayOpacity);
  
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('❌ [TextureComposer] Failed to get canvas context');
      resolve(baseUrl);
      return;
    }

    // Load base image
    const baseImg = new Image();
    baseImg.crossOrigin = 'anonymous';

    baseImg.onload = () => {
      console.log('✅ [TextureComposer] Base image loaded:', baseImg.width, 'x', baseImg.height);
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;

      // Draw base image
      ctx.drawImage(baseImg, 0, 0);

      // If no overlay, return base
      if (!overlayUrl) {
        console.log('✅ [TextureComposer] No overlay, returning base');
        resolve(canvas.toDataURL('image/jpeg', 0.9));
        return;
      }

      // Load and draw overlay
      const overlayImg = new Image();
      overlayImg.crossOrigin = 'anonymous';

      overlayImg.onload = () => {
        console.log('✅ [TextureComposer] Overlay image loaded:', overlayImg.width, 'x', overlayImg.height);
        // Set overlay opacity
        ctx.globalAlpha = overlayOpacity;
        ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;

        const result = canvas.toDataURL('image/jpeg', 0.9);
        console.log('✅ [TextureComposer] Composition complete! Result length:', result.length);
        resolve(result);
      };

      overlayImg.onerror = (error) => {
        console.error('❌ [TextureComposer] Overlay image failed to load:', error);
        console.error('❌ Failed URL:', overlayUrl);
        // If overlay fails, return base
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };

      console.log('📥 [TextureComposer] Loading overlay image...');
      overlayImg.src = overlayUrl;
    };

    baseImg.onerror = (error) => {
      console.error('❌ [TextureComposer] Base image failed to load:', error);
      console.error('❌ Failed URL:', baseUrl);
      resolve(baseUrl);
    };

    console.log('📥 [TextureComposer] Loading base image...');
    baseImg.src = baseUrl;
  });
};
