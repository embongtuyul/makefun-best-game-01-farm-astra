import { hitPlot, hitAnimal } from './render.js';
import { bindCameraGestures } from './camera.js';
import { inspectSnapshot,inspectAt } from './details.js';

export function bindInput(canvas, getState, dispatch) {
  document.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (button && !button.disabled) dispatch(button.dataset.action,button.dataset.id);
  });
  bindCameraGestures(canvas,()=>getState().mode==='playing'&&!getState().panel&&!getState().settingsOpen,
    point=>hitPlot(point.x,point.y)<0 && hitAnimal(getState(),point.x,point.y)<0,
    ({x,y},event)=> {
    const state = getState();
    if (state.mode !== 'playing' || state.panel) return;
    canvas.focus({preventScroll:true});
    if (inspectSnapshot().inspect) { inspectAt(state,{x,y},event); return; }
    const plot = hitPlot(x,y);
    if (plot>=0) return dispatch('plot',plot);
    const animal = hitAnimal(state,x,y);
    if (animal>=0) return dispatch('animal',animal);
    if (x>1070 && y>450 && y<600) dispatch('shop');
    else if (x>760 && x<895 && y>130 && y<265) dispatch('barn');
    else if (x>375 && x<435 && y>225 && y<315) dispatch('orders');
  });
  document.addEventListener('keydown',event=> {
    const state = getState();
    if (event.target.tagName==='INPUT') return;
    if (state.settingsOpen) {
      if (event.key==='Escape') dispatch('close-settings');
      return;
    }
    if (event.repeat) return;
    if (event.key==='Escape') { event.preventDefault(); return dispatch(state.panel?'close':'pause'); }
    if (event.target.tagName==='BUTTON' && ['Enter',' '].includes(event.key)) return;
    const key = event.key.toLowerCase();
    if (key==='enter' && ['title','won','lost'].includes(state.mode)) return dispatch('start');
    const shortcuts = {s:'shop',b:'barn',o:'orders',h:'help',p:'pause',m:'mute','[':'previous-seed',']':'next-seed'};
    if (shortcuts[key]) { event.preventDefault(); return dispatch(shortcuts[key]); }
    if (state.mode!=='playing' || state.panel) return;
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) {
      event.preventDefault();
      const offset = {ArrowLeft:-1,ArrowRight:1,ArrowUp:-4,ArrowDown:4}[event.key];
      state.selectedPlot = (Math.max(0,state.selectedPlot)+offset+12)%12;
    }
    if (event.key===' ' && !inspectSnapshot().inspect) { event.preventDefault(); dispatch('plot',Math.max(0,state.selectedPlot)); }
    if (key==='a') dispatch('collect-all');
  });
  window.addEventListener('blur',()=>dispatch('blur'));
  document.addEventListener('visibilitychange',()=> { if (document.hidden) dispatch('blur'); });
}
