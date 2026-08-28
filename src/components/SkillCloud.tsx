import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Brain,
  BarChart3,
  Layers,
  Search,
  Wrench,
  Compass,
  CheckCircle2,
  Radio,
  Orbit,
  Grid
} from "lucide-react";

export interface SkillNode {
  id: string;
  name: string;
  category: "pm" | "ai" | "data" | "ux" | "tools";
  categoryLabel: string;
  highlight?: boolean;
  impactNote: string;
  metric?: string;
  xPct: number; // 10 to 90
  yPct: number; // 10 to 90
  colorHex: string;
}

const SKILL_NODES: SkillNode[] = [
  // Product Strategy (11)
  { id: "pm1", name: "Product Strategy", category: "pm", categoryLabel: "Product Strategy", highlight: true, impactNote: "Defines multi-year product visions, market positioning, and business strategy aligned to OKRs.", metric: "5+ Platforms", xPct: 18, yPct: 22, colorHex: "#3b82f6" },
  { id: "pm2", name: "Roadmapping", category: "pm", categoryLabel: "Product Strategy", highlight: true, impactNote: "Architected priority roadmaps balancing tech debt, revenue growth, and user value.", metric: "Multi-Year", xPct: 32, yPct: 15, colorHex: "#3b82f6" },
  { id: "pm4", name: "Feature Prioritisation", category: "pm", categoryLabel: "Product Strategy", highlight: true, impactNote: "Utilizes RICE & Kano frameworks to optimize engineering throughput and ROI.", metric: "RICE & Kano", xPct: 25, yPct: 38, colorHex: "#3b82f6" },
  { id: "pm5", name: "Product Lifecycle Management", category: "pm", categoryLabel: "Product Strategy", impactNote: "Owned end-to-end lifecycle from discovery to launch & sunsetting across enterprise apps.", metric: "0→1 & Scaling", xPct: 12, yPct: 45, colorHex: "#3b82f6" },
  { id: "pm6", name: "Agile & Scrum", category: "pm", categoryLabel: "Product Strategy", impactNote: "Led sprint planning, grooming, and retros for multi-disciplinary dev pods.", metric: "+20% Velocity", xPct: 38, yPct: 32, colorHex: "#3b82f6" },
  { id: "pm7", name: "User Story Development", category: "pm", categoryLabel: "Product Strategy", impactNote: "Writes granular user stories with strict acceptance criteria and edge-case handling.", metric: "Clear ACs", xPct: 15, yPct: 62, colorHex: "#3b82f6" },
  { id: "pm8", name: "OKRs Framework", category: "pm", categoryLabel: "Product Strategy", highlight: true, impactNote: "Established quarterly OKR frameworks linking product releases directly to revenue KPIs.", metric: "Revenue KPIs", xPct: 28, yPct: 55, colorHex: "#3b82f6" },
  { id: "pm9", name: "Stakeholder Management", category: "pm", categoryLabel: "Product Strategy", impactNote: "Navigates VP, C-suite, and enterprise client expectations across global accounts.", metric: "Global Clients", xPct: 40, yPct: 50, colorHex: "#3b82f6" },
  { id: "pm10", name: "Cross-functional Leadership", category: "pm", categoryLabel: "Product Strategy", impactNote: "Bridges engineering, data science, and design squads to maintain shipping velocity.", metric: "Squad Lead", xPct: 22, yPct: 78, colorHex: "#3b82f6" },
  { id: "pm11", name: "Market Analysis", category: "pm", categoryLabel: "Product Strategy", impactNote: "Conducts competitive benchmarking, TAM/SAM sizing, and market opportunity mapping.", metric: "TAM/SAM Sizing", xPct: 35, yPct: 72, colorHex: "#3b82f6" },
  { id: "pm12", name: "Go-To-Market (GTM)", category: "pm", categoryLabel: "Product Strategy", highlight: true, impactNote: "Orchestrates GTM rollouts with product marketing, sales enablement, and ops.", metric: "Global Launch", xPct: 10, yPct: 82, colorHex: "#3b82f6" },

  // AI & GenAI (10)
  { id: "ai1", name: "AI Chatbot Development", category: "ai", categoryLabel: "AI / GenAI", highlight: true, impactNote: "Shipped enterprise LLM conversational assistant resulting in +37% DAU and −28% tickets.", metric: "+37% DAU", xPct: 72, yPct: 18, colorHex: "#a855f7" },
  { id: "ai2", name: "Prompt Engineering", category: "ai", categoryLabel: "AI / GenAI", highlight: true, impactNote: "Tuned multi-shot system prompts and guardrails, reducing hallucination rates by 34%.", metric: "-34% Hallucinations", xPct: 85, yPct: 25, colorHex: "#a855f7" },
  { id: "ai3", name: "ChatGPT Synthesis", category: "ai", categoryLabel: "AI / GenAI", impactNote: "Leverages ChatGPT for rapid PRD drafting, synthetic user persona testing, and specs.", metric: "PRD Synthesis", xPct: 62, yPct: 32, colorHex: "#a855f7" },
  { id: "ai4", name: "Claude Analysis", category: "ai", categoryLabel: "AI / GenAI", impactNote: "Utilizes Claude for long-context document analysis, code review, and requirements synthesis.", metric: "Long-Context", xPct: 78, yPct: 38, colorHex: "#a855f7" },
  { id: "ai5", name: "Gemini Multimodal", category: "ai", categoryLabel: "AI / GenAI", highlight: true, impactNote: "Integrates Gemini API and multimodal reasoning into workflow & productivity tools.", metric: "Multimodal AI", xPct: 88, yPct: 48, colorHex: "#a855f7" },
  { id: "ai6", name: "Midjourney Concepting", category: "ai", categoryLabel: "AI / GenAI", impactNote: "Generates high-fidelity visual concepts and storyboards for early product discovery.", metric: "Visual Mocks", xPct: 68, yPct: 52, colorHex: "#a855f7" },
  { id: "ai7", name: "Dall-E Mocks", category: "ai", categoryLabel: "AI / GenAI", impactNote: "Explores generative image assets for UI moodboards and marketing mocks.", metric: "UI Assets", xPct: 82, yPct: 62, colorHex: "#a855f7" },
  { id: "ai8", name: "Google AI Studio", category: "ai", categoryLabel: "AI / GenAI", highlight: true, impactNote: "Prototypes system instructions, function calling, and structured JSON outputs in AI Studio.", metric: "API Prototyping", xPct: 60, yPct: 68, colorHex: "#a855f7" },
  { id: "ai9", name: "Antigravity Agents", category: "ai", categoryLabel: "AI / GenAI", highlight: true, impactNote: "Deploys autonomous agent workflows and automated orchestration via Antigravity runtime.", metric: "Autonomous Agents", xPct: 75, yPct: 78, colorHex: "#a855f7" },
  { id: "ai10", name: "Vibe Coding", category: "ai", categoryLabel: "AI / GenAI", highlight: true, impactNote: "Leverages AI-first full-stack generation to build 0→1 functional web app prototypes.", metric: "0→1 Web Apps", xPct: 88, yPct: 85, colorHex: "#a855f7" },

  // Analytics & Data (8)
  { id: "d1", name: "Power BI", category: "data", categoryLabel: "Analytics & Data", highlight: true, impactNote: "Built self-serve executive dashboards adopted across 12 enterprise departments.", metric: "12 Departments", xPct: 48, yPct: 15, colorHex: "#10b981" },
  { id: "d2", name: "Tableau", category: "data", categoryLabel: "Analytics & Data", impactNote: "Designed complex visual analytics for enterprise risk and operational telemetry.", metric: "Risk Analytics", xPct: 58, yPct: 22, colorHex: "#10b981" },
  { id: "d3", name: "SQL Analytics", category: "data", categoryLabel: "Analytics & Data", highlight: true, impactNote: "Executes custom queries for cohort retention analysis and funnel drop-off optimization.", metric: "Cohort Retention", xPct: 46, yPct: 35, colorHex: "#10b981" },
  { id: "d4", name: "Google Analytics", category: "data", categoryLabel: "Analytics & Data", impactNote: "Monitors user event telemetry, drop-off rates, and conversion funnel bottlenecks.", metric: "Event Telemetry", xPct: 54, yPct: 45, colorHex: "#10b981" },
  { id: "d5", name: "A/B Testing Sprints", category: "data", categoryLabel: "Analytics & Data", impactNote: "Ran 15+ experiment sprints delivering +14% conversion rate uplift.", metric: "+14% Uplift", xPct: 44, yPct: 58, colorHex: "#10b981" },
  { id: "d6", name: "KPI Dashboards", category: "data", categoryLabel: "Analytics & Data", highlight: true, impactNote: "Establishes real-time product health dashboards for active SaaS platforms.", metric: "Real-time KPIs", xPct: 52, yPct: 65, colorHex: "#10b981" },
  { id: "d7", name: "Data-Driven Decisions", category: "data", categoryLabel: "Analytics & Data", impactNote: "Grew analytics tool adoption across product teams by 30%.", metric: "+30% Adoption", xPct: 42, yPct: 75, colorHex: "#10b981" },
  { id: "d8", name: "DAU/MAU Growth", category: "data", categoryLabel: "Analytics & Data", impactNote: "Tracks DAU/MAU ratios, churn rates, and feature adoption velocity.", metric: "SaaS Growth", xPct: 50, yPct: 88, colorHex: "#10b981" },

  // UX & Research (9)
  { id: "ux1", name: "User Research", category: "ux", categoryLabel: "UX & Research", impactNote: "Conducted 40+ user interviews uncovering key workflow friction points.", metric: "40+ Interviews", xPct: 28, yPct: 88, colorHex: "#f59e0b" },
  { id: "ux2", name: "Usability Testing", category: "ux", categoryLabel: "UX & Research", impactNote: "Executed usability testing sessions that cut task completion friction by 30%.", metric: "-30% Friction", xPct: 38, yPct: 85, colorHex: "#f59e0b" },
  { id: "ux3", name: "Wireframing", category: "ux", categoryLabel: "UX & Research", impactNote: "Creates low and mid-fidelity wireframes for rapid stakeholder alignment.", metric: "Rapid Specs", xPct: 20, yPct: 28, colorHex: "#f59e0b" },
  { id: "ux4", name: "Click Prototypes", category: "ux", categoryLabel: "UX & Research", highlight: true, impactNote: "Builds interactive click-through prototypes for user feedback validation.", metric: "Click-Throughs", xPct: 32, yPct: 42, colorHex: "#f59e0b" },
  { id: "ux5", name: "Information Architecture", category: "ux", categoryLabel: "UX & Research", impactNote: "Redesigned complex SaaS navigation cutting click depth by 40%.", metric: "-40% Depth", xPct: 18, yPct: 52, colorHex: "#f59e0b" },
  { id: "ux6", name: "Design Thinking", category: "ux", categoryLabel: "UX & Research", impactNote: "Facilitates cross-squad design thinking workshops to define user problems.", metric: "Sprints", xPct: 30, yPct: 65, colorHex: "#f59e0b" },
  { id: "ux7", name: "Figma Design Systems", category: "ux", categoryLabel: "UX & Research", highlight: true, impactNote: "Advanced Figma proficiency for design system maintenance and wireframing.", metric: "Design Systems", xPct: 65, yPct: 82, colorHex: "#f59e0b" },
  { id: "ux8", name: "Adobe XD", category: "ux", categoryLabel: "UX & Research", impactNote: "Maintained legacy UX component libraries and interactive specs.", metric: "Libraries", xPct: 58, yPct: 75, colorHex: "#f59e0b" },
  { id: "ux9", name: "Lovable Web Mocks", category: "ux", categoryLabel: "UX & Research", impactNote: "Utilizes modern web creation platforms for fast UI layout validation.", metric: "Web UI Mocks", xPct: 78, yPct: 88, colorHex: "#f59e0b" },

  // Tools (5)
  { id: "t1", name: "JIRA Sprints", category: "tools", categoryLabel: "Tools & Ops", highlight: true, impactNote: "Manages backlog grooming, sprint planning, and issue tracking.", metric: "Backlog & Sprints", xPct: 60, yPct: 28, colorHex: "#06b6d4" },
  { id: "t2", name: "Confluence Specs", category: "tools", categoryLabel: "Tools & Ops", impactNote: "Maintains product knowledge bases, PRDs, and architecture specs.", metric: "Knowledge Base", xPct: 70, yPct: 38, colorHex: "#06b6d4" },
  { id: "t3", name: "Azure DevOps", category: "tools", categoryLabel: "Tools & Ops", highlight: true, impactNote: "Tracks enterprise work items, CI/CD pipelines, and delivery velocity.", metric: "Enterprise CI/CD", xPct: 80, yPct: 48, colorHex: "#06b6d4" },
  { id: "t4", name: "Asana Alignment", category: "tools", categoryLabel: "Tools & Ops", impactNote: "Coordinates cross-departmental product launches and marketing roadmaps.", metric: "GTM Alignment", xPct: 68, yPct: 62, colorHex: "#06b6d4" },
  { id: "t5", name: "Aha! Strategy", category: "tools", categoryLabel: "Tools & Ops", highlight: true, impactNote: "Structures strategic portfolio roadmaps and release planning.", metric: "Portfolio Strategy", xPct: 76, yPct: 72, colorHex: "#06b6d4" }
];

const CATEGORIES = [
  { id: "all", label: "All Skills", count: 43, icon: Sparkles },
  { id: "pm", label: "Product Strategy", count: 11, icon: Compass },
  { id: "ai", label: "AI & GenAI", count: 10, icon: Brain },
  { id: "data", label: "Analytics & Data", count: 8, icon: BarChart3 },
  { id: "ux", label: "UX & Research", count: 9, icon: Layers },
  { id: "tools", label: "Tools & Ops", count: 5, icon: Wrench }
] as const;

export function SkillCloud() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(SKILL_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<SkillNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [layoutMode, setLayoutMode] = useState<"mesh" | "grid">("mesh");

  const filteredNodes = SKILL_NODES.filter((n) => {
    const matchesCategory = activeCategory === "all" || n.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeDisplayNode = hoveredNode || selectedNode || filteredNodes[0] || null;

  return (
    <div className="relative rounded-3xl border border-border bg-card/95 p-6 md:p-8 shadow-2xl overflow-hidden backdrop-blur-2xl">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden opacity-15">
        <div
          className="absolute -top-32 -left-32 size-[500px] rounded-full blur-[150px] transition-all duration-700"
          style={{ background: `radial-gradient(circle, ${activeDisplayNode ? activeDisplayNode.colorHex : "#ffffff"} 0%, transparent 70%)` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      {/* Cyber Header & HUD Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Radio className="size-4 text-accent animate-pulse" />
            <span className="label-mono text-xs font-bold uppercase tracking-widest text-accent">
              COMPETENCY NEURAL MESH
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <span>Skill Constellation</span>
            <span className="rounded-full bg-secondary border border-border px-3 py-0.5 text-xs font-mono font-bold text-foreground">
              43 COMPETENCIES
            </span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Touch any skill node to trigger live telemetry & impact metrics
          </p>
        </div>

        {/* HUD Switchers & Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search skill (e.g. SQL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 sm:w-52 rounded-full border border-border bg-background/80 pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent outline-none transition-all"
            />
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center bg-secondary/80 p-1 rounded-full border border-border">
            <button
              type="button"
              onClick={() => setLayoutMode("mesh")}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                layoutMode === "mesh"
                  ? "bg-accent text-accent-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Orbit className="size-3.5" />
              <span>Mesh View</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("grid")}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                layoutMode === "grid"
                  ? "bg-accent text-accent-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid className="size-3.5" />
              <span>Grid View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Frequency Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id && !searchQuery;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchQuery("");
                setSelectedNode(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isActive
                  ? "bg-accent text-accent-foreground border-accent shadow-2xs font-bold scale-[1.02]"
                  : "bg-card text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{cat.label}</span>
              <span className={`label-mono text-[0.65rem] px-2 py-0.2 rounded-full border ${
                isActive ? "bg-accent-foreground/20 border-accent-foreground/30 text-accent-foreground" : "bg-secondary border-border text-muted-foreground"
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* MODE 1: INTERACTIVE NEURAL MESH STAGE */}
      {layoutMode === "mesh" && (
        <div className="relative min-h-[440px] sm:min-h-[500px] rounded-2xl border border-border/80 bg-background/60 p-6 overflow-hidden shadow-inner flex items-center justify-center">
          {/* SVG Connector Lines Between Adjacent Category Nodes */}
          <svg className="absolute inset-0 size-full pointer-events-none z-0">
            {filteredNodes.map((node) => {
              const sameCat = filteredNodes.filter((n) => n.category === node.category);
              const nextNode = sameCat[(sameCat.indexOf(node) + 1) % sameCat.length];
              if (!nextNode) return null;

              const isConnectedToActive = activeDisplayNode?.id === node.id || activeDisplayNode?.id === nextNode.id;

              return (
                <line
                  key={`${node.id}-${nextNode.id}`}
                  x1={`${node.xPct}%`}
                  y1={`${node.yPct}%`}
                  x2={`${nextNode.xPct}%`}
                  y2={`${nextNode.yPct}%`}
                  stroke={isConnectedToActive ? node.colorHex : "currentColor"}
                  strokeWidth={isConnectedToActive ? "2" : "0.75"}
                  strokeDasharray={isConnectedToActive ? "4 4" : "1 3"}
                  className={`transition-all duration-300 ${isConnectedToActive ? "opacity-90 animate-pulse" : "text-border/40 opacity-40"}`}
                />
              );
            })}
          </svg>

          {/* Interactive Floating Neural Nodes (Clean Skill Name without metric pills) */}
          <div className="absolute inset-0 size-full pointer-events-none">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              const isActive = isSelected || isHovered;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{
                    left: `${node.xPct}%`,
                    top: `${node.yPct}%`
                  }}
                  className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 backdrop-blur-md whitespace-nowrap ${
                    isActive
                      ? "bg-foreground text-background border-foreground shadow-xl font-bold scale-110 z-30 ring-2 ring-foreground/40"
                      : "bg-card/95 text-foreground border-border hover:border-foreground shadow-xs z-10"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: node.colorHex }} />
                    <span>{node.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: GRID VIEW */}
      {layoutMode === "grid" && (
        <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedNode(isSelected ? null : node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`group flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-foreground text-background border-foreground shadow-md font-bold scale-[1.01]"
                    : "bg-card/90 text-foreground border-border hover:border-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold truncate">
                    <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: node.colorHex }} />
                    <span>{node.name}</span>
                  </span>
                </div>
                <p className={`text-[0.7rem] line-clamp-1 ${isSelected ? "text-background/80" : "text-muted-foreground"}`}>
                  {node.impactNote}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* BOTTOM TELEMETRY HUD BAR (Reveals detail & metric on-demand when touching node) */}
      <AnimatePresence>
        {activeDisplayNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="size-3 rounded-full shrink-0 animate-ping" style={{ backgroundColor: activeDisplayNode.colorHex }} />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-display text-sm font-bold text-foreground">
                    {activeDisplayNode.name}
                  </h3>
                  <span className="label-mono text-[0.65rem] text-muted-foreground uppercase">
                    • {activeDisplayNode.categoryLabel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {activeDisplayNode.impactNote}
                </p>
              </div>
            </div>

            {activeDisplayNode.metric && (
              <span className="label-mono text-xs font-bold text-foreground bg-secondary/90 border border-border rounded-lg px-3 py-1.5 shrink-0 self-start sm:self-auto">
                {activeDisplayNode.metric}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cyber Footer */}
      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground px-2">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-accent" />
          <span>43 Competencies Catalogued</span>
        </span>
        <span className="label-mono text-[0.75rem]">Gulshan Sahu</span>
      </div>
    </div>
  );
}
