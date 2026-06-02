'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LuxuryPanelProps extends HTMLMotionProps<'aside'> {
  label: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function LuxuryPanel({ label, title, children, className, ...props }: LuxuryPanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'luxury-panel flex h-full flex-col overflow-hidden rounded-[24px]',
        'border border-[#D4AF37]/20 bg-[#0A0A0A]/75 shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(212,175,55,0.08)]',
        'backdrop-blur-xl',
        className
      )}
      {...props}
    >
      <div className="relative border-b border-[#D4AF37]/15 px-6 py-5">
        <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">{label}</p>
        <h2 className="mt-1.5 font-display text-xl font-semibold text-white">{title}</h2>
      </div>
      {children}
    </motion.aside>
  );
}

export function LuxuryDivider() {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
      <span className="text-[#FFD700]/60">◆</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
    </div>
  );
}
