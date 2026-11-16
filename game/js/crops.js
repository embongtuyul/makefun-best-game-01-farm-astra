import { COINS } from './logos.js';
export const CROPS = [
  { id: 'oat', name: 'Golden oats', cost: 4, sell: 9, seconds: 9, xp: 5, level: 1, color: '#f1cd65', shape: 'grain' },
  { id: 'carrot', name: 'Peach carrot', cost: 7, sell: 15, seconds: 13, xp: 7, level: 1, color: '#f5a16d', shape: 'root' },
  { id: 'tomato', name: 'Blush tomato', cost: 11, sell: 24, seconds: 18, xp: 10, level: 2, color: '#ed8685', shape: 'round' },
  { id: 'pea', name: 'Sweet peas', cost: 14, sell: 30, seconds: 21, xp: 12, level: 2, color: '#9ccc77', shape: 'pod' },
  { id: 'berry', name: 'Heartberry', cost: 19, sell: 41, seconds: 25, xp: 15, level: 3, color: '#eb7d9b', shape: 'root' },
  { id: 'corn', name: 'Butter corn', cost: 23, sell: 49, seconds: 29, xp: 18, level: 3, color: '#f4ce65', shape: 'pod' },
  { id: 'aubergine', name: 'Velvet aubergine', cost: 29, sell: 62, seconds: 34, xp: 21, level: 4, color: '#a18ac8', shape: 'pod' },
  { id: 'pumpkin', name: 'Moon pumpkin', cost: 36, sell: 77, seconds: 40, xp: 25, level: 4, color: '#efae72', shape: 'round' },
  { id: 'melon', name: 'Mint melon', cost: 44, sell: 94, seconds: 46, xp: 29, level: 5, color: '#8bc49a', shape: 'round' },
  { id: 'daisy', name: 'Honey daisy', cost: 10, sell: 22, seconds: 17, xp: 9, level: 2, color: '#fff4c3', shape: 'flower' },
  { id: 'poppy', name: 'Coral poppy', cost: 21, sell: 45, seconds: 28, xp: 16, level: 3, color: '#f29e9e', shape: 'flower' },
  { id: 'aster', name: 'Twilight aster', cost: 33, sell: 71, seconds: 38, xp: 23, level: 4, color: '#b6a3d9', shape: 'flower' },
];
for (const crop of CROPS) {
  const [ticker,name,color]=COINS[crop.id];
  Object.assign(crop,{name:`${ticker} · ${name}`,color,shape:'coin'});
}
export const cropById = id => CROPS.find(crop => crop.id === id);

export function updateCrops(state, delta, weather) {
  for (const plot of state.plots) {
    if (!plot.crop) continue;
    const crop = cropById(plot.crop);
    if (weather.rain) plot.watered = true;
    const moistureRate = plot.watered ? 1 : 0.18;
    plot.progress = Math.min(1, plot.progress + delta * weather.cropRate * moistureRate / crop.seconds);
  }
}

export function interactPlot(state, index) {
  const plot = state.plots[index];
  if (!plot.open) return { message: 'Expand your mining floor in the shop.', sound: 'error' };
  if (!plot.crop) {
    const crop = cropById(state.selectedSeed);
    if (crop.level > Math.min(5,1+Math.floor(state.xp/45))) return {message:'This token needs a higher exchange level.',sound:'error'};
    if (!(state.seeds[crop.id] > 0)) return { message: `No ${crop.name} launches. Visit the token shop.`, sound: 'error' };
    state.seeds[crop.id]--;
    Object.assign(plot, { crop: crop.id, watered: false, progress: 0 });
    return { message: `${crop.name} mining. Tap again to power up.`, sound: 'plant', pop: 'Mining started' };
  }
  const crop = cropById(plot.crop);
  if (plot.progress >= 1) {
    state.inventory[crop.id] = (state.inventory[crop.id] || 0) + 1;
    state.xp += crop.xp;
    state.harvests++;
    Object.assign(plot, { crop: null, watered: false, progress: 0 });
    return { message: `${crop.name} → vault. Keep for trades or sell.`, sound: 'harvest', pop: `+1 coin • worth ${crop.sell}c` };
  }
  if (!plot.watered) {
    plot.watered = true;
    return { message: 'Power connected. Mining at full speed!', sound: 'water', pop: 'Powered up' };
  }
  return { message: `${crop.name}: ${Math.ceil((1 - plot.progress) * crop.seconds)} mining seconds to go.`, sound: 'tap' };
}
