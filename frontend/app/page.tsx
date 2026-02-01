'use client';

import { Hero, Features, TrustBadges, FinalCTA, Footer } from '@/components/landing';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <TrustBadges />
      <FinalCTA />
      <Footer />
    </main>
  );
}
