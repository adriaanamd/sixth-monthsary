import { useEffect, type ReactNode } from "react";
import { useVesselStage, type VesselStage } from "../hooks/useVesselStage";
import HeartIcon from "./HeartIcon";

type ScrollProps = {
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

/** Turned walnut-and-gold dowel bar anchoring the top or bottom of a parchment scroll. */
function ScrollRoller({ position }: { position: "top" | "bottom" }) {
  const isTop = position === "top";
  return (
    <div
      aria-hidden
      className={`relative z-20 flex w-[calc(100%+2.25rem)] -ml-[1.125rem] items-center sm:w-[calc(100%+3.25rem)] sm:-ml-[1.625rem] ${
        isTop
          ? "drop-shadow-[0_6px_10px_rgba(18,7,28,0.45)]"
          : "drop-shadow-[0_-4px_10px_rgba(18,7,28,0.4)]"
      }`}
    >
      {/* Left turned finial */}
      <span className="h-5 w-2.5 shrink-0 rounded-l-full bg-gradient-to-b from-[#f3d493] via-[#b8843c] to-[#6e471b] shadow-inner sm:h-6 sm:w-3" />
      <span className="h-7 w-2 shrink-0 rounded-sm bg-gradient-to-b from-[#9c5a40] via-[#6d3726] to-[#3f1c14] sm:h-8 sm:w-2.5" />
      <span className="h-6 w-1.5 shrink-0 bg-gradient-to-b from-gold via-[#c79546] to-[#7c5320] sm:h-7" />

      {/* Main wooden dowel */}
      <div className="relative h-6 flex-1 bg-gradient-to-b from-[#a86448] via-[#743b29] to-[#411d15] sm:h-7">
        <span className="absolute inset-x-0 top-1 h-px bg-[#f5c7a3]/35" />
        <span className="absolute inset-x-0 bottom-0.5 h-px bg-black/35" />
      </div>

      {/* Right turned finial */}
      <span className="h-6 w-1.5 shrink-0 bg-gradient-to-b from-gold via-[#c79546] to-[#7c5320] sm:h-7" />
      <span className="h-7 w-2 shrink-0 rounded-sm bg-gradient-to-b from-[#9c5a40] via-[#6d3726] to-[#3f1c14] sm:h-8 sm:w-2.5" />
      <span className="h-5 w-2.5 shrink-0 rounded-r-full bg-gradient-to-b from-[#f3d493] via-[#b8843c] to-[#6e471b] shadow-inner sm:h-6 sm:w-3" />
    </div>
  );
}

/**
 * Interactive ribbon-tied parchment scroll that unrolls to reveal a poem
 * and rolls back up into its dowels on request.
 */
export default function Scroll({
  defaultOpen = false,
  ariaLabel = "Unroll the sealed scroll",
  previewHeading = "For my madame,",
  tapPrompt = "Tap the seal to unroll",
  closeLabel = "Roll up the scroll",
  articleClassName = "",
  onStageChange,
  onOpenComplete,
  onCloseStart,
  onCloseComplete,
  children,
}: ScrollProps) {
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
      <div
        className="w-full max-w-xl"
        style={{
          animation:
            stage === "folding"
              ? "roll-up 0.95s cubic-bezier(.5,0,.2,1) both"
              : "unroll 1.1s cubic-bezier(.2,.7,.2,1) both",
        }}
      >
        <ScrollRoller position="top" />

        <article
          className={`relative -my-1.5 bg-gradient-to-b from-[#fff5ea] via-[#fdebd8] to-[#f7dec4] px-8 py-12 text-plum-900 shadow-[0_40px_80px_rgba(10,4,20,0.6),inset_0_16px_22px_-12px_rgba(70,28,20,0.34),inset_0_-16px_22px_-12px_rgba(70,28,20,0.34)] sm:px-14 sm:py-16 ${articleClassName}`}
        >
          {/* Side curled parchment shading */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-[#d6a380]/30 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-[#d6a380]/30 to-transparent"
          />

          {/* Double ornamental scroll frame */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-4 inset-y-5 border border-gold/55"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-5 inset-y-6 border border-coral/25"
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

        <ScrollRoller position="bottom" />
      </div>
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
        className={`group relative mt-8 block w-[min(82vw,390px)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold disabled:cursor-default ${
          isOpen
            ? "scroll-open"
            : stage === "closing"
              ? "scroll-closing"
              : "transition-transform duration-500 hover:-translate-y-1.5 hover:rotate-[-1deg]"
        }`}
        style={{ filter: "drop-shadow(0 30px 40px rgba(10,4,20,0.55))" }}
      >
        <ScrollRoller position="top" />

        {/* Rolled parchment cylinder that expands slightly while unrolling */}
        <div className="scroll-parchment relative mx-1.5 -my-1.5 overflow-hidden bg-[linear-gradient(180deg,#d39e7a_0%,#f7dcc4_18%,#fff5ea_46%,#f4d0b2_84%,#c78e6b_100%)] shadow-[inset_0_10px_18px_-8px_rgba(70,25,18,0.45),inset_0_-10px_18px_-8px_rgba(70,25,18,0.45)]">
          {/* Subtle curled edge borders */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-[#b9805f]/40 to-transparent"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-[#b9805f]/40 to-transparent"
          />

          {/* Horizontal parchment roll creases when closed */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-4 top-[26%] h-px bg-[#b88262]/30"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-4 bottom-[24%] h-px bg-[#b88262]/25"
          />

          {/* Preview lines revealed as the scroll unfurls */}
          <div className="scroll-preview flex h-full flex-col justify-center px-10 text-left">
            <p className="truncate font-script text-2xl leading-none text-plum-700 sm:text-3xl">
              {previewHeading}
            </p>
            <div className="mt-4 space-y-2.5">
              <span className="block h-[3px] w-full rounded-full bg-plum-700/20" />
              <span className="block h-[3px] w-[88%] rounded-full bg-plum-700/20" />
              <span className="block h-[3px] w-[94%] rounded-full bg-plum-700/20" />
              <span className="block h-[3px] w-[58%] rounded-full bg-plum-700/20" />
            </div>
          </div>

          {/* Vertical satin ribbon holding the scroll closed */}
          <div
            aria-hidden
            className="scroll-ribbon pointer-events-none absolute inset-y-0 left-1/2 z-10 w-8 -translate-x-1/2 bg-gradient-to-r from-[#a62b34] via-[#e25a50] to-[#9b242d] shadow-[0_0_14px_rgba(25,8,15,0.4)]"
          >
            <span className="absolute inset-y-0 left-1 w-px bg-gold/60" />
            <span className="absolute inset-y-0 right-1 w-px bg-gold/60" />
          </div>

          {/* Wax seal */}
          <span
            className={`absolute left-1/2 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#ff9d83,#d9433f_70%,#a62b34)] text-cream transition-all duration-500 sm:h-16 sm:w-16 ${
              hideSeal ? "scale-50 opacity-0" : "group-hover:scale-110"
            }`}
            style={{ animation: hideSeal ? undefined : "seal-pulse 2.4s ease-in-out infinite" }}
          >
            <span className="absolute inset-1.5 rounded-full border border-cream/30" />
            <HeartIcon className="h-6 w-6 drop-shadow" />
          </span>
        </div>

        <ScrollRoller position="bottom" />
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
