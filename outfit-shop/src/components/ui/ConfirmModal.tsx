"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary" | "warning";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={loading ? undefined : onClose}
      />

      {/* Compact Liquid Glass Dialog */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-sm rounded-[4px] border border-border/80 bg-surface/95 p-5 shadow-2xl backdrop-blur-md animate-in zoom-in-95 duration-200 space-y-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-tight text-text">
            {title}
          </h3>
          <p className="mt-1.5 text-xs text-text-muted leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 rounded-[2px] border border-border bg-bg/60 py-2 text-[11px] font-bold uppercase tracking-wider text-text hover:bg-bg transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={cn(
              "flex-1 rounded-[2px] py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-all shadow-sm disabled:opacity-50 cursor-pointer",
              variant === "danger" && "bg-danger hover:bg-danger/90",
              variant === "primary" && "bg-primary hover:bg-primary/90",
              variant === "warning" && "bg-warning text-black hover:bg-warning/90"
            )}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
