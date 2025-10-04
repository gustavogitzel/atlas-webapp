import { useEffect } from 'react';

export const useSnapScroll = () => {
  useEffect(() => {
    let lastScrollTop = 0;
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;
    const threshold = 50; // Reduzido para maior sensibilidade
    const animationDuration = 1200; // Duração aumentada para scroll mais suave

    const handleScroll = () => {
      if (isScrolling) return;

      // Clear any existing timeout
      clearTimeout(scrollTimeout);

      const currentScrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
      const scrollDiff = Math.abs(currentScrollTop - lastScrollTop);

      if (scrollDiff > threshold) {
        isScrolling = true;
        const targetScrollTop = scrollDirection === 'down' ? windowHeight : 0;

        // Força o scroll para a seção completa
        window.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });

        // Aguarda a animação completa antes de permitir novo scroll
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
          lastScrollTop = targetScrollTop;
          
          // Garante que a página está exatamente na posição correta
          window.scrollTo({
            top: targetScrollTop,
            behavior: 'auto'
          });
        }, animationDuration);
      }

      lastScrollTop = currentScrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};