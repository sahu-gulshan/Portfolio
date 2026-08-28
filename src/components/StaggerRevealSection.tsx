import React, { ReactNode } from "react";
import { motion, Variants } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface StaggerRevealSectionProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  viewportAmount?: number;
  once?: boolean;
  as?: React.ElementType;
}

export function StaggerRevealSection({
  children,
  className = "",
  staggerDelay = 0.12,
  delayChildren = 0,
  viewportAmount = 0.15,
  once = true,
  as = "section",
}: StaggerRevealSectionProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Component = as as any;
    return <Component className={className}>{children}</Component>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayChildren,
      },
    },
  };

  const MotionComponent = motion[as as keyof typeof motion] || motion.section;

  return (
    <MotionComponent
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: viewportAmount }}
    >
      {children}
    </MotionComponent>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  y?: number;
  x?: number;
  scale?: number;
  blur?: boolean;
  duration?: number;
}

export function StaggerItem({
  children,
  className = "",
  y = 28,
  x = 0,
  scale = 0.99,
  blur = false,
  duration = 0.65,
}: StaggerItemProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: y,
      x: x,
      scale: scale,
      filter: blur ? "blur(4px)" : "none",
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: "none",
      transition: {
        duration: duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
