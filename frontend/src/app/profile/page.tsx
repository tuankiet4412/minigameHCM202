'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bookmark, LogOut, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import type { Article, QuizResult } from '@/lib/types';
import Loading from '@/components/ui/Loading';

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([
        api.articles.bookmarks().catch(() => []),
        api.quiz.history().catch(() => []),
      ]).then(([bm, hist]) => {
        setBookmarks(bm as Article[]);
        setQuizHistory(hist as QuizResult[]);
      }).finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  if (authLoading || loading) return <Loading />;
  if (!user) return null;

  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="museum-card p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-heritage-red dark:text-heritage-gold">
                {user.display_name || user.username}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
            <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-heritage-red">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
            <Trophy className="h-6 w-6 text-heritage-gold" /> Quiz History
          </h2>
          {quizHistory.length === 0 ? (
            <p className="mt-4 text-gray-500">No quiz attempts yet. <Link href="/quiz" className="text-heritage-red underline">Take a quiz</Link></p>
          ) : (
            <ul className="mt-4 space-y-2">
              {quizHistory.map((r, i) => (
                <li key={i} className="museum-card flex justify-between p-4">
                  <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  <span className="font-bold text-heritage-red dark:text-heritage-gold">{r.percentage ?? Math.round((r.score / r.total_questions) * 100)}%</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
            <Bookmark className="h-6 w-6 text-heritage-gold" /> Bookmarked Articles
          </h2>
          {bookmarks.length === 0 ? (
            <p className="mt-4 text-gray-500">No bookmarks yet. <Link href="/ideology" className="text-heritage-red underline">Browse articles</Link></p>
          ) : (
            <ul className="mt-4 space-y-2">
              {bookmarks.map((a) => (
                <li key={a.id}>
                  <Link href={`/ideology/${a.slug}`} className="museum-card block p-4 hover:border-heritage-red">
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
