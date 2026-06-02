/** Procedural sword / battle SFX — no external audio files */

export type BattleSoundType =
  | 'heroSlash'
  | 'tigerSlash'
  | 'clash'
  | 'impact'
  | 'victory'
  | 'defeat';

let sharedCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedCtx) sharedCtx = new Ctx();
  if (sharedCtx.state === 'suspended') void sharedCtx.resume();
  return sharedCtx;
}

function noiseBurst(
  ctx: AudioContext,
  start: number,
  duration: number,
  options: {
    gain: number;
    filterType?: BiquadFilterType;
    freqStart: number;
    freqEnd: number;
    q?: number;
  }
) {
  const len = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = options.filterType ?? 'bandpass';
  filter.frequency.setValueAtTime(options.freqStart, start);
  filter.frequency.exponentialRampToValueAtTime(Math.max(options.freqEnd, 40), start + duration);
  filter.Q.value = options.q ?? 1.2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(options.gain, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(start);
  source.stop(start + duration + 0.02);
}

function toneSweep(
  ctx: AudioContext,
  start: number,
  duration: number,
  options: {
    type: OscillatorType;
    freqStart: number;
    freqEnd: number;
    gain: number;
  }
) {
  const osc = ctx.createOscillator();
  osc.type = options.type;
  osc.frequency.setValueAtTime(options.freqStart, start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(options.freqEnd, 30), start + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(options.gain, start + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function playHeroSlash(ctx: AudioContext, t: number) {
  noiseBurst(ctx, t, 0.14, { gain: 0.28, freqStart: 4200, freqEnd: 380, q: 0.9 });
  noiseBurst(ctx, t + 0.02, 0.09, { gain: 0.12, filterType: 'highpass', freqStart: 2000, freqEnd: 800, q: 0.6 });
  toneSweep(ctx, t + 0.04, 0.07, { type: 'triangle', freqStart: 920, freqEnd: 180, gain: 0.1 });
}

function playTigerSlash(ctx: AudioContext, t: number) {
  noiseBurst(ctx, t, 0.16, { gain: 0.32, freqStart: 2200, freqEnd: 120, q: 1.4 });
  toneSweep(ctx, t + 0.03, 0.12, { type: 'sawtooth', freqStart: 140, freqEnd: 55, gain: 0.14 });
  toneSweep(ctx, t + 0.05, 0.08, { type: 'square', freqStart: 280, freqEnd: 90, gain: 0.06 });
}

function playClash(ctx: AudioContext, t: number) {
  noiseBurst(ctx, t, 0.05, { gain: 0.35, filterType: 'highpass', freqStart: 3500, freqEnd: 1200, q: 2 });
  toneSweep(ctx, t, 0.06, { type: 'square', freqStart: 1100, freqEnd: 320, gain: 0.12 });
  toneSweep(ctx, t + 0.01, 0.08, { type: 'triangle', freqStart: 680, freqEnd: 140, gain: 0.08 });
}

function playImpact(ctx: AudioContext, t: number) {
  toneSweep(ctx, t, 0.1, { type: 'sine', freqStart: 95, freqEnd: 35, gain: 0.22 });
  noiseBurst(ctx, t, 0.07, { gain: 0.2, filterType: 'lowpass', freqStart: 800, freqEnd: 100, q: 0.8 });
}

function playVictory(ctx: AudioContext, t: number) {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    toneSweep(ctx, t + i * 0.1, 0.22, { type: 'triangle', freqStart: freq, freqEnd: freq * 0.98, gain: 0.1 });
  });
  noiseBurst(ctx, t + 0.35, 0.2, { gain: 0.08, freqStart: 2000, freqEnd: 600, q: 1 });
}

function playDefeat(ctx: AudioContext, t: number) {
  toneSweep(ctx, t, 0.35, { type: 'sawtooth', freqStart: 220, freqEnd: 55, gain: 0.12 });
  toneSweep(ctx, t + 0.15, 0.4, { type: 'sine', freqStart: 130, freqEnd: 40, gain: 0.15 });
}

export function playBattleSound(type: BattleSoundType) {
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime;

  switch (type) {
    case 'heroSlash':
      playHeroSlash(ctx, t);
      break;
    case 'tigerSlash':
      playTigerSlash(ctx, t);
      break;
    case 'clash':
      playClash(ctx, t);
      break;
    case 'impact':
      playImpact(ctx, t);
      break;
    case 'victory':
      playVictory(ctx, t);
      break;
    case 'defeat':
      playDefeat(ctx, t);
      break;
  }
}

/** Chuỗi âm thanh khi tấn công — slash → clash → impact */
export function playAttackSequence(attacker: 'hero' | 'tiger', isKo = false) {
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime;

  if (attacker === 'hero') {
    playHeroSlash(ctx, t);
    playClash(ctx, t + 0.08);
    playImpact(ctx, t + 0.14);
    if (isKo) playVictory(ctx, t + 0.28);
  } else {
    playTigerSlash(ctx, t);
    playImpact(ctx, t + 0.12);
    if (isKo) playDefeat(ctx, t + 0.25);
  }
}
