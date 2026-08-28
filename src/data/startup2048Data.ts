export interface StartupMilestone {
  value: number;
  label: string;
  stage: string;
  icon: string;
  description: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  glowClass?: string;
}

export const STARTUP_MILESTONES: Record<number, StartupMilestone> = {
  2: {
    value: 2,
    label: "Spark",
    stage: "Idea",
    icon: "💡",
    description: "A sketch on a napkin at 2 AM",
    bgClass: "bg-slate-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200",
    textClass: "text-zinc-700 dark:text-zinc-200",
    borderClass: "border-zinc-300/60 dark:border-zinc-700/60",
  },
  4: {
    value: 4,
    label: "Wireframe",
    stage: "Prototype",
    icon: "📐",
    description: "Figma mockup & clickable prototype",
    bgClass: "bg-amber-100/90 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200",
    textClass: "text-amber-800 dark:text-amber-200",
    borderClass: "border-amber-300/70 dark:border-amber-700/50",
  },
  8: {
    value: 8,
    label: "MVP",
    stage: "Alpha",
    icon: "🛠️",
    description: "Working code with duct tape & ambition",
    bgClass: "bg-orange-100/90 dark:bg-orange-950/50 text-orange-800 dark:text-orange-200",
    textClass: "text-orange-800 dark:text-orange-200",
    borderClass: "border-orange-300/70 dark:border-orange-700/50",
  },
  16: {
    value: 16,
    label: "Beta Launch",
    stage: "Early Access",
    icon: "🚀",
    description: "#1 on Product Hunt today",
    bgClass: "bg-sky-100/90 dark:bg-sky-950/50 text-sky-800 dark:text-sky-200",
    textClass: "text-sky-800 dark:text-sky-200",
    borderClass: "border-sky-300/70 dark:border-sky-700/50",
  },
  32: {
    value: 32,
    label: "1st Customer",
    stage: "Revenue",
    icon: "🤝",
    description: "First paying customer hits Stripe webhook",
    bgClass: "bg-teal-100/90 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200",
    textClass: "text-teal-800 dark:text-teal-200",
    borderClass: "border-teal-300/70 dark:border-teal-700/50",
  },
  64: {
    value: 64,
    label: "PMF Achieved",
    stage: "Product-Market Fit",
    icon: "🎯",
    description: "Retention curve flattens into healthy plateau",
    bgClass: "bg-emerald-100/90 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200",
    textClass: "text-emerald-800 dark:text-emerald-200",
    borderClass: "border-emerald-300/70 dark:border-emerald-700/50",
  },
  128: {
    value: 128,
    label: "Seed Round",
    stage: "$2.5M Raised",
    icon: "🌱",
    description: "Top-tier angels join the cap table",
    bgClass: "bg-indigo-100/90 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-200",
    textClass: "text-indigo-800 dark:text-indigo-200",
    borderClass: "border-indigo-300/70 dark:border-indigo-700/50",
  },
  256: {
    value: 256,
    label: "Series A",
    stage: "$15M Growth",
    icon: "📈",
    description: "Scaling go-to-market engine & engineering team",
    bgClass: "bg-purple-100/90 dark:bg-purple-950/50 text-purple-800 dark:text-purple-200",
    textClass: "text-purple-800 dark:text-purple-200",
    borderClass: "border-purple-300/70 dark:border-purple-700/50",
  },
  512: {
    value: 512,
    label: "Hyper-Growth",
    stage: "10x ARR",
    icon: "⚡",
    description: "100% Net Revenue Retention across enterprise",
    bgClass: "bg-rose-100/90 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200",
    textClass: "text-rose-800 dark:text-rose-200",
    borderClass: "border-rose-300/70 dark:border-rose-700/50",
  },
  1024: {
    value: 1024,
    label: "Global Scale",
    stage: "Centaur ($100M ARR)",
    icon: "🌐",
    description: "Worldwide distribution & category leader",
    bgClass: "bg-fuchsia-100/90 dark:bg-fuchsia-950/50 text-fuchsia-800 dark:text-fuchsia-200",
    textClass: "text-fuchsia-800 dark:text-fuchsia-200",
    borderClass: "border-fuchsia-300/70 dark:border-fuchsia-700/50",
  },
  2048: {
    value: 2048,
    label: "Unicorn Status",
    stage: "$1B+ Valuation",
    icon: "🦄",
    description: "The Holy Grail of building from 0 to 1!",
    bgClass: "bg-gradient-to-br from-amber-400 via-rose-400 to-indigo-500 text-white font-bold",
    textClass: "text-white drop-shadow-sm",
    borderClass: "border-amber-300 dark:border-amber-400 ring-2 ring-amber-400/50",
    glowClass: "shadow-[0_0_20px_rgba(245,158,11,0.45)]",
  },
  4096: {
    value: 4096,
    label: "Decacorn",
    stage: "$10B+ IPO",
    icon: "👑",
    description: "Ringing the opening bell at the stock exchange",
    bgClass: "bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 text-white font-bold",
    textClass: "text-white drop-shadow-sm",
    borderClass: "border-purple-300 dark:border-purple-400 ring-2 ring-purple-400/50",
    glowClass: "shadow-[0_0_25px_rgba(168,85,247,0.55)]",
  },
};

export function getMilestone(val: number): StartupMilestone {
  if (STARTUP_MILESTONES[val]) {
    return STARTUP_MILESTONES[val]!;
  }
  return {
    value: val,
    label: `${val}`,
    stage: "Legend",
    icon: "✨",
    description: "Transcending startup physics!",
    bgClass: "bg-accent text-accent-foreground font-bold",
    textClass: "text-accent-foreground",
    borderClass: "border-accent",
  };
}
