"use client";

import { cn } from "@/lib/utils";

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "terracotta" | "charcoal" | "glass" | "active";
  size?: "sm" | "md" | "lg";
}

export function LiquidButton({
  children,
  className,
  variant = "glass",
  size = "md",
  ...props
}: LiquidButtonProps) {
  const variants = {
    terracotta: "btn-liquid-terracotta",
    charcoal: "btn-liquid-charcoal",
    glass: "btn-liquid-glass",
    active: "btn-liquid-active",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-5 py-2.5 text-[11px]",
    lg: "px-8 py-3.5 text-[12px]",
  };

  return (
    <button
      className={cn(
        "btn-liquid font-black uppercase tracking-[0.2em]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
