import type { Project } from "@/types";
import { getProjectThemeOverride } from "@/lib/colorPalettes";

export const projects: Project[] = [
  {
    slug: "ai-chatbot",
    index: "01",
    title: "iOS AI Chatbot",
    category: "AI · Enterprise mobile · 0→1",
    client: "Fortune-50 aerospace & defense manufacturer (anonymised)",
    summary:
      "Taking an enterprise policy chatbot from the desktop web to iOS — a 0→1 native build for a Fortune-50 aerospace and defense manufacturer, shipped against a mock API with synthetic data only.",
    role: "Product Manager — discovery, scope, PRD, delivery governance",
    team: "React Native engineers, design, client engineering leadership",
    timeline: "Nov 2024 — Mar 2025 · 5 months",
    tags: ["LLM assistant", "React Native", "Mock-API delivery", "Security-first"],
    domains: ["AI", "UX", "Strategy", "0→1", "Mobile"],
    theme: {
      accent: "#80deea",
      accentForeground: "#00363a",
      accentLight: "#00838f",
      accentLightForeground: "#ffffff",
      label: "Gunmetal Cyan theme",
    },
    metrics: [
      { value: "5 mo", label: "discovery to lift-and-shift handover" },
      { value: "87%", label: "unit-test coverage held through delivery" },
      { value: "0", label: "production records touched — synthetic data only" },
    ],
    flow: ["Discovery", "Constraints", "Options", "PRD", "Sprints", "Handover"],
    flowCaption: "A contained pilot: reach was the gap, not capability.",
    onePager: [
      { k: "Problem", v: "Policy answers locked to a desktop web app" },
      { k: "Target user", v: "Employees working away from a desk" },
      { k: "Key insight", v: "The backend is proven — reach, not capability, is the gap" },
      { k: "Solution", v: "Thin React Native client on the existing API" },
      { k: "MVP", v: "Chat + responsive UI + reliable errors" },
      { k: "North star", v: "Policy questions resolved in-app per week" },
      { k: "Key risk", v: "Mock-to-live integration surprises at deployment" },
      { k: "Next step", v: "Contained live pilot, measured against the KPI tree" },
    ],
    sections: [
      {
        label: "01",
        kicker: "Business context",
        heading: "A proven assistant that most of the workforce couldn't reach",
        blocks: [
          {
            kind: "text",
            body: [
              "The client is a Fortune-50 aerospace and defense manufacturer — roughly $80B in annual revenue, operations in 40+ countries, and a security-first engineering culture with strict data, network and vendor-access controls.",
              "An AI policy chatbot already existed on the desktop web: employees asked policy questions in plain language and got an answer with a citation. It worked. It just lived on a laptop.",
            ],
          },
          {
            kind: "bullets",
            items: [
              "A large share of the workforce operates away from a desk — plants, labs, travel.",
              "The backend was proven, so the marginal cost of a mobile front-end was small relative to its reach.",
              "Internal momentum behind AI adoption created sponsorship for a fast, contained pilot.",
            ],
          },
          {
            kind: "cards",
            items: [
              {
                icon: "shield",
                title: "Security-first culture",
                body: "Strict data, network and vendor-access controls — no production record ever leaves the client perimeter.",
              },
              {
                icon: "users",
                title: "A desk-less workforce",
                body: "Plants, labs and travel. The people with the most policy questions were furthest from a laptop.",
              },
              {
                icon: "layers",
                title: "A proven backend",
                body: "The assistant already answered well. Reach — not capability — was the gap worth funding.",
              },
            ],
          },
        ],
      },
      {
        label: "02",
        kicker: "Outcome thinking",
        heading: "Business outcome traced back to a single product decision",
        blocks: [
          {
            kind: "chain",
            items: [
              "Less time and support cost on routine policy questions",
              "More questions self-served, wherever employees are",
              "Employees reach for the assistant the moment a question arises",
              "Build a native iOS front-end on the existing backend — not a new bot",
            ],
          },
          {
            kind: "text",
            body: [
              "The decision under test was narrow by design: is a native mobile surface the highest-leverage next investment in an already-working assistant? Everything downstream — scope, metrics, MVP — follows from that framing.",
            ],
          },
        ],
      },
      {
        label: "03",
        kicker: "Customer understanding",
        heading: "Two people had to say yes",
        blocks: [
          {
            kind: "pairs",
            items: [
              {
                k: "Primary · the mobile employee",
                v: "Works across plants, labs and travel. Needs authoritative policy answers at the moment of decision — expense rules, security procedure, HR policy — without opening a laptop or filing a ticket.",
              },
              {
                k: "Sponsor · the engineering leader",
                v: "Empathy-map research showed a leader focused on standards, security and agile delivery — receptive to a contained pilot that proves mobile value without touching production systems.",
              },
            ],
          },
          {
            kind: "quote",
            body:
              "When a policy question blocks me away from my desk, I want to ask in plain language and get a trustworthy answer, so I can act now instead of waiting on a help desk.",
          },
        ],
      },
      {
        label: "04",
        kicker: "Discovery",
        heading: "Constraints surfaced before a line of code",
        blocks: [
          {
            kind: "text",
            body: [
              "Requirements came out of stakeholder workshops and a structured technical questionnaire. Five threads decided the architecture.",
            ],
          },
          {
            kind: "pairs",
            items: [
              { k: "Platform", v: "Which cloud hosts the backend? iOS only, or Android too?" },
              { k: "Identity", v: "Custom or cloud SSO? How do sessions persist on mobile?" },
              { k: "Roles", v: "Do API permissions vary by role, and does that change the UI?" },
              { k: "Native needs", v: "Push, camera, location? Offline history for later reference?" },
              { k: "Observability", v: "Should actions, errors and crash logs flow to the backend?" },
            ],
          },
        ],
      },
      {
        label: "05",
        kicker: "Problem definition",
        heading: "Employees can't get policy answers away from a desk",
        blocks: [
          {
            kind: "text",
            body: [
              "Delayed decisions and help-desk load — because the assistant lives only in a desktop web app.",
            ],
          },
          {
            kind: "pairs",
            items: [
              { k: "Who", v: "All badge-holding employees" },
              { k: "When", v: "Plants, labs, travel — off-desk moments" },
              { k: "Severity", v: "Hypothesis — no usage analytics were shared" },
            ],
          },
        ],
      },
      {
        label: "06",
        kicker: "Operating reality",
        heading: "Every constraint became a design principle",
        blocks: [
          {
            kind: "pairs",
            items: [
              {
                k: "No production data may leave the client",
                v: "Synthetic data only — realistic simulated conversations for all dev and test.",
              },
              {
                k: "No direct access to the live backend",
                v: "Spec-first contract — build against a documented mock API.",
              },
              {
                k: "Client deploys inside its own perimeter",
                v: "Lift-and-shift package — repo, docs and runbooks ready to drop in.",
              },
              {
                k: "Client code standards: typing, linting, review",
                v: "Thin client — minimal front-end logic; capability stays behind the API.",
              },
            ],
          },
        ],
      },
      {
        label: "07",
        kicker: "Solution exploration",
        heading: "Three options, one selected",
        blocks: [
          {
            kind: "options",
            caption:
              "Chosen for native feel at web-team velocity — the constraint that actually mattered was iteration speed inside a fixed Nov–Mar window.",
            items: [
              {
                title: "Mobile web / PWA",
                body: "Fastest to ship and reuses the web app wholesale.",
                note: "Rejected — no app-store presence, limited native capability, second-class on iPad.",
              },
              {
                title: "React Native + TypeScript",
                body: "Native experience with one language across the stack. Reuses the web app's CSS as JS style objects and pairs with Jest + Detox for the test depth the client required.",
                note: "Selected — native fidelity at sprint-speed iteration.",
                selected: true,
              },
              {
                title: "Native Swift",
                body: "Best platform fidelity and full access to iOS capability.",
                note: "Rejected — overweight for a thin chat client: slower iteration, no style reuse, scarcer skills.",
              },
            ],
          },
          {
            kind: "arch",
            caption:
              "Everything left of the perimeter line is ours; everything right of it already existed. The app is a thin, well-tested client on a proven backend.",
            layers: [
              {
                label: "Experience layer — React Native (iOS)",
                items: ["Chat surface", "Responsive iPhone / iPad layouts", "Light & dark themes", "On-device history"],
                note: "Styling ported from the web app as JS style objects — one visual language, two platforms.",
              },
              {
                label: "App services",
                items: ["Auth handler (SSO-ready)", "Session state", "Error & retry policy", "Action / crash logging hooks"],
                note: "Server-supplied error messages surface verbatim — no invented copy in a compliance context.",
              },
              {
                label: "Integration — client perimeter",
                items: ["Mock API (delivery)", "Policy assistant API (live)", "Enterprise SSO"],
                note: "Built against mocks with synthetic data only; the live swap is a configuration change, not a rewrite.",
              },
              {
                label: "Existing backend (client-owned)",
                items: ["Policy knowledge base", "Retrieval + LLM answer service", "Audit log"],
              },
            ],
          },
          {
            kind: "screens",
            note: "Product experience — the three states that carry the whole product",
            items: [
              {
                title: "Ask",
                lines: [
                  { who: "user", text: "How many carry-forward leaves do I have?" },
                  { who: "bot", text: "You can carry forward up to 15 days. Here's the policy clause." },
                ],
                caption: "Plain-language question, sourced answer — no menu tree to learn.",
              },
              {
                title: "Follow up",
                lines: [
                  { who: "user", text: "And if I leave mid-year?" },
                  { who: "bot", text: "Unused days are encashed pro-rata at exit." },
                  { who: "system", text: "Context retained within session" },
                ],
                caption: "Threaded context means the second question costs nothing.",
              },
              {
                title: "Fail well",
                lines: [
                  { who: "user", text: "Show my payslip policy" },
                  { who: "system", text: "Service unavailable — server message shown verbatim" },
                  { who: "bot", text: "Retry" },
                ],
                caption: "Errors are honest and recoverable — the guardrail a compliance audience checks first.",
              },
            ],
          },
        ],
      },
      {
        label: "08",
        kicker: "Scope",
        heading: "MVP: chat, responsiveness, and reliability",
        blocks: [
          {
            kind: "moscow",
            caption: "MoSCoW, decided once and defended for the whole engagement.",
            groups: [
              {
                label: "Must",
                items: [
                  "Plain-language chat with the policy backend",
                  "iPhone + iPad responsive UI",
                  "Server-supplied error messaging",
                  "Security-standard auth handling",
                ],
              },
              {
                label: "Should",
                items: [
                  "Light / dark themes matching web styling",
                  "On-device chat history",
                  "Action, error and crash logging hooks",
                ],
              },
              {
                label: "Could",
                items: ["Push notifications", "Voice input", "Saved and pinned answers"],
              },
              {
                label: "Not now",
                items: ["Android build", "New backend capability", "Production data integration"],
              },
            ],
          },
          {
            kind: "text",
            body: [
              "This cut is sufficient because the core hypothesis — a native surface changes when and how often employees ask — is testable with chat, responsiveness and reliability alone.",
            ],
          },
          {
            kind: "quote",
            body:
              "Acceptance criterion: GIVEN the backend returns an error payload, WHEN a message fails to send, THEN the app displays the server-provided message with a retry path.",
          },
        ],
      },
      {
        label: "09",
        kicker: "Execution & quality",
        heading: "Two-week RAD loop, tests before code",
        blocks: [
          {
            kind: "loop",
            caption:
              "Delivery model: two-week RAD loops with joint UAT at the end of every loop — the client never waited for a big reveal.",
            items: ["Write tests", "Develop", "Integrate (Detox E2E)", "Joint UAT"],
          },
          {
            kind: "planactual",
            months: ["Nov", "Dec", "Jan", "Feb", "Mar"],
            caption: "Design ran hot into January; build absorbed it without moving the March handover.",
            items: [
              { phase: "Requirements", planned: [0, 1.5], actual: [0, 1.8] },
              { phase: "Design", planned: [1.5, 2.5], actual: [1.6, 3] },
              { phase: "Build & continuous UAT", planned: [2.5, 4], actual: [2.8, 4.2] },
              { phase: "Docs, runbooks & handover", planned: [4, 5], actual: [4.2, 5] },
            ],
          },
          {
            kind: "phases",
            items: [
              { when: "Nov – Dec", what: "Requirements", detail: "Workshops, technical questionnaire, constraint mapping" },
              { when: "Dec – Jan", what: "Design", detail: "IA, chat patterns, light/dark parity with web styling" },
              { when: "Jan – Feb", what: "Build & UAT", detail: "Two-week RAD loops, tests before code, continuous UAT" },
              { when: "Feb – Mar", what: "Handover", detail: "Docs, runbooks, repo transfer for in-perimeter deployment" },
            ],
          },
          {
            kind: "bars",
            title: "Quality gates held through delivery",
            unit: "%",
            max: 100,
            items: [
              { label: "Unit-test coverage", value: 87, note: "floor, enforced in CI", highlight: true },
              { label: "Crash-free sessions (guardrail)", value: 99, note: "target" },
              { label: "Production data used", value: 0, note: "synthetic only" },
            ],
          },
          {
            kind: "bullets",
            items: [
              "Nov–Dec requirements · Dec–Jan design · Jan–Feb build and continuous UAT · Feb–Mar docs, runbooks and repo transfer.",
              "87% unit-test coverage held through delivery; CI/CD gated every change on the full suite.",
              "Scope changes ran through a written SOP: intake → impact estimate → single budget-owner approval → scheduled or deferred.",
            ],
          },
        ],
      },
      {
        label: "10",
        kicker: "Measurement",
        heading: "The KPI tree I'd hold it to",
        blocks: [
          {
            kind: "kpitree",
            north: "Policy questions resolved in-app per week",
            northNote: "One number that only moves if employees ask, get an answer, and stop escalating.",
            tiers: [
              {
                label: "Primary",
                items: ["Weekly active mobile users of the assistant", "Repeat-use rate week over week"],
              },
              {
                label: "Supporting — experience",
                items: ["Session task-success rate", "Answers per session", "Time-to-answer"],
              },
              {
                label: "Business",
                items: ["Help-desk tickets on policy topics", "Resolution wait time"],
              },
              {
                label: "Adoption quality",
                items: ["Share of sessions off-desk", "iPad vs iPhone split"],
              },
            ],
            guardrails: [
              "Crash-free sessions ≥ 99%",
              "Answer-quality complaints flat vs web",
              "P95 latency at web parity",
              "Zero production data in test environments",
            ],
          },
        ],
      },
      {
        label: "11",
        kicker: "Impact & next",
        heading: "Delivered on time, in scope, ready to lift and shift",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Fully responsive native app across iPhone and iPad, light and dark, verified end-to-end against mock APIs.",
              "Automated unit + E2E suite with a runbook so the client's team runs everything independently.",
              "Delivered inside the contracted Nov–Mar window, packaged for deployment inside the client perimeter.",
              "Next: swap the mock for the live API and wire SSO, then pilot with a contained employee group; then configuration-over-code reuse; then push, voice and offline — each gated on pilot evidence.",
            ],
          },
          {
            kind: "text",
            body: [
              "Illustrative: if even 10% of desk-bound sessions shift to off-desk moments, each avoided help-desk ticket saves an estimated 15–30 minutes of employee wait time. Assumption — no client usage analytics were shared.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "marketing-mix-models",
    index: "02",
    title: "Marketing Mix Model",
    category: "Data science · Optimisation · Self-serve product",
    client: "Top-3 Latin American retailer (anonymised)",
    summary:
      "Building a media mix model and a self-serve optimisation product for a leading Latin American retailer — turning a $198M quarterly media budget into a measurable, optimisable system.",
    role: "Product Manager — problem framing, scope, consumption layer, metrics",
    team: "Data scientists, visualisation engineers, client media planners",
    timeline: "Q4 2023 modelling window · multi-quarter delivery",
    tags: ["Bayesian MMM", "Adstock & saturation", "Budget optimiser", "Scenario simulation"],
    domains: ["AI", "Data", "Strategy", "Optimization", "Enterprise"],
    theme: {
      accent: "#6ee7b7",
      accentForeground: "#022c22",
      accentLight: "#059669",
      accentLightForeground: "#ffffff",
      label: "Keppel (Mint Emerald theme)",
    },
    metrics: [
      { value: "90%", label: "model accuracy on 3 years of weekly spend & sales" },
      { value: "+6% / +4%", label: "incremental sales at zero extra budget (two banners)" },
      { value: "21.0 → 22.3", label: "overall RoAS, value banner, same $198.3M budget" },
    ],
    flow: ["Baseline", "Attribution", "Optimisation", "Simulation", "Consumption"],
    flowCaption: "Consumption is a stage of the system, not an afterthought.",
    onePager: [
      { k: "Problem", v: "Nine-figure budgets allocated with no causal read on what drives sales" },
      { k: "Method", v: "Bayesian MMM with baseline, adstock and saturation, plus MTA for digital" },
      { k: "Key insight", v: "Channels sit on opposite sides of saturation — reallocate before spending more" },
      { k: "Product", v: "A planning surface: simulate, optimise, explain" },
      { k: "Impact", v: "+6% and +4% incremental sales at constant budget" },
      { k: "Key risks", v: "Observational causality · model drift · enterprise deployment as critical path" },
      { k: "North star", v: "Incremental sales per peso of media spend, at constant budget" },
      { k: "Next step", v: "Production deployment, automated retraining, in-market validation" },
    ],
    sections: [
      {
        label: "01",
        kicker: "Business context",
        heading: "A media budget the size of a mid-cap company",
        blocks: [
          {
            kind: "text",
            body: [
              "The client runs two banners: a value-focused, high-frequency grocery chain and a membership warehouse club. Both invest across open-air TV, pay TV, radio, out-of-home and digital — all of it aimed at in-store traffic.",
            ],
          },
          {
            kind: "stats",
            items: [
              { value: "$198.3M", label: "Q4 2023 media budget, value banner" },
              { value: "$77.6B", label: "quarterly sales the media has to move" },
              { value: "5", label: "channels competing for the same peso" },
            ],
          },
          {
            kind: "donut",
            title: "Where the $198.3M went — by precedent, not by return",
            items: [
              { label: "Open-air TV", value: 41 },
              { label: "Digital", value: 24 },
              { label: "Radio", value: 15 },
              { label: "Pay TV", value: 12 },
              { label: "Out-of-home", value: 8 },
            ],
          },
          {
            kind: "text",
            body: [
              "At that scale a single percentage point of allocation efficiency is worth tens of millions. Yet budgets were set by precedent and negotiation, with no quantified view of what each channel returned.",
            ],
          },
          {
            kind: "pipeline",
            stages: [
              { label: "Business outcome", body: "Grow in-store sales without growing the budget." },
              { label: "Channel decision", body: "Which channel gets the next peso." },
              { label: "Media exposure", body: "Reach, frequency, carryover into later weeks." },
              { label: "User behaviour", body: "Store visit, basket, repeat trip." },
              { label: "Measured sales", body: "Incremental sales, separated from baseline." },
            ],
            loop: "From business outcome to user behaviour and back: the model only earns its place if it can trace a budget decision all the way to a shopper action and then back to the P&L.",
          },
        ],
      },
      {
        label: "02",
        kicker: "Problem & root cause",
        heading: "Three effects make naive spend-to-sales reads wrong",
        blocks: [
          {
            kind: "pairs",
            items: [
              {
                k: "Baseline confound",
                v: "Total sales mix organic demand with media effects. Without extracting the baseline, every campaign 'works'.",
              },
              {
                k: "Carryover effects",
                v: "Media impact persists beyond the week of spend. Weekly reads misattribute sales across weeks and channels.",
              },
              {
                k: "Diminishing returns",
                v: "Each channel saturates: past a spend threshold marginal RoAS approaches zero — invisible without a response curve.",
              },
            ],
          },
          {
            kind: "text",
            body: [
              "Consequence: channels funded past their saturation point while others sit underfunded, and budget decisions defended by precedent rather than marginal return. Kickoff hypothesis — the optimal mix differs enough from the actual mix to justify the modelling investment.",
            ],
          },
        ],
      },
      {
        label: "03",
        kicker: "Vocabulary",
        heading: "Five terms that carry the whole case",
        blocks: [
          {
            kind: "table",
            title: "Shared language before shared decisions",
            columns: ["Term", "What it means", "Why the client cared"],
            caption:
              "Every planning argument in the first two weeks was really a vocabulary argument. This table ended them.",
            rows: [
              {
                cells: [
                  "Baseline sales",
                  "Expected sales with no marketing influence",
                  "The counterfactual every media claim must beat",
                ],
              },
              {
                cells: [
                  "Incremental sales",
                  "Revenue generated as a direct result of marketing",
                  "The model's core output — and the number the CFO reads",
                ],
                highlight: true,
              },
              {
                cells: ["RoAS", "Revenue returned per dollar of ad spend", "The one comparable currency across channels"],
              },
              {
                cells: [
                  "Saturation point",
                  "Weekly spend level where marginal RoAS nears zero",
                  "Spending past it is measurable waste",
                ],
                highlight: true,
              },
              {
                cells: [
                  "Carryover / adstock",
                  "Effects that persist beyond the week of spend",
                  "Puts attribution in the right week and the right channel",
                ],
              },
            ],
          },
        ],
      },
      {
        label: "04",
        kicker: "Approach",
        heading: "Not a model — a consumption loop",
        blocks: [
          {
            kind: "pipeline",
            loop: "Consumption feeds back: every simulation planners run becomes a logged scenario, which sharpens the next quarter's priors.",
            stages: [
              { label: "Baseline", body: "Strip out what would have sold anyway." },
              { label: "Attribution", body: "Incremental sales per channel, per week." },
              { label: "Optimisation", body: "Reallocate to maximise RoAS at constant budget." },
              { label: "Simulation", body: "What-if scenarios planners run themselves." },
              { label: "Consumption", body: "A planning surface, not a PDF." },
            ],
          },
          {
            kind: "steps",
            caption:
              "Seven steps, run in order. Steps 6 and 7 are the ones most MMM engagements skip — and the reason most MMM engagements change nothing.",
            items: [
              {
                title: "Exploratory data analysis",
                body: "Three years of weekly offline, digital, click, price-gap and competitor spend against in-store sales.",
              },
              {
                title: "Analytical dataset",
                body: "Harmonise banners, calendars and currencies into one modelling table; engineer economic-factor features.",
              },
              {
                title: "Filter insignificant media",
                body: "Drop channels with no measurable signal rather than letting them borrow credit from the rest.",
              },
              {
                title: "OLS + PCA baseline",
                body: "Establish the spend–sales relationship and handle collinearity between channels that always move together.",
              },
              {
                title: "Bayesian MMM",
                body: "Model saturation, adstock and diminishing returns with priors from the OLS stage — 90% accuracy on held-out weeks.",
              },
              {
                title: "Optimisation",
                body: "Attribute incremental sales per channel, then reallocate the same budget to maximise RoAS.",
              },
              {
                title: "Consumption product",
                body: "Historical actuals, analysis and an embedded optimiser in a web app so planners run scenarios without an analyst.",
              },
            ],
          },
          {
            kind: "attribution",
            journey: ["Display", "Paid search", "Email", "Direct", "Purchase"],
            caption:
              "MMM answers 'how much did this channel contribute in aggregate'. MTA answers 'which touch moved this journey'. We ran both: MMM sets the budget envelope, MTA settles the digital argument inside it.",
            models: [
              { label: "Last touch — the incumbent view", shares: [0, 0, 0, 100] },
              { label: "First touch", shares: [100, 0, 0, 0] },
              { label: "Linear", shares: [25, 25, 25, 25] },
              { label: "Data-driven MTA — adopted", shares: [34, 29, 22, 15], selected: true },
            ],
          },
          {
            kind: "text",
            body: [
              "The deliberate product decision: scope self-serve consumption as a stage of the system, equal to the modelling itself. A model that only an analyst can run changes nothing about how budgets get set.",
            ],
          },
        ],
      },
      {
        label: "05",
        kicker: "Why this model",
        heading: "Why Bayesian MMM — and not rules or click-path analytics",
        blocks: [
          {
            kind: "pairs",
            items: [
              {
                k: "Static rules",
                v: "Cannot express latent decomposition or non-linear channel response. Rejected.",
              },
              {
                k: "Click-path attribution alone",
                v: "Blind to offline media — TV, radio and OOH carry most of the spend. Rejected as the primary method.",
              },
              {
                k: "Bayesian MMM",
                v: "Estimates baseline, adstock and saturation from observational data — exactly the structure the optimisation step needs.",
              },
            ],
          },
          {
            kind: "text",
            body: [
              "Complement, not competitor: a multi-touch attribution track on the client's web analytics stack gives touchpoint-level credit for digital journeys — last touch, first touch, linear, U-shaped and inverse-J compared side by side over a 14-day lookback. The MMM sees offline media MTA can't; MTA sees journey detail the MMM can't.",
            ],
          },
        ],
      },
      {
        label: "06",
        kicker: "The product",
        heading: "A planning surface, not a report",
        blocks: [
          {
            kind: "pairs",
            items: [
              {
                k: "Simulate",
                v: "Pick a banner, timeframe and budget; see actual mix, incremental sales and channel RoAS instantly.",
              },
              {
                k: "Optimise",
                v: "One action produces the reallocated mix that maximises RoAS and incremental sales under the same budget.",
              },
              {
                k: "Explain",
                v: "Per-channel saturation curves make every reallocation legible — the model justifies itself at the point of decision.",
              },
            ],
          },
          {
            kind: "moscow",
            groups: [
              {
                label: "Must",
                items: [
                  "Actuals view by banner and week",
                  "Budget optimiser",
                  "±budget scenario simulation",
                  "Channel RoAS & saturation curves",
                ],
              },
              { label: "Should", items: ["Multi-banner support", "Historical comparisons"] },
              { label: "Could", items: ["Scenario sharing", "Planner annotations"] },
              {
                label: "Not now",
                items: ["Automated retraining", "Deep-learning variants", "Cross-country rollout"],
              },
            ],
          },
          {
            kind: "arch",
            caption:
              "Tech stack: the optimiser is embedded in the app, not exported to it. Planners never see a notebook.",
            layers: [
              {
                label: "Sources",
                items: ["Weekly media spend", "POS in-store sales", "Price gap & promo calendar", "Competitor spend", "Digital click logs"],
              },
              {
                label: "Data layer",
                items: ["Cloud warehouse", "Weekly ETL", "Analytical dataset (3 yrs × banner × channel)"],
                note: "One modelling table, versioned — every published number is reproducible.",
              },
              {
                label: "Modelling",
                items: ["Python", "OLS + PCA", "Bayesian MMM (adstock, saturation)", "MTA for digital", "Constrained optimiser"],
              },
              {
                label: "Consumption",
                items: ["Web planning app", "Embedded optimiser API", "Scenario store", "Visualisation layer"],
                note: "Simulate → optimise → explain, in the same surface where budgets are actually set.",
              },
            ],
          },
        ],
      },
      {
        label: "07",
        kicker: "Impact",
        heading: "Same budget. More sales.",
        blocks: [
          {
            kind: "stats",
            items: [
              { value: "4.17B → 4.41B", label: "value banner incremental sales (+245M)" },
              { value: "3.72B → 3.87B", label: "club banner incremental sales (+4%)" },
              { value: "$198.3M", label: "Q4 2023 budget held constant" },
            ],
          },
          {
            kind: "compare",
            title: "Value banner — same budget, reallocated",
            items: [
              { label: "Incremental sales", before: "4.17B", after: "4.41B", delta: "+245M" },
              { label: "Overall RoAS", before: "21.01", after: "22.25", delta: "+1.24" },
              { label: "Open-air TV RoAS", before: "19.31", after: "30.18", delta: "+10.87" },
              { label: "In-store digital spend", before: "baseline", after: "+$24.25M", delta: "funded up" },
              { label: "Out-of-home spend", before: "baseline", after: "+$8.42M", delta: "funded up" },
            ],
          },
          {
            kind: "bars",
            title: "Weekly saturation point by channel — value banner",
            unit: "M / week",
            max: 8,
            items: [
              { label: "Open-air TV", value: 7.5, highlight: true },
              { label: "Digital", value: 5 },
              { label: "Radio", value: 5 },
              { label: "Out-of-home", value: 1 },
            ],
          },
          {
            kind: "text",
            body: [
              "Where the money moved, value banner: open-air TV pulled back toward its saturation point — its RoAS rises from 19.31 to 30.18 as low-marginal-return spend is cut — while in-store digital (+$24.25M) and out-of-home (+$8.42M), which still have headroom, are funded up. Overall RoAS 21.01 → 22.25.",
              "Weekly saturation points, value banner: TV ~7.5M · digital ~5M · radio ~5M · OOH ~1M. Club banner: TV ~10M · digital ~4M · pay TV ~4M · radio ~6M · OOH ~1.5M.",
            ],
          },
        ],
      },
      {
        label: "08",
        kicker: "Simulations",
        heading: "Diminishing returns, quantified",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Value banner, Dec '23 — marginal return collapses: $60M more spend past +20% buys only 0.06B more incremental sales.",
              "Club banner, Dec '23 — RoAS stays above 26 even at +50% budget. Growth money belongs here, not deeper in the value banner.",
            ],
          },
          {
            kind: "curve",
            title: "Response curve — value banner, Dec '23",
            xLabel: "Media spend →",
            yLabel: "Incremental sales →",
            points: [0, 22, 41, 57, 70, 80, 87, 92, 95, 97, 98],
            markerIndex: 7,
            markerLabel: "Saturation — $60M more buys 0.06B",
            caption: "Past the marked point, every extra dollar buys progressively less. That is the whole argument for reallocation over escalation.",
          },
        ],
      },
      {
        label: "09",
        kicker: "Metrics",
        heading: "KPI tree",
        blocks: [
          {
            kind: "kpitree",
            north: "Incremental sales per peso of media spend, at constant budget",
            northNote: "Constant budget is deliberate — it removes the easiest way to fake progress.",
            tiers: [
              {
                label: "Primary — does the model work",
                items: ["Model accuracy (90% achieved)", "Optimised vs actual incremental-sales uplift per banner"],
              },
              {
                label: "Primary — does the product work",
                items: ["Share of planning cycles run through the app", "Scenarios simulated per planner per quarter"],
              },
              {
                label: "Secondary",
                items: ["Incremental traffic", "Channel-level RoAS", "Forecast error vs realised sales"],
              },
              {
                label: "Adoption",
                items: ["Planners active without analyst support", "Time from question to answer"],
              },
            ],
            guardrails: [
              "No channel funded past saturation",
              "Total budget conserved in optimisation",
              "Retraining cadence so accuracy doesn't decay",
              "Every recommendation traceable to a curve",
            ],
          },
        ],
      },
      {
        label: "10",
        kicker: "Risks & honesty",
        heading: "What could make this wrong",
        blocks: [
          {
            kind: "pairs",
            items: [
              {
                k: "Correlation ≠ causation",
                v: "MMM is observational. The +6% / +4% uplifts stay a hypothesis until validated with staged rollouts or geo-tests.",
              },
              {
                k: "Model trust",
                v: "A 90%-accurate model moving ~$30M between channels invites scrutiny. Mitigation: saturation curves and per-channel explanations inside the app.",
              },
              {
                k: "Regime change",
                v: "Pricing, competitor spend and macro shifts can invalidate learned response curves — hence the retraining roadmap.",
              },
              {
                k: "Optimising to the model",
                v: "Chasing modelled RoAS alone may undervalue TV's long-horizon brand effects. The MTA track gives a second, independent read.",
              },
            ],
          },
          {
            kind: "text",
            body: [
              "Execution lesson: the plan slipped roughly two quarters, concentrated in data access and governed-cloud onboarding. Data access and platform onboarding — not modelling — were the critical path.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "membership-360",
    index: "03",
    title: "Membership 360",
    category: "Loyalty · Personalisation · Platform strategy",
    client: "Fortune-5 US membership warehouse club (anonymised)",
    summary:
      "Rebuilding engagement and lifecycle value for a US membership warehouse club by unifying member context across every D2C touchpoint.",
    role: "Product Manager — teardown, problem definition, strategy, MVP scope",
    team: "Data science, CRM, contact-centre ops, design",
    timeline: "Strategy & discovery engagement",
    tags: ["Member graph", "Next-best-action", "Personalisation", "Renewal economics"],
    domains: ["UX", "Strategy", "Data", "Loyalty", "Growth"],
    theme: {
      accent: "#93c5fd",
      accentForeground: "#031426",
      accentLight: "#2563eb",
      accentLightForeground: "#ffffff",
      label: "Sapphire Blue (Membership 360 theme)",
    },
    metrics: [
      { value: "~$16M", label: "annual fee income unlocked per +1pt renewal" },
      { value: "29.7M", label: "memberships in the addressable base" },
      { value: "25%", label: "growth in online — the fastest-growing channel to personalise" },
    ],
    flow: ["Teardown", "Root cause", "Member graph", "Triggers", "Next best action"],
    flowCaption: "Renewal is the outcome; visible value between renewals is the lever.",
    onePager: [
      { k: "Problem", v: "Digital engagement falling among the highest-value members" },
      { k: "Root cause", v: "No unified member context — every system holds a partial picture" },
      { k: "Insight", v: "Two cohorts with the same card behave in opposite ways" },
      { k: "Solution", v: "Member graph + insight console + next-best-action service" },
      { k: "MVP", v: "Two cohorts, app home + email, holdout group, full instrumentation" },
      { k: "North star", v: "Monthly engaged members" },
      { k: "Key risk", v: "Personalisation without governance; cold start and stale signals" },
      { k: "Next step", v: "Instrumented pilot against the holdout before widening surfaces" },
    ],
    sections: [
      {
        label: "01",
        kicker: "Business context",
        heading: "The business runs on renewal, not transactions",
        blocks: [
          {
            kind: "text",
            body: [
              "A warehouse club sells access. The annual fee is the profit pool; merchandise runs on thin margins to justify that fee.",
              "A member who stops engaging doesn't churn today — they quietly fail to renew months later. Engagement is the leading indicator the business can still act on. Memberships grow ~7% a year in every region, and online is the fastest-growing channel at 25% — growth that masks the engagement problem underneath.",
            ],
          },
          {
            kind: "cards",
            items: [
              {
                icon: "trending",
                title: "Growth is real",
                body: "Memberships up ~7% a year in every region, with online growing 25% — the surface with the most personalisation headroom.",
              },
              {
                icon: "target",
                title: "Fees are the profit pool",
                body: "~29.7M memberships. Every +1pt of renewal is worth roughly $16M a year in fee income alone.",
              },
              {
                icon: "gauge",
                title: "Engagement is the early warning",
                body: "Lapsed engagement shows up months before a non-renewal — which is exactly why it is worth instrumenting.",
              },
            ],
          },
          {
            kind: "bars",
            title: "Signals to reverse — diagnostic, not headline KPIs",
            unit: "% YoY change",
            max: 40,
            items: [
              { label: "Scan & Go usage, high-value members", value: 32, note: "declining — the lever to recover", highlight: true },
              { label: "Co-brand card penetration", value: 14, note: "declining — benefit under-use" },
            ],
          },
        ],
      },
      {
        label: "02",
        kicker: "Executive summary",
        heading: "The case in four boxes",
        blocks: [
          {
            kind: "pairs",
            items: [
              {
                k: "Problem",
                v: "Membership grows ~7% a year, yet digital engagement among high-value members is falling — Scan & Go usage down 32%, co-brand card penetration down 14% YoY.",
              },
              {
                k: "Insight",
                v: "Members with the same card behave in opposite ways, but every touchpoint treats them identically because member context is fragmented across systems.",
              },
              {
                k: "Recommendation",
                v: "Membership 360 — a unified member graph feeding an internal insight console and a next-best-action service that turns loyalty triggers into timely product moments.",
              },
              {
                k: "Expected impact",
                v: "Every +1pt of renewal on ~29.7M memberships is worth roughly $16M a year in fee income alone, before any basket or benefit-adoption effects.",
              },
            ],
          },
        ],
      },
      {
        label: "03",
        kicker: "Teardown",
        heading: "The experience is fragmented across the lifecycle",
        blocks: [
          {
            kind: "pairs",
            items: [
              {
                k: "Discover",
                v: "App, web and email surface generic content — the same homepage for a 5-year bulk buyer and a lapsing member.",
              },
              {
                k: "Evaluate",
                v: "Paid benefits — fuel, pharmacy, services, credit card — are catalogued, not recommended. Members must already know what to look for.",
              },
              {
                k: "Transact",
                v: "In-club, curbside and online carts are separate identities; a mission started in one channel dead-ends in the next.",
              },
              {
                k: "Get help",
                v: "Contact-centre agents see transactions, not context — one cohort calls constantly and repeats itself every time.",
              },
              {
                k: "Renew",
                v: "Renewal is a billing event, not a value moment — no summary of what the membership earned the household this year.",
              },
            ],
          },
          {
            kind: "text",
            body: [
              "Findings come from journey-mapping the live experience; no funnel instrumentation was provided, so these are flagged as observations and hypotheses.",
            ],
          },
        ],
      },
      {
        label: "04",
        kicker: "Problem definition",
        heading: "Fragmented member data is the root cause",
        blocks: [
          {
            kind: "chain",
            items: [
              "Symptom — falling adoption of the features that drive stickiness",
              "Problem — members can't discover the products and benefits relevant to their mission",
              "Contributing — channel-specific identities, catalogue-style benefit pages, no cross-channel recovery",
              "Root cause — no unified member context; every surface defaults to generic",
            ],
          },
          {
            kind: "quote",
            body:
              "High-value members struggle to discover relevant products and benefits across D2C touchpoints, resulting in declining digital engagement and renewal risk, because member context is fragmented across systems.",
          },
        ],
      },
      {
        label: "05",
        kicker: "Target member",
        heading: "Sarah — the member the club must keep",
        blocks: [
          {
            kind: "persona",
            name: "Sarah",
            tagline: "Runs a two-child household on a plan. Buys in bulk, decides fast, forgives slowly.",
            meta: [
              "36 · married, two children",
              "~$100K household income",
              "5.5 years average tenure",
              "Suburban, drives to club",
              "Shops app-first, collects in store",
            ],
            quote:
              "The more I save on things I need, the more money I have to pour into my family and loved ones.",
            stats: [
              { value: "85%", label: "also hold a competing subscription — Prime, Walmart+, DoorDash Pass, Instacart Express" },
              { value: "5.5 yrs", label: "average tenure — long enough to have expectations" },
              { value: "77%", label: "of her basket is groceries, fresh and consumables" },
            ],
            basket: [
              { label: "Groceries", value: 31 },
              { label: "Fresh", value: 30 },
              { label: "General merch", value: 16 },
              { label: "Consumables", value: 13 },
              { label: "Other", value: 10 },
            ],
            missions: ["Household stock-up", "Meal planning", "Hosting", "Community events"],
            flag:
              "Renewal drivers are drifting from low price toward convenience, guarantees and trust — the exact dimensions the subscription she already pays for wins on today.",
          },
        ],
      },
      {
        label: "06",
        kicker: "The insight",
        heading: "Same card, very different members",
        blocks: [
          {
            kind: "pairs",
            items: [
              { k: "Contact-centre interactions", v: "Cohort 1: very high · Cohort 2: almost none" },
              { k: "Co-brand credit card", v: "Cohort 1: ~93% hold one · Cohort 2: ~21%" },
              { k: "Health & consumables", v: "Cohort 1: core basket · Cohort 2: almost none" },
              { k: "Grocery & fresh", v: "Cohort 2: ~45% of visits" },
              { k: "Fuel", v: "Cohort 2: ~70% of visits" },
            ],
          },
          {
            kind: "cohorts",
            a: "Cohort 1 — service-heavy",
            b: "Cohort 2 — self-serve",
            items: [
              { label: "Co-brand card held", a: 93, b: 21 },
              { label: "Contact-centre interactions", a: 88, b: 6 },
              { label: "Health & consumables in basket", a: 74, b: 8 },
              { label: "Grocery & fresh share of visits", a: 22, b: 45 },
              { label: "Fuel share of visits", a: 18, b: 70 },
            ],
          },
          {
            kind: "text",
            body: [
              "Today both cohorts get the same homepage, the same email and the same agent script. That is the personalisation case in one exhibit.",
            ],
          },
        ],
      },
      {
        label: "07",
        kicker: "Strategy",
        heading: "Loyalty triggers become product moments",
        blocks: [
          {
            kind: "pairs",
            items: [
              {
                k: "Renewal window — 90 days to expiry",
                v: "A personal 'what your membership earned you' value recap, in app and email. Benefit-first, not promo-first.",
              },
              {
                k: "Mission cadence — stock-up cycle due",
                v: "A pre-built reorder basket and a mission-specific homepage rail. Right-time beats real-time.",
              },
              {
                k: "Feature lapse — Scan & Go unused 60 days",
                v: "A one-tap re-entry at the moment of arrival at the club, not a generic push.",
              },
              {
                k: "Benefit under-use — high fuel, no card",
                v: "Card pitch quantified against the member's own fuel spend, at the pump and in app.",
              },
            ],
          },
        ],
      },
      {
        label: "08",
        kicker: "Recommended solution",
        heading: "One member graph, three capabilities",
        blocks: [
          {
            kind: "pairs",
            items: [
              {
                k: "Member graph",
                v: "Purchases, missions, channel usage, benefits and contact history resolved to a single member and household.",
              },
              {
                k: "Insight console",
                v: "Cohort explorer, member profile and knowledge graph for merchandising, marketing and contact-centre agents.",
              },
              {
                k: "Next-best-action service",
                v: "One API ranking the right moment for each member, consumed by app home, web, email and the agent desktop.",
              },
            ],
          },
          {
            kind: "graph",
            center: "Member graph",
            caption:
              "One member, one resolved identity, seven signal families. Today each of these lives in a different system — which is exactly why the homepage can't tell Cohort 1 from Cohort 2.",
            nodes: [
              { label: "Household", hint: "identity & members" },
              { label: "Purchases", hint: "basket, cadence, banner" },
              { label: "Missions", hint: "stock-up, hosting" },
              { label: "Channels", hint: "app, web, club, fuel" },
              { label: "Benefits", hint: "card, Scan & Go, fuel" },
              { label: "Service", hint: "contact-centre history" },
              { label: "Lifecycle", hint: "tenure, renewal date" },
            ],
          },
          {
            kind: "pipeline",
            stages: [
              { label: "Signals", body: "Transactions, app events, service contacts." },
              { label: "Member graph", body: "Resolved to member and household, with a feature store." },
              { label: "Eligibility", body: "Caps, opt-outs, sensitive-attribute exclusions." },
              { label: "Ranking", body: "Many candidate moments, one slot." },
              { label: "Touchpoints", body: "App home, web, email, agent desktop." },
            ],
            loop: "Every impression, tap and dismissal flows back: dismissals down-rank a trigger for that member, conversions promote it for the cohort.",
          },
          {
            kind: "text",
            body: [
              "Eligibility rules sit before the models — frequency caps, opt-outs, no sensitive attributes, editorial fallback content. Governance is structural, not an afterthought. Every impression, tap and dismissal flows back into the graph: dismissals down-rank a trigger for that member, conversions promote it for the cohort.",
            ],
          },
        ],
      },
      {
        label: "09",
        kicker: "AI discipline",
        heading: "AI only where rules fall short",
        blocks: [
          {
            kind: "pairs",
            items: [
              { k: "Renewal-window recap", v: "A date and a spend summary — no model needed." },
              { k: "Feature-lapse nudge", v: "Rules plus a threshold; a propensity score only tunes timing." },
              {
                k: "Cohort discovery",
                v: "The cohort split emerged from clustering — rules can't find patterns nobody has named.",
              },
              {
                k: "Next-best-action ranking",
                v: "Many candidate moments, one slot — ranking under constraints is a learning problem.",
              },
              {
                k: "Insight summaries",
                v: "GenAI narrates member context to an agent in seconds — grounded in the graph, human-reviewed, never member-facing at MVP.",
              },
            ],
          },
          {
            kind: "text",
            body: [
              "Failure modes owned up front: cold start falls back to cohort defaults, stale signals decay in weight, and editorial fallback content always ships.",
            ],
          },
        ],
      },
      {
        label: "10",
        kicker: "Scope & measurement",
        heading: "The smallest version that proves the hypothesis",
        blocks: [
          {
            kind: "text",
            body: [
              "Core hypothesis: if members see context-aware next actions in the app and email, engaged discovery rises and renewal intent improves.",
            ],
          },
          {
            kind: "moscow",
            groups: [
              {
                label: "Must",
                items: [
                  "Member graph for the two proven cohorts",
                  "Next best action on app home and email",
                  "Holdout group",
                  "Full instrumentation",
                ],
              },
              {
                label: "Should",
                items: ["Agent-facing 360 profile", "Renewal-window value recap"],
              },
              {
                label: "Could",
                items: ["GenAI insight summaries for agents", "Cohort explorer for marketing"],
              },
              {
                label: "Not now",
                items: ["Real-time in-club triggers", "Loyalty-program redesign", "Member-facing GenAI"],
              },
            ],
          },
          {
            kind: "kpitree",
            north: "Monthly engaged members",
            northNote: "Measured against a holdout — no holdout, no claim.",
            tiers: [
              {
                label: "Primary",
                items: ["Engaged discovery sessions per member", "Next-best-action acceptance rate"],
              },
              {
                label: "Lifecycle",
                items: ["Renewal intent in the 90-day window", "Benefit activation (card, Scan & Go, fuel)"],
              },
              {
                label: "Business",
                items: ["Fee income per member", "Digital share of trips"],
              },
              {
                label: "Service",
                items: ["Agent handle time with 360 profile", "Repeat contacts on the same issue"],
              },
            ],
            guardrails: [
              "Frequency caps respected",
              "Opt-outs honoured end to end",
              "No sensitive attributes in ranking",
              "Editorial fallback always ships",
            ],
          },
          {
            kind: "text",
            body: [
              "Two cohorts with opposite behaviour are the strongest possible test of 'context changes engagement'. If it fails there, more surfaces won't save it. North star: monthly engaged members, measured against the holdout.",
            ],
          },
        ],
      },
    ],
  },
];

function decorateProjectTheme(p: Project): Project {
  const themeOverride = getProjectThemeOverride(p.slug);
  if (themeOverride) {
    return {
      ...p,
      theme: {
        ...p.theme,
        ...themeOverride,
      },
    };
  }
  return p;
}

export const getProject = (slug: string): Project | undefined => {
  if (!slug) return undefined;

  let s = slug.toLowerCase().trim();
  s = s.replace(/^#\/?/, "").replace(/^work\/?/, "").replace(/^case-study\/?/, "").trim();

  // Index matches
  if (s === "01" || s === "1" || s.endsWith("card-01") || s.endsWith("badge-01") || s.endsWith("button-01")) {
    return decorateProjectTheme(projects[0]!);
  }
  if (s === "02" || s === "2" || s.endsWith("card-02") || s.endsWith("badge-02") || s.endsWith("button-02")) {
    return decorateProjectTheme(projects[1]!);
  }
  if (s === "03" || s === "3" || s.endsWith("card-03") || s.endsWith("badge-03") || s.endsWith("button-03")) {
    return decorateProjectTheme(projects[2]!);
  }

  // Exact match
  let found = projects.find((p) => p.slug === s);

  // Fallback alias matches
  if (!found) {
    if (s.includes("marketing") || s.includes("mix") || s === "mmm") {
      found = projects.find((p) => p.slug === "marketing-mix-models");
    } else if (s.includes("membership") || s.includes("loyalty") || s.includes("warehouse") || s.includes("360")) {
      found = projects.find((p) => p.slug === "membership-360");
    } else if (s.includes("chatbot") || s.includes("ios") || s.includes("ai-chat")) {
      found = projects.find((p) => p.slug === "ai-chatbot");
    } else {
      const cleanS = s.replace(/s$/, "");
      found = projects.find((p) => p.slug.replace(/s$/, "") === cleanS);
    }
  }

  if (!found) return undefined;
  return decorateProjectTheme(found);
};

export const nextProject = (slug: string): Project => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length]!;
};

export const prevProject = (slug: string): Project => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i - 1 + projects.length) % projects.length]!;
};
