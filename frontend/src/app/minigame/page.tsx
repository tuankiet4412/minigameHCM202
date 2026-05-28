'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Shield, Sword, Heart, Sparkles, Volume2, VolumeX } from 'lucide-react';

type BattleQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const PLAYER_MAX_HP = 5;
const TIGER_MAX_HP = 5;
const HERO_IMAGES = {
  idle: '/characters/hero-idle.png',
  attack: '/characters/hero-attack.png',
};
const TIGER_IMAGES = {
  idle: '/characters/tiger-idle.png',
  attack: '/characters/tiger-attack.png',
};

const questionBank: BattleQuestion[] = [
  {
    question: 'In which year did Nguyen Tat Thanh leave Vietnam to find a path for national salvation?',
    options: ['1905', '1911', '1919', '1930'],
    correctIndex: 1,
    explanation: 'He departed from Saigon in 1911 to begin his long journey abroad.',
  },
  {
    question: 'What pseudonym did he use at the Versailles Peace Conference in 1919?',
    options: ['Van Ba', 'Nguyen Sinh Cung', 'Nguyen Ai Quoc', 'Ho Chi Minh'],
    correctIndex: 2,
    explanation: 'He used the name Nguyen Ai Quoc, meaning "Nguyen the Patriot."',
  },
  {
    question: 'Which text strongly influenced his revolutionary path in 1920?',
    options: [
      'The Communist Manifesto',
      "Lenin's Thesis on National and Colonial Questions",
      'Das Kapital',
      'State and Revolution',
    ],
    correctIndex: 1,
    explanation: 'Lenin’s thesis helped connect national liberation with social liberation.',
  },
  {
    question: 'Where was the Revolutionary Youth League founded in 1925?',
    options: ['Paris', 'Moscow', 'Guangzhou', 'Saigon'],
    correctIndex: 2,
    explanation: 'It was founded in Guangzhou, where many cadres were trained.',
  },
  {
    question: 'In what year was the Communist Party of Vietnam founded?',
    options: ['1925', '1928', '1930', '1945'],
    correctIndex: 2,
    explanation: 'The party was founded in 1930 after communist organizations were unified.',
  },
  {
    question: 'Which place marks the beginning of his departure in 1911?',
    options: ['Hanoi', 'Hue', 'Saigon', 'Da Nang'],
    correctIndex: 2,
    explanation: 'He left from Saigon aboard a French ship in June 1911.',
  },
  {
    question: 'What was Ho Chi Minh’s birth name?',
    options: ['Nguyen Ai Quoc', 'Nguyen Sinh Cung', 'Nguyen Tat Thanh', 'Le Hong Phong'],
    correctIndex: 1,
    explanation: 'He was born as Nguyen Sinh Cung in 1890.',
  },
  {
    question: 'Which country did he study revolutionary theory in during 1923-1924?',
    options: ['France', 'England', 'Soviet Union', 'China'],
    correctIndex: 2,
    explanation: 'He studied in the Soviet Union, deepening Marxist-Leninist understanding.',
  },
  {
    question: 'At the 1919 conference, what did his petition mainly demand?',
    options: ['Higher trade tariffs', 'Vietnamese civil rights and independence', 'Military alliance', 'Religious freedom only'],
    correctIndex: 1,
    explanation: 'The petition demanded rights and independence for Vietnamese people.',
  },
  {
    question: 'In 1920, which party did he join after the Tours Congress split?',
    options: ['French Communist Party', 'French Socialist Party', 'Vietnamese Nationalist Party', 'Labour Party'],
    correctIndex: 0,
    explanation: 'He joined the French Communist Party in 1920.',
  },
  {
    question: 'Which city is linked to founding the Revolutionary Youth League?',
    options: ['Moscow', 'Paris', 'Guangzhou', 'Bangkok'],
    correctIndex: 2,
    explanation: 'Guangzhou was a key organizing center in 1925.',
  },
  {
    question: 'What period does this educational project primarily focus on?',
    options: ['1880-1900', '1911-1930', '1930-1954', '1954-1975'],
    correctIndex: 1,
    explanation: 'The site focuses on the 1911-1930 journey for national salvation.',
  },
  {
    question: 'Which of these was a key turning point in his ideological journey?',
    options: ['Meeting Napoleon', "Reading Lenin's thesis", 'Becoming a governor', 'Opening a school in Hue'],
    correctIndex: 1,
    explanation: 'Reading Lenin’s thesis in 1920 was a decisive turning point.',
  },
  {
    question: 'Where was the Communist Party of Vietnam founded in 1930?',
    options: ['Hanoi', 'Hong Kong', 'Guangzhou', 'Paris'],
    correctIndex: 1,
    explanation: 'The CPV was founded in Hong Kong through unification of communist groups.',
  },
];

type BattleResult = 'idle' | 'correct' | 'wrong' | 'win' | 'lose';
type AttackPhase = 'idle' | 'playerAttack' | 'tigerAttack';

function hpHearts(currentHp: number, maxHp: number) {
  return Array.from({ length: maxHp }, (_, i) => i < currentHp);
}

function hpPercent(currentHp: number, maxHp: number) {
  return (currentHp / maxHp) * 100;
}

export default function MiniGamePage() {
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [tigerHp, setTigerHp] = useState(TIGER_MAX_HP);
  const [usedIndexes, setUsedIndexes] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(
    () => Math.floor(Math.random() * questionBank.length)
  );
  const [result, setResult] = useState<BattleResult>('idle');
  const [attackPhase, setAttackPhase] = useState<AttackPhase>('idle');
  const [message, setMessage] = useState('Answer correctly to strike the tiger!');
  const [locked, setLocked] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const gameOver = result === 'win' || result === 'lose';

  const currentQuestion = useMemo(
    () => questionBank[currentQuestionIndex],
    [currentQuestionIndex]
  );

  const playSound = (type: 'attack' | 'hit' | 'win' | 'lose') => {
    if (!soundOn || typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'attack') osc.frequency.value = 320;
    if (type === 'hit') osc.frequency.value = 220;
    if (type === 'win') osc.frequency.value = 520;
    if (type === 'lose') osc.frequency.value = 160;

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
    setTimeout(() => ctx.close(), 220);
  };

  const pickNextQuestion = (nextUsedIndexes: number[]) => {
    const remaining = questionBank
      .map((_, idx) => idx)
      .filter((idx) => !nextUsedIndexes.includes(idx));

    const pool = remaining.length > 0 ? remaining : questionBank.map((_, idx) => idx);
    const randomIndex = pool[Math.floor(Math.random() * pool.length)];
    return randomIndex;
  };

  const handleAnswer = (selectedIndex: number) => {
    if (locked || gameOver) return;
    setLocked(true);

    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    const nextUsedIndexes = [...usedIndexes, currentQuestionIndex];
    setUsedIndexes(nextUsedIndexes);

    if (isCorrect) {
      setAttackPhase('playerAttack');
      playSound('attack');
      const newTigerHp = Math.max(0, tigerHp - 1);
      setTigerHp(newTigerHp);
      setResult(newTigerHp === 0 ? 'win' : 'correct');
      setMessage(
        newTigerHp === 0
          ? 'Victory! You defeated the tiger with historical knowledge.'
          : `Great hit! ${currentQuestion.explanation}`
      );
      playSound(newTigerHp === 0 ? 'win' : 'hit');
    } else {
      setAttackPhase('tigerAttack');
      playSound('attack');
      const newPlayerHp = Math.max(0, playerHp - 1);
      setPlayerHp(newPlayerHp);
      setResult(newPlayerHp === 0 ? 'lose' : 'wrong');
      setMessage(
        newPlayerHp === 0
          ? 'You were defeated. Study and challenge the tiger again!'
          : `Tiger strikes back! ${currentQuestion.explanation}`
      );
      playSound(newPlayerHp === 0 ? 'lose' : 'hit');
    }

    if (isCorrect ? tigerHp - 1 > 0 : playerHp - 1 > 0) {
      const nextQuestionIndex = pickNextQuestion(nextUsedIndexes);
      setTimeout(() => {
        setCurrentQuestionIndex(nextQuestionIndex);
        setResult('idle');
        setAttackPhase('idle');
        setLocked(false);
        setMessage('Answer correctly to strike the tiger!');
      }, 900);
    } else {
      setTimeout(() => setAttackPhase('idle'), 700);
      setLocked(false);
    }
  };

  const resetGame = () => {
    const firstIndex = Math.floor(Math.random() * questionBank.length);
    setPlayerHp(PLAYER_MAX_HP);
    setTigerHp(TIGER_MAX_HP);
    setUsedIndexes([]);
    setCurrentQuestionIndex(firstIndex);
    setResult('idle');
    setAttackPhase('idle');
    setLocked(false);
    setMessage('Answer correctly to strike the tiger!');
  };

  return (
    <div className="bg-gradient-to-b from-heritage-cream/60 via-white to-heritage-cream/30 py-12 px-4 dark:from-heritage-charcoal dark:via-heritage-charcoal dark:to-black">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="section-title">Tiger Battle Quiz</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Correct answer = your hero attacks. Wrong answer = tiger attacks.
          </p>
          <button
            onClick={() => setSoundOn((prev) => !prev)}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-heritage-gold/40 px-3 py-1 text-xs font-semibold hover:bg-heritage-gold/10"
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {soundOn ? 'Sound On' : 'Sound Off'}
          </button>
        </div>

        <div className="museum-card mt-10 overflow-hidden p-0">
          <div className="bg-heritage-red/90 px-6 py-3 text-sm font-semibold text-white dark:bg-heritage-gold/80 dark:text-heritage-charcoal">
            Round {usedIndexes.length + 1} • Knowledge Duel
          </div>

          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-heritage-gold/20 bg-white/70 p-4 dark:bg-heritage-charcoal/40">
                <p className="font-semibold text-heritage-red dark:text-heritage-gold">Hero</p>
                <div className="mt-2 flex items-center gap-1">
                  {hpHearts(playerHp, PLAYER_MAX_HP).map((filled, idx) => (
                    <Heart
                      key={idx}
                      className={`h-6 w-6 ${filled ? 'fill-rose-500 text-rose-500' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                  ))}
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-rose-100 dark:bg-rose-950/40">
                  <motion.div
                    animate={{ width: `${hpPercent(playerHp, PLAYER_MAX_HP)}%` }}
                    className="h-full bg-rose-500"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-heritage-gold/20 bg-white/70 p-4 dark:bg-heritage-charcoal/40">
                <p className="font-semibold text-heritage-red dark:text-heritage-gold">Tiger</p>
                <div className="mt-2 flex items-center gap-1">
                  {hpHearts(tigerHp, TIGER_MAX_HP).map((filled, idx) => (
                    <Heart
                      key={idx}
                      className={`h-6 w-6 ${filled ? 'fill-orange-500 text-orange-500' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                  ))}
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-orange-100 dark:bg-orange-950/40">
                  <motion.div
                    animate={{ width: `${hpPercent(tigerHp, TIGER_MAX_HP)}%` }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </div>
            </div>

            <motion.div
              animate={
                attackPhase === 'idle'
                  ? { x: 0 }
                  : { x: [0, -4, 4, -3, 3, 0] }
              }
              transition={{ duration: 0.28 }}
              className="relative mt-6 grid grid-cols-[auto_auto_auto] justify-center items-end gap-2 overflow-hidden rounded-2xl border border-heritage-gold/20 bg-white p-4 dark:bg-white"
            >
              <motion.div
                initial={false}
                animate={{
                  opacity: attackPhase === 'idle' ? 0 : [0, 0.8, 0],
                  x: attackPhase === 'playerAttack' ? [-20, 10, 24] : [20, -10, -24],
                  scale: attackPhase === 'idle' ? 0.6 : [0.6, 1.1, 0.7],
                }}
                transition={{ duration: 0.45 }}
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-1.5 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 shadow-[0_0_24px_4px_rgba(251,191,36,0.8)]"
              />

              <motion.div
                animate={{
                  scale: attackPhase === 'tigerAttack' ? [1, 0.88, 1] : [1, 1.03, 1],
                  x: attackPhase === 'playerAttack' ? [0, 14, 22, 0] : 0,
                  rotate: attackPhase === 'playerAttack' ? [0, -3, 0] : 0,
                }}
                transition={{ duration: 0.45 }}
                className="text-center"
              >
                <motion.div
                  animate={{ filter: attackPhase === 'tigerAttack' ? 'brightness(0.8)' : 'brightness(1)' }}
                  className="mx-auto w-fit"
                >
                  <div className="h-40 w-28 overflow-hidden">
                    <Image
                      src={attackPhase === 'playerAttack' ? HERO_IMAGES.attack : HERO_IMAGES.idle}
                      alt="Hero sprite"
                      width={132}
                      height={154}
                      priority
                      className="h-full w-full scale-110 object-cover"
                    />
                  </div>
                </motion.div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Hero
                </p>
              </motion.div>

              <div className="text-center px-1">
                <div className="rounded-full bg-black/80 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white shadow dark:bg-zinc-100 dark:text-zinc-900">
                  VS
                </div>
              </div>

              <motion.div
                animate={{
                  scale: attackPhase === 'playerAttack' ? [1, 0.88, 1] : [1, 1.03, 1],
                  x: attackPhase === 'tigerAttack' ? [0, -14, -22, 0] : 0,
                  rotate: attackPhase === 'tigerAttack' ? [0, 3, 0] : 0,
                }}
                transition={{ duration: 0.45 }}
                className="text-center"
              >
                <motion.div
                  animate={{ filter: attackPhase === 'playerAttack' ? 'brightness(0.82)' : 'brightness(1)' }}
                  className="mx-auto w-fit"
                >
                  <Image
                    src={attackPhase === 'tigerAttack' ? TIGER_IMAGES.attack : TIGER_IMAGES.idle}
                    alt="Tiger sprite"
                    width={146}
                    height={146}
                    priority
                    className="h-40 w-44 object-contain object-left"
                  />
                </motion.div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Tiger
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              key={`${currentQuestionIndex}-${result}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              {!gameOver && (
                <>
                  <h2 className="text-lg font-semibold">{currentQuestion.question}</h2>
                  <div className="mt-4 grid gap-3">
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(idx)}
                        disabled={locked}
                        className="rounded-lg border border-heritage-gold/30 bg-white/70 p-3 text-left transition-colors hover:border-heritage-red hover:bg-heritage-red/10 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-heritage-charcoal/30 dark:hover:border-heritage-gold dark:hover:bg-heritage-gold/10"
                      >
                        <span className="mr-2 font-semibold text-heritage-red dark:text-heritage-gold">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            <div className="mt-6 flex items-center gap-2 rounded-lg bg-black/5 px-3 py-2 text-sm font-medium dark:bg-white/5">
              {(result === 'correct' || result === 'win') && <Sword className="h-4 w-4 text-green-600" />}
              {(result === 'wrong' || result === 'lose') && <Shield className="h-4 w-4 text-red-600" />}
              {result === 'idle' && <Sparkles className="h-4 w-4 text-amber-600" />}
              <span className="text-gray-700 dark:text-gray-300">{message}</span>
            </div>

            {gameOver && (
              <div className="mt-6 flex items-center justify-between rounded-lg border border-heritage-gold/30 bg-heritage-gold/10 p-4 dark:bg-heritage-gold/5">
                <p className="font-semibold text-heritage-red dark:text-heritage-gold">
                  {result === 'win' ? 'You won the battle!' : 'Tiger wins this round!'}
                </p>
                <button onClick={resetGame} className="heritage-btn">
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
