'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Map, Clock, Brain, ImageIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

const features = [
  { href: '/timeline', icon: Clock, title: 'Historical Timeline', desc: 'Interactive vertical, horizontal & 3D timeline modes.' },
  { href: '/journey', icon: Map, title: 'World Journey Map', desc: '3D globe with animated travel routes across six nations.' },
  { href: '/gallery', icon: ImageIcon, title: 'Digital Museum', desc: 'Immersive gallery with perspective depth effects.' },
  { href: '/ideology', icon: BookOpen, title: 'Ideology & Articles', desc: 'Socialism, patriotism, and revolutionary thought.' },
  { href: '/quiz', icon: Brain, title: 'Knowledge Quiz', desc: 'Timed quizzes, leaderboards, and progress tracking.' },
];

export default function FeaturesSection() {
  return (
    <section className="py-section px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-heritage-gold">Explore</p>
          <h2 className="section-title mt-2">Discover the Journey</h2>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.href} href={f.href} className="block h-full">
              <GlassCard className="group h-full" glow>
                <f.icon className="h-10 w-10 text-heritage-red transition-transform group-hover:scale-110 dark:text-heritage-gold" />
                <h3 className="mt-4 font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                <span className="mt-6 inline-flex items-center text-sm font-medium text-heritage-red dark:text-heritage-gold">
                  Explore <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
