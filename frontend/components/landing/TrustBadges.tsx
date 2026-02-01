'use client';

import Image from 'next/image';
import { SpotlightCard, ElectricBorderButton, GlitchText, GradientText } from '@/components/ui';
import { apiClient } from '@/lib/api-client';
import { useState } from 'react';

const TRUST_BADGES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Zero Knowledge',
    description: 'We never store your email content or personal data',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Session Only',
    description: 'All data is deleted after 15 minutes automatically',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'GDPR Compliant',
    description: 'Built with privacy-by-design principles',
  },
];

export function TrustBadges() {
  return (
    <section className="py-16 px-6 bg-dark-lighter/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRUST_BADGES.map((badge, index) => (
            <SpotlightCard key={index} className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-success/20 flex items-center justify-center text-success">
                {badge.icon}
              </div>
              <h3 className="text-lg font-bold text-light mb-2">{badge.title}</h3>
              <p className="text-sm text-gray">{badge.description}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  const [isLoading, setIsLoading] = useState(false);

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
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-lighter to-dark" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
        }}
      />
      
      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          <GlitchText intensity="low">Take Control.</GlitchText>{' '}
          <GradientText>Start Now.</GradientText>
        </h2>
        
        <p className="text-gray text-lg mb-8">
          Discover what the internet knows about you and reclaim your digital privacy in under 60 seconds.
        </p>
        
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
          Get Started - It's Free
        </ElectricBorderButton>
        
        <p className="text-sm text-gray mt-4">
          No credit card required • No data stored • Revoke access anytime
        </p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="Pratyaksh Logo" 
              width={32} 
              height={32} 
              className="rounded-lg"
            />
            <span className="font-bold text-light">Pratyaksh</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray">
            <a href="#" className="hover:text-light transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-light transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-light transition-colors">Contact</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-light transition-colors">
              GitHub
            </a>
          </div>
          
          <p className="text-sm text-gray">
            © 2026 Pratyaksh. Built for privacy.
          </p>
        </div>
        
        {/* Privacy Notice */}
        <div className="mt-8 p-4 rounded-lg bg-dark-lighter/50 border border-white/5">
          <p className="text-xs text-gray text-center">
            🔒 <strong className="text-light">Your Privacy Guaranteed:</strong> Pratyaksh is an educational tool that helps users exercise their data rights. 
            We never store email content, access email bodies, or share your data with third parties. 
            All processing happens in real-time and is deleted after your session.
          </p>
        </div>
      </div>
    </footer>
  );
}
