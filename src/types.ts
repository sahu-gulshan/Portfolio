export type IconName =
  | "target"
  | "brain"
  | "database"
  | "users"
  | "rocket"
  | "shield"
  | "gauge"
  | "sparkles"
  | "layers"
  | "trending"
  | "compass"
  | "cpu"
  | "folderKanban"
  | "clock"
  | "lineChart"
  | "boxes"
  | "hexagon"
  | "checkCheck"
  | "sliders"
  | "shieldCheck"
  | "layers3"
  | "workflow"
  | "activity"
  | "fileText"
  | "lightbulb"
  | "milestone"
  | "userCheck"
  | "barChart";

export type CaseBlock =
  | { kind: "text"; body: string[] }
  | { kind: "bullets"; items: string[] }
  | { kind: "stats"; items: { value: string; label: string }[] }
  | { kind: "pairs"; items: { k: string; v: string }[] }
  | { kind: "chain"; items: string[] }
  | { kind: "quote"; body: string }
  | {
      kind: "bars";
      title?: string;
      unit?: string;
      max?: number;
      items: { label: string; value: number; note?: string; highlight?: boolean }[];
    }
  | { kind: "donut"; title?: string; items: { label: string; value: number }[] }
  | {
      kind: "curve";
      title?: string;
      caption?: string;
      xLabel: string;
      yLabel: string;
      points: number[];
      markerIndex?: number;
      markerLabel?: string;
    }
  | {
      kind: "compare";
      title?: string;
      items: { label: string; before: string; after: string; delta?: string }[];
    }
  | {
      kind: "cards";
      items: { icon: IconName; title: string; body: string }[];
    }
  | { kind: "phases"; items: { when: string; what: string; detail?: string }[] }
  | {
      kind: "cohorts";
      a: string;
      b: string;
      items: { label: string; a: number; b: number }[];
    }
  | {
      kind: "persona";
      name: string;
      tagline: string;
      meta: string[];
      quote: string;
      stats: { value: string; label: string }[];
      basket: { label: string; value: number }[];
      missions: string[];
      flag?: string;
    }
  | { kind: "graph"; center: string; nodes: { label: string; hint: string }[]; caption?: string }
  | { kind: "steps"; items: { title: string; body: string }[]; caption?: string }
  | {
      kind: "table";
      title?: string;
      columns: string[];
      rows: { cells: string[]; highlight?: boolean }[];
      caption?: string;
    }
  | {
      kind: "options";
      items: { title: string; body: string; note?: string; selected?: boolean }[];
      caption?: string;
    }
  | { kind: "arch"; layers: { label: string; items: string[]; note?: string }[]; caption?: string }
  | { kind: "pipeline"; stages: { label: string; body: string }[]; loop?: string }
  | {
      kind: "kpitree";
      north: string;
      northNote?: string;
      tiers: { label: string; items: string[] }[];
      guardrails: string[];
    }
  | { kind: "moscow"; groups: { label: string; items: string[] }[]; caption?: string }
  | {
      kind: "attribution";
      journey: string[];
      models: { label: string; shares: number[]; selected?: boolean }[];
      caption?: string;
    }
  | {
      kind: "deltas";
      title?: string;
      items: { label: string; value: string; delta: string; dir: "up" | "down" }[];
      caption?: string;
    }
  | {
      kind: "planactual";
      months: string[];
      items: { phase: string; planned: [number, number]; actual: [number, number] }[];
      caption?: string;
    }
  | {
      kind: "screens";
      items: {
        title: string;
        lines: { who: "bot" | "user" | "system"; text: string }[];
        caption: string;
      }[];
      note?: string;
    }
  | { kind: "loop"; items: string[]; caption?: string };

export type CaseSection = {
  label: string;
  heading: string;
  kicker?: string;
  blocks: CaseBlock[];
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  category: string;
  client: string;
  summary: string;
  role: string;
  team: string;
  timeline: string;
  tags: string[];
  domains?: string[];
  theme: {
    accent: string;
    accentForeground: string;
    accentLight: string;
    accentLightForeground: string;
    label: string;
  };
  metrics: { value: string; label: string }[];
  flow: string[];
  flowCaption: string;
  sections: CaseSection[];
  onePager: { k: string; v: string }[];
};

export type LensItem = {
  key: string;
  line: string;
};
