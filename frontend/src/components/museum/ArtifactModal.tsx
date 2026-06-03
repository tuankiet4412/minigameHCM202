'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { GalleryImage } from '@/lib/types';

interface ArtifactModalProps {
  image: GalleryImage | null;
  onClose: () => void;
}

const TIMELINE_EVENTS = [
  { year: '1890', label: 'Born in Kim Lien, Nghe An' },
  { year: '1911', label: 'Departed from Saigon' },
  { year: '1919', label: 'Versailles Conference' },
  { year: '1920', label: 'Joined Communist International' },
  { year: '1925', label: 'Founded Vietnamese Youth' },
  { year: '1930', label: 'Founded Communist Party' },
];

export function ArtifactModal({ image, onClose }: ArtifactModalProps) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (image) {
      document.addEventListener('keydown', esc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [image, onClose]);

  const catColor = image?.category === 'document' ? '#C1121F'
    : image?.category === 'artifact' ? '#C89B3C'
    : '#D4AF37';

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(16px)', background: 'rgba(5,5,5,0.88)' }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={image.title}
        >
          <motion.div
            initial={{ scale: 0.88, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.88, y: 40, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #0d0a00, #0a0800)',
              border: '1px solid rgba(212,175,55,0.2)',
              boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(212,175,55,0.06)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.15)';
                (e.currentTarget as HTMLElement).style.color = '#D4AF37';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
              }}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            <div className="flex flex-col lg:flex-row">
              {/* ── Left: large image ── */}
              <div className="relative lg:w-[55%] flex-shrink-0" style={{ minHeight: '400px' }}>
                <Image
                  src={image.image_url}
                  alt={image.title}
                  fill
                  className="object-cover"
                  style={{
                    filter: 'sepia(0.25) contrast(1.08) brightness(0.88)',
                    borderRadius: '1.5rem 0 0 1.5rem',
                  }}
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent 60%, rgba(13,10,0,0.9) 100%), linear-gradient(180deg, rgba(5,5,5,0.2) 0%, transparent 30%, rgba(5,5,5,0.6) 100%)',
                    borderRadius: '1.5rem 0 0 1.5rem',
                  }}
                />
                {/* Category + Year badge */}
                <div className="absolute top-6 left-6">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{
                      background: `${catColor}22`,
                      color: catColor,
                      border: `1px solid ${catColor}44`,
                      fontFamily: 'var(--font-source)',
                      fontSize: '0.65rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {image.category || 'Photograph'}
                  </span>
                </div>
                {/* Year overlay bottom left */}
                {image.year && (
                  <div className="absolute bottom-6 left-6">
                    <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '3.5rem', fontWeight: 700, color: 'rgba(212,175,55,0.15)', lineHeight: 1 }}>
                      {image.year}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Right: detail panel ── */}
              <div className="flex-1 p-8 lg:p-10">
                {/* Header */}
                <div className="mb-6">
                  {image.year && (
                    <div style={{ fontFamily: 'var(--font-source)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '8px' }}>
                      {image.year}
                    </div>
                  )}
                  <h2
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                      fontWeight: 700,
                      lineHeight: 1.15,
                      background: 'linear-gradient(135deg, #F4E4BC, #D4AF37)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '4px',
                    }}
                  >
                    {image.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,rgba(212,175,55,0.5),transparent)', maxWidth: '60px' }} />
                    <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" fill="#D4AF37" opacity="0.5"/></svg>
                  </div>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-source)',
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: '0.9rem',
                    lineHeight: 1.75,
                    marginBottom: '24px',
                  }}
                >
                  {image.description || 'This artifact represents a significant moment in Ho Chi Minh\'s extraordinary journey across the world in search of independence for Vietnam. Each piece in this collection tells part of the larger story of national liberation.'}
                </p>

                {/* Location info */}
                <div className="flex flex-wrap gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {image.year && (
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#D4AF37', fontSize: '0.75rem' }}>📅</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-source)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Year</div>
                        <div style={{ fontFamily: 'var(--font-playfair)', color: '#F4E4BC', fontSize: '0.9rem', fontWeight: 600 }}>{image.year}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#D4AF37', fontSize: '0.75rem' }}>📍</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-source)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Location</div>
                      <div style={{ fontFamily: 'var(--font-playfair)', color: '#F4E4BC', fontSize: '0.9rem', fontWeight: 600 }}>Vietnam</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#D4AF37', fontSize: '0.75rem' }}>🏛</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-source)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Collection</div>
                      <div style={{ fontFamily: 'var(--font-playfair)', color: '#F4E4BC', fontSize: '0.9rem', fontWeight: 600 }}>National Archive</div>
                    </div>
                  </div>
                </div>

                {/* Timeline placement */}
                <div className="mb-6">
                  <div style={{ fontFamily: 'var(--font-source)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>
                    Timeline Placement
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg,rgba(212,175,55,0.5),transparent)' }} />
                    {TIMELINE_EVENTS.map((ev) => {
                      const isMatch = ev.year === String(image.year);
                      return (
                        <div key={ev.year} className="flex items-center gap-4 mb-3 relative">
                          <div
                            className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                            style={{
                              background: isMatch ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${isMatch ? 'rgba(212,175,55,0.6)' : 'rgba(255,255,255,0.08)'}`,
                              boxShadow: isMatch ? '0 0 12px rgba(212,175,55,0.3)' : 'none',
                            }}
                          >
                            {isMatch && <div className="w-2 h-2 rounded-full" style={{ background: '#D4AF37' }} />}
                          </div>
                          <div>
                            <span style={{ fontFamily: 'var(--font-source)', fontSize: '0.65rem', color: isMatch ? '#D4AF37' : 'rgba(255,255,255,0.25)', fontWeight: isMatch ? 700 : 400 }}>
                              {ev.year}
                            </span>
                            <span style={{ fontFamily: 'var(--font-source)', fontSize: '0.72rem', color: isMatch ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)', marginLeft: '8px' }}>
                              {ev.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
