import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Target,
  Brain,
  Database,
  Users,
  Rocket,
  Shield,
  Gauge,
  Sparkles,
  Layers,
  TrendingUp,
  Compass,
  Cpu,
  FolderKanban,
  Clock,
  LineChart,
  Boxes,
  Hexagon,
  CheckCheck,
  SlidersHorizontal,
  ShieldCheck,
  Layers3,
  Workflow,
  Activity,
  FileText,
  Lightbulb,
  Milestone,
  UserCheck,
  BarChart2,
  CheckCircle2,
  XCircle,
  Info,
  ArrowDown,
  ArrowRight,
  Server,
  Key,
  Smartphone,
} from "lucide-react";
import type { IconName } from "@/types";

const ICONS: Record<IconName, React.ComponentType<{ className?: string }>> = {
  target: Target,
  brain: Brain,
  database: Database,
  users: Users,
  rocket: Rocket,
  shield: Shield,
  gauge: Gauge,
  sparkles: Sparkles,
  layers: Layers,
  trending: TrendingUp,
  compass: Compass,
  cpu: Cpu,
  folderKanban: FolderKanban,
  clock: Clock,
  lineChart: LineChart,
  boxes: Boxes,
  hexagon: Hexagon,
  checkCheck: CheckCheck,
  sliders: SlidersHorizontal,
  shieldCheck: ShieldCheck,
  layers3: Layers3,
  workflow: Workflow,
  activity: Activity,
  fileText: FileText,
  lightbulb: Lightbulb,
  milestone: Milestone,
  userCheck: UserCheck,
  barChart: BarChart2,
};

const EASE = [0.16, 1, 0.3, 1] as const;

function Frame({ title, children }: { title?: string | undefined; children: React.ReactNode }) {
  return (
    <figure className="rounded-2xl border border-border/20 bg-card/30 p-6 md:p-8 backdrop-blur-sm">
      {title && <figcaption className="label-mono mb-5 text-foreground font-semibold">{title}</figcaption>}
      {children}
    </figure>
  );
}

export function Bars({
  title,
  unit,
  max,
  items,
}: {
  title?: string;
  unit?: string;
  max?: number;
  items: { label: string; value: number; note?: string; highlight?: boolean }[];
}) {
  const top = max ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <Frame title={title}>
      <ul className="space-y-5">
        {items.map((it, i) => (
          <li key={it.label}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-foreground">{it.label}</span>
              <span
                className={`font-display text-lg tracking-tight font-semibold ${
                  it.highlight ? "text-accent" : "text-foreground"
                }`}
              >
                {it.value}
                {unit ? <span className="ml-1 text-xs text-muted-foreground">{unit}</span> : null}
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(100, (it.value / top) * 100)}%` }}
                viewport={{ once: true, amount: "some" }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
                className={`h-full rounded-full ${
                  it.highlight ? "bg-accent shadow-[0_0_12px_var(--color-accent)]" : "bg-accent/45"
                }`}
              />
            </div>
            {it.note && <p className="mt-1.5 text-xs text-muted-foreground">{it.note}</p>}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function Donut({
  title,
  items,
}: {
  title?: string;
  items: { label: string; value: number }[];
}) {
  const total = items.reduce((a, b) => a + b.value, 0) || 1;
  const C = 2 * Math.PI * 40;
  let offset = 0;
  const opacities = [1, 0.78, 0.58, 0.4, 0.26, 0.18];

  return (
    <Frame title={title}>
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
        <svg viewBox="0 0 100 100" className="size-44 shrink-0 -rotate-90">
          {items.map((it, i) => {
            const len = (it.value / total) * C;
            const dash = `${len} ${C - len}`;
            const el = (
              <motion.circle
                key={it.label}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="var(--color-accent)"
                strokeOpacity={opacities[i % opacities.length]}
                strokeWidth="14"
                strokeDasharray={dash}
                initial={{ strokeDashoffset: -offset - C }}
                whileInView={{ strokeDashoffset: -offset }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <ul className="w-full space-y-3">
          {items.map((it, i) => (
            <li key={it.label} className="flex items-center gap-3 text-sm">
              <span
                aria-hidden
                className="size-3 shrink-0 rounded-sm bg-accent"
                style={{ opacity: opacities[i % opacities.length] }}
              />
              <span className="flex-1 text-muted-foreground">{it.label}</span>
              <span className="font-display font-semibold tracking-tight">{it.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

export function Curve({
  title,
  caption,
  xLabel,
  yLabel,
  points,
  markerIndex,
  markerLabel,
}: {
  title?: string;
  caption?: string;
  xLabel: string;
  yLabel: string;
  points: number[];
  markerIndex?: number;
  markerLabel?: string;
}) {
  const w = 300;
  const h = 150;
  const maxY = Math.max(...points, 1);
  const coords = points.map((p, i) => ({
    x: (i / (points.length - 1)) * w,
    y: h - (p / maxY) * h,
  }));
  const d = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const marker = markerIndex != null ? coords[markerIndex] : undefined;

  return (
    <Frame title={title}>
      <div className="relative">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible">
          <defs>
            <linearGradient id="curve-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((g) => (
            <line
              key={g}
              x1="0"
              x2={w}
              y1={h * g}
              y2={h * g}
              stroke="var(--color-border)"
              strokeWidth="0.5"
            />
          ))}
          <motion.path
            d={`${d} L${w},${h} L0,${h} Z`}
            fill="url(#curve-fill)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.path
            d={d}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE }}
          />
          {marker && (
            <>
              <line
                x1={marker.x}
                x2={marker.x}
                y1={marker.y}
                y2={h}
                stroke="var(--color-accent)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <motion.circle
                cx={marker.x}
                cy={marker.y}
                r="5"
                fill="var(--color-accent)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2, type: "spring", stiffness: 240, damping: 16 }}
              />
            </>
          )}
        </svg>
        {markerLabel && <p className="label-mono mt-3 text-accent font-semibold">{markerLabel}</p>}
        <div className="mt-2 flex justify-between">
          <span className="label-mono">{xLabel}</span>
          <span className="label-mono">{yLabel}</span>
        </div>
      </div>
      {caption && <p className="mt-5 max-w-xl text-sm text-muted-foreground">{caption}</p>}
    </Frame>
  );
}

export function Compare({
  title,
  items,
}: {
  title?: string;
  items: { label: string; before: string; after: string; delta?: string }[];
}) {
  return (
    <Frame title={title}>
      <ul className="divide-y divide-border">
        {items.map((it, i) => (
          <motion.li
            key={it.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
            className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-[minmax(0,1.2fr)_auto_auto_auto] sm:items-center"
          >
            <span className="col-span-2 text-sm sm:col-span-1">{it.label}</span>
            <span className="font-display text-lg tracking-tight text-muted-foreground line-through decoration-border">
              {it.before}
            </span>
            <span className="font-display text-lg tracking-tight text-accent font-semibold">{it.after}</span>
            {it.delta && (
              <span className="justify-self-start rounded-full bg-accent/15 px-3 py-1 text-xs text-accent sm:justify-self-end font-mono">
                {it.delta}
              </span>
            )}
          </motion.li>
        ))}
      </ul>
    </Frame>
  );
}

export function Cards({
  items,
}: {
  items: { icon: IconName; title: string; body: string }[];
}) {
  const usedIcons = new Set<any>();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => {
        let Icon = it.icon ? ICONS[it.icon] : undefined;
        if (!Icon) {
          const t = it.title.toLowerCase();
          const text = `${it.title} ${it.body}`.toLowerCase();
          if (t === "platform" || t.includes("platform strategy") || text.includes("platform") || text.includes("cloud platform") || text.includes("backend") || text.includes("server")) {
            Icon = Server;
          } else if (t === "identity" || t.includes("user identity") || text.includes("identity") || text.includes("auth") || text.includes("sso") || text.includes("login")) {
            Icon = Key;
          } else if (t === "observability" || t.includes("monitoring & logs") || text.includes("observability") || text.includes("telemetry") || text.includes("log") || text.includes("crash")) {
            Icon = Activity;
          } else if (t === "roles" || text.includes("permission") || text.includes("role")) {
            Icon = UserCheck;
          } else if (text.includes("native") || text.includes("mobile capability") || text.includes("push") || text.includes("camera")) {
            Icon = Smartphone;
          } else if (text.includes("security") || text.includes("shield") || text.includes("perimeter") || text.includes("control")) {
            Icon = ShieldCheck;
          } else if (text.includes("desk-less") || text.includes("workforce") || text.includes("user") || text.includes("employee") || text.includes("people")) {
            Icon = Users;
          } else if (text.includes("ai") || text.includes("brain") || text.includes("assistant") || text.includes("model")) {
            Icon = Brain;
          } else {
            const fallbackList = [ShieldCheck, Users, Database, Compass, Layers, Cpu, Brain, Rocket, Target, Sparkles];
            Icon = fallbackList[i % fallbackList.length]!;
          }
        }

        if (usedIcons.has(Icon)) {
          const altList = [Server, Key, Activity, UserCheck, Smartphone, ShieldCheck, Users, Database, Compass, Layers, Cpu, Brain, Rocket, Target, Sparkles, CheckCheck, Workflow];
          const alt = altList.find((ic) => !usedIcons.has(ic));
          if (alt) Icon = alt;
        }
        usedIcons.add(Icon);

        return (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
            className="group rounded-2xl border border-border/20 bg-card/50 p-6 transition-all hover:border-accent/40"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110 shadow-sm">
              <Icon className="size-5" />
            </span>
            <p className="mt-5 font-display text-lg tracking-tight font-semibold text-foreground transition-colors group-hover:text-accent">{it.title}</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.body}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

export function Phases({
  items,
}: {
  items: { when: string; what: string; detail?: string }[];
}) {
  return (
    <ol className="relative ml-3 border-l border-border pl-8 space-y-6">
      {items.map((it, i) => (
        <motion.li
          key={it.when}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ duration: 0.5, delay: i * 0.09, ease: EASE }}
          className="relative"
        >
          <span
            aria-hidden
            className="absolute -left-[2.3rem] top-1.5 size-3 rounded-full border-2 border-accent bg-background"
          />
          <p className="label-mono text-accent font-semibold">{it.when}</p>
          <p className="mt-1 font-display text-xl tracking-tight font-semibold">{it.what}</p>
          {it.detail && <p className="mt-1 text-sm text-muted-foreground">{it.detail}</p>}
        </motion.li>
      ))}
    </ol>
  );
}

export function Cohorts({
  a,
  b,
  items,
}: {
  a: string;
  b: string;
  items: { label: string; a: number; b: number }[];
}) {
  return (
    <Frame>
      <div className="flex items-center justify-between">
        <span className="label-mono text-accent font-semibold">{a}</span>
        <span className="label-mono">{b}</span>
      </div>
      <ul className="mt-6 space-y-6">
        {items.map((it, i) => (
          <li key={it.label}>
            <p className="text-center text-sm text-muted-foreground">{it.label}</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="w-10 text-right font-display text-sm tracking-tight text-accent font-semibold">
                {it.a}%
              </span>
              <div className="flex flex-1 justify-end">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${it.a}%` }}
                  viewport={{ once: true, amount: "some" }}
                  transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
                  className="h-2.5 rounded-l-full bg-accent"
                />
              </div>
              <span aria-hidden className="h-6 w-px bg-border" />
              <div className="flex flex-1">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${it.b}%` }}
                  viewport={{ once: true, amount: "some" }}
                  transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
                  className="h-2.5 rounded-r-full bg-accent/35"
                />
              </div>
              <span className="w-10 font-display text-sm tracking-tight text-muted-foreground">
                {it.b}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function Persona({
  name,
  tagline,
  meta,
  quote,
  stats,
  basket,
  missions,
  flag,
}: {
  name: string;
  tagline: string;
  meta: string[];
  quote: string;
  stats: { value: string; label: string }[];
  basket: { label: string; value: number }[];
  missions: string[];
  flag?: string;
}) {
  const initial = name.charAt(0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="overflow-hidden rounded-2xl border border-accent/30 bg-card/40"
    >
      <div className="grid gap-8 bg-accent/[0.07] p-6 md:grid-cols-[auto_minmax(0,1fr)] md:p-8">
        <div className="flex items-center gap-5 md:flex-col md:items-start">
          <motion.span
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="grid size-20 shrink-0 place-items-center rounded-full bg-accent font-display text-3xl font-bold text-accent-foreground md:size-24 md:text-4xl shadow-lg"
          >
            {initial}
          </motion.span>
          <div>
            <p className="label-mono text-accent font-semibold">User persona</p>
            <p className="font-display text-3xl tracking-tight font-bold md:text-4xl">{name}</p>
          </div>
        </div>

        <div>
          <p className="font-display text-xl leading-snug tracking-tight font-semibold md:text-2xl">{tagline}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {meta.map((m) => (
              <li
                key={m}
                className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
              >
                {m}
              </li>
            ))}
          </ul>
          <blockquote className="mt-5 border-l-2 border-accent pl-5 text-sm italic text-muted-foreground">
            “{quote}”
          </blockquote>
        </div>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
            className="bg-card p-5"
          >
            <p className="font-display text-2xl tracking-tight text-accent font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 border-t border-border p-6 md:grid-cols-2 md:p-8">
        <div>
          <p className="label-mono font-semibold">Basket composition</p>
          <ul className="mt-4 space-y-2.5">
            {basket.map((b, i) => (
              <li key={b.label} className="flex items-center gap-3 text-sm">
                <span className="w-32 shrink-0 text-muted-foreground">{b.label}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min(100, b.value * 2.6)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
                    className="block h-full rounded-full bg-accent"
                  />
                </span>
                <span className="w-9 text-right font-display text-sm font-semibold">{b.value}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label-mono font-semibold">Shopping missions</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {missions.map((m) => (
              <li
                key={m}
                className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent font-medium"
              >
                {m}
              </li>
            ))}
          </ul>
          {flag && (
            <p className="mt-5 border-l-2 border-accent pl-4 text-sm text-muted-foreground leading-relaxed">
              {flag}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Graph({
  center,
  nodes,
  caption,
}: {
  center: string;
  nodes: { label: string; hint: string }[];
  caption?: string;
}) {
  const R = 38;
  return (
    <Frame>
      <div className="relative mx-auto aspect-square w-full max-w-[540px]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
          {nodes.map((n, i) => {
            const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + R * Math.cos(a);
            const y = 50 + R * Math.sin(a);
            return (
              <motion.line
                key={n.label}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                stroke="var(--color-accent)"
                strokeWidth="0.35"
                strokeOpacity={0.6}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: EASE }}
              />
            );
          })}
        </svg>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 190, damping: 18 }}
          className="absolute left-1/2 top-1/2 z-10 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent px-3 text-center font-display text-sm font-semibold leading-tight tracking-tight text-accent-foreground md:size-28 md:text-base shadow-xl"
        >
          {center}
        </motion.div>

        {nodes.map((n, i) => {
          const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + R * Math.cos(a);
          const y = 50 + R * Math.sin(a);
          return (
            <motion.div
              key={n.label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE }}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute z-10 w-28 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card px-3 py-2.5 text-center md:w-32 shadow-md"
            >
              <p className="text-xs font-semibold leading-tight text-foreground">{n.label}</p>
              <p className="mt-1 text-[0.65rem] leading-tight text-muted-foreground">{n.hint}</p>
            </motion.div>
          );
        })}
      </div>
      {caption && <p className="mt-6 text-sm text-muted-foreground">{caption}</p>}
    </Frame>
  );
}

export function Steps({
  items,
  caption,
}: {
  items: { title: string; body: string }[];
  caption?: string;
}) {
  return (
    <div>
      <ol className="relative space-y-0 border-l border-border pl-0">
        {items.map((s, i) => (
          <motion.li
            key={s.title}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
            className="group relative flex gap-5 py-4 pl-6"
          >
            <span className="absolute -left-px top-0 h-full w-px bg-transparent transition-colors group-hover:bg-accent" />
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/15 font-display text-sm font-semibold text-accent">
              {i + 1}
            </span>
            <span>
              <span className="block font-display text-lg tracking-tight font-semibold text-foreground">{s.title}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{s.body}</span>
            </span>
          </motion.li>
        ))}
      </ol>
      {caption && <p className="mt-4 text-sm text-muted-foreground">{caption}</p>}
    </div>
  );
}

export function DataTable({
  title,
  columns,
  rows,
  caption,
}: {
  title?: string;
  columns: string[];
  rows: { cells: string[]; highlight?: boolean }[];
  caption?: string;
}) {
  return (
    <Frame title={title}>
      <div className="-mx-2 overflow-x-auto px-2">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c}
                  className="label-mono border-b border-border pb-3 pr-4 font-semibold text-foreground align-bottom"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <motion.tr
                key={r.cells[0]! + i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: "some" }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
                className={r.highlight ? "bg-accent/[0.09]" : ""}
              >
                {r.cells.map((c, j) => (
                  <td
                    key={j}
                    className={`border-b border-border py-3 pr-4 align-top ${
                      j === 0
                        ? "font-semibold text-foreground"
                        : r.highlight
                          ? "text-accent font-medium"
                          : "text-muted-foreground"
                    }`}
                  >
                    {c}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <p className="mt-5 text-sm text-muted-foreground">{caption}</p>}
    </Frame>
  );
}

export function Options({
  items,
  caption,
}: {
  items: { title: string; body: string; note?: string; selected?: boolean }[];
  caption?: string;
}) {
  return (
    <div className="space-y-3.5">
      {/* Comprehensive Architecture Matrix Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5">
        <div className="flex items-center gap-2">
          <Compass className="size-4 text-accent" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
            Architectural Trade-Off Analysis & Decision Matrix
          </span>
        </div>
        <span className="font-mono text-[0.68rem] px-2 py-0.5 rounded-md bg-accent/15 text-accent font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="size-3 text-accent" />
          {items.filter((o) => o.selected).length || 1} Selected Approach
        </span>
      </div>

      {/* Grid of All Evaluated Approaches Displayed Simultaneously */}
      <div className="grid gap-3 md:grid-cols-3 items-stretch">
        {items.map((o, i) => {
          return (
            <motion.div
              key={o.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
              className={`relative flex flex-col justify-between rounded-xl border p-4 sm:p-5 transition-all duration-200 ${
                o.selected
                  ? "border-accent/50 bg-card ring-1 ring-accent/30"
                  : "border-border/40 bg-card/70 hover:border-accent/40"
              }`}
            >
              <div>
                {/* Header Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="font-mono text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    Approach 0{i + 1}
                  </span>
                  {o.selected ? (
                    <span className="inline-flex items-center gap-1.5 font-mono rounded-md bg-accent/15 px-2 py-0.5 text-[0.65rem] font-bold text-accent">
                      <CheckCircle2 className="size-3" />
                      Chosen Directive
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-mono rounded-md bg-secondary px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground/80">
                      <XCircle className="size-3 text-muted-foreground/60" />
                      Evaluated & Dismissed
                    </span>
                  )}
                </div>

                <h3
                  className={`font-display text-base font-bold tracking-tight md:text-lg ${
                    o.selected ? "text-accent" : "text-foreground"
                  }`}
                >
                  {o.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                  {o.body}
                </p>
              </div>

              {o.note && (
                <div
                  className={`mt-4 pt-2.5 border-t text-xs leading-relaxed font-medium ${
                    o.selected
                      ? "border-accent/30 text-accent font-semibold"
                      : "border-border/40 text-muted-foreground"
                  }`}
                >
                  <span className="font-mono uppercase text-[0.62rem] text-muted-foreground block mb-0.5">
                    {o.selected ? "Strategic Decision Rationale:" : "Trade-off Assessment:"}
                  </span>
                  {o.note}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Rationale Spotlight Banner / Caption */}
      {caption && (
        <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-card p-3.5 md:p-4">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent mt-0.5">
            <Info className="size-3.5" />
          </span>
          <div className="space-y-0.5">
            <span className="font-mono text-[0.7rem] font-bold text-accent uppercase tracking-wider">
              Strategic Decision Context
            </span>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">{caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Architecture({
  layers,
  caption,
}: {
  layers: { label: string; items: string[]; note?: string }[];
  caption?: string;
}) {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  return (
    <Frame>
      <div className="flex items-center justify-between border-b border-border pb-3.5 mb-5">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-accent" />
          <span className="font-mono font-semibold text-xs uppercase tracking-wider text-foreground">
            System Stack & Capability Blueprint
          </span>
        </div>
        <span className="font-mono text-[0.68rem] px-2.5 py-0.5 rounded-md bg-accent/15 text-accent font-semibold">
          {layers.length} Tier Stack
        </span>
      </div>

      <div className="space-y-4">
        {layers.map((l, i) => {
          const isHovered = activeLayer === i;

          return (
            <motion.div key={l.label} className="relative">
              <motion.div
                onMouseEnter={() => setActiveLayer(i)}
                onMouseLeave={() => setActiveLayer(null)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: "some" }}
                transition={{ duration: 0.35, delay: i * 0.08, ease: EASE }}
                className={`rounded-xl border p-4 md:p-5 transition-all duration-200 ${
                  isHovered
                    ? "border-accent/60 bg-card ring-1 ring-accent/20"
                    : "border-border bg-card/90"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent font-mono text-xs font-bold">
                      0{i + 1}
                    </span>
                    <p className="font-mono text-accent font-bold text-xs uppercase tracking-wider">
                      {l.label}
                    </p>
                  </div>
                  <span className="font-mono text-[0.65rem] px-2 py-0.5 rounded bg-secondary text-muted-foreground flex items-center gap-1 font-medium">
                    <Cpu className="size-3 text-accent" />
                    Layer 0{i + 1}
                  </span>
                </div>

                <ul className="flex flex-wrap gap-2">
                  {l.items.map((it) => (
                    <li
                      key={it}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/80 px-3 py-1.5 text-xs text-foreground font-medium shadow-2xs hover:border-accent/40 transition-colors"
                    >
                      <span className="size-1 rounded-full bg-accent" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>

                {l.note && (
                  <div className="mt-3.5 pt-3 border-t border-border/60 text-xs text-muted-foreground font-normal flex items-start gap-2">
                    <ArrowRight className="size-3.5 text-accent shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{l.note}</p>
                  </div>
                )}
              </motion.div>

              {i < layers.length - 1 && (
                <div className="flex items-center justify-center py-1.5" aria-hidden>
                  <div className="flex items-center gap-2 text-muted-foreground/40 font-mono text-[0.62rem] uppercase tracking-widest">
                    <div className="h-2 w-px bg-border" />
                    <ArrowDown className="size-3.5 text-accent/60 animate-bounce" />
                    <div className="h-2 w-px bg-border" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {caption && (
        <div className="mt-5 pt-4 border-t border-border flex items-start gap-2.5 text-xs text-muted-foreground/90">
          <Info className="size-4 text-accent shrink-0 mt-0.5" />
          <p className="leading-relaxed">{caption}</p>
        </div>
      )}
    </Frame>
  );
}

export function Pipeline({
  stages,
  loop,
}: {
  stages: { label: string; body: string }[];
  loop?: string;
}) {
  return (
    <Frame>
      <ol className="grid gap-3 md:grid-cols-5">
        {stages.map((s, i) => (
          <motion.li
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.5, delay: i * 0.09, ease: EASE }}
            className="relative rounded-xl border border-border bg-card p-4"
          >
            <span className="label-mono text-accent font-semibold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-2 font-display text-base leading-tight tracking-tight font-semibold">{s.label}</p>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.body}</p>
            {i < stages.length - 1 && (
              <span
                aria-hidden
                className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-accent md:block font-bold"
              >
                →
              </span>
            )}
          </motion.li>
        ))}
      </ol>
      {loop && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-5 flex items-start gap-3 rounded-xl border border-dashed border-accent/50 p-4 text-sm text-muted-foreground bg-accent/5"
        >
          <span aria-hidden className="text-accent text-base">
            ↺
          </span>
          {loop}
        </motion.p>
      )}
    </Frame>
  );
}

export function KpiTree({
  north,
  northNote,
  tiers,
  guardrails,
}: {
  north: string;
  northNote?: string;
  tiers: { label: string; items: string[] }[];
  guardrails: string[];
}) {
  return (
    <Frame>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE }}
        className="rounded-xl bg-accent p-5 text-accent-foreground shadow-md"
      >
        <p className="label-mono !text-accent-foreground opacity-90 font-bold">North star</p>
        <p className="mt-2 font-display text-xl font-bold tracking-tight md:text-2xl">{north}</p>
        {northNote && <p className="mt-2 text-sm opacity-90">{northNote}</p>}
      </motion.div>

      <div className="flex justify-center py-2 text-accent font-bold" aria-hidden>
        ↓
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {tiers.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <p className="label-mono text-accent font-semibold">{t.label}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {t.items.map((it) => (
                <li key={it} className="flex gap-3">
                  <span aria-hidden className="mt-2 size-1 shrink-0 rotate-45 bg-accent" />
                  {it}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-3 rounded-xl border border-dashed border-accent/50 p-5 bg-card/30"
      >
        <p className="label-mono text-accent font-semibold">Guardrails</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {guardrails.map((g) => (
            <li key={g} className="rounded-full bg-secondary/80 px-3 py-1 text-xs text-muted-foreground font-medium">
              {g}
            </li>
          ))}
        </ul>
      </motion.div>
    </Frame>
  );
}

export function Moscow({
  groups,
  caption,
}: {
  groups: { label: string; items: string[] }[];
  caption?: string;
}) {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((g, i) => {
          const l = g.label.toLowerCase();
          let GroupIcon = CheckCircle2;
          if (l.includes("must")) GroupIcon = CheckCircle2;
          else if (l.includes("should")) GroupIcon = ShieldCheck;
          else if (l.includes("could")) GroupIcon = Sparkles;
          else if (l.includes("won") || l.includes("not")) GroupIcon = XCircle;

          return (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
              className="rounded-xl border border-border p-5 bg-card/60"
            >
              <p className="label-mono text-accent font-semibold flex items-center gap-2">
                <GroupIcon className="size-3.5 text-accent shrink-0" />
                <span>{g.label}</span>
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {g.items.map((it) => (
                  <li key={it} className={i > 2 ? "text-muted-foreground line-through opacity-70" : "text-foreground"}>
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
      {caption && <p className="mt-4 text-sm text-muted-foreground">{caption}</p>}
    </div>
  );
}

export function Attribution({
  journey,
  models,
  caption,
}: {
  journey: string[];
  models: { label: string; shares: number[]; selected?: boolean }[];
  caption?: string;
}) {
  return (
    <Frame title="One journey, credited differently">
      <ol className="flex flex-wrap items-center gap-2">
        {journey.map((j, i) => (
          <motion.li
            key={j}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.09, ease: EASE }}
            className="flex items-center gap-2"
          >
            <span
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                i === journey.length - 1
                  ? "border-accent bg-accent text-accent-foreground shadow-sm"
                  : "border-border bg-card"
              }`}
            >
              {j}
            </span>
            {i < journey.length - 1 && (
              <span aria-hidden className="text-accent font-bold">
                →
              </span>
            )}
          </motion.li>
        ))}
      </ol>

      <div className="mt-8 space-y-5">
        {models.map((m, mi) => (
          <div key={m.label}>
            <div className="flex items-baseline justify-between">
              <span className={`text-sm font-semibold ${m.selected ? "text-accent" : "text-foreground"}`}>{m.label}</span>
              <span className="label-mono">credit split</span>
            </div>
            <div
              className="mt-2 grid gap-2"
              style={{ gridTemplateColumns: `repeat(${m.shares.length}, minmax(0,1fr))` }}
            >
              {m.shares.map((sh, i) => (
                <div key={i}>
                  <div className="h-7 overflow-hidden rounded-lg border border-border bg-background">
                    <motion.span
                      initial={{ width: 0 }}
                      whileInView={{ width: `${sh}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1 * mi + i * 0.06, ease: EASE }}
                      className="flex h-full items-center justify-end pr-1.5 text-[0.65rem] font-bold text-accent-foreground bg-accent"
                    >
                      {sh > 12 ? `${sh}%` : ""}
                    </motion.span>
                  </div>
                  <p className="mt-1 text-[0.65rem] text-muted-foreground truncate">
                    {journey[i]} {sh <= 12 ? `· ${sh}%` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {caption && <p className="mt-6 text-sm text-muted-foreground">{caption}</p>}
    </Frame>
  );
}

export function Deltas({
  title,
  items,
  caption,
}: {
  title?: string;
  items: { label: string; value: string; delta: string; dir: "up" | "down" }[];
  caption?: string;
}) {
  return (
    <Frame title={title}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((it, i) => (
          <motion.li
            key={it.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3"
          >
            <span className="text-sm font-medium">{it.label}</span>
            <span className="flex items-baseline gap-3">
              <span className="font-display text-xl font-bold tracking-tight text-foreground">{it.value}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-mono font-semibold ${
                  it.dir === "up"
                    ? "bg-accent/15 text-accent"
                    : "border border-border text-muted-foreground"
                }`}
              >
                {it.dir === "up" ? "▲" : "▼"} {it.delta}
              </span>
            </span>
          </motion.li>
        ))}
      </ul>
      {caption && <p className="mt-5 text-sm text-muted-foreground">{caption}</p>}
    </Frame>
  );
}

export function PlanActual({
  items,
  months,
  caption,
}: {
  items: { phase: string; planned: [number, number]; actual: [number, number] }[];
  months: string[];
  caption?: string;
}) {
  const n = months.length;
  const pct = (v: number) => (v / n) * 100;
  return (
    <Frame title="Planned vs actual">
      <div className="mb-3 flex justify-between">
        {months.map((m) => (
          <span key={m} className="label-mono text-[0.6rem] font-semibold">
            {m}
          </span>
        ))}
      </div>
      <ul className="space-y-4">
        {items.map((it, i) => (
          <li key={it.phase}>
            <p className="text-sm font-medium">{it.phase}</p>
            <div className="mt-2 space-y-1">
              <div className="relative h-2.5 rounded-full bg-border">
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct(it.planned[1] - it.planned[0])}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
                  style={{ left: `${pct(it.planned[0])}%` }}
                  className="absolute top-0 h-full rounded-full bg-muted-foreground/40"
                />
              </div>
              <div className="relative h-2.5 rounded-full bg-border">
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct(it.actual[1] - it.actual[0])}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: EASE }}
                  style={{ left: `${pct(it.actual[0])}%` }}
                  className="absolute top-0 h-full rounded-full bg-accent"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex gap-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-muted-foreground/40" /> Planned
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-accent" /> Actual
        </span>
      </div>
      {caption && <p className="mt-5 text-sm text-muted-foreground">{caption}</p>}
    </Frame>
  );
}

export function Screens({
  items,
  note,
}: {
  items: { title: string; lines: { who: "bot" | "user" | "system"; text: string }[]; caption: string }[];
  note?: string;
}) {
  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s, i) => (
          <motion.figure
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.6, delay: i * 0.09, ease: EASE }}
            className="rounded-3xl border border-border bg-card/60 p-3 shadow-lg"
          >
            <div className="rounded-2xl border border-border bg-background p-4 min-h-[220px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="label-mono font-semibold text-accent">{s.title}</span>
                  <span aria-hidden className="h-1 w-8 rounded-full bg-border" />
                </div>
                <div className="mt-4 space-y-2.5">
                  {s.lines.map((l, li) => (
                    <motion.p
                      key={li}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + li * 0.1 }}
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        l.who === "user"
                          ? "ml-auto bg-accent text-accent-foreground font-medium"
                          : l.who === "system"
                            ? "border border-dashed border-accent/60 text-muted-foreground bg-accent/5"
                            : "bg-card border border-border text-foreground"
                      }`}
                    >
                      {l.text}
                    </motion.p>
                  ))}
                </div>
              </div>
              <div className="mt-4 rounded-full border border-border px-3 py-1.5 text-[0.68rem] text-muted-foreground bg-card/50">
                Ask about a policy…
              </div>
            </div>
            <figcaption className="px-2 py-3 text-xs text-muted-foreground">{s.caption}</figcaption>
          </motion.figure>
        ))}
      </div>
      {note && <p className="mt-4 label-mono">{note}</p>}
    </div>
  );
}

export function Loop({
  items,
  caption,
}: {
  items: string[];
  caption?: string;
}) {
  return (
    <Frame>
      <ol className="flex flex-wrap items-center justify-center gap-3">
        {items.map((it, i) => (
          <motion.li
            key={it}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
            className="flex items-center gap-3"
          >
            <span className="rounded-full bg-accent/15 px-4 py-2 text-sm text-accent font-medium">
              {it}
            </span>
            <span aria-hidden className="text-accent font-bold">
              {i === items.length - 1 ? "↺" : "→"}
            </span>
          </motion.li>
        ))}
      </ol>
      {caption && <p className="mt-5 text-center text-sm text-muted-foreground">{caption}</p>}
    </Frame>
  );
}
