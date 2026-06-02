'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/animations';

export function useGSAPScroll<T extends HTMLElement>(
  setup: (ctx: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger; el: T }) => void | (() => void),
  deps: unknown[] = []
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cleanup = setup({ gsap, ScrollTrigger, el });
    return () => {
      cleanup?.();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el || el.contains(t.trigger as Node)) t.kill();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
