import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Shield,
  Sparkles,
  Waypoints,
  Image as ImageIcon,
  Inbox,
} from "lucide-react";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-background-field/40">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr] md:gap-8 md:px-6 md:py-10">
        <aside className="rounded-[28px] border border-border bg-white p-5 shadow-sm md:sticky md:top-24 md:h-[calc(100vh-8rem)] md:overflow-auto md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">Boxora</p>
              <h1 className="mt-1 font-heading text-xl text-dark">Admin Panel</h1>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <Shield className="h-5 w-5 text-primary" strokeWidth={2} />
            </span>
          </div>

          <nav className="mt-6 space-y-1.5 text-sm">
            {[
              { href: "/adminpanel", label: "Dashboard", icon: LayoutDashboard },
              { href: "/adminpanel/site-settings", label: "Site settings", icon: Settings },
              { href: "/adminpanel/navigation", label: "Navigation", icon: Waypoints },
              { href: "/adminpanel/home", label: "Homepage", icon: Sparkles },
              { href: "/adminpanel/products", label: "Products", icon: Package },
              { href: "/adminpanel/blog", label: "Blog", icon: FileText },
              { href: "/adminpanel/media", label: "Media", icon: ImageIcon },
              { href: "/adminpanel/quotes", label: "Quote requests", icon: Inbox },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between rounded-xl px-3 py-2.5 font-semibold text-text transition hover:bg-background-field hover:text-dark"
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-lighter transition group-hover:text-primary" />
                  {label}
                </span>
                <span className="text-lighter group-hover:text-primary" aria-hidden>
                  →
                </span>
              </Link>
            ))}

            <form action="/adminpanel/logout" method="post" className="pt-2">
              <button
                type="submit"
                className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-3 py-2.5 font-semibold text-text transition hover:border-primary/25 hover:bg-primary/[0.04] hover:text-primary"
              >
                <span className="flex items-center gap-2.5">
                  <LogOut className="h-4 w-4" />
                  Logout
                </span>
                <span aria-hidden>↗</span>
              </button>
            </form>
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

