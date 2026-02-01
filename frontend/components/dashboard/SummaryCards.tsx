'use client';

import React from 'react';
import { GlassCard, MetallicCard } from '@/components/ui/cards';
import { CountUp, GradientText } from '@/components/ui/text-effects';
import { CircularProgress } from '@/components/ui/common';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
  totalServices: number;
  riskScore: number;
  totalDataValue: number;
  breachedCount: number;
  isLoading?: boolean;
}

export function SummaryCards({
  totalServices,
  riskScore,
  totalDataValue,
  breachedCount,
  isLoading = false
}: SummaryCardsProps) {
  const getRiskLevel = (score: number) => {
    if (score < 25) return { label: 'Low', color: 'text-green-500', bgColor: 'bg-green-500' };
    if (score < 50) return { label: 'Moderate', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    if (score < 75) return { label: 'High', color: 'text-orange-500', bgColor: 'bg-orange-500' };
    return { label: 'Critical', color: 'text-red-500', bgColor: 'bg-red-500' };
  };

  const risk = getRiskLevel(riskScore);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Risk Score */}
      <MetallicCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Risk Score</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-white/10 animate-pulse rounded" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className={cn("text-3xl font-bold", risk.color)}>
                  <CountUp end={riskScore} />
                </span>
                <span className="text-gray-500">/100</span>
              </div>
            )}
            <p className={cn("text-sm font-medium mt-1", risk.color)}>
              {risk.label} Risk
            </p>
          </div>
          <CircularProgress 
            value={riskScore} 
            max={100}
            size={60}
            strokeWidth={6}
            color={risk.bgColor}
          />
        </div>
      </MetallicCard>

      {/* Total Services */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Services Found</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-white/10 animate-pulse rounded" />
            ) : (
              <GradientText className="text-3xl font-bold">
                <CountUp end={totalServices} />
              </GradientText>
            )}
            <p className="text-sm text-gray-500 mt-1">accounts discovered</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </GlassCard>

      {/* Data Value */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Est. Data Value</p>
            {isLoading ? (
              <div className="h-8 w-20 bg-white/10 animate-pulse rounded" />
            ) : (
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-white">$</span>
                <span className="text-3xl font-bold text-white">
                  <CountUp end={totalDataValue} decimals={2} />
                </span>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-1">to advertisers</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </GlassCard>

      {/* Breached Services */}
      <GlassCard className={cn("p-6", breachedCount > 0 && "border-red-500/30")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Data Breaches</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-white/10 animate-pulse rounded" />
            ) : (
              <span className={cn(
                "text-3xl font-bold",
                breachedCount > 0 ? "text-red-500" : "text-green-500"
              )}>
                <CountUp end={breachedCount} />
              </span>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {breachedCount > 0 ? 'services compromised' : 'all clear!'}
            </p>
          </div>
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            breachedCount > 0 ? "bg-red-500/20" : "bg-green-500/20"
          )}>
            {breachedCount > 0 ? (
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )}
          </div>
        </div>
        
        {breachedCount > 0 && (
          <div className="mt-3 pt-3 border-t border-red-500/20">
            <p className="text-xs text-red-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Immediate action recommended
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

export default SummaryCards;
