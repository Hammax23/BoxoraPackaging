"use client";

import { ArrowRight, Lock, Mail, Shield } from "lucide-react";
import { useState } from "react";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/admin/login", { method: "POST", body: fd });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Login failed. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = "/adminpanel";
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-field/60 via-white to-white">
      <div className="container-main flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-[520px] overflow-hidden rounded-[32px] border border-border bg-white shadow-[0_24px_80px_rgba(30,16,35,0.12)]">
          <div className="border-b border-border bg-white px-6 py-7 sm:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-label text-primary">Admin</p>
                <h1 className="mt-4 font-heading text-3xl leading-tight text-dark sm:text-4xl">
                  Secure login
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-text sm:text-base">
                  Access your Boxora control panel.
                </p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Shield className="h-6 w-6 text-primary" strokeWidth={2} />
              </span>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4 px-6 py-6 sm:px-8 sm:py-8">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lighter" />
              <input
                name="email"
                type="email"
                required
                placeholder="Admin email"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 pl-11 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lighter" />
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 pl-11 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-secondary/25 bg-secondary/10 px-4 py-3 text-sm text-dark">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="btn-slip inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_8px_28px_rgba(39,87,255,0.28)] transition hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-xs text-lighter">
              Tip: set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env` then run `npm run db:seed`.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

