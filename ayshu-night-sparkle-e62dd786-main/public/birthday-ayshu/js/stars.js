/* Twinkling stars + shooting stars on a single fixed canvas. */
const StarField = (() => {
  let canvas, ctx, stars = [], shooters = [], raf = null, w = 0, h = 0, dpr = 1;
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function size() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth || window.innerWidth;
    h = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function build() {
    const count = Math.min(150, Math.round((w * h) / 5200));
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.92,
        r: Math.random() * 1.35 + 0.35,
        a: Math.random(),
        s: Math.random() * 0.02 + 0.004,
        hue: Math.random() < 0.25 ? 320 : 45,
      });
    }
  }

  function spawnShooter() {
    shooters.push({
      x: Math.random() * w * 0.8,
      y: Math.random() * h * 0.35,
      len: 70 + Math.random() * 90,
      sp: 5 + Math.random() * 4,
      life: 1,
    });
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const st of stars) {
      st.a += st.s;
      const alpha = 0.35 + Math.abs(Math.sin(st.a)) * 0.65;
      ctx.beginPath();
      ctx.fillStyle = st.hue === 320
        ? "rgba(255,190,225," + alpha.toFixed(3) + ")"
        : "rgba(255,250,235," + alpha.toFixed(3) + ")";
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      s.x += s.sp; s.y += s.sp * 0.45; s.life -= 0.012;
      if (s.life <= 0 || s.x > w + 120) { shooters.splice(i, 1); continue; }
      const g = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * 0.45);
      g.addColorStop(0, "rgba(255,255,255," + Math.max(0, s.life).toFixed(2) + ")");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.len, s.y - s.len * 0.45); ctx.stroke();
    }
    raf = requestAnimationFrame(frame);
  }

  function init() {
    canvas = document.getElementById("sky-canvas");
    if (!canvas) return;
    try { ctx = canvas.getContext("2d"); } catch (e) { return; }
    if (!ctx) return;
    size();
    window.addEventListener("resize", () => { clearTimeout(size._t); size._t = setTimeout(size, 180); });
    if (reduced) { frameOnce(); return; }
    raf = requestAnimationFrame(frame);
    setInterval(() => { if (Math.random() < 0.55 && shooters.length < 2) spawnShooter(); }, 4200);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = null; }
      else if (!raf) raf = requestAnimationFrame(frame);
    });
  }

  function frameOnce() {
    ctx.clearRect(0, 0, w, h);
    for (const st of stars) {
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,250,235,.8)";
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return { init };
})();