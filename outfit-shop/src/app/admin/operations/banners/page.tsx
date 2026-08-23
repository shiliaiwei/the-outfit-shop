"use client";

import { useState, useEffect } from "react";
import { marketingService } from "@/services/marketingService";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import { Layout, Plus, Image as ImageIcon, ExternalLink, Trash2, Eye, RefreshCw, Layers, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await marketingService.getBanners();
      setBanners(res.data);
      toast.success("Public CMS Synchronized");
    } catch (err) {
      toast.error("CMS API Offline");
      // Fallback
      setBanners([
        { id: 1, title: "Summer Solstice Drop", placement: "HERO_MAIN", is_active: true, image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35" },
        { id: 2, title: "Archive Sale 2026", placement: "SIDEBAR_PROMO", is_active: false }
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
                <Layout size={32} />
             </div>
             <div>
                <h1 className="text-5xl font-black text-text uppercase tracking-tighter leading-none">Storefront CMS</h1>
                <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em] mt-3">Public Asset Deployment • Hero & Carousel Management</p>
             </div>
          </div>
        </div>
        <div className="flex gap-4">
           <RealTimeBadge label="CMS Link Active" />
           <LiquidButton variant="terracotta" onClick={() => toast.info("Campaign Deployment Locked")}>
              <Plus size={16} className="mr-2" /> New Placement
           </LiquidButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse liquid-glass bg-white/20" />
          ))
        ) : (
          banners.map(b => (
            <LiquidCard key={b.id} className="p-0 overflow-hidden group hover:border-primary/40 transition-all duration-700 shadow-2xl">
               <div className="relative aspect-[21/9] bg-bg overflow-hidden border-b border-border/5">
                  {b.image_url ? (
                    <img src={b.image_url} alt={b.title} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 scale-[1.01] group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted/10">
                      <ImageIcon size={64} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute top-6 right-6">
                    <span className={cn(
                      "px-3 py-1 rounded-[3px] text-[8px] font-black uppercase border tracking-[0.2em] shadow-2xl backdrop-blur-md",
                      b.is_active ? "bg-success text-white border-success" : "bg-bg/80 text-text-muted border-border/20"
                    )}>
                      {b.is_active ? "Live Deployment" : "Internal Draft"}
                    </span>
                  </div>
               </div>

               <div className="p-8 space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[9px] font-mono font-black text-primary uppercase tracking-widest">
                       <Monitor size={10} /> {b.placement}
                    </div>
                    <h3 className="text-xl font-black text-text uppercase tracking-tight group-hover:text-primary transition-colors">{b.title}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-y border-border/5 py-6">
                     <div className="space-y-1">
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter">Asset Reference</p>
                        <p className="text-[10px] font-mono font-bold text-text uppercase truncate">ID: {b.id}</p>
                     </div>
                     <div className="space-y-1 border-l border-border/5 pl-6">
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter">System Visibility</p>
                        <p className="text-[10px] font-mono font-bold text-text uppercase">{b.is_active ? "PUBLIC" : "HIDDEN"}</p>
                     </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="p-3 bg-bg rounded-[3px] border border-border/10 text-text-muted hover:text-primary transition-all">
                        <Eye size={18} />
                      </button>
                      <button className="p-3 bg-bg rounded-[3px] border border-border/10 text-text-muted hover:text-accent transition-all">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                    <button className="p-3 text-text-muted hover:text-danger transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
               </div>
            </LiquidCard>
          ))
        )}
      </div>
    </div>
  );
}
