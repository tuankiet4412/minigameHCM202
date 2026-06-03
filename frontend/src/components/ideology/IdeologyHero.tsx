'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import { IDEOLOGY_HERO_PORTRAIT } from '@/lib/ideology-images';

export default function IdeologyHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[85vh] md:min-h-[90vh] overflow-hidden flex items-center pt-24 pb-16"
      style={{
        background: 'linear-gradient(180deg, rgba(5,5,5,0.8) 0%, rgba(10,10,10,0.95) 100%)',
      }}
    >
      {/* ── Background Elements ── */}
      {/* Ancient paper / noise texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
        aria-hidden="true"
      />

      {/* World Map Lines Texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] mix-blend-color-dodge"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1400 700'%3E%3Cpath stroke='%23D4AF37' stroke-width='0.4' fill='none' d='M0,350 Q350,280 700,350 T1400,350M0,175 Q350,105 700,175 T1400,175M0,525 Q350,455 700,525 T1400,525M200,0 Q220,350 200,700M500,0 Q520,350 500,700M800,0 Q820,350 800,700M1100,0 Q1120,350 1100,700'/%3E%3Ccircle cx='700' cy='350' r='250' stroke='%23D4AF37' stroke-width='0.3' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />

      {/* Floating gold dust particles */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#D4AF37]/35"
            style={{
              left: `${(i * 27 + 13) % 100}%`,
              top: `${(i * 19 + 7) % 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Historical handwriting Overlay */}
      <div
        className="pointer-events-none absolute left-8 top-32 z-0 opacity-[0.05] hidden lg:block"
        style={{
          width: '320px',
          height: '400px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 400'%3E%3Ctext x='10' y='30' font-family='serif' font-size='13' fill='%23D4AF37' font-style='italic'%3EĐường Kách Mệnh (1927)%3C/text%3E%3Ctext x='10' y='60' font-family='serif' font-size='11' fill='%23D4AF37'%3EKhông có gì quý hơn độc lập tự do%3C/text%3E%3Ctext x='10' y='85' font-family='serif' font-size='10' fill='%23D4AF37'%3EĐoàn kết, đoàn kết, đại đoàn kết%3C/text%3E%3Cline x1='10' y1='100' x2='250' y2='100' stroke='%23D4AF37' stroke-width='0.5'/%3E%3Ctext x='10' y='125' font-family='serif' font-size='10' fill='%23D4AF37'%3EXây dựng Đảng ta trong sạch vững mạnh%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
        }}
        aria-hidden="true"
      />

      {/* Ambient background gold glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* ── Left Content ── */}
          <motion.div
            style={{ y: textY, opacity }}
            className="flex-1 text-left max-w-2xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Small Label */}
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#D4AF37]" />
              <span
                style={{
                  fontFamily: 'var(--font-source), sans-serif',
                  fontSize: '0.75rem',
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: '#D4AF37',
                  fontWeight: 600,
                }}
              >
                Tư tưởng & Giáo dục
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, #FFF9E6 0%, #D4AF37 50%, #A37F1A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Khám phá tư tưởng Hồ Chí Minh
            </h1>

            {/* Gold Divider */}
            <div className="relative w-48 h-[2px] bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent mb-6">
              <div className="absolute top-1/2 left-6 -translate-y-1/2 w-2.5 h-2.5 bg-[#D4AF37] rotate-45 border border-[#050505]" />
            </div>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: 'var(--font-source), sans-serif',
                fontSize: 'clamp(1rem, 1.25vw, 1.25rem)',
                color: '#E0E0E0',
                lineHeight: 1.6,
                fontWeight: 300,
                marginBottom: '2rem',
              }}
            >
              Tìm hiểu các nguyên lý, triết lý cách mạng và nền tảng lịch sử của tư tưởng Hồ Chí Minh — không gian nghiên cứu, suy ngẫm và học tập.
            </p>

            {/* Academic Badges */}
            <div className="flex flex-wrap gap-6 pt-4 border-t border-[#D4AF37]/10">
              <div className="flex flex-col">
                <span className="text-[0.65rem] uppercase tracking-wider text-gray-500">Phạm vi học viện</span>
                <span className="text-sm font-semibold text-[#D4AF37] mt-0.5">8 chủ đề cốt lõi</span>
              </div>
              <div className="h-10 w-px bg-white/10 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-[0.65rem] uppercase tracking-wider text-gray-500">Thời kỳ lịch sử</span>
                <span className="text-sm font-semibold text-[#D4AF37] mt-0.5">1890 – 1969</span>
              </div>
              <div className="h-10 w-px bg-white/10 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-[0.65rem] uppercase tracking-wider text-gray-500">Mức tài liệu</span>
                <span className="text-sm font-semibold text-[#D4AF37] mt-0.5">Lưu trữ gốc</span>
              </div>
            </div>
          </motion.div>

          {/* ── Right Portrait Container ── */}
          <motion.div
            style={{ y: imageY, opacity }}
            className="flex-shrink-0 w-full max-w-[420px] lg:w-[420px] relative z-10"
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
          >
            {/* Elegant Double Border Gold Frame with Corner Decoration */}
            <div className="relative p-3 rounded-2xl border border-[#D4AF37]/35 bg-[#0A0A0A]/90 shadow-[0_0_50px_rgba(0,0,0,0.8)] group overflow-hidden">
              
              {/* Gold light streak overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-[#D4AF37]/5 to-transparent pointer-events-none z-10" />

              {/* Inner double border */}
              <div className="relative rounded-xl overflow-hidden border border-[#D4AF37]/20 aspect-[3/4]">
                <AppImage
                  src={IDEOLOGY_HERO_PORTRAIT}
                  alt="Tàu Amiral Latouche-Tréville — khởi đầu hành trình 1911"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.8] contrast-[1.05] sepia-[0.18]"
                  sizes="(max-w-md) 100vw, 420px"
                />

                {/* Atmospheric overlay inside portrait */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/30 opacity-70 pointer-events-none" />
                
                {/* Gold vignette rim glow inside portrait */}
                <div className="absolute inset-0 ring-1 ring-inset ring-[#D4AF37]/20 pointer-events-none" />
              </div>

              {/* Gold frame corner lines */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/50" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/50" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/50" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/50" />
            </div>

            {/* Back Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#C1121F]/5 rounded-3xl blur-2xl opacity-50 -z-10 group-hover:opacity-75 transition-opacity duration-500" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
