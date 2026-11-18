export default function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-end px-6 pb-8 text-center">
      {/* deepening shade so the title reads while the couple stays in view above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-plum-950 via-plum-950/80 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-plum-950/50 to-transparent"
      />

      <div className="relative" style={{ animation: "rise-in 1.4s cubic-bezier(.2,.7,.2,1) both" }}>
        <p className="font-sans text-[11px] font-light uppercase tracking-[0.5em] text-peach sm:text-xs">
          A monthsary collection
        </p>
        <h1 className="mt-3 font-script text-[clamp(3.4rem,10vw,7.5rem)] leading-[1] text-cream drop-shadow-[0_4px_30px_rgba(22,11,38,0.8)]">
          Verses at Sunset
        </h1>
        <div className="mx-auto mt-4 flex items-center justify-center gap-4 text-gold">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold" />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 5 6 5c2 0 3.4 1.1 4.2 2.5h3.6C14.6 6.1 16 5 18 5c3.3 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21z" />
          </svg>
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold" />
        </div>
        <p className="mx-auto mt-4 max-w-md text-xl font-light italic text-cream/90 sm:text-2xl">
          Surprisee poo, my madame! I hope you enjoy this day poo, even just for a lil bit po. :DD
        </p>
      </div>

      <a
        href="#message"
        className="group relative mt-8 flex flex-col items-center gap-3 font-sans text-[11px] uppercase tracking-[0.4em] text-cream/80 transition-colors hover:text-gold"
      >
        Open the letter
        <span className="flex h-12 w-7 items-start justify-center rounded-full border border-cream/50 pt-2 group-hover:border-gold">
          <span className="h-2 w-1 animate-float rounded-full bg-current" />
        </span>
      </a>
    </section>
  );
}
