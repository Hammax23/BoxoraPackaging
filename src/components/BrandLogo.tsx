import { images } from "@/lib/images";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  variant?: "dark" | "light";
  size?: "sm" | "nav" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: { iconW: 40, iconH: 38, text: "text-[17px]", gap: "gap-1.5", letterSpacing: "0.04em" },
  nav: { iconW: 58, iconH: 62, text: "text-[25px]", gap: "gap-2", letterSpacing: "0.045em" },
  md: { iconW: 50, iconH: 54, text: "text-[22px]", gap: "gap-1.5", letterSpacing: "0.05em" },
  lg: { iconW: 56, iconH: 60, text: "text-[26px]", gap: "gap-2", letterSpacing: "0.05em" },
} as const;

export default function BrandLogo({
  href = "/",
  variant = "dark",
  size = "md",
  className = "",
}: BrandLogoProps) {
  const s = sizeMap[size];
  const boxColor = variant === "light" ? "text-white" : "text-[#0B1220]";

  const content = (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      <span
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-md"
        style={{ width: `${s.iconW}px`, height: `${s.iconH}px` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images.logo}
          alt=""
          className="h-full w-auto max-w-none object-cover object-center"
        />
      </span>
      <span
        className={`font-body ${s.text} font-extrabold uppercase leading-none`}
        style={{ letterSpacing: s.letterSpacing }}
        aria-label="Boxora"
      >
        <span className={boxColor}>BOX</span>
        <span className="text-primary">ORA</span>
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
