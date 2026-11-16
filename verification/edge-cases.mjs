import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { launchGame, root } from './browser.mjs';
import { createState } from '../game/js/state.js';
const game=await launchGame();
const errors=[];
try {
  const page=await game.browser.newPage({viewport:{width:1280,height:720}});
  page.on('pageerror',error=> { errors.push(error.message); console.error(error); });
  await page.goto(game.url);
  assert.equal(await page.title(),'Coinfield Exchange');
  // An explicitly labelled save fixture tests the boundary, not the win playthrough.
  const ending=createState();
  ending.mode='playing';
  ending.time=479;
  await page.evaluate(state=>localStorage.setItem('petalpost-save-v1',JSON.stringify(state)),ending);
  await page.reload();
  await page.locator('[data-action="continue"]').click();
  await page.waitForFunction(()=>window.petalpost.snapshot().mode==='lost');
  await page.screenshot({path:`${root}/verification/loss-boundary.png`});
  await page.locator('[data-action="start"]').click();
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
  assert.equal(await page.evaluate(()=>window.petalpost.snapshot().mode),'paused');
  await page.locator('[data-action="pause"]').last().click();
  assert.equal(await page.evaluate(()=>window.petalpost.snapshot().mode),'playing');
  await page.evaluate(()=>localStorage.setItem('petalpost-save-v1','{broken'));
  // Navigate without beforeunload autosave overwriting the deliberately damaged record.
  const fresh=await game.browser.newContext();
  const broken=await fresh.newPage();
  await broken.addInitScript(()=>localStorage.setItem('petalpost-save-v1','{broken'));
  await broken.goto(game.url);
  assert.equal(await broken.locator('[data-action="continue"]').count(),0);
  await fresh.close();
  const layouts=[];
  for (const scene of ['title','play','orders','win','shop']) {
    await page.goto(`${game.url}/?shot=${scene}`);
    const layout=await page.evaluate(()=> {
      const elements=[...document.querySelectorAll('.title-card,.hud-left,.hud-right,.quest,.bottom,.panel')];
      return elements.map(element=> {
        const rect=element.getBoundingClientRect();
        return {name:element.className,x:rect.x,y:rect.y,width:rect.width,height:rect.height,inside:rect.x>=0&&rect.y>=0&&rect.right<=innerWidth&&rect.bottom<=innerHeight};
      });
    });
    assert(layout.every(item=>item.inside),JSON.stringify(layout));
    layouts.push({scene,layout});
  }
  assert.deepEqual(errors,[]);
  await writeFile(`${root}/verification/edge-result.json`,JSON.stringify({checks:['loss boundary from 479-second save fixture','restart after loss','blur pauses','resume','corrupt save fallback','all major panels inside 1280x720 viewport'],errors,layouts},null,2)+'\n');
  console.log('PASS: loss/restart, blur/resume, corrupt save and layout boundaries.');
} finally { await game.close(); }
