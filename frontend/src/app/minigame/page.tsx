'use client';

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Shield, Sword, Heart, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { playAttackSequence, playOutcomeSound, primeBattleAudio } from '@/lib/battle-sounds';

type BattleQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const PLAYER_MAX_HP = 5;
const TIGER_MAX_HP = 5;

const questionBank: BattleQuestion[] = [
  {
    question: 'Nguyễn Tất Thành rời Việt Nam tìm đường cứu nước vào năm nào?',
    options: ['1905', '1911', '1919', '1930'],
    correctIndex: 1,
    explanation: 'Người rời Sài Gòn năm 1911, bắt đầu hành trình dài ở nước ngoài.',
  },
  {
    question: 'Tại Hội nghị Versailles 1919, Người dùng bút danh nào?',
    options: ['Văn Ba', 'Nguyễn Sinh Cung', 'Nguyễn Ái Quốc', 'Hồ Chí Minh'],
    correctIndex: 2,
    explanation: 'Nguyễn Ái Quốc — nghĩa là «người yêu nước».',
  },
  {
    question: 'Văn bản nào ảnh hưởng mạnh đến con đường cách mạng của Người năm 1920?',
    options: [
      'Tuyên ngôn Đảng Cộng sản',
      'Luận cương về vấn đề dân tộc và thuộc địa của Lênin',
      'Tư bản luận',
      'Nhà nước và cách mạng',
    ],
    correctIndex: 1,
    explanation: 'Luận cương Lênin gắn giải phóng dân tộc với giải phóng xã hội.',
  },
  {
    question: 'Hội Việt Nam Cách mạng Thanh niên được thành lập năm 1925 tại đâu?',
    options: ['Paris', 'Moscow', 'Quảng Châu', 'Sài Gòn'],
    correctIndex: 2,
    explanation: 'Thành lập tại Quảng Châu, nơi đào tạo nhiều cán bộ.',
  },
  {
    question: 'Đảng Cộng sản Việt Nam được thành lập năm nào?',
    options: ['1925', '1928', '1930', '1945'],
    correctIndex: 2,
    explanation: 'Thành lập năm 1930 sau khi hợp nhất các tổ chức cộng sản.',
  },
  {
    question: 'Nơi nào là điểm xuất phát của cuộc ra đi năm 1911?',
    options: ['Hà Nội', 'Huế', 'Sài Gòn', 'Đà Nẵng'],
    correctIndex: 2,
    explanation: 'Rời Sài Gòn trên tàu Pháp tháng 6/1911.',
  },
  {
    question: 'Tên khai sinh của Hồ Chí Minh là gì?',
    options: ['Nguyễn Ái Quốc', 'Nguyễn Sinh Cung', 'Nguyễn Tất Thành', 'Lê Hồng Phong'],
    correctIndex: 1,
    explanation: 'Sinh năm 1890 với tên Nguyễn Sinh Cung.',
  },
  {
    question: 'Giai đoạn 1923–1924, Người học lý luận cách mạng ở quốc gia nào?',
    options: ['Pháp', 'Anh', 'Liên Xô', 'Trung Quốc'],
    correctIndex: 2,
    explanation: 'Học tại Liên Xô, củng cố hiểu biết Mác-Lênin.',
  },
  {
    question: 'Tại Versailles 1919, bản yêu sách chủ yếu đòi hỏi điều gì?',
    options: ['Tăng thuế quan', 'Quyền dân sự và độc lập cho người Việt', 'Liên minh quân sự', 'Chỉ tự do tôn giáo'],
    correctIndex: 1,
    explanation: 'Đòi quyền và độc lập cho nhân dân Việt Nam.',
  },
  {
    question: 'Sau Đại hội Tours 1920, Người gia nhập đảng nào?',
    options: ['Đảng Cộng sản Pháp', 'Đảng Xã hội Pháp', 'Đảng Quốc dân Việt Nam', 'Đảng Lao động'],
    correctIndex: 0,
    explanation: 'Gia nhập Đảng Cộng sản Pháp năm 1920.',
  },
  {
    question: 'Thành phố nào gắn với việc thành lập Hội Thanh niên Cách mạng?',
    options: ['Moscow', 'Paris', 'Quảng Châu', 'Bangkok'],
    correctIndex: 2,
    explanation: 'Quảng Châu là trung tâm tổ chức quan trọng năm 1925.',
  },
  {
    question: 'Dự án giáo dục này chủ yếu tập trung giai đoạn nào?',
    options: ['1880–1900', '1911–1930', '1930–1954', '1954–1975'],
    correctIndex: 1,
    explanation: 'Tập trung hành trình cứu nước 1911–1930.',
  },
  {
    question: 'Bước ngoặt tư tưởng quan trọng nào trong hành trình của Người?',
    options: ['Gặp Napoléon', 'Đọc luận cương của Lênin', 'Làm quan', 'Mở trường ở Huế'],
    correctIndex: 1,
    explanation: 'Đọc luận cương Lênin năm 1920 là bước ngoặt quyết định.',
  },
  {
    question: 'Đảng Cộng sản Việt Nam được thành lập năm 1930 tại đâu?',
    options: ['Hà Nội', 'Hồng Kông', 'Quảng Châu', 'Paris'],
    correctIndex: 1,
    explanation: 'Thành lập tại Hồng Kông sau khi hợp nhất các nhóm cộng sản.',
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
  const [message, setMessage] = useState('Trả lời đúng để tấn công hổ!');
  const [locked, setLocked] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [gameKey, setGameKey] = useState(0);

  // New simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [hitLanded, setHitLanded] = useState(true);

  // ── Stable simulation loop refs (immune to re-renders) ──────────────────
  const simPlayerHpRef = useRef(PLAYER_MAX_HP);
  const simTigerHpRef  = useRef(TIGER_MAX_HP);
  const simTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSimActiveRef = useRef(false);
  const soundOnRef     = useRef(soundOn);

  // Keep soundOnRef fresh without restarting the loop
  useEffect(() => { soundOnRef.current = soundOn; }, [soundOn]);

  const clearSimTimer = useCallback(() => {
    if (simTimerRef.current !== null) {
      clearTimeout(simTimerRef.current);
      simTimerRef.current = null;
    }
  }, []);

  // Stable self-scheduling move — reads only refs, never goes stale
  const executeSimMove = useCallback(() => {
    if (!isSimActiveRef.current) return;
    if (simPlayerHpRef.current === 0 || simTigerHpRef.current === 0) return;

    const random = Math.random();

    if (random < 0.35) {
      // Ronaldo hits Messi
      setAttackPhase('playerAttack');
      setHitLanded(true);
      const newTigerHp = Math.max(0, simTigerHpRef.current - 1);
      simTigerHpRef.current = newTigerHp;
      setTigerHp(newTigerHp);
      if (soundOnRef.current) {
        primeBattleAudio();
        playAttackSequence('hero', newTigerHp === 0);
      }
      if (newTigerHp === 0) {
        setResult('win');
        isSimActiveRef.current = false;
        setMessage('🏆 Ronaldo hạ đo ván Messi bằng cú móc hàm cực mạnh!');
        if (soundOnRef.current) playOutcomeSound('victory');
      } else {
        setMessage('🥊 Ronaldo tung cú đấm thẳng cực nặng trúng mặt Messi!');
      }
    } else if (random < 0.7) {
      // Messi hits Ronaldo
      setAttackPhase('tigerAttack');
      setHitLanded(true);
      const newPlayerHp = Math.max(0, simPlayerHpRef.current - 1);
      simPlayerHpRef.current = newPlayerHp;
      setPlayerHp(newPlayerHp);
      if (soundOnRef.current) {
        primeBattleAudio();
        playAttackSequence('tiger', newPlayerHp === 0);
      }
      if (newPlayerHp === 0) {
        setResult('lose');
        isSimActiveRef.current = false;
        setMessage('🏆 Messi tung cú móc trái hiểm hóc knock-out Ronaldo!');
        if (soundOnRef.current) playOutcomeSound('defeat');
      } else {
        setMessage('🥊 Messi phản công nhanh bằng cú móc sườn cực hiểm trúng Ronaldo!');
      }
    } else if (random < 0.85) {
      // Ronaldo attacks, Messi dodges
      setAttackPhase('playerAttack');
      setHitLanded(false);
      if (soundOnRef.current) {
        primeBattleAudio();
        playAttackSequence('hero', false);
      }
      setMessage('🛡️ Ronaldo đấm mạnh nhưng Messi đã nhanh nhẹn né đòn!');
    } else {
      // Messi attacks, Ronaldo blocks
      setAttackPhase('tigerAttack');
      setHitLanded(false);
      if (soundOnRef.current) {
        primeBattleAudio();
        playAttackSequence('tiger', false);
      }
      setMessage('🛡️ Messi tấn công dồn dập, Ronaldo thủ thế cản phá thành công!');
    }

    // After attack animation → reset phase → schedule next move
    simTimerRef.current = setTimeout(() => {
      setAttackPhase('idle');
      if (isSimActiveRef.current) {
        simTimerRef.current = setTimeout(executeSimMove, 1100);
      }
    }, 700);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gameOver = result === 'win' || result === 'lose';

  const currentQuestion = useMemo(
    () => questionBank[currentQuestionIndex],
    [currentQuestionIndex]
  );

  const playBattleAudio = (attacker: 'hero' | 'tiger', isKo = false) => {
    if (!soundOn) return;
    primeBattleAudio();
    playAttackSequence(attacker, isKo);
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
    setHitLanded(true);

    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    const nextUsedIndexes = [...usedIndexes, currentQuestionIndex];
    setUsedIndexes(nextUsedIndexes);

    if (isCorrect) {
      setAttackPhase('playerAttack');
      const newTigerHp = Math.max(0, tigerHp - 1);
      setTigerHp(newTigerHp);
      setResult(newTigerHp === 0 ? 'win' : 'correct');
      playBattleAudio('hero', newTigerHp === 0);
      if (newTigerHp === 0 && soundOn) playOutcomeSound('victory');
      setMessage(
        newTigerHp === 0
          ? 'Chiến thắng! Bạn đã hạ Lionel Messi nhờ kiến thức lịch sử!'
          : `Ronaldo tung đòn! ${currentQuestion.explanation}`
      );
    } else {
      setAttackPhase('tigerAttack');
      const newPlayerHp = Math.max(0, playerHp - 1);
      setPlayerHp(newPlayerHp);
      setResult(newPlayerHp === 0 ? 'lose' : 'wrong');
      playBattleAudio('tiger', newPlayerHp === 0);
      if (newPlayerHp === 0 && soundOn) playOutcomeSound('defeat');
      setMessage(
        newPlayerHp === 0
          ? 'Bạn đã bị hạ. Ôn lại và thử lại với Messi!'
          : `Messi phản công! ${currentQuestion.explanation}`
      );
    }

    if (isCorrect ? tigerHp - 1 > 0 : playerHp - 1 > 0) {
      const nextQuestionIndex = pickNextQuestion(nextUsedIndexes);
      setTimeout(() => {
        setCurrentQuestionIndex(nextQuestionIndex);
        setResult('idle');
        setAttackPhase('idle');
        setLocked(false);
        setMessage('Trả lời đúng để đánh Lionel Messi!');
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
    setHitLanded(true);
    setMessage('Answer correctly to strike Lionel Messi!');
    setGameKey((k) => k + 1); // force remount of character sprites
  };

  const startSimulation = () => {
    if (soundOnRef.current) primeBattleAudio();
    // Reset HP refs so the loop reads fresh values
    simPlayerHpRef.current = PLAYER_MAX_HP;
    simTigerHpRef.current  = TIGER_MAX_HP;
    // Reset UI state
    setPlayerHp(PLAYER_MAX_HP);
    setTigerHp(TIGER_MAX_HP);
    setResult('idle');
    setAttackPhase('idle');
    setLocked(true);
    setIsSimulating(true);
    setHitLanded(true);
    setMessage('🔔 Ding Ding Ding! Trận đấu bắt đầu!');
    setGameKey((k) => k + 1);
    // Kick off the stable self-scheduling loop
    isSimActiveRef.current = true;
    clearSimTimer();
    simTimerRef.current = setTimeout(executeSimMove, 1200);
  };

  const stopSimulation = () => {
    isSimActiveRef.current = false;
    clearSimTimer();
    setIsSimulating(false);
    resetGame();
  };

  // Determine animations and transitions for Ronaldo (Player)
  let playerAnim;
  let playerTrans: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (result === 'win') {
    playerAnim = { y: [0, -12, 0], scale: 1.12, rotate: 0 };
    playerTrans = { repeat: Infinity, duration: 1.2, ease: 'easeInOut' };
  } else if (result === 'lose') {
    playerAnim = { y: 140, opacity: 0, rotate: -75 };
    playerTrans = { duration: 0.7, ease: 'easeIn' };
  } else if (attackPhase === 'playerAttack') {
    playerAnim = { x: [0, 110, 0], y: [0, -10, 0], scale: [1, 1.08, 1], rotate: [0, 5, 0] };
    playerTrans = { duration: 0.45, ease: 'easeOut' };
  } else if (attackPhase === 'tigerAttack') {
    playerAnim = { x: [0, -12, 0], rotate: [0, -8, 0] };
    playerTrans = { duration: 0.4, ease: 'easeInOut' };
  } else {
    playerAnim = { y: [0, -3, 0] };
    playerTrans = { repeat: Infinity, duration: 2.2, ease: 'easeInOut' };
  }

  // Determine animations and transitions for Messi (Opponent)
  let opponentAnim;
  let opponentTrans: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (result === 'lose') {
    opponentAnim = { y: [0, -12, 0], scale: 1.12, rotate: 0 };
    opponentTrans = { repeat: Infinity, duration: 1.2, ease: 'easeInOut' };
  } else if (result === 'win') {
    opponentAnim = { y: 140, opacity: 0, rotate: 75 };
    opponentTrans = { duration: 0.7, ease: 'easeIn' };
  } else if (attackPhase === 'tigerAttack') {
    opponentAnim = { x: [0, -110, 0], y: [0, -10, 0], scale: [1, 1.08, 1], rotate: [0, -5, 0] };
    opponentTrans = { duration: 0.45, ease: 'easeOut' };
  } else if (attackPhase === 'playerAttack') {
    opponentAnim = { x: [0, 12, 0], rotate: [0, 8, 0] };
    opponentTrans = { duration: 0.4, ease: 'easeInOut' };
  } else {
    opponentAnim = { y: [0, -3, 0] };
    opponentTrans = { repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.35 };
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f7] py-12 px-4 overflow-hidden">
      {/* Background radial luxury gradient */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(212,175,55,0.08) 0%, transparent 60%)'
        }}
      />
      
      <div className="mx-auto max-w-3xl relative z-10">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wider bg-gradient-to-r from-heritage-gold via-amber-300 to-heritage-gold bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(212,175,55,0.2)]">
            Đấu bóng đá quyền anh
          </h1>
          <p className="mt-2 text-[10px] md:text-xs tracking-widest text-zinc-400 uppercase">
            Ronaldo <span className="text-red-500 font-bold">CR7</span> vs Messi <span className="text-blue-500 font-bold">LM10</span>
          </p>
          <button
            onClick={() => setSoundOn((prev) => !prev)}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-heritage-gold/30 bg-black/60 px-4 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-heritage-gold/10 hover:text-white transition-all shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
          >
            {soundOn ? <Volume2 className="h-4 w-4 text-heritage-gold" /> : <VolumeX className="h-4 w-4 text-zinc-500" />}
            {soundOn ? 'Âm thanh: BẬT' : 'Âm thanh: TẮT'}
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-heritage-gold/25 bg-[#0e0e10]/85 p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          {/* Round Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-heritage-gold">
              {isSimulating ? '🏟️ Đấu tự động' : `Vòng ${usedIndexes.length + 1}`}
            </span>
            <div className="flex gap-2">
              {!isSimulating && (
                <button
                  onClick={startSimulation}
                  className="rounded bg-gradient-to-r from-red-600 to-blue-600 px-3 py-1.5 text-[10px] md:text-xs font-bold text-white hover:from-red-500 hover:to-blue-500 shadow-md transition-all uppercase tracking-wider flex items-center gap-1.5"
                >
                  🥊 Xem Đấu Thật (Auto-Fight)
                </button>
              )}
              {isSimulating && (
                <button
                  onClick={stopSimulation}
                  className="rounded border border-red-500/40 bg-red-950/20 px-3 py-1.5 text-[10px] md:text-xs font-bold text-red-400 hover:bg-red-950/45 transition-all uppercase tracking-wider"
                >
                  ⏹️ Dừng đấu (Về Quiz)
                </button>
              )}
            </div>
          </div>

          {/* Health Bars Section */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Ronaldo HP Card */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 shadow-lg border-l-4 border-l-red-600">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white tracking-wider flex items-center gap-2 text-sm md:text-base">
                  <span className="text-lg">🇵🇹</span> Cristiano Ronaldo
                </p>
                <span className="text-[9px] uppercase font-bold tracking-widest text-red-500 bg-red-950/20 px-2 py-0.5 rounded border border-red-500/10">Người chơi</span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                {hpHearts(playerHp, PLAYER_MAX_HP).map((filled, idx) => (
                  <Heart
                    key={idx}
                    className={`h-5 w-5 transition-all duration-300 ${
                      filled ? 'fill-red-500 text-red-500 scale-100' : 'text-zinc-800 scale-90 opacity-30'
                    }`}
                  />
                ))}
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
                <motion.div
                  animate={{ width: `${hpPercent(playerHp, PLAYER_MAX_HP)}%` }}
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500"
                />
              </div>
            </div>

            {/* Messi HP Card */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 shadow-lg border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white tracking-wider flex items-center gap-2 text-sm md:text-base">
                  <span className="text-lg">🇦🇷</span> Lionel Messi
                </p>
                <span className="text-[9px] uppercase font-bold tracking-widest text-blue-500 bg-blue-950/20 px-2 py-0.5 rounded border border-blue-500/10">Đối thủ</span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                {hpHearts(tigerHp, TIGER_MAX_HP).map((filled, idx) => (
                  <Heart
                    key={idx}
                    className={`h-5 w-5 transition-all duration-300 ${
                      filled ? 'fill-blue-500 text-blue-500 scale-100' : 'text-zinc-800 scale-90 opacity-30'
                    }`}
                  />
                ))}
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
                <motion.div
                  animate={{ width: `${hpPercent(tigerHp, TIGER_MAX_HP)}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Boxing Ring Battle Arena */}
          <motion.div
            animate={
              attackPhase === 'idle'
                ? { x: 0 }
                : { x: [0, -10, 10, -8, 8, -4, 4, 0] }
            }
            transition={{ duration: 0.35, delay: 0.12 }}
            className="relative mt-6 h-64 md:h-[350px] w-full overflow-hidden rounded-2xl border border-zinc-800/50 bg-black shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
            style={{
              backgroundImage: 'url("/images/boxing_arena.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark Cinematic Vignette */}
            <div 
              className="absolute inset-0 pointer-events-none z-[5]" 
              style={{
                background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.85) 100%)'
              }}
            />

            {/* Glowing Golden Spotlight Swaying */}
            <motion.div
              className="absolute left-1/4 top-0 w-24 h-full bg-gradient-to-b from-amber-500/15 to-transparent origin-top pointer-events-none filter blur-[12px] z-[2]"
              animate={{ rotate: [-18, 18, -18] }}
              transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut' }}
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            />

            {/* Glowing Blue Spotlight Swaying */}
            <motion.div
              className="absolute right-1/4 top-0 w-24 h-full bg-gradient-to-b from-blue-500/15 to-transparent origin-top pointer-events-none filter blur-[12px] z-[2]"
              animate={{ rotate: [18, -18, 18] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 0.5 }}
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            />

            {/* Floating Boxing Dust Particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-4 w-1 h-1 rounded-full bg-amber-400/40 pointer-events-none z-[4]"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                }}
                animate={{
                  y: [0, -200 - Math.random() * 120],
                  x: [0, (Math.random() - 0.5) * 35],
                  opacity: [0, 0.7, 0],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4 + Math.random() * 4,
                  ease: 'linear',
                  delay: Math.random() * 4,
                }}
              />
            ))}

            {/* Hit Spark Effect: Ronaldo Hits Messi */}
            {attackPhase === 'playerAttack' && hitLanded && (
              <motion.div
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: [0.3, 2, 0.1], opacity: [0, 1, 0] }}
                transition={{ duration: 0.3, delay: 0.12 }}
                className="absolute left-[55%] md:left-[60%] top-[45%] z-20 pointer-events-none w-20 h-20 rounded-full flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-radial from-white via-amber-400 to-transparent rounded-full filter blur-[2px]" />
                <Sparkles className="text-white w-8 h-8 animate-pulse" />
              </motion.div>
            )}

            {/* Hit Spark Effect: Messi Hits Ronaldo */}
            {attackPhase === 'tigerAttack' && hitLanded && (
              <motion.div
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: [0.3, 2, 0.1], opacity: [0, 1, 0] }}
                transition={{ duration: 0.3, delay: 0.12 }}
                className="absolute left-[45%] md:left-[40%] top-[45%] z-20 pointer-events-none w-20 h-20 rounded-full flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-radial from-white via-blue-400 to-transparent rounded-full filter blur-[2px]" />
                <Sparkles className="text-white w-8 h-8 animate-pulse" />
              </motion.div>
            )}

            {/* CR7 Left Side Fighter Container */}
            <motion.div
              key={`player-${gameKey}`}
              className="absolute left-[5%] md:left-[15%] bottom-2 flex flex-col items-center origin-bottom z-10"
              animate={playerAnim}
              transition={playerTrans}
            >
              {/* Golden Fighter Aura */}
              <div 
                className="absolute bottom-6 -z-10 w-36 h-36 rounded-full filter blur-[24px] opacity-60 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)',
                }}
              />

              {/* Dynamic Floor Shadow */}
              <motion.div 
                className="absolute bottom-0 w-28 h-3 bg-black/60 rounded-full filter blur-[4px] pointer-events-none"
                animate={attackPhase === 'idle' && !gameOver ? { scale: [1, 0.9, 1], opacity: [0.6, 0.4, 0.6] } : {}}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              />

              {/* Character sprite wrapper */}
              <motion.div
                animate={
                  attackPhase === 'tigerAttack' && hitLanded
                    ? { filter: ['brightness(1)', 'brightness(1.8) sepia(0.8) hue-rotate(-50deg) saturate(3.5)', 'brightness(1)'] }
                    : {}
                }
                transition={{ duration: 0.28, delay: 0.1 }}
                className="relative select-none pointer-events-none"
              >
                <Image
                  src="/characters/ronaldo.png"
                  alt="Cristiano Ronaldo"
                  width={200}
                  height={300}
                  className="h-44 md:h-[250px] w-auto object-contain"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* VS Badge */}
            {!gameOver && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center select-none pointer-events-none">
                <div className="relative group">
                  <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-r from-red-500 to-blue-500 opacity-60 filter blur-[8px] animate-pulse" />
                  <div className="relative rounded-full border border-heritage-gold bg-black/90 px-3.5 py-1.5 text-xs font-black italic tracking-[0.2em] text-heritage-gold shadow-lg">
                    VS
                  </div>
                </div>
              </div>
            )}

            {/* Messi Right Side Fighter Container */}
            <motion.div
              key={`opponent-${gameKey}`}
              className="absolute right-[5%] md:right-[15%] bottom-2 flex flex-col items-center origin-bottom z-10"
              animate={opponentAnim}
              transition={opponentTrans}
            >
              {/* Blue Fighter Aura */}
              <div 
                className="absolute bottom-6 -z-10 w-36 h-36 rounded-full filter blur-[24px] opacity-60 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
                }}
              />

              {/* Dynamic Floor Shadow */}
              <motion.div 
                className="absolute bottom-0 w-28 h-3 bg-black/60 rounded-full filter blur-[4px] pointer-events-none"
                animate={attackPhase === 'idle' && !gameOver ? { scale: [1, 0.9, 1], opacity: [0.6, 0.4, 0.6] } : {}}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.35 }}
              />

              {/* Character sprite wrapper */}
              <motion.div
                animate={
                  attackPhase === 'playerAttack' && hitLanded
                    ? { filter: ['brightness(1)', 'brightness(1.8) sepia(0.8) hue-rotate(-50deg) saturate(3.5)', 'brightness(1)'] }
                    : {}
                }
                transition={{ duration: 0.28, delay: 0.1 }}
                className="relative select-none pointer-events-none scale-x-[-1]"
              >
                <Image
                  src="/characters/messi.png"
                  alt="Lionel Messi"
                  width={200}
                  height={300}
                  className="h-38 md:h-[214px] w-auto object-contain"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Fighter Nameplates */}
            <div className="absolute left-4 bottom-4 z-20 px-2 py-1 rounded border border-zinc-800 bg-black/80 backdrop-blur-sm text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-[#FFD700] shadow-md">
              🇵🇹 Ronaldo
            </div>
            <div className="absolute right-4 bottom-4 z-20 px-2 py-1 rounded border border-zinc-800 bg-black/80 backdrop-blur-sm text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-[#FFD700] shadow-md">
              🇦🇷 Messi
            </div>
          </motion.div>

          {/* Question Section */}
          {!isSimulating && !gameOver && (
            <motion.div
              key={`${currentQuestionIndex}-${result}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 border-t border-zinc-800/80 pt-6"
            >
              <h2 className="text-base md:text-lg font-bold text-zinc-100 tracking-wide">
                {currentQuestion.question}
              </h2>
              <div className="mt-4 grid gap-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(idx)}
                    disabled={locked}
                    className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 text-left transition-all duration-300 hover:border-heritage-gold hover:bg-heritage-gold/5 disabled:cursor-not-allowed disabled:opacity-60 text-zinc-200 flex items-center shadow-md group"
                  >
                    <span className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700 font-bold text-zinc-400 text-xs transition-colors group-hover:bg-heritage-gold group-hover:text-black group-hover:border-heritage-gold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-medium leading-relaxed">{option}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Auto-Fight Status Indicator */}
          {isSimulating && !gameOver && (
            <div className="mt-8 border-t border-zinc-800/80 pt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-950/10 text-xs text-red-400 font-semibold tracking-wider uppercase animate-pulse">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Đang mô phỏng trận đấu tự động...
              </div>
              <p className="text-xs text-zinc-500 mt-2 font-medium">
                Hai huyền thoại đang tự động cống hiến những cú đấm nảy lửa trên võ đài.
              </p>
            </div>
          )}

          {/* Live Action Message Box */}
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950/60 px-4 py-3.5 text-xs md:text-sm font-medium shadow-inner">
            {(result === 'correct' || result === 'win') && <Sword className="h-4 w-4 text-green-500 shrink-0" />}
            {(result === 'wrong' || result === 'lose') && <Shield className="h-4 w-4 text-red-500 shrink-0" />}
            {result === 'idle' && <Sparkles className="h-4 w-4 text-heritage-gold shrink-0 animate-pulse" />}
            <span className="text-zinc-300 leading-relaxed">{message}</span>
          </div>

          {/* Game Over Panel */}
          {gameOver && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-heritage-gold/30 bg-gradient-to-r from-heritage-gold/5 via-zinc-950/80 to-heritage-gold/5 p-5 shadow-lg"
            >
              <div>
                <h3 className="text-base md:text-lg font-black uppercase tracking-wider text-heritage-gold flex items-center gap-2">
                  {result === 'win' ? '🏆 Ronaldo Thắng KO!' : '⚡ Messi Thắng KO!'}
                </h3>
                <p className="text-xs md:text-sm text-zinc-400 mt-1">
                  {isSimulating 
                    ? (result === 'win' 
                      ? 'Trận đấu mô phỏng kết thúc! Cristiano Ronaldo đã giành chiến thắng đo ván trước Lionel Messi!' 
                      : 'Trận đấu mô phỏng kết thúc! Lionel Messi đã giành chiến thắng đo ván trước Cristiano Ronaldo!')
                    : (result === 'win'
                      ? 'Amazing job! You completely dominated the ring and defeated Lionel Messi!'
                      : 'Lionel Messi wins this match by KO. Review your history lessons and fight again!')
                  }
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={isSimulating ? startSimulation : resetGame}
                  className="flex-1 sm:flex-none font-black uppercase tracking-widest text-xs px-6 py-3 rounded-lg bg-heritage-gold text-black hover:bg-amber-400 transition-colors shadow-lg"
                >
                  {isSimulating ? 'Đấu lại' : 'Đấu lại'}
                </button>
                {isSimulating && (
                  <button
                    onClick={stopSimulation}
                    className="flex-1 sm:flex-none font-black uppercase tracking-widest text-xs px-6 py-3 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    Về Quiz
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
