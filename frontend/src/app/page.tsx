'use client';

import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import StorySection from '@/components/home/StorySection';
import MilestonesSection from '@/components/home/MilestonesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import { ScrollReveal } from '@/components/animation/ScrollReveal';
import { MagneticButton } from '@/components/animation/MagneticButton';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <StorySection />
      <MilestonesSection />
      <FeaturesSection />

      <section className="relative overflow-hidden py-section px-4">
        <div className="absolute inset-0 bg-gradient-heritage opacity-90" />
        <div className="noise-overlay absolute inset-0" />
        <ScrollReveal className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Test Your Knowledge
          </h2>
          <p className="mt-4 text-white/80">
            Take our interactive quiz, compete on the leaderboard, and track your progress.
          </p>
          <MagneticButton href="/quiz" className="mt-8 !border-white !text-white hover:!bg-white/10">
            Start Quiz
          </MagneticButton>
        </ScrollReveal>
      </section>
    </>
  );
}
