'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 400);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-heritage-charcoal"
          role="status"
          aria-label="Loading"
        >
          <div className="noise-overlay absolute inset-0 opacity-30" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 text-center"
          >
            <p className="text-heritage-gold text-xs font-semibold tracking-[0.4em] uppercase">
              1911 — 1930
            </p>
            <h2 className="mt-4 font-display text-2xl font-bold text-white md:text-3xl">
              Ho Chi Minh Journey
            </h2>
            <p className="mt-2 text-sm text-gray-400">National Salvation</p>
          </motion.div>

          <div className="relative z-10 mt-12 w-64">
            <div className="h-px w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-heritage-red via-heritage-gold to-heritage-red transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="mt-3 text-center text-xs text-heritage-gold/80 tabular-nums">
              {Math.min(Math.floor(progress), 100)}%
            </p>
          </div>

          <div
            className="absolute bottom-1/4 left-1/2 h-32 w-32 -translate-x-1/2 animate-spin rounded-full border border-heritage-gold/20"
            style={{ animationDuration: '8s' }}
            aria-hidden
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
