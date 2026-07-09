"use client";

import { useEffect } from "react";
import { animate, useMotionValue, useTransform, motion } from "motion/react";

export interface AnimatedNumberProps {
  value: number;
  /** Format the interpolated value for display (e.g. as currency). */
  format?: (n: number) => string;
  durationMs?: number;
  className?: string;
}

/** Smoothly counts up to `value` whenever it changes. Respects reduced motion. */
export function AnimatedNumber({
  value,
  format = (n) => n.toLocaleString(),
  durationMs = 800,
  className,
}: AnimatedNumberProps) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (latest) => format(latest));

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: durationMs / 1000,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [mv, value, durationMs]);

  return <motion.span className={className}>{text}</motion.span>;
}
