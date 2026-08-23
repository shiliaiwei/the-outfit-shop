'use client';

import React, { useMemo } from 'react';
import { ShopProduct, CurrencyCode } from '@/types';
import { CatalogService } from '@/services/catalogService';
import { Sparkles, Eye, ShoppingBag, ArrowUpRight } from 'lucide-react';

interface LouisVuittonMarqueeProps {
  products: ShopProduct[];
  currency: CurrencyCode;
  onQuickView: (product: ShopProduct) => void;
  onAddToCart?: (product: ShopProduct, size: string) => void;
}

export function LouisVuittonMarquee({
  products,
  currency,
  onQuickView,
  onAddToCart
}: LouisVuittonMarqueeProps) {
  // Filter for Louis Vuitton & PNG items, strictly excluding bleu-SNPCodeLab
  const marqueeItems = useMemo(() => {
    const validProducts = products.filter(
      (p) => !p.imageUrl.includes('bleu-SNPCodeLab') && !p.imageUrl.endsWith('null')
    );
    const lvOnly = validProducts.filter((p) => {
      const isLv = p.brand.toLowerCase().includes('louis') || p.brand.toLowerCase().includes('vuitton');
      const isPng = p.imageUrl.toLowerCase().includes('.png') || p.imageUrl.toLowerCase().endsWith('.png');
      return isLv || isPng;
    });

    const pool = lvOnly.length > 0 ? lvOnly : validProducts;

    if (pool.length <= 16) return pool;
    // Deterministic selection prevents SSR hydration mismatch
    const step = 5;
    const selected: ShopProduct[] = [];
    const seen = new Set<string>();

    for (let i = 0; selected.length < 16 && i < pool.length * 2; i++) {
      const idx = (i * step) % pool.length;
      const item = pool[idx];
      if (item && !seen.has(String(item.id))) {
        seen.add(String(item.id));
        selected.push(item);
      }
    }
    return selected.length > 0 ? selected : pool.slice(0, 16);
  }, [products]);

  if (marqueeItems.length === 0) return null;

  // Duplicate items to ensure seamless infinite looping marquee
  const loopItems = [...marqueeItems, ...marqueeItems];

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 overflow-hidden relative">
      
      {/* Minimal Header Label */}
      <div className="flex items-center justify-between mb-3 px-1 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-[2px] bg-[#C84428] animate-pulse" />
          <span className="font-bold text-[#1E2631] uppercase tracking-wider text-[11px]">
            Louis Vuitton Archive • Secret Drop
          </span>
        </div>
        <div className="text-[10px] text-[#8E9AA8] hidden sm:flex items-center gap-1.5">
          <span>Psychological Anchor Pricing</span>
          <span>•</span>
          <span className="text-emerald-600 font-semibold">Instant VIP Credit Applied</span>
        </div>
      </div>

      {/* Marquee Wrapper with Left & Right Low Capacity / Gray Fade Masks */}
      <div className="relative w-full overflow-hidden rounded-[2px]">
        
        {/* Left Low Capacity / Gray Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#F8F7F4] via-[#F8F7F4]/85 to-transparent z-20 pointer-events-none" />

        {/* Right Low Capacity / Gray Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#F8F7F4] via-[#F8F7F4]/85 to-transparent z-20 pointer-events-none" />

        {/* Running Infinite Loop Track */}
        <div className="animate-marquee-loop flex items-center gap-3.5 py-1">
          {loopItems.map((p, idx) => {
            // Psychological discount calculation (anchor price + discount badge)
            const originalPrice = p.originalPrice || Math.round(p.price * 1.38);
            const discountPct = Math.round(((originalPrice - p.price) / originalPrice) * 100);
            const savings = originalPrice - p.price;

            return (
              <div
                key={`${p.id}-${idx}`}
                onClick={() => onQuickView(p)}
                className="group relative w-48 sm:w-56 h-64 shrink-0 bg-white/95 rounded-[2px] border border-[#5A6678]/15 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between p-3 liquid-glass-card"
              >
                {/* Card Top: Psychological Discount Badge & Luxury Monogram Pill */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  
                  {/* Psychological Discount Tag */}
                  <span className="btn-liquid btn-liquid-terracotta px-2 py-0.5 text-[9px] font-mono font-bold rounded-[2px] shadow-2xs">
                    -{discountPct}% OFF
                  </span>

                  {/* Brand Monogram */}
                  <span className="text-[9px] font-mono font-bold text-[#8E9AA8] bg-[#F8F7F4] px-1.5 py-0.5 rounded-[2px] border border-[#5A6678]/10">
                    LV PRIVÉ
                  </span>
                </div>

                {/* Card Center: Pure Transparent PNG Image Only (No Name / No Title) */}
                <div className="relative w-full flex-1 flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt="Louis Vuitton Piece"
                    className="max-h-36 w-auto object-contain transition-transform duration-500 group-hover:scale-115 drop-shadow-md"
                    loading="lazy"
                  />

                  {/* Hover Quick Action Overlay */}
                  <div className="absolute inset-0 bg-[#1E2631]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2px] flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(p);
                      }}
                      className="btn-liquid btn-liquid-charcoal p-2 rounded-[2px] shadow-md"
                      title="Quick View"
                    >
                      <Eye className="w-3.5 h-3.5 text-white" />
                    </button>
                    {onAddToCart && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(p, p.sizes[0] || 'M');
                        }}
                        className="btn-liquid btn-liquid-terracotta p-2 rounded-[2px] shadow-md"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-white" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Psychological Anchor Pricing (Original vs Privé Price) */}
                <div className="relative z-10 pt-2 border-t border-[#5A6678]/15 flex items-center justify-between font-mono text-[11px]">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#8E9AA8] line-through">
                      {CatalogService.formatPrice(originalPrice, currency)}
                    </span>
                    <span className="font-bold text-sm text-[#1E2631]">
                      {CatalogService.formatPrice(p.price, currency)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-emerald-700 font-bold block">
                      Save {CatalogService.formatPrice(savings, currency)}
                    </span>
                    <span className="text-[8px] text-[#8E9AA8]">
                      Limited Drop
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
