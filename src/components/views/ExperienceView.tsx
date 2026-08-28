import { Timeline } from "@/components/sections/Timeline";
import { ContactCTA } from "@/components/sections/ContactCTA";
import type { NavTab } from "@/components/Nav";

interface ExperienceViewProps {
  onNavigate: (tab: NavTab) => void;
}

export function ExperienceView({ onNavigate }: ExperienceViewProps) {
  return (
    <div className="pb-12">
      <Timeline full />
      <ContactCTA onNavigate={onNavigate} />
    </div>
  );
}
