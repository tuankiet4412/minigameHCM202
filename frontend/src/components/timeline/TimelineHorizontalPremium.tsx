'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import type { EnrichedTimelineEvent } from '@/lib/timeline-enrichment';

export default function TimelineHorizontalPremium({
  events,
  onSelect,
}: {
  events: EnrichedTimelineEvent[];
  onSelect: (event: EnrichedTimelineEvent) => void;
}) {
  return (
    <div className="relative pb-8">
      <div className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#D4A74E]/30 to-transparent md:block" />

      <div className="flex gap-6 overflow-x-auto pb-6 pt-4 scrollbar-thin">
        {events.map((event, i) => (
          <motion.article
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            whileHover={{ y: -8 }}
            className="w-72 shrink-0 cursor-pointer"
            onClick={() => onSelect(event)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(event)}
          >
            <div className="group overflow-hidden rounded-[20px] border border-[#D4A74E]/20 bg-[#0B0B0B]/80 backdrop-blur-md transition-all hover:border-[#F5C76B]/35 hover:shadow-[0_0_32px_rgba(212,167,78,0.12)]">
              {event.image_url && (
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    fill
                    className="object-cover sepia-[0.25] transition-transform group-hover:scale-105"
                    sizes="288px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] to-transparent" />
                  <span className="absolute left-3 top-3 rounded-md bg-gradient-to-r from-[#A31212] to-[#D62828] px-2.5 py-0.5 text-xs font-bold text-white">
                    {event.year}
                  </span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-display font-bold text-white">{event.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-[#E6B85C]">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-[#A8A8A8]">{event.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#D4A74E]">
                  Xem chi tiết <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
