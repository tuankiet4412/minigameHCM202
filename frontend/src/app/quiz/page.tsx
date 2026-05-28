'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Clock, Trophy, Play } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { QuizQuestion, QuizResult } from '@/lib/types';
import Loading from '@/components/ui/Loading';
import toast from 'react-hot-toast';

const QUIZ_TIME = 300; // 5 minutes

export default function QuizPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [phase, setPhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.quiz.leaderboard()
      .then((data) => setLeaderboard(data as QuizResult[]))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (phase !== 'playing' || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  useEffect(() => {
    if (phase === 'playing' && timeLeft <= 0) {
      finishQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  const startQuiz = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to take the quiz');
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const qs = await api.quiz.questions(10) as QuizQuestion[];
      setQuestions(qs);
      setCurrent(0);
      setAnswers({});
      setTimeLeft(QUIZ_TIME);
      setPhase('playing');
    } catch {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questions[current].id]: answerIndex }));
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = useCallback(async () => {
    const answerList = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
      questionId: parseInt(questionId),
      selectedAnswer,
    }));

    const timeTaken = QUIZ_TIME - timeLeft;

    try {
      const result = await api.quiz.submit({
        answers: answerList,
        time_taken: timeTaken,
      }) as { score: number; total: number; percentage: number };
      setScore(result.percentage);
      setPhase('results');
      api.quiz.leaderboard().then((data) => setLeaderboard(data as QuizResult[]));
    } catch {
      toast.error('Failed to submit quiz');
      setPhase('intro');
    }
  }, [answers, timeLeft]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (loading) return <Loading />;

  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="section-title text-center">Knowledge Quiz</h1>

        {phase === 'intro' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Test your knowledge about Ho Chi Minh&apos;s ideology and journey.
              10 random questions, 5-minute timer.
            </p>
            <button onClick={startQuiz} className="heritage-btn mt-8 inline-flex items-center gap-2">
              <Play className="h-5 w-5" /> Start Quiz
            </button>

            {leaderboard.length > 0 && (
              <div className="museum-card mt-12 p-6 text-left">
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                  <Trophy className="h-6 w-6 text-heritage-gold" /> Leaderboard
                </h2>
                <ul className="mt-4 space-y-2">
                  {leaderboard.slice(0, 5).map((entry, i) => (
                    <li key={i} className="flex justify-between text-sm border-b border-gray-100 dark:border-gray-800 py-2">
                      <span>{(entry as { display_name?: string; username?: string }).display_name || (entry as { username?: string }).username}</span>
                      <span className="font-bold text-heritage-red dark:text-heritage-gold">{entry.percentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {phase === 'playing' && questions[current] && (
          <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium">Question {current + 1} / {questions.length}</span>
              <span className="flex items-center gap-1 text-heritage-red font-bold">
                <Clock className="h-4 w-4" /> {formatTime(timeLeft)}
              </span>
            </div>
            <div className="museum-card p-6">
              <h2 className="text-lg font-semibold">{questions[current].question}</h2>
              <div className="mt-6 space-y-3">
                {questions[current].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    className="w-full rounded-lg border border-heritage-gold/30 p-4 text-left transition-colors hover:bg-heritage-red/10 hover:border-heritage-red dark:hover:bg-heritage-gold/10"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'results' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-10 text-center museum-card p-8">
            <h2 className="font-display text-3xl font-bold text-heritage-red dark:text-heritage-gold">Quiz Complete!</h2>
            <p className="mt-4 text-6xl font-bold">{score}%</p>
            <button onClick={() => setPhase('intro')} className="heritage-btn mt-8">Try Again</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
