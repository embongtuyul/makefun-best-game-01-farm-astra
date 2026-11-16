import { getSettings } from './settings.js';
import { startMusic, musicStatus } from './music.js';
let context;
let masterBus;
let musicBus;
let sfxBus;

export function applyAudioSettings() {
  if (!context) return;
  const settings = getSettings();
  masterBus.gain.setTargetAtTime(settings.muted ? 0 : settings.master, context.currentTime, 0.03);
  musicBus.gain.setTargetAtTime(settings.music, context.currentTime, 0.03);
  sfxBus.gain.setTargetAtTime(settings.sfx, context.currentTime, 0.03);
}

export function unlockAudio() {
  try {
    if (!context) {
      context = new (window.AudioContext || window.webkitAudioContext)();
      masterBus = context.createGain();
      musicBus = context.createGain();
      sfxBus = context.createGain();
      musicBus.connect(masterBus);
      sfxBus.connect(masterBus);
      masterBus.connect(context.destination);
      applyAudioSettings();
    }
    if (context.state === 'suspended') context.resume();
    startMusic(context, musicBus);
  } catch { /* The farm remains playable without WebAudio. */ }
}

export function audioStatus() {
  return { context: context?.state || 'not-created', ...musicStatus(), settings: getSettings() };
}
const melodies = {
  plant: [330, 440], water: [520, 650, 780], harvest: [523, 659, 784],
  coins: [784, 988, 1175], order: [523, 659, 784, 1047],
  buy: [392, 523, 659], error: [220, 196], tap: [440], win: [523, 659, 784, 1047, 1319],
};

export function playSound(name, muted) {
  unlockAudio();
  if (muted || getSettings().muted || !context) return;
  try {
    if (context.state === 'suspended') context.resume();
    for (const [index, frequency] of (melodies[name] || melodies.tap).entries()) {
      const start = context.currentTime + index * 0.075;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = name === 'water' ? 'sine' : 'triangle';
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.065, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.24);
      oscillator.connect(gain).connect(sfxBus);
      oscillator.start(start);
      oscillator.stop(start + 0.25);
    }
  } catch { /* Sound is an enhancement; unsupported audio is harmless. */ }
}
