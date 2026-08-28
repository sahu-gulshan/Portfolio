import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { track } from "@/lib/analytics";
import type { NavTab } from "./Nav";
import MoltenMetal from "@/components/MoltenMetal";

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
  onToggleTheme?: () => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { profile, setIsResumeOpen } = useProfile();
  const [isFooterHovered, setIsFooterHovered] = useState(false);

  const scrollToTop = () => {
    track("back_to_top_click", { from: "footer" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      onMouseEnter={() => setIsFooterHovered(true)}
      onMouseLeave={() => setIsFooterHovered(false)}
      className="relative overflow-hidden hairline-t mt-24 px-6 pt-16 pb-28 md:px-12 md:pt-20 md:pb-32 lg:px-16"
    >
      <div
        className="absolute inset-0 -z-10 pointer-events-none transition-opacity duration-500 ease-out"
        style={{ opacity: isFooterHovered ? 0.7 : 0.4 }}
      >
        <MoltenMetal
          color1="#09090b"
          color2="#d1651c"
          color3="#fbbf24"
          speed={0.25}
          scale={4}
          detail={3}
          glow={1.2}
          coreSize={0.06}
          swirl={1.0}
          fold={-0.15}
          blackPoint={0.12}
          brightness={1.1}
          colorMode="molten"
          grain={true}
          grainIntensity={0.02}
          mouseInteraction={true}
          mouseStrength={0.15}
          opacity={isFooterHovered ? 0.7 : 0.4}
        />
      </div>
      <div className="mx-auto flex max-w-[1500px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight text-foreground">{profile.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{profile.role}</p>
          <p className="label-mono mt-3 text-xs text-foreground">{profile.positioning}</p>
          {profile.location && <p className="label-mono mt-1 text-xs text-accent">{profile.location}</p>}
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <button
            type="button"
            onClick={() => onNavigate("work")}
            className="label-mono hover:text-foreground cursor-pointer text-xs"
          >
            Work
          </button>
          <button
            type="button"
            onClick={() => onNavigate("about")}
            className="label-mono hover:text-foreground cursor-pointer text-xs"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => onNavigate("experience")}
            className="label-mono hover:text-foreground cursor-pointer text-xs"
          >
            Experience
          </button>
          <button
            type="button"
            onClick={() => {
              track("open_resume_modal", { from: "footer_nav" });
              setIsResumeOpen(true);
            }}
            className="label-mono text-accent hover:underline cursor-pointer text-xs font-semibold"
          >
            Resume (PDF)
          </button>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("linkedin_click", { from: "footer" })}
            className="label-mono hover:text-foreground text-xs"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${profile.email}`}
            onClick={() => track("email_click", { from: "footer" })}
            className="label-mono hover:text-foreground text-xs"
          >
            Email
          </a>
          <button
            type="button"
            onClick={() => onNavigate("contact")}
            className="label-mono hover:text-foreground cursor-pointer text-xs"
          >
            Hire me
          </button>
        </nav>
      </div>

      {/* Footer Bottom Bar with Left-aligned Info and Centered Back to Top Button */}
      <div className="mx-auto mt-12 grid max-w-[1500px] grid-cols-1 items-center gap-6 border-t border-border pt-6 text-xs text-muted-foreground md:grid-cols-3">
        {/* Left Side: Copyright & Built Tagline */}
        <div className="flex flex-col gap-1 text-left sm:flex-row sm:items-center sm:gap-3">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="hidden text-border sm:inline">·</span>
          <span>Built with clean minimalism, micro-interactions & AI.</span>
        </div>

        {/* Center: Back to Top Button */}
        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 p-1.5 text-xs font-semibold text-accent transition-all duration-300 hover:text-accent hover:[text-shadow:0_0_14px_var(--color-accent)] cursor-pointer"
            aria-label="Back to top"
          >
            <motion.span
              className="inline-flex items-center justify-center text-accent drop-shadow-[0_0_8px_var(--color-accent)]"
              animate={{ y: [0, -3.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowUp className="size-3.5 stroke-[2.5] transition-transform duration-300 group-hover:-translate-y-1" />
            </motion.span>
            <span className="tracking-wide transition-all duration-300">Back to top</span>
          </button>
        </div>

        {/* Right Side: Spacer / Quick Status */}
        <div className="hidden md:flex md:justify-end">
          <span className="label-mono text-[0.7rem] text-muted-foreground/70">
            Open to Leadership & Advisory Roles
          </span>
        </div>
      </div>
    </footer>
  );
}
