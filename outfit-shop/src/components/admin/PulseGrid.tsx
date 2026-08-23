"use client";

import { cn } from "@/lib/utils";
import { Activity, Server, Database, Globe } from "lucide-react";

interface Service {
  name: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  latency_ms: number | null;
}

interface PulseGridProps {
  services: Service[];
  loading?: boolean;
}

export function PulseGrid({ services, loading }: PulseGridProps) {
  const getIcon = (name: string) => {
    if (name.toLowerCase().includes("database")) return Database;
    if (name.toLowerCase().includes("api")) return Globe;
    return Server;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-card border border-border bg-surface"></div>
        ))
      ) : (
        services.map((service) => {
          const Icon = getIcon(service.name);
          return (
            <div key={service.name} className="rounded-card border border-border bg-surface p-4 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-[2px] border transition-colors",
                  service.status === "ONLINE" ? "bg-success/10 text-success border-success/20" :
                  service.status === "DEGRADED" ? "bg-warning/10 text-warning border-warning/20" :
                  "bg-danger/10 text-danger border-danger/20"
                )}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-text uppercase tracking-widest">{service.name}</p>
                  <p className={cn(
                    "text-[8px] font-mono font-bold mt-0.5",
                    service.status === "ONLINE" ? "text-success" : "text-danger"
                  )}>{service.status}</p>
                </div>
              </div>

              {service.latency_ms !== null && (
                <div className="text-right">
                  <p className="text-[10px] font-mono font-bold text-text-muted">{service.latency_ms}ms</p>
                  <Activity size={12} className={cn(
                    "ml-auto mt-0.5",
                    service.latency_ms > 100 ? "text-warning" : "text-success"
                  )} />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
