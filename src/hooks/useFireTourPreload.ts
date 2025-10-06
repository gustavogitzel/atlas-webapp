import { useState, useEffect } from 'react';
import { getLayerUrl, GLOBE_LAYERS } from '@/config/globeLayers';

/**
 * Hook to preload all images needed for the Fire Tour
 * Preloads images for specific dates used in the tour
 */
export const useFireTourPreload = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

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

      // Preload all images
      let loaded = 0;
      const promises = urls.map(url => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          img.onload = () => {
            loaded++;
            setProgress((loaded / urls.length) * 100);
            resolve();
          };
          
          img.onerror = () => {
            loaded++;
            setProgress((loaded / urls.length) * 100);
            resolve(); // Continue even if image fails
          };
          
          img.src = url;
        });
      });

      await Promise.all(promises);
      console.log(`✅ Fire Tour preload complete!`);
      setIsLoading(false);
    };

    preloadImages();
  }, []);

  return { isLoading, progress };
};
