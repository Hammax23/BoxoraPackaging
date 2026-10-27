import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  variant?: "dark" | "light";
  size?: "sm" | "nav" | "md" | "lg";
  className?: string;
  /** On dark backgrounds, keep "ORA" in the lime box like the header logo. */
  pill?: boolean;
};

// Icon box is square-ish (the mark is 485x489).
const sizeMap = {
  sm: { icon: 40, text: "text-[17px]", gap: "gap-2", pill: "px-1.5" },
  nav: { icon: 56, text: "text-[23px]", gap: "gap-2.5", pill: "px-2" },
  md: { icon: 50, text: "text-[21px]", gap: "gap-2.5", pill: "px-1.5" },
  lg: { icon: 52, text: "text-[26px]", gap: "gap-3", pill: "px-2" },
} as const;

/** Two-tone cube mark + wordmark. On dark backgrounds the mark and "BOX" flip to cream and "ORA" stays lime. */
export default function BrandLogo({ href = "/", variant = "dark", size = "md", className = "", pill = false }: BrandLogoProps) {
  const s = sizeMap[size];
  const onDark = variant === "light";

  const content = (
    <span className={`inline-flex items-center whitespace-nowrap ${s.gap} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={onDark ? "/logo/mark-dark.png" : "/logo/mark-light.png"}
        alt=""
        width={s.icon}
        height={s.icon}
        className="shrink-0 object-contain"
        style={{ width: s.icon, height: s.icon }}
      />
      <span className={`font-heading ${s.text} font-extrabold uppercase leading-none tracking-[0.02em]`} aria-label="Boxora">
        <span className={onDark ? "text-[#fcfaef]" : "text-[#035a53]"}>BOX</span>
        <span
          className={
            onDark && !pill
              ? "text-[#bdf906]"
              : `ml-0.5 inline-block rounded-md bg-[#bdf906] py-[3px] text-[#035a53] ${s.pill}`
          }
        >
          ORA
        </span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
