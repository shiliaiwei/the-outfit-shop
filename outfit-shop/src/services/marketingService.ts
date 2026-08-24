import { api, ApiEnvelope } from "@/lib/api/client";
import { z } from "zod";

const PromotionSchema = z.object({
  id: z.number(),
  title: z.string(),
  promo_code: z.string(),
  discount_type: z.enum(["PERCENTAGE", "FIXED"]),
  discount_value: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  is_active: z.boolean().optional(),
});

const BundleSchema = z.object({
  id: z.number(),
  bundle_name: z.string(),
  bundle_price: z.number(),
  items_count: z.number().optional(),
});

const BannerSchema = z.object({
  id: z.number(),
  title: z.string(),
  image_url: z.string(),
  placement: z.string(),
  is_active: z.boolean(),
  link_url: z.string().optional(),
});

const PromoListResp = ApiEnvelope(z.array(PromotionSchema));
const BundleListResp = ApiEnvelope(z.array(BundleSchema));
const BannerListResp = ApiEnvelope(z.array(BannerSchema));

import { entityStore } from "@/lib/storage/entityStore";

const DEFAULT_PROMOS = [
  {
    id: 1,
    title: "SUMMER CAPSULE RELEASE",
    promo_code: "SUMMER20",
    discount_type: "PERCENTAGE" as const,
    discount_value: 20,
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    is_active: true
  },
  {
    id: 2,
    title: "PRIVATE VIP APPRECIATION",
    promo_code: "VIP50OFF",
    discount_type: "FIXED" as const,
    discount_value: 50,
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    is_active: true
  }
];

const DEFAULT_BUNDLES = [
  {
    id: 1,
    bundle_name: "Heritage Linen 3-Piece Capsule",
    bundle_price: 340.00,
    items_count: 3
  },
  {
    id: 2,
    bundle_name: "Selvedge Denim & Overshirt Set",
    bundle_price: 460.00,
    items_count: 2
  }
];

export const marketingService = {
  // Promotions
  getPromotions: async () => {
    try {
      const data = await api.get<any>("/promotions");
      const parsed = PromoListResp.parse(data);
      if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const synced = entityStore.sync("marketing_promos", parsed.data, DEFAULT_PROMOS);
        return { success: true, data: synced };
      }
    } catch {}
    const local = entityStore.get("marketing_promos", DEFAULT_PROMOS);
    return { success: true, data: local };
  },

  createPromotion: async (payload: any) => {
    const newPromo = {
      id: Date.now(),
      ...payload
    };
    entityStore.add("marketing_promos", newPromo, DEFAULT_PROMOS);
    try {
      return await api.post("/promotions", payload);
    } catch {
      return { success: true, data: newPromo };
    }
  },

  updatePromotion: async (id: number, payload: any) => {
    entityStore.update("marketing_promos", id, payload, DEFAULT_PROMOS);
    try {
      return await api.patch(`/promotions/${id}`, payload);
    } catch {
      return { success: true };
    }
  },

  deletePromotion: async (id: number) => {
    entityStore.delete("marketing_promos", id, DEFAULT_PROMOS);
    try {
      return await api.delete(`/promotions/${id}`);
    } catch {
      return { success: true };
    }
  },

  // Bundles
  getBundles: async () => {
    try {
      const data = await api.get<any>("/bundles");
      const parsed = BundleListResp.parse(data);
      if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const synced = entityStore.sync("marketing_bundles", parsed.data, DEFAULT_BUNDLES);
        return { success: true, data: synced };
      }
    } catch {}
    const local = entityStore.get("marketing_bundles", DEFAULT_BUNDLES);
    return { success: true, data: local };
  },

  createBundle: async (payload: any) => {
    const newBundle = {
      id: Date.now(),
      ...payload
    };
    entityStore.add("marketing_bundles", newBundle, DEFAULT_BUNDLES);
    try {
      return await api.post("/bundles", payload);
    } catch {
      return { success: true, data: newBundle };
    }
  },

  updateBundle: async (id: number, payload: any) => {
    entityStore.update("marketing_bundles", id, payload, DEFAULT_BUNDLES);
    try {
      return await api.patch(`/bundles/${id}`, payload);
    } catch {
      return { success: true };
    }
  },

  deleteBundle: async (id: number) => {
    entityStore.delete("marketing_bundles", id, DEFAULT_BUNDLES);
    try {
      return await api.delete(`/bundles/${id}`);
    } catch {
      return { success: true };
    }
  },

  // Banners
  getBanners: async () => {
    const data = await api.get<any>("/marketing/banners");
    return BannerListResp.parse(data);
  },

  createBanner: async (payload: any) => {
    return await api.post("/marketing/banners", payload);
  },

  deleteBanner: async (id: number) => {
    return await api.delete(`/marketing/banners/${id}`);
  }
};
