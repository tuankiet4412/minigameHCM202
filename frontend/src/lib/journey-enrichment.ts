import type { JourneyLocation } from '@/lib/types';

export const JOURNEY_ORDER = [
  'Vietnam',
  'USA',
  'England',
  'France',
  'Soviet Union',
  'China',
] as const;

/** Tên hiển thị tiếng Việt (khóa API vẫn dùng tiếng Anh) */
export const COUNTRY_LABELS_VI: Record<string, string> = {
  Vietnam: 'Việt Nam',
  USA: 'Hoa Kỳ',
  England: 'Anh',
  France: 'Pháp',
  'Soviet Union': 'Liên Xô',
  China: 'Trung Quốc',
};

export function countryLabelVi(country: string): string {
  return COUNTRY_LABELS_VI[country] ?? country;
}

export type EnrichedJourneyLocation = JourneyLocation & {
  order: number;
  yearLabel: string;
  keyEvents: string[];
  historicalContext: string;
  impactOnJourney: string;
  flagCode: string;
  defaultImage: string;
};

const ENRICHMENT: Record<
  string,
  Omit<EnrichedJourneyLocation, keyof JourneyLocation | 'order'>
> = {
  Vietnam: {
    yearLabel: '1890 – 1911',
    flagCode: 'vn',
    keyEvents: [
      'Sinh tại tỉnh Nghệ An',
      'Giáo dục yêu nước từ nhỏ',
      'Rời Sài Gòn — tháng 6/1911',
    ],
    historicalContext:
      'Nguyễn Tất Thành rời Việt Nam trên tàu Amiral Latouche-Tréville, bắt đầu hành trình ba mươi năm tìm con đường cứu nước.',
    impactOnJourney: 'Điểm khởi hành — nơi tình yêu Tổ quốc trở thành sứ mệnh suốt đời qua nhiều châu lục.',
    defaultImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  },
  USA: {
    yearLabel: '1912 – 1913',
    flagCode: 'us',
    keyEvents: [
      'Làm việc tại Harlem, New York',
      'Quan sát cuộc đấu tranh của người Mỹ gốc Phi',
      'Củng cố quyết tâm chống thực dân',
    ],
    historicalContext:
      'Tại Hoa Kỳ, Người chứng kiến bất công và áp bức, làm sâu sắc thêm cam kết giải phóng dân tộc.',
    impactOnJourney: 'Mở rộng hiểu biết về đấu tranh chống phân biệt chủng tộc và phạm vi toàn cầu của giải phóng.',
    defaultImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
  },
  England: {
    yearLabel: '1913 – 1917',
    flagCode: 'gb',
    keyEvents: [
      'Làm thợ bánh tại Luân Đôn',
      'Nghiên cứu chính trị phương Tây',
      'Tham gia các tổ chức chính trị',
    ],
    historicalContext:
      'Luân Đôn giúp Người tiếp cận phong trào công nhân và chính trị thuộc địa, hình thành nhận thức về cơ chế đế quốc.',
    impactOnJourney: 'Làm rõ bộ máy đế quốc và sức mạnh của phong trào công nhân có tổ chức.',
    defaultImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  },
  France: {
    yearLabel: '1917 – 1923',
    flagCode: 'fr',
    keyEvents: [
      'Bản yêu sách Versailles — 1919',
      'Gia nhập Đảng Cộng sản Pháp — 1920',
      'Tổ chức người Việt ở nước ngoài',
    ],
    historicalContext:
      'Với tên gọi Nguyễn Ái Quốc tại Paris, Người đòi độc lập cho Việt Nam và tìm thấy con đường Mác-Lênin.',
    impactOnJourney: 'Bước ngoặt tư tưởng — từ người yêu nước thành nhà lãnh đạo cách mạng.',
    defaultImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
  },
  'Soviet Union': {
    yearLabel: '1923 – 1924',
    flagCode: 'ru',
    keyEvents: [
      'Học tại Đại học Cộng sản',
      'Củng cố lý luận Mác-Lênin',
      'Chuẩn bị cán bộ cách mạng',
    ],
    historicalContext:
      'Moscow cung cấp đào tạo chính trị nghiêm túc và kết nối với phong trào cộng sản quốc tế.',
    impactOnJourney: 'Rèn nền tảng lý luận cho chiến lược cách mạng Việt Nam.',
    defaultImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
  },
  China: {
    yearLabel: '1924 – 1930',
    flagCode: 'cn',
    keyEvents: [
      'Thành lập Hội Việt Nam Cách mạng Thanh niên — 1925',
      'Đào tạo cán bộ tại Quảng Châu',
      'Thành lập Đảng Cộng sản Việt Nam — 1930',
    ],
    historicalContext:
      'Trung Quốc trở thành căn cứ chiến lược tổ chức cách mạng — đỉnh cao là thành lập Đảng Cộng sản Việt Nam.',
    impactOnJourney: 'Điểm đến — biến tầm nhìn thành lực lượng cách mạng có tổ chức.',
    defaultImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  },
};

export function enrichLocations(locations: JourneyLocation[]): EnrichedJourneyLocation[] {
  const byCountry = new Map(locations.map((l) => [l.country, l]));

  return JOURNEY_ORDER.map((country, order) => {
    const raw = byCountry.get(country) ?? {
      id: order + 1,
      country,
      latitude: 0,
      longitude: 0,
      description: '',
      period: ENRICHMENT[country]?.yearLabel,
    };
    const base = {
      ...raw,
      latitude: typeof raw.latitude === 'string' ? parseFloat(raw.latitude) : Number(raw.latitude),
      longitude: typeof raw.longitude === 'string' ? parseFloat(raw.longitude) : Number(raw.longitude),
    };
    const meta = ENRICHMENT[country];
    return {
      ...base,
      order,
      yearLabel: meta.yearLabel,
      keyEvents: meta.keyEvents,
      historicalContext: meta.historicalContext,
      impactOnJourney: meta.impactOnJourney,
      flagCode: meta.flagCode,
      defaultImage: base.image_url ?? meta.defaultImage,
      description: base.description || meta.historicalContext,
      period: base.period ?? meta.yearLabel,
    };
  });
}

export const JOURNEY_STATS = {
  countries: 6,
  durationYears: 19,
  distanceKm: 85000,
  events: 12,
  legacyScore: 100,
};
