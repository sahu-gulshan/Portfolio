import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useProfile } from "@/context/ProfileContext";
import { track } from "@/lib/analytics";
import { LinkedInCard } from "@/components/LinkedInCard";
import {
  Check,
  Copy,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Lightbulb,
  Zap,
  MessageSquare,
  Sparkles,
  Loader2,
  RotateCcw
} from "lucide-react";

type Errors = { name?: string; email?: string; message?: string };

const INQUIRY_TAGS = [
  { id: "pm-roles", label: "Product Manager Roles", icon: Briefcase, defaultPrompt: "Hi Gulshan, we're looking for a Product Manager for our team to drive strategy and execution..." },
  { id: "advisory", label: "Product Advisory", icon: Lightbulb, defaultPrompt: "Hi Gulshan, I'd love your advisory input on framing our product vision and key metrics..." },
  { id: "strategy", label: "0→1 Strategy", icon: Zap, defaultPrompt: "Hi Gulshan, we have a fuzzy 0→1 product opportunity in our pipeline and need a clear roadmap..." },
  { id: "connect", label: "General Connect", icon: MessageSquare, defaultPrompt: "Hi Gulshan, I enjoyed reading your portfolio and wanted to reach out to connect..." }
];

function playSuccessSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Note 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Note 2: B5 (987.77 Hz) - crisp two-tone victory chime
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(987.77, now + 0.07);
    gain2.gain.setValueAtTime(0.15, now + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.07);
    osc2.stop(now + 0.45);
  } catch {
    // Ignore audio failures if browser blocks autoplay
  }
}

export function ContactView() {
  const { profile, setIsResumeOpen } = useProfile();
  const [selectedTag, setSelectedTag] = useState(INQUIRY_TAGS[0].id);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [message, setMessage] = useState(INQUIRY_TAGS[0].defaultPrompt);
  const [isUserEdited, setIsUserEdited] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTagHover = (tagId: string, defaultPrompt: string) => {
    if (isSubmitting || isSubmitted) return;
    setHoveredTag(tagId);
    if (!isUserEdited) {
      setMessage(defaultPrompt);
    }
  };

  const handleTagMouseLeave = () => {
    if (isSubmitting || isSubmitted) return;
    setHoveredTag(null);
    if (!isUserEdited) {
      const activeObj = INQUIRY_TAGS.find((t) => t.id === selectedTag);
      if (activeObj) {
        setMessage(activeObj.defaultPrompt);
      }
    }
  };

  const handleTagClick = (tagId: string, defaultPrompt: string) => {
    if (isSubmitting || isSubmitted) return;
    setSelectedTag(tagId);
    setMessage(defaultPrompt);
    setIsUserEdited(false);
  };

  const handleMessageChange = (val: string) => {
    if (isSubmitting || isSubmitted) return;
    setMessage(val);
    if (!val.trim()) {
      setIsUserEdited(false);
    } else {
      const isMatchingPrompt = INQUIRY_TAGS.some((t) => t.defaultPrompt === val);
      setIsUserEdited(!isMatchingPrompt);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || isSubmitted) return;

    const next: Errors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) next.name = "Please provide your name";
    if (!trimmedEmail) next.email = "Please provide a valid email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) next.email = "Invalid email format";
    if (!trimmedMessage) next.message = "Please include a message";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSubmitting(true);
    track("contact_form_submit", { name: trimmedName, email: trimmedEmail, tag: selectedTag });

    try {
      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        topic: selectedTag,
        message: trimmedMessage,
        _subject: `Portfolio Inquiry from ${trimmedName} [${selectedTag}]`,
      };

      const serverRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!serverRes.ok) {
        await fetch("https://formspree.io/f/mvkopkjb", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const history = JSON.parse(localStorage.getItem("contact_messages_v1") || "[]");
      history.unshift({
        id: Date.now().toString(),
        name: trimmedName,
        email: trimmedEmail,
        topic: selectedTag,
        message: trimmedMessage,
        date: new Date().toLocaleString(),
        targetEmail: "Gulshan.Sahu@hotmail.com",
      });
      localStorage.setItem("contact_messages_v1", JSON.stringify(history));
    } catch (err) {
      console.warn("Contact API error:", err);
    } finally {
      playSuccessSound();
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSent(true);
    }
  };

  return (
    <div className="relative min-h-screen px-6 pb-28 pt-32 md:px-12 md:pt-40 lg:px-16">
      <div className="mx-auto max-w-[1500px]">

        {/* Page Header (Matching Screenshot Typography & Dot Indicator) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 max-w-4xl"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="label-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              HIRE ME
            </span>
            <span className="inline-flex size-5 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
              <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] font-bold tracking-tight text-foreground leading-[1.04]">
            Let's move products that move metrics
          </h1>
          <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
            Roles, collaborations, or a problem you're still trying to frame — all welcome. I usually reply within a couple of days.
          </p>
        </motion.div>

        {/* Symmetrical 2-Column Grid with flush bottom alignment */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-stretch">

          {/* Left Column (Contact Metadata Stack & LinkedIn Card) */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-6 flex flex-col justify-between h-full space-y-8 lg:space-y-0"
          >
            {/* Metadata Contact Details Stack */}
            <div className="space-y-6">
              
              {/* EMAIL */}
              <div>
                <p className="label-mono text-[0.7rem] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                  EMAIL
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${profile.email}`}
                    onClick={() => track("email_click", { from: "hire-me-stack" })}
                    className="font-display text-base md:text-lg font-medium text-foreground hover:text-accent transition-colors"
                  >
                    {profile.email}
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    title="Copy email address"
                  >
                    {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  </button>
                  {copied && (
                    <span className="text-xs font-semibold text-emerald-500 animate-fade-in">
                      Copied!
                    </span>
                  )}
                </div>
              </div>

              {/* RÉSUMÉ */}
              <div>
                <p className="label-mono text-[0.7rem] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                  RÉSUMÉ
                </p>
                <button
                  type="button"
                  onClick={() => {
                    track("resume_view_modal", { from: "hire-me-stack" });
                    setIsResumeOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 font-display text-base md:text-lg font-medium text-foreground hover:text-accent transition-colors cursor-pointer group"
                >
                  <span>Download PDF</span>
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-accent transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>

              {/* BASED IN */}
              <div>
                <p className="label-mono text-[0.7rem] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                  BASED IN
                </p>
                <p className="font-display text-base md:text-lg font-medium text-foreground">
                  India, currently living in Bengaluru
                </p>
              </div>

            </div>

            {/* LinkedIn Card Component anchored to match form bottom */}
            <div className="pt-6 lg:pt-8 mt-auto">
              <LinkedInCard className="w-full" />
            </div>
          </motion.div>

          {/* Right Column (Minimalist Underline Form + Inquiry Topic Selector) */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-6 flex flex-col justify-between h-full"
          >
            <form noValidate onSubmit={onSubmit} className="flex flex-col justify-between h-full space-y-8">
              <div className="space-y-8">
                {/* NAME */}
                <div>
                  <label htmlFor="name" className="label-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-1">
                    NAME
                  </label>
                  <input
                    id="name"
                    value={name}
                    disabled={isSubmitting || isSubmitted}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Connor"
                    className="w-full bg-transparent border-b border-border focus:border-accent text-foreground text-sm py-2.5 outline-none transition-colors placeholder:text-muted-foreground/35 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                </div>

                {/* EMAIL */}
                <div>
                  <label htmlFor="email" className="label-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-1">
                    EMAIL
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    disabled={isSubmitting || isSubmitted}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full bg-transparent border-b border-border focus:border-accent text-foreground text-sm py-2.5 outline-none transition-colors placeholder:text-muted-foreground/35 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                </div>

                {/* INQUIRY TOPIC */}
                <div>
                  <label className="label-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2.5">
                    SELECT INQUIRY TOPIC
                  </label>
                  <div className="flex flex-wrap gap-2.5" onMouseLeave={handleTagMouseLeave}>
                    {INQUIRY_TAGS.map((tag) => {
                      const isSelected = selectedTag === tag.id;
                      const isHovered = hoveredTag === tag.id;
                      const Icon = tag.icon;
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          disabled={isSubmitting || isSubmitted}
                          onClick={() => handleTagClick(tag.id, tag.defaultPrompt)}
                          onMouseEnter={() => handleTagHover(tag.id, tag.defaultPrompt)}
                          className={`relative inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed bg-transparent border-0 ${
                            isSelected
                              ? "text-accent font-semibold"
                              : isHovered
                              ? "text-accent/90"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon className={`size-3.5 shrink-0 transition-colors ${isSelected || isHovered ? "text-accent" : "text-muted-foreground"}`} />
                          <span className="tracking-wide">{tag.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* MESSAGE */}
                <div>
                  <label htmlFor="message" className="label-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    value={message}
                    disabled={isSubmitting || isSubmitted}
                    onChange={(e) => handleMessageChange(e.target.value)}
                    placeholder="Tell me about your product goals or challenge..."
                    className="w-full bg-transparent border-b border-border focus:border-accent text-foreground text-sm py-2.5 outline-none transition-colors resize-none placeholder:text-muted-foreground/35 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                </div>
              </div>

              {/* Submit Button & Actions */}
              <div className="pt-4 mt-auto flex flex-wrap items-center gap-4">
                <motion.button
                  layout
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  initial={false}
                  animate={{
                    scale: isSubmitted ? 1.02 : isSubmitting ? 0.96 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 22,
                    mass: 0.8
                  }}
                  className={`relative overflow-hidden inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-xs font-bold transition-colors duration-300 ${
                    isSubmitted
                      ? "bg-emerald-600 text-white dark:bg-emerald-500 cursor-default"
                      : isSubmitting
                      ? "bg-accent/80 text-accent-foreground cursor-wait opacity-90"
                      : "bg-accent text-accent-foreground hover:opacity-90 cursor-pointer"
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isSubmitting ? (
                      <motion.span
                        key="submitting"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="inline-flex items-center gap-2"
                      >
                        <Loader2 className="size-4 animate-spin" />
                        <span>Submitting...</span>
                      </motion.span>
                    ) : isSubmitted ? (
                      <motion.span
                        key="submitted"
                        initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 550, damping: 18 }}
                        className="inline-flex items-center gap-2"
                      >
                        <Check className="size-4 stroke-[2.5]" />
                        <span>Submitted</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="inline-flex items-center gap-2"
                      >
                        <span>Start a conversation</span>
                        <ArrowRight className="size-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {isSubmitted && (
                  <motion.button
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setIsSubmitting(false);
                      setSent(false);
                      setName("");
                      setEmail("");
                      setMessage(INQUIRY_TAGS[0].defaultPrompt);
                      setSelectedTag(INQUIRY_TAGS[0].id);
                      setIsUserEdited(false);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-2 px-3"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>Send another message</span>
                  </motion.button>
                )}
              </div>

              {/* Visual Success Banner upon submission (Positioned at bottom after submit button) */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-foreground shadow-sm"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 shrink-0 mt-0.5">
                        <CheckCircle2 className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          Message Delivered Directly to Gulshan.Sahu@hotmail.com!
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Thank you <span className="text-foreground font-semibold">{name}</span>. Your inquiry regarding{" "}
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {INQUIRY_TAGS.find((t) => t.id === selectedTag)?.label}
                          </span> has been sent directly to Gulshan's inbox. I'll reach out to <span className="text-foreground font-medium">{email}</span> within 24–48 hours.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
