import { useState } from "react";
import { poems, ROMAN_NUMERALS, type Poem } from "../data/poems";
import type { VesselStage } from "../hooks/useVesselStage";
import Envelope from "./Envelope";
import HeartIcon from "./HeartIcon";
import Scroll from "./Scroll";

type PoemPageProps = {
  poem: Poem;
  poemIndex: number;
  onBack: () => void;
};

/**
 * Full-page view for an individual poem, presented inside either an
 * interactive sealed envelope or a ribbon-tied parchment scroll.
 */
export default function PoemPage({ poem, poemIndex, onBack }: PoemPageProps) {
  const [stage, setStage] = useState<VesselStage>("closed");

  const showPoem = stage === "reading" || stage === "folding";

  const scrollToTopIfNeeded = () => {
    if (window.scrollY > 120) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    }
  };

  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onBack();
  };

  const poemContent = (
    <>
      <HeartIcon className="mx-auto h-5 w-5 text-coral" />
      <p className="mt-3 text-center font-sans text-[10px] uppercase tracking-[0.5em] text-coral">
        {ROMAN_NUMERALS[poemIndex]} &nbsp;·&nbsp; {poem.mood}
      </p>
      <h2 className="mt-5 text-center font-script text-5xl text-plum-700 sm:text-6xl">
        {poem.title}
      </h2>
      <span className="mx-auto mt-6 block h-px w-16 bg-coral/60" />

      <div className="mt-8 space-y-7 text-center text-xl italic leading-[1.7] sm:text-2xl">
        {poem.lines.map((stanza, si) => (
          <p key={si}>
            {stanza.map((line, li) => (
              <span key={li} className="block">
                {line}
              </span>
            ))}
          </p>
        ))}
      </div>
    </>
  );

  const vesselLabel = poem.vessel === "envelope" ? "Envelope" : "Scroll";
  const subtitle = showPoem
    ? "Take your time. It was written slowly."
    : poem.vessel === "envelope"
      ? "A sealed poem is waiting for you."
      : "A tied scroll is waiting for you.";

  return (
    <section
      className="relative min-h-svh px-6 pb-24 pt-10 sm:pt-14"
      style={{ animation: "fade 0.5s ease both" }}
    >
      <nav
        aria-label="Poem navigation"
        className="mx-auto flex max-w-4xl items-center justify-between gap-4"
      >
        <a
          href="/#poems"
          onClick={handleBackClick}
          className="inline-flex items-center gap-2.5 rounded-full border border-cream/20 bg-plum-950/40 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.3em] text-cream/85 backdrop-blur-md transition-colors hover:border-gold/60 hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <span aria-hidden>←</span>
          Chapter Two
        </a>

        <div className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.35em] text-peach/80">
          <span className="rounded-full border border-gold/30 bg-cream/5 px-3.5 py-1.5 text-gold">
            {vesselLabel}
          </span>
          <span>
            {poemIndex + 1} / {poems.length}
          </span>
        </div>
      </nav>

      <header className="mx-auto mt-12 max-w-2xl text-center sm:mt-14">
        <p className="font-sans text-[11px] font-light uppercase tracking-[0.5em] text-coral sm:text-xs">
          Chapter Two &nbsp;·&nbsp; {ROMAN_NUMERALS[poemIndex]} &nbsp;·&nbsp; {poem.mood}
        </p>
        <h1 className="mt-4 font-script text-5xl text-cream sm:text-7xl">{poem.title}</h1>
        <p className="mt-4 text-xl font-light italic text-peach/90 sm:text-2xl">{subtitle}</p>
      </header>

      <div className="mx-auto mt-14 flex min-h-[26rem] max-w-3xl items-center justify-center sm:min-h-[30rem]">
        {poem.vessel === "envelope" ? (
          <Envelope
            key={poem.id}
            ariaLabel={`Open the envelope for ${poem.title}`}
            previewHeading={poem.title}
            tapPrompt="Tap the seal to open"
            closeLabel="Fold the letter"
            onStageChange={setStage}
            onCloseStart={scrollToTopIfNeeded}
          >
            {poemContent}
          </Envelope>
        ) : (
          <Scroll
            key={poem.id}
            ariaLabel={`Unroll the scroll for ${poem.title}`}
            previewHeading={poem.title}
            tapPrompt="Tap the seal to unroll"
            closeLabel="Roll up the scroll"
            onStageChange={setStage}
            onCloseStart={scrollToTopIfNeeded}
          >
            {poemContent}
          </Scroll>
        )}
      </div>
    </section>
  );
}
