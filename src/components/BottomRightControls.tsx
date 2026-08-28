import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Palette,
  ChevronDown,
  X,
  Type,
  Check,
} from "lucide-react";
import { UniversalGameIcon } from "@/components/icons/UniversalGameIcon";
import {
  COLOR_PALETTES,
  getActiveColorPalette,
  type ColorPaletteId,
} from "@/lib/colorPalettes";
import { ColorThemePicker } from "@/components/ColorThemePicker";
import {
  FONT_OPTIONS,
  type FontPreset,
} from "@/components/FontThemePicker";
import { Startup2048Game } from "@/components/game/Startup2048Game";

interface BottomRightControlsProps {
  isStudioOpen?: boolean;
  onStudioOpen?: () => void;
  onStudioClose?: () => void;
  onStudioToggle?: () => void;
}

type ActiveOverlay = "none" | "studio" | "game";

// Spring configuration for snappy, organic motion
const springTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 28,
  mass: 0.7,
};

const overlayVariants = {
  hidden: {
    opacity: 0,
    scale: 0.88,
    y: 20,
    transformOrigin: "bottom right",
    transition: {
      duration: 0.18,
      ease: [0.32, 0, 0.67, 0],
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transformOrigin: "bottom right",
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 16,
    transformOrigin: "bottom right",
    transition: {
      duration: 0.16,
      ease: [0.32, 0, 0.67, 0],
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.06,
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function BottomRightControls({
  isStudioOpen: controlledStudioOpen,
  onStudioOpen,
  onStudioClose,
  onStudioToggle,
}: BottomRightControlsProps) {
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>("none");

  // Synchronize when parent prop is changed
  useEffect(() => {
    if (controlledStudioOpen === true) {
      setActiveOverlay("studio");
    } else if (controlledStudioOpen === false && activeOverlay === "studio") {
      setActiveOverlay("none");
    }
  }, [controlledStudioOpen]);

  // Studio states
  const [activeTab, setActiveTab] = useState<"theme" | "typography">("theme");
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
  const [activePalette, setActivePalette] = useState<ColorPaletteId>(
    () => getActiveColorPalette().id
  );

  const closeAllOverlays = () => {
    if (onStudioClose) {
      onStudioClose();
    }
    setActiveOverlay("none");
  };

  const handleStudioToggle = () => {
    if (activeOverlay === "studio") {
      closeAllOverlays();
    } else {
      if (onStudioOpen) onStudioOpen();
      setActiveOverlay("studio");
    }
  };

  const handleGameToggle = () => {
    if (activeOverlay === "game") {
      closeAllOverlays();
    } else {
      if (onStudioClose) onStudioClose();
      setActiveOverlay("game");
    }
  };

  // Close with Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeOverlay !== "none") {
        closeAllOverlays();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeOverlay]);

  // Apply typography class
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

  // Listen to palette changes
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

  const activePaletteObj =
    COLOR_PALETTES.find((p) => p.id === activePalette) || COLOR_PALETTES[0]!;

  return (
    <>
      {/* Unified Click-Outside Backdrop */}
      <AnimatePresence>
        {activeOverlay !== "none" && (
          <motion.div
            key="controls-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeAllOverlays}
            className="fixed inset-0 z-[58] bg-black/35 cursor-default"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Floating Bottom-Right Stack Container */}
      <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-8 z-[59] flex flex-col items-end gap-2.5 select-none pointer-events-auto">
        <div className="relative flex flex-col items-end gap-2.5">
          <AnimatePresence mode="wait">
            {activeOverlay === "game" ? (
              /* EXPANDED 2048 MINI-GAME OVERLAY CARD (Located above Studio) */
              <motion.div
                key="game-expanded-card"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                role="dialog"
                aria-label="Startup 2048 Mini-Game"
                className="w-[92vw] sm:w-[390px] h-[550px] max-h-[calc(100vh-100px)] flex flex-col rounded-3xl border border-white/20 dark:border-white/10 bg-card/95 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] text-foreground select-none overflow-hidden ring-1 ring-white/15 dark:ring-white/5"
              >
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col h-full"
                >
                  <Startup2048Game onClose={closeAllOverlays} />
                </motion.div>
              </motion.div>
            ) : activeOverlay === "studio" ? (
              /* EXPANDED STUDIO OVERLAY CARD */
              <motion.div
                key="studio-expanded-card"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                role="dialog"
                aria-label="Design and Personalization Studio"
                className="w-[92vw] sm:w-[420px] h-[550px] max-h-[calc(100vh-100px)] flex flex-col rounded-3xl border border-white/20 dark:border-white/10 bg-card/90 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] text-foreground select-none overflow-hidden ring-1 ring-white/15 dark:ring-white/5"
              >
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col h-full"
                >
                  {/* Top Header with Close */}
                  <div className="flex items-center justify-between pb-3 border-b border-border/60 shrink-0">
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
                      onClick={closeAllOverlays}
                      aria-label="Close Studio"
                      className="grid size-7 shrink-0 place-items-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>

                  {/* Tabs: Theme & Typography */}
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

                  {/* Tab 1: Theme Colors */}
                  {activeTab === "theme" && (
                    <div className="mt-3 flex-1 overflow-hidden">
                      <ColorThemePicker isEmbedded />
                    </div>
                  )}

                  {/* Tab 2: Typography Options */}
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

                            {/* Specimen Preview */}
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
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* DOCK LAUNCHER BUTTONS (Identical styled subtle pills, vertically stacked: Game above Studio) */}
          {activeOverlay === "none" && (
            <div className="flex flex-col items-end gap-2">
              {/* 1. Mini-Game Launcher Pill (Positioned directly above the Studio button) */}
              <motion.button
                key="game-collapsed-pill"
                layout
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleGameToggle}
                className="group flex items-center gap-2 sm:gap-2.5 rounded-full p-2.5 sm:px-3.5 sm:py-2.5 font-mono text-xs font-semibold uppercase tracking-wider backdrop-blur-xl transition-all cursor-pointer border shadow-sm bg-card/85 text-foreground border-border/70 hover:border-border hover:bg-card"
                aria-label="Play Startup 2048 Mini-Game"
              >
                <UniversalGameIcon className="size-3.5 text-accent" />
                <span className="hidden sm:inline">
                  Game: <span className="text-accent font-semibold">2048</span>
                </span>
                <ChevronDown className="hidden sm:inline size-3.5 rotate-180 text-muted-foreground" />
              </motion.button>

              {/* 2. Design Studio Launcher Pill (Bottom Anchor) */}
              <motion.button
                key="studio-collapsed-pill"
                layout
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleStudioToggle}
                className="group flex items-center gap-2 sm:gap-2.5 rounded-full p-2.5 sm:px-3.5 sm:py-2.5 font-mono text-xs font-semibold uppercase tracking-wider backdrop-blur-xl transition-all cursor-pointer border shadow-sm bg-card/85 text-foreground border-border/70 hover:border-border hover:bg-card"
                aria-label="Open Design Studio"
              >
                <Palette className="size-3.5 text-accent" />
                <span className="hidden sm:inline">
                  Studio: <span className="text-accent font-semibold">{activePaletteObj.name}</span>
                </span>
                <ChevronDown className="hidden sm:inline size-3.5 rotate-180 text-muted-foreground" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
