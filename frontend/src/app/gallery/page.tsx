'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import type { GalleryImage } from '@/lib/types';

// ── Museum Components ──────────────────────────────────────────
import { MuseumHero } from '@/components/museum/MuseumHero';
import { FeaturedExhibition } from '@/components/museum/FeaturedExhibition';
import { MuseumFilterBar } from '@/components/museum/MuseumFilterBar';
import { CollectionGrid } from '@/components/museum/CollectionGrid';
import { MuseumStats } from '@/components/museum/MuseumStats';
import { ArtifactModal } from '@/components/museum/ArtifactModal';
import type { FilterCategory } from '@/components/museum/MuseumFilterBar';
import TimelinePageBackground from '@/components/timeline/TimelinePageBackground';

const MuseumParticles = dynamic(
  () => import('@/components/museum/MuseumParticles').then(m => m.MuseumParticles),
  { ssr: false }
);

// ── Rich fallback dataset ──────────────────────────────────────
const FALLBACK_GALLERY: GalleryImage[] = [
  {
    id: 1,
    title: 'Bến cảng Nhà Rồng đầu thế kỷ 20 (nay là số 1 đường Nguyễn Tất Thành, TP HCM)',
    description: 'Nơi Nguyễn Tất Thành (tên gọi Văn Ba) ra đi tìm đường cứu nước',
    image_url: 'https://i1-vnexpress.vnecdn.net/2025/08/15/L1044370-copy_1755248877-1755249045.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=2nCPqU4VxkhSFcDgWQ2_9Q',
    year: 1911,
    category: 'photograph',
  },
  {
    id: 2,
    title: 'Tàu Đô đốc Latouche-Tréville',
    description: 'Con tàu đã đưa thanh niên Nguyễn Tất Thành rời Tổ quốc, bắt đầu hành trình tìm đường cứu nước.',
    image_url: 'https://i1-vnexpress.vnecdn.net/2025/08/15/L1044370_1755248877-1755249045.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=esCrrdXbROCcaVGSgbbFSg',
    year: 1911,
    category: 'photograph',
  },
  {
    id: 3,
    title: 'Cảng Vieux-Port, Marseille đầu thế kỷ 20',
    description: 'Nơi thanh niên Nguyễn Tất Thành lần đầu đặt chân đến nước Pháp',
    image_url: 'https://i1-vnexpress.vnecdn.net/2025/08/15/DSC-3798-1755240269.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=jPn0fM4q3y8jG0FPNzOm-g',
    year: 1911,
    category: 'photograph',
  },
  {
    id: 4,
    title: 'Trong những năm bôn ba, người thanh niên yêu nước trải qua nhiều công việc như phụ bếp tại khách sạn Carlton ở London, Anh trong bốn năm',
    description: 'Nguyễn Tất Thành vừa mưu sinh vừa học tập, chuẩn bị hành trang tư tưởng tìm đường đến độc lập, tự do cho dân tộc.',
    image_url: 'https://i1-vnexpress.vnecdn.net/2025/08/15/DSC-3792-1755240267.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=oaWQefdg5ky30S3-rtR5qQ',
    year: 1914,
    category: 'photograph',
  },
  {
    id: 5,
    title: 'Bản yêu sách 8 điểm đòi tự do dân chủ và quyền tự quyết cho người dân An Nam, ký tên Nguyễn Ái Quốc được gửi đến Hội nghị Versailles (Pháp) - mở đầu cho tiếng nói chính trị của người Việt tại diễn đàn quốc tế thời đó.',
    description: '"Cải cách nền pháp lý ở Đông Dương bằng cách ban bố cho người bản xứ cũng được những đảm bảo về pháp lý như người Âu châu, xóa bỏ hoàn toàn và triệt để các tòa án đặc biệt dùng làm công cụ khủng bố và áp bức đối với bộ phận trung thực nhất trong nhân dân An Nam", điều 2 trong 8 điểm yêu sách nêu. Nhưng tất cả đều không được chấp thuận. Ảnh chụp đầu thập niên 1920 bên tờ báo L’Humannité - cơ quan ngôn luận của Đảng Cộng sản Pháp, nơi người thanh niên 30 tuổi đấu tranh cho quyền lợi các dân tộc thuộc địa. Những năm này, Người tích cực viết báo, tham gia phong trào cộng sản quốc tế.',
    image_url: 'https://i1-vnexpress.vnecdn.net/2025/08/15/IMG-8609-copy-1755243280.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=lO5vnNbr0jzdmlL8JQk5LA',
    year: 1919,
    category: 'photograph',
  },
  {
    id: 6,
    title: 'Hồ sơ mật vụ Anh và ảnh Nguyễn Ái Quốc với bí danh Tống Văn Sơ bị bắt tại Hong Kong',
    description: 'Hồ sơ mật vụ Anh và ảnh Nguyễn Ái Quốc với bí danh Tống Văn Sơ bị bắt tại Hong Kong năm 1931 theo yêu cầu mật thám Pháp. Dù được luật sư Loseby bào chữa và Tòa án Tối cao tuyên trả tự do, ông vẫn bị giam cầm tới cuối năm 1932 tại nhà tù Victoria (Hong Kong)',
    image_url: 'https://i1-vnexpress.vnecdn.net/2025/08/15/DSC-3802-1755240275.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=fr0HO1YWGrtd-Draae9CCQ',
    year: 1931,
    category: 'photograph',
  },
  {
  id: 7,
  title: 'Máy chữ của Chủ tịch Hồ Chí Minh',
  description: 'Máy chữ Chủ tịch Hồ Chí Minh sử dụng trong thời gian Người ở và làm việc tại Phủ Chủ tịch.',
  image_url: 'https://hnm.1cdn.vn/2020/05/07/hanoimoi.com.vn-uploads-album-20200507-_55383101-800c-426f-92c9-56c464097661.jpg',
  year: 0,
  category: 'artifact',
},
{
  id: 8,
  title: 'Bộ quần áo kaki của Chủ tịch Hồ Chí Minh',
  description: 'Bộ quần áo kaki Chủ tịch Hồ Chí Minh thường mặc khi đi thăm các địa phương trong nước, dự hội nghị và các cuộc họp Chính phủ.',
  image_url: 'https://hnm.1cdn.vn/2020/05/07/hanoimoi.com.vn-uploads-album-20200507-_24c72dfb-9277-4be2-82c4-a5be56a401fd.jpg',
  year: 0,
  category: 'artifact',
},
{
  id: 9,
  title: 'Đôi dép cao su của Chủ tịch Hồ Chí Minh',
  description: 'Đôi dép cao su Chủ tịch Hồ Chí Minh sử dụng khi đi thăm các địa phương trong nước và các quốc gia trên thế giới.',
  image_url: 'https://hnm.1cdn.vn/2020/05/07/hanoimoi.com.vn-uploads-album-20200507-_b8808a76-dea9-4c3d-bc5d-04eb98d71450.jpg',
  year: 0,
  category: 'artifact',
},
{
  id: 10,
  title: 'Bộ dụng cụ tập thể dục của Chủ tịch Hồ Chí Minh',
  description: 'Bộ dụng cụ tập thể dục gồm lò xo kéo tay, quả chùy, dụng cụ tập tay, quả bóng tennis... Bác sử dụng từ năm 1967 đến năm 1969.',
  image_url: 'https://hnm.1cdn.vn/2020/05/07/hanoimoi.com.vn-uploads-album-20200507-_97db8450-73e6-467b-9c2b-4e96e1dec9d3.jpg',
  year: 1967,
  category: 'artifact',
},
{
  id: 11,
  title: 'Chiếc quạt lá cọ của Chủ tịch Hồ Chí Minh',
  description: 'Chiếc quạt lá cọ Bác Hồ sử dụng từ năm 1960 trong sinh hoạt hằng ngày.',
  image_url: 'https://hnm.1cdn.vn/2020/05/07/hanoimoi.com.vn-uploads-album-20200507-_d47b036e-d242-4568-ad33-05d863f84750.jpg',
  year: 1960,
  category: 'artifact',
},
{
  id: 12,
  title: 'Chiếc đèn điện để bàn Bác sử dụng trong thời gian ở và làm việc tại Phủ Chủ tịch.',
  description: 'Chiếc đèn điện để bàn Bác sử dụng trong thời gian ở và làm việc tại Phủ Chủ tịch.',
  image_url: 'https://hnm.1cdn.vn/2020/05/07/hanoimoi.com.vn-uploads-album-20200507-_0ec8baee-162f-46d2-85f0-47283ff5037b.jpg',
  year: 0,
  category: 'artifact',
},
{
  id: 14,
  title: 'Chiến thuật chiến lược quân sự Hồ Chí Minh',
  description:
    'Tác phẩm do Đỗ Hoàng Linh và Nguyễn Văn Dương sưu tầm, biên soạn, tập hợp các bài viết của Chủ tịch Hồ Chí Minh về quân sự. Cuốn sách làm rõ tư duy quân sự Hồ Chí Minh với nghệ thuật chiến tranh nhân dân, toàn dân đánh giặc, lấy nhỏ thắng lớn và phát huy sức mạnh tổng hợp của dân tộc.',
  image_url: 'https://www.nxbctqg.org.vn/img_data/images/images/stories/Sachmoi/chienthuatchienluoc.jpg',
  year: 2020,
  category: 'document',
},
{
  id: 15,
  title: 'Bác Hồ gọi ấy là mùa xuân đến',
  description:
    'Cuốn sách giới thiệu những câu chuyện, tư tưởng và hoạt động của Chủ tịch Hồ Chí Minh trong mỗi dịp đón xuân, chúc Tết. Tác phẩm làm nổi bật những giá trị văn hóa, tinh thần và lời kêu gọi trồng cây, xây dựng đất nước ngày càng phát triển.',
  image_url: 'https://static.oreka.vn/800-800_06374acb-6582-43fa-8a3d-ee8dd12ff471',
  year: 2018,
  category: 'document',
},
];

// ── Page skeleton while loading ────────────────────────────────
function MuseumSkeleton() {
  return (
    <div className="min-h-screen" style={{ background: '#050505' }}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {/* Gold spinning ring */}
          <div className="relative w-20 h-20">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: '2px solid rgba(212,175,55,0.15)',
                borderTopColor: '#D4AF37',
                animation: 'spin 1s linear infinite',
              }}
            />
            <div
              className="absolute inset-3 rounded-full"
              style={{
                border: '1px solid rgba(212,175,55,0.08)',
                borderTopColor: 'rgba(212,175,55,0.4)',
                animation: 'spin 1.4s linear infinite reverse',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20"><polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7" fill="#D4AF37" opacity="0.7"/></svg>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-source)', color: 'rgba(212,175,55,0.5)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Loading Collection
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [sortNewest, setSortNewest] = useState(true);
  const [viewGrid, setViewGrid] = useState(true);
  const collectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.gallery
      .list()
      .then(data => setImages((data as GalleryImage[]).length > 0 ? data as GalleryImage[] : FALLBACK_GALLERY))
      .catch(() => setImages(FALLBACK_GALLERY))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <MuseumSkeleton />;

  return (
    <>
      <TimelinePageBackground />

      {/* Global museum override — force dark background across the full page */}
      <style>{`
        body { background: #050505 !important; }
        html { background: #050505 !important; }
      `}</style>

      {/* Floating gold particles (fixed overlay) */}
      <MuseumParticles />

      {/* ── HERO ───────────────────────────────────────────── */}
      <MuseumHero />

      {/* ── FEATURED EXHIBITION ────────────────────────────── */}
      <FeaturedExhibition onSelect={setSelected} />

      {/* ── STATS ──────────────────────────────────────────── */}
      <MuseumStats />

      {/* ── COLLECTION SECTION ─────────────────────────────── */}
      <section
        id="museum-collection"
        ref={collectionRef}
        className="relative"
        style={{ background: 'transparent' }}
      >
        {/* Section header */}
        <div
          className="mx-auto max-w-[1400px] px-6 lg:px-16 pt-20 pb-10"
          style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.5))' }} />
                <span style={{ fontFamily: 'var(--font-source)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D4AF37' }}>
                  Permanent Collection
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #F4E4BC 0%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Museum Collection
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                style={{ fontFamily: 'var(--font-source)', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', marginTop: '8px' }}
              >
                {images.length} items spanning 1890–1930
              </motion.p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4">
              {[
                { color: '#D4AF37', label: 'Photograph' },
                { color: '#C89B3C', label: 'Artifact' },
                { color: '#C1121F', label: 'Document' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span style={{ fontFamily: 'var(--font-source)', color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky filter bar */}
        <MuseumFilterBar
          active={filter}
          onChange={setFilter}
          sortNewest={sortNewest}
          onToggleSort={() => setSortNewest(p => !p)}
          viewGrid={viewGrid}
          onToggleView={() => setViewGrid(p => !p)}
        />

        {/* Collection grid */}
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16 py-12">
          <CollectionGrid
            images={images}
            filter={filter}
            sortNewest={sortNewest}
            viewGrid={viewGrid}
            onSelect={setSelected}
          />
        </div>
      </section>

      {/* ── FOOTER CTA ─────────────────────────────────────── */}
      <section
        className="relative py-12 overflow-hidden"
        style={{ background: 'transparent', borderTop: '1px solid rgba(212,175,55,0.1)' }}
      >
        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl px-8 py-6"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(212,175,55,0.12)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
                <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="7,1 8.5,4.5 12,5 9.5,7.5 10,11 7,9.5 4,11 4.5,7.5 2,5 5.5,4.5" fill="#D4AF37"/></svg>
              </div>
              <p style={{ fontFamily: 'var(--font-source)', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                Explore the full collection and discover more about the journey
              </p>
            </div>

            <a
              href="#museum-collection"
              className="group flex-shrink-0 flex items-center gap-3 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg,#C1121F,#8B0000)',
                color: '#fff',
                fontFamily: 'var(--font-source)',
                letterSpacing: '0.05em',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                boxShadow: '0 0 30px rgba(193,18,31,0.3)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(193,18,31,0.5)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(193,18,31,0.3)'}
            >
              View All Collections
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-1 transition-transform">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── ARTIFACT MODAL ─────────────────────────────────── */}
      <ArtifactModal image={selected} onClose={() => setSelected(null)} />
    </>
  );
}
