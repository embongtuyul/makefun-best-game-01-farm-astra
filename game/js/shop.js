import { cropById, CROPS } from './crops.js';
import { ANIMALS, animalById } from './animals.js';
import { levelOf } from './state.js';

export function buySeeds(state, id) {
  const crop = cropById(id);
  if (!crop || crop.level > levelOf(state) || state.coins < crop.cost * 3) return { message: 'Need more coins or a higher exchange level.', sound: 'error' };
  state.coins -= crop.cost * 3;
  state.seeds[id] = (state.seeds[id] || 0) + 3;
  state.selectedSeed = id;
  return { message: `Three ${crop.name} launches ready to mine.`, sound: 'buy' };
}

export function buyAnimal(state, id) {
  const type = animalById(id);
  if (!type || state.coins < type.cost || levelOf(state) < type.level || state.animals.length >= 8) return { message: 'Check coins, level and hardware space (8 units).', sound: 'error' };
  state.coins -= type.cost;
  state.animals.push({ type: id, progress: 0 });
  return { message: `${type.name} installed! Tap its bubble to collect output.`, sound: 'buy' };
}

export function buyPlot(state) {
  const plot = state.plots.find(item => !item.open);
  const price = 35 + (state.plots.filter(item => item.open).length - 6) * 15;
  if (!plot || state.coins < price) return { message: plot ? 'Save a few more coins for this bay.' : 'Every bay is yours!', sound: 'error' };
  state.coins -= price;
  plot.open = true;
  state.xp += 8;
  return { message: 'Another mining bay is online.', sound: 'buy' };
}

export const itemName = id => cropById(id)?.name || ANIMALS.find(animal => animal.product === id)?.productName || id;
export const itemValue = id => cropById(id)?.sell || ANIMALS.find(animal => animal.product === id)?.sell || 0;

export function sellItem(state, id) {
  const count = state.inventory[id] || 0;
  if (!count) return { message: 'The vault is empty here. Mine something first.', sound: 'error' };
  const earned = count * itemValue(id);
  state.inventory[id] = 0;
  state.coins += earned;
  state.sold += count;
  return { message: `Sold ${count} ${itemName(id)} for ${earned} coins.`, sound: 'coins', pop: `+${earned} coins` };
}

export function needsRescue(state) {
  return state.coins < CROPS[0].cost * 3 && !Object.values(state.seeds).some(count => count > 0) && !state.plots.some(plot => plot.crop) && !Object.values(state.inventory).some(count => count > 0) && !state.animals.length;
}
