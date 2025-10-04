import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@organisms/HeroSection';
import { AdventureSection } from '@organisms/AdventureSection';
import { useSnapScroll, useIntersectionObserver, useParallax } from '@/hooks';
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