'use client';

import { useRef, useEffect, useState } from 'react';
import { 
  BentoGrid, 
  BentoItem, 
  GradientText, 
  CountUp,
  MetallicCard,
} from '@/components/ui';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    step: 1,
    title: 'Connect',
    description: 'Securely link your Gmail with read-only access. We never see your email content.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    color: 'primary',
  },
  {
    step: 2,
    title: 'Scan',
    description: 'Our AI analyzes email headers to discover services you\'ve signed up for.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    color: 'purple',
  },
  {
    step: 3,
    title: 'Analyze',
    description: 'View your risk map with breach alerts and data exposure insights.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'electric',
  },
  {
    step: 4,
    title: 'Delete',
    description: 'One-click GDPR/CCPA deletion requests. Take back control instantly.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    color: 'success',
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="how-it-works" 
      className="relative py-24 px-6 bg-dark"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <GradientText>How Pratyaksh Works</GradientText>
          </h2>
          <p className="text-gray text-lg max-w-2xl mx-auto">
            Four simple steps to discover your digital footprint and take back control of your privacy
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <MetallicCard
              key={feature.step}
              className={cn(
                'relative overflow-hidden transition-all duration-700',
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              )}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {/* Step number */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-dark flex items-center justify-center">
                <span className="text-sm font-bold text-gray">{feature.step}</span>
              </div>

              {/* Icon */}
              <div 
                className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
                  feature.color === 'primary' && 'bg-primary/20 text-primary',
                  feature.color === 'purple' && 'bg-purple/20 text-purple',
                  feature.color === 'electric' && 'bg-electric/20 text-electric',
                  feature.color === 'success' && 'bg-success/20 text-success',
                )}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-light mb-2">{feature.title}</h3>
              <p className="text-gray text-sm leading-relaxed">{feature.description}</p>

              {/* Connector line (except last) */}
              {index < FEATURES.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-white/20 to-transparent" />
              )}
            </MetallicCard>
          ))}
        </div>

        {/* Additional Features Bento Grid */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-light mb-8 text-center">
            Powerful Privacy Features
          </h3>
          
          <BentoGrid className="auto-rows-[200px]">
            <BentoItem colSpan={2} className="flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-danger/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-light mb-2">Breach Monitoring</h4>
                <p className="text-gray text-sm">
                  Real-time alerts when your accounts appear in data breaches via Have I Been Pwned integration.
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-danger animate-pulse" />
                  <span className="text-sm text-danger font-medium">
                    <CountUp end={1234567} trigger={isVisible} /> breached this week
                  </span>
                </div>
              </div>
            </BentoItem>

            <BentoItem className="flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-light mb-2">Zero Knowledge</h4>
                <p className="text-gray text-sm">
                  Your data is never stored. Everything is deleted after your session.
                </p>
              </div>
            </BentoItem>

            <BentoItem className="flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-electric/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-light mb-2">Kill Switch</h4>
                <p className="text-gray text-sm">
                  Bulk delete requests to all selected services with one click.
                </p>
              </div>
            </BentoItem>

            <BentoItem colSpan={2} rowSpan={1} className="flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-light mb-2">Data Value Calculator</h4>
                <p className="text-gray text-sm">
                  See the estimated advertising value of your exposed personal data across all platforms.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-2xl font-bold text-warning">
                  <CountUp end={11800} prefix="₹" trigger={isVisible} />
                </span>
                <span className="text-sm text-gray">avg. annual value per user</span>
              </div>
            </BentoItem>

            <BentoItem colSpan={2} className="flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-light mb-2">AI-Powered Analysis</h4>
                <p className="text-gray text-sm">
                  Smart service categorization and personalized deletion emails using advanced AI.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="px-2 py-1 text-xs font-medium bg-purple/20 text-purple rounded-full">
                  Powered by Llama 3.3
                </span>
              </div>
            </BentoItem>
          </BentoGrid>
        </div>
      </div>
    </section>
  );
}
