'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, RotateCcw, Volume2, VolumeX, Flag } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Lazy-load to avoid SSR issues with Three.js
const VietnamMap3D = dynamic(
  () => import('./VietnamMap3D').then((m) => m.VietnamMap3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    ),
  }
);

// ── Types ─────────────────────────────────────────────────────────────────────
type Question = { question: string; options: string[]; correctIndex: number; explanation: string };
type GamePhase = 'intro' | 'playing' | 'win' | 'lose';

// ── Milestones (with real Vietnamese coordinates & history lessons) ───────────
const MILESTONES = [
  { 
    name: 'Pác Bó', icon: '⛰️', lat: 22.9772, lng: 106.0505, color: '#10b981',
    lessonTitle: 'Hang Pác Bó (Cao Bằng) - Nơi khơi nguồn cách mạng',
    lessonDate: '28/01/1941',
    lessonContent: 'Sau 30 năm bôn ba tìm đường cứu nước, lãnh tụ Nguyễn Ái Quốc (Hồ Chí Minh) đã vượt cột mốc 108 trở về Tổ quốc. Tại hang Pác Bó, Người đã chủ trì Hội nghị Trung ương Đảng lần thứ 8, thành lập Mặt trận Việt Minh, trực tiếp lãnh đạo phong trào cách mạng giải phóng dân tộc.'
  },
  { 
    name: 'Tân Trào', icon: '🌳', lat: 21.7825, lng: 105.5392, color: '#3b82f6',
    lessonTitle: 'Khu di tích Tân Trào (Tuyên Quang) - Thủ đô kháng chiến',
    lessonDate: '16/08/1945',
    lessonContent: 'Diễn ra Quốc dân Đại hội Tân Trào. Đại hội tán thành chủ trương Tổng khởi nghĩa, thông qua 10 chính sách lớn của Việt Minh, cử ra Ủy ban Dân tộc Giải phóng do Hồ Chí Minh làm Chủ tịch. Chiều cùng ngày, Võ Nguyên Giáp đọc Quân lệnh số 1, xuất quân tiến về Hà Nội.'
  },
  { 
    name: 'Hà Nội', icon: '🏛️', lat: 21.0368, lng: 105.8335, color: '#ef4444',
    lessonTitle: 'Quảng trường Ba Đình (Hà Nội) - Khai sinh đất nước',
    lessonDate: '02/09/1945',
    lessonContent: 'Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập, chính thức khai sinh ra nước Việt Nam Dân chủ Cộng hòa, đánh dấu thắng lợi rực rỡ của Cách mạng tháng Tám.'
  },
  { 
    name: 'Bến Hải', icon: '🌉', lat: 17.0016, lng: 107.0545, color: '#f59e0b',
    lessonTitle: 'Cầu Hiền Lương, Sông Bến Hải - Biểu tượng chia cắt',
    lessonDate: '1954 - 1975',
    lessonContent: 'Theo Hiệp định Geneva, vĩ tuyến 17 trở thành ranh giới quân sự tạm thời chia cắt hai miền Nam - Bắc. Trong hơn 20 năm, nơi đây là tuyến đầu của miền Bắc XHCN, biểu tượng của tinh thần đấu tranh và khát vọng thống nhất.'
  },
  { 
    name: 'Trường Sơn', icon: '🛤️', lat: 16.5161, lng: 106.8407, color: '#8b5cf6',
    lessonTitle: 'Tuyến đường Trường Sơn - Huyết mạch chi viện',
    lessonDate: '1959 - 1975',
    lessonContent: 'Đường vận tải chiến lược Trường Sơn chính thức mở ngày 19/5/1959. Đây là mạng lưới giao thông khổng lồ kéo dài dọc dãy Trường Sơn, vận chuyển sức người, vũ khí từ hậu phương miền Bắc chi viện cho tiền tuyến lớn miền Nam.'
  },
  { 
    name: 'B.M Thuột', icon: '⚔️', lat: 12.6667, lng: 108.0383, color: '#ec4899',
    lessonTitle: 'Buôn Ma Thuột (Đắk Lắk) - Đòn điểm huyệt',
    lessonDate: '10/03/1975',
    lessonContent: 'Quân Giải phóng bất ngờ tấn công giải phóng thị xã Buôn Ma Thuột, mở màn Chiến dịch Tây Nguyên. Chiến thắng vang dội này làm rung chuyển hệ thống phòng ngự VNCH, mở đầu cuộc Tổng tiến công mùa Xuân 1975.'
  },
  { 
    name: 'Xuân Lộc', icon: '🛡️', lat: 10.9325, lng: 107.2411, color: '#f97316',
    lessonTitle: 'Thị xã Xuân Lộc (Đồng Nai) - Cánh cửa thép',
    lessonDate: '09/04 - 21/04/1975',
    lessonContent: 'Chiến dịch Xuân Lộc vô cùng ác liệt. Bằng quyết tâm, quân ta đã đập tan phòng tuyến Xuân Lộc – "cánh cửa thép" bảo vệ ngõ phía Đông Sài Gòn, mở toang đường tiến quân cho các cánh quân chủ lực.'
  },
  { 
    name: 'Sài Gòn', icon: '🚩', lat: 10.7770, lng: 106.6953, color: '#C41E3A',
    lessonTitle: 'Dinh Độc Lập (Sài Gòn) - Ngày toàn thắng',
    lessonDate: '30/04/1975',
    lessonContent: 'Đúng 11h30 phút, chiếc xe tăng mang số hiệu 390 của quân Giải phóng đã húc đổ cổng chính, tiến vào sân Dinh Độc Lập. Chiến dịch Hồ Chí Minh toàn thắng, đất nước chính thức thống nhất.'
  },
];

// ── Question bank (15 câu TTHCM + sự kiện 30/4) ──────────────────────────────
const ALL_QUESTIONS: Question[] = [
  {
    question: 'Chiến dịch Hồ Chí Minh lịch sử bắt đầu vào ngày nào?',
    options: ['26/4/1975', '28/4/1975', '30/4/1975', '1/5/1975'],
    correctIndex: 0,
    explanation: 'Chiến dịch Hồ Chí Minh bắt đầu ngày 26/4/1975 và kết thúc thắng lợi vào 30/4/1975.',
  },
  {
    question: 'Xe tăng nào húc đổ cổng chính Dinh Độc Lập vào ngày 30/4/1975?',
    options: ['Xe tăng số 843', 'Xe tăng số 390', 'Xe tăng số 100', 'Xe tăng số 555'],
    correctIndex: 1,
    explanation: 'Xe tăng số 390 (Quân đoàn 2) húc đổ cổng chính Dinh Độc Lập lúc 11:30 ngày 30/4/1975.',
  },
  {
    question: 'Tổng thống cuối cùng của Việt Nam Cộng hòa tuyên bố đầu hàng là ai?',
    options: ['Nguyễn Văn Thiệu', 'Trần Văn Hương', 'Dương Văn Minh', 'Nguyễn Cao Kỳ'],
    correctIndex: 2,
    explanation: 'Dương Văn Minh tuyên bố đầu hàng vô điều kiện lúc 10:24 ngày 30/4/1975.',
  },
  {
    question: 'Theo Hồ Chí Minh, điều gì là quý hơn tất cả?',
    options: ['Tài nguyên thiên nhiên', 'Độc lập và tự do', 'Quân đội hùng mạnh', 'Kinh tế phát triển'],
    correctIndex: 1,
    explanation: '"Không có gì quý hơn độc lập tự do" — câu nói bất hủ của Chủ tịch Hồ Chí Minh.',
  },
  {
    question: 'Tư tưởng Hồ Chí Minh xác định con đường cứu nước là gì?',
    options: [
      'Con đường tư bản chủ nghĩa',
      'Con đường phong kiến',
      'Con đường cách mạng vô sản theo chủ nghĩa Mác-Lênin',
      'Con đường dân chủ tư sản',
    ],
    correctIndex: 2,
    explanation: 'HCM xác định con đường cách mạng vô sản, kết hợp độc lập dân tộc với chủ nghĩa xã hội.',
  },
  {
    question: 'Dinh Độc Lập ngày nay có tên chính thức là gì?',
    options: ['Dinh Thống Nhất', 'Phủ Chủ tịch', 'Dinh Gia Long', 'Dinh Toàn quyền'],
    correctIndex: 0,
    explanation: 'Sau 30/4/1975, Dinh Độc Lập đổi tên thành Dinh Thống Nhất.',
  },
  {
    question: 'Đảng Cộng sản Việt Nam được thành lập năm nào?',
    options: ['1925', '1928', '1930', '1945'],
    correctIndex: 2,
    explanation: 'Đảng Cộng sản Việt Nam thành lập ngày 3/2/1930 tại Hồng Kông.',
  },
  {
    question: 'Hồ Chí Minh sinh ngày bao nhiêu?',
    options: ['15/5/1890', '19/5/1890', '25/5/1890', '19/5/1891'],
    correctIndex: 1,
    explanation: 'Hồ Chí Minh sinh ngày 19/5/1890 tại làng Kim Liên, huyện Nam Đàn, tỉnh Nghệ An.',
  },
  {
    question: 'Tư tưởng HCM về đại đoàn kết nhấn mạnh điều gì?',
    options: [
      'Chỉ đoàn kết giai cấp công nhân',
      'Đoàn kết toàn dân không phân biệt giai cấp, tôn giáo',
      'Ưu tiên đoàn kết với nước ngoài',
      'Chỉ đoàn kết trong Đảng',
    ],
    correctIndex: 1,
    explanation: '"Đoàn kết, đoàn kết, đại đoàn kết" — HCM chủ trương đoàn kết toàn dân không phân biệt.',
  },
  {
    question: 'Nguyễn Tất Thành rời cảng Nhà Rồng ra đi tìm đường cứu nước năm nào?',
    options: ['1905', '1908', '1911', '1919'],
    correctIndex: 2,
    explanation: 'Ngày 5/6/1911, Nguyễn Tất Thành rời cảng Nhà Rồng trên tàu Amiral Latouche-Tréville.',
  },
  {
    question: 'Tuyên ngôn Độc lập được đọc vào ngày nào?',
    options: ['19/8/1945', '25/8/1945', '2/9/1945', '30/4/1975'],
    correctIndex: 2,
    explanation: 'Ngày 2/9/1945 tại Quảng trường Ba Đình, Hồ Chí Minh đọc Tuyên ngôn Độc lập.',
  },
  {
    question: 'Lực lượng nào là chủ thể cách mạng theo HCM?',
    options: ['Giai cấp tư sản', 'Giai cấp công nhân và nông dân', 'Tầng lớp trí thức', 'Quân đội nhân dân'],
    correctIndex: 1,
    explanation: 'HCM xác định liên minh công-nông là nền tảng, động lực chính của cách mạng.',
  },
  {
    question: 'Chiến thắng 30/4/1975 kết thúc cuộc kháng chiến chống Mỹ kéo dài bao nhiêu năm?',
    options: ['15 năm', '20 năm', '21 năm', '25 năm'],
    correctIndex: 2,
    explanation: 'Cuộc kháng chiến chống Mỹ kéo dài 21 năm (1954–1975).',
  },
  {
    question: 'Khẩu hiệu nào gắn liền với cách mạng do HCM lãnh đạo?',
    options: [
      '"Tự do hay là chết"',
      '"Không có gì quý hơn độc lập tự do"',
      '"Cách mạng trước hết"',
      '"Đánh đuổi thực dân"',
    ],
    correctIndex: 1,
    explanation: '"Không có gì quý hơn độc lập tự do" — chân lý của thời đại.',
  },
  {
    question: 'Lá cờ được cắm lên Dinh Độc Lập lúc mấy giờ ngày 30/4/1975?',
    options: ['9:30', '10:45', '11:30', '12:00'],
    correctIndex: 2,
    explanation: 'Lúc 11:30 ngày 30/4/1975, lá cờ Mặt trận Giải phóng được cắm lên nóc Dinh Độc Lập.',
  },
];

function pickQuestions(n: number): Question[] {
  return [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, n);
}

// ── Fireworks ─────────────────────────────────────────────────────────────────
function Fireworks() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    angle: (i / 18) * 360,
    color: ['#EF4444', '#FCD34D', '#10B981', '#3B82F6', '#F97316'][i % 5],
    delay: Math.random() * 0.5,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {[{ cx: '15%', cy: '20%' }, { cx: '80%', cy: '15%' }, { cx: '50%', cy: '8%' }, { cx: '88%', cy: '45%' }].map(
        (pos, fi) =>
          particles.map((p, i) => (
            <motion.div
              key={`${fi}-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{ left: pos.cx, top: pos.cy, backgroundColor: p.color }}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((p.angle * Math.PI) / 180) * (60 + fi * 18),
                y: Math.sin((p.angle * Math.PI) / 180) * (60 + fi * 18),
                opacity: [1, 1, 0],
              }}
              transition={{ delay: fi * 0.25 + p.delay, duration: 1, ease: 'easeOut' }}
            />
          ))
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TankGamePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [phase, setPhase] = useState<GamePhase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [milestone, setMilestone] = useState(0);
  const [lives, setLives] = useState(3);
  const [locked, setLocked] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHistoricalPopup, setShowHistoricalPopup] = useState(false);
  const [tankFrom, setTankFrom] = useState(0);
  const [tankTo, setTankTo] = useState(0);
  const [tankPhase, setTankPhase] = useState<'idle' | 'moving'>('idle');
  const [showBurst, setShowBurst] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // ── Sound ──
  const tone = (freq: number, dur = 0.18, type: OscillatorType = 'square') => {
    if (!soundOn || typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.start(); osc.stop(ctx.currentTime + dur + 0.01);
    } catch { /* ignore */ }
  };

  const playCorrect = () => { tone(440, 0.12); setTimeout(() => tone(660, 0.15), 130); };
  const playWrong = () => tone(180, 0.25, 'sawtooth');
  const playVictory = () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.22, 'triangle'), i * 160));

  // ── Start ──
  const startGame = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    const qs = pickQuestions(MILESTONES.length - 1);
    setQuestions(qs);
    setCurrentQ(0);
    setMilestone(0);
    setLives(3);
    setLocked(true); // Locked while showing popup
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowHistoricalPopup(true); // Show first lesson immediately
    setTankFrom(0);
    setTankTo(0);
    setTankPhase('idle');
    setShowBurst(false);
    setPhase('playing');
  };

  // ── Tank arrived callback ──
  const onTankArrived = () => {
    const next = tankTo;
    setMilestone(next);
    setTankFrom(next);
    setTankPhase('idle');
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 1200);

    setShowExplanation(false);
    setSelectedAnswer(null);
    
    // Show lesson for the new milestone
    setShowHistoricalPopup(true);
    setLocked(true);
  };

  const closePopup = () => {
    setShowHistoricalPopup(false);
    if (milestone >= MILESTONES.length - 1) {
      playVictory();
      setTimeout(() => setPhase('win'), 800);
    } else {
      if (milestone > 0) {
        setCurrentQ((q) => q + 1);
      }
      setLocked(false);
    }
  };

  // ── Answer ──
  const handleAnswer = (idx: number) => {
    if (locked || phase !== 'playing') return;
    setLocked(true);
    setSelectedAnswer(idx);
    const correct = idx === questions[currentQ].correctIndex;

    if (correct) {
      playCorrect();
      setShowExplanation(true);
      // Start tank moving
      const nextIdx = milestone + 1;
      setTankFrom(milestone);
      setTankTo(nextIdx);
      setTankPhase('moving');
      // onTankArrived handles the rest
    } else {
      playWrong();
      setShowExplanation(true);
      const newLives = lives - 1;
      setLives(newLives);
      setTimeout(() => {
        setShowExplanation(false);
        setSelectedAnswer(null);
        if (newLives <= 0) setPhase('lose');
        else setLocked(false);
      }, 2200);
    }
  };

  const q = questions[currentQ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d1a] via-[#0a1628] to-[#050d1a] py-6 px-4">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="text-center mb-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-red-900/30 border border-red-700/40 px-4 py-1.5 mb-2"
          >
            <span className="text-heritage-gold text-xs font-bold tracking-widest uppercase">
              30/4/1975 · Đại Thắng Mùa Xuân
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl font-bold text-white"
          >
            🪖 Xe Tăng Giải Phóng
          </motion.h1>
        </div>

        <AnimatePresence mode="wait">

          {/* ══ INTRO ══ */}
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 gap-5 items-stretch"
            >
              {/* 3D map preview */}
              <div className="relative h-[420px] rounded-2xl overflow-hidden border border-green-900/40 bg-[#050d1a]">
                <VietnamMap3D
                  milestones={MILESTONES}
                  currentMilestone={0}
                  tankFrom={0} tankTo={0}
                  tankPhase="idle"
                  gamePhase="intro"
                  className="h-full w-full"
                />
                <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                  <span className="text-green-400/70 text-[10px] font-medium tracking-wider uppercase">
                    Bản đồ 3D Việt Nam · Hover vào điểm để xem tên
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-7 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-heritage-gold mb-5">Cách chơi</h2>
                  <div className="space-y-4 text-sm text-gray-300">
                    {[
                      { icon: '🗺️', title: 'Hành trình', desc: 'Xe tăng 3D đi từ Hà Nội → Vinh → Huế → Đà Nẵng → Sài Gòn' },
                      { icon: '❓', title: 'Câu hỏi', desc: 'Mỗi chặng = 1 câu hỏi về Tư tưởng Hồ Chí Minh' },
                      { icon: '✅', title: 'Đúng', desc: 'Xe tăng 3D di chuyển đến thành phố tiếp theo, camera zoom theo' },
                      { icon: '❌', title: 'Sai', desc: 'Mất 1 mạng (có 3 mạng). Hết mạng = thua' },
                      { icon: '🏆', title: 'Thắng', desc: 'Đến Sài Gòn → Húc đổ cổng Dinh Độc Lập!' },
                    ].map((item) => (
                      <div key={item.title} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        <div>
                          <strong className="text-white text-xs uppercase tracking-wider">{item.title}</strong>
                          <p className="text-gray-400 mt-0.5 text-xs">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <motion.button
                  whileHover={authLoading ? {} : { scale: 1.04 }} 
                  whileTap={authLoading ? {} : { scale: 0.97 }}
                  onClick={startGame}
                  disabled={authLoading}
                  className={`w-full text-center text-base py-4 mt-6 ${
                    authLoading ? 'bg-gray-700 text-gray-400 cursor-not-allowed rounded-xl font-bold' : 'heritage-btn'
                  }`}
                >
                  {authLoading ? 'Đang tải...' : '🚀 Xuất phát!'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ══ PLAYING ══ */}
          {phase === 'playing' && q && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid md:grid-cols-5 gap-4">

                {/* Left: 3D map + info */}
                <div className="md:col-span-2 flex flex-col gap-3">
                  {/* 3D Vietnam map */}
                  <div className="relative h-[300px] md:h-[340px] rounded-2xl overflow-hidden border border-green-900/40 bg-[#050d1a]">
                    <VietnamMap3D
                      milestones={MILESTONES}
                      currentMilestone={milestone}
                      tankFrom={tankFrom}
                      tankTo={tankTo}
                      tankPhase={tankPhase}
                      gamePhase={phase}
                      onTankArrived={onTankArrived}
                      showBurst={showBurst}
                      className="h-full w-full"
                    />

                    {/* Moving indicator */}
                    <AnimatePresence>
                      {tankPhase === 'moving' && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute top-3 left-0 right-0 flex justify-center"
                        >
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-heritage-gold/90 px-3 py-1 text-xs font-bold text-black">
                            🪖 Đang tiến...
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Route progress strip */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between relative mb-3">
                      {/* Track */}
                      <div className="absolute left-3 right-3 top-3.5 h-0.5 bg-gray-700 z-0" />
                      <motion.div
                        className="absolute left-3 top-3.5 h-0.5 bg-gradient-to-r from-blue-500 to-heritage-red z-0"
                        animate={{ width: `${(milestone / (MILESTONES.length - 1)) * 86}%` }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                      />
                      {MILESTONES.map((ms, i) => (
                        <div key={ms.name} className="relative z-10 flex flex-col items-center gap-1">
                          <motion.div
                            animate={{ scale: i === milestone ? 1.35 : 1, backgroundColor: i <= milestone ? ms.color : '#374151' }}
                            transition={{ duration: 0.4 }}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-lg border-2"
                            style={{ borderColor: i <= milestone ? ms.color : '#4b5563' }}
                          >
                            {i < milestone ? '✓' : ms.icon}
                          </motion.div>
                          <span className="text-[8px] text-gray-500 whitespace-nowrap font-medium">{ms.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Lives + sound */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-white/10">
                      {Array.from({ length: 3 }, (_, i) => (
                        <motion.div key={i} animate={{ scale: i < lives ? 1 : 0.65 }}>
                          <Heart className={`h-5 w-5 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`} />
                        </motion.div>
                      ))}
                      <span className="text-gray-400 text-xs ml-1">{lives} mạng</span>
                      <button
                        onClick={() => setSoundOn((s) => !s)}
                        className="ml-auto rounded-full border border-white/10 p-1.5 text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Question */}
                <div className="md:col-span-3 flex flex-col gap-3">
                  {/* Current leg indicator */}
                  <div className="flex items-center gap-3 rounded-xl bg-red-900/30 border border-red-700/30 px-4 py-2.5">
                    <div className="w-7 h-7 rounded-full bg-heritage-red/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-heritage-gold text-xs font-bold">{currentQ + 1}</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                        Chặng {milestone + 1}/{MILESTONES.length - 1} &nbsp;·&nbsp;
                        {MILESTONES[milestone]?.icon} {MILESTONES[milestone]?.name}
                        {MILESTONES[milestone + 1] && ` → ${MILESTONES[milestone + 1].icon} ${MILESTONES[milestone + 1].name}`}
                      </p>
                    </div>
                  </div>

                  {/* Question card OR Historical Popup */}
                  <AnimatePresence mode="wait">
                    {showHistoricalPopup ? (
                      <motion.div
                        key="popup"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-2xl border border-heritage-gold/50 bg-gradient-to-b from-heritage-gold/20 to-black/60 backdrop-blur-md p-6 md:p-8 flex-1 flex flex-col items-center justify-center text-center shadow-[0_0_40px_rgba(251,191,36,0.15)]"
                      >
                        <div className="w-14 h-14 bg-heritage-gold/20 rounded-full flex items-center justify-center mb-4 border border-heritage-gold/40">
                          <span className="text-3xl">{MILESTONES[milestone].icon}</span>
                        </div>
                        <h2 className="text-white font-display text-xl md:text-2xl font-bold mb-2 text-balance leading-snug">
                          {MILESTONES[milestone].lessonTitle}
                        </h2>
                        <div className="inline-flex items-center gap-2 rounded-full bg-red-900/40 border border-red-700/50 px-3 py-1 mb-5">
                          <span className="text-heritage-gold text-xs font-bold tracking-widest">{MILESTONES[milestone].lessonDate}</span>
                        </div>
                        <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-8 max-w-lg text-pretty">
                          {MILESTONES[milestone].lessonContent}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={closePopup}
                          className="heritage-btn px-8 py-3 w-full max-w-xs shadow-lg shadow-red-900/20"
                        >
                          {milestone >= MILESTONES.length - 1 ? '🎉 Chiến thắng!' : 'Tiếp tục hành trình 🚀'}
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`q-${currentQ}`}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 flex-1"
                      >
                        <h2 className="text-white font-semibold text-base md:text-lg leading-snug mb-5">{q.question}</h2>

                        <div className="grid gap-2.5">
                          {q.options.map((opt, i) => {
                            const isSel = selectedAnswer === i;
                            const isCorr = i === q.correctIndex;
                            let cls = 'w-full rounded-xl border p-3.5 text-left text-sm font-medium transition-all duration-200 ';
                            if (showExplanation) {
                              if (isCorr) cls += 'border-emerald-500 bg-emerald-500/20 text-emerald-300';
                              else if (isSel) cls += 'border-rose-500 bg-rose-500/20 text-rose-300';
                              else cls += 'border-white/10 bg-transparent text-gray-600 cursor-not-allowed';
                            } else {
                              cls += 'border-white/15 bg-white/5 text-gray-200 hover:border-heritage-gold/50 hover:bg-heritage-gold/10 cursor-pointer';
                            }
                            return (
                              <motion.button
                                key={i}
                                whileHover={!locked ? { scale: 1.01 } : {}}
                                whileTap={!locked ? { scale: 0.99 } : {}}
                                onClick={() => handleAnswer(i)}
                                disabled={locked}
                                className={cls}
                              >
                                <span className="mr-2 text-heritage-gold/80 font-bold">{String.fromCharCode(65 + i)}.</span>
                                {opt}
                              </motion.button>
                            );
                          })}
                        </div>

                        <AnimatePresence>
                          {showExplanation && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 rounded-xl border border-heritage-gold/30 bg-heritage-gold/10 p-3 overflow-hidden"
                            >
                              <p className="text-sm text-heritage-gold">
                                💡 <strong>Giải thích:</strong> {q.explanation}
                              </p>
                              {selectedAnswer === q.correctIndex && tankPhase === 'moving' && (
                                <p className="text-xs text-green-400 mt-1.5 font-medium">
                                  🪖 Xe tăng đang tiến về {MILESTONES[tankTo]?.name}...
                                </p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ WIN ══ */}
          {phase === 'win' && (
            <motion.div key="win" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl border border-heritage-gold/40 bg-gradient-to-b from-red-900/30 to-black/60 overflow-hidden"
            >
              <Fireworks />

              {/* Title */}
              <div className="relative z-10 text-center pt-8 pb-4 px-6">
                <motion.div
                  animate={{ rotate: [0, -6, 6, -3, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 2, repeatDelay: 1.5 }}
                  className="text-5xl mb-2 inline-block"
                >🚩</motion.div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-heritage-gold">
                  Miền Nam Hoàn Toàn Giải Phóng!
                </h2>
                <p className="text-white font-semibold mt-1">🏛️ Xe tăng số 390 húc đổ cổng Dinh Độc Lập · 11:30 ngày 30/4/1975</p>
              </div>

              {/* Video + Info grid */}
              <div className="relative z-10 grid md:grid-cols-5 gap-5 px-6 pb-8">

                {/* Local Video — col-span-3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="md:col-span-3 rounded-2xl overflow-hidden border-2 border-heritage-gold/50 shadow-[0_0_30px_rgba(251,191,36,0.2)] flex flex-col justify-center bg-black/40 relative"
                >
                  <video
                    src="/videos/304_victory.mp4"
                    autoPlay
                    loop
                    controls
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 text-center pointer-events-none">
                    <span className="text-heritage-gold text-xs font-bold tracking-wider">
                      🎬 Khoảnh khắc lịch sử 30/4/1975
                    </span>
                  </div>
                </motion.div>

                {/* Right info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="md:col-span-2 flex flex-col justify-between gap-4"
                >
                  {/* Score badge */}
                  <div className="rounded-xl border border-heritage-gold/40 bg-heritage-gold/10 px-4 py-3 text-center">
                    <Flag className="h-5 w-5 text-heritage-gold mx-auto mb-1" />
                    <p className="text-heritage-gold font-bold text-sm">Còn {lives} mạng!</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {lives === 3 ? 'Hoàn hảo! Không mất mạng nào' : lives === 2 ? 'Xuất sắc!' : 'Sống sót anh dũng!'}
                    </p>
                  </div>

                  {/* Quote */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex-1">
                    <p className="text-heritage-gold text-xs font-bold mb-2">💬 Hồ Chí Minh:</p>
                    <p className="text-gray-300 text-xs italic leading-relaxed">
                      &quot;Không có gì quý hơn độc lập, tự do. Đến ngày thắng lợi, nhân dân ta sẽ xây dựng đất nước đàng hoàng hơn, to đẹp hơn.&quot;
                    </p>
                  </div>

                  {/* Historical facts */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-white text-xs font-bold mb-2 uppercase tracking-wider">📜 Lịch sử</p>
                    <ul className="space-y-1.5 text-xs text-gray-400">
                      <li>• <span className="text-white">10:24</span> — Dương Văn Minh tuyên bố đầu hàng</li>
                      <li>• <span className="text-white">11:30</span> — Xe tăng 390 húc đổ cổng Dinh</li>
                      <li>• <span className="text-white">11:30</span> — Cờ Giải phóng cắm lên nóc Dinh</li>
                      <li>• <span className="text-white">21 năm</span> kháng chiến chống Mỹ kết thúc</li>
                    </ul>
                  </div>

                  {/* Replay button */}
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    onClick={startGame}
                    className="heritage-btn w-full inline-flex items-center justify-center gap-2 py-3"
                  >
                    <RotateCcw className="h-4 w-4" /> Chơi lại
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ══ LOSE ══ */}
          {phase === 'lose' && (
            <motion.div key="lose" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-900/20 to-black/60 p-10 text-center"
            >
              <div className="text-6xl mb-4">💥</div>
              <h2 className="font-display text-3xl font-bold text-red-400 mb-2">Xe tăng bị bắn hạ!</h2>
              <p className="text-gray-400 text-sm mb-1">
                Dừng lại tại <span className="text-white font-bold">{MILESTONES[milestone]?.icon} {MILESTONES[milestone]?.name}</span>
              </p>
              <p className="text-gray-500 text-xs mb-8">Ôn lại Tư tưởng Hồ Chí Minh và thử lại!</p>
              <div className="flex justify-center gap-1 mb-8">
                {Array.from({ length: 3 }, (_, i) => <Star key={i} className="h-7 w-7 text-gray-700" />)}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={startGame}
                className="heritage-btn inline-flex items-center gap-2 px-8 py-3"
              >
                <RotateCcw className="h-4 w-4" /> Thử lại
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
