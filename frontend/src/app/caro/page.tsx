'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import type { CaroQuestion, CaroMatch, CaroLeaderboardEntry } from '@/lib/types';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const BOARD_SIZE = 16;
const WIN_LENGTH = 5;
const QUESTION_TIME = 20;

type Cell = 'X' | 'O' | null;

const createBoard = () =>
  Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => null as Cell));

const directions = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
];

const inBounds = (r: number, c: number) => r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;

const countInDirection = (board: Cell[][], row: number, col: number, dr: number, dc: number, player: Cell) => {
  let r = row + dr;
  let c = col + dc;
  let count = 0;
  while (inBounds(r, c) && board[r][c] === player) {
    count += 1;
    r += dr;
    c += dc;
  }
  return count;
};

const isWinningMove = (board: Cell[][], row: number, col: number, player: Cell) => {
  if (!player) return false;
  return directions.some(([dr, dc]) => {
    const total =
      1 +
      countInDirection(board, row, col, dr, dc, player) +
      countInDirection(board, row, col, -dr, -dc, player);
    return total >= WIN_LENGTH;
  });
};

const cloneBoard = (board: Cell[][]) => board.map((row) => row.slice());

const neighborCount = (board: Cell[][], row: number, col: number, range = 1) => {
  let count = 0;
  for (let dr = -range; dr <= range; dr += 1) {
    for (let dc = -range; dc <= range; dc += 1) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (inBounds(r, c) && board[r][c]) count += 1;
    }
  }
  return count;
};

const scorePattern = (total: number, openEnds: number) => {
  if (total >= WIN_LENGTH) return 1000000;
  if (total === 4 && openEnds === 2) return 200000;
  if (total === 4 && openEnds === 1) return 80000;
  if (total === 3 && openEnds === 2) return 20000;
  if (total === 3 && openEnds === 1) return 6000;
  if (total === 2 && openEnds === 2) return 1500;
  if (total === 2 && openEnds === 1) return 400;
  if (total === 1 && openEnds === 2) return 120;
  return 20;
};

const evaluateMove = (board: Cell[][], row: number, col: number, player: Cell) => {
  let score = 0;
  for (const [dr, dc] of directions) {
    const left = countInDirection(board, row, col, -dr, -dc, player);
    const right = countInDirection(board, row, col, dr, dc, player);
    const total = 1 + left + right;

    const leftEndR = row - dr * (left + 1);
    const leftEndC = col - dc * (left + 1);
    const rightEndR = row + dr * (right + 1);
    const rightEndC = col + dc * (right + 1);
    const leftOpen = inBounds(leftEndR, leftEndC) && !board[leftEndR][leftEndC];
    const rightOpen = inBounds(rightEndR, rightEndC) && !board[rightEndR][rightEndC];
    const openEnds = (leftOpen ? 1 : 0) + (rightOpen ? 1 : 0);

    score += scorePattern(total, openEnds);
  }
  return score;
};

const findBestMove = (board: Cell[][]) => {
  const empties: Array<{ row: number; col: number }> = [];
  let hasAnyStone = false;

  for (let r = 0; r < BOARD_SIZE; r += 1) {
    for (let c = 0; c < BOARD_SIZE; c += 1) {
      if (board[r][c]) hasAnyStone = true;
      if (!board[r][c]) {
        if (!hasAnyStone || neighborCount(board, r, c, 2) > 0) {
          empties.push({ row: r, col: c });
        }
      }
    }
  }

  if (empties.length === 0) return null;

  if (!hasAnyStone) {
    const center = Math.floor(BOARD_SIZE / 2);
    return { row: center, col: center };
  }

  for (const move of empties) {
    const test = cloneBoard(board);
    test[move.row][move.col] = 'O';
    if (isWinningMove(test, move.row, move.col, 'O')) return move;
  }

  for (const move of empties) {
    const test = cloneBoard(board);
    test[move.row][move.col] = 'X';
    if (isWinningMove(test, move.row, move.col, 'X')) return move;
  }

  const center = (BOARD_SIZE - 1) / 2;
  let bestScore = -Infinity;
  let bestMove = empties[0];
  for (const move of empties) {
    const distance = Math.abs(move.row - center) + Math.abs(move.col - center);
    const adjacency = neighborCount(board, move.row, move.col) * 5;
    const attackScore = evaluateMove(board, move.row, move.col, 'O');
    const blockScore = evaluateMove(board, move.row, move.col, 'X') * 0.9;
    const score = attackScore + blockScore + adjacency - distance;
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};

export default function CaroPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [board, setBoard] = useState<Cell[][]>(() => createBoard());
  const [turn, setTurn] = useState<'player' | 'ai'>('player');
  const [message, setMessage] = useState('Click an empty cell to answer a question.');
  const [question, setQuestion] = useState<CaroQuestion | null>(null);
  const [pendingMove, setPendingMove] = useState<{ row: number; col: number } | null>(null);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<'playing' | 'win' | 'lose' | 'draw'>('playing');
  const [resultOpen, setResultOpen] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [rewardRevealed, setRewardRevealed] = useState(false);
  const [rewardText, setRewardText] = useState('');
  const [rewardType, setRewardType] = useState<'extra_question' | 'extra_free' | 'luck' | null>(null);
  const [freeMove, setFreeMove] = useState(false);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(QUESTION_TIME);
  const [gameStartAt, setGameStartAt] = useState(() => Date.now());
  const [matchSaved, setMatchSaved] = useState(false);
  const [history, setHistory] = useState<CaroMatch[]>([]);
  const [leaderboard, setLeaderboard] = useState<CaroLeaderboardEntry[]>([]);

  const boardLocked = result !== 'playing' || turn !== 'player' || loadingQuestion || verifying;

  const emptyCount = useMemo(
    () => board.flat().filter((cell) => !cell).length,
    [board]
  );

  const resetGame = () => {
    setBoard(createBoard());
    setTurn('player');
    setMessage('Click an empty cell to answer a question.');
    setQuestion(null);
    setPendingMove(null);
    setQuestionOpen(false);
    setResult('playing');
    setResultOpen(false);
    setRewardOpen(false);
    setRewardRevealed(false);
    setRewardText('');
    setRewardType(null);
    setFreeMove(false);
    setQuestionTimeLeft(QUESTION_TIME);
    setGameStartAt(Date.now());
    setMatchSaved(false);
  };

  useEffect(() => {
    if (result !== 'playing') {
      setResultOpen(true);
    }
  }, [result]);

  useEffect(() => {
    api.caro.leaderboard(10)
      .then((data) => setLeaderboard(data as CaroLeaderboardEntry[]))
      .catch(() => {});
    if (!isAuthenticated) return;
    api.caro.matches(10)
      .then((data) => setHistory(data as CaroMatch[]))
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (result === 'playing' || matchSaved) return;
    const durationSeconds = Math.max(1, Math.round((Date.now() - gameStartAt) / 1000));
    api.caro.createMatch({ result, duration_seconds: durationSeconds })
      .then(() => {
        setMatchSaved(true);
        return Promise.all([
          api.caro.matches(10),
          api.caro.leaderboard(10),
        ]);
      })
      .then(([matches, boardData]) => {
        setHistory(matches as CaroMatch[]);
        setLeaderboard(boardData as CaroLeaderboardEntry[]);
      })
      .catch(() => {});
  }, [result, matchSaved, gameStartAt, isAuthenticated]);

  const applyMove = useCallback((row: number, col: number, player: Cell) => {
    setBoard((prev) => {
      const next = cloneBoard(prev);
      next[row][col] = player;
      return next;
    });
  }, []);

  const checkEndState = useCallback((row: number, col: number, player: Cell) => {
    const nextBoard = cloneBoard(board);
    nextBoard[row][col] = player;
    if (isWinningMove(nextBoard, row, col, player)) {
      setResult(player === 'X' ? 'win' : 'lose');
      setMessage(player === 'X' ? 'Bạn thắng!' : 'Máy thắng.');
      return true;
    }
    if (emptyCount - 1 <= 0) {
      setResult('draw');
      setMessage('Hòa rồi.');
      return true;
    }
    return false;
  }, [board, emptyCount]);

  const aiMove = useCallback(() => {
    setTimeout(() => {
      setBoard((prev) => {
        if (result !== 'playing') return prev;
        const move = findBestMove(prev);
        if (!move) {
          setResult('draw');
          setMessage('Hòa rồi.');
          return prev;
        }
        const next = cloneBoard(prev);
        next[move.row][move.col] = 'O';
        if (isWinningMove(next, move.row, move.col, 'O')) {
          setResult('lose');
          setMessage('Máy thắng.');
        } else if (prev.flat().filter((cell) => !cell).length <= 1) {
          setResult('draw');
          setMessage('Hòa rồi.');
        } else {
          setMessage('Đến lượt bạn.');
          setTurn('player');
        }
        return next;
      });
    }, 450);
  }, [result]);

  useEffect(() => {
    if (!questionOpen) return;
    setQuestionTimeLeft(QUESTION_TIME);
    const timer = setInterval(() => {
      setQuestionTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [questionOpen]);

  useEffect(() => {
    if (!questionOpen || verifying) return;
    if (questionTimeLeft <= 0) {
      setQuestionOpen(false);
      setQuestion(null);
      setPendingMove(null);
      setMessage('Hết thời gian. Bạn mất lượt đặt ô này.');
    }
  }, [questionTimeLeft, questionOpen, verifying, aiMove]);

  const openReward = () => {
    setRewardOpen(true);
    setRewardRevealed(false);
    setRewardText('');
    setRewardType(null);
  };

  const revealReward = () => {
    if (rewardRevealed) return;
    const rewards = [
      { type: 'extra_question' as const, text: 'Đi thêm 1 lượt và trả lời câu hỏi.' },
      { type: 'extra_free' as const, text: 'Đi thêm 1 lượt và không cần trả lời câu hỏi.' },
      { type: 'luck' as const, text: 'Chúc bạn may mắn lần sau.' },
    ];
    const pick = rewards[Math.floor(Math.random() * rewards.length)];
    setRewardType(pick.type);
    setRewardText(pick.text);
    setRewardRevealed(true);
  };

  const applyReward = () => {
    setRewardOpen(false);
    if (rewardType === 'extra_question') {
      setTurn('player');
      setMessage('Bạn được đi thêm 1 lượt. Hãy trả lời câu hỏi.');
    } else if (rewardType === 'extra_free') {
      setFreeMove(true);
      setTurn('player');
      setMessage('Bạn được đi thêm 1 lượt không cần trả lời.');
    } else {
      setTurn('ai');
      setMessage('Chúc bạn may mắn lần sau. Đến lượt máy.');
      aiMove();
    }
  };

  const requestQuestion = async (row: number, col: number) => {
    if (boardLocked || board[row][col]) return;
    if (freeMove) {
      setFreeMove(false);
      applyMove(row, col, 'X');
      if (!checkEndState(row, col, 'X')) {
        setTurn('ai');
        setMessage('Bạn vừa đi không cần trả lời. Đến lượt máy.');
        aiMove();
      }
      return;
    }
    setLoadingQuestion(true);
    try {
      const data = await api.caro.question() as CaroQuestion;
      setQuestion(data);
      setPendingMove({ row, col });
      setQuestionOpen(true);
      setMessage('Trả lời đúng để đặt quân X.');
    } catch {
      toast.error('Không lấy được câu hỏi.');
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleAnswer = async (answerIndex: number) => {
    if (!question || !pendingMove) return;
    setVerifying(true);
    try {
      const resultCheck = await api.caro.verify({
        questionId: question.id,
        selectedAnswer: answerIndex,
      }) as { correct: boolean };

      const { row, col } = pendingMove;
      setQuestionOpen(false);
      setQuestion(null);
      setPendingMove(null);

      if (resultCheck.correct) {
        applyMove(row, col, 'X');
        if (!checkEndState(row, col, 'X')) {
          setMessage('Đúng! Chọn phần thưởng của bạn.');
          openReward();
        }
      } else {
        setTurn('ai');
        setMessage('Sai rồi, mất lượt. Máy đang đi...');
        aiMove();
      }
    } catch {
      toast.error('Không kiểm tra được đáp án.');
    } finally {
      setVerifying(false);
    }
  };

  const statusLabel =
    result === 'playing'
      ? turn === 'player'
        ? 'Lượt bạn'
        : 'Lượt máy'
      : result === 'win'
        ? 'Bạn thắng'
        : result === 'lose'
          ? 'Máy thắng'
          : 'Hòa';

  return (
    <div className="relative overflow-hidden py-10 px-4">
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 -translate-x-1/3 -translate-y-1/3 rounded-full bg-heritage-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-heritage-red/20 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 rounded-2xl border border-heritage-gold/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:border-heritage-gold/30 dark:bg-heritage-charcoal/70 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="section-title">Caro HCM Journey</h1>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              Trả lời câu hỏi trong 20 giây để đặt quân. Sai hoặc hết giờ sẽ mất lượt.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-heritage-red/10 px-4 py-2 text-sm font-semibold text-heritage-red dark:text-heritage-gold">
                {statusLabel}
              </span>
              <button onClick={resetGame} className="heritage-btn-outline text-sm">
                Chơi lại
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => router.push('/login')}
                  className="rounded-full border border-heritage-gold/30 px-4 py-2 text-sm font-semibold text-heritage-red hover:bg-heritage-red/10 dark:text-heritage-gold"
                >
                  Đăng nhập để lưu lịch sử
                </button>
              )}
            </div>
          </div>
          <div className="grid gap-4 text-sm text-gray-700 dark:text-gray-200">
            <div className="rounded-xl border border-heritage-gold/20 bg-heritage-gold/10 p-4">
              <p><span className="font-semibold">Luật thắng:</span> 5 quân liên tiếp theo hàng, cột hoặc chéo.</p>
              <p className="mt-2"><span className="font-semibold">AI:</span> tấn công + phòng thủ, ưu tiên thắng nhanh.</p>
            </div>
            <motion.div
              key={message}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-heritage-gold/20 bg-white/90 p-4 shadow-sm dark:bg-heritage-charcoal/60"
            >
              <h2 className="font-display text-lg font-semibold text-heritage-red dark:text-heritage-gold">
                Trạng thái
              </h2>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{message}</p>
            </motion.div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="museum-card p-4">
            <div className="overflow-auto">
              <div
                className="grid gap-1"
                style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
              >
                {board.map((row, r) =>
                  row.map((cell, c) => {
                    const isPlayable = !cell && turn === 'player' && result === 'playing';
                    return (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => requestQuestion(r, c)}
                        disabled={!isPlayable || loadingQuestion || verifying}
                        className={`aspect-square min-h-[26px] min-w-[26px] rounded-md border text-sm font-bold transition-colors md:min-h-[32px] md:min-w-[32px]
                          ${cell === 'X' ? 'border-heritage-red bg-heritage-red/10 text-heritage-red shadow-[0_0_10px_rgba(196,30,58,0.2)]' : ''}
                          ${cell === 'O' ? 'border-heritage-gold bg-heritage-gold/10 text-heritage-gold shadow-[0_0_10px_rgba(212,175,55,0.2)]' : ''}
                          ${!cell ? 'border-heritage-gold/30 hover:bg-heritage-red/5' : ''}
                          ${!isPlayable ? 'cursor-default opacity-70' : ''}`}
                      >
                        {cell || ''}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="museum-card p-5 text-sm text-gray-700 dark:text-gray-200">
              <p><span className="font-semibold">Thời gian câu hỏi:</span> 20 giây.</p>
              <p className="mt-2"><span className="font-semibold">Mẹo:</span> ưu tiên chặn chuỗi 4 quân của máy.</p>
            </div>

            <div className="museum-card p-5">
              <h3 className="font-display text-lg font-semibold text-heritage-red dark:text-heritage-gold">Lịch sử ván đấu</h3>
              {!isAuthenticated ? (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Đăng nhập để lưu lịch sử.</p>
              ) : history.length === 0 ? (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Chưa có ván nào.</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm">
                  {history.map((item, idx) => (
                    <li key={`${item.created_at}-${idx}`} className="flex items-center justify-between border-b border-heritage-gold/10 pb-2">
                      <span className="capitalize">{item.result}</span>
                      <span className="font-semibold text-heritage-red dark:text-heritage-gold">{item.duration_seconds}s</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="museum-card p-5">
              <h3 className="font-display text-lg font-semibold text-heritage-red dark:text-heritage-gold">Top 10 thắng nhanh nhất</h3>
              {leaderboard.length === 0 ? (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Chưa có dữ liệu.</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm">
                  {leaderboard.map((entry, idx) => (
                    <li key={`${entry.created_at}-${idx}`} className="flex items-center justify-between border-b border-heritage-gold/10 pb-2">
                      <span>{entry.display_name || entry.username}</span>
                      <span className="font-semibold text-heritage-red dark:text-heritage-gold">{entry.duration_seconds}s</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={questionOpen}
        onClose={() => !verifying && setQuestionOpen(false)}
        title="Câu hỏi HCM Journey"
      >
        {question ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{question.question}</p>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${questionTimeLeft <= 5 ? 'bg-heritage-red/20 text-heritage-red' : 'bg-heritage-gold/20 text-heritage-red dark:text-heritage-gold'}`}>
                {questionTimeLeft}s
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {question.options.map((opt, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={verifying}
                  className="w-full rounded-lg border border-heritage-gold/30 p-3 text-left text-sm transition-colors hover:bg-heritage-red/10 hover:border-heritage-red disabled:opacity-60"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300">Đang tải câu hỏi...</p>
        )}
      </Modal>

      <Modal
        isOpen={resultOpen}
        onClose={() => setResultOpen(false)}
        title="Kết quả"
      >
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {result === 'win' ? 'Bạn thắng!' : result === 'lose' ? 'Máy thắng.' : 'Hòa rồi.'}
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>
          <div className="mt-5 flex flex-col gap-2">
            <button onClick={resetGame} className="heritage-btn">Chơi lại</button>
            <button onClick={() => setResultOpen(false)} className="heritage-btn-outline">Tiếp tục xem bàn</button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={rewardOpen}
        onClose={() => rewardRevealed && setRewardOpen(false)}
        title="Phần thưởng"
      >
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Chọn 1 trong 3 phần thưởng. Kết quả sẽ được bật mí sau khi chọn.</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {['Phần thưởng 1', 'Phần thưởng 2', 'Phần thưởng 3'].map((label) => (
              <button
                key={label}
                onClick={revealReward}
                disabled={rewardRevealed}
                className="rounded-lg border border-heritage-gold/30 px-4 py-6 text-sm font-semibold text-heritage-red transition-colors hover:bg-heritage-red/10 disabled:opacity-60 dark:text-heritage-gold"
              >
                {label}
              </button>
            ))}
          </div>

          {rewardRevealed && (
            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{rewardText}</p>
              <button onClick={applyReward} className="heritage-btn mt-4">Tiếp tục</button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
