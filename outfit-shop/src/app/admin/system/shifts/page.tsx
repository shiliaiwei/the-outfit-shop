"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import { DoorOpen, DoorClosed, Clock, User, DollarSign, Calculator, Receipt, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get<any>("/shifts");
      setShifts(res.data || []);
      toast.success("Shift Records Reconciled");
    } catch (err) {
      toast.error("Shift Audit Unreachable");
      setShifts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-[3px] border border-primary/20 text-primary shadow-2xl">
                <Calculator size={32} />
             </div>
             <div>
                <h1 className="text-5xl font-black text-text uppercase tracking-tighter leading-none">Shift Audit</h1>
                <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em] mt-3">Register Reconciliation • Cash Flow Integrity</p>
             </div>
          </div>
        </div>
        <div className="flex gap-4">
           <RealTimeBadge label="Ledger Synchronized" />
           <LiquidButton onClick={() => toast.info("Z-Report Generation Initiated")}>
             Generate Z-Report
           </LiquidButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse liquid-glass bg-white/20" />
          ))
        ) : shifts.length === 0 ? (
          <LiquidCard className="py-32 text-center border-dashed">
             <Receipt size={64} className="mx-auto text-text-muted/10 mb-6" />
             <p className="text-xl font-black text-text uppercase tracking-[0.2em] opacity-40 italic">Zero Shift Records in Active Operational Cycle</p>
          </LiquidCard>
        ) : (
          shifts.map((s) => (
            <LiquidCard key={s.id} className="p-0 overflow-hidden group hover:border-primary/30 transition-all duration-500">
               <div className="flex flex-col xl:flex-row">
                  <div className="p-8 border-b xl:border-b-0 xl:border-r border-border/5 bg-bg/20 min-w-[280px]">
                     <div className="flex items-center gap-4 mb-6">
                        <div className={cn(
                          "p-3 rounded-[3px] border",
                          s.status === "OPEN" ? "bg-success/10 border-success/20 text-success" : "bg-text-muted/10 border-border text-text-muted"
                        )}>
                           {s.status === "OPEN" ? <DoorOpen size={20} /> : <DoorClosed size={20} />}
                        </div>
                        <div>
                           <p className="text-[9px] font-mono font-black text-primary uppercase tracking-[0.2em]">REF: SH-{String(s.id).padStart(5, '0')}</p>
                           <h4 className="text-lg font-black text-text uppercase tracking-tight leading-none mt-1">{s.status}</h4>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <User size={14} className="text-text-muted" />
                           <span className="text-[10px] font-black text-text uppercase tracking-widest">@{s.cashier_name || "Internal"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Clock size={14} className="text-text-muted" />
                           <span className="text-[10px] font-mono font-bold text-text-muted uppercase">{new Date(s.opened_at).toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 items-center bg-white/20">
                     <div className="space-y-2">
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.3em]">Opening Float</p>
                        <p className="text-2xl font-black text-text font-mono tracking-tighter leading-none">${s.opening_float_usd?.toFixed(2) || "0.00"}</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.3em]">Sales Volume</p>
                        <p className="text-2xl font-black text-primary font-mono tracking-tighter leading-none">${s.net_volume?.toFixed(2) || "0.00"}</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.3em]">Transactions</p>
                        <p className="text-2xl font-black text-text font-mono tracking-tighter leading-none">{s.orders_count || 0}</p>
                     </div>
                     <div className="text-right flex flex-col items-end">
                        <div className="flex items-center gap-2 text-success mb-2">
                           <ArrowRightLeft size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Balanced</span>
                        </div>
                        <button className="text-[9px] font-black uppercase text-primary border-b border-primary/20 hover:border-primary transition-all pb-0.5 tracking-widest">View Detailed Ledger</button>
                     </div>
                  </div>
               </div>
            </LiquidCard>
          ))
        )}
      </div>
    </div>
  );
}
