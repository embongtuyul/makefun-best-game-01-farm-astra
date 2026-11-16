import { drawCoin } from './logos.js';
export const INK = '#456456';

export function ellipse(ctx, x, y, rx, ry, fill, stroke = INK, width = 3) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}

export function path(ctx, points, fill, stroke = INK, width = 3) {
  ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.stroke(); }
}

export function roundRect(ctx, x, y, width, height, radius, fill, stroke = INK, lineWidth = 3) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}

export function line(ctx, points, color = INK, width = 3) {
  ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function label(ctx, text, x, y, size = 15, color = INK) {
  ctx.font = `bold ${size}px Trebuchet MS, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
}

export function flower(ctx, x, y, color, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  for (let petal = 0; petal < 5; petal++) {
    const angle = petal * Math.PI * 2 / 5;
    ellipse(ctx, Math.cos(angle) * 8, Math.sin(angle) * 8, 7, 7, color, INK, 1.8);
  }
  ellipse(ctx, 0, 0, 5, 5, '#f6cf6e', INK, 1.8);
  ctx.restore();
}

export function tree(ctx, x, y, size, pink, time) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size, size);
  ellipse(ctx, 0, 5, 43, 14, '#56795728', null);
  line(ctx, [[0, 0], [0, -115]], '#6c8c85', 3);
  ctx.translate(Math.sin(time * 0.8 + x) * 3, Math.cos(time*.7+x)*.6);
  const base = pink ? '#efafc6' : '#7db781';
  const light = pink ? '#f7c9d8' : '#a6cf8e';
  roundRect(ctx,-29,-85,20,55,5,base);
  roundRect(ctx,-2,-112,20,69,5,light);
  roundRect(ctx,25,-66,20,45,5,base);
  if (pink) {
    line(ctx,[[35,-80],[35,-12]],'#bd8899',2);
  }
  ctx.restore();
}

export function building(ctx, x, y, scale, kind) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ellipse(ctx, 0, 3, 90, 23, '#45645622', null);
  const barn = kind === 'barn';
  path(ctx, [[-70,-10],[-70,-87],[35,-69],[35,14]], barn ? '#e9a09a' : '#fff0c9');
  path(ctx, [[35,14],[77,-12],[77,-87],[35,-69]], barn ? '#cd8583' : '#ddcfab');
  path(ctx, [[-82,-85],[-29,-143],[48,-122],[87,-85],[34,-60]], barn ? '#a57491' : '#df8d89');
  path(ctx, [[-82,-85],[-29,-143],[34,-110],[34,-60]], barn ? '#be8ca7' : '#f4aaa0');
  line(ctx, [[-62,-87],[-24,-125]], '#ffffff44', 4);
  roundRect(ctx, -48, -55, 36, 52, 5, barn ? '#bc7778' : '#8fbab1');
  if (barn) {
    line(ctx, [[-44,-50],[-16,-8],[-16,-50],[-44,-8]], '#ffeacb', 3);
  } else {
    ellipse(ctx, -21, -27, 2, 2, '#fff0c9', null);
  }
  roundRect(ctx, 0, -48, 22, 25, 5, '#a2d8d9');
  line(ctx, [[11,-47],[11,-24]], '#fff5d9', 2);
  line(ctx, [[1,-36],[21,-36]], '#fff5d9', 2);
  drawCoin(ctx,barn?'carrot':'oat',10,-24,13);
  if (!barn) {
    path(ctx, [[42,-119],[42,-154],[56,-150],[56,-114]], '#f2d3b0');
    ellipse(ctx, 49, -162, 9, 5, '#fff8e27a', null);
  }
  roundRect(ctx, -65, 12, 103, 24, 7, '#fff5d9');
  label(ctx, barn ? 'COLD WALLET' : 'EXCHANGE HQ', -13, 28, 10);
  ctx.restore();
}

export function drawAnimal(ctx, type, x, y, time, scale = 1) {
  ctx.save();
  ctx.translate(x, y + Math.sin(time * 2 + x) * 2);
  if (type === 'sheep') ctx.translate(0,-Math.max(0,Math.sin(time*2+x))*5);
  ctx.scale(scale, scale);
  ellipse(ctx, 0, 13, 24, 8, '#45645620', null);
  if (type === 'hen') {
    roundRect(ctx,-22,-22,43,30,6,'#b6c2cb');
    line(ctx,[[-13,-17],[-13,2],[13,2],[13,-17]],'#e9c76e',2);
    for (let bar=-7;bar<10;bar+=8) line(ctx,[[bar,-15],[bar,0]],'#6d8791',2);
    ellipse(ctx,0,-30,12,8,'#dfe9e8');
    label(ctx,'GPU',0,-28,8);
  } else if (type === 'hive') {
    roundRect(ctx, -25, -10, 50, 28, 5, '#83b8ba');
    for (let row = 0; row < 3; row++) { ellipse(ctx, -11+row*11, 3, 8, 8, '#cae3de'); }
    label(ctx,'LP',0,-17,11);
    for (let bee=0;bee<3;bee++) {
      const bx = Math.sin(time * 2+bee*2) * 31;
      const by = -34+Math.cos(time*2+bee*2)*15;
      ellipse(ctx, bx, by, 5, 4, '#f4c869', INK, 2);
      ellipse(ctx, bx - 3, by-6, 4, 3, '#fff5d9', null);
    }
  } else if (type === 'cow') {
    roundRect(ctx,-28,-17,56,27,5,'#c4d0d4');
    line(ctx,[[-19,-12],[19,4]],'#6b858f',3);
    line(ctx,[[19,-12],[-19,4]],'#6b858f',3);
    label(ctx,'ASIC',0,-24,9);
  } else if (type === 'sheep') {
    ellipse(ctx,0,-2,31,21,'#d4e3e4');
    roundRect(ctx,-22,-17,44,8,4,'#8ab2bc');
    label(ctx,'NODE',0,-11,7);
  } else if (type === 'legacy') {
    if (Math.sin(time*1.4+x)>.5) ctx.rotate(.2+Math.sin(time*7)*.1);
    path(ctx, [[-15,0],[-30,-15],[-25,5]], '#ffebcb');
    ellipse(ctx, 0, 0, 21, 16, '#fff6df');
    ellipse(ctx, 12, -15, 11, 12, '#fff6df');
    ellipse(ctx, 11, -27, 5, 4, '#ed8d8b');
    path(ctx, [[22,-17],[30,-12],[22,-9]], '#efbd65');
    ellipse(ctx, 15, -17, 2, 2, INK, null);
    ellipse(ctx, -4, 0, 9, 7, '#f5deb3', INK, 2);
    line(ctx, [[-6,14],[-6,20]], '#b4814b', 3);
    line(ctx, [[8,14],[8,20]], '#b4814b', 3);
  } else if (type === 'oldhive') {
    roundRect(ctx, -23, 6, 46, 9, 4, '#c69b65');
    for (let row = 0; row < 4; row++) ellipse(ctx, 0, 3 - row * 10, 22 - row * 3, 10, '#edc36b');
    ellipse(ctx, 2, 5, 6, 7, '#765d4c');
    for (let bee=0;bee<3;bee++) {
      const bx = Math.sin(time * 2+bee*2) * 31;
      const by = -34+Math.cos(time*2+bee*2)*15;
      ellipse(ctx, bx, by, 5, 4, '#f4c869', INK, 2);
      ellipse(ctx, bx - 3, by-6, 4, 3, '#fff5d9', null);
    }
  } else {
    for (const leg of [-17, 13]) line(ctx, [[leg,7],[leg,22]], '#7d7461', 7);
    ellipse(ctx, -2, -4, 29, 20, '#fff6df');
    if (type === 'cow') {
      line(ctx,[[-28,-7],[-39,-5],[-43+Math.sin(time*3)*7,8]],'#7d7461',3);
      ellipse(ctx, -13, -7, 9, 11, '#9caaa0', null);
      ellipse(ctx, 5, 3, 7, 7, '#9caaa0', null);
    } else {
      for (let puff = 0; puff < 7; puff++) {
        const angle = puff / 7 * Math.PI * 2;
        ellipse(ctx, Math.cos(angle) * 21 - 2, Math.sin(angle) * 14 - 6, 10, 10, '#fff6df', INK, 2);
      }
    }
    ellipse(ctx, 23, -14, 13, 16, type === 'cow' ? '#fff6df' : '#b5a49b');
    ellipse(ctx, 25, -4, 13, 8, '#efb7ad');
    ellipse(ctx, 19, -18, 2, 3, INK, null);
    ellipse(ctx, 29, -18, 2, 3, INK, null);
    ellipse(ctx, 10, -25, 8, 4, '#b5a49b');
    ellipse(ctx, 35, -25, 8, 4, '#b5a49b');
  }
  ctx.restore();
}

export function cropSprite(ctx, crop, x, y, progress, time, offset = 0, wind = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(time * 1.5 + offset) * 0.035 * wind);
  if (progress < 0.14) {
    ellipse(ctx, 0, 1, 4, 2, '#f6d28b', '#785e46', 1.5);
    ctx.restore();
    return;
  }
  const size = progress < 0.42 ? 0.5 : progress < 0.78 ? 0.78 : 1;
  ctx.scale(size, size);
  roundRect(ctx,-12,-9,24,12,3,'#c5d5ca',INK,2);
  line(ctx,[[-8,-4],[-3,-12],[2,-9],[8,-20]],'#7dbba8',3);
  if (progress >= 0.42) {
    drawCoin(ctx,crop.id,0,-25,16);
    /* The remaining branches retain the old silhouette helpers only as a
       subtle stem/chart base behind the authored coin mark. */
    if (crop.shape === 'grain') {
      for (let n = 0; n < 4; n++) {
        ellipse(ctx, -4, -24 - n * 5, 5, 3, crop.color, '#89784e', 1);
        ellipse(ctx, 4, -27 - n * 5, 5, 3, crop.color, '#89784e', 1);
      }
    } else if (crop.shape === 'root') {
      path(ctx, [[-10,-14],[11,-14],[0,6]], crop.color, INK, 2);
      line(ctx, [[0,-15],[-6,-30],[1,-23],[7,-31]], '#639b62', 3);
    } else if (crop.shape === 'pod') {
      ellipse(ctx, 0, -24, 9, 17, crop.color, INK, 2);
      line(ctx, [[0,-34],[0,-15]], '#fff5d95c', 2);
    } else {
      ellipse(ctx, 0, -15, 15, 13, crop.color, INK, 2.5);
      ellipse(ctx, -5, -20, 4, 3, '#ffffff60', null);
      line(ctx, [[0,-26],[3,-33]], '#638758', 3);
    }
  }
  ctx.restore();
}
