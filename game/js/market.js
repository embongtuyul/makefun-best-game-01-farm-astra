export const BONUSES = [
  {id:'growth',name:'Hashrate boost',description:'Tokens mine 25% faster today.'},
  {id:'seeds',name:'Launch allocation',description:'Three free BTC launches.'},
  {id:'orders',name:'Premium fills',description:'Trades pay 30% more today.'},
  {id:'animals',name:'Network upgrade',description:'Hardware produces 25% faster today.'},
  {id:'water',name:'Power surge',description:'Power every active bay now.'},
  {id:'flowers',name:'Meme allocation',description:'Three DOGE launches; mine at level 2.'},
  {id:'coins',name:'Market tip',description:'Receive 18 coins.'},
];
export const marketChoices = day => [0,1,2].map(offset=>BONUSES[(day*3+offset)%BONUSES.length]);
export function updateMarket(state) {
  const day=Math.floor(state.time/160);
  if (state.time>=18 && state.marketDay!==day) {
    state.marketDay=day;
    state.marketPending=true;
    state.dailyBonus=null;
  }
}
export function chooseMarketBonus(state,id) {
  if (!state.marketPending || !marketChoices(state.marketDay).some(item=>item.id===id)) return false;
  state.marketPending=false;
  state.dailyBonus=id;
  if (id==='seeds') state.seeds.oat=(state.seeds.oat||0)+3;
  if (id==='flowers') state.seeds.daisy=(state.seeds.daisy||0)+3;
  if (id==='coins') state.coins+=18;
  if (id==='water') state.plots.forEach(plot=> { if (plot.crop) plot.watered=true; });
  return true;
}
export function marketRates(state,weather) {
  return {...weather,cropRate:weather.cropRate*(state.dailyBonus==='growth'?1.25:1),animalRate:weather.animalRate*(state.dailyBonus==='animals'?1.25:1)};
}
export function marketPanel(state) {
  return `<div class="panel-head"><h2>Market Day · ${state.marketDay+1}</h2><button data-action="close">Later ×</button></div><p class="subtitle">Choose one boost for your exchange today.</p><div class="grid">${marketChoices(state.marketDay).map(item=>`<article class="item"><h3>${item.name}</h3><p>${item.description}</p><button data-action="market-choice" data-id="${item.id}">Choose gift</button></article>`).join('')}</div>`;
}
