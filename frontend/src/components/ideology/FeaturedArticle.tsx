'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Bookmark } from 'lucide-react';
import type { Article } from '@/lib/types';

interface FeaturedArticleProps {
  article: Article;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  onVisit?: (slug: string) => void;
}

export default function FeaturedArticle({
  article,
  bookmarks,
  toggleBookmark,
  onVisit,
}: FeaturedArticleProps) {
  const isBookmarked = bookmarks.includes(article.id);

  // Extract key points
  const keyPoints: string[] = Array.isArray(article.key_points)
    ? article.key_points
    : typeof article.key_points === 'string'
    ? JSON.parse(article.key_points as string)
    : ['Colonial exploitation required systemic change', 'Lenin\'s thesis linked national and social liberation', 'Socialism promised equality for all classes', 'Experience in France and USSR confirmed the theory'];

  // Categories mapping
  const categoryColor: Record<string, string> = {
    Socialism: '#C1121F',
    Patriotism: '#D4AF37',
    'National Independence': '#F5C542',
    'Party Building': '#8B0000',
  };

  const tagColor = categoryColor[article.category || ''] || '#D4AF37';

  // Customized Unsplash historical-thematic images
  const localImageMap: Record<string, string> = {
    'why-socialism': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    'national-independence-socialism': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    'role-of-patriotism': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
    'preparation-cpv': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  };

  const imageSrc = localImageMap[article.slug] || article.image_url || 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80';

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-16 mb-16">
      {/* Featured Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="h-px w-6 bg-[#C1121F]" />
        <span className="text-[0.65rem] uppercase tracking-widest text-[#C1121F] font-bold">Featured Masterpiece</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(15, 15, 15, 0.65)',
          border: '1px solid rgba(212,175,55,0.2)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex flex-col lg:flex-row min-h-[420px]">
          
          {/* Image Block */}
          <div className="relative w-full lg:w-[45%] min-h-[280px] lg:min-h-full overflow-hidden">
            <Image
              src={imageSrc}
              alt={article.title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.75] contrast-[1.05]"
              sizes="(max-w-lg) 100vw, 600px"
            />
            {/* Visual overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0F0F0F] pointer-events-none" />
            
            {/* Double Border Frame Overlay */}
            <div className="absolute inset-4 border border-[#D4AF37]/15 rounded-2xl pointer-events-none" />

            {/* Category Tag Overlay */}
            <div className="absolute top-6 left-6 z-10">
              <span
                className="px-3.5 py-1.5 rounded-full text-[0.6rem] font-bold uppercase tracking-wider text-white shadow-lg"
                style={{ background: tagColor }}
              >
                {article.category || 'Socialism'}
              </span>
            </div>
          </div>

          {/* Content Block */}
          <div className="flex-1 p-8 lg:p-12 flex flex-col justify-between text-left">
            <div>
              {/* Reading Stats & Action */}
              <div className="flex items-center justify-between gap-4 mb-4 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    6 mins read
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Intermediate
                  </span>
                </div>
                
                {/* Bookmark Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleBookmark(article.id);
                  }}
                  className={`p-2 rounded-full border transition-all duration-300 ${
                    isBookmarked
                      ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]'
                      : 'border-white/10 hover:border-white/20 text-gray-400 hover:text-white'
                  }`}
                  aria-label="Bookmark article"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Title */}
              <h2
                className="text-2xl lg:text-3.5xl font-bold tracking-tight text-[#FFF9E6]"
                style={{ fontFamily: 'var(--font-playfair), serif', lineHeight: 1.2 }}
              >
                <Link
                  href={`/ideology/${article.slug}`}
                  onClick={() => onVisit && onVisit(article.slug)}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {article.title}
                </Link>
              </h2>

              {/* Summary */}
              <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                {article.summary}
              </p>

              {/* Takeaway points */}
              {keyPoints && keyPoints.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <h4 className="text-[0.7rem] uppercase tracking-widest text-[#D4AF37] font-semibold mb-3">Key Philosophical Directives</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-300">
                    {keyPoints.slice(0, 4).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C1121F] mt-1.5 flex-shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Read Button */}
            <div className="mt-8 flex justify-start">
              <Link
                href={`/ideology/${article.slug}`}
                onClick={() => onVisit && onVisit(article.slug)}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #C1121F, #8B0000)',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(193, 18, 31, 0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(193, 18, 31, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(193, 18, 31, 0.25)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                Study Essay
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
