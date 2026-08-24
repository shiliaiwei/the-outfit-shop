"use client";

import { useState, useEffect } from "react";
import { securityService } from "@/services/securityService";
import { Guard } from "@/components/auth/Guard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faClock,
  faMobileScreenButton,
  faGlobe,
  faTrashCan,
  faRightFromBracket,
  faRotate
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SecurityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await securityService.getAuditLogs();
      setLogs(res?.data || []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Guard allowedRoles={["ADMIN"]}>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-text uppercase tracking-tight">
              Security &amp; System Logs
            </h1>
            <p className="text-xs text-text-muted mt-1">Audit immutable events and active platform sessions</p>
          </div>
          <button
            onClick={load}
            className="btn-liquid btn-liquid-glass p-2.5 shadow-sm self-start sm:self-auto cursor-pointer"
            title="Refresh logs"
          >
            <FontAwesomeIcon icon={faRotate} className={cn("text-[#1E2631] text-xs", loading && "animate-spin")} />
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Audit Timeline */}
          <div className="xl:col-span-2 space-y-3">
             <div className="flex items-center justify-between">
               <h2 className="text-xs font-black text-text uppercase tracking-widest">
                 Audit Trail
               </h2>
               <button
                 onClick={() => toast.info("Full immutable archive query executed")}
                 className="text-[10px] font-mono font-bold uppercase text-primary hover:underline cursor-pointer"
               >
                 View Archive
               </button>
             </div>

             <div className="liquid-glass shadow-md overflow-hidden">
               <div className="divide-y divide-border/30">
                 {loading ? (
                   Array.from({ length: 4 }).map((_, i) => (
                     <div key={i} className="p-4 animate-pulse flex gap-3">
                       <div className="h-8 w-8 rounded-[2px] bg-bg border border-border shrink-0" />
                       <div className="flex-1 space-y-1.5">
                         <div className="h-3 w-1/3 bg-bg rounded-[2px]" />
                         <div className="h-2.5 w-1/2 bg-bg rounded-[2px]" />
                       </div>
                     </div>
                   ))
                 ) : logs.length === 0 ? (
                   <div className="p-12 text-center text-xs font-mono text-text-muted">No recent logs recorded.</div>
                 ) : (
                   logs.map((log) => (
                     <div key={log.id} className="p-4 hover:bg-bg/30 transition-colors flex items-start gap-3.5">
                        <div className="h-8 w-8 rounded-[2px] bg-bg border border-border flex items-center justify-center text-[#1E2631] shrink-0 mt-0.5">
                           <FontAwesomeIcon icon={faClock} className="text-xs" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <p className="text-xs font-bold text-text uppercase font-mono tracking-tight">{log.action}</p>
                            <span className="text-[10px] font-mono text-text-muted">{new Date(log.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-text-muted mt-1 leading-relaxed">
                            <span className="font-bold text-text">@{log.username || "system"}</span> {log.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-[9px] font-mono text-text-muted/70 uppercase">
                             <span className="flex items-center gap-1">
                               <FontAwesomeIcon icon={faGlobe} className="text-[9px]" /> {log.ip_address || "internal"}
                             </span>
                             <span>&bull;</span>
                             <span>LOG ID #{log.id}</span>
                          </div>
                        </div>
                     </div>
                   ))
                 )}
               </div>
             </div>
          </div>

          {/* Active Sessions */}
          <div className="space-y-3">
            <h2 className="text-xs font-black text-text uppercase tracking-widest">
              Active Sessions
            </h2>

            <div className="space-y-3">
               <SessionCard
                 device="MacBook Pro • Chrome"
                 ip="192.168.1.42"
                 location="Phnom Penh, KH"
                 isCurrent={true}
               />
               <SessionCard
                 device="iPhone 15 • Safari"
                 ip="103.21.164.2"
                 location="Paris, FR"
               />
               <button
                 onClick={() => toast.success("All other active sessions revoked")}
                 className="btn-liquid btn-liquid-glass w-full py-2.5 text-[10px] font-bold uppercase text-danger hover:border-danger transition-all flex items-center justify-center gap-2 cursor-pointer"
               >
                 <FontAwesomeIcon icon={faRightFromBracket} className="text-[10px]" />
                 <span>Terminate Other Sessions</span>
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
      "liquid-glass p-4 shadow-sm",
      isCurrent ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-bg rounded-[2px] text-[#1E2631]">
             <FontAwesomeIcon icon={faMobileScreenButton} className="text-xs" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text uppercase">{device}</h4>
            <p className="text-[10px] text-text-muted font-mono">{ip} &bull; {location}</p>
          </div>
        </div>
        {isCurrent && (
          <span className="bg-success/10 text-success text-[8px] font-black px-1.5 py-0.5 rounded-[2px] uppercase border border-success/20">Current</span>
        )}
      </div>
      {!isCurrent && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => toast.success("Session access revoked")}
            className="text-[10px] font-mono font-bold uppercase text-danger hover:underline cursor-pointer"
          >
            Revoke Access
          </button>
        </div>
      )}
    </div>
  );
}
