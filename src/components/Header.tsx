"use client";

import BrandLogo from "@/components/BrandLogo";
import IndustriesMegamenu from "@/components/IndustriesMegamenu";
import PackagingStylesMegamenu from "@/components/PackagingStylesMegamenu";
import TrendsMegamenu from "@/components/TrendsMegamenu";
import { packagingStylesMegamenu, trendsMegamenu, navLeft, navRight, topBar } from "@/lib/data";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Mail,
  Menu,
  Phone,
  Search,
  // User,
  X,
} from "lucide-react";
import SearchOverlay from "@/components/SearchOverlay";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIndustries } from "@/components/IndustriesProvider";

type NavItem = {
  label: string;
  href: string;
  children?: string[];
  dropdownCards?: { title: string; description: string; href: string }[];
  megamenu?: "industries" | "packaging-styles" | "trends";
};

function isActivePath(label: string, pathname: string) {
  switch (label) {
    case "HOME":
      return pathname === "/";
    case "INDUSTRIES":
      return pathname.startsWith("/category");
    case "PACKAGING STYLES":
      return pathname.startsWith("/styles");
    case "TRENDS":
      return pathname.startsWith("/trends");
    case "BLOG":
      return pathname.startsWith("/blog");
    case "ABOUT US":
      return ["/about", "/team", "/contact", "/faq"].some((p) => pathname.startsWith(p));
    default:
      return false;
  }
}

function NavMenu({
  items,
  onMegamenuEnter,
  onMegamenuLeave,
}: {
  items: NavItem[];
  onMegamenuEnter?: (type: "industries" | "packaging-styles" | "trends") => void;
  onMegamenuLeave?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-3.5 xl:gap-5 2xl:gap-7">
      {items.map((link) => {
        const active = isActivePath(link.label, pathname);
        return (
        <li
          key={link.label}
          className="group relative shrink-0"
          onMouseEnter={() => {
            if (link.megamenu) onMegamenuEnter?.(link.megamenu);
          }}
          onMouseLeave={() => {
            if (link.megamenu) onMegamenuLeave?.();
          }}
        >
          <Link
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-1.5 whitespace-nowrap py-2.5 text-[13px] font-semibold tracking-[0.1em] transition-colors duration-200 xl:text-[13.5px] ${
              active ? "text-primary" : "text-dark hover:text-primary"
            }`}
          >
            <span className="relative">
              {link.label}
              <span
                className={`absolute -bottom-1.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${
                  active ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </span>
            {(link.children || link.megamenu) && (
              <ChevronDown className="h-3 w-3 opacity-50 transition-transform duration-200 group-hover:rotate-180" strokeWidth={2} />
            )}
          </Link>

          {link.dropdownCards && !link.megamenu && (
            <div className="invisible absolute left-1/2 top-full z-50 w-[520px] -translate-x-1/2 translate-y-3 rounded-2xl border border-border bg-white p-3 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-1 group-hover:opacity-100">
              <div className="grid gap-2.5 md:grid-cols-3">
                {link.dropdownCards.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group/card rounded-xl border border-border/70 bg-background-field p-4 transition hover:border-primary/30 hover:bg-primary/[0.05]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-dark">
                        {item.title}
                      </span>
                      <ArrowRight
                        className="h-4 w-4 text-primary opacity-0 transition group-hover/card:translate-x-0.5 group-hover/card:opacity-100"
                        strokeWidth={2.25}
                      />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-text">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {link.children && !link.dropdownCards && !link.megamenu && (
            <div className="invisible absolute left-1/2 top-full z-50 min-w-[260px] -translate-x-1/2 translate-y-3 rounded-2xl border border-border bg-white p-2 opacity-0 shadow-[0_18px_55px_rgba(0,0,0,0.12)] transition-all duration-200 group-hover:visible group-hover:translate-y-1 group-hover:opacity-100">
              {link.children.map((child) => (
                <Link
                  key={child}
                  href={childHref(child)}
                  className="group/item flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-text transition hover:bg-background-field hover:text-primary"
                >
                  <span className="whitespace-nowrap">{child}</span>
                  <span
                    className="shrink-0 text-lighter opacity-0 transition group-hover/item:translate-x-0.5 group-hover/item:opacity-100"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </li>
        );
      })}
    </ul>
  );
}

function TopBar() {
  const phoneHref = `tel:${topBar.phone.replace(/\s/g, "")}`;

  return (
    <div className="hidden border-b border-white/10 bg-navbar-top lg:block">
      <div className="mx-auto flex h-10 w-full max-w-[1440px] items-center justify-between px-5 xl:px-8">
        <p className="max-w-[420px] truncate text-[11px] font-medium tracking-[0.04em] text-white/65 xl:max-w-none xl:text-[12px]">
          {topBar.tagline}
        </p>

        <div className="flex items-center gap-4 text-[11px] xl:gap-5 xl:text-[12px]">
          <a
            href={`mailto:${topBar.email}`}
            className="group flex items-center gap-2 text-white/75 transition-colors duration-200 hover:text-white"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-colors duration-200 group-hover:bg-white/15">
              <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
            <span className="hidden font-medium xl:inline">{topBar.email}</span>
          </a>

          <span className="h-4 w-px bg-white/15" aria-hidden="true" />

          <a
            href={phoneHref}
            className="group flex items-center gap-2 text-white/75 transition-colors duration-200 hover:text-white"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-colors duration-200 group-hover:bg-white/15">
              <Phone className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
            <span className="whitespace-nowrap">
              <span className="hidden text-white/55 xl:inline">{topBar.helpText} </span>
              <span className="font-semibold text-white">{topBar.phone}</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

function QuoteButton({
  className = "",
  fullWidth = false,
}: {
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <Link
      href="/quote"
      className={`btn-slip group inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-primary font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_16px_rgba(39,87,255,0.28)] transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_8px_28px_rgba(39,87,255,0.38)] ${
        fullWidth ? "w-full px-6 py-3.5 text-xs" : "px-4 py-2.5 text-[11px] xl:px-5 xl:py-2.5 xl:text-xs"
      } ${className}`}
    >
      <span className="hidden xl:inline">{topBar.quoteLabel}</span>
      <span className="xl:hidden">Quote</span>
      <ArrowRight
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
        strokeWidth={2.5}
      />
    </Link>
  );
}

function HeaderIcons({ onSearch }: { onSearch: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 xl:gap-3">
      <button
        type="button"
        aria-label="Search (Ctrl K)"
        onClick={onSearch}
        className="group flex h-10 items-center gap-2 rounded-full border border-border bg-white px-3 text-dark transition-all duration-200 hover:border-primary/40 hover:bg-primary/[0.04] hover:text-primary xl:px-3.5"
      >
        <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
        <kbd className="hidden rounded-md border border-border bg-background-field/60 px-1.5 py-0.5 font-body text-[10px] font-bold tracking-wide text-lighter 2xl:inline">
          Ctrl K
        </kbd>
      </button>
      <span className="hidden h-5 w-px shrink-0 bg-border/60 xl:block" />
      {/* <Link
        href="#"
        aria-label="My Account"
        className="hidden text-dark transition-colors duration-200 hover:text-primary xl:block"
      >
        <User className="h-5 w-5" strokeWidth={1.5} />
      </Link> */}
      <QuoteButton className="hidden lg:inline-flex" />
    </div>
  );
}

function childHref(label: string) {
  if (label === "About Us") return "/about";
  if (label === "Our Team") return "/team";
  if (label === "Contact") return "/contact";
  if (label === "FAQ") return "/faq";
  return "#";
}

export default function Header() {
  const industries = useIndustries();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenItem, setMobileOpenItem] = useState<string | null>(null);
  const [activeMegamenu, setActiveMegamenu] = useState<
    "industries" | "packaging-styles" | "trends" | null
  >(null);
  const megamenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const allLinks = [...navLeft, ...navRight];

  useEffect(() => {
    // Only re-render when the value actually flips, and batch to one check per frame.
    let raf = 0;
    const check = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleMegamenuEnter = (type: "industries" | "packaging-styles" | "trends") => {
    if (megamenuTimer.current) clearTimeout(megamenuTimer.current);
    setActiveMegamenu(type);
  };

  const handleMegamenuLeave = () => {
    megamenuTimer.current = setTimeout(() => setActiveMegamenu(null), 150);
  };

  const handleMegamenuPanelEnter = () => {
    if (megamenuTimer.current) clearTimeout(megamenuTimer.current);
  };

  const handleMobileToggle = (label: string) => {
    setMobileOpenItem((prev) => (prev === label ? null : label));
  };

  const hasMobileDropdown = (link: NavItem) => !!(link.children?.length || link.megamenu);
  const getMobileItems = (link: NavItem) => {
    if (link.megamenu === "industries") {
      return industries.map((c) => ({ title: c.name, href: c.href, sub: c.sub }));
    }

    if (link.megamenu === "packaging-styles") {
      return packagingStylesMegamenu.styles.map((s) => ({
        title: s.title,
        href: s.href,
        sub: s.specs.slice(0, 2).join(" • "),
      }));
    }

    if (link.megamenu === "trends") {
      return trendsMegamenu.items.map((t) => ({ title: t.title, href: t.href, sub: "" }));
    }

    if (link.children?.length) {
      return link.children.map((child) => ({ title: child, href: childHref(child), sub: "" }));
    }

    return [];
  };

  return (
    <>
      {/* Top bar scrolls away normally; only the nav below is sticky, so scrolling never changes page height (no jitter). */}
      <TopBar />
      <header
        className={`sticky top-0 z-[100] w-full transition-[background-color,box-shadow] duration-300 ${
          scrolled
            ? "bg-white/85 shadow-[0_10px_40px_rgba(8,8,16,0.08)] backdrop-blur-xl"
            : "bg-white"
        }`}
        onMouseLeave={() => setActiveMegamenu(null)}
      >
        <div className="h-[2px] bg-gradient-to-r from-primary via-secondary to-primary" />

        <div className="border-b border-border/70">
          <div className="relative mx-auto w-full max-w-[1440px] px-5 xl:px-8">
            {/* Desktop — flex layout (no absolute overlap) */}
            <div
              className="hidden min-h-[76px] w-full items-center lg:flex"
            >
              <div className="flex min-w-0 flex-1 items-center justify-end pr-3 xl:pr-5">
                <NavMenu
                  items={navLeft}
                  onMegamenuEnter={handleMegamenuEnter}
                  onMegamenuLeave={handleMegamenuLeave}
                />
              </div>

              <div
                className={`shrink-0 px-3 transition-transform duration-300 xl:px-4 ${
                  scrolled ? "scale-[0.92]" : "scale-100"
                }`}
              >
                <BrandLogo size="nav" />
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-3 xl:gap-4">
                <div className="flex min-w-0 flex-1 items-center pl-3 xl:pl-5">
                  <NavMenu
                    items={navRight}
                    onMegamenuEnter={handleMegamenuEnter}
                    onMegamenuLeave={handleMegamenuLeave}
                  />
                </div>
                <HeaderIcons onSearch={() => setSearchOpen(true)} />
              </div>
            </div>

            {/* Mobile */}
            <div className="flex h-[68px] items-center justify-between gap-3 lg:hidden">
              <BrandLogo size="sm" />
              <div className="flex items-center gap-1 min-[380px]:gap-2.5 sm:gap-3">
                <QuoteButton className="!inline-flex lg:!hidden max-[359px]:!px-3 max-[359px]:[&_svg]:hidden" />
                <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)} className="flex h-11 w-10 items-center justify-center min-[380px]:-mx-1 min-[380px]:w-11">
                  <Search className="h-6 w-6" strokeWidth={1.5} />
                </button>
                <button type="button" aria-label="Menu" onClick={() => setMobileOpen(true)} className="flex h-11 w-10 items-center justify-center min-[380px]:-mx-1 min-[380px]:w-11">
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Megamenu — full width dropdown */}
        <AnimatePresence>
          {activeMegamenu && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full hidden border-t border-border bg-white shadow-[0_20px_60px_rgba(0,0,0,0.1)] lg:block"
              onMouseEnter={handleMegamenuPanelEnter}
            >
              {activeMegamenu === "industries" ? (
                <IndustriesMegamenu />
              ) : activeMegamenu === "packaging-styles" ? (
                <PackagingStylesMegamenu onNavigate={() => setActiveMegamenu(null)} />
              ) : (
                <TrendsMegamenu onNavigate={() => setActiveMegamenu(null)} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-dark/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="absolute right-0 top-0 h-full w-[min(100%,300px)] bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <BrandLogo href="/" size="sm" />
                <button type="button" onClick={() => setMobileOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {allLinks.map((link) => {
                  const isOpen = mobileOpenItem === link.label;
                  const canExpand = hasMobileDropdown(link);

                  return (
                    <div key={link.label} className="rounded-xl border border-border/70">
                      <div className="flex items-center">
                        <Link
                          href={link.href}
                          onClick={(e) => {
                            if (canExpand) {
                              e.preventDefault();
                              handleMobileToggle(link.label);
                              return;
                            }
                            setMobileOpen(false);
                          }}
                          className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3 py-3 text-sm font-bold tracking-wide text-dark"
                        >
                          <span className="truncate">{link.label}</span>
                          {canExpand && (
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 text-lighter transition ${isOpen ? "rotate-180" : ""}`}
                              strokeWidth={2}
                            />
                          )}
                        </Link>
                      </div>

                      <AnimatePresence initial={false}>
                        {canExpand && isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="max-h-[52vh] space-y-1 overflow-y-auto px-2 pb-2 pr-1">
                              {getMobileItems(link).map((item) => (
                                <Link
                                  key={item.title}
                                  href={item.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-background-field"
                                >
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[13px] font-semibold text-text">
                                      {item.title}
                                    </span>
                                    {item.sub && (
                                      <span className="mt-0.5 block truncate text-[12px] font-medium text-lighter">
                                        {item.sub}
                                      </span>
                                    )}
                                  </span>
                                  <ChevronRight className="h-4 w-4 text-lighter" strokeWidth={2.5} />
                                </Link>
                              ))}

                              {/* If no children provided (megamenu-only), show a single CTA */}
                              {!getMobileItems(link).length && (
                                <Link
                                  href={link.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-semibold text-primary hover:bg-primary/[0.06]"
                                >
                                  <span className="truncate">View {link.label}</span>
                                  <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                                </Link>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
              <div className="mt-8 border-t border-border pt-6">
                <QuoteButton fullWidth />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
