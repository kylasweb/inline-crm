
import React from 'react';
import { cn } from '@/lib/utils';

interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'pressed' | 'convex' | 'concave';
}

const NeoCard = React.forwardRef<HTMLDivElement, NeoCardProps>(
  ({ className, variant = 'flat', children, ...props }, ref) => {
    const variantClasses = {
      flat: 'neo-flat',
      pressed: 'neo-pressed',
      convex: 'neo-convex',
      concave: 'neo-concave'
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'p-6 rounded-xl',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeoCard.displayName = 'NeoCard';

export default NeoCard;
