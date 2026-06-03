import Link from 'next/link';

const exploreLinks = [
  { label: 'Timeline', href: '/timeline' },
  { label: 'Journey Map', href: '/journey' },
  { label: 'Digital Museum', href: '/gallery' },
  { label: 'Ideology', href: '/ideology' },
  { label: 'Quiz', href: '/quiz' },
  { label: 'Admin', href: '/admin' },
];

export default function Footer() {
  return (
    <footer
      className="relative border-t border-heritage-gold/10 bg-heritage-charcoal text-gray-300"
      role="contentinfo"
    >
      <div className="noise-overlay absolute inset-0 opacity-10" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="font-display text-xl font-bold">
              <span className="text-heritage-gold">Hồ</span> Chí Minh Journey
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              An immersive digital museum exploring President Ho Chi Minh&apos;s quest for
              national salvation (1911–1930).
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Explore</h4>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-400 transition-colors hover:text-heritage-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Historical Period
            </h4>
            <p className="mt-4 font-display text-3xl font-bold text-heritage-gold/40">1911 — 1930</p>
            <blockquote className="mt-4 border-l-2 border-heritage-gold/50 pl-4 text-sm italic text-gray-400">
              &ldquo;Nothing is more precious than independence and freedom.&rdquo;
            </blockquote>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Ho Chi Minh Educational Project</p>
          <p>For educational purposes</p>
        </div>
      </div>
    </footer>
  );
}
