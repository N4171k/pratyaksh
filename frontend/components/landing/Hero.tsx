'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  AuroraBackground, 
  DotGrid,
  GradientText, 
  ShuffleText, 
  ShinyText, 
  ElectricBorderButton,
  SpotlightCard,
  CountUp,
} from '@/components/ui';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/stores';
import Image from 'next/image';

const TAGLINE_VARIANTS = [
  'Bringing your shadow data into the light.',
  'Discover what the internet remembers.',
  'Your forgotten accounts, exposed.',
  'Take back control of your digital life.',
];

export function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINE_VARIANTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getAuthUrl();
      if (response.data?.authorization_url) {
        window.location.href = response.data.authorization_url;
      }
    } catch (error) {
      console.error('Failed to get auth URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background Effects */}
      <AuroraBackground className="absolute inset-0" intensity="medium" />
      <DotGrid className="absolute inset-0" />
      
      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.svg" 
            alt="Pratyaksh Logo" 
            width={40} 
            height={40} 
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-light">Pratyaksh</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <ElectricBorderButton size="sm">
                Dashboard
              </ElectricBorderButton>
            </Link>
          ) : (
            <>
              <button 
                onClick={handleConnect}
                className="text-gray hover:text-light transition-colors hidden sm:block"
              >
                Login
              </button>
              <ElectricBorderButton size="sm" onClick={handleConnect} isLoading={isLoading}>
                Get Started
              </ElectricBorderButton>
            </>
          )}
        </div>
      </nav>
      
      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-dark-lighter/50 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-gray">Privacy-First • No Data Stored</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <GradientText>
              <ShuffleText 
                text="Discover Your Digital Footprint" 
                duration={1500}
                className="font-sans"
              />
            </GradientText>
          </h1>
          
          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-gray mb-8 h-8">
            <ShinyText>
              {TAGLINE_VARIANTS[taglineIndex]}
            </ShinyText>
          </p>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <ElectricBorderButton 
              size="lg" 
              onClick={handleConnect}
              isLoading={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Connect Your Gmail
            </ElectricBorderButton>
            
            <a 
              href="#how-it-works"
              className="text-gray hover:text-light transition-colors flex items-center gap-2"
            >
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              No data stored
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Read-only access
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              GDPR compliant
            </div>
          </div>
        </div>
        
        {/* Preview Card */}
        <div className="mt-16 w-full max-w-4xl">
          <SpotlightCard className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-light">Risk Map Preview</h3>
              <span className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
                Live Demo
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-dark/50">
                <CountUp end={127} className="text-2xl sm:text-3xl text-light" />
                <p className="text-sm text-gray mt-1">Accounts</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-dark/50">
                <CountUp end={18} className="text-2xl sm:text-3xl text-danger" />
                <p className="text-sm text-gray mt-1">High Risk</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-dark/50">
                <CountUp end={23} className="text-2xl sm:text-3xl text-warning" />
                <p className="text-sm text-gray mt-1">Breached</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-dark/50">
                <CountUp end={11800} prefix="₹" className="text-2xl sm:text-3xl text-electric" />
                <p className="text-sm text-gray mt-1">Data Value</p>
              </div>
            </div>
            
            {/* Animated Risk Map Placeholder */}
            <div className="mt-6 h-48 sm:h-64 rounded-lg bg-dark/50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Center user node */}
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center z-10">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {/* Orbiting nodes */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="absolute w-8 h-8 rounded-full"
                    style={{
                      animation: `orbit${i % 2 === 0 ? '' : '-reverse'} ${8 + i * 2}s linear infinite`,
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 60}deg) translateX(${60 + i * 15}px)`,
                    }}
                  >
                    <div 
                      className={`w-full h-full rounded-full ${
                        i < 2 ? 'bg-danger' : i < 4 ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{
                        boxShadow: `0 0 10px ${i < 2 ? '#EF4444' : i < 4 ? '#F59E0B' : '#10B981'}`,
                      }}
                    />
                  </div>
                ))}
              </div>
              
              {/* Concentric circles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 rounded-full border border-danger/30" />
                <div className="absolute w-48 h-48 rounded-full border border-warning/20" />
                <div className="absolute w-64 h-64 rounded-full border border-success/10" />
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
      
      <style jsx>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
        @keyframes orbit-reverse {
          from { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
          to { transform: rotate(0deg) translateX(100px) rotate(0deg); }
        }
      `}</style>
    </section>
  );
}
