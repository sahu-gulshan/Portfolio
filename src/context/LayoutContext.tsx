import React, { createContext, useContext, useState, useEffect } from "react";
import { getActiveLayoutMode, setLayoutMode as saveLayoutMode, type LayoutMode } from "@/lib/layoutMode";

interface LayoutContextType {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  isEditorial: boolean;
}

const LayoutContext = createContext<LayoutContextType>({
  layoutMode: "classic",
  setLayoutMode: () => {},
  isEditorial: false,
});

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [layoutMode, setModeState] = useState<LayoutMode>(() => getActiveLayoutMode());

  useEffect(() => {
    const handleLayoutChange = (e: Event) => {
      const customEvent = e as CustomEvent<LayoutMode>;
      if (customEvent.detail) {
        setModeState(customEvent.detail);
      }
    };
    window.addEventListener("gks_layout_mode_changed", handleLayoutChange);
    return () => window.removeEventListener("gks_layout_mode_changed", handleLayoutChange);
  }, []);

  const setLayoutMode = (mode: LayoutMode) => {
    setModeState(mode);
    saveLayoutMode(mode);
  };

  return (
    <LayoutContext.Provider
      value={{
        layoutMode,
        setLayoutMode,
        isEditorial: layoutMode === "editorial",
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout(): LayoutContextType {
  return useContext(LayoutContext);
}
