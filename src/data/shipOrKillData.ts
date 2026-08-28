export interface DilemmaCard {
  id: string;
  category: "AI & Data" | "UX & Growth" | "Infra & Tech" | "Process & Culture" | "Strategy";
  title: string;
  scenario: string;
  correct: "SHIP" | "KILL";
  impact: string;
  rationale: string;
  authorNote?: string;
}

export const DILEMMA_DECK: DilemmaCard[] = [
  {
    id: "ai-toaster",
    category: "AI & Data",
    title: "AI-Powered Smart Toaster",
    scenario: "CEO demands adding an LLM to the kitchen toaster before tomorrow's board pitch.",
    correct: "KILL",
    impact: "Saved $120k in cloud inference fees on burnt bagels.",
    rationale: "Not every hardware appliance needs 70 billion parameters to brown bread.",
  },
  {
    id: "passwordless-login",
    category: "UX & Growth",
    title: "1-Click Magic Link / Passkey Login",
    scenario: "Replace 14-character password requirement with WebAuthn passkeys and magic links.",
    correct: "SHIP",
    impact: "Onboarding conversion jumps +38%, support tickets plummet.",
    rationale: "Frictionless auth boosts activation and cuts account recovery tickets.",
  },
  {
    id: "friday-hotfix",
    category: "Infra & Tech",
    title: "Friday 4:55 PM Database Migration",
    scenario: "Push an unindexed SQL foreign key schema refactor straight to production on Friday evening.",
    correct: "KILL",
    impact: "Saved the on-call engineer's weekend and stopped P0 outage.",
    rationale: "Never deploy database schema refactors when the team is walking out the door.",
  },
  {
    id: "event-analytics",
    category: "AI & Data",
    title: "Funnel Event Instrumentation",
    scenario: "Add precision analytics on checkout drop-off steps instead of guessing where users leave.",
    correct: "SHIP",
    impact: "Identified a broken mobile payment button causing 62% cart abandon.",
    rationale: "You cannot optimize what you do not measure. Instrument core user flows first.",
  },
  {
    id: "rewrite-in-rust",
    category: "Infra & Tech",
    title: "Rewrite Entire CRUD App in Rust",
    scenario: "Junior engineer wants a 3-month pause on all customer feature requests to rewrite working Node backend in Rust.",
    correct: "KILL",
    impact: "Protected roadmap velocity and prevented 12 weeks of zero releases.",
    rationale: "Rewriting working code for language hype without performance bottlenecks burns runway.",
  },
  {
    id: "dark-mode",
    category: "UX & Growth",
    title: "System-Aware Dark Mode",
    scenario: "Add automatic dark theme support requested by 84% of developer users.",
    correct: "SHIP",
    impact: "User satisfaction surges, session durations increase +22%.",
    rationale: "Dark mode reduces eye strain for power users and signals product polish.",
  },
  {
    id: "mandatory-survey",
    category: "UX & Growth",
    title: "24-Field Mandatory Signup Survey",
    scenario: "Marketing wants users to fill out their favorite color, annual budget, and mother's maiden name before trying the app.",
    correct: "KILL",
    impact: "Prevented an 80% drop-off wall at the front door.",
    rationale: "Progressive profiling wins over upfront interrogation every single time.",
  },
  {
    id: "gemini-streaming",
    category: "AI & Data",
    title: "Streaming AI Responses",
    scenario: "Stream token output in real-time with sub-200ms TTFB instead of waiting 8s for full response.",
    correct: "SHIP",
    impact: "Perceived latency drops by 75%, user engagement doubles.",
    rationale: "Time-to-first-token is the most critical metric for delightful conversational AI.",
  },
  {
    id: "all-hands-friday",
    category: "Process & Culture",
    title: "Mandatory Friday 4:30 PM Status Meeting",
    scenario: "Manager wants a 90-minute standup right before the weekend to review Jira backlog tickets.",
    correct: "KILL",
    impact: "Team morale restored, engineer turnover dropped to zero.",
    rationale: "Status updates belong in async tools, not Friday evening meeting blocks.",
  },
  {
    id: "keyboard-shortcuts",
    category: "UX & Growth",
    title: "Cmd+K Command Palette & Hotkeys",
    scenario: "Add global search and fast hotkeys for power users navigating dashboards daily.",
    correct: "SHIP",
    impact: "Daily task completion speed improves 3.4x for core users.",
    rationale: "Command bars turn casual users into evangelists who never leave.",
  },
  {
    id: "blockchain-contact",
    category: "Infra & Tech",
    title: "Blockchain-Backed Contact Form",
    scenario: "Store user feedback submissions on an immutable public proof-of-work decentralized ledger.",
    correct: "KILL",
    impact: "Avoided $8.50 gas fees per feedback submission and 12-minute latency.",
    rationale: "Use standard relational or document databases for simple transient form submissions.",
  },
  {
    id: "offline-persistence",
    category: "UX & Growth",
    title: "Optimistic UI & Offline Draft Autosave",
    scenario: "Automatically cache form drafts locally so users never lose written notes on unstable connections.",
    correct: "SHIP",
    impact: "Zero rage-quits from accidental browser tab closures.",
    rationale: "Respecting user-generated content builds deep trust and emotional safety.",
  },
  {
    id: "microservices-for-three",
    category: "Infra & Tech",
    title: "28 Microservices for 50 Daily Active Users",
    scenario: "Split a tiny 3-page monolithic web app into 28 separate microservices across 4 cloud providers.",
    correct: "KILL",
    impact: "Saved $4,000/month in cloud infrastructure and debugging nightmare.",
    rationale: "Do not prematurely distribute before finding product-market fit. Monolith first.",
  },
  {
    id: "automated-data-pipeline",
    category: "AI & Data",
    title: "Automated ETL Pipeline",
    scenario: "Replace daily manual copy-pasting of CSV spreadsheets with scheduled automated pipeline.",
    correct: "SHIP",
    impact: "Saved 20 engineering hours per week and eliminated human data entry errors.",
    rationale: "Automate repetitive data plumbing so teams can focus on high-leverage insights.",
  },
  {
    id: "meeting-about-meetings",
    category: "Process & Culture",
    title: "Pre-Meeting to Plan the Planning Meeting",
    scenario: "Schedule a 45-minute sync to align on the agenda for tomorrow's 60-minute sync.",
    correct: "KILL",
    impact: "Returned 15 working hours across 5 leads each week.",
    rationale: "Write a 3-bullet document instead of blocking calendars for pre-meetings.",
  },
  {
    id: "wcag-accessibility",
    category: "UX & Growth",
    title: "WCAG AA Contrast & Screen Reader Audits",
    scenario: "Ensure color contrast ratios pass 4.5:1 and all interactive buttons have explicit ARIA labels.",
    correct: "SHIP",
    impact: "Unlocked enterprise procurement contracts and welcomed 15% more users.",
    rationale: "Accessible design is universal design. Good contrast benefits everyone.",
  },
  {
    id: "infinite-tabs-discussions",
    category: "Process & Culture",
    title: "3-Week Committee on Tabs vs Spaces",
    scenario: "Halt feature development while teams debate spacing conventions across Slack channels.",
    correct: "KILL",
    impact: "Adopted standard Prettier config in 30 seconds and got back to building.",
    rationale: "Automate code formatting with linters and never debate it in meetings again.",
  },
  {
    id: "latency-alerting",
    category: "Infra & Tech",
    title: "p95 Latency & Error Rate Alerts",
    scenario: "Set up automated Slack alerts when API response times exceed 400ms or 5xx error rate spikes.",
    correct: "SHIP",
    impact: "Caught a memory leak 4 minutes after deployment before any user complained.",
    rationale: "Proactive observability transforms downtime from an emergency into routine triage.",
  },
  {
    id: "build-own-stripe",
    category: "Strategy",
    title: "Build In-House Payment Processing Gateway",
    scenario: "Spend 9 months building custom credit card settlement infrastructure to save 2.9% fees.",
    correct: "KILL",
    impact: "Avoided PCI-DSS compliance audits and massive legal liabilities.",
    rationale: "Focus on your core differentiator. Outsource undifferentiated commodity rails.",
  },
  {
    id: "user-onboarding-walkthrough",
    category: "UX & Growth",
    title: "Interactive Sample Playground on First Load",
    scenario: "Pre-populate new accounts with interactive demo data so the app isn't an empty white canvas.",
    correct: "SHIP",
    impact: "Time-to-aha moment dropped from 14 minutes to 45 seconds.",
    rationale: "Empty states kill momentum. Show users the promised land with guided sample data.",
  },
  {
    id: "force-password-hieroglyphs",
    category: "UX & Growth",
    title: "Bi-Weekly 30-Character Password Rotation",
    scenario: "Force users to reset passwords every 14 days with roman numerals and emoji requirements.",
    correct: "KILL",
    impact: "Users stopped writing passwords on sticky notes attached to monitors.",
    rationale: "NIST guidelines discourage arbitrary rotation; MFA + passkeys provide superior security.",
  },
  {
    id: "mvp-smoke-test",
    category: "Strategy",
    title: "Prototype & Fake Door Validation",
    scenario: "Test demand with a lightweight landing page before investing 6 months of engineering.",
    correct: "SHIP",
    impact: "Discovered 0% customer demand before spending $250k building unwanted software.",
    rationale: "Validate problem-solution fit early with rapid prototypes and clear intent signals.",
  },
  {
    id: "unbounded-sql-queries",
    category: "Infra & Tech",
    title: "SELECT * FROM users With No LIMIT or Index",
    scenario: "Run unrestricted table scans directly on primary production replica during peak hours.",
    correct: "KILL",
    impact: "Prevented database CPU spike from freezing 10,000 active checkout sessions.",
    rationale: "Always paginate queries and index queried filter columns.",
  },
  {
    id: "dogfooding-program",
    category: "Process & Culture",
    title: "Internal Weekly Dogfooding Sessions",
    scenario: "Have the entire product, engineering, and sales team use the latest pre-release build daily.",
    correct: "SHIP",
    impact: "Caught 18 awkward UX snags before customers ever encountered them.",
    rationale: "There is no substitute for building empathy by using your own product every day.",
  },
];

export type PMRank = {
  title: string;
  badge: string;
  tagline: string;
  minScore: number;
  color: string;
};

export const PM_RANKS: PMRank[] = [
  {
    title: "Legendary CPO",
    badge: "👑",
    tagline: "Visionary product instincts. Board members take notes when you speak.",
    minScore: 1800,
    color: "text-amber-400",
  },
  {
    title: "Principal PM",
    badge: "🚀",
    tagline: "Roadmap maestro. Shipped high-impact features with pristine unit economics.",
    minScore: 1200,
    color: "text-accent",
  },
  {
    title: "Senior PM",
    badge: "📈",
    tagline: "Data-driven executor. Ruthlessly killed fluff and kept the team shipping.",
    minScore: 700,
    color: "text-emerald-400",
  },
  {
    title: "Associate PM",
    badge: "🐣",
    tagline: "Solid start! A few questionable Jira tickets, but the runway is intact.",
    minScore: 300,
    color: "text-blue-400",
  },
  {
    title: "Chaos Agent",
    badge: "🌪️",
    tagline: "Shipped AI toasters and Friday hotfixes. The dev team is currently unionizing.",
    minScore: 0,
    color: "text-rose-400",
  },
];

export function getPMRank(score: number): PMRank {
  for (const rank of PM_RANKS) {
    if (score >= rank.minScore) {
      return rank;
    }
  }
  return PM_RANKS[PM_RANKS.length - 1]!;
}
