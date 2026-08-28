import { useEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  updateContainmentStrainSound,
  stopContainmentStrainSound,
  playPositronTransformationSound,
  playRecombinationSound,
  playLensTransformationSound,
  playDartBullseyeSound,
  playPositronChargeTick,
  playPositronBlastSound,
  playTimelineDiamondChime,
  playSmileyMorphSound,
  playFireflyMorphSound,
} from "@/lib/quantum-audio";

interface RoamingPhotonBallsProps {
  containerRef?: RefObject<HTMLElement | null>;
}

interface ParticleTrail {
  x: number;
  y: number;
  alpha: number;
  size: number;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vRot: number;
  color: string;
  shape: "rect" | "circle" | "strip";
  life: number;
  maxLife: number;
  gravity: number;
  wobble: number;
  wobbleSpeed: number;
}

// Constant visual specifications for 100% identical appearance in Hero chamber
const PHOTON_CORE_RADIUS = 2.7;
const PHOTON_GLOW_RADIUS = 7.5;
const PHOTON_CORONA_RADIUS = 22;

export function RoamingPhotonBalls({ containerRef }: RoamingPhotonBallsProps) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    // Viewport mouse coordinates
    let mouseX = -1000;
    let mouseY = -1000;
    let isMouseActive = false;

    // Transformation states
    let lensMorph = 0; // 0 = Positron, 1 = Fully formed Lens (Section 03)
    let hasPlayedLensSound = false;

    let dartMorph = 0; // 0 = Positron, 1 = Dartboard (Section 04)
    let dartboardStayTimer = 0; // Counts frames after dartboard arrival to create the ~2s delay before arrow strikes
    let arrowFlight = 0; // 0 = not launched, 0->1 in flight, 1 = struck bullseye
    let hasStruckDart = false;
    let dartImpactTimer = 0;

    // Section 05 Blast states (3-second countdown detonation & orange typography transformation)
    let section05ChargeTimer = 0; // Counts frames in Section 05 (180 frames = 3 seconds @ 60fps)
    let hasBlastedSection05 = false;
    let section05BlastImpactTimer = 0;
    let lastChargeTickSec = -1;
    let positronVisibility = 1; // 1 = fully visible, 0 = completely disappears after blast

    // Section 06 Timeline Waypoint & Quantum Stick Figure Character Tracking states
    let timelineActiveDiamond = -1;
    let lastAudibleDiamond = -1;
    let section06GlowTimer = 0;
    let section06ChronometerMorph = 0; // 0 = standard Positron, 1 = Precision Chronometer
    let section06StickMorph = 0; // 0 = standard Positron/other, 1 = Stick Figure Character
    let stickJumpProgress = 1.0; // 0 = start of run, 1 = landed on target card
    let jumpStartPos = { x: 0, y: 0 };
    let jumpTargetPos = { x: 0, y: 0 };
    let lastStickCardIndex = -1;
    let stickFacingDir = 1; // 1 = right, -1 = left

    // Section 08 Smiley Transformation states (Docked next to "solving?")
    let smileyMorph = 0; // 0 = Positron, 1 = Radiant Quantum Smiley Face
    let hasPlayedSmileySound = false;
    let section08StateTimer = 0; // Dynamic timeline for envelope & paper airplane sequence
    let section08TargetX = 0;
    let section08TargetY = 0;
    let hireMeTargetX = 0;
    let hireMeTargetY = 0;
    let section08HoverActive = 0; // Smooth interpolator for airplane hover wobble/takeoff
    let isSection08Hovered = false; // Mouse hover detection state

    // Section 07 Firefly states (Roaming inside section 07)
    let fireflyMorph = 0; // 0 = Positron, 1 = Organic Pulsing Firefly
    let hasPlayedFireflySound = false;
    let section07TargetX = 0;
    let section07TargetY = 0;
    let fireflyPerchTimer = 0;
    let isFireflyPerched = false;
    let fireflyPerchedX = 0;
    let fireflyPerchedY = 0;

    // Sparks & Shockwaves & Confetti pools
    const sparks: SparkParticle[] = [];
    const shockwaves: Shockwave[] = [];
    const confetti: ConfettiPiece[] = [];

    const handleResize = () => {
      if (!canvas) return;
      vw = window.innerWidth;
      vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // 4 Photons inside Hero Chamber - ALL EXACTLY IDENTICAL IN APPEARANCE
    // Photon 0 is designated to exert strain and emerge into a Positron
    const photonLeader = {
      x: vw * 0.45,
      y: vh * 0.35,
      vx: 0,
      vy: 0,
      baseAngle: 0,
      speed: 0.024,
      cursorLag: 0.075,
      orbitAngle: 0,
      orbitSpeed: 0.045,
      orbitRadius: 28,
      state: "IN_HERO" as "IN_HERO" | "STRAINING" | "POSITRON",
      strain: 0,
      tetherAnchorX: 0,
      tetherAnchorY: 0,
      recombinationTimer: 0,
      trail: [] as ParticleTrail[],
    };

    const photonFollowers = [
      {
        normX: 0.28,
        normY: 0.42,
        x: vw * 0.28,
        y: vh * 0.42,
        vx: 0,
        vy: 0,
        baseAngle: 0,
        speed: 0.021,
        orbitAngle: (Math.PI * 2) / 3,
        orbitSpeed: 0.032,
        orbitRadius: 48,
        cursorLag: 0.052,
        roamRadiusX: 130,
        roamRadiusY: 85,
        trail: [] as ParticleTrail[],
      },
      {
        normX: 0.72,
        normY: 0.36,
        x: vw * 0.72,
        y: vh * 0.36,
        vx: 0,
        vy: 0,
        baseAngle: Math.PI * 0.7,
        speed: 0.026,
        orbitAngle: Math.PI,
        orbitSpeed: -0.028,
        orbitRadius: 66,
        cursorLag: 0.045,
        roamRadiusX: 150,
        roamRadiusY: 100,
        trail: [] as ParticleTrail[],
      },
      {
        normX: 0.52,
        normY: 0.72,
        x: vw * 0.52,
        y: vh * 0.72,
        vx: 0,
        vy: 0,
        baseAngle: Math.PI * 1.35,
        speed: 0.018,
        orbitAngle: (Math.PI * 5) / 3,
        orbitSpeed: 0.024,
        orbitRadius: 84,
        cursorLag: 0.038,
        roamRadiusX: 160,
        roamRadiusY: 80,
        trail: [] as ParticleTrail[],
      },
    ];

    // Scroll direction detection
    let lastScrollY = window.scrollY;
    let scrollDirection: "down" | "up" = "down";

    const handleScroll = () => {
      const currentY = window.scrollY;
      const dy = currentY - lastScrollY;
      if (Math.abs(dy) > 2) {
        scrollDirection = dy > 0 ? "down" : "up";
      }
      lastScrollY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseActive = true;
    };

    const handlePointerLeave = () => {
      isMouseActive = false;
      mouseX = -1000;
      mouseY = -1000;
      stopContainmentStrainSound();
    };

    const handleWindowClick = (e: MouseEvent) => {
      const planeMorphVal = Math.max(0, Math.min(1, (section08StateTimer - 90) / 70));
      if (smileyMorph > 0.5 && planeMorphVal > 0.5) {
        const dx = e.clientX - photonLeader.x;
        const dy = e.clientY - photonLeader.y;
        if (Math.hypot(dx, dy) < 32) {
          const hireMeBtnEl = document.getElementById("section-08-hire-me-btn");
          if (hireMeBtnEl) {
            hireMeBtnEl.click();

            // Trigger spectacular brand accent target sparks!
            const sparkAccent = getDynamicAccent();
            for (let i = 0; i < 18; i++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = 1.0 + Math.random() * 2.5;
              sparks.push({
                x: photonLeader.x,
                y: photonLeader.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                life: 0,
                maxLife: 25 + Math.random() * 15,
                size: 1.2 + Math.random() * 1.5,
                color: sparkAccent.hex,
              });
            }

            // Also trigger a neat brand accent shockwave on the canvas!
            shockwaves.push({
              x: photonLeader.x,
              y: photonLeader.y,
              radius: 4,
              maxRadius: 100,
              alpha: 0.9,
              color: sparkAccent.rgba(0.95),
            });
          }
        }
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("click", handleWindowClick);

    let time = 0;

    const getDynamicAccent = () => {
      let rawColor = "#d1651c";
      if (typeof document !== "undefined") {
        const computed = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
        if (computed) {
          rawColor = computed;
        }
      }

      let r = 209, g = 101, b = 28;
      const str = rawColor.trim();

      if (str.startsWith("#")) {
        let cleanHex = str.replace("#", "");
        if (cleanHex.length === 3) cleanHex = cleanHex.split("").map((c) => c + c).join("");
        if (cleanHex.length === 6) {
          const num = parseInt(cleanHex, 16);
          r = (num >> 16) & 255;
          g = (num >> 8) & 255;
          b = num & 255;
        }
      } else if (str.startsWith("rgb")) {
        const match = str.match(/\d+/g);
        if (match && match.length >= 3) {
          r = parseInt(match[0], 10);
          g = parseInt(match[1], 10);
          b = parseInt(match[2], 10);
        }
      }

      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      return {
        hex,
        r,
        g,
        b,
        rgba: (alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`
      };
    };

    /**
     * Unified Rendering Function for Photons in the Hero Section.
     * Guarantees 100% visual uniformity across all 4 photons.
     */
    const renderIdenticalPhoton = (
      x: number,
      y: number,
      trail: ParticleTrail[],
      strain: number = 0,
      strainAngle: number = 0,
      accent = getDynamicAccent()
    ) => {
      // 1. Trail Particles
      for (let i = trail.length - 1; i > 0; i--) {
        const pt = trail[i];
        const progress = 1 - i / trail.length;
        const trailSize = PHOTON_CORE_RADIUS * 0.45 * progress + 0.35;
        const trailAlpha = 0.38 * progress;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, trailSize, 0, Math.PI * 2);
        ctx.fillStyle = accent.rgba(trailAlpha);
        ctx.fill();
      }

      // 2. Soft Corona Aura
      const coronaRadius = PHOTON_CORONA_RADIUS + strain * 10;
      const coronaGrad = ctx.createRadialGradient(x, y, 0, x, y, coronaRadius);
      coronaGrad.addColorStop(0, accent.rgba(0.28));
      coronaGrad.addColorStop(0.5, accent.rgba(0.08));
      coronaGrad.addColorStop(1, accent.rgba(0));
      ctx.beginPath();
      ctx.arc(x, y, coronaRadius, 0, Math.PI * 2);
      ctx.fillStyle = coronaGrad;
      ctx.fill();

      // 3. Radiant Body Glow
      const bodyGlowRadius = PHOTON_GLOW_RADIUS + strain * 4;
      const bodyGrad = ctx.createRadialGradient(x, y, 0, x, y, bodyGlowRadius);
      bodyGrad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
      bodyGrad.addColorStop(0.35, accent.rgba(0.92));
      bodyGrad.addColorStop(0.75, accent.rgba(0.45));
      bodyGrad.addColorStop(1, accent.rgba(0));
      ctx.beginPath();
      ctx.arc(x, y, bodyGlowRadius, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // 4. Core (deforms slightly along vector if straining)
      ctx.save();
      ctx.translate(x, y);
      if (strain > 0.08) {
        ctx.rotate(strainAngle);
        ctx.scale(1 + strain * 0.65, 1 / (1 + strain * 0.35));
      }

      ctx.beginPath();
      ctx.arc(0, 0, PHOTON_CORE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = 0.85;
      ctx.strokeStyle = accent.hex;
      ctx.stroke();

      // Specular Focal Point
      ctx.beginPath();
      ctx.arc(0, 0, PHOTON_CORE_RADIUS * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.restore();
    };

    /**
     * Sophisticated Positron Renderer (Out of Hero Chamber)
     */
    const renderSophisticatedPositron = (
      posX: number,
      posY: number,
      trail: ParticleTrail[],
      morphFactor: number,
      isSection05Charging = false,
      chargeProgress = 0,
      isSection05Blasted = false,
      visibility = 1,
      isSection06Active = false
    ) => {
      if (visibility <= 0.005) return;
      const alphaScale = Math.max(0, 1 - morphFactor) * visibility;
      if (alphaScale <= 0.005) return;

      const accent = getDynamicAccent();

      ctx.save();
      ctx.globalAlpha = alphaScale;

      // 1. Silky High-Coherence Trail (reduced in size by 25%)
      for (let i = trail.length - 1; i > 0; i--) {
        const pt = trail[i];
        const progress = 1 - i / trail.length;
        const trailSize = (PHOTON_CORE_RADIUS * 0.55 * progress + 0.4) * 0.75;
        const trailAlpha = 0.45 * Math.pow(progress, 1.2) * alphaScale;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, trailSize, 0, Math.PI * 2);
        ctx.fillStyle = accent.rgba(trailAlpha);
        ctx.fill();
      }

      // Translate to Positron target position and scale (smoothly morphs to 0.65 for calibrated Chronometer/Compass dial in Section 06, 0.75 elsewhere)
      ctx.save();
      ctx.translate(posX, posY);
      const s6Morph = Math.max(0, Math.min(1, section06ChronometerMorph));
      const effectivePositronScale = (1 - s6Morph) * 0.75 + s6Morph * 0.65;
      ctx.scale(effectivePositronScale, effectivePositronScale);

      // 2. Atmospheric Ambient Luminescence (~38px - expands if charging)
      const coronaRadius = isSection05Charging ? 38 + chargeProgress * 22 : isSection05Blasted ? 48 : (38 * (1 - s6Morph) + 30 * s6Morph);
      const coronaGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coronaRadius);
      coronaGrad.addColorStop(0, isSection05Charging && chargeProgress > 0.7 ? "rgba(255, 255, 255, 0.45)" : accent.rgba(0.36 + 0.15 * s6Morph));
      coronaGrad.addColorStop(0.35, accent.rgba(0.22 + 0.15 * s6Morph));
      coronaGrad.addColorStop(0.7, accent.rgba(0.05));
      coronaGrad.addColorStop(1, accent.rgba(0));
      ctx.beginPath();
      ctx.arc(0, 0, coronaRadius, 0, Math.PI * 2);
      ctx.fillStyle = coronaGrad;
      ctx.fill();

      // 3. Dense Radiant Quantum Core Glow (~13px)
      const coreRadius = isSection05Charging ? 13 + chargeProgress * 8 : isSection05Blasted ? 16 : 13;
      const bodyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreRadius);
      bodyGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
      bodyGrad.addColorStop(0.28, accent.rgba(0.95));
      bodyGrad.addColorStop(0.65, accent.rgba(0.78));
      bodyGrad.addColorStop(1, accent.rgba(0));
      ctx.beginPath();
      ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // 4. Precision Coordinate Reticle / Chronometer Dial Morph
      if (s6Morph > 0.001) {
        // ==========================================================
        // OPTION 2: CHRONOMETER / COMPASS NAVIGATION RETICLE (SECTION 06 - SCALED DOWN 20%)
        // ==========================================================
        ctx.save();

        // 1. Concentric Calibrated Chronometer Outer Ring
        ctx.beginPath();
        ctx.arc(0, 0, 17.5, 0, Math.PI * 2);
        ctx.strokeStyle = accent.rgba(0.85 * s6Morph);
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // 2. Secondary Rotating Azimuth Gauge Ring
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, 13.5, 0, Math.PI * 2);
        ctx.strokeStyle = accent.rgba(0.65 * s6Morph);
        ctx.lineWidth = 0.9;
        ctx.setLineDash([1.5, 3]);
        ctx.lineDashOffset = -time * 0.35;
        ctx.stroke();
        ctx.restore();

        // 3. 12 Chronometer Timepiece Ticks & 4 Cardinal Markers
        for (let i = 0; i < 12; i++) {
          const tickAngle = (i / 12) * Math.PI * 2;
          const isCardinal = i % 3 === 0;
          const innerR = isCardinal ? 12 : 14.5;
          const outerR = 17.5;
          const cosT = Math.cos(tickAngle);
          const sinT = Math.sin(tickAngle);

          ctx.beginPath();
          ctx.moveTo(cosT * innerR, sinT * innerR);
          ctx.lineTo(cosT * outerR, sinT * outerR);
          ctx.strokeStyle = isCardinal ? `rgba(255, 255, 255, ${0.95 * s6Morph})` : accent.rgba(0.75 * s6Morph);
          ctx.lineWidth = isCardinal ? 1.5 : 0.85;
          ctx.stroke();
        }

        // 4. Luminous Directional Compass Needle (pointing south down the career timeline spine)
        const needleBreath = Math.sin(time * 0.08) * 1.4;
        ctx.save();
        ctx.beginPath();
        // Needle diamond path along vertical progression axis
        ctx.moveTo(0, 16 + needleBreath); // Downward pointer tip (South / Progression)
        ctx.lineTo(3.6, 0);
        ctx.lineTo(0, -7.2); // Top tail (North)
        ctx.lineTo(-3.6, 0);
        ctx.closePath();

        const needleGrad = ctx.createLinearGradient(0, -7.2, 0, 16 + needleBreath);
        needleGrad.addColorStop(0, accent.rgba(0.45 * s6Morph));
        needleGrad.addColorStop(0.4, accent.rgba(0.85 * s6Morph));
        needleGrad.addColorStop(1, `rgba(255, 255, 255, ${0.98 * s6Morph})`);
        ctx.fillStyle = needleGrad;
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * s6Morph})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Needle tip luminous point
        ctx.beginPath();
        ctx.arc(0, 16 + needleBreath, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s6Morph})`;
        ctx.shadowColor = accent.hex;
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Horizontal cross reticle guide line
        ctx.beginPath();
        ctx.moveTo(-6.4, 0);
        ctx.lineTo(6.4, 0);
        ctx.strokeStyle = accent.rgba(0.65 * s6Morph);
        ctx.lineWidth = 0.75;
        ctx.stroke();

        ctx.restore();
        ctx.restore();
      }

      // Standard Free-Roaming Reticle (Fades out smoothly when entering Chronometer mode)
      if (s6Morph < 0.99) {
        ctx.save();
        ctx.globalAlpha = (1 - s6Morph);
        ctx.rotate(time * (0.015 + (isSection05Charging ? chargeProgress * 0.05 : 0)));
        ctx.strokeStyle = isSection05Charging && chargeProgress > 0.7 ? "rgba(255, 255, 255, 0.85)" : accent.rgba(0.55);
        ctx.lineWidth = 0.8;
        const tickDist = 18;
        const tickLen = 2.8;
        for (let a = 0; a < 4; a++) {
          const rad = (a * Math.PI) / 2;
          const cosA = Math.cos(rad);
          const sinA = Math.sin(rad);
          ctx.beginPath();
          ctx.moveTo(cosA * (tickDist - tickLen), sinA * (tickDist - tickLen));
          ctx.lineTo(cosA * tickDist, sinA * tickDist);
          ctx.stroke();
        }

        // Outer Fine Dashed Gauge Ring (radius: 18px)
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.setLineDash([2, 5]);
        ctx.lineDashOffset = -time * (0.4 + (isSection05Charging ? chargeProgress * 1.6 : 0));
        ctx.strokeStyle = accent.rgba(0.45);
        ctx.lineWidth = 0.75;
        ctx.stroke();
        ctx.restore();
      }

      // 5. Chiral Keplerian Orbit Ring 1 (45° inclination) - blends down smoothly during Chronometer Morph
      if (s6Morph < 0.99) {
        ctx.save();
        ctx.globalAlpha = (1 - s6Morph);
        ctx.rotate(time * (0.04 + (isSection05Charging ? chargeProgress * 0.09 : 0)));
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 5.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.strokeStyle = isSection05Charging && chargeProgress > 0.6 ? "rgba(255, 255, 255, 0.9)" : accent.rgba(0.75);
        ctx.lineWidth = 0.85;
        ctx.setLineDash([]);
        ctx.stroke();

        const sat1Angle = time * (0.085 + (isSection05Charging ? chargeProgress * 0.18 : 0));
        const sat1X = Math.cos(sat1Angle) * 14;
        const sat1Y = Math.sin(sat1Angle) * 5.5;
        ctx.beginPath();
        ctx.arc(sat1X, sat1Y, 1.1 + (isSection05Charging ? chargeProgress * 0.5 : 0), 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();

        // 6. Chiral Keplerian Orbit Ring 2 (-35° inclination)
        ctx.save();
        ctx.globalAlpha = (1 - s6Morph);
        ctx.rotate(-time * (0.032 + (isSection05Charging ? chargeProgress * 0.08 : 0)));
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 6.2, -Math.PI / 3, 0, Math.PI * 2);
        ctx.strokeStyle = accent.rgba(0.65);
        ctx.lineWidth = 0.8;
        ctx.stroke();

        const sat2Angle = -time * (0.075 + (isSection05Charging ? chargeProgress * 0.16 : 0));
        const sat2X = Math.cos(sat2Angle) * 15;
        const sat2Y = Math.sin(sat2Angle) * 6.2;
        ctx.beginPath();
        ctx.arc(sat2X, sat2Y, 1.0, 0, Math.PI * 2);
        ctx.fillStyle = accent.hex;
        ctx.fill();
        ctx.restore();
      }

      // 7. Crystal Positron Core
      ctx.beginPath();
      ctx.arc(0, 0, 3.4 + (isSection05Charging ? chargeProgress * 1.5 : 0), 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = isSection05Charging && chargeProgress > 0.8 ? "#ffffff" : accent.hex;
      ctx.stroke();

      // Specular Focal Center
      ctx.beginPath();
      ctx.arc(0, 0, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // 8. Refined Monospace Particle Telemetry Badge (e⁺) - suppressed in Section 06 for pure concentric dial symmetry
      if (s6Morph < 0.1) {
        ctx.font = "600 8.5px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
        ctx.fillStyle = isSection05Charging && chargeProgress > 0.8 ? "#ffffff" : accent.rgba(0.95);
        ctx.fillText("e⁺", 8.5, -8.5);
      }

      // 9. SECTION 05 COUNTDOWN & TELEMETRY HUD (Removed Section 06 "TIMELINE · INFUSED" label per requirements)
      if (isSection05Charging) {
        const secondsRemaining = Math.max(0, 3.0 - chargeProgress * 3.0).toFixed(1);

        // Dynamic charging progress arc around positron
        ctx.beginPath();
        ctx.arc(0, 0, 22 + (1 - chargeProgress) * 10, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * chargeProgress);
        ctx.strokeStyle = chargeProgress > 0.75 ? "rgba(255, 255, 255, 0.95)" : accent.rgba(0.9);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = "700 8px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
        ctx.fillStyle = chargeProgress > 0.75 ? "#ffffff" : accent.hex;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`DETONATING · ${secondsRemaining}s`, 0, 24);
      } else if (isSection05Blasted) {
        ctx.font = "700 8px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
        ctx.fillStyle = accent.hex;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("PLASMA BURST · 100%", 0, 24);
      }

      ctx.restore();
      ctx.restore();
    };

    /**
     * Sophisticated Optical Quantum Lens Renderer
     * Stationed above Section 03 heading ("03 / The Space I Operate In").
     * Strict project color theory adherence: Charcoal (#18181b), Warm Accent (#ea580c, #f97316),
     * Amber Gold (#fbbf24), Warm Highlight (#fed7aa), and Specular White (#ffffff). Zero cyan/blue.
     */
    const renderSophisticatedLens = (
      posX: number,
      posY: number,
      morphFactor: number,
      headingTop: number
    ) => {
      if (morphFactor <= 0.01) return;

      const accent = getDynamicAccent();

      ctx.save();
      ctx.globalAlpha = Math.min(1, morphFactor);

      const lensScale = 0.5 + morphFactor * 0.5; // Scale from 0.5 to 1.0
      const outerRadius = 24 * lensScale;

      // 1. DOWNWARD PROJECTED OPTICAL FOCAL BEAM / LIGHT CONE
      if (headingTop > posY + 5) {
        const beamBottomY = headingTop + 14;
        const beamTopWidth = 14 * lensScale;
        const beamBottomWidth = 160 * lensScale;

        const beamGrad = ctx.createLinearGradient(posX, posY, posX, beamBottomY);
        beamGrad.addColorStop(0, accent.rgba(0.28 * morphFactor));
        beamGrad.addColorStop(0.3, accent.rgba(0.14 * morphFactor));
        beamGrad.addColorStop(0.8, accent.rgba(0.04 * morphFactor));
        beamGrad.addColorStop(1, accent.rgba(0));

        ctx.beginPath();
        ctx.moveTo(posX - beamTopWidth, posY + 4);
        ctx.lineTo(posX + beamTopWidth, posY + 4);
        ctx.lineTo(posX + beamBottomWidth / 2, beamBottomY);
        ctx.lineTo(posX - beamBottomWidth / 2, beamBottomY);
        ctx.closePath();
        ctx.fillStyle = beamGrad;
        ctx.fill();

        // Caustic dust sparkles inside the beam
        for (let i = 0; i < 4; i++) {
          const sparkT = ((time * 0.008 + i * 0.25) % 1);
          const sparkY = posY + 10 + sparkT * (beamBottomY - posY - 10);
          const spread = (sparkY - posY) / (beamBottomY - posY) * (beamBottomWidth * 0.4);
          const sparkX = posX + Math.sin(time * 0.03 + i * 2) * spread;
          const sparkAlpha = Math.sin(sparkT * Math.PI) * 0.6 * morphFactor;

          ctx.beginPath();
          ctx.arc(sparkX, sparkY, 0.9, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0
            ? `rgba(255, 255, 255, ${sparkAlpha})`
            : accent.rgba(sparkAlpha);
          ctx.fill();
        }
      }

      // 2. AMBIENT WARM PRISMATIC OPTICAL AURA
      const auraGrad = ctx.createRadialGradient(posX, posY, 0, posX, posY, outerRadius * 2.2);
      auraGrad.addColorStop(0, accent.rgba(0.42 * morphFactor));
      auraGrad.addColorStop(0.4, accent.rgba(0.2 * morphFactor));
      auraGrad.addColorStop(0.75, accent.rgba(0.05 * morphFactor));
      auraGrad.addColorStop(1, accent.rgba(0));
      ctx.beginPath();
      ctx.arc(posX, posY, outerRadius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = auraGrad;
      ctx.fill();

      ctx.save();
      ctx.translate(posX, posY);
      ctx.scale(lensScale, lensScale);

      // 3. OUTER PRECISION CALIBRATION BEZEL
      ctx.save();
      ctx.rotate(time * 0.006);
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.strokeStyle = accent.rgba(0.45);
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 3]);
      ctx.stroke();

      // Precision micrometer tick marks
      ctx.setLineDash([]);
      for (let i = 0; i < 24; i++) {
        const rad = (i * Math.PI) / 12;
        const isMajor = i % 6 === 0;
        const isSemi = i % 3 === 0 && !isMajor;
        const innerR = isMajor ? 20.5 : isSemi ? 22 : 23.2;
        const outerR = 25.5;

        ctx.beginPath();
        ctx.moveTo(Math.cos(rad) * innerR, Math.sin(rad) * innerR);
        ctx.lineTo(Math.cos(rad) * outerR, Math.sin(rad) * outerR);
        ctx.strokeStyle = isMajor
          ? "rgba(255, 255, 255, 0.95)"
          : isSemi
          ? accent.rgba(0.85)
          : accent.rgba(0.45);
        ctx.lineWidth = isMajor ? 1.1 : 0.75;
        ctx.stroke();
      }
      ctx.restore();

      // Solid outer barrel ring
      ctx.beginPath();
      ctx.arc(0, 0, 21, 0, Math.PI * 2);
      ctx.strokeStyle = accent.hex;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 19.5, 0, Math.PI * 2);
      ctx.strokeStyle = accent.rgba(0.85);
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // 4. MULTI-BLADE APERTURE IRIS
      const numBlades = 6;
      const irisRotation = time * 0.012;
      const irisAperture = 7.5 + Math.sin(time * 0.035) * 1.0;

      for (let b = 0; b < numBlades; b++) {
        const angle = (b * Math.PI * 2) / numBlades + irisRotation;
        const pivotX = Math.cos(angle) * 18.5;
        const pivotY = Math.sin(angle) * 18.5;

        const tipAngle = angle + 0.9;
        const tipX = Math.cos(tipAngle) * irisAperture;
        const tipY = Math.sin(tipAngle) * irisAperture;

        const nextAngle = ((b + 1) * Math.PI * 2) / numBlades + irisRotation;
        const nextPivotX = Math.cos(nextAngle) * 18.5;
        const nextPivotY = Math.sin(nextAngle) * 18.5;

        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.quadraticCurveTo(
          (pivotX + tipX) * 0.5 + Math.cos(angle + Math.PI / 2) * 3,
          (pivotY + tipY) * 0.5 + Math.sin(angle + Math.PI / 2) * 3,
          tipX,
          tipY
        );
        ctx.lineTo(nextPivotX, nextPivotY);
        ctx.closePath();

        const bladeGrad = ctx.createLinearGradient(pivotX, pivotY, tipX, tipY);
        bladeGrad.addColorStop(0, "rgba(24, 24, 27, 0.95)");
        bladeGrad.addColorStop(0.5, "rgba(39, 39, 42, 0.85)");
        bladeGrad.addColorStop(1, accent.rgba(0.5));
        ctx.fillStyle = bladeGrad;
        ctx.fill();

        ctx.strokeStyle = accent.rgba(0.65);
        ctx.lineWidth = 0.65;
        ctx.stroke();

        // Golden blade pivot rivet
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 0.85, 0, Math.PI * 2);
        ctx.fillStyle = accent.hex;
        ctx.fill();
      }

      // 5. BICONVEX REFRACTIVE GLASS OPTICS
      const glassGrad = ctx.createRadialGradient(
        -2.5,
        -2.5,
        0,
        0,
        0,
        irisAperture + 3
      );
      glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
      glassGrad.addColorStop(0.35, accent.rgba(0.88));
      glassGrad.addColorStop(0.7, accent.rgba(0.58));
      glassGrad.addColorStop(0.92, accent.rgba(0.35));
      glassGrad.addColorStop(1, accent.rgba(0.15));

      ctx.beginPath();
      ctx.arc(0, 0, irisAperture + 1.5, 0, Math.PI * 2);
      ctx.fillStyle = glassGrad;
      ctx.fill();

      // Top-Left Primary Specular Convex Crescent Reflection
      ctx.beginPath();
      ctx.ellipse(-3.2, -3.2, 5.5, 2.2, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
      ctx.fill();

      // Secondary Anti-Reflective Meniscus Arc
      ctx.beginPath();
      ctx.arc(0, 0, irisAperture - 0.8, Math.PI * 0.6, Math.PI * 1.1);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 0.85;
      ctx.stroke();

      // 6. CONCENTRIC FRESNEL INTERFERENCE RINGS
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.strokeStyle = accent.rgba(0.6);
      ctx.lineWidth = 0.6;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
      ctx.strokeStyle = accent.rgba(0.45);
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // 7. PRECISION OPTICAL CROSSHAIR & CENTRAL FOCAL SINGULARITY
      ctx.beginPath();
      ctx.moveTo(-11, 0);
      ctx.lineTo(-4.5, 0);
      ctx.moveTo(4.5, 0);
      ctx.lineTo(11, 0);
      ctx.moveTo(0, -11);
      ctx.lineTo(0, -4.5);
      ctx.moveTo(0, 4.5);
      ctx.lineTo(0, 11);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 0.75;
      ctx.stroke();

      // Central Specular Singularity Dot
      ctx.beginPath();
      ctx.arc(0, 0, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // 8. ENGRAVED OPTIC TELEMETRY BADGE
      ctx.font = "600 7.5px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.fillStyle = accent.rgba(0.95);
      ctx.textAlign = "center";
      ctx.fillText("LENS · 03", 0, -29);
      ctx.textAlign = "left";

      ctx.restore();
      ctx.restore();
    };

    /**
     * Sophisticated Dartboard & Bullseye Striking Arrow Renderer
     * Stationed in front of the number three in Section 04 ("04 / Selected Work").
     * Scaled down to a refined compact size with clean background-less score typography rendered below.
     */
    const renderDartboardAndArrow = (
      posX: number,
      posY: number,
      morphFactor: number,
      arrowProg: number,
      struck: boolean,
      impactTimerVal: number
    ) => {
      if (morphFactor <= 0.01) return;

      const accent = getDynamicAccent();

      ctx.save();
      ctx.globalAlpha = Math.min(1, morphFactor);

      const boardScale = 0.5 + morphFactor * 0.5;
      const boardRadius = 22 * boardScale;

        // 1. SUBTLE AMBIENT RADIANCE AROUND DARTBOARD
        const glowGrad = ctx.createRadialGradient(posX, posY, 0, posX, posY, boardRadius * 1.4);
        glowGrad.addColorStop(0, accent.rgba(0.16 * morphFactor));
        glowGrad.addColorStop(0.6, "rgba(24, 24, 27, 0.04)");
        glowGrad.addColorStop(1, "rgba(24, 24, 27, 0)");
        ctx.beginPath();
        ctx.arc(posX, posY, boardRadius * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

      ctx.save();
      ctx.translate(posX, posY);
      ctx.scale(boardScale, boardScale);

      // 2. OUTER CHARCOAL SURROUND RING
      ctx.beginPath();
      ctx.arc(0, 0, 21.5, 0, Math.PI * 2);
      ctx.fillStyle = "#121215";
      ctx.fill();
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = "#27272a";
      ctx.stroke();

      // Outer gold wire boundary
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.strokeStyle = accent.rgba(0.85);
      ctx.lineWidth = 0.75;
      ctx.stroke();

      // 3. 20 RADIAL SECTOR WEDGES
      const numSectors = 20;
      for (let s = 0; s < numSectors; s++) {
        const startA = (s * Math.PI * 2) / numSectors - Math.PI / 2 - Math.PI / numSectors;
        const endA = startA + (Math.PI * 2) / numSectors;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 19, startA, endA);
        ctx.closePath();

        const isEven = s % 2 === 0;
        ctx.fillStyle = isEven ? "#18181b" : "#221c19";
        ctx.fill();

        // Outer Double Ring Band
        ctx.beginPath();
        ctx.arc(0, 0, 19, startA, endA);
        ctx.arc(0, 0, 16.2, endA, startA, true);
        ctx.closePath();
        ctx.fillStyle = isEven ? accent.hex : "#27272a";
        ctx.fill();

        // Inner Treble Ring Band
        ctx.beginPath();
        ctx.arc(0, 0, 12.2, startA, endA);
        ctx.arc(0, 0, 9.8, endA, startA, true);
        ctx.closePath();
        ctx.fillStyle = isEven ? accent.hex : "#27272a";
        ctx.fill();
      }

      // 4. METALLIC SPIDER WIRE NETWORK
      for (let s = 0; s < numSectors; s++) {
        const angle = (s * Math.PI * 2) / numSectors - Math.PI / 2 - Math.PI / numSectors;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 4.6, Math.sin(angle) * 4.6);
        ctx.lineTo(Math.cos(angle) * 19.2, Math.sin(angle) * 19.2);
        ctx.strokeStyle = accent.rgba(0.45);
        ctx.lineWidth = 0.55;
        ctx.stroke();
      }

      // Wire dividing rings
      [19, 16.2, 12.2, 9.8].forEach((r) => {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = accent.rgba(0.65);
        ctx.lineWidth = 0.55;
        ctx.stroke();
      });

      // 5. OUTER BULL RING
      ctx.beginPath();
      ctx.arc(0, 0, 4.6, 0, Math.PI * 2);
      ctx.fillStyle = accent.hex;
      ctx.fill();
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.stroke();

      // 6. INNER BULLSEYE CENTRE
      ctx.beginPath();
      ctx.arc(0, 0, 2.1, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = accent.hex;
      ctx.stroke();

      // Laser Reticle Ticks on the Bullseye
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(-3, 0);
      ctx.moveTo(3, 0);
      ctx.lineTo(6, 0);
      ctx.moveTo(0, -6);
      ctx.lineTo(0, -3);
      ctx.moveTo(0, 3);
      ctx.lineTo(0, 6);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // 7. SCORE DISPLAY WRITTEN BELOW (REMOVED AS REQUESTED TO ELIMINATE PILL BULL'S EYE - 50)
      ctx.save();
      ctx.restore();

      // ==============================================================
      // 8. THE ARROW / DART STRIKING THE BULLSEYE (Compact Sleek Scale)
      // ==============================================================
      if (arrowProg > 0.01) {
        ctx.save();

        // Flight trajectory: flies in from top-right (+130px, -100px)
        const startOffsetX = 130;
        const startOffsetY = -95;
        const targetAngle = -Math.atan2(-startOffsetY, startOffsetX);

        // Physical spring oscillation upon striking the bullseye
        let quiverAngle = 0;
        if (struck) {
          quiverAngle =
            Math.sin(impactTimerVal * 0.5) *
            Math.exp(-impactTimerVal * 0.08) *
            0.18;
        }

        // Current tip position in dartboard coordinates (at 1.0, tip is dead center at 0,0)
        const currentTipX = startOffsetX * (1 - arrowProg);
        const currentTipY = startOffsetY * (1 - arrowProg);

        ctx.translate(currentTipX, currentTipY);
        ctx.rotate(targetAngle + quiverAngle);

        const arrowLength = 25; // Decreased sleek arrow length

        // Speed Blur Stream during flight
        if (arrowProg < 0.98) {
          const streakLen = 32 * arrowProg;
          const streakGrad = ctx.createLinearGradient(0, 0, streakLen, 0);
          streakGrad.addColorStop(0, accent.rgba(0.85));
          streakGrad.addColorStop(0.5, accent.rgba(0.45));
          streakGrad.addColorStop(1, accent.rgba(0));

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(streakLen, 0);
          ctx.lineWidth = 1.6;
          ctx.strokeStyle = streakGrad;
          ctx.stroke();
        }

        // Arrow Needle-Sharp Tungsten Point (Tip at 0, 0)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(5, -0.9);
        ctx.lineTo(5, 0.9);
        ctx.closePath();
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.lineWidth = 0.45;
        ctx.strokeStyle = accent.hex;
        ctx.stroke();

        // Sleek Carbon Shaft
        ctx.beginPath();
        ctx.rect(5, -0.75, arrowLength - 5, 1.5);
        ctx.fillStyle = "#18181b";
        ctx.fill();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "#27272a";
        ctx.stroke();

        // Gold & Accent Grip Rings on Shaft
        [9, 11, 13, 17, 19].forEach((rx) => {
          ctx.beginPath();
          ctx.moveTo(rx, -0.9);
          ctx.lineTo(rx, 0.9);
          ctx.strokeStyle = rx % 2 === 0 ? "#ffffff" : accent.hex;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        });

        // Aerodynamic Fletching Flights at the rear (3 Fin Wings)
        const flightStartX = arrowLength - 6.5;
        const flightEndX = arrowLength + 1.5;

        // Top Flight Wing
        ctx.beginPath();
        ctx.moveTo(flightStartX, -0.75);
        ctx.lineTo(flightStartX + 2, -4.6);
        ctx.lineTo(flightEndX, -3.8);
        ctx.lineTo(flightEndX - 1.5, -0.75);
        ctx.closePath();
        const fletchGrad1 = ctx.createLinearGradient(flightStartX, -4.6, flightEndX, -0.75);
        fletchGrad1.addColorStop(0, accent.rgba(0.95));
        fletchGrad1.addColorStop(0.6, accent.rgba(0.9));
        fletchGrad1.addColorStop(1, "rgba(255, 255, 255, 0.8)");
        ctx.fillStyle = fletchGrad1;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 0.45;
        ctx.stroke();

        // Bottom Flight Wing
        ctx.beginPath();
        ctx.moveTo(flightStartX, 0.75);
        ctx.lineTo(flightStartX + 2, 4.6);
        ctx.lineTo(flightEndX, 3.8);
        ctx.lineTo(flightEndX - 1.5, 0.75);
        ctx.closePath();
        ctx.fillStyle = fletchGrad1;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 0.45;
        ctx.stroke();

        // Rear Nock / Specular Cap
        ctx.beginPath();
        ctx.arc(flightEndX, 0, 1.0, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();
      }

      ctx.restore();
      ctx.restore();
    };

    /**
     * Sophisticated Radiant Quantum Smiley Face Renderer
     * Stationed directly after "Have a product problem worth solving?" in Section 08.
     * Complies strictly with warm monochromatic palette (#ea580c, #f97316, #fbbf24, #18181b, #ffffff).
     */
    /**
     * Sophisticated Glowing Message Envelope Renderer
     * Stationed directly after "Have a product problem worth solving?" in Section 08.
     * Replaces the smiley face with a soft, glowing, interactive "message envelope" icon
     * pulsing with a heartbeat-like animation.
     */
    const renderSophisticatedSmiley = (x: number, y: number, morphFactor: number, animTime: number) => {
      if (morphFactor <= 0.01) return;

      const accent = getDynamicAccent();

      ctx.save();
      ctx.globalAlpha = morphFactor;
      ctx.translate(x, y);

      // 1. Calculate entrance, pulse, and transformation progress
      const entryProgress = Math.min(1, section08StateTimer / 45); // Elastic pop-up staggered entrance
      const popScale = Math.sin(entryProgress * Math.PI * 0.5) * 1.15 - 0.15 * (1 - entryProgress) * Math.sin(entryProgress * Math.PI * 1.5);

      // Heartbeat-like pulse wave synced to animTime
      const heartSec = (animTime * 0.05) % Math.PI;
      const heartbeat = 1.0 + 0.14 * Math.pow(Math.sin(heartSec), 8) + 0.05 * Math.pow(Math.sin(heartSec - 0.35), 8);

      // Morph factor to transition between envelope and paper airplane (starts at frame 50, completes by 100)
      const planeMorph = Math.max(0, Math.min(1, (section08StateTimer - 50) / 50));

      // Draw concentric liquid/photon ripples expanding outward during entry
      if (section08StateTimer < 45 && morphFactor < 0.99) {
        for (let r = 0; r < 3; r++) {
          const rippleT = (entryProgress + r * 0.33) % 1.0;
          const rippleRadius = 14 + (1 - rippleT) * 45;
          const rippleAlpha = (1 - rippleT) * 0.4 * entryProgress;
          ctx.beginPath();
          ctx.arc(0, 0, rippleRadius, 0, Math.PI * 2);
          ctx.strokeStyle = accent.rgba(rippleAlpha);
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }

      // 2. Halo Glow (diminishes slightly during airplane state as jet trail/exhaust)
      const haloRadius = 24 + Math.sin(animTime * 0.05) * 2.0;
      const haloGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, haloRadius);
      haloGrad.addColorStop(0, accent.rgba(0.45 * (1 - planeMorph * 0.35)));
      haloGrad.addColorStop(0.5, accent.rgba(0.18 * (1 - planeMorph * 0.35)));
      haloGrad.addColorStop(1, accent.rgba(0));
      ctx.beginPath();
      ctx.arc(0, 0, haloRadius, 0, Math.PI * 2);
      ctx.fillStyle = haloGrad;
      ctx.fill();

      // Ambient Rotating Gold Dust particles
      ctx.save();
      ctx.rotate(animTime * 0.015);
      for (let p = 0; p < 4; p++) {
        const pAngle = (p * Math.PI) / 2 + Math.sin(animTime * 0.02) * 0.1;
        const px = Math.cos(pAngle) * 16;
        const py = Math.sin(pAngle) * 16;
        ctx.beginPath();
        ctx.arc(px, py, 0.75, 0, Math.PI * 2);
        ctx.fillStyle = accent.rgba((0.4 + 0.3 * Math.sin(animTime * 0.05 + p)) * (1 - planeMorph));
        ctx.fill();
      }
      ctx.restore();

      // 3. Render Envelope
      if (planeMorph < 0.99) {
        ctx.save();
        ctx.globalAlpha = (1 - planeMorph) * morphFactor;
        
        // Pulse envelope with heartbeat scale
        const envScale = popScale * heartbeat;
        ctx.scale(envScale, envScale);

        const w = 21;
        const h = 14;
        const r = 2.0;

        ctx.shadowColor = accent.rgba(0.35);
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.moveTo(-w/2 + r, -h/2);
        ctx.lineTo(w/2 - r, -h/2);
        ctx.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
        ctx.lineTo(w/2, h/2 - r);
        ctx.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
        ctx.lineTo(-w/2 + r, h/2);
        ctx.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
        ctx.lineTo(-w/2, -h/2 + r);
        ctx.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);
        ctx.closePath();

        const bodyGrad = ctx.createLinearGradient(-w/2, -h/2, w/2, h/2);
        bodyGrad.addColorStop(0, "#fffbeb");
        bodyGrad.addColorStop(0.3, "#fed7aa");
        bodyGrad.addColorStop(1, "#ffedd5");
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = accent.hex;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-w/2 + 0.5, h/2 - 0.5);
        ctx.lineTo(-w/4, -1);
        ctx.strokeStyle = accent.rgba(0.35);
        ctx.lineWidth = 0.9;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(w/2 - 0.5, h/2 - 0.5);
        ctx.lineTo(w/4, -1);
        ctx.strokeStyle = accent.rgba(0.35);
        ctx.lineWidth = 0.9;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-w/2 + 0.2, -h/2 + 0.2);
        ctx.lineTo(0, 1.2);
        ctx.lineTo(w/2 - 0.2, -h/2 + 0.2);
        ctx.strokeStyle = accent.hex;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-w/2 + 0.5, -h/2 + 0.5);
        ctx.lineTo(0, 1.0);
        ctx.lineTo(w/2 - 0.5, -h/2 + 0.5);
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 1.0, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = accent.hex;
        ctx.shadowColor = accent.hex;
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(-0.6, 0.4, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();
      }

      // 4. Render Paper Airplane
      if (planeMorph > 0.01) {
        ctx.save();
        ctx.globalAlpha = planeMorph * morphFactor;

        let planeScale = 1.05;
        let planeAngle = -Math.PI / 12 + Math.sin(animTime * 0.04) * 0.04;

        if (section08StateTimer < 80) {
          planeScale = Math.min(1.05, planeMorph * 1.05);
        } else if (section08StateTimer < 170) {
          planeScale = 1.08;
          // Calculate heading angle analytically along Bezier path
          const t = (section08StateTimer - 80) / 90;
          const u = 1 - t;
          const cp1x = section08TargetX + 140;
          const cp1y = section08TargetY - 30;
          const cp2x = hireMeTargetX - 120;
          const cp2y = hireMeTargetY - 100;

          const tx = 3 * u * u * (cp1x - section08TargetX) + 6 * u * t * (cp2x - cp1x) + 3 * t * t * (hireMeTargetX - cp2x);
          const ty = 3 * u * u * (cp1y - section08TargetY) + 6 * u * t * (cp2y - cp1y) + 3 * t * t * (hireMeTargetY - cp2y);
          planeAngle = Math.atan2(ty, tx);
        } else {
          const landingProgress = section08StateTimer - 170;
          const bounceFactor = Math.max(0, 1 - landingProgress / 40);
          planeScale = 1.05 + Math.sin((animTime - 170) * 0.06) * 0.03 * (1 + bounceFactor * 0.15);
          planeAngle = -Math.PI / 12 + Math.sin((animTime - 170) * 0.04) * 0.04;
        }

        // Apply interactive hover feedback: scale boost and gentle hover wobble
        planeScale *= (1.0 + 0.08 * section08HoverActive);
        planeAngle += Math.sin(animTime * 0.28) * 0.1 * section08HoverActive;

        ctx.scale(planeScale, planeScale);
        ctx.rotate(planeAngle);

        // Soft shadow
        ctx.shadowColor = accent.rgba(0.3);
        ctx.shadowBlur = 6;

        // Origami Fold Facets:
        // Left main wing (Bright cream-white)
        ctx.beginPath();
        ctx.moveTo(11, 0);
        ctx.lineTo(-11, -5.5);
        ctx.lineTo(-4, 0);
        ctx.closePath();
        ctx.fillStyle = "#fffbeb";
        ctx.fill();

        // Right main wing (Sunlight gold/cream)
        ctx.beginPath();
        ctx.moveTo(11, 0);
        ctx.lineTo(-11, 5.5);
        ctx.lineTo(-4, 0);
        ctx.closePath();
        ctx.fillStyle = "#ffedd5";
        ctx.fill();

        ctx.shadowBlur = 0; // Disable shadows for sharp folds

        // Left underbelly fold
        ctx.beginPath();
        ctx.moveTo(11, 0);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-8, -2.2);
        ctx.closePath();
        ctx.fillStyle = accent.rgba(0.7);
        ctx.fill();

        // Right underbelly fold
        ctx.beginPath();
        ctx.moveTo(11, 0);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-8, 2.2);
        ctx.closePath();
        ctx.fillStyle = accent.rgba(0.85);
        ctx.fill();

        // Premium crisp boundaries
        ctx.beginPath();
        ctx.moveTo(11, 0);
        ctx.lineTo(-11, -5.5);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-11, 5.5);
        ctx.closePath();
        ctx.strokeStyle = accent.hex;
        ctx.lineWidth = 0.95;
        ctx.stroke();

        // Center fold line
        ctx.beginPath();
        ctx.moveTo(11, 0);
        ctx.lineTo(-4, 0);
        ctx.strokeStyle = accent.hex;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore(); // Restore context for child transformations

      // 5. HUD Telemetry label stays anchored cleanly beneath the airplane dock
      ctx.save();
      
      const textX = x;
      const textY = y + 16;

      ctx.translate(textX, textY);
      ctx.font = "700 7px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const fullText = "LET'S TALK";
      const charWidth = ctx.measureText("M").width;
      const N = fullText.length;
      const totalWidth = N * charWidth;
      const startX = -totalWidth / 2 + charWidth / 2;

      ctx.fillStyle = accent.rgba(0.7 * morphFactor);
      for (let i = 0; i < N; i++) {
        const char = fullText[i];
        ctx.fillText(char, startX + i * charWidth, 0);
      }
      ctx.restore();
    };

    /**
     * Sophisticated Bioluminescent Firefly Renderer
     * Active when Section 07 is in view.
     * Smoothly morphs from Positron with fluttering wings and golden organic pulses.
     */
    const renderSophisticatedFirefly = (
      x: number,
      y: number,
      morphFactor: number,
      animTime: number
    ) => {
      if (morphFactor <= 0.01) return;

      const accent = getDynamicAccent();

      ctx.save();
      ctx.globalAlpha = morphFactor;
      ctx.translate(x, y);

      // Organic hovering micro-fluctuations (hover drift)
      const driftX = Math.sin(animTime * 0.04) * 3.5;
      const driftY = Math.cos(animTime * 0.05) * 3.0;
      ctx.translate(driftX, driftY);

      // 1. Ambient Bioluminescent Glow Halo
      const glowPulse = 0.75 + 0.25 * Math.sin(animTime * 0.12);
      const haloRadius = 35 * glowPulse;
      const haloGrad = ctx.createRadialGradient(0, 4, 2, 0, 4, haloRadius);
      haloGrad.addColorStop(0, accent.rgba(0.5));
      haloGrad.addColorStop(0.4, accent.rgba(0.18));
      haloGrad.addColorStop(1, accent.rgba(0));
      ctx.beginPath();
      ctx.arc(0, 4, haloRadius, 0, Math.PI * 2);
      ctx.fillStyle = haloGrad;
      ctx.fill();

      // 2. High Frequency Fluttering Wings (Forewings and Hindwings)
      const wingSway = Math.sin(animTime * 0.65) * 0.4;
      const wingGlint = "rgba(255, 255, 255, 0.85)";
      const wingStroke = accent.rgba(0.8);

      // Left Forewing
      ctx.save();
      ctx.translate(-3.2, -2);
      ctx.rotate(-0.55 + wingSway);
      ctx.beginPath();
      ctx.ellipse(0, -6, 2.6, 8.5, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = wingGlint;
      ctx.strokeStyle = wingStroke;
      ctx.lineWidth = 0.7;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Left Hindwing
      ctx.save();
      ctx.translate(-2.5, 0);
      ctx.rotate(-0.15 + wingSway * 0.7);
      ctx.beginPath();
      ctx.ellipse(0, -3, 1.8, 5.0, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
      ctx.strokeStyle = accent.rgba(0.6);
      ctx.lineWidth = 0.5;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Right Forewing
      ctx.save();
      ctx.translate(3.2, -2);
      ctx.rotate(0.55 - wingSway);
      ctx.beginPath();
      ctx.ellipse(0, -6, 2.6, 8.5, -0.1, 0, Math.PI * 2);
      ctx.fillStyle = wingGlint;
      ctx.strokeStyle = wingStroke;
      ctx.lineWidth = 0.7;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Right Hindwing
      ctx.save();
      ctx.translate(2.5, 0);
      ctx.rotate(0.15 - wingSway * 0.7);
      ctx.beginPath();
      ctx.ellipse(0, -3, 1.8, 5.0, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
      ctx.strokeStyle = accent.rgba(0.6);
      ctx.lineWidth = 0.5;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 3. Firefly Abdomen Bioluminescent Organ
      const abdRadius = 6.0;
      const abdGlow = ctx.createRadialGradient(0, 3.5, 1, 0, 3.5, abdRadius * 2.2);
      abdGlow.addColorStop(0, accent.rgba(0.92 * glowPulse));
      abdGlow.addColorStop(0.5, accent.rgba(0.45 * glowPulse));
      abdGlow.addColorStop(1, accent.rgba(0));
      ctx.beginPath();
      ctx.arc(0, 3.5, abdRadius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = abdGlow;
      ctx.fill();

      // Inner Core of bioluminescent organ
      ctx.beginPath();
      ctx.arc(0, 3.5, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = accent.hex;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 4. Sleek Bioluminescent Antennae
      const antSway = Math.sin(animTime * 0.08) * 0.12;
      // Left Antenna
      ctx.beginPath();
      ctx.moveTo(-0.8, -7.5);
      ctx.quadraticCurveTo(-3.5, -11, -4.5 + antSway * 8, -13.5);
      ctx.strokeStyle = accent.rgba(0.85);
      ctx.lineWidth = 0.55;
      ctx.stroke();
      // Glowing tip
      ctx.beginPath();
      ctx.arc(-4.5 + antSway * 8, -13.5, 0.75, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Right Antenna
      ctx.beginPath();
      ctx.moveTo(0.8, -7.5);
      ctx.quadraticCurveTo(3.5, -11, 4.5 - antSway * 8, -13.5);
      ctx.strokeStyle = accent.rgba(0.85);
      ctx.lineWidth = 0.55;
      ctx.stroke();
      // Glowing tip
      ctx.beginPath();
      ctx.arc(4.5 - antSway * 8, -13.5, 0.75, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // 5. Firefly Sleek Minimalist Thorax & Head
      ctx.beginPath();
      ctx.ellipse(0, -2, 3.0, 4.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#18181b";
      ctx.strokeStyle = accent.rgba(0.4);
      ctx.lineWidth = 0.8;
      ctx.fill();
      ctx.stroke();

      // Head
      ctx.beginPath();
      ctx.arc(0, -6.5, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "#27272a";
      ctx.fill();

      // Tiny glowing micro-eyes
      ctx.beginPath();
      ctx.arc(-0.8, -7.2, 0.45, 0, Math.PI * 2);
      ctx.fillStyle = accent.hex;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0.8, -7.2, 0.45, 0, Math.PI * 2);
      ctx.fillStyle = accent.hex;
      ctx.fill();

      ctx.restore();
    };

    /**
     * Classic Walk & Jump Stickman Character Renderer
     * Reference: https://www.deviantart.com/garrrychan/art/Stick-Man-Jump-919763233
     * Features Walk -> Crouch Windup -> Parabolic Airborne Jump -> Landing Crouch -> Walk/Stand sequence.
     * Clean pure stick figure line art with NO positron or joint dots on legs or body.
     */
    const renderStickFigureCharacter = (
      posX: number,
      posY: number,
      morphFactor: number,
      jumpProgress: number, // 0 to 1 during jump
      currentCardIndex: number,
      animTime: number,
      facingDir: number // 1 for right, -1 for left
    ) => {
      if (morphFactor <= 0.005) return;

      ctx.save();
      ctx.globalAlpha = morphFactor;
      ctx.translate(posX, posY);

      const dir = facingDir >= 0 ? 1 : -1;
      const isMoving = jumpProgress > 0.001 && jumpProgress < 0.999;
      const isFrontFacing = !isMoving;

      // Animation Phase Progression (Reference: Stick Man Jump)
      let crouchAmount = 0; // 0 = upright, 1 = deep crouch
      let inAirFactor = 0; // 0 = on ground, 1 = apex of jump
      let isWalking = false;

      if (isMoving) {
        if (jumpProgress < 0.18) {
          isWalking = true;
        } else if (jumpProgress >= 0.18 && jumpProgress < 0.30) {
          const crouchP = (jumpProgress - 0.18) / 0.12;
          crouchAmount = Math.sin(crouchP * Math.PI);
        } else if (jumpProgress >= 0.30 && jumpProgress < 0.80) {
          const airP = (jumpProgress - 0.30) / 0.50;
          inAirFactor = Math.sin(airP * Math.PI);
        } else if (jumpProgress >= 0.80 && jumpProgress < 0.92) {
          const landP = (jumpProgress - 0.80) / 0.12;
          crouchAmount = Math.sin(landP * Math.PI) * 0.8;
        } else {
          isWalking = true;
        }
      }

      // Torso & Pelvis Heights
      const walkPhase = animTime * 0.22;
      const walkBobY = isWalking ? Math.abs(Math.sin(walkPhase * 2)) * 1.8 : Math.sin(animTime * 0.06) * 0.5;

      const feetY = 0;
      const pelvisY = -18 - inAirFactor * 3 + crouchAmount * 7 - walkBobY * 0.4;

      // Idle Activity Routine (12-second cycle)
      const routineCycle = (animTime * 0.02) % 12; // 0 to 12s
      let headTilt = 0;

      if (isFrontFacing) {
        if (routineCycle < 4.5) {
          // Phase 1: Juggling Photon Orbs - head follows the orbs back and forth
          headTilt = Math.sin(animTime * 0.12) * 0.16;
        } else if (routineCycle < 8.0) {
          // Phase 2: Coin flip - head looks up at apex of toss
          const coinP = (animTime * 0.1) % Math.PI;
          headTilt = -Math.sin(coinP) * 0.18;
        } else if (routineCycle < 10.0) {
          // Phase 3A: Horizon survey - panning left to right
          headTilt = Math.sin(animTime * 0.07) * 0.22;
        } else {
          // Phase 3B: Cheerful wave - nodding
          headTilt = Math.sin(animTime * 0.14) * 0.1;
        }
      }

      const torsoTilt = isFrontFacing ? 0 : (inAirFactor > 0 ? 0.15 * dir : crouchAmount > 0 ? 0.25 * dir : 0.12 * dir);
      const neckX = Math.sin(torsoTilt) * (14 - crouchAmount * 3);
      const neckY = pelvisY - Math.cos(torsoTilt) * (14 - crouchAmount * 3);

      const headRadius = 5.8;
      const headCenterX = neckX + Math.sin(torsoTilt + headTilt) * (headRadius + 1);
      const headCenterY = neckY - Math.cos(torsoTilt + headTilt) * (headRadius + 1);

      const accent = getDynamicAccent();

      // Dynamic Line Art with Subtle Ambient Shadow
      ctx.strokeStyle = accent.hex;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = accent.rgba(0.45);
      ctx.shadowBlur = 6;

      // --- SPINE / TORSO ---
      ctx.beginPath();
      ctx.moveTo(neckX, neckY);
      ctx.lineTo(0, pelvisY);
      ctx.stroke();

      // --- HEAD ---
      ctx.beginPath();
      ctx.arc(headCenterX, headCenterY, headRadius, 0, Math.PI * 2);
      ctx.fillStyle = accent.hex;
      ctx.fill();
      ctx.strokeStyle = accent.hex;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // --- LIMB KINEMATICS & POSING ---
      if (isFrontFacing) {
        // ==============================================================
        // FRONT-FACING ENGAGING MULTI-PHASE IDLE ACTIVITIES
        // ==============================================================

        // Dynamic Right Foot / Leg (Taps in Phase 2, stable stance in Phase 1 & 3)
        let rightFootY = feetY;
        let rightKneeX = 2.2;
        if (routineCycle >= 4.5 && routineCycle < 8.0) {
          // Rhythmic foot tap
          const tapSin = Math.sin(animTime * 0.18);
          if (tapSin > 0) {
            rightFootY = feetY - tapSin * 3.2;
            rightKneeX = 2.2 + tapSin * 0.8;
          }
        }

        // Legs in grounded stance
        ctx.beginPath();
        ctx.moveTo(0, pelvisY);
        ctx.lineTo(-2.2, pelvisY + 8);
        ctx.lineTo(-4.5, feetY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, pelvisY);
        ctx.lineTo(rightKneeX, pelvisY + 8);
        ctx.lineTo(4.5, rightFootY);
        ctx.stroke();

        if (routineCycle < 4.5) {
          // ------------------------------------------------------------
          // PHASE 1: JUGGLING TWO GLOWING PHOTON ORBS
          // ------------------------------------------------------------
          const juggleTime = animTime * 0.11;

          // Juggling arms in motion
          const armWaveL = Math.sin(juggleTime);
          const armWaveR = Math.sin(juggleTime + Math.PI);

          const elbowLX = -7.2;
          const elbowLY = neckY + 5.5 + armWaveL * 1.5;
          const handLX = -5.5 + armWaveL * 1.2;
          const handLY = neckY + 3.0 - armWaveL * 2.2;

          const elbowRX = 7.2;
          const elbowRY = neckY + 5.5 + armWaveR * 1.5;
          const handRX = 5.5 - armWaveR * 1.2;
          const handLY_R = neckY + 3.0 - armWaveR * 2.2;

          // Left Arm
          ctx.beginPath();
          ctx.moveTo(neckX, neckY);
          ctx.lineTo(elbowLX, elbowLY);
          ctx.lineTo(handLX, handLY);
          ctx.stroke();

          // Right Arm
          ctx.beginPath();
          ctx.moveTo(neckX, neckY);
          ctx.lineTo(elbowRX, elbowRY);
          ctx.lineTo(handRX, handLY_R);
          ctx.stroke();

          // ORB 1: Parabolic arc from left to right hand
          const p1 = (juggleTime % Math.PI) / Math.PI;
          const orb1X = -5.5 + p1 * 11.0;
          const orb1Y = neckY + 1.0 - Math.sin(p1 * Math.PI) * 16.0;

          // ORB 2: Parabolic arc from right to left hand (offset by half cycle)
          const p2 = ((juggleTime + Math.PI * 0.5) % Math.PI) / Math.PI;
          const orb2X = 5.5 - p2 * 11.0;
          const orb2Y = neckY + 1.0 - Math.sin(p2 * Math.PI) * 16.0;

          // Render Glowing Juggled Photon Orbs
          [ { x: orb1X, y: orb1Y }, { x: orb2X, y: orb2Y } ].forEach((orb) => {
            ctx.save();
            ctx.shadowColor = "#d1651c";
            ctx.shadowBlur = 10;
            const oGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, 4.5);
            oGrad.addColorStop(0, "#ffffff");
            oGrad.addColorStop(0.4, "#fed7aa");
            oGrad.addColorStop(1, "rgba(209, 101, 28, 0)");
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = oGrad;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(orb.x, orb.y, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.restore();
          });
        } else if (routineCycle < 8.0) {
          // ------------------------------------------------------------
          // PHASE 2: CONFIDENT COIN FLIP & FOOT TAP
          // ------------------------------------------------------------
          // Left Arm: resting stylishly on hip
          const elbowLX = -7.0;
          const elbowLY = neckY + 6.0;
          const handLX = -3.5;
          const handLY = pelvisY + 1.5;

          ctx.beginPath();
          ctx.moveTo(neckX, neckY);
          ctx.lineTo(elbowLX, elbowLY);
          ctx.lineTo(handLX, handLY);
          ctx.stroke();

          // Right Arm: flicking coin up and catching
          const tossPhase = (animTime * 0.09) % (Math.PI * 2);
          const isTossInAir = tossPhase < Math.PI;

          const elbowRX = 6.8;
          const elbowRY = neckY + 5.5;
          const handRX = 4.2;
          const handRY = neckY + 3.0 + (isTossInAir ? 0 : Math.sin(tossPhase) * 1.5);

          ctx.beginPath();
          ctx.moveTo(neckX, neckY);
          ctx.lineTo(elbowRX, elbowRY);
          ctx.lineTo(handRX, handRY);
          ctx.stroke();

          // Spinning Energy Coin in Flight
          let coinX = handRX;
          let coinY = handRY - 2;
          if (isTossInAir) {
            const coinHeight = Math.sin(tossPhase) * 18.0;
            coinY = handRY - 3.0 - coinHeight;
          }

          ctx.save();
          ctx.translate(coinX, coinY);
          ctx.rotate(animTime * 0.25);
          ctx.shadowColor = "#d1651c";
          ctx.shadowBlur = 8;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(-1.6, -1.6, 3.2, 3.2);
          ctx.strokeStyle = "#d1651c";
          ctx.lineWidth = 1.0;
          ctx.strokeRect(-1.6, -1.6, 3.2, 3.2);
          ctx.restore();
        } else if (routineCycle < 10.0) {
          // ------------------------------------------------------------
          // PHASE 3A: EXPLORER SURVEYING THE HORIZON
          // ------------------------------------------------------------
          // Left Arm: on hip
          const elbowLX = -7.0;
          const elbowLY = neckY + 6.0;
          const handLX = -3.5;
          const handLY = pelvisY + 1.5;

          ctx.beginPath();
          ctx.moveTo(neckX, neckY);
          ctx.lineTo(elbowLX, elbowLY);
          ctx.lineTo(handLX, handLY);
          ctx.stroke();

          // Right Arm: Hand raised to brow shading eyes
          const elbowRX = 7.5;
          const elbowRY = neckY + 1.0;
          const handRX = headCenterX + 2.2;
          const handRY = headCenterY - 1.0;

          ctx.beginPath();
          ctx.moveTo(neckX, neckY);
          ctx.lineTo(elbowRX, elbowRY);
          ctx.lineTo(handRX, handRY);
          ctx.stroke();
        } else {
          // ------------------------------------------------------------
          // PHASE 3B: CHEERFUL ENERGETIC WAVE TO USER
          // ------------------------------------------------------------
          // Left Arm: comfortably at side
          const elbowLX = -6.5;
          const elbowLY = neckY + 6.5;
          const handLX = -5.0;
          const handLY = pelvisY;

          ctx.beginPath();
          ctx.moveTo(neckX, neckY);
          ctx.lineTo(elbowLX, elbowLY);
          ctx.lineTo(handLX, handLY);
          ctx.stroke();

          // Right Arm: Raised high above shoulder, waving back and forth
          const waveAngle = Math.sin(animTime * 0.22) * 0.65;
          const elbowRX = 7.5;
          const elbowRY = neckY - 3.0;
          const handRX = elbowRX + Math.sin(0.35 + waveAngle) * 9.0;
          const handRY = elbowRY - Math.cos(0.35 + waveAngle) * 9.0;

          ctx.beginPath();
          ctx.moveTo(neckX, neckY);
          ctx.lineTo(elbowRX, elbowRY);
          ctx.lineTo(handRX, handRY);
          ctx.stroke();
        }
      } else {
        // SIDE PROFILE MOVING / JUMPING POSTURE
        const thighLen = 9.0;
        const calfLen = 9.0;
        const upperArmLen = 8.0;
        const lowerArmLen = 8.0;

        let hipAngleL = 0;
        let kneeAngleL = 0;
        let hipAngleR = 0;
        let kneeAngleR = 0;

        let shoulderAngleL = 0;
        let elbowAngleL = 0;
        let shoulderAngleR = 0;
        let elbowAngleR = 0;

        if (inAirFactor > 0) {
          // Airborne jump pose: knees tucked/extended, arms reaching forward/upward for landing
          hipAngleL = (-0.7 - inAirFactor * 0.4) * dir;
          kneeAngleL = 1.1 + inAirFactor * 0.4;

          hipAngleR = (0.6 + inAirFactor * 0.3) * dir;
          kneeAngleR = 0.8 - inAirFactor * 0.3;

          shoulderAngleL = (1.1 + inAirFactor * 0.4) * dir;
          elbowAngleL = 0.5;

          shoulderAngleR = (-1.0 - inAirFactor * 0.3) * dir;
          elbowAngleR = 0.5;
        } else if (crouchAmount > 0) {
          // Crouch posture before launch / after landing
          hipAngleL = -0.6 * dir;
          kneeAngleL = 1.3 * crouchAmount;

          hipAngleR = 0.6 * dir;
          kneeAngleR = 1.3 * crouchAmount;

          shoulderAngleL = -0.8 * dir;
          elbowAngleL = 0.8;

          shoulderAngleR = 0.8 * dir;
          elbowAngleR = 0.8;
        } else if (isWalking) {
          // Walking gait along card edge
          hipAngleL = Math.sin(walkPhase) * 0.6 * dir;
          kneeAngleL = Math.max(0, Math.sin(walkPhase - 0.5) * 0.8);

          hipAngleR = Math.sin(walkPhase + Math.PI) * 0.6 * dir;
          kneeAngleR = Math.max(0, Math.sin(walkPhase + Math.PI - 0.5) * 0.8);

          shoulderAngleL = -Math.sin(walkPhase) * 0.6 * dir;
          elbowAngleL = 0.3;

          shoulderAngleR = -Math.sin(walkPhase + Math.PI) * 0.6 * dir;
          elbowAngleR = 0.3;
        }

        // DRAW LEFT LEG
        const kneeLX = Math.sin(hipAngleL) * thighLen;
        const kneeLY = pelvisY + Math.cos(hipAngleL) * thighLen;
        const footLX = kneeLX + Math.sin(hipAngleL + kneeAngleL * dir) * calfLen;
        const footLY = (inAirFactor > 0 || crouchAmount > 0)
          ? kneeLY + Math.cos(hipAngleL + kneeAngleL * dir) * calfLen
          : feetY;

        ctx.beginPath();
        ctx.moveTo(0, pelvisY);
        ctx.lineTo(kneeLX, kneeLY);
        ctx.lineTo(footLX, footLY);
        ctx.stroke();

        // DRAW RIGHT LEG
        const kneeRX = Math.sin(hipAngleR) * thighLen;
        const kneeRY = pelvisY + Math.cos(hipAngleR) * thighLen;
        const footRX = kneeRX + Math.sin(hipAngleR + kneeAngleR * dir) * calfLen;
        const footRY = (inAirFactor > 0 || crouchAmount > 0)
          ? kneeRY + Math.cos(hipAngleR + kneeAngleR * dir) * calfLen
          : feetY;

        ctx.beginPath();
        ctx.moveTo(0, pelvisY);
        ctx.lineTo(kneeRX, kneeRY);
        ctx.lineTo(footRX, footRY);
        ctx.stroke();

        // DRAW LEFT ARM
        const elbowLX = neckX + Math.sin(shoulderAngleL) * upperArmLen;
        const elbowLY = neckY + Math.cos(shoulderAngleL) * upperArmLen;
        const handLX = elbowLX + Math.sin(shoulderAngleL + elbowAngleL * dir) * lowerArmLen;
        const handLY = elbowLY + Math.cos(shoulderAngleL + elbowAngleL * dir) * lowerArmLen;

        ctx.beginPath();
        ctx.moveTo(neckX, neckY);
        ctx.lineTo(elbowLX, elbowLY);
        ctx.lineTo(handLX, handLY);
        ctx.stroke();

        // DRAW RIGHT ARM
        const elbowRX = neckX + Math.sin(shoulderAngleR) * upperArmLen;
        const elbowRY = neckY + Math.cos(shoulderAngleR) * upperArmLen;
        const handRX = elbowRX + Math.sin(shoulderAngleR + elbowAngleR * dir) * lowerArmLen;
        const handRY = elbowRY + Math.cos(shoulderAngleR + elbowAngleR * dir) * lowerArmLen;

        ctx.beginPath();
        ctx.moveTo(neckX, neckY);
        ctx.lineTo(elbowRX, elbowRY);
        ctx.lineTo(handRX, handRY);
        ctx.stroke();
      }

      ctx.restore();
    };

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, vw, vh);

      // Accurate Hero Section bounds in current viewport coordinates
      const heroEl = containerRef?.current ?? document.getElementById("hero-section");
      const heroRect = heroEl ? heroEl.getBoundingClientRect() : {
        left: 0,
        top: 0,
        right: vw,
        bottom: vh * 0.7,
        width: vw,
        height: vh * 0.7,
      };

      const heroMargin = 28;
      const heroMinX = heroRect.left + heroMargin;
      const heroMaxX = heroRect.right - heroMargin;
      const heroMinY = heroRect.top + heroMargin;
      const heroMaxY = heroRect.bottom - heroMargin;

      const isCursorInsideHero =
        isMouseActive &&
        mouseX >= heroRect.left &&
        mouseX <= heroRect.right &&
        mouseY >= heroRect.top &&
        mouseY <= heroRect.bottom;

      // ==============================================================
      // SECTION 03 & SECTION 04 DETECTION & COORDINATE TARGETING
      // ==============================================================
      // Section 03 Heading detection
      const section03HeadingEl = document.getElementById("section-03-heading");
      let isSection03Active = false;
      let lensTargetX = 0;
      let lensTargetY = 0;
      let headingTop03 = 0;

      if (section03HeadingEl) {
        const headingRect = section03HeadingEl.getBoundingClientRect();
        if (headingRect.top >= -80 && headingRect.top <= vh * 0.88) {
          isSection03Active = true;
          lensTargetX = headingRect.left + headingRect.width / 2;
          lensTargetY = headingRect.top - 46;
          headingTop03 = headingRect.top;
        }
      }

      // Section 04 Heading & Number Three Detection
      const section04HeadingEl = document.getElementById("section-04-heading");
      const section04Badge03El = document.getElementById("section-04-badge-03");

      let isSection04Active = false;
      let dartTargetX = 0;
      let dartTargetY = 0;

      if (section04HeadingEl) {
        const headingRect = section04HeadingEl.getBoundingClientRect();
        // Active when Section 04 title is in visible view range
        if (headingRect.top >= -200 && headingRect.top <= vh * 0.88) {
          isSection04Active = true;
          // Position dartboard directly above the heading, left-aligned with its start
          dartTargetX = headingRect.left + 20;
          dartTargetY = headingRect.top - 36;
        }
      } else if (section04Badge03El) {
        const badgeRect = section04Badge03El.getBoundingClientRect();
        if (badgeRect.top >= -50 && badgeRect.top <= vh * 0.9) {
          isSection04Active = true;
          dartTargetX = badgeRect.left - 42;
          dartTargetY = badgeRect.top + badgeRect.height / 2;
        }
      }

      // Section 05 ("05 / How I Think") Detection & Right-Side Target Dock
      const section05TargetEl = document.getElementById("section-05-target");
      const section05HeadingEl = document.getElementById("section-05-heading");
      const section05El = document.getElementById("section-05");

      let isSection05Active = false;
      let section05TargetX = 0;
      let section05TargetY = 0;

      if (section05TargetEl || section05HeadingEl || section05El) {
        const refEl = section05El || section05HeadingEl;
        if (refEl) {
          const rect = refEl.getBoundingClientRect();
          if (rect.top >= -220 && rect.top <= vh * 0.84) {
            isSection05Active = true;
            if (section05TargetEl) {
              const tRect = section05TargetEl.getBoundingClientRect();
              section05TargetX = tRect.left + tRect.width / 2;
              section05TargetY = tRect.top + tRect.height / 2;
            } else if (section05HeadingEl) {
              const hRect = section05HeadingEl.getBoundingClientRect();
              section05TargetX = hRect.right + 120;
              section05TargetY = hRect.top + hRect.height / 2;
            } else {
              section05TargetX = window.innerWidth - 80;
              section05TargetY = rect.top + 36;
            }
          }
        }
      }

      // Check if the timeline has ended (last card "timeline-card-5" scrolls past focus)
      const lastCardEl = document.getElementById("timeline-card-5");
      let hasTimelineEnded = false;
      if (lastCardEl) {
        const lcRect = lastCardEl.getBoundingClientRect();
        // The card has ended when its bottom is above the middle of the screen (vh * 0.45 focus band)
        if (lcRect.bottom <= vh * 0.45) {
          hasTimelineEnded = true;
        }
      }

      // Section 06 ("06 / Career Journey") Detection & Timeline Diamond Waypoint Tracking
      const section06El = document.getElementById("section-06");
      const section06HeadingEl = document.getElementById("section-06-heading");
      let isSection06Active = false;
      let section06TargetX = 0;
      let section06TargetY = 0;
      let closestDiamondIndex = -1;
      let closestDiamondDist = Infinity;
      let currentDiamondEl: HTMLElement | null = null;

      if (section06El || section06HeadingEl) {
        const s6Ref = section06El || section06HeadingEl;
        if (s6Ref) {
          const s6Rect = s6Ref.getBoundingClientRect();
          // Active while Section 06 is in viewport AND timeline hasn't ended yet
          if (s6Rect.top <= vh * 0.85 && s6Rect.bottom >= 0 && !hasTimelineEnded) {
            isSection06Active = true;

            // Search experience card elements (#timeline-card-0, #timeline-card-1, ...) to jump zig-zag across card tops
            const cardEls = document.querySelectorAll<HTMLElement>("[id^='timeline-card-']");
            if (cardEls.length > 0) {
              const targetBandY = vh * 0.45; // Optical focus band in middle of screen
              cardEls.forEach((cEl) => {
                const idStr = cEl.id || "";
                const idxMatch = idStr.match(/\d+/);
                const idx = idxMatch ? parseInt(idxMatch[0], 10) : 0;
                const cRect = cEl.getBoundingClientRect();
                const distToFocusBand = Math.abs(cRect.top + cRect.height * 0.35 - targetBandY);
                if (distToFocusBand < closestDiamondDist) {
                  closestDiamondDist = distToFocusBand;
                  closestDiamondIndex = idx;
                  currentDiamondEl = cEl;
                }
              });

              if (currentDiamondEl && closestDiamondIndex >= 0) {
                const targetRect = (currentDiamondEl as HTMLElement).getBoundingClientRect();
                const isCardOnLeft = (targetRect.left + targetRect.width / 2) < (vw / 2);
                const inset = Math.min(22, targetRect.width * 0.1);
                // Position stickman at the top corner of the card nearest to the central timeline spine
                section06TargetX = isCardOnLeft
                  ? targetRect.right - inset
                  : targetRect.left + inset;
                section06TargetY = targetRect.top; // Standing on top roof corner of card nearest to timeline
              }
            } else {
              // Fallback to spine anchors if cards not yet rendered
              const anchorEls = document.querySelectorAll<HTMLElement>("[id^='timeline-anchor-']");
              if (anchorEls.length > 0) {
                const targetBandY = vh * 0.45;
                anchorEls.forEach((aEl, idx) => {
                  const aRect = aEl.getBoundingClientRect();
                  const distToFocusBand = Math.abs(aRect.top + aRect.height / 2 - targetBandY);
                  if (distToFocusBand < closestDiamondDist) {
                    closestDiamondDist = distToFocusBand;
                    closestDiamondIndex = idx;
                    currentDiamondEl = aEl;
                  }
                });

                if (currentDiamondEl && closestDiamondIndex >= 0) {
                  const targetRect = (currentDiamondEl as HTMLElement).getBoundingClientRect();
                  section06TargetX = targetRect.left + targetRect.width / 2;
                  section06TargetY = targetRect.top;
                }
              }
            }

            // Fallback if no diamonds found
            if (closestDiamondIndex < 0) {
              section06TargetX = s6Rect.left + s6Rect.width / 2;
              section06TargetY = Math.max(100, Math.min(vh - 100, s6Rect.top + 160));
            }
          }
        }
      }

      // Section 07 ("07 / A Little More Human") Detection
      const section07El = document.getElementById("section-07");
      let isSection07Active = false;

      // Check Section 08 visibility to avoid overlapping active triggers
      const s8CheckEl = document.getElementById("section-08");
      const isS8ActiveNow = s8CheckEl ? (s8CheckEl.getBoundingClientRect().top <= vh * 0.85) : false;

      if (section07El) {
        const s7Rect = section07El.getBoundingClientRect();
        // Active while Section 07 is in viewport, OR if timeline has ended and Section 08 is not yet active
        if (((s7Rect.top <= vh * 0.85 && s7Rect.bottom >= 0) || hasTimelineEnded) && !isS8ActiveNow) {
          isSection07Active = true;

          // Establish a wandering target within Section 07 viewport intersection
          const s7MinX = Math.max(30, s7Rect.left + 30);
          const s7MaxX = Math.min(vw - 30, s7Rect.right - 30);
          const s7MinY = Math.max(30, s7Rect.top + 30);
          const s7MaxY = Math.min(vh - 30, s7Rect.bottom - 30);

          const currentDist = Math.hypot(photonLeader.x - section07TargetX, photonLeader.y - section07TargetY);

          if (isFireflyPerched) {
            fireflyPerchTimer--;
            if (fireflyPerchTimer <= 0) {
              isFireflyPerched = false;
              // Pick a new target to fly to
              section07TargetX = s7MinX + Math.random() * Math.max(20, s7MaxX - s7MinX);
              section07TargetY = s7MinY + Math.random() * Math.max(20, s7MaxY - s7MinY);
            }
          } else {
            if (section07TargetX === 0 || section07TargetY === 0) {
              section07TargetX = s7MinX + Math.random() * Math.max(20, s7MaxX - s7MinX);
              section07TargetY = s7MinY + Math.random() * Math.max(20, s7MaxY - s7MinY);
            } else if (currentDist < 15) {
              // Reached target! Let's perch and rest for 150-250 frames (approx. 2.5 - 4 seconds)
              isFireflyPerched = true;
              fireflyPerchTimer = 150 + Math.floor(Math.random() * 100);
              fireflyPerchedX = section07TargetX;
              fireflyPerchedY = section07TargetY;
            } else if (time % 360 === 0) {
              // Periodically find a new spot
              section07TargetX = s7MinX + Math.random() * Math.max(20, s7MaxX - s7MinX);
              section07TargetY = s7MinY + Math.random() * Math.max(20, s7MaxY - s7MinY);
            }
          }
        }
      }

      // Section 08 ("08 / Start a Conversation") Detection & Paper Airplane Docking Next to Heading
      const section08El = document.getElementById("section-08");
      const smileyDockEl = document.getElementById("section-08-smiley-dock");
      let isSection08Active = false;
      section08TargetX = 0;
      section08TargetY = 0;
      hireMeTargetX = 0;
      hireMeTargetY = 0;

      if (section08El || smileyDockEl) {
        const s8Ref = section08El || smileyDockEl;
        if (s8Ref) {
          const s8Rect = s8Ref.getBoundingClientRect();
          if (s8Rect.top <= vh * 0.85 && s8Rect.bottom >= 0) {
            isSection08Active = true;
            section08StateTimer++; // Increment active frame timeline

            if (smileyDockEl) {
              const sdRect = smileyDockEl.getBoundingClientRect();
              section08TargetX = sdRect.left + sdRect.width / 2;
              section08TargetY = sdRect.top + sdRect.height / 2;
            } else {
              section08TargetX = s8Rect.left + s8Rect.width / 2;
              section08TargetY = Math.max(100, Math.min(vh - 100, s8Rect.top + 160));
            }

            // Detect coordinates of the primary Start a conversation / Hire me button
            const hireMeBtnEl = document.getElementById("section-08-hire-me-btn");
            if (hireMeBtnEl) {
              const hmRect = hireMeBtnEl.getBoundingClientRect();
              hireMeTargetX = hmRect.left + hmRect.width / 2;
              hireMeTargetY = hmRect.top - 24; // resting position 24px above the button
            } else {
              hireMeTargetX = section08TargetX;
              hireMeTargetY = section08TargetY + 140; // fallback
            }
          } else {
            section08StateTimer = 0; // Reset timer when scrolled out
          }
        }
      } else {
        section08StateTimer = 0; // Reset timer if elements aren't present
      }

      // ==============================================================
      // 1. UPDATE & RENDER THE 3 HERO-BOUND FOLLOWER PHOTONS
      // ==============================================================
      photonFollowers.forEach((p) => {
        p.baseAngle += p.speed;
        p.orbitAngle += p.orbitSpeed;

        const anchorX = heroRect.left + heroRect.width * p.normX;
        const anchorY = heroRect.top + heroRect.height * p.normY;

        let targetX = anchorX + Math.cos(p.baseAngle * 0.8) * Math.min(p.roamRadiusX, heroRect.width * 0.25);
        let targetY = anchorY + Math.sin(p.baseAngle) * Math.min(p.roamRadiusY, heroRect.height * 0.25);

        // When cursor is in hero, follow cursor in smooth orbiting formation
        if (isCursorInsideHero) {
          targetX = mouseX + Math.cos(p.orbitAngle) * p.orbitRadius;
          targetY = mouseY + Math.sin(p.orbitAngle) * p.orbitRadius;
        } else if (isMouseActive && mouseX > -500) {
          // Cursor is outside hero: photons gather calmly near inner boundary facing cursor
          const clampedX = Math.max(heroMinX, Math.min(heroMaxX, mouseX));
          const clampedY = Math.max(heroMinY, Math.min(heroMaxY, mouseY));
          const edgeAngle = p.baseAngle * 0.5;
          targetX = clampedX + Math.cos(edgeAngle) * 35;
          targetY = clampedY + Math.sin(edgeAngle) * 35;
        }

        targetX = Math.max(heroMinX, Math.min(heroMaxX, targetX));
        targetY = Math.max(heroMinY, Math.min(heroMaxY, targetY));

        p.vx += (targetX - p.x) * p.cursorLag;
        p.vy += (targetY - p.y) * p.cursorLag;
        p.vx *= 0.87;
        p.vy *= 0.87;

        p.x += p.vx;
        p.y += p.vy;

        p.x = Math.max(heroMinX, Math.min(heroMaxX, p.x));
        p.y = Math.max(heroMinY, Math.min(heroMaxY, p.y));

        p.trail.unshift({ x: p.x, y: p.y, alpha: 1, size: PHOTON_CORE_RADIUS });
        if (p.trail.length > 10) p.trail.pop();

        renderIdenticalPhoton(p.x, p.y, p.trail);
      });

      // ==============================================================
      // 2. LEAD PHOTON / POSITRON / LENS / DARTBOARD DYNAMICS
      // ==============================================================
      photonLeader.baseAngle += photonLeader.speed;
      photonLeader.orbitAngle += photonLeader.orbitSpeed;

      // Handle Recombination when Positron returns deep into Hero chamber
      if (photonLeader.state === "POSITRON") {
        if (isCursorInsideHero && mouseY > heroRect.top + 60 && mouseY < heroRect.bottom - 60) {
          photonLeader.recombinationTimer += 1;
          if (photonLeader.recombinationTimer > 85) {
            photonLeader.state = "IN_HERO";
            photonLeader.recombinationTimer = 0;
            lensMorph = 0;
            dartMorph = 0;
            hasPlayedLensSound = false;
            hasStruckDart = false;
            arrowFlight = 0;
            dartImpactTimer = 0;
            section05ChargeTimer = 0;
            hasBlastedSection05 = false;
            section05BlastImpactTimer = 0;
            lastChargeTickSec = -1;
            positronVisibility = 1;
            playRecombinationSound();

            shockwaves.push({
              x: photonLeader.x,
              y: photonLeader.y,
              radius: 5,
              maxRadius: 100,
              alpha: 0.9,
              color: getDynamicAccent().rgba(0.85),
            });

            for (let i = 0; i < 16; i++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = 2 + Math.random() * 4;
              sparks.push({
                x: photonLeader.x,
                y: photonLeader.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                life: 0,
                maxLife: 25 + Math.random() * 15,
                size: 1.2 + Math.random() * 1.5,
                color: getDynamicAccent().hex,
              });
            }
          }
        } else {
          photonLeader.recombinationTimer = 0;
        }
      }

      // STATE MACHINE: IN_HERO vs STRAINING vs POSITRON (with Lens & Dartboard morphs)
      if (photonLeader.state !== "POSITRON") {
        lensMorph = 0;
        dartMorph = 0;
        section06StickMorph = 0;
        hasPlayedLensSound = false;
        hasStruckDart = false;
        arrowFlight = 0;
        dartImpactTimer = 0;
        section05ChargeTimer = 0;
        hasBlastedSection05 = false;
        section05BlastImpactTimer = 0;
        lastChargeTickSec = -1;

        if (!isCursorInsideHero && isMouseActive && mouseX > -500) {
          // Cursor is OUTSIDE hero section -> Exert strain against boundary
          photonLeader.state = "STRAINING";

          const clampedAnchorX = Math.max(heroMinX, Math.min(heroMaxX, mouseX));
          const clampedAnchorY = Math.max(heroMinY, Math.min(heroMaxY, mouseY));
          photonLeader.tetherAnchorX = clampedAnchorX;
          photonLeader.tetherAnchorY = clampedAnchorY;

          const pullDx = mouseX - clampedAnchorX;
          const pullDy = mouseY - clampedAnchorY;
          const pullDist = Math.hypot(pullDx, pullDy);

          const BREAK_THRESHOLD = 140;
          const strainFactor = Math.min(1, pullDist / BREAK_THRESHOLD);
          photonLeader.strain = strainFactor;

          updateContainmentStrainSound(strainFactor);

          const stretchLen = Math.pow(strainFactor, 0.75) * 55;
          const angle = Math.atan2(pullDy, pullDx);
          const targetX = clampedAnchorX + Math.cos(angle) * stretchLen;
          const targetY = clampedAnchorY + Math.sin(angle) * stretchLen;

          const jitterX = (Math.random() - 0.5) * strainFactor * 8.5;
          const jitterY = (Math.random() - 0.5) * strainFactor * 8.5;

          photonLeader.vx += (targetX + jitterX - photonLeader.x) * 0.09;
          photonLeader.vy += (targetY + jitterY - photonLeader.y) * 0.09;
          photonLeader.vx *= 0.82;
          photonLeader.vy *= 0.82;

          photonLeader.x += photonLeader.vx;
          photonLeader.y += photonLeader.vy;

          if (Math.random() < strainFactor * 0.75) {
            const sparkAngle = angle + (Math.random() - 0.5) * 1.8;
            const sparkSpeed = 2 + Math.random() * 5 * strainFactor;
            sparks.push({
              x: photonLeader.tetherAnchorX + (Math.random() - 0.5) * 6,
              y: photonLeader.tetherAnchorY + (Math.random() - 0.5) * 6,
              vx: Math.cos(sparkAngle) * sparkSpeed,
              vy: Math.sin(sparkAngle) * sparkSpeed,
              life: 0,
              maxLife: 15 + Math.random() * 15,
              size: 1.2 + Math.random() * 2,
              color: Math.random() > 0.4 ? getDynamicAccent().hex : "#ffffff",
            });
          }

          // BREAK FREE & TRANSFORM INTO SOPHISTICATED POSITRON
          if (pullDist >= BREAK_THRESHOLD || strainFactor >= 0.98) {
            photonLeader.state = "POSITRON";
            photonLeader.strain = 0;
            stopContainmentStrainSound();
            playPositronTransformationSound();

            const activeAcc = getDynamicAccent();

            shockwaves.push({
              x: photonLeader.x,
              y: photonLeader.y,
              radius: 4,
              maxRadius: 160,
              alpha: 0.95,
              color: activeAcc.rgba(0.9),
            });
            shockwaves.push({
              x: photonLeader.x,
              y: photonLeader.y,
              radius: 2,
              maxRadius: 110,
              alpha: 0.85,
              color: activeAcc.rgba(0.85),
            });

            for (let i = 0; i < 24; i++) {
              const sAngle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
              const spd = 3.2 + Math.random() * 5.5;
              const colorPalette = [activeAcc.hex, "#ffffff", activeAcc.rgba(0.7), "#ffffff", activeAcc.hex];
              sparks.push({
                x: photonLeader.x,
                y: photonLeader.y,
                vx: Math.cos(sAngle) * spd,
                vy: Math.sin(sAngle) * spd,
                life: 0,
                maxLife: 22 + Math.random() * 18,
                size: 1.4 + Math.random() * 1.8,
                color: colorPalette[i % colorPalette.length],
              });
            }
          }
        } else {
          // Inside hero chamber, tracking cursor normally in 100% IDENTICAL appearance
          photonLeader.state = "IN_HERO";
          photonLeader.strain = 0;
          stopContainmentStrainSound();

          let targetX = heroRect.left + heroRect.width * 0.45 + Math.cos(photonLeader.baseAngle * 0.7) * 160;
          let targetY = heroRect.top + heroRect.height * 0.42 + Math.sin(photonLeader.baseAngle) * 110;

          if (isCursorInsideHero) {
            targetX = mouseX + Math.cos(photonLeader.orbitAngle) * photonLeader.orbitRadius;
            targetY = mouseY + Math.sin(photonLeader.orbitAngle) * photonLeader.orbitRadius;
          }

          targetX = Math.max(heroMinX, Math.min(heroMaxX, targetX));
          targetY = Math.max(heroMinY, Math.min(heroMaxY, targetY));

          photonLeader.vx += (targetX - photonLeader.x) * photonLeader.cursorLag;
          photonLeader.vy += (targetY - photonLeader.y) * photonLeader.cursorLag;
          photonLeader.vx *= 0.86;
          photonLeader.vy *= 0.86;

          photonLeader.x += photonLeader.vx;
          photonLeader.y += photonLeader.vy;
        }

        // Velocity-based collision detection among roaming photon balls
        const activePhotons = [photonLeader, ...photonFollowers];
        const PHOTON_COLLISION_DIST = 32; // Natural bounce separation distance for roaming photon balls

        for (let i = 0; i < activePhotons.length; i++) {
          for (let j = i + 1; j < activePhotons.length; j++) {
            const p1 = activePhotons[i]!;
            const p2 = activePhotons[j]!;

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.hypot(dx, dy);

            if (dist < PHOTON_COLLISION_DIST && dist > 0.001) {
              const overlap = PHOTON_COLLISION_DIST - dist;
              const nx = dx / dist;
              const ny = dy / dist;

              // Separate positions to prevent overlap
              const separate = overlap * 0.5;
              p1.x -= nx * separate;
              p1.y -= ny * separate;
              p2.x += nx * separate;
              p2.y += ny * separate;

              // Calculate relative velocity
              const kx = p1.vx - p2.vx;
              const ky = p1.vy - p2.vy;
              const velAlongNormal = kx * nx + ky * ny;

              // If moving towards each other, apply natural bounce impulse
              if (velAlongNormal > 0) {
                const restitution = 0.82;
                const impulse = (1 + restitution) * velAlongNormal * 0.5;
                p1.vx -= nx * impulse;
                p1.vy -= ny * impulse;
                p2.vx += nx * impulse;
                p2.vy += ny * impulse;
              }
            }
          }
        }
      } else {
        // ==============================================================
        // STATE = POSITRON / LENS / DARTBOARD
        // ==============================================================
        stopContainmentStrainSound();

        let targetX = mouseX;
        let targetY = mouseY;

        if (isSection04Active) {
          // ==========================================================
          // SECTION 04 ACTIVE: TRANSFORM INTO DARTBOARD IN FRONT OF "THREE"
          // ==========================================================
          targetX = dartTargetX;
          targetY = dartTargetY;

          // Faster morph and quicker spring lock onto position in front of "Three"
          dartMorph += (1 - dartMorph) * 0.16;
          lensMorph += (0 - lensMorph) * 0.16;
          section06StickMorph += (0 - section06StickMorph) * 0.25;
          if (lensMorph < 0.1) hasPlayedLensSound = false;

          // Responsive spring to quickly lock onto position in front of "Three"
          photonLeader.vx += (targetX - photonLeader.x) * 0.18;
          photonLeader.vy += (targetY - photonLeader.y) * 0.18;
          photonLeader.vx *= 0.65;
          photonLeader.vy *= 0.65;

          // ARROW FLIGHT & BULLSEYE IMPACT TIMING (Fast snappy trigger after dartboard arrives)
          if (dartMorph > 0.65) {
            dartboardStayTimer += 1;
          }

          // Snappy delay (~25 frames / ~0.4s @ 60fps), arrow zips in rapidly
          if (dartboardStayTimer >= 25 && !hasStruckDart) {
            arrowFlight += (1.08 - arrowFlight) * 0.38;

            if (arrowFlight >= 0.98) {
              arrowFlight = 1.0;
              hasStruckDart = true;
              dartImpactTimer = 0;
              playDartBullseyeSound();

              // Pop celebratory confetti burst once upon Bull's Eye
              const confettiColors = [
                "#d1651c", // Vibrant Brand Accent
                "#d1651c", // Bright Orange
                "#fb923c", // Amber Orange
                "#fdba74", // Solar Gold
                "#ffedd5", // Warm Highlight Cream
                "#d1651c", // Orange Shade
                "#d1651c", // Deep Orange Accent
              ];

              for (let i = 0; i < 75; i++) {
                const angle = (i / 75) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
                const speed = 3.5 + Math.random() * 8.5;
                const shapeType: "rect" | "circle" | "strip" =
                  i % 3 === 0 ? "rect" : i % 3 === 1 ? "strip" : "circle";

                confetti.push({
                  x: photonLeader.x,
                  y: photonLeader.y,
                  vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
                  vy: Math.sin(angle) * speed - (1.5 + Math.random() * 4.0),
                  w: shapeType === "strip" ? 2.5 + Math.random() * 2 : 4 + Math.random() * 4,
                  h: shapeType === "strip" ? 8 + Math.random() * 7 : 4 + Math.random() * 4,
                  rot: Math.random() * Math.PI * 2,
                  vRot: (Math.random() - 0.5) * 0.25,
                  color: confettiColors[i % confettiColors.length],
                  shape: shapeType,
                  life: 0,
                  maxLife: 95 + Math.random() * 50,
                  gravity: 0.12 + Math.random() * 0.08,
                  wobble: Math.random() * Math.PI * 2,
                  wobbleSpeed: 0.08 + Math.random() * 0.1,
                });
              }

              // Bullseye impact sparks
              for (let i = 0; i < 24; i++) {
                const sAngle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
                const spd = 2.8 + Math.random() * 5.5;
                const colorPalette = ["#d1651c", "#fed7aa", "#ffffff", "#d1651c", "#ffedd5"];
                sparks.push({
                  x: photonLeader.x,
                  y: photonLeader.y,
                  vx: Math.cos(sAngle) * spd,
                  vy: Math.sin(sAngle) * spd,
                  life: 0,
                  maxLife: 24 + Math.random() * 16,
                  size: 1.4 + Math.random() * 1.8,
                  color: colorPalette[i % colorPalette.length],
                });
              }

              // Concentric impact shockwaves
              shockwaves.push({
                x: photonLeader.x,
                y: photonLeader.y,
                radius: 3,
                maxRadius: 90,
                alpha: 0.95,
                color: getDynamicAccent().rgba(0.9),
              });
              shockwaves.push({
                x: photonLeader.x,
                y: photonLeader.y,
                radius: 2,
                maxRadius: 60,
                alpha: 0.85,
                color: getDynamicAccent().rgba(0.85),
              });
            }
          }

          if (hasStruckDart) {
            dartImpactTimer += 1;
          }
        } else if (isSection05Active) {
          // ==========================================================
          // SECTION 05 ACTIVE: POSITRON CHARGES & BLASTS AFTER 3 SECONDS
          // ==========================================================
          targetX = section05TargetX;
          targetY = section05TargetY;

          section06ChronometerMorph += (0 - section06ChronometerMorph) * 0.12;
          section06StickMorph += (0 - section06StickMorph) * 0.2;
          lensMorph += (0 - lensMorph) * 0.085;
          dartMorph += (0 - dartMorph) * 0.085;
          fireflyMorph += (0 - fireflyMorph) * 0.15;
          smileyMorph += (0 - smileyMorph) * 0.15;

          if (lensMorph < 0.1) hasPlayedLensSound = false;
          if (dartMorph < 0.1) {
            hasStruckDart = false;
            arrowFlight = 0;
            dartboardStayTimer = 0;
            dartImpactTimer = 0;
          }
          if (fireflyMorph < 0.1) hasPlayedFireflySound = false;
          if (smileyMorph < 0.1) hasPlayedSmileySound = false;

          // Smooth damped homing onto Section 05
          photonLeader.vx += (targetX - photonLeader.x) * 0.095;
          photonLeader.vy += (targetY - photonLeader.y) * 0.095;
          photonLeader.vx *= 0.72;
          photonLeader.vy *= 0.72;

          if (!hasBlastedSection05) {
            section05ChargeTimer += 1;
            const chargeProgress = Math.min(1, section05ChargeTimer / 180);

            // Inward-rushing high energy sparks
            if (Math.random() < 0.35 + chargeProgress * 0.55) {
              const sparkAngle = Math.random() * Math.PI * 2;
              const dist = 28 + Math.random() * 36 * (1 - chargeProgress * 0.5);
              const inSpeed = 2.4 + chargeProgress * 4.0;
              sparks.push({
                x: photonLeader.x + Math.cos(sparkAngle) * dist,
                y: photonLeader.y + Math.sin(sparkAngle) * dist,
                vx: -Math.cos(sparkAngle) * inSpeed,
                vy: -Math.sin(sparkAngle) * inSpeed,
                life: 0,
                maxLife: 14 + Math.random() * 10,
                size: 1.2 + Math.random() * 1.6,
                color: chargeProgress > 0.65 ? "#ffffff" : chargeProgress > 0.3 ? "#fed7aa" : "#d1651c",
              });
            }

            // Audio countdown blips at each second mark (1s, 2s) and pre-blast tension (2.5s, 2.8s)
            const currentSec = Math.floor(section05ChargeTimer / 60);
            if (currentSec !== lastChargeTickSec && currentSec >= 1 && currentSec <= 2) {
              lastChargeTickSec = currentSec;
              playPositronChargeTick(chargeProgress);
            } else if (section05ChargeTimer === 150 || section05ChargeTimer === 168) {
              playPositronChargeTick(chargeProgress);
            }

            // AT EXACTLY 3 SECONDS (180 frames @ 60fps) -> DETONATE PLASMA BLAST!
            if (section05ChargeTimer >= 180) {
              hasBlastedSection05 = true;
              section05BlastImpactTimer = 0;
              positronVisibility = 0; // Completely disappear upon detonation
              photonLeader.trail = []; // Clear trail immediately so no residual ball/tail remains
              playPositronBlastSound();

              // Trigger typography color change from black to orange in Section 05
              try {
                (window as unknown as { __POSITRON_SECTION_05_BLASTED?: boolean }).__POSITRON_SECTION_05_BLASTED = true;
                const sec05 = document.getElementById("section-05");
                if (sec05) {
                  sec05.classList.add("section-05-blasted");
                }
              } catch {}
              window.dispatchEvent(new CustomEvent("positron-section-05-blasted"));

              // Expanding high-intensity shockwaves
              shockwaves.push({
                x: photonLeader.x,
                y: photonLeader.y,
                radius: 6,
                maxRadius: 360,
                alpha: 1.0,
                color: "rgba(209, 101, 28, 0.95)",
              });
              shockwaves.push({
                x: photonLeader.x,
                y: photonLeader.y,
                radius: 4,
                maxRadius: 240,
                alpha: 0.9,
                color: "rgba(209, 101, 28, 0.9)",
              });
              shockwaves.push({
                x: photonLeader.x,
                y: photonLeader.y,
                radius: 2,
                maxRadius: 140,
                alpha: 0.95,
                color: "rgba(255, 255, 255, 0.98)",
              });

              // 80 High-energy blast plasma sparks
              for (let i = 0; i < 80; i++) {
                const sAngle = (i / 80) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
                const spd = 3.5 + Math.random() * 9.5;
                const colors = ["#d1651c", "#d1651c", "#fed7aa", "#ffffff", "#ffedd5"];
                sparks.push({
                  x: photonLeader.x,
                  y: photonLeader.y,
                  vx: Math.cos(sAngle) * spd,
                  vy: Math.sin(sAngle) * spd,
                  life: 0,
                  maxLife: 35 + Math.random() * 25,
                  size: 1.8 + Math.random() * 2.6,
                  color: colors[i % colors.length],
                });
              }

              // Confetti burst across Section 05
              const confettiColors = ["#d1651c", "#d1651c", "#d1651c", "#d1651c", "#ffedd5", "#fed7aa", "#d1651c"];
              for (let i = 0; i < 75; i++) {
                const angle = (i / 75) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
                const speed = 3.5 + Math.random() * 8.5;
                const shapeType: "rect" | "circle" | "strip" =
                  i % 3 === 0 ? "rect" : i % 3 === 1 ? "strip" : "circle";

                confetti.push({
                  x: photonLeader.x,
                  y: photonLeader.y,
                  vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
                  vy: Math.sin(angle) * speed - (1.5 + Math.random() * 4.0),
                  w: shapeType === "strip" ? 2.5 + Math.random() * 2 : 4 + Math.random() * 4,
                  h: shapeType === "strip" ? 8 + Math.random() * 7 : 4 + Math.random() * 4,
                  rot: Math.random() * Math.PI * 2,
                  vRot: (Math.random() - 0.5) * 0.25,
                  color: confettiColors[i % confettiColors.length],
                  shape: shapeType,
                  life: 0,
                  maxLife: 100 + Math.random() * 50,
                  gravity: 0.12 + Math.random() * 0.08,
                  wobble: Math.random() * Math.PI * 2,
                  wobbleSpeed: 0.08 + Math.random() * 0.1,
                });
              }
            }
          } else {
            section05BlastImpactTimer += 1;
          }
        } else if (isSection06Active) {
          // ==========================================================
          // SECTION 06 (CAREER JOURNEY): STICK MAN ONLY
          // ==========================================================
          positronVisibility += (1 - positronVisibility) * 0.12;
          section06StickMorph += (1 - section06StickMorph) * 0.12;

          section06ChronometerMorph += (0 - section06ChronometerMorph) * 0.12;
          lensMorph += (0 - lensMorph) * 0.08;
          dartMorph += (0 - dartMorph) * 0.08;
          fireflyMorph += (0 - fireflyMorph) * 0.15;
          smileyMorph += (0 - smileyMorph) * 0.15;

          if (lensMorph < 0.1) hasPlayedLensSound = false;
          if (dartMorph < 0.1) {
            hasStruckDart = false;
            arrowFlight = 0;
            dartboardStayTimer = 0;
            dartImpactTimer = 0;
          }
          if (fireflyMorph < 0.1) hasPlayedFireflySound = false;
          if (smileyMorph < 0.1) hasPlayedSmileySound = false;

          // Track card waypoint transition and initiate edge-to-edge leap trajectory
          if (closestDiamondIndex >= 0 && closestDiamondIndex !== lastStickCardIndex) {
            let cardEdgeTargetX = section06TargetX;
            let cardEdgeTargetY = section06TargetY;

            if (currentDiamondEl) {
              const cRect = (currentDiamondEl as HTMLElement).getBoundingClientRect();
              const isCardOnLeft = (cRect.left + cRect.width / 2) < (vw / 2);
              const inset = Math.min(22, cRect.width * 0.1);

              // Target is the card corner nearest to the central timeline spine
              cardEdgeTargetX = isCardOnLeft
                ? cRect.right - inset
                : cRect.left + inset;
              cardEdgeTargetY = cRect.top;

              stickFacingDir = cardEdgeTargetX >= photonLeader.x ? 1 : -1;
            } else {
              stickFacingDir = section06TargetX >= photonLeader.x ? 1 : -1;
            }

            jumpStartPos = { x: photonLeader.x, y: photonLeader.y };
            jumpTargetPos = { x: cardEdgeTargetX, y: cardEdgeTargetY };
            stickJumpProgress = 0;
            lastStickCardIndex = closestDiamondIndex;

            playTimelineDiamondChime(closestDiamondIndex);

            // Subtle landing ring
            shockwaves.push({
              x: cardEdgeTargetX,
              y: cardEdgeTargetY,
              radius: 2,
              maxRadius: 28,
              alpha: 0.45,
              color: "rgba(209, 101, 28, 0.45)",
            });

            // Gentle landing dust
            for (let s = 0; s < 6; s++) {
              const spAngle = (s / 6) * Math.PI * 2;
              const spSpd = 1.0 + Math.random() * 1.8;
              sparks.push({
                x: cardEdgeTargetX,
                y: cardEdgeTargetY,
                vx: Math.cos(spAngle) * spSpd,
                vy: Math.sin(spAngle) * spSpd,
                life: 0,
                maxLife: 15 + Math.random() * 8,
                size: 1.0 + Math.random() * 1.2,
                color: "#d1651c",
              });
            }
          }

          // Execute Walk -> Crouch -> High Edge-to-Edge Parabolic Jump with Ease-In-Out
          if (stickJumpProgress < 1.0) {
            stickJumpProgress += 0.016; // Extended air time for a deliberate, graceful arc
            if (stickJumpProgress >= 1.0) {
              stickJumpProgress = 1.0;
              photonLeader.x = jumpTargetPos.x;
              photonLeader.y = jumpTargetPos.y;
              photonLeader.vx = 0;
              photonLeader.vy = 0;
            } else {
              // Smooth sinusoidal ease-in-out easing curve for flight trajectory
              const easeProgress = 0.5 - Math.cos(stickJumpProgress * Math.PI) * 0.5;
              const baseX = jumpStartPos.x + (jumpTargetPos.x - jumpStartPos.x) * easeProgress;
              const baseY = jumpStartPos.y + (jumpTargetPos.y - jumpStartPos.y) * easeProgress;

              // Airborne high parabolic jump curve across gap (0.30 to 0.80 phase)
              let arcY = 0;
              if (stickJumpProgress >= 0.30 && stickJumpProgress < 0.80) {
                const airProgress = (stickJumpProgress - 0.30) / 0.50;
                const jumpDist = Math.hypot(jumpTargetPos.x - jumpStartPos.x, jumpTargetPos.y - jumpStartPos.y);
                const arcHeight = Math.min(125, Math.max(55, jumpDist * 0.38));
                arcY = -Math.sin(airProgress * Math.PI) * arcHeight;
              }

              photonLeader.x = baseX;
              photonLeader.y = baseY + arcY;
              photonLeader.vx = 0;
              photonLeader.vy = 0;
            }
          } else {
            // Stationary on experience card waypoint
            const distToNode = Math.hypot(section06TargetX - photonLeader.x, section06TargetY - photonLeader.y);
            if (distToNode < 1.0) {
              photonLeader.x = section06TargetX;
              photonLeader.y = section06TargetY;
            } else {
              photonLeader.vx += (section06TargetX - photonLeader.x) * 0.15;
              photonLeader.vy += (section06TargetY - photonLeader.y) * 0.15;
              photonLeader.vx *= 0.65;
              photonLeader.vy *= 0.65;
              photonLeader.x += photonLeader.vx;
              photonLeader.y += photonLeader.vy;
            }
          }

          if (Math.random() < 0.25) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 10 + Math.random() * 14;
            sparks.push({
              x: photonLeader.x + Math.cos(angle) * dist,
              y: photonLeader.y + Math.sin(angle) * dist,
              vx: (Math.random() - 0.5) * 0.8,
              vy: -0.6 - Math.random() * 0.8,
              life: 0,
              maxLife: 20 + Math.random() * 10,
              size: 1.0 + Math.random() * 1.2,
              color: "#d1651c",
            });
          }
        } else if (isSection07Active) {
          // ==========================================================
          // SECTION 07 ACTIVE: POSITRON BECOMES A BIOLUMINESCENT FIREFLY
          // ==========================================================
          positronVisibility += (1 - positronVisibility) * 0.12;

          fireflyMorph += (1 - fireflyMorph) * 0.1;
          section06ChronometerMorph += (0 - section06ChronometerMorph) * 0.12;
          section06StickMorph += (0 - section06StickMorph) * 0.12;
          smileyMorph += (0 - smileyMorph) * 0.1;
          lensMorph += (0 - lensMorph) * 0.08;
          dartMorph += (0 - dartMorph) * 0.08;

          if (lensMorph < 0.1) hasPlayedLensSound = false;
          if (dartMorph < 0.1) {
            hasStruckDart = false;
            arrowFlight = 0;
            dartboardStayTimer = 0;
            dartImpactTimer = 0;
          }
          if (smileyMorph < 0.1) hasPlayedSmileySound = false;

          // Play Firefly Morph Sound once upon transformation
          if (fireflyMorph > 0.82 && !hasPlayedFireflySound) {
            hasPlayedFireflySound = true;
            playFireflyMorphSound();

            // Emit some soft warm particles
            for (let i = 0; i < 20; i++) {
              const angle = (i / 20) * Math.PI * 2;
              const spd = 0.5 + Math.random() * 1.5;
              sparks.push({
                x: photonLeader.x,
                y: photonLeader.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                life: 0,
                maxLife: 30 + Math.random() * 15,
                size: 1.2 + Math.random() * 1.5,
                color: "#d1651c",
              });
            }
          }

          if (isFireflyPerched) {
            // High friction, snap perfectly still when perched with a tiny organic wiggle
            targetX = fireflyPerchedX;
            targetY = fireflyPerchedY;
            photonLeader.vx += (targetX - photonLeader.x) * 0.15;
            photonLeader.vy += (targetY - photonLeader.y) * 0.15;
            photonLeader.vx *= 0.5;
            photonLeader.vy *= 0.5;
          } else {
            targetX = section07TargetX;
            targetY = section07TargetY;
            // Extremely slow, graceful floating flight (reduced tracking by another 50%)
            photonLeader.vx += (targetX - photonLeader.x) * 0.0065;
            photonLeader.vy += (targetY - photonLeader.y) * 0.0065;
            photonLeader.vx *= 0.74;
            photonLeader.vy *= 0.74;
          }

          // Gentle bioluminescent particles emission
          if (Math.random() < 0.18) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 4 + Math.random() * 6;
            sparks.push({
              x: photonLeader.x + Math.cos(angle) * dist,
              y: photonLeader.y + Math.sin(angle) * dist,
              vx: (Math.random() - 0.5) * 0.4,
              vy: (Math.random() - 0.5) * 0.4 + 0.1, // Drifts slightly downward
              life: 0,
              maxLife: 25 + Math.random() * 15,
              size: 0.8 + Math.random() * 1.0,
              color: "#d1651c",
            });
          }
        } else if (isSection08Active) {
          // ==========================================================
          // SECTION 08 ACTIVE: POSITRON DOCKS AND TRANSFORMS INTO SMILEY FACE
          // ==========================================================
          positronVisibility += (1 - positronVisibility) * 0.12;

          smileyMorph += (1 - smileyMorph) * 0.1;
          section06StickMorph += (0 - section06StickMorph) * 0.2;
          fireflyMorph += (0 - fireflyMorph) * 0.1;
          lensMorph += (0 - lensMorph) * 0.08;
          dartMorph += (0 - dartMorph) * 0.08;

          if (lensMorph < 0.1) hasPlayedLensSound = false;
          if (dartMorph < 0.1) {
            hasStruckDart = false;
            arrowFlight = 0;
            dartboardStayTimer = 0;
            dartImpactTimer = 0;
          }
          if (fireflyMorph < 0.1) hasPlayedFireflySound = false;

          // Play Smiley Morph Sound once upon docking/transforming
          if (smileyMorph > 0.82 && !hasPlayedSmileySound) {
            hasPlayedSmileySound = true;
            playSmileyMorphSound();

            // Joyful radiant sparkburst!
            for (let i = 0; i < 24; i++) {
              const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
              const spd = 1.8 + Math.random() * 3.5;
              sparks.push({
                x: photonLeader.x,
                y: photonLeader.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                life: 0,
                maxLife: 32 + Math.random() * 16,
                size: 1.2 + Math.random() * 1.8,
                color: i % 2 === 0 ? "#fed7aa" : "#d1651c",
              });
            }

            // Expanding celebration ring
            shockwaves.push({
              x: section08TargetX,
              y: section08TargetY,
              radius: 4,
              maxRadius: 55,
              alpha: 0.85,
              color: "rgba(209, 101, 28, 0.9)",
            });
          }

          // Compute hover state if plane is formed
          const planeMorphVal = Math.max(0, Math.min(1, (section08StateTimer - 50) / 50));
          if (planeMorphVal > 0.5) {
            const dx = mouseX - photonLeader.x;
            const dy = mouseY - photonLeader.y;
            isSection08Hovered = (Math.hypot(dx, dy) < 32);
          } else {
            isSection08Hovered = false;
          }
          section08HoverActive += ((isSection08Hovered ? 1 : 0) - section08HoverActive) * 0.12;

          if (section08StateTimer < 80) {
            // Envelope pulse & morph into paper airplane at header dock (after SOLVING ?)
            targetX = section08TargetX;
            targetY = section08TargetY;
          } else if (section08StateTimer < 170) {
            // Fast, dynamic glide flight: Smooth curved flight path down to the Start a Conversation button
            const t = (section08StateTimer - 80) / 90;
            const u = 1 - t;
            const cp1x = section08TargetX + 140;
            const cp1y = section08TargetY - 30;
            const cp2x = hireMeTargetX - 120;
            const cp2y = hireMeTargetY - 100;

            const fx = u*u*u*section08TargetX + 3*u*u*t*cp1x + 3*u*t*t*cp2x + t*t*t*hireMeTargetX;
            const fy = u*u*u*section08TargetY + 3*u*u*t*cp1y + 3*u*t*t*cp2y + t*t*t*hireMeTargetY;

            // Aerodynamic flight flutter simulation
            const flutterAmp = (1 - t) * 10;
            const flutterFreq = t * Math.PI * 6;
            targetX = fx + Math.sin(flutterFreq) * flutterAmp * 0.8;
            targetY = fy - Math.abs(Math.cos(flutterFreq)) * flutterAmp * 1.1;

            // Emit faint glowing vapor trail particle effect
            if (section08StateTimer % 2 === 0) {
              const trailAngle = Math.random() * Math.PI * 2;
              const trailSpeed = 0.1 + Math.random() * 0.4;
              sparks.push({
                x: photonLeader.x,
                y: photonLeader.y,
                vx: -photonLeader.vx * 0.12 + Math.cos(trailAngle) * trailSpeed,
                vy: -photonLeader.vy * 0.12 + Math.sin(trailAngle) * trailSpeed,
                life: 0,
                maxLife: 24 + Math.random() * 12,
                size: 0.9 + Math.random() * 1.3,
                color: Math.random() < 0.65 ? "#fed7aa" : "#d1651c"
              });
            }
          } else {
            // Landed gently above Start a conversation button with crisp settle bounce
            const landingProgress = section08StateTimer - 170;
            const bounceY = Math.exp(-0.08 * landingProgress) * Math.sin(landingProgress * 0.2) * 14;
            const hoverYOffset = -10 * section08HoverActive;
            targetX = hireMeTargetX;
            targetY = hireMeTargetY + bounceY + hoverYOffset + Math.sin((time - 170) * 0.05) * 1.5;
          }

          // Clean, high-precision snapping onto dock
          photonLeader.vx += (targetX - photonLeader.x) * 0.16;
          photonLeader.vy += (targetY - photonLeader.y) * 0.16;
          photonLeader.vx *= 0.65;
          photonLeader.vy *= 0.65;

          // Continuous happy sparkles
          if (Math.random() < 0.1) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 8 + Math.random() * 10;
            sparks.push({
              x: photonLeader.x + Math.cos(angle) * dist,
              y: photonLeader.y + Math.sin(angle) * dist,
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5,
              life: 0,
              maxLife: 20 + Math.random() * 10,
              size: 0.8 + Math.random() * 1.0,
              color: "#d1651c",
            });
          }
        } else if (isSection03Active) {
          // ==========================================================
          // SECTION 03 ACTIVE: TRANSFORM INTO LENS ABOVE HEADING
          // ==========================================================
          targetX = lensTargetX;
          targetY = lensTargetY;

          lensMorph += (1 - lensMorph) * 0.075;
          section06StickMorph += (0 - section06StickMorph) * 0.2;
          dartMorph += (0 - dartMorph) * 0.085;
          fireflyMorph += (0 - fireflyMorph) * 0.15;
          smileyMorph += (0 - smileyMorph) * 0.15;

          if (dartMorph < 0.1) {
            hasStruckDart = false;
            arrowFlight = 0;
            dartboardStayTimer = 0;
            dartImpactTimer = 0;
            confetti.length = 0;
          }
          if (fireflyMorph < 0.1) hasPlayedFireflySound = false;
          if (smileyMorph < 0.1) hasPlayedSmileySound = false;

          photonLeader.vx += (targetX - photonLeader.x) * 0.085;
          photonLeader.vy += (targetY - photonLeader.y) * 0.085;
          photonLeader.vx *= 0.72;
          photonLeader.vy *= 0.72;

          if (lensMorph > 0.82 && !hasPlayedLensSound) {
            hasPlayedLensSound = true;
            playLensTransformationSound();

            shockwaves.push({
              x: targetX,
              y: targetY,
              radius: 4,
              maxRadius: 75,
              alpha: 0.85,
              color: getDynamicAccent().rgba(0.9),
            });
          }
        } else {
          // ==========================================================
          // GENERAL ROAMING POSITRON FLIGHT
          // ==========================================================
          lensMorph += (0 - lensMorph) * 0.08;
          dartMorph += (0 - dartMorph) * 0.08;
          section06StickMorph += (0 - section06StickMorph) * 0.2;
          fireflyMorph += (0 - fireflyMorph) * 0.15;
          smileyMorph += (0 - smileyMorph) * 0.15;

          if (lensMorph < 0.1) hasPlayedLensSound = false;
          if (dartMorph < 0.1) {
            hasStruckDart = false;
            arrowFlight = 0;
            dartboardStayTimer = 0;
            dartImpactTimer = 0;
            confetti.length = 0;
          }
          if (fireflyMorph < 0.1) hasPlayedFireflySound = false;
          if (smileyMorph < 0.1) hasPlayedSmileySound = false;

          // Determine if user has scrolled past Hero into the case study / lens and downstream sections
          const isScrolledPastHeroAndLens = (window.scrollY > 450) || (heroRect.bottom < -50);

          if (isScrolledPastHeroAndLens) {
            // POST-LENS & DOWNSTREAM SECTIONS: Follow the right-hand scroll rail / scroll progress smoothly!
            const docHeight = Math.max(
              document.documentElement.scrollHeight,
              document.body.scrollHeight,
              window.innerHeight + 100
            );
            const maxScrollable = Math.max(1, docHeight - window.innerHeight);
            const scrollPct = Math.min(1, Math.max(0, window.scrollY / maxScrollable));

            // Margins to ensure safe clearance from top navbar & bottom action controls
            const topRailMargin = 85;
            const bottomRailMargin = 95;
            const railSpan = Math.max(50, vh - topRailMargin - bottomRailMargin);

            // Compute exact vertical position along scroll bar with gentle micro-floating breathing
            const railTargetY = topRailMargin + scrollPct * railSpan + Math.sin(time * 0.04) * 4;

            // X position along right edge rail with subtle organic breathing
            const railXOffset = vw < 640 ? 16 : 24;
            const railTargetX = vw - railXOffset + Math.cos(time * 0.05) * 2;

            targetX = railTargetX;
            targetY = railTargetY;
          } else {
            // HERO / PRE-LENS: Follow mouse cursor with interactive playfulness & tether mechanics
            if (!isMouseActive || mouseX < -500) {
              targetX = vw * 0.5 + Math.cos(time * 0.02) * 200;
              targetY = vh * 0.4 + Math.sin(time * 0.025) * 150;
            } else {
              const swirlRadius = 22 + Math.sin(time * 0.06) * 6;
              targetX = mouseX + Math.cos(time * 0.08) * swirlRadius;
              targetY = mouseY + Math.sin(time * 0.08) * swirlRadius;
            }
          }

          photonLeader.vx += (targetX - photonLeader.x) * 0.095;
          photonLeader.vy += (targetY - photonLeader.y) * 0.095;
          photonLeader.vx *= 0.84;
          photonLeader.vy *= 0.84;

          if (Math.random() < 0.28) {
            const sparkAngle = Math.random() * Math.PI * 2;
            const spd = 0.8 + Math.random() * 2.0;
            sparks.push({
              x: photonLeader.x,
              y: photonLeader.y,
              vx: Math.cos(sparkAngle) * spd,
              vy: Math.sin(sparkAngle) * spd,
              life: 0,
              maxLife: 16 + Math.random() * 10,
              size: 1.0 + Math.random() * 1.2,
              color: Math.random() > 0.5 ? "#fed7aa" : getDynamicAccent().hex,
            });
          }
        }

        photonLeader.x += photonLeader.vx;
        photonLeader.y += photonLeader.vy;
      }

      photonLeader.trail.unshift({
        x: photonLeader.x,
        y: photonLeader.y,
        alpha: 1,
        size: PHOTON_CORE_RADIUS,
      });
      if (photonLeader.trail.length > 14) photonLeader.trail.pop();

      // Render Tether Line if straining against boundary
      if (photonLeader.state === "STRAINING" && photonLeader.strain > 0.05) {
        const strain = photonLeader.strain;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(photonLeader.tetherAnchorX, photonLeader.tetherAnchorY);

        const midX = (photonLeader.tetherAnchorX + photonLeader.x) / 2 + (Math.random() - 0.5) * strain * 12;
        const midY = (photonLeader.tetherAnchorY + photonLeader.y) / 2 + (Math.random() - 0.5) * strain * 12;
        ctx.quadraticCurveTo(midX, midY, photonLeader.x, photonLeader.y);

        ctx.strokeStyle = getDynamicAccent().rgba(0.4 + strain * 0.55);
        ctx.lineWidth = 1.2 + strain * 2.2;
        ctx.setLineDash([3, 2]);
        ctx.lineDashOffset = -time * 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(photonLeader.tetherAnchorX, photonLeader.tetherAnchorY);
        ctx.quadraticCurveTo(midX, midY, photonLeader.x, photonLeader.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * strain})`;
        ctx.lineWidth = 0.85;
        ctx.setLineDash([]);
        ctx.stroke();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(photonLeader.tetherAnchorX, photonLeader.tetherAnchorY, 5 + strain * 7, 0, Math.PI * 2);
        ctx.strokeStyle = getDynamicAccent().rgba(0.7 * strain);
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      // Render Leader Particle / Positron / Lens / Dartboard
      if (photonLeader.state !== "POSITRON") {
        const strainAngle = photonLeader.state === "STRAINING"
          ? Math.atan2(mouseY - photonLeader.tetherAnchorY, mouseX - photonLeader.tetherAnchorX)
          : 0;

        renderIdenticalPhoton(
          photonLeader.x,
          photonLeader.y,
          photonLeader.trail,
          photonLeader.strain,
          strainAngle
        );
      } else {
        const combinedMorph = Math.min(1, lensMorph + dartMorph + fireflyMorph + smileyMorph);

        // 1. Positron Body (Disappears when blasted in Section 05, hidden in Section 06 where stickman is active, visible elsewhere)
        renderSophisticatedPositron(
          photonLeader.x,
          photonLeader.y,
          photonLeader.trail,
          combinedMorph,
          isSection05Active && !hasBlastedSection05,
          Math.min(1, section05ChargeTimer / 180),
          isSection05Active && hasBlastedSection05,
          isSection06Active ? (1 - section06StickMorph) : (hasBlastedSection05 ? 0 : positronVisibility),
          false
        );

        // 2. Optical Lens (Section 03)
        renderSophisticatedLens(
          photonLeader.x,
          photonLeader.y,
          lensMorph,
          headingTop03
        );

        // 3. Dartboard & Bullseye Striking Arrow (Section 04)
        renderDartboardAndArrow(
          photonLeader.x,
          photonLeader.y,
          dartMorph,
          arrowFlight,
          hasStruckDart,
          dartImpactTimer
        );

        // 4. Bioluminescent Firefly (Section 07)
        renderSophisticatedFirefly(
          photonLeader.x,
          photonLeader.y,
          fireflyMorph,
          time
        );

        // 5. Contact Smiley Face (Section 08)
        renderSophisticatedSmiley(
          photonLeader.x,
          photonLeader.y,
          smileyMorph,
          time
        );

        // 6. Classic Running Stickman Character (Strictly in Section 06 only)
        if (isSection06Active && section06StickMorph > 0.005) {
          renderStickFigureCharacter(
            photonLeader.x,
            photonLeader.y,
            section06StickMorph,
            stickJumpProgress,
            lastStickCardIndex,
            time,
            stickFacingDir
          );
        }
      }

      // ==========================================
      // 3. UPDATE & DRAW SPARK PARTICLES
      // ==========================================
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.95;
        s.vy *= 0.95;
        s.life += 1;

        if (s.life >= s.maxLife) {
          sparks.splice(i, 1);
          continue;
        }

        const alpha = 1 - s.life / s.maxLife;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * alpha + 0.3, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // ==========================================
      // 4. UPDATE & DRAW QUANTUM SHOCKWAVES
      // ==========================================
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.12 + 2.5;
        sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);

        if (sw.radius >= sw.maxRadius || sw.alpha <= 0.01) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = 1.8 * sw.alpha + 0.5;
        ctx.stroke();
        ctx.restore();
      }

      // ==========================================
      // 5. UPDATE & DRAW CONFETTI PARTICLES
      // ==========================================
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += c.gravity;
        c.vx *= 0.985;
        c.vy *= 0.985;
        c.rot += c.vRot;
        c.wobble += c.wobbleSpeed;
        c.life += 1;

        if (c.life >= c.maxLife) {
          confetti.splice(i, 1);
          continue;
        }

        const alpha = Math.min(1, (1 - c.life / c.maxLife) * 1.6);
        const wobbleScaleX = Math.cos(c.wobble);

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.scale(wobbleScaleX, 1);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = c.color;

        if (c.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, c.w * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-c.w * 0.5, -c.h * 0.5, c.w, c.h);
        }

        ctx.restore();
      }

      if (!document.hidden) {
        animId = requestAnimationFrame(render);
      } else {
        animId = 0;
      }
    };

    const handleVisibility = () => {
      if (!document.hidden && animId === 0) {
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    animId = requestAnimationFrame(render);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("click", handleWindowClick);
      stopContainmentStrainSound();
      if (animId) cancelAnimationFrame(animId);
    };
  }, [containerRef, reducedMotion]);

  if (reducedMotion) return null;

  return createPortal(
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30 size-full overflow-visible"
      aria-hidden="true"
    />,
    document.body
  );
}
