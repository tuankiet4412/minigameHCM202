'use client';

import { AnimatedCounter } from '@/components/animation/AnimatedCounter';
import { ScrollReveal } from '@/components/animation/ScrollReveal';
import { stats } from '@/lib/design-tokens';

export default function StatsSection() {
  return (
    <section className="relative border-y border-heritage-gold/10 bg-heritage-charcoal py-section">
      <div className="noise-overlay absolute inset-0 opacity-20" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
        {stats.map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 0.1}>
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-heritage-gold md:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-gray-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
