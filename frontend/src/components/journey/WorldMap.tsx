'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { EnrichedJourneyLocation } from '@/lib/journey-enrichment';
import {
  sortJourneyLocations,
  toCoords,
  interpolateRoute,
  createExpeditionMarkerHtml,
  createExpeditionPopupHtml,
  createParticleLayer,
} from '@/components/journey/world-map-utils';

interface WorldMapProps {
  locations: EnrichedJourneyLocation[];
  selectedCountry?: string | null;
  focusKey?: number;
  active?: boolean;
  onSelect: (loc: EnrichedJourneyLocation) => void;
}

export default function WorldMap({ locations, selectedCountry, focusKey = 0, active = true, onSelect }: WorldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const sortedRef = useRef<EnrichedJourneyLocation[]>([]);
  const routeAnimRef = useRef<number | null>(null);
  const onSelectRef = useRef(onSelect);
  const mapReadyRef = useRef(false);
  const [coordsLabel, setCoordsLabel] = useState('—');

  onSelectRef.current = onSelect;

  const flyToCountry = useCallback((country: string, duration = 0.55) => {
    const map = mapInstance.current;
    if (!map) return;

    const loc = sortedRef.current.find((l) => l.country === country);
    if (!loc) return;

    map.stop();
    map.flyTo([Number(loc.latitude), Number(loc.longitude)], 5, {
      duration,
      easeLinearity: 0.15,
    });

    const markerIndex = sortedRef.current.findIndex((l) => l.country === country);
    const marker = markersRef.current[markerIndex];
    if (marker) {
      marker.openPopup();
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;

    let cancelled = false;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapRef.current) return;

      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      mapReadyRef.current = false;

      const sorted = sortJourneyLocations(locations);
      sortedRef.current = sorted;
      const routeCoords = toCoords(sorted);

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
      }).setView([28, 15], 2);
      mapInstance.current = map;

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        opacity: 0.35,
      }).addTo(map);

      L.polyline(routeCoords, {
        color: '#D4AF37',
        weight: 1,
        opacity: 0.12,
        dashArray: '6 10',
        lineCap: 'round',
        interactive: false,
      }).addTo(map);

      const glow = L.polyline([], {
        color: '#FFD700',
        weight: 6,
        opacity: 0.15,
        lineCap: 'round',
        lineJoin: 'round',
        interactive: false,
      }).addTo(map);

      const main = L.polyline([], {
        color: '#FFD700',
        weight: 2.5,
        opacity: 0.95,
        dashArray: '10 14',
        lineCap: 'round',
        lineJoin: 'round',
        interactive: false,
        className: 'expedition-route-line',
      }).addTo(map);

      createParticleLayer(L, routeCoords).addTo(map);

      const start = performance.now();
      const duration = 3200;
      const animateRoute = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const coords = interpolateRoute(routeCoords, eased);
        glow.setLatLngs(coords);
        main.setLatLngs(coords);
        if (progress < 1) {
          routeAnimRef.current = requestAnimationFrame(animateRoute);
        }
      };
      routeAnimRef.current = requestAnimationFrame(animateRoute);

      markersRef.current = sorted.map((loc) => {
        const isActive = loc.country === selectedCountry;
        const icon = L.divIcon({
          className: 'expedition-leaflet-marker',
          html: createExpeditionMarkerHtml(loc, isActive),
          iconSize: [1, 1],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([Number(loc.latitude), Number(loc.longitude)], {
          icon,
          zIndexOffset: isActive ? 1000 : loc.order * 10,
        })
          .addTo(map)
          .bindPopup(createExpeditionPopupHtml(loc), {
            className: 'expedition-leaflet-popup',
            maxWidth: 280,
            closeButton: false,
          });

        marker.on('click', () => onSelectRef.current(loc));
        return marker;
      });

      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        setCoordsLabel(`${e.latlng.lat.toFixed(2)}°N  ${Math.abs(e.latlng.lng).toFixed(2)}°${e.latlng.lng >= 0 ? 'E' : 'W'}`);
      });

      mapReadyRef.current = true;

      if (focusKey > 0 && selectedCountry) {
        flyToCountry(selectedCountry, 0.5);
      } else {
        map.fitBounds(L.latLngBounds(routeCoords), { padding: [80, 80], animate: true, duration: 1.2 });
      }
    };

    initMap();

    return () => {
      cancelled = true;
      mapReadyRef.current = false;
      if (routeAnimRef.current) cancelAnimationFrame(routeAnimRef.current);
      mapInstance.current?.remove();
      mapInstance.current = null;
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  useEffect(() => {
    if (markersRef.current.length === 0) return;

    const updateMarkers = async () => {
      const L = (await import('leaflet')).default;
      sortedRef.current.forEach((loc, i) => {
        const marker = markersRef.current[i];
        if (!marker) return;
        const isActive = loc.country === selectedCountry;
        const icon = L.divIcon({
          className: 'expedition-leaflet-marker',
          html: createExpeditionMarkerHtml(loc, isActive),
          iconSize: [1, 1],
          iconAnchor: [0, 0],
        });
        marker.setIcon(icon);
        marker.setZIndexOffset(isActive ? 1000 : loc.order * 10);
      });
    };
    updateMarkers();
  }, [selectedCountry]);

  useEffect(() => {
    if (!active || focusKey === 0 || !selectedCountry) return;

    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tryFly = () => {
      if (mapReadyRef.current && mapInstance.current) {
        flyToCountry(selectedCountry, 0.55);
      } else if (attempts++ < 30) {
        timer = setTimeout(tryFly, 80);
      }
    };

    tryFly();
    return () => clearTimeout(timer);
  }, [focusKey, selectedCountry, active, flyToCountry]);

  useEffect(() => {
    if (!active || !mapInstance.current) return;
    const map = mapInstance.current;
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (selectedCountry && focusKey > 0) {
        flyToCountry(selectedCountry, 0.55);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [active, selectedCountry, focusKey, flyToCountry]);

  return (
    <div className="expedition-map relative h-full w-full">
      <div className="expedition-map__grid pointer-events-none absolute inset-0 z-[401]" />
      <div className="expedition-map__vignette pointer-events-none absolute inset-0 z-[402]" />
      <div className="expedition-map__corners pointer-events-none absolute inset-0 z-[403]">
        <span /><span /><span /><span />
      </div>

      <div className="pointer-events-none absolute bottom-14 left-5 z-[404] rounded-lg border border-[#D4AF37]/20 bg-[#050505]/80 px-3 py-2 font-mono text-[10px] tracking-wider text-[#FFD700]/80 backdrop-blur-md">
        {coordsLabel}
      </div>

      <div className="pointer-events-none absolute bottom-14 right-14 z-[404] rounded-lg border border-[#D4AF37]/20 bg-[#050505]/80 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/70 backdrop-blur-md">
        Expedition Route • 1911–1930
      </div>

      <div ref={mapRef} className="journey-dark-map h-full w-full" />
    </div>
  );
}
