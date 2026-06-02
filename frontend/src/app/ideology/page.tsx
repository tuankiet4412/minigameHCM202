'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Article } from '@/lib/types';
import Loading from '@/components/ui/Loading';
import toast from 'react-hot-toast';

// ── Academy Components ─────────────────────────────────────────
import TimelinePageBackground from '@/components/timeline/TimelinePageBackground';
import IdeologyHero from '@/components/ideology/IdeologyHero';
import CategoryFilter, { type CategoryType } from '@/components/ideology/CategoryFilter';
import LearningProgress from '@/components/ideology/LearningProgress';
import FeaturedArticle from '@/components/ideology/FeaturedArticle';
import ArticleCard from '@/components/ideology/ArticleCard';

const fallbackArticles: Article[] = [
  {
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
    image_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80'
  },
  {
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
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
  },
  {
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
    image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80'
  },
  {
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
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80'
  }
];

// Helper to assign categories and images consistently
const enrichArticle = (art: Article): Article => {
  const slug = art.slug;
  let category = art.category || 'Socialism';
  if (slug === 'why-socialism') category = 'Socialism';
  if (slug === 'national-independence-socialism') category = 'National Independence';
  if (slug === 'role-of-patriotism') category = 'Patriotism';
  if (slug === 'preparation-cpv') category = 'Party Building';

  let image_url = art.image_url;
  if (slug === 'why-socialism') image_url = 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80';
  if (slug === 'national-independence-socialism') image_url = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80';
  if (slug === 'role-of-patriotism') image_url = 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80';
  if (slug === 'preparation-cpv') image_url = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80';

  return {
    ...art,
    category,
    image_url,
  };
};

export default function IdeologyPage() {
  const [rawArticles, setRawArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [readSlugs, setReadSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  
  const { isAuthenticated } = useAuth();

  // Load articles
  useEffect(() => {
    const params = search ? `search=${encodeURIComponent(search)}` : '';
    api.articles.list(params)
      .then((data) => {
        const list = (data as Article[]).length > 0 ? (data as Article[]) : fallbackArticles;
        setRawArticles(list.map(enrichArticle));
      })
      .catch(() => {
        setRawArticles(fallbackArticles.map(enrichArticle));
      })
      .finally(() => setLoading(false));
  }, [search]);

  // Load bookmark states
  useEffect(() => {
    if (isAuthenticated) {
      api.articles.bookmarkStatus()
        .then((ids) => setBookmarks(ids as number[]))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Load read articles from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('academy_read_slugs');
    if (stored) {
      try {
        setReadSlugs(JSON.parse(stored));
      } catch {
        // Ignored
      }
    }
  }, []);

  // Enrich articles with categories & details
  const enrichedArticles = useMemo(() => {
    return rawArticles.map(enrichArticle);
  }, [rawArticles]);

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    return enrichedArticles.filter((art) => {
      const matchesCategory =
        activeCategory === 'all' || art.category === activeCategory;
      return matchesCategory;
    });
  }, [enrichedArticles, activeCategory]);

  // Featured Article selection (first article of category, shown if category is 'all')
  const featured = useMemo(() => {
    if (filteredArticles.length > 0 && activeCategory === 'all') {
      return filteredArticles[0];
    }
    return null;
  }, [filteredArticles, activeCategory]);

  // Grid Articles list (exclude featured article)
  const gridArticles = useMemo(() => {
    if (activeCategory === 'all') {
      return filteredArticles.slice(1);
    }
    return filteredArticles;
  }, [filteredArticles, activeCategory]);

  // Computed unique categories that have been studied
  const studiedCategoriesCount = useMemo(() => {
    const categoriesSet = new Set<string>();
    enrichedArticles.forEach((art) => {
      if (readSlugs.includes(art.slug) && art.category) {
        categoriesSet.add(art.category);
      }
    });
    return categoriesSet.size;
  }, [enrichedArticles, readSlugs]);

  // Handle article visit
  const handleVisitArticle = (slug: string) => {
    setReadSlugs((prev) => {
      if (prev.includes(slug)) return prev;
      const next = [...prev, slug];
      localStorage.setItem('academy_read_slugs', JSON.stringify(next));
      return next;
    });
  };

  // Toggle bookmark handler
  const toggleBookmark = async (id: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark articles');
      return;
    }
    try {
      const res = await api.articles.toggleBookmark(id) as { bookmarked: boolean };
      setBookmarks((prev) =>
        res.bookmarked ? [...prev, id] : prev.filter((b) => b !== id)
      );
      toast.success(res.bookmarked ? 'Article bookmarked' : 'Bookmark removed');
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  if (loading && !search) return <Loading />;

  return (
    <>
      {/* Background Override */}
      <style>{`
        body { background: #050505 !important; }
        html { background: #050505 !important; }
      `}</style>

      {/* Parchment background from timeline */}
      <TimelinePageBackground />

      <div className="relative z-10 min-h-screen pb-24">
        
        {/* ── HERO ───────────────────────────────────────────── */}
        <IdeologyHero />

        {/* ── PROGRESS BOARD ─────────────────────────────────── */}
        <LearningProgress
          readCount={readSlugs.length}
          totalCount={enrichedArticles.length}
          bookmarkCount={bookmarks.length}
          topicsCount={studiedCategoriesCount}
        />

        {/* ── SEARCH & FILTER SECTION ────────────────────────── */}
        <section className="w-full max-w-[1400px] mx-auto px-6 lg:px-16 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#D4AF37]/10">
            <div>
              <h2
                className="text-xl lg:text-2.5xl font-semibold text-[#FFF9E6] text-left"
                style={{ fontFamily: 'var(--font-playfair), serif' }}
              >
                Curriculum Courses
              </h2>
              <p className="text-xs text-gray-400 mt-1 text-left font-light">
                Select a theoretical domain to narrow down your study material.
              </p>
            </div>

            {/* Glassmorphic Search Bar */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D4AF37]/70" />
              <input
                type="search"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-[#D4AF37]/25 bg-[#0C0C0C]/80 py-3 pl-11 pr-5 text-sm text-[#FFF9E6] placeholder-gray-500 focus:border-[#D4AF37]/65 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/35 transition-all duration-300"
                aria-label="Search articles"
              />
            </div>
          </div>

          {/* Category Filter Tab Selector */}
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        </section>

        {/* ── FEATURED ARTICLE ───────────────────────────────── */}
        {featured && (
          <FeaturedArticle
            article={featured}
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            onVisit={handleVisitArticle}
          />
        )}

        {/* ── ARTICLE GRID ───────────────────────────────────── */}
        <section className="w-full max-w-[1400px] mx-auto px-6 lg:px-16">
          <AnimatePresence mode="wait">
            {gridArticles.length > 0 ? (
              <motion.div
                key={activeCategory + '-' + search}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {gridArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    isBookmarked={bookmarks.includes(article.id)}
                    onToggleBookmark={() => toggleBookmark(article.id)}
                    onVisit={handleVisitArticle}
                  />
                ))}
              </motion.div>
            ) : (
              !featured && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-white/5"
                >
                  <p className="text-gray-400">No courses match your active search/filter criteria.</p>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </section>

      </div>
    </>
  );
}
