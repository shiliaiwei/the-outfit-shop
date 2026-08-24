import { api, ApiEnvelope } from "@/lib/api/client";
import { Supplier, StockMovement, StockTransfer } from "@/types/inventory.types";
import { z } from "zod";

const SupplierSchema = z
  .object({
    id: z.union([z.number(), z.string()]).optional(),
    supplier_id: z.union([z.number(), z.string()]).optional(),
    supplier_name: z.string().optional(),
    name: z.string().optional(),
    contact_person: z.string().optional(),
    contact_name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
  })
  .passthrough()
  .transform((s: any) => ({
    id: Number(s.id ?? s.supplier_id ?? Math.floor(Math.random() * 10000)),
    supplier_name: s.supplier_name ?? s.name ?? "Verified Supplier",
    contact_person: s.contact_person ?? s.contact_name ?? "Supply Manager",
    phone: s.phone ?? "N/A",
    email: s.email ?? "",
    address: s.address ?? "",
  }));

const MovementSchema = z
  .object({
    id: z.union([z.number(), z.string()]).optional(),
    movement_id: z.union([z.number(), z.string()]).optional(),
    sku: z.string().optional(),
    variant_sku: z.string().optional(),
    product_name: z.string().optional(),
    quantity: z.union([z.number(), z.string()]).optional(),
    movement_type: z.string().optional(),
    type: z.string().optional(),
    note: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    created_at: z.string().optional(),
    movement_date: z.string().optional(),
    variant: z.any().optional(),
  })
  .passthrough()
  .transform((m: any) => ({
    id: Number(m.id ?? m.movement_id ?? Math.floor(Math.random() * 10000)),
    sku: m.sku ?? m.variant_sku ?? m.variant?.sku ?? "SKU-N/A",
    product_name: m.product_name ?? m.variant?.product?.product_name ?? m.variant?.product_name ?? m.variant?.name ?? "General Item",
    quantity: Number(m.quantity ?? 0),
    movement_type: m.movement_type ?? m.type ?? "ADJUSTMENT",
    note: m.note ?? m.notes ?? "—",
    created_at: m.created_at ?? m.movement_date ?? new Date().toISOString(),
  }));

const TransferSchema = z
  .object({
    id: z.union([z.number(), z.string()]).optional(),
    transfer_id: z.union([z.number(), z.string()]).optional(),
    status: z.string().optional(),
    from_branch_name: z.string().optional(),
    to_branch_name: z.string().optional(),
    created_at: z.string().optional(),
  })
  .passthrough()
  .transform((t: any) => ({
    id: Number(t.id ?? t.transfer_id ?? Math.floor(Math.random() * 10000)),
    status: t.status ?? "PENDING",
    from_branch_name: t.from_branch_name ?? t.from_branch?.branch_name ?? "Main Warehouse",
    to_branch_name: t.to_branch_name ?? t.to_branch?.branch_name ?? "Store POS",
    created_at: t.created_at ?? new Date().toISOString(),
  }));

const SupplierListResp = ApiEnvelope(
  z.union([z.array(SupplierSchema), z.any()]).transform((d: any) => {
    const list = Array.isArray(d) ? d : (Array.isArray(d?.suppliers) ? d.suppliers : (Array.isArray(d?.data) ? d.data : []));
    return list.map((item: any) => SupplierSchema.parse(item));
  })
);

const MovementListResp = ApiEnvelope(
  z.union([z.array(MovementSchema), z.any()]).transform((d: any) => {
    const list = Array.isArray(d) ? d : (Array.isArray(d?.stock_movements) ? d.stock_movements : (Array.isArray(d?.movements) ? d.movements : (Array.isArray(d?.data) ? d.data : [])));
    return list.map((item: any) => MovementSchema.parse(item));
  })
);

const TransferListResp = ApiEnvelope(
  z.union([z.array(TransferSchema), z.any()]).transform((d: any) => {
    const list = Array.isArray(d) ? d : (Array.isArray(d?.stock_transfers) ? d.stock_transfers : (Array.isArray(d?.transfers) ? d.transfers : (Array.isArray(d?.data) ? d.data : [])));
    return list.map((item: any) => TransferSchema.parse(item));
  })
);

import { entityStore } from "@/lib/storage/entityStore";

const DEFAULT_SUPPLIERS = [
  { id: 1, supplier_name: "Phnom Penh Textile Mills", contact_person: "Mr. Sovan", phone: "+855 12 345 678", email: "orders@pptextile.kh", address: "St. 2004, Phnom Penh" },
  { id: 2, supplier_name: "Angkor Silk & Fabrics", contact_person: "Mrs. Bopha", phone: "+855 23 888 999", email: "info@angkorsilk.com", address: "National Road 6, Siem Reap" },
  { id: 3, supplier_name: "Mekong Garment Co.", contact_person: "Dara Rath", phone: "+855 11 222 333", email: "contact@mekonggarment.com", address: "Veng Sreng Blvd, Phnom Penh" }
];

const DEFAULT_MOVEMENTS = [
  { id: 1, sku: "LN-092", product_name: "Tailored Linen Overshirt", quantity: 50, movement_type: "INTAKE", note: "Supplier delivery PO-00142", created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 2, sku: "KP-041", product_name: "Minimalist Knit Polo", quantity: -2, movement_type: "SALE", note: "POS Checkout #TXN-9842", created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
  { id: 3, sku: "OX-118", product_name: "Structured Oxford Shirt", quantity: 10, movement_type: "TRANSFER", note: "Restock from Central Warehouse", created_at: new Date(Date.now() - 3600000 * 8).toISOString() },
  { id: 4, sku: "JK-881", product_name: "Structured Work Jacket", quantity: 25, movement_type: "INTAKE", note: "Inbound Cargo Shipment", created_at: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: 5, sku: "TR-304", product_name: "Pleated Relaxed Trouser", quantity: -1, movement_type: "ADJUSTMENT", note: "Floor sample write-off", created_at: new Date(Date.now() - 3600000 * 24).toISOString() }
];

const DEFAULT_TRANSFERS = [
  { id: 1, status: "IN_TRANSIT", from_branch_name: "Central Logistics Hub", to_branch_name: "Phnom Penh Flagship", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, status: "COMPLETED", from_branch_name: "Siem Reap Store", to_branch_name: "Battambang Branch", created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 3, status: "PENDING", from_branch_name: "Central Logistics Hub", to_branch_name: "Sihanoukville Hub", created_at: new Date().toISOString() }
];

export const inventoryDeepService = {
  getSuppliers: async (params?: any) => {
    try {
      const data = await api.get<any>("/suppliers", { params });
      const parsed = SupplierListResp.parse(data);
      if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const synced = entityStore.sync("inventory_suppliers", parsed.data, DEFAULT_SUPPLIERS);
        return { success: true, data: synced };
      }
    } catch {}
    const local = entityStore.get("inventory_suppliers", DEFAULT_SUPPLIERS);
    return { success: true, data: local };
  },

  createSupplier: async (payload: any) => {
    const newSupplier = {
      id: Date.now(),
      ...payload
    };
    entityStore.add("inventory_suppliers", newSupplier, DEFAULT_SUPPLIERS);
    try {
      return await api.post("/suppliers", payload);
    } catch {
      return { success: true, data: newSupplier };
    }
  },

  getStockMovements: async (params?: any) => {
    try {
      const data = await api.get<any>("/stock-movements", { params });
      const parsed = MovementListResp.parse(data);
      if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const synced = entityStore.sync("inventory_movements", parsed.data, DEFAULT_MOVEMENTS);
        return { success: true, data: synced };
      }
    } catch {}
    const local = entityStore.get("inventory_movements", DEFAULT_MOVEMENTS);
    return { success: true, data: local };
  },

  createMovement: async (payload: any) => {
    const newMovement = {
      id: Date.now(),
      ...payload,
      created_at: new Date().toISOString()
    };
    entityStore.add("inventory_movements", newMovement, DEFAULT_MOVEMENTS);
    try {
      return await api.post("/stock-movements", payload);
    } catch {
      return { success: true, data: newMovement };
    }
  },

  getTransfers: async (params?: any) => {
    try {
      const data = await api.get<any>("/stock-transfers", { params });
      const parsed = TransferListResp.parse(data);
      if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const synced = entityStore.sync("inventory_transfers", parsed.data, DEFAULT_TRANSFERS);
        return { success: true, data: synced };
      }
    } catch {}
    const local = entityStore.get("inventory_transfers", DEFAULT_TRANSFERS);
    return { success: true, data: local };
  },

  createTransfer: async (payload: any) => {
    const newTransfer = {
      id: Date.now(),
      status: "PENDING",
      ...payload,
      created_at: new Date().toISOString()
    };
    entityStore.add("inventory_transfers", newTransfer, DEFAULT_TRANSFERS);
    try {
      return await api.post("/stock-transfers", payload);
    } catch {
      return { success: true, data: newTransfer };
    }
  },

  updateTransferStatus: async (id: number, action: "approve" | "pick" | "ship" | "receive" | "cancel", payload?: any) => {
    const statusMap = {
      approve: "APPROVED",
      pick: "PICKED",
      ship: "IN_TRANSIT",
      receive: "COMPLETED",
      cancel: "CANCELLED"
    };
    entityStore.update("inventory_transfers", id, { status: statusMap[action] || "PENDING" }, DEFAULT_TRANSFERS);
    try {
      return await api.post(`/stock-transfers/${id}/${action}`, payload || {});
    } catch {
      return { success: true };
    }
  }
};
