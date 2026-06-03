import type { GalleryImage } from '@/lib/types';

/** Bộ sưu tập bảo tàng — dùng trực tiếp trên frontend (local & Vercel), không phụ thuộc API. */
export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 1,
    title: 'Bến cảng Nhà Rồng đầu thế kỷ 20 (nay là số 1 đường Nguyễn Tất Thành, TP HCM)',
    description: 'Nơi Nguyễn Tất Thành (tên gọi Văn Ba) ra đi tìm đường cứu nước',
    image_url: '/images/ideology/role-of-patriotism.jpg',
    year: 1911,
    category: 'photograph',
  },
  {
    id: 2,
    title: 'Tàu Đô đốc Latouche-Tréville',
    description: 'Con tàu đã đưa thanh niên Nguyễn Tất Thành rời Tổ quốc, bắt đầu hành trình tìm đường cứu nước.',
    image_url: '/images/ideology/hero-portrait.jpg',
    year: 1911,
    category: 'photograph',
  },
  {
    id: 3,
    title: 'Cảng Vieux-Port, Marseille đầu thế kỷ 20',
    description: 'Nơi thanh niên Nguyễn Tất Thành lần đầu đặt chân đến nước Pháp',
    image_url: '/images/ideology/culture.jpg',
    year: 1911,
    category: 'photograph',
  },
  {
    id: 4,
    title: 'Trong những năm bôn ba, người thanh niên yêu nước trải qua nhiều công việc như phụ bếp tại khách sạn Carlton ở London, Anh trong bốn năm',
    description: 'Nguyễn Tất Thành vừa mưu sinh vừa học tập, chuẩn bị hành trang tư tưởng tìm đường đến độc lập, tự do cho dân tộc.',
    image_url: '/images/ideology/why-socialism.jpg',
    year: 1914,
    category: 'photograph',
  },
  {
    id: 5,
    title: 'Bản yêu sách 8 điểm đòi tự do dân chủ và quyền tự quyết cho người dân An Nam, ký tên Nguyễn Ái Quốc được gửi đến Hội nghị Versailles (Pháp)',
    description: 'Mở đầu tiếng nói chính trị của người Việt tại diễn đàn quốc tế; Người tích cực viết báo, tham gia phong trào cộng sản quốc tế.',
    image_url: '/images/ideology/national-independence-socialism.jpg',
    year: 1919,
    category: 'photograph',
  },
  {
    id: 6,
    title: 'Hồ sơ mật vụ Anh và ảnh Nguyễn Ái Quốc với bí danh Tống Văn Sơ bị bắt tại Hong Kong',
    description: 'Năm 1931 theo yêu cầu mật thám Pháp; sau khi được trả tự do vẫn bị giam tại nhà tù Victoria đến cuối 1932.',
    image_url: '/images/ideology/preparation-cpv.jpg',
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
    title: 'Chiếc đèn điện để bàn tại Phủ Chủ tịch',
    description: 'Chiếc đèn điện để bàn Bác sử dụng trong thời gian ở và làm việc tại Phủ Chủ tịch.',
    image_url: 'https://hnm.1cdn.vn/2020/05/07/hanoimoi.com.vn-uploads-album-20200507-_0ec8baee-162f-46d2-85f0-47283ff5037b.jpg',
    year: 0,
    category: 'artifact',
  },
  {
    id: 14,
    title: 'Chiến thuật chiến lược quân sự Hồ Chí Minh',
    description:
      'Tác phẩm do Đỗ Hoàng Linh và Nguyễn Văn Dương sưu tầm, biên soạn, tập hợp các bài viết của Chủ tịch Hồ Chí Minh về quân sự.',
    image_url: '/images/ideology/national-independence-socialism.jpg',
    year: 2020,
    category: 'document',
  },
  {
    id: 15,
    title: 'Bác Hồ gọi ấy là mùa xuân đến',
    description:
      'Cuốn sách giới thiệu tư tưởng và hoạt động của Chủ tịch Hồ Chí Minh trong mỗi dịp đón xuân, chúc Tết.',
    image_url: '/images/ideology/culture.jpg',
    year: 2018,
    category: 'document',
  },
];

export const GALLERY_CATEGORY_VI: Record<string, string> = {
  artifact: 'Hiện vật',
  photograph: 'Ảnh',
  document: 'Tài liệu',
  video: 'Video',
  '3d': 'Triển lãm 3D',
};

export function galleryCategoryVi(category?: string): string {
  const key = (category || 'photograph').toLowerCase();
  return GALLERY_CATEGORY_VI[key] || key;
}
