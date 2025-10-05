import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SplitText } from '@atoms/SplitText';
import { ScrollButton } from '@atoms/ScrollButton';
import { ServiceWorkerStatus } from '@atoms/ServiceWorkerStatus';
import { useSnapScroll, useIntersectionObserver } from '@/hooks';

import backgroundHome from '../../assets/images/background_home.jpg';

interface HomePageProps {
  onStartExperience?: () => void;
}

/**
 * HomePage - Página principal com Tailwind
 * Storytelling: Terra como "médico" examinando a saúde do planeta
 */

export const HomePage = ({ onStartExperience }: HomePageProps = {}) => {
  const navigate = useNavigate();
  const adventureSectionRef = useRef<HTMLDivElement>(null);
  const [experienceStarted, setExperienceStarted] = useState(false);

  // Ativa o scroll snap e bloqueia o scroll livre
  useSnapScroll({ preventScroll: true });
  
  // Detecta quando a seção de aventura está visível
  const isAdventureSectionVisible = useIntersectionObserver(adventureSectionRef, 0.6);

  const handleStartExperience = () => {
    setExperienceStarted(true);
    if (onStartExperience) {
      onStartExperience();
    }
  };

  const scrollToAdventure = () => {
    adventureSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    const heroSection = document.querySelector('#hero-section');
    heroSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Service Worker Cache Status */}
      <ServiceWorkerStatus />
      
      {/* Hero Section */}
      <div 
        id="hero-section"
        style={{ 
          backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 128, 0.5), rgba(0, 0, 128, 0.5)), url(${backgroundHome})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="min-h-screen relative snap-start"
      >
        {/* Content */}
        <div className="relative flex min-h-screen items-center justify-center">
          <main className="w-full">
            <div className="mx-auto max-w-3xl px-4">
              <div className="text-center space-y-6">
                {/* Start Button - Mostra antes de iniciar */}
                <AnimatePresence>
                  {!experienceStarted && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.5 } }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="flex items-center justify-center min-h-[50vh]"
                    >
                      <button
                        onClick={handleStartExperience}
                        className="group relative px-12 py-6 bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/30 hover:border-white/50 rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl"
                      >
                        <span className="text-white font-spartan font-bold text-2xl tracking-widest">
                          START EXPERIENCE
                        </span>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Título e Subtítulo - Aparece após clicar */}
                <AnimatePresence>
                  {experienceStarted && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <motion.h1 
                        className="font-spartan tracking-[1rem] text-7xl font-bold text-white drop-shadow-lg"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      >
                        <SplitText delay={0.7} stagger={0.08}>
                          A.T.L.A.S.
                        </SplitText>
                      </motion.h1>
                      <motion.p 
                        className="font-poppins text-xl text-white/95 font-light tracking-wide max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.8 }}
                      >
                        <SplitText delay={1.9} stagger={0.02} duration={0.4}>
                          Assessment of Terra's Legacy & Atmospheric Signs
                        </SplitText>
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Scroll Button - Aparece apenas após iniciar */}
              <AnimatePresence>
                {experienceStarted && (
                  <motion.div 
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.5 }}
                  >
                    <ScrollButton onClick={scrollToAdventure} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      {/* Adventure Section */}
      <div 
        ref={adventureSectionRef}
        style={{ 
          backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 128, 0.5), rgba(0, 0, 128, 0.5)), url(${backgroundHome})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="min-h-screen relative flex items-center justify-center overflow-hidden snap-start"
      >
        <button
          onClick={scrollToTop}
          className="absolute top-8 left-1/2 -translate-x-1/2 group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-3 transition-all duration-300 z-10"
          aria-label="Voltar ao topo"
        >
          <svg
            className="w-5 h-5 text-white transition-transform duration-300 group-hover:-translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-1000"
          style={{ 
            transitionDelay: '1200ms',
            opacity: isAdventureSectionVisible ? 1 : 0,
            transform: isAdventureSectionVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(20px)'
          }}
        >
          <button
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full py-4 px-8 transition-all duration-300 flex items-center gap-2"
              onClick={() => navigate('/satellite')}
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