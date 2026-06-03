'use client';

import AppImage from '@/components/ui/AppImage';
import { ScrollReveal } from '@/components/animation/ScrollReveal';
import { MagneticButton } from '@/components/animation/MagneticButton';

export default function StorySection() {
  return (
    <section className="py-section px-4">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <ScrollReveal direction="left">
          <div className="relative aspect-[4/5] overflow-hidden rounded-glass">
            <AppImage
              src="/images/ideology/role-of-patriotism.jpg"
              alt="Bến Nhà Rồng — nơi Nguyễn Tất Thành xuất phát tìm đường cứu nước, tháng 6/1911"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-105 sepia-[0.15]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-heritage-charcoal/60 to-transparent" />
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.2}>
          <p className="text-sm font-semibold uppercase tracking-widest text-heritage-gold">Câu chuyện</p>
          <h2 className="section-title mt-2 text-left">Hành trình tìm đường cứu nước</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Tháng 6 năm 1911, một thanh niên yêu nước rời Sài Gòn trên con tàu Pháp, bắt đầu
            hành trình ba mươi năm qua nhiều châu lục. Với tình yêu Tổ quốc và quyết tâm chấm dứt
            áp bức thực dân, Nguyễn Tất Thành — sau này là Hồ Chí Minh — tìm con đường đưa
            Việt Nam đến độc lập, tự do.
          </p>
          <MagneticButton href="/ideology" className="mt-8">
            Đọc bài viết tư tưởng
          </MagneticButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
