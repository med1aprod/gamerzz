(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  var isIndex = true;
  try {
    var file = (location.pathname.split('/').pop() || '');
    if (file === '' || file === 'index.html') isIndex = true;
    else if (/\.html$/i.test(file)) isIndex = false;
    else isIndex = true;
  } catch (e) { isIndex = true; }

  // Aurora palette
  var COLORS = [
    [55, 255, 208],
    [0, 223, 165],
    [53, 221, 242],
    [67, 140, 255],
    [128, 107, 255],
    [180, 140, 255]
  ];

  function makeCanvas(id) {
    var c = document.createElement('canvas');
    c.id = id;
    c.setAttribute('aria-hidden', 'true');
    document.body.prepend(c);
    return c;
  }

  var aurora = makeCanvas('aurora-canvas');
  var starsC = makeCanvas('stars-canvas');
  var trailC = makeCanvas('trail-canvas');
  var aCtx = aurora.getContext('2d', { alpha: true });
  var sCtx = starsC.getContext('2d', { alpha: true });
  var tCtx = trailC.getContext('2d', { alpha: true });

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    [aurora, starsC, trailC].forEach(function (c) {
      c.width = Math.floor(W * dpr);
      c.height = Math.floor(H * dpr);
      c.style.width = W + 'px';
      c.style.height = H + 'px';
    });
    aCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initStars();
  }

  // ---------- Stars ----------
  var stars = [];
  function initStars() {
    var count = Math.min(160, Math.floor((W * H) / 12000));
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.25,
        a: Math.random() * 0.55 + 0.12,
        tw: Math.random() * Math.PI * 2,
        sp: 0.3 + Math.random() * 1.4
      });
    }
  }

  function drawStars(t) {
    sCtx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var tw = 0.5 + 0.5 * Math.sin(t * 0.001 * s.sp + s.tw);
      sCtx.beginPath();
      sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sCtx.fillStyle = 'rgba(220,240,255,' + (s.a * tw) + ')';
      sCtx.fill();
    }
  }

  // ---------- Real vertical aurora curtains ----------
  // Columns of vertical light that shimmer and drift slowly
  var curtains = [];
  function initCurtains() {
    curtains = [];
    var n = isTouch ? 5 : 8;
    for (var i = 0; i < n; i++) {
      curtains.push({
        x: (i + 0.5) / n * W + (Math.random() - 0.5) * W * 0.08,
        w: W * (0.08 + Math.random() * 0.14),
        phase: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.25,
        wobble: 0.3 + Math.random() * 0.5,
        col: COLORS[i % COLORS.length],
        col2: COLORS[(i + 2) % COLORS.length],
        top: 0.05 + Math.random() * 0.15,
        bottom: 0.55 + Math.random() * 0.35,
        intensity: 0.5 + Math.random() * 0.5
      });
    }
  }

  function drawAurora(t) {
    aCtx.clearRect(0, 0, W, H);

    if (reduced) {
      var rg = aCtx.createRadialGradient(W * 0.5, H * 0.25, 0, W * 0.5, H * 0.25, W * 0.55);
      rg.addColorStop(0, 'rgba(55,255,208,0.12)');
      rg.addColorStop(0.5, 'rgba(67,140,255,0.08)');
      rg.addColorStop(1, 'transparent');
      aCtx.fillStyle = rg;
      aCtx.fillRect(0, 0, W, H);
      return;
    }

    var time = t * 0.00012;
    aCtx.globalCompositeOperation = 'lighter';

    // Soft sky glow near top
    var sky = aCtx.createLinearGradient(0, 0, 0, H * 0.5);
    sky.addColorStop(0, 'rgba(30,40,80,0.25)');
    sky.addColorStop(0.5, 'rgba(20,60,70,0.08)');
    sky.addColorStop(1, 'rgba(0,0,0,0)');
    aCtx.fillStyle = sky;
    aCtx.fillRect(0, 0, W, H);

    // Vertical curtains
    for (var i = 0; i < curtains.length; i++) {
      var c = curtains[i];
      var drift = Math.sin(time * c.speed * 6 + c.phase) * W * 0.04;
      var cx = c.x + drift;
      var pulse = 0.7 + 0.3 * Math.sin(time * c.speed * 10 + c.phase * 1.7);

      // Draw as series of vertical soft strips
      var steps = isTouch ? 6 : 10;
      for (var s = 0; s < steps; s++) {
        var tpos = s / (steps - 1);
        var y1 = H * (c.top + tpos * (c.bottom - c.top) * 0.15);
        var y2 = H * (c.top + (c.bottom - c.top) * (0.4 + tpos * 0.6));
        var xOff = Math.sin(time * 4 + c.phase + tpos * 3) * c.w * 0.15 * c.wobble;
        var midX = cx + xOff;
        var alpha = c.intensity * pulse * (1 - tpos * 0.5) * (isTouch ? 0.07 : 0.11);

        var grd = aCtx.createRadialGradient(
          midX, (y1 + y2) / 2, 0,
          midX, (y1 + y2) / 2, c.w * (0.6 + tpos * 0.5)
        );
        var col = tpos < 0.5 ? c.col : c.col2;
        grd.addColorStop(0, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + alpha + ')');
        grd.addColorStop(0.45, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (alpha * 0.35) + ')');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        aCtx.fillStyle = grd;
        aCtx.fillRect(midX - c.w, y1 - 40, c.w * 2, y2 - y1 + 80);
      }
    }

    // Extra floating orbs for depth (not wave-like)
    for (var o = 0; o < (isTouch ? 3 : 5); o++) {
      var ox = W * (0.15 + 0.7 * ((Math.sin(time * 1.5 + o * 1.7) + 1) / 2));
      var oy = H * (0.12 + 0.35 * ((Math.cos(time * 1.1 + o * 2.1) + 1) / 2));
      var or = Math.min(W, H) * (0.12 + 0.06 * Math.sin(time * 2 + o));
      var oc = COLORS[o % COLORS.length];
      var og = aCtx.createRadialGradient(ox, oy, 0, ox, oy, or);
      og.addColorStop(0, 'rgba(' + oc[0] + ',' + oc[1] + ',' + oc[2] + ',' + (isTouch ? 0.06 : 0.09) + ')');
      og.addColorStop(0.5, 'rgba(' + oc[0] + ',' + oc[1] + ',' + oc[2] + ',0.03)');
      og.addColorStop(1, 'transparent');
      aCtx.fillStyle = og;
      aCtx.fillRect(ox - or, oy - or, or * 2, or * 2);
    }

    aCtx.globalCompositeOperation = 'source-over';
  }

  // ---------- Cursor trail (all desktop pages) ----------
  var mouse = { x: W / 2, y: H / 2, tx: W / 2, ty: H / 2, vx: 0, vy: 0 };
  var trail = [];
  var MAX_TRAIL = 32;
  var cursorEl = null;
  var huePhase = 0;
  var clicks = [];

  if (isIndex && !isTouch) {
    document.body.classList.add('custom-cursor-on');
    cursorEl = document.createElement('div');
    cursorEl.id = 'custom-cursor';
    var img = document.createElement('img');
    img.src = 'cursor-logo.png';
    img.alt = '';
    img.draggable = false;
    cursorEl.appendChild(img);
    document.body.appendChild(cursorEl);
  }

  function onMove(e) {
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
    if (cursorEl) cursorEl.classList.add('is-visible');
  }
  function onLeave() {
    if (cursorEl) cursorEl.classList.remove('is-visible');
  }

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('mouseleave', onLeave);

  // Click ripples — index only
  if (isIndex) {
    window.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      clicks.push({
        x: e.clientX,
        y: e.clientY,
        t: 0,
        max: 0.7
      });
      // small burst into trail
      for (var i = 0; i < 6; i++) {
        var ang = (Math.PI * 2 * i) / 6;
        trail.push({
          x: e.clientX + Math.cos(ang) * 4,
          y: e.clientY + Math.sin(ang) * 4,
          life: 1,
          speed: 20
        });
      }
    });
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function updateCursor(dt) {
    var prevX = mouse.x, prevY = mouse.y;
    mouse.x = lerp(mouse.x, mouse.tx, 0.22);
    mouse.y = lerp(mouse.y, mouse.ty, 0.22);
    mouse.vx = mouse.x - prevX;
    mouse.vy = mouse.y - prevY;
    var speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);

    trail.push({ x: mouse.x, y: mouse.y, life: 1, speed: speed });
    while (trail.length > MAX_TRAIL) trail.shift();

    // decay trail life
    for (var i = 0; i < trail.length; i++) {
      trail[i].life *= 0.97;
    }

    if (cursorEl) {
      var angle = Math.atan2(mouse.vy, mouse.vx) * (180 / Math.PI) * 0.12;
      angle = Math.max(-10, Math.min(10, angle));
      cursorEl.style.transform =
        'translate(' + mouse.x + 'px,' + mouse.y + 'px) translate(-50%,-50%) rotate(' + angle + 'deg)';

      huePhase += dt * 0.5;
      var c1 = COLORS[Math.floor(huePhase) % COLORS.length];
      var c2 = COLORS[Math.floor(huePhase + 1) % COLORS.length];
      var f = huePhase % 1;
      var r = Math.round(lerp(c1[0], c2[0], f));
      var g = Math.round(lerp(c1[1], c2[1], f));
      var b = Math.round(lerp(c1[2], c2[2], f));
      cursorEl.style.filter =
        'drop-shadow(0 0 5px rgba(' + r + ',' + g + ',' + b + ',0.9)) ' +
        'drop-shadow(0 0 14px rgba(' + r + ',' + g + ',' + b + ',0.45))';
    }

    // update clicks
    for (var i = clicks.length - 1; i >= 0; i--) {
      clicks[i].t += dt;
      if (clicks[i].t > clicks[i].max) clicks.splice(i, 1);
    }
  }

  function drawTrail() {
    tCtx.clearRect(0, 0, W, H);
    tCtx.globalCompositeOperation = 'lighter';
    tCtx.lineCap = 'round';
    tCtx.lineJoin = 'round';

    if (trail.length >= 3) {
      // Soft wide path
      tCtx.beginPath();
      tCtx.moveTo(trail[0].x, trail[0].y);
      for (var i = 1; i < trail.length - 1; i++) {
        var mx = (trail[i].x + trail[i + 1].x) / 2;
        var my = (trail[i].y + trail[i + 1].y) / 2;
        tCtx.quadraticCurveTo(trail[i].x, trail[i].y, mx, my);
      }
      tCtx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
      tCtx.strokeStyle = 'rgba(53,221,242,0.06)';
      tCtx.lineWidth = 16;
      tCtx.stroke();

      // Core gradient segments
      for (var i = 1; i < trail.length; i++) {
        var p0 = trail[i - 1];
        var p1 = trail[i];
        var life = (i / trail.length) * (p1.life || 1);
        var speedBoost = Math.min(1, (p1.speed || 0) / 18);
        var alpha = life * life * (0.4 + speedBoost * 0.45);
        var col = COLORS[Math.min(COLORS.length - 1, Math.floor((i / trail.length) * (COLORS.length - 1)))];
        tCtx.beginPath();
        tCtx.moveTo(p0.x, p0.y);
        tCtx.lineTo(p1.x, p1.y);
        tCtx.strokeStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + alpha + ')';
        tCtx.lineWidth = 1.5 + life * 4.5 + speedBoost * 2;
        tCtx.stroke();
      }

      var head = trail[trail.length - 1];
      var hg = tCtx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 20);
      hg.addColorStop(0, 'rgba(55,255,208,0.35)');
      hg.addColorStop(0.5, 'rgba(128,107,255,0.12)');
      hg.addColorStop(1, 'transparent');
      tCtx.fillStyle = hg;
      tCtx.beginPath();
      tCtx.arc(head.x, head.y, 20, 0, Math.PI * 2);
      tCtx.fill();
    }

    // Click ripples
    for (var i = 0; i < clicks.length; i++) {
      var cl = clicks[i];
      var p = cl.t / cl.max;
      var radius = 12 + p * 70;
      var alpha = (1 - p) * 0.45;
      tCtx.beginPath();
      tCtx.arc(cl.x, cl.y, radius, 0, Math.PI * 2);
      tCtx.strokeStyle = 'rgba(55,255,208,' + alpha + ')';
      tCtx.lineWidth = 2.5 * (1 - p);
      tCtx.stroke();

      tCtx.beginPath();
      tCtx.arc(cl.x, cl.y, radius * 0.55, 0, Math.PI * 2);
      tCtx.strokeStyle = 'rgba(128,107,255,' + (alpha * 0.7) + ')';
      tCtx.lineWidth = 1.5 * (1 - p);
      tCtx.stroke();

      var rg = tCtx.createRadialGradient(cl.x, cl.y, 0, cl.x, cl.y, radius * 0.4);
      rg.addColorStop(0, 'rgba(55,255,208,' + (alpha * 0.5) + ')');
      rg.addColorStop(1, 'transparent');
      tCtx.fillStyle = rg;
      tCtx.beginPath();
      tCtx.arc(cl.x, cl.y, radius * 0.4, 0, Math.PI * 2);
      tCtx.fill();
    }

    tCtx.globalCompositeOperation = 'source-over';
  }

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    drawAurora(now);
    drawStars(now);
    if (!isTouch && !reduced) {
      updateCursor(dt);
      drawTrail();
    } else if (isIndex && clicks.length) {
      // still draw click ripples on touch index
      for (var i = clicks.length - 1; i >= 0; i--) {
        clicks[i].t += dt;
        if (clicks[i].t > clicks[i].max) clicks.splice(i, 1);
      }
      tCtx.clearRect(0, 0, W, H);
      tCtx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < clicks.length; i++) {
        var cl = clicks[i];
        var p = cl.t / cl.max;
        var radius = 12 + p * 70;
        var alpha = (1 - p) * 0.4;
        tCtx.beginPath();
        tCtx.arc(cl.x, cl.y, radius, 0, Math.PI * 2);
        tCtx.strokeStyle = 'rgba(55,255,208,' + alpha + ')';
        tCtx.lineWidth = 2 * (1 - p);
        tCtx.stroke();
      }
      tCtx.globalCompositeOperation = 'source-over';
    }
    requestAnimationFrame(frame);
  }

  function start() {
    resize();
    initCurtains();
    window.addEventListener('resize', function () {
      resize();
      initCurtains();
    }, { passive: true });
    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
