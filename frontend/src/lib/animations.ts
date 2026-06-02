import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export function fadeInUp(
  element: gsap.TweenTarget,
  options?: { delay?: number; duration?: number; y?: number }
) {
  return gsap.from(element, {
    y: options?.y ?? 60,
    opacity: 0,
    duration: options?.duration ?? 1,
    delay: options?.delay ?? 0,
    ease: 'power3.out',
  });
}

export function staggerReveal(
  elements: gsap.TweenTarget,
  trigger?: gsap.DOMTarget,
  options?: { stagger?: number; y?: number }
) {
  return gsap.from(elements, {
    y: options?.y ?? 40,
    opacity: 0,
    duration: 0.8,
    stagger: options?.stagger ?? 0.1,
    ease: 'power3.out',
    scrollTrigger: trigger
      ? { trigger, start: 'top 85%' }
      : undefined,
  });
}

export function parallaxScroll(
  element: gsap.DOMTarget,
  speed: number = 0.5
) {
  return gsap.to(element, {
    yPercent: -50 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

export function splitTextReveal(container: HTMLElement) {
  const chars = container.querySelectorAll('.char');
  return gsap.from(chars, {
    opacity: 0,
    y: 20,
    rotateX: -40,
    stagger: 0.02,
    duration: 0.6,
    ease: 'power3.out',
  });
}

export function pinSection(
  trigger: gsap.DOMTarget,
  end: string = '+=200%'
) {
  return ScrollTrigger.create({
    trigger,
    start: 'top top',
    end,
    pin: true,
    pinSpacing: true,
  });
}
