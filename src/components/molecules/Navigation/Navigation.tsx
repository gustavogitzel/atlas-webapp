import { Link, useLocation } from 'react-router-dom';
import { Home, Globe } from 'lucide-react';

/**
 * Navigation Component
 * Barra de navegação entre páginas
 */

export const Navigation = () => {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/fire-globe', label: 'Fire Globe', icon: Globe },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[10003] bg-black/80 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex gap-2">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.path;
        
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              isActive
                ? 'bg-blue-500 text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium hidden md:inline">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
