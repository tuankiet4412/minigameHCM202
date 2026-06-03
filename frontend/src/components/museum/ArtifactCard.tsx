'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { GalleryImage } from '@/lib/types';

interface ArtifactCardProps {
  image: GalleryImage;
  index: number;
  onSelect: (img: GalleryImage) => void;
  viewGrid?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  artifact: '#C89B3C',
  photograph: '#D4AF37',
  document: '#C1121F',
  video: '#7B2FBE',
  '3d': '#00B4D8',
};

const CATEGORY_ICONS: Record<string, string> = {
  artifact: '🏛',
  photograph: '📷',
  document: '📄',
  video: '🎬',
  '3d': '⬡',
};

export function ArtifactCard({ image, index, onSelect, viewGrid = true }: ArtifactCardProps) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const cat = (image.category || 'photograph').toLowerCase();
  const catColor = CATEGORY_COLORS[cat] || '#D4AF37';
  const catIcon  = CATEGORY_ICONS[cat]  || '📷';
  const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({
      x: ((e.clientY - cy) / rect.height) * 8,
      y: -((e.clientX - cx) / rect.width) * 8,
    });
  };

  if (!viewGrid) {
    // List view
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.04, duration: 0.5 }}
        onClick={() => onSelect(image)}
        className="flex gap-5 rounded-2xl p-4 cursor-pointer group transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = `${catColor}44`;
          (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.03)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
        }}
      >
        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl">
          <Image src={image.image_url} alt={image.title} fill className="object-cover" style={{ filter: 'sepia(0.2) contrast(1.05)' }} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span className="inline-block rounded-full px-2 py-0.5 text-xs mb-1.5 w-fit" style={{ background: `${catColor}22`, color: catColor, fontFamily: 'var(--font-source)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: `1px solid ${catColor}33` }}>
            {catIcon} {catLabel}
          </span>
          <div style={{ fontFamily: 'var(--font-playfair)', color: '#F4E4BC', fontSize: '1rem', fontWeight: 600, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{image.title}</div>
          <p style={{ fontFamily: 'var(--font-source)', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', lineHeight: 1.5 }} className="line-clamp-2">{image.description}</p>
          <div className="flex gap-4 mt-2">
            {image.year && <span style={{ color: '#D4AF37', fontSize: '0.7rem', fontFamily: 'var(--font-source)' }}>📅 {image.year}</span>}
          </div>
        </div>
        <div className="flex items-center pr-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: catColor, opacity: 0.6 }} className="group-hover:opacity-100 group-hover:translate-x-1 transition-all">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
      onClick={() => onSelect(image)}
      className="group cursor-pointer"
      style={{
        transform: hovered ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px)` : 'perspective(800px) rotateX(0) rotateY(0) translateY(0)',
        transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="relative overflow-hidden rounded-2xl h-full"
        style={{
          background: '#0c0900',
          border: `1px solid ${hovered ? catColor + '55' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${catColor}22, inset 0 1px 0 rgba(255,255,255,0.06)`
            : '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Image container */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <Image
            src={image.image_url}
            alt={image.title}
            fill
            className="object-cover transition-transform duration-700"
            style={{
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              filter: 'sepia(0.25) contrast(1.08) brightness(0.88)',
            }}
          />
          {/* Image overlay gradient */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(12,9,0,0.6) 100%)' }}
          />
          {/* Hover glow overlay */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at 50% 30%, ${catColor}15 0%, transparent 70%)` }}
          />
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                background: `${catColor}22`,
                color: catColor,
                border: `1px solid ${catColor}44`,
                fontFamily: 'var(--font-source)',
                fontSize: '0.62rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backdropFilter: 'blur(8px)',
              }}
            >
              {catIcon} {catLabel}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-5">
          {/* Title */}
          <h3
            style={{
              fontFamily: 'var(--font-playfair)',
              color: hovered ? '#FFD700' : '#F4E4BC',
              fontSize: '1.05rem',
              fontWeight: 600,
              lineHeight: 1.3,
              marginBottom: '8px',
              transition: 'color 0.3s',
            }}
          >
            {image.title}
          </h3>

          {/* Description */}
          <p
            className="line-clamp-2"
            style={{
              fontFamily: 'var(--font-source)',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              marginBottom: '12px',
            }}
          >
            {image.description || 'A historical artifact from Ho Chi Minh\'s journey to find national salvation.'}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 mb-4">
            {image.year && (
              <span style={{ fontFamily: 'var(--font-source)', fontSize: '0.7rem', color: '#D4AF37', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="1" y="2" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="0.8"/><path d="M3 1v2M7 1v2M1 4.5h8" stroke="currentColor" strokeWidth="0.8"/></svg>
                {image.year}
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-source)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1C3.3 1 2 2.3 2 4c0 2.5 3 5 3 5s3-2.5 3-5c0-1.7-1.3-3-3-3z" stroke="currentColor" strokeWidth="0.8"/><circle cx="5" cy="4" r="1" stroke="currentColor" strokeWidth="0.8"/></svg>
              Vietnam
            </span>
          </div>

          {/* Explore button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all duration-300"
            style={{
              fontFamily: 'var(--font-source)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: hovered
                ? `linear-gradient(135deg, ${catColor}33, ${catColor}18)`
                : 'rgba(255,255,255,0.03)',
              color: hovered ? catColor : 'rgba(255,255,255,0.35)',
              border: `1px solid ${hovered ? catColor + '44' : 'rgba(255,255,255,0.06)'}`,
              transition: 'all 0.3s',
            }}
          >
            Explore Details
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={hovered ? 'translate-x-0.5' : ''} style={{ transition: 'transform 0.3s' }}>
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>

        {/* Shine effect on hover */}
        <motion.div
          animate={{ x: hovered ? '200%' : '-100%', opacity: hovered ? 0.3 : 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none skew-x-12"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)', width: '50%' }}
        />
      </div>
    </motion.div>
  );
}
