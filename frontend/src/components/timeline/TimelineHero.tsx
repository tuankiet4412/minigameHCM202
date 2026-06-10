'use client';

import { motion } from 'framer-motion';
import { TextReveal } from '@/components/animation/TextReveal';

export default function TimelineHero() {
  return (
    <section className="timeline-hero relative overflow-hidden px-4 pb-10 pt-6 md:px-8 md:pb-14">
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4"
        >
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4A74E]/60" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#E6B85C] drop-shadow-sm">
            1890 — 1969
          </p>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4A74E]/60" />
        </motion.div>

        <TextReveal
          as="h1"
          text="Dòng thời gian lịch sử"
          className="mt-6 font-display text-4xl font-bold tracking-tight text-[#F5C76B] drop-shadow-[0_2px_24px_rgba(0,0,0,0.8)] md:text-5xl lg:text-6xl"
          delay={0.1}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#D9D9D9] drop-shadow-md md:text-lg"
        >
          Đi qua những khoảnh khắc then chốt định hình vận mệnh dân tộc — từ làng quê Nghệ An
          đến sự ra đời của phong trào cách mạng.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mx-auto mt-8 h-px max-w-md bg-gradient-to-r from-transparent via-[#D4A74E]/60 to-transparent"
        />
      </div>
    </section>
  );
}
