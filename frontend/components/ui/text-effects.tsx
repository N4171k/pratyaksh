'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ShuffleTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  trigger?: boolean;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export function ShuffleText({ 
  text, 
  className, 
  duration = 1000, 
  delay = 0,
  trigger = true 
}: ShuffleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!trigger) {
      setDisplayText(text);
      return;
    }

    const timeout = setTimeout(() => {
      setIsAnimating(true);
      let iterations = 0;
      const maxIterations = text.length;

      intervalRef.current = setInterval(() => {
        setDisplayText((prev) => {
          return text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iterations) return text[index];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('');
        });

        iterations += 1 / 3;
        
        if (iterations >= maxIterations) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDisplayText(text);
          setIsAnimating(false);
        }
      }, duration / (maxIterations * 3));
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, duration, delay, trigger]);

  return (
    <span className={cn('font-mono', className)}>
      {displayText}
    </span>
  );
}

// Gradient Text Component
interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
}

export function GradientText({ 
  children, 
  className,
  from = '#3B82F6',
  to = '#8B5CF6'
}: GradientTextProps) {
  return (
    <span 
      className={cn('bg-clip-text text-transparent', className)}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
      }}
    >
      {children}
    </span>
  );
}

// Shiny Text Component
interface ShinyTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ShinyText({ children, className }: ShinyTextProps) {
  return (
    <span className={cn('shiny-text', className)}>
      {children}
    </span>
  );
}

// Scrambled Text Component (constantly updating)
interface ScrambledTextProps {
  texts: string[];
  className?: string;
  interval?: number;
}

export function ScrambledText({ texts, className, interval = 2000 }: ScrambledTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(texts[0]);
  const [isScrambling, setIsScrambling] = useState(false);

  useEffect(() => {
    const changeText = () => {
      setIsScrambling(true);
      const nextIndex = (currentIndex + 1) % texts.length;
      const targetText = texts[nextIndex];
      let iterations = 0;

      const scramble = setInterval(() => {
        setDisplayText(
          targetText
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iterations) return targetText[index];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );

        iterations += 0.5;
        
        if (iterations >= targetText.length) {
          clearInterval(scramble);
          setDisplayText(targetText);
          setCurrentIndex(nextIndex);
          setIsScrambling(false);
        }
      }, 30);
    };

    const timer = setInterval(changeText, interval);
    return () => clearInterval(timer);
  }, [currentIndex, texts, interval]);

  return (
    <span className={cn('font-mono', className)}>
      {displayText}
    </span>
  );
}

// Glitch Text Component
interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function GlitchText({ children, className, intensity = 'medium' }: GlitchTextProps) {
  const intensityClass = {
    low: 'hover:letter-glitch',
    medium: 'letter-glitch',
    high: 'letter-glitch animate-glitch',
  }[intensity];

  return (
    <span className={cn(intensityClass, className)}>
      {children}
    </span>
  );
}

// Count Up Component
interface CountUpProps {
  end: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
  trigger?: boolean;
}

export function CountUp({ 
  end, 
  duration = 2000, 
  delay = 0, 
  prefix = '', 
  suffix = '',
  className,
  decimals = 0,
  trigger = true
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) {
      setCount(0);
      return;
    }

    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startRef.current) startRef.current = timestamp;
        const progress = timestamp - startRef.current;
        const percentage = Math.min(progress / duration, 1);
        
        // Easing function (ease-out-cubic)
        const eased = 1 - Math.pow(1 - percentage, 3);
        const currentCount = eased * end;
        
        setCount(currentCount);

        if (progress < duration) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, delay, trigger]);

  const displayValue = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.round(count).toLocaleString('en-IN');

  return (
    <span className={cn('count-number tabular-nums', className)}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

// Blur Text Component (reveals on load/scroll)
interface BlurTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function BlurText({ children, className, delay = 0 }: BlurTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <span 
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isVisible ? 'blur-0 opacity-100' : 'blur-sm opacity-0',
        className
      )}
    >
      {children}
    </span>
  );
}
