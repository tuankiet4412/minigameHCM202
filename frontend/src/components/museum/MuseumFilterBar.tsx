'use client';

import { motion } from 'framer-motion';

export type FilterCategory = 'all' | 'artifact' | 'photograph' | 'document' | 'video' | '3d';

interface FilterBarProps {
  active: FilterCategory;
  onChange: (cat: FilterCategory) => void;
  sortNewest: boolean;
  onToggleSort: () => void;
  viewGrid: boolean;
  onToggleView: () => void;
}

const FILTERS: { id: FilterCategory; label: string; icon: string }[] = [
  { id: 'all',        label: 'All Collections', icon: '⊞' },
  { id: 'artifact',   label: 'Artifacts',       icon: '🏛' },
  { id: 'photograph', label: 'Photographs',     icon: '📷' },
  { id: 'document',   label: 'Documents',       icon: '📄' },
  { id: 'video',      label: 'Videos',          icon: '🎬' },
  { id: '3d',         label: '3D Exhibits',     icon: '⬡' },
];

export function MuseumFilterBar({ active, onChange, sortNewest, onToggleSort, viewGrid, onToggleView }: FilterBarProps) {
  return (
    <div
      className="sticky top-16 z-30 mx-0 px-4 md:px-0"
      style={{
        background: 'rgba(5,5,5,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212,175,55,0.1)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16 py-4 flex flex-wrap items-center gap-3">

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 flex-1">
          {FILTERS.map((f) => {
            const isActive = active === f.id;
            return (
              <motion.button
                key={f.id}
                onClick={() => onChange(f.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 overflow-hidden"
                style={{
                  fontFamily: 'var(--font-source)',
                  letterSpacing: '0.05em',
                  background: isActive
                    ? 'linear-gradient(135deg, #D4AF37, #C89B3C)'
                    : 'rgba(255,255,255,0.04)',
                  color: isActive ? '#050505' : 'rgba(255,255,255,0.5)',
                  border: isActive
                    ? '1px solid transparent'
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isActive ? '0 0 24px rgba(212,175,55,0.35)' : 'none',
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                <span style={{ fontSize: '0.85em' }}>{f.icon}</span>
                {f.label}
                {isActive && (
                  <motion.div
                    layoutId="filter-active"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Sort + View controls */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Sort */}
          <button
            onClick={onToggleSort}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs transition-all duration-200"
            style={{
              fontFamily: 'var(--font-source)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.03em',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.3)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {sortNewest ? 'Newest First' : 'Oldest First'}
          </button>

          {/* View toggle */}
          <div className="flex rounded-full overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              onClick={() => !viewGrid && onToggleView()}
              className="px-3 py-2 transition-all duration-200"
              style={{ background: viewGrid ? 'rgba(212,175,55,0.15)' : 'transparent', color: viewGrid ? '#D4AF37' : 'rgba(255,255,255,0.35)' }}
              aria-label="Grid view"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" />
                <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" />
                <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" />
                <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor" />
              </svg>
            </button>
            <button
              onClick={() => viewGrid && onToggleView()}
              className="px-3 py-2 transition-all duration-200"
              style={{ background: !viewGrid ? 'rgba(212,175,55,0.15)' : 'transparent', color: !viewGrid ? '#D4AF37' : 'rgba(255,255,255,0.35)' }}
              aria-label="List view"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="2" width="12" height="2" rx="1" fill="currentColor" />
                <rect x="1" y="6" width="12" height="2" rx="1" fill="currentColor" />
                <rect x="1" y="10" width="12" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
