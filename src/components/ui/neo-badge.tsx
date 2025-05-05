
import React from 'react';
import { cn } from '@/lib/utils';

interface NeoBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const NeoBadge = React.forwardRef<HTMLSpanElement, NeoBadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    
    const variantClasses = {
      default: 'bg-gray-200 text-gray-800',
      primary: 'bg-neo-primary text-white',
      secondary: 'bg-neo-secondary text-white',
      success: 'bg-green-500 text-white',
      warning: 'bg-yellow-500 text-white',
      danger: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white'
    };
    
    const sizeClasses = {
      sm: 'text-xs py-0.5 px-2',
      md: 'text-sm py-1 px-3',
      lg: 'text-base py-1.5 px-4'
    };
    
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

NeoBadge.displayName = 'NeoBadge';

export default NeoBadge;
