"use client";

import { cn } from "@/lib/utils";

interface LiquidCardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}

export function LiquidCard({ children, className, elevated = false }: LiquidCardProps) {
  return (
    <div className={cn(
      elevated ? "liquid-glass-elevated" : "liquid-glass",
      "p-6 shadow-xl transition-all duration-500",
      className
    )}>
      {children}
    </div>
  );
}
