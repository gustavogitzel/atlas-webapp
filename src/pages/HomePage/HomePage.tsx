import { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@organisms/HeroSection';
import { AdventureSection } from '@organisms/AdventureSection';
import { useSnapScroll, useIntersectionObserver, useParallax } from '@/hooks';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { useFirePoints } from '@/hooks/useFireData';
import { getLayerUrl, GLOBE_LAYERS } from '@/config/globeLayers';
import { composeGlobeTexture } from '@/utils/textureComposer';
import type { MediaItem } from '@molecules/MediaGrid';

import backgroundHome from '../../assets/images/background_home.jpg';

/**
 * HomePage - Página principal com Tailwind
 * Storytelling: Terra como "médico" examinando a saúde do planeta
 * Refactored following Atomic Design principles
 */

// Media items data
const MEDIA_ITEMS: MediaItem[] = [
  {
    src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6Y2F2dWF1OXE4MHBxOWF1dWx4NXN0Z2RmOWF1bDV0YnB1aXpmaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3978y5HqiEtqupiM/giphy.gif",
    alt: "Space Adventure 1"
  },
  {
    src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHpmM2RqbWN2ZjB1Y2wzOHYyb2VpN2VoOXBhMzF0ZmZ0bG0xdWx6aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0xezQGU5xCDxyEi4/giphy.gif",
    alt: "Space Adventure 2"
  },
  {
    src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzRxY2kydDVpbjRtdXU1bDgxNmxqZm1yc2ZnYzZ5M2Z5OHR6cWRkeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RHIKETUlUINYvV7CAO/giphy.gif",
    alt: "Space Adventure 3"
  }
];

export const HomePage = () => {
  const navigate = useNavigate();
  const adventureSectionRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  
  // Preload fire data and images in background
  const { data: fireData } = useFirePoints({ maxPoints: 10000, minConfidence: 0 });
  
  // Generate image URLs for preloading (ALL layers + ALL dates)
  const imageUrls = useMemo(() => {
    if (!fireData?.features) return [];
    
    const dates = [...new Set(fireData.features.map((f) => f.properties.acq_date))].sort();
    const allUrls: string[] = [];
    
    // Use imported GLOBE_LAYERS
    GLOBE_LAYERS.forEach((layer) => {
      // Skip earth-grey as it's a local asset
      if (layer.id === 'earth-grey') return;
      
      dates.forEach(date => {
        allUrls.push(getLayerUrl(layer, date, 1));
      });
    });
    
    return allUrls;
  }, [fireData]);
  
  // Generate aerosol overlay URLs for all dates
  const overlayUrls = useMemo(() => {
    if (!fireData?.features) return [];
    
    const dates = [...new Set(fireData.features.map((f) => f.properties.acq_date))].sort();
    
    return dates.map(dateStr => {
      const date = new Date(dateStr);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const formattedDate = lastDay.toISOString().split('T')[0];
      
      const baseUrl = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi';
      const params = new URLSearchParams({
        SERVICE: 'WMS',
        REQUEST: 'GetMap',
        layers: 'MISR_Aerosol_Optical_Depth_Avg_Green_Monthly',
        version: '1.3.0',
        crs: 'EPSG:4326',
        transparent: 'true',
        width: '2048',
        height: '1024',
        bbox: '-90,-180,90,180',
        format: 'image/png',
        time: formattedDate
      });
      
      return `${baseUrl}?${params.toString()}`;
    });
  }, [fireData]);
  
  // Preload images with aerosol composition (all combinations)
  const { isLoading: imagesLoading, progress: imageProgress } = useImagePreloader(
    imageUrls,
    10,
    overlayUrls.length > 0 ? overlayUrls : undefined,
    overlayUrls.length > 0 ? (base, overlay) => composeGlobeTexture(base, overlay, 0.3) : undefined
  );
  
  // Generate flood page image URLs (April 17 - May 15, 2024)
  const floodImageUrls = useMemo(() => {
    const dates: string[] = [];
    const startDate = new Date('2024-04-17');
    const endDate = new Date('2024-05-15');
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    
    const allUrls: string[] = [];
    const floodLayers = [
      'ASTER_GDEM_Color_Shaded_Relief',
      'MODIS_Terra_Cloud_Phase_Optical_Properties',
      'MODIS_Terra_Cloud_Optical_Thickness'
    ];
    
    floodLayers.forEach(layerName => {
      dates.forEach(date => {
        const params = new URLSearchParams({
          SERVICE: 'WMS',
          REQUEST: 'GetMap',
          layers: layerName,
          version: '1.3.0',
          crs: 'EPSG:4326',
          transparent: layerName === 'ASTER_GDEM_Color_Shaded_Relief' ? 'false' : 'true',
          width: '2048',
          height: '1024',
          bbox: '-90,-180,90,180',
          format: layerName === 'ASTER_GDEM_Color_Shaded_Relief' ? 'image/jpeg' : 'image/png',
          time: date,
        });
        allUrls.push(`https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?${params.toString()}`);
      });
    });
    
    return allUrls;
  }, []);
  
  // Preload flood images in background (after fire images)
  const { isLoading: floodImagesLoading, progress: floodImageProgress } = useImagePreloader(floodImageUrls, 5);
  
  // Combined loading state
  const totalImagesLoading = imagesLoading || floodImagesLoading;
  const combinedProgress = imagesLoading 
    ? imageProgress 
    : floodImagesLoading 
      ? floodImageProgress 
      : 100;
  
  // Ativa o scroll snap
  useSnapScroll();
  
  // Parallax effect
  const parallaxOffset = useParallax(0.5);
  
  // Detecta quando a seção de aventura está visível
  const isAdventureSectionVisible = useIntersectionObserver(adventureSectionRef, 0.6);

  const scrollToAdventure = () => {
    adventureSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    heroSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToFireGlobe = () => {
    navigate('/satellite');
  };

  return (
    <div className="relative">
      {/* Discrete Image Preload Indicator */}
      {totalImagesLoading && (imageUrls.length > 0 || floodImageUrls.length > 0) && (
        <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-white font-medium">
                {imagesLoading ? '🔥 Preloading fire imagery' : '🌊 Preloading flood imagery'}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 bg-gray-700 rounded-full h-1 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 transition-all duration-300"
                    style={{ width: `${combinedProgress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{Math.round(combinedProgress)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Fixed Background with Parallax */}
      <div 
        className="fixed inset-0 -z-10"
        style={{ 
          backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 128, 0.5), rgba(0, 0, 128, 0.3)), url(${backgroundHome})`,
          backgroundSize: 'cover',
          backgroundPosition: `center ${parallaxOffset}px`,
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Hero Section */}
      <HeroSection
        ref={heroSectionRef}
        title="A.T.L.A.S."
        subtitle="Assessment of Terra's Legacy & Atmospheric Signs"
        onScrollClick={scrollToAdventure}
      />

      {/* Adventure Section */}
      <AdventureSection
        ref={adventureSectionRef}
        title="PREPARE TO EXPERIENCE"
        description="A journey throughout 25 years of Earth observation"
        mediaItems={MEDIA_ITEMS}
        isVisible={isAdventureSectionVisible}
        onScrollToTop={scrollToTop}
        onPrimaryAction={goToFireGlobe}
        primaryActionLabel="LET'S GO"
      />
    </div>
  );
};