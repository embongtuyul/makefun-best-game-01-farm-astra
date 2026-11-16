import { ellipse, path, roundRect, line, label, tree, building, drawAnimal, cropSprite, flower, INK } from './art.js';
import { cropById } from './crops.js';
import { animalById } from './animals.js';
import { drawEffects } from './effects.js';
import { getWeather } from './weather.js';
import { drawAmbientSky, drawAmbientGround, drawLivingLandmarks } from './ambient.js';
import { drawCoin } from './logos.js';
import { drawFarmer } from './farmer.js';

export function plotPosition(index) {
  const row = Math.floor(index / 4);
  const column = index % 4;
  return { x: 615 + (column - row) * 83, y: 305 + (column + row) * 42 };
}

export function animalPosition(index) {
  return { x: 940 + (index % 3) * 76 - Math.floor(index / 3) * 18, y: 370 + Math.floor(index / 3) * 65 + (index % 3) * 15 };
}

export function hitPlot(x, y) {
  for (let index = 11; index >= 0; index--) {
    const point = plotPosition(index);
    if (Math.abs(x - point.x) / 76 + Math.abs(y - point.y) / 38 < 1) return index;
  }
  return -1;
}

export function hitAnimal(state, x, y) {
  return state.animals.findIndex((_, index) => {
    const point = animalPosition(index);
    return Math.abs(x - point.x) < 36 && y > point.y - 66 && y < point.y + 25;
  });
}

function fence(ctx, x1, y1, x2, y2, sections) {
  line(ctx, [[x1,y1-12],[x2,y2-12]], '#fff1cd', 9);
  line(ctx, [[x1,y1-25],[x2,y2-25]], '#fff1cd', 8);
  for (let i = 0; i <= sections; i++) {
    const x = x1 + (x2 - x1) * i / sections;
    const y = y1 + (y2 - y1) * i / sections;
    roundRect(ctx, x - 5, y - 37, 10, 41, 4, '#fff1cd', '#78976c', 2);
  }
}

function pond(ctx, time) {
  ellipse(ctx, 288, 471, 137, 71, '#e4d3a0', '#90b880', 4);
  ellipse(ctx, 288, 467, 121, 58, '#8cd4d9', '#679d9c', 3);
  ellipse(ctx, 270, 450, 92, 31, '#a2dfe0', null);
  for (let i = 0; i < 4; i++) {
    line(ctx, [[218+i*39,473+(i%2)*15],[235+i*39+Math.sin(time+i)*5,473+(i%2)*15]], '#d6f2df', 3);
  }
  ellipse(ctx, 211, 458, 18, 8, '#8fbc80', INK, 2);
  drawCoin(ctx,'tomato',210,452,12);
  ellipse(ctx, 334, 493, 20, 9, '#8fbc80', INK, 2);
  drawCoin(ctx,'carrot',335,486,12);
  label(ctx,'LIQUIDITY',288,474,15);
  for (const [x,y] of [[175,483],[371,435],[384,464]]) {
    line(ctx, [[x,y],[x-4,y-30],[x,y],[x+8,y-24]], '#6b9865', 4);
    line(ctx, [[x-4,y-31],[x-4,y-40]], '#ab855a', 5);
  }
}

function windmill(ctx, x, y, time) {
  roundRect(ctx,x-28,y-112,56,112,9,'#a2b8c5');
  for (let row=0;row<5;row++) {
    roundRect(ctx,x-20,y-100+row*19,40,12,3,'#4f727c');
    ellipse(ctx,x+12,y-94+row*19,2,2,'#9cdec1',null);
  }
  label(ctx,'SERVER',x,y+16,10);
  return;
  path(ctx, [[x-29,y],[x-21,y-92],[x+21,y-92],[x+34,y]], '#fff0c9');
  path(ctx, [[x-31,y-91],[x,y-129],[x+32,y-91]], '#b39cc4');
  roundRect(ctx, x-10,y-30,20,30,8,'#8db9b5');
  ctx.save();
  ctx.translate(x,y-82);
  ctx.rotate(time * 0.17);
  for (let arm = 0; arm < 4; arm++) {
    ctx.rotate(Math.PI / 2);
    path(ctx, [[4,7],[14,47],[-1,54],[-7,12]], '#fff6df', INK, 2.5);
    line(ctx, [[-2,19],[8,17]], '#d1c5a3', 2);
    line(ctx, [[0,31],[12,29]], '#d1c5a3', 2);
  }
  ellipse(ctx,0,0,8,8,'#d2aa77');
  ctx.restore();
}

function market(ctx) {
  const x = 1130, y = 564;
  roundRect(ctx,x-59,y-35,118,42,7,'#d1a478');
  line(ctx,[[x-51,y-34],[x-51,y-103]],'#8a7958',6);
  line(ctx,[[x+51,y-34],[x+51,y-103]],'#8a7958',6);
  path(ctx,[[x-67,y-77],[x-48,y-111],[x+47,y-111],[x+67,y-77]],'#f4aaa0');
  for (let stripe = 0; stripe < 4; stripe++) {
    path(ctx,[[x-48+stripe*27,y-111],[x-35+stripe*27,y-111],[x-35+stripe*31,y-77],[x-50+stripe*31,y-77]],'#fff1cf',null);
  }
  line(ctx,[[x-67,y-77],[x+67,y-77]],INK,3);
  for (let fruit = 0; fruit < 5; fruit++) ellipse(ctx,x-40+fruit*20,y-40,8,7,fruit%2 ? '#f4c76d' : '#ef9a91',INK,2);
  roundRect(ctx,x-48,y-19,96,24,6,'#fff5d9');
  label(ctx,'TOKEN MARKET',x,y-3,10);
}

function drawBackground(ctx, time) {
  ctx.fillStyle = '#acd695';
  ctx.fillRect(0,0,1280,720);
  path(ctx,[[0,135],[210,67],[448,110],[671,45],[931,110],[1280,58],[1280,0],[0,0]],'#89bfae',null);
  path(ctx,[[0,212],[196,153],[393,177],[571,115],[825,169],[1055,114],[1280,156],[1280,0],[0,0]],'#9bcba9',null);
  // A single broad looping path keeps the farm's landmarks legible.
  line(ctx,[[112,268],[340,311],[511,229],[803,269],[1167,309]],'#91b67d',55);
  line(ctx,[[112,266],[340,309],[511,227],[803,267],[1167,307]],'#e6d5a2',47);
  line(ctx,[[340,309],[432,379],[433,538],[653,607],[896,543],[1160,590]],'#e6d5a2',39);
  for (let i = 0; i < 130; i++) {
    const x = (i * 173 + 41) % 1280;
    const y = (i * 97 + 121) % 720;
    line(ctx,[[x-3,y+3],[x,y-2],[x+3,y+2]],'#78ae713e',2);
  }
  for (let i = 0; i < 27; i++) {
    const x = (i * 197 + 70) % 1260;
    const y = 165 + (i * 139) % 465;
    if (x > 430 && x < 920 && y > 260 && y < 570) continue;
    roundRect(ctx,x-3,y-6,6,12,2,i%2?'#e5c77c':'#96bcba',null);
  }
  fence(ctx, 80, 257, 293, 297, 5);
  fence(ctx, 850, 296, 1173, 345, 7);
  fence(ctx, 1173, 345, 1184, 489, 3);
  building(ctx,527,245,0.95,'home');
  building(ctx,829,236,0.84,'barn');
  windmill(ctx,1006,239,time);
  pond(ctx,time);
  market(ctx);
  // Mailbox and watering well are also direct shortcuts into the farm menus.
  line(ctx,[[403,301],[403,258]],'#876e52',8);
  roundRect(ctx,382,239,43,28,9,'#79aeb7');
  line(ctx,[[414,248],[414,230],[426,230]],'#fff2cf',3);
  ellipse(ctx,360,360,25,12,'#8fb7bb');
  roundRect(ctx,335,338,50,22,5,'#7d9fa8');
  ellipse(ctx,360,338,25,11,'#a8c8cb');
  ellipse(ctx,360,338,16,6,'#65a8a1',INK,2);
  line(ctx,[[337,338],[337,303],[383,303],[383,338]],'#a1845b',5);
  path(ctx,[[328,307],[357,289],[392,306]],'#e5c46b');
  // Hay, pebbles, and a stationary scarecrow make the plot edge feel inhabited.
  roundRect(ctx,894,264,37,21,7,'#edcf7b');
  line(ctx,[[906,265],[906,284],[919,284],[919,265]],'#b39154',2);
  ellipse(ctx,451,569,16,6,'#ddd8b6',null);
  ellipse(ctx,475,579,10,5,'#ddd8b6',null);
  line(ctx,[[866,520],[866,470]],'#8c7656',5);
  line(ctx,[[844,481],[891,481]],'#8c7656',5);
  path(ctx,[[854,475],[878,475],[883,498],[851,498]],'#efab9c');
  ellipse(ctx,866,461,13,13,'#f8dfb4');
  ellipse(ctx,866,451,22,5,'#dbb871');
  roundRect(ctx,855,437,22,15,5,'#dbb871');
  ellipse(ctx,861,461,1.5,2,INK,null);
  ellipse(ctx,872,461,1.5,2,INK,null);
}

function drawPlots(ctx, state, time) {
  for (const [index, plot] of state.plots.entries()) {
    const { x, y } = plotPosition(index);
    const points = [[x,y-35],[x+72,y],[x,y+35],[x-72,y]];
    path(ctx,points.map(([px,py])=>[px,py+7]),plot.open ? '#936e4d' : '#8aae77',INK,2.5);
    path(ctx,points,plot.open ? plot.watered ? '#7da9ab' : '#acbec4' : '#b8d0c5',plot.open ? '#56757b' : '#90b19d',3);
    if (!plot.open) {
      label(ctx,'+',x,y+5,22,'#7da36c');
      continue;
    }
    for (const offset of [-23,0,23]) {
      line(ctx,[[x-41+offset*.5,y-11-offset*.25],[x+5+offset*.5,y+12-offset*.25]],'#875d4440',2);
    }
    if (state.selectedPlot === index) {
      ctx.setLineDash([7,5]);
      path(ctx,[[x,y-39],[x+78,y],[x,y+39],[x-78,y]],'#ffffff08','#fff4c4',3);
      ctx.setLineDash([]);
    }
    if (plot.crop) {
      const crop = cropById(plot.crop);
      const wind = getWeather(state.time).rain ? 1.7 : 1;
      for (const [dx,dy] of [[0,-10],[-28,3],[28,3],[0,17]]) cropSprite(ctx,crop,x+dx,y+dy,plot.progress,time,index+dx,wind);
      if (plot.progress >= 1) {
        ellipse(ctx,x,y-54+Math.sin(time*3+index)*2,15,13,'#fff3bd',INK,2);
        label(ctx,'✓',x,y-49+Math.sin(time*3+index)*2,17);
      } else {
        roundRect(ctx,x-20,y+24,40,5,3,'#6c5749',null);
        roundRect(ctx,x-20,y+24,Math.max(2,plot.progress*40),5,3,plot.watered ? '#a4d7d1' : '#e8c87c',null);
        if (!plot.watered) label(ctx,'↓',x,y-43,20,'#eff9ee');
      }
    } else label(ctx,'·  ·  ·',x,y+5,15,'#f4d9ac');
  }
}

function drawPasture(ctx, state, time) {
  if (!state.animals.length) {
    drawAnimal(ctx,'hen',970,387,time,0.9);
    roundRect(ctx,930,410,150,27,11,'#fff5d9',INK,2);
    label(ctx,'Hardware floor',1005,428,12);
  }
  for (const [index, animal] of state.animals.entries()) {
    const { x, y } = animalPosition(index);
    drawAnimal(ctx,animal.type,x,y,time,animal.type==='hen' ? 1.1 : 1);
    if (animal.progress >= 1) {
      roundRect(ctx,x-26,y-66,52,26,12,'#fff5d9',INK,2);
      label(ctx,animalById(animal.type).productName,x,y-49,11);
    } else {
      roundRect(ctx,x-20,y+28,40,4,2,'#7aa46e',null);
      roundRect(ctx,x-20,y+28,Math.max(1,animal.progress*40),4,2,'#fff0c9',null);
    }
  }
}

function drawAtmosphere(ctx, time, weather) {
  if (weather.tint) {
    const wash = ctx.createLinearGradient(0,0,0,720);
    wash.addColorStop(0,`rgba(${weather.washColor},${weather.tint})`);
    wash.addColorStop(1,`rgba(79,87,131,${weather.tint*.55})`);
    ctx.fillStyle = wash;
    ctx.fillRect(0,0,1280,720);
  }
  if (weather.rain) {
    for (let i = 0; i < 65; i++) {
      const x = (i * 193 - time * 65 % 1400 + 1400) % 1400;
      const y = (i * 83 + time * 330) % 740;
      line(ctx,[[x,y],[x-5,y+13]],'#eefbff7a',2);
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const x = 180 + (i*231 + Math.sin(time*.24+i)*45) % 1000;
      const y = 300 + Math.cos(time*.4+i*2)*150;
      ellipse(ctx,x-3,y,4,Math.abs(Math.sin(time*9+i))*5+1,'#fff0c9',null);
      ellipse(ctx,x+3,y,4,Math.abs(Math.sin(time*9+i))*5+1,'#f3b4cc',null);
    }
  }
}

let backgroundLayer;
export function renderFarm(ctx, state, animationTime) {
  ctx.clearRect(0,0,1280,720);
  ctx.save();
  if (state.mode === 'title') {
    ctx.translate(640+Math.sin(animationTime*.1)*6,360+Math.cos(animationTime*.12)*3);
    ctx.scale(1.025,1.025);
    ctx.translate(-640,-360);
  }
  if (!backgroundLayer) {
    backgroundLayer=document.createElement('canvas');
    backgroundLayer.width=1280;
    backgroundLayer.height=720;
    drawBackground(backgroundLayer.getContext('2d'),2.6);
  }
  ctx.drawImage(backgroundLayer,0,0);
  drawAmbientSky(ctx,animationTime);
  drawLivingLandmarks(ctx,animationTime);
  drawPlots(ctx,state,animationTime);
  drawPasture(ctx,state,animationTime);
  fence(ctx,915,526,1064,552,4);
  drawAmbientGround(ctx,animationTime,getWeather(state.time),state.time);
  drawAtmosphere(ctx,animationTime,getWeather(state.time));
  drawFarmer(ctx,animationTime);
  drawEffects(ctx);
  ctx.restore();
  if (state.mode === 'title') {
    roundRect(ctx,899,599,273,37,15,'#fff5d9',INK,2);
    label(ctx,'Small coins. A connected world.',1035,624,16);
  }
}
