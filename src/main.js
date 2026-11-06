import './style.css';

const yearEl = document.querySelector('#current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile navigation
const toggle = document.querySelector('#menu-button');
const mobileNav = document.querySelector('#mobile-nav');
if (toggle && mobileNav) {
  const closeNav = () => {
    mobileNav.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };
  toggle.addEventListener('click', () => {
    const opening = mobileNav.hidden;
    mobileNav.hidden = !opening;
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
}

// Gentle entrance effects with an accessible reduced-motion fallback.
document.documentElement.classList.add('has-js');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: .07, rootMargin: '0px 0px -35px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

// Interactive, deliberately synthetic visualization of localization ideas.
// Not the MobileNet/LSTM model or the real research dataset. No research metrics
// are computed or simulated by the demo.
const canvas = document.querySelector('#localization-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const poseText = document.querySelector('#pose-text');
  const tabs = [...document.querySelectorAll('[data-mode]')];
  const resample = document.querySelector('#resample-button');
  const cols = 19;
  const rows = 14;
  let mode = 'full';
  let scenario = 0;
  let animationId = 0;
  let currentSize = {w: 750,h:570};
  const scenes = [
    {robot:[.57,.52], modes:[[.55,.52,.15,.16,1],[.14,.21,.12,.16,.38],[.86,.78,.12,.17,.27]]},
    {robot:[.33,.68], modes:[[.34,.68,.13,.16,1],[.79,.22,.14,.15,.53],[.12,.39,.11,.17,.33]]},
    {robot:[.71,.34], modes:[[.7,.35,.16,.14,1],[.26,.72,.12,.18,.45],[.88,.77,.12,.17,.24]]},
    {robot:[.43,.42], modes:[[.44,.43,.14,.16,1],[.81,.75,.11,.16,.4],[.13,.2,.14,.14,.28]]}
  ];
  const rand = seed => { const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
  function resize() {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(200, box.width), h = Math.max(200, box.height);
    canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    currentSize = {w,h};
    draw();
  }
  function gaussian(x,y,m){const dx=(x-m[0])/m[2],dy=(y-m[1])/m[3];return m[4]*Math.exp(-.5*(dx*dx+dy*dy));}
  function draw() {
    const {w,h}=currentSize;
    const scene=scenes[scenario%scenes.length];
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#0c2017';ctx.fillRect(0,0,w,h);
    const pad=17,gw=(w-pad*2)/cols,gh=(h-pad*2)/rows;
    // Small map cells are a deliberately reduced-dimensional illustration.
    for(let y=0;y<rows;y++) for(let x=0;x<cols;x++) {
      const nx=(x+.5)/cols,ny=(y+.5)/rows;
      const field=scene.modes.reduce((s,m)=>s+gaussian(nx,ny,m),0);
      const top3Strength=scene.modes[0][4]*gaussian(nx,ny,scene.modes[0]);
      const strength=Math.min(1,mode==='full'?field:top3Strength);
      const noise=rand(12+x*7+y*53+scenario*100);
      const base=16+Math.round(strength*48),green=39+Math.round(strength*155),blue=28+Math.round(strength*38);
      ctx.fillStyle=`rgb(${base},${green},${blue})`;
      ctx.globalAlpha=.78+.22*noise;
      ctx.fillRect(pad+x*gw+.8,pad+y*gh+.8,Math.max(1,gw-2),Math.max(1,gh-2));
    }
    ctx.globalAlpha=1;
    // Coordinate lines and labels suggest mapping instrumentation, not a real output.
    ctx.strokeStyle='#85c17b3b';ctx.lineWidth=1;
    for(let i=0;i<=4;i++) {const x=pad+(w-2*pad)*i/4; ctx.beginPath();ctx.moveTo(x,pad);ctx.lineTo(x,h-pad);ctx.stroke();}
    for(let i=0;i<=3;i++){const y=pad+(h-2*pad)*i/3;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke();}
    // Floating samples: full mode spreads particles over the alternative peaks.
    const centers=scene.modes;
    for(let i=0;i<100;i++) {
      const component= mode==='full' ? (i%10<6?0:i%10<9?1:2) : 0;
      const m=centers[component];
      const a=rand(i*6.1+scenario*77)*Math.PI*2;
      const radial=Math.sqrt(rand(i*9.7+scenario*33));
      const spread=mode==='full'?1.3:.68;
      const px=(m[0]+Math.cos(a)*radial*m[2]*spread)*w;
      const py=(m[1]+Math.sin(a)*radial*m[3]*spread)*h;
      ctx.fillStyle= mode==='full' ? '#d0f6b4' : '#f4d79f';
      ctx.globalAlpha=.22+rand(i*2.2+scenario*10)*.45;
      ctx.beginPath();ctx.arc(px,py,1+rand(i*3)*1.5,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    const rx=scene.robot[0]*w,ry=scene.robot[1]*h;
    ctx.strokeStyle='#d7fa9e';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(rx,ry,21,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(rx,ry,35,0,Math.PI*2);ctx.strokeStyle='#d7fa9e80';ctx.stroke();
    ctx.fillStyle='#e6b098';ctx.strokeStyle='#0c2017';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(rx,ry-12);ctx.lineTo(rx+11,ry+12);ctx.lineTo(rx,ry+6);ctx.lineTo(rx-11,ry+12);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#e3efdc';ctx.font='10px DM Mono, monospace';ctx.fillText('ROBOT',rx+28,ry-19);
    if(poseText) poseText.textContent=`x: ${(scene.robot[0]*14).toFixed(1)} / y: ${(scene.robot[1]*10).toFixed(1)}`;
  }
  tabs.forEach(button=>button.addEventListener('click',()=>{
    mode=button.dataset.mode;
    tabs.forEach(b=>{const selected=b===button;b.classList.toggle('is-selected',selected);b.setAttribute('aria-pressed',String(selected));});
    draw();
  }));
  resample?.addEventListener('click',()=>{scenario++;draw();});
  if ('ResizeObserver' in window) {const ro=new ResizeObserver(()=>resize());ro.observe(canvas);} else {window.addEventListener('resize',resize);}
  resize();
}
