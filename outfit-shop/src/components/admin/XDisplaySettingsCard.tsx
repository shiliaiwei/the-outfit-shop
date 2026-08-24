"use client";

import React, { useState } from "react";
import { useTheme, X_ACCENT_COLORS, XThemeBackground, XAccentColor } from "@/context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

export function XDisplaySettingsCard() {
  const { themeBg, accentColor, setThemeBg, setAccentColor, fontSizeLevel, setFontSizeLevel } = useTheme();
  const [useSystemSetting, setUseSystemSetting] = useState(false);

  return (
    <div className="liquid-glass p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-border shadow-xl space-y-6">
      {/* 1. Header */}
      <div>
        <h3 className="text-xl sm:text-2xl font-black text-text tracking-tight">Display Settings</h3>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Manage your font size, color, and background. These settings affect your OUTFIT workspace on this browser.
        </p>
      </div>

      {/* 2. Interactive Preview Post Capsule */}
      <div className="p-4 rounded-2xl border border-border bg-[var(--surface-sub)]/60 flex items-start gap-3.5 transition-all">
        <img
          src="/OutFIT/OutFIT.svg"
          alt="OUTFIT"
          className="h-10 w-auto object-contain shrink-0"
        />
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-text text-sm sm:text-base">史力爱卫</span>
            <span className="text-text-muted text-xs sm:text-sm font-mono">@shiliaiwei &bull; 10m</span>
          </div>
          <p className="text-xs sm:text-sm text-text leading-relaxed font-sans">
            At the heart of OUTFIT are luxury collections and real-time commerce — just like this one — which include tailorings, stock transfers, instant KHQR checkout, and telemetry mentions like{" "}
            <span className="font-bold cursor-pointer hover:underline" style={{ color: accentColor }}>
              @OUTFIT
            </span>
            .
          </p>
        </div>
      </div>

      {/* 3. Font Size Slider */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-muted">Font size</h4>
        <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[var(--surface-sub)]/50 border border-border">
          <span className="text-xs font-bold text-text shrink-0">Aa</span>
          <div className="relative flex-1 flex items-center">
            {/* Track Line */}
            <div className="h-1 w-full rounded-full bg-border" />
            <div
              className="absolute h-1 rounded-full transition-all"
              style={{
                backgroundColor: accentColor,
                width: `${(fontSizeLevel / 4) * 100}%`,
              }}
            />

            {/* 5 Step Dots */}
            <div className="absolute inset-0 flex justify-between items-center">
              {[0, 1, 2, 3, 4].map((step) => {
                const active = step === fontSizeLevel;
                const passed = step <= fontSizeLevel;
                return (
                  <button
                    key={step}
                    onClick={() => setFontSizeLevel(step)}
                    className={cn(
                      "h-3.5 w-3.5 rounded-full transition-all cursor-pointer border-2 z-10",
                      active
                        ? "h-5 w-5 border-white shadow-md scale-110"
                        : passed
                        ? "border-transparent"
                        : "border-transparent bg-border"
                    )}
                    style={{
                      backgroundColor: passed ? accentColor : undefined,
                    }}
                    title={`Font Size Level ${step + 1}`}
                  />
                );
              })}
            </div>
          </div>
          <span className="text-lg font-bold text-text shrink-0">Aa</span>
        </div>
      </div>

      {/* 4. Color Swatches */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-muted">Color</h4>
        <div className="flex items-center justify-between gap-2 p-3 sm:p-4 rounded-2xl bg-[var(--surface-sub)]/50 border border-border overflow-x-auto">
          {X_ACCENT_COLORS.map((col) => {
            const isSelected = accentColor.toLowerCase() === col.hex.toLowerCase();
            return (
              <button
                key={col.name}
                onClick={() => setAccentColor(col.hex)}
                className="group relative h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0 shadow-sm"
                style={{ backgroundColor: col.hex }}
                title={`Accent: ${col.name} (${col.hex})`}
              >
                {isSelected && (
                  <FontAwesomeIcon icon={faCheck} className="text-white text-sm sm:text-base drop-shadow-sm animate-in zoom-in-50 duration-150" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Background Modes */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-muted">Background</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Default (Light) */}
          <button
            onClick={() => setThemeBg("default")}
            className={cn(
              "p-4 sm:p-5 rounded-2xl flex items-center justify-center gap-3 cursor-pointer transition-all border-2 text-left bg-white text-black shadow-sm",
              themeBg === "default"
                ? "ring-1"
                : "border-transparent opacity-85 hover:opacity-100"
            )}
            style={{
              borderColor: themeBg === "default" ? accentColor : "transparent",
            }}
          >
            <div
              className={cn(
                "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                themeBg === "default" ? "border-transparent text-white" : "border-black/30"
              )}
              style={{
                backgroundColor: themeBg === "default" ? accentColor : "transparent",
              }}
            >
              {themeBg === "default" && <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
            </div>
            <span className="font-bold text-sm sm:text-base text-[#0F1419]">Default</span>
          </button>

          {/* Lights Out (Dark) */}
          <button
            onClick={() => setThemeBg("lights_out")}
            className={cn(
              "p-4 sm:p-5 rounded-2xl flex items-center justify-center gap-3 cursor-pointer transition-all border-2 text-left bg-black text-white shadow-sm",
              themeBg === "lights_out"
                ? "ring-1"
                : "border-transparent opacity-85 hover:opacity-100"
            )}
            style={{
              borderColor: themeBg === "lights_out" ? accentColor : "transparent",
            }}
          >
            <div
              className={cn(
                "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                themeBg === "lights_out" ? "border-transparent text-white" : "border-white/30"
              )}
              style={{
                backgroundColor: themeBg === "lights_out" ? accentColor : "transparent",
              }}
            >
              {themeBg === "lights_out" && <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
            </div>
            <span className="font-bold text-sm sm:text-base text-[#E7E9EA]">Lights out</span>
          </button>
        </div>
      </div>

      {/* 6. System Setting Toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div>
          <p className="text-xs sm:text-sm font-bold text-text">Use system setting</p>
          <p className="text-[11px] sm:text-xs text-text-muted">Your theme will automatically switch based on your device settings</p>
        </div>

        <button
          onClick={() => setUseSystemSetting(!useSystemSetting)}
          className={cn(
            "w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5",
            useSystemSetting ? "bg-[var(--primary)]" : "bg-border"
          )}
          title="Toggle System Setting"
        >
          <div
            className={cn(
              "h-5 w-5 rounded-full bg-white transition-transform shadow-md",
              useSystemSetting ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>
    </div>
  );
}
