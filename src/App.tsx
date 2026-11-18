import { useState } from "react";
import Backdrop from "./components/Backdrop";
import Hero from "./components/Hero";
import MonthsaryMessage, { type ChapterTwoVisibility } from "./components/MonthsaryMessage";
import Poems from "./components/Poems";

export default function App() {
  const [chapterTwo, setChapterTwo] = useState<ChapterTwoVisibility>("hidden");

  return (
    <main className="relative isolate overflow-x-clip">
      <Backdrop />
      <Hero />
      <MonthsaryMessage onChapterTwoChange={setChapterTwo} />
      {chapterTwo !== "hidden" && (
        <div
          aria-hidden={chapterTwo === "hiding" || undefined}
          className={
            chapterTwo === "hiding"
              ? "pointer-events-none opacity-0 transition-opacity duration-500 ease-out"
              : undefined
          }
          style={chapterTwo === "visible" ? { animation: "fade 0.8s ease 0.3s both" } : undefined}
        >
          <Poems />
        </div>
      )}
    </main>
  );
}
