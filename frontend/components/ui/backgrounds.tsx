'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Aurora Background
interface AuroraBackgroundProps {
  children?: ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function AuroraBackground({ children, className, intensity = 'medium' }: AuroraBackgroundProps) {
  const opacityMap = {
    low: 'opacity-30',
    medium: 'opacity-50',
    high: 'opacity-70',
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Aurora gradient layers */}
      <div className={cn('absolute inset-0 aurora-bg', opacityMap[intensity])} />
      <div 
        className={cn('absolute inset-0', opacityMap[intensity])}
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 30% 10%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 70% 10%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)
          `,
          animation: 'beam 8s ease-in-out infinite',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Dot Grid Background
interface DotGridProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  gap?: number;
}

export function DotGrid({ 
  className, 
  dotColor = '#64748B', 
  dotSize = 1, 
  gap = 30 
}: DotGridProps) {
  return (
    <div 
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        backgroundImage: `radial-gradient(${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${gap}px ${gap}px`,
        opacity: 0.3,
      }}
    />
  );
}

// Beams Background
interface BeamsBackgroundProps {
  children?: ReactNode;
  className?: string;
  beamCount?: number;
}

export function BeamsBackground({ children, className, beamCount = 5 }: BeamsBackgroundProps) {
  const beams = Array.from({ length: beamCount }, (_, i) => ({
    id: i,
    rotation: (360 / beamCount) * i,
    delay: i * 0.5,
  }));

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Beam effects */}
      <div className="absolute inset-0 flex items-center justify-center">
        {beams.map((beam) => (
          <div
            key={beam.id}
            className="absolute h-[200%] w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"
            style={{
              transform: `rotate(${beam.rotation}deg)`,
              animation: `beam 8s ease-in-out infinite`,
              animationDelay: `${beam.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Letter Glitch Background (Matrix-style)
interface LetterGlitchProps {
  className?: string;
  text?: string;
  fontSize?: number;
  color?: string;
}

export function LetterGlitch({ 
  className, 
  text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%',
  fontSize = 14,
  color = '#10B981'
}: LetterGlitchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = text[Math.floor(Math.random() * text.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [text, fontSize, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 opacity-20', className)}
    />
  );
}

// Grid Distortion Background
interface GridDistortionProps {
  className?: string;
}

export function GridDistortion({ className }: GridDistortionProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <svg
        className="w-full h-full opacity-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-primary"
            />
          </pattern>
          <filter id="distort">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.01"
              numOctaves="3"
              result="turbulence"
            >
              <animate
                attributeName="baseFrequency"
                values="0.01;0.02;0.01"
                dur="10s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#grid)"
          filter="url(#distort)"
        />
      </svg>
    </div>
  );
}

// Laser Flow Effect (for connections)
interface LaserFlowLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
  className?: string;
}

export function LaserFlowLine({ from, to, color = '#3B82F6', className }: LaserFlowLineProps) {
  return (
    <svg
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{ width: '100%', height: '100%' }}
    >
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeWidth="2"
        className="laser-flow"
        style={{
          filter: `drop-shadow(0 0 3px ${color})`,
        }}
      />
    </svg>
  );
}

// Pixel Trail (mouse follower)
interface PixelTrailProps {
  className?: string;
  color?: string;
}

export function PixelTrail({ className, color = '#3B82F6' }: PixelTrailProps) {
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      idRef.current += 1;
      setTrail((prev) => [
        ...prev.slice(-15),
        { x: e.clientX, y: e.clientY, id: idRef.current },
      ]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={cn('fixed inset-0 pointer-events-none z-50', className)}>
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: point.x - 4,
            top: point.y - 4,
            backgroundColor: color,
            opacity: (index / trail.length) * 0.5,
            transform: `scale(${0.3 + (index / trail.length) * 0.7})`,
            boxShadow: `0 0 ${4 + index}px ${color}`,
          }}
        />
      ))}
    </div>
  );
}

// Pixel Transition Effect
interface PixelTransitionProps {
  isVisible: boolean;
  children: ReactNode;
  className?: string;
}

export function PixelTransition({ isVisible, children, className }: PixelTransitionProps) {
  return (
    <div
      className={cn(
        'transition-all duration-500',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        className
      )}
      style={{
        filter: isVisible ? 'none' : 'blur(10px)',
      }}
    >
      {children}
    </div>
  );
}

// Pixel Blast Effect (celebration)
interface PixelBlastProps {
  isActive: boolean;
  className?: string;
  particleCount?: number;
}

export function PixelBlast({ isActive, className, particleCount = 50 }: PixelBlastProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
  }>>([]);

  useEffect(() => {
    if (isActive) {
      const colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: 50,
        y: 50,
        vx: (Math.random() - 0.5) * 200,
        vy: (Math.random() - 0.5) * 200,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
      }));
      setParticles(newParticles);

      const timeout = setTimeout(() => setParticles([]), 1500);
      return () => clearTimeout(timeout);
    }
  }, [isActive, particleCount]);

  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-sm animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `translate(${particle.vx}%, ${particle.vy}%)`,
            transition: 'transform 1s ease-out, opacity 1s ease-out',
            opacity: 0,
            boxShadow: `0 0 10px ${particle.color}`,
          }}
        />
      ))}
    </div>
  );
}
