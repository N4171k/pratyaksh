'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

// Progress Bar with Laser Flow Effect
interface LaserProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'primary' | 'danger' | 'success' | 'warning';
  showLabel?: boolean;
}

export function LaserProgress({ 
  value, 
  max = 100, 
  className, 
  color = 'primary',
  showLabel = false 
}: LaserProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const colorClasses = {
    primary: 'from-primary via-purple to-electric',
    danger: 'from-danger via-breach to-warning',
    success: 'from-success via-electric to-primary',
    warning: 'from-warning via-danger to-breach',
  };

  return (
    <div className={cn('relative', className)}>
      {/* Background track */}
      <div className="h-2 bg-dark-lighter rounded-full overflow-hidden">
        {/* Progress fill with laser effect */}
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r',
            colorClasses[color],
            'transition-all duration-500 ease-out'
          )}
          style={{ 
            width: `${percentage}%`,
            boxShadow: `0 0 10px currentColor, 0 0 20px currentColor`,
          }}
        >
          {/* Animated shine */}
          <div 
            className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite',
            }}
          />
        </div>
      </div>
      
      {showLabel && (
        <div className="mt-2 text-center text-sm font-medium text-gray">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}

// Circular Progress
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  className,
  color = '#3B82F6',
  children,
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-dark-lighter"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// Loading Spinner
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-dark-lighter" />
      <div 
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"
        style={{
          filter: 'drop-shadow(0 0 4px #3B82F6)',
        }}
      />
    </div>
  );
}

// Skeleton Loader
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-dark-lighter',
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
    />
  );
}

// Checkbox with Magnet Effect
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, className, disabled }: CheckboxProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <label 
      className={cn(
        'relative inline-flex items-center gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={cn(
          'relative w-5 h-5 rounded border-2 transition-all duration-200',
          checked 
            ? 'bg-primary border-primary' 
            : 'bg-transparent border-gray hover:border-primary',
          isHovered && !checked && 'scale-110'
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        {/* Checkmark */}
        {checked && (
          <svg 
            className="absolute inset-0 w-full h-full p-0.5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {/* Click spark */}
        {checked && (
          <span className="absolute inset-0 animate-ping bg-primary/50 rounded" />
        )}
      </div>
      {label && (
        <span className="text-sm font-medium text-light">{label}</span>
      )}
    </label>
  );
}

// Search Input with Electric Border
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search...', className }: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div 
      className={cn(
        'relative rounded-lg overflow-hidden',
        isFocused && 'electric-border',
        className
      )}
    >
      <div className="relative flex items-center bg-dark-lighter rounded-lg">
        {/* Search icon */}
        <svg 
          className="absolute left-3 w-5 h-5 text-gray"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'w-full pl-10 pr-4 py-3 bg-transparent',
            'text-light placeholder-gray',
            'border-none outline-none',
            'text-sm'
          )}
        />
        {/* Clear button */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 p-1 text-gray hover:text-light transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, className, size = 'md' }: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div 
        className={cn(
          'relative w-full bg-dark-lighter rounded-2xl',
          'border border-white/10 shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-300',
          sizeClasses[size],
          className
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray hover:text-light transition-colors rounded-lg hover:bg-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Title */}
        {title && (
          <div className="px-6 pt-6 pb-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-light">{title}</h2>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'electric';
  size?: 'sm' | 'md';
  pulsing?: boolean;
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  pulsing = false,
  className 
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-dark-lighter text-light border-white/10',
    danger: 'bg-danger/20 text-danger border-danger/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    success: 'bg-success/20 text-success border-success/30',
    electric: 'bg-electric/20 text-electric border-electric/30',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border',
        variantClasses[variant],
        sizeClasses[size],
        pulsing && variant === 'danger' && 'animate-pulse',
        className
      )}
    >
      {pulsing && (
        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </span>
  );
}

// Tooltip Component
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={cn(
            'absolute z-50 px-3 py-2',
            'bg-dark-lighter text-light text-sm',
            'rounded-lg border border-white/10 shadow-xl',
            'whitespace-nowrap',
            'animate-in fade-in duration-200',
            positionClasses[position]
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
