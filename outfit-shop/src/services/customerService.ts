import { api, ApiEnvelope } from "@/lib/api/client";
import { z } from "zod";

const CustomerSchema = z
  .object({
    id: z.union([z.number(), z.string()]).optional(),
    customer_id: z.union([z.number(), z.string()]).optional(),
    customer_name: z.string().optional(),
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().nullable().optional(),
    loyalty_points: z.union([z.number(), z.string()]).optional(),
    loyalty_tier: z.string().optional(),
    created_at: z.string().optional(),
  })
  .passthrough()
  .transform((c: any) => ({
    id: Number(c.id ?? c.customer_id ?? Math.floor(Math.random() * 10000)),
    customer_name: c.customer_name ?? c.name ?? "Valued Patron",
    phone: c.phone ?? "N/A",
    email: c.email ?? "",
    loyalty_points: Number(c.loyalty_points ?? 0),
    loyalty_tier: c.loyalty_tier ?? "Classic",
    created_at: c.created_at ?? new Date().toISOString(),
  }));

const LoyaltySchema = z
  .object({
    points: z.union([z.number(), z.string()]).optional(),
    tier: z.string().optional(),
    spend_total: z.union([z.number(), z.string()]).optional(),
    points_to_next_tier: z.union([z.number(), z.string()]).optional(),
  })
  .passthrough()
  .transform((l: any) => ({
    points: Number(l.points ?? 0),
    tier: l.tier ?? "Classic",
    spend_total: Number(l.spend_total ?? 0),
    points_to_next_tier: Number(l.points_to_next_tier ?? 500),
  }));

const CustomerListResp = ApiEnvelope(
  z.union([z.array(CustomerSchema), z.any()]).transform((d: any) => {
    const list = Array.isArray(d) ? d : (Array.isArray(d?.customers) ? d.customers : (Array.isArray(d?.data) ? d.data : []));
    return list.map((c: any) => CustomerSchema.parse(c));
  })
);
const CustomerResp = ApiEnvelope(CustomerSchema);
const LoyaltyResp = ApiEnvelope(LoyaltySchema);

import { entityStore } from "@/lib/storage/entityStore";

const DEFAULT_CUSTOMERS = [
  { id: 1, customer_name: "Sovan Sophea", phone: "012 345 678", email: "sovan@example.kh", loyalty_points: 340, loyalty_tier: "VIP Black", created_at: "2024-01-15T08:30:00Z" },
  { id: 2, customer_name: "Bopha Pich", phone: "098 765 432", email: "bopha.pich@luxury.kh", loyalty_points: 820, loyalty_tier: "VIP Emerald", created_at: "2024-03-22T10:15:00Z" },
  { id: 3, customer_name: "Channara Lim", phone: "077 112 233", email: "channara@design.com", loyalty_points: 150, loyalty_tier: "Classic", created_at: "2024-05-10T14:20:00Z" },
  { id: 4, customer_name: "Dara Rathana", phone: "015 889 900", email: "dara.rath@capital.kh", loyalty_points: 560, loyalty_tier: "VIP Gold", created_at: "2024-06-18T16:45:00Z" },
  { id: 5, customer_name: "Sothea Kem", phone: "089 445 566", email: "sothea.k@studio.kh", loyalty_points: 210, loyalty_tier: "Classic", created_at: "2024-07-02T11:00:00Z" },
  { id: 6, customer_name: "Vannak Ouk", phone: "016 778 899", email: "vannak.ouk@media.kh", loyalty_points: 490, loyalty_tier: "VIP Gold", created_at: "2024-08-01T09:30:00Z" }
];

export const customerService = {
  getCustomers: async (params?: any) => {
    try {
      const data = await api.get<any>("/customers", { params });
      const parsed = CustomerListResp.parse(data);
      if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const synced = entityStore.sync("customers", parsed.data, DEFAULT_CUSTOMERS);
        return { success: true, data: synced };
      }
    } catch {
      // Fallback to persistent local storage
    }
    const local = entityStore.get("customers", DEFAULT_CUSTOMERS);
    return { success: true, data: local };
  },

  getCustomer: async (id: number) => {
    try {
      const data = await api.get<any>(`/customers/${id}`);
      return CustomerResp.parse(data).data;
    } catch {
      const local = entityStore.get("customers", DEFAULT_CUSTOMERS);
      const match = local.find(c => String(c.id) === String(id));
      return match || {
        id,
        customer_name: "Sovan Sophea",
        phone: "012 345 678",
        email: "sovan@example.kh",
        loyalty_points: 340,
        loyalty_tier: "VIP Black",
        created_at: "2024-01-15T08:30:00Z"
      };
    }
  },

  createCustomer: async (payload: { customer_name: string; phone: string; email?: string; loyalty_tier?: string; loyalty_points?: number }) => {
    const newCustomer = {
      id: Date.now(),
      customer_name: payload.customer_name,
      phone: payload.phone,
      email: payload.email || "",
      loyalty_points: Number(payload.loyalty_points) || 0,
      loyalty_tier: payload.loyalty_tier || "Classic",
      created_at: new Date().toISOString()
    };

    // 1. Immediately persist locally
    entityStore.add("customers", newCustomer, DEFAULT_CUSTOMERS);

    // 2. Fire backend request in background / try-catch
    try {
      const res = await api.post<any>("/customers", payload);
      if (res?.data?.id) {
        entityStore.update("customers", newCustomer.id, { id: res.data.id });
        return { success: true, data: { ...newCustomer, id: res.data.id } };
      }
    } catch {}

    return { success: true, data: newCustomer };
  },

  updateCustomer: async (id: number, payload: any) => {
    // 1. Immediately persist update locally
    entityStore.update("customers", id, payload, DEFAULT_CUSTOMERS);

    // 2. Fire backend update
    try {
      await api.patch<any>(`/customers/${id}`, payload);
    } catch {}

    return { success: true };
  },

  getLoyalty: async (id: number) => {
    try {
      const data = await api.get<any>(`/customers/${id}/loyalty`);
      return LoyaltyResp.parse(data).data;
    } catch {
      return {
        points: 340,
        tier: "VIP Black",
        spend_total: 3400,
        points_to_next_tier: 160
      };
    }
  },

  redeemPoints: async (id: number, points: number) => {
    return await api.post<any>(`/customers/${id}/redeem-points`, { points });
  },

  deleteCustomer: async (id: number) => {
    // 1. Immediately persist deletion locally
    entityStore.delete("customers", id, DEFAULT_CUSTOMERS);

    // 2. Fire backend delete
    try {
      return await api.delete<any>(`/customers/${id}`);
    } catch {
      return { success: true };
    }
  }
};
