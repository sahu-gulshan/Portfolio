import { useState, useEffect } from "react";
import { Palette, Check, Sparkles, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { COLOR_PALETTES, getActiveColorPalette, getAccentForeground, type ColorPaletteId, type ColorPaletteOption } from "@/lib/colorPalettes";

export interface ColorThemePickerProps {
  className?: string;
  isEmbedded?: boolean;
}

export function ColorThemePicker({ className = "", isEmbedded = false }: ColorThemePickerProps) {
  const [activePalette, setActivePalette] = useState<ColorPaletteOption>(() => getActiveColorPalette());
  const [hoveredPalette, setHoveredPalette] = useState<ColorPaletteOption | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Apply preview or active palette to CSS variables globally
  const applyGlobalAccent = (palette: ColorPaletteOption, isPreview = false) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const isLight = root.classList.contains("light");
    const accentColor = isLight
      ? palette.primaryAccent
      : palette.primaryAccentDark || palette.primaryAccent;
    const accentFg = getAccentForeground(accentColor);

    root.style.setProperty("--accent", accentColor);
    root.style.setProperty("--color-accent", accentColor);
    root.style.setProperty("--ring", accentColor);
    root.style.setProperty("--accent-foreground", accentFg);

    // Broadcast preview event so views (WorkView, CaseStudyView) update live!
    window.dispatchEvent(
      new CustomEvent("gks_palette_preview", {
        detail: {
          paletteId: palette.id,
          palette,
          isPreview,
        },
      })
    );
  };

  // On hover over a palette option
  const handleMouseEnter = (palette: ColorPaletteOption) => {
    setHoveredPalette(palette);
    applyGlobalAccent(palette, true);
  };

  // On mouse leave, restore active palette
  const handleMouseLeave = () => {
    setHoveredPalette(null);
    applyGlobalAccent(activePalette, false);
  };

  // On permanent selection click
  const handleSelect = (palette: ColorPaletteOption) => {
    setActivePalette(palette);
    setHoveredPalette(null);
    localStorage.setItem("gks_color_palette", palette.id);
    applyGlobalAccent(palette, false);

    window.dispatchEvent(new CustomEvent("gks_palette_changed", { detail: palette.id }));
  };

  // Reset to default palette
  const handleReset = () => {
    const defaultPalette = COLOR_PALETTES[0]!; // Deep Ocean
    handleSelect(defaultPalette);
  };

  const currentDisplayPalette = hoveredPalette || activePalette;

  if (isEmbedded) {
    return (
      <div className={`flex flex-col gap-2.5 ${className}`}>
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <Palette className="size-4 text-accent animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Color Theme Palettes
            </span>
          </div>
          {hoveredPalette ? (
            <span className="font-mono text-[0.68rem] text-accent font-bold animate-pulse">
              Previewing: {hoveredPalette.name}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 font-mono text-[0.65rem] text-muted-foreground hover:text-accent transition-colors cursor-pointer"
              title="Reset to default theme"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {COLOR_PALETTES.map((palette) => {
            const isSelected = activePalette.id === palette.id;
            const isHovered = hoveredPalette?.id === palette.id;

            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => handleSelect(palette)}
                onMouseEnter={() => handleMouseEnter(palette)}
                onMouseLeave={handleMouseLeave}
                className={`group flex items-center justify-between rounded-xl px-3 py-2 text-left transition-all border cursor-pointer ${
                  isHovered
                    ? "border-accent bg-accent/15 shadow-md scale-[1.01]"
                    : isSelected
                    ? "border-accent/80 bg-accent/10 shadow-xs"
                    : "border-border/40 bg-card/40 hover:border-accent/50 hover:bg-card/80"
                }`}
              >
                <div className="flex flex-col gap-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-foreground">
                      {palette.name}
                    </span>
                    {isSelected && (
                      <span className="rounded-full bg-accent/20 px-2 py-0.5 font-mono text-[0.6rem] font-bold text-accent uppercase">
                        Active
                      </span>
                    )}
                    {isHovered && !isSelected && (
                      <span className="rounded-full bg-accent/30 px-2 py-0.5 font-mono text-[0.6rem] font-bold text-accent uppercase animate-pulse">
                        Live Preview
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[0.68rem] text-muted-foreground leading-snug line-clamp-2">
                    {palette.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Swatch preview dots */}
                  <div className="flex items-center gap-1">
                    {palette.previewColors.map((color, idx) => (
                      <span
                        key={idx}
                        className="size-3.5 rounded-full border border-black/20 dark:border-white/20 shadow-2xs transition-transform duration-200 group-hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <div
                    className={`grid size-5 place-items-center rounded-full border transition-colors ${
                      isSelected
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border/60 text-transparent group-hover:border-accent/60"
                    }`}
                  >
                    <Check className="size-3" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Floating Standalone Drawer/Pill Widget
  return (
    <div className={`fixed bottom-5 right-5 z-[60] flex flex-col items-end ${className}`}>
      {/* Expanded Palette Selection Panel */}
      {isOpen && (
        <div
          onMouseLeave={handleMouseLeave}
          className="mb-3 w-80 sm:w-[420px] rounded-2xl border border-border/80 bg-card/95 p-4 shadow-2xl backdrop-blur-xl animate-fade-in text-foreground"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Palette className="size-4 text-accent" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider">
                Theme Color Picker
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {hoveredPalette ? (
                <span className="font-mono text-[0.68rem] font-bold text-accent animate-pulse">
                  Hover Preview
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 font-mono text-[0.68rem] text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          <p className="mt-2 font-mono text-[0.68rem] text-muted-foreground">
            Hover over any palette below to preview live changes. Click to commit.
          </p>

          {/* Palette List */}
          <div className="mt-3 flex flex-col gap-1.5">
            {COLOR_PALETTES.map((palette) => {
              const isSelected = activePalette.id === palette.id;
              const isHovered = hoveredPalette?.id === palette.id;

              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => handleSelect(palette)}
                  onMouseEnter={() => handleMouseEnter(palette)}
                  className={`group flex items-center justify-between rounded-xl p-3 text-left transition-all border cursor-pointer ${
                    isHovered
                      ? "border-accent bg-accent/15 shadow-md scale-[1.01]"
                      : isSelected
                      ? "border-accent/80 bg-accent/10 shadow-xs"
                      : "border-border/40 bg-card/40 hover:border-accent/50 hover:bg-card/80"
                  }`}
                >
                  <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                    <span className="font-mono text-[0.62rem] uppercase font-bold text-accent tracking-wide">
                      {palette.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-foreground truncate">
                        {palette.name}
                      </span>
                      {isSelected && (
                        <span className="rounded-full bg-accent/20 px-2 py-0.5 font-mono text-[0.6rem] font-bold text-accent uppercase">
                          Active
                        </span>
                      )}
                      {isHovered && !isSelected && (
                        <span className="rounded-full bg-accent/30 px-2 py-0.5 font-mono text-[0.6rem] font-bold text-accent uppercase animate-pulse">
                          Previewing
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[0.68rem] text-muted-foreground truncate">
                      {palette.description}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Swatches */}
                    <div className="flex items-center gap-1">
                      {palette.previewColors.map((color, idx) => (
                        <span
                          key={idx}
                          className="size-3.5 rounded-full border border-black/20 dark:border-white/20 shadow-2xs transition-transform duration-200 group-hover:scale-110"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    <div
                      className={`grid size-5 place-items-center rounded-full border transition-colors ${
                        isSelected
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border/60 text-transparent group-hover:border-accent/60"
                      }`}
                    >
                      <Check className="size-3" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="group inline-flex items-center gap-2.5 rounded-full border border-accent/50 bg-card/90 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold text-foreground shadow-xl backdrop-blur-md hover:border-accent hover:bg-card transition-all cursor-pointer"
      >
        <Sparkles className="size-4 text-accent animate-pulse" />
        <span>
          Theme: <span className="text-accent">{currentDisplayPalette.name}</span>
        </span>
        {isOpen ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
      </button>
    </div>
  );
}
