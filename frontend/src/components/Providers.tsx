'use client';

import dynamic from 'next/dynamic';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/context/AuthContext';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Preloader from '@/components/ui/Preloader';

const Toaster = dynamic(() => import('react-hot-toast').then((m) => m.Toaster), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <SmoothScrollProvider>
          <Preloader />
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'glass-card !bg-heritage-charcoal/95 !text-white !border-heritage-gold/20',
            }}
          />
        </SmoothScrollProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
