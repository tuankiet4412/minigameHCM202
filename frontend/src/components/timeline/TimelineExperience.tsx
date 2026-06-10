'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import type { TimelineEvent } from '@/lib/types';
import {
  enrichTimelineEvents,
  FALLBACK_TIMELINE_EVENTS,
  type EnrichedTimelineEvent,
  type TimelineCategory,
} from '@/lib/timeline-enrichment';
import { PageSkeleton } from '@/components/ui/Skeleton';
import TimelineHero from '@/components/timeline/TimelineHero';
import TimelineControls, { type TimelineViewMode } from '@/components/timeline/TimelineControls';
import TimelineSidebar from '@/components/timeline/TimelineSidebar';
import TimelineVerticalPremium from '@/components/timeline/TimelineVerticalPremium';
import TimelineHorizontalPremium from '@/components/timeline/TimelineHorizontalPremium';
import TimelineSearchFilter from '@/components/timeline/TimelineSearchFilter';
import TimelineCategoryNav from '@/components/timeline/TimelineCategoryNav';
import TimelineDetailModal from '@/components/timeline/TimelineDetailModal';
import TimelinePageBackground from '@/components/timeline/TimelinePageBackground';

const TimelineScene3D = dynamic(() => import('@/components/three/TimelineScene3D'), { ssr: false });

export default function TimelineExperience() {
  const [rawEvents, setRawEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<EnrichedTimelineEvent | null>(null);
  const [viewMode, setViewMode] = useState<TimelineViewMode>('vertical');
  const [category, setCategory] = useState<TimelineCategory>('all');
  const [query, setQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [exploredIds, setExploredIds] = useState<Set<number>>(new Set());

  const events = useMemo(() => enrichTimelineEvents(rawEvents), [rawEvents]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory = category === 'all' || event.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q) ||
        String(event.year).includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [events, category, query]);

  useEffect(() => {
    api.timeline
      .list()
      .then((data) => {
        const events = data as TimelineEvent[];
        if (events.length < FALLBACK_TIMELINE_EVENTS.length) {
          setRawEvents(FALLBACK_TIMELINE_EVENTS);
        } else {
          setRawEvents(events);
        }
      })
      .catch(() => setRawEvents(FALLBACK_TIMELINE_EVENTS))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = el.scrollHeight > el.clientHeight
        ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
        : 0;
      setScrollProgress(Math.min(pct, 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSelect = (event: EnrichedTimelineEvent) => {
    setSelected(event);
    setExploredIds((prev) => new Set(prev).add(event.id));
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="timeline-page relative min-h-screen pb-28 pt-20">
      <TimelinePageBackground />

      {/* Scroll progress bar */}
      <div className="fixed top-[72px] left-0 right-0 z-50 h-0.5 bg-[#121212]" aria-hidden>
        <motion.div
          className="h-full bg-gradient-to-r from-[#A31212] via-[#D4A74E] to-[#F5C76B]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Ambient particles — above background, below content */}
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#F5C76B]/30"
            style={{ left: `${(i * 19 + 8) % 100}%`, top: `${(i * 23 + 12) % 100}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <TimelineHero />

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <TimelineControls mode={viewMode} onChange={setViewMode} />

          <div className="mt-10 flex flex-col gap-8 lg:mt-14 lg:flex-row lg:gap-10">
            <div className="hidden lg:block lg:w-[280px] xl:w-[300px]">
              <TimelineSidebar exploredCount={exploredIds.size} totalCount={events.length} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-8">
                <TimelineSearchFilter query={query} onQueryChange={setQuery} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode + category + query}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                >
                  {viewMode === 'vertical' && (
                    <TimelineVerticalPremium events={filteredEvents} onSelect={handleSelect} />
                  )}
                  {viewMode === 'horizontal' && (
                    <TimelineHorizontalPremium events={filteredEvents} onSelect={handleSelect} />
                  )}
                  {viewMode === '3d' && (
                    <div className="rounded-[24px] border border-[#D4A74E]/20 bg-[#0A0A0A]/60 p-4 backdrop-blur-sm">
                      <TimelineScene3D events={filteredEvents} />
                      <p className="mt-4 text-center text-sm text-[#A8A8A8]">
                        Kéo để xoay • Cuộn để khám phá dòng thời gian 3D
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <TimelineCategoryNav active={category} onChange={setCategory} />
      <TimelineDetailModal event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
