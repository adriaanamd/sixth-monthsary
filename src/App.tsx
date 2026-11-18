import { useCallback, useEffect, useRef, useState } from "react";
import Backdrop from "./components/Backdrop";
import Hero from "./components/Hero";
import MonthsaryMessage, { type ChapterTwoVisibility } from "./components/MonthsaryMessage";
import PoemPage from "./components/PoemPage";
import Poems from "./components/Poems";
import { poems } from "./data/poems";

const DEFAULT_TITLE = document.title;

function parsePoemIdFromLocation(): number | null {
  const match = window.location.pathname.match(/^\/poem\/(\d+)\/?$/);
  if (!match) return null;
  const id = Number(match[1]);
  return poems.some((p) => p.id === id) ? id : null;
}

export default function App() {
  const [activePoemId, setActivePoemId] = useState<number | null>(() => parsePoemIdFromLocation());
  const startsAtPoems = activePoemId === null && window.location.hash === "#poems";
  const [chapterTwo, setChapterTwo] = useState<ChapterTwoVisibility>(
    startsAtPoems ? "visible" : "hidden",
  );
  const [letterDefaultOpen, setLetterDefaultOpen] = useState(startsAtPoems);
  const scrollToPoemsOnReturn = useRef(startsAtPoems);
  const activePoemIdRef = useRef(activePoemId);
  activePoemIdRef.current = activePoemId;

  const activePoemIndex =
    activePoemId === null ? -1 : poems.findIndex((p) => p.id === activePoemId);
  const activePoem = activePoemIndex >= 0 ? poems[activePoemIndex] : null;

  useEffect(() => {
    document.title = activePoem ? `${activePoem.title} — Verses at Sunset` : DEFAULT_TITLE;
  }, [activePoem]);

  useEffect(() => {
    const onPopState = () => {
      const nextId = parsePoemIdFromLocation();
      if (nextId === null && activePoemIdRef.current !== null) {
        setLetterDefaultOpen(true);
        setChapterTwo("visible");
        scrollToPoemsOnReturn.current = true;
      }
      setActivePoemId(nextId);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (activePoem !== null) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    if (scrollToPoemsOnReturn.current && chapterTwo === "visible") {
      scrollToPoemsOnReturn.current = false;
      requestAnimationFrame(() => {
        document.getElementById("poems")?.scrollIntoView({ behavior: "instant", block: "start" });
      });
    }
  }, [activePoem, chapterTwo]);

  const handleChapterTwoChange = useCallback((state: ChapterTwoVisibility) => {
    setChapterTwo(state);
    if (state === "visible") setLetterDefaultOpen(true);
    if (state === "hidden") setLetterDefaultOpen(false);
  }, []);

  const openPoemPage = useCallback((id: number) => {
    setLetterDefaultOpen(true);
    setChapterTwo("visible");
    window.history.pushState({ poemId: id }, "", `/poem/${id}`);
    setActivePoemId(id);
  }, []);

  const backToChapterTwo = useCallback(() => {
    setLetterDefaultOpen(true);
    setChapterTwo("visible");
    scrollToPoemsOnReturn.current = true;
    window.history.pushState({}, "", "/");
    setActivePoemId(null);
  }, []);

  return (
    <main className="relative isolate overflow-x-clip">
      <Backdrop dimmed={activePoem !== null} />
      {activePoem ? (
        <PoemPage
          key={activePoem.id}
          poem={activePoem}
          poemIndex={activePoemIndex}
          onBack={backToChapterTwo}
          onSelectPoem={openPoemPage}
        />
      ) : (
        <>
          <Hero />
          <MonthsaryMessage
            defaultOpen={letterDefaultOpen}
            onChapterTwoChange={handleChapterTwoChange}
          />
          {chapterTwo !== "hidden" && (
            <div
              aria-hidden={chapterTwo === "hiding" || undefined}
              className={
                chapterTwo === "hiding"
                  ? "pointer-events-none opacity-0 transition-opacity duration-500 ease-out"
                  : undefined
              }
              style={
                chapterTwo === "visible" ? { animation: "fade 0.8s ease 0.3s both" } : undefined
              }
            >
              <Poems onSelectPoem={openPoemPage} />
            </div>
          )}
        </>
      )}
    </main>
  );
}
