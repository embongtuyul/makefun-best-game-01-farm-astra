export const ORDERS = [
  { id: 'bread', villager: 'Spot desk', title: 'Spot sell', needs: { oat: 3 }, coins: 46, xp: 20, face: 'S' },
  { id: 'soup', villager: 'Futures desk', title: 'Futures position', needs: { carrot: 2 }, coins: 47, xp: 22, face: 'F' },
  { id: 'cake', villager: 'OTC broker', title: 'OTC block deal', needs: { egg: 2 }, coins: 55, xp: 25, face: 'O' },
  { id: 'salad', villager: 'Whale desk', title: 'Whale order', needs: { tomato: 2, carrot: 1 }, coins: 93, xp: 28, face: 'W' },
  { id: 'bouquet', villager: 'Airdrop desk', title: 'Community airdrop', needs: { daisy: 2, oat: 1 }, coins: 81, xp: 30, face: 'A' },
];

export function canDeliver(state, order) {
  return !state.completedOrders.includes(order.id) && Object.entries(order.needs).every(([id, count]) => (state.inventory[id] || 0) >= count);
}

export function deliverOrder(state, id) {
  const order = ORDERS.find(item => item.id === id);
  if (!order || !canDeliver(state, order)) return { message: 'Grow and collect the requested goods first.', sound: 'error' };
  for (const [item, count] of Object.entries(order.needs)) state.inventory[item] -= count;
  state.completedOrders.push(order.id);
  state.totalOrders=(state.totalOrders||0)+1;
  const reward=Math.round(order.coins*(state.dailyBonus==='orders'?1.3:1));
  state.coins += reward;
  state.xp += order.xp;
  if (state.endless && state.completedOrders.length===ORDERS.length) state.completedOrders=[];
  return { message: `${order.villager}: “Trade settled!” +${reward} coins`, sound: 'order', pop: `+${reward} coins` };
}
