import { SplitText } from '@atoms/SplitText';

import backgroundHome from '../../assets/images/background_home.jpg';
/**
 * HomePage - Página principal com Tailwind
 * Storytelling: Terra como "médico" examinando a saúde do planeta
 */

export const HomePage = () => {

  return (
    <div 
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} 
      className="min-h-screen relative"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[navy]/50 via-[navy]-900/50 to-[navy]-800/50"></div>
      
      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">

      {/* Main Content */}
      <main className="w-full">
        <div className="animate-fade-in mx-auto max-w-3xl px-4">
          <div className="text-center space-y-6">
            <h1 className="font-display font-[spartan] tracking-[1rem] text-7xl font-bold text-white drop-shadow-lg tracking-tight">
              <SplitText delay={0.2} stagger={0.08}>
                ATLAS
              </SplitText>
            </h1>
            <p className="font-display font-[poppins] text-xl text-white/95 font-light tracking-wide max-w-2xl mx-auto">
              <SplitText delay={1.2} stagger={0.02} duration={0.4}>
                Assessment of Terra's Legacy & Atmospheric Signs
              </SplitText>
            </p>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};
