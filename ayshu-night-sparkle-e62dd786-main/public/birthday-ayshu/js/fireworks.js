/* Canvas fireworks: rockets, explosions, trails, glow.
   Fireworks.create(canvasId) builds an independent instance;
   Fireworks.start()/stop() drive the main celebration canvas. */
const Fireworks = (() => {
  const COLORS = [[255, 142, 199], [203, 182, 255], [255, 215, 160], [255, 255, 245], [177, 140, 255]];
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function makeInstance(canvasId, opts) {
  const transparent = !!(opts && opts.transparent);
  let canvas, ctx, w = 0, h = 0, dpr = 1, raf = null, sized = false;
  let rockets = [], sparks = [], running = false, lastLaunch = 0, boostUntil = 0;

  function size() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth || window.innerWidth;
    h = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function launch() {
    const c = COLORS[(Math.random() * COLORS.length) | 0];
    rockets.push({
      x: w * (0.15 + Math.random() * 0.7),
      y: h + 10,
      vy: -(h / 90) * (0.9 + Math.random() * 0.5),
      target: h * (0.16 + Math.random() * 0.3),
      c: c,
    });
  }

  function explode(x, y, c) {
    const n = 46 + ((Math.random() * 22) | 0);
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.2;
      const sp = 1.4 + Math.random() * 3.2;
      sparks.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, c: c });
    }
  }

  function frame(t) {
    if (!running) return;
    if (transparent) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(9,5,24,0.24)";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.globalCompositeOperation = "lighter";

    const energetic = t < boostUntil;
    const gap = reduced ? 4000 : (energetic ? 230 : 780);
    const cap = energetic ? 8 : 4;
    if (t - lastLaunch > gap && rockets.length < cap) { launch(); lastLaunch = t; }

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.x += Math.sin(r.y * 0.01) * 0.3;
      r.y += r.vy;
      ctx.beginPath();
      const g = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, 9);
      g.addColorStop(0, "rgba(" + r.c.join(",") + ",1)");
      g.addColorStop(1, "rgba(" + r.c.join(",") + ",0)");
      ctx.fillStyle = g;
      ctx.arc(r.x, r.y, 9, 0, Math.PI * 2);
      ctx.fill();
      if (r.y <= r.target) { explode(r.x, r.y, r.c); rockets.splice(i, 1); }
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy;
      s.vy += 0.026; s.vx *= 0.985; s.vy *= 0.985;
      s.life -= 0.011;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      const a = Math.max(s.life, 0);
      ctx.beginPath();
      ctx.fillStyle = "rgba(" + s.c.join(",") + "," + a.toFixed(3) + ")";
      ctx.arc(s.x, s.y, 2.1, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (!ctx) { try { ctx = canvas.getContext("2d"); } catch (e) { return; } }
    if (!ctx) return;
    size();
    if (!sized) {
      sized = true;
      window.addEventListener("resize", () => { clearTimeout(size._t); size._t = setTimeout(size, 200); });
    }
    running = true;
    lastLaunch = 0;
    launch();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    rockets = [];
    sparks = [];
    if (ctx) { try { ctx.clearRect(0, 0, w, h); } catch (e) { /* noop */ } }
  }

  /* Extra-energetic opening burst, then settle into the normal rhythm. */
  function burst(ms) {
    start();
    if (!running) return;
    boostUntil = performance.now() + (reduced ? 0 : (ms || 3000));
    if (!reduced) { for (let i = 0; i < 3; i++) launch(); }
  }

  return { start, stop, burst };
}

  const main = makeInstance("fireworks-canvas");
  return {
    create: makeInstance,
    start: main.start,
    stop: main.stop,
    burst: main.burst,
  };
})();