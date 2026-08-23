import { api, ApiEnvelope } from "@/lib/api/client";
import { z } from "zod";

const PurchaseOrderSchema = z.object({
  id: z.number(),
  supplier_id: z.number(),
  supplier_name: z.string().optional(),
  total_cost: z.number(),
  status: z.enum(["PENDING", "PARTIAL", "RECEIVED", "CANCELLED"]),
  expected_date: z.string(),
  created_at: z.string(),
});

const ShippingOrderSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  carrier: z.string(),
  tracking_number: z.string(),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "RETURNED"]),
  recipient_name: z.string(),
  created_at: z.string(),
});

const POListResp = ApiEnvelope(z.array(PurchaseOrderSchema));
const ShippingListResp = ApiEnvelope(z.array(ShippingOrderSchema));

export const fulfillmentService = {
  // Purchase Orders
  getPurchaseOrders: async (params?: any) => {
    const data = await api.get<any>("/purchases", { params });
    return POListResp.parse(data);
  },

  createPurchaseOrder: async (payload: any) => {
    return await api.post("/purchases", payload);
  },

  receivePurchaseItems: async (id: number, items: any[]) => {
    return await api.post(`/purchases/${id}/receive`, { received_items: items });
  },

  // Shipping
  getShippingOrders: async (params?: any) => {
    const data = await api.get<any>("/shipping-orders", { params });
    return ShippingListResp.parse(data);
  },

  updateShippingStatus: async (id: number, status: string) => {
    return await api.patch(`/shipping-orders/${id}`, { status });
  }
};
