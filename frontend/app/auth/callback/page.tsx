'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/stores';
import { LetterGlitch } from '@/components/ui/backgrounds';
import { Spinner } from '@/components/ui/common';
import { GradientText } from '@/components/ui/text-effects';
import { apiClient } from '@/lib/api-client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session');
    const email = searchParams.get('email');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setStatus('error');
      setError(decodeURIComponent(errorParam));
      return;
    }

    if (sessionId) {
      // Store session using setAuth which properly stores in sessionStorage
      setAuth(sessionId, email || 'user@gmail.com');
      setStatus('success');

      // Redirect to scanning page
      setTimeout(() => {
        router.push('/scan');
      }, 1500);
    } else {
      setStatus('error');
      setError('No session received from authentication');
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="relative min-h-screen bg-gray-950 flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 opacity-30">
        <LetterGlitch
          text="AUTHENTICATING"
          className="text-6xl font-bold text-blue-500/20"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 glass-card p-8 rounded-2xl max-w-md w-full mx-4 text-center">
        {status === 'processing' && (
          <>
            <Spinner size="lg" className="mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Completing Authentication
            </h2>
            <p className="text-gray-400">
              Setting up your secure session...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              <GradientText>Authentication Successful!</GradientText>
            </h2>
            <p className="text-gray-400 mb-4">
              Redirecting to scan your digital footprint...
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-400 mb-4">
              {error || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
            >
              Return Home
            </button>
          </>
        )}

        {/* Privacy reminder */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your session will expire in 15 minutes for privacy
          </p>
        </div>
      </div>
    </div>
  );
}
