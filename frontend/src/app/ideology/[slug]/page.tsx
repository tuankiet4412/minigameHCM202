'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import type { Article } from '@/lib/types';
import Loading from '@/components/ui/Loading';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      api.articles.get(slug as string)
        .then((data) => setArticle(data as Article))
        .catch(() => setArticle(null))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <Loading />;
  if (!article) return <div className="py-20 text-center">Article not found</div>;

  const keyPoints = Array.isArray(article.key_points)
    ? article.key_points
    : typeof article.key_points === 'string'
    ? JSON.parse(article.key_points as string)
    : [];

  return (
    <article className="py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <Link href="/ideology" className="inline-flex items-center text-sm text-heritage-red dark:text-heritage-gold hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Ideology
        </Link>

        <h1 className="mt-6 font-display text-4xl font-bold text-heritage-red dark:text-heritage-gold">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{article.summary}</p>

        {article.image_url && (
          <div className="relative mt-8 h-64 w-full rounded-lg overflow-hidden">
            <Image src={article.image_url} alt={article.title} fill className="object-cover" />
          </div>
        )}

        {article.historical_context && (
          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold">Historical Context</h2>
            <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">{article.historical_context}</p>
          </section>
        )}

        {keyPoints.length > 0 && (
          <section className="mt-10 museum-card p-6">
            <h2 className="font-display text-2xl font-semibold">Key Points</h2>
            <ul className="mt-4 space-y-2">
              {keyPoints.map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-heritage-red" />
                  <span className="text-gray-700 dark:text-gray-300">{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {article.content && (
          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold">Full Article</h2>
            <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">{article.content}</p>
          </section>
        )}
      </div>
    </article>
  );
}
