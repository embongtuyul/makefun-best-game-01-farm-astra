const KEY = 'petalpost-settings-v2';
const defaults = { master: 0.75, music: 0.4, sfx: 0.7, muted: false, difficulty: 'normal' };
export const DIFFICULTIES = {
  relaxed: { name: 'Relaxed', seconds: 720, multiplier: 0.8 },
  normal: { name: 'Normal', seconds: 480, multiplier: 1 },
  rush: { name: 'Rush', seconds: 300, multiplier: 1.5 },
};
let preferences = { ...defaults };
try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  for (const key of ['master', 'music', 'sfx']) {
    if (Number.isFinite(saved?.[key])) preferences[key] = Math.max(0, Math.min(1, saved[key]));
  }
  if (typeof saved?.muted === 'boolean') preferences.muted = saved.muted;
  if (DIFFICULTIES[saved?.difficulty]) preferences.difficulty = saved.difficulty;
} catch { /* Missing or damaged preferences use safe defaults. */ }

export function getSettings() { return { ...preferences }; }
export function setSetting(key, value) {
  if (['master','music','sfx'].includes(key)) {
    const number = Number(value);
    if (!Number.isFinite(number)) return;
    preferences[key] = Math.max(0, Math.min(1, number));
  } else if (key === 'muted') preferences.muted = !!value;
  else if (key === 'difficulty' && DIFFICULTIES[value]) preferences.difficulty = value;
  else return;
  try { localStorage.setItem(KEY, JSON.stringify(preferences)); } catch { /* Optional storage. */ }
}

export function settingsPanel() {
  return `<div class="panel-head"><h2>Make yourself at home</h2><button data-action="close-settings">Close ×</button></div>
    <p class="subtitle">A soft tune for a small exchange. Your choices are saved on this device.</p>
    ${['master','music','sfx'].map(key => `<label class="volume-row"><span>${key === 'sfx' ? 'Sound effects' : key[0].toUpperCase()+key.slice(1)}</span><input aria-label="${key} volume" data-volume="${key}" type="range" min="0" max="1" step="0.01" value="${preferences[key]}"><output>${Math.round(preferences[key]*100)}%</output></label>`).join('')}
    <button data-action="mute">${preferences.muted ? 'Unmute sound' : 'Mute sound'}</button>`;
}
