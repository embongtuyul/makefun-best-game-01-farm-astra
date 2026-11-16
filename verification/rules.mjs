import assert from 'node:assert/strict';
import { createState } from '../game/js/state.js';
import { CROPS, updateCrops, interactPlot } from '../game/js/crops.js';
import { ANIMALS, updateAnimals, collectAnimal } from '../game/js/animals.js';
import { getWeather } from '../game/js/weather.js';
import { buySeeds, buyAnimal, sellItem, needsRescue } from '../game/js/shop.js';
import { deliverOrder } from '../game/js/orders.js';
import { ORDERS } from '../game/js/orders.js';
import { seasonSeconds, scoreOf } from '../game/js/state.js';
import { updateMarket, chooseMarketBonus, marketRates, marketChoices } from '../game/js/market.js';

const sun=getWeather(0), rain=getWeather(45), night=getWeather(140);
assert(rain.rain && rain.cropRate>sun.cropRate);
assert(night.animalRate<sun.animalRate);
assert.equal(getWeather(125).name,'Bear market');
assert.equal(CROPS[0].name,'BTC · Bitcoin');
assert.equal(CROPS[1].name,'ETH · Ethereum');
assert.equal(CROPS[2].name,'SOL · Solana');
assert.equal(CROPS[9].name,'DOGE · Dogecoin');
assert.equal(ANIMALS[0].name,'GPU rig');
assert.equal(ANIMALS[0].productName,'Hash');
assert.equal(ORDERS[0].title,'Spot sell');
for (const crop of CROPS) {
  const state=createState();
  state.xp=200;
  state.coins=1000;
  buySeeds(state,crop.id);
  state.selectedSeed=crop.id;
  interactPlot(state,0);
  updateCrops(state,crop.seconds,sun);
  assert(state.plots[0].progress<0.2);
  updateCrops(state,crop.seconds,rain);
  assert.equal(state.plots[0].watered,true);
  assert.equal(state.plots[0].progress,1);
  interactPlot(state,0);
  assert.equal(state.inventory[crop.id],1);
  const coins=state.coins;
  sellItem(state,crop.id);
  sellItem(state,crop.id);
  assert.equal(state.coins,coins+crop.sell);
}
for (const animal of ANIMALS) {
  const state=createState();
  state.xp=200;
  state.coins=1000;
  buyAnimal(state,animal.id);
  updateAnimals(state,animal.seconds,sun);
  collectAnimal(state,0);
  collectAnimal(state,0);
  assert.equal(state.inventory[animal.product],1);
}
const locked=createState();
buySeeds(locked,'melon');
assert.equal(locked.coins,85);
locked.inventory.oat=3;
deliverOrder(locked,'bread');
const reward=locked.coins;
deliverOrder(locked,'bread');
assert.equal(locked.coins,reward);
const rescue=createState();
rescue.coins=0;
rescue.seeds={};
assert(needsRescue(rescue));
console.log('PASS: all 12 crops, all 4 animals, rain watering, dry slowdown, night/storm, gates, duplicate rewards, bankruptcy recovery.');
for (const [difficulty,seconds] of [['relaxed',720],['normal',480],['rush',300]]) {
  assert.equal(seasonSeconds({...createState(),difficulty}),seconds);
}
const market=createState();
market.time=18;
updateMarket(market);
assert.equal(chooseMarketBonus(market,'growth'),true);
assert.equal(marketRates(market,sun).cropRate,1.25);
assert.equal(chooseMarketBonus(market,'seeds'),false);
market.time=160;
updateMarket(market);
assert.equal(market.dailyBonus,null);
assert.equal(marketChoices(1).length,3);
const endless=createState();
endless.endless=true;
endless.dailyBonus='orders';
let expected=85;
for (let cycle=0;cycle<2;cycle++) {
  for (const order of ORDERS) {
    for (const [id,count] of Object.entries(order.needs)) endless.inventory[id]=count;
    deliverOrder(endless,order.id);
    expected+=Math.round(order.coins*1.3);
  }
  assert.equal(endless.completedOrders.length,0);
}
assert.equal(endless.totalOrders,10);
assert.equal(endless.coins,expected);
assert(scoreOf(endless)>0);
console.log('PASS: difficulty timers, Market Day rates/once-only/expiry, endless refresh and bonus order payouts.');
