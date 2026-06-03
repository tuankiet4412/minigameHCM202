'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'p' | 'span';
}

export function TextReveal({ text, className, delay = 0, as: Tag = 'h1' }: TextRevealProps) {
  const words = text.split(' ');

  return (
    <Tag className={cn('overflow-hidden', className)}>
      {words.map((word, i) => (
        <span key={i} className="word inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function SplitChars({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn('inline-flex flex-wrap', className)} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="char inline-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.02, duration: 0.4 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}
