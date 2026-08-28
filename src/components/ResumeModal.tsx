import { useState, useEffect, useCallback, type MouseEvent } from "react";
import {
  X,
  FileDown,
  Printer,
  Copy,
  Check,
  Sparkles,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  BadgeCheck,
  Mail,
  Linkedin,
  Globe,
  Phone,
  MapPin,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useProfile } from "@/context/ProfileContext";
import { site, experience, education, certifications, achievements, capabilities } from "@/data/site";
import { track } from "@/lib/analytics";

type ResumeTab = "interactive" | "pdf";

const ZOOM_MIN = 60;
const ZOOM_MAX = 200;
const ZOOM_STEP = 15;

export function ResumeModal() {
  const { isResumeOpen, setIsResumeOpen, profile } = useProfile();
  const [activeTab, setActiveTab] = useState<ResumeTab>("pdf");
  const [copiedLink, setCopiedLink] = useState(false);
  const [zoom, setZoom] = useState(100);

  // Actual PDF document URL with Vite asset resolution
  const pdfUrl = site.resume || "./Gulshan_Sahu_CV.pdf";

  const handleOpenPdf = (e?: MouseEvent) => {
    if (e) e.preventDefault();
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
    track("resume_open_pdf_tab", { from: "modal" });
  };

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(ZOOM_MAX, prev + ZOOM_STEP));
    track("resume_zoom_in", { tab: activeTab });
  }, [activeTab]);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(ZOOM_MIN, prev - ZOOM_STEP));
    track("resume_zoom_out", { tab: activeTab });
  }, [activeTab]);

  const handleResetZoom = useCallback(() => {
    setZoom(100);
    track("resume_zoom_reset", { tab: activeTab });
  }, [activeTab]);

  // Close on Escape & handle zoom keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isResumeOpen) return;

      if (e.key === "Escape") {
        setIsResumeOpen(false);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        handleZoomIn();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "-" || e.key === "_")) {
        e.preventDefault();
        handleZoomOut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        handleResetZoom();
      }
    };

    if (isResumeOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setActiveTab("pdf");
      setZoom(100);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
  }, [isResumeOpen, setIsResumeOpen, handleZoomIn, handleZoomOut, handleResetZoom]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${pdfUrl}`);
    setCopiedLink(true);
    track("resume_copy_link", { from: "modal" });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    track("resume_print", { from: "modal" });
    window.print();
  };

  return (
    <AnimatePresence>
      {isResumeOpen && (
        <div
          id="resume-overlay"
          onClick={() => setIsResumeOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/75 backdrop-blur-md animate-fade-in"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col w-full max-w-5xl h-[92vh] sm:h-[88vh] rounded-2xl sm:rounded-3xl border border-white/20 dark:border-white/10 bg-card/95 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.6)] ring-1 ring-white/10 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-title"
          >
            {/* Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6 py-3.5 sm:py-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent shrink-0">
                  <FileText className="size-4.5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 id="resume-title" className="font-display font-bold text-base text-foreground">
                      {profile.name}
                    </h3>
                    <span className="hidden sm:inline-flex items-center rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[0.65rem] font-semibold text-accent uppercase">
                      Curriculum Vitae
                    </span>
                  </div>
                  <p className="text-[0.72rem] text-muted-foreground font-medium">
                    {profile.role} · {profile.positioning}
                  </p>
                </div>
              </div>

              {/* View Mode Toggle & Zoom Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Mode Switcher */}
                <div className="flex items-center gap-1 rounded-full bg-secondary/80 p-1 border border-border/60">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("interactive");
                      track("resume_tab_switch", { tab: "interactive" });
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "interactive"
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="size-3" />
                    <span>Interactive CV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("pdf");
                      track("resume_tab_switch", { tab: "pdf" });
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "pdf"
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FileText className="size-3" />
                    <span>PDF Document</span>
                  </button>
                </div>

                {/* Unified Zoom Controls in Header */}
                <div className="flex items-center gap-0.5 rounded-full bg-secondary/80 p-1 border border-border/60">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoom <= ZOOM_MIN}
                    className="inline-flex size-6.5 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-card/80 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    title="Zoom Out (Ctrl + -)"
                    aria-label="Zoom Out"
                  >
                    <ZoomOut className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="px-2 py-0.5 font-mono text-[0.7rem] font-semibold text-muted-foreground hover:text-foreground hover:bg-card/80 rounded-md transition-all cursor-pointer"
                    title="Reset Zoom to 100% (Ctrl + 0)"
                  >
                    {zoom}%
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoom >= ZOOM_MAX}
                    className="inline-flex size-6.5 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-card/80 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    title="Zoom In (Ctrl + +)"
                    aria-label="Zoom In"
                  >
                    <ZoomIn className="size-3.5" />
                  </button>
                  {zoom !== 100 && (
                    <button
                      type="button"
                      onClick={handleResetZoom}
                      className="inline-flex size-6 items-center justify-center rounded-full text-accent hover:bg-card/80 transition-all cursor-pointer ml-0.5"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="size-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Top Quick Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={pdfUrl}
                  download="Gulshan_Sahu_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("resume_download", { from: "modal_header" })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-accent-foreground transition-all hover:opacity-90 active:scale-95 shadow-sm cursor-pointer"
                  title="Direct Download PDF"
                >
                  <FileDown className="size-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden">PDF</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex size-8.5 items-center justify-center rounded-full border border-border bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  title="Copy link to resume PDF"
                  aria-label="Copy resume link"
                >
                  {copiedLink ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="hidden lg:inline-flex size-8.5 items-center justify-center rounded-full border border-border bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  title="Print Resume"
                  aria-label="Print resume"
                >
                  <Printer className="size-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsResumeOpen(false)}
                  className="inline-flex size-8.5 items-center justify-center rounded-full border border-border bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  aria-label="Close Resume Overlay"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="relative flex-1 overflow-y-auto bg-background/95 p-4 sm:p-6 md:p-8">
              {activeTab === "interactive" ? (
                /* ATS-Aligned Interactive CV View (Instant 0ms render) */
                <div
                  style={{
                    zoom: zoom !== 100 ? `${zoom}%` : undefined,
                  }}
                  className="mx-auto max-w-3xl space-y-8 animate-fade-in text-foreground transition-all duration-150"
                >
                  {/* Executive Header */}
                  <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                        {profile.name}
                      </h1>
                      <p className="mt-1 font-mono text-xs sm:text-sm font-semibold text-accent leading-normal">
                        {profile.role} · {profile.positioning}
                      </p>
                      <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                        {profile.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 text-xs text-muted-foreground font-mono shrink-0">
                      {profile.email && (
                        <a
                          href={`mailto:${profile.email}`}
                          className="inline-flex items-center gap-2 hover:text-accent transition-colors leading-none"
                        >
                          <Mail className="size-3.5 text-accent shrink-0" />
                          <span>{profile.email}</span>
                        </a>
                      )}
                      {profile.phone && (
                        <a
                          href={`tel:${profile.phone}`}
                          className="inline-flex items-center gap-2 hover:text-accent transition-colors leading-none"
                        >
                          <Phone className="size-3.5 text-accent shrink-0" />
                          <span>{profile.phone}</span>
                        </a>
                      )}
                      {profile.linkedin && (
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => track("linkedin_click", { from: "resume_modal_interactive" })}
                          className="inline-flex items-center gap-2 hover:text-accent transition-colors leading-none"
                        >
                          <Linkedin className="size-3.5 text-accent shrink-0" />
                          <span>LinkedIn Profile</span>
                        </a>
                      )}
                      {(profile.website || site.website) && (
                        <a
                          href={profile.website || site.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => track("portfolio_click", { from: "resume_modal_interactive" })}
                          className="inline-flex items-center gap-2 hover:text-accent transition-colors leading-none"
                        >
                          <Globe className="size-3.5 text-accent shrink-0" />
                          <span>Live Portfolio</span>
                        </a>
                      )}
                      <div className="inline-flex items-center gap-2 text-muted-foreground leading-none">
                        <MapPin className="size-3.5 text-accent shrink-0" />
                        <span>Bengaluru, India</span>
                      </div>
                    </div>
                  </div>

                  {/* Core Competencies / Capabilities */}
                  <section className="space-y-3.5">
                    <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                      <Sparkles className="size-4 text-accent" />
                      <h2 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-foreground leading-snug">
                        Core Competencies & Capabilities
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                      {capabilities.map((c) => (
                        <div
                          key={c.no}
                          className="p-3.5 rounded-xl border border-border/60 bg-card/60 hover:border-accent/40 transition-colors space-y-1.5"
                        >
                          <p className="font-display text-xs sm:text-[0.8125rem] font-bold text-foreground leading-snug">{c.title}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{c.think}</p>
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {c.tools.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="rounded bg-secondary/80 px-2 py-0.5 text-[0.6875rem] font-mono text-muted-foreground leading-tight"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Work Experience */}
                  <section className="space-y-5">
                    <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                      <Briefcase className="size-4 text-accent" />
                      <h2 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-foreground leading-snug">
                        Professional Experience
                      </h2>
                    </div>

                    <div className="space-y-6">
                      {experience.map((job, idx) => (
                        <div key={idx} className="relative pl-4 border-l-2 border-accent/40 space-y-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <div>
                              <h3 className="font-display text-sm sm:text-base font-bold text-foreground leading-snug">
                                {job.title} <span className="text-accent">@ {job.company}</span>
                              </h3>
                              {job.place && (
                                <p className="text-xs text-muted-foreground font-mono mt-0.5">{job.place}</p>
                              )}
                            </div>
                            <span className="font-mono text-xs text-accent font-semibold sm:text-right shrink-0">
                              {job.period}
                            </span>
                          </div>

                          <ul className="list-disc pl-4 space-y-2 text-xs sm:text-[0.8125rem] text-muted-foreground leading-relaxed">
                            {job.owned.map((bullet, bIdx) => (
                              <li key={bIdx}>{bullet}</li>
                            ))}
                          </ul>

                          {job.learned && (
                            <p className="text-xs italic text-muted-foreground/90 bg-secondary/40 p-3 rounded-lg border border-border/40 leading-relaxed">
                              <span className="font-semibold text-accent not-italic">Key Takeaway:</span> "{job.learned}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Education & Certifications Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Education */}
                    <section className="space-y-3.5">
                      <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                        <GraduationCap className="size-4 text-accent" />
                        <h2 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-foreground leading-snug">
                          Education
                        </h2>
                      </div>
                      <div className="space-y-3">
                        {education.map((edu, idx) => (
                          <div key={idx} className="p-3.5 rounded-xl border border-border/50 bg-card/40 space-y-1">
                            <p className="font-display text-xs sm:text-[0.8125rem] font-bold text-foreground leading-snug">{edu.degree}</p>
                            <p className="text-xs text-muted-foreground leading-normal">{edu.school}</p>
                            <p className="font-mono text-[0.6875rem] text-accent font-semibold">{edu.years}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Certifications */}
                    <section className="space-y-3.5">
                      <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                        <BadgeCheck className="size-4 text-accent" />
                        <h2 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-foreground leading-snug">
                          Certifications
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {certifications.map((cert, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-1.5 text-xs leading-none"
                          >
                            <span className="font-medium text-foreground">{cert.name}</span>
                            <span className="font-mono text-[0.6875rem] text-accent uppercase font-semibold">
                              [{cert.tag}]
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Honors & Achievements */}
                  <section className="space-y-3.5">
                    <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                      <Award className="size-4 text-accent" />
                      <h2 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-foreground leading-snug">
                        Honors & Key Milestones
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {achievements.map((a, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-border/50 bg-card/40 space-y-1">
                          <p className="font-display text-xs sm:text-[0.8125rem] font-bold text-accent leading-snug">{a.title}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{a.detail}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              ) : (
                /* 1:1 Pixel-Perfect Official CV Document Preview */
                <div className="relative size-full overflow-auto bg-neutral-950/90 p-3 sm:p-6 md:p-8 flex flex-col items-center">
                  {/* Toolbar */}
                  <div className="sticky top-0 z-30 w-full max-w-[820px] mb-6 flex items-center justify-between gap-3 bg-neutral-900/95 backdrop-blur-md px-3.5 sm:px-4 py-2.5 rounded-xl border border-neutral-800 text-xs text-neutral-300 shadow-xl">
                    <div className="flex items-center gap-2">
                      <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-semibold text-neutral-200">Official CV Document (2 Pages)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleOpenPdf}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs transition-colors border border-neutral-700 leading-none cursor-pointer"
                        title="Open official PDF in browser tab"
                      >
                        <Maximize2 className="size-3.5" />
                        <span className="hidden sm:inline">Open in New Tab</span>
                        <span className="sm:hidden">Open Tab</span>
                      </a>
                      <a
                        href={pdfUrl}
                        download="Gulshan_Sahu_CV.pdf"
                        onClick={() => track("resume_download", { from: "pdf_view" })}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shadow-sm leading-none cursor-pointer"
                      >
                        <FileDown className="size-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>

                  {/* Document Container with Smooth Responsive Scaling */}
                  <div
                    className="w-full max-w-[820px] space-y-8 origin-top transition-transform duration-200 ease-out"
                    style={{
                      transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
                      marginBottom: zoom > 100 ? `${((zoom - 100) / 100) * 1180}px` : undefined,
                    }}
                  >

                    {/* PAGE 1 */}
                    <div className="cv-document-sheet bg-white text-slate-900 rounded-sm shadow-2xl p-8 sm:p-12 text-[12px] sm:text-[12.5px] leading-relaxed space-y-5 select-text border border-slate-200">
                      {/* Header */}
                      <div className="border-b border-slate-300 pb-3">
                        <h1 className="text-2xl sm:text-[25px] font-bold tracking-tight text-[#d1651c] leading-none uppercase">
                          GULSHAN KUMAR SAHU
                        </h1>
                        <h2 className="text-[12.5px] font-bold text-slate-900 tracking-wider mt-1 uppercase leading-snug">
                          PRODUCT MANAGER
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11.5px] text-slate-600 mt-2 font-medium leading-normal">
                          <span>📍 Bengaluru, India</span>
                          <span>📞 +91 9070599155, +91 7744974713</span>
                          <span>✉️ gulshan.sahu@hotmail.com</span>
                          <span className="text-slate-800">
                            LinkedIn:{" "}
                            <a
                              href="https://www.linkedin.com/in/gulshan-sahu"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 hover:underline font-semibold"
                            >
                              linkedin.com/in/gulshan-sahu
                            </a>
                          </span>
                          <span className="text-slate-800">
                            Portfolio:{" "}
                            <a
                              href="https://sahu-gulshan.github.io/Portfolio/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 hover:underline font-semibold"
                            >
                              sahu-gulshan.github.io/Portfolio
                            </a>
                          </span>
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-[12px] sm:text-[12.5px] text-slate-700 leading-[1.65] text-justify font-normal">
                        Strategic and data-driven <strong>Product Manager</strong> with 5+ years of experience launching AI-powered enterprise products and analytics solutions. Expert in bridging Business Strategy, AI/ML capabilities, and User Experience to deliver scalable products for Fortune 500 clients. Proven track record of leading cross-functional Agile pods, translating complex business requirements into prioritised roadmaps, and driving measurable Go-To-Market success. Adept at leveraging data visualisation, generative AI, and continuous product discovery to optimise ROI, reduce operational friction, and scale user engagement.
                      </p>

                      {/* Skills & Other */}
                      <div className="space-y-2">
                        <h3 className="text-[12px] font-bold text-[#d1651c] tracking-wider uppercase border-b border-slate-300 pb-1 leading-snug">
                          SKILLS & OTHER
                        </h3>
                        <ul className="space-y-1.5 text-[12px] leading-[1.65] text-slate-700 list-disc list-outside ml-4">
                          <li><strong className="font-semibold text-slate-900">Product Management:</strong> Product Strategy, Roadmapping, Requirement Gathering, Feature Prioritisation, Product Lifecycle Management, Agile & Scrum, User Story Development, OKRs, Stakeholder Management, Cross-functional Collaboration, Market Analysis, Go-To-Market (GTM)</li>
                          <li><strong className="font-semibold text-slate-900">Analytics & Data:</strong> Power BI, Tableau, SQL, Google Analytics, A/B Testing, KPI Tracking & Dashboards, Data-Driven Decision Making, Performance Metrics (DAU/MAU)</li>
                          <li><strong className="font-semibold text-slate-900">AI / GenAI:</strong> AI Chatbot Development, Prompt Engineering, ChatGPT, Claude, Gemini, Midjourney, Dall-E</li>
                          <li><strong className="font-semibold text-slate-900">UX & Research:</strong> User Research, Usability Testing, Wireframing, Prototyping, Information Architecture, Design Thinking, Figma, Adobe XD</li>
                          <li><strong className="font-semibold text-slate-900">Tools:</strong> JIRA, Confluence, Azure DevOps Board, Asana</li>
                        </ul>
                      </div>

                      {/* Professional Experience */}
                      <div className="space-y-3">
                        <h3 className="text-[12px] font-bold text-[#d1651c] tracking-wider uppercase border-b border-slate-300 pb-1 leading-snug">
                          PROFESSIONAL EXPERIENCE
                        </h3>

                        {/* Mu-Sigma */}
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-baseline justify-between gap-1">
                            <div>
                              <span className="font-bold text-[12.5px] text-slate-900">Product Manager-</span>{" "}
                              <span className="italic text-[#b85311] text-[12.5px] font-semibold">Mu-Sigma, Bengaluru</span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-normal">NOV 2022 – Present</span>
                          </div>
                          <ul className="list-disc list-outside ml-4 space-y-1.5 text-[12px] leading-[1.65] text-slate-700">
                            <li>Own the end-to-end product lifecycle for 5+ enterprise tools; led migration from legacy systems to modern UX, <strong className="font-semibold text-slate-900">cutting usability friction by 23% and lifting feature adoption 19%</strong> within the first quarter of launch.</li>
                            <li>Partnered with VP-level stakeholders to define product roadmaps; led a cross-functional squad of 7 (2 designers, 3 data scientists, 2 developers), <strong className="font-semibold text-slate-900">improving delivery velocity by 20%</strong> by standardising a design system and automating hand-off protocols.</li>
                            <li>Run user research, usability testing, and heuristic evaluations that inform product decisions, <strong className="font-semibold text-slate-900">reducing usability issues by 21%</strong> and improving user engagement.</li>
                            <li>Used <strong className="font-semibold text-slate-900">A/B testing</strong> to validate design and feature decisions, and aligned squad priorities to team OKRs to keep delivery focused on business-critical outcomes.</li>
                            <li>Defined business requirements for executive-level Power BI, React, Angular and Tableau dashboards, empowering leadership to monitor <strong className="font-semibold text-slate-900">real-time KPIs</strong>, track risk signals, and make data-driven operational decisions.</li>
                            <li>Built stakeholder trust through transparent communication and consultative problem-solving, <strong className="font-semibold text-slate-900">growing analytics tool adoption across product teams by 28%</strong>.</li>
                          </ul>

                          {/* Key Project Initiatives */}
                          <div className="mt-3 pt-1 space-y-2">
                            <p className="text-[12px] font-bold text-slate-900">Key Project Initiatives & Business Impact</p>
                            
                            <div className="text-[12px] leading-[1.6] space-y-0.5 text-slate-700 border-l-2 border-[#d1651c] pl-3 py-1 bg-slate-50/70 rounded-r">
                              <p className="font-bold text-slate-900">A. iOS AI Chatbot for a defence firm</p>
                              <p><strong className="font-semibold text-slate-900">Problem:</strong> High volume of routine internal support tickets causing operational bottlenecks.</p>
                              <p><strong className="font-semibold text-slate-900">Objective:</strong> Automate support workflows and improve employee access to information.</p>
                              <p><strong className="font-semibold text-slate-900">Approach:</strong> Defined requirements for an LLM-powered chatbot, collaborated with ML engineers on prompt tuning, and launched an MVP focused on core queries.</p>
                              <p className="text-slate-900"><strong className="font-semibold text-slate-900">Outcome:</strong> Boosted Daily Active Users (DAU) by 37% and successfully reduced manual support ticket volume by 28%.</p>
                            </div>

                            <div className="text-[12px] leading-[1.6] space-y-0.5 text-slate-700 border-l-2 border-[#d1651c] pl-3 py-1 bg-slate-50/70 rounded-r">
                              <p className="font-bold text-slate-900">B. Retail Marketing Mix Models (MMM)</p>
                              <p><strong className="font-semibold text-slate-900">Problem:</strong> Enterprise retail clients struggled with suboptimal, multi-million dollar budget allocations.</p>
                              <p><strong className="font-semibold text-slate-900">Objective:</strong> Build a data visualisation product to guide optimised spend.</p>
                              <p><strong className="font-semibold text-slate-900">Approach:</strong> Architected the product roadmap for a predictive analytics dashboard, prioritising features that highlighted actionable spend adjustments.</p>
                              <p className="text-slate-900"><strong className="font-semibold text-slate-900">Outcome:</strong> Delivered a 15% lift in measurable ROI for key retail clients.</p>
                            </div>

                            <div className="text-[12px] leading-[1.6] space-y-0.5 text-slate-700 border-l-2 border-[#d1651c] pl-3 py-1 bg-slate-50/70 rounded-r">
                              <p className="font-bold text-slate-900">C. Membership 360 Loyalty Platform</p>
                              <p><strong className="font-semibold text-slate-900">Problem:</strong> Low customer engagement and retention on a legacy loyalty platform.</p>
                              <p><strong className="font-semibold text-slate-900">Objective:</strong> Increase platform stickiness and user lifecycle value.</p>
                              <p><strong className="font-semibold text-slate-900">Approach:</strong> Mapped customer journeys and integrated data-driven loyalty triggers to personalise the user experience based on behavioural analytics.</p>
                              <p className="text-slate-900"><strong className="font-semibold text-slate-900">Outcome:</strong> Increased overall platform retention and active user engagement by 20%.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PAGE 2 */}
                    <div className="cv-document-sheet bg-white text-slate-900 rounded-sm shadow-2xl p-8 sm:p-12 text-[12px] sm:text-[12.5px] leading-relaxed space-y-5 select-text border border-slate-200">
                      
                      {/* Section Header */}
                      <h3 className="text-[12px] font-bold text-[#d1651c] tracking-wider uppercase border-b border-slate-300 pb-1 leading-snug">
                        PROFESSIONAL EXPERIENCE (CONTINUED)
                      </h3>

                      {/* Operations & Customer Experience Manager */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-1">
                          <div>
                            <span className="font-bold text-[12.5px] text-slate-900">Operations & Customer Experience Manager-</span>{" "}
                            <span className="italic text-[#b85311] text-[12.5px] font-semibold">Freelance, Raipur</span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-normal">Oct 2020 – Oct 2022</span>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-1.5 text-[12px] leading-[1.65] text-slate-700">
                          <li>Managed the end-to-end lifecycle and execution of <strong className="font-semibold text-slate-900">40+ complex, high-scale events</strong>, defining client requirements and prioritising resources to ensure seamless delivery.</li>
                          <li>Optimised vendor logistics and cross-functional workflows, establishing operational efficiencies that directly drove a <strong className="font-semibold text-slate-900">15% increase in client retention and referral rates</strong>.</li>
                          <li>Executed market research and targeted audience engagement strategies to elevate brand identity and <strong className="font-semibold text-slate-900">maximise customer satisfaction</strong>.</li>
                        </ul>
                      </div>

                      {/* Sales Executive */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-1">
                          <div>
                            <span className="font-bold text-[12.5px] text-slate-900">Sales Executive-</span>{" "}
                            <span className="italic text-[#b85311] text-[12.5px] font-semibold">Aakaar Medical Technologies, Hyderabad</span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-normal">Mar 2020 – Sep 2020</span>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-1.5 text-[12px] leading-[1.65] text-slate-700">
                          <li>Partnered with 50+ B2B medical clients to conduct customer discovery, identifying critical <strong className="font-semibold text-slate-900">business pain points</strong> and mapping them to tailored product solutions.</li>
                          <li>Analysed market trends and competitive landscapes to refine Go-To-Market sales strategies, successfully <strong className="font-semibold text-slate-900">accelerating new product adoption by 10%</strong>.</li>
                          <li>Influenced key decision-makers through strategic product demonstrations, securing long-term stakeholder <strong className="font-semibold text-slate-900">buy-in and loyalty</strong>.</li>
                        </ul>
                      </div>

                      {/* Assistant */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-1">
                          <div>
                            <span className="font-bold text-[12.5px] text-slate-900">Assistant-</span>{" "}
                            <span className="italic text-[#b85311] text-[12.5px] font-semibold">Oberoi Hotels & Resorts</span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-normal">Sep 2016 – Mar 2017</span>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-1.5 text-[12px] leading-[1.65] text-slate-700">
                          <li>Analysed customer feedback data to identify service bottlenecks, proactively implementing process improvements that enhanced the end-to-end user journey.</li>
                          <li><strong className="font-semibold text-slate-900">Improved customer satisfaction metrics by 10%</strong> through meticulous attention to detail and rapid resolution of operational escalations.</li>
                        </ul>
                      </div>

                      {/* EDUCATION */}
                      <div className="space-y-2 pt-1">
                        <h3 className="text-[12px] font-bold text-[#d1651c] tracking-wider uppercase border-b border-slate-300 pb-1 leading-snug">
                          EDUCATION
                        </h3>
                        <div className="space-y-1.5 text-[12px] leading-[1.6] text-slate-700">
                          <div className="flex flex-wrap justify-between gap-1">
                            <div>
                              <span className="font-bold text-slate-900">Post Graduation Diploma in Management, Marketing-</span>{" "}
                              <span className="italic text-[#b85311] font-semibold">Universal Business School, Mumbai</span>
                            </div>
                            <span className="font-semibold text-slate-500 text-[11px]">2018–2020</span>
                          </div>
                          <div className="flex flex-wrap justify-between gap-1">
                            <div>
                              <span className="font-bold text-slate-900">Bachelor of Science in H & HA-</span>{" "}
                              <span className="italic text-[#b85311] font-semibold">Institute of Hotel Management, Goa</span>
                            </div>
                            <span className="font-semibold text-slate-500 text-[11px]">2013–2016</span>
                          </div>
                        </div>
                      </div>

                      {/* CERTIFICATIONS */}
                      <div className="space-y-2 pt-1">
                        <h3 className="text-[12px] font-bold text-[#d1651c] tracking-wider uppercase border-b border-slate-300 pb-1 leading-snug">
                          CERTIFICATIONS
                        </h3>
                        <ul className="space-y-1 text-[12px] leading-[1.6] text-slate-700 list-disc list-outside ml-4">
                          <li>IBM AI Product Manager Specialisation</li>
                          <li>Generative AI for Product Managers Specialisation</li>
                          <li>Google UX Design</li>
                          <li>UI/UX Specialisation, California School of Arts</li>
                          <li>Figma UI/UX Design Essentials</li>
                          <li>Digital Marketing</li>
                          <li>Google Analytics Basics</li>
                        </ul>
                      </div>

                      {/* ACHIEVEMENTS */}
                      <div className="space-y-2 pt-1">
                        <h3 className="text-[12px] font-bold text-[#d1651c] tracking-wider uppercase border-b border-slate-300 pb-1 leading-snug">
                          ACHIEVEMENTS
                        </h3>
                        <ul className="space-y-1 text-[12px] leading-[1.6] text-slate-700 list-disc list-outside ml-4">
                          <li><strong className="font-semibold text-slate-900">Spot Award, Mu-Sigma:</strong> Recognised for designing high-quality UI mock-ups.</li>
                          <li><strong className="font-semibold text-slate-900">Sales Achievement, HUL:</strong> Exceeded internship sales target by 130%.</li>
                          <li><strong className="font-semibold text-slate-900">Research Publication:</strong> CSR & Brand Equity Study (Int. Journal of Mgmt & Social Sciences)</li>
                        </ul>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card/90 px-4 sm:px-6 py-2.5 text-xs text-muted-foreground shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[0.68rem]">
                  Gulshan Sahu CV · Updated 2026
                </span>
                <span className="hidden md:inline-block text-[0.68rem] text-muted-foreground/60">
                  (Shortcuts: <kbd className="font-mono bg-muted px-1 py-0.2 rounded text-[0.65rem]">Ctrl/⌘ +</kbd> / <kbd className="font-mono bg-muted px-1 py-0.2 rounded text-[0.65rem]">-</kbd> to zoom)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenPdf}
                  className="font-mono text-[0.68rem] text-accent hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Maximize2 className="size-3" />
                  <span>Open PDF in New Tab</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

