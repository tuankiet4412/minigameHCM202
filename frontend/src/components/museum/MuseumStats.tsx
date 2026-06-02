'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/animation/AnimatedCounter';

const STATS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="8" width="22" height="17" rx="2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M9 8V6a5 5 0 0110 0v2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M14 15v3M12 17h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    value: 250,
    suffix: '+',
    label: 'Artifacts',
    description: 'Physical & digital',
    color: '#D4AF37',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="5" width="22" height="18" rx="2" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="14" cy="14" r="2" fill="currentColor" opacity="0.4"/>
        <path d="M22 7l1-2M6 7L5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    value: 120,
    suffix: '+',
    label: 'Photographs',
    description: 'Historical images',
    color: '#F4E4BC',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="3" width="18" height="22" rx="2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M9 9h10M9 13h10M9 17h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    value: 80,
    suffix: '+',
    label: 'Documents',
    description: 'Original manuscripts',
    color: '#C89B3C',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="6" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.2"/>
        <polygon points="10,10 10,18 18,14" fill="currentColor" opacity="0.5"/>
        <path d="M24 10v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M22 12v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    value: 30,
    suffix: '+',
    label: 'Videos',
    description: 'Archival footage',
    color: '#7B2FBE',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L25 9v10L14 25 3 19V9L14 3z" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M14 3v22M3 9l11 6 11-6" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
      </svg>
    ),
    value: 15,
    suffix: '+',
    label: '3D Exhibits',
    description: 'Interactive models',
    color: '#00B4D8',
  },
];

export function MuseumStats() {
  return (
    <section
      id="museum-stats"
      className="relative py-16 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,transparent 0%,rgba(8,6,0,0.4) 50%,transparent 100%)' }}
    >
      {/* Top separator */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)' }} />

      {/* Background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' stroke='%23D4AF37' stroke-width='0.3' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.5))' }} />
            <span style={{ fontFamily: 'var(--font-source)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D4AF37' }}>
              Collection Overview
            </span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg,rgba(212,175,55,0.5),transparent)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', color: '#F4E4BC', fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 700 }}>
            The Collection in Numbers
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="group relative rounded-2xl p-6 text-center overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              whileHover={{ y: -4, borderColor: `${stat.color}44` }}
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 50% 100%, ${stat.color}12 0%, transparent 70%)` }}
              />

              {/* Icon */}
              <div
                className="mx-auto mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: `${stat.color}15`,
                  border: `1px solid ${stat.color}30`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>

              {/* Counter */}
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '2.2rem', fontWeight: 700, color: stat.color, lineHeight: 1 }}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
              </div>

              {/* Label */}
              <div style={{ fontFamily: 'var(--font-source)', color: '#F4E4BC', fontSize: '0.85rem', fontWeight: 600, marginTop: '6px' }}>
                {stat.label}
              </div>

              {/* Description */}
              <div style={{ fontFamily: 'var(--font-source)', color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: '3px', letterSpacing: '0.03em' }}>
                {stat.description}
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-3/4 transition-all duration-500"
                style={{ background: `linear-gradient(90deg,transparent,${stat.color},transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)' }} />
    </section>
  );
}
