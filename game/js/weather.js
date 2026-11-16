const FORECAST = [
  { name: 'Bull market', icon: '↗', cropRate: 1, animalRate: 1.15, rain: false, tint: 0 },
  { name: 'Altseason', icon: '◎', cropRate: 1.45, animalRate: 0.8, rain: true, tint: 0.06 },
  { name: 'Bull market', icon: '↗', cropRate: 1, animalRate: 1.15, rain: false, tint: 0 },
  { name: 'Bear market', icon: '↘', cropRate: 1.2, animalRate: 0.55, rain: true, tint: 0.16 },
];

export function getWeather(time) {
  const dayTime = time % 160;
  const phase = dayTime < 35 ? 'Opening' : dayTime < 100 ? 'Active' : dayTime < 125 ? 'Closing' : 'Low volume';
  const weather = FORECAST[Math.floor(time / 40) % FORECAST.length];
  const night = phase === 'Low volume';
  const smooth = value => { const t=Math.max(0,Math.min(1,value)); return t*t*(3-2*t); };
  const nightTint = Math.max(smooth((dayTime-95)/35)*.25,(1-smooth(dayTime/25))*.25);
  return {
    ...weather, phase,
    cropRate: weather.cropRate * (night ? 0.65 : 1),
    animalRate: weather.animalRate * (night ? 0.65 : 1),
    tint: Math.max(weather.tint,nightTint),
    washColor: weather.name==='Bear market'?'177,79,103':'58,131,105',
    description: night ? 'Sideways · mining ×0.65' : weather.rain ? 'Free power · faster mining' : 'Happy miners · output ×1.15',
    next: FORECAST[(Math.floor(time / 40) + 1) % FORECAST.length].name,
  };
}

export function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}
