"use client";

import { useEffect } from "react";

interface ShortcutConfig {
  key: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input unless it's an F-key
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName);
      const isFKey = e.key.startsWith("F");

      if (isInput && !isFKey) return;

      const shortcut = shortcuts.find(s => s.key === e.key);
      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
