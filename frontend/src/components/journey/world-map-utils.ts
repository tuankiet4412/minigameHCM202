import type { EnrichedJourneyLocation } from '@/lib/journey-enrichment';

export const JOURNEY_ORDER = ['Vietnam', 'USA', 'England', 'France', 'Soviet Union', 'China'] as const;

export type LatLng = [number, number];

export function sortJourneyLocations(locations: EnrichedJourneyLocation[]) {
  return [...locations].sort(
    (a, b) => JOURNEY_ORDER.indexOf(a.country as (typeof JOURNEY_ORDER)[number]) - JOURNEY_ORDER.indexOf(b.country as (typeof JOURNEY_ORDER)[number])
  );
}

export function toCoords(locations: EnrichedJourneyLocation[]): LatLng[] {
  return locations.map((l) => [Number(l.latitude), Number(l.longitude)]);
}

/** Interpolate route progress 0–1 into a polyline ending at the current position. */
export function interpolateRoute(coords: LatLng[], progress: number): LatLng[] {
  if (coords.length === 0) return [];
  if (coords.length === 1 || progress <= 0) return [coords[0]];

  const totalSegments = coords.length - 1;
  const position = Math.min(progress, 1) * totalSegments;
  const segIndex = Math.min(Math.floor(position), totalSegments - 1);
  const segT = position - segIndex;

  const result = coords.slice(0, segIndex + 1);
  const a = coords[segIndex];
  const b = coords[segIndex + 1];
  result.push([a[0] + (b[0] - a[0]) * segT, a[1] + (b[1] - a[1]) * segT]);
  return result;
}

export function pointOnRoute(coords: LatLng[], globalT: number): LatLng {
  if (coords.length < 2) return coords[0] ?? [0, 0];
  const totalSegments = coords.length - 1;
  const position = (globalT % 1) * totalSegments;
  const segIndex = Math.min(Math.floor(position), totalSegments - 1);
  const segT = position - segIndex;
  const a = coords[segIndex];
  const b = coords[segIndex + 1];
  return [a[0] + (b[0] - a[0]) * segT, a[1] + (b[1] - a[1]) * segT];
}

export function createExpeditionMarkerHtml(loc: EnrichedJourneyLocation, isActive: boolean) {
  const event = loc.keyEvents?.[0] ?? loc.description ?? '';
  const activeClass = isActive ? ' is-active' : '';

  return `
    <div class="expedition-marker${activeClass}" role="button" aria-label="${loc.country}">
      <div class="expedition-marker__ring expedition-marker__ring--outer"></div>
      <div class="expedition-marker__ring expedition-marker__ring--inner"></div>
      <div class="expedition-marker__core"></div>
      <div class="expedition-marker__beacon"></div>
      <div class="expedition-marker__label">
        <span class="expedition-marker__year">${loc.yearLabel ?? loc.period ?? ''}</span>
        <span class="expedition-marker__country">${loc.country}</span>
        <span class="expedition-marker__event">${event}</span>
      </div>
    </div>
  `;
}

export function createExpeditionPopupHtml(loc: EnrichedJourneyLocation) {
  const event = loc.keyEvents?.[0] ?? '';
  return `
    <div class="expedition-popup">
      <div class="expedition-popup__header">
        <span class="expedition-popup__badge">${loc.yearLabel ?? loc.period ?? ''}</span>
        <strong class="expedition-popup__title">${loc.country}</strong>
      </div>
      ${event ? `<p class="expedition-popup__event">${event}</p>` : ''}
      <p class="expedition-popup__context">${loc.historicalContext ?? loc.description ?? ''}</p>
    </div>
  `;
}

interface Particle {
  t: number;
  speed: number;
  size: number;
  alpha: number;
}

export function createParticleLayer(L: typeof import('leaflet'), routeCoords: LatLng[]) {
  const particles: Particle[] = Array.from({ length: 14 }, () => ({
    t: Math.random(),
    speed: 0.0008 + Math.random() * 0.0012,
    size: 1.5 + Math.random() * 2,
    alpha: 0.4 + Math.random() * 0.6,
  }));

  let rafId = 0;
  let mapRef: L.Map | null = null;

  const Layer = L.Layer.extend({
    onAdd(map: L.Map) {
      mapRef = map;
      this._canvas = L.DomUtil.create('canvas', 'expedition-particle-canvas') as HTMLCanvasElement;
      const pane = map.getPane('overlayPane');
      pane?.appendChild(this._canvas);
      L.DomEvent.disableClickPropagation(this._canvas);
      L.DomEvent.disableScrollPropagation(this._canvas);
      this._resize();
      map.on('move resize zoom viewreset', this._resize, this);
      this._animate();
    },

    onRemove(map: L.Map) {
      cancelAnimationFrame(rafId);
      map.off('move resize zoom viewreset', this._resize, this);
      this._canvas?.remove();
      mapRef = null;
    },

    _resize() {
      if (!mapRef || !this._canvas) return;
      const size = mapRef.getSize();
      this._canvas.width = size.x;
      this._canvas.height = size.y;
      this._canvas.style.width = `${size.x}px`;
      this._canvas.style.height = `${size.y}px`;
    },

    _animate() {
      if (!mapRef || !this._canvas) return;
      const ctx = this._canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

      particles.forEach((p) => {
        p.t = (p.t + p.speed) % 1;
        const latlng = pointOnRoute(routeCoords, p.t);
        const point = mapRef!.latLngToContainerPoint(latlng);

        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, p.size * 4);
        gradient.addColorStop(0, `rgba(255, 215, 0, ${p.alpha})`);
        gradient.addColorStop(0.4, `rgba(212, 175, 55, ${p.alpha * 0.5})`);
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(point.x, point.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 215, 0, ${Math.min(1, p.alpha + 0.2)})`;
        ctx.arc(point.x, point.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(() => this._animate());
    },
  });

  return new Layer() as L.Layer;
}
