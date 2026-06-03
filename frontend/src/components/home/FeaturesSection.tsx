'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Map, Clock, Brain, ImageIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

const features = [
  { href: '/timeline', icon: Clock, title: 'Dòng thời gian lịch sử', desc: 'Chế độ dọc, ngang và 3D tương tác.' },
  { href: '/journey', icon: Map, title: 'Bản đồ hành trình thế giới', desc: 'Quả địa cầu 3D với tuyến đường hoạt hình qua sáu quốc gia.' },
  { href: '/gallery', icon: ImageIcon, title: 'Bảo tàng số', desc: 'Phòng trưng bày số với hiệu ứng chiều sâu.' },
  { href: '/ideology', icon: BookOpen, title: 'Tư tưởng & bài viết', desc: 'Chủ nghĩa xã hội, yêu nước và tư tưởng cách mạng.' },
  { href: '/quiz', icon: Brain, title: 'Câu đố kiến thức', desc: 'Câu hỏi có giờ, bảng xếp hạng và theo dõi tiến độ.' },
];

export default function FeaturesSection() {
  return (
    <section className="py-section px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-heritage-gold">Khám phá</p>
          <h2 className="section-title mt-2">Khám phá hành trình</h2>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.href} href={f.href} className="block h-full">
              <GlassCard className="group h-full" glow>
                <f.icon className="h-10 w-10 text-heritage-red transition-transform group-hover:scale-110 dark:text-heritage-gold" />
                <h3 className="mt-4 font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                <span className="mt-6 inline-flex items-center text-sm font-medium text-heritage-red dark:text-heritage-gold">
                  Khám phá <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
