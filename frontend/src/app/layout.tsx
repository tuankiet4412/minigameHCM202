import type { Metadata } from 'next';
import { Playfair_Display, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/Providers';

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
    default: 'Ho Chi Minh Journey (1911–1930) | National Salvation',
    template: '%s | Ho Chi Minh Journey',
  },
  description: 'Explore President Ho Chi Minh\'s journey to find the path for national salvation from 1911 to 1930. Interactive timeline, world map, ideology articles, and quiz.',
  keywords: ['Ho Chi Minh', 'Vietnam history', 'national salvation', '1911-1930', 'education'],
  openGraph: {
    title: 'Ho Chi Minh Journey (1911–1930)',
    description: 'Educational website about Ho Chi Minh\'s path to national salvation',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${sourceSans.variable} antialiased`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
