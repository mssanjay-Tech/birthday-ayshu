/* Orchestrates the whole experience. */
document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.birthdayConfig || {};
  const $ = (id) => document.getElementById(id);
  const setText = (id, val) => { const el = $(id); if (el && typeof val === "string") el.textContent = val; };

  /* ---------- people + selected-person state ---------- */
  const people = window.birthdayPeople || {};
  const fallbackId = Object.keys(people)[0] || "ayswarya";
  const STORE_KEY = "birthdaySelectedPerson";
  let selectedPersonId = null;
  let person = people[fallbackId] || {};

  const readStored = () => {
    try { return sessionStorage.getItem(STORE_KEY); } catch (e) { return null; }
  };
  const writeStored = (id) => {
    try { sessionStorage.setItem(STORE_KEY, id); } catch (e) { /* private mode */ }
  };

  /* ---------- shared, person-independent content ---------- */
  setText("welcome-sub", cfg.welcomeSub);
  setText("hero-sub", cfg.heroSubtitle);
  setText("gift-line-1", cfg.giftLeadLine1);
  setText("select-title", cfg.selectTitle);
  if (cfg.giftButton) { const gb = $("gift-btn"); if (gb) gb.textContent = cfg.giftButton; }
  if (cfg.whistleButton) { const wb = $("whistle-btn"); if (wb) wb.textContent = cfg.whistleButton; }
  if (cfg.swipeHint) { const sh = document.querySelector(".swipe-hint"); if (sh) sh.textContent = cfg.swipeHint; }
  if (cfg.galleryTitle) {
    const gt = document.querySelector(".gallery-title");
    if (gt) {
      gt.innerHTML = "";
      gt.append(document.createTextNode(cfg.galleryTitle + " "));
      const s = document.createElement("span"); s.className = "tiny-inline"; s.textContent = "♥";
      gt.appendChild(s);
    }
  }

  /* ---------- apply the selected person's content ---------- */
  function applyPerson(p) {
    person = p || {};
    setText("welcome-text", person.welcomeText);
    setText("hero-name", person.fullName);
    setText("gift-line-2", person.giftLeadLine2);
    setText("whistle-prompt", person.whistlePrompt);
    setText("whistle-title", person.whistleTitle);
    setText("signature", person.signature);
    if (person.fullName) { const fw = $("fw-name"); if (fw) fw.textContent = String(person.fullName).toUpperCase(); }
    if (person.letterGreeting) { const lt = document.querySelector(".letter-title"); if (lt) lt.textContent = person.letterGreeting; }
    if (person.finalTitle) {
      const ft = document.querySelector(".final-title");
      if (ft) {
        ft.innerHTML = "";
        String(person.finalTitle).split("\n").forEach((line, i) => {
          if (i) ft.appendChild(document.createElement("br"));
          ft.append(document.createTextNode(line));
        });
      }
    }
    const gm = $("gift-message");
    if (gm) gm.textContent = (person.giftMessage || "").trim();
    const fb = $("final-body");
    if (fb) fb.textContent = (person.finalMessage || "").trim();

    /* per-person gallery — only this person's photos */
    try { Gallery.build(Array.isArray(person.gallery) ? person.gallery : []); } catch (e) { /* gallery is optional */ }
  }

  /* ---------- background sky ---------- */
  try { StarField.init(); } catch (e) { /* stars are decorative */ }

  /* ---------- music (never autoplays) ---------- */
  const audio = $("bg-music");
  const musicBtn = $("music-btn");
  let musicReady = false;
  if (audio && cfg.music) {
    audio.src = cfg.music;
    audio.volume = 0.55;
    audio.addEventListener("canplay", () => {
      musicReady = true;
      if (musicBtn) musicBtn.hidden = false;
    });
    audio.addEventListener("error", () => {
      musicReady = false;
      if (musicBtn) musicBtn.hidden = true;
    });
    audio.load();
  }
  const playMusic = () => {
    if (!audio || !musicReady) return;
    const p = audio.play();
    if (p && p.catch) p.catch(() => { /* browser blocked audio — ignore */ });
    if (musicBtn) { musicBtn.textContent = "♪"; musicBtn.classList.remove("is-off"); }
  };
  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      if (!audio) return;
      if (audio.paused) { playMusic(); }
      else { audio.pause(); musicBtn.textContent = "🔇"; musicBtn.classList.add("is-off"); }
    });
  }

  /* ---------- flow: select -> welcome -> countdown -> story ---------- */
  const select = $("screen-select");
  const welcome = $("screen-welcome");
  const countdown = $("screen-countdown");
  const story = $("story");
  const startBtn = $("start-btn");
  let started = false;

  const showStory = () => {
    if (countdown) { countdown.classList.remove("is-active"); }
    if (story) {
      story.hidden = false;
      story.classList.add("fade-in");
      const s3 = $("s3");
      if (s3) s3.classList.add("is-seen");
      story.scrollTop = 0;
      observeScreens();
    }
  };

  const runCountdown = () => {
    if (welcome) welcome.classList.remove("is-active");
    if (countdown) countdown.classList.add("is-active");
    Countdown.run(() => {
      if (countdown) countdown.classList.add("fade-out");
      setTimeout(showStory, 480);
    });
  };

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (started) return;
      started = true;
      playMusic();
      if (welcome) welcome.classList.add("fade-out");
      setTimeout(runCountdown, 500);
    });
  }

  /* ---------- person selection screen ---------- */
  const cardsWrap = $("person-cards");
  const changeBtn = $("change-person-btn");

  function showWelcome() {
    if (select) { select.classList.remove("is-active", "fade-out"); }
    if (welcome) { welcome.classList.remove("fade-out"); welcome.classList.add("is-active", "fade-in"); }
    if (changeBtn) changeBtn.hidden = false;
  }

  function choosePerson(id, animateCard) {
    const p = people[id] || people[fallbackId];
    if (!p) return;
    selectedPersonId = p.id || id;
    writeStored(selectedPersonId);
    applyPerson(p);
    if (animateCard && cardsWrap) {
      Array.from(cardsWrap.children).forEach((c) => {
        c.classList.add(c.dataset.person === selectedPersonId ? "is-picked" : "is-dimmed");
      });
      if (select) select.classList.add("fade-out");
      setTimeout(showWelcome, 620);
    } else {
      showWelcome();
    }
  }

  if (cardsWrap) {
    cardsWrap.innerHTML = "";
    Object.keys(people).forEach((id) => {
      const p = people[id];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "person-card";
      btn.dataset.person = p.id || id;
      btn.innerHTML =
        '<span class="pc-emoji" aria-hidden="true"></span>' +
        '<span class="pc-name"></span><span class="pc-nick"></span>';
      btn.querySelector(".pc-emoji").textContent = p.emoji || "🌸";
      btn.querySelector(".pc-name").textContent = p.fullName || id;
      btn.querySelector(".pc-nick").textContent = p.nickname || "";
      btn.setAttribute("aria-label", "Choose " + (p.fullName || id));
      btn.addEventListener("click", () => choosePerson(p.id || id, true));
      cardsWrap.appendChild(btn);
    });
  }

  function resetExperience() {
    started = false;
    try { Fireworks.stop(); } catch (e) { /* noop */ }
    try { Gift.reset(); } catch (e) { /* noop */ }
    try { sessionStorage.removeItem(STORE_KEY); } catch (e) { /* noop */ }
    selectedPersonId = null;
    if (story) { story.hidden = true; story.classList.remove("fade-in"); story.scrollTop = 0; }
    document.querySelectorAll(".screen.is-seen").forEach((s) => s.classList.remove("is-seen"));
    if (countdown) countdown.classList.remove("is-active", "fade-out");
    if (welcome) welcome.classList.remove("is-active", "fade-out", "fade-in");
    if (cardsWrap) Array.from(cardsWrap.children).forEach((c) => c.classList.remove("is-picked", "is-dimmed"));
    if (select) { select.classList.remove("fade-out"); select.classList.add("is-active"); }
    if (changeBtn) changeBtn.hidden = true;
    const typed = $("typed");
    if (typed) typed.textContent = "";
  }
  if (changeBtn) changeBtn.addEventListener("click", resetExperience);

  /* restore a previous selection, otherwise show the selection screen */
  const stored = readStored();
  if (stored && people[stored]) {
    choosePerson(stored, false);
  } else {
    applyPerson(people[fallbackId]);
    if (select) select.classList.add("is-active");
  }

  /* ---------- gift ---------- */
  const giftBtn = $("gift-btn");
  if (giftBtn) giftBtn.addEventListener("click", () => Gift.open());

  /* ---------- whistle -> scroll to existing fireworks section ---------- */
  const whistleBtn = $("whistle-btn");

  if (whistleBtn) whistleBtn.addEventListener("click", () => Gift.whistle());
  const whistleImg = $("whistle-img");
  if (whistleImg) {
    whistleImg.addEventListener("error", () => {
      whistleImg.hidden = true;
      const wrap = $("whistle-wrap");
      if (wrap) wrap.classList.add("no-image");
    });
  }

  /* ---------- ambient layers ---------- */
  function seedPetals() {
    const layer = $("petals");
    if (!layer || layer.dataset.done === "1") return;
    layer.dataset.done = "1";
    for (let i = 0; i < 16; i++) {
      const p = document.createElement("i");
      p.className = "petal";
      p.style.left = (Math.random() * 96) + "%";
      p.style.animationDuration = (7 + Math.random() * 7) + "s";
      p.style.animationDelay = (-Math.random() * 8) + "s";
      p.style.opacity = String(0.5 + Math.random() * 0.5);
      p.style.transform = "scale(" + (0.7 + Math.random()) + ")";
      layer.appendChild(p);
    }
  }
  function seedSparkles() {
    const layer = $("sparkles");
    if (!layer || layer.dataset.done === "1") return;
    layer.dataset.done = "1";
    for (let i = 0; i < 22; i++) {
      const s = document.createElement("i");
      s.className = "sparkle";
      s.style.left = (Math.random() * 98) + "%";
      s.style.top = (Math.random() * 96) + "%";
      s.style.animationDelay = (Math.random() * 2.4) + "s";
      layer.appendChild(s);
    }
  }

  /* ---------- per-screen activation ---------- */
  function activate(id) {
    if (id === "s4") {
      const msg = (person.message || "").trim();
      Typewriter.type("typed", msg, {
        speed: 30,
        onDone: () => {
          const caret = $("caret");
          if (caret) caret.classList.add("is-done");
          const layer = $("hearts-letter");
          if (layer) Gift.floatHearts(layer, 8);
        },
      });
      const layer = $("hearts-letter");
      if (layer) Gift.floatHearts(layer, 6);
    }
    if (id === "s7") { try { Fireworks.start(); } catch (e) { /* canvas unsupported */ } }
    if (id === "s8") { seedPetals(); seedSparkles(); }
  }

  function observeScreens() {
    const targets = ["s3", "s4", "s5", "s6", "s7", "s8"].map($).filter(Boolean);
    if (!("IntersectionObserver" in window)) { targets.forEach((t) => activate(t.id)); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && en.intersectionRatio > 0.4) {
          en.target.classList.add("is-seen");
          activate(en.target.id);
        } else if (en.target.id === "s7" && en.intersectionRatio < 0.05) {
          try { Fireworks.stop(); } catch (e) { /* noop */ }
        }
      });
    }, { root: story, threshold: [0, 0.05, 0.45, 0.8] });
    targets.forEach((t) => io.observe(t));
  }
});