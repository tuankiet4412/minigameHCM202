'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Clock, BookOpen, ChevronRight, Bookmark } from 'lucide-react';
import { api, isApiEnabled } from '@/lib/api';
import type { Article } from '@/lib/types';
import Loading from '@/components/ui/Loading';
import TimelinePageBackground from '@/components/timeline/TimelinePageBackground';
import { categoryDisplayVi } from '@/components/ideology/CategoryFilter';
import { getIdeologyArticleImage } from '@/lib/ideology-images';

// Nội dung dự phòng tiếng Việt khi API không khả dụng
const richFallbackArticles: Record<string, Article> = {
  'why-socialism': {
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
    content: 'Hồ Chí Minh tiếp cận chủ nghĩa xã hội không phải giáo điều mà là kết luận thực tiễn. Qua hành trình và nghiên cứu, Người nhận thấy giải phóng dân tộc phải đi đôi với giải phóng xã hội. Đại hội Tours năm 1920 là bước ngoặt, đưa Người theo con đường Mác-Lênin vì giải phóng các dân tộc thuộc địa.',
    image_url: getIdeologyArticleImage('why-socialism', 'Socialism'),
  },
  'national-independence-socialism': {
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
    content: 'Với Hồ Chí Minh, độc lập dân tộc và chủ nghĩa xã hội là hai mục tiêu không tách rời. Cách mạng phải giành chủ quyền quốc gia, rồi tiến tới xây dựng chủ nghĩa xã hội để đảm bảo phúc lợi cho nhân dân lao động.',
    image_url: getIdeologyArticleImage('national-independence-socialism', 'National Independence'),
  },
  'role-of-patriotism': {
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
    content: 'Lòng yêu nước là linh hồn của cuộc cách mạng do Hồ Chí Minh lãnh đạo — sức mạnh tinh thần đoàn kết dân tộc. Mác-Lênin cung cấp phương pháp khoa học, còn truyền thống yêu nước là động lực then chốt của nhân dân Việt Nam.',
    image_url: getIdeologyArticleImage('role-of-patriotism', 'Patriotism'),
  },
  'preparation-cpv': {
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
    content: 'Thành lập Đảng năm 1930 là đỉnh cao gần hai thập kỷ chuẩn bị. Tại Quảng Châu, Hồ Chí Minh đào tạo cán bộ và xuất bản «Đường Kách mệnh», hợp nhất các nhóm để có một lãnh đạo kỷ luật, thống nhất.',
    image_url: getIdeologyArticleImage('preparation-cpv', 'Party Building'),
  },
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
    if (!slug) return;
    if (!isApiEnabled) {
      setArticle(richFallbackArticles[slug as string] || null);
      setLoading(false);
      return;
    }
    api.articles.get(slug as string)
        .then((data) => {
          const art = data as Article;
          setArticle({
            ...art,
            image_url: getIdeologyArticleImage(art.slug, art.category, art.image_url),
          });
        })
        .catch(() => {
          // Fallback to static rich articles if backend is offline or returns error
          const localArticle = richFallbackArticles[slug as string];
          setArticle(localArticle || null);
        })
        .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loading />;
  if (!article) return <div className="py-20 text-center text-[#D4AF37]">Không tìm thấy bài viết</div>;

  const keyPoints = Array.isArray(article.key_points)
    ? article.key_points
    : typeof article.key_points === 'string'
    ? JSON.parse(article.key_points as string)
    : [];

  const tagColor = CATEGORY_COLORS[article.category || ''] || '#D4AF37';
  const bannerImage = getIdeologyArticleImage(article.slug, article.category, article.image_url);

  // Floating Table of Contents sections
  const tocItems = [
    { id: 'hero-banner', label: 'Tiêu đề & tóm tắt' },
    ...(article.historical_context ? [{ id: 'historical-context', label: 'Bối cảnh lịch sử' }] : []),
    ...(keyPoints.length > 0 ? [{ id: 'key-points', label: 'Luận điểm cốt lõi' }] : []),
    ...(article.content ? [{ id: 'full-content', label: 'Phân tích đầy đủ' }] : []),
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
            Quay lại học viện
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
                {categoryDisplayVi(article.category || 'Socialism')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                6 phút đọc
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                Trung cấp
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
            {bannerImage && (
              <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-2xl my-8">
                <AppImage
                  src={bannerImage}
                  alt={article.title}
                  fill
                  className="object-cover object-center brightness-[0.75] sepia-[0.12]"
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
                    Bối cảnh lịch sử
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
                    Luận điểm tư tưởng cốt lõi
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
                    Phân tích cốt lõi
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
                Mục lục khóa học
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
