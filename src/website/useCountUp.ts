import { animate, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/** Counts from 0 to `target` once `start` is true. Jumps straight there under reduced motion. */
export function useCountUp(target: number, start: boolean): number {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (reduce) {
      setValue(target);
      return;
    }
    const controls = animate(0, target, { duration: 1.2, ease: "easeOut", onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [target, start, reduce]);
  return value;
}
