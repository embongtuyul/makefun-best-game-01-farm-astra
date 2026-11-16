// Stable simulation IDs preserve save compatibility; ticker identity is presentation data.
export const COINS = {
  oat:['BTC','Bitcoin','#f1ad58','₿'], carrot:['ETH','Ethereum','#b4a0df','Ξ'],
  tomato:['SOL','Solana','#83d9bd','◎'], pea:['BNB','BNB','#efd168','◆'],
  berry:['XRP','XRP','#9bbbc8','X'], corn:['ADA','Cardano','#8faee1','✦'],
  aubergine:['AVAX','Avalanche','#ef9698','▲'], pumpkin:['LINK','Chainlink','#91afe5','⬡'],
  melon:['DOT','Polkadot','#e7a1c6','●'], daisy:['DOGE','Dogecoin','#dec580','Ð'],
  poppy:['PEPE','Pepe','#9bc783','P'], aster:['SHIB','Shiba Inu','#eda777','S'],
};
export function drawCoin(ctx,id,x,y,radius=16) {
  const [ticker,,color,symbol]=COINS[id] || COINS.oat;
  ctx.save();
  ctx.translate(x,y);
  ctx.beginPath(); ctx.arc(0,0,radius,0,Math.PI*2);
  ctx.fillStyle=color; ctx.fill(); ctx.strokeStyle='#456456'; ctx.lineWidth=2.5; ctx.stroke();
  ctx.beginPath(); ctx.arc(0,0,radius-3,0,Math.PI*2);
  ctx.strokeStyle='#fff5d980'; ctx.lineWidth=1.5; ctx.stroke();
  ctx.fillStyle='#314e46'; ctx.font=`bold ${radius*1.2}px Trebuchet MS, sans-serif`;
  ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(symbol,0,1);
  ctx.restore();
}
