"use client";

import { useState, useEffect } from "react";
import { catalogDeepService } from "@/services/catalogDeep";
import { Brand } from "@/types/inventory.types";
import { Search, Plus, ExternalLink, Globe, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await catalogDeepService.getBrands();
        setBrands(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = brands.filter(b =>
    b.brand_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight">Brand Directory</h1>
          <p className="text-text-muted text-sm mt-1">Manage luxury labels and collaborative partner brands</p>
        </div>
        <button className="flex items-center gap-2 rounded-btn bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
          <Plus size={18} /> Add Brand
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="col-span-full">
           <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search brands..."
              className="h-10 w-full rounded-md border border-border bg-surface pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-card border border-border bg-surface h-48"></div>
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-surface rounded-card border border-border">
            <p className="text-text-muted font-mono uppercase tracking-widest">No brands found</p>
          </div>
        ) : (
          filtered.map((brand, idx) => (
            <div key={brand.id || (brand as any).brand_id || brand.brand_name || idx} className="rounded-card border border-border bg-surface p-6 shadow-sm hover:border-primary/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded bg-bg border border-border flex items-center justify-center overflow-hidden">
                    {brand.logo_url ? (
                      <img src={brand.logo_url} alt={brand.brand_name} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-lg font-black text-primary">{brand.brand_name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-text-muted hover:text-primary"><Edit2 size={14} /></button>
                    <button className="p-1.5 text-text-muted hover:text-danger"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 className="text-sm font-black text-text uppercase tracking-tight mb-1">{brand.brand_name}</h3>
                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{brand.description || "No description provided."}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Globe size={14} />
                  <span className="truncate max-w-[150px]">{brand.website || "No website"}</span>
                </div>
                {brand.website && (
                  <a href={brand.website} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
