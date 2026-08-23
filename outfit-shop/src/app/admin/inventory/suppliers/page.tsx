"use client";

import { useState, useEffect } from "react";
import { inventoryDeepService } from "@/services/inventoryDeep";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import { Store, Plus, MapPin, Phone, Mail, ExternalLink, ShieldCheck, TrendingUp, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await inventoryDeepService.getSuppliers();
      setSuppliers(res.data);
      toast.success("Vendor Registry Synchronized");
    } catch (err) {
      toast.error("Supplier API Offline");
      // Fallback
      setSuppliers([
        { id: 1, supplier_name: "Global Textiles", contact_name: "John Mill", phone: "+44 20 7946 0958", email: "orders@globaltex.com", address: "London, UK" },
        { id: 2, supplier_name: "Normandy Flax Co", contact_name: "Marc Pierre", phone: "+33 1 42 68 53 00", email: "flax@normandy.fr", address: "Normandy, FR" }
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
                <Store size={32} />
             </div>
             <div>
                <h1 className="text-5xl font-black text-text uppercase tracking-tighter leading-none">Suppliers</h1>
                <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em] mt-3">Global Vendor Network • Procurement Integrity</p>
             </div>
          </div>
        </div>
        <div className="flex gap-4">
           <RealTimeBadge label="Network Active" />
           <LiquidButton variant="terracotta" onClick={() => toast.info("New Vendor Application Locked")}>
              <Plus size={16} className="mr-2" /> Register Vendor
           </LiquidButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse liquid-glass bg-white/20" />
          ))
        ) : (
          suppliers.map(s => (
            <LiquidCard key={s.id} className="p-0 overflow-hidden group hover:border-primary/30 transition-all duration-500">
               <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <p className="text-[9px] font-mono font-black text-primary uppercase tracking-widest">ID: VEND-{String(s.id).padStart(4, '0')}</p>
                        <h3 className="text-xl font-black text-text uppercase tracking-tight group-hover:text-primary transition-colors">{s.supplier_name}</h3>
                     </div>
                     <div className="p-2 bg-bg rounded-[3px] border border-border/10 text-text-muted">
                        <ShieldCheck size={18} className="text-success" />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <div className="flex items-center gap-3 text-xs text-text/80 font-bold uppercase tracking-tight">
                        <MapPin size={14} className="text-text-muted" /> {s.address}
                     </div>
                     <div className="flex items-center gap-3 text-xs text-text/80 font-bold uppercase tracking-tight">
                        <Phone size={14} className="text-text-muted" /> {s.phone}
                     </div>
                     <div className="flex items-center gap-3 text-xs text-text/80 font-bold uppercase tracking-tight">
                        <Mail size={14} className="text-text-muted" /> {s.email}
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/5">
                     <div className="space-y-1">
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter">Performance</p>
                        <div className="flex items-center gap-2">
                           <TrendingUp size={12} className="text-success" />
                           <span className="text-[10px] font-mono font-black text-text">98.2%</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <LiquidButton size="sm" variant="glass">
                           Catalog <ExternalLink size={10} className="ml-1" />
                        </LiquidButton>
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
