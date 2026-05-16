import { CSSProperties } from "react";

export type DesignSystem = {
  style: string;
  font: "inter" | "poppins" | "space-grotesk" | "roboto" | string;
  radius: "none" | "soft" | "rounded" | "full" | string;
  shadow: "none" | "light" | "strong" | string;
  density: "compact" | "medium" | "spacious" | string;
  animationLevel: "none" | "subtle" | "dynamic" | string;
};

export type ThemeData = {
  style: string;
  primaryColor: string;
  background?: string;
};

export type ThemeStyles = {
  rootStyle: CSSProperties;
  surfaceClass: string;
  cardClass: string;
  buttonStyle: CSSProperties;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
  borderStyle: CSSProperties;
  fontClass: string;
  radiusClass: string;
  shadowClass: string;
  density: {
    sectionPadding: string;
    sectionGap: string;
    cardPadding: string;
    textSpacing: string;
  };
  animationLevel: DesignSystem["animationLevel"];
};

const fontFamilyMap: Record<string, string> = {
  inter: "Inter, ui-sans-serif, system-ui, sans-serif",
  poppins: "Poppins, ui-sans-serif, system-ui, sans-serif",
  roboto: "Roboto, ui-sans-serif, system-ui, sans-serif",
  "space-grotesk": "Space Grotesk, ui-sans-serif, system-ui, sans-serif",
};

const fontClassMap: Record<string, string> = {
  inter: "font-sans",
  poppins: "font-sans",
  roboto: "font-sans",
  "space-grotesk": "font-sans",
};

const radiusClassMap: Record<string, string> = {
  none: "rounded-none",
  soft: "rounded-xl",
  rounded: "rounded-3xl",
  full: "rounded-full",
};

const shadowClassMap: Record<string, string> = {
  none: "shadow-none",
  light: "shadow-lg",
  strong: "shadow-2xl",
};

const densityMap: Record<string, { sectionPadding: string; sectionGap: string; cardPadding: string; textSpacing: string }> = {
  compact: {
    sectionPadding: "py-10 px-6",
    sectionGap: "gap-6",
    cardPadding: "p-6",
    textSpacing: "space-y-4",
  },
  medium: {
    sectionPadding: "py-16 px-8",
    sectionGap: "gap-8",
    cardPadding: "p-8",
    textSpacing: "space-y-6",
  },
  spacious: {
    sectionPadding: "py-24 px-10",
    sectionGap: "gap-10",
    cardPadding: "p-10",
    textSpacing: "space-y-8",
  },
};

function clampHex(hex: string) {
  return hex.replace(/[^0-9a-f]/gi, "");
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = clampHex(hex);
  if (cleaned.length === 3) {
    const [r, g, b] = cleaned.split("");
    return {
      r: parseInt(r + r, 16),
      g: parseInt(g + g, 16),
      b: parseInt(b + b, 16),
    };
  }
  if (cleaned.length === 6) {
    return {
      r: parseInt(cleaned.slice(0, 2), 16),
      g: parseInt(cleaned.slice(2, 4), 16),
      b: parseInt(cleaned.slice(4, 6), 16),
    };
  }
  return null;
}

function getContrastColor(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return "#ffffff";
  }
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.55 ? "#0f172a" : "#ffffff";
}

function normalizeBackground(background?: string, primaryColor?: string) {
  if (!background) {
    return "#020617";
  }

  const value = background.trim().toLowerCase();
  if (value.startsWith("#") || value.startsWith("rgb") || value.startsWith("linear-gradient")) {
    return background;
  }

  const primary = primaryColor ? primaryColor.replace(/\s/g, "") : "#6366f1";
  const defaultGradient = `linear-gradient(135deg, ${primary}20 0%, rgba(15,23,42,0.95) 35%, rgba(2,6,23,1) 100%)`;

  switch (value) {
    case "gradient":
      return defaultGradient;
    case "dark":
      return "#020617";
    case "light":
      return "#f8fafc";
    case "grass":
      return "linear-gradient(135deg, #0f766e 0%, #22c55e 45%, #bef264 100%)";
    case "warm":
      return "linear-gradient(135deg, #7c2d12 0%, #f97316 45%, #fde68a 100%)";
    case "cool":
      return "linear-gradient(135deg, #0f172a 0%, #0ea5e9 45%, #38bdf8 100%)";
    case "glass":
      return "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))";
    default:
      return background;
  }
}

function isLightBackground(background?: string) {
  const value = String(background || "").trim().toLowerCase();
  if (!value) {
    return false;
  }

  if (value.startsWith("#")) {
    const rgb = hexToRgb(value);
    if (!rgb) return false;
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.8;
  }

  if (value.startsWith("rgb")) {
    const numbers = value.match(/\d+/g)?.map(Number);
    if (numbers?.length >= 3) {
      const [r, g, b] = numbers;
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.8;
    }
  }

  return ["light", "glass", "warm"].some((item) => value.includes(item));
}

export function getThemeStyles(theme: ThemeData, design: DesignSystem): ThemeStyles {
  const background = normalizeBackground(theme.background, theme.primaryColor);
  const light = isLightBackground(theme.background) || theme.style.toLowerCase().includes("light");
  const accentColor = theme.primaryColor || "#6366f1";
  const textColor = light ? "#0f172a" : "#f8fafc";
  const mutedTextColor = light ? "#475569" : "#cbd5e1";
  const surfaceClass = light
    ? "bg-white/90 text-slate-950"
    : "bg-slate-950/85 text-slate-100";
  const borderColor = light ? "rgba(148,163,184,0.16)" : "rgba(255,255,255,0.08)";
  const radiusClass = radiusClassMap[design.radius?.toLowerCase()] ?? radiusClassMap.rounded;
  const shadowClass = shadowClassMap[design.shadow?.toLowerCase()] ?? shadowClassMap.light;
  const density = densityMap[design.density?.toLowerCase()] ?? densityMap.medium;
  const font = fontFamilyMap[design.font?.toLowerCase()] ?? fontFamilyMap.inter;
  const fontClass = fontClassMap[design.font?.toLowerCase()] ?? "font-sans";

  return {
    rootStyle: {
      background,
      color: textColor,
      fontFamily: font,
      minHeight: "100%",
    },
    surfaceClass,
    cardClass: cn("border", radiusClass, shadowClass, surfaceClass),
    buttonStyle: {
      backgroundColor: accentColor,
      color: getContrastColor(accentColor),
    },
    textColor,
    mutedTextColor,
    accentColor,
    borderStyle: {
      borderColor,
    },
    fontClass,
    radiusClass,
    shadowClass,
    density,
    animationLevel: (design.animationLevel?.toLowerCase() as DesignSystem["animationLevel"]) ?? "subtle",
  };
}

export function applyDesignSystem(design: DesignSystem, theme: ThemeData) {
  return getThemeStyles(theme, design);
}

function cn(...inputs: Array<string | undefined>) {
  return inputs.filter(Boolean).join(" ");
}
