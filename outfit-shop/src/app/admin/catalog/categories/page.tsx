"use client";

import { useState, useEffect } from "react";
import { CatalogDeepService } from "@/services/catalogDeep";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import { FolderTree, Plus, Tag, ArrowUpRight, MoreVertical, Edit3, Trash2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await CatalogDeepService.getCategories();
      setCategories(res.data);
      toast.success("Taxonomy Engine Synced");
    } catch (err) {
      toast.error("Category API Offline");
      // Fallback
      setCategories([
        { id: 1, category_name: "Overshirts", description: "Structured Normandy Flax linen layering." },
        { id: 2, category_name: "Knits", description: "California Supima long-staple cotton knits." }
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
                <FolderTree size={32} />
             </div>
             <div>
                <h1 className="text-5xl font-black text-text uppercase tracking-tighter leading-none">Taxonomy</h1>
                <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em] mt-3">Collection Hierarchy • Structural Classification</p>
             </div>
          </div>
        </div>
        <div className="flex gap-4">
           <RealTimeBadge label="Engine Connected" />
           <LiquidButton variant="terracotta" onClick={() => toast.info("New Taxonomy Entry Locked")}>
              <Plus size={16} className="mr-2" /> Add Category
           </LiquidButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse liquid-glass bg-white/20" />
          ))
        ) : (
          categories.map(c => (
            <LiquidCard key={c.id} className="p-0 overflow-hidden group hover:border-primary/30 transition-all duration-500 flex flex-col justify-between">
               <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-bg rounded-[3px] border border-border/10 text-text-muted group-hover:text-primary transition-colors">
                        <Tag size={20} />
                     </div>
                     <button className="text-text-muted hover:text-text"><MoreVertical size={16} /></button>
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-text uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{c.category_name}</h3>
                     <p className="text-[10px] font-bold text-text-muted uppercase leading-relaxed line-clamp-2">{c.description || "Core collection segment for authenticated OUTFIT pieces."}</p>
                  </div>
               </div>
               <div className="px-8 py-6 bg-bg/20 border-t border-border/5 flex items-center justify-between">
                  <span className="text-[9px] font-mono font-black text-text-muted uppercase tracking-widest">ID: CAT-{String(c.id).padStart(3, '0')}</span>
                  <button className="text-[9px] font-black uppercase text-primary border-b border-primary/20 hover:border-primary transition-all pb-0.5 tracking-widest">Manage Pieces</button>
               </div>
            </LiquidCard>
          ))
        )}
      </div>
    </div>
  );
}
