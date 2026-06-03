/** Premium design tokens for the museum experience */
export const tokens = {
  colors: {
    heritage: {
      red: '#C41E3A',
      redDark: '#8B0000',
      gold: '#D4AF37',
      goldLight: '#F4E4BC',
      cream: '#FAF7F2',
      charcoal: '#0A0A0B',
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.08)',
      dark: 'rgba(0, 0, 0, 0.4)',
    },
  },
  spacing: {
    section: 'clamp(4rem, 10vw, 8rem)',
    container: '1280px',
  },
  motion: {
    spring: { type: 'spring' as const, stiffness: 100, damping: 20 },
    smooth: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    stagger: 0.08,
  },
  shadows: {
    glass: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    elevated: '0 24px 48px -12px rgba(196, 30, 58, 0.15)',
    glow: '0 0 60px rgba(212, 175, 55, 0.2)',
  },
} as const;

export const milestones = [
  { year: 1911, label: 'Rời Việt Nam' },
  { year: 1919, label: 'Bản yêu sách Versailles' },
  { year: 1920, label: 'Con đường Mác-Lênin' },
  { year: 1930, label: 'Thành lập Đảng Cộng sản' },
];

export const stats = [
  { value: 6, suffix: '+', label: 'Quốc gia đã đến' },
  { value: 19, suffix: '', label: 'Năm hành trình' },
  { value: 30, suffix: '+', label: 'Câu hỏi câu đố' },
  { value: 8, suffix: '', label: 'Hiện vật bảo tàng' },
];
