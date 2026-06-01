'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { TimelineEvent } from '@/lib/types';
import { GlassCard } from '@/components/ui/glass-card';

const TimelineScene3D = dynamic(() => import('@/components/three/TimelineScene3D'), { ssr: false });

export function TimelineVertical({
  events,
  onSelect,
}: {
  events: TimelineEvent[];
  onSelect: (e: TimelineEvent) => void;
}) {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-heritage-gold/0 via-heritage-gold/50 to-heritage-gold/0" />
      {events.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: i * 0.08 }}
          className={`relative mb-14 flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
        >
          <GlassCard
            className={`w-[calc(50%-2rem)] cursor-pointer !p-5 ${i % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}
            onClick={() => onSelect(event)}
            hover
          >
            <span className="inline-block rounded-full bg-gradient-to-r from-heritage-red to-heritage-red-dark px-3 py-1 text-xs font-bold text-white">
              {event.year}
            </span>
            <h3 className="mt-3 font-display text-lg font-semibold">{event.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
          </GlassCard>
          <div className="absolute left-1/2 top-8 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-heritage-gold bg-heritage-red shadow-glow-red" />
        </motion.div>
      ))}
    </div>
  );
}

export function TimelineHorizontal({
  events,
  onSelect,
}: {
  events: TimelineEvent[];
  onSelect: (e: TimelineEvent) => void;
}) {
  return (
    <div className="overflow-x-auto pb-8">
      <div className="flex min-w-max gap-6 px-4">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="w-72 flex-shrink-0"
          >
            <GlassCard className="cursor-pointer" onClick={() => onSelect(event)} hover glow>
              {event.image_url && (
                <div className="relative -mx-6 -mt-6 mb-4 h-36 overflow-hidden rounded-t-glass">
                  <Image src={event.image_url} alt="" fill className="object-cover" />
                </div>
              )}
              <span className="text-heritage-gold font-bold">{event.year}</span>
              <h3 className="mt-2 font-display font-semibold">{event.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function Timeline3DView({ events }: { events: TimelineEvent[] }) {
  return <TimelineScene3D events={events} />;
}
