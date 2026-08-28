import { useState } from "react";
import { motion } from "motion/react";
import { Layers, Sparkles, Grid } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { StackBubbleCanvas, type StackNode } from "@/components/StackBubbleCanvas";

type EmblemKind = "growth" | "roadmap" | "signals" | "neural" | "users" | "ship";

type Lens = {
  key: string;
  q: string;
  line: string;
  emblem: EmblemKind;
};

const LENSES: Lens[] = [
  {
    key: "Business Context",
    q: "What creates value?",
    line: "Start from what the organisation is actually trying to move — revenue, margin, risk, retention.",
    emblem: "growth",
  },
  {
    key: "Product Direction",
    q: "What should change?",
    line: "Translate the outcome into opportunities, then into deliberate refusals and prioritized bets.",
    emblem: "roadmap",
  },
  {
    key: "Data Signals",
    q: "What is actually happening?",
    line: "Instrument the journey. Define the KPI before the feature, and the guardrail before the launch.",
    emblem: "signals",
  },
  {
    key: "AI Possibility",
    q: "What can become easier?",
    line: "Bring ML/LLM capability in where it removes friction — earned through user value, not novelty.",
    emblem: "neural",
  },
  {
    key: "User Reality",
    q: "What needs to feel clear?",
    line: "Design the experience down to the smallest possible cognitive ask. Subtract before you add.",
    emblem: "users",
  },
  {
    key: "Execution & Flow",
    q: "How does it ship?",
    line: "Ship iteratively with the squad, measure honestly, and iterate on evidence rather than opinion.",
    emblem: "ship",
  },
];

const HAIR = "var(--hairline)";
const MUTED = "var(--muted-foreground)";
const ACCENT = "var(--color-accent)";

const loop = (duration: number, delay = 0) => ({
  duration,
  delay,
  repeat: Infinity,
  ease: "easeInOut" as const,
});

/** Business context — Compounding growth vector trajectory with milestone markers and telemetry */
function Growth({ reduced }: { reduced: boolean }) {
  const points = [
    { cx: 20, cy: 72, r: 2.5, val: "01", delay: 0 },
    { cx: 38, cy: 60, r: 3, val: "02", delay: 0.25 },
    { cx: 56, cy: 42, r: 3.5, val: "03", delay: 0.5 },
    { cx: 78, cy: 20, r: 4.5, val: "ROI", delay: 0.75, isApex: true },
  ];

  return (
    <>
      <defs>
        <linearGradient id="growth-area-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
        </linearGradient>
        <linearGradient id="curve-gradient" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
          <stop offset="70%" stopColor="var(--color-accent)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Clean Architectural Grid & Baseline Axes */}
      <line x1="14" y1="80" x2="86" y2="80" stroke={HAIR} strokeWidth="1" />
      <line x1="14" y1="14" x2="14" y2="80" stroke={HAIR} strokeWidth="1" />
      
      {/* Horizontal Milestone Benchmarks */}
      <line x1="14" y1="42" x2="86" y2="42" stroke={HAIR} strokeWidth="0.8" opacity="0.3" />
      <line x1="14" y1="20" x2="78" y2="20" stroke={ACCENT} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      
      <text x="18" y="17" fill={ACCENT} fontSize="3.8" fontFamily="monospace" letterSpacing="0.08em" opacity="0.9" fontWeight="bold">
        SCALE TARGET // 3.4X
      </text>

      {/* Shaded Area Under Curve */}
      <path
        d="M 16 80 L 16 75 C 32 73, 44 60, 58 42 C 68 30, 72 23, 78 20 L 78 80 Z"
        fill="url(#growth-area-gradient)"
      />

      {/* Vertical Anchor Lines for Points */}
      {points.map((p, i) => (
        <line
          key={`drop-${i}`}
          x1={p.cx}
          y1={p.cy}
          x2={p.cx}
          y2={80}
          stroke={p.isApex ? ACCENT : HAIR}
          strokeWidth="0.8"
          opacity={p.isApex ? 0.4 : 0.25}
        />
      ))}

      {/* Dynamic Compounding Trajectory Line */}
      <motion.path
        d="M16 75 C 32 73, 44 60, 58 42 C 68 30, 72 23, 78 20"
        fill="none"
        stroke="url(#curve-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={reduced ? { pathLength: 1 } : { pathLength: [0, 1, 1, 0] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.65, 0.85, 1],
        }}
      />

      {/* Milestone Points */}
      {points.map((p, i) => (
        <g key={`node-${i}`}>
          {!reduced && p.isApex && (
            <motion.circle
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill="none"
              stroke={ACCENT}
              strokeWidth="1"
              animate={{ r: [p.r, p.r + 7], opacity: [0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          )}

          <motion.circle
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={p.isApex ? ACCENT : "var(--card)"}
            stroke={ACCENT}
            strokeWidth={p.isApex ? "1.5" : "1.2"}
            animate={reduced ? {} : { scale: p.isApex ? [1, 1.2, 1] : [1, 1.1, 1] }}
            transition={loop(2.4, p.delay)}
          />

          {p.isApex ? (
            <circle cx={p.cx} cy={p.cy} r={1.6} fill="#ffffff" />
          ) : (
            <circle cx={p.cx} cy={p.cy} r={1} fill={ACCENT} />
          )}

          <text
            x={p.cx}
            y={86}
            fill={p.isApex ? ACCENT : MUTED}
            fontSize="3.8"
            fontFamily="monospace"
            textAnchor="middle"
            fontWeight={p.isApex ? "bold" : "normal"}
            opacity={0.8}
          >
            {p.val}
          </text>
        </g>
      ))}

      {/* Floating Milestone Telemetry Card */}
      <motion.g
        animate={reduced ? {} : { y: [0, -2.5, 0] }}
        transition={loop(3)}
      >
        <rect
          x="52"
          y="4"
          width="34"
          height="11"
          rx="3"
          fill="var(--card)"
          stroke={ACCENT}
          strokeWidth="0.8"
          opacity="0.95"
        />
        <text
          x="69"
          y="11.5"
          fill={ACCENT}
          fontSize="4.2"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="monospace"
          letterSpacing="0.05em"
        >
          ▲ +48% ROI
        </text>
      </motion.g>
    </>
  );
}

/** Product Direction — Strategic Vector & North Star Horizon: Multi-stage roadmap convergence & vector alignment */
function Roadmap({ reduced }: { reduced: boolean }) {
  return (
    <>
      <defs>
        <radialGradient id="direction-center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="north-vector-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Horizon Crosshair Grid */}
      <line x1="12" y1="50" x2="88" y2="50" stroke={HAIR} strokeWidth="0.8" opacity="0.4" />
      <line x1="50" y1="12" x2="50" y2="88" stroke={HAIR} strokeWidth="0.8" opacity="0.4" />

      {/* Strategic Horizon Concentric Rings (Now / Next / Later) */}
      <circle cx="50" cy="50" r="38" fill="none" stroke={HAIR} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <circle cx="50" cy="50" r="25" fill="none" stroke={HAIR} strokeWidth="0.9" opacity="0.6" />
      <circle cx="50" cy="50" r="13" fill="url(#direction-center-glow)" stroke={ACCENT} strokeWidth="1" opacity="0.8" />

      {/* Horizon Strategic Labels */}
      <text x="50" y="8" fill={MUTED} fontSize="3.6" fontWeight="bold" textAnchor="middle" fontFamily="monospace" opacity="0.65" letterSpacing="0.08em">
        VISION
      </text>
      <text x="76" y="47" fill={MUTED} fontSize="3.2" fontFamily="monospace" opacity="0.6">
        NEXT
      </text>
      <text x="64" y="47" fill={ACCENT} fontSize="3.2" fontFamily="monospace" fontWeight="bold" opacity="0.9">
        NOW
      </text>

      {/* Vector Convergence Trajectory Arrows */}
      <path
        d="M20 70 Q 35 60, 47 52"
        fill="none"
        stroke={MUTED}
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.5"
      />
      <path
        d="M80 70 Q 65 60, 53 52"
        fill="none"
        stroke={MUTED}
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.5"
      />

      {/* North Star Guide Vector Line */}
      <motion.line
        x1="50"
        y1="50"
        x2="50"
        y2="14"
        stroke="url(#north-vector-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ y2: 30 }}
        animate={reduced ? { y2: 14 } : { y2: [30, 14, 30] }}
        transition={loop(3.2)}
      />

      {/* North Star Apex Beacon */}
      <g transform="translate(50, 14)">
        {!reduced && (
          <motion.circle
            cx="0"
            cy="0"
            r="3"
            fill="none"
            stroke={ACCENT}
            strokeWidth="1"
            animate={{ r: [3, 8], opacity: [0.85, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {/* 4-point North Star glyph */}
        <motion.path
          d="M0 -4.5 L1.2 -1.2 L4.5 0 L1.2 1.2 L0 4.5 L-1.2 1.2 L-4.5 0 L-1.2 -1.2 Z"
          fill={ACCENT}
          animate={reduced ? {} : { scale: [0.9, 1.2, 0.9], rotate: [0, 90, 0] }}
          transition={loop(4)}
        />
        <circle cx="0" cy="0" r="1.2" fill="#ffffff" />
      </g>

      {/* Central Strategic Pivot & Vector Pointer */}
      <motion.g
        animate={reduced ? {} : { rotate: [-10, 10, -10] }}
        style={{ originX: "50px", originY: "50px" }}
        transition={loop(3.6)}
      >
        {/* Precision needle pointer */}
        <polygon points="50,22 52.5,50 47.5,50" fill={ACCENT} />
        <polygon points="50,68 52,50 48,50" fill={MUTED} opacity="0.4" />
        <circle cx="50" cy="50" r="4.5" fill="var(--card)" stroke={ACCENT} strokeWidth="1.4" />
        <circle cx="50" cy="50" r="2" fill={ACCENT} />
        <circle cx="50" cy="50" r="0.8" fill="#ffffff" />
      </motion.g>

      {/* Strategic Conviction Badge */}
      <motion.g
        animate={reduced ? {} : { y: [0, -2, 0] }}
        transition={loop(2.8)}
      >
        <rect
          x="14"
          y="76"
          width="72"
          height="9"
          rx="2.5"
          fill="var(--card)"
          stroke={HAIR}
          strokeWidth="0.8"
        />
        <text
          x="50"
          y="82.2"
          fill={ACCENT}
          fontSize="3.4"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="monospace"
          letterSpacing="0.08em"
        >
          NORTH STAR // ROADMAP ALIGNMENT
        </text>
      </motion.g>
    </>
  );
}

/** Data signals — Telemetry oscilloscope with live KPI waveform, confidence guardrails, and real-time scanner. */
function Signals({ reduced }: { reduced: boolean }) {
  return (
    <>
      {/* Confidence Interval Guardrail Band */}
      <rect x="16" y="32" width="70" height="34" fill={ACCENT} opacity="0.07" rx="3" />
      <line x1="16" y1="32" x2="86" y2="32" stroke={ACCENT} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <line x1="16" y1="66" x2="86" y2="66" stroke={ACCENT} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      
      {/* Baseline Zero-Axis */}
      <line x1="16" y1="49" x2="86" y2="49" stroke={HAIR} strokeWidth="0.8" />

      {/* Telemetry Labels */}
      <text x="18" y="29" fill={MUTED} fontSize="4.5" fontFamily="monospace" opacity="0.8">
        GUARDRAIL
      </text>

      {/* Live Oscillating Waveform */}
      <motion.path
        d="M16 49 Q 24 35, 32 46 T 48 58 T 64 36 T 78 52 L 86 49"
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={reduced ? {} : {
          d: [
            "M16 49 Q 24 35, 32 46 T 48 58 T 64 36 T 78 52 L 86 49",
            "M16 49 Q 24 58, 32 42 T 48 38 T 64 60 T 78 40 L 86 49",
            "M16 49 Q 24 35, 32 46 T 48 58 T 64 36 T 78 52 L 86 49",
          ]
        }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Active KPI Sampling Probes */}
      {[32, 48, 64].map((cx, i) => (
        <g key={cx}>
          <motion.circle
            cx={cx}
            cy={i === 1 ? 54 : 42}
            r="2.6"
            fill={ACCENT}
            animate={reduced ? {} : { scale: [0.8, 1.4, 0.8], opacity: [0.4, 1, 0.4] }}
            transition={loop(2, i * 0.4)}
          />
          {!reduced && (
            <motion.circle
              cx={cx}
              cy={i === 1 ? 54 : 42}
              r="2.6"
              fill="none"
              stroke={ACCENT}
              strokeWidth="0.8"
              animate={{ r: [2.6, 7], opacity: [0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
            />
          )}
        </g>
      ))}

      {/* Sweeping Telemetry Laser Beam */}
      {!reduced && (
        <motion.line
          y1="24"
          y2="74"
          stroke={ACCENT}
          strokeWidth="1"
          opacity="0.75"
          animate={{ x1: [16, 86, 16], x2: [16, 86, 16] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Live Status Badge */}
      <g transform="translate(60, 14)">
        <circle cx="2" cy="2" r="1.8" fill="#10b981" />
        {!reduced && (
          <motion.circle
            cx="2"
            cy="2"
            r="1.8"
            fill="none"
            stroke="#10b981"
            strokeWidth="0.6"
            animate={{ r: [1.8, 4.5], opacity: [0.9, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <text x="7" y="3.5" fill="var(--foreground)" fontSize="4.2" fontWeight="bold" fontFamily="monospace">
          LIVE p99
        </text>
      </g>
    </>
  );
}

/** AI possibility — Transformer attention matrix, context embeddings, and focused synthesis output. */
function Neural({ reduced }: { reduced: boolean }) {
  const inputs = [
    { x: 18, y: 32 },
    { x: 18, y: 50 },
    { x: 18, y: 68 },
  ];
  const coreNodes = [
    { x: 44, y: 34 },
    { x: 58, y: 34 },
    { x: 51, y: 50 }, // Central transformer nucleus
    { x: 44, y: 66 },
    { x: 58, y: 66 },
  ];
  const output = { x: 84, y: 50 };

  return (
    <>
      {/* Synaptic Interconnect Lattice */}
      {inputs.map((inp, ii) =>
        coreNodes.map((cn, ci) => (
          <motion.line
            key={`in-${ii}-${ci}`}
            x1={inp.x}
            y1={inp.y}
            x2={cn.x}
            y2={cn.y}
            stroke={ACCENT}
            strokeWidth="0.6"
            initial={{ opacity: 0.15 }}
            animate={reduced ? {} : { opacity: [0.1, 0.7, 0.1] }}
            transition={loop(2.4, (ii + ci) * 0.18)}
          />
        )),
      )}

      {/* Internal Transformer Attention Links */}
      {[
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
        [0, 2],
        [4, 2],
      ].map(([a, b], idx) => (
        <motion.line
          key={`core-link-${idx}`}
          x1={coreNodes[a]!.x}
          y1={coreNodes[a]!.y}
          x2={coreNodes[b]!.x}
          y2={coreNodes[b]!.y}
          stroke={ACCENT}
          strokeWidth="0.8"
          strokeDasharray="2 2"
          animate={reduced ? {} : { opacity: [0.2, 0.9, 0.2] }}
          transition={loop(2, idx * 0.25)}
        />
      ))}

      {/* Synthesis Rays to Output */}
      {coreNodes.map((cn, ci) => (
        <motion.line
          key={`out-${ci}`}
          x1={cn.x}
          y1={cn.y}
          x2={output.x}
          y2={output.y}
          stroke={ACCENT}
          strokeWidth="0.9"
          animate={reduced ? {} : { opacity: [0.15, 0.85, 0.15] }}
          transition={loop(2.2, ci * 0.2)}
        />
      ))}

      {/* Input Token Nodes */}
      {inputs.map((inp, i) => (
        <g key={`inp-${i}`}>
          <circle cx={inp.x} cy={inp.y} r="3" fill="var(--card)" stroke={MUTED} strokeWidth="1" />
          <motion.circle
            cx={inp.x}
            cy={inp.y}
            r="1.8"
            fill={MUTED}
            animate={reduced ? {} : { scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={loop(2.2, i * 0.3)}
          />
        </g>
      ))}

      {/* Transformer Nucleus Core */}
      {coreNodes.map((cn, i) => {
        const isCenter = i === 2;
        return (
          <g key={`core-${i}`}>
            <motion.circle
              cx={cn.x}
              cy={cn.y}
              r={isCenter ? 4.5 : 3.2}
              fill="var(--card)"
              stroke={isCenter ? ACCENT : HAIR}
              strokeWidth={isCenter ? 1.4 : 1}
              animate={reduced ? {} : { scale: isCenter ? [1, 1.15, 1] : [1, 1.08, 1] }}
              style={{ originX: `${cn.x}px`, originY: `${cn.y}px` }}
              transition={loop(2.5, i * 0.2)}
            />
            <circle cx={cn.x} cy={cn.y} r={isCenter ? 2.4 : 1.6} fill={isCenter ? ACCENT : "var(--foreground)"} />
          </g>
        );
      })}

      {/* Synthesized Output Value Node */}
      <g>
        {!reduced && (
          <motion.circle
            cx={output.x}
            cy={output.y}
            r="4"
            fill="none"
            stroke={ACCENT}
            strokeWidth="1.2"
            animate={{ r: [4, 10], opacity: [0.9, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <motion.circle
          cx={output.x}
          cy={output.y}
          r="4.2"
          fill={ACCENT}
          animate={reduced ? {} : { scale: [0.9, 1.2, 0.9] }}
          transition={loop(1.8)}
        />
        {/* Output Sparkle / Starburst */}
        <polygon
          points={`${output.x},${output.y - 7} ${output.x + 2},${output.y - 2} ${output.x + 7},${output.y} ${output.x + 2},${output.y + 2} ${output.x},${output.y + 7} ${output.x - 2},${output.y + 2} ${output.x - 7},${output.y} ${output.x - 2},${output.y - 2}`}
          fill={ACCENT}
          opacity="0.85"
        />
      </g>
    </>
  );
}

/** User Reality — Cognitive Simplicity & Friction Reduction: Eliminating noise down to an intuitive, 1-tap flow. */
function Users({ reduced }: { reduced: boolean }) {
  return (
    <>
      {/* Mobile / Screen Frame */}
      <rect x="18" y="10" width="64" height="80" rx="8" fill="var(--card)" stroke={HAIR} strokeWidth="1.2" />

      {/* Top Device Bar & Speaker */}
      <line x1="42" y1="16" x2="58" y2="16" stroke={HAIR} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="36" cy="16" r="1" fill={HAIR} />

      {/* User Empathy Icon in Header */}
      <g transform="translate(68, 16)">
        <circle cx="0" cy="0" r="2.8" fill={ACCENT} fillOpacity="0.15" stroke={ACCENT} strokeWidth="0.8" />
        <circle cx="0" cy="-0.8" r="1" fill={ACCENT} />
        <path d="M-1.6 1.8 C -1.6 0.8, 1.6 0.8, 1.6 1.8" fill="none" stroke={ACCENT} strokeWidth="0.7" />
      </g>

      {/* Subtraction Phase: Complex multi-layer form blocks collapsing */}
      <motion.g
        animate={
          reduced
            ? {}
            : {
                opacity: [0.7, 0.15, 0.7],
                scale: [1, 0.92, 1],
                y: [0, -2, 0],
              }
        }
        style={{ originX: "50px", originY: "36px" }}
        transition={loop(3.8)}
      >
        <rect x="25" y="24" width="50" height="7" rx="2" fill={MUTED} opacity="0.3" />
        <rect x="25" y="34" width="34" height="6" rx="2" fill={MUTED} opacity="0.2" />
        <rect x="25" y="43" width="42" height="6" rx="2" fill={MUTED} opacity="0.2" />
      </motion.g>

      {/* Subtraction Divider / Razor Line */}
      <motion.line
        x1="22"
        y1="53"
        x2="78"
        y2="53"
        stroke={ACCENT}
        strokeWidth="1"
        strokeDasharray="3 3"
        animate={reduced ? {} : { opacity: [0.3, 0.8, 0.3] }}
        transition={loop(2.4)}
      />

      {/* The Single Frictionless Hero Action (The 1-Tap Experience) */}
      <motion.rect
        x="25"
        y="60"
        width="50"
        height="18"
        rx="9"
        fill={ACCENT}
        animate={
          reduced
            ? {}
            : {
                scale: [1, 0.96, 1],
                opacity: [0.88, 1, 0.88],
              }
        }
        style={{ originX: "50px", originY: "69px" }}
        transition={loop(2.4)}
      />

      {/* Action Button Label / Touch Target Icon */}
      <g transform="translate(42, 69)">
        {/* Fingerprint / Touch glyph */}
        <circle cx="-5" cy="0" r="3.2" fill="none" stroke="#ffffff" strokeWidth="0.9" opacity="0.9" />
        <circle cx="-5" cy="0" r="1.4" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.9" />
        {/* Text / Status */}
        <text x="3" y="1.8" fill="#ffffff" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif">
          1-TAP
        </text>
      </g>

      {/* Tactile Touch Shockwave / Ripple Ring */}
      {!reduced && (
        <motion.circle
          cx="37"
          cy="69"
          r="6"
          fill="none"
          stroke={ACCENT}
          strokeWidth="1.4"
          animate={{ r: [6, 20], opacity: [0.9, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Dynamic Success Check Ping */}
      <motion.path
        d="M66 69 L69 72 L75 66"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={reduced ? { pathLength: 1 } : { pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.4, 0.85, 1], ease: "easeInOut" }}
      />
    </>
  );
}

/** Execution & Flow — Continuous delivery pipeline (Plan → Build → Live) with fluid ticket transitions & feedback loop. */
function Ship({ reduced }: { reduced: boolean }) {
  const columns = [
    { x: 14, w: 22, label: "PLAN", dot: MUTED },
    { x: 39, w: 22, label: "BUILD", dot: ACCENT },
    { x: 64, w: 22, label: "LIVE", dot: "#22c55e" },
  ];

  return (
    <>
      <defs>
        <linearGradient id="ticket-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* 3 Agile Sprint Kanban Columns */}
      {columns.map((col) => (
        <g key={col.x}>
          {/* Column Container with subtle backdrop fill */}
          <rect
            x={col.x}
            y="18"
            width={col.w}
            height="56"
            rx="4"
            fill="var(--card)"
            stroke={HAIR}
            strokeWidth="0.8"
            opacity="0.8"
          />
          {/* Column Header Separator Line */}
          <line
            x1={col.x}
            y1="28"
            x2={col.x + col.w}
            y2="28"
            stroke={HAIR}
            strokeWidth="0.7"
            opacity="0.6"
          />
          {/* Status Indicator Dot */}
          <circle cx={col.x + 5} cy="23" r="1.5" fill={col.dot} opacity="0.85" />
          {/* Column Name */}
          <text
            x={col.x + 9}
            y="24.5"
            fill={MUTED}
            fontSize="3.6"
            fontWeight="bold"
            fontFamily="monospace"
            letterSpacing="0.06em"
          >
            {col.label}
          </text>
        </g>
      ))}

      {/* Static In-Flight Stacked Cards in Plan */}
      <rect x="17" y="32" width="16" height="6.5" rx="2" fill={MUTED} opacity="0.25" />
      <rect x="17" y="41" width="16" height="6.5" rx="2" fill={MUTED} opacity="0.18" />

      {/* Static In-Flight Stacked Cards in Build */}
      <rect x="42" y="32" width="16" height="6.5" rx="2" fill={MUTED} opacity="0.25" />

      {/* Static Completed Cards in Live */}
      <rect x="67" y="32" width="16" height="6.5" rx="2" fill={MUTED} opacity="0.28" />
      <circle cx="80" cy="35.2" r="1.2" fill="#22c55e" opacity="0.8" />

      {/* Active Feature Ticket Moving Across Pipeline with Fluid Stage Springs */}
      <motion.g
        initial={{ x: 17 }}
        animate={
          reduced
            ? { x: 67 }
            : {
                x: [17, 17, 42, 42, 67, 67, 17],
              }
        }
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.18, 0.42, 0.58, 0.82, 0.92, 1],
        }}
      >
        <rect
          y="50"
          width="16"
          height="8.5"
          rx="2.5"
          fill="url(#ticket-glow)"
          stroke="var(--color-accent)"
          strokeWidth="0.6"
        />
        {/* Ticket Accent Bar & Lines */}
        <line x1="3" y1="53" x2="9" y2="53" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        <line x1="3" y1="55.5" x2="13" y2="55.5" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
      </motion.g>

      {/* Live Column Deployment Verification Ripple on Ship */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          reduced
            ? { opacity: 1, scale: 1 }
            : {
                opacity: [0, 0, 0, 0, 1, 1, 0],
                scale: [0.8, 0.8, 0.8, 0.8, 1.1, 1, 0.8],
              }
        }
        style={{ originX: "75px", originY: "65px" }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          times: [0, 0.45, 0.65, 0.78, 0.86, 0.94, 1],
        }}
      >
        <circle cx="75" cy="65" r="5" fill="none" stroke="#22c55e" strokeWidth="1" />
        <path
          d="M72.5 65 L74.2 66.8 L77.5 63.2"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>

      {/* Continuous Iterative Feedback Arc Return Loop */}
      <path
        d="M75 78 C 75 90, 25 90, 25 78"
        fill="none"
        stroke={HAIR}
        strokeWidth="1"
        strokeDasharray="2.5 2.5"
      />
      {/* Return Direction Arrowhead */}
      <polygon points="25,74 21,78 29,78" fill={ACCENT} opacity="0.8" />

      {/* Live Iteration Feedback Orbiting Pulse */}
      {!reduced && (
        <motion.circle r="2" fill={ACCENT}>
          <animateMotion
            dur="4.8s"
            repeatCount="indefinite"
            path="M75 78 C 75 90, 25 90, 25 78"
            rotate="auto"
            keyTimes="0;0.7;1"
            keyPoints="0;0;1"
          />
        </motion.circle>
      )}

      {/* Feedback telemetry label */}
      <text
        x="50"
        y="93"
        fill={MUTED}
        fontSize="3.2"
        fontFamily="monospace"
        textAnchor="middle"
        letterSpacing="0.08em"
        opacity="0.8"
      >
        FEEDBACK FLYWHEEL
      </text>
    </>
  );
}

function Emblem({ kind, reduced }: { kind: EmblemKind; reduced: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="size-24 sm:size-28 md:size-28 lg:size-24 xl:size-28 2xl:size-30" aria-hidden>
      {kind === "growth" && <Growth reduced={reduced} />}
      {kind === "roadmap" && <Roadmap reduced={reduced} />}
      {kind === "signals" && <Signals reduced={reduced} />}
      {kind === "neural" && <Neural reduced={reduced} />}
      {kind === "users" && <Users reduced={reduced} />}
      {kind === "ship" && <Ship reduced={reduced} />}
    </svg>
  );
}

function FlipCard({
  lens,
  index,
  reduced,
}: {
  lens: Lens;
  index: number;
  reduced: boolean;
}) {
  return (
    <motion.article
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, rotateY: -45, x: 30 }}
      whileInView={reduced ? {} : { opacity: 1, rotateY: 0, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: reduced ? 0 : (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        transformPerspective: 1200,
        transformOrigin: "left center",
      }}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/60 p-4 sm:p-5 lg:p-3.5 xl:p-4.5 transition-all duration-300 hover:border-accent/70 hover:bg-card hover:-translate-y-1 shadow-sm"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-16 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--color-accent)_16%,transparent),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div>
        <div className="relative flex flex-col items-start gap-1">
          <div className="flex w-full items-center justify-between">
            <span className="label-mono text-accent font-bold text-xs sm:text-sm">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="size-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />
          </div>
          <span className="label-mono text-[0.68rem] sm:text-xs lg:text-[0.6rem] xl:text-[0.66rem] 2xl:text-xs text-muted-foreground font-medium whitespace-normal lg:whitespace-nowrap tracking-tight lg:tracking-tighter xl:tracking-normal flex items-center min-h-[1.25rem] lg:min-h-0">
            {lens.q}
          </span>
        </div>
        <div className="relative mt-2 md:mt-3 grid place-items-center py-1 sm:py-2">
          <Emblem kind={lens.emblem} reduced={reduced} />
        </div>
        <h3 className="relative mt-2 font-display text-base md:text-lg lg:text-sm xl:text-base 2xl:text-lg font-bold tracking-tight text-foreground">
          {lens.key}
        </h3>
      </div>
      <p className="relative mt-2 text-xs md:text-sm lg:text-[0.78rem] xl:text-xs 2xl:text-sm leading-relaxed text-muted-foreground">{lens.line}</p>
    </motion.article>
  );
}

export function OperatingSpace() {
  const reduced = useReducedMotion();

  return (
    <section id="section-operating-space" className="relative z-20 overflow-hidden px-6 py-20 md:px-12 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <div className="text-center pt-8">
            <p id="section-03-heading" className="label-mono text-xs text-muted-foreground uppercase tracking-widest font-semibold">The Space I Operate In</p>
            <h2 className="display-lg mt-3">
              One problem. <span className="text-foreground font-bold">Six lenses.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
              Product leadership isn't a handoff. It's fluidly translating between the business case, user
              reality, data signals, AI capability, and squad delivery without losing the strategic thread.
            </p>
          </div>
        </Reveal>

        <div
          className="mt-14 grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-stretch"
        >
          {LENSES.map((l, i) => (
            <div key={l.key} className="h-full">
              <FlipCard
                lens={l}
                index={i}
                reduced={reduced}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
