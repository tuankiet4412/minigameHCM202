'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/Providers';

const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), { ssr: false });

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </Providers>
  );
}
