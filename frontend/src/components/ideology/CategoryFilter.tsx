'use client';

import { motion } from 'framer-motion';

export type CategoryType =
  | 'all'
  | 'Socialism'
  | 'Patriotism'
  | 'National Independence'
  | 'Party Building'
  | 'Ethics'
  | 'Culture'
  | 'Education';

interface CategoryFilterProps {
  active: CategoryType;
  onChange: (category: CategoryType) => void;
}

const CATEGORIES: { value: CategoryType; label: string }[] = [
  { value: 'all', label: 'All Topics' },
  { value: 'Socialism', label: 'Socialism' },
  { value: 'Patriotism', label: 'Patriotism' },
  { value: 'National Independence', label: 'National Independence' },
  { value: 'Party Building', label: 'Party Building' },
  { value: 'Ethics', label: 'Ethics & Morals' },
  { value: 'Culture', label: 'Culture' },
  { value: 'Education', label: 'Education' },
];

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-6 flex items-center justify-start md:justify-center border-b border-[#D4AF37]/10 mb-8">
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#0A0A0A] border border-[#D4AF37]/15 backdrop-blur-sm max-w-full">
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onChange(cat.value)}
              className="relative px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors duration-300 whitespace-nowrap focus:outline-none"
              style={{
                fontFamily: 'var(--font-source), sans-serif',
                color: isActive ? '#050505' : 'rgba(255,255,255,0.45)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#FFF9E6';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
              }}
            >
              {/* Slideable background fill */}
              {isActive && (
                <motion.div
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  style={{
                    background: 'linear-gradient(135deg, #F5C542 0%, #D4AF37 100%)',
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Text content (placed above indicator layout) */}
              <span className="relative z-10">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
