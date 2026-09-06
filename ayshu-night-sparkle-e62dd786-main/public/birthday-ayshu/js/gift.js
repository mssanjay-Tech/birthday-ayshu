/* Gift box opening: shake -> lid -> light -> confetti -> hearts -> whistle -> scroll to fireworks. */
const Gift = (() => {
  let opened = false;
  let whistleTriggered = false;

  function floatHearts(layer, count) {
    if (!layer) return;
    for (let i = 0; i < count; i++) {
      const h = document.createElement("span");
      h.className = "float-heart";
      h.textContent = Math.random() < 0.5 ? "♥" : "♡";
      h.style.left = (8 + Math.random() * 84) + "%";
      h.style.fontSize = (0.7 + Math.random() * 0.9) + "rem";
      h.style.animationDuration = (2.6 + Math.random() * 2.2) + "s";
      h.style.animationDelay = (Math.random() * 1.6) + "s";
      layer.appendChild(h);
      setTimeout(() => h.remove(), 6500);
    }
  }

  function confetti(layer, count) {
    if (!layer) return;
    const colors = ["#ff8ec7", "#ffd7a0", "#cbb6ff", "#fff3d6", "#b18cff"];
    for (let i = 0; i < count; i++) {
      const c = document.createElement("i");
      c.className = "confetti";
      c.style.left = "50%";
      c.style.top = "44%";
      c.style.background = colors[i % colors.length];
      c.style.setProperty("--dx", (Math.random() * 300 - 150) + "px");
      c.style.setProperty("--dy", (60 + Math.random() * 220) + "px");
      c.style.setProperty("--rot", (Math.random() * 900 - 450) + "deg");
      c.style.setProperty("--dur", (1.3 + Math.random() * 1.1) + "s");
      layer.appendChild(c);
      requestAnimationFrame(() => c.classList.add("is-live"));
      setTimeout(() => c.remove(), 2800);
    }
  }

  function sparkle(layer, count) {
    if (!layer) return;
    const glyphs = ["✨", "♡", "🌟", "💫"];
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "whistle-spark";
      s.textContent = glyphs[i % glyphs.length];
      s.style.left = (20 + Math.random() * 60) + "%";
      s.style.top = (20 + Math.random() * 50) + "%";
      s.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
      s.style.setProperty("--dur", (0.6 + Math.random() * 0.6) + "s");
      s.style.animationDelay = (Math.random() * 0.2) + "s";
      layer.appendChild(s);
      setTimeout(() => s.remove(), 2600);
    }
  }

  function whistle() {
    if (whistleTriggered) return;
    whistleTriggered = true;

    const btn = document.getElementById("whistle-btn");
    const wrap = document.getElementById("whistle-wrap");
    const sparks = document.getElementById("whistle-sparks");
    const s7 = document.getElementById("s7");

    if (btn) { btn.disabled = true; btn.classList.add("is-pressed"); }
    if (wrap) {
      wrap.classList.add("is-blowing");
      setTimeout(() => wrap.classList.remove("is-blowing"), 900);
    }
    sparkle(sparks, 5);

    setTimeout(() => {
      if (btn) btn.classList.add("is-hidden");
      if (s7) s7.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 600);
  }

  function reset() {
    opened = false;
    whistleTriggered = false;
    const stage = document.getElementById("whistle-stage");
    const btn = document.getElementById("whistle-btn");
    const title = document.getElementById("whistle-title");
    const msg = document.getElementById("gift-message");
    const gift = document.getElementById("gift");
    const giftBtn = document.getElementById("gift-btn");
    if (stage) { stage.hidden = true; stage.classList.remove("is-visible"); }
    if (btn) { btn.disabled = false; btn.classList.remove("is-hidden", "is-pressed"); }
    if (title) title.classList.remove("is-visible");
    if (msg) msg.classList.remove("is-visible");
    if (gift) gift.classList.remove("is-open", "is-shaking");
    if (giftBtn) giftBtn.classList.remove("is-hidden");
  }

  function open() {
    if (opened) return;
    opened = true;
    const gift = document.getElementById("gift");
    const btn = document.getElementById("gift-btn");
    const conf = document.getElementById("confetti");
    const stage = document.getElementById("whistle-stage");
    const title = document.getElementById("whistle-title");
    const msg = document.getElementById("gift-message");

    if (btn) btn.classList.add("is-hidden");
    if (gift) {
      gift.classList.add("is-shaking");
      setTimeout(() => {
        gift.classList.remove("is-shaking");
        gift.classList.add("is-open");
        confetti(conf, 34);
        floatHearts(conf, 12);
      }, 720);
    }
    /* reveal the whistle, its title, and the hidden message */
    setTimeout(() => {
      if (!stage) return;
      stage.hidden = false;
      requestAnimationFrame(() => stage.classList.add("is-visible"));
      if (title) title.classList.add("is-visible");
      if (msg) msg.classList.add("is-visible");
    }, 1350);
  }

  return { open, whistle, reset, floatHearts };
})();
