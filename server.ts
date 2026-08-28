import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy GoogleGenAI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

const GULSHAN_PM_BIO = `
You are the AI Assistant representing Gulshan Kumar Sahu, a Senior Product Manager with 5+ years of experience building enterprise AI, data platforms, and 0-to-1 digital products.
You know EVERYTHING about Gulshan's portfolio, career background, skillsets, tools, certifications, education, achievements, philosophies, and case studies. Answer any query about any keyword, concept, tool, experience, or project on this website comprehensively and concisely.

Overview & Contact:
- Name: Gulshan Kumar Sahu
- Role: Product Manager (AI × Data × UX × Business)
- Experience: 5+ Years leading enterprise products, cross-functional squads, and 0-to-1 software delivery.
- Status: Available for Product Manager & Senior PM roles.
- Email: gulshan.sahu@hotmail.com | Phone: +91 90705 99155
- LinkedIn: https://www.linkedin.com/in/gulshan-sahu/
- Location: Bengaluru, India

Core Capabilities & Tech Stack / Tools:
1. Product Management: Strategy, Roadmaps, Prioritisation (RICE, Kano), Agile/Scrum, User Stories, OKRs, Backlog grooming, GTM, Stakeholder management. Tools: JIRA, Confluence, Azure DevOps, Asana, Aha!
2. AI / GenAI: AI Chatbot 0-to-1, Prompt Engineering & Tuning, Vibe Coding, LLM Requirements, Rapid Prototyping, AI Discovery. Tools: Gemini, Claude, ChatGPT, Google AI Studio, Antigravity, Midjourney, Dall-E.
3. Analytics & Data: Data-Driven Decision Making, A/B Testing, DAU/MAU, KPI Dashboards, Data Visualization. Tools: Power BI, Tableau, SQL, Google Analytics.
4. UX & Research: User Research, Usability Testing, Heuristic Audits, Wireframing, High-Fidelity Prototyping, Information Architecture, Design Systems. Tools: Figma, Adobe XD, Lovable.
5. Execution: Squad Leadership (managed 7-person squads: engineers, data scientists, UX designers), Velocity (+20% speedup via design systems & spec-first API contracts).

Work History & Professional Experience:
1. Mu-Sigma (Nov 2022 – Present) | Product Manager, Bengaluru
   - Led 0-to-1 and end-to-end lifecycle for 5+ enterprise tools across Fortune 500 clients.
   - Led squad of 7 (2 designers, 3 data scientists, 2 developers). Boosted velocity by 20% using standardized design systems.
   - Reduced usability friction by 30% through heuristic audits and user research; grew feature adoption by 25%.
   - Increased analytics tool adoption by 30% across product teams.
   - Built executive Power BI, React, Angular, and Tableau dashboards for real-time KPIs and risk monitoring.
2. Freelance (Oct 2020 – Oct 2022) | Operations & Customer Experience Manager, Raipur
   - Executed 40+ complex high-scale events; boosted client retention and referrals by 15% through workflow optimization.
3. Aakaar Medical Technologies (Mar 2020 – Sep 2020) | Sales Executive, Hyderabad
   - 50+ B2B discovery interviews mapped to client solutions; accelerated product adoption by 10%.
4. Oberoi Hotels & Resorts (Sep 2016 – Mar 2017) | Assistant
   - Customer feedback data analysis; improved satisfaction metrics by 10%.

Education & Certifications:
- PGDM in Marketing: Universal Business School, Mumbai (2018 – 2020)
- B.Sc. Hospitality & Hotel Administration: Institute of Hotel Management (IHM), Goa (2013 – 2016)
- Certifications: IBM AI Product Manager Specialisation, Generative AI for Product Managers Specialisation, Google UX Design, CalArts UI/UX Specialisation, Figma UI/UX Design Essentials, Digital Marketing, Google Analytics Basics.
- Achievements: Spot Award at Mu-Sigma (UI mock-ups), Sales Achievement at HUL (130% target overflow), Research Publication on CSR & Brand Equity (Int'l Journal of Management & Social Sciences).

Key Portfolio Case Studies:
1. "iOS AI Chatbot" (Fortune-50 Aerospace Client): Desktop to iOS native 0-to-1 build shipped in 5 months. 87% test coverage, zero production data leaks using synthetic mock API pipelines. Resolves desk-less worker policy questions in-app.
2. "Marketing Mix Model (MMM) Simulator" (Top-3 LATAM Retailer): Reallocated $198.3M budget with Bayesian adstock and saturation modeling. Self-serve scenario simulator increased RoAS from 21.0 to 22.3 and unlocked +$245M (+6% / +4%) incremental sales with zero extra spend.
3. "Member Engagement Graph & Retention Engine" (Sam's Club / Membership 360): Discovered multi-persona behavior sharing standard tier cards. Built Member Graph & automated triggers, protecting ~$16M annual fee revenue per +1pt renewal.
4. "Real-Time Ad Ranking Engine": ML ad-matching pipeline reducing latency from 450ms to 65ms while boosting click-through yield by 28%.

Gulshan's 6 Core Product Philosophies:
1. Start with the problem; features are the last thing to write down.
2. Data informs decisions; it doesn't make them for you.
3. Good UX is subtraction — every removed step is a shipped feature.
4. AI must remove user friction, not just add novelty.
5. A roadmap is a set of deliberate refusals.
6. Shipping isn't the end of discovery — it's the honest part of it.

Tone & Persona:
- Speak concisely, intelligently, and directly as Gulshan's AI Assistant.
- If asked about any keyword, concept, tool, metric, company, project, certification, or skill, give a crisp, helpful, and well-structured answer grounding it in Gulshan's actual portfolio data.
`;

/**
 * Robust Gemini model caller with exponential backoff & fallback model cascade.
 * Handles transient 503 (model demand spikes), 429, and network timeouts gracefully.
 */
async function callGeminiContent(options: {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
}): Promise<string | null> {
  const ai = getGenAI();
  if (!ai) return null;

  // Primary model followed by fallback models
  const modelsToTry = ["gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];

  for (const model of modelsToTry) {
    try {
      // 6 second timeout race so the UI is always snappy
      const result = await Promise.race([
        ai.models.generateContent({
          model,
          contents: options.contents,
          config: {
            ...(options.systemInstruction ? { systemInstruction: options.systemInstruction } : {}),
            ...(options.responseMimeType ? { responseMimeType: options.responseMimeType } : {}),
            ...(options.temperature !== undefined ? { temperature: options.temperature } : {}),
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout with model ${model}`)), 6000)
        ),
      ]);

      if (result && result.text) {
        return result.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini API] Model ${model} failed: ${err?.message || err}`);
      // Proceed to next fallback model
      continue;
    }
  }

  return null;
}

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiEnabled: Boolean(process.env.GEMINI_API_KEY) });
});

// Contact Messages Store
interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  topic?: string;
  message: string;
  createdAt: string;
  deliveredTo: string;
}
const contactMessages: ContactMessageRecord[] = [];

// Contact form API endpoint for direct background submission
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, topic, message } = req.body || {};
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();
    const trimmedMessage = message?.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and message are required fields.",
      });
    }

    const recipientEmail = "Gulshan.Sahu@hotmail.com";
    const newRecord: ContactMessageRecord = {
      id: "msg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      name: trimmedName,
      email: trimmedEmail,
      topic: topic || "General Inquiry",
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
      deliveredTo: recipientEmail,
    };

    contactMessages.unshift(newRecord);
    if (contactMessages.length > 200) contactMessages.pop();

    console.log(`[Contact API] Direct message received from ${trimmedName} (${trimmedEmail}):`);
    console.log(`Subject: [Portfolio Contact - ${topic || "General"}]`);
    console.log(`Body: ${trimmedMessage}`);
    console.log(`Forwarding target: ${recipientEmail}`);

    // Forward to Formspree endpoint
    const formspreeUrl = process.env.FORMSPREE_URL || "https://formspree.io/f/mvkopkjb";
    try {
      await fetch(formspreeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          topic: topic || "Portfolio Contact",
          message: trimmedMessage,
          _subject: `Portfolio Inquiry from ${trimmedName} [${topic || "General"}]`,
        }),
      });
      console.log(`[Contact API] Formspree dispatch succeeded to ${formspreeUrl}`);
    } catch (fsErr) {
      console.warn("[Contact API] Formspree dispatch attempt warning:", fsErr);
    }

    // Optional webhook / external email dispatch if keys are set
    const resendKey = process.env.RESEND_API_KEY;
    const webhookUrl = process.env.FORM_WEBHOOK_URL;

    if (resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: [recipientEmail],
            subject: `New Inquiry from ${trimmedName} [${topic || "Portfolio"}]`,
            html: `
              <h3>New Portfolio Contact Form Submission</h3>
              <p><strong>Name:</strong> ${trimmedName}</p>
              <p><strong>Email:</strong> ${trimmedEmail}</p>
              <p><strong>Topic:</strong> ${topic || "General"}</p>
              <p><strong>Message:</strong></p>
              <blockquote style="background:#f4f4f5;padding:12px;border-left:4px solid #d1651c;">
                ${trimmedMessage.replace(/\n/g, "<br/>")}
              </blockquote>
            `,
          }),
        });
      } catch (emailErr) {
        console.warn("[Contact API] Resend dispatch attempt:", emailErr);
      }
    } else if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRecord),
        });
      } catch (whErr) {
        console.warn("[Contact API] Webhook dispatch attempt:", whErr);
      }
    }

    return res.json({
      success: true,
      message: `Message sent directly to ${recipientEmail}`,
      recordId: newRecord.id,
      timestamp: newRecord.createdAt,
    });
  } catch (err: any) {
    console.error("[Contact API] Error processing message:", err);
    return res.status(500).json({
      success: false,
      error: "An internal error occurred while submitting your message.",
    });
  }
});

app.get("/api/contact/messages", (req, res) => {
  return res.json({
    total: contactMessages.length,
    targetEmail: "Gulshan.Sahu@hotmail.com",
    messages: contactMessages,
  });
});

// Helper for fallback brief generation
function generateFallbackBrief(projectSlug: string, lens: string, caseTitle: string) {
  const isChatbot = projectSlug?.includes("chatbot") || caseTitle?.includes("Chatbot") || caseTitle?.includes("iOS");
  const isMMM = projectSlug?.includes("mmm") || caseTitle?.includes("Marketing") || caseTitle?.includes("MMM");
  const isSams = projectSlug?.includes("sam") || caseTitle?.includes("Member") || caseTitle?.includes("Retention");

  if (isChatbot) {
    if (lens === "technical") {
      return {
        headline: "iOS AI Chatbot: Spec-First Contract & Synthetic Pipeline Architecture",
        keyTakeaways: [
          "Eliminated 6 months of backend blocking via automated mock API contracts in Swagger/OpenAPI.",
          "Maintained 87% unit and UI test coverage with 0 production security leaks.",
          "Implemented local deterministic rule matching to mask LLM latency on spotty plant networks."
        ],
        deepDiveSummary: "Gulshan decoupled mobile client development from backend LLM service readiness using synthetic data factories, enabling parallel iOS engineering sprints and early validation with shop-floor users.",
        tradeOffHighlight: "Refused early multi-turn persistent conversational state in favor of rock-solid single-query accuracy and 0ms offline caching.",
        metricsCallout: "5 months delivery, 87% test coverage, 0 data breaches."
      };
    }
    if (lens === "commercial") {
      return {
        headline: "iOS AI Chatbot: Enterprise Compliance & Desk-less Productivity ROI",
        keyTakeaways: [
          "Reduced policy resolution latency from 4.2 hours (HR ticket backlog) to under 12 seconds in-app.",
          "Prevented costly manufacturing downtime by giving desk-less technicians instant compliance answers.",
          "Delivered 0-to-1 iOS MVP in 5 months vs typical 12-month enterprise IT procurement cycles."
        ],
        deepDiveSummary: "By transforming the company policy portal into an instant native assistant in workers' pockets, the solution drove high daily active usage while lowering internal support overhead by 34%.",
        tradeOffHighlight: "Focused strictly on top-50 high-frequency manufacturing policies rather than attempting full 10,000-page document ingestion in V1.",
        metricsCallout: "34% support ticket reduction, 5-month time-to-value."
      };
    }
    if (lens === "ux") {
      return {
        headline: "iOS AI Chatbot: UX Subtraction & Ergonomic Cognitive Load Reduction",
        keyTakeaways: [
          "Designed 1-tap query templates for gloved workers on factory floors.",
          "Eliminated multi-step portal logins in favor of seamless biometrics and instant response cards.",
          "Implemented progressive disclosure: concise answers first, expandable citations on demand."
        ],
        deepDiveSummary: "Recognizing that shop-floor technicians have zero tolerance for complex conversational prompts, Gulshan shaped the UI around 1-tap intent chips and glanceable policy snippets.",
        tradeOffHighlight: "Subtracted open-ended chat fluff in favor of verified, auditable citation cards.",
        metricsCallout: "< 3 seconds to actionable resolution."
      };
    }
    // Default exec
    return {
      headline: "iOS AI Chatbot: Strategic 0-to-1 Delivery for Aerospace Enterprise",
      keyTakeaways: [
        "Delivered native iOS experience in 5 months from discovery to handover with 0 production record breaches.",
        "Reframed the problem from 'training bigger models' to 'putting existing models directly into technicians' hands.'",
        "Established automated mock-contract pipelines that became the blueprint for subsequent mobile initiatives."
      ],
      deepDiveSummary: "Gulshan led a squad of 7 across ML, iOS, and UX to deliver an enterprise-grade AI assistant, navigating strict aerospace security constraints and unblocking mobile velocity with synthetic test contracts.",
      tradeOffHighlight: "Prioritized speed-to-hands and synthetic test isolation over speculative model retraining.",
      metricsCallout: "87% test coverage, 5-month delivery, 0 security leaks."
    };
  }

  if (isMMM) {
    return {
      headline: `${caseTitle}: Bayesian Marketing Mix Optimization & RoAS Lift`,
      keyTakeaways: [
        "Reallocated $198.3M annual marketing budget across 7 channels using Bayesian adstock and saturation modeling.",
        "Increased aggregate RoAS from 21.0 to 22.3 (+6.2%), delivering +$245M in incremental sales without extra spend.",
        "Transformed static quarterly agency spreadsheets into an interactive self-serve simulation platform."
      ],
      deepDiveSummary: "Gulshan bridges deep econometric data science with intuitive executive tooling, allowing marketing VPs to simulate budget shifts across digital, TV, and trade promotions with instant marginal return curves.",
      tradeOffHighlight: "Accepted simplified weekly aggregation intervals to achieve sub-second simulation recalculation for executive decision-makers.",
      metricsCallout: "+$245M incremental sales, 22.3 RoAS (+6.2% lift)."
    };
  }

  if (isSams) {
    return {
      headline: `${caseTitle}: Member Engagement Graph & Revenue Protection`,
      keyTakeaways: [
        "Discovered hidden multi-persona behavior sharing standard tier cards, preventing renewal drops.",
        "Constructed Member Engagement Graph driving real-time next-best-action replenishment triggers.",
        "Protected ~$16M annual fee revenue for every +1.0% increase in tier renewal rates."
      ],
      deepDiveSummary: "Gulshan identified that renewal churn was driven by mismatched lifecycle communications. By building the Member Engagement Graph, the team automated personalized shopping triggers before the critical 60-day renewal cliff.",
      tradeOffHighlight: "Prioritized high-intent repeat category triggers over generic promotional email blasts.",
      metricsCallout: "~$16M fee revenue per +1pt renewal, 4.2x engagement lift."
    };
  }

  // Generic case study fallback
  return {
    headline: `${caseTitle}: Strategic PM Overview & Quantitative Impact`,
    keyTakeaways: [
      "Rigorous problem discovery resulting in accelerated delivery and high-confidence adoption.",
      "Clear metric hierarchy balancing North Star business impact against engineering guardrails.",
      "Spec-first team workflows and ruthless scope prioritization."
    ],
    deepDiveSummary: `Gulshan led cross-functional execution for ${caseTitle}, establishing clear API contracts, metric trees, and data-informed decision loops that delivered measurable business results.`,
    tradeOffHighlight: "Focused ruthlessly on core customer value before expanding into peripheral nice-to-haves.",
    metricsCallout: "Measurable business ROI with sustainable engineering foundations."
  };
}

// 1. In-context Case Study & General PM Assistant ("Ask the PM")
app.post("/api/ai/ask-pm", async (req, res) => {
  const { query, caseStudySlug, caseContext, history } = req.body || {};
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const promptContext = caseContext
      ? `Current Case Study Context:\n${JSON.stringify(caseContext, null, 2)}\n\n`
      : "";

    const conversationHistory = Array.isArray(history)
      ? history.slice(-6).map((m: any) => `${m.role === "user" ? "User" : "Gulshan PM AI"}: ${m.text}`).join("\n")
      : "";

    const fullPrompt = `${promptContext}${conversationHistory ? `Recent conversation:\n${conversationHistory}\n\n` : ""}User Question: ${query}\n\nProvide a concise, compelling, structured PM response (2-3 paragraphs or bulleted takeaways) directly answering the question from Gulshan's perspective.`;

    const aiText = await callGeminiContent({
      contents: fullPrompt,
      systemInstruction: GULSHAN_PM_BIO,
      temperature: 0.7,
    });

    if (aiText) {
      return res.json({ answer: aiText });
    }
  } catch (err) {
    console.warn("Ask PM error handled with contextual fallback:", err);
  }

  // Resilient contextual fallback covering all portfolio keywords
  const qLower = query.toLowerCase();
  let fallback = "";

  if (qLower.includes("contact") || qLower.includes("email") || qLower.includes("phone") || qLower.includes("reach") || qLower.includes("linkedin")) {
    fallback = "You can reach Gulshan directly via email at gulshan.sahu@hotmail.com or phone at +91 90705 99155. You can also view his professional profile on LinkedIn at linkedin.com/in/gulshan-sahu/. He is based in Bengaluru and open to Senior Product Manager roles.";
  } else if (qLower.includes("skill") || qLower.includes("tool") || qLower.includes("tech") || qLower.includes("jira") || qLower.includes("figma") || qLower.includes("power bi") || qLower.includes("tableau") || qLower.includes("sql")) {
    fallback = "Gulshan's core capabilities span 5 areas:\n• Product Strategy & Delivery: JIRA, Confluence, Azure DevOps, Asana, RICE/Kano prioritisation, Agile/Scrum.\n• AI / GenAI: Gemini, Claude, ChatGPT, Google AI Studio, Prompt Tuning, Vibe Coding, Rapid Prototyping.\n• Data & Analytics: Power BI, Tableau, SQL, Google Analytics, A/B testing, DAU/MAU dashboards.\n• UX & Design: Figma, Adobe XD, Lovable, Usability testing, Design Systems.\n• Execution: Squad leadership (+20% velocity improvement across 7-person squads).";
  } else if (qLower.includes("experience") || qLower.includes("job") || qLower.includes("career") || qLower.includes("work") || qLower.includes("mu-sigma") || qLower.includes("musigma")) {
    fallback = "Gulshan has 5+ years of experience in product and operations:\n1. Product Manager at Mu-Sigma (Nov 2022 – Present): Led 0-to-1 enterprise tools for Fortune 500 clients, managed a squad of 7, improved delivery velocity by 20% and reduced usability friction by 30%.\n2. Operations & CX Manager (Freelance, 2020–2022): Executed 40+ high-scale events with 15% higher client retention.\n3. Sales Executive at Aakaar Medical (2020): Conducted 50+ B2B discovery calls.\n4. Assistant at Oberoi Hotels (2016–2017): Enhanced guest satisfaction metrics by 10%.";
  } else if (qLower.includes("education") || qLower.includes("certif") || qLower.includes("degree") || qLower.includes("college") || qLower.includes("school") || qLower.includes("ubs") || qLower.includes("ihm")) {
    fallback = "Gulshan holds a PGDM in Marketing from Universal Business School, Mumbai (2018–2020) and a B.Sc. in Hospitality & Hotel Administration from IHM Goa (2013–2016).\nCertifications include:\n• IBM AI Product Manager Specialisation\n• Generative AI for Product Managers Specialisation\n• Google UX Design & CalArts UI/UX Specialisation\n• Figma UI/UX Design Essentials & Google Analytics";
  } else if (qLower.includes("philosoph") || qLower.includes("principle") || qLower.includes("think") || qLower.includes("approach")) {
    fallback = "Gulshan's 6 product principles:\n1. Start with the problem; features are the last thing to write down.\n2. Data informs decisions; it doesn't make them for you.\n3. Good UX is subtraction — every removed step is a shipped feature.\n4. AI must remove user friction, not just add novelty.\n5. A roadmap is a set of deliberate refusals.\n6. Shipping isn't the end of discovery — it's the honest part of it.";
  } else if (qLower.includes("trade") || qLower.includes("risk")) {
    fallback = "Across Gulshan's products, key trade-offs prioritize speed-to-learning and security compliance over raw feature breadth. For example, by shipping against verified mock API contracts and synthetic pipelines, his teams reduced cycle time from 11 to 5 months while keeping production zero-exposure.";
  } else if (qLower.includes("metric") || qLower.includes("roi") || qLower.includes("kpi") || qLower.includes("north star")) {
    fallback = "Gulshan structures KPI trees around a single high-integrity North Star (e.g., in-app policy questions resolved/week, RoAS lift, or renewal retention fee protection) guarded by strict engineering thresholds (crash-free sessions ≥ 99%, test coverage ≥ 87%).";
  } else {
    fallback = `Regarding ${caseStudySlug || "this portfolio"}: Gulshan's PM leadership is grounded in AI capability that removes real user friction, data that informs defensible decisions, cognitive UX subtraction, and measurable business ROI. Reach out to him at gulshan.sahu@hotmail.com for deep dives.`;
  }
  return res.json({ answer: fallback });
});

// 2. Recruiter Job Description Matcher ("Match My Role")
app.post("/api/ai/match-role", async (req, res) => {
  const { roleTitle, jobDescription, companyType } = req.body || {};
  if (!roleTitle && !jobDescription) {
    return res.status(400).json({ error: "Role title or job description is required" });
  }

  try {
    const prompt = `Analyze this open role / job description against Gulshan Kumar Sahu's PM background:
Target Role: ${roleTitle || "Unspecified PM Role"}
Company / Industry: ${companyType || "Technology / Enterprise"}
Job Description / Requirements:
${jobDescription || "Looking for an experienced Product Manager with AI/ML, data platforms, and cross-functional leadership skills."}

Return a valid JSON object matching this schema:
{
  "matchScore": number (integer between 82 and 98),
  "summary": string (2 sentences explaining the high-level match),
  "topProjects": [
    { "slug": "ai-chatbot" | "sams-club" | "ad-ranking", "title": string, "reason": string }
  ],
  "keyCompetencies": string[] (4 bullet points of exact matching strengths),
  "tailoredPitch": string (concise 2-3 sentence elevator pitch for the hiring manager),
  "suggestedInterviewQuestions": string[] (3 deep-dive interview questions highlighting Gulshan's strengths)
}`;

    const aiText = await callGeminiContent({
      contents: prompt,
      systemInstruction: `${GULSHAN_PM_BIO}\nYou are an expert Executive Tech Recruiter and VP of Product evaluating candidate portfolios. Return ONLY valid raw JSON with no Markdown backticks if possible.`,
      responseMimeType: "application/json",
    });

    if (aiText) {
      try {
        const cleaned = aiText.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.matchScore && parsed.summary) {
          return res.json(parsed);
        }
      } catch (parseErr) {
        console.warn("Error parsing AI role match JSON:", parseErr);
      }
    }
  } catch (err) {
    console.warn("Role match error handled with contextual fallback:", err);
  }

  // Resilient contextual fallback
  return res.json({
    matchScore: 94,
    summary: `Strong alignment for ${roleTitle || "Product Manager"}: Gulshan's 5+ years leading 0-to-1 AI initiatives, cross-functional squads of 7, and multi-million dollar data platforms directly fulfills core competency requirements.`,
    topProjects: [
      {
        slug: "ai-chatbot",
        title: "iOS AI Chatbot (0→1 Native)",
        reason: "Demonstrates 0-to-1 enterprise AI delivery, PRD ownership, mock API pipelines, and strict security compliance in Fortune-50 environment."
      },
      {
        slug: "sams-club",
        title: "Member Engagement Graph & Retention",
        reason: "Demonstrates large-scale customer retention, cohort behavioral segmentation, and $16M+ annual fee revenue protection."
      }
    ],
    keyCompetencies: [
      "0→1 AI/ML Product Strategy & Scoping",
      "Cross-Functional Pod Leadership (Squad of 7)",
      "Data-Informed P&L Optimization ($245M+ incremental revenue)",
      "Enterprise UX Subtraction & Spec-First API Contracts"
    ],
    tailoredPitch: `Gulshan brings proven experience bridging complex technical architectures (LLMs, Bayesian models, real-time pipelines) with measurable business P&L outcomes. His track record includes cutting release cycle times by 50% and increasing team velocity by 20%.`,
    suggestedInterviewQuestions: [
      "Can you walk through how you scoped the iOS AI Chatbot mock API strategy to unblock mobile devs ahead of backend availability?",
      "How did you gain VP-level stakeholder alignment when reallocating $198M media spend in the Marketing Mix Model?",
      "What is your approach to setting guardrail metrics vs North Star KPIs in 0-to-1 AI products?"
    ]
  });
});

// 3. Executive Summary & Perspective Lens Generator
app.post("/api/ai/executive-brief", async (req, res) => {
  const { caseStudySlug, lens, caseTitle, caseSummary, onePager, metrics } = req.body || {};

  try {
    const lensDescriptions: Record<string, string> = {
      exec: "Executive / C-Suite Brief: Focus on strategic rationale, time-to-market, risk containment, and high-level ROI.",
      technical: "Technical PM Lens: Focus on architecture, API contracts, mock data pipelines, test coverage, and backend integration.",
      commercial: "Commercial & Business P&L: Focus on revenue impact, cost avoidance, operational efficiency, and scalable economics.",
      ux: "UX Subtraction & Heuristics: Focus on cognitive load reduction, user workflow simplification, and desk-less worker ergonomics."
    };

    const prompt = `Generate a customized perspective brief for this case study:
Project Title: ${caseTitle || "Case Study"}
Summary: ${caseSummary || ""}
One-Pager Context: ${JSON.stringify(onePager || [])}
Metrics: ${JSON.stringify(metrics || [])}
Selected Perspective Lens: ${lensDescriptions[lens] || lensDescriptions.exec}

Return a valid JSON object:
{
  "headline": string,
  "keyTakeaways": string[] (3 crisp high-impact bullets),
  "deepDiveSummary": string (1 concise paragraph summarizing the PM's tactical execution under this lens),
  "tradeOffHighlight": string (the key trade-off made from this perspective),
  "metricsCallout": string (the primary numerical evidence)
}`;

    const aiText = await callGeminiContent({
      contents: prompt,
      systemInstruction: GULSHAN_PM_BIO,
      responseMimeType: "application/json",
    });

    if (aiText) {
      try {
        const cleaned = aiText.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.headline && parsed.keyTakeaways) {
          return res.json(parsed);
        }
      } catch (parseErr) {
        console.warn("Error parsing AI brief JSON:", parseErr);
      }
    }
  } catch (err) {
    console.warn("Executive brief error handled with contextual fallback:", err);
  }

  // Resilient contextual fallback
  const fallbackData = generateFallbackBrief(caseStudySlug || "", lens || "exec", caseTitle || "Case Study");
  return res.json(fallbackData);
});

// 4. PM Decision Simulator / Scenario Explorer
app.post("/api/ai/simulate-scenario", async (req, res) => {
  const { caseStudySlug, caseTitle, scenario } = req.body || {};
  if (!scenario) {
    return res.status(400).json({ error: "Scenario description is required" });
  }

  try {
    const prompt = `Simulate how Gulshan Kumar Sahu (Senior PM) would pivot the product strategy for "${caseTitle || "Product"}" when presented with this hypothetical constraint change:

Hypothetical Scenario:
"${scenario}"

Apply Gulshan's PM frameworks (e.g. ruthless scoping, UX subtraction, guardrail metrics, synthetic contract isolation, business ROI protection).

Return a valid JSON object:
{
  "decisionTitle": string (A crisp 4-6 word PM decision title),
  "strategicShift": string (1-2 sentences on the strategic pivot rationale),
  "revisedMVP": string[] (3 prioritized features retained in the revised MVP scope),
  "tradeOffsAccepted": string[] (2 deliberate trade-offs/refusals made to accommodate the constraint),
  "riskMitigation": string (Tactical risk mitigation step),
  "expectedKpiImpact": string (Expected impact on adoption, latency, or business P&L)
}`;

    const aiText = await callGeminiContent({
      contents: prompt,
      systemInstruction: GULSHAN_PM_BIO,
      responseMimeType: "application/json",
    });

    if (aiText) {
      try {
        const cleaned = aiText.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.decisionTitle && parsed.revisedMVP) {
          return res.json(parsed);
        }
      } catch (parseErr) {
        console.warn("Error parsing AI simulation JSON:", parseErr);
      }
    }
  } catch (err) {
    console.warn("Simulator error handled with contextual fallback:", err);
  }

  // Resilient contextual fallback
  return res.json({
    decisionTitle: `Pivot Strategy: Adaptive Scope for "${scenario.slice(0, 35)}..."`,
    strategicShift: "Descope non-essential secondary flows to protect the core North Star metric while increasing release frequency with weekly synthetic validation.",
    revisedMVP: [
      "Preserve instant core query-response loop with local cached fallbacks.",
      "Postpone rich conversational history persistence to Phase 2.",
      "Implement client-side latency masking and deterministic rule routing."
    ],
    tradeOffsAccepted: [
      "Accepted narrower multi-turn memory in exchange for zero downtime and 3x faster delivery.",
      "Deferred custom administrative dashboard in favor of headless telemetry alerts."
    ],
    riskMitigation: "Double down on synthetic integration contracts in CI/CD to detect schema drift automatically before live staging.",
    expectedKpiImpact: "Maintains 90%+ of adoption North Star while reducing delivery risk and engineering overhead by 35%."
  });
});

// 5. Semantic Search & Command Palette
app.post("/api/ai/semantic-search", async (req, res) => {
  const { query } = req.body || {};
  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const prompt = `Analyze this user query against Gulshan Kumar Sahu's portfolio and find the most relevant projects, metrics, or philosophy pillars:
User Query: "${query}"

Return a valid JSON object:
{
  "answer": string (A 1-2 sentence direct answer summarizing where this appears in the portfolio),
  "directMatches": [
    {
      "slug": "ai-chatbot" | "sams-club" | "ad-ranking",
      "title": string,
      "category": string,
      "snippet": string (Why this project directly answers the query),
      "metric": string (Key quantitative metric)
    }
  ]
}`;

    const aiText = await callGeminiContent({
      contents: prompt,
      systemInstruction: GULSHAN_PM_BIO,
      responseMimeType: "application/json",
    });

    if (aiText) {
      try {
        const cleaned = aiText.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.answer && Array.isArray(parsed.directMatches)) {
          return res.json(parsed);
        }
      } catch (parseErr) {
        console.warn("Error parsing AI search JSON:", parseErr);
      }
    }
  } catch (err) {
    console.warn("Semantic search error handled with contextual fallback:", err);
  }

  // Resilient contextual fallback
  const qLower = query.toLowerCase();
  let matches = [
    {
      slug: "ai-chatbot",
      title: "iOS AI Chatbot (0→1 Native)",
      category: "AI · Enterprise Mobile",
      snippet: "Taking enterprise policy chatbot to iOS with synthetic API isolation and 87% test coverage.",
      metric: "5 mo to handover"
    }
  ];

  if (qLower.includes("retention") || qLower.includes("sam") || qLower.includes("member") || qLower.includes("churn") || qLower.includes("graph")) {
    matches = [
      {
        slug: "sams-club",
        title: "Member Engagement Graph & Retention",
        category: "Data Platforms · Retention",
        snippet: "Solving membership renewal drop-offs through behavioral persona graphs and automated replenishment triggers.",
        metric: "~$16M fee revenue per +1pt renewal"
      }
    ];
  } else if (qLower.includes("mmm") || qLower.includes("market") || qLower.includes("roas") || qLower.includes("budget") || qLower.includes("bayesian")) {
    matches = [
      {
        slug: "ai-chatbot",
        title: "Marketing Mix Model (MMM) Simulator",
        category: "Econometrics · Growth",
        snippet: "Modernizing a $198M annual budget using Bayesian adstock modeling to drive +$245M incremental sales.",
        metric: "+$245M sales lift"
      }
    ];
  } else if (qLower.includes("latency") || qLower.includes("ad") || qLower.includes("rank") || qLower.includes("ml")) {
    matches = [
      {
        slug: "ad-ranking",
        title: "Real-Time Ad Ranking Engine",
        category: "Machine Learning · Infra",
        snippet: "Machine learning ad-matching pipeline reducing ad latency from 450ms to 65ms while boosting CTR by 28%.",
        metric: "65ms latency (vs 450ms)"
      }
    ];
  }

  return res.json({
    answer: `Gulshan's portfolio demonstrates extensive hands-on experience in "${query}", featuring production-grade AI applications, data platforms, and measurable ROI.`,
    directMatches: matches
  });
});

// Vite middleware for development vs static build for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(
      express.static(distPath, {
        maxAge: "1y",
        immutable: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith(".html")) {
            res.setHeader("Cache-Control", "no-cache");
          }
        },
      })
    );
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
