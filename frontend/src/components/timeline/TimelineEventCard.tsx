'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import type { EnrichedTimelineEvent } from '@/lib/timeline-enrichment';

export default function TimelineEventCard({
  event,
  side,
  index,
  onSelect,
}: {
  event: EnrichedTimelineEvent;
  side: 'left' | 'right';
  index: number;
  onSelect: (event: EnrichedTimelineEvent) => void;
}) {
  const Icon = event.icon;

  return (
    <motion.article
      initial={{ opacity: 0, x: side === 'left' ? -40 : 40, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`group relative w-full max-w-md cursor-pointer lg:w-[calc(50%-3rem)] ${
        side === 'left' ? 'lg:mr-auto' : 'lg:ml-auto'
      }`}
      onClick={() => onSelect(event)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(event)}
      role="button"
      tabIndex={0}
      aria-label={`Khám phá ${event.title}, ${event.year}`}
    >
      <div className="overflow-hidden rounded-[20px] border border-[#D4A74E]/20 bg-[#0B0B0B]/80 shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-400 group-hover:border-[#F5C76B]/35 group-hover:shadow-[0_20px_56px_rgba(0,0,0,0.45),0_0_32px_rgba(212,167,78,0.12)]">
        {event.image_url && (
          <div className="relative h-44 overflow-hidden">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover sepia-[0.25] transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/20 to-transparent" />
            <span className="absolute left-4 top-4 rounded-md bg-gradient-to-r from-[#A31212] to-[#D62828] px-3 py-1 text-xs font-bold text-white shadow-lg">
              {event.year}
            </span>
          </div>
        )}

        <div className="p-5">
          {!event.image_url && (
            <span className="inline-block rounded-md bg-gradient-to-r from-[#A31212] to-[#D62828] px-3 py-1 text-xs font-bold text-white">
              {event.year}
            </span>
          )}
          <h3 className="mt-3 font-display text-lg font-bold text-white group-hover:text-[#F5C76B] transition-colors">
            {event.title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-[#E6B85C]">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {event.location}
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#A8A8A8]">
            {event.description}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#D4A74E] transition-all group-hover:gap-3 group-hover:text-[#F5C76B]">
            Xem chi tiết
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Connector node — desktop only */}
      <div
        className={`absolute top-12 hidden h-10 w-10 items-center justify-center lg:flex ${
          side === 'left' ? '-right-[calc(3rem+20px)]' : '-left-[calc(3rem+20px)]'
        }`}
        aria-hidden
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#F5C76B]/20" style={{ animationDuration: '2.5s' }} />
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#D4A74E]/50 bg-[#121212] shadow-[0_0_20px_rgba(212,167,78,0.25)]">
          <Icon className="h-4 w-4 text-[#F5C76B]" />
        </span>
      </div>
    </motion.article>
  );
}
