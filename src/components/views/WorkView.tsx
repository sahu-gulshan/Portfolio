import React, { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { track } from "@/lib/analytics";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { getProjectThemeOverride, getActiveColorPalette, type ColorPaletteId } from "@/lib/colorPalettes";
import type { NavTab } from "@/components/Nav";

interface WorkViewProps {
  onNavigate: (tab: NavTab, slug?: string) => void;
}

export function WorkView({ onNavigate }: WorkViewProps) {
  const [activePaletteId, setActivePaletteId] = useState<ColorPaletteId>(() => getActiveColorPalette().id);
  const [previewPaletteId, setPreviewPaletteId] = useState<ColorPaletteId | null>(null);
  const [isLight, setIsLight] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("light");
    }
    return false;
  });

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
      setPreviewPaletteId(null);
      if (typeof customEvent.detail === "string") {
        setActivePaletteId(customEvent.detail as ColorPaletteId);
      } else if (customEvent.detail?.paletteId) {
        setActivePaletteId(customEvent.detail.paletteId as ColorPaletteId);
      }
    };

    const handlePalettePreview = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.isPreview && customEvent.detail?.paletteId) {
        setPreviewPaletteId(customEvent.detail.paletteId as ColorPaletteId);
      } else {
        setPreviewPaletteId(null);
      }
    };

    window.addEventListener("gks_palette_changed", handlePaletteChange);
    window.addEventListener("gks_palette_preview", handlePalettePreview);
    return () => {
      window.removeEventListener("gks_palette_changed", handlePaletteChange);
      window.removeEventListener("gks_palette_preview", handlePalettePreview);
    };
  }, []);

  const currentPaletteId = previewPaletteId || activePaletteId;

  return (
    <div className="px-6 pb-24 pt-32 md:px-12 md:pt-40 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="label-mono text-xs text-muted-foreground uppercase tracking-widest font-semibold">Selected Work & Case Studies</p>
            <h1 className="display-xl mt-4 max-w-[16ch] font-bold">Products, not screenshots</h1>
            <p className="mt-6 max-w-2xl text-muted-foreground text-base md:text-lg leading-relaxed">
              In-depth enterprise case studies spanning AI, ML optimization, and UX strategy.
              Each one begins with a real business bottleneck, details the technical & architecture trade-offs, and validates tangible outcomes.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const cardTheme = getProjectThemeOverride(p.slug, currentPaletteId) || p.theme;
            const cardAccent = isLight ? (cardTheme.accentLight || cardTheme.accent) : cardTheme.accent;

            const handleCardClick = (e: React.MouseEvent | React.KeyboardEvent) => {
              e.preventDefault();
              track("click_case_study", {
                slug: p.slug,
                title: p.title,
                index: p.index,
                category: p.category,
                from: "work_index",
              });
              track("project_view", { slug: p.slug, from: "work-index" });
              onNavigate("work", p.slug);
            };

            return (
              <div
                key={p.slug}
                className="h-full"
              >
                <a
                  href={`#work/${p.slug}`}
                  aria-label={`Open case study: ${p.title}`}
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
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-7 sm:p-8 md:px-9 md:pt-9 md:pb-11 transition-all duration-300 hover:border-[var(--card-accent)]/70 hover:bg-card hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {/* Top subtle ambient highlight on hover */}
                  <div
                    style={{ backgroundColor: cardAccent }}
                    className="pointer-events-none absolute -top-24 -right-24 size-48 rounded-full blur-3xl opacity-0 transition-all duration-500 group-hover:opacity-25"
                  />

                  <div>
                    {/* Top bar */}
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          backgroundColor: `color-mix(in srgb, ${cardAccent} 15%, transparent)`,
                          color: cardAccent,
                        }}
                        className="label-mono font-bold px-3 py-1 rounded-full text-xs transition-all duration-300"
                      >
                        {p.index}
                      </span>
                      <span className="label-mono text-[0.72rem] uppercase tracking-wider font-semibold text-muted-foreground truncate max-w-[180px]">
                        {p.client.split("(")[0].trim()}
                      </span>
                    </div>

                    {/* Title */}
                    <h2
                      style={{
                        // @ts-ignore
                        "--hover-accent": cardAccent,
                      }}
                      className="mt-6 font-display text-2xl font-bold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-[var(--hover-accent)] md:text-3xl"
                    >
                      {p.title}
                    </h2>
                    <p
                      style={{ color: cardAccent }}
                      className="label-mono mt-2.5 text-xs font-semibold tracking-wide uppercase transition-colors duration-300"
                    >
                      {p.category}
                    </p>

                    {/* Domain Badges */}
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {(p.domains || []).map((domain) => (
                        <span
                          key={domain}
                          className="rounded-full bg-secondary/80 border border-border/50 px-3 py-1 text-[0.7rem] font-medium text-muted-foreground"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>

                    {/* Summary */}
                    <p className="mt-5 text-sm leading-relaxed font-normal text-muted-foreground">
                      {p.summary}
                    </p>
                  </div>

                  {/* Footer Metrics Panel */}
                  <div className="mt-8 pt-5 border-t border-border/30">
                    <div className="rounded-2xl bg-secondary/60 border border-border/40 p-4.5 space-y-2.5 mb-5">
                      {p.metrics.map((m) => (
                        <p key={m.label} className="text-xs flex items-baseline justify-between gap-3">
                          <span className="truncate font-medium text-muted-foreground">
                            {m.label}
                          </span>
                          <span
                            style={{ color: cardAccent }}
                            className="font-display text-base font-bold tracking-tight shrink-0 transition-colors duration-300"
                          >
                            {m.value}
                          </span>
                        </p>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span
                        style={{
                          backgroundColor: `color-mix(in srgb, ${cardAccent} 15%, transparent)`,
                          color: cardAccent,
                        }}
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-300 group-hover:opacity-90 hover:brightness-110"
                      >
                        <span className="whitespace-nowrap">Read case study</span>
                        <ArrowUpRight className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                      <span className="label-mono text-[0.7rem] font-medium text-muted-foreground text-right">
                        {p.timeline.split("·")[0].trim()}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>

        {/* Global CTA Section */}
        <div className="mt-24">
          <ContactCTA onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
