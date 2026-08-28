import { useState, useEffect } from "react";
import { Type, Check, ChevronUp, ChevronDown, Palette, X } from "lucide-react";
import { COLOR_PALETTES, getActiveColorPalette, type ColorPaletteId } from "@/lib/colorPalettes";
import { ColorThemePicker } from "@/components/ColorThemePicker";

export type FontPreset = "preset-1" | "preset-2" | "preset-3" | "preset-4" | "preset-5";

export interface FontOption {
  id: FontPreset;
  name: string;
  category: string;
  tagline: string;
  displayFont: string;
  bodyFont: string;
  monoFont: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "preset-1",
    name: "1. Spatial Web3 & AI (Default)",
    category: "Vibe: Ultra-Bold Spatial Web3 & Frontier AI",
    tagline: "Unbounded 800 + Urbanist + Space Mono",
    displayFont: "Unbounded",
    bodyFont: "Urbanist",
    monoFont: "Space Mono",
  },
  {
    id: "preset-2",
    name: "2. Modern Product & SaaS",
    category: "Vibe: High-Legibility Enterprise Clean",
    tagline: "Plus Jakarta Sans + Inter + Geist Mono",
    displayFont: "Plus Jakarta Sans",
    bodyFont: "Inter",
    monoFont: "Geist Mono",
  },
  {
    id: "preset-3",
    name: "3. Classic Editorial Serif",
    category: "Vibe: Luxurious Editorial Serif & High Contrast",
    tagline: "Playfair Display 700 + DM Sans + IBM Plex Mono",
    displayFont: "Playfair Display",
    bodyFont: "DM Sans",
    monoFont: "IBM Plex Mono",
  },
  {
    id: "preset-4",
    name: "4. Futuristic Tech & AI Systems",
    category: "Vibe: Precision Sci-Fi Geometry",
    tagline: "Orbitron 800 + Outfit + Fira Code",
    displayFont: "Orbitron",
    bodyFont: "Outfit",
    monoFont: "Fira Code",
  },
  {
    id: "preset-5",
    name: "5. Architectural Unicase & Display",
    category: "Vibe: Bold Structural Display",
    tagline: "Sora 800 + Public Sans + Roboto Mono",
    displayFont: "Sora",
    bodyFont: "Public Sans",
    monoFont: "Roboto Mono",
  },
];

export interface StudioModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialTab?: "theme" | "typography";
  isEmbedded?: boolean;
}

export function FontThemePicker({
  isOpen: controlledOpen,
  onClose,
  initialTab,
  isEmbedded: forceEmbedded,
}: StudioModalProps = {}) {
  const [activeTab, setActiveTab] = useState<"theme" | "typography">(initialTab || "theme");

  const [activePreset, setActivePreset] = useState<FontPreset>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gks_font_preset") as FontPreset;
      if (saved && FONT_OPTIONS.some((o) => o.id === saved)) {
        return saved;
      }
    }
    return "preset-1";
  });
  const [hoveredPreset, setHoveredPreset] = useState<FontPreset | null>(null);

  const [activePalette, setActivePalette] = useState<ColorPaletteId>(() => getActiveColorPalette().id);
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(false);

  const isExpanded = controlledOpen !== undefined ? controlledOpen : uncontrolledExpanded;
  const isEmbedded = forceEmbedded || controlledOpen !== undefined;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setUncontrolledExpanded(false);
    }
  };

  const applyFontClass = (preset: FontPreset) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    FONT_OPTIONS.forEach((o) => root.classList.remove(`font-${o.id}`));
    root.classList.add(`font-${preset}`);
  };

  useEffect(() => {
    const presetToApply = hoveredPreset || activePreset;
    applyFontClass(presetToApply);
    if (!hoveredPreset) {
      localStorage.setItem("gks_font_preset", activePreset);
    }
  }, [activePreset, hoveredPreset]);

  useEffect(() => {
    const handlePaletteChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (typeof customEvent.detail === "string") {
        setActivePalette(customEvent.detail as ColorPaletteId);
      } else if (customEvent.detail?.paletteId) {
        setActivePalette(customEvent.detail.paletteId as ColorPaletteId);
      }
    };
    window.addEventListener("gks_palette_changed", handlePaletteChange);
    window.addEventListener("gks_palette_preview", handlePaletteChange);
    return () => {
      window.removeEventListener("gks_palette_changed", handlePaletteChange);
      window.removeEventListener("gks_palette_preview", handlePaletteChange);
    };
  }, []);

  const activePaletteObj = COLOR_PALETTES.find((p) => p.id === activePalette) || COLOR_PALETTES[0]!;

  const modalContent = (
    <div className="w-80 sm:w-[440px] md:w-[460px] h-[480px] flex flex-col rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xl text-foreground animate-fade-in">
      {/* Top Header with Studio Tag and Close Button */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold text-accent uppercase tracking-wider">
            <Palette className="size-3 text-accent animate-pulse" />
            Studio
          </span>
          <h3 className="font-display font-bold text-sm text-foreground">
            Design & Personalization
          </h3>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close Studio"
          className="grid size-7 shrink-0 place-items-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent cursor-pointer"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {/* Studio Aspect Tabs: Theme & Typography */}
      <div className="mt-3 flex items-center gap-1 bg-secondary/80 p-1 rounded-2xl border border-border/50 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("theme")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
            activeTab === "theme"
              ? "bg-accent text-accent-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Palette className="size-3.5" />
          <span>1. Theme</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("typography")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
            activeTab === "typography"
              ? "bg-accent text-accent-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Type className="size-3.5" />
          <span>2. Typography</span>
        </button>
      </div>

      {/* Theme Colors Tab (All 5 fit without scroll) */}
      {activeTab === "theme" && (
        <div className="mt-3 flex-1 overflow-hidden">
          <ColorThemePicker isEmbedded />
        </div>
      )}

      {/* Typography Options Tab */}
      {activeTab === "typography" && (
        <div className="mt-3.5 flex-1 overflow-y-auto pr-1 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Top 5 Typography Pairings
            </span>
            <span className="font-mono text-[0.65rem] text-muted-foreground">
              Click to set pairing
            </span>
          </div>

          {FONT_OPTIONS.map((opt) => {
            const isSelected = activePreset === opt.id;
            const isHovered = hoveredPreset === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setActivePreset(opt.id);
                  setHoveredPreset(null);
                }}
                onMouseEnter={() => setHoveredPreset(opt.id)}
                onMouseLeave={() => setHoveredPreset(null)}
                className={`group w-full flex flex-col gap-2 rounded-2xl p-3.5 text-left transition-all border cursor-pointer ${
                  isHovered
                    ? "border-accent bg-accent/20 shadow-lg ring-1 ring-accent scale-[1.01]"
                    : isSelected
                    ? "border-accent bg-accent/15 shadow-md ring-1 ring-accent/50"
                    : "border-border/60 bg-card/50 hover:border-accent/40 hover:bg-card/90"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-display font-bold text-sm text-foreground truncate">
                      {opt.name}
                    </span>
                    {isSelected && (
                      <span className="shrink-0 rounded-full bg-accent/20 px-2 py-0.5 font-mono text-[0.6rem] font-bold text-accent uppercase">
                        Active Default
                      </span>
                    )}
                    {isHovered && !isSelected && (
                      <span className="shrink-0 rounded-full bg-accent/30 px-2 py-0.5 font-mono text-[0.6rem] font-bold text-accent uppercase animate-pulse">
                        Live Preview
                      </span>
                    )}
                  </div>

                  <div
                    className={`grid size-5 shrink-0 place-items-center rounded-full border transition-colors ${
                      isSelected
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border text-transparent group-hover:border-accent/40"
                    }`}
                  >
                    <Check className="size-3" />
                  </div>
                </div>

                <p className="font-mono text-[0.65rem] text-accent font-semibold tracking-wide">
                  {opt.category}
                </p>

                {/* Rich Specimen Card Preview */}
                <div className="rounded-xl border border-border/40 bg-background/80 p-2.5 space-y-1">
                  <div
                    className="text-sm font-bold text-foreground truncate"
                    style={{ fontFamily: opt.displayFont }}
                  >
                    {opt.displayFont}: Gulshan Kumar Sahu
                  </div>
                  <div
                    className="text-xs text-muted-foreground truncate"
                    style={{ fontFamily: opt.bodyFont }}
                  >
                    {opt.bodyFont}: Product Manager building AI & data systems.
                  </div>
                  <div
                    className="text-[0.65rem] text-accent/80 font-mono truncate"
                    style={{ fontFamily: opt.monoFont }}
                  >
                    {opt.monoFont}: {opt.tagline}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  if (isEmbedded) {
    return isExpanded ? modalContent : null;
  }

  return (
    <>
      {/* Standalone Backdrop for Click Outside when uncontrolled */}
      {isExpanded && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-[59] bg-transparent cursor-default"
          aria-hidden="true"
        />
      )}

      <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end">
        {isExpanded && <div className="mb-3">{modalContent}</div>}

        {/* Floating Trigger Button (when uncontrolled) */}
        <button
          type="button"
          onClick={() => setUncontrolledExpanded((v) => !v)}
          className="group inline-flex items-center gap-2.5 rounded-full border border-accent/50 bg-card/90 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold text-foreground shadow-xl backdrop-blur-md hover:border-accent hover:bg-card transition-all cursor-pointer"
        >
          <Palette className="size-4 text-accent animate-pulse" />
          <span>
            Studio: <span className="text-accent">{activePaletteObj.name}</span>
          </span>
          {uncontrolledExpanded ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
        </button>
      </div>
    </>
  );
}
