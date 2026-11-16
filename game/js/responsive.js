import { setFit } from './camera.js';
export function fitStage() {
  const fit=()=> {
    setFit(Math.min(innerWidth/1280,innerHeight/720));
  };
  addEventListener('resize',fit);
  window.visualViewport?.addEventListener('resize',fit);
  fit();
}
