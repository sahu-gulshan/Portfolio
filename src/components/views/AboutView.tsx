import { site, certifications, achievements, education } from "@/data/site";
import { useProfile } from "@/context/ProfileContext";
import { Reveal } from "@/components/Reveal";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { StackBubbleCanvas } from "@/components/StackBubbleCanvas";
import { Award, GraduationCap, CheckCircle2, Sparkles } from "lucide-react";
import type { NavTab } from "@/components/Nav";

interface AboutViewProps {
  onNavigate: (tab: NavTab) => void;
}

export function AboutView({ onNavigate }: AboutViewProps) {
  const { profile } = useProfile();

  const bioParagraphs = profile.customBio ? profile.customBio.split("\n\n") : [];

  return (
    <div className="px-6 pb-24 pt-32 md:px-12 md:pt-40 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex items-center justify-between">
          <p className="label-mono text-xs text-muted-foreground uppercase tracking-widest font-semibold">About Me</p>
        </div>
        <h1 className="display-xl mt-4 max-w-[14ch] font-bold">
          Strategy is a <span className="text-accent underline decoration-accent/40 decoration-wavy underline-offset-8">visual</span> discipline
        </h1>

        <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <div className="overflow-hidden rounded-3xl border border-border bg-card/40 p-2 shadow-xl">
              <img
                src={profile.portrait}
                alt={`Portrait of ${profile.name}`}
                width={880}
                height={1200}
                loading="eager"
                decoding="async"
                className="w-full rounded-2xl object-cover object-top transition-transform duration-500 hover:scale-[1.01] max-h-[520px]"
              />
            </div>
            <div className="mt-4 flex items-center justify-between px-2">
              <p className="label-mono font-semibold">{profile.name}</p>
              {profile.location && <p className="label-mono text-accent">{profile.location}</p>}
            </div>
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            {bioParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
            <p className="text-foreground font-semibold border-l-2 border-accent pl-4">
              What I'm good at: turning a fuzzy business problem into a prioritised roadmap
              that a squad can ship and an executive leadership team can measure.
            </p>
          </div>
        </div>

        {/* Interactive Stack Bubble Component (Desktop & Tablet only - hidden on mobile) */}
        <section className="hidden md:block mt-20">
          <Reveal>
            <div className="mb-6 flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between border-b border-border/60 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-mono font-bold text-accent">
                  <Sparkles className="size-3.5" />
                  <span>PRODUCT MANAGEMENT TOOLING & METHODOLOGY STACK</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground max-w-md">
                Interactive physics stack representing core PM methodologies, design systems, AI models, and analytics frameworks.
              </p>
            </div>
            <StackBubbleCanvas />
          </Reveal>
        </section>

        {/* Certifications */}
        <section className="mt-28">
          <Reveal>
            <div className="flex items-center gap-2">
              <Award className="size-4 text-muted-foreground" />
              <p className="label-mono text-xs text-muted-foreground uppercase tracking-widest font-semibold">Certifications & Specializations</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {certifications.map((c) => (
                <span
                  key={c.name}
                  className="group inline-flex items-center gap-3 rounded-full border border-border bg-card/60 px-4 py-2.5 text-sm transition-all hover:border-accent hover:bg-card"
                >
                  <span className="label-mono text-accent font-bold">{c.tag}</span>
                  <span className="text-foreground font-medium">{c.name}</span>
                </span>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Achievements & Education */}
        <section className="mt-24 grid gap-14 md:grid-cols-2">
          <Reveal>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-muted-foreground" />
              <p className="label-mono text-xs text-muted-foreground uppercase tracking-widest font-semibold">Key Recognitions</p>
            </div>
            <ul className="mt-6 space-y-6">
              {achievements.map((a) => (
                <li key={a.title} className="rounded-2xl border border-border bg-card/40 p-6 border-l-4 border-l-accent">
                  <p className="font-display text-xl font-bold tracking-tight text-foreground">{a.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.detail}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="flex items-center gap-2">
              <GraduationCap className="size-4 text-muted-foreground" />
              <p className="label-mono text-xs text-muted-foreground uppercase tracking-widest font-semibold">Education & Foundations</p>
            </div>
            <ul className="mt-6 space-y-6">
              {education.map((e) => (
                <li key={e.degree} className="rounded-2xl border border-border bg-card/40 p-6">
                  <p className="font-display text-lg font-bold text-foreground">{e.degree}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.school}</p>
                  <p className="label-mono mt-2 text-accent font-semibold">{e.years}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      </div>

      <div className="mt-20">
        <ContactCTA onNavigate={onNavigate} />
      </div>
    </div>
  );
}
