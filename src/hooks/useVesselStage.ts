import { useCallback, useEffect, useRef, useState } from "react";

export type VesselStage =
  | "closed"
  | "opening"
  | "leaving"
  | "reading"
  | "folding"
  | "returning"
  | "closing";

type UseVesselStageOptions = {
  defaultOpen?: boolean;
  onOpenComplete?: () => void;
  onCloseStart?: () => void;
  onCloseComplete?: () => void;
};

/**
 * Coordinates the multi-step open and close animation stages shared by the
 * interactive envelope and parchment scroll vessels.
 */
export function useVesselStage({
  defaultOpen = false,
  onOpenComplete,
  onCloseStart,
  onCloseComplete,
}: UseVesselStageOptions = {}) {
  const [stage, setStage] = useState<VesselStage>(defaultOpen ? "reading" : "closed");
  const timers = useRef<number[]>([]);
  const callbacksRef = useRef({ onOpenComplete, onCloseStart, onCloseComplete });
  callbacksRef.current = { onOpenComplete, onCloseStart, onCloseComplete };

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const open = useCallback(() => {
    if (stage !== "closed") return;
    clearTimers();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage("reading");
      callbacksRef.current.onOpenComplete?.();
      return;
    }

    setStage("opening");
    later(() => setStage("leaving"), 2500);
    later(() => {
      setStage("reading");
      callbacksRef.current.onOpenComplete?.();
    }, 3100);
  }, [clearTimers, later, stage]);

  const close = useCallback(() => {
    if (stage !== "reading") return;
    clearTimers();
    callbacksRef.current.onCloseStart?.();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage("closed");
      callbacksRef.current.onCloseComplete?.();
      return;
    }

    setStage("folding");
    later(() => {
      setStage("returning");
      callbacksRef.current.onCloseComplete?.();
    }, 1000);
    later(() => setStage("closing"), 1550);
    later(() => setStage("closed"), 3200);
  }, [clearTimers, later, stage]);

  return {
    stage,
    open,
    close,
    isOpen: stage === "opening" || stage === "leaving" || stage === "returning",
    hideSeal: stage !== "closed",
    showContent: stage === "reading" || stage === "folding",
  };
}
