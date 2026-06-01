'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/journey', label: 'Journey Map' },
  { href: '/ideology', label: 'Ideology' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/minigame', label: 'Mini Game' },
  { href: '/tank-game', label: '🪖 30/4' },
  { href: '/caro', label: 'Caro' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-heritage-gold/20 bg-white/90 backdrop-blur-md dark:bg-heritage-charcoal/90" role="navigation" aria-label="Main navigation">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-xl font-bold text-heritage-red dark:text-heritage-gold">
          Hồ Chí Minh Journey
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-heritage-red dark:hover:text-heritage-gold ${
                pathname === link.href ? 'text-heritage-red dark:text-heritage-gold' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full p-2 hover:bg-heritage-gold/10"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {isAuthenticated ? (
            <Link href="/profile" className="flex items-center gap-2 rounded-full bg-heritage-red/10 px-3 py-1.5 text-sm font-medium text-heritage-red dark:text-heritage-gold">
              <User className="h-4 w-4" />
              {user?.display_name || user?.username}
            </Link>
          ) : (
            <Link href="/login" className="heritage-btn text-sm py-2 px-4">Login</Link>
          )}

          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-heritage-gold/20 md:hidden"
          >
            <div className="flex flex-col gap-2 px-4 py-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  className="py-2 text-sm font-medium hover:text-heritage-red">
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
