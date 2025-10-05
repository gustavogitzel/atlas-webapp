import { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@organisms/HeroSection';
import { AdventureSection } from '@organisms/AdventureSection';
import { useSnapScroll, useIntersectionObserver, useParallax } from '@/hooks';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { useFirePoints } from '@/hooks/useFireData';
import { getLayerUrl, getDefaultLayer } from '@/config/globeLayers';
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
  const adventureSectionRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Preload fire data and images in background
  const { data: fireData } = useFirePoints({ maxPoints: 10000, minConfidence: 0 });
  
  // Generate image URLs for preloading
  const imageUrls = useMemo(() => {
    if (!fireData?.features) return [];
    
    const dates = [...new Set(fireData.features.map((f) => f.properties.acq_date))].sort();
    const layer = getDefaultLayer();
    
    return dates.map(date => getLayerUrl(layer, date, 1));
  }, [fireData]);
  
  // Start preloading images in background
  const { isLoading: imagesLoading, progress: imageProgress } = useImagePreloader(
    imageUrls,
    10,
    undefined,
    undefined
  );
  
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
    navigate('/fire-globe');
  };

  return (
    <div className="relative">
      {/* Discrete Image Preload Indicator */}
      {imagesLoading && imageUrls.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-white font-medium">Preloading imagery</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 bg-gray-700 rounded-full h-1 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 transition-all duration-300"
                    style={{ width: `${imageProgress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{Math.round(imageProgress)}%</span>
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