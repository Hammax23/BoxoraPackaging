"use client";

import { useState } from "react";

/**
 * Anti-spam without hidden inputs (browser autofill and extensions fill those and silently break real
 * submissions). Bots post instantly; people take a few seconds. Call stamp(fd) before sending.
 */
export function useFormClock() {
  const [openedAt] = useState(() => Date.now());
  return (fd: FormData) => {
    fd.set("elapsed", String(Date.now() - openedAt));
  };
}
