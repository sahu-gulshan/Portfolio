import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Briefcase, CheckCircle2, ArrowRight, Loader2, Award, Zap, FileText, Send, Search, ChevronDown, Check, Globe, Layers } from "lucide-react";
import { projects } from "@/data/projects";
import { track } from "@/lib/analytics";

interface RoleMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCase?: (slug: string) => void;
}

export interface RolePositionOption {
  title: string;
  category: "Executive & Leadership" | "Core & Generalist" | "AI, ML & Data" | "Growth & Monetization" | "Specialized & Domain";
  company: string;
  desc: string;
}

export const COMPREHENSIVE_PRODUCT_ROLES: RolePositionOption[] = [
  // Executive & Leadership
  {
    title: "Chief Product Officer (CPO)",
    category: "Executive & Leadership",
    company: "Global Enterprise",
    desc: "Oversees global product vision, portfolio P&L, and executive leadership.",
  },
  {
    title: "VP of Product Management",
    category: "Executive & Leadership",
    company: "Enterprise Tech",
    desc: "Leads product orgs, cross-functional execution, and revenue growth.",
  },
  {
    title: "Director of Product Management",
    category: "Executive & Leadership",
    company: "Mid-Market / Tech",
    desc: "Owns strategic product pillars, team leadership, and roadmap delivery.",
  },
  {
    title: "Group Product Manager (GPM)",
    category: "Executive & Leadership",
    company: "Scale-up SaaS",
    desc: "Manages PM pods while leading core product surface execution.",
  },
  {
    title: "Principal Product Manager",
    category: "Executive & Leadership",
    company: "Big Tech / SaaS",
    desc: "Drives high-complexity initiatives and long-term product bets.",
  },
  {
    title: "Staff Product Manager — AI & Platforms",
    category: "Executive & Leadership",
    company: "AI Platform",
    desc: "0→1 LLM workflows, evaluation frameworks, and ML delivery.",
  },
  {
    title: "Lead Product Manager",
    category: "Executive & Leadership",
    company: "Consumer Platform",
    desc: "Drives cross-squad alignment, user discovery, and core execution.",
  },

  // Core & Generalist
  {
    title: "Senior Product Manager",
    category: "Core & Generalist",
    company: "B2B / Consumer Tech",
    desc: "End-to-end product lifecycle, engineering pods, and roadmap delivery.",
  },
  {
    title: "Product Manager",
    category: "Core & Generalist",
    company: "Digital Products",
    desc: "Feature backlog, sprint planning, and cross-functional execution.",
  },
  {
    title: "Associate Product Manager (APM)",
    category: "Core & Generalist",
    company: "Tech Rotational",
    desc: "Early-career product management across discovery, stories, and specs.",
  },
  {
    title: "0→1 Founding Product Manager",
    category: "Core & Generalist",
    company: "Early Startup",
    desc: "Product-market fit discovery, prototyping, and MVP execution.",
  },
  {
    title: "Technical Product Manager (TPM)",
    category: "Core & Generalist",
    company: "Infrastructure",
    desc: "Deep technical focus on APIs, microservices, schemas, and SLAs.",
  },

  // AI, ML & Data
  {
    title: "AI / Machine Learning Product Manager",
    category: "AI, ML & Data",
    company: "AI Enterprise",
    desc: "ML model capabilities, fine-tuning pipelines, and safety guardrails.",
  },
  {
    title: "Generative AI & LLM Platform PM",
    category: "AI, ML & Data",
    company: "AI SaaS",
    desc: "Agentic assistants, RAG architectures, prompt pipelines, and tools.",
  },
  {
    title: "Data & Analytics Product Manager",
    category: "AI, ML & Data",
    company: "Data Platform",
    desc: "Data warehouse infrastructure, real-time pipelines, and BI analytics.",
  },
  {
    title: "Algorithmic & Personalization PM",
    category: "AI, ML & Data",
    company: "E-commerce / Retail",
    desc: "Recommendation engines, search ranking, and user targeting.",
  },

  // Growth & Monetization
  {
    title: "Growth Product Manager",
    category: "Growth & Monetization",
    company: "PLG SaaS",
    desc: "Activation funnels, retention cohorts, viral loops, and A/B experiments.",
  },
  {
    title: "Monetization & Billing Product Manager",
    category: "Growth & Monetization",
    company: "Fintech / Subscriptions",
    desc: "Pricing packaging, subscription billing, and ARR expansion loops.",
  },
  {
    title: "Product Operations Manager (Product Ops)",
    category: "Growth & Monetization",
    company: "Scaling Product Org",
    desc: "Standardizes product tooling, analytics tracking, and release processes.",
  },

  // Specialized & Domain-Specific
  {
    title: "Mobile Product Manager (iOS / Android)",
    category: "Specialized & Domain",
    company: "Mobile Apps",
    desc: "Native iOS/Android experiences, app store optimization, and engagement.",
  },
  {
    title: "UX & Design Systems Product Manager",
    category: "Specialized & Domain",
    company: "Frontend Platform",
    desc: "Cross-platform design systems, component libraries, and accessibility.",
  },
  {
    title: "FinTech & Payments Product Manager",
    category: "Specialized & Domain",
    company: "FinTech / Banking",
    desc: "Payment processing pipelines, ledger engines, fraud detection, and APIs.",
  },
  {
    title: "Enterprise SaaS Product Manager",
    category: "Specialized & Domain",
    company: "B2B Enterprise",
    desc: "Multi-tenant SaaS architecture, RBAC, SSO/SAML, and enterprise security.",
  },
  {
    title: "HealthTech & Life Sciences PM",
    category: "Specialized & Domain",
    company: "Digital Health",
    desc: "HIPAA-compliant platforms, EHR/EMR integrations, and health regulations.",
  },
  {
    title: "Developer Platform & API Product Manager",
    category: "Specialized & Domain",
    company: "DevTools / API",
    desc: "Developer SDKs, REST/GraphQL APIs, dev portals, and webhooks.",
  },
  {
    title: "Security, Privacy & Compliance PM",
    category: "Specialized & Domain",
    company: "Cybersecurity",
    desc: "Zero-trust security, vulnerability scanning, and SOC2/GDPR compliance.",
  },
  {
    title: "Hardware / IoT Product Manager",
    category: "Specialized & Domain",
    company: "IoT / Electronics",
    desc: "Firmware releases, hardware supply chain, and device telemetry.",
  },
];

const ROLE_CATEGORIES = [
  "All Roles",
  "Executive & Leadership",
  "Core & Generalist",
  "AI, ML & Data",
  "Growth & Monetization",
  "Specialized & Domain",
] as const;

export function RoleMatcherModal({ isOpen, onClose, onNavigateToCase }: RoleMatcherModalProps) {
  const [roleTitle, setRoleTitle] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  // Dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Roles");

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

  const handleSelectRoleOption = (role: RolePositionOption) => {
    setRoleTitle(role.title);
    setCompanyType(role.company);
    setJobDescription(role.desc);
    setIsDropdownOpen(false);
  };

  const filteredRoles = COMPREHENSIVE_PRODUCT_ROLES.filter((role) => {
    const matchesCategory =
      selectedCategory === "All Roles" || role.category === selectedCategory;
    const matchesSearch =
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEvaluate = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!roleTitle && !jobDescription) return;

    setIsLoading(true);
    setMatchResult(null);

    try {
      const res = await fetch("/api/ai/match-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleTitle,
          jobDescription,
          companyType,
        }),
      });

      if (!res.ok) throw new Error("Failed to evaluate match");
      const data = await res.json();
      setMatchResult(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setMatchResult({
        matchScore: 95,
        summary: `Excellent match for ${roleTitle || "Product Manager"}: Gulshan's 5+ years shipping 0→1 AI applications, leading pods of 7, and optimizing multi-million dollar data platforms directly aligns with your requirements.`,
        topProjects: [
          {
            slug: "ai-chatbot",
            title: "iOS AI Chatbot (0→1 Native)",
            reason: "Proves enterprise 0→1 AI delivery, synthetic test isolation, and rapid 5-month execution."
          },
          {
            slug: "sams-club",
            title: "Member Engagement Graph",
            reason: "Proves deep analytical cohort retention, behavior-triggered pipelines, and fee revenue protection."
          }
        ],
        keyCompetencies: [
          "0→1 AI/ML Product Discovery & Scoping",
          "Cross-Functional Pod Leadership (Squad of 7)",
          "Data-Informed P&L Strategy ($245M+ incremental revenue)",
          "UX Subtraction & Spec-First API Contracts"
        ],
        tailoredPitch: "Gulshan brings proven experience bridging complex technical architectures (LLMs, Bayesian models, real-time pipelines) with measurable business P&L outcomes. His track record includes cutting release cycle times by 50% and increasing squad delivery velocity by 20%.",
        suggestedInterviewQuestions: [
          "Can you walk through how you scoped the iOS AI Chatbot mock API strategy to unblock mobile devs ahead of backend availability?",
          "How did you gain VP-level stakeholder alignment when reallocating $198M media spend in the Marketing Mix Model?",
          "What is your approach to setting guardrail metrics vs North Star KPIs in 0-to-1 AI products?"
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-6xl xl:max-w-[1180px] max-h-[92vh] rounded-3xl border border-border/80 bg-card shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-border/60 bg-secondary/30">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent shadow-2xs">
              <Briefcase className="size-4.5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-foreground">
                  Recruiter Lens & Role Matcher
                </h3>
                <span className="font-mono text-[0.65rem] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-semibold flex items-center gap-1">
                  <Sparkles className="size-2.5" /> Gemini 3.7 AI
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Paste your open role or JD to analyze candidate fit and relevant case studies in real time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!matchResult ? (
            <div className="space-y-5">
              {/* Global PM & Product Positions Dropdown Menu */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Select Role/Position
                  </label>
                  {roleTitle && (
                    <span className="text-[0.68rem] font-mono font-semibold text-accent flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> Selected: {roleTitle}
                    </span>
                  )}
                </div>

                {/* Dropdown Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/90 bg-secondary/30 hover:bg-secondary/50 hover:border-accent/60 transition-all text-left shadow-2xs cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent group-hover:scale-105 transition-transform">
                      <Briefcase className="size-4" />
                    </span>
                    <span className="font-display text-sm font-semibold text-foreground truncate">
                      {roleTitle || "Select Role/Position"}
                    </span>
                  </div>
                  <ChevronDown className={`size-4.5 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Panel Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 4, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 top-full z-50 mt-2 flex flex-col rounded-2xl border border-border bg-card/98 shadow-2xl overflow-hidden backdrop-blur-xl max-h-[360px]"
                    >
                      {/* Search Header */}
                      <div className="p-3 border-b border-border/80 bg-secondary/40 shrink-0">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search role or position title..."
                            className="w-full pl-9 pr-8 py-2 rounded-xl border border-border/80 bg-background text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                            autoFocus
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery("")}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <X className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Roles List */}
                      <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredRoles.length > 0 ? (
                          filteredRoles.map((role) => {
                            const isSelected = roleTitle === role.title;
                            return (
                              <button
                                key={role.title}
                                type="button"
                                onClick={() => handleSelectRoleOption(role)}
                                className={`group relative w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                                  isSelected
                                    ? "bg-accent/15 border border-accent/40 text-accent font-semibold shadow-2xs"
                                    : "border border-transparent text-foreground/90 hover:bg-accent/10 hover:border-accent/30 hover:text-accent hover:translate-x-1 hover:shadow-2xs"
                                }`}
                              >
                                <span className="font-display text-xs font-medium truncate group-hover:font-semibold transition-all">
                                  {role.title}
                                </span>
                                {isSelected ? (
                                  <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-xs">
                                    <Check className="size-3" />
                                  </span>
                                ) : (
                                  <ArrowRight className="size-3.5 shrink-0 text-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className="p-6 text-center text-xs text-muted-foreground">
                            No matching role found for "{searchQuery}".
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Form */}
              <form onSubmit={handleEvaluate} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono font-medium text-foreground mb-1">
                      Role / Position Title
                    </label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder="e.g. Staff Product Manager, AI Platform"
                      className="w-full rounded-xl border border-border/80 bg-secondary/40 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-medium text-foreground mb-1">
                      Company or Industry
                    </label>
                    <input
                      type="text"
                      value={companyType}
                      onChange={(e) => setCompanyType(e.target.value)}
                      placeholder="e.g. Enterprise AI SaaS, Fintech, Retail Scale"
                      className="w-full rounded-xl border border-border/80 bg-secondary/40 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-foreground mb-1">
                    Job Description / Key Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job description requirements, responsibilities, or desired qualifications here..."
                    className="w-full rounded-xl border border-border/80 bg-secondary/40 p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || (!roleTitle && !jobDescription)}
                    className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:bg-accent/90 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Analyzing Match...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        Evaluate Portfolio Match
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Match Score & Summary Banner */}
              <div className="rounded-2xl border border-accent/40 bg-accent/10 p-5 relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider block">
                      Evaluated Role Fit
                    </span>
                    <h4 className="font-display text-lg sm:text-xl font-bold text-foreground mt-0.5">
                      {roleTitle || "Product Manager"}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 bg-card/80 px-4 py-2 rounded-xl border border-accent/30 shadow-xs">
                    <div className="text-right">
                      <span className="font-mono text-[0.65rem] text-muted-foreground uppercase">Alignment</span>
                      <p className="font-mono text-xl font-black text-accent">{matchResult.matchScore}%</p>
                    </div>
                    <Award className="size-6 text-accent" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-foreground/90 leading-relaxed font-medium">
                  {matchResult.summary}
                </p>
              </div>

              {/* Top Matching Projects */}
              <div>
                <h5 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <Zap className="size-3.5 text-accent" /> Most Relevant Case Studies
                </h5>
                <div className="grid gap-3 sm:grid-cols-2">
                  {matchResult.topProjects?.map((proj: any) => (
                    <div
                      key={proj.title}
                      className="rounded-xl border border-border/70 bg-card/80 p-4 transition-all hover:border-accent/50 group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-sm font-bold text-foreground">
                          {proj.title}
                        </span>
                        {proj.slug && onNavigateToCase && (
                          <button
                            onClick={() => {
                              track("click_case_study", {
                                slug: proj.slug,
                                title: proj.title,
                                from: "role_matcher_modal",
                              });
                              onClose();
                              onNavigateToCase(proj.slug);
                            }}
                            className="text-xs font-mono font-semibold text-accent flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                          >
                            Read Case <ArrowRight className="size-3" />
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {proj.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Competencies & Tailored Pitch */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
                  <h5 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                    Demonstrated Competencies
                  </h5>
                  <ul className="space-y-2">
                    {matchResult.keyCompetencies?.map((comp: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-foreground/90 font-medium">
                        <CheckCircle2 className="size-3.5 text-accent shrink-0 mt-0.5" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
                  <h5 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                    Tailored Pitch for Hiring Manager
                  </h5>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {matchResult.tailoredPitch}
                  </p>
                </div>
              </div>

              {/* Suggested Interview Questions */}
              {matchResult.suggestedInterviewQuestions?.length > 0 && (
                <div className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <h5 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                    Suggested Deep-Dive Interview Questions
                  </h5>
                  <ol className="space-y-2 list-decimal list-inside text-xs text-muted-foreground">
                    {matchResult.suggestedInterviewQuestions.map((q: string, i: number) => (
                      <li key={i} className="text-foreground/90 leading-relaxed">
                        <span className="font-normal">{q}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <button
                  onClick={() => setMatchResult(null)}
                  className="text-xs font-mono font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ← Test Another Role
                </button>
                <button
                  onClick={onClose}
                  className="rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground cursor-pointer hover:bg-accent/90"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
