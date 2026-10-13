"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "boxora:wishlist";
const EVENT = "boxora:wishlist-change";
const EMPTY: string[] = [];

let lastRaw: string | null = null;
let lastValue: string[] = EMPTY;

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY) ?? "[]";
    if (raw !== lastRaw) {
      lastRaw = raw;
      const parsed: unknown = JSON.parse(raw);
      lastValue = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : EMPTY;
    }
    return lastValue;
  } catch {
    return EMPTY;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

/** Saved product slugs, kept in this browser's localStorage and shared across components. */
export function useWishlist() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);

  const toggle = useCallback((slug: string) => {
    const current = read();
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // storage unavailable (private mode): nothing to persist
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { items, has: (slug: string) => items.includes(slug), toggle };
}
