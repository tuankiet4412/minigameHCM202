# Premium UI Architecture

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) — upgrade path to 15 documented below |
| UI | React 18, Tailwind CSS 3, Radix UI primitives |
| Motion | Framer Motion 12, GSAP + ScrollTrigger, Lenis smooth scroll |
| 3D | Three.js, React Three Fiber, Drei |
| Icons | Lucide React |

## Folder Structure

```
src/
├── app/                    # Routes + global styles
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── template.tsx        # Page transition wrapper
│   ├── page.tsx            # Cinematic homepage
│   ├── timeline/           # Multi-mode timeline
│   ├── journey/            # 3D + 2D map
│   ├── gallery/            # Digital museum
│   └── admin/              # Analytics dashboard
├── components/
│   ├── animation/          # Reusable motion primitives
│   ├── home/               # Homepage sections
│   ├── layout/             # Navbar, Footer
│   ├── providers/          # Lenis smooth scroll
│   ├── three/              # R3F scenes
│   ├── timeline/           # Timeline view modes
│   └── ui/                 # Design system components
├── hooks/                  # useLenis, useMagnetic, useGSAPScroll
└── lib/
    ├── animations.ts       # GSAP utilities
    └── design-tokens.ts    # Tokens, stats, milestones
```

## Animation Architecture

1. **Framer Motion** — Component enter/exit, hover, layout animations
2. **GSAP ScrollTrigger** — Scroll-linked reveals, parallax, pinned sections
3. **Lenis** — Smooth scroll synced with ScrollTrigger
4. **R3F useFrame** — 3D globe rotation, particles, timeline nodes

## Design Tokens

- Heritage palette: red `#C41E3A`, gold `#D4AF37`, charcoal `#0A0A0B`
- Glass cards: `glass-card`, `museum-card` utility classes
- Typography: Playfair Display (display), Source Sans 3 (body)

## Performance

- Dynamic imports for all 3D (`ssr: false`)
- Code-split per route
- `next/image` for optimized images
- Preloader + skeleton states

## Upgrade to Next.js 15 / React 19

```bash
npm install next@15 react@19 react-dom@19 @react-three/fiber@9
```

Verify R3F and drei compatibility before deploying.
