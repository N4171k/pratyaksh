'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useScanStore } from '@/lib/stores';
import { apiClient } from '@/lib/api-client';
import { LetterGlitch, GridDistortion } from '@/components/ui/backgrounds';
import { LaserProgress, Spinner } from '@/components/ui/common';
import { ShuffleText, CountUp, GradientText } from '@/components/ui/text-effects';
import { GlassCard } from '@/components/ui/cards';
import { GlassButton } from '@/components/ui/buttons';
import { cn } from '@/lib/utils';

const SCAN_MESSAGES = [
  'Initializing secure scan...',
  'Connecting to Gmail API...',
  'Searching for signup confirmations...',
  'Analyzing email metadata...',
  'Identifying services...',
  'Categorizing accounts...',
  'Calculating risk profiles...',
  'Checking for breaches...',
  'Finalizing results...',
];

export default function ScanPage() {
  const router = useRouter();
  const { sessionId, isAuthenticated, checkSession } = useAuthStore();
  const { 
    status, 
    progress, 
    servicesFound, 
    message,
    startScan,
    pollStatus,
  } = useScanStore();
  
  const [messageIndex, setMessageIndex] = useState(0);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated || !sessionId) {
      router.push('/');
      return;
    }
    checkSession();
  }, [isAuthenticated, sessionId, router, checkSession]);

  // Start scan on mount
  useEffect(() => {
    if (sessionId && status === 'idle') {
      startScan();
    }
  }, [sessionId, status, startScan]);

  // Redirect when complete
  useEffect(() => {
    if (status === 'complete') {
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  }, [status, router]);

  // Cycle through messages
  useEffect(() => {
    if (status === 'scanning' || status === 'analyzing') {
      const interval = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % SCAN_MESSAGES.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleCancel = async () => {
    if (sessionId) {
      try {
        await apiClient.scan.cancel(sessionId);
        router.push('/');
      } catch (err) {
        console.error('Failed to cancel scan:', err);
      }
    }
  };

  const isScanning = status === 'scanning' || status === 'analyzing' || status === 'pending';
  const isComplete = status === 'complete';
  const isError = status === 'error';

  return (
    <div className="relative min-h-screen bg-gray-950 flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {isScanning && (
          <div className="absolute inset-0 opacity-40">
            <LetterGlitch
              text="SCANNING"
              className="text-8xl font-bold text-blue-500/30"
            />
          </div>
        )}
        {isComplete && (
          <div className="absolute inset-0 opacity-30">
            <GridDistortion 
              className="w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950" />

      {/* Main content */}
      <div className="relative z-10 max-w-2xl w-full mx-4">
        <GlassCard className="p-8 text-center">
          {/* Status icon */}
          <div className="mb-8">
            {isScanning && (
              <div className="relative w-32 h-32 mx-auto">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                {/* Spinning ring */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                {/* Inner content */}
                <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
              </div>
            )}
            
            {isComplete && (
              <div className="w-32 h-32 mx-auto rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {isError && (
              <div className="w-32 h-32 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2">
            {isScanning && <ShuffleText text="Scanning Your Digital Footprint" />}
            {isComplete && <GradientText>Scan Complete!</GradientText>}
            {isError && <span className="text-red-500">Scan Failed</span>}
          </h1>

          {/* Subtitle / Current step */}
          <p className="text-gray-400 mb-8">
            {isScanning && (message || SCAN_MESSAGES[messageIndex])}
            {isComplete && 'Preparing your dashboard...'}
            {isError && (scanError || 'An unexpected error occurred')}
          </p>

          {/* Progress */}
          {isScanning && (
            <div className="mb-8">
              <LaserProgress value={progress} max={100} className="mb-4" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{progress}% complete</span>
                <span className="text-primary">
                  <CountUp end={servicesFound} /> services found
                </span>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-3xl font-bold text-white">
                    <CountUp end={servicesFound} />
                  </p>
                  <p className="text-sm text-gray-400">Services Found</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-3xl font-bold text-green-500">✓</p>
                  <p className="text-sm text-gray-400">Scan Complete</p>
                </div>
              </div>
            </div>
          )}

          {/* Privacy notice */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
            <div className="flex gap-3 items-start text-left">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-sm text-green-200 font-medium mb-1">Privacy Protected</p>
                <p className="text-xs text-green-200/70">
                  We only read email metadata (sender, subject, date). 
                  Your email content is never accessed or stored.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {isScanning && (
            <div className="relative">
              {showCancelConfirm ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">Are you sure you want to cancel?</p>
                  <div className="flex gap-3 justify-center">
                    <GlassButton onClick={() => setShowCancelConfirm(false)}>
                      Continue Scan
                    </GlassButton>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      Yes, Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
                >
                  Cancel scan
                </button>
              )}
            </div>
          )}

          {isError && (
            <div className="flex gap-3 justify-center">
              <GlassButton onClick={() => router.push('/')}>
                Return Home
              </GlassButton>
              <GlassButton onClick={() => window.location.reload()}>
                Try Again
              </GlassButton>
            </div>
          )}

          {isComplete && (
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Spinner size="sm" />
              <span>Loading dashboard...</span>
            </div>
          )}
        </GlassCard>

        {/* Session timer warning */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Session expires automatically after 15 minutes of inactivity
          </p>
        </div>
      </div>
    </div>
  );
}
