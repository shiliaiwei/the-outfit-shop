"use client";

import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/reportService";

export function useSalesReport(params: { from: string; to: string }) {
  return useQuery({
    queryKey: ["reports", "sales", params],
    queryFn: () => reportService.getSalesReport(params),
    staleTime: 5 * 60_000, // 5 minutes
  });
}

export function useInventoryValuation() {
  return useQuery({
    queryKey: ["reports", "inventory-valuation"],
    queryFn: () => reportService.getInventoryValuation(),
    staleTime: 30 * 60_000, // 30 minutes
  });
}

export function useStockAging() {
  return useQuery({
    queryKey: ["reports", "stock-aging"],
    queryFn: () => reportService.getStockAging(),
    staleTime: 30 * 60_000,
  });
}
