/* =======================================================
   ALL EDITABLE CONTENT LIVES HERE

   1. birthdayConfig  — shared text used for BOTH people
   2. birthdayPeople  — per-person text + per-person gallery
   ======================================================= */
const birthdayConfig = {
  countdownFrom: 3,

  welcomeSub: "I made something special for you.",
  heroSubtitle: "Today is your day. ❤️",

  galleryTitle: "Memories",
  swipeHint: "Swipe to see more memories ✨",

  giftLeadLine1: "There's one more thing...",
  giftButton: "Open Your Surprise 🎁",
  whistleButton: "📣 WHISTLE!",

  selectTitle: "Who is this surprise for? 💕",

  music: "assets/music/birthday.mp3",
};

/* =======================================================
   THE TWO PEOPLE
   Add photos by dropping files into
   assets/images/<person>/ and listing them in `gallery`.
   The counter updates automatically.
   ======================================================= */
const birthdayPeople = {
  ayswarya: {
    id: "ayswarya",
    emoji: "🌸",
    fullName: "Ayswarya",
    nickname: "Ayshu",

    welcomeText: "Hey Ayshu... 👋",
    letterGreeting: "Hey Ayshu...",
    giftLeadLine2: "Just for you, Ayshu. 🎁",
    whistlePrompt: "Ready, Ayshu? 😏",
    whistleTitle: "HAPPY BIRTHDAY, AYSWARYA ❤️",
    finalTitle: "Happy Birthday,\nAyshu ❤️",

    message: `I just wanted to make
your birthday a little
more special.

Because some people
deserve a little extra
happiness. ❤️

I hope this little surprise
makes you smile today.`,

    giftMessage: `Hope this little surprise
made you smile. ❤️`,

    finalMessage: `Keep smiling.
Keep shining.
Stay happy always.

✨ You deserve the best. ✨`,

    signature: "— From someone who cares",

    gallery: [
      { src: "assets/images/ayswarya/photo1.jpg", caption: "Beautiful moments ❤️" },
      { src: "assets/images/ayswarya/photo2.jpg", caption: "A little memory ✨" },
      { src: "assets/images/ayswarya/photo3.jpg", caption: "One to remember 💕" },
      { src: "assets/images/ayswarya/photo4.jpg", caption: "Another beautiful moment" },
      { src: "assets/images/ayswarya/photo5.jpg", caption: "Just a little memory ✨" },
      { src: "assets/images/ayswarya/photo6.jpg", caption: "A moment worth keeping" },
      { src: "assets/images/ayswarya/photo7.jpg", caption: "Always smile ❤️" },
    ],
  },

  abinaya: {
    id: "abinaya",
    emoji: "🌷",
    fullName: "Abinaya",
    nickname: "Abi",

    welcomeText: "Hey Abi... 👋",
    letterGreeting: "Hey Abi...",
    giftLeadLine2: "Just for you, Abi. 🎁",
    whistlePrompt: "Ready, Abi? 😏",
    whistleTitle: "HAPPY BIRTHDAY, ABINAYA ❤️",
    finalTitle: "Happy Birthday,\nAbi ❤️",

    message: `I just wanted to make
your birthday a little
more special.

Because some people
deserve a little extra
happiness. ❤️

I hope this little surprise
makes you smile today.`,

    giftMessage: `Hope this little surprise
made you smile. ❤️`,

    finalMessage: `Keep smiling.
Keep shining.
Stay happy always.

✨ You deserve the best. ✨`,

    signature: "— From someone who cares",

    gallery: [
      { src: "assets/images/abinaya/photo1.jpg", caption: "Beautiful moments ❤️" },
      { src: "assets/images/abinaya/photo2.jpg", caption: "A little memory ✨" },
      { src: "assets/images/abinaya/photo3.jpg", caption: "One to remember 💕" },
      { src: "assets/images/abinaya/photo4.jpg", caption: "Another beautiful moment" },
      { src: "assets/images/abinaya/photo5.jpg", caption: "Just a little memory ✨" },
      { src: "assets/images/abinaya/photo6.jpg", caption: "A moment worth keeping" },
      { src: "assets/images/abinaya/photo7.jpg", caption: "Always smile ❤️" },
    ],
  },
};

/* Expose to the other scripts (works from file:// too). */
window.birthdayConfig = birthdayConfig;
window.birthdayPeople = birthdayPeople;