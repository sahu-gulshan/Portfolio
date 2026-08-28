import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/Reveal";
import { BorderGlow } from "@/components/BorderGlow";
import { StaggerRevealSection, StaggerItem } from "@/components/StaggerRevealSection";
import {
  Zap,
  RefreshCw,
  Target,
  BarChart2,
  Scissors,
  Cpu,
  Ban,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { playPositronChargeTick, playPositronBlastSound } from "@/lib/quantum-audio";

interface PrincipleItem {
  no: string;
  statement: string;
  theme: string;
  takeaway: string;
  icon: LucideIcon;
}

const principles: PrincipleItem[] = [
  {
    no: "01",
    statement: "Start with the problem. Features are the last thing I write down.",
    theme: "Discovery",
    takeaway: "Problem clarity beats feature speed",
    icon: Target,
  },
  {
    no: "02",
    statement: "Data informs decisions. It doesn't make them for you.",
    theme: "Telemetry",
    takeaway: "Context over raw metrics",
    icon: BarChart2,
  },
  {
    no: "03",
    statement: "Good UX is subtraction — every removed step is a shipped feature.",
    theme: "Subtraction",
    takeaway: "Frictionless over feature-heavy",
    icon: Scissors,
  },
  {
    no: "04",
    statement: "AI is valuable when it removes friction, not when it adds novelty.",
    theme: "Applied AI",
    takeaway: "Utility over novelty gimmicks",
    icon: Cpu,
  },
  {
    no: "05",
    statement: "A roadmap is a set of deliberate refusals.",
    theme: "Strategy",
    takeaway: "Scope defense protects velocity",
    icon: Ban,
  },
  {
    no: "06",
    statement: "Shipping isn't the end of discovery. It's the honest part of it.",
    theme: "Iteration",
    takeaway: "Live feedback over pitch decks",
    icon: Compass,
  },
];

export function Philosophy() {
  const [isBlasted, setIsBlasted] = useState(() => {
    if (typeof window !== "undefined") {
      return Boolean(
        (window as unknown as { __POSITRON_SECTION_05_BLASTED?: boolean })
          .__POSITRON_SECTION_05_BLASTED
      );
    }
    return false;
  });

  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [waveTrigger, setWaveTrigger] = useState(0);

  useEffect(() => {
    const handleBlast = () => {
      setIsBlasted(true);
      setWaveTrigger((prev) => prev + 1);
      if (typeof window !== "undefined") {
        (window as unknown as { __POSITRON_SECTION_05_BLASTED?: boolean }).__POSITRON_SECTION_05_BLASTED = true;
      }
    };

    window.addEventListener("positron-section-05-blasted", handleBlast);
    return () => {
      window.removeEventListener("positron-section-05-blasted", handleBlast);
    };
  }, []);

  const handleManualTrigger = () => {
    playPositronBlastSound();
    setIsBlasted(true);
    setWaveTrigger((prev) => prev + 1);
    try {
      (window as unknown as { __POSITRON_SECTION_05_BLASTED?: boolean }).__POSITRON_SECTION_05_BLASTED = true;
      const sec05 = document.getElementById("section-05");
      if (sec05) sec05.classList.add("section-05-blasted");
    } catch {}
    window.dispatchEvent(new CustomEvent("positron-section-05-blasted"));
  };

  const handleCardHover = (index: number) => {
    setActiveCardIndex(index);
    if (isBlasted) {
      playPositronChargeTick(0.4 + (index / 6) * 0.5);
    }
  };

  return (
    <section
      id="section-05"
      aria-label="Product Principles & Philosophy"
      className={`relative z-20 px-6 py-24 md:px-12 md:py-32 lg:px-16 border-y transition-all duration-700 overflow-hidden cv-auto ${
        isBlasted
          ? "section-05-blasted bg-gradient-to-b from-card/80 via-background to-card/60 border-accent/30 shadow-[inset_0_1px_40px_color-mix(in_srgb,var(--color-accent)_5%,transparent)]"
          : "bg-background border-border/60"
      }`}
    >
      {/* Dynamic Ambient Aura & Light Beam after Burst */}
      {isBlasted && (
        <>
          <div
            key={waveTrigger}
            className="pointer-events-none absolute -top-32 right-0 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-accent)_15%,transparent),transparent_70%)] blur-3xl animate-pulse"
          />
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
        </>
      )}

      <div className="relative mx-auto max-w-[1500px]">
        {/* Header with Title & Compact Plasma Burst Dock */}
        <StaggerRevealSection staggerDelay={0.12} as="div">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
            <div className="max-w-3xl">
              <StaggerItem y={20}>
                <p
                  id="section-05-heading"
                  className="label-mono text-xs text-muted-foreground uppercase tracking-widest font-semibold"
                >
                  How I Think
                </p>
              </StaggerItem>
              <StaggerItem y={32}>
                <h2
                  id="section-05-title"
                  className="display-lg mt-3 font-display font-bold text-foreground"
                >
                  Six product principles I keep coming back to
                </h2>
              </StaggerItem>
              <StaggerItem y={40}>
                <p className="mt-3 text-base md:text-lg text-muted-foreground leading-relaxed">
                  Operating rules that govern discovery, UX subtraction, and engineering trade-offs under real production constraints.
                </p>
              </StaggerItem>
            </div>

            {/* Compact Refined Plasma Burst Target Dock */}
            <StaggerItem y={35} className="shrink-0 flex items-center">
              <div
                id="section-05-target"
                className="relative self-start lg:self-center shrink-0 flex items-center justify-end"
              >
              {isBlasted ? (
                <div
                  id="section-05-status-badge"
                  role="status"
                  aria-live="polite"
                  className="group relative flex items-center gap-2.5 py-1.5 px-3 rounded-full border border-accent/40 bg-card/90 backdrop-blur-md shadow-[0_2px_14px_color-mix(in_srgb,var(--color-accent)_15%,transparent)] transition-all duration-300 hover:border-accent"
                >
                  {/* Glowing Active Zap Icon */}
                  <div className="relative flex items-center justify-center size-6 rounded-full bg-accent text-white shadow-xs shrink-0">
                    <Zap className="size-3 fill-white" />
                    <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping opacity-75" />
                  </div>

                  {/* Detonated / Infused Label without Field Active */}
                  <div className="flex flex-col text-left leading-tight">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <span className="label-mono text-[10px] font-bold text-accent tracking-wider uppercase">
                        Ideas Detonated
                      </span>
                      <span className="inline-block size-1.5 rounded-full bg-accent" />
                    </div>
                    <span className="label-mono text-[9px] text-muted-foreground font-medium tracking-wide whitespace-nowrap">
                      Principles Infused
                    </span>
                  </div>

                  {/* Retrigger Action Button */}
                  <button
                    id="section-05-retrigger-btn"
                    type="button"
                    onClick={handleManualTrigger}
                    aria-label="Retrigger plasma burst wave"
                    title="Retrigger Plasma Burst"
                    className="ml-0.5 size-5 flex items-center justify-center rounded-full text-accent hover:text-white hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent transition-all duration-200 active:scale-95 shrink-0"
                  >
                    <RefreshCw className="size-2.5" />
                  </button>
                </div>
              ) : (
                <div
                  id="section-05-standby-badge"
                  role="status"
                  className="group relative flex items-center gap-2 py-1.5 px-3.5 rounded-full border border-border/80 bg-card/80 backdrop-blur-md shadow-xs transition-all duration-300 hover:border-border"
                >
                  {/* Standby Pulse Icon */}
                  <div className="relative flex items-center justify-center size-5 rounded-full bg-muted/70 text-muted-foreground shrink-0">
                    <Zap className="size-2.5 text-accent animate-pulse" />
                    <span className="absolute -inset-0.5 rounded-full animate-ping opacity-40 bg-accent/20" />
                  </div>

                  {/* Clean Screening Ideas Label (without Plasma Burst Dock text) */}
                  <span className="label-mono text-[10px] font-bold text-foreground tracking-wider uppercase whitespace-nowrap">
                    Screening Ideas
                  </span>
                </div>
              )}
            </div>
          </StaggerItem>
        </div>
      </StaggerRevealSection>

        {/* Uniform 3-Column Principles Grid with Professional Card Micro-Interactions */}
        <div
          id="section-05-principles-grid"
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
        >
          {principles.map((p, i) => {
            const isHovered = activeCardIndex === i;
            const Icon = p.icon;

            return (
              <div key={p.no} className="h-full flex flex-col">
                <Reveal className="h-full flex flex-col" delay={i * 0.04}>
                  <div
                    id={`principle-card-${p.no}`}
                    tabIndex={0}
                    onMouseEnter={() => handleCardHover(i)}
                    onMouseLeave={() => setActiveCardIndex(null)}
                    onFocus={() => handleCardHover(i)}
                    onBlur={() => setActiveCardIndex(null)}
                    className={`group relative flex flex-col justify-between h-full min-h-[190px] p-5 sm:p-5.5 rounded-xl border transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent overflow-hidden cursor-pointer ${
                      isBlasted
                        ? isHovered
                          ? "bg-card border-accent/80 shadow-none -translate-y-0.5"
                          : "bg-card/90 border-transparent hover:border-accent/60 shadow-none"
                        : isHovered
                        ? "bg-card border-accent/50 shadow-none -translate-y-0.5"
                        : "bg-card/90 border-transparent hover:border-accent/40 shadow-none"
                    }`}
                  >
                    {/* Subtle top accent highlight line on hover */}
                    <span
                      aria-hidden
                      className={`absolute top-0 left-0 h-[2px] w-0 transition-all duration-500 ease-out group-hover:w-full ${
                        isBlasted ? "bg-accent" : "bg-accent/80"
                      }`}
                    />

                    <div>
                      {/* Top Row: Numeral & Theme Pill + Card Icon */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-xl font-bold tracking-tight transition-colors duration-300 ${
                              isHovered ? "text-accent" : "text-muted-foreground/70"
                            }`}
                          >
                            {p.no}
                          </span>
                          <span
                            className={`label-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md transition-colors duration-300 ${
                              isBlasted
                                ? "bg-accent/10 text-accent/90"
                                : "bg-muted/40 text-muted-foreground group-hover:text-foreground"
                            }`}
                          >
                            {p.theme}
                          </span>
                        </div>

                        {/* Thematic Icon Badge */}
                        <div
                          className={`flex size-7 items-center justify-center rounded-lg transition-all duration-300 ${
                            isBlasted
                              ? "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground group-hover:scale-105"
                              : "bg-muted/30 text-muted-foreground group-hover:bg-accent/15 group-hover:text-accent group-hover:scale-105"
                          }`}
                        >
                          <Icon className="size-3.5" />
                        </div>
                      </div>

                      {/* Headline Principle Statement */}
                      <h3
                        id={`principle-title-${p.no}`}
                        className="font-display text-base sm:text-lg font-bold leading-snug tracking-tight text-foreground transition-colors duration-300"
                      >
                        {p.statement}
                      </h3>
                    </div>

                    {/* Bottom Takeaway Tag */}
                    <div className="mt-5 pt-1 flex items-center justify-between">
                      <span
                        className={`label-mono text-[10px] uppercase tracking-wider font-semibold transition-colors duration-300 ${
                          isHovered ? "text-accent" : "text-muted-foreground"
                        }`}
                      >
                        {p.takeaway}
                      </span>
                    </div>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
