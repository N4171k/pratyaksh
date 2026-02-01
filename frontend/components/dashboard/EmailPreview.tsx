'use client';

import React, { useState } from 'react';
import { Service } from '@/lib/api-client';
import { GlassCard } from '@/components/ui/cards';
import { GlassButton, ElectricBorderButton } from '@/components/ui/buttons';
import { Modal } from '@/components/ui/common';
import { cn } from '@/lib/utils';

interface EmailPreviewProps {
  service: Service;
  email: {
    to: string;
    subject: string;
    body: string;
    mailtoLink?: string;
  };
  onClose: () => void;
  onSend: () => void;
  onCopy: () => void;
}

export function EmailPreview({
  service,
  email,
  onClose,
  onSend,
  onCopy
}: EmailPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email.body);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailClient = () => {
    if (email.mailtoLink) {
      window.open(email.mailtoLink, '_blank');
    } else {
      const mailtoLink = `mailto:${email.to}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
      window.open(mailtoLink, '_blank');
    }
    onSend();
  };

  const serviceName = service.name || service.service_name;
  const isBreached = service.breach_status === 'breached' || service.breach_count > 0;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Delete Request: ${serviceName}`}
      className="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Service info */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          {service.logo_url && (
            <img 
              src={service.logo_url} 
              alt={serviceName}
              className="w-10 h-10 rounded-lg"
            />
          )}
          <div>
            <h3 className="font-semibold text-white">{serviceName}</h3>
            <p className="text-sm text-gray-400">{service.domain}</p>
          </div>
          {isBreached && (
            <span className="ml-auto px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
              Breached
            </span>
          )}
        </div>

        {/* Email fields */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">To:</label>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white font-mono">
              {email.to}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Subject:</label>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white">
              {email.subject}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Body:</label>
            <div className="bg-white/5 rounded-lg p-4 text-sm text-gray-200 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
              {email.body}
            </div>
          </div>
        </div>

        {/* Privacy notice */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <div className="flex gap-2">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div className="text-xs text-green-200">
              <p className="font-medium mb-1">Privacy Note</p>
              <p className="text-green-200/70">
                This email will be opened in your default email client. 
                Pratyaksh does not send emails on your behalf or store your email address.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <GlassButton onClick={onClose} className="flex-1">
            Cancel
          </GlassButton>
          <GlassButton onClick={handleCopy} className="flex-1">
            {copied ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Email
              </>
            )}
          </GlassButton>
          <ElectricBorderButton onClick={handleOpenMailClient} className="flex-1">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Open in Email
          </ElectricBorderButton>
        </div>
      </div>
    </Modal>
  );
}

interface DeleteButtonProps {
  service: Service;
  onGenerateEmail: (service: Service) => Promise<{
    to: string;
    subject: string;
    body: string;
    mailtoLink?: string;
  }>;
  compact?: boolean;
}

export function DeleteButton({ service, onGenerateEmail, compact = false }: DeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<{
    to: string;
    subject: string;
    body: string;
    mailtoLink?: string;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const generatedEmail = await onGenerateEmail(service);
      setEmail(generatedEmail);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to generate email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {compact ? (
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "text-gray-400 hover:text-red-400 hover:bg-red-500/10",
            isLoading && "opacity-50 cursor-wait"
          )}
          title="Request deletion"
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      ) : (
        <GlassButton
          onClick={handleClick}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Request Deletion
            </>
          )}
        </GlassButton>
      )}

      {showPreview && email && (
        <EmailPreview
          service={service}
          email={email}
          onClose={() => setShowPreview(false)}
          onSend={() => {
            // Track that email was opened
            console.log('Email opened for:', service.domain);
          }}
          onCopy={() => {
            // Track that email was copied
            console.log('Email copied for:', service.domain);
          }}
        />
      )}
    </>
  );
}

export default EmailPreview;
