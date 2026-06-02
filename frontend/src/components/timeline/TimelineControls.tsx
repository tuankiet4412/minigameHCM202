'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const MODES = [
  { id: 'vertical', label: 'Vertical View' },
  { id: 'horizontal', label: 'Horizontal View' },
  { id: '3d', label: '3D View' },
] as const;

export type TimelineViewMode = (typeof MODES)[number]['id'];

export default function TimelineControls({
  mode,
  onChange,
}: {
  mode: TimelineViewMode;
  onChange: (mode: TimelineViewMode) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="flex justify-center"
    >
      <div
        className="inline-flex rounded-full border border-[#D4A74E]/20 bg-[#0A0A0A]/80 p-1.5 backdrop-blur-xl"
        role="tablist"
        aria-label="Timeline view mode"
      >
        {MODES.map((item) => {
          const active = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(item.id)}
              className={cn(
                'relative rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 md:px-7',
                active
                  ? 'text-white shadow-[0_0_24px_rgba(212,167,78,0.3)]'
                  : 'text-[#A8A8A8] hover:text-[#F5C76B]'
              )}
            >
              {active && (
                <motion.span
                  layoutId="timeline-view-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#A31212] via-[#D62828] to-[#D4A74E]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
