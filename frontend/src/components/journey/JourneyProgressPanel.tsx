'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { EnrichedJourneyLocation } from '@/lib/journey-enrichment';
import { countryLabelVi } from '@/lib/journey-enrichment';
import LuxuryPanel from '@/components/journey/LuxuryPanel';
import { cn } from '@/lib/utils';

export default function JourneyProgressPanel({
  locations,
  selected,
  onSelect,
  progressPercent,
}: {
  locations: EnrichedJourneyLocation[];
  selected: EnrichedJourneyLocation | null;
  onSelect: (loc: EnrichedJourneyLocation) => void;
  progressPercent: number;
}) {
  const activeIndex = selected?.order ?? -1;
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selected?.country]);

  return (
    <LuxuryPanel label="Hành trình" title="Dòng thời gian">
      <div className="px-6 py-5">
        <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#F5C542]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
        <p className="mt-2 text-center text-[10px] uppercase tracking-[0.25em] text-gray-500">
          Đã khám phá {Math.round(progressPercent)}% hành trình
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-5 md:px-5">
        <div className="relative ml-4">
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-[#D4AF37]/50 via-[#FFD700]/30 to-[#D4AF37]/10" />
          <motion.div
            className="absolute left-[7px] top-2 w-px origin-top bg-gradient-to-b from-[#FFD700] to-[#D4AF37]"
            initial={{ height: 0 }}
            animate={{
              height: activeIndex >= 0 ? `${((activeIndex + 0.5) / locations.length) * 100}%` : '0%',
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />

          {locations.map((loc, i) => {
            const isActive = loc.country === selected?.country;
            const isPast = i <= activeIndex;

            return (
              <motion.button
                key={loc.country}
                ref={isActive ? activeRef : undefined}
                type="button"
                onClick={() => onSelect(loc)}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className={cn('relative mb-3 block w-full text-left last:mb-0', isActive && 'z-10')}
              >
                <span
                  className={cn(
                    'absolute -left-4 top-5 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full transition-all duration-500',
                    isActive
                      ? 'h-5 w-5 border-2 border-[#FFD700] bg-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.6)]'
                      : isPast
                        ? 'border-2 border-[#D4AF37]/70 bg-[#D4AF37]/40'
                        : 'border border-white/20 bg-[#101010]'
                  )}
                >
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-[#FFD700]"
                      animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </span>

                <div
                  className={cn(
                    'ml-6 overflow-hidden rounded-2xl border transition-all duration-400',
                    isActive
                      ? 'border-[#FFD700]/40 bg-gradient-to-br from-[#D4AF37]/15 to-[#101010]/90 shadow-[0_0_30px_rgba(212,175,55,0.15)]'
                      : 'border-white/5 bg-[#101010]/60 hover:border-[#D4AF37]/25 hover:bg-[#D4AF37]/5'
                  )}
                >
                  <div className="flex items-center gap-3 p-3">
                    <Image
                      src={`https://flagcdn.com/w40/${loc.flagCode}.png`}
                      alt=""
                      width={28}
                      height={18}
                      className="rounded-sm opacity-90"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">{loc.yearLabel}</p>
                      <p className="truncate font-display text-sm font-semibold text-white">{countryLabelVi(loc.country)}</p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-600">{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-[#D4AF37]/10 px-3 pb-3 pt-2 text-xs leading-relaxed text-gray-400">
                      {loc.description || loc.historicalContext}
                    </p>
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[#D4AF37]/10 px-6 py-3.5 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
          {activeIndex + 1} / {locations.length} quốc gia
        </p>
      </div>
    </LuxuryPanel>
  );
}
