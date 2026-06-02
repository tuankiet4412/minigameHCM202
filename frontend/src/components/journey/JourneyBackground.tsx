'use client';

import { motion } from 'framer-motion';

export default function JourneyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="noise-overlay absolute inset-0 opacity-[0.12]" />

      <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#D4AF37]/8 blur-[100px] animate-pulse-glow" />
      <div className="absolute -right-24 bottom-32 h-[360px] w-[360px] rounded-full bg-[#C41E3A]/6 blur-[90px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute left-1/2 top-1/3 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-[#FFD700]/4 blur-[80px]" />

      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.08), transparent 70%)',
        }}
      />

      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-[#FFD700]/40"
          style={{
            left: `${(i * 17 + 5) % 100}%`,
            top: `${(i * 23 + 10) % 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 4 + (i % 5),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 80px,
            rgba(212,175,55,0.5) 80px,
            rgba(212,175,55,0.5) 81px
          )`,
        }}
      />
    </div>
  );
}
