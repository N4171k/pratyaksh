'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Pill Navigation
interface PillNavProps {
  items: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
  }>;
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function PillNav({ items, activeId, onChange, className }: PillNavProps) {
  return (
    <nav className={cn('flex items-center gap-1 p-1 bg-dark-lighter/50 rounded-full', className)}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            'relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            activeId === item.id
              ? 'text-light'
              : 'text-gray hover:text-light'
          )}
        >
          {/* Active background */}
          {activeId === item.id && (
            <span 
              className="absolute inset-0 bg-gradient-primary rounded-full"
              style={{
                animation: 'slideIn 0.3s ease-out',
              }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {item.icon}
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

// Dock Navigation (Mobile Bottom Nav)
interface DockProps {
  items: Array<{
    id: string;
    label: string;
    icon: ReactNode;
    badge?: number;
  }>;
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Dock({ items, activeId, onChange, className }: DockProps) {
  return (
    <nav 
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-2 p-2',
        'bg-dark-lighter/90 backdrop-blur-lg rounded-2xl',
        'border border-white/10 shadow-2xl',
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            'relative flex flex-col items-center gap-1 p-3 rounded-xl',
            'transition-all duration-300',
            'focus:outline-none',
            activeId === item.id
              ? 'text-primary scale-110 -translate-y-1'
              : 'text-gray hover:text-light'
          )}
        >
          {/* Active glow */}
          {activeId === item.id && (
            <span className="absolute inset-0 bg-primary/20 rounded-xl blur-lg" />
          )}
          
          <span className="relative text-xl">{item.icon}</span>
          <span className="relative text-xs font-medium">{item.label}</span>
          
          {/* Badge */}
          {item.badge !== undefined && item.badge > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-danger text-white rounded-full">
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}

// Bubble Menu
interface BubbleMenuProps {
  trigger: ReactNode;
  items: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    danger?: boolean;
  }>;
  className?: string;
}

export function BubbleMenu({ trigger, items, className }: BubbleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
      >
        {trigger}
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div 
            className={cn(
              'absolute right-0 top-full mt-2 z-50',
              'min-w-[200px] p-2',
              'bg-dark-lighter/95 backdrop-blur-lg rounded-xl',
              'border border-white/10 shadow-2xl',
              'animate-in fade-in slide-in-from-top-2 duration-200'
            )}
          >
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg',
                  'text-left text-sm font-medium',
                  'transition-colors duration-200',
                  'focus:outline-none',
                  item.danger
                    ? 'text-danger hover:bg-danger/10'
                    : 'text-light hover:bg-white/10'
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {item.icon && <span className="text-lg">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Tab Navigation
interface TabsProps {
  items: Array<{
    id: string;
    label: string;
    content: ReactNode;
  }>;
  defaultTab?: string;
  className?: string;
}

export function Tabs({ items, defaultTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);

  return (
    <div className={className}>
      {/* Tab headers */}
      <div className="flex items-center gap-1 border-b border-white/10">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              'relative px-4 py-3 text-sm font-medium',
              'transition-colors duration-200',
              'focus:outline-none',
              activeTab === item.id
                ? 'text-primary'
                : 'text-gray hover:text-light'
            )}
          >
            {item.label}
            {activeTab === item.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary" />
            )}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className="mt-4">
        {items.find((item) => item.id === activeTab)?.content}
      </div>
    </div>
  );
}
