'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import * as Tabs from '@radix-ui/react-tabs';
import { api } from '@/lib/api';
import type { TimelineEvent } from '@/lib/types';
import Modal from '@/components/ui/Modal';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { ScrollReveal } from '@/components/animation/ScrollReveal';
import { TimelineVertical, TimelineHorizontal, Timeline3DView } from '@/components/timeline/TimelineViews';
import { cn } from '@/lib/utils';

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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    api.timeline.list()
      .then((data) => setEvents(data as TimelineEvent[]))
      .catch(() => setEvents(fallbackEvents))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setProgress(Math.min(pct, 100));
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (loading) return <PageSkeleton />;

  return (
    <div className="pt-24">
      <div className="fixed top-20 left-0 right-0 z-40 h-0.5 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-heritage-red via-heritage-gold to-heritage-red transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <section className="relative overflow-hidden px-4 pb-16 pt-8">
        <div className="noise-overlay absolute inset-0 opacity-20" />
        <ScrollReveal className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-heritage-gold">1890 — 1930</p>
          <h1 className="section-title mt-2">Historical Timeline</h1>
          <p className="mt-4 text-muted-foreground">
            Explore pivotal moments through vertical, horizontal, and immersive 3D views
          </p>
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-section">
        <Tabs.Root defaultValue="vertical" className="w-full">
          <Tabs.List className="mb-10 flex flex-wrap justify-center gap-2 rounded-full glass-card p-1.5">
            {(['vertical', 'horizontal', '3d'] as const).map((mode) => (
              <Tabs.Trigger
                key={mode}
                value={mode}
                className={cn(
                  'rounded-full px-6 py-2.5 text-sm font-medium capitalize transition-all',
                  'data-[state=active]:bg-heritage-red data-[state=active]:text-white',
                  'data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground'
                )}
              >
                {mode === '3d' ? '3D View' : `${mode.charAt(0).toUpperCase()}${mode.slice(1)}`}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="vertical">
            <TimelineVertical events={events} onSelect={setSelected} />
          </Tabs.Content>
          <Tabs.Content value="horizontal">
            <TimelineHorizontal events={events} onSelect={setSelected} />
          </Tabs.Content>
          <Tabs.Content value="3d">
            <Timeline3DView events={events} />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Drag to rotate • Auto-rotating 3D timeline
            </p>
          </Tabs.Content>
        </Tabs.Root>
      </section>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <div>
            <span className="font-display text-2xl font-bold text-heritage-gold">{selected.year}</span>
            {selected.image_url && (
              <div className="relative mt-4 h-56 w-full overflow-hidden rounded-glass">
                <Image src={selected.image_url} alt={selected.title} fill className="object-cover" />
              </div>
            )}
            <p className="mt-4 text-muted-foreground">{selected.description}</p>
            {selected.details && (
              <p className="mt-3 text-sm leading-relaxed">{selected.details}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
