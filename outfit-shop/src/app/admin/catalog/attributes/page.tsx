"use client";

import { useState, useEffect } from "react";
import { CatalogDeepService } from "@/services/catalogDeep";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import { Sliders, Plus, Palette, Ruler, Trash2, Edit3, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AttributesPage() {
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        CatalogDeepService.getColors(),
        CatalogDeepService.getSizes()
      ]);
      setColors(cRes.data);
      setSizes(sRes.data);
      toast.success("OUTFIT Registry Synchronized");
    } catch (err) {
      toast.error("Deep Sync Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-3xl font-black text-text uppercase tracking-tight">Product Attributes</h1>
          <p className="text-xs text-text-muted mt-1">
            Sizes, colors, and dimension specifications
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={loadData} className="btn-liquid btn-liquid-glass p-2.5 shadow-sm hover:border-border transition-all cursor-pointer" title="Refresh">
              <RefreshCw size={16} className={cn(loading && "animate-spin")} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Chromatic Registry */}
        <div className="space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-text uppercase tracking-[0.2em] flex items-center gap-3">
                 <Palette size={18} className="text-primary" /> Chromatic Registry
              </h3>
              <LiquidButton size="sm" variant="terracotta">Add Color</LiquidButton>
           </div>

           <div className="grid grid-cols-1 gap-4">
              {loading ? (
                 Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 animate-pulse liquid-glass bg-white/20" />
                 ))
              ) : colors.map(c => (
                 <LiquidCard key={c.id} className="p-4 flex items-center justify-between group hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-6">
                       <div className="h-12 w-12 rounded-[3px] border shadow-inner" style={{ backgroundColor: c.hex_code || '#F5F3EE' }} />
                       <div className="space-y-1">
                          <p className="text-xs font-black text-text uppercase tracking-widest">{c.color_name}</p>
                          <p className="text-[9px] font-mono font-black text-text-muted uppercase tracking-tighter">{c.hex_code}</p>
                       </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-text-muted hover:text-primary"><Edit3 size={16} /></button>
                       <button className="p-2 text-text-muted hover:text-danger"><Trash2 size={16} /></button>
                    </div>
                 </LiquidCard>
              ))}
           </div>
        </div>

        {/* Dimensional Registry */}
        <div className="space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-text uppercase tracking-[0.2em] flex items-center gap-3">
                 <Ruler size={18} className="text-primary" /> Dimensional Registry
              </h3>
              <LiquidButton size="sm" variant="charcoal">Add Size</LiquidButton>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {loading ? (
                 Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse liquid-glass bg-white/20" />
                 ))
              ) : sizes.map(s => (
                 <LiquidCard key={s.id} className="aspect-square flex flex-col items-center justify-center gap-2 group hover:border-primary/20 transition-all cursor-pointer">
                    <span className="text-xl font-black text-text uppercase font-mono tracking-tighter group-hover:text-primary transition-colors">{s.size_name}</span>
                    <span className="text-[8px] font-mono font-bold text-text-muted uppercase tracking-widest">{s.size_code || "EU"}</span>
                 </LiquidCard>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
