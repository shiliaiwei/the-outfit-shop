'use client';

import React, { useState } from 'react';
import { ApiCategory, ApiBrand } from '@/types';
import { 
  X, 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  Search, 
  Tag, 
  Layers, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ApiCategory[];
  brands: ApiBrand[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  activeSort: 'featured' | 'price-asc' | 'price-desc' | 'stock' | 'name';
  onSelectSort: (sort: 'featured' | 'price-asc' | 'price-desc' | 'stock' | 'name') => void;
  totalItems: number;
  onResetFilters: () => void;
}

export function FilterDrawer({
  isOpen,
  onClose,
  categories,
  brands,
  activeCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  activeSort,
  onSelectSort,
  totalItems,
  onResetFilters,
}: FilterDrawerProps) {
  const [brandSearch, setBrandSearch] = useState('');

  if (!isOpen) return null;

  const activeFilterCount = (activeCategory !== 'All' ? 1 : 0) + (selectedBrand !== 'All' ? 1 : 0);

  const filteredBrands = brands.filter((b) =>
    b.brand_name.toLowerCase().includes(brandSearch.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#12171E]/50 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Pop Slide-out Menu (Left side of page) */}
      <aside 
        className="absolute inset-y-0 left-0 max-w-full flex w-full sm:w-[420px] bg-white/98 backdrop-blur-2xl border-r border-[#5A6678]/20 shadow-2xl flex-col z-10 animate-in slide-in-from-left duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[#5A6678]/15 flex items-center justify-between bg-white/90 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[2px] bg-[#1E2631] text-white flex items-center justify-center shadow-xs">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-[#1E2631] uppercase tracking-wider flex items-center gap-2">
                <span>Catalog Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-[#C84428] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-[2px]">
                    {activeFilterCount} Active
                  </span>
                )}
              </h3>
              <p className="text-[10px] font-mono text-[#8E9AA8]">Refine by collection, atelier brand &amp; sorting</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-[11px] font-mono font-bold text-[#C84428] hover:underline flex items-center gap-1 px-2 py-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[2px] text-[#5A6678] hover:text-[#1E2631] hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close Filter Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 divide-y divide-[#5A6678]/10">
          
          {/* 1. Category Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#1E2631] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#C84428]" />
                <span>Categories</span>
              </span>
              <span className="text-[10px] font-mono text-[#8E9AA8]">
                {categories.length + 1} Options
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => onSelectCategory('All')}
                className={`w-full px-3 py-2 text-xs font-mono rounded-[2px] flex items-center justify-between transition-all cursor-pointer text-left ${
                  activeCategory === 'All'
                    ? 'btn-liquid-active bg-[#1E2631] text-white font-bold shadow-xs'
                    : 'bg-[#F8F7F4] hover:bg-slate-200/70 text-[#1E2631] border border-[#5A6678]/10'
                }`}
              >
                <span>All Categories</span>
                {activeCategory === 'All' && <Check className="w-3.5 h-3.5 text-white" />}
              </button>

              {categories.map((cat) => {
                const isSelected = activeCategory.toLowerCase() === cat.category_name.toLowerCase();
                return (
                  <button
                    key={cat.category_id}
                    type="button"
                    onClick={() => onSelectCategory(cat.category_name)}
                    className={`w-full px-3 py-2 text-xs font-mono rounded-[2px] flex items-center justify-between transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'btn-liquid-active bg-[#1E2631] text-white font-bold shadow-xs'
                        : 'bg-[#F8F7F4] hover:bg-slate-200/70 text-[#1E2631] border border-[#5A6678]/10'
                    }`}
                  >
                    <span className="truncate">{cat.category_name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Brand Section */}
          <div className="pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#1E2631] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#C84428]" />
                <span>Atelier Brands</span>
              </span>
              <span className="text-[10px] font-mono text-[#8E9AA8]">
                {brands.length} Brands
              </span>
            </div>

            {/* Brand Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8E9AA8]" />
              <input
                type="text"
                placeholder="Search brand (e.g. Nike, Louis Vuitton)..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#F8F7F4] border border-[#5A6678]/20 rounded-[2px] text-xs font-mono text-[#1E2631] placeholder-[#8E9AA8] focus:outline-none focus:border-[#C84428]"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => onSelectBrand('All')}
                className={`px-2.5 py-1.5 text-xs font-mono rounded-[2px] flex items-center justify-between transition-all cursor-pointer text-left col-span-2 ${
                  selectedBrand === 'All'
                    ? 'btn-liquid-terracotta font-bold text-white shadow-xs'
                    : 'bg-[#F8F7F4] hover:bg-slate-200/70 text-[#1E2631] border border-[#5A6678]/10'
                }`}
              >
                <span>All Brands</span>
                {selectedBrand === 'All' && <Check className="w-3.5 h-3.5 text-white" />}
              </button>

              {filteredBrands.map((b) => {
                const isSelected = selectedBrand.toLowerCase() === b.brand_name.toLowerCase();
                return (
                  <button
                    key={b.brand_id}
                    type="button"
                    onClick={() => onSelectBrand(b.brand_name)}
                    className={`px-2.5 py-1.5 text-[11px] font-mono rounded-[2px] flex items-center justify-between transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'btn-liquid-terracotta font-bold text-white shadow-xs'
                        : 'bg-[#F8F7F4] hover:bg-slate-200/70 text-[#1E2631] border border-[#5A6678]/10'
                    }`}
                  >
                    <span className="truncate">{b.brand_name}</span>
                    {isSelected && <Check className="w-3 h-3 text-white shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Sort Preference Section */}
          <div className="pt-5 space-y-3">
            <span className="text-xs font-mono font-bold text-[#1E2631] uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C84428]" />
              <span>Catalog Sorting</span>
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'featured', label: 'Featured Pieces' },
                { id: 'price-asc', label: 'Price: Low to High' },
                { id: 'price-desc', label: 'Price: High to Low' },
                { id: 'stock', label: 'Available Stock' },
                { id: 'name', label: 'Alphabetical A-Z' }
              ].map((s) => {
                const isSelected = activeSort === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelectSort(s.id as any)}
                    className={`px-2.5 py-1.5 text-xs font-mono rounded-[2px] flex items-center justify-between transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'btn-liquid-active bg-[#1E2631] text-white font-bold shadow-xs'
                        : 'bg-[#F8F7F4] hover:bg-slate-200/70 text-[#1E2631] border border-[#5A6678]/10'
                    }`}
                  >
                    <span className="truncate">{s.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-white shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Drawer Footer CTA */}
        <div className="p-4 border-t border-[#5A6678]/15 bg-white/95 sticky bottom-0 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="btn-liquid btn-liquid-glass px-4 py-2.5 rounded-[2px] text-xs font-mono font-bold text-[#5A6678] hover:text-[#1E2631] cursor-pointer flex-1 text-center"
          >
            Reset Filters
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-liquid btn-liquid-charcoal px-5 py-2.5 rounded-[2px] text-xs font-mono font-bold text-white uppercase tracking-wider shadow-md cursor-pointer flex-1 text-center"
          >
            View {totalItems.toLocaleString()} Pieces
          </button>
        </div>

      </aside>

    </div>
  );
}
