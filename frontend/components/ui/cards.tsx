'use client';

import { useEffect, useRef, useState, ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Glass Card Component
interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-card',
        hover && 'transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Fluid Glass Card (more dynamic)
interface FluidGlassProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function FluidGlass({ children, className, ...props }: FluidGlassProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-xl border border-white/10',
        'bg-dark-lighter/50 backdrop-blur-md',
        'transition-all duration-300 hover:border-white/20',
        className
      )}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* Fluid gradient that follows mouse */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

// Spotlight Card Component
interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  spotlightColor?: string;
}

export function SpotlightCard({ 
  children, 
  className, 
  spotlightColor = 'rgba(59, 130, 246, 0.3)',
  ...props 
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-xl border border-white/10',
        'bg-dark-lighter/80 backdrop-blur-sm',
        'transition-all duration-300',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute transition-opacity duration-300"
        style={{
          width: 200,
          height: 200,
          left: position.x - 100,
          top: position.y - 100,
          background: `radial-gradient(circle, ${spotlightColor} 0%, transparent 70%)`,
          opacity: isHovering ? 1 : 0,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Reflective Card Component
interface ReflectiveCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function ReflectiveCard({ children, className, ...props }: ReflectiveCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / 20;
    const y = -(e.clientX - rect.left - rect.width / 2) / 20;
    setRotation({ x, y });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl border border-white/10',
        'bg-gradient-to-br from-dark-lighter to-dark',
        'shadow-xl transition-transform duration-300 ease-out',
        'hover:shadow-2xl hover:shadow-primary/20',
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Reflection overlay */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-30"
        style={{
          background: `linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.1) 45%, transparent 50%)`,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Metallic Card Component
interface MetallicCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function MetallicCard({ children, className, ...props }: MetallicCardProps) {
  return (
    <div
      className={cn(
        'metallic rounded-xl border border-white/10 p-6',
        'transition-all duration-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Star Border Card (for breached services)
interface StarBorderCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  color?: string;
  pulsing?: boolean;
}

export function StarBorderCard({ 
  children, 
  className, 
  color = '#DC2626',
  pulsing = true,
  ...props 
}: StarBorderCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden',
        pulsing && 'breach-pulse',
        className
      )}
      style={{
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}40`,
      }}
      {...props}
    >
      {/* Animated border */}
      <div 
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}80, ${color})`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite',
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div className="relative bg-dark-lighter rounded-xl">
        {children}
      </div>
    </div>
  );
}

// Magic Bento Grid
interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]',
      className
    )}>
      {children}
    </div>
  );
}

interface BentoItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2;
}

export function BentoItem({ children, className, colSpan = 1, rowSpan = 1, ...props }: BentoItemProps) {
  return (
    <SpotlightCard
      className={cn(
        'p-6',
        colSpan === 2 && 'md:col-span-2',
        colSpan === 3 && 'md:col-span-2 lg:col-span-3',
        colSpan === 4 && 'md:col-span-2 lg:col-span-4',
        rowSpan === 2 && 'row-span-2',
        className
      )}
      {...props}
    >
      {children}
    </SpotlightCard>
  );
}

// Stack Component (for service lists)
interface StackProps {
  children: ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

export function Stack({ children, className, gap = 'md' }: StackProps) {
  const gapClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
  };

  return (
    <div className={cn(gapClasses[gap], className)}>
      {children}
    </div>
  );
}
