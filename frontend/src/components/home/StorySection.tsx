'use client';

import Image from 'next/image';
import { ScrollReveal } from '@/components/animation/ScrollReveal';
import { MagneticButton } from '@/components/animation/MagneticButton';

export default function StorySection() {
  return (
    <section className="py-section px-4">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <ScrollReveal direction="left">
          <div className="relative aspect-[4/5] overflow-hidden rounded-glass">
            <Image
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"
              alt="Historical journey"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-heritage-charcoal/60 to-transparent" />
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.2}>
          <p className="text-sm font-semibold uppercase tracking-widest text-heritage-gold">The Story</p>
          <h2 className="section-title mt-2 text-left">A Quest for National Salvation</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            In June 1911, a young Vietnamese patriot departed from Saigon aboard a French ship,
            beginning a thirty-year journey across continents. Driven by love of country and
            determination to end colonial oppression, Nguyen Tat Thanh — later known as Ho Chi Minh —
            sought the path that would lead Vietnam to independence and freedom.
          </p>
          <MagneticButton href="/ideology" className="mt-8">
            Read Ideology Articles
          </MagneticButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
