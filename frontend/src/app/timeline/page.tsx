'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import type { TimelineEvent } from '@/lib/types';
import Modal from '@/components/ui/Modal';
import Loading from '@/components/ui/Loading';

const fallbackEvents: TimelineEvent[] = [
  { id: 1, year: 1890, title: 'Birth of Ho Chi Minh', description: 'Born in Kim Lien village, Nghe An province.', details: 'Born into a patriotic scholar family.', image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800' },
  { id: 2, year: 1911, title: 'Left Vietnam', description: 'Departed Saigon to find path for national salvation.', details: 'Aboard the Amiral Latouche-Tréville.', image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800' },
  { id: 3, year: 1919, title: 'Versailles Peace Conference', description: 'Submitted 8-point petition for Vietnamese independence.', details: 'As Nguyen Ai Quoc.', image_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800' },
  { id: 4, year: 1920, title: "Read Lenin's Thesis", description: 'Discovered path through Marxism-Leninism.', details: 'At Tours Congress.', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800' },
  { id: 5, year: 1925, title: 'Founded Revolutionary Youth League', description: 'Established in Guangzhou, China.', details: 'Trained future revolutionary leaders.', image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800' },
  { id: 6, year: 1930, title: 'Founded Communist Party of Vietnam', description: 'Unified communist organizations in Hong Kong.', details: 'Foundation for Vietnamese revolution.', image_url: 'https://images.unsplash.com/photo-1518005020951-eccb994ad75d?w=800' },
];

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<TimelineEvent | null>(null);

  useEffect(() => {
    api.timeline.list()
      .then((data) => setEvents(data as TimelineEvent[]))
      .catch(() => setEvents(fallbackEvents))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-4xl text-center mb-16">
        <h1 className="section-title">Historical Timeline</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Key milestones in Ho Chi Minh&apos;s journey (1890–1930)
        </p>
      </div>

      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-heritage-gold/40" aria-hidden />

        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative mb-12 flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`museum-card w-[calc(50%-2rem)] cursor-pointer p-4 transition-shadow hover:shadow-xl ${i % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}
              onClick={() => setSelected(event)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelected(event)}
              aria-label={`View details for ${event.title}`}
            >
              <span className="inline-block rounded-full bg-heritage-red px-3 py-1 text-sm font-bold text-white">
                {event.year}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold">{event.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{event.description}</p>
            </div>
            <div className="absolute left-1/2 top-6 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-heritage-gold bg-heritage-red" />
          </motion.div>
        ))}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <div>
            <span className="text-heritage-red font-bold text-lg dark:text-heritage-gold">{selected.year}</span>
            {selected.image_url && (
              <div className="relative mt-4 h-48 w-full rounded-lg overflow-hidden">
                <Image src={selected.image_url} alt={selected.title} fill className="object-cover" />
              </div>
            )}
            <p className="mt-4 text-gray-700 dark:text-gray-300">{selected.description}</p>
            {selected.details && (
              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{selected.details}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
