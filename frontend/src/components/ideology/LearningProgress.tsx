'use client';

import { motion } from 'framer-motion';
import { BookOpen, Compass, Bookmark, Award } from 'lucide-react';

interface LearningProgressProps {
  readCount: number;
  totalCount: number;
  bookmarkCount: number;
  topicsCount: number;
}

export default function LearningProgress({
  readCount,
  totalCount,
  bookmarkCount,
  topicsCount,
}: LearningProgressProps) {
  const progressPercent = totalCount > 0 ? Math.round((readCount / totalCount) * 100) : 0;

  // Rank name based on progress
  let academyRank = 'Academy Initiate';
  let rankColor = '#A8A8A8';
  if (progressPercent > 75) {
    academyRank = 'Academy Fellow';
    rankColor = '#F5C542';
  } else if (progressPercent > 50) {
    academyRank = 'Ideology Scholar';
    rankColor = '#D4AF37';
  } else if (progressPercent > 20) {
    academyRank = 'Research Associate';
    rankColor = '#C1121F';
  }

  // Circular progress math
  const radius = 36;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-16 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-2xl p-6 lg:p-8 overflow-hidden"
        style={{
          background: 'rgba(10, 10, 10, 0.7)',
          border: '1px solid rgba(212,175,55,0.15)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255,255,255,0.05)',
        }}
      >
        {/* Glow backdrop */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-[#C1121F]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Circular indicator + Rank */}
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0 w-24 h-24 flex items-center justify-center">
              {/* Background Ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Active Gold Ring */}
                <motion.circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="url(#goldGradient)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5C542" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Percentage label in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[#FFF9E6]" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                  {progressPercent}%
                </span>
                <span className="text-[0.55rem] uppercase tracking-wider text-gray-500">Mastered</span>
              </div>
            </div>

            <div className="text-left">
              <span className="text-[0.65rem] uppercase tracking-widest text-[#D4AF37] font-semibold">Your Academy Rank</span>
              <h3
                className="text-2xl font-bold mt-0.5 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-playfair), serif', color: rankColor }}
              >
                <Award className="w-5 h-5" />
                {academyRank}
              </h3>
              <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
                Explore original essays and revolutionary guidelines to progress your academic standing.
              </p>
            </div>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-3 gap-6 lg:gap-12 flex-1 max-w-xl w-full">
            {/* Stat 1 */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-[#C1121F]/10 border border-[#C1121F]/20 flex items-center justify-center text-[#C1121F]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-2xl font-bold text-[#FFF9E6]" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                  {readCount}
                  <span className="text-xs text-gray-500 font-normal">/{totalCount}</span>
                </span>
                <span className="block text-[0.65rem] uppercase tracking-wider text-gray-400">Articles Read</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <Compass className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-2xl font-bold text-[#FFF9E6]" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                  {topicsCount}
                  <span className="text-xs text-gray-500 font-normal">/8</span>
                </span>
                <span className="block text-[0.65rem] uppercase tracking-wider text-gray-400">Topics Done</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                <Bookmark className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-2xl font-bold text-[#FFF9E6]" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                  {bookmarkCount}
                </span>
                <span className="block text-[0.65rem] uppercase tracking-wider text-gray-400">Saved Essays</span>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
