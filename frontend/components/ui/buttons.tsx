'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

// Electric Border Button
interface ElectricBorderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const ElectricBorderButton = forwardRef<HTMLButtonElement, ElectricBorderButtonProps>(
  ({ children, className, variant = 'primary', size = 'md', isLoading, disabled, ...props }, ref) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isLoading) {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 300);
        props.onClick?.(e);
      }
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const variantColors = {
      primary: '#3B82F6, #8B5CF6, #06B6D4',
      danger: '#EF4444, #DC2626, #F87171',
      success: '#10B981, #059669, #34D399',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'relative font-semibold rounded-lg transition-all duration-300',
          'bg-dark text-light hover:scale-105 active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark',
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        onClick={handleClick}
        {...props}
        style={{
          '--electric-colors': variantColors[variant],
        } as React.CSSProperties}
      >
        {/* Electric border animation */}
        <span 
          className="absolute inset-0 rounded-lg opacity-75"
          style={{
            background: `linear-gradient(90deg, ${variantColors[variant]}, ${variantColors[variant].split(',')[0]})`,
            backgroundSize: '400% 100%',
            animation: 'electric-flow 3s linear infinite',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        
        {/* Click spark effect */}
        {isClicked && (
          <span className="absolute inset-0 rounded-lg animate-ping bg-white/30" />
        )}
        
        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" cy="12" r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                  fill="none"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </>
          ) : children}
        </span>
      </button>
    );
  }
);
ElectricBorderButton.displayName = 'ElectricBorderButton';

// Glass Button
interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ children, className, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'glass font-medium rounded-lg transition-all duration-300',
          'hover:bg-white/10 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
GlassButton.displayName = 'GlassButton';

// Magnet Button (follows cursor slightly)
interface MagnetButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  strength?: number;
}

export const MagnetButton = forwardRef<HTMLButtonElement, MagnetButtonProps>(
  ({ children, className, strength = 0.3, ...props }, ref) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      setPosition({ x, y });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    return (
      <button
        ref={ref}
        className={cn(
          'relative transition-transform duration-200',
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
MagnetButton.displayName = 'MagnetButton';

// Sticker Peel Button (for delete confirmations)
interface StickerPeelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function StickerPeelButton({ children, className, ...props }: StickerPeelButtonProps) {
  const [isPeeling, setIsPeeling] = useState(false);

  return (
    <button
      className={cn(
        'relative overflow-hidden rounded-lg transition-all duration-500',
        isPeeling && 'origin-bottom-left -rotate-12 scale-90 opacity-50',
        className
      )}
      onMouseEnter={() => setIsPeeling(true)}
      onMouseLeave={() => setIsPeeling(false)}
      {...props}
    >
      {/* Peel corner effect */}
      <span 
        className={cn(
          'absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/20 to-transparent',
          'transition-all duration-300',
          isPeeling && 'w-16 h-16'
        )}
        style={{
          clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
        }}
      />
      {children}
    </button>
  );
}
