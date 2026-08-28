import { Hero } from "@/components/sections/Hero";
import { ImpactMarquee } from "@/components/sections/ImpactMarquee";
import { Capabilities } from "@/components/sections/Capabilities";
import { OperatingSpace } from "@/components/sections/OperatingSpace";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Philosophy } from "@/components/sections/Philosophy";
import { Timeline } from "@/components/sections/Timeline";
import { AboutStrip } from "@/components/sections/AboutStrip";
import { ContactCTA } from "@/components/sections/ContactCTA";
import type { NavTab } from "@/components/Nav";

interface HomeViewProps {
  onNavigate: (tab: NavTab, slug?: string) => void;
  onOpenAiAssistant?: () => void;
  hasHeroIntroPlayed?: boolean;
  onHeroIntroComplete?: () => void;
}

export function HomeView({
  onNavigate,
  onOpenAiAssistant,
  hasHeroIntroPlayed,
  onHeroIntroComplete,
}: HomeViewProps) {
  return (
    <>
      {/* 1. Hero Section */}
      <Hero
        onNavigate={onNavigate}
        onOpenAiAssistant={onOpenAiAssistant}
        hasHeroIntroPlayed={hasHeroIntroPlayed}
        onHeroIntroComplete={onHeroIntroComplete}
      />

      {/* Impact Marquee Banner */}
      <ImpactMarquee />

      {/* 2. The Space I Operate In Section */}
      <OperatingSpace />

      {/* 3. Core Capabilities Section (Skills & Interactive Stack) */}
      <Capabilities />

      {/* 4. Selected Work Section (Featured Case Studies) */}
      <SelectedWork onNavigate={onNavigate} />

      {/* 5. Career Journey Section (Milestones Timeline) */}
      <Timeline />

      {/* 6. How I Think Section (PM Methodology) */}
      <Philosophy />

      {/* 7. Human-Focused Section (Beyond the Resume) */}
      <AboutStrip onNavigate={onNavigate} />

      {/* 8. Start a Conversation Section */}
      <ContactCTA onNavigate={onNavigate} />
    </>
  );
}
