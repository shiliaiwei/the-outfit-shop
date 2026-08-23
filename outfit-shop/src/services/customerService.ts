import { api, ApiEnvelope } from "@/lib/api/client";
import { z } from "zod";

const CustomerSchema = z.object({
  id: z.number(),
  customer_name: z.string(),
  phone: z.string(),
  email: z.string().optional(),
  loyalty_points: z.number().optional(),
  loyalty_tier: z.string().optional(),
  created_at: z.string(),
});

const LoyaltySchema = z.object({
  points: z.number(),
  tier: z.string(),
  spend_total: z.number(),
  points_to_next_tier: z.number(),
});

const CustomerListResp = ApiEnvelope(z.array(CustomerSchema));
const CustomerResp = ApiEnvelope(CustomerSchema);
const LoyaltyResp = ApiEnvelope(LoyaltySchema);

export const customerService = {
  getCustomers: async (params?: any) => {
    const data = await api.get<any>("/customers", { params });
    return CustomerListResp.parse(data);
  },

  getCustomer: async (id: number) => {
    const data = await api.get<any>(`/customers/${id}`);
    return CustomerResp.parse(data).data;
  },

  createCustomer: async (payload: { customer_name: string; phone: string; email?: string }) => {
    return await api.post<any>("/customers", payload);
  },

  updateCustomer: async (id: number, payload: any) => {
    return await api.patch<any>(`/customers/${id}`, payload);
  },

  getLoyalty: async (id: number) => {
    const data = await api.get<any>(`/customers/${id}/loyalty`);
    return LoyaltyResp.parse(data).data;
  },

  redeemPoints: async (id: number, points: number) => {
    return await api.post<any>(`/customers/${id}/redeem-points`, { points });
  }
};
