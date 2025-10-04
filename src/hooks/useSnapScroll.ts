import { useEffect, useCallback } from 'react';

interface UseSnapScrollOptions {
  preventScroll?: boolean;
}

const smoothScroll = (target: number, duration: number) => {
  const start = window.pageYOffset;
  const distance = target - start;
  let startTime: number | null = null;

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Easing function for smoother animation
    const ease = (t: number) => t < 0.5 
      ? 2 * t * t 
      : -1 + (4 - 2 * t) * t;

    window.scrollTo(0, start + distance * ease(progress));

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

export const useSnapScroll = (options: UseSnapScrollOptions = {}) => {
  // Check for native smooth scroll support
  const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
  
  const scrollTo = useCallback((target: number, smooth = true) => {
    if (smooth && !supportsNativeSmoothScroll) {
      smoothScroll(target, 800);
    } else {
      window.scrollTo({
        top: target,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }, [supportsNativeSmoothScroll]);

  useEffect(() => {
    let lastScrollTop = 0;
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;
    const threshold = 30;
    
    if (options.preventScroll) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden'; // for Firefox
      document.body.style.height = '100vh';
    }

    const handleScroll = () => {
      if (isScrolling) return;

      const currentScrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
      const scrollDiff = Math.abs(currentScrollTop - lastScrollTop);

      // Apenas processa se houver diferença significativa no scroll
      if (scrollDiff > threshold) {
        isScrolling = true;
        const targetScrollTop = scrollDirection === 'down' ? windowHeight : 0;

        // Limpa timeout anterior
        clearTimeout(scrollTimeout);
        
        // Atualiza lastScrollTop antes do scroll
        lastScrollTop = targetScrollTop;
        
        scrollTo(targetScrollTop);

        scrollTimeout = setTimeout(() => {
          isScrolling = false;
          
          // Garante alinhamento preciso
          if (Math.abs(window.pageYOffset - targetScrollTop) > 1) {
            scrollTo(targetScrollTop, false);
          }
        }, 800);
      }
    };

    // Adiciona listeners com passive true para melhor performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (options.preventScroll) {
        document.body.style.overflow = 'auto';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      }
    };
  }, [options.preventScroll, scrollTo]);
};