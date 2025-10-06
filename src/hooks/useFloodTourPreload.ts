import { useState, useEffect, useRef } from 'react';

// Global cache to store preloaded images (persists across component remounts)
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Hook to preload all images needed for the Flood Tour
 * Preloads images for specific dates used in the tour
 * Stores images in memory cache for instant access
 */
export const useFloodTourPreload = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const cacheRef = useRef(imageCache);

  useEffect(() => {
    const preloadImages = async () => {
      // Key dates used in the Flood Tour (only important dates, not all)
      const keyDates = [
        '2024-04-19', // Start
        '2024-04-20',
        '2024-04-22',
        '2024-04-24',
        '2024-04-26',
        '2024-04-28', // Rain peak
        '2024-04-30',
        '2024-05-02',
        '2024-05-05',
        '2024-05-08',
        '2024-05-10',
        '2024-05-12',
        '2024-05-15'  // End
      ];

      // Generate all URLs
      const urls: string[] = [];
      
      // Relief map images for key dates only (generate URL directly)
      keyDates.forEach(date => {
        const url = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=ASTER_GDEM_Color_Shaded_Relief&version=1.3.0&crs=EPSG:4326&transparent=false&width=2048&height=1024&bbox=-90,-180,90,180&format=image/jpeg&time=${date}`;
        urls.push(url);
      });

      console.log(`🌊 Preloading ${urls.length} images for Flood Tour...`);

      // Check if already cached
      const uncachedUrls = urls.filter(url => !cacheRef.current.has(url));
      
      if (uncachedUrls.length === 0) {
        console.log(`✅ All images already in cache!`);
        setProgress(100);
        setIsLoading(false);
        return;
      }

      console.log(`📥 Loading ${uncachedUrls.length} new images...`);

      // Preload all images and store in cache
      let loaded = 0;
      const promises = uncachedUrls.map(url => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          img.onload = () => {
            // Store in cache
            cacheRef.current.set(url, img);
            loaded++;
            setProgress((loaded / uncachedUrls.length) * 100);
            resolve();
          };
          
          img.onerror = () => {
            console.warn(`Failed to load: ${url}`);
            loaded++;
            setProgress((loaded / uncachedUrls.length) * 100);
            resolve(); // Continue even if image fails
          };
          
          img.src = url;
        });
      });

      await Promise.all(promises);
      console.log(`✅ Flood Tour preload complete! ${cacheRef.current.size} images in cache`);
      setIsLoading(false);
    };

    preloadImages();
  }, []);

  return { 
    isLoading, 
    progress,
    cache: cacheRef.current // Expose cache for use in components
  };
};

/**
 * Get cached image URL
 * Returns the cached image if available, otherwise returns the original URL
 */
export const getCachedFloodImageUrl = (url: string): string => {
  const cached = imageCache.get(url);
  if (cached) {
    console.log(`🎯 Using cached image for: ${url.substring(0, 100)}...`);
    return cached.src;
  }
  console.log(`⚠️ Cache miss for: ${url.substring(0, 100)}...`);
  return url;
};

/**
 * Check if image is in cache
 */
export const isFloodImageCached = (url: string): boolean => {
  return imageCache.has(url);
};
