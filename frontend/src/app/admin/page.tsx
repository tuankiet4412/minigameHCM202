'use client';

import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  Map,
  Brain,
  ImageIcon,
  TrendingUp,
  Activity,
  Clock,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/animation/AnimatedCounter';
import { GlassCard } from '@/components/ui/glass-card';
import { ScrollReveal } from '@/components/animation/ScrollReveal';

const stats = [
  { label: 'Tổng lượt truy cập', value: 12480, icon: Users, change: '+12%' },
  { label: 'Bài đã đọc', value: 8432, icon: BookOpen, change: '+8%' },
  { label: 'Lượt làm câu đố', value: 3210, icon: Brain, change: '+24%' },
  { label: 'Tương tác bản đồ', value: 5670, icon: Map, change: '+15%' },
];

const recentActivity = [
  { action: 'Nộp bài câu đố mới', user: 'student_42', time: '2 phút trước' },
  { action: 'Xem sự kiện dòng thời gian', user: 'guest_891', time: '5 phút trước' },
  { action: 'Mở ảnh bảo tàng', user: 'historian_vn', time: '12 phút trước' },
  { action: 'Khám phá bản đồ hành trình', user: 'teacher_07', time: '18 phút trước' },
];

const chartBars = [65, 82, 45, 90, 72, 88, 56, 94, 78, 85, 62, 91];
const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-section">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-heritage-gold">Quản trị</p>
              <h1 className="section-title mt-1 text-left">Bảng phân tích</h1>
              <p className="mt-2 text-muted-foreground">Theo dõi tương tác trên bảo tàng số</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4 text-green-500" />
              Trực tiếp • Vừa cập nhật
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <GlassCard key={stat.label} className="!p-5" hover glow>
              <div className="flex items-start justify-between">
                <stat.icon className="h-5 w-5 text-heritage-gold" />
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                  {stat.change}
                </span>
              </div>
              <p className="mt-4 font-display text-3xl font-bold">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </GlassCard>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <GlassCard className="lg:col-span-2 !p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Tổng quan tương tác</h2>
              <TrendingUp className="h-5 w-5 text-heritage-gold" />
            </div>
            <div className="mt-8 flex h-48 items-end justify-between gap-2">
              {chartBars.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-heritage-red to-heritage-gold opacity-80"
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
              {months.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="!p-6">
            <h2 className="font-display text-lg font-semibold">Hoạt động gần đây</h2>
            <ul className="mt-6 space-y-4">
              {recentActivity.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 border-b border-white/5 pb-4 last:border-0"
                >
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-heritage-gold" />
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.user} • {item.time}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </GlassCard>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Bài viết', value: 24, icon: BookOpen },
            { label: 'Hiện vật bảo tàng', value: 18, icon: ImageIcon },
            { label: 'Điểm hành trình', value: 6, icon: Map },
          ].map((item) => (
            <GlassCard key={item.label} className="!p-5 flex items-center gap-4" hover>
              <item.icon className="h-8 w-8 text-heritage-gold" />
              <div>
                <p className="font-display text-2xl font-bold">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
