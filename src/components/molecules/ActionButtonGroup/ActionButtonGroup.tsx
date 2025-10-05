import { ReactNode } from 'react';

/**
 * ActionButtonGroup Molecule Component
 * Groups action buttons with responsive layout
 */

export interface ActionButtonGroupProps {
  children?: ReactNode;
  isVisible?: boolean;
  className?: string;
}

export const ActionButtonGroup = ({ 
  children, 
  isVisible = true,
  className = '' 
}: ActionButtonGroupProps) => {
  return (
    <div 
      className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1000ms'
      }}
    >
      {children}
    </div>
  );
};
