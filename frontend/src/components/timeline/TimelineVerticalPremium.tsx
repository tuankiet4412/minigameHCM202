'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { EnrichedTimelineEvent } from '@/lib/timeline-enrichment';
import TimelineEventCard from '@/components/timeline/TimelineEventCard';

export default function TimelineVerticalPremium({
  events,
  onSelect,
}: {
  events: EnrichedTimelineEvent[];
  onSelect: (event: EnrichedTimelineEvent) => void;
}) {
  if (events.length === 0) {
    return (
      <div className="py-20 text-center text-[#A8A8A8]">
        No events match your search. Try adjusting filters.
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-4xl px-2 pb-24 pt-4">
      {/* Glowing spine */}
      <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4A74E]/40 to-transparent" />
        <motion.div
          className="absolute left-0 top-0 w-px bg-gradient-to-b from-[#F5C76B] to-[#D4A74E]"
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ boxShadow: '0 0 12px rgba(245,199,107,0.5)' }}
        />
      </div>

      <div className="space-y-12 lg:space-y-16">
        {events.map((event, i) => (
          <TimelineEventCard
            key={event.id}
            event={event}
            side={i % 2 === 0 ? 'left' : 'right'}
            index={i}
            onSelect={onSelect}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 flex justify-center"
      >
        <div className="flex flex-col items-center gap-2 text-[#D4A74E]/60">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
