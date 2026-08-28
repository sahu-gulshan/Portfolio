import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Modern two-part kinetic cursor: a precise inner dot plus an elastic outer ring
 * that expands over interactive elements.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine && !reduced);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const loop = () => {
      const dx = x - rx;
      const dy = y - ry;
      rx += dx * 0.22;
      ry += dy * 0.22;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest(
        "a, button, [role='button'], input, textarea, select, summary, [data-cursor='hover']"
      );
      ring.current?.classList.toggle("cursor-ring--active", interactive);
      if (raf === 0) {
        raf = requestAnimationFrame(loop);
      }
    };

    const down = () => ring.current?.classList.add("cursor-ring--down");
    const up = () => ring.current?.classList.remove("cursor-ring--down");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[99999]">
      <div ref={ring} className="cursor-ring" />
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
