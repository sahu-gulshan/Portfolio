import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { playTimelineDiamondChime } from "@/lib/quantum-audio";
import { cn } from "@/lib/utils";

export interface MacroNode {
  key: string;
  name: string;
  shortLabel: string;
  angle: number; // in degrees
  centerSubtitle: string;
  metric: string;
}

interface IntersectionFieldProps {
  highlight: string | null;
  isShifted?: boolean;
  centerOffset?: number;
  onIntroComplete?: () => void;
}

// 5 Nodes arranged at 72° intervals starting from Product
const NODES: MacroNode[] = [
  {
    key: "PRODUCT",
    name: "PRODUCT",
    shortLabel: "Product",
    angle: 198, // -162° / Middle-Left (Primary anchor)
    centerSubtitle: "problems into products",
    metric: "5+ Shipped 0→1 Products",
  },
  {
    key: "AI",
    name: "AI",
    shortLabel: "AI & GenAI",
    angle: 270, // -90° / Top
    centerSubtitle: "intelligence into product capability",
    metric: "4,857 Ops/sec Scoped",
  },
  {
    key: "DATA",
    name: "DATA",
    shortLabel: "Data & MMM",
    angle: 342, // -18° / Top-Right
    centerSubtitle: "signals into decisions",
    metric: "+3.18x Lift Accuracy",
  },
  {
    key: "BUSINESS",
    name: "BUSINESS",
    shortLabel: "Business",
    angle: 54, // Bottom-Right
    centerSubtitle: "products into outcomes",
    metric: "$60M+ Reallocated",
  },
  {
    key: "UX",
    name: "UX",
    shortLabel: "UX Research",
    angle: 126, // Bottom-Left
    centerSubtitle: "complexity into clarity",
    metric: "0.35s Time-to-Task",
  },
];

const CENTER = { x: 50, y: 50 };
const NODE_RADIUS = 35; // Distance of nodes on orbital track
const INNER_ORBIT_RADIUS = 22;
const OUTER_ORBIT_RADIUS = 46;

// Revolution cycle duration for discipline nodes (40s)
const REVOLUTION_DURATION = 40;
// Synchronized step duration per discipline node (3s transition)
const STEP_DURATION = 3000;

function polarToCartesian(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER.x + Math.cos(rad) * radius,
    y: CENTER.y + Math.sin(rad) * radius,
  };
}

export function IntersectionField({
  highlight,
  isShifted = false,
  centerOffset = 0,
  onIntroComplete,
}: IntersectionFieldProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isIntroActive, setIsIntroActive] = useState(() => !reducedMotion && !isShifted);

  const controlledKey = highlight ?? hoveredKey ?? selectedKey;

  // Coordinate opening intro completion at 3.5s
  useEffect(() => {
    if (reducedMotion || isShifted) {
      setIsIntroActive(false);
      onIntroComplete?.();
      return;
    }

    const timer = window.setTimeout(() => {
      setIsIntroActive(false);
      onIntroComplete?.();
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [reducedMotion, isShifted, onIntroComplete]);

  // Auto-cycle through the 5 nodes smoothly in sequence with 40s revolution cycle
  useEffect(() => {
    if (reducedMotion || controlledKey || isPaused || isIntroActive) return;

    const interval = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % NODES.length);
    }, STEP_DURATION);

    return () => window.clearInterval(interval);
  }, [controlledKey, isPaused, reducedMotion, isIntroActive]);

  const activeNodeIndex = controlledKey
    ? NODES.findIndex((n) => n.key === controlledKey)
    : activeStep;

  const activeNode = NODES[activeNodeIndex >= 0 ? activeNodeIndex : 0];

  // Macro Animation inside small circle in website's main brand orange (var(--color-accent))
  const renderNodeIcon = (key: string, isActive: boolean) => {
    const strokeColor = isActive ? "var(--color-accent)" : "#64748b"; // Main brand orange when active
    const accentFill = isActive ? "var(--color-accent)" : "#94a3b8";
    const strokeWidth = "1.35";

    switch (key) {
      case "PRODUCT":
        return (
          <svg viewBox="0 0 24 24" className="size-6 sm:size-7 md:size-8" fill="none">
            {/* Sleek smartphone outline */}
            <rect
              x="6"
              y="2.5"
              width="12"
              height="19"
              rx="2.8"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            {/* Camera / Dynamic Island pill */}
            <rect
              x="9.5"
              y="4.5"
              width="5"
              height="1.5"
              rx="0.75"
              fill={accentFill}
              opacity={isActive ? "0.9" : "0.75"}
            />
            {/* Screen UI wireframe layout with light orange macro animation */}
            <rect
              x="8"
              y="8"
              width="8"
              height="5.5"
              rx="1.2"
              stroke={strokeColor}
              strokeWidth="1.1"
              opacity={isActive ? "0.95" : "0.55"}
            />
            <line
              x1="8"
              y1="15.5"
              x2="14"
              y2="15.5"
              stroke={strokeColor}
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity={isActive ? "0.9" : "0.5"}
            />
            <line
              x1="8"
              y1="18"
              x2="12"
              y2="18"
              stroke={strokeColor}
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity={isActive ? "0.9" : "0.5"}
            />
          </svg>
        );

      case "AI":
        return (
          <svg viewBox="0 0 24 24" className="size-6 sm:size-7 md:size-8" fill="none">
            {/* Neural Brain / Synaptic network */}
            <path
              d="M12 3.5C8 3.5 5.5 6 5.5 9.8C5.5 11.6 6.5 13.4 8.2 14.5C7.8 16 8.8 18.2 11 19.2L12 19.5 M12 3.5C16 3.5 18.5 6 18.5 9.8C18.5 11.6 17.5 13.4 15.8 14.5C16.2 16 15.2 18.2 13 19.2L12 19.5"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Neural core connectors */}
            <path
              d="M9 7.8C9 10 11.5 11 11.5 13.2 M15 7.8C15 10 12.5 11 12.5 13.2"
              stroke={strokeColor}
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity={isActive ? "1" : "0.75"}
            />
            <circle cx="9" cy="7.8" r="1.2" fill={accentFill} opacity={isActive ? "0.95" : "0.75"} />
            <circle cx="15" cy="7.8" r="1.2" fill={accentFill} opacity={isActive ? "0.95" : "0.75"} />
            <circle cx="12" cy="13.2" r="1.3" fill={accentFill} opacity={isActive ? "0.95" : "0.75"} />
          </svg>
        );

      case "DATA":
        return (
          <svg viewBox="0 0 24 24" className="size-6 sm:size-7 md:size-8" fill="none">
            {/* 3-Tier Cylindrical Database Server */}
            <ellipse cx="12" cy="5.5" rx="6.8" ry="2.8" stroke={strokeColor} strokeWidth={strokeWidth} />
            <path
              d="M5.2 5.5v4.8c0 1.55 3.04 2.8 6.8 2.8s6.8-1.25 6.8-2.8V5.5"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <path
              d="M5.2 10.3v4.8c0 1.55 3.04 2.8 6.8 2.8s6.8-1.25 6.8-2.8v-4.8"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <path
              d="M5.2 15.1v3.4c0 1.55 3.04 2.8 6.8 2.8s6.8-1.25 6.8-2.8v-3.4"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            {/* Server LED status markers */}
            <circle cx="8.5" cy="9.5" r="0.8" fill={accentFill} opacity={isActive ? "0.95" : "0.75"} />
            <circle cx="8.5" cy="14.3" r="0.8" fill={accentFill} opacity={isActive ? "0.95" : "0.75"} />
          </svg>
        );

      case "BUSINESS":
        return (
          <svg viewBox="0 0 24 24" className="size-6 sm:size-7 md:size-8" fill="none">
            {/* Growth chart & Trend arrow */}
            <path
              d="M4 20h16"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <path
              d="M6 15.5L11 10.5L14.5 13.5L19 7"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 7H19V11"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Vertical data volume bars */}
            <line
              x1="7.5"
              y1="20"
              x2="7.5"
              y2="16.5"
              stroke={strokeColor}
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity={isActive ? "0.95" : "0.55"}
            />
            <line
              x1="12"
              y1="20"
              x2="12"
              y2="13.5"
              stroke={strokeColor}
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity={isActive ? "0.95" : "0.55"}
            />
            <line
              x1="16.5"
              y1="20"
              x2="16.5"
              y2="10.5"
              stroke={strokeColor}
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity={isActive ? "0.95" : "0.55"}
            />
          </svg>
        );

      case "UX":
      default:
        return (
          <svg viewBox="0 0 24 24" className="size-6 sm:size-7 md:size-8" fill="none">
            {/* User Experience / Multi-user journey */}
            <circle cx="9.5" cy="7.5" r="3.2" stroke={strokeColor} strokeWidth={strokeWidth} />
            <path
              d="M3.8 17.5c0-2.8 2.8-4.6 5.7-4.6s5.7 1.8 5.7 4.6"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <circle
              cx="17"
              cy="9.5"
              r="2.5"
              stroke={strokeColor}
              strokeWidth="1.2"
              opacity={isActive ? "0.95" : "0.75"}
            />
            <path
              d="M15.5 17.5c0-2 1.8-3.4 3.8-3.4s3.8 1.4 3.8 3.4"
              stroke={strokeColor}
              strokeWidth={1.2}
              strokeLinecap="round"
              opacity={isActive ? "0.95" : "0.75"}
            />
          </svg>
        );
    }
  };

  // Staggered node entrance delays for the opening sequence (paced smoothly over 3.0-3.5s total duration)
  const getNodeIntroDelay = (key: string) => {
    switch (key) {
      case "PRODUCT":
        return 0.85; // Product circle appears clearly first after central hub settles
      case "AI":
        return 1.20; // AI evolves next
      case "DATA":
        return 1.55; // Data evolves next
      case "BUSINESS":
        return 1.90; // Business evolves next
      case "UX":
        return 2.25; // UX evolves next
      default:
        return 0.85;
    }
  };

  // Center Hub component: Compact size, "I turn" in Accent color + font-display, subtitle in font-mono
  const centerHubContent = (
    <div className="relative flex size-full flex-col items-center justify-center p-3 text-center select-none overflow-hidden rounded-full">
      {/* Dynamic Ambient Radiant Glow */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : {
                scale: [1, 1.18, 1],
                opacity: [0.32, 0.60, 0.32],
              }
        }
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 m-auto size-3/4 rounded-full bg-accent/30 blur-lg pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center max-w-[170px]">
        {/* "I turn" with Accent color, Space Grotesk display typography & clear entrance */}
        <motion.h3
          initial={reducedMotion ? false : { scale: 0.7, opacity: 0 }}
          animate={
            reducedMotion
              ? { opacity: 1 }
              : {
                  scale: [0.7, 1.08, 1],
                  opacity: [0, 1, 0.95],
                }
          }
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-lg sm:text-xl md:text-[1.35rem] font-bold tracking-tight text-accent leading-none"
        >
          I turn
        </motion.h3>

        {/* Dynamic Changing Subtitle in JetBrains Mono */}
        <div className="relative mt-1.5 min-h-[38px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeNode.key}
              initial={reducedMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="font-mono text-[0.68rem] sm:text-[0.74rem] md:text-[0.78rem] font-semibold text-foreground leading-tight text-center tracking-tight"
            >
              {activeNode.centerSubtitle}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  // Desktop clean animation starting from exact geometric center and smoothly gliding to the right at 2.5s
  return (
    <motion.div
      initial={
        reducedMotion || isShifted
          ? false
          : {
              x: isMobile ? 0 : centerOffset,
              opacity: 0,
              scale: 0.92,
            }
      }
      animate={{
        x: isShifted || isMobile ? 0 : centerOffset,
        opacity: 1,
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.75, ease: "easeOut" },
        scale: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
        x: {
          duration: 1.15,
          ease: [0.22, 1, 0.36, 1], // Smooth, cinematic ease-out glide to the right
        },
      }}
      className="relative mx-auto aspect-square w-full max-w-[420px] sm:max-w-[440px] lg:max-w-[460px] xl:max-w-[480px] select-none"
      role="group"
      aria-label="Interactive Discipline Nexus & Macro Animation"
    >
      {/* SVG Canvas for Track Rings, Dotted Orbits & Precision Nexus Geometry */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full overflow-visible"
        aria-hidden="true"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
      >
        <defs>
          {/* Ambient Center Glow */}
          <radialGradient id="thin-hub-ambient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.16" />
            <stop offset="70%" stopColor="var(--color-accent)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Center Glow */}
        <circle cx={CENTER.x} cy={CENTER.y} r={46} fill="url(#thin-hub-ambient)" />

        {/* 1. High-Density Dotted Inner Ring (Radius 22) */}
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={INNER_ORBIT_RADIUS}
          fill="none"
          stroke="var(--hairline)"
          strokeWidth={0.35}
          strokeDasharray="0.6 1.4"
          opacity={0.9}
        />

        {/* 2. High-Density Dotted Main Navigator Orbital Track (Radius 35) */}
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={NODE_RADIUS}
          fill="none"
          stroke="var(--hairline)"
          strokeWidth={0.4}
          strokeDasharray="0.8 1.6"
          opacity={0.95}
        />

        {/* Secondary subtle guide track for rich optical texture */}
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={NODE_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.18}
          strokeDasharray="0.4 2.8"
          className="text-accent/35"
        />

        {/* Evolution Energy Track: Awakens from Product and connects the satellites */}
        {!reducedMotion && isIntroActive && (
          <motion.circle
            cx={CENTER.x}
            cy={CENTER.y}
            r={NODE_RADIUS}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={0.85}
            strokeDasharray="219.91"
            initial={{ strokeDashoffset: 219.91, opacity: 0.9 }}
            animate={{ strokeDashoffset: 0, opacity: [0.9, 0.6, 0] }}
            transition={{ duration: 1.65, delay: 0.85, ease: "easeInOut" }}
          />
        )}

        {/* 3. High-Density Dotted Outer Ring (Radius 46) */}
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={OUTER_ORBIT_RADIUS}
          fill="none"
          stroke="var(--hairline)"
          strokeWidth={0.3}
          strokeDasharray="0.6 1.8"
          opacity={0.8}
        />
      </motion.svg>

      {/* Center Interactive Circular Hub ("I turn" First Entrance Anchor) */}
      <motion.div
        initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-1/2 top-1/2 flex aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full z-20"
      >
        {/* Subtle synchronized ambient halo around center hub */}
        {!reducedMotion && (
          <>
            <motion.div
              animate={{
                scale: [1, 1.14, 1],
                opacity: [0.26, 0.52, 0.26],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 -m-3 rounded-full border border-accent/30 pointer-events-none"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: REVOLUTION_DURATION, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 -m-1.5 rounded-full border border-dashed border-accent/25 pointer-events-none"
            />
          </>
        )}

        <motion.div
          animate={
            reducedMotion
              ? {}
              : {
                  scale: [1, 1.025, 1],
                }
          }
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex size-full items-center justify-center rounded-full border border-border/90 bg-card/95 dark:bg-card/85 backdrop-blur-2xl ring-1 ring-accent/20 overflow-hidden shadow-sm"
        >
          {centerHubContent}
        </motion.div>
      </motion.div>

      {/* 5 Outer Discipline Nodes: Product emerges first, then AI, Data, Business, UX evolve, followed by continuous revolution */}
      <motion.div
        animate={reducedMotion || isPaused || isIntroActive ? { rotate: 0 } : { rotate: 360 }}
        transition={{ duration: REVOLUTION_DURATION, repeat: Infinity, ease: "linear" }}
        style={{ originX: "50%", originY: "50%" }}
        className="absolute inset-0 size-full pointer-events-none rounded-full z-10"
      >
        {NODES.map((node) => {
          const pos = polarToCartesian(node.angle, NODE_RADIUS);
          const isActive = activeNode.key === node.key;
          const hasHoverFocus = Boolean(controlledKey);
          const isFaded = hasHoverFocus && !isActive;
          const introDelay = getNodeIntroDelay(node.key);

          return (
            <div key={node.key} className="group pointer-events-auto">
              {/* Interactive Node Button with Embedded Topic Label */}
              <motion.button
                type="button"
                onMouseEnter={() => {
                  setHoveredKey(node.key);
                  setIsPaused(true);
                }}
                onMouseLeave={() => {
                  setHoveredKey(null);
                  setIsPaused(false);
                }}
                onFocus={() => {
                  setHoveredKey(node.key);
                  setIsPaused(true);
                }}
                onBlur={() => {
                  setHoveredKey(null);
                  setIsPaused(false);
                }}
                onClick={() => {
                  const nextKey = selectedKey === node.key ? null : node.key;
                  setSelectedKey(nextKey);
                  if (nextKey) {
                    const nodeIdx = NODES.findIndex((n) => n.key === node.key);
                    playTimelineDiamondChime(nodeIdx >= 0 ? nodeIdx : 0);
                  }
                }}
                aria-label={`${node.name}: ${node.centerSubtitle}`}
                aria-pressed={isActive}
                className={cn(
                  "absolute flex size-20 sm:size-[84px] md:size-[92px] items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer transition-opacity duration-300",
                  isFaded ? "opacity-35" : "opacity-100",
                )}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  x: "-50%",
                  y: "-50%",
                }}
                initial={
                  reducedMotion
                    ? false
                    : {
                        scale: 0,
                        opacity: 0,
                      }
                }
                animate={{
                  scale: isActive ? 1.13 : isFaded ? 0.93 : 1,
                  opacity: isFaded ? 0.35 : 1,
                }}
                transition={{
                  scale: {
                    duration: isIntroActive ? 0.45 : 0.35,
                    delay: isIntroActive ? introDelay : 0,
                    ease: [0.16, 1, 0.3, 1],
                  },
                  opacity: {
                    duration: isIntroActive ? 0.4 : 0.3,
                    delay: isIntroActive ? introDelay : 0,
                  },
                }}
              >
                {/* Counter-rotate the inner icon and embedded topic so they remain upright while revolving */}
                <motion.div
                  animate={reducedMotion || isPaused || isIntroActive ? { rotate: 0 } : { rotate: -360 }}
                  transition={{ duration: REVOLUTION_DURATION, repeat: Infinity, ease: "linear" }}
                  className="flex size-full items-center justify-center"
                >
                  {/* Subtle Clean Ambient Focus Ring when Active with website accent aura */}
                  {isActive && (
                    <motion.div
                      className="absolute -inset-2 rounded-full border border-accent/40 bg-accent/[0.08]"
                      initial={{ scale: 0.95, opacity: 0.8 }}
                      animate={{
                        scale: [1, 1.07, 1],
                        opacity: [0.75, 1, 0.75],
                      }}
                      transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}

                  {/* Glassmorphic Disc Surface with Neutral Clean Border & Main Brand Accent Macro Animation */}
                  <div
                    className={cn(
                      "relative flex size-full flex-col items-center justify-center rounded-full border transition-all duration-300 p-2 backdrop-blur-xl",
                      isActive
                        ? "border-accent/60 bg-accent/[0.10] ring-1 ring-accent/40 shadow-sm"
                        : "border-border/50 bg-card/75 group-hover:border-border/80 group-hover:bg-card text-foreground ring-1 ring-white/10",
                    )}
                  >
                    {/* Upper: Vector Icon with Main Brand Accent Macro Animation */}
                    <motion.div
                      className="flex items-center justify-center"
                      animate={isActive && !reducedMotion ? { scale: [1, 1.08, 1] } : {}}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {renderNodeIcon(node.key, isActive)}
                    </motion.div>

                    {/* Inside Node: Embedded Topic Label */}
                    <span
                      className={cn(
                        "label-mono mt-1 text-[0.6rem] sm:text-[0.65rem] font-bold tracking-[0.16em] uppercase transition-colors select-none leading-none",
                        isActive
                          ? "text-accent font-bold"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {node.name}
                    </span>
                  </div>
                </motion.div>
              </motion.button>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
