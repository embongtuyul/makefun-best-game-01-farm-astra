import { CROPS } from './crops.js';
import { ANIMALS } from './animals.js';
import { ORDERS, canDeliver } from './orders.js';
import { levelOf, getBest, scoreOf, seasonSeconds } from './state.js';
import { getSettings, DIFFICULTIES, settingsPanel } from './settings.js';
import { marketPanel } from './market.js';
import { tutorialMarkup } from './tutorial.js';
import { themeVisibleText } from './theme.js';
import { itemName, itemValue, needsRescue } from './shop.js';
import { getWeather, formatTime } from './weather.js';

const hud = document.querySelector('#hud');
const toolbar = document.querySelector('#toolbar');
const overlay = document.querySelector('#overlay');
let toastUntil = 0;

const button = (text, action, attributes = '') => `<button data-action="${action}" ${attributes}>${text}</button>`;

export function showToast(message) {
  document.querySelector('#toast').textContent = message;
  toastUntil = performance.now() + 3200;
}

function titleScreen(hasSave) {
  return `<section class="title-card">
    <div class="eyebrow">Mine with CZ & the BNB buddy</div>
    <h1>Coinfield<br>Exchange<span style="color:#d6908e">.</span></h1>
    <p>Market close is coming.<br>Mine coins. Power your network.<br>Settle five trades for your listing.</p>
    <div class="difficulty">${Object.entries(DIFFICULTIES).map(([id,item])=>button(`${item.name} · ${item.seconds/60}m`,'difficulty',`data-id="${id}" class="${getSettings().difficulty===id?'selected':''}"`)).join('')}</div>
    ${button('Start mining  →', 'start', 'class="primary"')}
    ${hasSave ? button('Continue exchange', 'continue') : ''}
    <div class="title-actions">${button('Free Trade','free-farm')}${button('⚙ Settings','settings')}</div>
    <p class="fine">Mine · power · harvest · trade<br>Choose a session, or trade without a timer</p>
  </section>`;
}

function shopPanel(state) {
  const level = levelOf(state);
  let content;
  if (state.shopTab === 'animals') {
    content = ANIMALS.map(animal => `<article class="item ${animal.level > level ? 'locked' : ''}">
      <h3>${animal.name}</h3><p>${animal.productName} every ${animal.seconds}s<br>Sell ${animal.sell}c · level ${animal.level}</p>
      ${button(`Install · ${animal.cost}c`, 'buy-animal', `data-id="${animal.id}" ${animal.level > level || state.coins < animal.cost || state.animals.length >= 8 ? 'disabled' : ''}`)}
    </article>`).join('');
    content += '<article class="item"><h3>Meme momentum</h3><p>Each mining DOGE, PEPE or SHIB boosts liquidity pools 15%. Hardware upkeep is automatic.</p></article>';
  } else if (state.shopTab === 'land') {
    const count = state.plots.filter(plot => plot.open).length;
    const price = 35 + (count - 6) * 15;
    content = `<article class="item"><h3>Another mining bay</h3><p>${count}/12 open · one token per bay<br>Expand your trading floor.</p>${button(`Expand · ${price}c`, 'buy-plot', count >= 12 || state.coins < price ? 'disabled' : '')}</article>`;
  } else {
    content = CROPS.map(crop => `<article class="item ${crop.level > level ? 'locked' : ''}">
      <h3><span style="color:${crop.color}">●</span> ${crop.name}</h3>
      <p>${crop.seconds}s · sells ${crop.sell}c · ${crop.xp} XP<br>${crop.level > level ? `Unlocks at level ${crop.level}` : `${state.seeds[crop.id] || 0} launches ready`}</p>
      ${button(`3 launches · ${crop.cost * 3}c`, 'buy-seed', `data-id="${crop.id}" ${crop.level > level || state.coins < crop.cost * 3 ? 'disabled' : ''}`)}
    </article>`).join('');
  }
  return `<div class="panel-head"><h2>Token & Hardware Market</h2>${button('Close ×','close')}</div>
    <p class="subtitle">Build your little network. Balance: <b>${state.coins} coins</b></p>
    <div class="tabs">${['seeds','animals','land'].map(tab => button({seeds:'Tokens',animals:'Hardware',land:'Bays'}[tab],'shop-tab',`data-id="${tab}" class="${state.shopTab===tab ? 'selected' : ''}"`)).join('')}</div>
    <div class="grid">${content}</div>`;
}

function ordersPanel(state) {
  return `<div class="panel-head"><h2>The trade desk</h2>${button('Close ×','close')}</div>
    <p class="subtitle">Settle all five trades before market close. Orders pay more than spot sales!<br>Mined assets stay in your vault until you choose to sell or trade them.</p>
    ${ORDERS.map(order => {
      const done = state.completedOrders.includes(order.id);
      const needs = Object.entries(order.needs).map(([id,count]) => `${itemName(id)} ${(state.inventory[id] || 0)}/${count}`).join(' + ');
      const reward=Math.round(order.coins*(state.dailyBonus==='orders'?1.3:1));
      return `<article class="order"><div class="portrait">${order.face}</div><div class="details"><small>${order.villager}</small><h3>${order.title}</h3><p>${done ? 'Trade settled ✓' : needs}</p></div><div>${button(done ? 'Confirmed ✓' : `Trade · +${reward}c`,'deliver',`data-id="${order.id}" ${done || !canDeliver(state,order) ? 'disabled' : ''}`)}<p style="text-align:center;margin-top:7px">+${order.xp} XP</p></div></article>`;
    }).join('')}`;
}

function barnPanel(state) {
  const items = Object.entries(state.inventory).filter(([,count])=>count>0);
  return `<div class="panel-head"><h2>Cold-wallet vault</h2>${button('Close ×','close')}</div>
    <p class="subtitle">Mined assets are stored here. Reserve trade requirements; sell surplus for launches.</p>
    <div class="grid">${items.length ? items.map(([id,count]) => `<article class="item"><h3>${itemName(id)}</h3><p>${count} stored · ${itemValue(id)}c each</p>${button(`Sell ${count} · +${count*itemValue(id)}c`,'sell',`data-id="${id}"`)}</article>`).join('') : '<article class="item"><h3>Room for good things</h3><p>Tap a ripe crop or an animal’s produce bubble. It will be waiting here.</p></article>'}</div>`;
}

function helpPanel() {
  return `<div class="panel-head"><h2>A little field guide</h2>${button('Close ×','close')}</div>
    <p>CZ and the BNB buddy work alongside you. Tap a bay to send CZ mining, powering or harvesting. Your action resolves immediately while he walks over.</p>
    <p>Choose a seed, then tap an empty bed to plant. Tap again to water. When the checkmark appears, tap to harvest. Harvests go to the barn; sell them there or send them to villagers.</p>
    <div class="order"><div class="details"><h3>Your lovely little mission</h3><p>Deliver all five picnic orders in eight minutes. Buy a Cloud hen for eggs. Gain XP through harvesting and orders to unlock tomatoes and daisies at level 2. A hen costs 48 coins; leave room in your budget!</p></div></div>
    <p>Rain waters every bed and speeds crops. Night slows growth. Flowers help bees. Menus keep the farm running; pause stops the season clock.</p>
    <div class="order"><p><b>Keyboard:</b> arrows select a bed · Space acts · [ / ] cycle seeds<br>S shop · B barn · O orders · H help · P pause · M mute · Esc close/pause<br>Enter starts/restarts · Tab and Enter operate every menu button.</p></div>
    <p>Tap the mailbox for orders, barn for inventory, market for the shop. There’s no spoilage, and an emergency seed gift prevents bankruptcy.</p>`;
}

function resultScreen(state) {
  const won = state.mode === 'won';
  return `<div class="veil"><section class="panel result">
    <div class="eyebrow">${won ? 'Five trades. A network connected.' : 'The market is closing'}</div>
    <div class="medal">${won ? '✿' : '☾'}</div>
    <h2>${won ? 'Your listing is live.' : 'The next session awaits.'}</h2>
    <p>${won ? 'All five trades are settled. Your small exchange is ready for a bigger world.' : `You settled ${state.completedOrders.length} of 5 trades. Mine early, reserve assets, and install a GPU rig next session.`}</p>
    <div class="score"><div><small>Farm score</small><strong>${won ? scoreOf(state) : state.xp*3+state.coins}</strong></div><div><small>Coins left</small><strong>${state.coins}</strong></div><div><small>Best</small><strong>${getBest()}</strong></div></div>
    <p>${state.harvests} harvests · level ${levelOf(state)} · ${formatTime(state.time)} played</p>
    ${button('Start another session  →','start','class="primary"')}
    ${won ? button('Free Trade →','free-farm') : ''}
  </section></div>`;
}

export function renderUI(state, hasSave) {
  if (state.settingsOpen) {
    updateHTML(overlay,`<div class="veil"><section class="panel" role="dialog" aria-label="Settings">${settingsPanel()}</section></div>`);
    return;
  }
  document.querySelector('#toast').classList.toggle('visible', performance.now() < toastUntil && state.mode !== 'title');
  if (state.mode === 'title') {
    hud.innerHTML = '';
    toolbar.innerHTML = '';
    updateHTML(overlay,titleScreen(hasSave));
    return;
  }
  const weather = getWeather(state.time);
  const level = levelOf(state);
  const ready = ORDERS.filter(order=>canDeliver(state,order)).length;
  updateHTML(hud, `<div class="hud-left"><div class="pill level"><b>◎ Level ${level} · ${level===5 ? 'Market maker' : 'Token miner'}</b><div class="xp"><span style="width:${level===5?100:state.xp%45/45*100}%"></span></div></div><div class="pill weather"><b>${weather.icon} ${weather.name} · ${weather.phase}</b><div>${weather.description}</div></div></div>
    <div class="hud-right"><div class="pill coins">◉ ${state.coins}</div>${button('⚙','settings','class="icon-button" aria-label="Settings"')}${button(state.muted?'♪ Off':'♪ On','mute','class="icon-button" aria-label="Toggle sound"')}${button('Ⅱ','pause','class="icon-button" aria-label="Pause game"')}</div>
    <div class="pill quest"><small>${state.endless?'Free Trade':'Exchange listing'}</small><strong>${state.completedOrders.length} / 5 trades settled</strong><p>${state.endless?`No deadline · score ${scoreOf(state)}`:`${formatTime(Math.max(0,seasonSeconds(state)-state.time))} until market close`}</p><div class="xp"><span style="width:${state.completedOrders.length*20}%"></span></div><p>Next market: ${weather.next}</p>${state.marketPending?button('Market Day · gift','market'):''}</div>
    <div class="hint">Tap: mine → power → harvest · Arrows + Space also work</div>`);
  const seeds = CROPS.filter(crop=>level>=crop.level && (state.seeds[crop.id] || 0)>0);
  updateHTML(toolbar, `<div class="seed-strip">${seeds.map(crop=>button(`${crop.name} · ${state.seeds[crop.id]}`,'select-seed',`data-id="${crop.id}" class="${state.selectedSeed===crop.id?'selected':''}"`)).join('')}${!seeds.length?button('Buy seeds →','shop'):''}</div>
    <nav class="bottom" aria-label="Exchange menus">${button('▧ Vault','barn')}${button(`✉ Trades${ready ? ` · ${ready} ready` : ''}`,'orders')}${button('◎ Shop','shop','class="primary"')}${button('? Guide','help')}${needsRescue(state)?button('Gift: 3 BTC launches','rescue'):''}</nav>`);
  if (['won','lost'].includes(state.mode)) updateHTML(overlay,resultScreen(state));
  else if (state.mode === 'paused') updateHTML(overlay,`<div class="veil"><section class="panel result"><div class="eyebrow">Take a little breath</div><h2>Your exchange can wait.</h2><p>The session clock is paused.</p>${button('Back to the exchange','pause','class="primary"')} ${button('Start fresh','start')}</section></div>`);
  else if (state.panel) {
    const content = state.panel==='market' ? marketPanel(state) : state.panel==='shop' ? shopPanel(state) : state.panel==='orders' ? ordersPanel(state) : state.panel==='barn' ? barnPanel(state) : helpPanel();
    updateHTML(overlay,`<div class="veil"><section class="panel" role="dialog" aria-label="${state.panel}">${content}</section></div>`);
  } else updateHTML(overlay,tutorialMarkup(state));
}

function updateHTML(element, html) {
  // Preserve focus and scroll position while progress counters update.
  if (element._lastHTML === html) return;
  const focused = element.contains(document.activeElement) ? document.activeElement : null;
  const action = focused?.dataset.action;
  const id = focused?.dataset.id;
  const scrollTop = element.querySelector('.panel')?.scrollTop || 0;
  element.innerHTML = html;
  themeVisibleText(element);
  element._lastHTML = html;
  const panel = element.querySelector('.panel');
  if (panel) panel.scrollTop = scrollTop;
  if (action) {
    const replacement = [...element.querySelectorAll('button')].find(node=>node.dataset.action===action && node.dataset.id===id);
    replacement?.focus({preventScroll:true});
  }
}
