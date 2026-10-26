"use client";

import {
  Activity,
  ExternalLink,
  Factory,
  FileText,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Mail,
  MessageSquare,
  Package,
  Settings,
  ShieldCheck,
  Sparkles,
  Truck,
  Waypoints,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; icon: typeof Inbox; badge?: number };

export default function AdminNav({ newQuotes, unreadMessages }: { newQuotes: number; unreadMessages: number }) {
  const pathname = usePathname();

  const groups: { title: string; items: Item[] }[] = [
    { title: "Overview", items: [{ href: "/adminpanel", label: "Dashboard", icon: LayoutDashboard }] },
    {
      title: "Leads",
      items: [
        { href: "/adminpanel/quotes", label: "Quote requests", icon: Inbox, badge: newQuotes },
        { href: "/adminpanel/orders", label: "Orders & tracking", icon: Truck },
        { href: "/adminpanel/messages", label: "Messages", icon: MessageSquare, badge: unreadMessages },
        { href: "/adminpanel/subscribers", label: "Subscribers", icon: Mail },
      ],
    },
    {
      title: "Content",
      items: [
        { href: "/adminpanel/content", label: "Page content", icon: LayoutTemplate },
        { href: "/adminpanel/products", label: "Products", icon: Package },
        { href: "/adminpanel/blog", label: "Blog", icon: FileText },
        { href: "/adminpanel/industries", label: "Industries", icon: Factory },
        { href: "/adminpanel/home", label: "FAQs & reviews", icon: Sparkles },
        { href: "/adminpanel/media", label: "Media library", icon: ImageIcon },
      ],
    },
    {
      title: "Settings",
      items: [
        { href: "/adminpanel/site-settings", label: "Site settings", icon: Settings },
        { href: "/adminpanel/navigation", label: "Navigation", icon: Waypoints },
      ],
    },
    {
      title: "Account",
      items: [
        { href: "/adminpanel/activity", label: "Activity log", icon: Activity },
        { href: "/adminpanel/security", label: "Security", icon: ShieldCheck },
      ],
    },
  ];

  const isActive = (href: string) =>
    href === "/adminpanel" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const flat = groups.flatMap((g) => g.items);

  return (
    <>
      {/* Mobile: horizontal scroller */}
      <nav aria-label="Admin" className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 md:hidden">
        {flat.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={`relative flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold ${
              isActive(href) ? "border-primary bg-primary text-dark" : "border-white/15 bg-white/5 text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {!!badge && (
              <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-dark">{badge}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Desktop: grouped list */}
      <nav aria-label="Admin" className="mt-6 hidden space-y-5 md:block">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">{g.title}</p>
            <div className="space-y-0.5">
              {g.items.map(({ href, label, icon: Icon, badge }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition ${
                      active
                        ? "bg-primary text-dark"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className={`h-[18px] w-[18px] ${active ? "text-dark" : "text-white/50 group-hover:text-primary"}`} strokeWidth={2} />
                    <span className="flex-1">{label}</span>
                    {!!badge && (
                      <span
                        className={`min-w-[22px] rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold ${
                          active ? "bg-dark text-primary" : "bg-primary text-dark"
                        }`}
                      >
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-6 hidden space-y-1 border-t border-white/10 pt-5 md:block">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-[18px] w-[18px] text-white/50" /> View website
        </a>
        <form action="/adminpanel/logout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px] text-white/50" /> Sign out
          </button>
        </form>
      </div>
    </>
  );
}
