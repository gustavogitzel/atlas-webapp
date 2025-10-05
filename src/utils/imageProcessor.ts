/**
 * Image Processing Utilities
 * Helper functions to process and crop NASA GIBS imagery
 */

/**
 * Creates a cropped version of the globe texture
 * Removes black bars from top and bottom of GIBS images
 */
export const createCroppedGlobeTexture = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Create canvas with original dimensions
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageUrl); // Fallback to original
        return;
      }

      // Set canvas size (crop 10% from top and bottom)
      const cropPercent = 0.1;
      const sourceY = img.height * cropPercent;
      const sourceHeight = img.height * (1 - 2 * cropPercent);
      
      canvas.width = img.width;
      canvas.height = sourceHeight;

      // Draw cropped image
      ctx.drawImage(
        img,
        0, sourceY,           // Source x, y
        img.width, sourceHeight, // Source width, height
        0, 0,                 // Dest x, y
        img.width, sourceHeight  // Dest width, height
      );

      // Convert to data URL
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.onerror = () => {
      // Fallback to original URL on error
      resolve(imageUrl);
    };

    img.src = imageUrl;
  });
};

/**
 * Simpler approach: Add CSS transform to the globe
 * This is more performant than canvas processing
 */
export const getGlobeImageStyle = () => {
  return {
    // Crop by scaling and positioning
    transform: 'scaleY(0.8)',
    transformOrigin: 'center center',
  };
};
