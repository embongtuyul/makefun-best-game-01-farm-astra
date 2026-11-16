export const ANIMALS = [
  { id: 'hen', name: 'GPU rig', product: 'egg', productName: 'Hash', cost: 48, seconds: 16, sell: 13, level: 1, xp: 7 },
  { id: 'cow', name: 'ASIC miner', product: 'milk', productName: 'Block reward', cost: 115, seconds: 24, sell: 27, level: 2, xp: 11 },
  { id: 'sheep', name: 'Staking node', product: 'wool', productName: 'Stake yield', cost: 165, seconds: 31, sell: 38, level: 3, xp: 15 },
  { id: 'hive', name: 'Liquidity pool', product: 'honey', productName: 'LP fees', cost: 210, seconds: 36, sell: 47, level: 4, xp: 18 },
];
export const animalById = id => ANIMALS.find(animal => animal.id === id);

export function updateAnimals(state, delta, weather) {
  const flowers = state.plots.filter(plot => ['daisy', 'poppy', 'aster'].includes(plot.crop)).length;
  for (const animal of state.animals) {
    const type = animalById(animal.type);
    const flowerBonus = type.id === 'hive' ? 1 + flowers * 0.15 : 1;
    animal.progress = Math.min(1, animal.progress + delta * weather.animalRate * flowerBonus / type.seconds);
  }
}

export function collectAnimal(state, index) {
  const animal = state.animals[index];
  if (!animal) return { message: 'Install hardware from the shop.', sound: 'tap' };
  const type = animalById(animal.type);
  if (animal.progress < 1) return { message: `${type.name} is processing. Output will appear above it.`, sound: 'tap' };
  animal.progress = 0;
  state.inventory[type.product] = (state.inventory[type.product] || 0) + 1;
  state.xp += type.xp;
  return { message: `${type.productName} stored in the vault.`, pop: `+1 ${type.productName}`, sound: 'harvest' };
}
