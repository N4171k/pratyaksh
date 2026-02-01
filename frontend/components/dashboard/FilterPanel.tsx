'use client';

import React, { useState } from 'react';
import { useServicesStore } from '@/lib/stores';
import { GlassCard } from '@/components/ui/cards';
import { GlassButton } from '@/components/ui/buttons';
import { SearchInput, Checkbox } from '@/components/ui/common';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'All',
  'Finance',
  'Healthcare',
  'Government',
  'Dating',
  'E-commerce',
  'Social Media',
  'Professional',
  'Travel',
  'Entertainment',
  'News',
  'Education',
  'Gaming',
  'Other'
];

const SORT_OPTIONS = [
  { value: 'sensitivity', label: 'Risk Level' },
  { value: 'value', label: 'Data Value' },
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'First Seen' },
];

interface FilterPanelProps {
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  totalCount: number;
  selectedCount: number;
}

export function FilterPanel({ 
  onSelectAll, 
  onDeselectAll,
  totalCount,
  selectedCount 
}: FilterPanelProps) {
  const { 
    filter, 
    setFilter,
    searchQuery,
    setSearchQuery
  } = useServicesStore();
  
  const [showBreachedOnly, setShowBreachedOnly] = useState(filter === 'breached');
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState('sensitivity');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleCategoryChange = (category: string) => {
    if (category === 'All') {
      setFilter('all');
    } else if (category === 'breached') {
      setFilter('breached');
    } else if (category === 'high') {
      setFilter('high');
    } else {
      setFilter('all');
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleBreachedToggle = () => {
    const newValue = !showBreachedOnly;
    setShowBreachedOnly(newValue);
    setFilter(newValue ? 'breached' : 'all');
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const activeCategory = filter === 'all' ? 'All' : filter;

  return (
    <GlassCard className="p-4">
      {/* Search */}
      <div className="mb-4">
        <SearchInput
          placeholder="Search services..."
          value={searchQuery || ''}
          onChange={(value: string) => handleSearchChange(value)}
          className="w-full"
        />
      </div>

      {/* Quick filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={showBreachedOnly}
            onChange={handleBreachedToggle}
            label="Breached Only"
          />
          
          <span className="text-sm text-gray-400">
            {selectedCount} of {totalCount} selected
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Select All
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={onDeselectAll}
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            Deselect All
          </button>
        </div>
      </div>

      {/* Category pills - collapsible on mobile */}
      <div className="mb-4">
        <button
          className="md:hidden flex items-center justify-between w-full text-sm text-gray-400 mb-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>Categories</span>
          <svg 
            className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className={cn(
          "flex flex-wrap gap-2",
          "md:flex",
          !isExpanded && "hidden md:flex"
        )}>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={toggleSortDirection}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {sortDirection === 'desc' ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Highest First
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Lowest First
            </>
          )}
        </button>
      </div>
    </GlassCard>
  );
}

export default FilterPanel;
