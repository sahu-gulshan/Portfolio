import { Linkedin, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useProfile } from "@/context/ProfileContext";
import { track } from "@/lib/analytics";

export function LinkedInCard({ className }: { className?: string } = {}) {
  const { profile } = useProfile();

  const linkedinHandle = profile.linkedin
    ? profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "").replace(/\/$/, "").toUpperCase()
    : "GULSHAN-SAHU";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-2xl border-0 bg-card/60 p-6 backdrop-blur-md transition-all duration-300 flex flex-col justify-between ${className || ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
            <Linkedin className="size-5" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-display text-base font-bold tracking-tight text-foreground">{profile.name}</p>
              <CheckCircle2 className="size-3.5 text-accent shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {profile.role} — {profile.positioning}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
        Let's connect professionally. Roles, collaborations, or a product problem you're
        still framing — my full experience lives on LinkedIn.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/30">
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("linkedin_click", { from: "linkedin-card" })}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          View full profile
          <ArrowUpRight className="size-3.5" />
        </a>
        <span className="label-mono text-[0.675rem] font-medium tracking-wider text-muted-foreground uppercase">
          LINKEDIN.COM/IN/{linkedinHandle}
        </span>
      </div>
    </motion.div>
  );
}
