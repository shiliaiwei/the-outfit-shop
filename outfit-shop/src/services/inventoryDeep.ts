import { api, ApiEnvelope } from "@/lib/api/client";
import { Supplier, StockMovement, StockTransfer } from "@/types/inventory.types";
import { z } from "zod";

const SupplierSchema = z.object({
  id: z.number(),
  supplier_name: z.string(),
  contact_person: z.string().optional(),
  phone: z.string(),
  email: z.string().optional(),
  address: z.string().optional(),
});

const MovementSchema = z.object({
  id: z.number(),
  sku: z.string(),
  product_name: z.string(),
  quantity: z.number(),
  movement_type: z.string(),
  note: z.string().optional(),
  created_at: z.string(),
});

const TransferSchema = z.object({
  id: z.number(),
  status: z.string(),
  from_branch_name: z.string().optional(),
  to_branch_name: z.string().optional(),
  created_at: z.string(),
});

const SupplierListResp = ApiEnvelope(z.array(SupplierSchema));
const MovementListResp = ApiEnvelope(z.array(MovementSchema));
const TransferListResp = ApiEnvelope(z.array(TransferSchema));

export const inventoryDeepService = {
  getSuppliers: async (params?: any) => {
    const data = await api.get<any>("/suppliers", { params });
    return SupplierListResp.parse(data);
  },

  createSupplier: async (payload: any) => {
    return await api.post("/suppliers", payload);
  },

  getStockMovements: async (params?: any) => {
    const data = await api.get<any>("/stock-movements", { params });
    return MovementListResp.parse(data);
  },

  getTransfers: async (params?: any) => {
    const data = await api.get<any>("/stock-transfers", { params });
    return TransferListResp.parse(data);
  },

  createTransfer: async (payload: any) => {
    return await api.post("/stock-transfers", payload);
  },

  updateTransferStatus: async (id: number, action: "approve" | "pick" | "ship" | "receive" | "cancel", payload?: any) => {
    return await api.post(`/stock-transfers/${id}/${action}`, payload || {});
  }
};
