import { hitPlot,hitAnimal } from './render.js';
import { farmerSnapshot } from './farmer.js';
import { cropById } from './crops.js';
import { animalById } from './animals.js';
import { getWeather } from './weather.js';
import { marketRates } from './market.js';
import { drawCoin } from './logos.js';
const buildings=[
  {id:'hq',name:'Exchange HQ',role:'Settle five trades for your listing.',x:527,y:210,w:90,h:90,panel:'orders'},
  {id:'vault',name:'Cold Wallet',role:'Store and sell your mined assets.',x:829,y:200,w:70,h:75,panel:'barn'},
  {id:'server',name:'Server tower',role:'The network hub for your mining floor.',x:1006,y:200,w:38,h:70,panel:'shop'},
  {id:'market',name:'Token Market',role:'Buy launches, hardware and mining bays.',x:1130,y:530,w:70,h:80,panel:'shop'},
  {id:'pool',name:'Liquidity pool',role:'Meme-token momentum supports LP hardware.',x:288,y:471,w:137,h:71,panel:'shop'},
];
let inspect=false,detail=null,anchor={x:0,y:0};
let card,controls;
export function inspectSnapshot() { return {inspect,detail:detail?{...detail}:null}; }
export function closeDetail() { detail=null; }
export function toggleInspect() { inspect=!inspect; detail=null; }
export function resetDetails() { inspect=false; detail=null; }
export function inspectAt(state,point,client) {
  const farmer=farmerSnapshot();
  anchor={x:client.clientX,y:client.clientY};
  if (Math.abs(point.x-farmer.x)<23 && point.y>farmer.y-83 && point.y<farmer.y+10) detail={kind:'farmer',id:'cz'};
  else if (Math.abs(point.x-farmer.buddyX)<28 && point.y>farmer.buddyY-48 && point.y<farmer.buddyY+8) detail={kind:'buddy',id:'bnb'};
  else {
    const plot=hitPlot(point.x,point.y),producer=hitAnimal(state,point.x,point.y);
    const building=buildings.find(item=>Math.abs(point.x-item.x)<item.w && Math.abs(point.y-item.y)<item.h);
    detail=plot>=0?{kind:'plot',id:plot}:producer>=0?{kind:'producer',id:producer}:building?{kind:'building',id:building.id}:null;
  }
}
function content(state) {
  const rates=marketRates(state,getWeather(state.time));
  if (detail.kind==='plot') {
    const plot=state.plots[detail.id],coin=cropById(plot.crop);
    if (!coin) return `<h3>${plot.open?'Empty bay — tap to mine':'Locked mining bay'}</h3><p>${plot.open?'Turn Detail off to start mining.':'Expand through the Token Market.'}</p>`;
    const stage=plot.progress<.14?1:plot.progress<.42?2:plot.progress<.78?3:4;
    const seconds=Math.ceil((1-plot.progress)*coin.seconds/(rates.cropRate*(plot.watered?1:.18)));
    return `<canvas id="detail-logo" width="52" height="52" aria-label="${coin.name} logo"></canvas><h3>${coin.name}</h3><p>Stage ${stage}/4 · ${Math.floor(plot.progress*100)}%<br>${seconds}s until ready at current rate<br>${plot.watered?'Powered':'Unpowered · 18% speed'}<br>Sell ${coin.sell} coins · ${coin.xp} XP on harvest</p>`;
  }
  if (detail.kind==='producer') {
    const unit=state.animals[detail.id],type=animalById(unit.type);
    const bonus=type.id==='hive'?1+state.plots.filter(plot=>['daisy','poppy','aster'].includes(plot.crop)).length*.15:1;
    return `<h3>${type.name}</h3><p>Produces ${type.productName}<br>${Math.floor(unit.progress*100)}% · ${Math.ceil((1-unit.progress)*type.seconds/(rates.animalRate*bonus))}s until ready<br>Product value ${type.sell} coins<br>Requires level ${type.level}</p>`;
  }
  if (detail.kind==='building') {
    const building=buildings.find(item=>item.id===detail.id);
    return `<h3>${building.name}</h3><p>${building.role}</p><button data-action="detail-shortcut" data-id="${building.panel}">Open ${ {orders:'Trades',barn:'Vault',shop:'Shop'}[building.panel]}</button>`;
  }
  if (detail.kind==='buddy') return '<h3>BNB buddy</h3><p>A small diamond with a big smile. Always one step behind CZ.</p>';
  const farmer=farmerSnapshot();
  return `<h3>CZ</h3><p>Your miner — walks to every bay you tap.<br>Action: ${farmer.action}<br>Target: ${farmer.targetPlot===null?'Standing by':`bay ${farmer.targetPlot+1}`}</p>`;
}
export function renderDetails(state) {
  if (!controls) {
    controls=document.createElement('nav'); controls.id='camera-controls'; controls.setAttribute('aria-label','Camera and inspection'); document.body.append(controls);
    card=document.createElement('aside'); card.id='element-detail'; card.setAttribute('role','dialog'); card.setAttribute('aria-label','Element details');
    card.innerHTML='<button class="detail-close" data-action="detail-close" aria-label="Close details">×</button><div class="detail-content"></div>';
    document.body.append(card);
  }
  const visible=state.mode==='playing'&&!state.panel&&!state.settingsOpen;
  controls.hidden=!visible;
  const buttons=`<button data-action="zoom-in" aria-label="Zoom in">+</button><button data-action="zoom-out" aria-label="Zoom out">−</button><button data-action="zoom-reset" aria-label="Reset zoom">⤢</button><button data-action="inspect" aria-pressed="${inspect}" class="${inspect?'selected':''}">🔍 Detail</button>`;
  if (controls.innerHTML!==buttons) controls.innerHTML=buttons;
  card.hidden=!visible||!detail;
  if (card.hidden) return;
  const html=content(state);
  if (card._html!==html) { card.querySelector('.detail-content').innerHTML=html; card._html=html; }
  if (detail.kind==='plot' && state.plots[detail.id].crop) drawCoin(card.querySelector('canvas').getContext('2d'),state.plots[detail.id].crop,26,26,23);
  const bounds=document.querySelector('#stage').getBoundingClientRect();
  const left=Math.max(8,bounds.left),right=Math.min(innerWidth-8,bounds.right);
  const top=Math.max(8,bounds.top),bottom=Math.min(innerHeight-8,bounds.bottom);
  card.style.width=`${Math.min(270,right-left)}px`;
  card.style.maxHeight=`${Math.max(80,bottom-top)}px`;
  card.style.left=`${Math.max(left,Math.min(anchor.x+16,right-card.offsetWidth))}px`;
  card.style.top=`${Math.max(top,Math.min(anchor.y-35,bottom-card.offsetHeight))}px`;
}
