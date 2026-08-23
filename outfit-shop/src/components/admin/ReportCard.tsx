"use client";

import { LucideIcon, TrendingUp, TrendingDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number; // e.g. 5.2 for +5.2%
  icon?: LucideIcon;
  loading?: boolean;
  className?: string;
}

export function ReportCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  loading,
  className
}: ReportCardProps) {
  const isPositive = change && change > 0;

  if (loading) {
    return (
      <div className={cn("rounded-card border border-border bg-surface p-6 animate-pulse", className)}>
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-24 bg-bg rounded"></div>
          <div className="h-8 w-8 bg-bg rounded"></div>
        </div>
        <div className="h-8 w-32 bg-bg rounded mb-2"></div>
        <div className="h-3 w-16 bg-bg rounded"></div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-card border border-border bg-surface p-6 shadow-sm hover:border-primary/20 transition-colors", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-text uppercase tracking-widest">{title}</h3>
        {Icon ? (
            <div className="p-2 bg-bg rounded-[2px] text-primary">
                <Icon size={18} />
            </div>
        ) : (
            <Info size={16} className="text-text-muted opacity-40" />
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-text font-mono leading-none">
          {value}
        </span>
        {change !== undefined && (
          <div className={cn(
            "flex items-center text-[10px] font-black uppercase px-1.5 py-0.5 rounded-[2px]",
            isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          )}>
            {isPositive ? <TrendingUp size={10} className="mr-1" /> : <TrendingDown size={10} className="mr-1" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-[10px] text-text-muted mt-2 uppercase font-mono tracking-tighter">
          {subtitle}
        </p>
      )}
    </div>
  );
}
