"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

/** Submit button that shows a spinner and disables itself while the server action runs. */
export default function SubmitButton({
  children,
  pendingText = "Saving…",
  className = "btn-slip rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white",
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
