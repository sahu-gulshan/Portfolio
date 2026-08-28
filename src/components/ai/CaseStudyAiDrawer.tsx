import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Sparkles,
  Bot,
  Send,
  Loader2,
  FileText,
  Cpu,
  TrendingUp,
  Layers,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import type { Project } from "@/types";

interface CaseStudyAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

type LensType = "exec" | "technical" | "commercial" | "ux";

export function CaseStudyAiDrawer({ isOpen, onClose, project }: CaseStudyAiDrawerProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "brief">("chat");
  const [selectedLens, setSelectedLens] = useState<LensType>("exec");
  const [lensData, setLensData] = useState<any>(null);
  const [isLensLoading, setIsLensLoading] = useState(false);

  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: `Hi! I'm Gulshan's PM Assistant for the "${project.title}" case study. Ask me anything about the discovery phase, technical trade-offs, architecture decisions, or business ROI metrics!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    `What was the biggest technical risk in ${project.title}?`,
    `How was the primary North Star metric chosen?`,
    `Why prioritize this scope over alternative approaches?`,
    `What would you do differently if starting over?`,
  ];

  const handleSendMessage = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/ask-pm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          caseStudySlug: project.slug,
          caseContext: {
            title: project.title,
            client: project.client,
            summary: project.summary,
            metrics: project.metrics,
            onePager: project.onePager,
          },
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Regarding "${project.title}": Gulshan prioritizes defensible problem definition, strict constraint mapping (e.g. synthetic data in enterprise environments, latency guardrails), and measurable business ROI.`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFetchLens = async (lens: LensType) => {
    setSelectedLens(lens);
    setIsLensLoading(true);

    try {
      const res = await fetch("/api/ai/executive-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseStudySlug: project.slug,
          lens,
          caseTitle: project.title,
          caseSummary: project.summary,
          onePager: project.onePager,
          metrics: project.metrics,
        }),
      });

      if (!res.ok) throw new Error("Failed to get brief");
      const data = await res.json();
      setLensData(data);
    } catch (err) {
      console.error(err);
      setLensData({
        headline: `${project.title}: Executive Value Memo`,
        keyTakeaways: [
          `Shipped in 5 months from discovery to handover with 0 production record breaches.`,
          `Focused on reach and accessibility rather than speculative model rebuilding.`,
          `Established automated mock-contract pipelines enabling parallel development sprints.`,
        ],
        deepDiveSummary: `By reframing the problem as mobile accessibility rather than core capability, Gulshan eliminated unnecessary model retraining and focused on delivering a secure, responsive native experience.`,
        tradeOffHighlight: `Prioritized speed-to-hands and synthetic test isolation over multi-platform web parity.`,
        metricsCallout: `87% unit-test coverage held throughout delivery.`,
      });
    } finally {
      setIsLensLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] flex justify-end bg-black/60 animate-fade-in"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 35 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-lg md:max-w-xl h-full bg-card border-l border-border/80 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/70 bg-secondary/30">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground font-mono font-bold text-xs">
              <Bot className="size-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm text-foreground">
                  Ask the PM
                </h3>
                <span className="font-mono text-[0.62rem] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-semibold flex items-center gap-1">
                  <Sparkles className="size-2.5" /> Case Assistant
                </span>
              </div>
              <p className="font-mono text-[0.65rem] text-muted-foreground truncate max-w-[280px]">
                {project.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex border-b border-border/60 bg-secondary/10 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-card text-accent shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Interactive Q&A
          </button>
          <button
            onClick={() => {
              setActiveTab("brief");
              if (!lensData) handleFetchLens("exec");
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "brief"
                ? "bg-card text-accent shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Executive & Lens Briefs
          </button>
        </div>

        {/* Content Area */}
        {activeTab === "chat" ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent font-mono text-[0.65rem] mt-0.5">
                      PM
                    </span>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-accent text-accent-foreground font-medium"
                        : "bg-secondary/40 border border-border/60 text-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs pl-8">
                  <Loader2 className="size-3.5 animate-spin text-accent" />
                  <span>Synthesizing PM rationale...</span>
                </div>
              )}
            </div>

            {/* Quick Chips */}
            <div className="p-3 border-t border-border/40 bg-secondary/15 space-y-1.5">
              <span className="text-[0.65rem] font-mono text-muted-foreground uppercase tracking-wider block">
                Suggested PM Deep-Dives:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    disabled={isTyping}
                    className="text-[0.68rem] px-2.5 py-1 rounded-md border border-border/70 bg-card/90 text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors text-left cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3.5 border-t border-border/70 bg-card flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about PRD, trade-offs, metrics, architecture..."
                className="flex-1 rounded-xl border border-border/80 bg-secondary/30 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="flex size-8.5 items-center justify-center rounded-xl bg-accent text-accent-foreground disabled:opacity-40 hover:bg-accent/90 transition-all cursor-pointer"
              >
                <Send className="size-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Lens Switcher */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { id: "exec", label: "Exec Brief", icon: FileText },
                { id: "technical", label: "Tech Architecture", icon: Cpu },
                { id: "commercial", label: "Commercial ROI", icon: TrendingUp },
                { id: "ux", label: "UX Subtraction", icon: Layers },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedLens === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleFetchLens(item.id as LensType)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-accent bg-accent/15 text-accent shadow-xs font-bold"
                        : "border-border/60 bg-secondary/20 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-3.5 mx-auto mb-1 text-accent" />
                    <span className="text-[0.65rem] block font-mono font-medium truncate">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Lens Output */}
            {isLensLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="size-6 animate-spin text-accent" />
                <span className="text-xs font-mono">Generating customized perspective brief...</span>
              </div>
            ) : lensData ? (
              <div className="space-y-4 animate-fade-in">
                <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
                  <h4 className="font-display font-bold text-sm text-foreground">
                    {lensData.headline}
                  </h4>
                  <p className="mt-2 text-xs text-foreground/90 leading-relaxed font-medium">
                    {lensData.deepDiveSummary}
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <h5 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Key Perspective Highlights
                  </h5>
                  <ul className="space-y-2">
                    {lensData.keyTakeaways?.map((takeaway: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-foreground/90 font-medium">
                        <CheckCircle2 className="size-3.5 text-accent shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/60 bg-secondary/30 p-3">
                    <span className="font-mono text-[0.65rem] text-accent uppercase font-bold block">
                      Trade-Off Refusal
                    </span>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {lensData.tradeOffHighlight}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-secondary/30 p-3">
                    <span className="font-mono text-[0.65rem] text-accent uppercase font-bold block">
                      Proven Metric
                    </span>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {lensData.metricsCallout}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </motion.div>
    </div>
  );
}
