'use client';

import React, { useState } from 'react';
import { ApiPagination } from '@/types';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CatalogPaginationProps {
  pagination: ApiPagination;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  isLoading?: boolean;
}

export function CatalogPagination({
  pagination,
  onPageChange,
  onPerPageChange,
  isLoading = false,
}: CatalogPaginationProps) {
  const [jumpInput, setJumpInput] = useState<string>('');

  const {
    current_page,
    per_page,
    total_items,
    total_pages,
    has_next,
    has_previous,
    from,
    to
  } = pagination;

  // Windowed page numbers generator
  const getPageNumbers = () => {
    if (total_pages <= 5) {
      return Array.from({ length: total_pages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    pages.push(1);

    if (current_page > 3) {
      pages.push('...');
    }

    const start = Math.max(2, current_page - 1);
    const end = Math.min(total_pages - 1, current_page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current_page < total_pages - 2) {
      pages.push('...');
    }

    pages.push(total_pages);

    return pages;
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpInput, 10);
    if (!isNaN(target) && target >= 1 && target <= total_pages) {
      onPageChange(target);
      setJumpInput('');
    }
  };

  if (total_items === 0) return null;

  return (
    <nav aria-label="Catalog Pagination" className="mt-12 mb-8 flex flex-col items-center gap-4">
      
      {/* 1. Ultra-Clean & Easy Central Pagination Bar */}
      <div className="liquid-glass bg-white/95 border border-[#5A6678]/15 rounded-[2px] px-3 sm:px-4 py-2 shadow-xs flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        
        {/* Previous Page Button */}
        <button
          type="button"
          disabled={!has_previous || current_page <= 1 || isLoading}
          onClick={() => onPageChange(current_page - 1)}
          className="btn-liquid btn-liquid-glass px-3 py-1.5 rounded-[2px] text-xs font-mono font-bold text-[#1E2631] hover:border-[#C84428] flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1.5 py-1 text-xs font-mono text-[#8E9AA8] select-none"
                >
                  …
                </span>
              );
            }

            const pageNum = Number(page);
            const isActive = current_page === pageNum;

            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                disabled={isLoading}
                onClick={() => onPageChange(pageNum)}
                className={`btn-liquid min-w-[34px] h-[32px] px-2 rounded-[2px] text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all ${
                  isActive
                    ? 'btn-liquid-terracotta text-white font-black shadow-xs'
                    : 'btn-liquid-glass text-[#5A6678] hover:text-[#1E2631]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          disabled={!has_next || current_page >= total_pages || isLoading}
          onClick={() => onPageChange(current_page + 1)}
          className="btn-liquid btn-liquid-glass px-3 py-1.5 rounded-[2px] text-xs font-mono font-bold text-[#1E2631] hover:border-[#C84428] flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

      </div>

      {/* 2. Secondary Easy Sub-Bar (Range Details + Per Page + Page Jump) */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-[#5A6678]">
        
        {/* Showing Range status */}
        <div className="flex items-center gap-1">
          <span>Showing</span>
          <strong className="text-[#1E2631]">{from ?? 1}–{to ?? total_items}</strong>
          <span>of</span>
          <strong className="text-[#1E2631]">{total_items.toLocaleString()}</strong>
          <span>pieces</span>
        </div>

        <span className="hidden sm:inline text-[#8E9AA8]">•</span>

        {/* Per-Page Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#8E9AA8]">Per page:</span>
          {[12, 24, 48].map((size) => (
            <button
              key={size}
              type="button"
              disabled={isLoading}
              onClick={() => onPerPageChange(size)}
              className={`px-2 py-0.5 rounded-[2px] text-[11px] font-mono cursor-pointer transition-all ${
                per_page === size
                  ? 'bg-[#1E2631] text-white font-bold'
                  : 'hover:bg-slate-200 text-[#5A6678]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <span className="hidden sm:inline text-[#8E9AA8]">•</span>

        {/* Quick Page Jump */}
        <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
          <span className="text-[#8E9AA8]">Go to page:</span>
          <input
            type="number"
            min={1}
            max={total_pages}
            placeholder={String(current_page)}
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
            className="w-12 px-1.5 py-0.5 bg-white border border-[#5A6678]/20 rounded-[2px] text-xs font-mono text-center text-[#1E2631] focus:outline-none focus:border-[#C84428]"
          />
          <button
            type="submit"
            disabled={!jumpInput || isLoading}
            className="btn-liquid btn-liquid-charcoal px-2 py-0.5 rounded-[2px] text-[11px] font-mono text-white disabled:opacity-30 cursor-pointer"
          >
            Go
          </button>
        </form>

      </div>

    </nav>
  );
}
