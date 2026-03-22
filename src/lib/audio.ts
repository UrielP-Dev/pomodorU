import type { AmbientPreset } from "../pomodoro/types";

let audioCtx: AudioContext | null = null;
let ambientNodes: AudioNode[] = [];
let gainNode: GainNode | null = null;

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function disconnectAmbient(): void {
  for (const n of ambientNodes) {
    try {
      n.disconnect();
    } catch {
      /* noop */
    }
  }
  ambientNodes = [];
}

function startRain(ctx: AudioContext, master: GainNode): void {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;
  noise.connect(filter);
  filter.connect(master);
  noise.start();
  ambientNodes.push(noise, filter);
}

function startCafe(ctx: AudioContext, master: GainNode): void {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) * 0.98;
    data[i] = last * 3;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1200;
  const gain = ctx.createGain();
  gain.gain.value = 0.4;
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  noise.start();
  ambientNodes.push(noise, filter, gain);
}

function startForest(ctx: AudioContext, master: GainNode): void {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.6;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 400;
  bp.Q.value = 0.7;
  noise.connect(bp);
  bp.connect(master);
  noise.start();
  ambientNodes.push(noise, bp);
}

export function setAmbient(
  preset: AmbientPreset,
  enabled: boolean,
  volume: number,
): void {
  const ctx = getContext();
  disconnectAmbient();
  if (!enabled || preset === "off") {
    return;
  }
  if (!gainNode) {
    gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
  }
  gainNode.gain.value = Math.max(0, Math.min(1, volume));
  switch (preset) {
    case "rain":
      startRain(ctx, gainNode);
      break;
    case "cafe":
      startCafe(ctx, gainNode);
      break;
    case "forest":
      startForest(ctx, gainNode);
      break;
    default:
      break;
  }
}

export function stopAmbient(): void {
  disconnectAmbient();
}

export function playAlert(volume: number): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 880;
  g.gain.value = Math.max(0.05, Math.min(0.5, volume * 0.4));
  osc.connect(g);
  g.connect(ctx.destination);
  const now = ctx.currentTime;
  g.gain.setValueAtTime(g.gain.value, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc.start(now);
  osc.stop(now + 0.22);
}

export async function resumeAudioIfNeeded(): Promise<void> {
  const ctx = getContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
}
