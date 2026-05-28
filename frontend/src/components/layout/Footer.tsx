import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-heritage-gold/20 bg-heritage-charcoal text-gray-300" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-lg font-bold text-heritage-gold">Hồ Chí Minh Journey</h3>
            <p className="mt-2 text-sm text-gray-400">
              An educational exploration of President Ho Chi Minh&apos;s quest for national salvation (1911–1930).
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Explore</h4>
            <ul className="mt-2 space-y-1 text-sm">
              {[
                { label: 'Timeline', href: '/timeline' },
                { label: 'Journey Map', href: '/journey' },
                { label: 'Ideology', href: '/ideology' },
                { label: 'Quiz', href: '/quiz' },
                { label: 'Gallery', href: '/gallery' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-heritage-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Historical Period</h4>
            <p className="mt-2 text-sm text-gray-400">1890 – 1930</p>
            <p className="mt-1 text-sm italic text-heritage-gold/80">
              &ldquo;Nothing is more precious than independence and freedom.&rdquo;
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Ho Chi Minh Educational Project. For educational purposes.
        </div>
      </div>
    </footer>
  );
}
