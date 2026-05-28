'use client';

import { useEffect, useRef } from 'react';
import type { JourneyLocation } from '@/lib/types';

interface WorldMapProps {
  locations: JourneyLocation[];
  onSelect: (loc: JourneyLocation) => void;
}

export default function WorldMap({ locations, onSelect }: WorldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      if (mapInstance.current) {
        mapInstance.current.remove();
      }

      const map = L.map(mapRef.current!).setView([30, 20], 2);
      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      const redIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background:#C41E3A;width:16px;height:16px;border-radius:50%;border:3px solid #D4AF37;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      locations.forEach((loc) => {
        const marker = L.marker([Number(loc.latitude), Number(loc.longitude)], { icon: redIcon })
          .addTo(map)
          .bindPopup(`<b>${loc.country}</b><br/>${loc.period || ''}`);
        marker.on('click', () => onSelect(loc));
      });

      const bounds = L.latLngBounds(locations.map((l) => [Number(l.latitude), Number(l.longitude)]));
      map.fitBounds(bounds, { padding: [50, 50] });
    };

    initMap();

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [locations, onSelect]);

  return <div ref={mapRef} className="h-[500px] w-full rounded-lg shadow-lg" />;
}
