'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import type { GalleryImage } from '@/lib/types';

const FEATURED_SLIDES = [
  {
    id: 'f1',
    title: 'Bến cảng Nhà Rồng',
    subtitle: '1911 — Sài Gòn',
    desc: 'Nơi người thanh niên Nguyễn Tất Thành ra đi tìm đường cứu nước ngày 5/6/1911, mở đầu hành trình hơn 30 năm bôn ba vì độc lập dân tộc.',
    image_url: '/images/ideology/role-of-patriotism.jpg',
    tag: 'Ảnh tư liệu',
    tagColor: '#D4AF37',
    year: '1911',
    location: 'Sài Gòn, Việt Nam',
  },
  {
    id: 'f2',
    title: 'Tàu Đô đốc Latouche-Tréville',
    subtitle: '1911 — Khởi đầu hành trình',
    desc: 'Con tàu đã đưa Nguyễn Tất Thành rời Tổ quốc, bắt đầu cuộc hành trình tìm con đường giải phóng dân tộc Việt Nam.',
    image_url: '/images/ideology/hero-portrait.jpg',
    tag: 'Ảnh tư liệu',
    tagColor: '#D4AF37',
    year: '1911',
    location: 'Cảng Sài Gòn',
  },
  {
    id: 'f3',
    title: 'Máy chữ của Chủ tịch Hồ Chí Minh',
    subtitle: 'Hiện vật lịch sử',
    desc: 'Chiếc máy chữ được Chủ tịch Hồ Chí Minh sử dụng trong thời gian sống và làm việc tại Phủ Chủ tịch.',
    image_url:
      'https://hnm.1cdn.vn/2020/05/07/hanoimoi.com.vn-uploads-album-20200507-_55383101-800c-426f-92c9-56c464097661.jpg',
    tag: 'Hiện vật',
    tagColor: '#C89B3C',
    year: '1960',
    location: 'Phủ Chủ tịch, Hà Nội',
  },
  {
    id: 'f4',
    title: 'Bộ quần áo kaki',
    subtitle: 'Hiện vật gắn liền với Bác Hồ',
    desc: 'Bộ quần áo kaki giản dị mà Chủ tịch Hồ Chí Minh thường mặc khi đi công tác, dự hội nghị và làm việc với Chính phủ.',
    image_url:
      'https://hnm.1cdn.vn/2020/05/07/hanoimoi.com.vn-uploads-album-20200507-_24c72dfb-9277-4be2-82c4-a5be56a401fd.jpg',
    tag: 'Hiện vật',
    tagColor: '#C89B3C',
    year: '1960',
    location: 'Hà Nội, Việt Nam',
  },
  {
    id: 'f5',
    title: 'Đôi dép cao su',
    subtitle: 'Biểu tượng của sự giản dị',
    desc: 'Đôi dép cao su đã cùng Chủ tịch Hồ Chí Minh trong nhiều chuyến công tác trong nước và quốc tế, trở thành biểu tượng về lối sống giản dị của Người.',
    image_url:
      'https://hnm.1cdn.vn/2020/05/07/hanoimoi.com.vn-uploads-album-20200507-_b8808a76-dea9-4c3d-bc5d-04eb98d71450.jpg',
    tag: 'Hiện vật',
    tagColor: '#C89B3C',
    year: '1960',
    location: 'Việt Nam',
  },
];

interface FeaturedExhibitionProps {
  onSelect?: (img: GalleryImage) => void;
}

export function FeaturedExhibition({ onSelect }: FeaturedExhibitionProps) {
  const [center, setCenter] = useState(1);

  const getPos = (idx: number) => {
    const total = FEATURED_SLIDES.length;
    const diff = ((idx - center + total) % total + total) % total;
    if (diff === 0) return 'center';
    if (diff === 1 || diff === total - 1) return diff === 1 ? 'right1' : 'left1';
    return diff <= total / 2 ? 'right2' : 'left2';
  };

  const posStyle: Record<string, Record<string, string | number>> = {
    center: { transform: 'translateX(0) scale(1) rotateY(0deg)', zIndex: 10, filter: 'none', opacity: 1 },
    left1: { transform: 'translateX(-58%) scale(0.82) rotateY(22deg)', zIndex: 6, filter: 'blur(1.5px) brightness(0.55)', opacity: 0.85 },
    left2: { transform: 'translateX(-90%) scale(0.68) rotateY(30deg)', zIndex: 2, filter: 'blur(3px) brightness(0.35)', opacity: 0.5 },
    right1: { transform: 'translateX(58%) scale(0.82) rotateY(-22deg)', zIndex: 6, filter: 'blur(1.5px) brightness(0.55)', opacity: 0.85 },
    right2: { transform: 'translateX(90%) scale(0.68) rotateY(-30deg)', zIndex: 2, filter: 'blur(3px) brightness(0.35)', opacity: 0.5 },
  };

  const current = FEATURED_SLIDES[center];

  return (
    <section
      id="museum-featured"
      className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,transparent 0%,rgba(10,8,0,0.4) 50%,transparent 100%)' }}
    >
      {/* Section separator line */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.4),transparent)' }} />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-16 items-center">

          {/* ── Left info panel ── */}
          <div className="lg:w-[340px] flex-shrink-0">
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ fontFamily: 'var(--font-source)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '12px' }}
            >
              ✦ &nbsp;Trải nghiệm số
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: '16px',
              }}
            >
              Bước vào<br />lịch sử
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{ fontFamily: 'var(--font-source)', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '28px' }}
            >
              Khám phá hiện vật, ảnh, tài liệu và triển lãm quý hiếm tái hiện hành trình.
            </motion.p>

            {/* Featured item details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={center}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl p-5 mb-6"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(212,175,55,0.15)',
                }}
              >
                <span
                  className="inline-block rounded-full px-2.5 py-1 text-xs font-semibold mb-3"
                  style={{
                    background: `${current.tagColor}22`,
                    color: current.tagColor,
                    border: `1px solid ${current.tagColor}44`,
                    fontFamily: 'var(--font-source)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {current.tag}
                </span>
                <div style={{ fontFamily: 'var(--font-playfair)', color: '#F4E4BC', fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>
                  {current.title}
                </div>
                <div style={{ fontFamily: 'var(--font-source)', color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginBottom: '10px' }}>
                  {current.subtitle}
                </div>
                <p style={{ fontFamily: 'var(--font-source)', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', lineHeight: 1.65 }}>
                  {current.desc}
                </p>
                <div className="flex gap-4 mt-4">
                  <div style={{ fontFamily: 'var(--font-source)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>
                    <span style={{ color: '#D4AF37' }}>📅</span> {current.year}
                  </div>
                  <div style={{ fontFamily: 'var(--font-source)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>
                    <span style={{ color: '#D4AF37' }}>📍</span> {current.location}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onClick={() => {
                if (onSelect) {
                  const s = FEATURED_SLIDES[center];
                  onSelect({ id: parseInt(s.id.replace('f', '')), title: s.title, description: s.desc, image_url: s.image_url, year: parseInt(s.year), category: s.tag });
                }
              }}
              className="group flex items-center gap-3 rounded-full border px-7 py-3 text-sm transition-all duration-300"
              style={{
                borderColor: 'rgba(212,175,55,0.35)',
                color: '#D4AF37',
                fontFamily: 'var(--font-source)',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'transparent',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.1)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.6)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.35)';
              }}
            >
              Khám phá bộ sưu tập
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-1 transition-transform">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>

            {/* Navigation dots */}
            <div className="flex gap-2 mt-8">
              {FEATURED_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCenter(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === center ? '24px' : '6px',
                    height: '6px',
                    background: i === center ? '#D4AF37' : 'rgba(212,175,55,0.25)',
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── Right floating gallery ── */}
          <div className="flex-1 relative flex items-center justify-center" style={{ perspective: '1200px', height: '480px' }}>
            {FEATURED_SLIDES.map((slide, i) => {
              const pos = getPos(i);
              const style = posStyle[pos] || posStyle.right2;
              return (
                <motion.div
                  key={slide.id}
                  animate={style}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute cursor-pointer"
                  style={{ width: '260px', height: '340px', transformStyle: 'preserve-3d' }}
                  onClick={() => pos === 'center' ? null : setCenter(i)}
                  whileHover={pos === 'center' ? { y: -8 } : {}}
                >
                  {/* Card */}
                  <div
                    className="relative w-full h-full overflow-hidden rounded-2xl"
                    style={{
                      border: pos === 'center' ? '1px solid rgba(212,175,55,0.5)' : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: pos === 'center'
                        ? '0 0 60px rgba(212,175,55,0.2), 0 24px 48px rgba(0,0,0,0.6)'
                        : '0 12px 32px rgba(0,0,0,0.5)',
                      background: '#0a0800',
                    }}
                  >
                    <AppImage
                      src={slide.image_url}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      style={{ filter: 'sepia(0.3) contrast(1.05) brightness(0.85)' }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,transparent 40%,rgba(5,5,5,0.9) 100%)' }} />

                    {/* Center card highlight */}
                    {pos === 'center' && (
                      <div
                        className="absolute inset-0"
                        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(212,175,55,0.08) 0%, transparent 70%)' }}
                      />
                    )}

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span
                        className="inline-block rounded-full px-2 py-0.5 text-xs mb-2"
                        style={{ background: `${slide.tagColor}33`, color: slide.tagColor, fontFamily: 'var(--font-source)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                      >
                        {slide.tag}
                      </span>
                      <div style={{ fontFamily: 'var(--font-playfair)', color: '#F4E4BC', fontSize: '0.95rem', fontWeight: 600 }}>
                        {slide.title}
                      </div>
                      <div style={{ fontFamily: 'var(--font-source)', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '2px' }}>
                        {slide.year} · {slide.location}
                      </div>
                    </div>
                  </div>

                  {/* Floating animation for center */}
                  {pos === 'center' && (
                    <motion.div
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -inset-2 rounded-3xl pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)' }}
                    />
                  )}
                </motion.div>
              );
            })}

            {/* Navigation arrows */}
            <button
              className="absolute left-0 lg:-left-6 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ background: 'rgba(10,8,0,0.8)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}
              onClick={() => setCenter(c => (c - 1 + FEATURED_SLIDES.length) % FEATURED_SLIDES.length)}
              aria-label="Trước"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="absolute right-0 lg:-right-6 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ background: 'rgba(10,8,0,0.8)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}
              onClick={() => setCenter(c => (c + 1) % FEATURED_SLIDES.length)}
              aria-label="Sau"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.2),transparent)' }} />
    </section>
  );
}
