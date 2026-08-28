import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useInView } from "motion/react";
import { GraduationCap, Briefcase, FileText } from "lucide-react";
import { experience, education } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useProfile } from "@/context/ProfileContext";
import { track } from "@/lib/analytics";

type Node = {
  id: string;
  period: string;
  title: string;
  subtitle: string;
  chapter: string;
  body?: string;
  owned?: string[];
  edu?: boolean;
};

function buildNodes(): Node[] {
  const jobs: Node[] = experience.map((e) => ({
    id: e.company,
    period: e.period,
    title: e.title,
    subtitle: e.place ? `${e.company} · ${e.place}` : e.company,
    chapter: e.chapter,
    body: e.learned,
    owned: e.owned,
  }));
  const edu: Node[] = education.map((e) => ({
    id: e.school,
    period: e.years,
    title: e.degree,
    subtitle: e.school,
    chapter: "Where it started",
    edu: true,
  }));
  return [...jobs, ...edu];
}

function TimelineItem({
  node: n,
  index: i,
  full,
  reduced,
}: {
  key?: string;
  node: Node;
  index: number;
  full?: boolean;
  reduced?: boolean;
}) {
  const itemRef = useRef<HTMLLIElement>(null);
  const [nodeStatus, setNodeStatus] = useState<"upcoming" | "active" | "passed">("upcoming");

  const isCurrentRole =
    n.period.toLowerCase().includes("present") ||
    n.title.toLowerCase().includes("product manager");

  useEffect(() => {
    const handleScroll = () => {
      if (!itemRef.current) return;
      const rect = itemRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate top position relative to viewport
      const nodeCenterPos = rect.top + rect.height * 0.3;

      // Active zone: when timeline node enters focus band (between 25% and 65% of viewport)
      if (nodeCenterPos >= viewportHeight * 0.25 && nodeCenterPos <= viewportHeight * 0.65) {
        setNodeStatus("active");
      } else if (nodeCenterPos < viewportHeight * 0.25) {
        setNodeStatus("passed");
      } else {
        setNodeStatus("upcoming");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const left = i % 2 === 0;

  return (
    <li
      ref={itemRef}
      id={`timeline-node-${i}`}
      className="relative pl-10 sm:pl-16 md:pl-0 md:grid md:grid-cols-2 md:gap-16"
    >
      {/* Precision Timeline Waypoint Circle Division along the Spine */}
      <div className="absolute left-4 sm:left-6 md:left-1/2 top-7 md:top-8 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none">
        <div
          id={`timeline-diamond-${i}`}
          aria-hidden
          data-timeline-diamond={i}
          className={`timeline-diamond-marker pointer-events-auto relative flex items-center justify-center transition-all duration-500 ease-out hover:scale-110 rounded-full border-2 ${
            nodeStatus === "active"
              ? "size-5 md:size-6 border-accent bg-accent/20 text-accent scale-105 shadow-[0_0_16px_rgba(249,115,22,0.4)]"
              : nodeStatus === "passed"
              ? "size-4.5 md:size-5 border-accent/70 bg-accent/15 text-accent scale-100 shadow-[0_0_8px_rgba(249,115,22,0.2)]"
              : "size-4 md:size-4.5 border-border/80 bg-background/90 text-muted-foreground/40 scale-95"
          }`}
        >
          {/* Minimal Radar Ripple Ping when Active */}
          {nodeStatus === "active" && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full border border-accent/60 pointer-events-none"
            />
          )}

          {/* Timeline Center Aperture / Core Dot with Breathing Scale */}
          <motion.span
            animate={
              nodeStatus === "active"
                ? { scale: [1, 1.25, 1] }
                : { scale: 1 }
            }
            transition={
              nodeStatus === "active"
                ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                : {}
            }
            className={`rounded-full transition-all duration-500 ease-out ${
              nodeStatus === "active"
                ? "size-2 md:size-2.5 bg-accent"
                : nodeStatus === "passed"
                ? "size-1.5 bg-accent/90"
                : "size-1 bg-muted-foreground/30 group-hover:bg-accent/50"
            }`}
          />

          {/* Present Role Indicator Halo */}
          {isCurrentRole && nodeStatus === "active" && (
            <span className="absolute -inset-1 rounded-full border border-accent/60 pointer-events-none animate-pulse" />
          )}
        </div>

        {/* Anchor for positron tracking */}
        <div
          id={`timeline-anchor-${i}`}
          className="absolute pointer-events-none opacity-0 size-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
          aria-hidden="true"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2, margin: "0px 0px -20px 0px" }}
        transition={
          reduced
            ? { duration: 0.3 }
            : {
                type: "spring",
                stiffness: 120,
                damping: 22,
                mass: 0.5,
              }
        }
        className={
          left
            ? "md:col-start-1 md:pr-4 md:text-right"
            : "md:col-start-2 md:row-start-1 md:pl-4"
        }
      >
        <div
          id={`timeline-card-${i}`}
          tabIndex={0}
          className={`rounded-2xl border p-4 sm:p-5 md:p-6 transition-all duration-500 ease-out shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            nodeStatus === "active"
              ? "border-accent/80 bg-card/95 shadow-md"
              : nodeStatus === "passed"
              ? "border-accent/30 bg-card/80 hover:border-accent/60"
              : "border-transparent bg-card/40"
          }`}
        >
          <div className={`flex items-center gap-2 ${left ? "md:justify-end" : ""}`}>
            {n.edu ? (
              <GraduationCap
                className={`size-3.5 transition-colors duration-700 ease-in-out ${
                  nodeStatus === "upcoming" ? "text-muted-foreground/60" : "text-accent"
                }`}
              />
            ) : (
              <Briefcase
                className={`size-3.5 transition-colors duration-700 ease-in-out ${
                  nodeStatus === "upcoming" ? "text-muted-foreground/60" : "text-accent"
                }`}
              />
            )}
            <p
              className={`label-mono font-bold text-[0.7rem] sm:text-xs whitespace-nowrap transition-colors duration-700 ease-in-out ${
                nodeStatus === "upcoming" ? "text-muted-foreground/60" : "text-accent"
              }`}
            >
              {n.period}
            </p>
          </div>

          <h3
            className={`mt-2 font-display text-lg sm:text-xl md:text-2xl font-bold tracking-tight transition-colors duration-700 ease-in-out ${
              nodeStatus === "upcoming" ? "text-foreground/80" : "text-foreground"
            }`}
          >
            {n.title}
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground font-medium">
            {n.subtitle}
          </p>

          {n.body && (
            <p
              className={`mt-3 text-xs sm:text-sm md:text-sm leading-relaxed font-normal italic transition-colors duration-700 ease-in-out ${
                nodeStatus === "upcoming"
                  ? "text-muted-foreground/80"
                  : "text-foreground/90"
              }`}
            >
              “{n.body}”
            </p>
          )}

          {full && n.owned && (
            <ul
              className={`mt-4 space-y-2 text-xs sm:text-sm leading-relaxed transition-colors duration-700 ease-in-out ${
                nodeStatus === "upcoming" ? "text-muted-foreground/70" : "text-muted-foreground"
              } ${left ? "md:text-right" : ""}`}
            >
              {n.owned.map((o) => (
                <li key={o} className="flex gap-2 items-start">
                  <span
                    className={`size-1 rounded-full mt-1.5 shrink-0 transition-colors duration-700 ${
                      nodeStatus === "upcoming" ? "bg-muted-foreground/40" : "bg-accent"
                    }`}
                  />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </li>
  );
}

export function Timeline({ full = false }: { full?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const nodes = buildNodes();
  const { setIsResumeOpen } = useProfile();

  return (
    <section
      id="section-06"
      aria-label="Career Journey Timeline"
      className={`relative px-6 md:px-12 lg:px-16 cv-auto ${
        full
          ? "pt-32 pb-20 md:pt-40 md:pb-28"
          : "py-20 md:py-28 lg:py-32"
      }`}
    >
      <div className="mx-auto max-w-[1500px]">
        <Reveal y={50}>
          <div>
            <p
              id="section-timeline-heading"
              className="label-mono text-xs text-muted-foreground uppercase tracking-widest font-semibold"
            >
              Career Journey
            </p>
          </div>

          <h2
            id="section-timeline-title"
            className="display-lg mt-3 max-w-4xl font-display font-bold text-foreground"
          >
            Operations → discovery → UX → data → AI → product
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed text-base">
            I didn't start in product. I started where the consequences of bad product land — on
            an operations floor, in front of customers. That foundation still shapes how I prioritize and build.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => {
                track("open_resume_modal", { from: "timeline_section" });
                setIsResumeOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-2 text-xs font-mono font-medium text-foreground hover:border-accent hover:text-accent transition-all duration-200 cursor-pointer shadow-2xs"
            >
              <FileText className="size-3.5 text-accent" />
              <span>View & Download Official Resume (PDF)</span>
            </button>
          </div>
        </Reveal>

        <div ref={ref} id="timeline-spine-container" className="relative mt-16">
          {/* Timeline Spine Track */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-4 sm:left-6 md:left-1/2 w-[2px] -translate-x-1/2 bg-border"
          />
          {/* Active Fill Spine */}
          <motion.div
            aria-hidden
            style={reduced ? { scaleY: 1 } : { scaleY }}
            className="absolute inset-y-0 left-4 sm:left-6 md:left-1/2 w-[2px] -translate-x-1/2 origin-top bg-accent shadow-[0_0_12px_rgba(249,115,22,0.4)]"
          />

          <ol className="space-y-12 md:space-y-8">
            {nodes.map((n, i) => (
              <TimelineItem
                key={n.id}
                node={n}
                index={i}
                full={full}
                reduced={reduced}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

