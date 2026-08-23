import { api, ApiEnvelope } from "@/lib/api/client";
import { z } from "zod";

// --- Zod Schemas for Reporting Data ---
const SalesReportSchema = z.object({
  period: z.string(),
  total_sales: z.number(),
  order_count: z.number(),
  aov: z.number(),
  items_sold: z.number(),
  daily_stats: z.array(z.object({
    date: z.string(),
    revenue: z.number(),
    orders: z.number()
  }))
});

const InventoryValuationSchema = z.object({
  total_items: z.number(),
  total_cost_value: z.number(),
  total_retail_value: z.number(),
  potential_profit: z.number(),
  category_breakdown: z.array(z.object({
    category_name: z.string(),
    item_count: z.number(),
    value: z.number()
  }))
});

const StockAgingSchema = z.object({
  aging_groups: z.array(z.object({
    days_range: z.string(),
    item_count: z.number(),
    value: z.number()
  }))
});

const SalesReportResp = ApiEnvelope(SalesReportSchema);
const InventoryValuationResp = ApiEnvelope(InventoryValuationSchema);
const StockAgingResp = ApiEnvelope(StockAgingSchema);

export const reportService = {
  getSalesReport: async (params: { from: string; to: string }) => {
    const data = await api.get<any>("/reports/sales", { params });
    return SalesReportResp.parse(data);
  },

  getInventoryValuation: async () => {
    const data = await api.get<any>("/reports/inventory-valuation");
    return InventoryValuationResp.parse(data);
  },

  getStockAging: async () => {
    const data = await api.get<any>("/reports/stock-aging");
    return StockAgingResp.parse(data);
  },

  exportReport: async (type: 'inventory' | 'stock-movements' | 'sales', format: 'excel' | 'csv' | 'pdf', params?: any) => {
    // In a real app, this would handle the binary response or redirect to a download URL
    const url = `/exports/${type}/${format}`;
    const searchParams = new URLSearchParams(params);
    const downloadUrl = `${process.env.NEXT_PUBLIC_API_BASE || 'https://api.kesararamwithdigital.tech/api/v1'}${url}?${searchParams.toString()}`;

    // For now, we simulate the action or provide the URL
    if (typeof window !== 'undefined') {
        window.open(downloadUrl, '_blank');
    }
    return downloadUrl;
  }
};
