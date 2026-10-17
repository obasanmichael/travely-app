import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  index?: number;
  className?: string;
  /** Animate when scrolled into view (landing page) instead of on mount (lists). */
  inView?: boolean;
}

/** Cards rise and fade in, staggered by index. Plain element when motion is reduced. */
export function Reveal({ children, index = 0, className, inView = false }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  const initial = { opacity: 0, y: 24, scale: 0.98 };
  const target = { opacity: 1, y: 0, scale: 1 };
  const transition = { duration: 0.5, delay: Math.min(index, 8) * 0.06, ease: [0.2, 0.7, 0.2, 1] as const };
  return inView ? (
    <motion.div className={className} initial={initial} whileInView={target} viewport={{ once: true, margin: "-60px" }} transition={transition}>
      {children}
    </motion.div>
  ) : (
    <motion.div className={className} initial={initial} animate={target} transition={transition}>
      {children}
    </motion.div>
  );
}
