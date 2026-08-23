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

export const marketingService = {
  // Promotions
  getPromotions: async () => {
    const data = await api.get<any>("/promotions");
    return PromoListResp.parse(data);
  },

  createPromotion: async (payload: any) => {
    return await api.post("/promotions", payload);
  },

  deletePromotion: async (id: number) => {
    return await api.delete(`/promotions/${id}`);
  },

  // Bundles
  getBundles: async () => {
    const data = await api.get<any>("/bundles");
    return BundleListResp.parse(data);
  },

  createBundle: async (payload: any) => {
    return await api.post("/bundles", payload);
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
