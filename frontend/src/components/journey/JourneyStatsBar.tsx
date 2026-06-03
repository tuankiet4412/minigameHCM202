'use client';

import { motion } from 'framer-motion';
import { Globe2, Clock, Route, BookOpen, Award } from 'lucide-react';
import { AnimatedCounter } from '@/components/animation/AnimatedCounter';
import { JOURNEY_STATS } from '@/lib/journey-enrichment';
import { LuxuryDivider } from '@/components/journey/LuxuryPanel';

const stats = [
  { icon: Globe2, label: 'Countries Visited', value: JOURNEY_STATS.countries, suffix: '' },
  { icon: Clock, label: 'Years of Journey', value: JOURNEY_STATS.durationYears, suffix: '' },
  { icon: Route, label: 'Distance Travelled', value: JOURNEY_STATS.distanceKm, suffix: ' km' },
  { icon: BookOpen, label: 'Major Events', value: JOURNEY_STATS.events, suffix: '+' },
  { icon: Award, label: 'Historical Legacy', value: JOURNEY_STATS.legacyScore, suffix: '%' },
];

export default function JourneyStatsBar() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="journey-stats mt-8 overflow-hidden rounded-[24px] border border-[#D4AF37]/20 bg-[#0A0A0A]/80 p-8 shadow-[0_24px_64px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(212,175,55,0.06)] backdrop-blur-xl"
    >
      <div className="mb-6 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Legacy Metrics</p>
        <h3 className="mt-2 font-display text-xl text-white">The Scale of the Journey</h3>
      </div>

      <LuxuryDivider />

      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 transition-colors group-hover:border-[#FFD700]/40 group-hover:bg-[#FFD700]/10">
              <stat.icon className="h-5 w-5 text-[#FFD700] transition-transform group-hover:scale-110" />
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-white">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.15em] text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
