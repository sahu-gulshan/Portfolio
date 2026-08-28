import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { projects } from "@/data/projects";
import type { Project } from "@/types";
import { StaggerRevealSection, StaggerItem } from "@/components/StaggerRevealSection";
import { getProjectThemeOverride, getActiveColorPalette, type ColorPaletteId } from "@/lib/colorPalettes";
import { track } from "@/lib/analytics";
import type { NavTab } from "../Nav";

interface SelectedWorkProps {
  onNavigate: (tab: NavTab, slug?: string) => void;
}

/**
 * Minimalist Case Study Card with Dynamic Cursor Specular Spotlight,
 * Luminous Border Glow, and 1x3 Metrics Row with Generous Whitespace.
 */
function MinimalProjectCard({
  project,
  index,
  isActive,
  cardAccent,
  onNavigate,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  cardAccent: string;
  onNavigate: (tab: NavTab, slug?: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCardClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    track("click_case_study", {
      slug: project.slug,
      title: project.title,
      index: project.index,
      category: project.category,
      from: "home_selected_work_card",
    });
    track("project_view", { slug: project.slug, from: "home" });
    onNavigate("work", project.slug);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative"
    >
      <a
        ref={cardRef}
        href={`#work/${project.slug}`}
        id={project.index === "03" ? "section-04-card-03" : `section-04-card-${project.index}`}
        aria-label={`Open case study: ${project.title}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleCardClick(e);
          }
        }}
        style={{
          // @ts-ignore
          "--card-accent": cardAccent,
        }}
        className={`group relative block cursor-pointer overflow-hidden rounded-3xl border transition-all duration-400 ease-out p-6 sm:p-8 md:px-10 md:pt-10 md:pb-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          isActive
            ? "border-accent/60 shadow-2xl ring-1 ring-accent/20 bg-card/95"
            : "border-border/70 bg-card/80 hover:border-border hover:bg-card/95 hover:shadow-lg"
        }`}
      >
        {/* Dynamic Specular Spotlight Tracking Cursor */}
        <div
          aria-hidden
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, color-mix(in srgb, ${cardAccent} 24%, transparent), transparent 70%)`,
            opacity: isHovered ? 1 : isActive ? 0.35 : 0,
          }}
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
        />

        {/* Luminous Interactive Border Sheen */}
        <div
          aria-hidden
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, color-mix(in srgb, ${cardAccent} 65%, white 20%), transparent 70%)`,
            opacity: isHovered ? 1 : 0,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1.5px",
          }}
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-10"
        />

        {/* Minimal Card Body: Header + Content + 1x3 Metrics Row */}
        <div className="relative z-20 flex flex-col gap-6 md:gap-8">
          {/* Top Section: Index, Title, Category, Summary and CTA */}
          <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1.2fr)_minmax(0,1fr)] md:items-start md:gap-8">
            {/* Index Badge */}
            <span
              id={project.index === "03" ? "section-04-badge-03" : `section-04-badge-${project.index}`}
              style={{
                backgroundColor: `color-mix(in srgb, ${cardAccent} 15%, transparent)`,
                color: cardAccent,
              }}
              className="label-mono inline-flex size-10 items-center justify-center rounded-full font-bold text-sm transition-transform duration-300 group-hover:scale-110 shrink-0"
            >
              {project.index}
            </span>

            {/* Title, Category & Tags */}
            <div className="min-w-0">
              <h3
                style={{
                  // @ts-ignore
                  "--hover-color": cardAccent,
                }}
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight transition-colors duration-300 group-hover:text-[var(--hover-color)] text-foreground"
              >
                {project.title}
              </h3>
              <p
                style={{ color: cardAccent }}
                className="label-mono mt-2.5 text-xs font-semibold uppercase tracking-wider"
              >
                {project.category}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border/80 bg-background/60 px-3 py-1 text-xs text-muted-foreground font-medium transition-colors group-hover:border-border"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Summary & Action Button */}
            <div className="flex flex-col justify-between h-full gap-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.summary}
              </p>
              <div className="pt-2">
                <span
                  id={project.index === "03" ? "section-04-button-03" : `section-04-button-${project.index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(e);
                  }}
                  style={{
                    backgroundColor: cardAccent,
                    color: "#ffffff",
                  }}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold whitespace-nowrap transition-all duration-300 group-hover:translate-x-1.5 shadow-sm group-hover:shadow-md hover:brightness-110 cursor-pointer"
                >
                  <span className="whitespace-nowrap">Read full case study</span>
                  <ArrowUpRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          </div>

          {/* 1x3 Metrics Row with Enhanced Whitespace */}
          <div className="pt-7 mt-1 border-t border-border/60">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {project.metrics.map((m) => (
                <div key={m.label} className="space-y-1.5">
                  <p
                    style={{ color: cardAccent }}
                    className="font-display text-2xl sm:text-3xl font-bold tracking-tight"
                  >
                    {m.value}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[28ch] pt-0.5">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export function SelectedWork({ onNavigate }: SelectedWorkProps) {
  const [isLight, setIsLight] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("light");
    }
    return false;
  });

  const [activePaletteId, setActivePaletteId] = useState<ColorPaletteId>(() => getActiveColorPalette().id);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Highly responsive, jitter-free scroll synchronization based on viewport reading center
  useEffect(() => {
    let ticking = false;

    const updateActiveCard = () => {
      if (!cardRefs.current.length) return;
      const viewportCenter = window.innerHeight * 0.42;
      let closestIdx = 0;
      let minDistance = Infinity;

      cardRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Calculate distance from card's optical center to viewport center
        const cardCenter = rect.top + rect.height * 0.4;
        const dist = Math.abs(cardCenter - viewportCenter);

        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      setActiveIndex((prev) => (prev !== closestIdx ? closestIdx : prev));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveCard);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updateActiveCard();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const updateTheme = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handlePaletteChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (typeof customEvent.detail === "string") {
        setActivePaletteId(customEvent.detail as ColorPaletteId);
      } else if (customEvent.detail?.paletteId) {
        setActivePaletteId(customEvent.detail.paletteId as ColorPaletteId);
      }
    };
    window.addEventListener("gks_palette_changed", handlePaletteChange);
    window.addEventListener("gks_palette_preview", handlePaletteChange);
    return () => {
      window.removeEventListener("gks_palette_changed", handlePaletteChange);
      window.removeEventListener("gks_palette_preview", handlePaletteChange);
    };
  }, []);

  const getCardAccentColor = (p: (typeof projects)[0]) => {
    const override = getProjectThemeOverride(p.slug, activePaletteId);
    if (override) {
      return isLight ? override.accentLight : override.accent;
    }
    const globalAccent =
      typeof document !== "undefined"
        ? getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()
        : null;
    return globalAccent && globalAccent.startsWith("#") ? globalAccent : p.theme.accent;
  };

  const scrollToCard = (index: number) => {
    setActiveIndex(index);
    const targetEl = cardRefs.current[index];
    if (targetEl) {
      const targetRect = targetEl.getBoundingClientRect();
      const topOffset = targetRect.top + window.scrollY - 110;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="work" ref={sectionRef} className="relative z-10 px-6 py-20 md:px-12 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        {/* FULL-WIDTH TOP INTRO HEADER: Clean, spacious, across full width before the 2 columns */}
        <div className="mb-12 md:mb-16 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-accent animate-pulse" />
            <p id="section-04-heading" className="label-mono text-xs text-muted-foreground uppercase tracking-widest font-semibold">
              Selected Work
            </p>
          </div>
          <h2 className="display-lg font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-foreground leading-[1.12]">
            <span id="section-04-three" className="relative inline-block text-foreground font-bold">
              Three
            </span>{" "}
            products, three enterprise challenges
          </h2>
          <p className="label-mono text-xs sm:text-sm text-accent font-semibold flex items-center gap-2 pt-1">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{projects.length} deep-dive case studies · Real shipped enterprise outcomes</span>
          </p>
        </div>

        {/* 2-COLUMN LAYOUT: Sticky Left Project Index + Right Scrolling Case Studies */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
          {/* STICKY LEFT COLUMN: Dedicated Project Index Deck (Hidden on mobile, visible on lg+) */}
          <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-28 lg:self-start space-y-4 z-20">
            <div className="p-0 space-y-3">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="label-mono text-[0.72rem] uppercase tracking-widest text-muted-foreground font-semibold">
                  Case Studies Index
                </span>
                <span className="font-mono text-xs text-accent font-bold">
                  0{activeIndex + 1} / 0{projects.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {projects.map((p, idx) => {
                  const isActive = activeIndex === idx;
                  const cardAccent = getCardAccentColor(p);
                  return (
                    <a
                      key={p.slug}
                      href={`#work/${p.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        track("click_case_study", {
                          slug: p.slug,
                          title: p.title,
                          from: "home_sidebar_index",
                        });
                        onNavigate("work", p.slug);
                      }}
                      className={`group w-full text-left transition-all duration-300 cursor-pointer block p-3 rounded-2xl ${
                        isActive
                          ? "bg-accent/15 pl-4"
                          : "bg-transparent text-muted-foreground hover:text-foreground hover:pl-4 hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="label-mono text-[0.72rem] font-bold transition-colors duration-300"
                          style={{ color: isActive ? cardAccent : undefined }}
                        >
                          {p.index} / {p.category}
                        </span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                          >
                            <ChevronRight className="size-3.5 text-accent" />
                          </motion.div>
                        )}
                      </div>
                      <p
                        className={`font-display text-sm md:text-base font-bold tracking-tight mt-1 transition-colors duration-300 ${
                          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        {p.title}
                      </p>
                    </a>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Full Scrolling Project Cards */}
          <div className="col-span-1 lg:col-span-8 space-y-12 md:space-y-16 pb-16">
            {projects.map((p, i) => {
              const cardAccent = getCardAccentColor(p);
              const isActive = activeIndex === i;

              return (
                <div
                  key={p.slug}
                  data-index={i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="scroll-mt-28"
                >
                  <MinimalProjectCard
                    project={p}
                    index={i}
                    isActive={isActive}
                    cardAccent={cardAccent}
                    onNavigate={onNavigate}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
