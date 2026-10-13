"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

/** Submit button for destructive actions: asks for confirmation first and shows a spinner while running. */
export default function ConfirmButton({
  children,
  message = "Are you sure? This cannot be undone.",
  className = "",
  label,
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
  label?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-label={label}
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={`inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}
