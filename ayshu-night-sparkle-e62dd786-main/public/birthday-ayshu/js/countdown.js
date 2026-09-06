/* Cinematic 3 -> 2 -> 1 countdown. */
const Countdown = (() => {
  function run(onDone) {
    const el = document.getElementById("count-number");
    const dots = document.getElementById("count-dots");
    const from = (window.birthdayConfig && birthdayConfig.countdownFrom) || 3;
    if (!el) { if (onDone) onDone(); return; }

    let n = from;
    const step = () => {
      el.textContent = String(n);
      el.classList.remove("is-playing");
      void el.offsetWidth; /* restart animation */
      el.classList.add("is-playing");
      if (dots) {
        const spans = dots.querySelectorAll("span");
        spans.forEach((s, i) => s.classList.toggle("on", i === from - n));
      }
      n--;
      if (n >= 1) {
        setTimeout(step, 1050);
      } else {
        setTimeout(() => { if (onDone) onDone(); }, 1050);
      }
    };
    step();
  }
  return { run };
})();