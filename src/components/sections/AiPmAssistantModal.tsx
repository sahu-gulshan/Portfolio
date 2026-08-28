import { useState, useEffect } from "react";
import { X, Sparkles, Send, Bot, ArrowRight, CheckCircle2 } from "lucide-react";
import { projects } from "@/data/projects";
import { track } from "@/lib/analytics";

interface AiPmAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCase?: (slug: string) => void;
}

const PRESET_QUESTIONS = [
  {
    q: "What tools and technologies do you use as a Product Manager?",
    a: "My toolkit covers the full product lifecycle:\n• Strategy & Agile: JIRA, Confluence, Azure DevOps Board, Asana, Aha!\n• AI & GenAI: Gemini, Claude, ChatGPT, Google AI Studio, Antigravity, Midjourney\n• Analytics & Data: Power BI, Tableau, SQL, Google Analytics\n• UX & Design: Figma, Adobe XD, Lovable\n• Methodology: RICE/Kano prioritisation, A/B testing, Heuristic audits, Spec-first API contracts.",
  },
  {
    q: "Tell me about your experience at Mu-Sigma and your squad size.",
    a: "At Mu-Sigma (Nov 2022 – Present), I serve as Product Manager leading a cross-functional squad of 7 (2 designers, 3 data scientists, 2 developers). I've owned 5+ enterprise tools for Fortune 500 clients, boosting delivery velocity by 20% through standardized design systems and reducing usability friction by 30%.",
  },
  {
    q: "How do you evaluate if GenAI should be added to a feature?",
    a: "My rule of thumb: 'AI earns its place when it removes user friction — not when it adds novelty.' For example, in the iOS AI Chatbot case, we built a thin native client against existing verified policy backends with synthetic tests rather than rewriting model architectures. We deploy AI only where ranking candidate moments under complex constraints is required.",
  },
  {
    q: "What is your educational background and certifications?",
    a: "Education:\n• PGDM in Marketing from Universal Business School, Mumbai (2018–2020)\n• B.Sc. Hospitality & Hotel Administration from IHM Goa (2013–2016)\n\nCertifications:\n• IBM AI Product Manager Specialisation\n• Generative AI for Product Managers Specialisation\n• Google UX Design & CalArts UI/UX Specialisation\n• Figma UI/UX Design Essentials & Google Analytics Basics.",
  },
  {
    q: "How can I contact Gulshan for a PM role?",
    a: "You can reach Gulshan directly via email at gulshan.sahu@hotmail.com or phone at +91 90705 99155. Connect with him on LinkedIn at linkedin.com/in/gulshan-sahu/. He is based in Bengaluru and open to Senior Product Manager roles.",
  },
];

function FormattedText({ text, isUser }: { text: string; isUser?: boolean }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) return <div key={lineIdx} className="h-1" />;

        // Parse **bold** text patterns
        const parts = line.split(/(\*\*[^*]+\*\*)/g);

        return (
          <p key={lineIdx} className="leading-relaxed">
            {parts.map((part, partIdx) => {
              if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
                const content = part.slice(2, -2);
                return (
                  <strong
                    key={partIdx}
                    className={isUser ? "font-bold underline decoration-accent-foreground/50" : "font-semibold text-foreground"}
                  >
                    {content}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export function AiPmAssistantModal({ isOpen, onClose, onNavigateToCase }: AiPmAssistantModalProps) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "Hi! I'm Gulshan's AI Portfolio Assistant. Ask me anything about his skills, tech stack, Mu-Sigma experience, case studies, education, or contact details!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAsk = async (questionText: string) => {
    const q = questionText.trim();
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
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    } catch (err) {
      console.error(err);
      const qLower = q.toLowerCase();
      const matched = PRESET_QUESTIONS.find(
        (item) => item.q.toLowerCase().includes(qLower) || qLower.includes(item.q.toLowerCase())
      );

      let reply = "";
      if (matched) {
        reply = matched.a;
      } else if (qLower.includes("contact") || qLower.includes("email") || qLower.includes("phone") || qLower.includes("linkedin") || qLower.includes("reach")) {
        reply = "You can contact Gulshan directly at gulshan.sahu@hotmail.com or +91 90705 99155. His LinkedIn profile is linkedin.com/in/gulshan-sahu/. He is based in Bengaluru and open to Senior Product Manager roles.";
      } else if (qLower.includes("tool") || qLower.includes("tech") || qLower.includes("jira") || qLower.includes("figma") || qLower.includes("tableau") || qLower.includes("power bi") || qLower.includes("sql")) {
        reply = "Gulshan's tools and tech stack include JIRA, Confluence, Azure DevOps, Asana, Figma, Adobe XD, Lovable, Gemini, Claude, ChatGPT, Google AI Studio, Power BI, Tableau, SQL, and Google Analytics.";
      } else if (qLower.includes("experience") || qLower.includes("mu-sigma") || qLower.includes("musigma") || qLower.includes("work") || qLower.includes("job")) {
        reply = "Gulshan has 5+ years of experience. As Product Manager at Mu-Sigma (Nov 2022 – Present), he led 0-to-1 enterprise tools for Fortune 500 clients, managed a squad of 7, increased velocity by 20%, and cut usability friction by 30%.";
      } else if (qLower.includes("education") || qLower.includes("certif") || qLower.includes("ubs") || qLower.includes("ihm")) {
        reply = "Gulshan holds a PGDM in Marketing from Universal Business School, Mumbai (2018–2020) and a B.Sc. in Hospitality & Hotel Administration from IHM Goa (2013–2016). Certifications include IBM AI Product Manager, GenAI for PMs, Google UX Design, and CalArts UI/UX.";
      } else if (qLower.includes("chatbot") || qLower.includes("ios") || qLower.includes("aerospace")) {
        reply = "In the iOS AI Chatbot project for a Fortune-50 aerospace client, Gulshan owned the 0→1 native PRD and delivery over 5 months with 87% test coverage, zero production data leaks using synthetic mock pipelines, and enabled desk-less workforce policy resolution.";
      } else if (qLower.includes("mmm") || qLower.includes("marketing") || qLower.includes("retail") || qLower.includes("mix model")) {
        reply = "In the Marketing Mix Model product for a Top-3 LATAM retailer, Gulshan transformed an observational Bayesian model into a live self-serve scenario simulator, driving 21.0 → 22.3 RoAS and +$245M incremental sales at $198.3M budget.";
      } else if (qLower.includes("membership") || qLower.includes("loyalty") || qLower.includes("warehouse")) {
        reply = "In the Membership 360 platform, Gulshan solved declining digital engagement by designing the Member Graph and next-best-action trigger pipeline to protect ~$16M annual fee revenue per +1pt renewal.";
      } else {
        reply = `Gulshan's product leadership is rooted in 4 core pillars: AI capability that removes real user friction, data that informs defensible decisions, cognitive UX subtraction, and measurable business outcomes. Feel free to email him directly at gulshan.sahu@hotmail.com or connect on LinkedIn.`;
      }

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/75 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-5xl lg:max-w-6xl xl:max-w-[1180px] h-[82vh] lg:h-[86vh] rounded-3xl border border-border bg-card shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/90">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-accent/15 border border-accent/40 text-accent shadow-sm">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h3 className="font-display font-bold text-base text-foreground">AI Portfolio Assistant</h3>
              <p className="text-xs text-muted-foreground">Ask anything about Gulshan's case studies, frameworks & experience</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="grid size-8 place-items-center rounded-full border border-border text-muted-foreground hover:border-accent hover:text-accent cursor-pointer transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Preset prompts */}
        <div className="px-6 py-3 bg-secondary/30 border-b border-border flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[0.68rem] label-mono text-accent shrink-0">Try prompt:</span>
          {PRESET_QUESTIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAsk(item.q)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-card/80 text-muted-foreground hover:border-accent hover:text-foreground shrink-0 cursor-pointer transition-all"
            >
              {item.q.slice(0, 38)}…
            </button>
          ))}
        </div>

        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent/15 border border-accent/40 text-accent">
                  <Bot className="size-4" />
                </span>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-accent text-accent-foreground font-medium rounded-tr-none"
                    : "bg-background border border-border text-foreground rounded-tl-none"
                }`}
              >
                <FormattedText text={m.text} isUser={m.role === "user"} />
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-muted-foreground pl-11">
              <span className="size-2 rounded-full bg-accent animate-ping" />
              <span>Analyzing product frameworks…</span>
            </div>
          )}
        </div>

        {/* Case Study Quick Jumps */}
        {onNavigateToCase && (
          <div className="px-6 py-2.5 bg-card border-t border-border flex items-center justify-between text-xs">
            <span className="label-mono text-[0.65rem]">Deep Dive:</span>
            <div className="flex gap-2">
              {projects.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => {
                    track("click_case_study", {
                      slug: p.slug,
                      title: p.title,
                      from: "ai_pm_assistant_deep_dive",
                    });
                    onNavigateToCase(p.slug);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-accent hover:underline cursor-pointer"
                >
                  <span>{p.title}</span>
                  <ArrowRight className="size-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(input);
          }}
          className="p-4 border-t border-border bg-card/90 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about skills, tools, case studies, Mu-Sigma, education, or contact info..."
            className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-50 cursor-pointer hover:bg-accent/90"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
