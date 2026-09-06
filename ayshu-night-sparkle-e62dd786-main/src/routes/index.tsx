import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Happy Birthday, Ayshu ✨ | A Magical Surprise";
const DESC =
  "A tiny magical birthday universe made especially for Ayshu (Ayswarya) — starry skies, a countdown, memories and fireworks.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Index,
});

// The birthday experience is a standalone vanilla HTML/CSS/JS site living in
// public/birthday-ayshu/ so it can also be opened directly from index.html.
function Index() {
  return (
    <>
      <h1 className="sr-only">Happy Birthday, Ayshu</h1>
      <iframe
        src="/birthday-ayshu/index.html"
        title="Happy Birthday, Ayshu — interactive surprise"
        className="fixed inset-0 h-full w-full border-0"
        allow="autoplay; fullscreen"
      />
    </>
  );
}
