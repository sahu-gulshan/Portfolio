import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowDownRight, ArrowRight, Bot, Sparkles, FileText } from "lucide-react";
import { lenses } from "@/data/site";
import { useProfile } from "@/context/ProfileContext";
import { IntersectionField } from "@/components/IntersectionField";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  playHeroConstellationBloomSound,
  playConstellationGlideSound,
} from "@/lib/quantum-audio";
import { track } from "@/lib/analytics";
import type { NavTab } from "../Nav";

interface HeroProps {
  onNavigate: (tab: NavTab, slug?: string) => void;
  onOpenAiAssistant?: () => void;
  hasHeroIntroPlayed?: boolean;
  onHeroIntroComplete?: () => void;
}

export function Hero({
  onNavigate,
  onOpenAiAssistant,
  hasHeroIntroPlayed = false,
  onHeroIntroComplete,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { profile, setIsPersonalizeOpen, setIsResumeOpen } = useProfile();
  const [lens, setLens] = useState<number | null>(null);

  // If reduced motion is requested OR intro already played during this app session, skip intro
  const shouldSkipIntro = reducedMotion || hasHeroIntroPlayed;
  const [isIntroComplete, setIsIntroComplete] = useState(shouldSkipIntro);
  const [isShifted, setIsShifted] = useState(shouldSkipIntro);
  const [centerOffset, setCenterOffset] = useState(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      // High-precision initial estimate for 2-column grid before layout measurement
      const heroWidth = Math.min(window.innerWidth - 96, 1500);
      return -(heroWidth * 0.25 + 12);
    }
    return 0;
  });
  const active = lens === null ? null : lenses[lens];

  const lastName = profile.name.replace(profile.first, "").trim();

  // Measure exact sub-pixel offset needed to center the right-column element in the hero container
  useLayoutEffect(() => {
    if (shouldSkipIntro) return;

    const measureOffset = () => {
      if (window.innerWidth < 1024) {
        setCenterOffset(0);
        return;
      }
      if (!containerRef.current || !rightColRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const rightColRect = rightColRef.current.getBoundingClientRect();

      const containerCenterX = containerRect.left + containerRect.width / 2;
      const rightColCenterX = rightColRect.left + rightColRect.width / 2;

      // Exact pixel delta to place the constellation at dead center of the hero section
      const exactOffset = containerCenterX - rightColCenterX;
      setCenterOffset(exactOffset);
    };

    measureOffset();
    window.addEventListener("resize", measureOffset);
    return () => window.removeEventListener("resize", measureOffset);
  }, [shouldSkipIntro]);

  // Schedule the shift of the constellation from center to right at 2.5s with audio synthesis (first visit only)
  useEffect(() => {
    if (shouldSkipIntro) {
      setIsShifted(true);
      setIsIntroComplete(true);
      return;
    }

    // Play subtle opening center bloom chime at 250ms
    const bloomTimer = window.setTimeout(() => {
      playHeroConstellationBloomSound();
    }, 250);

    // Play gentle spatial whoosh glide as it shifts to the right column at 2.45s
    const glideSoundTimer = window.setTimeout(() => {
      playConstellationGlideSound();
    }, 2450);

    const shiftTimer = window.setTimeout(() => {
      setIsShifted(true);
      onHeroIntroComplete?.();
    }, 2500);

    return () => {
      window.clearTimeout(bloomTimer);
      window.clearTimeout(glideSoundTimer);
      window.clearTimeout(shiftTimer);
    };
  }, [shouldSkipIntro, onHeroIntroComplete]);

  // Coordinated stagger animation variants for left-side content
  const leftContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: shouldSkipIntro ? 0 : 0.25, // Instant on return navigation; staggers as circle glides on first visit
      },
    },
  };

  const leftItemVariants: Variants = {
    hidden: shouldSkipIntro
      ? { opacity: 1, x: 0, filter: "blur(0px)" }
      : { opacity: 0, x: -40, filter: "blur(10px)", scale: 0.98 },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: shouldSkipIntro ? 0.3 : 0.85,
        ease: [0.16, 1, 0.3, 1], // Smooth luxury cubic-bezier deceleration
      },
    },
  };

  return (
    <section
      id="hero-section"
      ref={heroRef}
      aria-labelledby="hero-heading"
      className="relative overflow-hidden px-6 pb-20 pt-32 md:px-12 md:pb-28 md:pt-40 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0 grid-field opacity-60" aria-hidden />
      
      <div
        ref={containerRef}
        className="relative z-10 mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center"
      >
        {/* Left Column: Coordinated Stagger Animation */}
        <motion.div
          variants={leftContainerVariants}
          initial={reducedMotion ? "visible" : "hidden"}
          animate={isShifted ? "visible" : "hidden"}
          className="flex flex-col items-center text-center lg:items-start lg:text-left justify-between h-full w-full"
        >
          <div className="w-full flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* 1. Status Badge & Avatar */}
            <motion.div
              variants={leftItemVariants}
              className="flex justify-center lg:justify-start items-center gap-2"
            >
              <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/80 pl-1.5 pr-3 py-1 sm:pl-2 sm:pr-3.5 sm:py-1.5 backdrop-blur-sm whitespace-nowrap max-w-full shadow-xs">
                <div className="relative size-6 sm:size-7 shrink-0">
                  {/* Circular Avatar */}
                  <div className="size-full rounded-full overflow-hidden border border-border/80 bg-background/50">
                    <img
                      src={profile.portrait}
                      alt={profile.name}
                      className="size-full object-cover object-top"
                    />
                  </div>

                  {/* Status Badge: Prominently Positioned on Top with Radar Ping */}
                  <span className="absolute -bottom-0.5 -right-0.5 z-10 flex size-2 sm:size-2.5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-1.5 sm:size-2 rounded-full bg-emerald-500 ring-1.5 ring-background shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                  </span>
                </div>
                <p className="label-mono text-[0.62rem] min-[380px]:text-[0.68rem] sm:text-[0.7rem] text-foreground font-semibold whitespace-nowrap">
                  <span className="sm:hidden">Available for PM and Product Roles</span>
                  <span className="hidden sm:inline">{profile.statusNote}</span>
                </p>
              </div>
            </motion.div>

            {/* 2. Main Heading */}
            <motion.h1
              variants={leftItemVariants}
              id="hero-heading"
              className="mt-5 text-center lg:text-left"
            >
              <span className="display-xl block">{profile.first}</span>
              <span className="display-xl block text-muted-foreground">
                {lastName || profile.name}
              </span>
            </motion.h1>

            {/* 3. Role & Discipline Lenses */}
            <motion.div
              variants={leftItemVariants}
              className="mt-6 flex flex-wrap justify-center lg:justify-start items-center gap-x-3 gap-y-2.5"
            >
              <span className="font-display text-lg font-semibold tracking-tight md:text-xl text-foreground">
                {profile.role}
              </span>
              <span className="h-4 w-px bg-border" aria-hidden />
              {lenses.map((l, i) => (
                <button
                  key={l.key}
                  type="button"
                  onMouseEnter={() => setLens(i)}
                  onMouseLeave={() => setLens(null)}
                  onFocus={() => setLens(i)}
                  onBlur={() => setLens(null)}
                  className={`label-mono rounded-full px-3.5 py-1.5 transition-colors duration-200 cursor-pointer text-xs font-semibold ${
                    lens === i
                      ? "bg-accent/15 text-accent font-bold"
                      : "bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card"
                  }`}
                >
                  {l.key}
                </button>
              ))}
            </motion.div>

            {/* 4. Headline Description */}
            <motion.div
              variants={leftItemVariants}
              className="mt-4 w-full max-w-2xl grid grid-cols-1 grid-rows-1 items-center"
            >
              {/* Hidden placeholders to reserve static layout height for the longest text string */}
              <div
                aria-hidden
                className="col-start-1 row-start-1 invisible pointer-events-none select-none w-full font-display text-xl sm:text-2xl md:text-[26px] leading-relaxed sm:leading-snug tracking-tight font-medium text-center lg:text-left mx-auto lg:mx-0"
              >
                {profile.heroHeadline}
              </div>
              {lenses.map((l) => (
                <div
                  key={l.key}
                  aria-hidden
                  className="col-start-1 row-start-1 invisible pointer-events-none select-none w-full font-display text-xl sm:text-2xl md:text-[26px] leading-relaxed sm:leading-snug tracking-tight font-medium text-center lg:text-left mx-auto lg:mx-0"
                >
                  {l.line}
                </div>
              ))}

              {/* Active visible text overlay */}
              <p
                className="col-start-1 row-start-1 w-full font-display text-xl sm:text-2xl md:text-[26px] leading-relaxed sm:leading-snug tracking-tight font-medium text-foreground text-center lg:text-left mx-auto lg:mx-0"
                aria-live="polite"
              >
                <span className="block text-foreground">
                  {active ? active.line : profile.heroHeadline}
                </span>
              </p>
            </motion.div>
          </div>

          {/* 5. Action CTA Buttons */}
          <motion.div
            variants={leftItemVariants}
            className="mt-8 lg:mt-auto pt-4 flex flex-nowrap sm:flex-wrap justify-center lg:justify-start items-center gap-1.5 sm:gap-3.5 max-w-full w-full"
          >
            <button
              type="button"
              onClick={() => {
                track("click_view_selected_work", { from: "hero_cta" });
                onNavigate("work");
              }}
              className="group hover-scale inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-accent px-3.5 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_40%,transparent)] active:scale-95 cursor-pointer shrink-0 whitespace-nowrap shadow-md shadow-accent/20"
            >
              <span className="sm:hidden">Selected Work</span>
              <span className="hidden sm:inline">View Selected Work</span>
              <ArrowDownRight className="size-3.5 sm:size-4 transition-transform group-hover:rotate-[-45deg]" />
            </button>
            <button
              type="button"
              id="hero-contact-button"
              aria-label="Scroll to Start a Conversation contact form"
              onClick={() => {
                track("click_contact", { from: "hero_cta" });
                const contactEl = document.getElementById("section-08");
                if (contactEl) {
                  contactEl.scrollIntoView({ behavior: "smooth" });
                } else {
                  onNavigate("contact");
                }
              }}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 hover:border-accent hover:text-accent hover:-translate-y-0.5 active:scale-95 cursor-pointer shrink-0 whitespace-nowrap shadow-2xs"
            >
              <span>Let's talk</span>
              <ArrowRight className="size-3.5 sm:size-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                track("open_resume_modal", { from: "hero_cta" });
                setIsResumeOpen(true);
              }}
              aria-label="View & Download Resume PDF"
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 hover:border-accent hover:text-accent hover:-translate-y-0.5 active:scale-95 cursor-pointer shrink-0 whitespace-nowrap shadow-2xs"
            >
              <FileText className="size-3.5 sm:size-4 text-accent" />
              <span>Resume</span>
            </button>
            {onOpenAiAssistant && (
              <button
                type="button"
                onClick={() => {
                  track("open_ai_assistant", { trigger: "hero_ask_ai_pm_button" });
                  onOpenAiAssistant();
                }}
                aria-label="Open AI Product Manager Assistant"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-border/80 bg-card/90 hover:border-accent hover:bg-card px-3.5 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium text-foreground transition-all duration-500 hover:-translate-y-0.5 active:scale-95 cursor-pointer shrink-0 whitespace-nowrap animate-ai-border-glow shadow-sm"
              >
                {/* Subtle luminous light sweep across the button */}
                <span className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-full">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-70 animate-ai-shimmer-sweep" />
                </span>

                <Bot className="size-3.5 sm:size-4 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                <span className="tracking-tight">Ask AI PM</span>
                <span className="relative flex size-2 items-center justify-center">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/70 opacity-80" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
                </span>
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Right Column: Interactive Constellation Nexus */}
        <div
          ref={rightColRef}
          className="w-full flex items-center justify-center lg:justify-center"
        >
          <IntersectionField
            highlight={active?.key ?? null}
            isShifted={isShifted}
            centerOffset={centerOffset}
            onIntroComplete={() => setIsIntroComplete(true)}
          />
        </div>
      </div>
    </section>
  );
}
