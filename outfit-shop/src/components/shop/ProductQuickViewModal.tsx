'use client';

import React, { useState } from 'react';
import { ShopProduct, CurrencyCode } from '@/types';
import { CatalogService } from '@/services/catalogService';
import { X, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface ProductQuickViewModalProps {
  product: ShopProduct | null;
  currency: CurrencyCode;
  onClose: () => void;
  onAddToCart: (product: ShopProduct, size: string, qty: number) => void;
}

export function ProductQuickViewModal({
  product,
  currency,
  onClose,
  onAddToCart
}: ProductQuickViewModalProps) {
  if (!product) return null;

  const [selectedImg, setSelectedImg] = useState<string>(product.imageUrl);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [qty, setQty] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, qty);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1E2631]/60 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white/95 backdrop-blur-2xl border border-[#5A6678]/20 rounded-[2px] shadow-2xl overflow-hidden p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-liquid btn-liquid-glass absolute top-3 right-3 p-1.5 rounded-[2px] z-20"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Gallery Column */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[4/5] bg-[#F1EFEA] rounded-[2px] overflow-hidden border border-[#5A6678]/15">
              <img
                src={selectedImg}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Row */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    className={`w-14 h-14 shrink-0 rounded-[2px] overflow-hidden border transition-all ${
                      selectedImg === img ? 'border-[#C84428] ring-1 ring-[#C84428]' : 'border-[#5A6678]/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Column */}
          <div className="flex flex-col justify-between">
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E9AA8]">
                <span className="font-bold text-[#5A6678] uppercase">{product.brand}</span>
                <span>SKU: {product.sku}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-black text-[#1E2631] leading-tight">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-2">
                <span className="text-xl font-display font-black text-[#1E2631]">
                  {CatalogService.formatPrice(product.price, currency)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs font-mono text-[#8E9AA8] line-through">
                    {CatalogService.formatPrice(product.originalPrice, currency)}
                  </span>
                )}
                <span className="ml-auto text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[2px]">
                  {product.stock} in stock
                </span>
              </div>

              <p className="text-xs text-[#5A6678] leading-relaxed">
                {product.description}
              </p>

              {/* Material and Season */}
              <div className="bg-[#F8F7F4] border border-[#5A6678]/15 rounded-[2px] p-2.5 text-[11px] font-mono flex flex-col gap-1">
                <div><strong className="text-[#1E2631]">Composition:</strong> {product.material}</div>
                <div><strong className="text-[#1E2631]">Collection:</strong> {product.season}</div>
              </div>

              {/* Size Selector */}
              <div>
                <span className="text-xs font-mono font-bold text-[#1E2631] block mb-1.5 uppercase">
                  Select Size:
                </span>
                <div className="flex items-center gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`btn-liquid w-9 h-9 rounded-[2px] text-xs font-mono font-bold transition-all flex items-center justify-center ${
                        selectedSize === s
                          ? 'btn-liquid-active'
                          : 'btn-liquid-glass text-[#5A6678]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#1E2631] uppercase">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#5A6678]/20 rounded-[2px] bg-[#F8F7F4] overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="btn-liquid btn-liquid-glass px-2.5 py-1 text-xs font-bold text-[#5A6678] border-0 shadow-none"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono font-bold text-[#1E2631] bg-white border-x border-[#5A6678]/20">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="btn-liquid btn-liquid-glass px-2.5 py-1 text-xs font-bold text-[#5A6678] border-0 shadow-none"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#5A6678]/15 mt-4 flex flex-col gap-2.5">
              <button
                onClick={handleAdd}
                disabled={product.stock <= 0}
                className={`btn-liquid w-full py-2.5 rounded-[2px] text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs ${
                  product.stock <= 0
                    ? 'bg-slate-200 text-slate-400 border-transparent cursor-not-allowed'
                    : isAdded
                    ? 'btn-liquid-terracotta bg-emerald-700 hover:bg-emerald-800'
                    : 'btn-liquid-terracotta'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Shopping Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • {CatalogService.formatPrice(product.price * qty, currency)}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#8E9AA8] pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#5A6678]" /> Free insured shipping
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#5A6678]" /> Verified SS-MIS Stock
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
