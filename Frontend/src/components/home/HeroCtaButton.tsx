// src/components/home/HeroCtaButton.tsx
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DEFAULT_CTA_BG, DEFAULT_CTA_TEXT, isInternalLink, type HeroCta } from "@/lib/hero-banner";

interface HeroCtaButtonProps {
  cta: HeroCta;
  /** Render a non-clickable look-alike (used by the admin live preview). */
  preview?: boolean;
  className?: string;
}

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-md border-2 px-5 py-2.5 sm:px-7 sm:py-3 " +
  "text-[0.7rem] sm:text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-center " +
  "shadow-lg shadow-black/25 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50";

export function HeroCtaButton({ cta, preview = false, className }: HeroCtaButtonProps) {
  const bgColor = cta.bgColor || DEFAULT_CTA_BG;
  const textColor = cta.textColor || DEFAULT_CTA_TEXT;

  // Outline buttons keep the picked color for the border and sit on frosted
  // glass so the label stays readable over any photo.
  const style: CSSProperties =
    cta.style === "outline"
      ? { borderColor: bgColor, color: textColor, backgroundColor: "rgba(255, 255, 255, 0.08)" }
      : { borderColor: bgColor, color: textColor, backgroundColor: bgColor };

  const classes = cn(BASE_CLASSES, cta.style === "outline" && "backdrop-blur-sm", className);
  const newTabProps = cta.openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {};

  if (preview) {
    return (
      <span className={classes} style={style}>
        {cta.label || "Button"}
      </span>
    );
  }

  if (isInternalLink(cta.url)) {
    return (
      <Link to={cta.url} className={classes} style={style} {...newTabProps}>
        {cta.label}
      </Link>
    );
  }

  return (
    <a href={cta.url} className={classes} style={style} {...newTabProps}>
      {cta.label}
    </a>
  );
}
