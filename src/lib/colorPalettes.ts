export type ColorPaletteId =
  | "pure-orange"
  | "deep-ocean"
  | "royal-amethyst"
  | "electric-indigo"
  | "ruby-crimson";

export interface ColorPaletteOption {
  id: ColorPaletteId;
  name: string;
  category: string;
  description: string;
  primaryAccent: string;
  primaryAccentDark: string;
  previewColors: string[];
  themes: Record<
    string,
    {
      accent: string;
      accentForeground: string;
      accentLight: string;
      accentLightForeground: string;
      label: string;
    }
  >;
}

export const COLOR_PALETTES: ColorPaletteOption[] = [
  {
    id: "pure-orange",
    name: "Signature Orange (Default)",
    category: "Brand Accent",
    description: "Vibrant electric orange, warm golden amber & rich terracotta across three distinct product hues.",
    primaryAccent: "#d1651c",
    primaryAccentDark: "#f97316",
    previewColors: ["#f97316", "#f59e0b", "#e05638"],
    themes: {
      "ai-chatbot": {
        accent: "#f97316",
        accentForeground: "#ffffff",
        accentLight: "#ea580c",
        accentLightForeground: "#ffffff",
        label: "Vibrant Orange",
      },
      "marketing-mix-models": {
        accent: "#f59e0b",
        accentForeground: "#ffffff",
        accentLight: "#d97706",
        accentLightForeground: "#ffffff",
        label: "Golden Amber",
      },
      "membership-360": {
        accent: "#e05638",
        accentForeground: "#ffffff",
        accentLight: "#c2410c",
        accentLightForeground: "#ffffff",
        label: "Terracotta Rust",
      },
    },
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean Cyan",
    category: "Cool & Modern",
    description: "Vibrant ocean cyan, slate teal & electric azure. High contrast tech aesthetic.",
    primaryAccent: "#00838f",
    primaryAccentDark: "#06b6d4",
    previewColors: ["#00838f", "#06b6d4", "#0284c7"],
    themes: {
      "ai-chatbot": {
        accent: "#06b6d4",
        accentForeground: "#083344",
        accentLight: "#00838f",
        accentLightForeground: "#ffffff",
        label: "Ocean Cyan",
      },
      "marketing-mix-models": {
        accent: "#38bdf8",
        accentForeground: "#082f49",
        accentLight: "#0284c7",
        accentLightForeground: "#ffffff",
        label: "Electric Azure",
      },
      "membership-360": {
        accent: "#22d3ee",
        accentForeground: "#083344",
        accentLight: "#0891b2",
        accentLightForeground: "#ffffff",
        label: "Bright Sky",
      },
    },
  },
  {
    id: "royal-amethyst",
    name: "Royal Amethyst Violet",
    category: "Luxury & Futuristic",
    description: "Deep amethyst purple, lavender spark & imperial violet.",
    primaryAccent: "#7c3aed",
    primaryAccentDark: "#a855f7",
    previewColors: ["#7c3aed", "#a855f7", "#c084fc"],
    themes: {
      "ai-chatbot": {
        accent: "#a855f7",
        accentForeground: "#3b0764",
        accentLight: "#7c3aed",
        accentLightForeground: "#ffffff",
        label: "Amethyst Spark",
      },
      "marketing-mix-models": {
        accent: "#c084fc",
        accentForeground: "#3b0764",
        accentLight: "#9333ea",
        accentLightForeground: "#ffffff",
        label: "Imperial Purple",
      },
      "membership-360": {
        accent: "#e879f9",
        accentForeground: "#701a75",
        accentLight: "#c026d3",
        accentLightForeground: "#ffffff",
        label: "Lavender Violet",
      },
    },
  },
  {
    id: "electric-indigo",
    name: "Electric Cobalt Blue",
    category: "Enterprise Tech",
    description: "Royal cobalt blue, sapphire & electric sky blue for enterprise AI.",
    primaryAccent: "#2563eb",
    primaryAccentDark: "#3b82f6",
    previewColors: ["#2563eb", "#3b82f6", "#60a5fa"],
    themes: {
      "ai-chatbot": {
        accent: "#3b82f6",
        accentForeground: "#1e3a8a",
        accentLight: "#2563eb",
        accentLightForeground: "#ffffff",
        label: "Cobalt Blue",
      },
      "marketing-mix-models": {
        accent: "#60a5fa",
        accentForeground: "#172554",
        accentLight: "#1d4ed8",
        accentLightForeground: "#ffffff",
        label: "Sapphire Royal",
      },
      "membership-360": {
        accent: "#93c5fd",
        accentForeground: "#172554",
        accentLight: "#1e40af",
        accentLightForeground: "#ffffff",
        label: "Electric Sky",
      },
    },
  },
  {
    id: "ruby-crimson",
    name: "Ruby Rose Crimson",
    category: "Bold & High-Impact",
    description: "Striking ruby crimson, fiery rose & warm magenta accents.",
    primaryAccent: "#e11d48",
    primaryAccentDark: "#f43f5e",
    previewColors: ["#e11d48", "#f43f5e", "#fb7185"],
    themes: {
      "ai-chatbot": {
        accent: "#f43f5e",
        accentForeground: "#4c0519",
        accentLight: "#e11d48",
        accentLightForeground: "#ffffff",
        label: "Ruby Crimson",
      },
      "marketing-mix-models": {
        accent: "#fb7185",
        accentForeground: "#4c0519",
        accentLight: "#be123c",
        accentLightForeground: "#ffffff",
        label: "Rose Flare",
      },
      "membership-360": {
        accent: "#f472b6",
        accentForeground: "#500724",
        accentLight: "#db2777",
        accentLightForeground: "#ffffff",
        label: "Fiery Pink",
      },
    },
  },
];

// Currently active palette helper (defaults to pure-orange)
export function getActiveColorPalette(): ColorPaletteOption {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("gks_color_palette") as ColorPaletteId;
    const found = COLOR_PALETTES.find((p) => p.id === saved);
    if (found) return found;
  }
  return COLOR_PALETTES[0]!; // Default to Signature Orange
}

export function getProjectThemeOverride(slug: string, previewPaletteId?: ColorPaletteId | null) {
  let palette: ColorPaletteOption | undefined;
  if (previewPaletteId) {
    palette = COLOR_PALETTES.find((p) => p.id === previewPaletteId);
  }
  if (!palette) {
    palette = getActiveColorPalette();
  }
  if (palette && palette.themes[slug]) {
    return palette.themes[slug];
  }
  return null;
}

/**
 * Calculates whether --accent-foreground should be white or black based on relative luminance.
 * @param hex High-contrast accent color hex string (e.g., "#d1651c" or "d1651c")
 * @returns "#ffffff" if dark background, or "#000000" if light background
 */
export function getAccentForeground(hex: string): string {
  if (!hex) return "#ffffff";
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  if (cleanHex.length !== 6) return "#ffffff";

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const sRGB = [r, g, b].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  // Relative luminance formula per WCAG 2.x standard
  const luminance = 0.2126 * sRGB[0]! + 0.7152 * sRGB[1]! + 0.0722 * sRGB[2]!;

  // High luminance (> 0.45) requires black text for contrast, otherwise white text
  return luminance > 0.45 ? "#000000" : "#ffffff";
}
