// ---------- Window controls (frameless window titlebar) ----------
document.getElementById('btn-min').addEventListener('click', () => window.windowControls.minimize());
document.getElementById('btn-close').addEventListener('click', () => window.windowControls.close());

// ---------- Theme per scene ----------
const THEMES = {
  cream:    { bg: '#f6e4c9', bar: '#ff5fa0', accent: '#ff5fa0', text: '#4a3b2a' },
  pink:     { bg: '#ffc3dc', bar: '#ff5fa0', accent: '#ff5fa0', text: '#5a2d43' },
  blue:     { bg: '#bfe9fb', bar: '#4fb3e8', accent: '#3f9fd6', text: '#2a4a5a' },
  orange:   { bg: '#f5c99b', bar: '#ff5fa0', accent: '#ff5fa0', text: '#5a3a1e' },
  green:    { bg: '#cbe8a5', bar: '#5aa66d', accent: '#4c9a6a', text: '#2f4a2f' },
  lavender: { bg: '#bdbdf2', bar: '#6a7fd8', accent: '#6a7fd8', text: '#2c2c55' },
};

function applyTheme(themeName) {
  const t = THEMES[themeName] || THEMES.cream;
  const root = document.getElementById('app-window');
  root.style.setProperty('--bg', t.bg);
  root.style.setProperty('--bar', t.bar);
  root.style.setProperty('--accent', t.accent);
  root.style.setProperty('--text', t.text);
}

// ---------- Scene navigation ----------
const ORDER = ['scene-0','scene-1','scene-1b','scene-2','scene-3','scene-4','scene-4b','scene-5','scene-6'];
let historyStack = [];
let current = 'scene-0';

function showScene(id, { pushHistory = true } = {}) {
  if (pushHistory && current !== id) historyStack.push(current);
  const prevEl = document.getElementById(current);
  if (prevEl) prevEl.classList.remove('active');
  current = id;
  const el = document.getElementById(id);
  el.classList.add('active');
  applyTheme(el.dataset.theme);
  document.getElementById('btn-back').classList.toggle('disabled', id === 'scene-0');
}

document.getElementById('btn-back').addEventListener('click', () => {
  if (historyStack.length === 0) return;
  const prev = historyStack.pop();
  showScene(prev, { pushHistory: false });
});

// ---------- Name personalization ----------
let userName = 'najiel';
const nameInput = document.getElementById('name-input');
nameInput.addEventListener('input', () => {
  userName = nameInput.value.trim() || 'najiel';
  refreshNameText();
});
function refreshNameText() {
  document.getElementById('bday-title-1').innerHTML = `happy 15th<br/>birthday, ${escapeHtml(userName)}`;
  document.getElementById('bday-title-2').innerHTML = `For the second<br/>time, happy 15th<br/>birthday, ${escapeHtml(userName)}`;
  document.getElementById('letter-to').textContent = `…to you, ${userName}`;
}
function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
refreshNameText();

// ---------- Pixel-art critter renderer (original designs, generic kawaii style) ----------
function pixelBlob(canvas, opts) {
  const size = 32;
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);
  const px = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };

  const { body, ear, earShape = 'round', accessory = null, mood = 'happy', belly = null } = opts;

  // ears (drawn first, behind head)
  if (earShape === 'round') {
    px(4, 2, 7, 7, ear); px(21, 2, 7, 7, ear);
  } else if (earShape === 'floppy') {
    px(1, 9, 6, 15, ear); px(25, 9, 6, 15, ear);
  } else if (earShape === 'pointy') {
    px(6, 0, 5, 9, ear); px(21, 0, 5, 9, ear);
  } else if (earShape === 'tall') {
    px(8, -2, 5, 14, ear); px(19, -2, 5, 14, ear);
  }

  // head/body block (stepped circle for chunky pixel look)
  px(9, 0, 14, 2, body);
  px(6, 2, 20, 2, body);
  px(4, 4, 24, 3, body);
  px(3, 7, 26, 17, body);

  if (belly) px(11, 16, 10, 8, belly);

  // eyes + blush + mouth
  px(10, 15, 3, 4, '#1a1a1a');
  px(19, 15, 3, 4, '#1a1a1a');
  px(6, 20, 4, 3, '#ffb6c9');
  px(22, 20, 4, 3, '#ffb6c9');
  if (mood === 'happy') px(14, 21, 4, 2, '#1a1a1a');
  else if (mood === 'surprised') px(14, 20, 4, 4, '#1a1a1a');

  // accessories
  if (accessory === 'heart') {
    px(12, 25, 3, 3, '#ff6b91'); px(17, 25, 3, 3, '#ff6b91');
    px(11, 27, 10, 3, '#ff6b91'); px(13, 30, 6, 2, '#ff6b91');
  }
  if (accessory === 'bow') {
    px(11, 0, 4, 5, '#ff6b91'); px(17, 0, 4, 5, '#ff6b91'); px(15, 1, 2, 4, '#d94572');
  }
  if (accessory === 'beak') {
    px(13, 18, 6, 3, '#ffb02e');
  }
}

function drawGiftBox(canvas, openProgress) {
  // openProgress: 0 (closed) -> 1 (fully open with burst)
  const size = 32;
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);
  const px = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };

  const boxColor = '#6a7fd8', ribbon = '#ff5fa0', lidColor = '#8a9bec';
  const lidLift = Math.floor(openProgress * 10);

  // box base
  px(6, 18, 20, 12, boxColor);
  px(13, 18, 6, 12, ribbon);
  // lid (lifts up as it opens)
  px(4, 16 - lidLift, 24, 6, lidColor);
  px(13, 16 - lidLift, 6, 6, ribbon);

  // burst / confetti once mostly open
  if (openProgress > 0.5) {
    const a = (openProgress - 0.5) * 2; // 0..1
    ctx.fillStyle = '#ff9fc7';
    px(14 - a*4, 6 - a*6, 3, 3, '#ffd23f');
    px(20 + a*4, 8 - a*6, 3, 3, '#5aa66d');
    px(9 - a*3, 12 - a*4, 3, 3, '#4fb3e8');
    px(23 + a*3, 14 - a*4, 3, 3, '#ff5fa0');
    px(16, 4 - a*8, 3, 3, '#ff9fc7');
  }
}

function drawBalloon(canvas, color) {
  const w = 10, h = 14;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = color;
  ctx.fillRect(2, 0, 6, 8);
  ctx.fillRect(1, 1, 8, 6);
  ctx.fillStyle = '#8a6a4a';
  ctx.fillRect(4, 8, 2, 6);
}

function drawCake(canvas) {
  const w = 16, h = 12;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const px = (x,y,w,h,c) => { ctx.fillStyle = c; ctx.fillRect(x,y,w,h); };
  px(2, 6, 12, 6, '#e88a9a');   // base layer
  px(3, 3, 10, 3, '#f5b8c4');   // top layer
  px(6, 0, 1, 3, '#ffd23f');    // candle
  px(9, 0, 1, 3, '#ffd23f');    // candle
  px(6, -1, 1, 1, '#ff6b3a');   // flame
  px(9, -1, 1, 1, '#ff6b3a');   // flame
}

function drawConfettiStrip(canvas) {
  const w = 12, h = 16;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const colors = ['#ffd23f','#ff5fa0','#4fb3e8','#5aa66d','#ff9fc7'];
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(Math.random()*w, Math.random()*h, 2, 2);
  }
}

// ---------- Draw all critters ----------
pixelBlob(document.getElementById('c0-a'), { body: '#a7d9a0', ear: '#8bc687', earShape: 'round', mood: 'happy' });
pixelBlob(document.getElementById('c0-b'), { body: '#ffe08a', ear: '#ffcf4d', earShape: 'round', accessory: 'beak', mood: 'happy' });
pixelBlob(document.getElementById('c1'),   { body: '#e0a86b', ear: '#c98a4e', earShape: 'pointy', mood: 'happy' });
pixelBlob(document.getElementById('c2'),   { body: '#eef3fb', ear: '#dbe8f7', earShape: 'floppy', accessory: 'heart', mood: 'happy' });
pixelBlob(document.getElementById('c3'),   { body: '#fbf8f2', ear: '#e9dfca', earShape: 'floppy', mood: 'surprised' });
pixelBlob(document.getElementById('c5'),   { body: '#9a9aa6', ear: '#7d7d8c', earShape: 'tall', accessory: 'bow', mood: 'happy' });
pixelBlob(document.getElementById('c6-a'), { body: '#8fd18a', ear: '#6fb56a', earShape: 'pointy', mood: 'happy' });
pixelBlob(document.getElementById('c6-b'), { body: '#f6b9cf', ear: '#f2a0be', earShape: 'tall', mood: 'happy' });

drawBalloon(document.getElementById('b1'), '#8bd18a');
drawBalloon(document.getElementById('b2'), '#c98bd1');
drawCake(document.getElementById('cake1'));
drawConfettiStrip(document.getElementById('conf-left'));
drawConfettiStrip(document.getElementById('conf-right'));

// ---------- Scene transitions & interactions ----------
document.getElementById('btn-start').addEventListener('click', () => showScene('scene-1'));

document.getElementById('btn-open-1').addEventListener('click', () => {
  showScene('scene-1b');
  animateGiftOpen(document.getElementById('giftcanvas1'), () => showScene('scene-2', { pushHistory: false }));
});

document.getElementById('btn-next-1').addEventListener('click', () => showScene('scene-3'));
document.getElementById('btn-next-2').addEventListener('click', () => showScene('scene-4'));

// scene-4: two-step reveal ("hmm it seems like..." -> show button after a beat)
const sceneFour = document.getElementById('scene-4');
let scene4Revealed = false;
function revealScene4() {
  if (scene4Revealed) return;
  scene4Revealed = true;
  document.getElementById('opening-2-text').classList.remove('hidden');
  document.getElementById('btn-find-out').classList.remove('hidden');
}
// re-trigger reveal each time we land on scene-4
const originalShowScene = showScene;
document.getElementById('btn-find-out').addEventListener('click', () => {
  showScene('scene-4b');
  animateGiftOpen(document.getElementById('giftcanvas2'), () => showScene('scene-5', { pushHistory: false }));
});

document.getElementById('btn-next-3').addEventListener('click', () => showScene('scene-6'));

document.getElementById('btn-replay').addEventListener('click', () => {
  historyStack = [];
  scene4Revealed = false;
  document.getElementById('opening-2-text').classList.add('hidden');
  document.getElementById('btn-find-out').classList.add('hidden');
  document.getElementById('letter-body').textContent = '';
  document.getElementById('btn-replay').classList.add('hidden');
  showScene('scene-0', { pushHistory: false });
});

function animateGiftOpen(canvas, onDone) {
  let start = null;
  const duration = 1400;
  function frame(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    drawGiftBox(canvas, progress);
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      setTimeout(onDone, 500);
    }
  }
  requestAnimationFrame(frame);
}

// reveal scene-4 hint text/button ~900ms after arriving
const scene4Observer = new MutationObserver(() => {
  if (document.getElementById('scene-4').classList.contains('active') && !scene4Revealed) {
    setTimeout(revealScene4, 900);
  }
});
scene4Observer.observe(document.getElementById('scene-4'), { attributes: true, attributeFilter: ['class'] });

// ---------- Typewriter for final letter ----------
const LETTER_TEMPLATE = (name) =>
  `So proud to know you and to be your friend. I hope you have a great year ahead, filled with love, laughter, and all the things that make you happy. You deserve it all! Keep shining bright, ${name}.`;

const scene6Observer = new MutationObserver(() => {
  if (document.getElementById('scene-6').classList.contains('active')) {
    typeLetter();
  }
});
scene6Observer.observe(document.getElementById('scene-6'), { attributes: true, attributeFilter: ['class'] });

let typing = false;
function typeLetter() {
  if (typing) return;
  typing = true;
  const el = document.getElementById('letter-body');
  const text = LETTER_TEMPLATE(userName);
  el.textContent = '';
  document.getElementById('btn-replay').classList.add('hidden');
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      typing = false;
      document.getElementById('btn-replay').classList.remove('hidden');
    }
  }, 28);
}

// ---------- init ----------
applyTheme('cream');