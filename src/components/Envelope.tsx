import { useEffect, useId, type ReactNode } from "react";
import { useVesselStage, type VesselStage } from "../hooks/useVesselStage";
import HeartIcon from "./HeartIcon";

type EnvelopeProps = {
  defaultOpen?: boolean;
  ariaLabel?: string;
  previewHeading?: string;
  tapPrompt?: string;
  closeLabel?: string;
  articleClassName?: string;
  onStageChange?: (stage: VesselStage) => void;
  onOpenComplete?: () => void;
  onCloseStart?: () => void;
  onCloseComplete?: () => void;
  children: ReactNode;
};

/**
 * Interactive wax-sealed envelope that opens to unfold a letter or poem,
 * and folds back into the envelope on request.
 */
export default function Envelope({
  defaultOpen = false,
  ariaLabel = "Open the sealed envelope",
  previewHeading = "My dearest love,",
  tapPrompt = "Tap the seal to open",
  closeLabel = "Fold the letter",
  articleClassName = "",
  onStageChange,
  onOpenComplete,
  onCloseStart,
  onCloseComplete,
  children,
}: EnvelopeProps) {
  const uid = useId().replace(/:/g, "");
  const gradL = `envL-${uid}`;
  const gradR = `envR-${uid}`;
  const gradB = `envB-${uid}`;

  const { stage, open, close, isOpen, hideSeal, showContent } = useVesselStage({
    defaultOpen,
    onOpenComplete,
    onCloseStart,
    onCloseComplete,
  });

  useEffect(() => {
    onStageChange?.(stage);
  }, [onStageChange, stage]);

  if (showContent) {
    return (
      <article
        className={`relative w-full max-w-xl rounded-md bg-gradient-to-b from-cream to-[#fbe6d4] px-8 py-12 text-plum-900 shadow-[0_40px_80px_rgba(10,4,20,0.6)] sm:px-14 sm:py-16 ${articleClassName}`}
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
        {children}

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={close}
            disabled={stage === "folding"}
            className="cursor-pointer rounded-full border border-plum-700/30 px-6 py-2.5 font-sans text-[11px] uppercase tracking-[0.3em] text-plum-700 transition-colors hover:border-coral hover:bg-coral hover:text-cream disabled:pointer-events-none disabled:opacity-60"
          >
            {closeLabel}
          </button>
        </div>
      </article>
    );
  }

  return (
    <div
      className={`flex flex-col items-center transition-all duration-500 ease-out ${
        stage === "leaving" ? "translate-y-8 scale-95 opacity-0" : ""
      }`}
      style={stage === "returning" ? { animation: "env-enter 0.5s ease-out both" } : undefined}
    >
      <button
        type="button"
        onClick={open}
        disabled={stage !== "closed"}
        aria-label={ariaLabel}
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
          <p className="truncate font-script text-2xl leading-none text-plum-700 sm:text-3xl">
            {previewHeading}
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
            <linearGradient id={gradL} x1="0" y1="0" x2="1" y2="0.4">
              <stop offset="0" stopColor="#f2c5a6" />
              <stop offset="1" stopColor="#e3a789" />
            </linearGradient>
            <linearGradient id={gradR} x1="1" y1="0" x2="0" y2="0.4">
              <stop offset="0" stopColor="#efbd9d" />
              <stop offset="1" stopColor="#dd9f82" />
            </linearGradient>
            <linearGradient id={gradB} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#f6cfb2" />
              <stop offset="1" stopColor="#e8ae90" />
            </linearGradient>
          </defs>
          <polygon points="0,0 52,40 0,70" fill={`url(#${gradL})`} />
          <polygon points="100,0 48,40 100,70" fill={`url(#${gradR})`} />
          <polygon points="0,70 50,38 100,70" fill={`url(#${gradB})`} />
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
        {tapPrompt}
      </p>
    </div>
  );
}
