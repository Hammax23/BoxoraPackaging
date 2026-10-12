import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type SectionTitleProps = {
  label: string;
  title: string;
  description?: string;
  linkText?: string;
  linkHref?: string;
  align?: "left" | "center";
  dark?: boolean;
};

export default function SectionTitle({
  label,
  title,
  description,
  linkText,
  linkHref = "#",
  align = "left",
  dark = false,
}: SectionTitleProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      <span
        className={`section-label ${dark ? "text-secondary" : "text-primary"}`}
      >
        {label}
      </span>
      <div
        className={`flex w-full flex-col gap-5 md:flex-row md:items-end md:justify-between ${
          align === "center" ? "md:flex-col md:items-center" : ""
        }`}
      >
        <div className={`max-w-3xl space-y-3 ${align === "center" ? "mx-auto" : ""}`}>
          <h2
            className={`font-heading text-[34px] leading-[1.15] md:text-[44px] lg:text-[52px] ${
              dark ? "text-white" : "text-dark"
            }`}
          >
            {title}
          </h2>
          {description && (
            <p className={`max-w-2xl text-base md:text-lg ${dark ? "text-white/75" : "text-text"}`}>
              {description}
            </p>
          )}
        </div>
        {linkText && (
          <Link href={linkHref} className="section-link group shrink-0">
            <span>{linkText}</span>
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
