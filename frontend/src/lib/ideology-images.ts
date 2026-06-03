/**
 * Ảnh minh họa trang Tư tưởng — giai đoạn 1911–1930.
 * Lưu tại /public/images/ideology (Wikimedia Commons, không phụ thuộc CDN VnExpress).
 */
const local = (file: string) => `/images/ideology/${file}`;

export const IDEOLOGY_ARTICLE_IMAGES: Record<string, string> = {
  /** Nguyễn Ái Quốc tại Pháp — con đường Mác-Lênin */
  'why-socialism': local('why-socialism.jpg'),
  /** Hội nghị Versailles 1919 — bối cảnh bản yêu sách */
  'national-independence-socialism': local('national-independence-socialism.jpg'),
  /** Bến Nhà Rồng — xuất phát vì yêu nước, 1911 */
  'role-of-patriotism': local('role-of-patriotism.jpg'),
  /** Cảng Hồng Kông — giai đoạn thành lập Đảng (1930) */
  'preparation-cpv': local('preparation-cpv.jpg'),
};

export const IDEOLOGY_CATEGORY_IMAGES: Record<string, string> = {
  Socialism: IDEOLOGY_ARTICLE_IMAGES['why-socialism'],
  Patriotism: IDEOLOGY_ARTICLE_IMAGES['role-of-patriotism'],
  'National Independence': IDEOLOGY_ARTICLE_IMAGES['national-independence-socialism'],
  'Party Building': IDEOLOGY_ARTICLE_IMAGES['preparation-cpv'],
  Ethics: IDEOLOGY_ARTICLE_IMAGES['why-socialism'],
  Culture: local('culture.jpg'),
  Education: local('culture.jpg'),
};

/** Tàu thời kỳ — khởi đầu hành trình 1911 */
export const IDEOLOGY_HERO_PORTRAIT = local('hero-portrait.jpg');

export function getIdeologyArticleImage(slug: string, category?: string, fallbackUrl?: string): string {
  if (fallbackUrl?.startsWith('/images/')) return fallbackUrl;
  return (
    IDEOLOGY_ARTICLE_IMAGES[slug] ??
    (category ? IDEOLOGY_CATEGORY_IMAGES[category] : undefined) ??
    (fallbackUrl && !fallbackUrl.includes('vnexpress') && !fallbackUrl.includes('1cdn.vn')
      ? fallbackUrl
      : undefined) ??
    IDEOLOGY_ARTICLE_IMAGES['why-socialism']
  );
}
