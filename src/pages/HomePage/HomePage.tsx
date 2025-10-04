import { useRef } from 'react';
import { SplitText } from '@atoms/SplitText';
import { ScrollButton } from '@atoms/ScrollButton';
import { useSnapScroll, useIntersectionObserver } from '@/hooks';

import backgroundHome from '../../assets/images/background_home.jpg';
/**
 * HomePage - Página principal com Tailwind
 * Storytelling: Terra como "médico" examinando a saúde do planeta
 */

export const HomePage = () => {
  const adventureSectionRef = useRef<HTMLDivElement>(null);

  // Ativa o scroll snap
  useSnapScroll();
  
  // Detecta quando a seção de aventura está visível
  const isAdventureSectionVisible = useIntersectionObserver(adventureSectionRef, 0.6);

  const scrollToAdventure = () => {
    adventureSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <div 
        style={{ 
          backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 128, 0.5), rgba(0, 0, 128, 0.3)), url(${backgroundHome})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="min-h-screen relative snap-start"
      >
        {/* Content */}
        <div className="relative flex min-h-screen items-center justify-center">
          <main className="w-full">
            <div className="animate-fade-in mx-auto max-w-3xl px-4">
              <div className="text-center space-y-6">
                <h1 className="font-spartan tracking-[1rem] text-7xl font-bold text-white drop-shadow-lg">
                  <SplitText delay={0.2} stagger={0.08}>
                    A.T.L.A.S.
                  </SplitText>
                </h1>
                <p className="font-poppins text-xl text-white/95 font-light tracking-wide max-w-2xl mx-auto">
                  <SplitText delay={1.2} stagger={0.02} duration={0.4}>
                    Assessment of Terra's Legacy & Atmospheric Signs
                  </SplitText>
                </p>
              </div>

              {/* Scroll Button */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <ScrollButton onClick={scrollToAdventure} />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Adventure Section */}
      <div 
        ref={adventureSectionRef}
        style={{ 
          backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 128, 0.5), rgba(0, 0, 128, 0.3)), url(${backgroundHome})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="min-h-screen relative flex items-center justify-center overflow-hidden snap-start"
      >
        <div className="text-center max-w-7xl mx-auto px-4">
          <div 
            className={`transform transition-all duration-1000 ${
              isAdventureSectionVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-20 opacity-0'
            }`}
          >
            <h2 className="text-6xl font-spartan font-bold text-white mb-4">
              <SplitText delay={0.3} stagger={0.08}>
                PREPARE TO EXPERIENCE
              </SplitText>
            </h2>

            <p className="font-poppins text-xl text-white/95 font-light tracking-wide max-w-2xl mx-auto mb-16">
              <SplitText delay={1.2} stagger={0.02} duration={0.4}>
                A journey throughout 25 years of Earth observation
              </SplitText>
            </p>

            {/* GIFs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {[
                "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6Y2F2dWF1OXE4MHBxOWF1dWx4NXN0Z2RmOWF1bDV0YnB1aXpmaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3978y5HqiEtqupiM/giphy.gif",
                "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHpmM2RqbWN2ZjB1Y2wzOHYyb2VpN2VoOXBhMzF0ZmZ0bG0xdWx6aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0xezQGU5xCDxyEi4/giphy.gif",
                "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzRxY2kydDVpbjRtdXU1bDgxNmxqZm1yc2ZnYzZ5M2Z5OHR6cWRkeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RHIKETUlUINYvV7CAO/giphy.gif"
              ].map((gif, index) => (
                <div 
                  key={index}
                  className={`transform transition-all duration-1000 ${
                    isAdventureSectionVisible 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-20 opacity-0'
                  }`}
                  style={{ transitionDelay: `${300 + (index * 200)}ms` }}
                >
                  <img 
                    src={gif}
                    alt={`Space Adventure ${index + 1}`}
                    className="rounded-lg shadow-lg w-full aspect-video object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Let's Go Button */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transform transition-all duration-1000"
          style={{ 
            transitionDelay: '1200ms',
            opacity: isAdventureSectionVisible ? 1 : 0,
            transform: isAdventureSectionVisible ? 'translate(-50%, 0)' : 'translate(-50%, 20px)'
          }}
        >
          <button
            className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full py-4 px-8 transition-all duration-300 flex items-center gap-2"
            onClick={() => window.open('2024.spaceappschallenge.org/', '_blank')}
          >
            <span className="text-white font-spartan font-bold tracking-wider">LET'S GO</span>
            <svg 
              className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};