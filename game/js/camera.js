const camera={fit:1,zoom:1,panX:0,panY:0};
let target={zoom:1,panX:0,panY:0};
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
function constrain(view) {
  const maxX=1280*camera.fit*(view.zoom-1)/2;
  const maxY=720*camera.fit*(view.zoom-1)/2;
  view.panX=clamp(view.panX,-maxX,maxX);
  view.panY=clamp(view.panY,-maxY,maxY);
}
function apply() {
  document.querySelector('#stage').style.transform=`translate(calc(-50% + ${camera.panX}px),calc(-50% + ${camera.panY}px)) scale(${camera.fit*camera.zoom})`;
}
export function cameraSnapshot() { return {...camera,targetZoom:target.zoom}; }
export function setFit(fit) { camera.fit=fit; constrain(camera); constrain(target); apply(); }
export function resetCamera() {
  Object.assign(camera,{zoom:1,panX:0,panY:0});
  target={zoom:1,panX:0,panY:0}; apply();
}
export function zoomCamera(factor,x=innerWidth/2,y=innerHeight/2) {
  const zoom=clamp(target.zoom*factor,1,3);
  const ratio=zoom/target.zoom;
  target.panX=(x-innerWidth/2)-(x-innerWidth/2-target.panX)*ratio;
  target.panY=(y-innerHeight/2)-(y-innerHeight/2-target.panY)*ratio;
  target.zoom=zoom; constrain(target);
}
export function panCamera(dx,dy) {
  target.panX+=dx; target.panY+=dy; constrain(target);
  camera.panX=target.panX; camera.panY=target.panY; apply();
}
export function updateCamera(delta) {
  const ease=1-Math.exp(-delta*28);
  for (const key of ['zoom','panX','panY']) camera[key]+=(target[key]-camera[key])*ease;
  constrain(camera); apply();
}
export function stagePoint(clientX,clientY) {
  const bounds=document.querySelector('#stage').getBoundingClientRect();
  return {x:(clientX-bounds.left)/bounds.width*1280,y:(clientY-bounds.top)/bounds.height*720};
}

// Gesture ownership lives here; input receives only short, unmoved releases.
export function bindCameraGestures(canvas,canUse,isBackground,onTap) {
  const pointers=new Map();
  let pinchDistance=0;
  let lastTap=0;
  canvas.style.touchAction='none';
  canvas.addEventListener('wheel',event=> {
    if (!canUse()) return;
    event.preventDefault(); zoomCamera(Math.exp(-event.deltaY*.0015),event.clientX,event.clientY);
  },{passive:false});
  canvas.addEventListener('dblclick',()=> { if (canUse()) resetCamera(); });
  canvas.addEventListener('pointerdown',event=> {
    if (!canUse()) return;
    const point=stagePoint(event.clientX,event.clientY);
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,time:performance.now(),moved:false,background:isBackground(point)});
    canvas.setPointerCapture(event.pointerId);
    if (pointers.size===2) {
      const [a,b]=[...pointers.values()];
      a.moved=b.moved=true;
      pinchDistance=Math.hypot(a.x-b.x,a.y-b.y);
    }
  });
  canvas.addEventListener('pointermove',event=> {
    const pointer=pointers.get(event.pointerId);
    if (!pointer) return;
    const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;
    pointer.x=event.clientX; pointer.y=event.clientY;
    if (Math.hypot(pointer.x-pointer.startX,pointer.y-pointer.startY)>=8) pointer.moved=true;
    if (pointers.size===2) {
      const [a,b]=[...pointers.values()];
      const distance=Math.hypot(a.x-b.x,a.y-b.y);
      if (pinchDistance>0) zoomCamera(distance/pinchDistance,(a.x+b.x)/2,(a.y+b.y)/2);
      pinchDistance=distance;
    } else if (pointer.moved && pointer.background && camera.zoom>1) panCamera(dx,dy);
  });
  canvas.addEventListener('pointerup',event=> {
    const pointer=pointers.get(event.pointerId);
    pointers.delete(event.pointerId);
    if (!pointer) return;
    if (!pointer.moved && performance.now()-pointer.time<450) {
      const now=performance.now();
      if (event.pointerType==='touch' && now-lastTap<280) { resetCamera(); lastTap=0; }
      else { lastTap=now; onTap(stagePoint(event.clientX,event.clientY),event); }
    }
    if (pointers.size<2) pinchDistance=0;
  });
  canvas.addEventListener('pointercancel',event=> { pointers.delete(event.pointerId); pinchDistance=0; });
  window.addEventListener('blur',()=> { pointers.clear(); pinchDistance=0; });
}
