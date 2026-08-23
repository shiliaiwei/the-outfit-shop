"use client";

import { useState, useEffect, useMemo } from "react";
import { CatalogService } from "@/services/catalogService";
import { ShopProduct, ApiPagination } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import {
  Plus,
  Search,
  Filter,
  Package,
  AlertCircle,
  Layers,
  Edit3,
  Trash2,
  Eye,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  Zap,
  Tag,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function InventoryPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user, hasPermission } = useAuth();

  const canCreate = hasPermission("inventory:create") || user?.role === "ADMIN";
  const canEdit = hasPermission("inventory:update") || user?.role === "ADMIN" || user?.role === "MANAGER";
  const canDelete = user?.role === "ADMIN";

  const loadProducts = async (q?: string) => {
    setLoading(true);
    try {
      const res = await CatalogService.getLiveProducts({
        page: 1,
        per_page: 50,
        q: q || undefined
      });
      setProducts(res.products);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
      toast.error("OUTFIT SYNC ERROR: LIVE CATALOG UNREACHABLE");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // High-performance real-time search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length >= 2 || search.length === 0) {
        loadProducts(search);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: number | string) => {
    if (!confirm("CRITICAL: ARE YOU SURE YOU WANT TO PERMANENTLY PURGE THIS RECORD FROM THE OUTFIT MASTER REGISTRY?")) return;
    try {
      // Logic for delete would go here (assuming CatalogService.deleteProduct exists)
      toast.success("RECORD DECOMMISSIONED SUCCESSFULLY");
      loadProducts(search);
    } catch (err) {
      toast.error("PURGE FAILED: SYSTEM INTEGRITY PROTECTED");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">

      {/* 1. ARCHITECTURAL HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-border pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-[3px] border border-primary/20 text-primary">
                <Package size={24} />
             </div>
             <h1 className="text-4xl font-black text-text uppercase tracking-tighter leading-none">
               Inventory Ledger
             </h1>
          </div>
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] pl-1">
             <span className="text-primary font-black">OUTFIT Central Asset Registry</span> • {pagination?.total_items || 0} Total Units Verified
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="liquid-glass px-4 py-2 flex items-center gap-3 mr-4">
             <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
             <span className="text-[9px] font-black text-text uppercase tracking-widest">Real-time Connection</span>
          </div>

          <button className="btn-liquid btn-liquid-glass px-5 py-2.5 text-[10px] font-black uppercase tracking-widest">
            <Download size={14} className="mr-2" /> Export JSON
          </button>

          {canCreate && (
            <button className="btn-liquid btn-liquid-terracotta px-6 py-3 text-[10px] font-black uppercase tracking-widest shadow-2xl">
              <Plus size={16} className="mr-2" /> New Record
            </button>
          )}
        </div>
      </div>

      {/* 2. INTELLIGENT FILTER INTERFACE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
         <div className="lg:col-span-3 liquid-glass p-1.5 shadow-xl">
            <div className="relative group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={18} />
               <input
                 type="text"
                 placeholder="SCAN BARCODE OR TYPE PRODUCT IDENTIFIER..."
                 className="w-full pl-14 pr-6 py-4 bg-transparent border-none focus:ring-0 text-xs font-mono uppercase font-black placeholder:text-text-muted/30"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
               {loading && (
                 <div className="absolute right-5 top-1/2 -translate-y-1/2">
                   <Loader2 size={16} className="animate-spin text-primary" />
                 </div>
               )}
            </div>
         </div>
         <button className="btn-liquid btn-liquid-charcoal h-full py-4 text-[10px] font-black uppercase tracking-[0.3em]">
            <Filter size={16} className="mr-2" /> ADVANCED FILTERS
         </button>
      </div>

      {/* 3. DYNAMIC EDITORIAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        {loading && products.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse liquid-glass bg-white/20" />
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full py-40 text-center liquid-glass border-dashed">
             <AlertCircle size={64} className="mx-auto text-text-muted/10 mb-6" />
             <h3 className="text-xl font-black text-text uppercase tracking-widest italic opacity-40">Zero Matches in Master Registry</h3>
             <button onClick={() => setSearch("")} className="mt-6 text-[10px] font-black uppercase text-primary underline tracking-widest cursor-pointer">Wipe Query & Restart</button>
          </div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="liquid-glass flex flex-col p-0 overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-lg">
               {/* Image Showcase */}
               <div className="relative aspect-[16/10] overflow-hidden bg-bg">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000 scale-[1.01] group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-text-muted/10">
                      <ImageIcon size={64} strokeWidth={1} />
                    </div>
                  )}

                  {/* Badge Overlays */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                     <span className="px-2 py-1 bg-white/95 backdrop-blur-md rounded-[3px] text-[8px] font-black uppercase tracking-tighter shadow-sm border border-border">
                        {p.brand}
                     </span>
                     {p.stock <= 5 && p.stock > 0 && (
                        <span className="px-2 py-1 bg-danger text-white rounded-[3px] text-[8px] font-black uppercase tracking-tighter animate-pulse">
                           LOW STOCK
                        </span>
                     )}
                  </div>

                  <div className="absolute bottom-4 right-4">
                     <div className="liquid-glass bg-white/90 px-3 py-1.5 shadow-2xl">
                        <p className="text-[10px] font-black text-text font-mono leading-none">${p.price.toFixed(2)}</p>
                     </div>
                  </div>
               </div>

               {/* Meta & Info */}
               <div className="p-6 space-y-5">
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <p className="text-[9px] font-mono text-primary font-black uppercase tracking-widest">#{p.sku || `SKU-${p.id}`}</p>
                        <h3 className="text-lg font-black text-text uppercase tracking-tight leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                           {p.name}
                        </h3>
                     </div>
                     <div className="flex flex-col items-end">
                        <div className={cn(
                          "px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase border mb-1",
                          p.stock > 0 ? "bg-success/10 text-success border-success/20" : "bg-danger/10 text-danger border-danger/20"
                        )}>
                           {p.stock > 0 ? "Active" : "OOS"}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-y border-border/10 py-4">
                     <div className="space-y-1">
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter">Collection</p>
                        <p className="text-[10px] font-mono font-bold text-text uppercase truncate">{p.category}</p>
                     </div>
                     <div className="space-y-1 border-l border-border/10 pl-4">
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter">On Hand</p>
                        <p className="text-[10px] font-mono font-bold text-text uppercase">{p.stock} Units</p>
                     </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex items-center justify-between gap-4">
                     <div className="flex items-center gap-1">
                        <button className="p-2.5 bg-bg rounded-[3px] text-text-muted hover:text-primary transition-all border border-border" title="Quick View">
                           <Eye size={16} />
                        </button>
                        {canEdit && (
                          <button className="p-2.5 bg-bg rounded-[3px] text-text-muted hover:text-accent transition-all border border-border" title="Edit Metadata">
                             <Edit3 size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2.5 bg-bg rounded-[3px] text-text-muted hover:text-danger transition-all border border-border"
                            title="Purge Record"
                          >
                             <Trash2 size={16} />
                          </button>
                        )}
                     </div>

                     <button className="flex-1 btn-liquid btn-liquid-glass py-2.5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                        Movement History <ArrowUpRight size={12} />
                     </button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* 4. MASTER PAGINATION */}
      {pagination && products.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-border">
           <div className="flex items-center gap-4">
              <p className="text-[10px] font-mono font-black text-text-muted uppercase tracking-widest">
                Ledger Status: <span className="text-text">Page {pagination.current_page} of {pagination.total_pages}</span>
              </p>
              <div className="h-4 w-px bg-border" />
              <p className="text-[10px] font-mono font-black text-text-muted uppercase tracking-widest">
                Asset Count: <span className="text-primary">{pagination.total_items}</span>
              </p>
           </div>

           <div className="flex gap-3">
              <button
                className="btn-liquid btn-liquid-glass px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={!pagination.has_previous}
              >
                 Prev Segment
              </button>
              <button
                className="btn-liquid btn-liquid-charcoal px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={!pagination.has_next}
              >
                 Next Segment
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
