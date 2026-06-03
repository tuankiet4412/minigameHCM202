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
  { year: 1911, label: 'Departure from Vietnam' },
  { year: 1919, label: 'Versailles Petition' },
  { year: 1920, label: 'Path to Marxism-Leninism' },
  { year: 1930, label: 'Founding of CPV' },
];

export const stats = [
  { value: 6, suffix: '+', label: 'Countries Visited' },
  { value: 19, suffix: '', label: 'Years of Journey' },
  { value: 30, suffix: '+', label: 'Quiz Questions' },
  { value: 8, suffix: '', label: 'Gallery Artifacts' },
];
