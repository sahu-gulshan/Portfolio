import { useState, useRef, type MouseEvent } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { site } from "@/data/site";
import { useProfile } from "@/context/ProfileContext";
import { Reveal } from "@/components/Reveal";
import { track } from "@/lib/analytics";
import type { NavTab } from "../Nav";
import { HumanBackgroundEffects } from "./HumanBackgroundEffects";

interface AboutStripProps {
  onNavigate: (tab: NavTab) => void;
}

export function AboutStrip({ onNavigate }: AboutStripProps) {
  const { profile } = useProfile();
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle tilt angle: max ±8 degrees
    const rotateX = -((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;

    // Glare position percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({
      rotateX,
      rotateY,
      glareX,
      glareY,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      isHovered: false,
    });
  };

  return (
    <section
      id="section-07"
      aria-label="About and Human Background"
      className="px-6 py-24 md:px-12 md:py-32 lg:px-16 bg-background relative overflow-hidden transition-colors duration-500 cv-auto"
    >
      {/* Dynamic Acoustic Vinyl Waves & Micro-Dust Background */}
      <HumanBackgroundEffects mode="vinyl" />

      <div className="mx-auto max-w-[1500px] relative z-10">
        <div className="grid gap-8 md:gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Left Column: Parallax Mouse-Tilt Portrait with Shimmer Skeleton */}
          <div className="relative flex justify-center lg:justify-start" style={{ perspective: "1000px" }}>
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: tilt.isHovered
                  ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
                  : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
                transition: tilt.isHovered ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
                transformStyle: "preserve-3d",
              }}
              className="group relative overflow-hidden w-full max-w-[480px] aspect-square shadow-xl rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md cursor-pointer select-none"
            >
              {/* Skeleton / Shimmer Loader State */}
              {!isLoaded && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-secondary/50 overflow-hidden">
                  {/* Shimmer sweep effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-[shimmer_3.5s_infinite] -translate-x-full" />
                  
                  {/* Pulse placeholder icon */}
                  <div className="flex flex-col items-center gap-3 text-muted-foreground/40 animate-pulse">
                    <div className="size-16 rounded-full bg-muted/60" />
                    <div className="h-3 w-28 rounded-full bg-muted/60" />
                  </div>
                </div>
              )}

              {/* Main Image with Smooth Fade-in & Parallax Layering */}
              <img
                src={profile.portrait}
                alt="Portrait of Gulshan Kumar Sahu, Product Manager"
                loading="eager"
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                style={{
                  transform: tilt.isHovered ? "translateZ(20px)" : "translateZ(0px)",
                  transition: "transform 0.2s ease-out, opacity 0.6s ease-out",
                }}
                className={`absolute inset-0 w-full h-full object-cover object-top ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Dynamic Glare Reflection for Depth */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
                style={{
                  background: tilt.isHovered
                    ? `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 65%)`
                    : "none",
                  opacity: tilt.isHovered ? 1 : 0,
                  transform: "translateZ(30px)",
                }}
              />

              {/* Subtle ambient border shine */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10 dark:border-white/5" />
            </div>
          </div>

          {/* Right Column: High-Fidelity Professional Narrative Design */}
          <Reveal>
            <div className="flex flex-col text-left">
              <p
                id="section-07-heading"
                className="label-mono text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-6"
              >
                A Little More Human
              </p>

              <h2
                id="section-07-title"
                className="display-lg font-bold tracking-tight text-foreground leading-[1.1] mb-6"
              >
                I care about the boring middle of products
              </h2>

              <p className="text-muted-foreground leading-relaxed text-base mb-5">
                The part after the pitch and before the launch post — where scope gets cut,
                the data disagrees with the roadmap, and someone has to decide. That's the
                work I like.
              </p>

              <p className="text-muted-foreground leading-relaxed text-base mb-8">
                Before enterprise products, I ran operations and customer experiences. Forty events,
                fifty B2B discovery conversations, a hotel floor. I learned what a
                broken journey costs before I ever wrote a PRD about one.
              </p>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <button
                  type="button"
                  onClick={() => {
                    track("click_about_full_story", { from: "about_human_section" });
                    onNavigate("about");
                  }}
                  className="group inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-foreground hover:text-accent cursor-pointer transition-colors"
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    track("click_career_timeline", { from: "about_human_section" });
                    onNavigate("experience");
                  }}
                  className="group inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-accent cursor-pointer transition-colors"
                >
                  <span>Full Career Timeline</span>
                  <Sparkles className="size-3.5 text-accent" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
