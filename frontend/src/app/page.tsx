'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Map, Clock, Brain } from 'lucide-react';

const features = [
  { href: '/timeline', icon: Clock, title: 'Historical Timeline', desc: 'Explore key events from 1890 to 1930 with interactive cards.' },
  { href: '/journey', icon: Map, title: 'World Journey Map', desc: 'Trace Ho Chi Minh\'s travels across six countries.' },
  { href: '/ideology', icon: BookOpen, title: 'Ideology & Articles', desc: 'Learn about socialism, patriotism, and revolutionary thought.' },
  { href: '/quiz', icon: Brain, title: 'Knowledge Quiz', desc: 'Test your understanding with timed quizzes and leaderboards.' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80"
          alt="Historical Vietnam landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-heritage-charcoal/70 via-heritage-red/40 to-heritage-charcoal/80" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-heritage-gold font-medium tracking-widest uppercase text-sm"
          >
            1911 – 1930
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 font-display text-4xl font-bold md:text-6xl lg:text-7xl"
          >
            Ho Chi Minh&apos;s Journey to Find the Path for National Salvation
          </motion.h1>
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-xl italic text-heritage-gold-light md:text-2xl"
          >
            &ldquo;Nothing is more precious than independence and freedom.&rdquo;
            <footer className="mt-2 text-sm not-italic text-gray-300">— Ho Chi Minh</footer>
          </motion.blockquote>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link href="/timeline" className="heritage-btn">Explore Timeline</Link>
            <Link href="/journey" className="heritage-btn-outline border-white text-white hover:bg-white/10">View Journey Map</Link>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-title"
          >
            A Quest for National Salvation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300"
          >
            In June 1911, a young Vietnamese patriot departed from Saigon aboard a French ship,
            beginning a thirty-year journey across continents. Driven by love of country and
            determination to end colonial oppression, Nguyen Tat Thanh — later known as Ho Chi Minh —
            sought the path that would lead Vietnam to independence and freedom.
          </motion.p>
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-heritage-cream/50 py-20 px-4 dark:bg-heritage-charcoal/50">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title text-center mb-12">Discover the Journey</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={f.href} className="museum-card group block h-full p-6 transition-transform hover:-translate-y-1">
                  <f.icon className="h-10 w-10 text-heritage-red dark:text-heritage-gold" />
                  <h3 className="mt-4 font-display text-xl font-semibold group-hover:text-heritage-red dark:group-hover:text-heritage-gold">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-heritage-red dark:text-heritage-gold">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="section-title">Test Your Knowledge</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Take our interactive quiz, compete on the leaderboard, and track your progress.
        </p>
        <Link href="/quiz" className="heritage-btn mt-8 inline-flex">Start Quiz</Link>
      </section>
    </>
  );
}
