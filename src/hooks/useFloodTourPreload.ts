import { useState, useEffect, useRef } from 'react';
import { getLayerUrl, GLOBE_LAYERS } from '@/config/globeLayers';

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
      // All dates used in the Flood Tour (19-APR-2024 to 15-MAY-2024)
      const tourDates: string[] = [];
      const startDate = new Date('2024-04-19');
      const endDate = new Date('2024-05-15');
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        tourDates.push(d.toISOString().split('T')[0]);
      }

      // Get layer objects
      const reliefLayer = GLOBE_LAYERS.find(l => l.id === 'ASTER_GDEM_Color_Shaded_Relief')!;
      
      // Generate all URLs
      const urls: string[] = [];
      
      // Relief map images for all dates
      tourDates.forEach(date => {
        const url = getLayerUrl(reliefLayer, date, 1);
        urls.push(url);
      });

      // Cloud layers for key dates
      const cloudLayers = [
        'MODIS_Terra_Cloud_Phase_Optical_Properties',
        'MODIS_Terra_Cloud_Optical_Thickness'
      ];
      
      cloudLayers.forEach(layerName => {
        const layer = GLOBE_LAYERS.find(l => l.id === layerName);
        if (layer) {
          tourDates.forEach(date => {
            const url = getLayerUrl(layer, date, 1);
            urls.push(url);
          });
        }
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
