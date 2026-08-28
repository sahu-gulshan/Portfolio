import { motion } from "motion/react";
import { type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Reveal({
  children,
  delay = 0,
  y = 16,
  blur = false,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: y,
        scale: 0.99,
        filter: blur ? "blur(4px)" : "none",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "none",
      }}
      viewport={{ once: true, amount: "some" }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}


