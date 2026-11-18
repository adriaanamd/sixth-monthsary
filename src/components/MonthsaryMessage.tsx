import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

type Stage = "closed" | "opening" | "leaving" | "reading" | "folding" | "returning" | "closing";

export type ChapterTwoVisibility = "hidden" | "visible" | "hiding";

const HeartIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 5 6 5c2 0 3.4 1.1 4.2 2.5h3.6C14.6 6.1 16 5 18 5c3.3 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21z" />
  </svg>
);

export default function MonthsaryMessage({
  onChapterTwoChange,
}: {
  onChapterTwoChange?: (state: ChapterTwoVisibility) => void;
}) {
  const [stage, setStage] = useState<Stage>("closed");
  const sectionRef = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const openEnvelope = () => {
    if (stage !== "closed") return;
    clearTimers();
    setStage("opening");
    later(() => setStage("leaving"), 2500);
    later(() => {
      setStage("reading");
      onChapterTwoChange?.("visible");
    }, 3100);
  };

  const foldLetter = () => {
    if (stage !== "reading") return;
    clearTimers();
    setStage("folding");
    onChapterTwoChange?.("hiding");

    if (sectionRef.current && sectionRef.current.getBoundingClientRect().top < 0) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      sectionRef.current.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    }

    later(() => {
      setStage("returning");
      onChapterTwoChange?.("hidden");
    }, 1000);
    later(() => setStage("closing"), 1550);
    later(() => setStage("closed"), 3200);
  };

  const isOpen = stage === "opening" || stage === "leaving" || stage === "returning";
  const hideSeal = stage !== "closed";
  const showLetter = stage === "reading" || stage === "folding";

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
        {!showLetter ? (
          <div
            className={`flex flex-col items-center transition-all duration-500 ease-out ${
              stage === "leaving" ? "translate-y-8 scale-95 opacity-0" : ""
            }`}
            style={
              stage === "returning" ? { animation: "env-enter 0.5s ease-out both" } : undefined
            }
          >
            {/* Envelope */}
            <button
              type="button"
              onClick={openEnvelope}
              disabled={stage !== "closed"}
              aria-label="Open the monthsary envelope"
              className={`group relative mt-[16%] block aspect-[10/7] w-[min(86vw,440px)] cursor-pointer [perspective:1400px] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold disabled:cursor-default ${
                isOpen
                  ? "env-open"
                  : stage === "closing"
                    ? "env-closing"
                    : "transition-transform duration-500 hover:-translate-y-1.5 hover:rotate-[-1deg]"
              }`}
              style={{ filter: "drop-shadow(0 30px 40px rgba(10,4,20,0.55))" }}
            >
              {/* back panel */}
              <div className="absolute inset-0 rounded-md bg-gradient-to-b from-[#e9b896] to-[#d99a7c]" />

              {/* letter inside */}
              <div className="env-letter absolute inset-x-[6%] bottom-[5%] top-[10%] z-10 rounded-sm bg-gradient-to-b from-cream to-[#fbe3cf] px-[8%] pt-[7%] text-left shadow-md">
                <p className="font-script text-2xl leading-none text-plum-700 sm:text-3xl">
                  My dearest love,
                </p>
                <div className="mt-4 space-y-2.5">
                  <span className="block h-[3px] w-full rounded-full bg-plum-700/20" />
                  <span className="block h-[3px] w-[92%] rounded-full bg-plum-700/20" />
                  <span className="block h-[3px] w-[96%] rounded-full bg-plum-700/20" />
                  <span className="block h-[3px] w-[60%] rounded-full bg-plum-700/20" />
                </div>
              </div>

              {/* front pocket */}
              <svg
                viewBox="0 0 100 70"
                preserveAspectRatio="none"
                className="absolute inset-0 z-20 h-full w-full overflow-visible"
                aria-hidden
              >
                <defs>
                  <linearGradient id="envL" x1="0" y1="0" x2="1" y2="0.4">
                    <stop offset="0" stopColor="#f2c5a6" />
                    <stop offset="1" stopColor="#e3a789" />
                  </linearGradient>
                  <linearGradient id="envR" x1="1" y1="0" x2="0" y2="0.4">
                    <stop offset="0" stopColor="#efbd9d" />
                    <stop offset="1" stopColor="#dd9f82" />
                  </linearGradient>
                  <linearGradient id="envB" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0" stopColor="#f6cfb2" />
                    <stop offset="1" stopColor="#e8ae90" />
                  </linearGradient>
                </defs>
                <polygon points="0,0 52,40 0,70" fill="url(#envL)" />
                <polygon points="100,0 48,40 100,70" fill="url(#envR)" />
                <polygon points="0,70 50,38 100,70" fill="url(#envB)" />
                <path
                  d="M0 70 L50 38 L100 70"
                  stroke="rgba(120,60,50,0.18)"
                  strokeWidth="0.3"
                  fill="none"
                />
              </svg>

              {/* flap */}
              <div className="env-flap absolute inset-0 z-30 bg-gradient-to-b from-[#f7d2b8] to-[#e6a98a] [clip-path:polygon(0_0,100%_0,50%_58%)]" />

              {/* wax seal */}
              <span
                className={`absolute left-1/2 top-[52%] z-40 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#ff9d83,#d9433f_70%,#a62b34)] text-cream transition-all duration-500 sm:h-16 sm:w-16 ${
                  hideSeal ? "scale-50 opacity-0" : "group-hover:scale-110"
                }`}
                style={{ animation: hideSeal ? undefined : "seal-pulse 2.4s ease-in-out infinite" }}
              >
                <span className="absolute inset-1.5 rounded-full border border-cream/30" />
                <HeartIcon className="h-6 w-6 drop-shadow" />
              </span>
            </button>

            <p
              className={`mt-12 font-sans text-[11px] uppercase tracking-[0.4em] text-cream/70 transition-opacity duration-500 ${
                hideSeal ? "opacity-0" : "opacity-100"
              }`}
            >
              Tap the seal to open
            </p>
          </div>
        ) : (
          <article
            className="relative w-full max-w-xl rounded-md bg-gradient-to-b from-cream to-[#fbe6d4] px-8 py-12 text-plum-900 shadow-[0_40px_80px_rgba(10,4,20,0.6)] sm:px-14 sm:py-16"
            style={{
              animation:
                stage === "folding"
                  ? "fold 0.95s cubic-bezier(.5,0,.2,1) both"
                  : "unfold 1.1s cubic-bezier(.2,.7,.2,1) both",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 rounded-sm border border-coral/40"
            />
            <HeartIcon className="mx-auto h-5 w-5 text-coral" />
            <p className="mt-3 text-center font-sans text-[10px] uppercase tracking-[0.5em] text-plum-700/70">
              Happy Monthsary
            </p>
            <h3 className="mt-6 font-script text-4xl text-plum-700 sm:text-5xl">
              My dearest madame,
            </h3>

            <div className="mt-6 space-y-5 text-lg leading-relaxed sm:text-xl">
              <p className="first-letter:float-left first-letter:mr-2 first-letter:font-script first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-coral">
                Another month has slipped by like the last light on the water, and somehow I find
                that I love you more than I did when it began. I did not know a heart could keep
                making room, but yours keeps teaching mine how.
              </p>
              <p>
                It has already been six months po since we started my madame, since that one fateful
                day, and around 7 months na din po from the very time I let my armies drive south.
                Yet, even as our communications get more and more fragile, we still somehow stuck
                together, and became even stronger than before.
              </p>
              <p>
                I really wish I can send you this po in advance my madame, but unfortunately, we
                have to wait po. I don't want to comrpomise your own safety po my madame--I know
                well enough that sending this website would get you in serious trouble. But soon po
                my madame, we won't need to hide na poo--because there'll be no more need for it po
                in the future (^^)
              </p>
              <p>
                So I wrote you a few poems, small lanterns for the evenings we share. Read them
                slowly, and know that every line was really just three words in disguise.
              </p>
              <p>
                Mwaaaa😘😘😘
              </p>
            </div>

            <p className="mt-8 text-right font-script text-3xl text-plum-700 sm:text-4xl">
              Forever yours,
            </p>
            <p className="mt-1 text-right text-sm italic text-plum-700/70">
              Today, tomorrow, and every month after.
            </p>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={foldLetter}
                disabled={stage === "folding"}
                className="cursor-pointer rounded-full border border-plum-700/30 px-6 py-2.5 font-sans text-[11px] uppercase tracking-[0.3em] text-plum-700 transition-colors hover:border-coral hover:bg-coral hover:text-cream disabled:pointer-events-none disabled:opacity-60"
              >
                Fold the letter
              </button>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
