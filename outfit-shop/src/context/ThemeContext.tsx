"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type XThemeBackground = "default" | "lights_out";
export type XAccentColor = "#1D9BF0" | "#FFD400" | "#F91880" | "#7856FF" | "#FF7A00" | "#00BA7C";

export const X_ACCENT_COLORS: { name: string; hex: XAccentColor }[] = [
  { name: "Blue", hex: "#1D9BF0" },
  { name: "Yellow", hex: "#FFD400" },
  { name: "Pink", hex: "#F91880" },
  { name: "Purple", hex: "#7856FF" },
  { name: "Orange", hex: "#FF7A00" },
  { name: "Green", hex: "#00BA7C" },
];

interface ThemeContextType {
  themeBg: XThemeBackground;
  accentColor: XAccentColor;
  setThemeBg: (bg: XThemeBackground) => void;
  setAccentColor: (color: XAccentColor) => void;
  fontSizeLevel: number;
  setFontSizeLevel: (level: number) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeBg: "lights_out",
  accentColor: "#1D9BF0",
  setThemeBg: () => {},
  setAccentColor: () => {},
  fontSizeLevel: 2,
  setFontSizeLevel: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeBg, setThemeBgState] = useState<XThemeBackground>("lights_out");
  const [accentColor, setAccentColorState] = useState<XAccentColor>("#1D9BF0");
  const [fontSizeLevel, setFontSizeLevelState] = useState<number>(2);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBg = localStorage.getItem("outfit_x_bg") as XThemeBackground | null;
      const storedColor = localStorage.getItem("outfit_x_color") as XAccentColor | null;
      const storedFont = localStorage.getItem("outfit_x_font");

      if (storedBg === "default" || storedBg === "lights_out") {
        setThemeBgState(storedBg);
      }
      if (storedColor && X_ACCENT_COLORS.some((c) => c.hex === storedColor)) {
        setAccentColorState(storedColor);
      }
      if (storedFont) {
        setFontSizeLevelState(Number(storedFont) || 2);
      }
    }
  }, []);

  const setThemeBg = (bg: XThemeBackground) => {
    setThemeBgState(bg);
    if (typeof window !== "undefined") {
      localStorage.setItem("outfit_x_bg", bg);
      document.documentElement.setAttribute("data-theme-bg", bg);
    }
  };

  const setAccentColor = (color: XAccentColor) => {
    setAccentColorState(color);
    if (typeof window !== "undefined") {
      localStorage.setItem("outfit_x_color", color);
      document.documentElement.style.setProperty("--x-accent", color);
      document.documentElement.style.setProperty("--primary", color);
    }
  };

  const setFontSizeLevel = (level: number) => {
    setFontSizeLevelState(level);
    if (typeof window !== "undefined") {
      localStorage.setItem("outfit_x_font", String(level));
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme-bg", themeBg);
      document.documentElement.style.setProperty("--x-accent", accentColor);
      document.documentElement.style.setProperty("--primary", accentColor);
    }
  }, [themeBg, accentColor]);

  return (
    <ThemeContext.Provider
      value={{
        themeBg,
        accentColor,
        setThemeBg,
        setAccentColor,
        fontSizeLevel,
        setFontSizeLevel,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
