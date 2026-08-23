'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CurrencyCode } from '@/types';
import { BrandWordmark } from '@/components/brand/BrandWordmark';
import { 
  ShoppingBag, 
  Search, 
  ChevronDown, 
  Globe, 
  SlidersHorizontal, 
  Sparkles, 
  ShieldCheck, 
  Check,
  X
} from 'lucide-react';

interface ShopHeaderProps {
  cartCount: number;
  wishlistCount: number;
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalProductsCount: number;
}


export function ShopHeader({
  cartCount,
  wishlistCount,
  currency,
  onCurrencyChange,
  onOpenCart,
  searchQuery,
  onSearchChange,
  totalProductsCount,
}: ShopHeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Click outside to close currency dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('header-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full">
      <nav className="liquid-glass backdrop-blur-xl bg-white/95 border-b border-[#5A6678]/15 px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand Logo (Clean & Pure) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-[2px] bg-white border border-[#5A6678]/20 flex items-center justify-center p-1 shadow-xs">
            <img
              src="/OutFIT/OutFIT.svg"
              alt="OUTFIT Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <BrandWordmark size="md" />
        </div>

        {/* Search Bar - Responsive Compact */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9AA8]" />
            <input
              id="header-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search collection, fabric, SKU..."
              className="w-full pl-9 pr-8 py-1.5 bg-[#F8F7F4] border border-[#5A6678]/20 rounded-[2px] text-xs text-[#1E2631] placeholder-[#8E9AA8] focus:outline-none focus:border-[#C84428] focus:bg-white transition-all font-sans"
            />

              {searchQuery ? (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E9AA8] hover:text-[#1E2631] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden lg:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#8E9AA8] bg-white border border-[#5A6678]/20 px-1 py-0.2 rounded-[2px]">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Action Utilities & Drawer Triggers */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Currency Selector Container (Relative wrapper) */}
            <div className="relative" ref={currencyRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="btn-liquid btn-liquid-glass px-2.5 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer hover:border-[#C84428]"
                aria-haspopup="listbox"
                aria-expanded={currencyMenuOpen}
              >
                <span>{currency}</span>
                <ChevronDown className={`w-3 h-3 text-[#8E9AA8] transition-transform duration-200 ${currencyMenuOpen ? 'rotate-180 text-[#C84428]' : ''}`} />
              </button>

              {/* Floating Dropdown List Overlay (Centered under the button: left-1/2 -translate-x-1/2) */}
              {currencyMenuOpen && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-28 bg-white border border-[#5A6678]/20 rounded-[2px] shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top overflow-hidden"
                  style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}
                >
                  <div className="px-2.5 py-1 border-b border-[#5A6678]/10 text-[9px] font-mono uppercase tracking-widest text-[#8E9AA8] text-center">
                    Currency
                  </div>
                  {(['USD', 'KHR', 'EUR'] as CurrencyCode[]).map((c) => {
                    const isSelected = currency === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          onCurrencyChange(c);
                          setCurrencyMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-mono font-bold flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-[#1E2631] text-white' 
                            : 'text-[#1E2631] hover:bg-[#F8F7F4] hover:text-[#C84428]'
                        }`}
                      >
                        <span>{c}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C84428]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Shopping Bag Button (Crisp & Never Squished) */}
            <button
              type="button"
              onClick={onOpenCart}
              className={`btn-liquid px-3 sm:px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs group shrink-0 cursor-pointer ${
                cartCount > 0 ? 'btn-liquid-terracotta' : 'btn-liquid-charcoal'
              }`}
            >
              <div className="relative flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
                {cartCount > 0 && (
                  <span className="bg-white text-[#C84428] text-[9px] font-black px-1.5 py-0.2 rounded-[2px] shadow-xs">
                    {cartCount}
                  </span>
                )}
                <span className="font-mono text-white">Bag</span>
              </div>
            </button>
          </div>

        </div>

        {/* Mobile Search Row */}
        <div className="mt-2 block md:hidden">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9AA8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search collection, fabric, SKU-GUC-0182..."
              className="w-full pl-9 pr-8 py-1.5 bg-[#F8F7F4] border border-[#5A6678]/20 rounded-[2px] text-xs text-[#1E2631] placeholder-[#8E9AA8] focus:outline-none focus:border-[#C84428] focus:bg-white transition-all font-sans"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E9AA8] hover:text-[#1E2631] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}


