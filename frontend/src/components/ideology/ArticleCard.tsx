'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Clock, BookOpen, ArrowRight } from 'lucide-react';
import type { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onVisit?: (slug: string) => void;
}

// Mini timelines for each article
const SLUG_TIMELINES: Record<string, { year: number; event: string }[]> = {
  'why-socialism': [
    { year: 1911, event: 'Departed Vietnam to find a revolutionary path' },
    { year: 1920, event: 'Discovered Lenin’s Thesis at Tours Congress' },
    { year: 1923, event: 'Arrived in Moscow to study Marxist-Leninist theories' },
  ],
  'national-independence-socialism': [
    { year: 1919, event: 'Versailles Conference petition presentation' },
    { year: 1930, event: 'Unified national liberation with socialist ideals' },
    { year: 1945, event: 'Declared Independence of Vietnam (DRV)' },
  ],
  'role-of-patriotism': [
    { year: 1890, event: 'Born in Nghe An, raised in a patriotic scholar family' },
    { year: 1911, event: 'Patriotism drove his departure from Saigon port' },
    { year: 1941, event: 'Returned to homeland after 30 years to guide revolution' },
  ],
  'preparation-cpv': [
    { year: 1924, event: 'Arrived in Guangzhou to train young cadres' },
    { year: 1925, event: 'Founded Vietnam Revolutionary Youth League' },
    { year: 1930, event: 'Presided over Hong Kong Conference, founding CPV' },
  ],
};

const CATEGORY_COLORS: Record<string, string> = {
  Socialism: '#C1121F',
  Patriotism: '#D4AF37',
  'National Independence': '#F5C542',
  'Party Building': '#8B0000',
};

const LOCAL_IMAGES: Record<string, string> = {
  'why-socialism': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=80',
  'national-independence-socialism': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
  'role-of-patriotism': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80',
  'preparation-cpv': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
};

export default function ArticleCard({
  article,
  isBookmarked,
  onToggleBookmark,
  onVisit,
}: ArticleCardProps) {
  const timeline = SLUG_TIMELINES[article.slug] || [
    { year: 1911, event: 'Began historic voyage aboard French steamship' },
    { year: 1930, event: 'Laid foundation for revolutionary thought' },
  ];

  const tagColor = CATEGORY_COLORS[article.category || ''] || '#D4AF37';
  const imageSrc = LOCAL_IMAGES[article.slug] || article.image_url || 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=80';

  return (
    <motion.article
      whileHover={{ y: -6, borderColor: 'rgba(212,175,55,0.45)' }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col justify-between rounded-2xl overflow-hidden border border-[#D4AF37]/15 bg-[#0C0C0C]/80 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 100%, rgba(212,175,55,0.06) 0%, transparent 60%)' }} />

      <div>
        {/* Card Image Container */}
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={article.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out filter brightness-[0.7] contrast-[1.05]"
            sizes="(max-w-md) 100vw, 400px"
          />
          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* Thin frame outline overlay */}
          <div className="absolute inset-3 border border-[#D4AF37]/10 rounded-xl pointer-events-none" />

          {/* Floating Category Tag */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className="px-3 py-1 rounded-full text-[0.55rem] font-bold uppercase tracking-wider text-white shadow-md"
              style={{ background: tagColor }}
            >
              {article.category || 'Socialism'}
            </span>
          </div>

          {/* Floating Bookmark Toggle */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleBookmark();
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 border ${
                isBookmarked
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37]/45 text-[#D4AF37]'
                  : 'bg-black/40 border-white/10 hover:border-white/20 text-gray-300 hover:text-white'
              }`}
              aria-label="Bookmark article"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-[0.65rem] uppercase tracking-wider text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#D4AF37]" />
              5 mins read
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-[#D4AF37]" />
              Intermediate
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-lg font-bold text-[#FFF9E6]"
            style={{ fontFamily: 'var(--font-playfair), serif', lineHeight: 1.3 }}
          >
            <Link
              href={`/ideology/${article.slug}`}
              onClick={() => onVisit && onVisit(article.slug)}
              className="hover:text-[#D4AF37] transition-colors"
            >
              {article.title}
            </Link>
          </h3>

          {/* Summary */}
          <p className="text-gray-400 text-xs mt-2.5 leading-relaxed font-light line-clamp-3">
            {article.summary}
          </p>

          {/* Mini Knowledge Timeline Integration */}
          <div className="mt-5 pt-4 border-t border-white/5">
            <span className="block text-[0.6rem] uppercase tracking-widest text-[#D4AF37]/75 font-semibold mb-3">
              Historical Context
            </span>
            <div className="relative border-l border-[#D4AF37]/20 pl-4 ml-1.5 space-y-3 text-left">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative text-[0.68rem] text-gray-400">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-[21.5px] top-1 w-2 h-2 rounded-full bg-[#D4AF37] border border-[#050505] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                  
                  <span className="font-semibold text-[#FFF9E6] block" style={{ fontFamily: 'var(--font-source), sans-serif' }}>{item.year}</span>
                  <span className="leading-snug block font-light">{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="px-6 pb-6 pt-3 flex justify-end">
        <Link
          href={`/ideology/${article.slug}`}
          onClick={() => onVisit && onVisit(article.slug)}
          className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-[#D4AF37] hover:text-[#FFF9E6] group/link transition-colors"
        >
          Study Essay
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
}
