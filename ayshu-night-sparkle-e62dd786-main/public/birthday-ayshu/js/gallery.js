/* Swipeable polaroid gallery with scroll-snap + fullscreen preview. */
const Gallery = (() => {
  let track, idxEl, progEl, cards = [], list = [];

  const pad = (n) => (n < 10 ? "0" + n : String(n));

  function build(photoList) {
    track = document.getElementById("gallery");
    idxEl = document.getElementById("g-index");
    progEl = document.getElementById("g-progress");
    if (!track) return;
    list = Array.isArray(photoList) ? photoList : [];
    const total = list.length;
    const totalEl = document.querySelector(".counter i");
    if (totalEl) totalEl.textContent = "/ " + pad(total);

    track.innerHTML = "";
    list.forEach((p, i) => {
      const fig = document.createElement("figure");
      fig.className = "polaroid";
      fig.setAttribute("role", "listitem");
      fig.tabIndex = 0;
      fig.style.setProperty("--rot", (i % 2 ? 2.2 : -2.4) + "deg");

      const img = document.createElement("img");
      img.src = p.src;
      img.alt = p.caption || "Memory " + (i + 1);
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("error", () => {
        img.removeAttribute("src");
        fig.classList.add("is-missing");
      });

      const cap = document.createElement("figcaption");
      cap.textContent = p.caption || "";

      fig.appendChild(img);
      fig.appendChild(cap);
      fig.addEventListener("click", () => openLightbox(i));
      fig.addEventListener("keydown", (e) => { if (e.key === "Enter") openLightbox(i); });
      track.appendChild(fig);
    });

    cards = Array.from(track.querySelectorAll(".polaroid"));
    if (!track.dataset.bound) {
      track.dataset.bound = "1";
      track.addEventListener("scroll", onScroll, { passive: true });
    }
    track.scrollLeft = 0;
    setCurrent(0);
    setupLightbox();
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0, bestD = Infinity;
      cards.forEach((c, i) => {
        const cMid = c.offsetLeft + c.offsetWidth / 2;
        const d = Math.abs(cMid - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      setCurrent(best);
    });
  }

  function setCurrent(i) {
    cards.forEach((c, n) => c.classList.toggle("is-current", n === i));
    if (idxEl) idxEl.textContent = pad(i + 1);
    if (progEl) progEl.style.width = ((i + 1) / Math.max(cards.length, 1) * 100) + "%";
  }

  /* fullscreen preview */
  let box, boxImg, boxCap;
  function setupLightbox() {
    box = document.getElementById("lightbox");
    boxImg = document.getElementById("lightbox-img");
    boxCap = document.getElementById("lightbox-cap");
    const close = document.getElementById("lightbox-close");
    if (!box) return;
    const hide = () => { box.hidden = true; };
    if (box.dataset.bound === "1") return;
    box.dataset.bound = "1";
    if (close) close.addEventListener("click", hide);
    box.addEventListener("click", (e) => { if (e.target === box) hide(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !box.hidden) hide(); });
  }

  function openLightbox(i) {
    if (!box || !list[i]) return;
    boxImg.src = list[i].src;
    boxImg.alt = list[i].caption || "Memory";
    boxCap.textContent = list[i].caption || "";
    box.hidden = false;
  }

  return { build };
})();