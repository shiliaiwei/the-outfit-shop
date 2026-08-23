'use client';

import React, { useState } from 'react';
import { ApiPagination } from '@/types';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ArrowRight,
  SlidersHorizontal 
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
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

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

  // Generate pagination window array (e.g., [1, '...', 4, 5, 6, '...', 77])
  const getPageNumbers = () => {
    if (total_pages <= 7) {
      return Array.from({ length: total_pages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const delta = 2; // Number of pages to show around current page

    const left = Math.max(2, current_page - delta);
    const right = Math.min(total_pages - 1, current_page + delta);

    pages.push(1);

    if (left > 2) {
      pages.push('...');
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < total_pages - 1) {
      pages.push('...');
    }

    pages.push(total_pages);

    return pages;
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPage = parseInt(jumpPageInput, 10);
    if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= total_pages) {
      onPageChange(targetPage);
      setJumpPageInput('');
    }
  };

  if (total_items === 0) return null;

  return (
    <div className="mt-10 mb-8 w-full flex flex-col gap-4">
      
      {/* 1. Progress Bar & Real-Time Dynamic Counts */}
      <div className="flex flex-col items-center gap-2 w-full max-w-md mx-auto text-center">
        <div className="flex items-center justify-between w-full text-xs font-mono text-[#5A6678]">
          <span>
            Showing <strong className="text-[#1E2631] font-bold">{from ?? (total_items > 0 ? 1 : 0)}</strong> – <strong className="text-[#1E2631] font-bold">{to ?? total_items}</strong>
          </span>
          <span>
            Total <strong className="text-[#C84428] font-bold">{total_items.toLocaleString()}</strong> Pieces
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-[2px] overflow-hidden">
          <div
            className="h-full bg-[#1E2631] transition-all duration-300 ease-out"
            style={{
              width: `${Math.min(100, Math.max(1, Math.round(((to ?? 1) / (total_items || 1)) * 100)))}%`
            }}
          />
        </div>
      </div>

      {/* 2. Interactive Luxury Liquid Glass Pagination Toolbar */}
      <div className="liquid-glass bg-white/95 border border-[#5A6678]/15 rounded-[2px] p-2.5 sm:p-3 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Left: Per-Page Limit Selector */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#5A6678] w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8E9AA8]" />
            <span className="font-bold text-[11px] uppercase tracking-wider text-[#8E9AA8]">Per Page:</span>
          </div>
          <div className="flex items-center gap-1">
            {[12, 24, 48].map((size) => {
              const isActive = per_page === size;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={isLoading}
                  onClick={() => onPerPageChange(size)}
                  className={`btn-liquid px-2.5 py-1 text-xs font-mono font-bold rounded-[2px] cursor-pointer transition-all ${
                    isActive
                      ? 'btn-liquid-active bg-[#1E2631] text-white shadow-2xs'
                      : 'btn-liquid-glass text-[#5A6678] hover:text-[#1E2631]'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Interactive Page Buttons with Ellipsis */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 lg:pb-0 scrollbar-none justify-center">
          
          {/* First Page */}
          <button
            type="button"
            disabled={!has_previous || current_page <= 1 || isLoading}
            onClick={() => onPageChange(1)}
            className="btn-liquid btn-liquid-glass p-1.5 rounded-[2px] text-xs font-mono text-[#5A6678] hover:text-[#1E2631] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            title="First Page"
            aria-label="Go to first page"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>

          {/* Previous Page */}
          <button
            type="button"
            disabled={!has_previous || current_page <= 1 || isLoading}
            onClick={() => onPageChange(current_page - 1)}
            className="btn-liquid btn-liquid-glass px-2.5 py-1.5 rounded-[2px] text-xs font-mono font-bold text-[#5A6678] hover:text-[#1E2631] flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Page Number Pills */}
          <div className="flex items-center gap-1 mx-1">
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
                  className={`btn-liquid min-w-[32px] h-[30px] px-2 rounded-[2px] text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all ${
                    isActive
                      ? 'btn-liquid-terracotta shadow-xs font-black'
                      : 'btn-liquid-glass text-[#5A6678] hover:text-[#1E2631] hover:border-[#5A6678]/40'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Page */}
          <button
            type="button"
            disabled={!has_next || current_page >= total_pages || isLoading}
            onClick={() => onPageChange(current_page + 1)}
            className="btn-liquid btn-liquid-glass px-2.5 py-1.5 rounded-[2px] text-xs font-mono font-bold text-[#5A6678] hover:text-[#1E2631] flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            aria-label="Go to next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Last Page */}
          <button
            type="button"
            disabled={!has_next || current_page >= total_pages || isLoading}
            onClick={() => onPageChange(total_pages)}
            className="btn-liquid btn-liquid-glass p-1.5 rounded-[2px] text-xs font-mono text-[#5A6678] hover:text-[#1E2631] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            title="Last Page"
            aria-label="Go to last page"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>

        </div>

        {/* Right: Quick Page Jump Input */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#5A6678] w-full lg:w-auto justify-end">
          <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#8E9AA8] font-bold uppercase tracking-wider hidden sm:inline">
              Page:
            </span>
            <div className="flex items-center gap-1 bg-[#F8F7F4] border border-[#5A6678]/20 rounded-[2px] px-2 py-1 focus-within:border-[#C84428] transition-colors">
              <input
                type="number"
                min={1}
                max={total_pages}
                placeholder={String(current_page)}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                className="w-10 bg-transparent text-xs font-mono font-bold text-[#1E2631] text-center focus:outline-none placeholder:text-[#8E9AA8]"
              />
              <span className="text-[10px] text-[#8E9AA8]">/ {total_pages}</span>
            </div>
            <button
              type="submit"
              disabled={isLoading || !jumpPageInput}
              className="btn-liquid btn-liquid-charcoal px-2 py-1 text-xs font-mono font-bold rounded-[2px] disabled:opacity-30 cursor-pointer flex items-center gap-1"
              title="Jump to page"
            >
              <span>Go</span>
              <ArrowRight className="w-3 h-3 text-white" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
