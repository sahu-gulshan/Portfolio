import React, { useState, useEffect, Fragment, type MouseEvent } from "react";
import { CaseStudyAiDrawer } from "@/components/ai/CaseStudyAiDrawer";
import { PmDecisionSimulator } from "@/components/ai/PmDecisionSimulator";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Briefcase,
  Users,
  Calendar,
  Sparkles,
  TrendingUp,
  Zap,
  Award,
  Target,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers3,
  Lightbulb,
  Compass,
  FileText,
  Quote as QuoteIcon,
  Activity,
  Workflow,
  Milestone,
  ShieldCheck,
  BarChart2,
  Flag,
  Building2,
  Tag,
  Check,
  FolderKanban,
  Cpu,
  Clock,
  LineChart,
  Boxes,
  Hexagon,
  CheckCheck,
  Maximize2,
  SlidersHorizontal,
  Share2,
  UserCheck,
  Layers,
  CircleDollarSign,
  Timer,
  Heart,
  Gauge,
  BarChart3,
  Search,
  Layout,
  Code2,
  Rocket,
  PenTool,
  BookOpen,
  AlertCircle,
  Trophy,
  Key,
  Shield,
  AlertTriangle,
  BookMarked,
  LayoutGrid,
  GitFork,
  ShieldAlert,
  BrainCircuit,
  Repeat,
  Sliders,
  AppWindow,
  Server,
  Smartphone,
  Lock,
  FileCode,
  Package,
  User,
  Landmark,
  Database,
  Network,
  FileCheck,
  Headphones,
  CreditCard,
  HeartPulse,
  ShoppingCart,
  Fuel,
  CalendarClock,
  PackageCheck,
  LayoutDashboard,
  Bell,
  MousePointer,
  GitCompare,
  Scale,
} from "lucide-react";
import { motion, useScroll, useSpring, useMotionValueEvent } from "motion/react";
import {
  Bars,
  Donut,
  Curve,
  Compare,
  Cards,
  Phases,
  Cohorts,
  Persona,
  Graph,
  Steps,
  DataTable,
  Options,
  Architecture,
  Pipeline,
  KpiTree,
  Moscow,
  Attribution,
  Deltas,
  PlanActual,
  Screens,
  Loop,
} from "@/components/case/CaseVisuals";
import {
  getProject,
  nextProject,
  prevProject,
  projects,
} from "@/data/projects";
import { getProjectThemeOverride, type ColorPaletteId } from "@/lib/colorPalettes";
import type { CaseBlock, Project } from "@/types";
import { Reveal } from "@/components/Reveal";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { track } from "@/lib/analytics";

const UNIFIED_SECTION_THEME = {
  borderActive: "border border-accent/50 ring-1 ring-accent/20",
  borderHover: "hover:border-border/60",
  bgActive: "bg-card",
  barColor: "bg-accent",
  badgeActive: "bg-accent/15 text-accent font-semibold",
  badgeInactive: "bg-secondary text-muted-foreground",
  tagBg: "bg-secondary text-muted-foreground",
  pillActive: "bg-accent/15 text-accent font-semibold",
  ringActive: "ring-1 ring-accent/20",
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getPairIcon(key: string, value: string, index: number) {
  const k = key.toLowerCase().trim();
  const v = value.toLowerCase().trim();
  const text = `${k} ${v}`;

  // Direct category matching
  if (k === "platform" || k.includes("platform strategy") || k.includes("cloud platform") || (text.includes("platform") && (text.includes("cloud") || text.includes("backend") || text.includes("host") || text.includes("server")))) {
    return Server;
  }
  if (k === "identity" || k.includes("user identity") || k.includes("sso & auth") || (text.includes("identity") && (text.includes("sso") || text.includes("auth") || text.includes("session") || text.includes("login")))) {
    return Key;
  }
  if (k === "observability" || k.includes("monitoring & logs") || k.includes("telemetry") || (text.includes("observability") && (text.includes("log") || text.includes("crash") || text.includes("monitor") || text.includes("telemetry") || text.includes("error")))) {
    return Activity;
  }
  if (k === "roles" || k.includes("role") || text.includes("permission")) {
    return UserCheck;
  }
  if (k.includes("native") || k.includes("mobile capability") || text.includes("push") || text.includes("camera")) {
    return Smartphone;
  }

  if (text.includes("primary") || text.includes("desk-less") || text.includes("field") || text.includes("employee") || text.includes("mobile employee")) {
    return User;
  }
  if (text.includes("sponsor") || text.includes("engineering leader") || text.includes("leader") || text.includes("stakeholder") || text.includes("executive")) {
    return Landmark;
  }
  if (text.includes("platform") || text.includes("cloud") || text.includes("host") || text.includes("backend") || text.includes("server")) {
    return Server;
  }
  if (text.includes("identity") || text.includes("auth") || text.includes("session") || text.includes("sso") || text.includes("login")) {
    return Key;
  }
  if (text.includes("role") || text.includes("permission") || text.includes("badge") || text.includes("who")) {
    return UserCheck;
  }
  if (text.includes("native") || text.includes("mobile") || text.includes("push") || text.includes("camera") || text.includes("phone") || text.includes("ios") || text.includes("android")) {
    return Smartphone;
  }
  if (text.includes("observability") || text.includes("log") || text.includes("crash") || text.includes("monitor") || text.includes("telemetry") || text.includes("error")) {
    return Activity;
  }
  if (text.includes("production data") || text.includes("privacy") || text.includes("synthetic") || text.includes("security") || text.includes("perimeter") || text.includes("defense")) {
    return ShieldCheck;
  }
  if (text.includes("direct access") || text.includes("mock") || text.includes("spec-first") || text.includes("contract") || text.includes("api")) {
    return FileCode;
  }
  if (text.includes("deploy") || text.includes("lift-and-shift") || text.includes("runbook") || text.includes("package")) {
    return Package;
  }
  if (text.includes("code standard") || text.includes("typing") || text.includes("linting") || text.includes("review") || text.includes("quality")) {
    return FileCheck;
  }
  if (text.includes("severity") || text.includes("risk") || text.includes("hypothesis") || text.includes("friction") || text.includes("problem") || text.includes("challenge")) {
    return AlertTriangle;
  }
  if (text.includes("when") || text.includes("time") || text.includes("moment") || text.includes("frequency") || text.includes("speed") || text.includes("cadence") || text.includes("schedule")) {
    return Clock;
  }
  if (text.includes("baseline") || text.includes("confound") || text.includes("organic") || text.includes("sales mix") || text.includes("curve")) {
    return LineChart;
  }
  if (text.includes("carryover") || text.includes("persist") || text.includes("weeks") || text.includes("history") || text.includes("timeframe")) {
    return Timer;
  }
  if (text.includes("static") || text.includes("rejected") || text.includes("dismissed") || text.includes("rule")) {
    return AlertCircle;
  }
  if (text.includes("click-path") || text.includes("touchpoint") || text.includes("navigation") || text.includes("pointer")) {
    return MousePointer;
  }
  if (text.includes("simulate") || text.includes("scenario") || text.includes("what-if") || text.includes("experiment") || text.includes("reallocate")) {
    return Sliders;
  }
  if (text.includes("optimise") || text.includes("optimisation") || text.includes("maximise") || text.includes("growth") || text.includes("uplift")) {
    return Zap;
  }
  if (text.includes("correlation") || text.includes("causation") || text.includes("observational") || text.includes("comparison")) {
    return GitCompare;
  }
  if (text.includes("model trust") || text.includes("scrutiny") || text.includes("accuracy") || text.includes("explanation")) {
    return ShieldAlert;
  }
  if (text.includes("insight") || text.includes("discovery") || text.includes("pattern") || text.includes("finding")) {
    return Lightbulb;
  }
  if (text.includes("evaluate") || text.includes("benefit") || text.includes("catalogued") || text.includes("comparison")) {
    return Scale;
  }
  if (text.includes("contact-centre") || text.includes("interaction") || text.includes("support ticket") || text.includes("call")) {
    return Headphones;
  }
  if (text.includes("credit card") || text.includes("co-brand") || text.includes("payment") || text.includes("fintech")) {
    return CreditCard;
  }
  if (text.includes("health") || text.includes("consumables") || text.includes("pharmacy")) {
    return HeartPulse;
  }
  if (text.includes("grocery") || text.includes("fresh") || text.includes("basket") || text.includes("reorder")) {
    return ShoppingCart;
  }
  if (text.includes("fuel") || text.includes("station") || text.includes("gas")) {
    return Fuel;
  }
  if (text.includes("renewal") || text.includes("expiry") || text.includes("90 days") || text.includes("due")) {
    return CalendarClock;
  }
  if (text.includes("mission") || text.includes("stock-up") || text.includes("replenishment")) {
    return PackageCheck;
  }
  if (text.includes("member graph") || text.includes("knowledge graph") || text.includes("taxonomy") || text.includes("relationship")) {
    return Network;
  }
  if (text.includes("console") || text.includes("dashboard") || text.includes("explorer") || text.includes("workspace")) {
    return LayoutDashboard;
  }
  if (text.includes("nudge") || text.includes("threshold") || text.includes("notification") || text.includes("trigger")) {
    return Bell;
  }
  if (text.includes("ranking") || text.includes("next-best") || text.includes("learning") || text.includes("priority")) {
    return Target;
  }
  if (text.includes("cost") || text.includes("revenue") || text.includes("roi") || text.includes("budget") || text.includes("saving") || text.includes("sales") || text.includes("spend")) {
    return CircleDollarSign;
  }
  if (text.includes("ai") || text.includes("llm") || text.includes("assistant") || text.includes("model") || text.includes("bot") || text.includes("intelligence")) {
    return BrainCircuit;
  }
  if (text.includes("database") || text.includes("storage") || text.includes("schema") || text.includes("data")) {
    return Database;
  }
  if (text.includes("network") || text.includes("endpoint") || text.includes("http") || text.includes("request")) {
    return Network;
  }

  const fallbackIcons = [
    Sparkles,
    Target,
    Compass,
    Lightbulb,
    Hexagon,
    Workflow,
    Boxes,
    Flag,
    Layers,
    Zap,
    Award,
    Shield,
    BarChart3,
    CheckCheck,
    Cpu,
  ];
  const hash = hashString(`${key}:${value}:${index}`);
  return fallbackIcons[(hash + index) % fallbackIcons.length]!;
}

function PairsView({ items }: { items: { k: string; v: string }[] }) {
  if (!items || !Array.isArray(items) || items.length === 0) return null;

  const usedIcons = new Set<any>();

  return (
    <div className="grid gap-3.5 sm:grid-cols-2 items-stretch">
      {items.map((p, i) => {
        if (!p) return null;
        let Icon = getPairIcon(p.k || "", p.v || "", i);
        if (usedIcons.has(Icon)) {
          const fallbackList = [
            Server,
            Key,
            UserCheck,
            Smartphone,
            Activity,
            ShieldCheck,
            FileCode,
            Package,
            FileCheck,
            AlertTriangle,
            Clock,
            LineChart,
            Timer,
            MousePointer,
            Sliders,
            Zap,
            GitCompare,
            ShieldAlert,
            Lightbulb,
            Scale,
            Headphones,
            CreditCard,
            HeartPulse,
            ShoppingCart,
            Fuel,
            CalendarClock,
            PackageCheck,
            Network,
            LayoutDashboard,
            Bell,
            Target,
            CircleDollarSign,
            BrainCircuit,
            Database,
            Sparkles,
          ];
          const alt = fallbackList.find((ic) => !usedIcons.has(ic));
          if (alt) Icon = alt;
        }
        usedIcons.add(Icon);

        return (
          <motion.div
            key={p.k || i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col justify-start rounded-xl border border-border/30 bg-card/60 p-4.5 sm:p-5 transition-all duration-300 hover:border-accent/40 hover:shadow-sm"
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                <Icon className="size-3.5" />
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-foreground group-hover:text-accent transition-colors">
                {p.k}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed font-normal">
              {p.v}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

function getChainStepIcon(item: string, index: number, total: number) {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const text = (item || "").toLowerCase();

  if (text.includes("routine") || text.includes("cost") || text.includes("time") || text.includes("support")) return Timer;
  if (text.includes("self-serve") || text.includes("self-served") || text.includes("wherever") || text.includes("employee") || text.includes("question")) return UserCheck;
  if (text.includes("moment") || text.includes("arises") || text.includes("reach") || text.includes("prompt")) return Zap;
  if (text.includes("native") || text.includes("ios") || text.includes("front-end") || text.includes("build") || text.includes("bot")) return Smartphone;
  if (isFirst) return Target;
  if (isLast) return Sparkles;

  const chainIcons = [Target, Timer, UserCheck, Zap, Smartphone, Cpu, Compass, Sparkles];
  return chainIcons[index % chainIcons.length]!;
}

function ChainView({ items }: { items: string[] }) {
  if (!items || !Array.isArray(items) || items.length === 0) return null;

  return (
    <div
      className={`grid gap-3.5 items-stretch ${
        items.length === 3 ? "md:grid-cols-3" : items.length === 4 ? "md:grid-cols-4" : "md:grid-cols-2"
      }`}
    >
      {items.map((item, i) => {
        const isFirst = i === 0;
        const isLast = i === items.length - 1;
        const StepIcon = getChainStepIcon(item, i, items.length);

        return (
          <motion.div
            key={item || i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative flex flex-col justify-start rounded-xl border p-4.5 sm:p-5 transition-all duration-200 ${
              isLast
                ? "border-accent/60 bg-accent/10"
                : isFirst
                ? "border-border/60 bg-card"
                : "border-border/40 bg-card/70 hover:border-accent/40"
            }`}
          >
            {/* Step Header */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                  isLast
                    ? "bg-accent text-accent-foreground"
                    : "bg-accent/15 text-accent"
                }`}
              >
                <StepIcon className="size-3.5" />
              </span>
              <span className="font-mono text-xs text-muted-foreground font-semibold">
                Step 0{i + 1}
              </span>
            </div>

            <p
              className={`text-sm leading-relaxed ${
                isLast ? "text-accent font-semibold" : "text-foreground font-normal"
              }`}
            >
              {item}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

function Block({ block }: { block: CaseBlock }) {
  if (!block) return null;

  try {
    if (block.kind === "text") {
      const bodyLines = Array.isArray(block.body) ? block.body : typeof block.body === "string" ? [block.body] : [];
      return (
        <div className="max-w-[70ch] space-y-3.5 text-muted-foreground text-sm sm:text-base font-normal leading-[1.7]">
          {bodyLines.map((b, i) => (
            <p key={i}>{b}</p>
          ))}
        </div>
      );
    }

    if (block.kind === "quote") {
      const rawBody = (block as any).body;
      const quoteText = typeof rawBody === "string" ? rawBody : Array.isArray(rawBody) ? rawBody.join(" ") : "";
      return (
        <motion.blockquote
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-xl border-l-2 border-l-accent bg-card/50 p-4.5 md:p-5 my-2"
        >
          <div className="flex items-start gap-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <QuoteIcon className="size-4.5" />
            </span>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[0.7rem] font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                  Customer Voice & Direct Need
                </span>
                <span className="font-mono text-[0.68rem] text-muted-foreground/70 hidden sm:inline">
                  Verified Research
                </span>
              </div>
              <p className="font-display text-base md:text-lg font-medium leading-relaxed text-foreground italic">
                “{quoteText}”
              </p>
            </div>
          </div>
        </motion.blockquote>
      );
    }

    if (block.kind === "bullets") {
      const bulletItems = Array.isArray(block.items) ? block.items : [];
      return (
        <div className="grid gap-3.5 md:grid-cols-2">
          {bulletItems.map((b, i) => {
            const text = (b || "").toLowerCase();
            let BulletIcon = Lightbulb;
            if (text.includes("desk") || text.includes("workforce") || text.includes("people") || text.includes("user") || text.includes("employee")) BulletIcon = Users;
            else if (text.includes("backend") || text.includes("cost") || text.includes("proven") || text.includes("marginal") || text.includes("server")) BulletIcon = Server;
            else if (text.includes("momentum") || text.includes("ai") || text.includes("pilot") || text.includes("sponsorship") || text.includes("speed")) BulletIcon = Zap;
            else if (text.includes("security") || text.includes("shield") || text.includes("compliance")) BulletIcon = ShieldCheck;
            else if (text.includes("data") || text.includes("database")) BulletIcon = Database;
            else {
              const fallbackBullets = [Lightbulb, Target, ShieldCheck, Compass, Award, Boxes, Hexagon];
              BulletIcon = fallbackBullets[i % fallbackBullets.length]!;
            }

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: "some" }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col justify-start rounded-xl border border-border/20 bg-card/60 p-4 sm:p-5 transition-all duration-200 hover:border-accent/40"
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent font-mono text-xs font-bold">
                    <BulletIcon className="size-3.5" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground font-semibold">
                    0{i + 1}
                  </span>
                </div>
                <p className="text-sm font-normal text-foreground/90 leading-relaxed">
                  {b}
                </p>
              </motion.div>
            );
          })}
        </div>
      );
    }

    if (block.kind === "stats") {
      const statItems = Array.isArray(block.items) ? block.items : [];
      return (
        <div className="grid gap-3.5 sm:grid-cols-3">
          {statItems.map((s, i) => (
            <motion.div
              key={s.label || i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-xl border border-border/20 bg-card/70 p-4.5 sm:p-5 transition-all hover:border-accent/40"
            >
              <div className="flex items-center justify-between">
                <span className="label-mono text-[0.68rem] text-muted-foreground uppercase tracking-wider">
                  Outcome #{i + 1}
                </span>
                <LineChart className="size-3.5 text-accent/70 transition-transform group-hover:scale-110" />
              </div>
              <p className="mt-2 font-display text-2xl font-bold tracking-tight text-accent md:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">{s.label}</p>
              <div className="mt-3 h-1 w-full rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                  className="h-full bg-accent/80 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    if (block.kind === "chain") return <ChainView items={(block as any).items || []} />;

    if (block.kind === "bars") return <Bars {...(block as any)} items={(block as any).items || []} />;
    if (block.kind === "donut") return <Donut {...(block as any)} items={(block as any).items || []} />;
    if (block.kind === "curve") return <Curve {...(block as any)} points={(block as any).points || []} />;
    if (block.kind === "compare") return <Compare {...(block as any)} items={(block as any).items || []} />;
    if (block.kind === "cards") return <Cards items={(block as any).items || []} />;
    if (block.kind === "phases") return <Phases items={(block as any).items || []} />;
    if (block.kind === "cohorts") return <Cohorts a={(block as any).a} b={(block as any).b} items={(block as any).items || []} />;
    if (block.kind === "persona") return <Persona {...(block as any)} />;
    if (block.kind === "graph") return <Graph {...(block as any)} nodes={(block as any).nodes || []} />;
    if (block.kind === "steps") return <Steps {...(block as any)} items={(block as any).items || []} />;
    if (block.kind === "table") return <DataTable {...(block as any)} columns={(block as any).columns || []} rows={(block as any).rows || []} />;
    if (block.kind === "options") return <Options {...(block as any)} items={(block as any).items || []} />;
    if (block.kind === "arch") return <Architecture {...(block as any)} layers={(block as any).layers || []} />;
    if (block.kind === "pipeline") return <Pipeline {...(block as any)} stages={(block as any).stages || []} />;
    if (block.kind === "kpitree") return <KpiTree {...(block as any)} tiers={(block as any).tiers || []} guardrails={(block as any).guardrails || []} />;
    if (block.kind === "moscow") return <Moscow {...(block as any)} groups={(block as any).groups || []} />;
    if (block.kind === "attribution") return <Attribution {...(block as any)} models={(block as any).models || []} />;
    if (block.kind === "deltas") return <Deltas {...(block as any)} items={(block as any).items || []} />;
    if (block.kind === "planactual") return <PlanActual {...(block as any)} items={(block as any).items || []} months={(block as any).months || []} />;
    if (block.kind === "screens") return <Screens {...(block as any)} items={(block as any).items || []} />;
    if (block.kind === "loop") return <Loop {...(block as any)} items={(block as any).items || []} />;

    return <PairsView items={(block as any).items || []} />;
  } catch (err) {
    console.error("Error rendering block:", err);
    return null;
  }
}

function getMetricIcon(value: string, label: string, index: number) {
  const text = `${value} ${label}`.toLowerCase();
  if (text.includes("$") || text.includes("mrr") || text.includes("arr") || text.includes("revenue") || text.includes("gmv") || text.includes("cost") || text.includes("savings")) {
    return CircleDollarSign;
  }
  if (text.includes("ms") || text.includes("sec") || text.includes("min") || text.includes("hour") || text.includes("day") || text.includes("week") || text.includes("cycle") || text.includes("speed") || text.includes("fast") || text.includes("time") || text.includes("latency") || text.includes("sla")) {
    return Timer;
  }
  if (text.includes("%") || text.includes("conversion") || text.includes("adoption") || text.includes("retention") || text.includes("growth") || text.includes("active") || text.includes("signup") || text.includes("dau") || text.includes("mau") || text.includes("user")) {
    return TrendingUp;
  }
  if (text.includes("defect") || text.includes("error") || text.includes("accuracy") || text.includes("precision") || text.includes("quality") || text.includes("compliance") || text.includes("zero") || text.includes("risk")) {
    return ShieldCheck;
  }
  if (text.includes("nps") || text.includes("csat") || text.includes("satisfaction") || text.includes("rating") || text.includes("score")) {
    return Heart;
  }
  if (text.includes("ai") || text.includes("genai") || text.includes("model") || text.includes("query") || text.includes("automated") || text.includes("automation") || text.includes("processing") || text.includes("token")) {
    return Cpu;
  }
  if (text.includes("feature") || text.includes("pipeline") || text.includes("integration") || text.includes("api") || text.includes("system")) {
    return Zap;
  }

  const fallbacks = [BarChart3, Activity, Target, Award, Gauge, Sparkles];
  return fallbacks[index % fallbacks.length];
}

function getPhaseIcon(step: string, index: number) {
  const text = step.toLowerCase();
  if (text.includes("discover") || text.includes("research") || text.includes("audit") || text.includes("user needs") || text.includes("interviews") || text.includes("diagnosis") || text.includes("problem")) {
    return Search;
  }
  if (text.includes("strategy") || text.includes("alignment") || text.includes("vision") || text.includes("roadmap") || text.includes("hypothesis") || text.includes("positioning") || text.includes("goals")) {
    return Compass;
  }
  if (text.includes("design") || text.includes("ux") || text.includes("wireframe") || text.includes("prototype") || text.includes("spec") || text.includes("architecture") || text.includes("blueprint") || text.includes("framework")) {
    return Layout;
  }
  if (text.includes("build") || text.includes("engine") || text.includes("dev") || text.includes("develop") || text.includes("integration") || text.includes("code") || text.includes("pipeline") || text.includes("model") || text.includes("train")) {
    return Code2;
  }
  if (text.includes("launch") || text.includes("rollout") || text.includes("deploy") || text.includes("release") || text.includes("go-to-market") || text.includes("beta") || text.includes("scale")) {
    return Rocket;
  }
  if (text.includes("optimize") || text.includes("impact") || text.includes("metrics") || text.includes("iterate") || text.includes("measure") || text.includes("analytics") || text.includes("growth")) {
    return BarChart3;
  }

  const fallbacks = [Compass, Lightbulb, PenTool, Code2, Rocket, Activity];
  return fallbacks[index % fallbacks.length];
}

function getSectionIcon(label: string, kicker?: string, heading?: string) {
  const text = `${label} ${kicker ?? ""} ${heading ?? ""}`.toLowerCase();

  if (text.includes("executive") || text.includes("summary") || text.includes("overview") || text.includes("at a glance") || text.includes("one-pager")) {
    return LayoutGrid;
  }
  if (text.includes("business context") || text.includes("context") || text.includes("background") || text.includes("story") || text.includes("history")) {
    return Building2;
  }
  if (text.includes("outcome") || text.includes("causal") || text.includes("driver") || text.includes("impact chain")) {
    return Milestone;
  }
  if (text.includes("problem") || text.includes("challenge") || text.includes("gap") || text.includes("pain") || text.includes("root cause") || text.includes("friction")) {
    return AlertTriangle;
  }
  if (text.includes("discovery") || text.includes("insight") || text.includes("research") || text.includes("interview") || text.includes("audit") || text.includes("workshop")) {
    return Search;
  }
  if (text.includes("vocabulary") || text.includes("term") || text.includes("definition") || text.includes("glossary")) {
    return BookMarked;
  }
  if (text.includes("operating reality") || text.includes("reality") || text.includes("constraint") || text.includes("principle") || text.includes("directive")) {
    return SlidersHorizontal;
  }
  if (text.includes("target member") || text.includes("persona") || text.includes("user") || text.includes("audience") || text.includes("customer")) {
    return Users;
  }
  if (text.includes("strategy") || text.includes("approach") || text.includes("direction") || text.includes("vision") || text.includes("positioning")) {
    return Compass;
  }
  if (text.includes("ai") || text.includes("machine learning") || text.includes("intelligence") || text.includes("discipline") || text.includes("bayesian")) {
    return BrainCircuit;
  }
  if (text.includes("product") || text.includes("solution") || text.includes("recommended") || text.includes("feature") || text.includes("interface")) {
    return AppWindow;
  }
  if (text.includes("model") || text.includes("architecture") || text.includes("stack") || text.includes("system") || text.includes("framework")) {
    return Boxes;
  }
  if (text.includes("impact") || text.includes("result") || text.includes("roi") || text.includes("roas") || text.includes("sales") || text.includes("growth")) {
    return Trophy;
  }
  if (text.includes("simulation") || text.includes("diminishing") || text.includes("scenario") || text.includes("what-if") || text.includes("experiment")) {
    return Sliders;
  }
  if (text.includes("metric") || text.includes("kpi") || text.includes("tree") || text.includes("measurement")) {
    return GitFork;
  }
  if (text.includes("risk") || text.includes("honesty") || text.includes("guardrail") || text.includes("limitation") || text.includes("trade-off")) {
    return ShieldAlert;
  }
  if (text.includes("scope") || text.includes("roadmap") || text.includes("phasing") || text.includes("milestone") || text.includes("plan") || text.includes("delivery") || text.includes("lifecycle")) {
    return Target;
  }
  if (text.includes("loop") || text.includes("consumption") || text.includes("flywheel")) {
    return Repeat;
  }

  const fallbacks = [
    Building2,
    Milestone,
    Search,
    SlidersHorizontal,
    AppWindow,
    Boxes,
    Trophy,
    ShieldAlert,
    Target,
    Compass,
    BrainCircuit,
    LayoutGrid,
    BookOpen,
    Workflow,
    Users,
    GitFork,
    Repeat,
    Sparkles,
  ];
  const hash = hashString(text);
  return fallbacks[hash % fallbacks.length]!;
}

function getOnePagerIcon(key: string, value: string, index: number) {
  const k = key.toLowerCase().trim();
  const text = `${key} ${value}`.toLowerCase();

  if (k.includes("problem") || text.includes("pain point")) {
    return AlertTriangle;
  }
  if (k.includes("target user") || k.includes("user") || k.includes("audience") || k.includes("persona")) {
    return Users;
  }
  if (k.includes("root cause") || k.includes("cause") || text.includes("root cause")) {
    return Search;
  }
  if (k.includes("insight") || text.includes("discovery")) {
    return Lightbulb;
  }
  if (k.includes("solution") || k.includes("product") || k.includes("method") || text.includes("intervention")) {
    return AppWindow;
  }
  if (k.includes("mvp") || k.includes("prototype") || k.includes("pilot")) {
    return Rocket;
  }
  if (k.includes("north star") || k.includes("goal") || k.includes("kpi")) {
    return Compass;
  }
  if (k.includes("risk") || k.includes("guardrail") || k.includes("threat")) {
    return ShieldAlert;
  }
  if (k.includes("next step") || k.includes("roadmap") || k.includes("milestone") || k.includes("action")) {
    return Milestone;
  }
  if (k.includes("impact") || k.includes("outcome") || k.includes("metric") || k.includes("result")) {
    return TrendingUp;
  }

  const fallbacks = [
    AlertTriangle,
    Users,
    Search,
    Lightbulb,
    AppWindow,
    Rocket,
    Compass,
    ShieldAlert,
    Milestone,
    TrendingUp,
    Key,
    Zap,
    Target,
    Boxes,
  ];
  return fallbacks[index % fallbacks.length]!;
}

interface CaseStudyViewProps {
  slug: string;
  onNavigate: (tab: "work" | "contact", slug?: string) => void;
}

export function CaseStudyView({ slug, onNavigate }: CaseStudyViewProps) {
  const [paletteVer, setPaletteVer] = useState(0);

  const [previewPaletteId, setPreviewPaletteId] = useState<ColorPaletteId | null>(null);

  useEffect(() => {
    const handlePaletteChange = () => {
      setPreviewPaletteId(null);
      setPaletteVer((v) => v + 1);
    };
    const handlePalettePreview = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.isPreview && customEvent.detail?.paletteId) {
        setPreviewPaletteId(customEvent.detail.paletteId as ColorPaletteId);
      } else {
        setPreviewPaletteId(null);
      }
      setPaletteVer((v) => v + 1);
    };

    window.addEventListener("gks_palette_changed", handlePaletteChange);
    window.addEventListener("gks_palette_preview", handlePalettePreview);
    return () => {
      window.removeEventListener("gks_palette_changed", handlePaletteChange);
      window.removeEventListener("gks_palette_preview", handlePalettePreview);
    };
  }, []);

  const project = getProject(slug) || projects[0]!;
  const next = nextProject(project.slug);
  const prev = prevProject(project.slug);
  const [readPercent, setReadPercent] = useState(0);
  const [activeSection, setActiveSection] = useState<string>(project.sections[0]?.label || "");
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isLight, setIsLight] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("light");
    }
    return false;
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const updateTheme = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    setActiveSection(project.sections[0]?.label || "");
  }, [project.slug]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sectionElements = project.sections.map((s) => ({
            label: s.label,
            el: document.getElementById(`s-${s.label}`),
          }));

          const scrollPos = window.scrollY + 180;
          let current = project.sections[0]?.label || "";

          for (const { label, el } of sectionElements) {
            if (el) {
              const top = el.offsetTop;
              if (scrollPos >= top) {
                current = label;
              }
            }
          }
          setActiveSection(current);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [project.sections]);

  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, label: string) => {
    e.preventDefault();
    const el = document.getElementById(`s-${label}`);
    if (el) {
      const offsetTop = el.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      setActiveSection(label);
    }
  };

  useMotionValueEvent(progress, "change", (latest) => {
    setReadPercent(Math.min(100, Math.max(0, Math.round(latest * 100))));
  });

  const effectiveTheme = getProjectThemeOverride(project.slug, previewPaletteId) || project.theme;

  return (
    <article className="px-6 pb-24 pt-32 md:px-12 md:pt-40 lg:px-16" data-case-theme>
      <style
        dangerouslySetInnerHTML={{
          __html: `article[data-case-theme]{--accent:${effectiveTheme.accent};--color-accent:${effectiveTheme.accent};--color-accent-foreground:${effectiveTheme.accentForeground}}.light article[data-case-theme]{--accent:${effectiveTheme.accentLight};--color-accent:${effectiveTheme.accentLight};--color-accent-foreground:${effectiveTheme.accentLightForeground}}`,
        }}
      />
      {/* Top Reading Progress Bar */}
      <div className="fixed inset-x-0 top-0 z-[70] h-1 bg-border/30 backdrop-blur-xs pointer-events-none">
        <motion.div
          aria-hidden
          style={{ scaleX: progress }}
          className="h-full origin-left bg-accent"
        />
      </div>

      <div className="mx-auto max-w-[1500px]">
        {/* Navigation & AI Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate("work")}
            className="label-mono hover:text-accent cursor-pointer inline-flex items-center gap-1.5 transition-colors font-semibold group text-xs text-muted-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Selected work</span>
          </button>

          <button
            type="button"
            onClick={() => {
              track("open_ai_assistant", {
                trigger: "case_study_header_drawer",
                slug: project.slug,
                title: project.title,
              });
              setIsAiDrawerOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-all cursor-pointer"
          >
            <Sparkles className="size-3.5" />
            <span>Ask PM About This Case</span>
          </button>
        </div>

        {/* Minimalist Hero Section */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-0.5 text-[0.7rem] font-semibold text-accent label-mono">
            <Building2 className="size-3" />
            Case study {project.index} / {String(projects.length).padStart(2, "0")} · {project.client}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card/80 border border-border/30 px-3 py-0.5 text-[0.7rem] text-muted-foreground label-mono">
            <Tag className="size-3" />
            {project.category}
          </span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="display-xl mt-3 max-w-[16ch] font-bold tracking-tight text-foreground"
        >
          {project.title}
        </motion.h1>

        {/* Back to top button positioned prominently below heading where circled */}
        <div className="my-4 flex items-center">
          <button
            id="hero-back-to-top-button"
            type="button"
            onClick={() => {
              track("back_to_top_click", { from: "case_study_title_apex" });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-2 text-xs font-bold text-accent backdrop-blur-md transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:shadow-[0_0_20px_var(--color-accent)] hover:scale-105 cursor-pointer"
            aria-label="Back to top"
          >
            <motion.span
              className="inline-flex items-center justify-center text-current"
              animate={{ y: [0, -3.5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowUp className="size-4 stroke-[2.5] transition-transform duration-300 group-hover:-translate-y-1" />
            </motion.span>
            <span className="tracking-wide uppercase text-[0.72rem] label-mono">Back to top</span>
          </button>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 max-w-3xl font-display text-lg leading-relaxed tracking-tight md:text-2xl text-foreground/90 font-normal"
        >
          {project.summary}
        </motion.p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-card/60 border border-border/30 px-3 py-0.5 text-[0.7rem] text-muted-foreground transition-all hover:text-accent hover:bg-card"
            >
              {t}
            </span>
          ))}
        </div>

        <dl className="mt-8 grid gap-2 sm:grid-cols-3 rounded-xl overflow-hidden">
          <div className="bg-card/60 py-4 px-5 rounded-xl border border-border/20">
            <dt className="label-mono flex items-center gap-1.5 text-xs text-muted-foreground">
              <Briefcase className="size-3.5 text-accent" />
              <span>My role</span>
            </dt>
            <dd className="mt-1 text-xs sm:text-sm text-foreground font-medium">{project.role}</dd>
          </div>
          <div className="bg-card/60 py-4 px-5 rounded-xl border border-border/20">
            <dt className="label-mono flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="size-3.5 text-accent" />
              <span>Worked with</span>
            </dt>
            <dd className="mt-1 text-xs sm:text-sm text-foreground font-medium">{project.team}</dd>
          </div>
          <div className="bg-card/60 py-4 px-5 rounded-xl border border-border/20">
            <dt className="label-mono flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3.5 text-accent" />
              <span>Timeline</span>
            </dt>
            <dd className="mt-1 text-xs sm:text-sm text-foreground font-medium">{project.timeline}</dd>
          </div>
        </dl>

        {/* Key Project Outcomes - Quantum KPI Telemetry Console */}
        <div className="mt-8">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-xl bg-accent/15 text-accent shadow-sm">
                <BarChart2 className="size-4" />
              </span>
              <div>
                <h3 className="label-mono font-bold uppercase tracking-wider text-xs text-foreground flex items-center gap-2">
                  Measured Impact & Outcomes
                  <span className="inline-block size-1.5 rounded-full bg-accent animate-ping" />
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[0.68rem] label-mono">
              <span className="inline-flex items-center gap-1.5 text-accent bg-accent/10 px-2.5 py-1 rounded-full font-bold">
                <CheckCheck className="size-3.5" />
                {project.metrics.length} Validated KPIs
              </span>
            </div>
          </div>

          {/* Unified KPI Grid */}
          <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3">
            {project.metrics.map((m, i) => {
              const MetricIcon = getMetricIcon(m.value, m.label, i);

              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: "some" }}
                  transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col justify-between rounded-2xl border border-border/40 bg-card/60 p-5 transition-all duration-300 hover:border-accent/40 hover:bg-card/90 hover:shadow-md"
                >
                  <div>
                    {/* Top Row: KPI Number opposite Metric Icon */}
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-accent md:text-5xl">
                        {m.value}
                      </p>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                        <MetricIcon className="size-4.5" />
                      </span>
                    </div>

                    {/* Metric Label */}
                    <p className="mt-3 text-xs sm:text-sm font-medium text-foreground leading-snug">
                      {m.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stepped Execution Lifecycle - Static Command HUD Stepper Ribbon */}
        <Reveal className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-border/40 bg-card p-5 sm:p-6 shadow-sm">
            {/* Header Control Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-xl bg-accent/15 text-accent shadow-xs">
                  <Workflow className="size-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="label-mono font-bold uppercase tracking-wider text-xs text-foreground">
                      Execution Lifecycle
                    </p>
                    <span className="size-1.5 rounded-full bg-accent" />
                  </div>
                  {project.flowCaption && (
                    <p className="text-[0.72rem] text-muted-foreground font-mono mt-0.5">
                      {project.flowCaption}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-[0.68rem] label-mono text-accent bg-accent/10 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 border border-accent/20">
                <Milestone className="size-3.5" />
                {project.flow.length} Sequential Milestones
              </span>
            </div>

            {/* Linear Pipeline Track - Equal Column Nodes */}
            <div className="relative">
              {/* Connecting Conduit Line across center of node pins (desktop) */}
              <div className="hidden lg:block absolute left-12 right-12 top-[32px] -translate-y-1/2 h-0.5 bg-gradient-to-r from-accent/20 via-accent/60 to-accent/20 z-0" />

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-flow-col lg:auto-cols-fr gap-4 sm:gap-6 relative z-10">
                {project.flow.map((step, i) => {
                  const PhaseIcon = getPhaseIcon(step, i);
                  const isLast = i === project.flow.length - 1;

                  return (
                    <div
                      key={step}
                      className="flex flex-col items-start lg:items-center text-left lg:text-center p-3 rounded-xl bg-card/60 border border-border/30 lg:border-transparent lg:bg-transparent"
                    >
                      {/* Node Pin Circle - Centered on Line without any overlapping badges */}
                      <div className="relative mb-2.5 flex items-center justify-center z-10">
                        <span
                          className={`flex size-10 items-center justify-center rounded-xl border text-xs font-mono font-bold shadow-xs ${
                            isLast
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-border/60 bg-card text-accent"
                          }`}
                        >
                          <PhaseIcon className="size-4" />
                        </span>
                      </div>

                      {/* Standalone Serial Number Badge */}
                      <div className="mb-1 flex items-center justify-center">
                        <span className="font-mono text-xs font-bold text-accent tracking-wider">
                          0{i + 1}
                        </span>
                      </div>

                      {/* Milestone Title */}
                      <p className="font-display text-xs sm:text-sm font-bold tracking-tight text-foreground leading-snug">
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Sections layout with sticky navigation */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <nav aria-label="Case study sections" className="lg:sticky lg:top-28 lg:self-start z-30 rounded-xl border border-transparent bg-card/60 p-3.5 backdrop-blur-md">
            <div className="flex items-center justify-between text-accent">
              <div className="flex items-center gap-1.5">
                <Compass className="size-3.5" />
                <p className="label-mono font-semibold text-xs uppercase tracking-wider">Sections</p>
              </div>
              <span className="text-[0.65rem] label-mono px-2 py-0.5 rounded-md bg-accent/15 font-bold text-accent">
                {activeSection ? `Section ${activeSection}` : "Overview"}
              </span>
            </div>
            <ul className="mt-3 space-y-1">
              {project.sections.map((s) => {
                const SecNavIcon = getSectionIcon(s.label, s.kicker, s.heading);
                const isActive = activeSection === s.label;
                return (
                  <li key={s.label}>
                    <a
                      href={`#s-${s.label}`}
                      onClick={(e) => scrollToSection(e, s.label)}
                      className={`label-mono relative group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors duration-200 font-medium ${
                        isActive
                          ? "text-accent font-semibold"
                          : "text-muted-foreground hover:bg-card/80 hover:text-accent"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="activeSectionIndicator"
                          className="absolute inset-0 rounded-lg bg-accent/15"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="flex items-center gap-2 truncate z-10">
                        <span className={`flex size-4.5 shrink-0 items-center justify-center rounded text-[0.62rem] transition-colors duration-200 ${
                          isActive
                            ? "bg-accent/20 text-accent font-bold"
                            : "bg-secondary text-muted-foreground group-hover:bg-accent/20 group-hover:text-accent"
                        }`}>
                          {s.label}
                        </span>
                        <SecNavIcon className={`size-3.5 shrink-0 transition-colors duration-200 ${
                          isActive ? "text-accent" : "text-muted-foreground/70 group-hover:text-accent"
                        }`} />
                        <span className={`truncate transition-colors duration-200 text-xs ${
                          isActive ? "text-accent font-semibold" : "text-muted-foreground group-hover:text-accent font-medium"
                        }`}>{s.kicker ?? s.heading}</span>
                      </span>
                      <ChevronRight className={`size-3 shrink-0 transition-all duration-200 z-10 ${
                        isActive ? "translate-x-0.5 text-accent opacity-100" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent"
                      }`} />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between text-xs label-mono mb-1.5">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium text-[0.7rem]">
                  <Activity className="size-3 text-accent" />
                  <span>Reading progress</span>
                </span>
                <span className="text-accent font-bold text-[0.7rem]">{readPercent}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary/80 overflow-hidden border border-border/30">
                <motion.div
                  style={{ scaleX: progress }}
                  className="h-full bg-accent origin-left rounded-full"
                />
              </div>
            </div>
          </nav>

          <div className="space-y-4 sm:space-y-4.5">
            {project.sections.map((s, sectionIdx) => {
              const SectionHeaderIcon = getSectionIcon(s.label, s.kicker, s.heading);
              const isActive = activeSection === s.label;
              const theme = UNIFIED_SECTION_THEME;

              return (
                <motion.section
                  key={s.label}
                  id={`s-${s.label}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: "some" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`scroll-mt-28 relative rounded-xl border p-3.5 sm:p-4.5 md:p-5 lg:p-5.5 transition-all duration-200 ${
                    isActive
                      ? `${theme.borderActive} ${theme.bgActive}`
                      : `border-transparent bg-card/60 hover:border-border/30`
                  }`}
                >
                  {/* Active Left Indicator Bar */}
                  {isActive && (
                    <span
                      aria-hidden
                      className={`absolute left-0 top-4 bottom-4 w-[1px] ${theme.barColor}`}
                    />
                  )}

                  <Reveal>
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 font-mono font-semibold text-xs transition-colors duration-200 ${
                          isActive
                            ? theme.badgeActive
                            : theme.badgeInactive
                        }`}>
                          <SectionHeaderIcon className="size-3.5 text-accent" />
                          Section {s.label}
                        </span>
                        {s.kicker && (
                          <span className={`font-mono text-[0.7rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${theme.tagBg}`}>
                            {s.kicker}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[0.68rem] text-muted-foreground font-medium bg-secondary/80 px-2 py-0.5 rounded-md">
                          Phase 0{sectionIdx + 1} of {project.sections.length}
                        </span>
                        {isActive && (
                          <span className={`inline-flex items-center gap-1.5 text-[0.65rem] font-mono px-2 py-0.5 rounded-md font-semibold ${theme.pillActive}`}>
                            <span className="size-1.5 rounded-full bg-accent" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    <h2 className="mt-2.5 mb-1 font-display text-lg sm:text-xl font-bold tracking-tight md:text-2xl text-foreground leading-snug">
                      {s.heading}
                    </h2>
                  </Reveal>

                  <div className="mt-3.5 space-y-3.5 md:space-y-4">
                    {s.blocks.map((b, i) => (
                      <div key={i} className="relative">
                        <Block block={b} />
                      </div>
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </div>
        </div>

        {/* PM Strategic Decision Simulator */}
        <Reveal className="mt-10">
          <PmDecisionSimulator project={project} />
        </Reveal>

        {/* The case in one screen */}
        <Reveal className="mt-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-accent" />
            <p className="label-mono font-semibold text-xs">PM decision summary</p>
          </div>
          <h2 className="display-lg mt-2 text-2xl font-bold">The case in one screen</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(() => {
              const usedOnePagerIcons = new Set<any>();
              return project.onePager.map((o, i) => {
                let OnePagerIcon = getOnePagerIcon(o.k, o.v, i);
                if (usedOnePagerIcons.has(OnePagerIcon)) {
                  const fallbackList = [
                    AlertTriangle,
                    Users,
                    Search,
                    Lightbulb,
                    AppWindow,
                    Rocket,
                    Compass,
                    ShieldAlert,
                    Milestone,
                    TrendingUp,
                    Key,
                    Zap,
                    Target,
                    Boxes,
                    Sparkles,
                  ];
                  const alt = fallbackList.find((ic) => !usedOnePagerIcons.has(ic));
                  if (alt) OnePagerIcon = alt;
                }
                usedOnePagerIcons.add(OnePagerIcon);

                return (
                  <motion.div
                    key={o.k}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: "some" }}
                    transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative rounded-xl border border-border/50 bg-card/90 p-4.5 sm:p-5 transition-all duration-300 hover:border-accent/50 hover:shadow-md overflow-hidden"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                        <OnePagerIcon className="size-3.5 shrink-0" />
                      </span>
                      <p className="label-mono font-bold text-foreground transition-colors group-hover:text-accent text-xs">
                        {o.k}
                      </p>
                    </div>
                    <p className="mt-3 text-sm text-foreground/90 leading-relaxed font-medium">{o.v}</p>
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent transition-all duration-500 group-hover:w-full"
                    />
                  </motion.div>
                );
              });
            })()}
          </div>
        </Reveal>

        {/* Next / Previous Project Navigation */}
        <nav
          aria-label="Project navigation"
          className="mt-16 grid gap-4 sm:grid-cols-2"
        >
          <a
            href={`#work/${prev.slug}`}
            onClick={(e) => {
              track("click_case_study", {
                slug: prev.slug,
                title: prev.title,
                from: "case_study_navigation_prev",
                currentSlug: project.slug,
              });
              onNavigate("work", prev.slug);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group rounded-2xl border border-border/40 bg-card/70 p-8 text-left transition-all hover:border-accent/50 cursor-pointer"
          >
            <span className="label-mono inline-flex items-center gap-2 font-semibold">
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />{" "}
              Previous Case Study
            </span>
            <p className="mt-3 font-display text-2xl font-bold tracking-tight group-hover:text-accent">
              {prev.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{prev.category}</p>
          </a>

          <a
            href={`#work/${next.slug}`}
            onClick={(e) => {
              track("click_case_study", {
                slug: next.slug,
                title: next.title,
                from: "case_study_navigation_next",
                currentSlug: project.slug,
              });
              onNavigate("work", next.slug);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group rounded-2xl border border-border/40 bg-card/70 p-8 text-right transition-all hover:border-accent/50 cursor-pointer"
          >
            <span className="label-mono inline-flex items-center gap-2 font-semibold">
              Next Case Study{" "}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </span>
            <p className="mt-3 font-display text-2xl font-bold tracking-tight group-hover:text-accent">
              {next.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{next.category}</p>
          </a>
        </nav>
      </div>

      <ContactCTA onNavigate={onNavigate} />

      {/* Case Study AI Assistant Drawer */}
      <CaseStudyAiDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        project={project}
      />
    </article>
  );
}
