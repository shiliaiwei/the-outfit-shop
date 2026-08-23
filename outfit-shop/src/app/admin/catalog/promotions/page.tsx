"use client";

import { useState, useEffect } from "react";
import { marketingService } from "@/services/marketingService";
import { Plus, Search, Tag, Calendar, Trash2, Edit2, Layers, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PromotionsPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, bRes] = await Promise.all([
          marketingService.getPromotions(),
          marketingService.getBundles()
        ]);
        setPromos(pRes.data);
        setBundles(bRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight">Campaigns & Bundles</h1>
          <p className="text-text-muted text-sm mt-1">Manage promotional discounts and product set configurations</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-btn bg-surface border border-border px-4 py-2 text-sm font-semibold text-text hover:bg-bg">
                <Layers size={16} /> New Bundle
            </button>
            <button className="flex items-center gap-2 rounded-btn bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                <Plus size={18} /> New Promo
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Promotions */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-[2px] text-primary">
               <Tag size={18} />
            </div>
            <h2 className="text-sm font-black text-text uppercase tracking-widest">Active Coupon Codes</h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
             {loading ? (
               Array.from({ length: 2 }).map((_, i) => (
                 <div key={i} className="h-24 animate-pulse rounded-card border border-border bg-surface"></div>
               ))
             ) : promos.length === 0 ? (
               <div className="py-12 text-center bg-surface rounded-card border border-border text-text-muted italic">No active promotions.</div>
             ) : (
               promos.map((promo) => (
                 <div key={promo.id} className="rounded-card border border-border bg-surface p-4 shadow-sm hover:border-primary/30 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-bg rounded-full border border-dashed border-primary/40 text-primary">
                          <Gift size={20} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-text uppercase">{promo.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <code className="px-1.5 py-0.5 bg-bg border border-border rounded text-[10px] font-mono font-bold text-primary select-all">{promo.promo_code}</code>
                             <span className="text-[10px] font-black text-success uppercase tracking-widest">-{promo.discount_type === "PERCENTAGE" ? `${promo.discount_value}%` : `$${promo.discount_value}`}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-[9px] text-text-muted uppercase font-mono">
                             <Calendar size={10} />
                             <span>Till {new Date(promo.end_date).toLocaleDateString()}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-text-muted hover:text-primary"><Edit2 size={14} /></button>
                       <button className="p-2 text-text-muted hover:text-danger"><Trash2 size={14} /></button>
                    </div>
                 </div>
               ))
             )}
          </div>
        </section>

        {/* Product Bundles */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-accent/10 rounded-[2px] text-accent">
               <Layers size={18} />
            </div>
            <h2 className="text-sm font-black text-text uppercase tracking-widest">Product Sets (Bundles)</h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
             {loading ? (
               Array.from({ length: 2 }).map((_, i) => (
                 <div key={i} className="h-24 animate-pulse rounded-card border border-border bg-surface"></div>
               ))
             ) : bundles.length === 0 ? (
               <div className="py-12 text-center bg-surface rounded-card border border-border text-text-muted italic">No active bundles.</div>
             ) : (
               bundles.map((bundle) => (
                 <div key={bundle.id} className="rounded-card border border-border bg-surface p-4 shadow-sm hover:border-accent/30 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded bg-bg flex items-center justify-center text-accent">
                          <Layers size={24} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-text uppercase">{bundle.bundle_name}</p>
                          <p className="text-[10px] text-text-muted mt-1 uppercase font-mono">{bundle.items_count || 0} Items in Set</p>
                          <p className="text-sm font-black text-accent font-mono mt-1">${bundle.bundle_price.toFixed(2)}</p>
                       </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-text-muted hover:text-accent"><Edit2 size={14} /></button>
                       <button className="p-2 text-text-muted hover:text-danger"><Trash2 size={14} /></button>
                    </div>
                 </div>
               ))
             )}
          </div>
        </section>
      </div>
    </div>
  );
}
