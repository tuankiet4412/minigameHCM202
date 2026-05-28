'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { api } from '@/lib/api';
import type { JourneyLocation } from '@/lib/types';
import Modal from '@/components/ui/Modal';
import Loading from '@/components/ui/Loading';

const WorldMap = dynamic(() => import('@/components/journey/WorldMap'), { ssr: false, loading: () => <Loading /> });

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

  useEffect(() => {
    api.journey.list()
      .then((data) => setLocations(data as JourneyLocation[]))
      .catch(() => setLocations(fallbackLocations))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="section-title text-center">World Journey Map</h1>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Countries Ho Chi Minh traveled to in search of national salvation
        </p>

        <div className="mt-10 museum-card overflow-hidden p-2">
          <WorldMap locations={locations} onSelect={setSelected} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelected(loc)}
              className="museum-card p-4 text-left transition-transform hover:-translate-y-1"
            >
              <h3 className="font-display font-semibold text-heritage-red dark:text-heritage-gold">{loc.country}</h3>
              <p className="text-sm text-heritage-gold">{loc.period}</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{loc.description}</p>
            </button>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.country}>
        {selected && (
          <div>
            <p className="text-heritage-gold font-medium">{selected.period}</p>
            {selected.image_url && (
              <div className="relative mt-4 h-40 w-full rounded-lg overflow-hidden">
                <Image src={selected.image_url} alt={selected.country} fill className="object-cover" />
              </div>
            )}
            <p className="mt-4 text-gray-700 dark:text-gray-300">{selected.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
