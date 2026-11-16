import { getSettings, DIFFICULTIES } from './settings.js';
export const SESSION_SECONDS = 480;
export const seasonSeconds = state => DIFFICULTIES[state.difficulty || 'normal'].seconds;
const BEST_KEY = 'petalpost-best-v1';
const SAVE_KEY = 'petalpost-save-v1';

export function createState() {
  return {
    version: 1, mode: 'title', time: 0, coins: 85, xp: 0,
    difficulty:getSettings().difficulty, endless:false, totalOrders:0,
    marketDay:-1, marketPending:false, dailyBonus:null, tutorialStep:null,
    seeds: { oat: 6, carrot: 4 }, inventory: {}, selectedSeed: 'oat',
    plots: Array.from({ length: 12 }, (_, id) => ({ id, open: id < 6, crop: null, progress: 0, watered: false })),
    animals: [], completedOrders: [], harvests: 0, sold: 0,
    panel: null, shopTab: 'seeds', selectedPlot: -1, muted: false,
  };
}

export const levelOf = state => Math.min(5, 1 + Math.floor(state.xp / 45));
export const scoreOf = state => Math.round((state.coins + state.xp * 3 + (state.totalOrders || state.completedOrders.length) * 150 + (state.endless ? 0 : Math.max(0, seasonSeconds(state) - state.time) * 2)) * DIFFICULTIES[state.difficulty || 'normal'].multiplier);

export function getBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}

export function finishSession(state, won) {
  state.mode = won ? 'won' : 'lost';
  state.panel = null;
  if (won) {
    try { localStorage.setItem(BEST_KEY, String(Math.max(getBest(), scoreOf(state)))); } catch { /* Private browsing still plays. */ }
  }
  try { localStorage.removeItem(SAVE_KEY); } catch { /* Storage is optional. */ }
}

export function saveSession(state) {
  if (!['playing', 'paused'].includes(state.mode)) return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, mode: 'playing', panel: null })); } catch { /* Full storage must not interrupt play. */ }
}

export function loadSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!saved || saved.version !== 1 || saved.mode !== 'playing') return null;
    if (saved.difficulty && !DIFFICULTIES[saved.difficulty]) return null;
    if (!Number.isFinite(saved.time) || saved.time < 0 || (!saved.endless && saved.time >= seasonSeconds(saved))) return null;
    if (!Number.isFinite(saved.coins) || saved.coins < 0 || !Number.isFinite(saved.xp) || saved.xp < 0) return null;
    if (!Array.isArray(saved.plots) || saved.plots.length !== 12 || !Array.isArray(saved.animals) || saved.animals.length > 8) return null;
    if (!saved.seeds || !saved.inventory || !Array.isArray(saved.completedOrders)) return null;
    if (new Set(saved.completedOrders).size !== saved.completedOrders.length || saved.completedOrders.some(id => !['bread','soup','cake','salad','bouquet'].includes(id))) return null;
    const crops = ['oat','carrot','tomato','pea','berry','corn','aubergine','pumpkin','melon','daisy','poppy','aster'];
    if (!crops.includes(saved.selectedSeed)) return null;
    if (saved.plots.some(plot => !plot || (plot.crop && !crops.includes(plot.crop)) || !Number.isFinite(plot.progress) || plot.progress < 0 || plot.progress > 1)) return null;
    if (saved.animals.some(animal => !['hen','cow','sheep','hive'].includes(animal.type) || !Number.isFinite(animal.progress) || animal.progress < 0 || animal.progress > 1)) return null;
    if ([...Object.values(saved.seeds), ...Object.values(saved.inventory)].some(value => !Number.isInteger(value) || value < 0)) return null;
    return { ...createState(), ...saved, panel: null, selectedPlot: -1 };
  } catch { return null; }
}
