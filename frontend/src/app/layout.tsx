import type { Metadata } from 'next';
import { Playfair_Display, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import ClientShell from '@/components/layout/ClientShell';

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-source',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Hành trình Hồ Chí Minh (1911–1930) | Cứu nước',
    template: '%s | Hành trình Hồ Chí Minh',
  },
  description:
    'Khám phá hành trình tìm đường cứu nước của Chủ tịch Hồ Chí Minh từ 1911 đến 1930. Dòng thời gian tương tác, bản đồ 3D, bảo tàng số và câu đố.',
  keywords: ['Hồ Chí Minh', 'lịch sử Việt Nam', 'cứu nước', '1911-1930', 'giáo dục', 'bảo tàng số'],
  openGraph: {
    title: 'Hành trình Hồ Chí Minh (1911–1930)',
    description: 'Trải nghiệm bảo tàng số đẳng cấp',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${sourceSans.variable} font-body antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
