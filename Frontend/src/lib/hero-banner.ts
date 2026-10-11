// src/lib/hero-banner.ts
// Shared between the public hero banner and the admin hero editor.

export type HeroCtaStyle = "solid" | "outline";

export interface HeroCta {
  _id?: string;
  label: string;
  url: string;
  style: HeroCtaStyle;
  bgColor: string;
  textColor: string;
  openInNewTab: boolean;
}

export interface HeroImage {
  _id: string;
  imageUrl: string;
  mobileImageUrl?: string;
  title?: string;
  subtitle?: string;
  ctas?: HeroCta[];
  order: number;
  isActive: boolean;
  createdAt?: string;
}

export const DEFAULT_CTA_BG = "#188558";
export const DEFAULT_CTA_TEXT = "#FFFFFF";

export const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

// Site pages (/contact), in-page anchors (#faq), or full web / mail / phone links.
export const HERO_CTA_URL_REGEX = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)\S*$/i;

export const createEmptyCta = (): HeroCta => ({
  label: "",
  url: "",
  style: "solid",
  bgColor: DEFAULT_CTA_BG,
  textColor: DEFAULT_CTA_TEXT,
  openInNewTab: false,
});

// Links to pages of this site go through the router; everything else is a plain anchor.
export const isInternalLink = (url: string) => url.startsWith("/");
