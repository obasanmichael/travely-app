import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { MapPin } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import type { Destination } from "../api/client";
import { SeasonRibbon } from "../components/SeasonRibbon";
import { cn } from "../ui/cn";

const MAX_TILT_DEG = 9;

interface TicketCardProps {
  place: Destination;
  className?: string;
  /** Copies of a card in a looping strip are hidden from keyboards and screen readers. */
  decorative?: boolean;
}

/** A place as a ticket: tilts toward the pointer, with a light glare that follows it. */
export function TicketCard({ place, className, decorative = false }: TicketCardProps) {
  const reduce = useReducedMotion();
  const glare = useRef<HTMLSpanElement>(null);
  const tiltX = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });

  const track = (event: PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    tiltY.set((x - 0.5) * 2 * MAX_TILT_DEG);
    tiltX.set((0.5 - y) * 2 * MAX_TILT_DEG);
    glare.current?.style.setProperty("--gx", `${x * 100}%`);
    glare.current?.style.setProperty("--gy", `${y * 100}%`);
  };
  const settle = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <div className={cn("[perspective:1100px]", className)} onPointerMove={track} onPointerLeave={settle}>
      <motion.div style={{ rotateX: tiltX, rotateY: tiltY }} className="[transform-style:preserve-3d] drop-shadow-[0_24px_32px_rgb(0_0_0/0.28)]">
        <Link
          to={`/app/places/${place.slug}`}
          tabIndex={decorative ? -1 : undefined}
          aria-hidden={decorative || undefined}
          className="ticket group relative block aspect-[3/4.35] overflow-hidden rounded-[26px] bg-surface text-ink no-underline"
        >
          <div className="absolute inset-x-0 top-0 bottom-[var(--stub)] overflow-hidden bg-primary-wash">
            {place.photo ? (
              <img
                src={place.photo.url}
                alt=""
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
              />
            ) : (
              <MapPin className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-primary/50" aria-hidden="true" />
            )}
            <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/55 to-transparent" aria-hidden="true" />
            {place.photo && (
              <span className="absolute bottom-2 left-4 right-4 truncate text-[10px] text-white/70">
                Photo: {place.photo.author}, {place.photo.licence}
              </span>
            )}
            <span
              ref={glare}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: "radial-gradient(circle at var(--gx, 50%) var(--gy, 30%), rgb(255 255 255 / 0.55), transparent 55%)" }}
            />
          </div>
          <span className="absolute inset-x-5 bottom-[var(--stub)] border-t-2 border-dashed border-line" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 flex h-[var(--stub)] flex-col justify-between px-5 pb-4 pt-4">
            <div>
              <p className="m-0 line-clamp-1 font-serif text-[1.65rem] leading-none tracking-tight">{place.name}</p>
              <p className="m-0 mt-1.5 text-sm text-muted">{place.state}</p>
            </div>
            <SeasonRibbon scores={place.month_scores} />
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
