
import React from 'react';
import { cn } from '@/lib/utils';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const NeoButton = React.forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    
    const variantClasses = {
      primary: 'bg-neo-primary text-white hover:bg-neo-primary/90',
      secondary: 'text-neo-text-primary',
      outline: 'border-2 border-neo-primary text-neo-primary hover:bg-neo-primary/10',
      ghost: 'text-neo-primary hover:bg-neo-primary/10'
    };
    
    const sizeClasses = {
      sm: 'text-xs py-1 px-3',
      md: 'text-sm py-2 px-4',
      lg: 'text-base py-3 px-6'
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          'font-medium rounded-lg transition-all duration-200 focus:outline-none',
          'neo-button disabled:opacity-70 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        <div className="flex items-center justify-center">
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {children}
        </div>
      </button>
    );
  }
);

NeoButton.displayName = 'NeoButton';

export default NeoButton;
