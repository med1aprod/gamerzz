(function () {
  'use strict';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
  var isIndex = true;
  try {
    var file = (location.pathname.split('/').pop() || '');
    if (file === '' || file === 'index.html') isIndex = true;
    else if (/\.html$/i.test(file)) isIndex = false;
  } catch (e) {}

  var COLORS = [[55,255,208],[0,223,165],[53,221,242],[67,140,255],[128,107,255],[180,140,255]];
  var aurora, starsC, trailC, aCtx, sCtx, tCtx, cursorEl;
  var mouse = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0 };
  var trail = [], clicks = [], stars = [], curtains = [];
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, huePhase = 0, MAX_TRAIL = 32;

  function makeCanvas(id) {
    var c = document.createElement('canvas');
    c.id = id; c.setAttribute('aria-hidden', 'true');
    document.body.prepend(c); return c;
  }
  function ensureCanvases() {
    if (aurora || !document.body) return;
    aurora = makeCanvas('aurora-canvas');
    starsC = makeCanvas('stars-canvas');
    trailC = makeCanvas('trail-canvas');
    aCtx = aurora.getContext('2d', { alpha: true });
    sCtx = starsC.getContext('2d', { alpha: true });
    tCtx = trailC.getContext('2d', { alpha: true });
  }
  function ensureCursor() {
    if (!isIndex || isTouch || cursorEl || !document.body) return;
    document.body.classList.add('custom-cursor-on');
    cursorEl = document.createElement('div');
    cursorEl.id = 'custom-cursor';
    var img = document.createElement('img');
    img.src = 'cursor-logo.png'; img.alt = ''; img.draggable = false;
    cursorEl.appendChild(img);
    document.body.appendChild(cursorEl);
  }
  function resize() {
    if (!aurora) return;
    W = window.innerWidth; H = window.innerHeight;
    [aurora, starsC, trailC].forEach(function (c) {
      c.width = Math.floor(W * dpr); c.height = Math.floor(H * dpr);
      c.style.width = W + 'px'; c.style.height = H + 'px';
    });
    aCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initStars();
  }
  function initStars() {
    var count = Math.min(160, Math.floor((W * H) / 12000));
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.3+0.25, a: Math.random()*0.55+0.12, tw: Math.random()*Math.PI*2, sp: 0.3+Math.random()*1.4 });
    }
  }
  function initCurtains() {
    curtains = [];
    var n = isTouch ? 5 : 8;
    for (var i = 0; i < n; i++) {
      curtains.push({ x: (i+0.5)/n*W+(Math.random()-0.5)*W*0.08, w: W*(0.08+Math.random()*0.14), phase: Math.random()*Math.PI*2, speed: 0.15+Math.random()*0.25, wobble: 0.3+Math.random()*0.5, col: COLORS[i%COLORS.length], top: 0.05+Math.random()*0.15, bottom: 0.55+Math.random()*0.35, intensity: 0.5+Math.random()*0.5 });
    }
  }
  function lerp(a,b,t){ return a+(b-a)*t; }
  function drawStars(t) {
    sCtx.clearRect(0,0,W,H);
    for (var i=0;i<stars.length;i++){
      var s=stars[i], tw=0.5+0.5*Math.sin(t*0.001*s.sp+s.tw);
      sCtx.beginPath(); sCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
      sCtx.fillStyle='rgba(220,240,255,'+(s.a*tw)+')'; sCtx.fill();
    }
  }
  function drawAurora(t) {
    aCtx.clearRect(0,0,W,H);
    if (reduced) {
      var rg=aCtx.createRadialGradient(W*0.5,H*0.25,0,W*0.5,H*0.25,W*0.55);
      rg.addColorStop(0,'rgba(55,255,208,0.12)'); rg.addColorStop(0.5,'rgba(67,140,255,0.08)'); rg.addColorStop(1,'transparent');
      aCtx.fillStyle=rg; aCtx.fillRect(0,0,W,H); return;
    }
    var time=t*0.00012;
    aCtx.globalCompositeOperation='lighter';
    var sky=aCtx.createLinearGradient(0,0,0,H*0.5);
    sky.addColorStop(0,'rgba(30,40,80,0.25)'); sky.addColorStop(0.5,'rgba(20,60,70,0.08)'); sky.addColorStop(1,'rgba(0,0,0,0)');
    aCtx.fillStyle=sky; aCtx.fillRect(0,0,W,H);
    for (var i=0;i<curtains.length;i++){
      var c=curtains[i], drift=Math.sin(time*c.speed*6+c.phase)*W*0.04, cx=c.x+drift, pulse=0.7+0.3*Math.sin(time*c.speed*10+c.phase*1.7);
      var steps=isTouch?6:10;
      for (var s=0;s<steps;s++){
        var tpos=s/(steps-1), y1=H*(c.top+tpos*(c.bottom-c.top)*0.15), y2=H*(c.top+(c.bottom-c.top)*(0.4+tpos*0.6));
        var xOff=Math.sin(time*4+c.phase+tpos*3)*c.w*0.15*c.wobble, midX=cx+xOff;
        var alpha=c.intensity*pulse*(1-tpos*0.5)*(isTouch?0.07:0.11);
        var grd=aCtx.createRadialGradient(midX,(y1+y2)/2,0,midX,(y1+y2)/2,c.w*(0.6+tpos*0.5));
        grd.addColorStop(0,'rgba('+c.col[0]+','+c.col[1]+','+c.col[2]+','+alpha+')');
        grd.addColorStop(1,'transparent');
        aCtx.fillStyle=grd; aCtx.fillRect(midX-c.w,y1,c.w*2,y2-y1);
      }
    }
    aCtx.globalCompositeOperation='source-over';
  }
  function onMove(e){ mouse.tx=e.clientX; mouse.ty=e.clientY; if(cursorEl) cursorEl.classList.add('is-visible'); }
  function onLeave(){ if(cursorEl) cursorEl.classList.remove('is-visible'); }
  window.addEventListener('pointermove', onMove, {passive:true});
  document.addEventListener('mouseleave', onLeave);
  if (isIndex) {
    window.addEventListener('pointerdown', function(e){
      if(e.button!==0) return;
      clicks.push({x:e.clientX,y:e.clientY,t:0,max:0.7});
      for(var i=0;i<6;i++){ var ang=Math.PI*2*i/6; trail.push({x:e.clientX+Math.cos(ang)*4,y:e.clientY+Math.sin(ang)*4,life:1,speed:20}); }
    });
  }
  function updateCursor(dt){
    var prevX=mouse.x, prevY=mouse.y;
    mouse.x=lerp(mouse.x,mouse.tx,0.22); mouse.y=lerp(mouse.y,mouse.ty,0.22);
    mouse.vx=mouse.x-prevX; mouse.vy=mouse.y-prevY;
    var speed=Math.sqrt(mouse.vx*mouse.vx+mouse.vy*mouse.vy);
    trail.push({x:mouse.x,y:mouse.y,life:1,speed:speed});
    while(trail.length>MAX_TRAIL) trail.shift();
    for(var i=0;i<trail.length;i++) trail[i].life*=0.97;
    if(cursorEl){
      var angle=Math.atan2(mouse.vy,mouse.vx)*180/Math.PI*0.12;
      angle=Math.max(-10,Math.min(10,angle));
      cursorEl.style.transform='translate('+mouse.x+'px,'+mouse.y+'px) translate(-50%,-50%) rotate('+angle+'deg)';
      huePhase+=dt*0.5;
      var c1=COLORS[Math.floor(huePhase)%COLORS.length], c2=COLORS[Math.floor(huePhase+1)%COLORS.length], f=huePhase%1;
      var r=Math.round(lerp(c1[0],c2[0],f)), g=Math.round(lerp(c1[1],c2[1],f)), b=Math.round(lerp(c1[2],c2[2],f));
      cursorEl.style.filter='drop-shadow(0 0 5px rgba('+r+','+g+','+b+',0.9)) drop-shadow(0 0 14px rgba('+r+','+g+','+b+',0.45))';
    }
  }
  function drawTrail(){
    if(!tCtx) return;
    tCtx.clearRect(0,0,W,H);
    tCtx.globalCompositeOperation='lighter';
    for(var i=1;i<trail.length;i++){
      var a=trail[i-1], b=trail[i];
      if(a.life<0.05||b.life<0.05) continue;
      tCtx.beginPath(); tCtx.moveTo(a.x,a.y); tCtx.lineTo(b.x,b.y);
      tCtx.strokeStyle='rgba(55,255,208,'+(a.life*0.35)+')'; tCtx.lineWidth=2*a.life; tCtx.stroke();
    }
    for(var j=clicks.length-1;j>=0;j--){
      var cl=clicks[j]; cl.t+=0.016; if(cl.t>cl.max){clicks.splice(j,1);continue;}
      var p=cl.t/cl.max, radius=12+p*70, alpha=(1-p)*0.4;
      tCtx.beginPath(); tCtx.arc(cl.x,cl.y,radius,0,Math.PI*2);
      tCtx.strokeStyle='rgba(55,255,208,'+alpha+')'; tCtx.lineWidth=2*(1-p); tCtx.stroke();
    }
    tCtx.globalCompositeOperation='source-over';
  }
  var last=performance.now();
  function frame(now){
    var dt=Math.min(0.05,(now-last)/1000); last=now;
    if(aurora){ drawStars(now); drawAurora(now); updateCursor(dt); drawTrail(); }
    requestAnimationFrame(frame);
  }
  function start(){
    ensureCanvases(); ensureCursor();
    if(!aurora){ requestAnimationFrame(start); return; }
    mouse.x=mouse.tx=W/2||window.innerWidth/2; mouse.y=mouse.ty=H/2||window.innerHeight/2;
    resize(); initCurtains();
    window.addEventListener('resize', function(){ resize(); initCurtains(); }, {passive:true});
    requestAnimationFrame(frame);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
