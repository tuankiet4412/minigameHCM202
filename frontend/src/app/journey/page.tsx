'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Map, Globe } from 'lucide-react';
import { api } from '@/lib/api';
import type { JourneyLocation } from '@/lib/types';
import Modal from '@/components/ui/Modal';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { ScrollReveal } from '@/components/animation/ScrollReveal';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

const WorldMap = dynamic(() => import('@/components/journey/WorldMap'), { ssr: false });
const JourneyMap3D = dynamic(() => import('@/components/three/JourneyMap3D'), { ssr: false });

const fallbackLocations: JourneyLocation[] = [
  { id: 1, country: 'Vietnam', latitude: 16.0544, longitude: 108.2022, description: 'Birthplace and early life.', period: '1890–1911' },
  { id: 2, country: 'France', latitude: 48.8566, longitude: 2.3522, description: 'Studied politics, Versailles petition.', period: '1911–1923' },
  { id: 3, country: 'England', latitude: 51.5074, longitude: -0.1278, description: 'Worked in London.', period: '1913–1914' },
  { id: 4, country: 'USA', latitude: 40.7128, longitude: -74.006, description: 'Worked in Harlem, New York.', period: '1912–1913' },
  { id: 5, country: 'Soviet Union', latitude: 55.7558, longitude: 37.6173, description: 'Studied in Moscow.', period: '1923–1924' },
  { id: 6, country: 'China', latitude: 23.1291, longitude: 113.2644, description: 'Founded Revolutionary Youth League.', period: '1924–1930' },
];

export default function JourneyPage() {
  const [locations, setLocations] = useState<JourneyLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<JourneyLocation | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  useEffect(() => {
    api.journey.list()
      .then((data) => setLocations(data as JourneyLocation[]))
      .catch(() => setLocations(fallbackLocations))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton />;

  return (
    <div className="pt-24 pb-section">
      <section className="px-4">
        <ScrollReveal className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-heritage-gold">World Journey</p>
          <h1 className="section-title mt-2">Interactive Journey Map</h1>
          <p className="mt-4 text-muted-foreground">
            Trace the path across nations with animated routes and 3D globe exploration
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-8 flex max-w-6xl justify-center gap-2">
          <button
            onClick={() => setViewMode('3d')}
            className={cn(
              'flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all',
              viewMode === '3d' ? 'bg-heritage-red text-white' : 'glass-card text-muted-foreground'
            )}
          >
            <Globe className="h-4 w-4" /> 3D Globe
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className={cn(
              'flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all',
              viewMode === '2d' ? 'bg-heritage-red text-white' : 'glass-card text-muted-foreground'
            )}
          >
            <Map className="h-4 w-4" /> 2D Map
          </button>
        </div>

        <div className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-glass glass-card p-2">
          {viewMode === '3d' ? (
            <JourneyMap3D locations={locations} onSelect={setSelected} className="h-[520px] w-full" />
          ) : (
            <WorldMap locations={locations} onSelect={setSelected} />
          )}
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <GlassCard
              key={loc.id}
              className="cursor-pointer"
              onClick={() => setSelected(loc)}
              hover
              glow
            >
              <h3 className="font-display text-lg font-semibold">{loc.country}</h3>
              <p className="text-sm text-heritage-gold">{loc.period}</p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{loc.description}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.country}>
        {selected && (
          <div>
            <p className="font-medium text-heritage-gold">{selected.period}</p>
            {selected.image_url && (
              <div className="relative mt-4 h-48 w-full overflow-hidden rounded-glass">
                <Image src={selected.image_url} alt={selected.country} fill className="object-cover" />
              </div>
            )}
            <p className="mt-4 leading-relaxed text-muted-foreground">{selected.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
