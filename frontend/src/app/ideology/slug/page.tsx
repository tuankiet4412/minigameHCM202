'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Clock, BookOpen, ChevronRight, Bookmark } from 'lucide-react';
import { api } from '@/lib/api';
import type { Article } from '@/lib/types';
import Loading from '@/components/ui/Loading';
import TimelinePageBackground from '@/components/timeline/TimelinePageBackground';

// Rich static content fallback matching the seeded database
const richFallbackArticles: Record<string, Article> = {
  'why-socialism': {
    id: 1,
    slug: 'why-socialism',
    title: 'Why Ho Chi Minh Chose Socialism',
    summary: 'Understanding the ideological journey that led Nguyen Ai Quoc to embrace Marxism-Leninism as the path to national liberation.',
    category: 'Socialism',
    key_points: [
      'Colonial exploitation required systemic change',
      'Lenin\'s thesis linked national and social liberation',
      'Socialism promised equality for all classes',
      'Experience in France and USSR confirmed the theory'
    ],
    historical_context: 'After decades of seeking help from democratic powers without success, Ho Chi Minh concluded that only a revolutionary transformation of society could achieve true independence.',
    content: 'Ho Chi Minh\'s embrace of socialism was not ideological dogma but a practical conclusion drawn from experience. Through his travels and study, he realized that national liberation must be paired with social emancipation. The Tours Congress of 1920 was a turning point, leading him to advocate for the liberation of all oppressed colonial peoples through the path of Marxism-Leninism.',
    image_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80'
  },
  'national-independence-socialism': {
    id: 2,
    slug: 'national-independence-socialism',
    title: 'National Independence and Socialism',
    summary: 'How Ho Chi Minh unified the goals of national liberation with social revolution into a coherent revolutionary strategy.',
    category: 'National Independence',
    key_points: [
      'Independence without social justice is incomplete',
      'Colonialism and capitalism are interconnected systems',
      'The working class leads the national liberation struggle',
      'Land reform follows political independence'
    ],
    historical_context: 'Vietnam under French rule suffered both national subjugation and exploitation of workers and peasants, requiring a dual liberation struggle.',
    content: 'For Ho Chi Minh, national independence and socialism were inseparable goals. He argued that the revolution must first achieve national sovereignty, then proceed to socialist construction to guarantee welfare, liberty, and happiness for the working class. This dual approach prevented a simple transition from colonial master to local exploiters.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
  },
  'role-of-patriotism': {
    id: 3,
    slug: 'role-of-patriotism',
    title: 'The Role of Patriotism',
    summary: 'Patriotism as the emotional and moral foundation of Ho Chi Minh\'s revolutionary commitment.',
    category: 'Patriotism',
    key_points: [
      'Love of country motivated the 1911 departure',
      'Patriotism inspired sacrifice among revolutionaries',
      'National culture must be preserved and developed',
      'International solidarity complements patriotism'
    ],
    historical_context: 'Growing up in a patriotic scholar family during the height of French colonial rule, young Nguyen Sinh Cung absorbed deep love for Vietnam and hatred of oppression.',
    content: 'Patriotism was the soul of Ho Chi Minh\'s revolution. It was the emotional force that unified the entire Vietnamese nation across religious and class lines. He believed that while Marxism-Leninism provided the scientific method, the patriotic tradition of the Vietnamese people was the primary engine of their struggle.',
    image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80'
  },
  'preparation-cpv': {
    id: 4,
    slug: 'preparation-cpv',
    title: 'Preparation for the Communist Party of Vietnam',
    summary: 'The organizational work from 1925 to 1930 that laid the foundation for Vietnam\'s revolutionary party.',
    category: 'Party Building',
    key_points: [
      'Revolutionary Youth League trained future leaders',
      'Three communist groups unified in 1930',
      'Hong Kong conference established the CPV',
      'Political line combined patriotism with Marxism'
    ],
    historical_context: 'Between founding the Revolutionary Youth League in 1925 and the CPV in 1930, Ho Chi Minh built the organizational infrastructure for revolution.',
    content: 'The founding of the CPV in 1930 was the culmination of nearly two decades of preparation. Ho Chi Minh meticulously trained cadres in Guangzhou, publishing "Đường Kách Mệnh" (The Revolutionary Path) to provide a clear theoretical line. By uniting disparate groups, he ensured the revolution had a single, disciplined leadership.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80'
  }
};

const CATEGORY_COLORS: Record<string, string> = {
  Socialism: '#C1121F',
  Patriotism: '#D4AF37',
  'National Independence': '#F5C542',
  'Party Building': '#8B0000',
};

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const articleRef = useRef<HTMLDivElement>(null);

  // Scroll Progress Bar logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (slug) {
      api.articles.get(slug as string)
        .then((data) => setArticle(data as Article))
        .catch(() => {
          // Fallback to static rich articles if backend is offline or returns error
          const localArticle = richFallbackArticles[slug as string];
          setArticle(localArticle || null);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <Loading />;
  if (!article) return <div className="py-20 text-center text-[#D4AF37]">Article not found</div>;

  const keyPoints = Array.isArray(article.key_points)
    ? article.key_points
    : typeof article.key_points === 'string'
    ? JSON.parse(article.key_points as string)
    : [];

  const tagColor = CATEGORY_COLORS[article.category || ''] || '#D4AF37';

  // Floating Table of Contents sections
  const tocItems = [
    { id: 'hero-banner', label: 'Title & Summary' },
    ...(article.historical_context ? [{ id: 'historical-context', label: 'Historical Context' }] : []),
    ...(keyPoints.length > 0 ? [{ id: 'key-points', label: 'Key Philosophies' }] : []),
    ...(article.content ? [{ id: 'full-content', label: 'Full Analysis' }] : []),
  ];

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      {/* Background Override */}
      <style>{`
        body { background: #050505 !important; }
        html { background: #050505 !important; }
      `}</style>

      {/* Parchment background from timeline */}
      <TimelinePageBackground />

      {/* Reading Progress Bar (Fixed Top) */}
      <motion.div
        className="fixed top-[72px] left-0 right-0 h-1 bg-[#D4AF37] origin-left z-50 shadow-[0_0_10px_rgba(212,175,55,0.7)]"
        style={{ scaleX }}
      />

      <div className="relative z-10 min-h-screen pt-24 pb-20 px-6 lg:px-16 max-w-[1400px] mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-start">
          <Link
            href="/ideology"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Academy
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* ── Main content block ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full text-left"
            ref={articleRef}
          >
            {/* Category and stats */}
            <div id="hero-banner" className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-400">
              <span
                className="px-3 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-wider text-white shadow-md"
                style={{ background: tagColor }}
              >
                {article.category || 'Socialism'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                6 mins read
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                Intermediate Level
              </span>
            </div>

            {/* Main Title */}
            <h1
              className="text-3xl md:text-5xl font-bold tracking-tight text-[#FFF9E6]"
              style={{ fontFamily: 'var(--font-playfair), serif', lineHeight: 1.15 }}
            >
              {article.title}
            </h1>

            {/* Divider line */}
            <div className="relative w-full h-[1px] bg-gradient-to-r from-[#D4AF37]/50 via-[#D4AF37]/10 to-transparent my-6">
              <div className="absolute top-1/2 left-4 -translate-y-1/2 w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
            </div>

            {/* Summary */}
            <p
              className="text-lg text-gray-300 italic font-light leading-relaxed border-l-2 border-[#D4AF37]/30 pl-4 my-6"
              style={{ fontFamily: 'var(--font-source), sans-serif' }}
            >
              {article.summary}
            </p>

            {/* Large Historical Image Banner */}
            {article.image_url && (
              <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-2xl my-8">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover object-center filter brightness-[0.75]"
                  priority
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-4 border border-[#D4AF37]/15 rounded-xl pointer-events-none" />
              </div>
            )}

            {/* 1. Historical Context */}
            {article.historical_context && (
              <section id="historical-context" className="mt-12 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                  <h2
                    className="text-xl md:text-2xl font-bold text-[#FFF9E6]"
                    style={{ fontFamily: 'var(--font-playfair), serif' }}
                  >
                    Historical Context
                  </h2>
                </div>
                <p className="text-gray-300 font-light leading-relaxed text-sm md:text-base">
                  {article.historical_context}
                </p>
              </section>
            )}

            {/* 2. Key philosophical takeaway bullets */}
            {keyPoints.length > 0 && (
              <section id="key-points" className="mt-12 text-left p-6 md:p-8 rounded-2xl bg-[#0A0A0A]/85 border border-[#D4AF37]/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-2 mb-4">
                  <Bookmark className="w-4 h-4 text-[#C1121F]" />
                  <h2
                    className="text-xl md:text-2xl font-bold text-[#FFF9E6]"
                    style={{ fontFamily: 'var(--font-playfair), serif' }}
                  >
                    Key Philosophical Directives
                  </h2>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  {keyPoints.map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 bg-white/2 p-4 rounded-xl border border-white/5">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#C1121F] shadow-[0_0_8px_rgba(193,18,31,0.8)]" />
                      <span className="leading-relaxed font-light">{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 3. Full Analysis Content */}
            {article.content && (
              <section id="full-content" className="mt-12 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                  <h2
                    className="text-xl md:text-2xl font-bold text-[#FFF9E6]"
                    style={{ fontFamily: 'var(--font-playfair), serif' }}
                  >
                    Academy Core Analysis
                  </h2>
                </div>
                <p className="text-gray-300 font-light leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {article.content}
                </p>
              </section>
            )}
          </motion.div>

          {/* ── Sticky Right Table of Contents ── */}
          <aside className="hidden lg:block w-[280px] sticky top-36">
            <div
              className="p-6 rounded-2xl border border-[#D4AF37]/15 bg-[#0C0C0C]/85 backdrop-blur-md text-left"
              style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            >
              <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-4 border-b border-white/5 pb-2">
                Course Syllabus
              </h3>
              <nav className="flex flex-col gap-3">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleScrollTo(item.id)}
                    className="text-xs text-gray-400 hover:text-[#FFF9E6] transition-colors flex items-center gap-1.5 focus:outline-none"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#D4AF37]/50" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}
