'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
  delay?: number;
}

export function ScrollReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const from: gsap.TweenVars = { opacity: 0, duration: 1, delay, ease: 'power3.out' };
    if (direction === 'up') from.y = 60;
    if (direction === 'left') from.x = -60;
    if (direction === 'right') from.x = 60;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        ...from,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  }, [direction, delay]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
