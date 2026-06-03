import type { TimelineEvent } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';
import {
  Baby,
  Ship,
  Landmark,
  BookOpen,
  ScrollText,
  Flag,
  GraduationCap,
  Users,
  Building2,
  Star,
} from 'lucide-react';

export type TimelineCategory = 'all' | 'vietnam' | 'world' | 'politics' | 'organizations';

export type TimelineIconKey =
  | 'baby'
  | 'ship'
  | 'landmark'
  | 'book'
  | 'scroll'
  | 'flag'
  | 'graduation'
  | 'users'
  | 'building'
  | 'star';

export type EnrichedTimelineEvent = TimelineEvent & {
  location: string;
  category: Exclude<TimelineCategory, 'all'>;
  icon: LucideIcon;
};

const ENRICHMENT: Record<
  number,
  Omit<EnrichedTimelineEvent, keyof TimelineEvent>
> = {
  1: { location: 'Kim Liên, Nghệ An, Việt Nam', category: 'vietnam', icon: Baby },
  2: { location: 'Sài Gòn, Việt Nam', category: 'vietnam', icon: Ship },
  3: { location: 'Versailles, Pháp', category: 'politics', icon: ScrollText },
  4: { location: 'Tours, Pháp', category: 'politics', icon: BookOpen },
  5: { location: 'Quảng Châu, Trung Quốc', category: 'organizations', icon: Users },
  6: { location: 'Hồng Kông', category: 'politics', icon: Flag },
};

export const FALLBACK_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 1,
    year: 1890,
    title: 'Sinh ra Nguyễn Sinh Cung',
    description: 'Sinh tại làng Kim Liên, tỉnh Nghệ An.',
    details: 'Sinh trong gia đình nhà nho yêu nước, được giáo dục tinh thần yêu nước và hiếu học từ nhỏ.',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  },
  {
    id: 2,
    year: 1911,
    title: 'Rời Việt Nam',
    description: 'Rời Sài Gòn trên tàu Amiral Latouche-Tréville để tìm đường cứu nước.',
    details: 'Khởi đầu hành trình ba mươi năm qua nhiều châu lục tìm con đường giải phóng dân tộc.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  },
  {
    id: 7,
    year: 1912,
    title: 'Harlem, New York',
    description: 'Làm việc và quan sát cuộc đấu tranh của người Mỹ gốc Phi tại Hoa Kỳ.',
    details: 'Chứng kiến bất công chủng tộc và áp bức giai cấp, củng cố quyết tâm chống thực dân.',
    image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
  },
  {
    id: 8,
    year: 1913,
    title: 'Những năm ở Luân Đôn',
    description: 'Làm thợ bánh và nghiên cứu chính trị phương Tây tại Anh.',
    details: 'Luân Đôn giúp Người tiếp cận phong trào công nhân và bộ máy đế quốc.',
    image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  },
  {
    id: 9,
    year: 1917,
    title: 'Đến Paris',
    description: 'Định cư tại Pháp với tên gọi Nguyễn Ái Quốc.',
    details: 'Paris là nơi đánh thức tư tưởng cách mạng của Người.',
    image_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
  },
  {
    id: 3,
    year: 1919,
    title: 'Hội nghị Hòa bình Versailles',
    description: 'Trình bản yêu sách 8 điểm đòi độc lập cho Việt Nam.',
    details: 'Đưa nguyện vọng của nhân dân Việt Nam ra trước các cường quốc thế giới.',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  },
  {
    id: 4,
    year: 1920,
    title: 'Luận cương giải phóng dân tộc của Lênin',
    description: 'Tìm thấy con đường cách mạng qua chủ nghĩa Mác-Lênin tại Đại hội Tours.',
    details: 'Gia nhập Đảng Cộng sản Pháp, theo đuổi chủ nghĩa quốc tế vô sản.',
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  },
  {
    id: 10,
    year: 1923,
    title: 'Đại học Cộng sản Phương Đông',
    description: 'Học lý luận và chiến lược cách mạng tại Moscow.',
    details: 'Củng cố nền tảng Mác-Lênin và kết nối với phong trào quốc tế.',
    image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
  },
  {
    id: 5,
    year: 1925,
    title: 'Hội Việt Nam Cách mạng Thanh niên',
    description: 'Thành lập Hội tại Quảng Châu để đào tạo cán bộ cách mạng Việt Nam.',
    details: 'Mở trường huấn luyện, định hình thế hệ lãnh đạo tương lai.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  },
  {
    id: 11,
    year: 1927,
    title: 'Đào tạo cán bộ cách mạng',
    description: 'Tổ chức mạng lưới bí mật và giáo dục chính trị khắp Đông Nam Á.',
    details: 'Xây dựng cơ sở tổ chức cho phong trào cách mạng toàn quốc.',
    image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  },
  {
    id: 12,
    year: 1929,
    title: 'Thống nhất các nhóm cộng sản',
    description: 'Thúc đẩy hợp nhất các tổ chức cộng sản rời rạc ở Đông Dương.',
    details: 'Chuẩn bị nền tảng cho một đảng duy nhất lãnh đạo dân tộc.',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
  },
  {
    id: 6,
    year: 1930,
    title: 'Thành lập Đảng Cộng sản Việt Nam',
    description: 'Hợp nhất các tổ chức cộng sản và thành lập Đảng tại Hồng Kông.',
    details: 'Cột mốc quyết định — biến tầm nhìn thành lực lượng cách mạng có tổ chức.',
    image_url: 'https://images.unsplash.com/photo-1518005020951-eccb994ad75d?w=800&q=80',
  },
];

const EXTRA_ENRICHMENT: Record<number, Omit<EnrichedTimelineEvent, keyof TimelineEvent>> = {
  7: { location: 'Harlem, New York, Hoa Kỳ', category: 'world', icon: Landmark },
  8: { location: 'Luân Đôn, Anh', category: 'world', icon: Landmark },
  9: { location: 'Paris, Pháp', category: 'world', icon: Landmark },
  10: { location: 'Moscow, Liên Xô', category: 'world', icon: GraduationCap },
  11: { location: 'Quảng Châu, Trung Quốc', category: 'organizations', icon: Building2 },
  12: { location: 'Đông Nam Á', category: 'organizations', icon: Star },
};

export function enrichTimelineEvents(events: TimelineEvent[]): EnrichedTimelineEvent[] {
  return events
    .map((event) => {
      const meta = ENRICHMENT[event.id] ?? EXTRA_ENRICHMENT[event.id] ?? {
        location: 'Việt Nam',
        category: 'vietnam' as const,
        icon: Landmark,
      };
      return { ...event, ...meta };
    })
    .sort((a, b) => a.year - b.year);
}

export const TIMELINE_STATS = {
  years: 40,
  countries: 6,
  distanceKm: 20000,
  events: 12,
  totalMilestones: 12,
};

export const TIMELINE_QUOTE = {
  text: 'Không có gì quý hơn độc lập, tự do.',
  author: 'Hồ Chí Minh',
};

export const CATEGORY_LABELS: Record<TimelineCategory, string> = {
  all: 'Tất cả sự kiện',
  vietnam: 'Việt Nam',
  world: 'Thế giới',
  politics: 'Chính trị',
  organizations: 'Tổ chức',
};
