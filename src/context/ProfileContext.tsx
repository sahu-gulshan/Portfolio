import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { site as defaultSite } from "@/data/site";
import { PORTRAIT_IMAGE } from "@/data/portraitBase64";

export interface ProfileData {
  name: string;
  first: string;
  role: string;
  positioning: string;
  location: string;
  email: string;
  linkedin: string;
  phone: string;
  portrait: string;
  resume: string;
  description: string;
  heroHeadline: string;
  statusNote: string;
  yearsExperience: string;
  accentColor: string;
  customBio: string;
}

export const ACCENT_PRESETS = [
  { id: "orange", name: "Burnt Orange", hex: "#d1651c", lightHex: "#d1651c" },
  { id: "blue", name: "Electric Blue", hex: "#38bdf8", lightHex: "#0284c7" },
  { id: "emerald", name: "Terminal Emerald", hex: "#34d399", lightHex: "#059669" },
  { id: "violet", name: "Deep Violet", hex: "#a78bfa", lightHex: "#7c3aed" },
  { id: "rose", name: "Cyberpunk Rose", hex: "#fb7185", lightHex: "#e11d48" },
  { id: "gold", name: "Solar Gold", hex: "#fbbf24", lightHex: "#d97706" },
];

export const AVATAR_PRESETS = [
  {
    id: "default",
    name: "Gulshan (Official)",
    url: PORTRAIT_IMAGE,
  },
  {
    id: "tech-pm",
    name: "Studio Tech Minimalist",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "executive",
    name: "Product Leader Monochrome",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "creative",
    name: "Creative Strategist",
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80",
  },
];

const INITIAL_PROFILE: ProfileData = {
  name: defaultSite.name,
  first: defaultSite.first,
  role: defaultSite.role,
  positioning: defaultSite.positioning,
  location: defaultSite.location,
  email: defaultSite.email,
  linkedin: defaultSite.linkedin,
  phone: defaultSite.phone,
  portrait: PORTRAIT_IMAGE,
  resume: defaultSite.resume,
  description: defaultSite.description,
  heroHeadline:
    defaultSite.heroHeadline ||
    "I build products where AI meets data, UX meets business, and ideas become outcomes.",
  statusNote: defaultSite.statusNote || "Available for Product Manager & Product Roles",
  yearsExperience: defaultSite.yearsExperience || "5+ Years",
  accentColor: "#d1651c",
  customBio: `I'm a Product Manager with 5+ years of experience launching AI-powered enterprise products and analytics solutions — mostly for Fortune 500 clients, where business strategy, ML capability, and user experience have to agree with each other.

At Mu-Sigma, I own the end-to-end lifecycle for 5+ enterprise tools and lead a cross-functional squad of seven: two designers, three data scientists, two developers. I write the requirements, run the research, define the KPI trees, and stay in the room when the trade-offs get uncomfortable.

My route into product was not the standard one. Operations, customer experience, B2B medical sales, a luxury hotel floor. Every one of those jobs was a masterclass in what users do when a system fails them — which is why I don't treat UX and analytics as separate disciplines. They are the same question asked twice.`,
};

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  resetProfile: () => void;
  isPersonalizeOpen: boolean;
  setIsPersonalizeOpen: (open: boolean) => void;
  isResumeOpen: boolean;
  setIsResumeOpen: (open: boolean) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const STORAGE_KEY = "gulshan_portfolio_profile_v10";

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.location && parsed.location.toLowerCase().includes("bengaluru")) {
            parsed.location = "";
          }
          if (parsed.statusNote && parsed.statusNote.includes("Lead PM")) {
            parsed.statusNote = "Available for Product Manager & Product Roles";
          }
          parsed.email = "Gulshan.Sahu@hotmail.com";
          parsed.portrait = PORTRAIT_IMAGE;
          return { ...INITIAL_PROFILE, ...parsed, portrait: PORTRAIT_IMAGE, accentColor: "#d1651c" };
        }
      } catch (e) {
        console.error("Failed to read saved profile", e);
      }
    }
    return { ...INITIAL_PROFILE, portrait: PORTRAIT_IMAGE, accentColor: "#d1651c" };
  });

  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Apply accent color to CSS root variables dynamically
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      const hex = profile.accentColor || "#d1651c";
      root.style.setProperty("--accent", hex);
      root.style.setProperty("--color-accent", hex);
      root.style.setProperty("--ring", hex);
    }
  }, [profile.accentColor]);

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      // Auto-compute first name if full name updated
      if (updates.name && !updates.first) {
        next.first = updates.name.split(" ")[0] || updates.name;
      }
      try {
        // Strip out non-serializable objects if any slipped into updates
        const clean: Record<string, string> = {};
        for (const [k, v] of Object.entries(next)) {
          if (typeof v === "string") {
            clean[k] = v;
          }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      } catch (e) {
        console.error("Failed to save profile", e);
      }
      return next;
    });
  };

  const resetProfile = () => {
    setProfile(INITIAL_PROFILE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear profile", e);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        resetProfile,
        isPersonalizeOpen,
        setIsPersonalizeOpen,
        isResumeOpen,
        setIsResumeOpen,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
