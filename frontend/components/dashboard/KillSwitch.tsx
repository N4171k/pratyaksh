'use client';

import React, { useState } from 'react';
import { Service } from '@/lib/api-client';
import { GlassCard, StarBorderCard } from '@/components/ui/cards';
import { ElectricBorderButton, GlassButton } from '@/components/ui/buttons';
import { GradientText, ScrambledText } from '@/components/ui/text-effects';
import { Modal, LaserProgress } from '@/components/ui/common';
import { cn } from '@/lib/utils';

interface KillSwitchProps {
  services: Service[];
  selectedServices: string[];
  onExecute: (services: Service[]) => Promise<void>;
  isExecuting?: boolean;
}

interface KillSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onConfirm: () => void;
  isExecuting: boolean;
  progress: number;
}

function KillSwitchModal({
  isOpen,
  onClose,
  services,
  onConfirm,
  isExecuting,
  progress
}: KillSwitchModalProps) {
  const breachedCount = services.filter(s => s.breach_status === 'breached' || s.breach_count > 0).length;
  const highRiskCount = services.filter(s => s.data_sensitivity >= 7).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className="max-w-xl"
    >
      <div className="text-center">
        {/* Warning Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {!isExecuting ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">
              <ScrambledText texts={["KILL SWITCH"]} className="text-red-500" />
            </h2>
            <p className="text-gray-400 mb-6">
              Generate deletion requests for all selected services at once
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-2xl font-bold text-white">{services.length}</p>
                <p className="text-xs text-gray-400">Services</p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-3">
                <p className="text-2xl font-bold text-red-500">{breachedCount}</p>
                <p className="text-xs text-gray-400">Breached</p>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-3">
                <p className="text-2xl font-bold text-orange-500">{highRiskCount}</p>
                <p className="text-xs text-gray-400">High Risk</p>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 text-left">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm text-yellow-200 font-medium mb-1">Before you proceed</p>
                  <ul className="text-xs text-yellow-200/70 space-y-1">
                    <li>• Emails will be generated but NOT sent automatically</li>
                    <li>• You'll review each email before sending</li>
                    <li>• Some services may take up to 30 days to respond</li>
                    <li>• Download the package before your session expires</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <GlassButton onClick={onClose} className="flex-1">
                Cancel
              </GlassButton>
              <ElectricBorderButton
                onClick={onConfirm}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500"
              >
                Execute Kill Switch
              </ElectricBorderButton>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">
              Generating Deletion Requests
            </h2>
            <p className="text-gray-400 mb-6">
              Creating personalized GDPR emails for each service...
            </p>

            <div className="mb-6">
              <LaserProgress value={progress} max={100} />
              <p className="text-sm text-gray-400 mt-2">
                {Math.round(progress)}% complete
              </p>
            </div>

            <div className="text-xs text-gray-500">
              Do not close this window
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export function KillSwitch({
  services,
  selectedServices,
  onExecute,
  isExecuting = false
}: KillSwitchProps) {
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);

  const selectedServicesList = services.filter(s => 
    selectedServices.includes(s.domain)
  );

  const handleExecute = async () => {
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      await onExecute(selectedServicesList);
      setProgress(100);
      setTimeout(() => {
        setShowModal(false);
        setProgress(0);
      }, 500);
    } catch (error) {
      clearInterval(interval);
      setProgress(0);
    }
  };

  return (
    <>
      <StarBorderCard className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GradientText>Kill Switch</GradientText>
              </h3>
              <p className="text-sm text-gray-400">
                Generate deletion requests for all selected services at once
              </p>
            </div>
          </div>

          <ElectricBorderButton
            onClick={() => setShowModal(true)}
            disabled={selectedServices.length === 0 || isExecuting}
            className={cn(
              "bg-gradient-to-r from-red-500 to-orange-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {selectedServices.length > 0 ? (
              <>Execute ({selectedServices.length})</>
            ) : (
              <>Select Services</>
            )}
          </ElectricBorderButton>
        </div>

        {selectedServices.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400 mb-2">
              Selected services preview:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedServicesList.slice(0, 5).map(service => (
                <span 
                  key={service.domain}
                  className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300"
                >
                  {service.name || service.service_name}
                </span>
              ))}
              {selectedServicesList.length > 5 && (
                <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                  +{selectedServicesList.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
      </StarBorderCard>

      <KillSwitchModal
        isOpen={showModal}
        onClose={() => !isExecuting && setShowModal(false)}
        services={selectedServicesList}
        onConfirm={handleExecute}
        isExecuting={isExecuting}
        progress={progress}
      />
    </>
  );
}

export default KillSwitch;
