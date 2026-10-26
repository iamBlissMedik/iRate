"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";

export interface AnimatedNumberProps {
  value: number;
  /** Format the interpolated value for display (e.g. as currency). */
  format?: (n: number) => string;
  durationMs?: number;
  className?: string;
}

/**
 * Counts up to `value` whenever it changes. With "reduce motion" on it shows
 * the final value straight away (MotionConfig doesn't cover imperative
 * `animate`, so this checks the preference itself).
 */
export function AnimatedNumber({
  value,
  format = (n) => n.toLocaleString(),
  durationMs = 800,
  className,
}: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion();
  const mv = useMotionValue(0);
  const text = useTransform(mv, (latest) => format(latest));

  useEffect(() => {
    if (reduceMotion) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: durationMs / 1000, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [mv, value, durationMs, reduceMotion]);

  return <motion.span className={className}>{text}</motion.span>;
}
