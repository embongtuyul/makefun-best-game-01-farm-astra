import { ellipse, roundRect, line, path, label } from './art.js';
import { drawCoin } from './logos.js';
import { addBurst } from './effects.js';

// Presentation state is deliberately independent of inventory and simulation saves.
let farmer;
export function resetFarmer() {
  farmer={x:875,y:555,fromX:875,fromY:555,toX:875,toY:555,
    buddyX:914,buddyY:570,targetPlot:null,action:'idle',coin:'oat',
    elapsed:0,duration:.5,workTime:0,facing:-1,celebrating:false};
}
resetFarmer();
export function farmerSnapshot() { return {...farmer}; }

export function routeFarmer(index,point,action,coin) {
  farmer.fromX=farmer.x;
  farmer.fromY=farmer.y;
  farmer.toX=Math.max(70,Math.min(1200,point.x+32));
  farmer.toY=Math.max(100,Math.min(650,point.y+32));
  farmer.duration=.4+Math.min(1,Math.hypot(farmer.toX-farmer.x,farmer.toY-farmer.y)/450)*.3;
  farmer.facing=farmer.toX<farmer.x?-1:1;
  farmer.targetPlot=index;
  farmer.action=action;
  farmer.coin=coin || 'oat';
  farmer.elapsed=0;
  farmer.workTime=0;
  farmer.celebrating=false;
}

export function updateFarmer(delta,mode,presentationPanel = false) {
  if (mode==='paused') return;
  if (presentationPanel && farmer.targetPlot===null) {
    farmer.x=farmer.toX=1100;
    farmer.y=farmer.toY=430;
    farmer.buddyX=1140; farmer.buddyY=445;
  }
  if (mode==='won') {
    if (!farmer.celebrating) {
      // Outside the result card, so the main character remains visible.
      farmer.x=farmer.toX=945; farmer.y=farmer.toY=555;
      farmer.action='celebrate'; farmer.celebrating=true;
      addBurst(945,470);
    }
    farmer.workTime+=delta;
  } else if (farmer.celebrating) {
    farmer.action='idle'; farmer.celebrating=false;
  } else if (farmer.elapsed<farmer.duration && farmer.targetPlot!==null) {
    farmer.elapsed=Math.min(farmer.duration,farmer.elapsed+delta);
    const t=farmer.elapsed/farmer.duration;
    const eased=t*t*(3-2*t);
    farmer.x=farmer.fromX+(farmer.toX-farmer.fromX)*eased;
    farmer.y=farmer.fromY+(farmer.toY-farmer.fromY)*eased;
    if (t===1) addBurst(farmer.x-22,farmer.y-20);
  } else {
    farmer.workTime+=delta;
    if (farmer.workTime>.8) farmer.action='idle';
  }
  const follow=1-Math.exp(-delta*7);
  farmer.buddyX+=(farmer.x-farmer.facing*39-farmer.buddyX)*follow;
  farmer.buddyY+=(farmer.y+15-farmer.buddyY)*follow;
}

function drawBuddy(ctx,x,y,time) {
  ctx.save(); ctx.translate(x,y+Math.sin(time*4)*2);
  ellipse(ctx,0,3,17,5,'#45645625',null);
  line(ctx,[[-7,-7],[-10,1]],'#655f44',3);
  line(ctx,[[7,-7],[10,1]],'#655f44',3);
  path(ctx,[[0,-43],[19,-24],[0,-5],[-19,-24]],'#f5cf4c','#4c5545',3);
  ellipse(ctx,-5,-25,1.8,2.3,'#39433b',null);
  ellipse(ctx,5,-25,1.8,2.3,'#39433b',null);
  line(ctx,[[-4,-18],[0,-16],[5,-19]],'#39433b',2);
  line(ctx,[[14,-20],[23,-15]],'#665e38',3);
  drawCoin(ctx,'pea',25,-14,8);
  ctx.restore();
}

export function drawFarmer(ctx,time) {
  const moving=farmer.targetPlot!==null && farmer.elapsed<farmer.duration;
  const working=!moving && ['plant','water','harvest'].includes(farmer.action);
  const celebrate=farmer.action==='celebrate';
  const swing=moving?Math.sin(time*14)*7:0;
  const bend=working?Math.sin(Math.min(1,farmer.workTime/.8)*Math.PI):0;
  drawBuddy(ctx,farmer.buddyX,farmer.buddyY,time);
  ctx.save(); ctx.translate(farmer.x,farmer.y);
  ellipse(ctx,0,3,20,6,'#45645630',null);
  ctx.translate(0,celebrate?-Math.abs(Math.sin(time*7))*9:moving?-Math.abs(Math.sin(time*14))*2:Math.sin(time*2)*.7);
  line(ctx,[[-6,-18],[-7+swing,-3]],'#343b46',7);
  line(ctx,[[6,-18],[7-swing,-3]],'#343b46',7);
  roundRect(ctx,-13+swing,-5,12,7,3,'#292d32','#3e4646',2);
  roundRect(ctx,3-swing,-5,12,7,3,'#292d32','#3e4646',2);
  ctx.translate(-bend*7,bend*8);
  ctx.rotate(-bend*.18);
  ellipse(ctx,0,-43,14,11,'#33383d','#35423e',3);
  roundRect(ctx,-14,-45,28,30,7,'#24292e','#35423e',3);
  line(ctx,[[0,-42],[0,-18]],'#a2a5a2',1.5);
  path(ctx,[[7,-38],[11,-34],[7,-30],[3,-34]],'#f2c943',null);
  line(ctx,[[-5,-20],[-10,-20]],'#646b6b',1.5);
  const armY=celebrate?-67:working?-24+bend*8:-22;
  line(ctx,[[-12,-38],[-21-swing,armY]],'#282e33',7);
  line(ctx,[[12,-38],[21+swing,armY]],'#282e33',7);
  ellipse(ctx,-21-swing,armY,4,4,'#f0cdb1','#46534b',2);
  ellipse(ctx,21+swing,armY,4,4,'#f0cdb1','#46534b',2);
  ellipse(ctx,0,-60,14,17,'#f4d7bb','#35423e',3);
  path(ctx,[[-14,-63],[-13,-75],[-5,-80],[6,-79],[14,-73],[13,-63],[7,-70],[-1,-72],[-9,-67]],'#24292c','#35423e',3);
  line(ctx,[[2,-77],[-2,-70]],'#63605a',1.6);
  roundRect(ctx,-12,-64,10,8,2,'#fff3df66','#24292c',2.5);
  roundRect(ctx,2,-64,10,8,2,'#fff3df66','#24292c',2.5);
  line(ctx,[[-2,-61],[2,-61]],'#24292c',2);
  ellipse(ctx,-6+farmer.facing,-60,1.3,1.6,'#333b37',null);
  ellipse(ctx,6+farmer.facing,-60,1.3,1.6,'#333b37',null);
  line(ctx,[[-4,-50],[1,-48],[6,-51]],'#9d7060',1.7);
  if (working && farmer.action==='water') {
    roundRect(ctx,-32,-24,15,13,3,'#a1c7c9','#456456',2);
    line(ctx,[[-31,-18],[-41,-11]],'#6b969c',4);
    for (let drop=0;drop<4;drop++) ellipse(ctx,-42-drop*2,-10+((time*35+drop*6)%20),1.7,3,'#a8e4d9',null);
  } else if (working) {
    drawCoin(ctx,farmer.coin,-26,-15-(farmer.action==='harvest'?farmer.workTime*28:0),9);
    ellipse(ctx,-29,-2,8+bend*5,3,'#e9d4a570',null);
  }
  ctx.restore();
  if (celebrate) for (let i=0;i<5;i++) drawCoin(ctx,['oat','pea'][i%2],farmer.x-40+i*19,farmer.y-120+((time*35+i*13)%62),5);
  label(ctx,'CZ',farmer.x,farmer.y+20,12);
}
