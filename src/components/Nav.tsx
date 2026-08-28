import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  Briefcase,
  Bot,
  FileText,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { isAudioMuted, toggleAudioMuted, playHeroConstellationBloomSound } from "@/lib/quantum-audio";
import { track } from "@/lib/analytics";

export type NavTab = "home" | "work" | "about" | "experience" | "contact";

interface NavProps {
  activeTab?: NavTab;
  currentTab?: NavTab;
  activeSlug?: string | null;
  theme?: "dark" | "light";
  onNavigate: (tab: NavTab, slug?: string) => void;
  onToggleTheme?: () => void;
  onOpenAiAssistant?: () => void;
  onOpenRoleMatcher?: () => void;
  onOpenSearch?: () => void;
  onOpenStudio?: () => void;
}

export function Nav({
  activeTab,
  currentTab: fallbackTab,
  theme: controlledTheme,
  onNavigate,
  onToggleTheme: controlledToggle,
  onOpenAiAssistant,
  onOpenRoleMatcher,
  onOpenSearch,
  onOpenStudio,
}: NavProps) {
  const { profile, setIsResumeOpen } = useProfile();
  const currentTab = activeTab ?? fallbackTab ?? "home";
  const [open, setOpen] = useState(false);
  const [internalLight, setInternalLight] = useState(false);
  const [isMuted, setIsMuted] = useState(() => isAudioMuted());

  useEffect(() => {
    const handleSoundChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ muted: boolean }>;
      if (customEvent.detail) {
        setIsMuted(customEvent.detail.muted);
      }
    };
    window.addEventListener("gks-sound-mute-change", handleSoundChange);
    return () => window.removeEventListener("gks-sound-mute-change", handleSoundChange);
  }, []);

  const handleToggleSound = () => {
    const nextMuted = toggleAudioMuted();
    setIsMuted(nextMuted);
    track("sound_toggle", { muted: nextMuted });
    if (!nextMuted) {
      playHeroConstellationBloomSound();
    }
  };

  const isLight = controlledTheme ? controlledTheme === "light" : internalLight;

  useEffect(() => {
    if (controlledTheme) return;
    const stored = localStorage.getItem("gks-theme");
    const prefersLight =
      stored === null && window.matchMedia("(prefers-color-scheme: light)").matches;
    const lightMode = stored === "light" || prefersLight;
    setInternalLight(lightMode);
    document.documentElement.classList.toggle("light", lightMode);
  }, [controlledTheme]);

  const toggleTheme = () => {
    if (controlledToggle) {
      controlledToggle();
      return;
    }
    const next = !internalLight;
    setInternalLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("gks-theme", next ? "light" : "dark");
    track("theme_change", { mode: next ? "light" : "dark" });
  };

  const navLinks: { tab: NavTab; label: string }[] = [
    { tab: "home", label: "Home" },
    { tab: "work", label: "Work" },
    { tab: "about", label: "About" },
    { tab: "experience", label: "Experience" },
    { tab: "contact", label: "Contact" },
  ];

  return (
    <>
      {/* 
        Fixed, Transparent, Borderless Header
        - No background fill, no bottom border, no card shadows
        - Padding matches website sections exactly: max-w-[1500px] px-6 md:px-12 lg:px-16
      */}
      <header
        id="main-header"
        aria-label="Main Navigation"
        className="fixed top-0 inset-x-0 z-50 w-full px-6 md:px-12 lg:px-16 bg-transparent backdrop-blur-md border-none shadow-none transition-colors duration-200"
      >
        <div className="relative mx-auto max-w-[1500px] py-3.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Brand Name with Avatar & Live Pulsing Radar Accent */}
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer text-left outline-none"
          >
            <div className="relative size-7 sm:size-8 shrink-0">
              {/* Circular Avatar Container */}
              <div className="size-full rounded-full overflow-hidden border border-border/70 bg-card/60 shadow-2xs">
                <img
                  src={profile.portrait}
                  alt={profile.name}
                  className="size-full object-cover object-top"
                />
              </div>

              {/* Status Badge: Prominently Positioned on Top Corner with Pulsing Radar Ping & Ambient Glow */}
              <span className="absolute -bottom-0.5 -right-0.5 z-10 flex size-2.5 sm:size-3 items-center justify-center">
                {/* Expanding radar ping pulse */}
                <span className="animate-ping absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75" />
                {/* Core bright emerald dot with crisp backdrop ring */}
                <span className="relative inline-flex size-2 sm:size-2.5 rounded-full bg-emerald-500 ring-2 ring-background shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </span>
            </div>

            {/* Name */}
            <span
              className={`font-display text-base sm:text-lg font-bold tracking-tight transition-colors group-hover:text-accent ${
                isLight ? "text-[#18181b]" : "text-[#fafafa]"
              }`}
            >
              {profile.name}
            </span>
          </button>

          {/* 
            Center: Navigation Links
            - Absolute centered relative to the header container for exact geometric centering
            - Uses JetBrains Mono font (`font-mono` / `label-mono`) matching "Available for PM and Product Roles"
            - Clean uppercase styling with tracking
          */}
          <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((l) => {
              const isActive = currentTab === l.tab;
              return (
                <button
                  key={l.tab}
                  type="button"
                  onClick={() => onNavigate(l.tab)}
                  className={`relative font-mono text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer py-1 ${
                    isActive
                      ? "text-accent font-bold"
                      : isLight
                      ? "text-[#52525b] hover:text-[#18181b]"
                      : "text-[#a1a1aa] hover:text-[#fafafa]"
                  }`}
                >
                  <span>{l.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 inset-x-0 h-[2px] bg-accent rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Action Controls */}
          <div className="flex items-center gap-2">
            {/* Hiring Match (Job Matcher) */}
            {onOpenRoleMatcher && (
              <button
                type="button"
                onClick={onOpenRoleMatcher}
                title="Match Candidate Fit Against Job Description"
                className="hidden lg:inline-flex h-8.5 items-center gap-1.5 rounded-full px-3.5 font-mono text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer bg-card/80 text-foreground hover:bg-card hover:text-accent border-0"
              >
                <Briefcase className="size-3.5 text-accent" />
                <span>HIRING MATCH</span>
              </button>
            )}

            {/* Ask AI PM (Search / AI Assistant) */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                title="Search and ask AI about my experience and case studies"
                className="h-8.5 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 sm:px-3.5 font-mono text-xs uppercase tracking-wider font-semibold text-accent hover:bg-accent/20 transition-all cursor-pointer border-0 whitespace-nowrap shrink-0"
              >
                <Sparkles className="size-3.5 text-accent animate-pulse shrink-0" />
                <span className="whitespace-nowrap">
                  <span className="hidden min-[400px]:inline">ASK AI PM</span>
                  <span className="min-[400px]:hidden">AI PM</span>
                </span>
              </button>
            )}

            {/* Ambient Sound Toggle Button */}
            <button
              type="button"
              onClick={handleToggleSound}
              aria-label={isMuted ? "Unmute Ambient Experience Audio" : "Mute Ambient Experience Audio"}
              title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
              className="h-8.5 w-8.5 grid place-items-center rounded-full transition-all cursor-pointer bg-card/80 text-foreground hover:bg-card hover:text-accent border-0"
            >
              {isMuted ? (
                <VolumeX className="size-3.5 text-muted-foreground" />
              ) : (
                <Volume2 className="size-3.5 text-accent animate-pulse" />
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
              className="h-8.5 w-8.5 grid place-items-center rounded-full transition-all cursor-pointer bg-card/80 text-foreground hover:bg-card hover:text-accent border-0"
            >
              {isLight ? <Moon className="size-3.5 text-accent" /> : <Sun className="size-3.5 text-accent" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Toggle navigation menu"
              className="h-8.5 w-8.5 grid place-items-center rounded-full bg-accent/10 text-accent md:hidden cursor-pointer hover:bg-accent/20 transition-all border-0"
            >
              {open ? <X className="size-3.5" /> : <Menu className="size-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Clean Mobile Drawer */}
      {open && (
        <div
          id="mobile-nav-drawer"
          className={`fixed inset-0 z-[52] overflow-y-auto backdrop-blur-2xl px-6 pt-20 pb-12 md:hidden animate-fade-in ${
            isLight ? "bg-[#fcfaf7]/98 text-[#18181b]" : "bg-[#09090b]/98 text-[#fafafa]"
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-accent" />
              </span>
              <span className="font-display text-base font-bold">{profile.name}</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full border border-border text-muted-foreground hover:text-accent"
            >
              <X className="size-4" />
            </button>
          </div>

          <nav aria-label="Mobile Navigation" className="mt-6 flex flex-col gap-2">
            {navLinks.map((l) => (
              <button
                key={l.tab}
                type="button"
                onClick={() => {
                  onNavigate(l.tab);
                  setOpen(false);
                }}
                className={`py-3 text-left font-mono font-bold text-base uppercase tracking-widest border-b border-border/30 cursor-pointer ${
                  currentTab === l.tab ? "text-accent font-bold" : ""
                }`}
              >
                {l.label}
              </button>
            ))}

            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  track("open_resume_modal", { from: "mobile_nav_drawer" });
                  setIsResumeOpen(true);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-full border border-border bg-card p-3 font-mono text-xs uppercase tracking-wider font-semibold text-foreground cursor-pointer hover:border-accent hover:text-accent"
              >
                <FileText className="size-4 text-accent" />
                <span>OFFICIAL RESUME (PDF)</span>
              </button>

              {onOpenSearch && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenSearch();
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-full border-0 bg-accent/10 p-3 font-mono text-xs uppercase tracking-wider font-semibold text-accent cursor-pointer"
                >
                  <Sparkles className="size-4 text-accent" />
                  <span>ASK AI PM</span>
                </button>
              )}

              {onOpenRoleMatcher && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenRoleMatcher();
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-full border-0 bg-card p-3 font-mono text-xs uppercase tracking-wider font-semibold text-foreground cursor-pointer hover:text-accent"
                >
                  <Briefcase className="size-4 text-accent" />
                  <span>HIRING MATCH</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  handleToggleSound();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-full border border-border/70 bg-card p-3 font-mono text-xs uppercase tracking-wider font-semibold text-foreground cursor-pointer hover:text-accent"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="size-4 text-muted-foreground" />
                    <span>ENABLE SOUND EFFECTS</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="size-4 text-accent" />
                    <span>MUTE SOUND EFFECTS</span>
                  </>
                )}
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
