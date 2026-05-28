'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        {children}
        <Toaster position="top-right" toastOptions={{
          className: 'dark:bg-heritage-charcoal dark:text-white',
        }} />
      </AuthProvider>
    </ThemeProvider>
  );
}
