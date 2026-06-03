'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LayoutDashboard, ChevronDown, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/timeline', label: 'Dòng thời gian' },
  { href: '/journey', label: 'Hành trình' },
  { href: '/gallery', label: 'Bảo tàng' },
  { href: '/ideology', label: 'Tư tưởng' },
  { href: '/quiz', label: 'Câu đố' },
];

const gameLinks = [
  { href: '/minigame', label: 'Mini Game' },
  { href: '/tank-game', label: 'Xe tăng 30/4' },
  { href: '/caro', label: 'Cờ caro' },
];

function NavLink({
  href,
  label,
  pathname,
  onNavigate,
}: {
  href: string;
  label: string;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
        active ? 'text-heritage-gold' : 'text-gray-300 hover:text-white'
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 -z-10 rounded-full bg-heritage-gold/10"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const closeMenu = () => setOpen(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    closeMenu();
    setGamesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMenu();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <motion.nav
        initial={mounted ? { y: -100 } : false}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled || open
            ? 'border-b border-white/5 bg-heritage-charcoal/80 py-3 shadow-glass backdrop-blur-xl'
            : 'bg-transparent py-5'
        )}
        role="navigation"
        aria-label="Điều hướng chính"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight text-white md:text-xl"
          >
            <span className="text-heritage-gold">Hồ</span> Chí Minh
            <span className="ml-1.5 text-xs font-normal text-gray-400">Hành trình</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} pathname={pathname} />
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => setGamesOpen((v) => !v)}
                className={cn(
                  'flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  gameLinks.some((g) => g.href === pathname)
                    ? 'text-heritage-gold'
                    : 'text-gray-300 hover:text-white'
                )}
                aria-expanded={gamesOpen}
                aria-haspopup="true"
              >
                <Gamepad2 className="h-4 w-4" />
                Trò chơi
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', gamesOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {gamesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 min-w-[180px] overflow-hidden rounded-xl border border-white/10 bg-heritage-charcoal/95 py-2 shadow-glass backdrop-blur-xl"
                  >
                    {gameLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setGamesOpen(false)}
                        className={cn(
                          'block px-4 py-2.5 text-sm transition-colors hover:bg-white/5',
                          pathname === link.href ? 'text-heritage-gold' : 'text-gray-300'
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Link
              href="/admin"
              className="hidden rounded-full p-2.5 text-gray-300 transition-colors hover:bg-white/10 hover:text-heritage-gold lg:block"
              aria-label="Bảng quản trị"
            >
              <LayoutDashboard className="h-4 w-4" />
            </Link>

            {!mounted ? (
              <span className="hidden h-9 w-24 lg:inline-block" aria-hidden />
            ) : isAuthenticated ? (
              <Link
                href="/profile"
                className="hidden items-center gap-2 rounded-full border border-heritage-gold/30 bg-heritage-gold/10 px-4 py-2 text-sm font-medium text-heritage-gold lg:flex"
              >
                <User className="h-4 w-4" />
                {user?.display_name || user?.username}
              </Link>
            ) : (
              <Link href="/login" className="heritage-btn hidden !py-2 !px-5 text-xs lg:inline-flex">
                Đăng nhập
              </Link>
            )}

            {/* Hamburger — chỉ mobile/tablet (< lg) */}
            <button
              type="button"
              className="rounded-full p-2.5 text-white lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay — không phải trang khác */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={closeMenu}
              aria-label="Đóng menu"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed right-0 top-0 z-50 flex h-full w-[min(100%,320px)] flex-col border-l border-white/10 bg-heritage-charcoal/98 backdrop-blur-xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-5">
                <span className="font-display text-lg font-bold text-white">
                  <span className="text-heritage-gold">Menu</span>
                </span>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                  aria-label="Đóng"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4">
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Khám phá
                </p>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={cn(
                      'mb-1 block rounded-xl px-4 py-3 text-base font-medium',
                      pathname === link.href
                        ? 'bg-heritage-gold/15 text-heritage-gold'
                        : 'text-gray-200 hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Trò chơi
                </p>
                {gameLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={cn(
                      'mb-1 block rounded-xl px-4 py-3 text-base font-medium',
                      pathname === link.href
                        ? 'bg-heritage-gold/15 text-heritage-gold'
                        : 'text-gray-200 hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-white/5 p-4">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="heritage-btn flex w-full justify-center"
                >
                  Đăng nhập
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
