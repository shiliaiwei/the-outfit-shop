'use client';

import React from 'react';
import { ApiPagination } from '@/types';
import { 
  Plus, 
  Loader2, 
  ChevronDown,
  CheckCircle2
} from 'lucide-react';

interface CatalogPaginationProps {
  pagination: ApiPagination;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onLoadMore: () => void;
  isLoading?: boolean;
  isLoadingMore?: boolean;
}

export function CatalogPagination({
  pagination,
  onPerPageChange,
  onLoadMore,
  isLoading = false,
  isLoadingMore = false,
}: CatalogPaginationProps) {
  const {
    current_page,
    per_page,
    total_pages,
    has_next,
  } = pagination;

  // If no items or only 1 page with no more to load
  if (total_pages <= 1 && !has_next) {
    return (
      <div className="mt-10 mb-6 flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#8E9AA8]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6678]" />
          <span>All available pieces loaded</span>
        </div>
      </div>
    );
  }

  return (
    <nav 
      aria-label="Catalog See More Navigation" 
      className="mt-10 mb-8 flex flex-col items-center justify-center gap-3 w-full"
    >
      {/* Primary See More Action Button */}
      <div className="flex items-center justify-center w-full">
        {has_next ? (
          <button
            type="button"
            disabled={isLoadingMore || isLoading}
            onClick={onLoadMore}
            className="btn-liquid btn-liquid-charcoal min-w-[220px] px-8 py-3.5 rounded-[2px] text-xs font-mono font-bold uppercase tracking-wider text-white hover:border-[#C84428] flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 text-white animate-spin" />
                <span>Loading pieces...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-white" />
                <span>See More</span>
              </>
            )}
          </button>
        ) : (
          <div className="liquid-glass bg-white/90 border border-[#5A6678]/15 px-5 py-2.5 rounded-[2px] text-xs font-mono text-[#5A6678] flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C84428]" />
            <span>You have reached the end of the collection</span>
          </div>
        )}
      </div>
    </nav>
  );
}
