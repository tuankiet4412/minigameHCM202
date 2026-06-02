'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Map, Globe2, Compass, Sparkles } from 'lucide-react';
import { gsap } from '@/lib/animations';
import { api } from '@/lib/api';
import type { JourneyLocation } from '@/lib/types';
import { enrichLocations, type EnrichedJourneyLocation } from '@/lib/journey-enrichment';
import { playBattleSound } from '@/lib/battle-sounds';
import { PageSkeleton } from '@/components/ui/Skeleton';
import CountryInfoPanel from '@/components/journey/CountryInfoPanel';
import JourneyProgressPanel from '@/components/journey/JourneyProgressPanel';
import JourneyStatsBar from '@/components/journey/JourneyStatsBar';
import JourneyBackground from '@/components/journey/JourneyBackground';
import { TextReveal } from '@/components/animation/TextReveal';
import { cn } from '@/lib/utils';

const PremiumGlobe = dynamic(() => import('@/components/journey/PremiumGlobe'), { ssr: false });
const WorldMap = dynamic(() => import('@/components/journey/WorldMap'), { ssr: false });

const fallbackLocations: JourneyLocation[] = [
  { id: 1, country: 'Vietnam', latitude: 16.0544, longitude: 108.2022, description: 'Birthplace and departure point.', period: '1890–1911' },
  { id: 4, country: 'USA', latitude: 40.7128, longitude: -74.006, description: 'Worked in Harlem, New York.', period: '1912–1913' },
  { id: 3, country: 'England', latitude: 51.5074, longitude: -0.1278, description: 'Worked in London.', period: '1913–1917' },
  { id: 2, country: 'France', latitude: 48.8566, longitude: 2.3522, description: 'Versailles petition and communist organizing.', period: '1917–1923' },
  { id: 5, country: 'Soviet Union', latitude: 55.7558, longitude: 37.6173, description: 'Studied in Moscow.', period: '1923–1924' },
  { id: 6, country: 'China', latitude: 23.1291, longitude: 113.2644, description: 'Revolutionary Youth League & CPV founding era.', period: '1924–1930' },
];

export default function JourneyExperience() {
  const [rawLocations, setRawLocations] = useState<JourneyLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<EnrichedJourneyLocation | null>(null);
  const [show2D, setShow2D] = useState(false);
  const [focusKey, setFocusKey] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);
  const mapPanelRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const locations = useMemo(() => enrichLocations(rawLocations), [rawLocations]);

  const progressPercent = selected
    ? ((selected.order + 1) / locations.length) * 100
    : 0;

  useEffect(() => {
    api.journey
      .list()
      .then((data) => setRawLocations(data as JourneyLocation[]))
      .catch(() => setRawLocations(fallbackLocations))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !pageRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.journey-eyebrow', { y: 20, opacity: 0, duration: 0.7 })
        .from('.journey-title .word', { y: 60, opacity: 0, rotateX: 40, stagger: 0.06, duration: 0.8 }, '-=0.3')
        .from('.journey-subtitle', { y: 24, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.journey-toggle', { y: 16, opacity: 0, stagger: 0.1, duration: 0.5 }, '-=0.3')
        .from(leftPanelRef.current, { x: -40, opacity: 0, duration: 0.9 }, '-=0.2')
        .from(mapPanelRef.current, { scale: 0.94, opacity: 0, duration: 1.1 }, '-=0.7')
        .from(rightPanelRef.current, { x: 40, opacity: 0, duration: 0.9 }, '-=0.9')
        .from('.journey-stats', { y: 30, opacity: 0, duration: 0.7 }, '-=0.4');
    }, pageRef);
    return () => ctx.revert();
  }, [loading]);

  useEffect(() => {
    if (!loading && locations.length > 0) {
      setSelected((prev) => prev ?? locations[0]);
    }
  }, [locations, loading]);

  const handleSelect = useCallback((loc: EnrichedJourneyLocation) => {
    setSelected(loc);
    setFocusKey((k) => k + 1);
    playBattleSound('clash');
  }, []);

  if (loading) return <PageSkeleton />;

  return (
    <div ref={pageRef} className="relative min-h-screen overflow-hidden bg-[#050505] pb-12 pt-24">
      <JourneyBackground />

      <div className="relative z-10 mx-auto max-w-[1800px] px-4 md:px-6 lg:px-8">
        <header className="journey-hero mx-auto max-w-3xl text-center">
          <motion.p
            className="journey-eyebrow text-[10px] font-semibold uppercase tracking-[0.4em] text-[#D4AF37]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Sparkles className="mr-2 inline h-3 w-3" />
            1911 — 1930 • National Salvation
          </motion.p>
          <TextReveal
            as="h1"
            text="The Path Across Nations"
            className="journey-title mt-5 justify-center text-center font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
            delay={0.1}
          />
          <p className="journey-subtitle mx-auto mt-5 max-w-xl text-sm leading-relaxed text-gray-400 md:text-base">
            An immersive digital museum tracing Nguyen Tat Thanh&apos;s expedition from Saigon to Moscow and Guangzhou — six nations, one destiny.
          </p>

          <div className="journey-toggle mt-8 inline-flex rounded-full border border-[#D4AF37]/20 bg-[#0A0A0A]/80 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setShow2D(false)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300',
                !show2D
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#050505] shadow-[0_0_24px_rgba(212,175,55,0.35)]'
                  : 'text-gray-400 hover:text-[#FFD700]'
              )}
            >
              <Globe2 className="h-4 w-4" />
              3D Globe
            </button>
            <button
              type="button"
              onClick={() => setShow2D(true)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300',
                show2D
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#050505] shadow-[0_0_24px_rgba(212,175,55,0.35)]'
                  : 'text-gray-400 hover:text-[#FFD700]'
              )}
            >
              <Map className="h-4 w-4" />
              2D Map
            </button>
          </div>
        </header>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] lg:gap-6 xl:h-[min(75vh,760px)]">
          <div ref={leftPanelRef} className="order-2 hidden lg:order-1 lg:block lg:h-full lg:min-h-0">
            <CountryInfoPanel location={selected} />
          </div>

          <motion.div
            ref={mapPanelRef}
            className="order-1 lg:order-2 lg:h-full lg:min-h-0"
            whileHover={{ scale: 1.002 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative h-[min(58vh,560px)] overflow-hidden rounded-[24px] border border-[#D4AF37]/25 bg-[#0A0A0A]/90 shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(212,175,55,0.08),inset_0_1px_0_rgba(212,175,55,0.1)] backdrop-blur-sm lg:h-full">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-[#050505]/80 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#050505]/60 to-transparent" />

              <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#050505]/70 px-4 py-2 text-[11px] text-[#FFD700] backdrop-blur-md">
                <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '12s' }} />
                Mission Control • Explore the route
              </div>

              <div className="relative h-full w-full">
                <div
                  className={cn(
                    'absolute inset-0 transition-opacity duration-300',
                    show2D ? 'pointer-events-none z-0 opacity-0' : 'z-10 opacity-100'
                  )}
                >
                  <PremiumGlobe
                    locations={locations}
                    selected={selected}
                    focusKey={focusKey}
                    onSelect={handleSelect}
                    className="h-full w-full"
                  />
                </div>
                <div
                  className={cn(
                    'absolute inset-0 transition-opacity duration-300',
                    show2D ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
                  )}
                >
                  <WorldMap
                    locations={locations}
                    selectedCountry={selected?.country}
                    focusKey={focusKey}
                    active={show2D}
                    onSelect={handleSelect}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 lg:hidden">
              <CountryInfoPanel location={selected} />
            </div>
          </motion.div>

          <div ref={rightPanelRef} className="order-3 hidden lg:block lg:h-full lg:min-h-0">
            <JourneyProgressPanel
              locations={locations}
              selected={selected}
              onSelect={handleSelect}
              progressPercent={progressPercent}
            />
          </div>
        </div>

        <div className="mt-5 md:col-span-2 lg:hidden">
          <JourneyProgressPanel
            locations={locations}
            selected={selected}
            onSelect={handleSelect}
            progressPercent={progressPercent}
          />
        </div>

        <JourneyStatsBar />
      </div>
    </div>
  );
}
