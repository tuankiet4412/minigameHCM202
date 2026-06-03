'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { api, isApiEnabled } from '@/lib/api';
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
import { getIdeologyArticleImage } from '@/lib/ideology-images';

const fallbackArticles: Article[] = [
  {
    id: 1,
    slug: 'why-socialism',
    title: 'Vì sao Hồ Chí Minh chọn con đường xã hội chủ nghĩa',
    summary: 'Hành trình tư tưởng đưa Nguyễn Ái Quốc đến với chủ nghĩa Mác-Lênin như con đường giải phóng dân tộc.',
    category: 'Socialism',
    key_points: [
      'Bóc lột thực dân đòi hỏi thay đổi hệ thống',
      'Luận cương Lênin gắn giải phóng dân tộc với giải phóng xã hội',
      'Chủ nghĩa xã hội hứa hẹn bình đẳng cho mọi tầng lớp',
      'Kinh nghiệm ở Pháp và Liên Xô khẳng định lý luận',
    ],
    historical_context: 'Sau nhiều năm tìm kiếm sự giúp đỡ từ các cường quốc dân chủ không thành, Hồ Chí Minh kết luận chỉ cách mạng xã hội mới đạt độc lập thực sự.',
    image_url: getIdeologyArticleImage('why-socialism', 'Socialism'),
  },
  {
    id: 2,
    slug: 'national-independence-socialism',
    title: 'Độc lập dân tộc gắn với chủ nghĩa xã hội',
    summary: 'Cách Hồ Chí Minh thống nhất mục tiêu giải phóng dân tộc với cách mạng xã hội thành chiến lược nhất quán.',
    category: 'National Independence',
    key_points: [
      'Độc lập không có công bằng xã hội là chưa trọn vẹn',
      'Chủ nghĩa thực dân và tư bản là hai mặt của cùng hệ thống',
      'Giai cấp công nhân lãnh đạo đấu tranh giải phóng dân tộc',
      'Cải cách ruộng đất theo sau độc lập chính trị',
    ],
    historical_context: 'Việt Nam dưới ách thực dân Pháp vừa bị áp bức dân tộc vừa bị bóc lột giai cấp, đòi hỏi đấu tranh giải phóng kép.',
    image_url: getIdeologyArticleImage('national-independence-socialism', 'National Independence'),
  },
  {
    id: 3,
    slug: 'role-of-patriotism',
    title: 'Vai trò của lòng yêu nước',
    summary: 'Tình yêu Tổ quốc là nền tảng tinh thần và đạo đức của cam kết cách mạng Hồ Chí Minh.',
    category: 'Patriotism',
    key_points: [
      'Yêu nước thúc đẩy cuộc ra đi năm 1911',
      'Yêu nước truyền cảm hứng hy sinh cho người cách mạng',
      'Văn hóa dân tộc cần được giữ gìn và phát triển',
      'Đoàn kết quốc tế bổ sung cho yêu nước',
    ],
    historical_context: 'Lớn lên trong gia đình nhà nho yêu nước thời thực dân Pháp, Nguyễn Sinh Cung thấm đẫm tình yêu Việt Nam và căm thù áp bức.',
    image_url: getIdeologyArticleImage('role-of-patriotism', 'Patriotism'),
  },
  {
    id: 4,
    slug: 'preparation-cpv',
    title: 'Chuẩn bị thành lập Đảng Cộng sản Việt Nam',
    summary: 'Công tác tổ chức từ 1925 đến 1930 tạo nền tảng cho đảng cách mạng Việt Nam.',
    category: 'Party Building',
    key_points: [
      'Hội Việt Nam Cách mạng Thanh niên đào tạo cán bộ',
      'Ba tổ chức cộng sản hợp nhất năm 1930',
      'Hội nghị Hồng Kông thành lập Đảng',
      'Đường lối kết hợp yêu nước với Mác-Lênin',
    ],
    historical_context: 'Từ khi thành lập Hội Thanh niên (1925) đến Đảng (1930), Hồ Chí Minh xây dựng cơ sở tổ chức cho cách mạng.',
    image_url: getIdeologyArticleImage('preparation-cpv', 'Party Building'),
  },
];

// Helper to assign categories and images consistently
const enrichArticle = (art: Article): Article => {
  const slug = art.slug;
  let category = art.category || 'Socialism';
  if (slug === 'why-socialism') category = 'Socialism';
  if (slug === 'national-independence-socialism') category = 'National Independence';
  if (slug === 'role-of-patriotism') category = 'Patriotism';
  if (slug === 'preparation-cpv') category = 'Party Building';

  const image_url = getIdeologyArticleImage(slug, category, art.image_url);

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
    if (!isApiEnabled) {
      setRawArticles(fallbackArticles.map(enrichArticle));
      setLoading(false);
      return;
    }
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
    if (isApiEnabled && isAuthenticated) {
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
    if (!isApiEnabled) {
      toast.error('Tính năng lưu bài cần bật API (NEXT_PUBLIC_USE_API=true)');
      return;
    }
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để lưu bài viết');
      return;
    }
    try {
      const res = await api.articles.toggleBookmark(id) as { bookmarked: boolean };
      setBookmarks((prev) =>
        res.bookmarked ? [...prev, id] : prev.filter((b) => b !== id)
      );
      toast.success(res.bookmarked ? 'Đã lưu bài viết' : 'Đã bỏ lưu');
    } catch {
      toast.error('Cập nhật lưu bài thất bại');
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
                Khóa học chương trình
              </h2>
              <p className="text-xs text-gray-400 mt-1 text-left font-light">
                Chọn lĩnh vực lý luận để thu hẹp tài liệu học tập.
              </p>
            </div>

            {/* Glassmorphic Search Bar */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D4AF37]/70" />
              <input
                type="search"
                placeholder="Tìm tài liệu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-[#D4AF37]/25 bg-[#0C0C0C]/80 py-3 pl-11 pr-5 text-sm text-[#FFF9E6] placeholder-gray-500 focus:border-[#D4AF37]/65 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/35 transition-all duration-300"
                aria-label="Tìm bài viết"
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
                  <p className="text-gray-400">Không có khóa học phù hợp với tìm kiếm hoặc bộ lọc.</p>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </section>

      </div>
    </>
  );
}
