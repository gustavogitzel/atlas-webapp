import { useState, useEffect, useRef } from 'react';
import { getLayerUrl, GLOBE_LAYERS } from '@/config/globeLayers';

// Global cache to store preloaded images (persists across component remounts)
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Hook to preload all images needed for the Fire Tour
 * Preloads images for specific dates used in the tour
 * Stores images in memory cache for instant access
 */
export const useFireTourPreload = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const cacheRef = useRef(imageCache);

  useEffect(() => {
    const preloadImages = async () => {
      // All dates used in the Fire Tour
      const tourDates = [
        '2004-07-22', '2004-07-27', '2004-08-01', '2004-08-06', '2004-08-11', '2004-08-16',
        '2004-08-21', '2004-08-26', '2004-08-31',
        '2004-09-05', '2004-09-10', '2004-09-15', '2004-09-20', '2004-09-25', '2004-09-30',
        '2004-10-05', '2004-10-10', '2004-10-15', '2004-10-20', '2004-10-25', '2004-10-30',
        '2004-11-04', '2004-11-09', '2004-11-14', '2004-11-19', '2004-11-24', '2004-11-29',
        '2004-12-04'
      ];

      // Generate all URLs
      const urls: string[] = [];
      
      // Get layer objects
      const trueColorLayer = GLOBE_LAYERS.find(l => l.id === 'terra-truecolor')!;
      const blueMarbleLayer = GLOBE_LAYERS.find(l => l.id === 'blue-marble')!;
      
      // True Color images for all dates
      tourDates.forEach(date => {
        const url = getLayerUrl(trueColorLayer, date, 1);
        urls.push(url);
      });

      // Blue Marble for CO overlay dates
      const coDates = ['2004-07-22', '2004-08-22', '2004-09-22', '2004-10-22', '2004-11-22', '2004-12-04'];
      coDates.forEach(date => {
        const url = getLayerUrl(blueMarbleLayer, date, 1);
        urls.push(url);
      });

      // CO overlay URLs
      coDates.forEach(date => {
        const formattedDate = date;
        const baseUrl = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi';
        const params = new URLSearchParams({
          service: 'WMS',
          request: 'GetMap',
          version: '1.3.0',
          layers: 'AIRS_L2_Carbon_Monoxide_500hPa_Day',
          crs: 'EPSG:4326',
          width: '2048',
          height: '1024',
          bbox: '-90,-180,90,180',
          format: 'image/png',
          time: formattedDate
        });
        urls.push(`${baseUrl}?${params.toString()}`);
      });

      console.log(`🔥 Preloading ${urls.length} images for Fire Tour...`);

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
      console.log(`✅ Fire Tour preload complete! ${cacheRef.current.size} images in cache`);
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
export const getCachedImageUrl = (url: string): string => {
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
export const isImageCached = (url: string): boolean => {
  return imageCache.has(url);
};
