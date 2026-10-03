"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query as an external store.
 *
 * useSyncExternalStore is the correct primitive here: it reads the current
 * value during render on the client and returns the server snapshot on the
 * server, so there is no effect-driven setState and no hydration mismatch.
 */
function useMediaQuery(query: string, serverSnapshot = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}

/** True when the visitor has asked the OS to reduce motion. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True when the primary pointer can hover, so pointer parallax is worth it. */
export function useHasFinePointer() {
  return useMediaQuery("(pointer: fine)");
}
