import { useEffect, useRef } from "react";

const petals = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 47) % 100,
  size: 8 + ((i * 7) % 10),
  delay: -((i * 2.3) % 18),
  duration: 14 + ((i * 3) % 12),
  dx: (i % 2 ? 1 : -1) * (30 + ((i * 13) % 90)),
  o: 0.35 + ((i * 11) % 40) / 100,
}));

/** Fixed full-bleed artwork that deepens as the reader scrolls, plus drifting petals. */
export default function Backdrop() {
  const veil = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight || 1;
      const t = Math.min(1, Math.max(0, window.scrollY / (h * 0.45)));
      if (veil.current) veil.current.style.opacity = String(t);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-plum-950"
    >
      <img
        src="/images/sunset-wedding.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[50%_70%]"
      />
      <div
        ref={veil}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(74,42,107,0.78),rgba(22,11,38,0.95)_75%)] backdrop-blur-[6px]"
        style={{ opacity: 0 }}
      />
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 animate-drift rounded-[100%_0_100%_0] bg-gradient-to-br from-cream to-peach"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.3,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--dx": `${p.dx}px`,
              "--o": p.o,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
