/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Nav, type NavTab } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BottomRightControls } from "@/components/BottomRightControls";
// Direct static import for HomeView (critical rendering path)
import { HomeView } from "@/components/views/HomeView";

// Code-split secondary views & case studies
const WorkView = lazy(() => import("@/components/views/WorkView").then(m => ({ default: m.WorkView })));
const AboutView = lazy(() => import("@/components/views/AboutView").then(m => ({ default: m.AboutView })));
const ExperienceView = lazy(() => import("@/components/views/ExperienceView").then(m => ({ default: m.ExperienceView })));
const ContactView = lazy(() => import("@/components/views/ContactView").then(m => ({ default: m.ContactView })));
const CaseStudyView = lazy(() => import("@/components/case/CaseStudyView").then(m => ({ default: m.CaseStudyView })));

// Lazy load heavy interactive modals
const AiPmAssistantModal = lazy(() => import("@/components/sections/AiPmAssistantModal").then(m => ({ default: m.AiPmAssistantModal })));
const RoleMatcherModal = lazy(() => import("@/components/ai/RoleMatcherModal").then(m => ({ default: m.RoleMatcherModal })));
const AiCommandPalette = lazy(() => import("@/components/ai/AiCommandPalette").then(m => ({ default: m.AiCommandPalette })));
const ResumeModal = lazy(() => import("@/components/ResumeModal").then(m => ({ default: m.ResumeModal })));
const PersonalizeModal = lazy(() => import("@/components/PersonalizeModal").then(m => ({ default: m.PersonalizeModal })));

import { track, initGoogleAnalytics, trackPageView } from "@/lib/analytics";
import { ProfileProvider, useProfile } from "@/context/ProfileContext";
import { RoamingPhotonBalls } from "@/components/RoamingPhotonBalls";
import { getProject } from "@/data/projects";
import { getActiveColorPalette, getAccentForeground } from "@/lib/colorPalettes";

export default function App() {
  return (
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  );
}

function parseHashRoute(): { tab: NavTab; slug: string | null } {
  if (typeof window === "undefined") return { tab: "home", slug: null };

  const rawHash = window.location.hash.replace(/^#\/?/, "").trim();
  if (rawHash) {
    const parts = rawHash.split("/").filter(Boolean);
    const tabPart = parts[0]?.toLowerCase() as NavTab;
    const slugPart = parts[1] || null;

    if (tabPart === "work") {
      if (slugPart) {
        const proj = getProject(slugPart);
        return { tab: "work", slug: proj ? proj.slug : slugPart };
      }
      return { tab: "work", slug: null };
    }

    // Direct project hash check (e.g. #marketing-mix-models or #membership-360 or #ai-chatbot)
    const directProj = getProject(rawHash);
    if (directProj) {
      return { tab: "work", slug: directProj.slug };
    }

    if (["home", "work", "about", "experience", "contact"].includes(tabPart)) {
      return { tab: tabPart, slug: null };
    }
  }

  // Without an explicit URL hash, check if there was a saved active tab in session
  try {
    const savedTab = sessionStorage.getItem("portfolio_active_tab") as NavTab | null;
    const savedSlug = sessionStorage.getItem("portfolio_active_slug");
    if (savedTab && ["home", "work", "about", "experience", "contact"].includes(savedTab)) {
      return { tab: savedTab, slug: savedTab === "work" ? savedSlug : null };
    }
  } catch {}

  return { tab: "home", slug: null };
}

function AppContent() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("portfolio_theme");
      if (stored === "light" || stored === "dark") return stored;
    }
    return "dark";
  });

  const [route, setRoute] = useState<{ tab: NavTab; slug: string | null }>(parseHashRoute);
  const activeTab = route.tab;
  const activeProjectSlug = route.slug;

  const { profile } = useProfile();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isRoleMatcherOpen, setIsRoleMatcherOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const handleOpenAiAssistant = (source = "unknown") => {
    track("open_ai_assistant", { trigger: source });
    setIsAiModalOpen(true);
  };

  const handleOpenRoleMatcher = (source = "unknown") => {
    track("open_role_matcher", { trigger: source });
    setIsRoleMatcherOpen(true);
  };

  const handleOpenCommandPalette = (source = "unknown") => {
    track("open_ai_command_palette", { trigger: source });
    setIsCommandPaletteOpen(true);
  };

  // Initialize Google Analytics (GA4) if Measurement ID is present
  useEffect(() => {
    initGoogleAnalytics();
  }, []);

  // Track pageviews on route / case-study change
  useEffect(() => {
    const pagePath = activeTab === "work" && activeProjectSlug 
      ? `/work/${activeProjectSlug}` 
      : `/${activeTab === "home" ? "" : activeTab}`;
    const pageTitle = activeProjectSlug ? `Gulshan Sahu · Case Study (${activeProjectSlug})` : `Gulshan Sahu · Lead Product Manager`;
    trackPageView(pagePath, pageTitle);
  }, [activeTab, activeProjectSlug]);

  // Global keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => {
          const next = !prev;
          if (next) {
            track("open_ai_command_palette", { trigger: "keyboard_shortcut" });
          }
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [paletteVer, setPaletteVer] = useState(0);

  useEffect(() => {
    const handlePaletteChange = () => setPaletteVer((v) => v + 1);
    window.addEventListener("gks_palette_changed", handlePaletteChange);
    return () => {
      window.removeEventListener("gks_palette_changed", handlePaletteChange);
    };
  }, []);

  // Synchronize accent colors: case study specific teal colors when inside a case study, active palette elsewhere
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    if (activeTab === "work" && activeProjectSlug) {
      const proj = getProject(activeProjectSlug);
      if (proj && proj.theme) {
        const isLight = theme === "light";
        const accentHex = isLight ? proj.theme.accentLight : proj.theme.accent;
        const accentFgHex = isLight
          ? proj.theme.accentLightForeground || "#ffffff"
          : proj.theme.accentForeground || "#ffffff";
        root.style.setProperty("--accent", accentHex);
        root.style.setProperty("--color-accent", accentHex);
        root.style.setProperty("--accent-foreground", accentFgHex);
        root.style.setProperty("--ring", accentHex);
        return;
      }
    }

    const activePalette = getActiveColorPalette();
    const isLight = theme === "light";
    const brandAccent = isLight
      ? activePalette.primaryAccent
      : activePalette.primaryAccentDark || activePalette.primaryAccent;
    const accentFg = getAccentForeground(brandAccent);

    root.style.setProperty("--accent", brandAccent);
    root.style.setProperty("--color-accent", brandAccent);
    root.style.setProperty("--accent-foreground", accentFg);
    root.style.setProperty("--ring", brandAccent);
  }, [activeTab, activeProjectSlug, theme, paletteVer]);

  // Handle URL hash changes & browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHashRoute();
      setRoute((prev) => {
        if (prev.tab === parsed.tab && prev.slug === parsed.slug) return prev;
        return parsed;
      });
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  // Save session state & handle scroll positions safely
  useEffect(() => {
    sessionStorage.setItem("portfolio_active_tab", activeTab);
    if (activeProjectSlug) {
      sessionStorage.setItem("portfolio_active_slug", activeProjectSlug);
    } else {
      sessionStorage.removeItem("portfolio_active_slug");
    }

    const routeKey = `scroll_pos_${activeTab}_${activeProjectSlug || "root"}`;
    
    // Only start recording scroll position after navigation transition has settled
    let enableScrollSave = false;
    const timer = setTimeout(() => {
      enableScrollSave = true;
    }, 200);

    const handleScroll = () => {
      if (enableScrollSave && window.scrollY > 0) {
        sessionStorage.setItem(routeKey, window.scrollY.toString());
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab, activeProjectSlug]);

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    localStorage.setItem("portfolio_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleNavigate = (tab: NavTab, slug?: string) => {
    const nextSlug = slug ? slug.trim() : null;
    setRoute({ tab, slug: nextSlug });

    // Sync URL hash
    let hashTarget = `#${tab}`;
    if (tab === "work" && nextSlug) {
      hashTarget = `#work/${nextSlug}`;
    }
    if (window.location.hash !== hashTarget) {
      window.location.hash = hashTarget;
    }

    // Reset scroll to top for fresh explicit navigation
    sessionStorage.removeItem(`scroll_pos_${tab}_${nextSlug || "root"}`);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    });

    track("page_view", { tab, slug: nextSlug ?? undefined });
  };

  // Determine current view key for page transition
  const viewKey = activeTab === "work" && activeProjectSlug ? `work-${activeProjectSlug}` : activeTab;

  // Scroll to top whenever the active view changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [viewKey]);

  // Restrict photon particles and positron conduit animations strictly to the home page
  const isHome = activeTab === "home" && !activeProjectSlug;

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      {/* Kinetic cursor for desktop (Global on all pages) */}
      <Cursor />

      {/* Interactive Quantum Particle System & Positron Conduit (Home page only) */}
      {isHome && <RoamingPhotonBalls />}

      {/* Global spring scroll progress line */}
      <ScrollProgress />

      {/* Header navigation */}
      <Nav
        activeTab={activeTab}
        activeSlug={activeProjectSlug}
        theme={theme}
        onNavigate={handleNavigate}
        onToggleTheme={toggleTheme}
        onOpenAiAssistant={() => handleOpenAiAssistant("nav")}
        onOpenRoleMatcher={() => handleOpenRoleMatcher("nav")}
        onOpenSearch={() => handleOpenAiAssistant("nav_search")}
        onOpenStudio={() => setIsStudioOpen(true)}
      />

      {/* Main page content with macro page transition animations */}
      <main id="main-content" className="relative min-h-[calc(100vh-200px)]">
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
          <motion.div
            key={viewKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === "home" && (
              <HomeView
                onNavigate={handleNavigate}
                onOpenAiAssistant={() => handleOpenAiAssistant("hero_cta")}
              />
            )}

            {activeTab === "work" && !activeProjectSlug && (
              <WorkView onNavigate={handleNavigate} />
            )}

            {activeTab === "work" && activeProjectSlug && (
              <CaseStudyView
                slug={activeProjectSlug}
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === "about" && (
              <AboutView onNavigate={handleNavigate} />
            )}

            {activeTab === "experience" && (
              <ExperienceView onNavigate={handleNavigate} />
            )}

            {activeTab === "contact" && <ContactView />}
          </motion.div>
        </Suspense>
      </main>

      {/* Dedicated Floating Bottom-Right Stacked Controls: Tune Into Flow & Studio */}
      <BottomRightControls
        isStudioOpen={isStudioOpen}
        onStudioOpen={() => setIsStudioOpen(true)}
        onStudioClose={() => setIsStudioOpen(false)}
        onStudioToggle={() => setIsStudioOpen((v) => !v)}
      />

      <Suspense fallback={null}>
        {/* AI PM Strategy Assistant Modal */}
        <AiPmAssistantModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onNavigateToCase={(slug) => handleNavigate("work", slug)}
        />

        {/* Recruiter Role & Job Description Matcher Modal */}
        <RoleMatcherModal
          isOpen={isRoleMatcherOpen}
          onClose={() => setIsRoleMatcherOpen(false)}
          onNavigateToCase={(slug) => handleNavigate("work", slug)}
        />

        {/* AI Semantic Command Palette (Cmd + K) */}
        <AiCommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigateToCase={(slug) => handleNavigate("work", slug)}
        />

        {/* Profile & Portfolio Personalization Studio Modal */}
        <PersonalizeModal />

        {/* Interactive Resume Document Overlay */}
        <ResumeModal />
      </Suspense>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onToggleTheme={toggleTheme} />
    </div>
  );
}
