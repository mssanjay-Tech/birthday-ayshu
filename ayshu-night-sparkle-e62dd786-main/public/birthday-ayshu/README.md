# Birthday Ayshu — a tiny magical birthday universe ✨

A mobile-first, cinematic interactive birthday website built with plain HTML,
CSS and vanilla JavaScript. No frameworks, no build step.

## 1. How to run

- Double-click `index.html`, or
- VS Code → Live Server → "Open with Live Server", or
- `python3 -m http.server` inside this folder, then open `http://localhost:8000`

## 2. Two people (Ayswarya / Abinaya)

The site opens with a person-selection screen. Everything after it (welcome,
countdown, reveal, letter, gallery, gift, fireworks, final message) uses the
selected person's data — one set of screens, no duplication.

All per-person text lives in `birthdayPeople` inside `js/config.js`:

```js
const birthdayPeople = {
  ayswarya: { fullName: "Ayswarya", nickname: "Ayshu", welcomeText: "Hey Ayshu... 👋", ... },
  abinaya:  { fullName: "Abinaya",  nickname: "Abi",   welcomeText: "Hey Abi... 👋",  ... },
};
```

Shared text (countdown, gallery title, gift button, music path) lives in
`birthdayConfig`. The selection is kept in `sessionStorage`, and the
"↺ Change person" button (top-left) resets the experience for testing.

Then update the lines that mention the name (`welcomeText`, `giftLeadLine2`,
`finalTitle`, …). Everything on screen comes from this one file.

## 3. How to change messages

All text lives in `js/config.js`:

- `welcomeText`, `welcomeSub` — screen 1
- `heroSubtitle` — screen 3
- `message` — the typewriter letter (screen 4)
- `giftLeadLine1`, `giftLeadLine2`, `giftMessage` — screen 6
- `finalTitle`, `finalMessage`, `signature` — screen 8

Line breaks inside the backtick strings are preserved exactly.

## 4. How to add photos

Each person has their own folder — the galleries never mix.

1. Drop images into `assets/images/ayswarya/` or `assets/images/abinaya/`.
2. Edit that person's `gallery` array in `js/config.js`:

```js
gallery: [
  { src: "assets/images/ayswarya/photo1.jpg", caption: "Beautiful moments ❤️" },
  // add or remove entries freely — the counter updates automatically
],
```

Square images look best in the polaroid frames. A missing photo will not break
anything; the frame simply stays empty.

## 5. How to add music

Put an MP3 at `assets/music/birthday.mp3` (or change `music` in `js/config.js`).

- Music never autoplays. It starts when "Start the Surprise ✨" is pressed.
- The ♪ button (top-right) toggles it.
- If the file is missing, the button hides itself and nothing breaks.

## 6. How to deploy

- **GitHub Pages**: push this folder to a repo → Settings → Pages → deploy from
  branch `main`, folder `/root`.
- **Netlify**: drag the folder into the Netlify dashboard (no build command,
  publish directory = this folder).
- **Vercel**: `vercel` in this folder, framework preset "Other".

All paths are relative, so it works from any subfolder.

## Flow

Welcome → countdown 3·2·1 → birthday reveal → typewriter letter → polaroid
gallery → secret gift box → canvas fireworks → final message.
Screens 3–8 are one vertical scroll-snap story.

## Files

```
index.html
css/style.css       layout + design tokens
css/animations.css  keyframes
css/responsive.css  phone/desktop tuning
js/config.js        ← all editable content
js/main.js          flow, music, observers
js/stars.js         starfield canvas
js/countdown.js     3 → 2 → 1
js/typewriter.js    letter typing
js/gallery.js       polaroids + lightbox
js/gift.js          gift opening, confetti, hearts
js/fireworks.js     canvas fireworks
assets/images/      teddy art + photo1..7
assets/music/       birthday.mp3 (optional)
```