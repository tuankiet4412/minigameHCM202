'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export function MuseumHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={heroRef}
      id="museum-hero"
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{ background: 'linear-gradient(180deg,transparent 0%,rgba(13,10,0,0.4) 60%,transparent 100%)' }}
    >
      {/* ── Layered atmospheric backgrounds ── */}
      {/* Ancient paper / map texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
        aria-hidden="true"
      />

      {/* World map lines overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1400 700'%3E%3Cpath stroke='%23D4AF37' stroke-width='0.4' fill='none' d='M0,350 Q350,280 700,350 T1400,350M0,175 Q350,105 700,175 T1400,175M0,525 Q350,455 700,525 T1400,525M200,0 Q220,350 200,700M500,0 Q520,350 500,700M800,0 Q820,350 800,700M1100,0 Q1120,350 1100,700'/%3E%3Ccircle cx='700' cy='350' r='250' stroke='%23D4AF37' stroke-width='0.3' fill='none'/%3E%3Ccircle cx='700' cy='350' r='180' stroke='%23D4AF37' stroke-width='0.2' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />

      {/* Handwriting manuscript overlay */}
      <div
        className="pointer-events-none absolute left-8 top-32 z-0 opacity-[0.04] hidden lg:block"
        style={{
          width: '320px',
          height: '400px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 400'%3E%3Ctext x='10' y='30' font-family='serif' font-size='13' fill='%23D4AF37' opacity='0.9'%3ETôi tên là Nguyễn Tất Thành%3C/text%3E%3Ctext x='10' y='55' font-family='serif' font-size='11' fill='%23D4AF37' opacity='0.7'%3E1911 - Cảng Nhà Rồng%3C/text%3E%3Ctext x='10' y='78' font-family='serif' font-size='10' fill='%23D4AF37' opacity='0.6'%3EHành trình tìm đường cứu nước%3C/text%3E%3Cline x1='10' y1='90' x2='280' y2='90' stroke='%23D4AF37' stroke-width='0.3'/%3E%3Ctext x='10' y='115' font-family='serif' font-size='10' fill='%23D4AF37' opacity='0.5'%3EParis - Londres - Moscou%3C/text%3E%3Ctext x='10' y='138' font-family='serif' font-size='9' fill='%23D4AF37' opacity='0.4'%3E1919 - Versailles%3C/text%3E%3Cline x1='10' y1='150' x2='220' y2='150' stroke='%23D4AF37' stroke-width='0.2'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat-y',
        }}
        aria-hidden="true"
      />

      {/* Radial gold glow center */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Right portrait glow */}
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 z-0 w-[55%]"
        style={{ background: 'radial-gradient(ellipse 80% 100% at 80% 50%, rgba(212,175,55,0.06) 0%, transparent 65%)' }}
        aria-hidden="true"
      />

      {/* Decorative compass top right */}
      <div
        className="pointer-events-none absolute top-20 right-[42%] z-0 opacity-[0.06] hidden xl:block"
        aria-hidden="true"
      >
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="68" stroke="#D4AF37" strokeWidth="0.6" fill="none" />
          <circle cx="70" cy="70" r="55" stroke="#D4AF37" strokeWidth="0.3" fill="none" />
          <line x1="70" y1="2" x2="70" y2="30" stroke="#D4AF37" strokeWidth="1.2" />
          <line x1="70" y1="110" x2="70" y2="138" stroke="#D4AF37" strokeWidth="0.8" />
          <line x1="2" y1="70" x2="30" y2="70" stroke="#D4AF37" strokeWidth="0.8" />
          <line x1="110" y1="70" x2="138" y2="70" stroke="#D4AF37" strokeWidth="0.8" />
          <polygon points="70,8 74,24 70,20 66,24" fill="#D4AF37" />
          <text x="66" y="48" fill="#D4AF37" fontSize="8" fontFamily="serif">N</text>
          <text x="65" y="98" fill="#D4AF37" fontSize="6" fontFamily="serif">S</text>
          <text x="18" y="73" fill="#D4AF37" fontSize="6" fontFamily="serif">W</text>
          <text x="116" y="73" fill="#D4AF37" fontSize="6" fontFamily="serif">E</text>
        </svg>
      </div>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(5,5,5,0.7) 100%)' }}
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div style={{ y: yParallax, opacity }} className="relative z-10 w-full">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16 flex flex-col lg:flex-row items-center min-h-screen py-24">

          {/* ── Left text block ── */}
          <div className="flex-1 text-left max-w-2xl">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-12" style={{ background: 'linear-gradient(90deg,transparent,#D4AF37)' }} />
              <span
                className="text-xs font-bold tracking-[0.35em] uppercase"
                style={{ color: '#D4AF37', fontFamily: 'var(--font-source)' }}
              >
                Digital Museum
              </span>
              <div className="h-px w-12" style={{ background: 'linear-gradient(90deg,#D4AF37,transparent)' }} />
            </motion.div>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                fontWeight: 700,
                lineHeight: 1.05,
                background: 'linear-gradient(135deg, #F4E4BC 0%, #D4AF37 40%, #C89B3C 70%, #FFD700 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.01em',
              }}
            >
              Historical<br />Gallery
            </motion.h1>

            {/* Gold ornament divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-3 my-6"
            >
              <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(90deg,transparent,#D4AF37)' }} />
              <svg width="18" height="18" viewBox="0 0 18 18">
                <polygon points="9,1 11,7 17,7 12,11 14,17 9,13 4,17 6,11 1,7 7,7" fill="#D4AF37" />
              </svg>
              <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(90deg,#D4AF37,transparent)' }} />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                fontFamily: 'var(--font-source)',
                color: 'rgba(255,255,255,0.55)',
                fontSize: '1rem',
                lineHeight: 1.7,
                maxWidth: '440px',
              }}
            >
              An immersive collection of artifacts and moments from the journey
              of Nguyen Tat Thanh — his path to national salvation from 1911 to 1930.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="#museum-collection"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-3.5 text-sm font-semibold"
                style={{
                  background: 'linear-gradient(135deg,#D4AF37,#C89B3C)',
                  color: '#050505',
                  boxShadow: '0 0 40px rgba(212,175,55,0.3)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-source)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  Explore Collection
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              </a>

              <a
                href="#museum-stats"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm backdrop-blur-sm transition-all duration-300"
                style={{
                  borderColor: 'rgba(212,175,55,0.3)',
                  color: '#D4AF37',
                  fontFamily: 'var(--font-source)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.7)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.3)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                View Statistics
              </a>
            </motion.div>

            {/* Mini stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-14 flex gap-8"
            >
              {[
                { num: '250+', label: 'Artifacts' },
                { num: '120+', label: 'Photographs' },
                { num: '80+',  label: 'Documents'  },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-playfair)', color: '#D4AF37', fontSize: '1.5rem', fontWeight: 700 }}>{s.num}</div>
                  <div style={{ fontFamily: 'var(--font-source)', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right portrait ── */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex-shrink-0 mt-16 lg:mt-0 lg:ml-16"
            style={{ width: 'clamp(280px, 35vw, 460px)', height: 'clamp(360px, 50vw, 600px)' }}
          >
            {/* Outer gold glow ring */}
            <div
              className="absolute inset-0 rounded-[2rem]"
              style={{
                boxShadow: '0 0 80px rgba(212,175,55,0.25), 0 0 200px rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '2rem',
              }}
            />
            {/* Corner ornaments */}
            {[
              'top-0 left-0 border-t border-l rounded-tl-xl',
              'top-0 right-0 border-t border-r rounded-tr-xl',
              'bottom-0 left-0 border-b border-l rounded-bl-xl',
              'bottom-0 right-0 border-b border-r rounded-br-xl',
            ].map((cls, i) => (
              <div
                key={i}
                className={`absolute w-8 h-8 ${cls}`}
                style={{ borderColor: 'rgba(212,175,55,0.6)', margin: '-1px' }}
              />
            ))}

            {/* Portrait image with cinematic overlay */}
            <div className="relative w-full h-full overflow-hidden rounded-[2rem]" style={{ background: '#0a0800' }}>
              <Image
                src="https://i1-vnexpress.vnecdn.net/2025/08/15/DSC-3785-1755240257.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=MpUt7QJyRwIN2fTVm-EnTA"
                alt="Ho Chi Minh portrait"
                fill
                className="object-cover object-top"
                style={{ filter: 'sepia(0.4) contrast(1.1) brightness(0.85)', mixBlendMode: 'luminosity' }}
                priority
              />
              {/* Cinematic gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(5,5,5,0.1) 0%, rgba(5,5,5,0) 30%, rgba(5,5,5,0.3) 70%, rgba(5,5,5,0.85) 100%), linear-gradient(90deg, rgba(212,175,55,0.08) 0%, transparent 60%)',
                }}
              />
              {/* Gold tint overlay */}
              <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(212,175,55,0.12) 0%, transparent 70%)' }}
              />
              {/* Bottom caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div style={{ fontFamily: 'var(--font-source)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '4px' }}>
                  Hồ Chí Minh
                </div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '1rem', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
                  The Path to National Salvation
                </div>
                <div style={{ fontFamily: 'var(--font-source)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                  1890 – 1969
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-6 top-1/3 rounded-2xl px-4 py-3 backdrop-blur-xl"
              style={{
                background: 'rgba(10,8,0,0.85)',
                border: '1px solid rgba(212,175,55,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-source)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4AF37' }}>Journey Began</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.3rem', color: '#FFD700', fontWeight: 700 }}>1911</div>
              <div style={{ fontFamily: 'var(--font-source)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>Nha Rong Port</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span style={{ fontFamily: 'var(--font-source)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-10"
          style={{ background: 'linear-gradient(180deg,rgba(212,175,55,0.6),transparent)' }}
        />
      </motion.div>
    </section>
  );
}
