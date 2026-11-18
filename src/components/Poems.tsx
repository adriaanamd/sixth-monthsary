import Reveal from "./Reveal";
import { poems, ROMAN_NUMERALS } from "../data/poems";

export default function Poems({ onSelectPoem }: { onSelectPoem: (id: number) => void }) {
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
        {poems.map((p, i) => {
          const isEnvelope = p.vessel === "envelope";
          return (
            <Reveal key={p.id} delay={(i % 3) * 120}>
              <a
                href={`/poem/${p.id}`}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  onSelectPoem(p.id);
                }}
                className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-cream/15 bg-gradient-to-b from-cream/[0.14] to-cream/[0.05] p-8 text-left backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[0_30px_60px_-20px_rgba(255,138,107,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                <span
                  aria-hidden
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-coral/30 opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="flex items-center justify-between gap-2 font-sans text-[10px] uppercase tracking-[0.35em] text-gold">
                  <span>{ROMAN_NUMERALS[i]}</span>
                  <span className="text-cream/60">
                    {p.mood} &nbsp;·&nbsp; {isEnvelope ? "Envelope" : "Scroll"}
                  </span>
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
                  {isEnvelope ? "Open envelope" : "Unroll scroll"}
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
              </a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
