'use client';

import React from 'react';
import { Service } from '@/lib/api-client';
import { GlassCard, StarBorderCard } from '@/components/ui/cards';
import { Badge } from '@/components/ui/common';
import { ElectricBorderButton, GlassButton } from '@/components/ui/buttons';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onSelect?: (service: Service) => void;
  onDelete?: (service: Service) => void;
  compact?: boolean;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Finance: { bg: 'bg-red-500/20', text: 'text-red-400' },
  Healthcare: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  Government: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  Dating: { bg: 'bg-pink-500/20', text: 'text-pink-400' },
  'E-commerce': { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  'Social Media': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  Professional: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  Travel: { bg: 'bg-green-500/20', text: 'text-green-400' },
  Entertainment: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  News: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
  Education: { bg: 'bg-teal-500/20', text: 'text-teal-400' },
  Gaming: { bg: 'bg-violet-500/20', text: 'text-violet-400' },
  Other: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
};

function getSensitivityLevel(sensitivity: number): { label: string; color: string } {
  if (sensitivity >= 8) return { label: 'Critical', color: 'text-red-500' };
  if (sensitivity >= 6) return { label: 'High', color: 'text-orange-500' };
  if (sensitivity >= 4) return { label: 'Medium', color: 'text-yellow-500' };
  return { label: 'Low', color: 'text-green-500' };
}

export function ServiceCard({ 
  service, 
  selected = false,
  onSelect, 
  onDelete,
  compact = false 
}: ServiceCardProps) {
  const categoryColor = CATEGORY_COLORS[service.category] || CATEGORY_COLORS.Other;
  const sensitivity = getSensitivityLevel(service.data_sensitivity);
  const isBreached = service.breach_status === 'breached' || service.breach_count > 0;
  const serviceName = service.name || service.service_name;

  const CardWrapper = isBreached ? StarBorderCard : GlassCard;

  if (compact) {
    return (
      <div 
        className={cn(
          "flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer",
          "hover:bg-white/5",
          selected && "bg-primary/20 ring-1 ring-primary",
          isBreached && "bg-red-500/10"
        )}
        onClick={() => onSelect?.(service)}
      >
        <div className="flex items-center gap-3">
          {/* Checkbox */}
          <div 
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
              selected 
                ? "bg-primary border-primary" 
                : "border-gray-500 hover:border-gray-400"
            )}
          >
            {selected && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          {/* Logo */}
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
            {service.logo_url ? (
              <img 
                src={service.logo_url} 
                alt={serviceName}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-xs font-bold text-gray-400">
                {serviceName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Name & Category */}
          <div>
            <p className="font-medium text-white text-sm">{serviceName}</p>
            <p className="text-xs text-gray-400">{service.domain}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isBreached && (
            <Badge variant="danger" size="sm">Breached</Badge>
          )}
          <span className={cn("text-xs font-medium", categoryColor.text)}>
            {service.category}
          </span>
        </div>
      </div>
    );
  }

  return (
    <CardWrapper 
      className={cn(
        "p-4 transition-all cursor-pointer",
        selected && "ring-2 ring-primary",
        isBreached && "border-red-500/50"
      )}
      onClick={() => onSelect?.(service)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
            {service.logo_url ? (
              <img 
                src={service.logo_url} 
                alt={serviceName}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-lg font-bold text-gray-400">
                {serviceName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-white">{serviceName}</h3>
            <p className="text-sm text-gray-400">{service.domain}</p>
          </div>
        </div>

        {/* Selection indicator */}
        <div 
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
            selected 
              ? "bg-primary border-primary" 
              : "border-gray-500 hover:border-gray-400"
          )}
        >
          {selected && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", categoryColor.bg, categoryColor.text)}>
          {service.category}
        </span>
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700/50", sensitivity.color)}>
          {sensitivity.label} Risk
        </span>
        {isBreached && (
          <Badge variant="danger" className="animate-pulse">
            ⚠️ Data Breach
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-xs text-gray-400">Data Sensitivity</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all",
                  service.data_sensitivity >= 8 ? "bg-red-500" :
                  service.data_sensitivity >= 6 ? "bg-orange-500" :
                  service.data_sensitivity >= 4 ? "bg-yellow-500" : "bg-green-500"
                )}
                style={{ width: `${service.data_sensitivity * 10}%` }}
              />
            </div>
            <span className="text-sm font-medium text-white">
              {service.data_sensitivity}/10
            </span>
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-xs text-gray-400">Est. Data Value</p>
          <p className="text-sm font-semibold text-white">
            ${(service.estimated_data_value || service.data_sensitivity * 5).toFixed(2)}
          </p>
        </div>
      </div>

      {/* First seen */}
      {(service.first_seen || service.first_seen_date) && (
        <p className="text-xs text-gray-500 mb-3">
          First seen: {new Date(service.first_seen || service.first_seen_date).toLocaleDateString()}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <GlassButton 
          className="flex-1 text-sm py-2"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(service);
          }}
        >
          Request Deletion
        </GlassButton>
      </div>
    </CardWrapper>
  );
}

export default ServiceCard;
