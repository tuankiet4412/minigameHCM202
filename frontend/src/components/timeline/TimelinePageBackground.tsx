'use client';

import Image from 'next/image';

/** Museum parchment background — public/images/timeline-museum-bg.png */
export const TIMELINE_BG_SRC = '/images/timeline-museum-bg.png';

export default function TimelinePageBackground() {
  return (
    <div className="timeline-page-bg pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Image
        src={TIMELINE_BG_SRC}
        alt=""
        fill
        priority
        quality={95}
        className="timeline-page-bg__image object-cover object-center"
        sizes="100vw"
      />
      {/* Warm gold lift — richer tones like the reference */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4A74E]/8 via-transparent to-[#A31212]/5 mix-blend-soft-light" />
      {/* Light center vignette only — keeps timeline readable without dulling corners */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% 42%, rgba(5,5,5,0.15) 0%, rgba(5,5,5,0.35) 55%, rgba(5,5,5,0.55) 100%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/25 via-transparent to-[#050505]/45" />
      <div className="noise-overlay absolute inset-0 opacity-[0.04]" />
    </div>
  );
}
