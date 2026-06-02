'use client';

import { motion } from 'framer-motion';
import { Globe2, Flag, Landmark, Users, LayoutGrid } from 'lucide-react';
import type { TimelineCategory } from '@/lib/timeline-enrichment';
import { CATEGORY_LABELS } from '@/lib/timeline-enrichment';
import { cn } from '@/lib/utils';

const CATEGORIES: { id: TimelineCategory; icon: typeof Globe2 }[] = [
  { id: 'all', icon: LayoutGrid },
  { id: 'vietnam', icon: Flag },
  { id: 'world', icon: Globe2 },
  { id: 'politics', icon: Landmark },
  { id: 'organizations', icon: Users },
];

export default function TimelineCategoryNav({
  active,
  onChange,
}: {
  active: TimelineCategory;
  onChange: (cat: TimelineCategory) => void;
}) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 px-4"
      aria-label="Timeline categories"
    >
      <div className="flex max-w-[95vw] gap-1 overflow-x-auto rounded-full border border-[#D4A74E]/20 bg-[#0A0A0A]/90 p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl scrollbar-none">
        {CATEGORIES.map(({ id, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                'relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium transition-colors md:text-sm md:px-5',
                isActive ? 'text-white' : 'text-[#A8A8A8] hover:text-[#F5C76B]'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="timeline-category-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#A31212] via-[#D62828] to-[#D4A74E]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon className="relative z-10 h-3.5 w-3.5" />
              <span className="relative z-10">{CATEGORY_LABELS[id]}</span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
