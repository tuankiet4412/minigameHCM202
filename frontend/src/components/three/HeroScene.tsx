'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Globe3D = dynamic(
  () => import('@/components/ui/3d-globe').then((m) => m.Globe3D),
  { ssr: false }
);

const journeyMarkers = [
  { lat: 16.05, lng: 108.2, label: 'Vietnam', color: '#C41E3A' },
  { lat: 48.86, lng: 2.35, label: 'France', color: '#D4AF37' },
  { lat: 51.51, lng: -0.13, label: 'England', color: '#D4AF37' },
  { lat: 40.71, lng: -74.01, label: 'USA', color: '#D4AF37' },
  { lat: 55.76, lng: 37.62, label: 'USSR', color: '#C41E3A' },
  { lat: 23.13, lng: 113.26, label: 'China', color: '#C41E3A' },
];

export default function HeroScene() {
  return (
    <div className="absolute inset-0 opacity-90">
      <Suspense fallback={null}>
        <Globe3D
          markers={journeyMarkers}
          config={{
            globeColor: '#1a2744',
            emissive: '#0d1528',
            atmosphereColor: '#D4AF37',
            autoRotateSpeed: 0.5,
          }}
          className="h-full w-full"
        />
      </Suspense>
    </div>
  );
}
