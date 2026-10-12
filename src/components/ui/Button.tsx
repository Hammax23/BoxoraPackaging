import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "dark";
  className?: string;
  type?: "button" | "submit";
};

export default function Button({
  children,
  href = "#",
  variant = "primary",
  className = "",
  type = "button",
}: ButtonProps) {
  const base =
    "btn-slip group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-bold uppercase tracking-wide transition";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    outline: "border-2 border-dark bg-transparent text-dark hover:bg-dark hover:text-white",
    dark: "bg-dark text-white hover:bg-dark/90",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <ArrowRight className="relative z-10 h-4 w-4 transition group-hover:translate-x-1" />
    </>
  );

  if (type === "submit") {
    return (
      <button type="submit" className={classes}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
