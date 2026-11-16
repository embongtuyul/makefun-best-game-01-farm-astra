import { chromium } from '/home/hatch/workspace/makefun/fps-shots/node_modules/playwright-core/index.mjs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

export const root = resolve(import.meta.dirname,'..');
export async function launchGame() {
  const server = createServer(async (request,response)=> {
    const pathname = new URL(request.url,'http://localhost').pathname;
    const file = resolve(root,'game',`.${pathname==='/'?'/index.html':pathname}`);
    if (!file.startsWith(resolve(root,'game')+'/')) { response.writeHead(403).end(); return; }
    try {
      const bytes = await readFile(file);
      response.setHeader('Content-Type', {'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)] || 'application/octet-stream');
      response.end(bytes);
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser = await chromium.launch({
    executablePath:'/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox','--disable-dev-shm-usage','--mute-audio'],
  });
  return { browser, url:`http://127.0.0.1:${server.address().port}`, close:async()=> { await browser.close(); await new Promise(resolve=>server.close(resolve)); } };
}
