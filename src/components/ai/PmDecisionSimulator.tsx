import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sliders,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import type { Project } from "@/types";

interface PmDecisionSimulatorProps {
  project: Project;
}

const PRESET_SCENARIOS: Record<string, Array<{ id: string; label: string; text: string }>> = {
  "ai-chatbot": [
    {
      id: "deadline",
      label: "Deadline Cut: 6 Weeks",
      text: "Executive leadership demands shipping the iOS MVP in 6 weeks instead of 5 months for an upcoming aerospace defense summit.",
    },
    {
      id: "airgap",
      label: "Air-Gapped / Zero Cloud",
      text: "Security compliance introduces a strict air-gapped on-premise requirement: zero external cloud endpoints or LLM API calls allowed.",
    },
    {
      id: "lowband",
      label: "Intermittent Plant WiFi",
      text: "Manufacturing plant audits show 40% of target workers experience spotty or zero WiFi connectivity during their shifts.",
    },
  ],
  "sams-club": [
    {
      id: "retention",
      label: "Renewal Churn +15%",
      text: "A sudden economic downturn increases non-renewal churn by 15% across secondary club tiers.",
    },
    {
      id: "privacy",
      label: "Strict Data Consent",
      text: "New regulatory mandates restrict third-party cross-app behavioral tracking, cutting input signals by 50%.",
    },
  ],
};

export function PmDecisionSimulator({ project }: PmDecisionSimulatorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [customScenario, setCustomScenario] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const presets = PRESET_SCENARIOS[project.slug] || [
    {
      id: "budget",
      label: "Budget Cut by 40%",
      text: "Annual engineering and infrastructure budget is cut by 40% halfway through execution.",
    },
    {
      id: "velocity",
      label: "Halve Time-to-Market",
      text: "Competitor launch forces a 50% compression of discovery and beta phases.",
    },
    {
      id: "scale",
      label: "10x Traffic Surge",
      text: "Enterprise user volume surges 10x overnight, triggering critical latency bottleneck alerts.",
    },
  ];

  const handleRunSimulation = async (scenarioText: string) => {
    if (!scenarioText.trim()) return;

    setIsSimulating(true);
    setSimulationResult(null);

    try {
      const res = await fetch("/api/ai/simulate-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseStudySlug: project.slug,
          caseTitle: project.title,
          scenario: scenarioText,
        }),
      });

      if (!res.ok) throw new Error("Failed to simulate scenario");
      const data = await res.json();
      setSimulationResult(data);
    } catch (err) {
      console.error(err);
      setSimulationResult({
        decisionTitle: `Adaptive PM Pivot for "${scenarioText.slice(0, 35)}..."`,
        strategicShift: `Immediately isolate non-essential features and protect the primary self-service adoption North Star through synthetic test coverage and ruthless scoping.`,
        revisedMVP: [
          "Preserve the high-frequency core question-and-answer flow.",
          "Postpone rich contextual personalization to Phase 2.",
          "Implement deterministic fallbacks and local client caching.",
        ],
        tradeOffsAccepted: [
          "Accepted narrower feature breadth in exchange for zero regression and 3x faster delivery.",
          "Deferred advanced admin metrics in favor of automated headless telemetry alerts.",
        ],
        riskMitigation: "Double down on spec-first mock contracts in CI/CD so client engineering never blocks on backend availability.",
        expectedKpiImpact: "Protects 90%+ of adoption North Star while reducing delivery risk and cycle time by 35%.",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-accent/30 bg-card/90 p-5 sm:p-6 shadow-sm overflow-hidden relative">
      {/* Background Accent Glow */}
      <div className="absolute -top-12 -right-12 size-48 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent/15 text-accent shadow-2xs">
            <Sliders className="size-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
                PM Decision Simulator
              </h3>
              <span className="font-mono text-[0.62rem] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-semibold flex items-center gap-1">
                <Sparkles className="size-2.5" /> AI Strategy Lab
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Tweak product constraints to see how Gulshan pivots the PRD scope, trade-offs, and risk matrix.
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Presets & Input */}
      <div className="mt-4 space-y-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
            Select a Hypothetical Constraint or Scenario:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => {
              const isSelected = selectedPreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(p.id);
                    setCustomScenario(p.text);
                    handleRunSimulation(p.text);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                    isSelected
                      ? "border-accent bg-accent/15 text-accent font-semibold shadow-2xs"
                      : "border-border/60 bg-secondary/30 text-muted-foreground hover:border-border/90 hover:text-foreground"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSelectedPreset("");
            handleRunSimulation(customScenario);
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
            placeholder="Or type a custom scenario (e.g. 'What if regulatory compliance forbade all cloud telemetry?')..."
            className="flex-1 rounded-xl border border-border/80 bg-secondary/30 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={isSimulating || !customScenario.trim()}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground disabled:opacity-50 hover:bg-accent/90 transition-all cursor-pointer shrink-0"
          >
            {isSimulating ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Zap className="size-3.5" />
                Run Simulation
              </>
            )}
          </button>
        </form>

        {/* Results Area */}
        <AnimatePresence>
          {simulationResult && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-4 rounded-xl border border-accent/40 bg-accent/5 p-4.5 space-y-4"
            >
              <div className="flex items-center justify-between gap-2 border-b border-accent/20 pb-2.5">
                <div>
                  <span className="font-mono text-[0.65rem] uppercase text-accent font-bold tracking-wider block">
                    Simulated PM Strategy Shift
                  </span>
                  <h4 className="font-display text-sm font-bold text-foreground mt-0.5">
                    {simulationResult.decisionTitle}
                  </h4>
                </div>
                <button
                  onClick={() => setSimulationResult(null)}
                  className="text-muted-foreground hover:text-foreground text-xs p-1 rounded cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              </div>

              <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                {simulationResult.strategicShift}
              </p>

              {/* Revised MVP Scope & Trade-Offs Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-card/80 p-3.5">
                  <span className="font-mono text-[0.65rem] uppercase font-bold text-accent mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3 text-accent" /> Revised MVP Scope (Retained)
                  </span>
                  <ul className="space-y-1.5">
                    {simulationResult.revisedMVP?.map((item: string, i: number) => (
                      <li key={i} className="text-xs text-foreground/90 font-medium">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-border/60 bg-card/80 p-3.5">
                  <span className="font-mono text-[0.65rem] uppercase font-bold text-amber-500 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="size-3 text-amber-500" /> Deliberate Refusals / Trade-Offs
                  </span>
                  <ul className="space-y-1.5">
                    {simulationResult.tradeOffsAccepted?.map((item: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Risk Mitigation & Expected KPI Impact */}
              <div className="grid gap-3 sm:grid-cols-2 text-xs pt-1">
                <div className="rounded-lg bg-secondary/30 p-2.5 border border-border/40">
                  <span className="font-mono text-[0.65rem] font-bold text-muted-foreground uppercase block mb-0.5">
                    Risk Mitigation Plan:
                  </span>
                  <p className="text-foreground/80">{simulationResult.riskMitigation}</p>
                </div>
                <div className="rounded-lg bg-secondary/30 p-2.5 border border-border/40">
                  <span className="font-mono text-[0.65rem] font-bold text-accent uppercase block mb-0.5">
                    Expected KPI Impact:
                  </span>
                  <p className="text-foreground/80 font-medium">{simulationResult.expectedKpiImpact}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
