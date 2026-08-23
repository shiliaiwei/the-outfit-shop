'use client';

import React from 'react';
import { CartItem, CurrencyCode } from '@/types';
import { CatalogService } from '@/services/catalogService';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

interface ShoppingBagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export function ShoppingBagDrawer({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQty,
  onRemoveItem,
  onCheckout
}: ShoppingBagDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const freeShippingThreshold = 120.00;
  const progressPct = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#1E2631]/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-white/95 backdrop-blur-2xl border-l border-[#5A6678]/20 flex flex-col justify-between shadow-2xl p-4 sm:p-6 text-[#1E2631] animate-in slide-in-from-right duration-300">
          
          {/* Top Bar */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#5A6678]/15">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#C84428]" />
                <h2 className="text-sm font-display font-black uppercase tracking-wider">
                  Shopping Bag ({items.reduce((a, b) => a + b.qty, 0)})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="btn-liquid btn-liquid-glass p-1.5 rounded-[2px]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="my-3 p-3 bg-[#F8F7F4] border border-[#5A6678]/15 rounded-[2px]">
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <span className="font-bold text-[#1E2631]">
                  {progressPct >= 100 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Free Atelier Delivery Unlocked
                    </span>
                  ) : (
                    <span>Add {CatalogService.formatPrice(remainingForFree, currency)} for free delivery</span>
                  )}
                </span>
                <span className="text-[#8E9AA8]">{progressPct}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-[2px] overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${progressPct >= 100 ? 'bg-emerald-600' : 'bg-[#C84428]'}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-auto py-12 text-center text-[#8E9AA8]">
                <ShoppingBag className="w-10 h-10 mb-3 opacity-30 text-[#1E2631]" />
                <p className="text-xs font-mono font-bold uppercase text-[#5A6678]">Your bag is empty</p>
                <p className="text-[11px] mt-1">Discover handcrafted atelier garments from the catalog</p>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-3 p-2.5 bg-white border border-[#5A6678]/15 rounded-[2px] shadow-2xs items-center"
                >
                  <img
                    src={item.imageUrl || item.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-[2px] bg-[#F1EFEA] border border-[#5A6678]/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-[#8E9AA8] uppercase truncate">{item.brand || 'OutFIT'}</span>
                      <span className="text-xs font-display font-black text-[#1E2631]">
                        {CatalogService.formatPrice(item.price * item.qty, currency)}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#1E2631] truncate">{item.name}</h4>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#F8F7F4] border border-[#5A6678]/20 rounded-[2px] font-bold">
                        Size: {item.size}
                      </span>
                      <span className="text-[9px] font-mono text-[#8E9AA8]">
                        SKU: {item.sku}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#5A6678]/20 rounded-[2px] bg-[#F8F7F4] overflow-hidden">
                        <button
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="btn-liquid btn-liquid-glass px-2 py-0.5 text-xs font-bold text-[#5A6678] border-0 shadow-none"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-[11px] font-mono font-bold text-[#1E2631] bg-white border-x border-[#5A6678]/20">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="btn-liquid btn-liquid-glass px-2 py-0.5 text-xs font-bold text-[#5A6678] border-0 shadow-none"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="btn-liquid btn-liquid-glass p-1 text-red-500 hover:text-red-700 shadow-none"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          <div className="pt-4 border-t border-[#5A6678]/15 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#5A6678]">Subtotal:</span>
              <span className="font-bold text-sm text-[#1E2631]">
                {CatalogService.formatPrice(subtotal, currency)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-[11px] font-mono text-[#8E9AA8]">
              <span>Shipping:</span>
              <span className="text-emerald-700 font-semibold">
                {subtotal >= freeShippingThreshold || items.length === 0 ? 'FREE' : CatalogService.formatPrice(15.00, currency)}
              </span>
            </div>

            <button
              onClick={onCheckout}
              disabled={items.length === 0}
              className={`btn-liquid w-full py-3 rounded-[2px] text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs ${
                items.length === 0
                  ? 'bg-slate-200 text-slate-400 border-transparent cursor-not-allowed'
                  : 'btn-liquid-terracotta'
              }`}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
