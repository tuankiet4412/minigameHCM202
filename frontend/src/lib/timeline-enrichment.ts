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
  Swords,
  Megaphone,
  Heart,
  Crown,
  Flame,
  FileText,
  Shield,
  Globe,
  Sparkles,
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
  | 'star'
  | 'swords'
  | 'megaphone'
  | 'heart'
  | 'crown'
  | 'flame'
  | 'filetext'
  | 'shield'
  | 'globe'
  | 'sparkles';

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
    image_url: '/images/timeline/1890.jpg',
  },
  {
    id: 2,
    year: 1911,
    title: 'Rời Việt Nam',
    description: 'Rời Sài Gòn trên tàu Amiral Latouche-Tréville để tìm đường cứu nước.',
    details: 'Khởi đầu hành trình ba mươi năm qua nhiều châu lục tìm con đường giải phóng dân tộc.',
    image_url: '/images/timeline/1911.jpg',
  },
  {
    id: 7,
    year: 1912,
    title: 'Harlem, New York',
    description: 'Làm việc và quan sát cuộc đấu tranh của người Mỹ gốc Phi tại Hoa Kỳ.',
    details: 'Chứng kiến bất công chủng tộc và áp bức giai cấp, củng cố quyết tâm chống thực dân.',
    image_url: '/images/timeline/1912.jpg',
  },
  {
    id: 8,
    year: 1913,
    title: 'Những năm ở Luân Đôn',
    description: 'Làm thợ bánh và nghiên cứu chính trị phương Tây tại Anh.',
    details: 'Luân Đôn giúp Người tiếp cận phong trào công nhân và bộ máy đế quốc.',
    image_url: '/images/timeline/1913.jpg',
  },
  {
    id: 9,
    year: 1917,
    title: 'Đến Paris',
    description: 'Định cư tại Pháp với tên gọi Nguyễn Ái Quốc.',
    details: 'Paris là nơi đánh thức tư tưởng cách mạng của Người.',
    image_url: '/images/timeline/1917.jpg',
  },
  {
    id: 3,
    year: 1919,
    title: 'Hội nghị Hòa bình Versailles',
    description: 'Trình bản yêu sách 8 điểm đòi độc lập cho Việt Nam.',
    details: 'Đưa nguyện vọng của nhân dân Việt Nam ra trước các cường quốc thế giới.',
    image_url: '/images/timeline/1919.jpg',
  },
  {
    id: 4,
    year: 1920,
    title: 'Luận cương giải phóng dân tộc của Lênin',
    description: 'Tìm thấy con đường cách mạng qua chủ nghĩa Mác-Lênin tại Đại hội Tours.',
    details: 'Gia nhập Đảng Cộng sản Pháp, theo đuổi chủ nghĩa quốc tế vô sản.',
    image_url: '/images/timeline/1920.jpg',
  },
  {
    id: 10,
    year: 1923,
    title: 'Đại học Cộng sản Phương Đông',
    description: 'Học lý luận và chiến lược cách mạng tại Moscow.',
    details: 'Củng cố nền tảng Mác-Lênin và kết nối với phong trào quốc tế.',
    image_url: '/images/timeline/1923.jpg',
  },
  {
    id: 5,
    year: 1925,
    title: 'Hội Việt Nam Cách mạng Thanh niên',
    description: 'Thành lập Hội tại Quảng Châu để đào tạo cán bộ cách mạng Việt Nam.',
    details: 'Mở trường huấn luyện, định hình thế hệ lãnh đạo tương lai.',
    image_url: '/images/timeline/1925.jpg',
  },
  {
    id: 11,
    year: 1927,
    title: 'Đào tạo cán bộ cách mạng',
    description: 'Tổ chức mạng lưới bí mật và giáo dục chính trị khắp Đông Nam Á.',
    details: 'Xây dựng cơ sở tổ chức cho phong trào cách mạng toàn quốc.',
    image_url: '/images/timeline/1927.jpg',
  },
  {
    id: 12,
    year: 1929,
    title: 'Thống nhất các nhóm cộng sản',
    description: 'Thúc đẩy hợp nhất các tổ chức cộng sản rời rạc ở Đông Dương.',
    details: 'Chuẩn bị nền tảng cho một đảng duy nhất lãnh đạo dân tộc.',
    image_url: '/images/timeline/1929.jpg',
  },
  {
    id: 6,
    year: 1930,
    title: 'Thành lập Đảng Cộng sản Việt Nam',
    description: 'Hợp nhất các tổ chức cộng sản và thành lập Đảng tại Hồng Kông.',
    details: 'Cột mốc quyết định — biến tầm nhìn thành lực lượng cách mạng có tổ chức.',
    image_url: '/images/timeline/1930.jpg',
  },
  {
    id: 13,
    year: 1931,
    title: 'Bị bắt tại Hồng Kông',
    description: 'Bị cảnh sát Anh bắt giữ tại Hồng Kông theo yêu cầu của mật thám Pháp.',
    details: 'Nhờ sự giúp đỡ của luật sư Frank Loseby và Quốc tế Cộng sản, Người thoát khỏi án dẫn độ về Đông Dương. Đây là giai đoạn nguy hiểm nhất trong cuộc đời hoạt động cách mạng.',
    image_url: '/images/timeline/1931.jpg',
  },
  {
    id: 14,
    year: 1941,
    title: 'Trở về Việt Nam sau 30 năm',
    description: 'Về nước tại Pác Bó, Cao Bằng, trực tiếp lãnh đạo phong trào cách mạng.',
    details: 'Sau ba mươi năm bôn ba nước ngoài, Người trở về Tổ quốc, sống trong hang Pác Bó và thành lập Mặt trận Việt Minh, chuẩn bị lực lượng cho cuộc tổng khởi nghĩa.',
    image_url: '/images/timeline/1941.jpg',
  },
  {
    id: 15,
    year: 1941,
    title: 'Thành lập Mặt trận Việt Minh',
    description: 'Sáng lập Việt Nam Độc lập Đồng minh Hội để đoàn kết toàn dân chống phát xít.',
    details: 'Việt Minh tập hợp mọi tầng lớp nhân dân không phân biệt giai cấp, tôn giáo, dân tộc trong một mặt trận thống nhất chống Nhật-Pháp, xây dựng căn cứ địa và phát triển lực lượng vũ trang.',
    image_url: '/images/timeline/1941_2.jpg',
  },
  {
    id: 16,
    year: 1942,
    title: 'Bị giam giữ tại Trung Quốc',
    description: 'Bị chính quyền Tưởng Giới Thạch bắt giam khi sang Trung Quốc liên lạc Đồng minh.',
    details: 'Bị giam 13 tháng qua hơn 30 nhà tù ở Quảng Tây. Trong thời gian này, Người sáng tác tập thơ "Nhật ký trong tù" — một kiệt tác văn học cách mạng thể hiện ý chí kiên cường bất khuất.',
    image_url: '/images/timeline/1942.jpg',
  },
  {
    id: 17,
    year: 1944,
    title: 'Thành lập Đội Việt Nam Tuyên truyền Giải phóng quân',
    description: 'Ra chỉ thị thành lập đội quân vũ trang đầu tiên — tiền thân Quân đội Nhân dân Việt Nam.',
    details: 'Ngày 22/12/1944, Đội Việt Nam Tuyên truyền Giải phóng quân gồm 34 chiến sĩ được thành lập tại khu rừng Trần Hưng Đạo, Cao Bằng dưới sự chỉ huy của Võ Nguyên Giáp.',
    image_url: '/images/timeline/1944.jpg',
  },
  {
    id: 18,
    year: 1945,
    title: 'Cách mạng Tháng Tám thành công',
    description: 'Lãnh đạo Tổng khởi nghĩa giành chính quyền trên toàn quốc.',
    details: 'Tận dụng thời cơ Nhật đầu hàng Đồng minh, Người phát động Tổng khởi nghĩa. Chỉ trong hai tuần (từ 14 đến 28/8/1945), nhân dân cả nước đồng loạt nổi dậy giành chính quyền, chấm dứt chế độ thực dân-phong kiến.',
    image_url: '/images/timeline/1945.jpg',
  },
  {
    id: 19,
    year: 1945,
    title: 'Đọc Tuyên ngôn Độc lập',
    description: 'Đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình, khai sinh nước Việt Nam Dân chủ Cộng hòa.',
    details: 'Ngày 2/9/1945, trước hàng vạn đồng bào, Chủ tịch Hồ Chí Minh trịnh trọng đọc Tuyên ngôn Độc lập, mở đầu bằng câu trích từ Tuyên ngôn Độc lập Hoa Kỳ, khẳng định quyền tự do và độc lập của dân tộc Việt Nam trước toàn thế giới.',
    image_url: '/images/timeline/1945_2.jpg',
  },
  {
    id: 20,
    year: 1946,
    title: 'Lời kêu gọi Toàn quốc kháng chiến',
    description: 'Phát lời kêu gọi toàn dân đứng lên chống thực dân Pháp xâm lược lần thứ hai.',
    details: '"Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ!" — Lời hiệu triệu ngày 19/12/1946 mở đầu cuộc kháng chiến chống Pháp trường kỳ 9 năm.',
    image_url: '/images/timeline/1946.jpg',
  },
  {
    id: 21,
    year: 1950,
    title: 'Chiến thắng Biên giới Thu-Đông',
    description: 'Chỉ đạo chiến dịch Biên giới, giải phóng vùng biên giới Việt-Trung.',
    details: 'Chiến dịch Biên giới Thu-Đông 1950 do Chủ tịch Hồ Chí Minh trực tiếp ra mặt trận chỉ đạo, đánh tan phòng tuyến biên giới của Pháp, mở đường liên lạc quốc tế và chuyển cuộc kháng chiến sang giai đoạn phản công.',
    image_url: '/images/timeline/1950.jpg',
  },
  {
    id: 22,
    year: 1954,
    title: 'Chiến thắng Điện Biên Phủ',
    description: 'Chỉ đạo cuộc chiến "lừng lẫy năm châu, chấn động địa cầu" đánh bại thực dân Pháp.',
    details: 'Sau 56 ngày đêm chiến đấu (13/3 – 7/5/1954), quân và dân Việt Nam toàn thắng tại Điện Biên Phủ, buộc Pháp phải ký Hiệp định Geneva. Chiến thắng chấm dứt gần 100 năm đô hộ của thực dân Pháp ở Đông Dương.',
    image_url: '/images/timeline/1954.jpg',
  },
  {
    id: 23,
    year: 1954,
    title: 'Hiệp định Geneva',
    description: 'Ký kết Hiệp định Geneva, công nhận độc lập Việt Nam và tạm chia cắt đất nước.',
    details: 'Hiệp định chia Việt Nam tại vĩ tuyến 17, quy định tổng tuyển cử thống nhất năm 1956. Tuy chiến thắng quân sự vang dội, Người trăn trở vì đất nước chưa thống nhất trọn vẹn.',
    image_url: '/images/timeline/1954_2.jpg',
  },
  {
    id: 24,
    year: 1960,
    title: 'Mặt trận Dân tộc Giải phóng miền Nam',
    description: 'Ủng hộ thành lập Mặt trận Dân tộc Giải phóng miền Nam Việt Nam.',
    details: 'Ngày 20/12/1960, Mặt trận Dân tộc Giải phóng miền Nam được thành lập, tập hợp các lực lượng yêu nước chống lại chế độ Ngô Đình Diệm và sự can thiệp quân sự của Mỹ, đấu tranh thống nhất Tổ quốc.',
    image_url: '/images/timeline/1960.jpg',
  },
  {
    id: 25,
    year: 1966,
    title: '"Không có gì quý hơn độc lập, tự do"',
    description: 'Phát lời kêu gọi nổi tiếng khẳng định ý chí kiên cường chống Mỹ.',
    details: 'Trước sự leo thang chiến tranh phá hoại miền Bắc của Mỹ, Chủ tịch Hồ Chí Minh ra lời kêu gọi ngày 17/7/1966 với câu bất hủ: "Không có gì quý hơn độc lập, tự do" — trở thành tuyên ngôn thời đại cho dân tộc Việt Nam.',
    image_url: '/images/timeline/1966.jpg',
  },
  {
    id: 26,
    year: 1968,
    title: 'Tổng tiến công Tết Mậu Thân',
    description: 'Chỉ đạo cuộc Tổng tiến công và nổi dậy Tết Mậu Thân trên toàn miền Nam.',
    details: 'Đêm 30 rạng sáng 31/1/1968, quân giải phóng đồng loạt tấn công hàng trăm mục tiêu trên toàn miền Nam, kể cả Đại sứ quán Mỹ ở Sài Gòn. Cuộc tiến công làm thay đổi cục diện chiến tranh, buộc Mỹ phải ngồi vào bàn đàm phán.',
    image_url: '/images/timeline/1968.jpg',
  },
  {
    id: 27,
    year: 1969,
    title: 'Chủ tịch Hồ Chí Minh qua đời',
    description: 'Chủ tịch Hồ Chí Minh từ trần ngày 2/9/1969 tại Hà Nội, hưởng thọ 79 tuổi.',
    details: 'Người ra đi khi đất nước chưa thống nhất, để lại bản Di chúc thiêng liêng dặn dò toàn Đảng, toàn dân. Di chúc thể hiện tâm nguyện về thống nhất Tổ quốc, xây dựng đất nước và chăm lo đời sống nhân dân. "Tôi để lại muôn vàn tình thân yêu cho toàn dân, toàn Đảng, cho toàn thể bộ đội, cho các cháu thanh niên và nhi đồng."',
    image_url: '/images/timeline/1969.jpg',
  },
];

const EXTRA_ENRICHMENT: Record<number, Omit<EnrichedTimelineEvent, keyof TimelineEvent>> = {
  7: { location: 'Harlem, New York, Hoa Kỳ', category: 'world', icon: Landmark },
  8: { location: 'Luân Đôn, Anh', category: 'world', icon: Landmark },
  9: { location: 'Paris, Pháp', category: 'world', icon: Landmark },
  10: { location: 'Moscow, Liên Xô', category: 'world', icon: GraduationCap },
  11: { location: 'Quảng Châu, Trung Quốc', category: 'organizations', icon: Building2 },
  12: { location: 'Đông Nam Á', category: 'organizations', icon: Star },
  13: { location: 'Hồng Kông', category: 'politics', icon: Shield },
  14: { location: 'Pác Bó, Cao Bằng, Việt Nam', category: 'vietnam', icon: Flag },
  15: { location: 'Cao Bằng, Việt Nam', category: 'organizations', icon: Users },
  16: { location: 'Quảng Tây, Trung Quốc', category: 'world', icon: BookOpen },
  17: { location: 'Cao Bằng, Việt Nam', category: 'vietnam', icon: Swords },
  18: { location: 'Toàn quốc, Việt Nam', category: 'vietnam', icon: Flame },
  19: { location: 'Quảng trường Ba Đình, Hà Nội', category: 'vietnam', icon: Megaphone },
  20: { location: 'Hà Nội, Việt Nam', category: 'politics', icon: Megaphone },
  21: { location: 'Biên giới Việt-Trung', category: 'vietnam', icon: Swords },
  22: { location: 'Điện Biên Phủ, Việt Nam', category: 'vietnam', icon: Crown },
  23: { location: 'Geneva, Thụy Sĩ', category: 'politics', icon: FileText },
  24: { location: 'Miền Nam, Việt Nam', category: 'organizations', icon: Globe },
  25: { location: 'Hà Nội, Việt Nam', category: 'politics', icon: Sparkles },
  26: { location: 'Toàn miền Nam, Việt Nam', category: 'vietnam', icon: Flame },
  27: { location: 'Hà Nội, Việt Nam', category: 'vietnam', icon: Heart },
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
  years: 79,
  countries: 8,
  distanceKm: 30000,
  events: 27,
  totalMilestones: 27,
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
