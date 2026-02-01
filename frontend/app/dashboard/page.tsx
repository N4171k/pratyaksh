'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore, useScanStore, useServicesStore, useUIStore } from '@/lib/stores';
import { apiClient, Service } from '@/lib/api-client';
import { 
  RiskMap, 
  ServiceCard, 
  FilterPanel, 
  SummaryCards, 
  KillSwitch,
  DeleteButton 
} from '@/components/dashboard';
import { GlassCard } from '@/components/ui/cards';
import { GlassButton, ElectricBorderButton } from '@/components/ui/buttons';
import { PillNav, Tabs } from '@/components/ui/navigation';
import { GradientText } from '@/components/ui/text-effects';
import { Spinner, Modal } from '@/components/ui/common';
import { cn } from '@/lib/utils';

type ViewMode = 'map' | 'list';

export default function DashboardPage() {
  const router = useRouter();
  const { sessionId, isAuthenticated, checkSession, logout } = useAuthStore();
  const { status: scanStatus } = useScanStore();
  const { 
    services, 
    setServices, 
    summary,
    selectedIds, 
    toggleSelect, 
    selectAll, 
    clearSelection,
    filter,
    searchQuery,
    getFilteredServices
  } = useServicesStore();
  const { activeModal, modalData, openModal, closeModal } = useUIStore();

  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [isLoading, setIsLoading] = useState(true);
  const [riskSummary, setRiskSummary] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isKillSwitchExecuting, setIsKillSwitchExecuting] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated || !sessionId) {
      router.push('/');
      return;
    }
    checkSession();
  }, [isAuthenticated, sessionId, router, checkSession]);

  // Fetch scan results
  useEffect(() => {
    if (!sessionId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [resultsRes, riskRes] = await Promise.all([
          apiClient.scan.getResults(sessionId),
          apiClient.risk.getSummary(sessionId)
        ]);
        
        if (resultsRes.data?.services) {
          // Construct summary from services
          const servicesList = resultsRes.data.services;
          const summaryData = {
            total_services: servicesList.length,
            high_risk_count: servicesList.filter((s: Service) => s.risk_score >= 7).length,
            medium_risk_count: servicesList.filter((s: Service) => s.risk_score >= 4 && s.risk_score < 7).length,
            low_risk_count: servicesList.filter((s: Service) => s.risk_score < 4).length,
            breached_count: servicesList.filter((s: Service) => s.breach_count > 0).length,
            estimated_annual_value: servicesList.length * 10,
          };
          setServices(servicesList, summaryData);
        }
        if (riskRes.data?.summary) {
          setRiskSummary(riskRes.data.summary);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // If results not found, redirect to scan
        router.push('/scan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sessionId, setServices, router]);

  // Filter and sort services - use store's getFilteredServices
  const filteredServices = useMemo(() => {
    return getFilteredServices();
  }, [services, filter, searchQuery, getFilteredServices]);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    openModal('serviceDetail');
  };

  const handleGenerateEmail = async (service: Service) => {
    const response = await apiClient.ai.generateEmail({
      service_name: service.name || service.service_name,
      domain: service.domain,
      regulation: 'GDPR'
    });
    
    if (response.data) {
      return {
        to: service.privacy_email || `privacy@${service.domain}`,
        subject: response.data.subject,
        body: response.data.body,
      };
    }
    return {
      to: service.privacy_email || `privacy@${service.domain}`,
      subject: `Data Deletion Request - GDPR Article 17`,
      body: `To whom it may concern,\n\nUnder GDPR Article 17, I request the deletion of my personal data...`,
    };
  };

  const handleKillSwitch = async (servicesToDelete: Service[]) => {
    setIsKillSwitchExecuting(true);
    try {
      await apiClient.actions.killSwitch(sessionId!);
      // Show success or redirect to results
      openModal('killSwitchComplete');
    } catch (error) {
      console.error('Kill switch failed:', error);
    } finally {
      setIsKillSwitchExecuting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-400">Loading your digital footprint...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image 
              src="/logo.svg" 
              alt="Pratyaksh Logo" 
              width={36} 
              height={36} 
              className="rounded-lg"
            />
            <h1 className="text-xl font-bold">
              <GradientText>Pratyaksh</GradientText>
            </h1>
            <span className="text-xs text-gray-500 hidden sm:inline">
              {services.length} services discovered
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Session timer indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Session active
            </div>

            <GlassButton onClick={handleLogout} className="text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </GlassButton>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Summary cards */}
        <SummaryCards
          totalServices={services.length}
          riskScore={riskSummary?.risk_score || 0}
          totalDataValue={riskSummary?.total_data_value || 0}
          breachedCount={riskSummary?.breached_services || 0}
        />

        {/* Kill Switch */}
        <KillSwitch
          services={services}
          selectedServices={Array.from(selectedIds)}
          onExecute={handleKillSwitch}
          isExecuting={isKillSwitchExecuting}
        />

        {/* View toggle and filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* View mode toggle */}
              <GlassCard className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('map')}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-sm transition-colors",
                      viewMode === 'map' 
                        ? "bg-primary/20 text-primary" 
                        : "text-gray-400 hover:bg-white/5"
                    )}
                  >
                    Risk Map
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-sm transition-colors",
                      viewMode === 'list' 
                        ? "bg-primary/20 text-primary" 
                        : "text-gray-400 hover:bg-white/5"
                    )}
                  >
                    List View
                  </button>
                </div>
              </GlassCard>

              {/* Filters (desktop) */}
              <div className="hidden lg:block">
                <FilterPanel
                  totalCount={services.length}
                  selectedCount={selectedIds.size}
                  onSelectAll={() => selectAll()}
                  onDeselectAll={clearSelection}
                />
              </div>
            </div>
          </div>

          {/* Main view */}
          <div className="flex-1 min-w-0">
            {/* Filters (mobile) */}
            <div className="lg:hidden mb-4">
              <FilterPanel
                totalCount={services.length}
                selectedCount={selectedIds.size}
                onSelectAll={() => selectAll()}
                onDeselectAll={clearSelection}
              />
            </div>

            {viewMode === 'map' ? (
              <GlassCard className="p-4 h-[600px]">
                <RiskMap
                  services={filteredServices}
                  onServiceClick={handleServiceClick}
                />
              </GlassCard>
            ) : (
              <div className="space-y-3">
                {filteredServices.length === 0 ? (
                  <GlassCard className="p-8 text-center">
                    <p className="text-gray-400">No services match your filters</p>
                  </GlassCard>
                ) : (
                  filteredServices.map(service => (
                    <ServiceCard
                      key={service.domain}
                      service={service}
                      selected={selectedIds.has(service.id)}
                      onSelect={() => toggleSelect(service.id)}
                      onDelete={() => handleServiceClick(service)}
                      compact
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Privacy reminder footer */}
        <div className="text-center py-8 border-t border-white/10">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            All data is session-only. Logging out permanently deletes all information.
          </p>
        </div>
      </main>

      {/* Service Detail Modal */}
      {selectedService && activeModal === 'serviceDetail' && (
        <Modal
          isOpen={true}
          onClose={() => {
            closeModal();
            setSelectedService(null);
          }}
          title={selectedService.name || selectedService.service_name}
          className="max-w-lg"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {selectedService.logo_url && (
                <img 
                  src={selectedService.logo_url} 
                  alt={selectedService.name || selectedService.service_name}
                  className="w-16 h-16 rounded-xl"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedService.name || selectedService.service_name}</h3>
                <p className="text-sm text-gray-400">{selectedService.domain}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400">Category</p>
                <p className="font-medium text-white">{selectedService.category}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400">Data Sensitivity</p>
                <p className="font-medium text-white">{selectedService.data_sensitivity}/10</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400">Est. Data Value</p>
                <p className="font-medium text-white">${(selectedService.estimated_data_value || selectedService.data_sensitivity * 5).toFixed(2)}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400">Breach Status</p>
                <p className={cn(
                  "font-medium",
                  (selectedService.breach_status === 'breached' || selectedService.breach_count > 0) ? "text-red-500" : "text-green-500"
                )}>
                  {(selectedService.breach_status === 'breached' || selectedService.breach_count > 0) ? 'Breached' : 'No breaches'}
                </p>
              </div>
            </div>

            <DeleteButton
              service={selectedService}
              onGenerateEmail={handleGenerateEmail}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
