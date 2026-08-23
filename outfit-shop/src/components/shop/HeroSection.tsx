'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Eye, ShoppingBag } from 'lucide-react';
import { ShopProduct, CurrencyCode } from '@/types';
import { CatalogService } from '@/services/catalogService';

interface HeroSectionProps {
  totalCount: number;
  products: ShopProduct[];
  currency: CurrencyCode;
  onExploreClick: () => void;
  onQuickView: (product: ShopProduct) => void;
  onAddToCart: (product: ShopProduct, size: string) => void;
}

// Instant Pre-Populated Diverse Clothes for Zero-Latency First Paint
const INSTANT_MARQUEE_PIECES: Partial<ShopProduct>[] = [
  {
    id: 'pc-01',
    name: 'Louis Vuitton Monogram Camp Shirt',
    brand: 'Louis Vuitton',
    price: 120.00,
    originalPrice: 155.00,
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'pc-02',
    name: 'Gucci Tailored Silk Overshirt',
    brand: 'Gucci',
    price: 245.00,
    originalPrice: 320.00,
    imageUrl: 'https://res.cloudinary.com/od8t271n/image/upload/v1787072813/Velvet_Jacquard_Short_Sleeved_T_Shirt_HUY36WCW4001_PM2_Front_View.webp',
    sizes: ['M', 'L', 'XL']
  },
  {
    id: 'pc-03',
    name: 'OutFIT Normandy Linen Jacket',
    brand: 'OutFIT Atelier',
    price: 180.00,
    originalPrice: 240.00,
    imageUrl: 'https://res.cloudinary.com/od8t271n/image/upload/v1787073012/Monogram_Double_Face_Overshirt_HUB29WCO1859_PM2_Front_View.webp',
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'pc-04',
    name: 'Supima Fine Gauge Knit Polo',
    brand: 'Ralph Lauren',
    price: 95.00,
    originalPrice: 135.00,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
    sizes: ['S', 'M', 'L', 'XL']
  }
];

export function HeroSection({
  totalCount,
  products,
  currency,
  onExploreClick,
  onQuickView,
  onAddToCart
}: HeroSectionProps) {
  const [scrollY, setScrollY] = useState<number>(0);

  // Parallax and scroll animation listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Diverse cross-brand multi-source randomized interleaving algorithm
  const marqueeItems = useMemo(() => {
    const available = products.filter(
      (p) => Boolean(p.imageUrl) && !p.imageUrl.includes('bleu-SNPCodeLab') && !p.imageUrl.endsWith('null')
    );
    const pool = available.length > 0 ? available : (INSTANT_MARQUEE_PIECES as ShopProduct[]);

    // Group items by brand for true cross-brand diversity
    const brandBuckets: Record<string, ShopProduct[]> = {};
    for (const p of pool) {
      const b = p.brand?.trim() || 'OutFIT Atelier';
      if (!brandBuckets[b]) {
        brandBuckets[b] = [];
      }
      brandBuckets[b].push(p);
    }

    const brandNames = Object.keys(brandBuckets);
    if (brandNames.length === 0) return pool.slice(0, 20);

    // Deterministically shuffle brand order using prime dispersion
    const shuffledBrands = [...brandNames].sort((a, b) => {
      const hashA = a.split('').reduce((acc, char) => acc + char.charCodeAt(0) * 17, 0);
      const hashB = b.split('').reduce((acc, char) => acc + char.charCodeAt(0) * 17, 0);
      return (hashA % 31) - (hashB % 31);
    });

    const selected: ShopProduct[] = [];
    const seenIds = new Set<string>();
    const maxItems = Math.min(24, pool.length);

    // Multi-pass round robin: Pick 1 item from each brand sequentially
    let pass = 0;
    while (selected.length < maxItems && pass < 10) {
      let addedInThisPass = 0;
      for (const brand of shuffledBrands) {
        const bucket = brandBuckets[brand];
        if (!bucket || bucket.length === 0) continue;

        // Pick item using prime stride per pass
        const itemIdx = (pass * 3 + 1) % bucket.length;
        const candidate = bucket[itemIdx];

        if (candidate && !seenIds.has(String(candidate.id))) {
          seenIds.add(String(candidate.id));
          selected.push(candidate);
          addedInThisPass++;
          if (selected.length >= maxItems) break;
        }
      }
      if (addedInThisPass === 0) break;
      pass++;
    }

    return selected.length >= 8 ? selected : pool.slice(0, 20);
  }, [products]);

  // Duplicate items for infinite seamless looping track
  const loopItems = [...marqueeItems, ...marqueeItems];


  // ═══════════════════════════════════════════════════════════════════
  // DUAL-SPLIT LOGO PARALLAX BLUR CALCULATIONS:
  // At scrollY = 0: Both layers sit at exact identical (0,0) with 0px blur (looks like ONE single logo)
  // When scrolling starts:
  // - Bottom Layer: Dives FAST DOWNWARD with quick deep blur & quick fade
  // - Top Layer: Floats SLOW UPWARD with gentle soft blur & lingering visibility
  // ═══════════════════════════════════════════════════════════════════
  const bottomLayerTranslateY = scrollY * 0.95;
  const bottomLayerOpacity = Math.max(0, 0.95 - scrollY * 0.0055);
  const bottomLayerBlur = Math.min(60, scrollY * 0.14);

  const topLayerTranslateY = -scrollY * 0.16;
  const topLayerOpacity = Math.max(0, 1 - scrollY * 0.0018);
  const topLayerBlur = Math.min(18, scrollY * 0.020);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4 pb-4 overflow-hidden flex flex-col items-center">
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 1. DUAL-SPLIT LOGO CONTAINER (SINGLE AT 0, SPLITS TOP & BOTTOM ON SCROLL) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full h-[19vw] sm:h-[15vw] lg:h-[13vw] min-h-[110px] sm:min-h-[140px] flex items-center justify-center select-none overflow-visible">
        
        {/* BOTTOM LAYER: Drifts DOWNWARD into background with DEEP real blur */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-100 ease-out z-0 will-change-transform"
          style={{
            transform: `translate3d(0, ${bottomLayerTranslateY}px, 0)`,
            opacity: bottomLayerOpacity,
            filter: `blur(${bottomLayerBlur}px)`,
            WebkitFilter: `blur(${bottomLayerBlur}px)`
          }}
        >
          <div className="flex items-center justify-center gap-1 sm:gap-3 tracking-tighter leading-none w-full px-2 text-center">
            <span className="text-[19vw] sm:text-[15vw] lg:text-[13vw] font-display font-black liquid-glass-logo-charcoal select-none">
              OUT
            </span>
            <span className="text-[19vw] sm:text-[15vw] lg:text-[13vw] font-display font-black liquid-glass-logo-terracotta select-none">
              FIT
            </span>
          </div>
        </div>

        {/* TOP LAYER: Floats UPWARD on scroll with soft blur & crisp initial state */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-100 ease-out z-10 will-change-transform"
          style={{
            transform: `translate3d(0, ${topLayerTranslateY}px, 0)`,
            opacity: topLayerOpacity,
            filter: `blur(${topLayerBlur}px)`,
            WebkitFilter: `blur(${topLayerBlur}px)`
          }}
        >
          <div className="flex items-center justify-center gap-1 sm:gap-3 tracking-tighter leading-none w-full px-2 text-center">
            <span className="text-[19vw] sm:text-[15vw] lg:text-[13vw] font-display font-black liquid-glass-logo-charcoal select-none">
              OUT
            </span>
            <span className="text-[19vw] sm:text-[15vw] lg:text-[13vw] font-display font-black liquid-glass-logo-terracotta select-none">
              FIT
            </span>
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 2. PRODUCT CARDS MARQUEE LOOP (RANDOM CLOTHES & 65S SMOOTH PACE) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 w-full mt-1 sm:mt-2">
        
        {/* Marquee Track with CSS Mask-Image Transparent Edge Fade */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)] py-1">

          {/* Running Infinite Loop Track (Smooth & Slow 65s Luxury Pace) */}
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
                  {/* Card Top: Psychological Discount Badge & Brand Monogram Pill */}
                  <div className="relative z-10 flex items-center justify-between w-full">
                    
                    {/* Psychological Discount Tag */}
                    <span className="btn-liquid btn-liquid-terracotta px-2 py-0.5 text-[9px] font-mono font-bold rounded-[2px] shadow-2xs">
                      -{discountPct}% OFF
                    </span>

                    {/* Brand Pill */}
                    <span className="text-[9px] font-mono font-bold text-[#8E9AA8] bg-[#F8F7F4] px-1.5 py-0.5 rounded-[2px] border border-[#5A6678]/10 uppercase truncate max-w-[100px]">
                      {p.brand ? p.brand : 'ATELIER'}
                    </span>
                  </div>

                  {/* Card Center: Pure Transparent Image Only (No Name / No Title) */}
                  <div className="relative w-full flex-1 flex items-center justify-center p-2 overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.name || 'Atelier Garment'}
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
                        className="btn-liquid btn-liquid-charcoal p-2 rounded-[2px] shadow-md cursor-pointer"
                        title="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(p, p.sizes?.[0] || 'M');
                        }}
                        className="btn-liquid btn-liquid-terracotta p-2 rounded-[2px] shadow-md cursor-pointer"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-white" />
                      </button>
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

      </div>

    </section>
  );
}
