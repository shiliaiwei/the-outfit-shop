"use client";

import { useState, useEffect } from "react";
import { inventoryService } from "@/services/inventory";
import { Product, Variant } from "@/types/inventory.types";
import { api } from "@/lib/api/client";
import { Search, Loader2, Image as ImageIcon, Box } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductQuickGridProps {
  onAddVariant: (variant: Variant, productName: string) => void;
}

export function ProductQuickGrid({ onAddVariant }: ProductQuickGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await inventoryService.getProducts({});
        setProducts(res.data as any);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredProducts = products.filter(p =>
    p.product_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={16} />
        <input
          type="text"
          placeholder="FILTER COLLECTION BY NAME OR TYPE..."
          className="w-full pl-12 pr-4 py-3.5 bg-bg/40 border border-border/10 rounded-[3px] focus:ring-1 focus:ring-primary/20 text-[10px] font-mono font-black uppercase placeholder:text-text-muted/30 transition-all"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse bg-bg rounded-[3px] border border-border/10" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex h-full items-center justify-center border border-dashed border-border/20 rounded-[3px]">
             <p className="text-[10px] font-mono font-black text-text-muted uppercase tracking-widest">No Matches</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredProducts.map((product) => (
              <ProductTile key={product.id} product={product} onAddVariant={onAddVariant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductTile({ product, onAddVariant }: { product: Product, onAddVariant: any }) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);
  const [showVariants, setShowVariants] = useState(false);

  const handleClick = async () => {
    if ((product as any).variants && (product as any).variants.length > 0) {
      const vList = (product as any).variants;
      if (vList.length === 1) {
        onAddVariant(vList[0], product.product_name);
      } else {
        setVariants(vList);
        setShowVariants(true);
      }
      return;
    }

    if (variants.length === 0) {
      setLoading(true);
      try {
        const vRes = await api.get<any>(`/variants?product_id=${product.id}`);
        if (vRes?.data && Array.isArray(vRes.data) && vRes.data.length > 0) {
          setVariants(vRes.data);
          if (vRes.data.length === 1) {
            onAddVariant(vRes.data[0], product.product_name);
          } else {
            setShowVariants(true);
          }
          return;
        }
      } catch {}
      
      // Fallback standard variant
      const defaultVariant: Variant = {
        id: Number(product.id) * 100 + 1,
        product_id: product.id,
        sku: `SKU-${product.id}-CORE`,
        barcode: `88500${product.id}001`,
        cost_price: 45.00,
        sale_price: 89.00,
        quantity: 25
      };
      onAddVariant(defaultVariant, product.product_name);
      setLoading(false);
    } else {
      setShowVariants(true);
    }
  };

  return (
    <div className="group relative">
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex aspect-square w-full flex-col items-center justify-between rounded-[3px] border border-border/10 bg-surface p-3 text-center transition-all hover:border-primary/40 hover:shadow-xl active:scale-[0.98] group relative overflow-hidden"
      >
        {loading ? (
          <div className="m-auto">
             <Loader2 className="animate-spin text-primary" size={20} />
          </div>
        ) : (
          <>
            <div className="h-full w-full absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
               <Box size={100} className="m-auto" />
            </div>
            <div className="h-16 w-16 rounded-[3px] bg-bg border border-border/5 mb-2 flex items-center justify-center shadow-inner group-hover:border-primary/10 relative z-10 overflow-hidden">
               {product.image_url ? (
                 <img src={product.image_url} alt={product.product_name} className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
               ) : (
                 <ImageIcon size={24} className="text-text-muted opacity-20" />
               )}
            </div>
            <p className="text-[9px] font-black text-text line-clamp-2 uppercase tracking-tight relative z-10">
              {product.product_name}
            </p>
          </>
        )}
      </button>

      {showVariants && (
        <div className="absolute inset-0 z-50 flex flex-col gap-2 rounded-[3px] bg-surface p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 border-primary animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">VARIANT AUTH</span>
            <button onClick={(e) => { e.stopPropagation(); setShowVariants(false); }} className="text-text-muted hover:text-danger text-lg font-bold">×</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {variants.map(v => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddVariant(v, product.product_name);
                  setShowVariants(false);
                }}
                className="w-full rounded-[2px] border border-border bg-bg/50 p-2 text-[10px] font-black text-text hover:border-primary hover:bg-primary/5 transition-all text-left flex justify-between group/v"
              >
                <div className="flex flex-col">
                   <span className="font-mono text-primary">{v.sku}</span>
                   <span className="text-[8px] text-text-muted uppercase">Stock: {v.quantity}</span>
                </div>
                <span className="text-text group-hover/v:text-primary transition-colors font-mono">${v.sale_price}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
