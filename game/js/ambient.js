import { ellipse, roundRect, line, path, label, tree } from './art.js';
import { drawCoin } from './logos.js';

const route = [[435,570],[653,607],[896,543],[1045,580],[896,543],[653,607]];

function villager(ctx, time) {
  time=Math.max(0,time);
  const segment = Math.floor(time / 9) % route.length;
  const progress = Math.min(1, (time % 9) / 6.5);
  const from = route[segment], to = route[(segment + 1) % route.length];
  const x = from[0] + (to[0] - from[0]) * progress;
  const y = from[1] + (to[1] - from[1]) * progress;
  const walking = progress < 1;
  const swing = walking ? Math.sin(time * 8) * 6 : 0;
  ctx.save();
  ctx.translate(x, y + (walking ? Math.abs(Math.sin(time * 8)) * -2 : 0));
  ellipse(ctx,0,4,17,6,'#45645625',null);
  line(ctx,[[-5,-12],[-7+swing,3]],'#655e61',6);
  line(ctx,[[5,-12],[7-swing,3]],'#655e61',6);
  roundRect(ctx,-12,-38,24,28,8,'#a8c2d3');
  line(ctx,[[-12,-30],[-17-swing,-17]],'#efc8a8',5);
  line(ctx,[[12,-30],[19+swing,walking ? -18 : -44+Math.sin(time*5)*5]],'#efc8a8',5);
  ellipse(ctx,0,-48,13,14,'#f7d9b7');
  ellipse(ctx,0,-60,18,5,'#e6c679');
  roundRect(ctx,-10,-72,20,12,5,'#e6c679');
  ellipse(ctx,-4,-49,1.5,2,'#456456',null);
  ellipse(ctx,5,-49,1.5,2,'#456456',null);
  line(ctx,[[-3,-42],[3,-41],[6,-43]],'#b47e77',1.5);
  roundRect(ctx,-19,-22,13,16,3,'#f1bd69');
  ctx.restore();
}

function cart(ctx, time) {
  const phase = time % 40;
  if (phase > 15) return;
  const x = -110 + phase / 15 * 1500;
  const y = 650;
  ctx.save();
  ctx.translate(x,y);
  ellipse(ctx,0,19,65,10,'#45645620',null);
  roundRect(ctx,-48,-16,90,31,9,'#e8b95e');
  roundRect(ctx,5,-40,36,30,8,'#fff0cd');
  roundRect(ctx,12,-35,23,18,4,'#a2d8d9',null);
  for (const wheel of [-30,30]) {
    ellipse(ctx,wheel,17,12,12,'#658073');
    ellipse(ctx,wheel,17,5,5,'#e5d6ae',null);
    line(ctx,[[wheel+Math.cos(time*8)*8,17+Math.sin(time*8)*8],[wheel-Math.cos(time*8)*8,17-Math.sin(time*8)*8]],'#e5d6ae',2);
  }
  for (let i=0;i<3;i++) drawCoin(ctx,['oat','carrot','tomato'][i],-34+i*15,-19,9);
  label(ctx,'COIN CART',-4,4,9);
  ctx.restore();
}

export function drawLivingLandmarks(ctx, time) {
  for (const [x,y,size,pink] of [[71,257,1.2,true],[180,199,.88,false],[347,218,1.25,true],[1048,265,.85,false],[1207,279,1.25,true],[85,580,1.12,false],[153,624,.93,true],[1237,590,.9,false]]) tree(ctx,x,y,size,pink,time);
  // A living duck overlay leaves the inexpensive pond itself cached.
  const x = 284 + Math.sin(time * .24) * 27;
  const y = 451 + Math.cos(time * .3) * 7;
  ellipse(ctx,x-4,y+6,22,8,'#b9e6df',null);
  drawCoin(ctx,'tomato',x,y-4,15);
}

export function drawAmbientSky(ctx,time) {
  ctx.save();
  ctx.globalAlpha=.32;
  for (let i=0;i<4;i++) {
    const x=(i*370+time*5)%1500-110;
    const y=110+(i%2)*43;
    ellipse(ctx,x,y,55,14,'#fff9df',null);
    ellipse(ctx,x-17,y-10,23,17,'#fff9df',null);
    ellipse(ctx,x+13,y-14,27,20,'#fff9df',null);
  }
  ctx.restore();
  if (time%28<12) {
    for (let i=0;i<4;i++) {
      const x=(time%28)*120-100-i*29, y=172+i*13+Math.sin(time*3+i)*3;
      const wing=Math.sin(time*9+i)*7;
      line(ctx,[[x-8,y-wing],[x,y],[x+8,y-wing]],'#66827a',2);
    }
  }
}

export function drawAmbientGround(ctx,time,weather,seasonTime) {
  // The road stays below the beds and above the menu dock.
  line(ctx,[[0,650],[1280,650]],'#dfd4a7',29);
  line(ctx,[[449,574],[491,588]],'#b18b66',6);
  line(ctx,[[450,562],[493,576]],'#d7b383',10);
  line(ctx,[[455,571],[451,586]],'#89785e',4);
  line(ctx,[[487,581],[483,595]],'#89785e',4);
  villager(ctx,time);
  cart(ctx,time);
  if (weather.rain) {
    for (let i=0;i<9;i++) {
      const x=280+i*95, y=570+(i%3)*16;
      ellipse(ctx,x,y,19,5,'#9dc8bd66',null);
      const phase=(time*2+i*.3)%1;
      ctx.save();
      ctx.globalAlpha=1-phase;
      ellipse(ctx,x+4,y,3+phase*10,1+phase*3,'#ffffff00','#e7f4df',1.5);
      ctx.restore();
    }
  }
  // Weather alternates at 40 seconds; sunshine after rain gets a short rainbow.
  if (!weather.rain && seasonTime>=80 && seasonTime%80<17) {
    ctx.save();
    ctx.globalAlpha=.25*(1-seasonTime%80/17);
    ['#e7a0a2','#efd48b','#aad19a','#9dcfd0','#c0b3d7'].forEach((color,index)=> {
      ctx.beginPath();
      ctx.arc(650,291,145-index*8,Math.PI,Math.PI*2);
      ctx.strokeStyle=color;
      ctx.lineWidth=8;
      ctx.stroke();
    });
    ctx.restore();
  }
}
