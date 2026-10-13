"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

/** Re-fetches the current server page on an interval (and when the tab regains focus) so numbers stay live. */
export default function LiveRefresh({ seconds = 30 }: { seconds?: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [last, setLast] = useState<string>("");

  useEffect(() => {
    const stamp = () => setLast(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" }));
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      start(() => router.refresh());
      stamp();
    };
    stamp();
    const id = setInterval(refresh, seconds * 1000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router, seconds]);

  return (
    <button
      type="button"
      onClick={() => {
        start(() => router.refresh());
      }}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-[12px] font-semibold text-text transition hover:border-primary hover:text-primary"
      title={`Auto-refreshes every ${seconds}s`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Live{last ? ` · ${last}` : ""}
      <RefreshCw className={`h-3.5 w-3.5 ${pending ? "animate-spin" : ""}`} />
    </button>
  );
}
