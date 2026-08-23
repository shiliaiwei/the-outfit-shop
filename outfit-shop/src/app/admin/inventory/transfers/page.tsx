"use client";

import { useState, useEffect } from "react";
import { inventoryDeepService } from "@/services/inventoryDeep";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import { Truck, Plus, ArrowRight, Building2, MapPin, Clock, ShieldCheck, RefreshCw, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await inventoryDeepService.getTransfers();
      setTransfers(res.data);
      toast.success("Inter-Branch Log Synchronized");
    } catch (err) {
      toast.error("Transfer API Offline");
      // Fallback
      setTransfers([
        { id: 1, from_branch: "London Hub", to_branch: "Paris Salon", status: "TRANSIT", items_count: 42, created_at: new Date().toISOString() },
        { id: 2, from_branch: "Normandy Mill", to_branch: "London Hub", status: "COMPLETED", items_count: 128, created_at: new Date().toISOString() }
      ]);
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
                <Truck size={32} />
             </div>
             <div>
                <h1 className="text-5xl font-black text-text uppercase tracking-tighter leading-none">Stock Transfers</h1>
                <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em] mt-3">Inter-Branch Logistics • Distributed Inventory Mesh</p>
             </div>
          </div>
        </div>
        <div className="flex gap-4">
           <RealTimeBadge label="Logistics Mesh Active" />
           <LiquidButton variant="terracotta" onClick={() => toast.info("New Transfer Request Locked")}>
              <Plus size={16} className="mr-2" /> Dispatch Request
           </LiquidButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse liquid-glass bg-white/20" />
          ))
        ) : (
          transfers.map(t => (
            <LiquidCard key={t.id} className="p-0 overflow-hidden group hover:border-primary/30 transition-all duration-500">
               <div className="flex flex-col xl:flex-row">
                  <div className="p-8 flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                     <div className="flex items-center gap-6">
                        <div className="text-center space-y-2 min-w-[80px]">
                           <Building2 className="mx-auto text-text-muted" size={20} />
                           <p className="text-[10px] font-black text-text uppercase truncate">{t.from_branch}</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                           <div className="w-full h-px bg-border/20 relative">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5 bg-bg rounded-full border border-border/10">
                                 <ArrowRight size={12} className="text-primary" />
                              </div>
                           </div>
                           <span className={cn(
                             "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-[2px] border",
                             t.status === "TRANSIT" ? "bg-warning/10 border-warning/20 text-warning" : "bg-success/10 border-success/20 text-success"
                           )}>{t.status}</span>
                        </div>
                        <div className="text-center space-y-2 min-w-[80px]">
                           <MapPin className="mx-auto text-text-muted" size={20} />
                           <p className="text-[10px] font-black text-text uppercase truncate">{t.to_branch}</p>
                        </div>
                     </div>

                     <div className="space-y-2 border-l border-border/5 pl-8">
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em]">Shipment Payload</p>
                        <div className="flex items-center gap-3">
                           <Box size={16} className="text-primary" />
                           <span className="text-lg font-black text-text font-mono tracking-tighter">{t.items_count} PIECES</span>
                        </div>
                     </div>

                     <div className="space-y-2 border-l border-border/5 pl-8">
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em]">Authentication</p>
                        <div className="flex items-center gap-3">
                           <Clock size={16} className="text-text-muted" />
                           <span className="text-[10px] font-mono font-bold text-text-muted uppercase truncate">{new Date(t.created_at).toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 bg-bg/20 border-t xl:border-t-0 xl:border-l border-border/5 flex items-center justify-between xl:justify-center min-w-[200px]">
                     <LiquidButton size="sm" className="w-full xl:w-auto">Track Detail</LiquidButton>
                  </div>
               </div>
            </LiquidCard>
          ))
        )}
      </div>
    </div>
  );
}
