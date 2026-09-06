/* Character-by-character typing with a blinking caret. */
const Typewriter = (() => {
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function type(target, text, opts) {
    const o = opts || {};
    const el = typeof target === "string" ? document.getElementById(target) : target;
    if (!el) return;
    if (el.dataset.typed === "1") return;
    el.dataset.typed = "1";
    const speed = o.speed || 34;

    if (reduced) {
      el.textContent = text;
      if (o.onDone) o.onDone();
      return;
    }
    el.textContent = "";
    let i = 0;
    const tick = () => {
      if (i >= text.length) { if (o.onDone) o.onDone(); return; }
      const ch = text.charAt(i);
      el.textContent += ch;
      i++;
      const pause = ch === "\n" ? speed * 6 : ch === "." ? speed * 8 : speed;
      setTimeout(tick, pause);
    };
    setTimeout(tick, o.delay || 250);
  }

  return { type };
})();