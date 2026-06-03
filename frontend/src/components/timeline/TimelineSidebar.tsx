'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import { Clock, Globe2, Route, BookOpen, Quote } from 'lucide-react';
import { TIMELINE_STATS, TIMELINE_QUOTE } from '@/lib/timeline-enrichment';
import { AnimatedCounter } from '@/components/animation/AnimatedCounter';

export default function TimelineSidebar({
  exploredCount,
  totalCount,
}: {
  exploredCount: number;
  totalCount: number;
}) {
  const gradId = `timeline-ring-${useId().replace(/:/g, '')}`;
  const percent = totalCount > 0 ? Math.round((exploredCount / totalCount) * 100) : 0;
  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const stats = [
    { icon: Clock, label: 'Năm hành trình', value: TIMELINE_STATS.years, suffix: '', isDistance: false },
    { icon: Globe2, label: 'Quốc gia đã đến', value: TIMELINE_STATS.countries, suffix: '', isDistance: false },
    { icon: Route, label: 'Quãng đường', value: TIMELINE_STATS.distanceKm, suffix: '+', isDistance: true },
    { icon: BookOpen, label: 'Sự kiện lịch sử', value: TIMELINE_STATS.events, suffix: '+', isDistance: false },
  ];

  return (
    <aside className="timeline-sidebar space-y-5 lg:sticky lg:top-28 lg:self-start">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="rounded-[20px] border border-[#D4A74E]/20 bg-[#0A0A0A]/75 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(212,167,78,0.08)] backdrop-blur-xl"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4A74E]">
          Tiến độ hành trình
        </p>

        <div className="mt-6 flex flex-col items-center">
          <div className="relative h-36 w-36">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A31212" />
                  <stop offset="50%" stopColor="#D4A74E" />
                  <stop offset="100%" stopColor="#F5C76B" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-bold text-[#F5C76B]">{percent}%</span>
              <span className="text-[10px] uppercase tracking-wider text-[#A8A8A8]">Hoàn thành</span>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-[#D9D9D9]">
            <span className="font-semibold text-[#F5C76B]">{exploredCount}</span>
            {' / '}
            {totalCount} cột mốc đã khám phá
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="rounded-[20px] border border-[#D4A74E]/20 bg-[#0A0A0A]/75 p-6 backdrop-blur-xl"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4A74E]">
          Tổng quan hành trình
        </p>
        <ul className="mt-5 space-y-4">
          {stats.map((stat) => (
            <li key={stat.label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D4A74E]/20 bg-[#D4A74E]/5">
                <stat.icon className="h-4 w-4 text-[#E6B85C]" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-white">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  {stat.isDistance && (
                    <span className="ml-1 text-sm font-normal text-[#A8A8A8]">km</span>
                  )}
                </p>
                <p className="text-xs text-[#A8A8A8]">{stat.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.blockquote
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative rounded-[20px] border border-[#D4A74E]/15 bg-gradient-to-br from-[#121212]/90 to-[#0A0A0A]/90 p-6 backdrop-blur-xl"
      >
        <Quote className="h-8 w-8 text-[#D4A74E]/40" aria-hidden />
        <p className="mt-3 font-display text-base italic leading-relaxed text-[#D9D9D9]">
          &ldquo;{TIMELINE_QUOTE.text}&rdquo;
        </p>
        <footer className="mt-3 text-sm font-medium text-[#E6B85C]">— {TIMELINE_QUOTE.author}</footer>
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#D4A74E]/30 to-transparent" />
      </motion.blockquote>
    </aside>
  );
}
