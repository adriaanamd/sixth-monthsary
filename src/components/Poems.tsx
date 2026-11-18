import { useCallback, useEffect, useState } from "react";
import Reveal from "./Reveal";
import { poems } from "../data/poems";

const roman = ["I", "II", "III", "IV", "V", "VI"];

export default function Poems() {
  const [active, setActive] = useState<number | null>(null);
  const poem = active === null ? null : poems[active];

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (d: number) => setActive((i) => (i === null ? i : (i + d + poems.length) % poems.length)),
    [],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, step]);

  return (
    <section id="poems" className="relative px-6 pb-24 pt-20 sm:pt-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="font-sans text-[11px] font-light uppercase tracking-[0.5em] text-coral sm:text-xs">
          Chapter Two
        </p>
        <h2 className="mt-4 font-script text-5xl text-cream sm:text-7xl">Six Little Poems</h2>
        <p className="mt-4 text-xl font-light italic text-peach/90 sm:text-2xl">
          Choose one that matches your heart today.
        </p>
      </Reveal>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {poems.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 120}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-cream/15 bg-gradient-to-b from-cream/[0.14] to-cream/[0.05] p-8 text-left backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[0_30px_60px_-20px_rgba(255,138,107,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <span
                aria-hidden
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-coral/30 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-40"
              />
              <span className="flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.35em] text-gold">
                <span>{roman[i]}</span>
                <span className="text-cream/60">{p.mood}</span>
              </span>
              <h3 className="mt-8 font-script text-4xl leading-tight text-cream">{p.title}</h3>
              <span className="my-5 h-px w-12 bg-gold/70 transition-all duration-500 group-hover:w-24" />
              <p className="text-lg italic leading-relaxed text-cream/80">
                {p.lines[0][0]}
                <br />
                {p.lines[0][1]}
                <span className="text-cream/40">…</span>
              </p>
              <span className="mt-auto inline-flex items-center gap-2 pt-8 font-sans text-[11px] uppercase tracking-[0.3em] text-peach transition-colors group-hover:text-gold">
                Read poem
                <svg
                  width="16"
                  height="10"
                  viewBox="0 0 16 10"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                >
                  <path d="M0 5h14M10 1l4 4-4 4" />
                </svg>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {poem && active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={poem.title}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-plum-950/80 p-4 backdrop-blur-md"
          style={{ animation: "fade 0.4s ease both" }}
          onClick={close}
        >
          <article
            key={poem.id}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-xl rounded-md bg-gradient-to-b from-cream to-[#fbe6d4] px-8 py-12 text-center text-plum-900 shadow-[0_40px_90px_rgba(0,0,0,0.6)] sm:px-14 sm:py-16"
            style={{ animation: "pop 0.6s cubic-bezier(.2,.7,.2,1) both" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 rounded-sm border border-coral/40"
            />
            <button
              type="button"
              onClick={close}
              aria-label="Close poem"
              className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-plum-700 transition-colors hover:bg-coral hover:text-cream"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>

            <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-coral">
              {roman[active]} &nbsp;·&nbsp; {poem.mood}
            </p>
            <h3 className="mt-5 font-script text-5xl text-plum-700 sm:text-6xl">{poem.title}</h3>
            <span className="mx-auto mt-6 block h-px w-16 bg-coral/60" />

            <div className="mt-8 space-y-7 text-xl italic leading-[1.7] sm:text-2xl">
              {poem.lines.map((stanza, si) => (
                <p key={si}>
                  {stanza.map((l, li) => (
                    <span key={li} className="block">
                      {l}
                    </span>
                  ))}
                </p>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-between font-sans text-[11px] uppercase tracking-[0.3em] text-plum-700">
              <button
                type="button"
                onClick={() => step(-1)}
                className="cursor-pointer px-2 py-2 transition-colors hover:text-coral"
              >
                ← Previous
              </button>
              <span className="text-plum-700/50">
                {active + 1} / {poems.length}
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                className="cursor-pointer px-2 py-2 transition-colors hover:text-coral"
              >
                Next →
              </button>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
