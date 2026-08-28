import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Mail,
  Linkedin,
  FileDown,
  Check,
  Copy,
  CheckCircle2,
  Briefcase,
  Lightbulb,
  Zap,
  MessageSquare,
  Sparkles,
  Loader2,
  RotateCcw
} from "lucide-react";
import { site } from "@/data/site";
import { StaggerRevealSection, StaggerItem } from "@/components/StaggerRevealSection";
import { track } from "@/lib/analytics";
import type { NavTab } from "../Nav";
import { useProfile } from "@/context/ProfileContext";
import { LinkedInCard } from "@/components/LinkedInCard";

interface ContactCTAProps {
  onNavigate?: (tab: NavTab) => void;
}

type Errors = { name?: string; email?: string; message?: string };

const INQUIRY_TAGS = [
  { id: "pm-roles", label: "Product Manager Roles", icon: Briefcase, defaultPrompt: "Hi Gulshan, we're looking for a Product Manager for our team to drive strategy and execution..." },
  { id: "advisory", label: "Product Advisory", icon: Lightbulb, defaultPrompt: "Hi Gulshan, I'd love your advisory input on framing our product vision and key metrics..." },
  { id: "strategy", label: "0→1 Strategy", icon: Zap, defaultPrompt: "Hi Gulshan, we have a fuzzy 0→1 product opportunity in our pipeline and need a clear roadmap..." },
  { id: "connect", label: "General Connect", icon: MessageSquare, defaultPrompt: "Hi Gulshan, I enjoyed reading your portfolio and wanted to reach out to connect..." }
];

export function ContactCTA({ onNavigate }: ContactCTAProps) {
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
    track("submit_contact_form", { from: "home_contact_section", topic: selectedTag });

    try {
      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        topic: selectedTag,
        message: trimmedMessage,
        _subject: `Portfolio Inquiry from ${trimmedName} [${selectedTag}]`,
      };

      // Primary server endpoint
      const serverRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Direct Formspree fallback if server response wasn't ok
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
      console.warn("Contact API submission:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSent(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSent(false);
    setName("");
    setEmail("");
    setMessage(INQUIRY_TAGS[0].defaultPrompt);
    setSelectedTag(INQUIRY_TAGS[0].id);
    setIsUserEdited(false);
    setErrors({});
  };

  return (
    <section
      id="section-08"
      aria-label="Start a Conversation Contact CTA"
      className="relative overflow-hidden px-6 pt-24 pb-16 md:px-12 md:pt-32 md:pb-20 lg:px-16 bg-transparent scroll-mt-16 cv-auto"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Dynamic Page Accent Glow Overlay */}
        <div
          className="absolute -right-24 -top-24 size-[550px] rounded-full blur-[90px] opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)"
          }}
        />

        {/* Perspective Grid Pattern Overlay */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)] opacity-25"
        />
      </div>

      <div className="mx-auto max-w-[1500px]">
        <StaggerRevealSection staggerDelay={0.12} as="div">
          <StaggerItem y={20}>
            <p id="section-08-heading" className="label-mono text-xs text-muted-foreground uppercase tracking-widest font-semibold">
              Start a Conversation
            </p>
          </StaggerItem>

          <StaggerItem y={32}>
            <h2 id="section-08-title" className="display-xl mt-4 max-w-[20ch] font-bold">
              Have a product problem worth solving?
              <span
                id="section-08-smiley-dock"
                className="inline-block align-middle ml-3 size-9 relative -top-1 pointer-events-none"
                aria-hidden
              />
            </h2>
          </StaggerItem>

          <StaggerItem y={40}>
            <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed text-base">
              I'm most useful early — when the problem is still fuzzy, the data is complex, and
              you need a clear roadmap with proven execution.
            </p>
          </StaggerItem>

          {/* Symmetrical 2-Column Grid with Form on Home */}
          <StaggerItem y={45}>
            <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16 items-stretch">
              
              {/* Left Column (Contact Details Stack & LinkedIn Card) */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-8 lg:space-y-0">
                <div className="space-y-6">
                  {/* EMAIL */}
                  <div>
                    <p className="label-mono text-[0.7rem] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                      EMAIL
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href={`mailto:${profile.email}`}
                        onClick={() => track("email_click", { from: "home-cta-stack" })}
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
                        track("resume_view_modal", { from: "home-cta-stack" });
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

                {/* LinkedIn Card Component */}
                <div className="pt-6 lg:pt-8 mt-auto">
                  <LinkedInCard className="w-full" />
                </div>
              </div>

              {/* Right Column (Minimalist Underline Form + Clean Topic Selectors) */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full">
                <form noValidate onSubmit={onSubmit} className="flex flex-col justify-between h-full space-y-8">
                  <div className="space-y-8">
                    {/* NAME */}
                    <div>
                      <label htmlFor="home-form-name" className="label-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-1">
                        NAME
                      </label>
                      <input
                        id="home-form-name"
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
                      <label htmlFor="home-form-email" className="label-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-1">
                        EMAIL
                      </label>
                      <input
                        id="home-form-email"
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
                      <label htmlFor="home-form-message" className="label-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">
                        MESSAGE
                      </label>
                      <textarea
                        id="home-form-message"
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
                      id="section-08-hire-me-btn"
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
                            className="inline-flex items-center gap-2"
                          >
                            <Loader2 className="size-4 animate-spin text-accent-foreground" />
                            <span>Sending...</span>
                          </motion.span>
                        ) : isSubmitted ? (
                          <motion.span
                            key="sent"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2"
                          >
                            <CheckCircle2 className="size-4 text-white" />
                            <span>Message Sent!</span>
                          </motion.span>
                        ) : (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="inline-flex items-center gap-2"
                          >
                            <span>Start a conversation</span>
                            <ArrowUpRight className="size-4" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {isSubmitted && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <RotateCcw className="size-3.5" />
                        <span>Send another message</span>
                      </button>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {isSubmitted ? (
                        <span className="text-emerald-500 font-medium flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Sent directly to Gulshan.Sahu@hotmail.com
                        </span>
                      ) : (
                        <span>Direct message to <span className="text-foreground font-medium">Gulshan.Sahu@hotmail.com</span></span>
                      )}
                    </p>
                  </div>
                </form>
              </div>

            </div>
          </StaggerItem>
        </StaggerRevealSection>
      </div>
    </section>
  );
}

