import { useState, useEffect, type MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Sparkles, X, Check } from "lucide-react";
import {
  isAudioMuted,
  setAudioMuted,
  playWelcomeSoundChime,
} from "@/lib/quantum-audio";
import { track } from "@/lib/analytics";

export function WelcomeSoundCapsule() {
  const [isVisible, setIsVisible] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Slide in smoothly at 1.5s
    const entryTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    // Auto-dismiss/deactivate the capsule after 6 seconds of being visible (at 7.5s total or 6s visible)
    const autoDismissTimer = setTimeout(() => {
      setIsVisible(false);
      setIsDismissed(true);
    }, 7500);

    return () => {
      clearTimeout(entryTimer);
      clearTimeout(autoDismissTimer);
    };
  }, [isDismissed]);

  const handleEnableAudio = () => {
    setAudioMuted(false);
    playWelcomeSoundChime();
    setIsActivated(true);
    track("welcome_sound_capsule_enabled", { trigger: "capsule" });

    // Smooth auto-dismiss after celebratory feedback
    setTimeout(() => {
      setIsVisible(false);
      setIsDismissed(true);
    }, 2200);
  };

  const handleDismiss = (e: MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setIsDismissed(true);
    track("welcome_sound_capsule_dismissed", { trigger: "close_btn" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="region"
          aria-label="Audio experience invitation"
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="fixed bottom-6 left-6 z-40 select-none max-w-[calc(100vw-3rem)] sm:max-w-md"
        >
          <div
            onClick={!isActivated ? handleEnableAudio : undefined}
            className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-xl transition-all duration-300 ${
              isActivated
                ? "bg-accent/15 border-accent/40 text-foreground shadow-accent/10"
                : "bg-background/90 hover:bg-background/95 border-border/80 hover:border-accent/50 text-foreground shadow-black/15 cursor-pointer hover:shadow-2xl hover:shadow-accent/10"
            }`}
          >
            {/* Ambient Background Accent Glow */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-accent/20 via-blue-500/10 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />

            {/* Left Icon with Animated Sound Waves */}
            <div className="relative flex items-center justify-center size-10 rounded-xl bg-accent/10 border border-accent/25 text-accent shrink-0 overflow-hidden">
              {isActivated ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <Check className="size-5 text-accent stroke-[2.5]" />
                </motion.div>
              ) : (
                <div className="flex items-center gap-[2.5px] h-4">
                  <motion.span
                    animate={{ height: ["4px", "14px", "6px", "12px", "4px"] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                    className="w-[2.5px] bg-accent rounded-full"
                  />
                  <motion.span
                    animate={{ height: ["10px", "5px", "16px", "8px", "10px"] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.1 }}
                    className="w-[2.5px] bg-accent rounded-full"
                  />
                  <motion.span
                    animate={{ height: ["6px", "16px", "8px", "4px", "6px"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                    className="w-[2.5px] bg-accent rounded-full"
                  />
                  <motion.span
                    animate={{ height: ["12px", "6px", "14px", "10px", "12px"] }}
                    transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut", delay: 0.3 }}
                    className="w-[2.5px] bg-accent rounded-full"
                  />
                </div>
              )}
            </div>

            {/* Content Text */}
            <div className="flex flex-col min-w-0 pr-1">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground tracking-tight">
                {isActivated ? (
                  <span className="text-accent flex items-center gap-1">
                    <Sparkles className="size-3.5" />
                    Audio Experience Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Volume2 className="size-3.5 text-accent" />
                    Interactive Audio Available
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight truncate">
                {isActivated
                  ? "Enjoy synthesized UI chords & feedback"
                  : "Tap to play welcome chime & sound effects"}
              </p>
            </div>

            {/* Action / Dismiss Button */}
            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              {!isActivated && (
                <button
                  type="button"
                  onClick={handleEnableAudio}
                  className="px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-[11px] font-semibold tracking-wide hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm"
                >
                  Enable
                </button>
              )}

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss audio prompt"
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
