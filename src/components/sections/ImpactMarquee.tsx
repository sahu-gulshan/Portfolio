import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { impact } from "@/data/site";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function Row({
  items,
  reverse,
  duration,
}: {
  items: string[];
  reverse?: boolean;
  duration: number;
}) {
  const loop = [...items, ...items, ...items];
  return (
    <div className="group relative overflow-hidden py-2 w-full flex items-center justify-center" aria-hidden>
      <div
        className={`marquee-track flex w-max items-center gap-8 group-hover:[animation-play-state:paused] ${
          reverse ? "marquee-track--reverse" : ""
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((item, i) => {
          const [head, ...rest] = item.split(" ");
          return (
            <span key={i} className="flex shrink-0 items-center gap-8">
              <span className="font-display text-xl tracking-tight transition-colors duration-300 hover:text-accent md:text-3xl font-semibold">
                <span>{head}</span>{" "}
                <span className="text-muted-foreground font-normal">{rest.join(" ")}</span>
              </span>
              <span className="size-2 rotate-45 bg-accent" />
            </span>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent md:w-36 z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent md:w-36 z-10" />
    </div>
  );
}

export function ImpactMarquee() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      aria-label="Impact metrics"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="hairline-t border-b border-border py-5 md:py-7 bg-card/20 w-full overflow-hidden flex flex-col items-center justify-center"
    >
      <p className="sr-only">Selected outcomes: {impact.join(", ")}.</p>

      {reduced ? (
        <ul className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-center gap-x-6 gap-y-3 px-6 md:px-12 lg:px-16 text-center">
          {impact.map((item) => (
            <li key={item} className="label-mono text-foreground font-semibold">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="w-full flex items-center justify-center">
          <Row items={[...impact]} duration={34} />
        </div>
      )}
    </motion.section>
  );
}
