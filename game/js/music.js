// A deterministic pentatonic phrase generator. Scheduling uses the audio clock,
// never animation frames, so busy menus and low frame rates do not stretch notes.
let timer;
let nextBeat = 0;
let beat = 0;
let scheduledNotes = 0;
const scale = [0, 2, 4, 7, 9, 12, 14, 16];
const roots = [48, 45, 41, 43];
const frequency = midi => 440 * 2 ** ((midi - 69) / 12);

function voice(context, bus, midi, start, duration, volume, type) {
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency(midi);
  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(volume, start + 0.12);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(envelope).connect(bus);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
  oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  scheduledNotes++;
}

export function startMusic(context, bus) {
  if (timer) return;
  nextBeat = context.currentTime + 0.08;
  const schedule = () => {
    if (context.state !== 'running') return;
    if (nextBeat < context.currentTime - 0.5) nextBeat = context.currentTime + 0.04;
    while (nextBeat < context.currentTime + 0.4) {
      const bar = Math.floor(beat / 8);
      if (beat % 2 === 0 || beat % 8 === 7) {
        const step = (beat * 3 + Math.floor(beat / 8) * 2) % scale.length;
        voice(context, bus, 60 + scale[step], nextBeat, 1.5, 0.12, 'sine');
      }
      if (beat % 8 === 0) {
        const root = roots[bar % roots.length];
        voice(context, bus, root, nextBeat, 6.8, 0.09, 'sine');
        voice(context, bus, root + 7, nextBeat, 6.4, 0.035, 'triangle');
      }
      beat++;
      nextBeat += 60 / 76;
    }
  };
  schedule();
  timer = setInterval(schedule, 120);
}

export function musicStatus() { return { started: !!timer, scheduledNotes }; }
