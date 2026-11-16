import { createState, loadSession, saveSession, levelOf, finishSession, seasonSeconds } from './state.js';
import { updateCrops, interactPlot, CROPS } from './crops.js';
import { updateAnimals, collectAnimal } from './animals.js';
import { getWeather } from './weather.js';
import { deliverOrder, ORDERS } from './orders.js';
import { buySeeds, buyAnimal, buyPlot, sellItem, needsRescue } from './shop.js';
import { renderFarm, plotPosition, animalPosition } from './render.js';
import { renderUI, showToast } from './ui.js';
import { playSound, unlockAudio, applyAudioSettings, audioStatus } from './audio.js';
import { addPopup, addBurst, updateEffects, clearEffects } from './effects.js';
import { getSettings, setSetting } from './settings.js';
import { updateMarket, chooseMarketBonus, marketRates } from './market.js';
import { beginTutorial, advanceTutorial } from './tutorial.js';
import { fitStage } from './responsive.js';
import { bindInput } from './input.js';
import { makeShowcase } from './scenes.js';
import { resetFarmer, routeFarmer, updateFarmer, farmerSnapshot } from './farmer.js';
import { cameraSnapshot,zoomCamera,resetCamera,updateCamera } from './camera.js';
import { inspectSnapshot,toggleInspect,closeDetail,resetDetails,renderDetails } from './details.js';

const canvas = document.querySelector('#farm');
const context = canvas.getContext('2d');
const shot = new URLSearchParams(location.search).get('shot');
let state = makeShowcase('title');
let saved = loadSession();
let lastFrame = performance.now();
let accumulator = 0;
let animationTime = 0;
let uiElapsed = 0;
let saveElapsed = 0;
if (['title','play','orders','shop','win'].includes(shot)) state = makeShowcase(shot);

function feedback(result, point = {x:640,y:330}) {
  if (!result) return;
  showToast(result.message);
  playSound(result.sound,state.muted);
  if (result.pop) addPopup(point.x,point.y-45,result.pop);
  if (result.sound==='harvest') addBurst(point.x,point.y-25,point.x>=900?'heart':'sparkle');
}

function startSession() {
  const muted = state.muted;
  state = createState();
  state.mode = 'playing';
  beginTutorial(state);
  state.muted = muted;
  accumulator = 0;
  clearEffects();
  resetFarmer();
  resetCamera(); resetDetails();
  showToast('Welcome! Mine BTC, power your bays, and open Trades to settle your listing.');
  saveSession(state);
  canvas.focus({preventScroll:true});
}

function dispatch(action, id) {
  unlockAudio();
  if (action==='zoom-in') { zoomCamera(1.25); return; }
  if (action==='zoom-out') { zoomCamera(.8); return; }
  if (action==='zoom-reset') { resetCamera(); return; }
  if (action==='inspect') { toggleInspect(); renderDetails(state); return; }
  if (action==='detail-close') { closeDetail(); renderDetails(state); return; }
  if (action==='detail-shortcut') { closeDetail(); state.panel=id; renderUI(state,!!saved); renderDetails(state); return; }
  if (action==='settings') { state.settingsOpen=true; renderUI(state,!!saved); return; }
  if (action==='close-settings') { state.settingsOpen=false; renderUI(state,!!saved); return; }
  if (action==='difficulty') { setSetting('difficulty',id); state.difficulty=id; renderUI(state,!!saved); return; }
  if (action==='free-farm') {
    if (state.mode!=='won') startSession();
    state.endless=true; state.mode='playing'; state.completedOrders=[]; state.panel=null;
    saveSession(state); renderUI(state,!!saved); return;
  }
  if (action === 'mute') { setSetting('muted',!getSettings().muted); state.muted=getSettings().muted; applyAudioSettings(); renderUI(state,!!saved); return; }
  if (action === 'start') { startSession(); renderUI(state,!!saved); return; }
  if (action === 'continue' && saved) { state = saved; state.muted=getSettings().muted; saved = null; renderUI(state,false); return; }
  if (action === 'blur') {
    if (state.mode==='playing' && !shot) { state.mode='paused'; saveSession(state); }
    renderUI(state,!!saved);
    return;
  }
  if (action === 'pause') {
    if (state.mode==='playing') state.mode='paused';
    else if (state.mode==='paused') state.mode='playing';
    renderUI(state,!!saved);
    return;
  }
  if (state.mode!=='playing') return;
  if (state.settingsOpen) return;
  const oldLevel = levelOf(state);
  if (['shop','barn','orders','help','market'].includes(action)) state.panel=action;
  else if (action==='market-choice') { if (chooseMarketBonus(state,id)) { state.panel=null; showToast('A little kindness, just for today.'); } }
  else if (action==='dismiss-tutorial') state.tutorialStep=null;
  else if (action==='close') { state.panel=null; canvas.focus({preventScroll:true}); }
  else if (action==='shop-tab') state.shopTab=id;
  else if (action==='select-seed') state.selectedSeed=id;
  else if (action==='previous-seed' || action==='next-seed') {
    const seeds = CROPS.filter(crop=>(state.seeds[crop.id]||0)>0);
    if (seeds.length) {
      const index = seeds.findIndex(crop=>crop.id===state.selectedSeed);
      state.selectedSeed=seeds[(index+(action==='next-seed'?1:-1)+seeds.length)%seeds.length].id;
    }
  }
  else if (action==='plot') {
    state.selectedPlot=Number(id);
    const coin=state.plots[Number(id)].crop || state.selectedSeed;
    const result=interactPlot(state,Number(id));
    const point=plotPosition(Number(id));
    feedback(result,point);
    if (['plant','water','harvest'].includes(result.sound)) routeFarmer(Number(id),point,result.sound,coin);
  }
  else if (action==='animal') feedback(collectAnimal(state,Number(id)),animalPosition(Number(id)));
  else if (action==='collect-all') state.animals.forEach((animal,index)=> { if (animal.progress>=1) feedback(collectAnimal(state,index),animalPosition(index)); });
  else if (action==='buy-seed') feedback(buySeeds(state,id));
  else if (action==='buy-animal') feedback(buyAnimal(state,id));
  else if (action==='buy-plot') feedback(buyPlot(state));
  else if (action==='sell') feedback(sellItem(state,id));
  else if (action==='deliver') feedback(deliverOrder(state,id));
  else if (action==='rescue' && needsRescue(state)) { state.seeds.oat=3; feedback({message:'The launch desk sent three BTC launches. Your exchange gets another chance.',sound:'buy'}); }
  if (levelOf(state)>oldLevel) showToast(`Level ${levelOf(state)}! New tokens and hardware are waiting in the shop.`);
  advanceTutorial(state,action);
  if (!state.endless && state.completedOrders.length===ORDERS.length) {
    finishSession(state,true);
    resetCamera(); resetDetails();
    playSound('win',state.muted);
  }
  saveSession(state);
  renderUI(state,!!saved);
}

function simulationStep(delta) {
  if (state.mode!=='playing' || shot) return;
  state.time += delta;
  updateMarket(state);
  const weather = marketRates(state,getWeather(state.time));
  updateCrops(state,delta,weather);
  updateAnimals(state,delta,weather);
  if (!state.endless && state.time>=seasonSeconds(state)) finishSession(state,false);
}

function frame(now) {
  // Keep low-frame-rate devices on real season time. Background tabs pause explicitly.
  const delta = Math.max(0,Math.min((now-lastFrame)/1000,1));
  lastFrame=now;
  accumulator += delta;
  while (accumulator>=1/30) { simulationStep(1/30); accumulator-=1/30; }
  if (state.mode!=='paused') { animationTime+=delta; updateEffects(delta); }
  updateFarmer(shot ? 1 : delta,state.mode,!!shot && !!state.panel);
  updateCamera(delta);
  renderFarm(context,state,shot ? 2.6 : animationTime);
  uiElapsed+=delta;
  saveElapsed+=delta;
  if (uiElapsed>.15) { renderUI(state,!!saved); renderDetails(state); uiElapsed=0; }
  if (saveElapsed>3) { if (!shot) saveSession(state); saveElapsed=0; }
  requestAnimationFrame(frame);
}

bindInput(canvas,()=>state,dispatch);
fitStage();
state.muted=getSettings().muted;
document.addEventListener('pointerdown',unlockAudio,{once:true});
document.addEventListener('keydown',unlockAudio,{once:true});
document.addEventListener('input',event=> {
  if (!event.target.dataset.volume) return;
  setSetting(event.target.dataset.volume,event.target.value);
  applyAudioSettings();
  event.target.nextElementSibling.textContent=`${Math.round(Number(event.target.value)*100)}%`;
});
// This diagnostic hook returns a copy only. Playtests cannot mutate the simulation.
Object.defineProperty(window,'petalpost',{ value: Object.freeze({ snapshot:()=>JSON.parse(JSON.stringify({...state,farmer:farmerSnapshot(),camera:cameraSnapshot(),...inspectSnapshot()})), audio:audioStatus }) });
window.addEventListener('beforeunload',()=> { if (!shot) saveSession(state); });
renderUI(state,!!saved);
requestAnimationFrame(frame);
