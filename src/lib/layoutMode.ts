export type LayoutMode = "classic" | "editorial";

const LAYOUT_MODE_KEY = "gks_layout_mode";

export function getActiveLayoutMode(): LayoutMode {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(LAYOUT_MODE_KEY) as LayoutMode;
    if (saved === "classic" || saved === "editorial") {
      return saved;
    }
  }
  return "classic"; // default is classic, user can toggle to preview editorial
}

export function setLayoutMode(mode: LayoutMode): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(LAYOUT_MODE_KEY, mode);
    window.dispatchEvent(
      new CustomEvent("gks_layout_mode_changed", { detail: mode })
    );
  }
}
