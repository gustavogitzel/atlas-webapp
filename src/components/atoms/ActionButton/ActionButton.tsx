import { ReactNode } from 'react';

/**
 * ActionButton Atom Component
 * Reusable button with glassmorphism design
 */

export interface ActionButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'icon';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isVisible?: boolean;
  delay?: number;
  className?: string;
  title?: string;
}

export const ActionButton = ({ 
  children,
  onClick,
  variant = 'primary',
  icon,
  iconPosition = 'right',
  isVisible = true,
  delay = 0,
  className = '',
  title
}: ActionButtonProps) => {
  const baseClasses = "group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full transition-all duration-300";
  
  const variantClasses = {
    primary: "py-3 px-6 sm:py-4 sm:px-8 flex items-center justify-center gap-2",
    icon: "p-3 sm:p-4"
  };

  return (
    <div 
      className="transform transition-all duration-1000"
      style={{ 
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
      }}
    >
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${className} w-full sm:w-auto`}
        onClick={onClick}
        title={title}
      >
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </button>
    </div>
  );
};
