import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Disc3, Coffee, Compass, Bike, BookOpen, Camera } from "lucide-react";

export type HumanAnimationMode =
  | "vinyl"
  | "constellation"
  | "topography"
  | "aurora"
  | "stamps"
  | "fireflies"
  | "none";

interface HumanBackgroundEffectsProps {
  mode: HumanAnimationMode;
}

/* =========================================================================
   1. DYNAMIC VINYL SOUNDWAVE & ANALOG DUST (Interactive)
   ========================================================================= */
function VinylSoundwaveEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean; velocity: number }>({
    x: 0,
    y: 0,
    active: false,
    velocity: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse movement tracking for acoustic resonance
    let lastX = 0;
    let lastY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const dx = currentX - lastX;
      const dy = currentY - lastY;
      const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 25);

      mouseRef.current = {
        x: currentX,
        y: currentY,
        active: currentX >= 0 && currentX <= width && currentY >= 0 && currentY <= height,
        velocity: speed,
      };
      lastX = currentX;
      lastY = currentY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Dynamic Analog vinyl dust particles
    const dustCount = Math.min(Math.floor(width / 24), 50);
    const particles = Array.from({ length: dustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseSize: Math.random() * 1.8 + 0.6,
      size: 1,
      speedX: (Math.random() - 0.5) * 0.12,
      speedY: (Math.random() - 0.5) * 0.12 - 0.05,
      opacity: Math.random() * 0.4 + 0.12,
      color:
        Math.random() > 0.6
          ? "249, 115, 22" // Electric orange
          : Math.random() > 0.3
          ? "245, 158, 11" // Golden amber
          : "224, 86, 56", // Terracotta
      wobble: Math.random() * Math.PI * 2,
    }));

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      // Slowed step progression from 0.018 down to 0.007 (>60% slower, gentle flow)
      step += 0.007;

      const { x: mouseX, y: mouseY, active: mouseActive, velocity } = mouseRef.current;

      // 4 Multi-tier Harmonic Acoustic Waves - Calmed, smooth, professional frequencies & speeds
      const waves = [
        {
          freq: 0.0025,
          speed: 0.008,
          amp: 24,
          y: height * 0.38,
          color: "rgba(249, 115, 22, 0.13)",
          width: 2.0,
          glow: "rgba(249, 115, 22, 0.18)",
        },
        {
          freq: 0.0042,
          speed: -0.006,
          amp: 32,
          y: height * 0.50,
          color: "rgba(245, 158, 11, 0.15)",
          width: 1.6,
          glow: "rgba(245, 158, 11, 0.20)",
        },
        {
          freq: 0.0035,
          speed: 0.005,
          amp: 20,
          y: height * 0.62,
          color: "rgba(224, 86, 56, 0.12)",
          width: 1.4,
          glow: "rgba(224, 86, 56, 0.12)",
        },
        {
          freq: 0.0055,
          speed: -0.008,
          amp: 14,
          y: height * 0.74,
          color: "rgba(251, 146, 60, 0.09)",
          width: 1.0,
          glow: "transparent",
        },
      ];

      waves.forEach((w) => {
        ctx.beginPath();
        ctx.strokeStyle = w.color;
        ctx.lineWidth = w.width;
        if (w.glow !== "transparent") {
          ctx.shadowColor = w.glow;
          ctx.shadowBlur = 6;
        }

        for (let x = 0; x <= width; x += 4) {
          // Calculate natural organic wave
          const baseSine = Math.sin(x * w.freq + step * 2 + w.speed) * w.amp;
          const harmonic = Math.sin(x * 0.0015 - step) * 12;

          // Interactive cursor resonance ripple
          let cursorPerturbation = 0;
          if (mouseActive) {
            const distFromMouse = Math.abs(x - mouseX);
            if (distFromMouse < 220) {
              const proximityFactor = Math.cos((distFromMouse / 220) * (Math.PI / 2));
              cursorPerturbation =
                Math.sin(distFromMouse * 0.08 - step * 6) *
                (14 + velocity * 0.8) *
                proximityFactor;
            }
          }

          const y = w.y + baseSine + harmonic + cursorPerturbation;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Render Interactive Vinyl Micro-Dust Particles
      particles.forEach((p) => {
        p.wobble += 0.008;
        p.x += p.speedX + Math.sin(p.wobble) * 0.08;
        p.y += p.speedY + Math.cos(p.wobble) * 0.06;

        // Cursor interaction (gentle attraction / velocity breeze)
        if (mouseActive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 1) {
            const force = (1 - dist / 140) * 0.4;
            p.x += (dx / dist) * force * 0.8;
            p.y += (dy / dist) * force * 0.8;
          }
        }

        // Wrap around bounds
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const pulse = 1 + Math.sin(p.wobble * 2) * 0.18;
        p.size = p.baseSize * pulse;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();
      });

      if (!document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        animationFrameId = 0;
      }
    };

    const handleVisibility = () => {
      if (!document.hidden && animationFrameId === 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 size-full overflow-hidden z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full opacity-90 transition-opacity duration-700"
      />
    </div>
  );
}

/* =========================================================================
   2. CONSTELLATION OF PASSIONS
   ========================================================================= */
function ConstellationEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const nodeLabels = ["Espresso", "Vinyl", "Cycling", "Typography", "Books", "Travel", "Film", "Architecture"];
    const nodeCount = Math.min(Math.floor(width / 70), 22);

    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      radius: Math.random() * 2 + 1.5,
      label: i < nodeLabels.length ? nodeLabels[i] : null,
      color: i % 3 === 0 ? "249, 115, 22" : i % 3 === 1 ? "245, 158, 11" : "224, 86, 56",
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 160;

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 20 || n.x > width - 20) n.vx *= -1;
        if (n.y < 20 || n.y > height - 20) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color}, 0.8)`;
        ctx.fill();

        if (n.label) {
          ctx.font = "10px monospace";
          ctx.fillStyle = `rgba(${n.color}, 0.55)`;
          ctx.fillText(n.label, n.x + 8, n.y + 3);
        }
      });

      if (!document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        animationFrameId = 0;
      }
    };

    const handleVisibility = () => {
      if (!document.hidden && animationFrameId === 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 size-full opacity-80 z-0"
    />
  );
}

/* =========================================================================
   3. ORGANIC TOPOGRAPHIC ELEVATION CONTOURS
   ========================================================================= */
function TopographyEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    let t = 0;
    const lineCount = 7;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.003;

      for (let i = 0; i < lineCount; i++) {
        ctx.beginPath();
        const yBase = (height / (lineCount + 1)) * (i + 1);
        const alpha = 0.07 + (i % 2 === 0 ? 0.06 : 0.03);
        ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
        ctx.lineWidth = 1;

        for (let x = 0; x < width; x += 8) {
          const noise1 = Math.sin(x * 0.003 + t + i * 0.6) * 35;
          const noise2 = Math.cos(x * 0.006 - t * 0.5 + i) * 20;
          const y = yBase + noise1 + noise2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (!document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        animationFrameId = 0;
      }
    };

    const handleVisibility = () => {
      if (!document.hidden && animationFrameId === 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 size-full opacity-90 z-0"
    />
  );
}

/* =========================================================================
   4. GOLDEN HOUR AURORA
   ========================================================================= */
function GoldenHourAuroraEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-55 dark:opacity-45 z-0">
      <motion.div
        className="absolute -top-24 -left-20 size-96 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-600/20 blur-3xl"
        animate={{
          x: [0, 40, -30, 0],
          y: [0, 60, 20, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 36,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/3 -right-24 size-[28rem] rounded-full bg-gradient-to-bl from-orange-500/25 via-amber-400/20 to-transparent blur-3xl"
        animate={{
          x: [0, -50, 30, 0],
          y: [0, -40, 50, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 44,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-32 left-1/4 size-[26rem] rounded-full bg-gradient-to-tr from-terracotta/25 to-amber-500/25 blur-3xl"
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -30, 20, 0],
          scale: [0.95, 1.1, 1, 0.95],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

/* =========================================================================
   5. TACTILE STAMPS & BADGES
   ========================================================================= */
function TactileStampsEffect() {
  const badges = [
    { icon: Disc3, label: "33⅓ RPM Analog Vinyl", top: "12%", left: "4%", rotate: -8 },
    { icon: Coffee, label: "9-Bar Single Origin", top: "72%", left: "6%", rotate: 6 },
    { icon: Bike, label: "120km Gravel Ridge", top: "18%", right: "5%", rotate: 10 },
    { icon: Camera, label: "35mm Grain Film", top: "78%", right: "8%", rotate: -6 },
    { icon: BookOpen, label: "Field Notes & Ink", top: "46%", left: "2%", rotate: 4 },
    { icon: Compass, label: "Off-Grid Exploration", top: "48%", right: "3%", rotate: -12 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 hidden lg:block opacity-65 dark:opacity-50">
      {badges.map((b, i) => {
        const Icon = b.icon;
        return (
          <motion.div
            key={b.label}
            style={{
              position: "absolute",
              top: b.top,
              left: b.left,
              right: b.right,
              transform: `rotate(${b.rotate}deg)`,
            }}
            animate={{
              y: [0, -10, 0],
              rotate: [b.rotate, b.rotate + 3, b.rotate],
            }}
            transition={{
              duration: 14 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
            className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md px-3 py-1.5 shadow-sm"
          >
            <Icon className="size-3.5 text-accent" />
            <span className="font-mono text-[0.68rem] font-semibold text-muted-foreground uppercase tracking-wider">
              {b.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* =========================================================================
   6. CLASSIC FIREFLIES
   ========================================================================= */
function FirefliesEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-65 z-0">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute size-1.5 rounded-full bg-accent"
          style={{
            left: `${(i * 7.3 + 12) % 95}%`,
            top: `${(i * 9.1 + 8) % 90}%`,
            boxShadow: "0 0 8px var(--accent)",
          }}
          animate={{
            y: [0, -35, 10, 0],
            x: [0, 20, -15, 0],
            opacity: [0.2, 0.85, 0.1, 0.2],
            scale: [0.8, 1.4, 0.9, 0.8],
          }}
          transition={{
            duration: 18 + (i % 5) * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i % 6) * 0.7,
          }}
        />
      ))}
    </div>
  );
}

export function HumanBackgroundEffects({ mode }: HumanBackgroundEffectsProps) {
  switch (mode) {
    case "vinyl":
      return <VinylSoundwaveEffect />;
    case "constellation":
      return <ConstellationEffect />;
    case "topography":
      return <TopographyEffect />;
    case "aurora":
      return <GoldenHourAuroraEffect />;
    case "stamps":
      return <TactileStampsEffect />;
    case "fireflies":
      return <FirefliesEffect />;
    case "none":
    default:
      return null;
  }
}
