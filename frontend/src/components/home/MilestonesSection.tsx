'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/animations';
import { milestones } from '@/lib/design-tokens';
import { ScrollReveal } from '@/components/animation/ScrollReveal';

export default function MilestonesSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - track.clientWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: track.parentElement,
          start: 'top center',
          end: '+=150%',
          scrub: 1,
          pin: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-heritage-cream/30 py-section dark:to-heritage-charcoal/50">
      <div className="mx-auto max-w-6xl px-4">
        <ScrollReveal>
          <h2 className="section-title text-center">Cột mốc quan trọng</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Cuộn để đi qua những khoảnh khắc then chốt trên con đường cứu nước
          </p>
        </ScrollReveal>
      </div>

      <div ref={trackRef} className="mt-16 flex gap-6 px-8 md:px-16">
        {milestones.map((m) => (
          <div
            key={m.year}
            className="glass-card flex min-w-[280px] flex-shrink-0 flex-col justify-end p-8 md:min-w-[320px]"
          >
            <span className="font-display text-5xl font-bold text-heritage-red/20 dark:text-heritage-gold/30">
              {m.year}
            </span>
            <p className="mt-4 font-display text-xl font-semibold">{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
