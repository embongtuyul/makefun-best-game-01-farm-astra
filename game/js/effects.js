const particles = [];
const sparks = [];
export function addBurst(x,y,kind='sparkle') {
  for (let index=0;index<12;index++) {
    const angle=index/12*Math.PI*2;
    sparks.push({x,y,age:0,vx:Math.cos(angle)*35,vy:Math.sin(angle)*25-25,kind,index});
  }
}
export function addPopup(x, y, text) {
  particles.push({ x, y, text, age: 0 });
}
export function updateEffects(delta) {
  for (const particle of particles) particle.age += delta;
  while (particles.length && particles[0].age > 1.8) particles.shift();
  for (const spark of sparks) spark.age+=delta;
  while (sparks.length && sparks[0].age>1.5) sparks.shift();
}
export function drawEffects(ctx) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = 'bold 18px Trebuchet MS';
  for (const spark of sparks) {
    ctx.globalAlpha=Math.max(0,1-spark.age/1.5);
    ctx.fillStyle=spark.kind==='heart'?'#ed96ad':spark.index%2?'#fff4c4':'#f1c96c';
    ctx.fillText(spark.kind==='heart'?'♥':'✦',spark.x+spark.vx*spark.age,spark.y+spark.vy*spark.age);
  }
  for (const particle of particles) {
    ctx.globalAlpha = Math.min(1, (1.8 - particle.age) * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#fff5d9';
    ctx.fillStyle = '#314e46';
    const y = particle.y - particle.age * 35;
    ctx.strokeText(particle.text, particle.x, y);
    ctx.fillText(particle.text, particle.x, y);
  }
  ctx.restore();
}
export function clearEffects() { particles.length = 0; sparks.length=0; }
