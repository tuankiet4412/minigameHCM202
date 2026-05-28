'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Bookmark } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Article } from '@/lib/types';
import Loading from '@/components/ui/Loading';
import toast from 'react-hot-toast';

const fallbackArticles: Article[] = [
  { id: 1, slug: 'why-socialism', title: 'Why Ho Chi Minh Chose Socialism', summary: 'Understanding the ideological journey to Marxism-Leninism.', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800' },
  { id: 2, slug: 'national-independence-socialism', title: 'National Independence and Socialism', summary: 'Unifying national liberation with social revolution.', image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800' },
  { id: 3, slug: 'role-of-patriotism', title: 'The Role of Patriotism', summary: 'Patriotism as the foundation of revolutionary commitment.', image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800' },
  { id: 4, slug: 'preparation-cpv', title: 'Preparation for the Communist Party of Vietnam', summary: 'Organizational work from 1925 to 1930.', image_url: 'https://images.unsplash.com/photo-1518005020951-eccb994ad75d?w=800' },
];

export default function IdeologyPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const params = search ? `search=${encodeURIComponent(search)}` : '';
    api.articles.list(params)
      .then((data) => setArticles(data as Article[]))
      .catch(() => setArticles(fallbackArticles))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    if (isAuthenticated) {
      api.articles.bookmarkStatus()
        .then((ids) => setBookmarks(ids as number[]))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const toggleBookmark = async (id: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark articles');
      return;
    }
    try {
      const res = await api.articles.toggleBookmark(id) as { bookmarked: boolean };
      setBookmarks((prev) =>
        res.bookmarked ? [...prev, id] : prev.filter((b) => b !== id)
      );
      toast.success(res.bookmarked ? 'Article bookmarked' : 'Bookmark removed');
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  if (loading && !search) return <Loading />;

  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="section-title text-center">Ideology & Education</h1>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Explore Ho Chi Minh&apos;s revolutionary thought and historical context
        </p>

        <div className="relative mx-auto mt-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-heritage-gold/30 bg-white py-3 pl-10 pr-4 dark:bg-heritage-charcoal dark:border-heritage-gold/20"
            aria-label="Search articles"
          />
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {articles.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="museum-card overflow-hidden"
            >
              {article.image_url && (
                <div className="relative h-48 w-full">
                  <Image src={article.image_url} alt={article.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h2 className="font-display text-xl font-semibold">
                    <Link href={`/ideology/${article.slug}`} className="hover:text-heritage-red dark:hover:text-heritage-gold">
                      {article.title}
                    </Link>
                  </h2>
                  <button
                    onClick={() => toggleBookmark(article.id)}
                    className={`p-1 ${bookmarks.includes(article.id) ? 'text-heritage-gold' : 'text-gray-400'}`}
                    aria-label="Bookmark article"
                  >
                    <Bookmark className={`h-5 w-5 ${bookmarks.includes(article.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{article.summary}</p>
                <Link href={`/ideology/${article.slug}`} className="mt-4 inline-block text-sm font-medium text-heritage-red dark:text-heritage-gold">
                  Read more →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
