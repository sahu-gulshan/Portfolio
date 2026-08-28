import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Sparkles,
  Command,
  X,
  ArrowRight,
  Loader2,
  FolderGit2,
  Compass,
  FileText,
  Zap,
} from "lucide-react";
import { projects } from "@/data/projects";
import { track } from "@/lib/analytics";

import { useProfile } from "@/context/ProfileContext";

interface AiCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCase: (slug: string) => void;
}

const QUICK_SUGGESTIONS = [
  "Show projects with AI or LLMs",
  "Where did Gulshan optimize multi-million dollar ROI?",
  "Find mobile 0 to 1 case studies",
  "Projects with strict data security or synthetic testing",
];

export function AiCommandPalette({ isOpen, onClose, onNavigateToCase }: AiCommandPaletteProps) {
  const { setIsResumeOpen } = useProfile();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearch = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setQuery(q);
    setIsLoading(true);
    setSearchResult(null);

    try {
      const res = await fetch("/api/ai/semantic-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setSearchResult({
        answer: `Matching case studies and core frameworks found for "${q}".`,
        directMatches: projects.map((p) => ({
          slug: p.slug,
          title: p.title,
          category: p.category,
          snippet: p.summary,
          metric: p.metrics[0]?.value,
        })),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/75 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-2xl rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/70 bg-secondary/30">
          <Search className="size-4.5 text-accent shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length > 2) {
                // optional auto debounce or user can press enter
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(query);
              }
            }}
            placeholder="Search anything (e.g. 'LLM assistant', 'MMM simulator', 'retention metrics')..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setSearchResult(null);
              }}
              className="text-muted-foreground hover:text-foreground p-1 rounded cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground border border-border">
            ESC
          </kbd>
        </div>

        {/* Results / Suggestion Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2.5 text-muted-foreground">
              <Loader2 className="size-5 animate-spin text-accent" />
              <span className="text-xs font-mono">Searching portfolio with Gemini AI...</span>
            </div>
          ) : searchResult ? (
            <div className="space-y-3.5 animate-fade-in">
              <div className="rounded-xl border border-accent/30 bg-accent/10 p-3.5">
                <span className="font-mono text-[0.65rem] uppercase text-accent font-bold tracking-wider block">
                  AI Semantic Synthesis
                </span>
                <p className="mt-1 text-xs text-foreground/90 leading-relaxed font-medium">
                  {searchResult.answer}
                </p>
              </div>

              <div>
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
                  Matching Case Studies & Highlights:
                </span>
                <div className="space-y-2">
                  {searchResult.directMatches?.map((match: any) => (
                    <div
                      key={match.slug || match.title}
                      onClick={() => {
                        if (match.slug) {
                          track("click_case_study", {
                            slug: match.slug,
                            title: match.title,
                            from: "ai_command_palette_result",
                          });
                        }
                        onClose();
                        if (match.slug) onNavigateToCase(match.slug);
                      }}
                      className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-secondary/20 hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <FolderGit2 className="size-3.5 text-accent shrink-0" />
                          <span className="font-display text-xs font-bold text-foreground truncate">
                            {match.title}
                          </span>
                          {match.metric && (
                            <span className="font-mono text-[0.65rem] px-1.5 py-0.2 rounded bg-accent/15 text-accent font-semibold">
                              {match.metric}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[0.72rem] text-muted-foreground line-clamp-2">
                          {match.snippet}
                        </p>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    track("open_resume_modal", { from: "command_palette" });
                    onClose();
                    setIsResumeOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-accent/40 bg-accent/10 text-xs font-medium text-foreground hover:bg-accent/20 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-accent" />
                    <span className="font-semibold text-accent">Open Official Resume / CV (PDF & Interactive)</span>
                  </div>
                  <ArrowRight className="size-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div>
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground font-semibold block mb-2 flex items-center gap-1.5">
                  <Sparkles className="size-3 text-accent" /> Suggested Queries
                </span>
                <div className="space-y-1.5">
                  {QUICK_SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(s)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-secondary/15 text-xs text-muted-foreground hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all text-left cursor-pointer"
                    >
                      <span>{s}</span>
                      <ArrowRight className="size-3 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
                  All Case Studies
                </span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {projects.map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => {
                        track("click_case_study", {
                          slug: p.slug,
                          title: p.title,
                          from: "ai_command_palette_list",
                        });
                        onClose();
                        onNavigateToCase(p.slug);
                      }}
                      className="p-2.5 rounded-lg border border-border/40 bg-secondary/20 hover:border-accent/50 text-left transition-all cursor-pointer group"
                    >
                      <span className="font-display text-xs font-bold text-foreground block group-hover:text-accent transition-colors">
                        {p.title}
                      </span>
                      <span className="font-mono text-[0.65rem] text-muted-foreground truncate block mt-0.5">
                        {p.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
