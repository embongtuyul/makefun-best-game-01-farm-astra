import { launchGame, root } from './browser.mjs';
const game = await launchGame();
try {
  const page = await game.browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
  page.on('pageerror',error=>console.error(error));
  const preliminary = process.argv.includes('--preliminary');
  for (const [number,scene] of ['title','play','orders','win'].entries()) {
    await page.goto(`${game.url}/?shot=${scene}`);
    if (await page.title() !== 'Coinfield Exchange') throw new Error('Wrong screenshot theme');
    await page.waitForTimeout(350);
    if (scene==='play') {
      await page.locator('[data-action="inspect"]').click();
      await page.mouse.click(615,305);
      await page.waitForTimeout(200);
    }
    const farmer=await page.evaluate(()=>window.petalpost.snapshot().farmer);
    if (!farmer || farmer.x<70 || farmer.x>1200 || farmer.y<100 || farmer.y>650) throw new Error('Farmer outside stage');
    if (scene==='win' && farmer.action!=='celebrate') throw new Error('Missing celebration');
    if (scene==='title' && await page.locator('#hud').innerText()) throw new Error('Cover HUD must be hidden');
    await page.screenshot({path:`${root}/${preliminary?'verification':'screenshots'}/${preliminary?'before-':''}0${number+1}-${scene}.png`});
  }
} finally { await game.close(); }
