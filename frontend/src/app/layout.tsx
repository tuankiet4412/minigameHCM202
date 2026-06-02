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
    default: "Ho Chi Minh's Journey (1911–1930) | National Salvation",
    template: '%s | Ho Chi Minh Journey',
  },
  description:
    "Explore President Ho Chi Minh's journey to find the path for national salvation from 1911 to 1930. Interactive timeline, 3D world map, digital museum, and quiz.",
  keywords: ['Ho Chi Minh', 'Vietnam history', 'national salvation', '1911-1930', 'education', 'digital museum'],
  openGraph: {
    title: "Ho Chi Minh's Journey (1911–1930)",
    description: 'An immersive digital museum experience',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${sourceSans.variable} font-body antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
