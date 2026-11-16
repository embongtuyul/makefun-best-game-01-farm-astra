export function beginTutorial(state) {
  try {
    if (localStorage.getItem('petalpost-tutorial-v2')) return;
    localStorage.setItem('petalpost-tutorial-v2','seen');
  } catch { /* Storage is optional. */ }
  state.tutorialStep='plant';
}
export function advanceTutorial(state,action) {
  if (state.tutorialStep==='plant' && state.plots.some(plot=>plot.crop)) state.tutorialStep='water';
  else if (state.tutorialStep==='water' && state.plots.some(plot=>plot.watered)) state.tutorialStep='grow';
  else if (state.tutorialStep==='grow' && state.harvests>0) state.tutorialStep='harvest';
  else if (state.tutorialStep==='harvest' && ['barn','orders','sell','deliver'].includes(action)) state.tutorialStep=null;
}
export function tutorialMarkup(state) {
  const hints={plant:'Tap a bay to mine',water:'Tap again to power up',grow:'Tap a checkmark when your coin is ready.',harvest:'Sell in the Vault or settle a Trade'};
  return hints[state.tutorialStep]?`<aside class="coach"><small>A helping hand</small><p>${hints[state.tutorialStep]}</p><button data-action="dismiss-tutorial">Got it</button></aside>`:'';
}
