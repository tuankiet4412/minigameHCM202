'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import type { GalleryImage } from '@/lib/types';
import { GALLERY_IMAGES } from '@/lib/gallery-data';

// ── Museum Components ──────────────────────────────────────────
import { MuseumHero } from '@/components/museum/MuseumHero';
import { FeaturedExhibition } from '@/components/museum/FeaturedExhibition';
import { MuseumFilterBar } from '@/components/museum/MuseumFilterBar';
import { CollectionGrid } from '@/components/museum/CollectionGrid';
import { MuseumStats } from '@/components/museum/MuseumStats';
import { ArtifactModal } from '@/components/museum/ArtifactModal';
import type { FilterCategory } from '@/components/museum/MuseumFilterBar';
import TimelinePageBackground from '@/components/timeline/TimelinePageBackground';

const MuseumParticles = dynamic(
  () => import('@/components/museum/MuseumParticles').then(m => m.MuseumParticles),
  { ssr: false }
);

// ── Page skeleton while loading ────────────────────────────────
function MuseumSkeleton() {
  return (
    <div className="min-h-screen" style={{ background: '#050505' }}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {/* Gold spinning ring */}
          <div className="relative w-20 h-20">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: '2px solid rgba(212,175,55,0.15)',
                borderTopColor: '#D4AF37',
                animation: 'spin 1s linear infinite',
              }}
            />
            <div
              className="absolute inset-3 rounded-full"
              style={{
                border: '1px solid rgba(212,175,55,0.08)',
                borderTopColor: 'rgba(212,175,55,0.4)',
                animation: 'spin 1.4s linear infinite reverse',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20"><polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7" fill="#D4AF37" opacity="0.7"/></svg>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-source)', color: 'rgba(212,175,55,0.5)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Đang tải bộ sưu tập
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [sortNewest, setSortNewest] = useState(true);
  const [viewGrid, setViewGrid] = useState(true);
  const collectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImages(GALLERY_IMAGES);
    setLoading(false);
  }, []);

  if (loading) return <MuseumSkeleton />;

  return (
    <>
      <TimelinePageBackground />

      {/* Global museum override — force dark background across the full page */}
      <style>{`
        body { background: #050505 !important; }
        html { background: #050505 !important; }
      `}</style>

      {/* Floating gold particles (fixed overlay) */}
      <MuseumParticles />

      {/* ── HERO ───────────────────────────────────────────── */}
      <MuseumHero />

      {/* ── FEATURED EXHIBITION ────────────────────────────── */}
      <FeaturedExhibition onSelect={setSelected} />

      {/* ── STATS ──────────────────────────────────────────── */}
      <MuseumStats />

      {/* ── COLLECTION SECTION ─────────────────────────────── */}
      <section
        id="museum-collection"
        ref={collectionRef}
        className="relative"
        style={{ background: 'transparent' }}
      >
        {/* Section header */}
        <div
          className="mx-auto max-w-[1400px] px-6 lg:px-16 pt-20 pb-10"
          style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.5))' }} />
                <span style={{ fontFamily: 'var(--font-source)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D4AF37' }}>
                  Bộ sưu tập thường trực
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #F4E4BC 0%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Bộ sưu tập bảo tàng
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                style={{ fontFamily: 'var(--font-source)', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', marginTop: '8px' }}
              >
                {images.length} hiện vật từ 1890–1930
              </motion.p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4">
              {[
                { color: '#D4AF37', label: 'Ảnh' },
                { color: '#C89B3C', label: 'Hiện vật' },
                { color: '#C1121F', label: 'Tài liệu' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span style={{ fontFamily: 'var(--font-source)', color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky filter bar */}
        <MuseumFilterBar
          active={filter}
          onChange={setFilter}
          sortNewest={sortNewest}
          onToggleSort={() => setSortNewest(p => !p)}
          viewGrid={viewGrid}
          onToggleView={() => setViewGrid(p => !p)}
        />

        {/* Collection grid */}
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16 py-12">
          <CollectionGrid
            images={images}
            filter={filter}
            sortNewest={sortNewest}
            viewGrid={viewGrid}
            onSelect={setSelected}
          />
        </div>
      </section>

      {/* ── FOOTER CTA ─────────────────────────────────────── */}
      <section
        className="relative py-12 overflow-hidden"
        style={{ background: 'transparent', borderTop: '1px solid rgba(212,175,55,0.1)' }}
      >
        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl px-8 py-6"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(212,175,55,0.12)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
                <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="7,1 8.5,4.5 12,5 9.5,7.5 10,11 7,9.5 4,11 4.5,7.5 2,5 5.5,4.5" fill="#D4AF37"/></svg>
              </div>
              <p style={{ fontFamily: 'var(--font-source)', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                Khám phá toàn bộ bộ sưu tập và tìm hiểu thêm về hành trình
              </p>
            </div>

            <a
              href="#museum-collection"
              className="group flex-shrink-0 flex items-center gap-3 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg,#C1121F,#8B0000)',
                color: '#fff',
                fontFamily: 'var(--font-source)',
                letterSpacing: '0.05em',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                boxShadow: '0 0 30px rgba(193,18,31,0.3)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(193,18,31,0.5)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(193,18,31,0.3)'}
            >
              Xem tất cả
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-1 transition-transform">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── ARTIFACT MODAL ─────────────────────────────────── */}
      <ArtifactModal image={selected} onClose={() => setSelected(null)} />
    </>
  );
}
