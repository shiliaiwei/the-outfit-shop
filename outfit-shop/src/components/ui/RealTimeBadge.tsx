"use client";

import { cn } from "@/lib/utils";

interface RealTimeBadgeProps {
  status?: "active" | "danger" | "success" | "warning";
  label: string;
  className?: string;
}

export function RealTimeBadge({ status = "success", label, className }: RealTimeBadgeProps) {
  const dots = {
    active: "bg-primary",
    danger: "bg-danger",
    success: "bg-success",
    warning: "bg-warning",
  };

  return (
    <div className={cn("inline-flex items-center gap-2 px-3 py-1 liquid-glass bg-white/40", className)}>
      <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.2)]", dots[status])} />
      <span className="text-[9px] font-black uppercase tracking-widest text-text/80">{label}</span>
    </div>
  );
}
