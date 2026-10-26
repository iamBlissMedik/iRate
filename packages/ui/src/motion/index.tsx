"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/** Shared easing so every entrance animation feels the same. */
const smooth = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: smooth },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

/** Fade + rise on mount. */
export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smooth, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Wraps a list; children rendered with <Stagger.Item> animate in sequence. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerContainer} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeInUp}>
      {children}
    </motion.div>
  );
}

Stagger.Item = StaggerItem;

/**
 * Smoothly re-animates its content whenever `routeKey` changes — pass the
 * current pathname to get a fade/rise transition on every navigation. Kept
 * framework-agnostic (no next/navigation) so the app supplies the key.
 */
export function PageTransition({
  routeKey,
  children,
  className,
}: {
  routeKey: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      key={routeKey}
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={smooth}
    >
      {children}
    </motion.div>
  );
}

export { AnimatedNumber } from "./animated-number";
