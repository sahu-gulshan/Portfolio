import React from "react";
import { Sparkles } from "lucide-react";
import { capabilities } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { StaggerRevealSection, StaggerItem } from "@/components/StaggerRevealSection";
import { StackBubbleCanvas } from "@/components/StackBubbleCanvas";
import { motion } from "motion/react";

export function Capabilities() {
  return (
    <section id="capabilities" className="px-6 py-20 md:px-12 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        {/* Section Header */}
        <div className="mb-14 md:mb-20 max-w-3xl">
          <StaggerRevealSection staggerDelay={0.1} as="div">
            <StaggerItem y={16}>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-1 font-mono text-xs font-semibold text-accent uppercase tracking-widest">
                <Sparkles className="size-3.5 text-accent" />
                <span>Core Capabilities</span>
              </div>
            </StaggerItem>
            <StaggerItem y={24}>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl text-foreground">
                What kind of product manager I am
              </h2>
            </StaggerItem>
            <StaggerItem y={28}>
              <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
                Bridging technical depth with executive clarity. Explore how I translate strategy into shipped software across 5 key dimensions.
              </p>
            </StaggerItem>
          </StaggerRevealSection>
        </div>

        {/* Minimalist Stacking Deck — Pure, unboxed, zero-shadow design */}
        <div className="relative space-y-6 md:space-y-8 pb-16">
          {capabilities.map((c, index) => {
            const topOffset = 84 + index * 20;

            return (
              <div
                key={c.no}
                className="sticky"
                style={{ top: `${topOffset}px`, zIndex: index + 1 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-none"
                >
                  {/* Top Header */}
                  <div className="flex flex-wrap items-baseline justify-between gap-3 pb-5 border-b border-border/70">
                    <div className="flex items-baseline gap-3.5">
                      <span className="font-mono text-sm font-bold text-accent">
                        {c.no}
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        {c.title}
                      </h3>
                    </div>

                    <span className="font-mono text-xs text-muted-foreground">
                      0{index + 1} / 0{capabilities.length}
                    </span>
                  </div>

                  {/* Core Mindset / Operating Principle (No background box) */}
                  <p className="mt-5 text-base sm:text-lg text-foreground font-medium italic leading-relaxed">
                    "{c.think}"
                  </p>

                  {/* Clean Content Grid (No inner boxes, no badge pills, no shadows) */}
                  <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-border/70">
                    {/* Execution details */}
                    <div className="lg:col-span-7">
                      <p className="font-mono text-xs font-bold uppercase text-accent tracking-wider mb-3">
                        Core Execution
                      </p>
                      <ul className="space-y-2.5">
                        {c.does.map((d) => (
                          <li key={d} className="flex items-start gap-2.5 text-sm sm:text-base text-foreground/90 leading-snug">
                            <span className="size-1.5 rounded-full bg-accent mt-2 shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tools and Outcome */}
                    <div className="lg:col-span-5 space-y-6">
                      <div>
                        <p className="font-mono text-xs font-bold uppercase text-accent tracking-wider mb-2">
                          Tools & Systems
                        </p>
                        <p className="text-sm font-mono text-foreground leading-relaxed">
                          {c.tools.join("  •  ")}
                        </p>
                      </div>

                      <div>
                        <p className="font-mono text-xs font-bold uppercase text-accent tracking-wider mb-1.5">
                          Outcome
                        </p>
                        <p className="text-sm sm:text-base text-foreground font-medium leading-snug">
                          {c.outcome}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Slingshot Skill Playground (Desktop & Tablet only - hidden on mobile) */}
        <div className="hidden md:block mt-20 md:mt-28">
          <Reveal>
            <div className="mb-6 flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between border-b border-border/60 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-mono font-bold text-accent">
                  <Sparkles className="size-3.5" />
                  <span>SLINGSHOT SKILL PLAYGROUND</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground max-w-md">
                Drag and release bubbles with audio feedback to launch skills, trigger bounce combos, and explore my full PM toolset.
              </p>
            </div>
            <StackBubbleCanvas />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
