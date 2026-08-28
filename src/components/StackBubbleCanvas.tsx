import React, { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, RefreshCw, Filter, Volume2, VolumeX, Trophy, Zap } from "lucide-react";

// Web Audio API Sound Engine
class SlingshotAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeTensionNode: OscillatorNode | null = null;
  private activeTensionGain: GainNode | null = null;

  constructor() {
    // Lazy init audio context on user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.activeTensionGain && this.ctx) {
      this.activeTensionGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Play rubber band stretch tension sound
  public playTension(stretchRatio: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      if (!this.activeTensionNode) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.01, this.ctx.currentTime);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();

        this.activeTensionNode = osc;
        this.activeTensionGain = gain;
      }

      const freq = 140 + Math.min(320, stretchRatio * 220);
      const vol = Math.min(0.12, 0.02 + stretchRatio * 0.08);

      this.activeTensionNode.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.05);
      this.activeTensionGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.05);
    } catch {
      // Audio autoplay safeguard
    }
  }

  public stopTension() {
    if (this.activeTensionGain && this.ctx) {
      try {
        this.activeTensionGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.04);
        setTimeout(() => {
          if (this.activeTensionNode) {
            this.activeTensionNode.stop();
            this.activeTensionNode.disconnect();
            this.activeTensionNode = null;
            this.activeTensionGain = null;
          }
        }, 60);
      } catch {
        this.activeTensionNode = null;
        this.activeTensionGain = null;
      }
    }
  }

  // Play release woosh / snap
  public playRelease(speed: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      const startFreq = 380 + Math.min(400, speed * 15);
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.15);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio autoplay safeguard
    }
  }

  // Play elastic bubble collision pop
  public playCollision(speed: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const freq = 220 + Math.min(350, speed * 25) + Math.random() * 60;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);

      const vol = Math.min(0.22, 0.04 + speed * 0.02);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio safeguard
    }
  }

  // Play musical pentatonic combo chime
  public playCombo(comboCount: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0];
      const noteIndex = Math.min(notes.length - 1, comboCount - 1);
      const freq = notes[noteIndex] || 440;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio safeguard
    }
  }
}

const audioEngine = new SlingshotAudioEngine();

export type NodeCategory = 
  | "all"
  | "pm"
  | "ai"
  | "data"
  | "ux"
  | "tools";

export interface StackNode {
  id: string;
  name: string;
  category: NodeCategory;
  categoryLabel: string;
  ringColor?: string; // hex or CSS var
  isHero?: boolean;
  desc: string;
  links?: string[]; // IDs of related nodes
  
  // Physics properties
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  baseRadius: number;
}

function getRgba(colorStr?: string, alpha = 1): string {
  if (!colorStr) return `rgba(209, 101, 28, ${alpha})`;
  if (colorStr.startsWith("#")) {
    let hex = colorStr.slice(1);
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }
  return colorStr;
}

const CATEGORY_FILTERS: { id: NodeCategory; label: string; color: string }[] = [
  { id: "all", label: "All Skills", color: "#f59e0b" },
  { id: "pm", label: "Product Strategy", color: "#3b82f6" },
  { id: "ai", label: "AI & GenAI", color: "#8b5cf6" },
  { id: "data", label: "Analytics & Data", color: "#10b981" },
  { id: "ux", label: "UX & Design", color: "#ec4899" },
  { id: "tools", label: "Tools & Ops", color: "#0284c7" },
];

export const STACK_NODES_DATA: Omit<StackNode, "x" | "y" | "vx" | "vy" | "radius" | "targetRadius" | "baseRadius">[] = [
  // Product Strategy & Leadership
  {
    id: "prod-strat",
    name: "Product Strategy",
    category: "pm",
    categoryLabel: "product strategy",
    ringColor: "#3b82f6",
    isHero: true,
    desc: "Defines multi-year product visions, market positioning, and growth strategy aligned to enterprise OKRs.",
  },
  {
    id: "roadmapping",
    name: "Roadmapping",
    category: "pm",
    categoryLabel: "product strategy",
    ringColor: "#3b82f6",
    isHero: true,
    desc: "Architects strategic priority roadmaps balancing engineering debt, customer requests, and business ROI.",
  },
  {
    id: "okrs",
    name: "OKRs",
    category: "pm",
    categoryLabel: "product strategy",
    ringColor: "#3b82f6",
    desc: "Establishes quarterly OKR frameworks linking product feature shipping directly to core company KPIs.",
  },
  {
    id: "gtm",
    name: "Go-To-Market",
    category: "pm",
    categoryLabel: "product strategy",
    ringColor: "#3b82f6",
    desc: "Orchestrates GTM rollouts with product marketing, sales enablement, and operational teams.",
  },
  {
    id: "agile-scrum",
    name: "Agile & Scrum",
    category: "pm",
    categoryLabel: "product strategy",
    ringColor: "#3b82f6",
    desc: "Facilitates sprint planning, daily standups, sprint reviews, and iterative backlog grooming.",
  },
  {
    id: "prod-lifecycle",
    name: "Product Lifecycle",
    category: "pm",
    categoryLabel: "product strategy",
    ringColor: "#3b82f6",
    desc: "Manages product progression across discovery, introduction, growth, maturity, and strategic evolution.",
  },
  {
    id: "competitive-intel",
    name: "Competitive Intel",
    category: "pm",
    categoryLabel: "product strategy",
    ringColor: "#3b82f6",
    desc: "Analyzes competitor landscapes, market positioning, moat development, and feature differentiation.",
  },
  {
    id: "user-discovery",
    name: "User Discovery",
    category: "pm",
    categoryLabel: "product strategy",
    ringColor: "#3b82f6",
    desc: "Conducts customer interviews, problem validation, job-to-be-done (JTBD) frameworks, and hypothesis testing.",
  },
  {
    id: "prd-writing",
    name: "PRD & Spec Writing",
    category: "pm",
    categoryLabel: "product strategy",
    ringColor: "#3b82f6",
    desc: "Authors detailed Product Requirement Documents (PRDs), user stories, and technical acceptance criteria.",
  },

  // AI & GenAI Competencies
  {
    id: "gemini",
    name: "Gemini Multimodal",
    category: "ai",
    categoryLabel: "ai / genai",
    ringColor: "#38bdf8",
    isHero: true,
    desc: "Integrates Google Gemini API multimodal vision, audio, and code reasoning into agentic product workflows.",
  },
  {
    id: "claude",
    name: "Claude",
    category: "ai",
    categoryLabel: "ai / genai",
    ringColor: "#a855f7",
    isHero: true,
    desc: "Utilizes Claude long-context models for complex requirement synthesis, document audits, and code analysis.",
  },
  {
    id: "prompt-eng",
    name: "Prompt Engineering",
    category: "ai",
    categoryLabel: "ai / genai",
    ringColor: "#a855f7",
    desc: "Tunes system prompts, few-shot templates, and guardrails to optimize output quality and accuracy.",
  },
  {
    id: "ai-studio",
    name: "Google AI Studio",
    category: "ai",
    categoryLabel: "ai / genai",
    ringColor: "#0284c7",
    desc: "Prototypes system instructions, function calling schemas, and structured JSON generation.",
  },
  {
    id: "antigravity",
    name: "Antigravity Agents",
    category: "ai",
    categoryLabel: "ai / genai",
    ringColor: "#8b5cf6",
    isHero: true,
    desc: "Deploys autonomous agent orchestration and automated task execution runtimes.",
  },
  {
    id: "vibe-coding",
    name: "Vibe Coding",
    category: "ai",
    categoryLabel: "ai / genai",
    ringColor: "#f43f5e",
    desc: "Leverages AI-first full-stack generation to rapidly ship 0→1 web applications and functional prototypes.",
  },

  // Analytics & Data
  {
    id: "sql-analytics",
    name: "SQL Analytics",
    category: "data",
    categoryLabel: "analytics & data",
    ringColor: "#10b981",
    isHero: true,
    desc: "Executes custom database queries for cohort retention analysis, drop-off funnels, and product telemetry.",
  },
  {
    id: "power-bi",
    name: "Power BI",
    category: "data",
    categoryLabel: "analytics & data",
    ringColor: "#f59e0b",
    desc: "Builds self-serve executive dashboards adopted across enterprise departments.",
  },
  {
    id: "tableau",
    name: "Tableau",
    category: "data",
    categoryLabel: "analytics & data",
    ringColor: "#0284c7",
    desc: "Designs visual analytics for enterprise risk, operational telemetry, and user engagement trends.",
  },
  {
    id: "ab-testing",
    name: "A/B Testing",
    category: "data",
    categoryLabel: "analytics & data",
    ringColor: "#10b981",
    desc: "Runs experimentation sprints delivering statistically significant conversion rate uplifts.",
  },
  {
    id: "kpi-dashboards",
    name: "KPI Dashboards",
    category: "data",
    categoryLabel: "analytics & data",
    ringColor: "#10b981",
    desc: "Establishes real-time product health dashboards monitoring DAU/MAU ratios, retention, and churn.",
  },

  // UX & Product Design
  {
    id: "figma",
    name: "Figma",
    category: "ux",
    categoryLabel: "ux & design",
    ringColor: "#f43f5e",
    isHero: true,
    desc: "Proficient in Figma for high-fidelity UI layout, vector design, interactive prototypes, and auto-layout.",
  },
  {
    id: "design-systems",
    name: "Design Systems",
    category: "ux",
    categoryLabel: "ux & design",
    ringColor: "#ec4899",
    isHero: true,
    desc: "Architects scalable component libraries, design tokens, UI guidelines, and cross-platform visual consistency.",
  },
  {
    id: "wireframing",
    name: "Wireframing",
    category: "ux",
    categoryLabel: "ux & design",
    ringColor: "#f59e0b",
    desc: "Creates low and mid-fidelity wireframes for rapid stakeholder alignment and user validation.",
  },
  {
    id: "usability-testing",
    name: "Usability Testing",
    category: "ux",
    categoryLabel: "ux & design",
    ringColor: "#f59e0b",
    desc: "Executes structured usability sessions reducing workflow completion friction and cognitive load.",
  },

  // Tools & Operations
  {
    id: "jira",
    name: "Jira",
    category: "tools",
    categoryLabel: "tools & ops",
    ringColor: "#0284c7",
    isHero: true,
    desc: "Manages backlog grooming, sprint planning, ticket acceptance criteria, and dev velocity.",
  },
  {
    id: "confluence",
    name: "Confluence",
    category: "tools",
    categoryLabel: "tools & ops",
    ringColor: "#0284c7",
    desc: "Maintains product knowledge bases, technical specs, and comprehensive PRDs.",
  },
  {
    id: "github",
    name: "GitHub",
    category: "tools",
    categoryLabel: "tools & ops",
    ringColor: "#a855f7",
    desc: "CI/CD pipelines, code review velocity, and open-source collaboration.",
  },
  {
    id: "azure-devops",
    name: "Azure DevOps",
    category: "tools",
    categoryLabel: "tools & ops",
    ringColor: "#0284c7",
    desc: "Tracks enterprise work items, CI/CD pipelines, and delivery velocity across squads.",
  },
];

interface StackBubbleCanvasProps {
  onSelectNode?: (node: StackNode) => void;
}

export function StackBubbleCanvas({ onSelectNode }: StackBubbleCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeCategory, setActiveCategory] = useState<NodeCategory>("all");
  const [selectedNode, setSelectedNode] = useState<StackNode | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);

  const activeCategoryRef = useRef<NodeCategory>("all");
  const selectedNodeRef = useRef<StackNode | null>(null);

  activeCategoryRef.current = activeCategory;
  selectedNodeRef.current = selectedNode;

  const nodesRef = useRef<StackNode[]>([]);
  const particlesRef = useRef<
    {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      decay: number;
    }[]
  >([]);
  const floatingTextsRef = useRef<
    {
      x: number;
      y: number;
      text: string;
      color: string;
      alpha: number;
      scale: number;
    }[]
  >([]);
  const currentComboRef = useRef(1);
  const launchedNodeIndexRef = useRef<number>(-1);

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    active: false,
    isDragging: false,
    dragNodeIndex: -1,
    anchorX: 0,
    anchorY: 0,
    lastX: -1000,
    lastY: -1000,
    vx: 0,
    vy: 0,
  });
  const animFrameRef = useRef<number | null>(null);

  const CANVAS_HEIGHT = 540;

  // Initialize nodes with layout physics
  const initNodes = useCallback((width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const isMobile = width < 640;
    const isSmallMobile = width < 480;

    nodesRef.current = STACK_NODES_DATA.map((data, index) => {
      // Calculate initial radius based on screen width and hero status
      const baseRadius = data.isHero
        ? isSmallMobile
          ? 32
          : isMobile
          ? 38
          : 52
        : isSmallMobile
        ? 22
        : isMobile
        ? 26
        : 36;
      
      // Golden spiral distribution for initial positions
      const phi = index * 137.5 * (Math.PI / 180);
      const distance = Math.sqrt(index + 1) * (isSmallMobile ? 22 : isMobile ? 28 : 44);
      const x = cx + Math.cos(phi) * distance;
      const y = cy + Math.sin(phi) * distance;

      return {
        ...data,
        x: Math.max(baseRadius + 10, Math.min(width - baseRadius - 10, x)),
        y: Math.max(baseRadius + 10, Math.min(height - baseRadius - 10, y)),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: baseRadius,
        baseRadius,
        targetRadius: baseRadius,
      };
    });
  }, []);

  // Main Canvas & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContainer = canvasContainerRef.current;
    if (!canvas || !canvasContainer) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = canvasContainer.clientWidth;
    let height = canvasContainer.clientHeight || CANVAS_HEIGHT;
    let dpr = window.devicePixelRatio || 1;

    const updateCanvasSize = () => {
      if (!canvasContainer || !canvas) return;
      const nw = canvasContainer.clientWidth;
      const nh = canvasContainer.clientHeight || CANVAS_HEIGHT;
      dpr = window.devicePixelRatio || 1;
      width = nw;
      height = nh;
      canvas.width = Math.round(nw * dpr);
      canvas.height = Math.round(nh * dpr);
      canvas.style.width = `${nw}px`;
      canvas.style.height = `${nh}px`;
    };

    updateCanvasSize();
    initNodes(width, height);

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    resizeObserver.observe(canvasContainer);

    const handleWindowResize = () => {
      updateCanvasSize();
    };
    window.addEventListener("resize", handleWindowResize);

    let time = 0;
    let isIntersecting = false;
    let isPageVisible = !document.hidden;

    const render = () => {
      if (!isIntersecting || !isPageVisible) {
        animFrameRef.current = 0;
        return;
      }

      time += 0.016;
      
      // Ensure crystal-clear Retina high-DPI transform
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const currentCategory = activeCategoryRef.current;
      const currentSelected = selectedNodeRef.current;

      const cx = width / 2;
      const cy = height / 2;

      // Resolve body font family from computed styles or fallback to site typography tokens
      const bodyFont = typeof window !== "undefined"
        ? getComputedStyle(document.body).getPropertyValue("--font-body-family").trim() || "'Urbanist', 'Plus Jakarta Sans', 'Inter', sans-serif"
        : "'Urbanist', 'Plus Jakarta Sans', 'Inter', sans-serif";

      // 1. Physics & Forces Loop
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!;

        const isMatchedCategory =
          currentCategory === "all" || node.category === currentCategory;

        // Keep clean base radius
        node.radius = node.baseRadius;

        // If dragging this node
        if (mouse.isDragging && mouse.dragNodeIndex === i) {
          node.x += (mouse.x - node.x) * 0.35;
          node.y += (mouse.y - node.y) * 0.35;
          node.vx = (mouse.x - node.x) * 0.08;
          node.vy = (mouse.y - node.y) * 0.08;
        } else {
          // Soft central gravity towards center
          const dxCenter = cx - node.x;
          const dyCenter = cy - node.y;
          const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
          if (distCenter > 10) {
            node.vx += (dxCenter / distCenter) * 0.022;
            node.vy += (dyCenter / distCenter) * 0.022;
          }

          // Gentle ambient floating drift
          node.vx += Math.sin(time * 0.6 + i) * 0.025;
          node.vy += Math.cos(time * 0.7 + i * 1.3) * 0.025;

          // Smooth Mouse Repulsion / Interactive hover reaction force
          if (mouse.active) {
            const mdx = node.x - mouse.x;
            const mdy = node.y - mouse.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            const mRange = 150;

            if (mdist < mRange && mdist > 1) {
              const force = (1 - mdist / mRange) * 0.85;
              node.vx += (mdx / mdist) * force;
              node.vy += (mdy / mdist) * force;
            }
          }

          // Node-to-node velocity-based collision detection
          for (let j = i + 1; j < nodes.length; j++) {
            const other = nodes[j]!;
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = node.radius + other.radius + 4;

            if (dist < minDist && dist > 0.001) {
              const overlap = minDist - dist;
              const nx = dx / dist;
              const ny = dy / dist;

              // Separate positions immediately to prevent overlapping or passing through
              const separate = overlap * 0.5;
              node.x -= nx * separate;
              node.y -= ny * separate;
              other.x += nx * separate;
              other.y += ny * separate;

              // Calculate relative velocity along collision normal
              const kx = node.vx - other.vx;
              const ky = node.vy - other.vy;
              const velAlongNormal = kx * nx + ky * ny;

              // Natural elastic bounce if moving towards each other
              if (velAlongNormal > 0) {
                const restitution = 0.85;
                const impulse = (1 + restitution) * velAlongNormal * 0.5;
                node.vx -= nx * impulse;
                node.vy -= ny * impulse;
                other.vx += nx * impulse;
                other.vy += ny * impulse;

                // Play collision sound & combo multiplier if high-speed hit
                const speed = Math.hypot(kx, ky);
                if (speed > 2.5) {
                  audioEngine.playCollision(speed);

                  // Score bonus calculation
                  if (i === launchedNodeIndexRef.current || j === launchedNodeIndexRef.current) {
                    const currentCombo = currentComboRef.current;
                    const pts = 100 * currentCombo;

                    audioEngine.playCombo(currentCombo);

                    // Add floating score text popup at collision point
                    const midX = (node.x + other.x) / 2;
                    const midY = (node.y + other.y) / 2;
                    const label = currentCombo > 1 ? `+${pts} (${currentCombo}x COMBO!)` : `+${pts}`;
                    
                    floatingTextsRef.current.push({
                      x: midX,
                      y: midY,
                      text: label,
                      color: node.ringColor || "#f59e0b",
                      alpha: 1,
                      scale: 1.2,
                    });

                    setScore((prev) => prev + pts);
                    setCombo(currentCombo);
                    currentComboRef.current += 1;
                  }
                }
              }
            }
          }

          // Apply velocity damping
          node.vx *= 0.92;
          node.vy *= 0.92;

          // Update position
          node.x += node.vx;
          node.y += node.vy;

          // Boundary bounce dampening
          const pad = node.radius + 12;
          if (node.x < pad) {
            node.x = pad;
            node.vx *= -0.5;
          } else if (node.x > width - pad) {
            node.x = width - pad;
            node.vx *= -0.5;
          }

          if (node.y < pad) {
            node.y = pad;
            node.vy *= -0.5;
          } else if (node.y > height - pad) {
            node.y = height - pad;
            node.vy *= -0.5;
          }
        }
      }

      // 2. Render Slingshot Rubber Band & Trajectory Vector
      if (mouse.isDragging && mouse.dragNodeIndex >= 0) {
        const draggedNode = nodes[mouse.dragNodeIndex];
        if (draggedNode) {
          const ax = mouse.anchorX;
          const ay = mouse.anchorY;
          const nx = draggedNode.x;
          const ny = draggedNode.y;

          const dx = ax - nx;
          const dy = ay - ny;
          const stretch = Math.hypot(dx, dy);

          if (stretch > 6) {
            audioEngine.playTension(stretch / 100);

            ctx.save();

            // Anchor Peg Point
            ctx.beginPath();
            ctx.arc(ax, ay, 5, 0, Math.PI * 2);
            ctx.fillStyle = getRgba(draggedNode.ringColor, 0.4);
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = getRgba(draggedNode.ringColor, 0.8);
            ctx.stroke();

            // Elastic Rubber Band String
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(nx, ny);
            ctx.lineWidth = Math.max(1, Math.min(3, 3.5 - stretch * 0.012));
            ctx.strokeStyle = getRgba(draggedNode.ringColor, 0.75);
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Aiming Trajectory Dots Projection
            const launchAngle = Math.atan2(dy, dx);
            const aimDist = Math.min(180, stretch * 1.5);
            for (let d = 14; d <= aimDist; d += 14) {
              const tx = nx + Math.cos(launchAngle) * d;
              const ty = ny + Math.sin(launchAngle) * d;
              ctx.beginPath();
              ctx.arc(tx, ty, Math.max(1, 2.5 - (d / aimDist) * 1.5), 0, Math.PI * 2);
              ctx.fillStyle = getRgba(draggedNode.ringColor, 0.6);
              ctx.fill();
            }

            ctx.restore();
          }
        }
      }

      // 3. Render Particles Burst
      const particles = particlesRef.current;
      for (let p = particles.length - 1; p >= 0; p--) {
        const pt = particles[p]!;
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vx *= 0.94;
        pt.vy *= 0.94;
        pt.alpha -= pt.decay;

        if (pt.alpha <= 0) {
          particles.splice(p, 1);
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.alpha;
          ctx.fill();
          ctx.restore();
        }
      }

      // 3.5 Render Floating Score Text
      const floatingTexts = floatingTextsRef.current;
      for (let t = floatingTexts.length - 1; t >= 0; t--) {
        const ft = floatingTexts[t]!;
        ft.y -= 1.2;
        ft.alpha -= 0.022;
        if (ft.alpha <= 0) {
          floatingTexts.splice(t, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = ft.alpha;
          ctx.font = `bold 13px ${bodyFont}`;
          ctx.fillStyle = ft.color;
          ctx.textAlign = "center";
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.restore();
        }
      }

      // 4. Render Nodes (Bubbles)
      const focusedNode = currentSelected;
      const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!;
        const isMatchedCategory =
          currentCategory === "all" || node.category === currentCategory;
        const isFocused = focusedNode?.id === node.id;

        let alpha = isMatchedCategory ? 1 : 0.28;
        if (focusedNode && !isFocused) {
          alpha *= 0.55;
        }

        ctx.save();
        ctx.globalAlpha = alpha;

        const ringColor = node.ringColor || "#d1651c";

        // Main Circular Node Body
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        // Minimalist matte background with a subtle hint of category tint
        if (isDark) {
          ctx.fillStyle = getRgba(ringColor, 0.06);
          ctx.fill();
          ctx.fillStyle = "#161822";
          ctx.fill();
        } else {
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.fillStyle = getRgba(ringColor, 0.04);
          ctx.fill();
        }

        // Clean, thin border stroke
        ctx.lineWidth = isFocused ? 1.0 : node.isHero ? 0.75 : 0.5;
        ctx.strokeStyle = getRgba(ringColor, isFocused ? 0.85 : isDark ? 0.4 : 0.3);
        ctx.stroke();

        // Minimal top color dot indicator inside bubble
        const dotRadius = Math.max(1.5, Math.round(node.radius * 0.06));
        const dotY = node.y - node.radius * 0.52;
        ctx.beginPath();
        ctx.arc(node.x, dotY, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = getRgba(ringColor, isFocused ? 0.9 : 0.7);
        ctx.fill();

        // Text Styling using site's typography set (regular 400 weight body font)
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (isDark) {
          ctx.fillStyle = isMatchedCategory ? "#f8fafc" : "#94a3b8";
        } else {
          ctx.fillStyle = isMatchedCategory ? "#0f172a" : "#64748b";
        }

        // Auto-wrap and auto-fit text inside bubble boundaries
        let lines: string[] = [];
        if (node.name.includes(" ")) {
          lines = node.name.split(" ");
        } else if (node.name.includes("/")) {
          lines = node.name.split("/");
        } else {
          lines = [node.name];
        }

        let titleFontSize = Math.max(
          node.radius < 26 ? 8 : 10,
          Math.min(14, Math.round(node.radius * (width < 480 ? 0.32 : 0.28)))
        );
        ctx.font = `500 ${titleFontSize}px ${bodyFont}`;

        // Measure maximum line width and scale down if it exceeds bubble interior limit
        const maxAllowedWidth = node.radius * 1.7;
        let maxLineWidth = 0;
        lines.forEach((line) => {
          const w = ctx.measureText(line).width;
          if (w > maxLineWidth) maxLineWidth = w;
        });

        if (maxLineWidth > maxAllowedWidth && maxLineWidth > 0) {
          const scaleFactor = maxAllowedWidth / maxLineWidth;
          titleFontSize = Math.max(7.5, Math.floor(titleFontSize * scaleFactor));
          ctx.font = `500 ${titleFontSize}px ${bodyFont}`;
        }

        const lineHeight = titleFontSize * 1.25;
        const totalTextHeight = lines.length * lineHeight;
        const startY = node.y - totalTextHeight / 2 + lineHeight / 2;

        lines.forEach((line, idx) => {
          ctx.fillText(line, node.x, startY + idx * lineHeight);
        });

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    const tryStart = () => {
      if (isIntersecting && isPageVisible && (!animFrameRef.current || animFrameRef.current === 0)) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = !!entry?.isIntersecting;
        if (isIntersecting) {
          tryStart();
        } else if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = 0;
        }
      },
      { threshold: 0.05 }
    );
    io.observe(canvasContainer);

    const handleVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) {
        tryStart();
      } else if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = 0;
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    tryStart();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initNodes]);

  // Pointer Interaction Handlers
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const nx = e.clientX - rect.left;
    const ny = e.clientY - rect.top;

    const mouse = mouseRef.current;
    if (mouse.lastX !== -1000) {
      mouse.vx = nx - mouse.lastX;
      mouse.vy = ny - mouse.lastY;
    }
    mouse.lastX = nx;
    mouse.lastY = ny;
    mouse.x = nx;
    mouse.y = ny;
    mouse.active = true;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const nodes = nodesRef.current;
    let hitIndex = -1;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]!;
      const dx = node.x - mx;
      const dy = node.y - my;
      if (Math.hypot(dx, dy) <= node.radius + 8) {
        hitIndex = i;
        break;
      }
    }

    if (hitIndex >= 0) {
      const clicked = nodes[hitIndex]!;
      const mouse = mouseRef.current;
      mouse.isDragging = true;
      mouse.dragNodeIndex = hitIndex;
      mouse.anchorX = clicked.x;
      mouse.anchorY = clicked.y;
      mouse.lastX = mx;
      mouse.lastY = my;
      mouse.vx = 0;
      mouse.vy = 0;

      setSelectedNode(clicked);
      if (onSelectNode) onSelectNode(clicked);
    } else {
      setSelectedNode(null);
    }
  };

  const handlePointerUp = () => {
    releaseSlingshot();
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
    releaseSlingshot();
  };

  const releaseSlingshot = () => {
    audioEngine.stopTension();
    const mouse = mouseRef.current;
    if (mouse.isDragging && mouse.dragNodeIndex >= 0) {
      const node = nodesRef.current[mouse.dragNodeIndex];
      if (node) {
        // Calculate slingshot vector from dragged position back to anchor position
        const dx = mouse.anchorX - node.x;
        const dy = mouse.anchorY - node.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
          // Slingshot pull-back launch force
          const launchFactor = 0.22;
          node.vx = dx * launchFactor + mouse.vx * 0.4;
          node.vy = dy * launchFactor + mouse.vy * 0.4;

          // Cap maximum launch speed to keep it controllable & smooth
          const speed = Math.hypot(node.vx, node.vy);
          const maxSpeed = 26;
          if (speed > maxSpeed) {
            node.vx = (node.vx / speed) * maxSpeed;
            node.vy = (node.vy / speed) * maxSpeed;
          }

          // Play release audio snap
          audioEngine.playRelease(speed);
          launchedNodeIndexRef.current = mouse.dragNodeIndex;
          currentComboRef.current = 1;

          // Spawn slingshot launch particle burst
          const color = node.ringColor || "#f59e0b";
          for (let p = 0; p < 12; p++) {
            const angle = Math.atan2(node.vy, node.vx) + (Math.random() - 0.5) * 1.2;
            const pSpeed = 2 + Math.random() * 6;
            particlesRef.current.push({
              x: node.x,
              y: node.y,
              vx: Math.cos(angle) * pSpeed,
              vy: Math.sin(angle) * pSpeed,
              color,
              size: 2 + Math.random() * 3,
              alpha: 0.9,
              decay: 0.03 + Math.random() * 0.03,
            });
          }
        } else if (Math.hypot(mouse.vx, mouse.vy) > 1.5) {
          // Direct drag momentum push
          node.vx = mouse.vx * 0.8;
          node.vy = mouse.vy * 0.8;
        }
      }
    }
    mouse.isDragging = false;
    mouse.dragNodeIndex = -1;
  };

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
  };

  const handleResetLayout = () => {
    const canvasContainer = canvasContainerRef.current;
    if (canvasContainer) {
      const width = canvasContainer.clientWidth;
      const height = canvasContainer.clientHeight || CANVAS_HEIGHT;
      initNodes(width, height);
      setScore(0);
      setCombo(1);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-card/70 via-card/30 to-background/50 backdrop-blur-xl transition-all duration-300">
      {/* Decorative Grid Mesh Subtle Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(209,101,28,0.06),transparent_70%)] pointer-events-none" />

      {/* Top Header Filter & Control Bar without borders */}
      <div className="relative z-10 flex flex-col gap-2.5 p-3.5 sm:p-4 bg-transparent">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
            <span className="font-mono text-xs uppercase font-bold text-accent tracking-widest">
              THE OPERATING STACK
            </span>
            {selectedNode && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-0.5 font-mono text-[0.7rem] font-bold text-accent animate-fade-in">
                <span>{selectedNode.name}</span>
                <span className="text-muted-foreground">• {selectedNode.categoryLabel}</span>
              </span>
            )}
          </div>

          {/* Interactive Game Stats & Sound Controls */}
          <div className="flex items-center gap-2">
            {score > 0 && (
              <div className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 px-2.5 py-1 font-mono text-xs font-bold text-amber-500 animate-fade-in">
                <Trophy className="size-3.5" />
                <span>{score.toLocaleString()} PTS</span>
                {combo > 1 && (
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-500/20 px-1.5 py-0.2 text-[0.65rem] text-amber-400">
                    <Zap className="size-2.5" />
                    {combo}x
                  </span>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleToggleSound}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-[0.68rem] uppercase font-bold transition-all cursor-pointer ${
                isMuted
                  ? "bg-secondary/60 text-muted-foreground hover:text-foreground"
                  : "bg-accent/15 text-accent hover:bg-accent/25"
              }`}
              title={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
            >
              {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5 animate-pulse" />}
              <span className="hidden xs:inline">{isMuted ? "Muted" : "Sound ON"}</span>
            </button>

            <button
              type="button"
              onClick={handleResetLayout}
              className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/70 px-2.5 py-1 font-mono text-[0.68rem] uppercase font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              title="Reset Bubble Positions"
            >
              <RefreshCw className="size-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills & Color Indicators */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            <Filter className="size-3 text-accent shrink-0 mr-0.5" />
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 font-mono text-[0.72rem] font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm shadow-accent/20 scale-105"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary/90"
                  }`}
                >
                  <span
                    className="size-2 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subtitle description when a node is selected */}
        {selectedNode && (
          <div className="pt-1.5 text-xs text-muted-foreground animate-fade-in">
            <p className="line-clamp-1 font-sans text-foreground/90">
              <strong className="text-accent font-semibold">{selectedNode.name}:</strong> {selectedNode.desc}
            </p>
          </div>
        )}
      </div>

      {/* Main Physics Bubble Canvas with Responsive Height */}
      <div ref={canvasContainerRef} className="relative h-[420px] sm:h-[500px] md:h-[540px] w-full cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          className="block size-full touch-none"
        />
      </div>
    </div>
  );
}
