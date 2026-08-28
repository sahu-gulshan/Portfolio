import { useState, useRef, useEffect, type ChangeEvent } from "react";
import {
  X,
  Sparkles,
  Upload,
  RotateCcw,
  Check,
  Palette,
  User,
  Briefcase,
  Mail,
  MapPin,
  Linkedin,
  FileText,
  Phone,
  Save,
  Download,
} from "lucide-react";
import {
  useProfile,
  ACCENT_PRESETS,
  AVATAR_PRESETS,
  type ProfileData,
} from "@/context/ProfileContext";

export function PersonalizeModal() {
  const { profile, updateProfile, resetProfile, isPersonalizeOpen, setIsPersonalizeOpen } =
    useProfile();

  const [formData, setFormData] = useState<ProfileData>(profile);
  const [activeTab, setActiveTab] = useState<"identity" | "story" | "appearance">("identity");
  const [savedNotice, setSavedNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isPersonalizeOpen) {
      setFormData(profile);
    }
  }, [isPersonalizeOpen, profile]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPersonalizeOpen) {
        handleCloseWithoutSave();
      }
    };
    if (isPersonalizeOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
  }, [isPersonalizeOpen, profile]);

  if (!isPersonalizeOpen) return null;

  const handleCloseWithoutSave = () => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      const hex = profile.accentColor || "#d1651c";
      root.style.setProperty("--accent", hex);
      root.style.setProperty("--color-accent", hex);
      root.style.setProperty("--ring", hex);
    }
    setIsPersonalizeOpen(false);
  };

  const handleTextChange = (key: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === "accentColor" && typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--accent", value);
      root.style.setProperty("--color-accent", value);
      root.style.setProperty("--ring", value);
      window.dispatchEvent(
        new CustomEvent("gks_palette_changed", {
          detail: { accentColor: value },
        })
      );
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, portrait: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile(formData);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setIsPersonalizeOpen(false);
    }, 1200);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `portfolio-profile-${formData.first.toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReset = () => {
    if (confirm("Reset all personalized settings back to original defaults?")) {
      resetProfile();
      setFormData(profile);
      setIsPersonalizeOpen(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="personalize-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
    >
      {/* Backdrop (transparent, no blur) */}
      <div
        onClick={handleCloseWithoutSave}
        className="fixed inset-0 bg-black/30 transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative flex h-[85vh] max-h-[640px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 id="personalize-title" className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">
                Personalize Portfolio
              </h2>
              <p className="text-xs text-muted-foreground">
                Customize your name, contact info, bio, avatar, and brand accent in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              title="Reset to defaults"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-destructive hover:text-destructive transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPersonalizeOpen(false)}
              aria-label="Close modal"
              className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-border bg-secondary/30 px-6 md:px-8">
          <button
            type="button"
            onClick={() => setActiveTab("identity")}
            className={`flex items-center gap-2 border-b-2 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "identity"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="size-4" />
            <span>Profile & Contact</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("story")}
            className={`ml-6 flex items-center gap-2 border-b-2 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "story"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="size-4" />
            <span>Bio & Positioning</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("appearance")}
            className={`ml-6 flex items-center gap-2 border-b-2 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "appearance"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Palette className="size-4" />
            <span>Avatar & Accent</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 space-y-6">
          {/* Identity & Contact Tab */}
          {activeTab === "identity" && (
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="label-mono text-xs font-semibold text-foreground">
                  Full Name
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleTextChange("name", e.target.value)}
                    placeholder="Gulshan Kumar Sahu"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-xs font-semibold text-foreground">
                  First / Display Name
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={formData.first}
                    onChange={(e) => handleTextChange("first", e.target.value)}
                    placeholder="Gulshan"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-xs font-semibold text-foreground">
                  Primary Role / Title
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleTextChange("role", e.target.value)}
                    placeholder="Product Manager"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-xs font-semibold text-foreground">
                  Positioning Keywords
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={formData.positioning}
                    onChange={(e) => handleTextChange("positioning", e.target.value)}
                    placeholder="AI × Data × UX × Business"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="size-3.5 text-accent" />
                  <span>Email Address</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleTextChange("email", e.target.value)}
                    placeholder="gulshan.arun28@gmail.com"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Phone className="size-3.5 text-accent" />
                  <span>Phone Number</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleTextChange("phone", e.target.value)}
                    placeholder="+91 90705 99155"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-accent" />
                  <span>Location</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleTextChange("location", e.target.value)}
                    placeholder="Bengaluru, India"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Linkedin className="size-3.5 text-accent" />
                  <span>LinkedIn Profile URL</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => handleTextChange("linkedin", e.target.value)}
                    placeholder="https://www.linkedin.com/in/gulshan-sahu/"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Story & Bio Tab */}
          {activeTab === "story" && (
            <div className="space-y-5">
              <div>
                <label className="label-mono text-xs font-semibold text-foreground">
                  Hero Headline Pitch
                </label>
                <p className="text-xs text-muted-foreground mb-1.5">
                  The primary punchline displayed prominently in the hero section.
                </p>
                <input
                  type="text"
                  value={formData.heroHeadline}
                  onChange={(e) => handleTextChange("heroHeadline", e.target.value)}
                  placeholder="I build products where AI meets data, UX meets business, and ideas become outcomes."
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-mono text-xs font-semibold text-foreground">
                    Availability / Status Badge
                  </label>
                  <input
                    type="text"
                    value={formData.statusNote}
                    onChange={(e) => handleTextChange("statusNote", e.target.value)}
                    placeholder="Available for Lead PM & Product Roles"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="label-mono text-xs font-semibold text-foreground">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    value={formData.yearsExperience}
                    onChange={(e) => handleTextChange("yearsExperience", e.target.value)}
                    placeholder="5+ Years"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-xs font-semibold text-foreground">
                  Personal About / Bio Narrative
                </label>
                <p className="text-xs text-muted-foreground mb-1.5">
                  Detailed story featured on the About page.
                </p>
                <textarea
                  rows={6}
                  value={formData.customBio}
                  onChange={(e) => handleTextChange("customBio", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-4 text-sm text-foreground outline-none focus:border-accent leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Avatar & Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              {/* Accent Color Palette */}
              <div>
                <label className="label-mono text-xs font-semibold text-foreground flex items-center gap-2">
                  <Palette className="size-4 text-accent" />
                  <span>Accent Color Theme</span>
                </label>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Instantly changes buttons, highlights, badges, and glows across the whole site.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {ACCENT_PRESETS.map((preset) => {
                    const isSelected = formData.accentColor === preset.hex;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleTextChange("accentColor", preset.hex)}
                        className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all cursor-pointer ${
                          isSelected
                            ? "border-accent bg-accent/10 shadow-md ring-2 ring-accent"
                            : "border-border bg-background hover:border-accent/60"
                        }`}
                      >
                        <span
                          className="size-8 rounded-full border border-white/20 shadow-inner"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span className="text-xs font-medium text-foreground">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Headshot / Avatar Selector */}
              <div className="border-t border-border pt-6">
                <label className="label-mono text-xs font-semibold text-foreground">
                  Headshot / Portrait Image
                </label>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Upload your own photo or choose a preset style.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-card p-1 shadow-lg">
                    <img
                      src={formData.portrait}
                      alt="Avatar preview"
                      referrerPolicy="no-referrer"
                      className="size-full rounded-xl object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
                      >
                        <Upload className="size-3.5" />
                        <span>Upload Photo</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        value={formData.portrait}
                        onChange={(e) => handleTextChange("portrait", e.target.value)}
                        placeholder="Paste image URL here..."
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AVATAR_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleTextChange("portrait", p.url)}
                      className={`flex items-center gap-2.5 rounded-xl border p-2 text-left transition-all cursor-pointer ${
                        formData.portrait === p.url
                          ? "border-accent bg-accent/10 text-accent font-semibold"
                          : "border-border bg-background text-muted-foreground hover:border-accent hover:text-foreground"
                      }`}
                    >
                      <img src={p.url} alt={p.name} referrerPolicy="no-referrer" className="size-8 rounded-lg object-cover" />
                      <span className="text-xs truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-secondary/20 px-6 py-4 md:px-8">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>Export Configuration JSON</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPersonalizeOpen(false)}
              className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 shadow-md shadow-accent/20 cursor-pointer"
            >
              {savedNotice ? (
                <>
                  <Check className="size-4" />
                  <span>Applied!</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>Save & Apply</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
