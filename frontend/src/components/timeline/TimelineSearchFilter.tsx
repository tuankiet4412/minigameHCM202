'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TimelineSearchFilter({
  query,
  onQueryChange,
  onFilterClick,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  onFilterClick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D4A74E]/60" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search events..."
          aria-label="Search timeline events"
          className={cn(
            'w-full rounded-full border border-[#D4A74E]/25 bg-[#0A0A0A]/80 py-3 pl-11 pr-4',
            'text-sm text-[#D9D9D9] placeholder:text-[#A8A8A8]/60 backdrop-blur-xl',
            'transition-all focus:border-[#F5C76B]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A74E]/20'
          )}
        />
      </div>
      <button
        type="button"
        onClick={onFilterClick}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D4A74E]/30 bg-[#0A0A0A]/80 px-5 py-3 text-sm font-medium text-[#E6B85C] backdrop-blur-xl transition-all hover:border-[#F5C76B]/50 hover:bg-[#D4A74E]/10"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filter
      </button>
    </div>
  );
}
