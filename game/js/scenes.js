import { createState } from './state.js';

export function makeShowcase(name = 'title') {
  const state = createState();
  state.mode = name === 'title' ? 'title' : name === 'win' ? 'won' : 'playing';
  state.xp = 161;
  state.coins = 287;
  state.time = name === 'play' ? 85 : 94;
  state.seeds = { oat: 4, carrot: 3, tomato: 4, daisy: 3, berry: 2 };
  const crops = ['oat','carrot','tomato','daisy','pea','berry','corn','poppy','pumpkin','aster','aubergine','daisy'];
  state.plots.forEach((plot,index)=>Object.assign(plot,{open:true,crop:crops[index],watered:true,progress:[1,.68,.85,.96][index%4]}));
  state.animals = [{type:'hen',progress:1},{type:'hen',progress:.6},{type:'cow',progress:1},{type:'sheep',progress:.4},{type:'hive',progress:1}];
  state.inventory = { oat:4, carrot:3, egg:2, tomato:2, daisy:2 };
  state.completedOrders = name === 'win' ? ['bread','soup','cake','salad','bouquet'] : ['bread','soup'];
  state.harvests = 29;
  if (name === 'orders') state.panel = 'orders';
  if (name === 'shop') state.panel = 'shop';
  return state;
}
