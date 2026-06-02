'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TextReveal } from '@/components/animation/TextReveal';
import { MagneticButton } from '@/components/animation/MagneticButton';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80"
        alt=""
        fill
        className="object-cover scale-105"
        priority
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-heritage-charcoal/80 via-heritage-charcoal/60 to-heritage-charcoal/95" />
      <div className="noise-overlay absolute inset-0 opacity-40" />

      <div className="absolute inset-0 hidden lg:block opacity-40 mix-blend-screen">
        <HeroScene />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-32 text-center">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ duration: 1 }}
          className="text-heritage-gold text-xs font-semibold uppercase md:text-sm"
        >
          1911 — 1930
        </motion.p>

        <TextReveal
          as="h1"
          text="Ho Chi Minh's Journey to Find the Path for National Salvation"
          className="mt-6 font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
          delay={0.2}
        />

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mx-auto mt-8 max-w-2xl text-lg italic text-heritage-gold-light/90 md:text-xl"
        >
          &ldquo;Nothing is more precious than independence and freedom.&rdquo;
          <footer className="mt-3 text-sm not-italic text-gray-400">— Ho Chi Minh</footer>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <MagneticButton href="/timeline">Explore Timeline</MagneticButton>
          <MagneticButton href="/journey" variant="outline">
            View Journey Map
          </MagneticButton>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        aria-hidden
      >
        <span className="block h-3 w-3 rotate-45 border-b-2 border-r-2 border-heritage-gold/60" />
      </motion.div>
    </section>
  );
}
