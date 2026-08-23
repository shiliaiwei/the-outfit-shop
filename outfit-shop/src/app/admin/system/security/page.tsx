"use client";

import { useState, useEffect } from "react";
import { securityService } from "@/services/securityService";
import { Guard } from "@/components/auth/Guard";
import { Shield, Clock, Smartphone, Globe, Trash2, LogOut, History } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SecurityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await securityService.getAuditLogs();
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Guard allowedRoles={["ADMIN"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight flex items-center gap-3">
            <Shield className="text-primary" size={28} />
            Security & System Logs
          </h1>
          <p className="text-text-muted text-sm mt-1">Audit immutable events and manage active system sessions</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Audit Timeline */}
          <div className="xl:col-span-2 space-y-4">
             <div className="flex items-center justify-between">
               <h2 className="text-sm font-black text-text uppercase tracking-widest flex items-center gap-2">
                 <History size={16} className="text-text-muted" />
                 Audit Trail
               </h2>
               <button className="text-[10px] font-black uppercase text-primary hover:underline">View Full Archive</button>
             </div>

             <div className="rounded-card border border-border bg-surface shadow-sm overflow-hidden">
               <div className="divide-y divide-border">
                 {loading ? (
                   Array.from({ length: 5 }).map((_, i) => (
                     <div key={i} className="p-4 animate-pulse flex gap-4">
                       <div className="h-10 w-10 rounded-full bg-bg"></div>
                       <div className="flex-1 space-y-2">
                         <div className="h-4 w-1/3 bg-bg rounded"></div>
                         <div className="h-3 w-1/2 bg-bg rounded"></div>
                       </div>
                     </div>
                   ))
                 ) : logs.length === 0 ? (
                   <div className="p-12 text-center text-text-muted italic font-mono">No recent logs recorded.</div>
                 ) : (
                   logs.map((log) => (
                     <div key={log.id} className="p-4 hover:bg-bg/10 transition-colors flex gap-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-bg border border-border flex items-center justify-center text-text-muted">
                           <Clock size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-black text-text uppercase">{log.action}</p>
                            <span className="text-[10px] font-mono text-text-muted">{new Date(log.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-text-muted mt-1 leading-relaxed">
                            <span className="font-bold text-text">@{log.username || "system"}</span> {log.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-text-muted/60 uppercase">
                             <span className="flex items-center gap-1"><Globe size={10} /> {log.ip_address || "internal"}</span>
                             <span>ID: #{log.id}</span>
                          </div>
                        </div>
                     </div>
                   ))
                 )}
               </div>
             </div>
          </div>

          {/* Active Sessions */}
          <div className="space-y-4">
            <h2 className="text-sm font-black text-text uppercase tracking-widest flex items-center gap-2">
              <Smartphone size={16} className="text-text-muted" />
              Active Sessions
            </h2>

            <div className="space-y-3">
               <SessionCard
                 device="MacBook Pro - Chrome"
                 ip="192.168.1.42"
                 location="Phnom Penh, KH"
                 isCurrent={true}
               />
               <SessionCard
                 device="iPhone 15 - Safari"
                 ip="103.21.164.2"
                 location="Paris, FR"
               />
               <button className="w-full rounded-btn border border-danger/30 bg-danger/5 py-3 text-[10px] font-black uppercase text-danger tracking-widest hover:bg-danger/10 transition-all flex items-center justify-center gap-2">
                 <LogOut size={14} />
                 Terminate All Other Sessions
               </button>
            </div>
          </div>
        </div>
      </div>
    </Guard>
  );
}

function SessionCard({ device, ip, location, isCurrent }: any) {
  return (
    <div className={cn(
      "rounded-card border p-4 bg-surface shadow-sm",
      isCurrent ? "border-primary/30" : "border-border"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-bg rounded-[2px] text-text-muted">
             <Smartphone size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text uppercase">{device}</h4>
            <p className="text-[10px] text-text-muted font-mono">{ip} • {location}</p>
          </div>
        </div>
        {isCurrent && (
          <span className="bg-success/10 text-success text-[8px] font-black px-1.5 py-0.5 rounded-[2px] uppercase border border-success/20">Current</span>
        )}
      </div>
      {!isCurrent && (
        <div className="mt-4 flex justify-end">
          <button className="text-[10px] font-black uppercase text-danger hover:underline">Revoke Access</button>
        </div>
      )}
    </div>
  );
}
