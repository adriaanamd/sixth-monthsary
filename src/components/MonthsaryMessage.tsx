import { useRef, useState } from "react";
import Envelope from "./Envelope";
import HeartIcon from "./HeartIcon";
import Reveal from "./Reveal";
import type { VesselStage } from "../hooks/useVesselStage";

export type ChapterTwoVisibility = "hidden" | "visible" | "hiding";

export default function MonthsaryMessage({
  defaultOpen = false,
  onChapterTwoChange,
}: {
  defaultOpen?: boolean;
  onChapterTwoChange?: (state: ChapterTwoVisibility) => void;
}) {
  const [stage, setStage] = useState<VesselStage>(defaultOpen ? "reading" : "closed");
  const sectionRef = useRef<HTMLElement>(null);

  const showLetter = stage === "reading" || stage === "folding";

  const scrollSectionIntoView = () => {
    if (sectionRef.current && sectionRef.current.getBoundingClientRect().top < 0) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      sectionRef.current.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <section ref={sectionRef} id="message" className="relative isolate px-6 py-28 sm:py-36">
      {/* mirror Hero's bottom shade so the transition dissolves smoothly into the scrolled backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[45svh] min-h-72 bg-gradient-to-b from-plum-950 via-plum-950/80 to-transparent"
      />
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="font-sans text-[11px] font-light uppercase tracking-[0.5em] text-coral sm:text-xs">
          Chapter One
        </p>
        <h2 className="mt-4 font-script text-5xl text-cream sm:text-7xl">Monthsary Message</h2>
        <p className="mt-4 text-xl font-light italic text-peach/90 sm:text-2xl">
          {showLetter
            ? "Take your time. It was written slowly."
            : "A little letter is waiting for you."}
        </p>
      </Reveal>

      <div className="mx-auto mt-14 flex min-h-[26rem] max-w-3xl items-center justify-center sm:min-h-[32rem]">
        <Envelope
          defaultOpen={defaultOpen}
          ariaLabel="Open the monthsary envelope"
          previewHeading="My dearest love,"
          onStageChange={setStage}
          onOpenComplete={() => onChapterTwoChange?.("visible")}
          onCloseStart={() => {
            onChapterTwoChange?.("hiding");
            scrollSectionIntoView();
          }}
          onCloseComplete={() => onChapterTwoChange?.("hidden")}
        >
          <HeartIcon className="mx-auto h-5 w-5 text-coral" />
          <p className="mt-3 text-center font-sans text-[10px] uppercase tracking-[0.5em] text-plum-700/70">
            Happy Monthsary
          </p>
          <h3 className="mt-6 font-script text-4xl text-plum-700 sm:text-5xl">
            My dearest madame,
          </h3>

          <div className="mt-6 space-y-5 text-lg leading-relaxed sm:text-xl">
            <p className="first-letter:float-left first-letter:mr-2 first-letter:font-script first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-coral">
              Another month has slipped by like the last light on the water, and somehow I find that
              I love you more than I did when it began. I did not know a heart could keep making
              room, but yours keeps teaching mine how.
            </p>
            <p>
              It has already been six months po since we started my madame, since that one fateful
              day, and around 7 months na din po from the very time I let my armies drive south.
              Yet, even as our communications get more and more fragile, we still somehow stuck
              together, and became even stronger than before.
            </p>
            <p>
              I really wish I can send you this po in advance my madame, but unfortunately, we have
              to wait po. I don't want to comrpomise your own safety po my madame--I know well
              enough that sending this website would get you in serious trouble. But soon po my
              madame, we won't need to hide na poo--because there'll be no more need for it po in
              the future (^^)
            </p>
            <p>
              So I wrote you a few poems, small lanterns for the evenings we share. Read them
              slowly, and know that every line was really just three words in disguise.
            </p>
            <p>Mwaaaa😘😘😘</p>
          </div>

          <p className="mt-8 text-right font-script text-3xl text-plum-700 sm:text-4xl">
            Forever yours,
          </p>
          <p className="mt-1 text-right text-sm italic text-plum-700/70">
            Today, tomorrow, and every month after.
          </p>
        </Envelope>
      </div>
    </section>
  );
}
